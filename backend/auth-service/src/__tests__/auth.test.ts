import request from "supertest";
import app from "../app";
import { prisma } from "../../../shared/database";
import { hashPassword } from "../../../shared/utils/hash";

describe("Auth Service Integration Tests (Pass 1)", () => {
  jest.setTimeout(30000);

  const testCustomer = {
    firstName: "Test",
    lastName: "Customer",
    email: `customer_${Date.now()}@example.com`,
    password: "Password123!",
  };

  const testAdmin = {
    firstName: "Admin",
    lastName: "User",
    email: `admin_${Date.now()}@example.com`,
    password: "AdminPassword123!",
  };

  let customerAccessToken: string;
  let customerRefreshToken: string;
  let adminAccessToken: string;
  let rawVerificationToken: string;
  let rawResetToken: string;

  beforeAll(async () => {
    // Seed test Admin user
    const adminHashed = await hashPassword(testAdmin.password);
    await prisma.user.create({
      data: {
        firstName: testAdmin.firstName,
        lastName: testAdmin.lastName,
        email: testAdmin.email,
        passwordHash: adminHashed,
        role: "ADMIN",
        emailVerified: true,
        isActive: true,
      },
    });
  });

  afterAll(async () => {
    // Cleanup test users and tokens
    const testUsers = await prisma.user.findMany({
      where: { email: { in: [testCustomer.email, testAdmin.email] } },
      select: { id: true },
    });
    const ids = testUsers.map((u) => u.id);

    if (ids.length > 0) {
      await prisma.refreshToken.deleteMany({ where: { userId: { in: ids } } });
      await prisma.emailVerificationToken.deleteMany({ where: { userId: { in: ids } } });
      await prisma.passwordResetToken.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    }

    await prisma.$disconnect();
  });

  describe("POST /auth/register", () => {
    it("should register a new CUSTOMER user successfully", async () => {
      const res = await request(app).post("/auth/register").send(testCustomer);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user.role).toBe("CUSTOMER");
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("verificationToken");

      rawVerificationToken = res.body.verificationToken;
    });

    it("should reject registration with duplicate email", async () => {
      const res = await request(app).post("/auth/register").send(testCustomer);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("already registered");
    });
  });

  describe("POST /auth/login", () => {
    it("should login CUSTOMER user with valid credentials", async () => {
      const res = await request(app).post("/auth/login").send({
        email: testCustomer.email,
        password: testCustomer.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body.user.role).toBe("CUSTOMER");

      customerAccessToken = res.body.accessToken;
      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();
      customerRefreshToken = cookies[0].split(";")[0].split("=")[1];
    });

    it("should login ADMIN user with valid credentials", async () => {
      const res = await request(app).post("/auth/login").send({
        email: testAdmin.email,
        password: testAdmin.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe("ADMIN");

      adminAccessToken = res.body.accessToken;
    });

    it("should reject login with invalid password", async () => {
      const res = await request(app).post("/auth/login").send({
        email: testCustomer.email,
        password: "WrongPassword123!",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /auth/me", () => {
    it("should return current user profile for authenticated user", async () => {
      const res = await request(app)
        .get("/auth/me")
        .set("Authorization", `Bearer ${customerAccessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(testCustomer.email);
    });

    it("should reject unauthenticated request", async () => {
      const res = await request(app).get("/auth/me");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Role Authorization Middleware", () => {
    it("should allow ADMIN to access /auth/admin-only", async () => {
      const res = await request(app)
        .get("/auth/admin-only")
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Welcome Admin");
    });

    it("should reject CUSTOMER from accessing /auth/admin-only (403)", async () => {
      const res = await request(app)
        .get("/auth/admin-only")
        .set("Authorization", `Bearer ${customerAccessToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /auth/refresh & /auth/logout", () => {
    it("should refresh access token using valid refresh token", async () => {
      const res = await request(app)
        .post("/auth/refresh")
        .set("Cookie", [`refreshToken=${customerRefreshToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("accessToken");
    });

    it("should logout user and revoke refresh token", async () => {
      const res = await request(app)
        .post("/auth/logout")
        .set("Cookie", [`refreshToken=${customerRefreshToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /auth/verify-email", () => {
    it("should verify email with valid token", async () => {
      const res = await request(app).post("/auth/verify-email").send({
        token: rawVerificationToken,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /auth/forgot-password & /auth/reset-password", () => {
    it("should generate reset token via forgot-password", async () => {
      const res = await request(app).post("/auth/forgot-password").send({
        email: testCustomer.email,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("resetToken");

      rawResetToken = res.body.resetToken;
    });

    it("should reset password using valid reset token", async () => {
      const res = await request(app).post("/auth/reset-password").send({
        token: rawResetToken,
        newPassword: "NewSecretPassword123!",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
