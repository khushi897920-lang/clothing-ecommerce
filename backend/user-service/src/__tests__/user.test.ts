import request from "supertest";
import app from "../app";
import { prisma } from "../../../shared/database";
import { generateAccessToken } from "../../../shared/auth/jwt";

describe("User Service Integration & Ownership Security Tests (Pass 2)", () => {
  jest.setTimeout(30000);

  const customerA = {
    id: "00000000-0000-0000-0000-0000000000a1",
    firstName: "Alice",
    lastName: "Customer",
    email: `alice_${Date.now()}@example.com`,
    passwordHash: "dummyhash",
    role: "CUSTOMER" as const,
    emailVerified: true,
    isActive: true,
  };

  const customerB = {
    id: "00000000-0000-0000-0000-0000000000b2",
    firstName: "Bob",
    lastName: "Customer",
    email: `bob_${Date.now()}@example.com`,
    passwordHash: "dummyhash",
    role: "CUSTOMER" as const,
    emailVerified: true,
    isActive: true,
  };

  let tokenA: string;
  let tokenB: string;
  let addressIdA: string;
  let addressIdB: string;
  let testProductId: string;

  beforeAll(async () => {
    await prisma.user.createMany({
      data: [customerA, customerB],
    });

    tokenA = generateAccessToken({ userId: customerA.id, email: customerA.email, role: "CUSTOMER" });
    tokenB = generateAccessToken({ userId: customerB.id, email: customerB.email, role: "CUSTOMER" });

    // Find a valid product from database for wishlist tests
    const p = await prisma.product.findFirst({ where: { isActive: true } });
    if (p) testProductId = p.id;
  });

  afterAll(async () => {
    await prisma.wishlistItem.deleteMany({ where: { userId: { in: [customerA.id, customerB.id] } } });
    await prisma.address.deleteMany({ where: { userId: { in: [customerA.id, customerB.id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [customerA.id, customerB.id] } } });
    await prisma.$disconnect();
  });

  describe("GET & PATCH /users/me Profile", () => {
    it("should fetch customer profile for authenticated user", async () => {
      const res = await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(customerA.email);
    });

    it("should update customer profile fields", async () => {
      const res = await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ firstName: "AliceUpdated", phone: "+919876543210" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.firstName).toBe("AliceUpdated");
      expect(res.body.user.phone).toBe("+919876543210");
    });
  });

  describe("Address Book & Ownership Security", () => {
    it("should create address for Customer A", async () => {
      const res = await request(app)
        .post("/users/me/addresses")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          fullName: "Alice Customer",
          phone: "+919876543210",
          addressLine1: "123 Fashion Street",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
          isDefault: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.address.isDefault).toBe(true);
      addressIdA = res.body.address.id;
    });

    it("should create address for Customer B", async () => {
      const res = await request(app)
        .post("/users/me/addresses")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          fullName: "Bob Customer",
          phone: "+919876543211",
          addressLine1: "456 Style Avenue",
          city: "Delhi",
          state: "Delhi",
          postalCode: "110001",
        });

      expect(res.status).toBe(201);
      addressIdB = res.body.address.id;
    });

    it("should allow Customer A to update their own address", async () => {
      const res = await request(app)
        .patch(`/users/me/addresses/${addressIdA}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ addressLine1: "123 Updated Street" });

      expect(res.status).toBe(200);
      expect(res.body.address.addressLine1).toBe("123 Updated Street");
    });

    it("REJECT: Customer A attempting to modify Customer B address (403 Forbidden)", async () => {
      const res = await request(app)
        .patch(`/users/me/addresses/${addressIdB}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ addressLine1: "Hacked Street" });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("REJECT: Customer A attempting to delete Customer B address (403 Forbidden)", async () => {
      const res = await request(app)
        .delete(`/users/me/addresses/${addressIdB}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Wishlist API", () => {
    it("should add product to Customer A wishlist", async () => {
      if (!testProductId) return;
      const res = await request(app)
        .post("/users/me/wishlist")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ productId: testProductId });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("should reject duplicate wishlist entry (409 Conflict)", async () => {
      if (!testProductId) return;
      const res = await request(app)
        .post("/users/me/wishlist")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ productId: testProductId });

      expect(res.status).toBe(409);
    });

    it("should list Customer A wishlist items", async () => {
      const res = await request(app)
        .get("/users/me/wishlist")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBeGreaterThan(0);
    });

    it("should remove item from Customer A wishlist", async () => {
      if (!testProductId) return;
      const res = await request(app)
        .delete(`/users/me/wishlist/${testProductId}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
    });
  });
});
