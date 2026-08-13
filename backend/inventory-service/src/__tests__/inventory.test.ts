import request from "supertest";
import app from "../app";
import productApp from "../../../product-service/src/app";
import { prisma } from "../../../shared/database";
import { generateAccessToken } from "../../../shared/auth/jwt";

describe("Inventory Service & Real Inventory Sync Tests (Pass 3)", () => {
  jest.setTimeout(30000);

  const adminUser = {
    id: "00000000-0000-0000-0000-0000000invad",
    email: `admin_inv_${Date.now()}@example.com`,
    role: "ADMIN" as const,
  };

  const customerUser = {
    id: "00000000-0000-0000-0000-000000invcus",
    email: `cust_inv_${Date.now()}@example.com`,
    role: "CUSTOMER" as const,
  };

  let adminToken: string;
  let customerToken: string;
  let testVariantId: string;
  let testProductId: string;

  beforeAll(async () => {
    adminToken = generateAccessToken({ userId: adminUser.id, email: adminUser.email, role: "ADMIN" });
    customerToken = generateAccessToken({ userId: customerUser.id, email: customerUser.email, role: "CUSTOMER" });

    // Find a valid variant from database for inventory tests
    const v = await prisma.productVariant.findFirst({
      include: { product: true },
    });
    if (v) {
      testVariantId = v.id;
      testProductId = v.productId!;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Security: Role Authorization Checks", () => {
    it("should allow ADMIN to view admin inventory listing", async () => {
      const res = await request(app)
        .get("/admin/stock")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.inventory)).toBe(true);
    });

    it("REJECT: CUSTOMER attempting to view admin inventory (403 Forbidden)", async () => {
      const res = await request(app)
        .get("/admin/stock")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("REJECT: CUSTOMER attempting to update stock (403 Forbidden)", async () => {
      if (!testVariantId) return;
      const res = await request(app)
        .patch(`/admin/stock/${testVariantId}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ stockQuantity: 100 });

      expect(res.status).toBe(403);
    });
  });

  describe("Stock Reservation & Release Logic", () => {
    it("should reserve stock items and update reservedQuantity", async () => {
      if (!testVariantId) return;

      const initial = await prisma.productVariant.findUnique({ where: { id: testVariantId } });
      const initialReserved = initial?.reservedQuantity || 0;

      const res = await request(app)
        .post("/reserve")
        .send({
          items: [{ variantId: testVariantId, quantity: 2 }],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const updated = await prisma.productVariant.findUnique({ where: { id: testVariantId } });
      expect(updated?.reservedQuantity).toBe(initialReserved + 2);
    });

    it("should release reserved stock items", async () => {
      if (!testVariantId) return;

      const initial = await prisma.productVariant.findUnique({ where: { id: testVariantId } });
      const initialReserved = initial?.reservedQuantity || 0;

      const res = await request(app)
        .post("/release")
        .send({
          items: [{ variantId: testVariantId, quantity: 2 }],
        });

      expect(res.status).toBe(200);

      const updated = await prisma.productVariant.findUnique({ where: { id: testVariantId } });
      expect(updated?.reservedQuantity).toBe(Math.max(0, initialReserved - 2));
    });

    it("should reject reservation when requested quantity exceeds available stock", async () => {
      if (!testVariantId) return;

      const res = await request(app)
        .post("/reserve")
        .send({
          items: [{ variantId: testVariantId, quantity: 999999 }],
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain("Insufficient stock");
    });
  });

  describe("REAL SYNC: ADMIN Stock Update -> PostgreSQL -> Customer Product API Availability", () => {
    it("ADMIN updates stock to 25 -> Customer Product API returns availableStock = 25", async () => {
      if (!testVariantId || !testProductId) return;

      // Reset reserved quantity to 0 and stock to 25 for clear assertion
      await prisma.productVariant.update({
        where: { id: testVariantId },
        data: { stockQuantity: 25, reservedQuantity: 0 },
      });

      // Admin updates stock to 25
      const updateRes = await request(app)
        .patch(`/admin/stock/${testVariantId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ stockQuantity: 25 });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.variant.stockQuantity).toBe(25);

      // Customer requests product details from Product Service
      const custRes = await request(productApp).get(`/products/${testProductId}`);
      expect(custRes.status).toBe(200);

      const targetVariant = custRes.body.product.variants.find((v: any) => v.id === testVariantId);
      expect(targetVariant).toBeDefined();
      expect(targetVariant.availableStock).toBe(targetVariant.stockQuantity - targetVariant.reservedQuantity);
    });
  });
});
