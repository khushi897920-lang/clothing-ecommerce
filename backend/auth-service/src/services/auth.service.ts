import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { authRepository, AuthRepository } from '../repositories/auth.repository';
import { RegisterDTO, LoginDTO, ResetPasswordDTO } from '../dtos/auth.dto';
import { AppError } from '../../../shared/middleware/error.middleware';
import { rabbitMQService } from '../../../shared/rabbitmq/rabbitmq.service';
import { ROUTING_KEYS } from '../../../shared/rabbitmq/events';

export class AuthService {
  private repository: AuthRepository;

  constructor(repository: AuthRepository = authRepository) {
    this.repository = repository;
  }

  private generateAccessToken(userId: string, email: string, role: string): string {
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key';
    return jwt.sign({ id: userId, email, role }, secret, { expiresIn: '15m' });
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async register(dto: RegisterDTO) {
    const existing = await this.repository.findUserByEmail(dto.email);
    if (existing) {
      throw new AppError('Email address is already registered', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.repository.createUser({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash,
      phone: dto.phone,
      role: dto.role as any,
    });

    // Create Email Verification Token
    const rawVerifyToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawVerifyToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await this.repository.createEmailVerificationToken(user.id, tokenHash, expiresAt);

    // Emit UserRegistered Event via RabbitMQ
    await rabbitMQService.publish(ROUTING_KEYS.USER_REGISTERED, {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    });

    const accessToken = this.generateAccessToken(user.id, user.email, user.role || 'CUSTOMER');
    const rawRefreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashToken(rawRefreshToken);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.repository.createRefreshToken(user.id, refreshTokenHash, refreshExpiresAt);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      accessToken,
      refreshToken: rawRefreshToken,
      emailVerificationToken: rawVerifyToken,
    };
  }

  async login(dto: LoginDTO) {
    const user = await this.repository.findUserByEmail(dto.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('User account is deactivated', 403);
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const accessToken = this.generateAccessToken(user.id, user.email, user.role || 'CUSTOMER');
    const rawRefreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashToken(rawRefreshToken);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.repository.createRefreshToken(user.id, refreshTokenHash, refreshExpiresAt);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }

  async refreshAccessToken(refreshTokenInput?: string) {
    if (!refreshTokenInput) {
      throw new AppError('Refresh token is required', 400);
    }

    const tokenHash = this.hashToken(refreshTokenInput);
    const record = await this.repository.findRefreshToken(tokenHash);

    if (!record || !record.user) {
      throw new AppError('Invalid refresh token', 401);
    }

    if (record.revokedAt) {
      throw new AppError('Refresh token has been revoked', 401);
    }

    if (new Date() > record.expiresAt) {
      throw new AppError('Refresh token has expired', 401);
    }

    // Revoke used token and issue new token pair (token rotation)
    await this.repository.revokeRefreshToken(tokenHash);

    const accessToken = this.generateAccessToken(
      record.user.id,
      record.user.email,
      record.user.role || 'CUSTOMER'
    );
    const newRawRefreshToken = this.generateRefreshToken();
    const newRefreshTokenHash = this.hashToken(newRawRefreshToken);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.repository.createRefreshToken(record.user.id, newRefreshTokenHash, refreshExpiresAt);

    return {
      accessToken,
      refreshToken: newRawRefreshToken,
    };
  }

  async logout(refreshTokenInput?: string, userId?: string) {
    if (refreshTokenInput) {
      const tokenHash = this.hashToken(refreshTokenInput);
      await this.repository.revokeRefreshToken(tokenHash);
    } else if (userId) {
      await this.repository.revokeAllUserRefreshTokens(userId);
    }
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.repository.findUserByEmail(email);
    if (!user) {
      // Return success to avoid user enumeration
      return { message: 'If an account exists, a password reset link has been sent' };
    }

    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawResetToken);
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await this.repository.createPasswordResetToken(user.id, tokenHash, expiresAt);

    return {
      message: 'If an account exists, a password reset link has been sent',
      resetToken: rawResetToken,
    };
  }

  async resetPassword(dto: ResetPasswordDTO) {
    const tokenHash = this.hashToken(dto.token);
    const resetRecord = await this.repository.findPasswordResetToken(tokenHash);

    if (!resetRecord || !resetRecord.user) {
      throw new AppError('Invalid or expired password reset token', 400);
    }

    if (resetRecord.usedAt) {
      throw new AppError('Password reset token has already been used', 400);
    }

    if (new Date() > resetRecord.expiresAt) {
      throw new AppError('Password reset token has expired', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(dto.newPassword, salt);

    await this.repository.updatePasswordAndMarkResetTokenUsed(
      resetRecord.user.id,
      newPasswordHash,
      resetRecord.id
    );

    // Revoke all refresh tokens for security
    await this.repository.revokeAllUserRefreshTokens(resetRecord.user.id);

    return { message: 'Password has been reset successfully' };
  }

  async verifyEmail(token: string) {
    const tokenHash = this.hashToken(token);
    const verifyRecord = await this.repository.findEmailVerificationToken(tokenHash);

    if (!verifyRecord || !verifyRecord.user) {
      throw new AppError('Invalid email verification token', 400);
    }

    if (verifyRecord.usedAt) {
      return { message: 'Email is already verified' };
    }

    if (new Date() > verifyRecord.expiresAt) {
      throw new AppError('Email verification token has expired', 400);
    }

    await this.repository.markEmailAsVerified(verifyRecord.user.id, verifyRecord.id);

    return { message: 'Email verified successfully' };
  }

  async getMe(userId: string) {
    const user = await this.repository.findUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();
