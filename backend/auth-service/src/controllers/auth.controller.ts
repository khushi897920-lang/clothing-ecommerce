import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../shared/database";
import {
  hashPassword,
  verifyPassword,
  generateCryptoToken,
  hashToken,
} from "../../../shared/utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../shared/auth/jwt";
import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  NotFoundError,
} from "../../../shared/errors/AppError";
import { AuthenticatedRequest } from "../../../shared/auth/middleware";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      throw new ValidationError("First name, last name, email and password are required");
    }

    if (password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters long");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictError("Email is already registered");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        passwordHash: hashedPassword,
        role: "CUSTOMER",
        emailVerified: false,
        isActive: true,
      },
    });

    // Create Email Verification Token
    const rawVerificationToken = generateCryptoToken();
    const tokenHash = hashToken(rawVerificationToken);
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      },
    });

    // Tokens
    const tokenPayload = { userId: user.id, email: user.email, role: user.role!, nonce: generateCryptoToken() };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token hash
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      verificationToken: rawVerificationToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new ForbiddenError("Account is inactive. Please contact support.");
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role!, nonce: generateCryptoToken() };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) {
      throw new UnauthorizedError("Refresh token is required");
    }

    const payload = verifyRefreshToken(token);
    if (!payload) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const hashed = hashToken(token);
    const dbToken = await prisma.refreshToken.findUnique({ where: { tokenHash: hashed } });

    if (!dbToken || dbToken.revokedAt || dbToken.expiresAt < new Date()) {
      throw new UnauthorizedError("Revoked or expired refresh token");
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.isActive) {
      throw new ForbiddenError("User is inactive or deleted");
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role! };
    const newAccessToken = generateAccessToken(tokenPayload);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (token) {
      const hashed = hashToken(token);
      await prisma.refreshToken.updateMany({
        where: { tokenHash: hashed },
        data: { revokedAt: new Date() },
      });
    }

    res.clearCookie("refreshToken");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.body.token || req.query.token;
    if (!token || typeof token !== "string") {
      throw new ValidationError("Verification token is required");
    }

    const hashed = hashToken(token);
    const dbToken = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash: hashed },
    });

    if (!dbToken || dbToken.usedAt || dbToken.expiresAt < new Date()) {
      throw new ValidationError("Invalid or expired verification token");
    }

    await prisma.user.update({
      where: { id: dbToken.userId! },
      data: { emailVerified: true },
    });

    await prisma.emailVerificationToken.update({
      where: { id: dbToken.id },
      data: { usedAt: new Date() },
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ValidationError("Email is required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If account exists, password reset instructions have been sent",
      });
    }

    const rawResetToken = generateCryptoToken();
    const tokenHash = hashToken(rawResetToken);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    return res.status(200).json({
      success: true,
      message: "Password reset token generated",
      resetToken: rawResetToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      throw new ValidationError("Reset token and new password are required");
    }

    if (newPassword.length < 6) {
      throw new ValidationError("Password must be at least 6 characters long");
    }

    const hashed = hashToken(token);
    const dbToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashed },
    });

    if (!dbToken || dbToken.usedAt || dbToken.expiresAt < new Date()) {
      throw new ValidationError("Invalid or expired reset token");
    }

    const newHashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: dbToken.userId! },
      data: { passwordHash: newHashedPassword },
    });

    await prisma.passwordResetToken.update({
      where: { id: dbToken.id },
      data: { usedAt: new Date() },
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
}
