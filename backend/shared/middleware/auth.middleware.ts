import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import { UserRole } from '../auth/roles';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateJwt = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers['x-user-id']) {
      // Gateway passed headers
      req.user = {
        id: req.headers['x-user-id'] as string,
        email: (req.headers['x-user-email'] as string) || '',
        role: (req.headers['x-user-role'] as UserRole) || 'CUSTOMER',
      };
      return next();
    }

    if (!token) {
      throw new AppError('Authentication required. Missing token.', 401);
    }

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key';
    const decoded = jwt.verify(token, secret) as AuthenticatedUser;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Invalid or expired authentication token', 401));
  }
};

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Access forbidden: insufficient permissions', 403));
    }

    next();
  };
};
