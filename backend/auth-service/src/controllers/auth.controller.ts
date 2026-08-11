import { Request, Response } from 'express';
import { authService, AuthService } from '../services/auth.service';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../../../shared/utils/cookie';
import { AuthRequest } from '../../../shared/middleware/auth.middleware';

export class AuthController {
  private service: AuthService;

  constructor(service: AuthService = authService) {
    this.service = service;
  }

  register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.register(req.body);
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        emailVerificationToken: result.emailVerificationToken,
      },
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.login(req.body);
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshTokenInput = req.cookies?.refreshToken || req.body?.refreshToken;
    const result = await this.service.refreshAccessToken(refreshTokenInput);
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully',
      data: {
        accessToken: result.accessToken,
      },
    });
  };

  logout = async (req: AuthRequest, res: Response): Promise<void> => {
    const refreshTokenInput = req.cookies?.refreshToken || req.body?.refreshToken;
    await this.service.logout(refreshTokenInput, req.user?.id);
    clearRefreshTokenCookie(res);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.forgotPassword(req.body.email);
    res.status(200).json({
      success: true,
      message: result.message,
      ...(result.resetToken && { resetToken: result.resetToken }),
    });
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.resetPassword(req.body);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.verifyEmail(req.body.token);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  };

  getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await this.service.getMe(req.user!.id);
    res.status(200).json({
      success: true,
      data: { user },
    });
  };
}

export const authController = new AuthController();
