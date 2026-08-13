import request from "supertest";
import app from "../app";
import orderApp from "../../../order-service/src/app";
import { prisma } from "../../../shared/database";
import { generateAccessToken } from "../../../shared/auth/jwt";

describe("Notification Service & RabbitMQ Event Sync Tests (Pass 4)", () => {
  jest.setTimeout(30000);

  const customerA = {
    id: "00000000-0000-0000-0000-000000000ea1",
    firstName: "NotifCustomerA",
    lastName: "Test",
    email: `notif_custA_${Date.now()}@example.com`,
    passwordHash: "dummyhash",
    role: "CUSTOMER" as const,
    emailVerified: true,
    isActive: true,
  };

  const customerB = {
    id: "00000000-0000-0000-0000-000000000eb2",
    firstName: "NotifCustomerB",
    lastName: "Test",
    email: `notif_custB_${Date.now()}@example.com`,
    passwordHash: "dummyhash",
    role: "CUSTOMER" as const,
    emailVerified: true,
    isActive: true,
  };

  const adminUser = {
    id: "00000000-0000-0000-0000-000000000ead",
    firstName: "NotifAdmin",
    lastName: "Test",
    email: `notif_admin_${Date.now()}@example.com`,
    passwordHash: "dummyhash",
    role: "ADMIN" as const,
    emailVerified: true,
    isActive: true,
  };

  let tokenA: string;
  let tokenB: string;
  let adminToken: string;
  let createdNotifId: string;
  let createdOrderId: string;

  beforeAll(async () => {
    await prisma.user.createMany({
      data: [customerA, customerB, adminUser],
    });

    tokenA = generateAccessToken({ userId: customerA.id, email: customerA.email, role: "CUSTOMER" });
    tokenB = generateAccessToken({ userId: customerB.id, email: customerB.email, role: "CUSTOMER" });
    adminToken = generateAccessToken({ userId: adminUser.id, email: adminUser.email, role: "ADMIN" });

    // Seed test notification for Customer A
    const n = await prisma.notification.create({
      data: {
        userId: customerA.id,
        type: "ORDER_CONFIRMED",
        title: "Test Order Confirmation",
        message: "Your test order has been confirmed.",
        isRead: false,
      },
    });
    createdNotifId = n.id;

    // Seed test order for real sync test
    const o = await prisma.order.create({
      data: {
        orderNumber: `YUGEN-NOTIF-${Date.now()}`,
        userId: customerA.id,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        subtotal: 999,
        totalAmount: 999,
        shippingName: "Notif Customer A",
        shippingPhone: "+919876543210",
        shippingAddress1: "456 Event Street",
        shippingCity: "Delhi",
        shippingState: "Delhi",
        shippingPostalCode: "110001",
        shippingCountry: "India",
      },
    });
    createdOrderId = o.id;
  });

  afterAll(async () => {
    if (createdOrderId) {
      await prisma.order.deleteMany({ where: { id: createdOrderId } });
    }
    await prisma.notification.deleteMany({ where: { userId: { in: [customerA.id, customerB.id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [customerA.id, customerB.id, adminUser.id] } } });
    await prisma.$disconnect();
  });

  describe("Customer Notifications API", () => {
    it("should fetch notifications list for Customer A", async () => {
      const res = await request(app)
        .get("/notifications")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.notifications.length).toBeGreaterThanOrEqual(1);
      expect(res.body.unreadCount).toBeGreaterThanOrEqual(1);
    });

    it("REJECT: Customer B attempting to view Customer A's notification (403 Forbidden)", async () => {
      const res = await request(app)
        .get(`/notifications/${createdNotifId}`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(res.status).toBe(403);
    });

    it("should mark notification as read", async () => {
      const res = await request(app)
        .patch(`/notifications/${createdNotifId}/read`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.notification.isRead).toBe(true);
    });
  });

  describe("MANDATORY REAL-SYNC TEST: Admin Order Status Change -> RabbitMQ -> Customer Notification API", () => {
    it("Admin updates status to SHIPPED -> RabbitMQ publishes ShipmentUpdated -> Notification Service persists notification -> Customer sees ORDER_SHIPPED notification", async () => {
      if (!createdOrderId) return;

      // 1. Admin updates status to PACKED then SHIPPED in Order Service
      await request(orderApp)
        .patch(`/admin/orders/${createdOrderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "PACKED" });

      const updateRes = await request(orderApp)
        .patch(`/admin/orders/${createdOrderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "SHIPPED" });

      expect(updateRes.status).toBe(200);

      // Wait 800ms for async event processing over Docker RabbitMQ broker
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 2. Customer A fetches notifications
      const notifRes = await request(app)
        .get("/notifications")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(notifRes.status).toBe(200);
      const found = notifRes.body.notifications.find((n: any) => n.message.includes("SHIPPED"));
      expect(found).toBeDefined();
      expect(found.title).toContain("SHIPPED");
    });
  });
});
