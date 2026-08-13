import request from "supertest";
import app from "../app";
import { prisma } from "../../../shared/database";
import { generateAccessToken } from "../../../shared/auth/jwt";

describe("Order Service, Cart, Checkout & Real Order Sync Tests (Pass 3)", () => {
  jest.setTimeout(30000);

  const customerA = {
    id: "00000000-0000-0000-0000-000000000ca1",
    firstName: "OrderCustomerA",
    lastName: "Test",
    email: `ord_custA_${Date.now()}@example.com`,
    passwordHash: "dummyhash",
    role: "CUSTOMER" as const,
    emailVerified: true,
    isActive: true,
  };

  const customerB = {
    id: "00000000-0000-0000-0000-000000000cb2",
    firstName: "OrderCustomerB",
    lastName: "Test",
    email: `ord_custB_${Date.now()}@example.com`,
    passwordHash: "dummyhash",
    role: "CUSTOMER" as const,
    emailVerified: true,
    isActive: true,
  };

  const adminUser = {
    id: "00000000-0000-0000-0000-00000000ad31",
    firstName: "OrderAdmin",
    lastName: "Test",
    email: `ord_admin_${Date.now()}@example.com`,
    passwordHash: "dummyhash",
    role: "ADMIN" as const,
    emailVerified: true,
    isActive: true,
  };

  let tokenA: string;
  let tokenB: string;
  let adminToken: string;
  let testVariantId: string;
  let testAddressId: string;
  let createdOrderId: string;

  beforeAll(async () => {
    await prisma.user.createMany({
      data: [customerA, customerB, adminUser],
    });

    tokenA = generateAccessToken({ userId: customerA.id, email: customerA.email, role: "CUSTOMER" });
    tokenB = generateAccessToken({ userId: customerB.id, email: customerB.email, role: "CUSTOMER" });
    adminToken = generateAccessToken({ userId: adminUser.id, email: adminUser.email, role: "ADMIN" });

    // Seed test address for Customer A
    const addr = await prisma.address.create({
      data: {
        userId: customerA.id,
        fullName: "OrderCustomerA Test",
        phone: "+919876543210",
        addressLine1: "789 Checkout Lane",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "560001",
        isDefault: true,
      },
    });
    testAddressId = addr.id;

    // Find active variant with stock
    const v = await prisma.productVariant.findFirst({
      where: {
        product: { isActive: true },
      },
    });
    if (v) {
      testVariantId = v.id;
      // Ensure stock is sufficient
      await prisma.productVariant.update({
        where: { id: v.id },
        data: { stockQuantity: 100, reservedQuantity: 0 },
      });
    }
  });

  afterAll(async () => {
    if (createdOrderId) {
      await prisma.orderItem.deleteMany({ where: { orderId: createdOrderId } });
      await prisma.order.deleteMany({ where: { id: createdOrderId } });
    }
    await prisma.address.deleteMany({ where: { userId: customerA.id } });
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({ where: { userId: { in: [customerA.id, customerB.id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [customerA.id, customerB.id, adminUser.id] } } });
    await prisma.$disconnect();
  });

  describe("Cart API & Ownership Protection", () => {
    it("should fetch empty cart for Customer A", async () => {
      const res = await request(app)
        .get("/cart")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.cart.items.length).toBe(0);
    });

    it("should add item to Customer A cart", async () => {
      if (!testVariantId) return;

      const res = await request(app)
        .post("/cart/items")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ variantId: testVariantId, quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.cart.items.length).toBe(1);
      expect(res.body.cart.totalItems).toBe(2);
    });

    it("REJECT: Customer B attempting to clear Customer A cart (Ownership security)", async () => {
      const cartA = await prisma.cart.findFirst({ where: { userId: customerA.id, status: "ACTIVE" } });
      const itemA = await prisma.cartItem.findFirst({ where: { cartId: cartA?.id } });
      if (!itemA) return;

      const res = await request(app)
        .delete(`/cart/items/${itemA.id}`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(res.status).toBe(403);
    });
  });

  describe("Checkout & Order Creation", () => {
    it("should checkout Customer A cart and create Order", async () => {
      const res = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ addressId: testAddressId });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.order.status).toBe("PENDING");
      expect(res.body.order.items.length).toBe(1);
      expect(res.body.order.shippingName).toBe("OrderCustomerA Test");

      createdOrderId = res.body.order.id;

      // Verify active cart status converted
      const cartA = await prisma.cart.findFirst({ where: { userId: customerA.id, status: "ACTIVE" } });
      expect(cartA).toBeNull();
    });
  });

  describe("MANDATORY REAL-SYNC TESTS: Customer Order -> Admin Dashboard -> Status Transitions", () => {
    it("REAL SYNC 1: Customer order appears in Admin orders listing", async () => {
      if (!createdOrderId) return;

      const res = await request(app)
        .get("/admin/orders")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      const found = res.body.orders.find((o: any) => o.id === createdOrderId);
      expect(found).toBeDefined();
      expect(found.shippingName).toBe("OrderCustomerA Test");
    });

    it("REAL SYNC 2: Admin updates status (PENDING -> CONFIRMED -> PACKED) -> Customer sees PACKED", async () => {
      if (!createdOrderId) return;

      // 1. Admin transitions PENDING -> CONFIRMED
      const res1 = await request(app)
        .patch(`/admin/orders/${createdOrderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "CONFIRMED" });

      expect(res1.status).toBe(200);
      expect(res1.body.order.status).toBe("CONFIRMED");

      // 2. Admin transitions CONFIRMED -> PACKED
      const res2 = await request(app)
        .patch(`/admin/orders/${createdOrderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "PACKED" });

      expect(res2.status).toBe(200);

      // 3. Customer requests order details
      const customerRes = await request(app)
        .get(`/orders/track/${createdOrderId}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(customerRes.status).toBe(200);
      expect(customerRes.body.order.status).toBe("PACKED");
    });

    it("State Machine Enforcement: Rejects invalid transition (PACKED -> PENDING) with 400", async () => {
      if (!createdOrderId) return;

      const res = await request(app)
        .patch(`/admin/orders/${createdOrderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "PENDING" });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Invalid status transition");
    });

    it("Security: CUSTOMER rejected from admin order endpoints (403 Forbidden)", async () => {
      const res = await request(app)
        .get("/admin/orders")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(403);
    });
  });
});
