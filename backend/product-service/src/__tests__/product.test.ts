import request from "supertest";
import app from "../app";
import { prisma } from "../../../shared/database";
import { generateAccessToken } from "../../../shared/auth/jwt";

describe("Product Service & Critical Real Admin -> DB -> Customer Sync Test (Pass 2)", () => {
  jest.setTimeout(30000);

  const adminUser = {
    id: "00000000-0000-0000-0000-000000000admin",
    email: `admin_prod_${Date.now()}@example.com`,
    role: "ADMIN" as const,
  };

  const customerUser = {
    id: "00000000-0000-0000-0000-0000000cust",
    email: `cust_prod_${Date.now()}@example.com`,
    role: "CUSTOMER" as const,
  };

  let adminToken: string;
  let customerToken: string;
  let createdProductId: string;
  const testSyncSlug = `pass-2-sync-shirt-${Date.now()}`;

  beforeAll(async () => {
    adminToken = generateAccessToken({ userId: adminUser.id, email: adminUser.email, role: "ADMIN" });
    customerToken = generateAccessToken({ userId: customerUser.id, email: customerUser.email, role: "CUSTOMER" });
  });

  afterAll(async () => {
    if (createdProductId) {
      await prisma.productVariant.deleteMany({ where: { productId: createdProductId } });
      await prisma.productImage.deleteMany({ where: { productId: createdProductId } });
      await prisma.product.deleteMany({ where: { id: createdProductId } });
    }
    await prisma.$disconnect();
  });

  describe("Public Categories & Catalog API", () => {
    it("should fetch categories list", async () => {
      const res = await request(app).get("/products/categories");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.categories)).toBe(true);
    });

    it("should fetch products catalog with pagination", async () => {
      const res = await request(app).get("/products?page=1&limit=10");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("products");
      expect(res.body).toHaveProperty("pagination");
    });
  });

  describe("Security: Role Authorization", () => {
    it("REJECT: CUSTOMER attempting to create product (403 Forbidden)", async () => {
      const res = await request(app)
        .post("/admin/products")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          name: "Illegal Product",
          description: "Testing role check",
          price: 500,
          audience: "MEN",
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe("CRITICAL MANDATORY REAL-DATA SYNC WORKFLOW TEST", () => {
    it("STEP 1 to 5: ADMIN creates product -> DB -> Customer listing contains product", async () => {
      // ADMIN creates product
      const res = await request(app)
        .post("/admin/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Pass 2 Sync Shirt",
          slug: testSyncSlug,
          description: "Sync test shirt",
          price: 999,
          audience: "UNISEX",
          isActive: true,
          variants: [
            { sku: `SYNC-M-${Date.now()}`, size: "M", color: "Black", stockQuantity: 25 },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(Number(res.body.product.price)).toBe(999);
      createdProductId = res.body.product.id;

      // Verify product in PostgreSQL directly
      const dbProduct = await prisma.product.findUnique({ where: { id: createdProductId } });
      expect(dbProduct).not.toBeNull();
      expect(Number(dbProduct!.price)).toBe(999);

      // Customer requests product listing
      const customerListing = await request(app).get(`/products?q=Pass%202%20Sync%20Shirt`);
      expect(customerListing.status).toBe(200);
      const found = customerListing.body.products.find((p: any) => p.id === createdProductId);
      expect(found).toBeDefined();
    });

    it("STEP 6 to 9: ADMIN updates price (999 -> 1099) -> Cache invalidation -> Customer receives 1099", async () => {
      // ADMIN updates price to 1099
      const updateRes = await request(app)
        .patch(`/admin/products/${createdProductId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ price: 1099 });

      expect(updateRes.status).toBe(200);
      expect(Number(updateRes.body.product.price)).toBe(1099);

      // Customer requests product details
      const customerDetails = await request(app).get(`/products/${testSyncSlug}`);
      expect(customerDetails.status).toBe(200);
      expect(Number(customerDetails.body.product.price)).toBe(1099);
      expect(Number(customerDetails.body.product.price)).not.toBe(999);
    });

    it("STEP 10 to 12: ADMIN deactivates product -> Customer details returns 404 (Not Found)", async () => {
      // ADMIN deactivates product
      const deactivateRes = await request(app)
        .delete(`/admin/products/${createdProductId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(deactivateRes.status).toBe(200);

      // Customer requests product details
      const customerDetails = await request(app).get(`/products/${testSyncSlug}`);
      expect(customerDetails.status).toBe(404);
    });
  });
});
