import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../../../shared/middleware/validate.middleware';
import { asyncHandler } from '../../../shared/middleware/error.middleware';
import { authenticateJwt } from '../../../shared/middleware/auth.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../dtos/auth.dto';

const router = Router();

router.post('/register', validateRequest(registerSchema), asyncHandler(authController.register));
router.post('/login', validateRequest(loginSchema), asyncHandler(authController.login));
router.post('/refresh-token', validateRequest(refreshTokenSchema), asyncHandler(authController.refreshToken));
router.post('/logout', asyncHandler(authController.logout));
router.post('/forgot-password', validateRequest(forgotPasswordSchema), asyncHandler(authController.forgotPassword));
router.post('/reset-password', validateRequest(resetPasswordSchema), asyncHandler(authController.resetPassword));
router.post('/verify-email', validateRequest(verifyEmailSchema), asyncHandler(authController.verifyEmail));
router.get('/me', authenticateJwt, asyncHandler(authController.getMe));

export default router;
