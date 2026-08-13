import request from "supertest";
import app from "../app";
import { prisma } from "../../../shared/database";
import { generateAccessToken } from "../../../shared/auth/jwt";

describe("Payment Service & Stripe Webhook Tests (Pass 4)", () => {
  jest.setTimeout(30000);

  const customerUser = {
    id: "00000000-0000-0000-0000-000000000fa1",
    firstName: "PaymentCustomer",
    lastName: "Test",
    email: `pay_cust_${Date.now()}@example.com`,
    passwordHash: "dummyhash",
    role: "CUSTOMER" as const,
    emailVerified: true,
    isActive: true,
  };

  const adminUser = {
    id: "00000000-0000-0000-0000-000000000fa2",
    firstName: "PaymentAdmin",
    lastName: "Test",
    email: `pay_admin_${Date.now()}@example.com`,
    passwordHash: "dummyhash",
    role: "ADMIN" as const,
    emailVerified: true,
    isActive: true,
  };

  let customerToken: string;
  let adminToken: string;
  let testOrderId: string;
  let testPaymentId: string;

  beforeAll(async () => {
    await prisma.user.createMany({
      data: [customerUser, adminUser],
    });

    customerToken = generateAccessToken({ userId: customerUser.id, email: customerUser.email, role: "CUSTOMER" });
    adminToken = generateAccessToken({ userId: adminUser.id, email: adminUser.email, role: "ADMIN" });

    // Create test order in DB
    const order = await prisma.order.create({
      data: {
        orderNumber: `YUGEN-PAY-${Date.now()}`,
        userId: customerUser.id,
        status: "PENDING",
        paymentStatus: "PENDING",
        subtotal: 1200,
        shippingAmount: 150,
        discountAmount: 0,
        totalAmount: 1350,
        shippingName: "Payment Customer",
        shippingPhone: "+919876543210",
        shippingAddress1: "123 Stripe Way",
        shippingCity: "Mumbai",
        shippingState: "Maharashtra",
        shippingPostalCode: "400001",
        shippingCountry: "India",
      },
    });
    testOrderId = order.id;
  });

  afterAll(async () => {
    if (testPaymentId) {
      await prisma.refund.deleteMany({ where: { paymentId: testPaymentId } });
      await prisma.payment.deleteMany({ where: { id: testPaymentId } });
    }
    if (testOrderId) {
      await prisma.order.deleteMany({ where: { id: testOrderId } });
    }
    await prisma.user.deleteMany({ where: { id: { in: [customerUser.id, adminUser.id] } } });
    await prisma.$disconnect();
  });

  describe("Payment Creation", () => {
    it("should create Stripe PaymentIntent record for customer order", async () => {
      const res = await request(app)
        .post("/payments/create")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ orderId: testOrderId });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.paymentId).toBeDefined();
      expect(res.body.clientSecret).toBeDefined();
      expect(res.body.amount).toBe(1350);

      testPaymentId = res.body.paymentId;
    });

    it("REJECT: Customer attempting to pay for another user's order (403 Forbidden)", async () => {
      const otherToken = generateAccessToken({ userId: "00000000-0000-0000-0000-0000000other", email: "other@ex.com", role: "CUSTOMER" });
      const res = await request(app)
        .post("/payments/create")
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ orderId: testOrderId });

      expect(res.status).toBe(403);
    });
  });

  describe("Stripe Webhook & Idempotency", () => {
    it("should process Stripe webhook payment_intent.succeeded and update PostgreSQL", async () => {
      const webhookPayload = {
        id: `evt_test_succ_${Date.now()}`,
        type: "payment_intent.succeeded",
        data: {
          object: {
            id: `pi_test_${Date.now()}`,
            paymentId: testPaymentId,
            orderId: testOrderId,
            amount: 135000,
            currency: "inr",
          },
        },
      };

      const res = await request(app)
        .post("/payments/webhook")
        .send(webhookPayload);

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);

      // Verify PostgreSQL status updated
      const updatedOrder = await prisma.order.findUnique({ where: { id: testOrderId } });
      expect(updatedOrder?.paymentStatus).toBe("PAID");
      expect(updatedOrder?.status).toBe("CONFIRMED");

      const updatedPayment = await prisma.payment.findUnique({ where: { id: testPaymentId } });
      expect(updatedPayment?.status).toBe("SUCCESS");
    });

    it("IDEMPOTENCY TEST: Duplicate webhook event should be safely ignored", async () => {
      const dupId = `evt_dup_${Date.now()}`;
      const webhookPayload = {
        id: dupId,
        type: "payment_intent.succeeded",
        data: {
          object: {
            paymentId: testPaymentId,
            orderId: testOrderId,
          },
        },
      };

      // First delivery
      const res1 = await request(app).post("/payments/webhook").send(webhookPayload);
      expect(res1.status).toBe(200);

      // Second delivery (duplicate event)
      const res2 = await request(app).post("/payments/webhook").send(webhookPayload);
      expect(res2.status).toBe(200);
      expect(res2.body.duplicate).toBe(true);
    });
  });

  describe("Refund Processing", () => {
    it("should process refund for paid order", async () => {
      const res = await request(app)
        .post(`/payments/${testPaymentId}/refund`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ amount: 1350, reason: "Customer requested return" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.refund.status).toBe("SUCCESS");

      // Verify Order paymentStatus updated to REFUNDED in DB
      const updatedOrder = await prisma.order.findUnique({ where: { id: testOrderId } });
      expect(updatedOrder?.paymentStatus).toBe("REFUNDED");
    });

    it("IDEMPOTENCY TEST: Duplicate refund request returns existing refund", async () => {
      const res = await request(app)
        .post(`/payments/${testPaymentId}/refund`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ amount: 1350 });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain("already processed");
    });
  });
});
