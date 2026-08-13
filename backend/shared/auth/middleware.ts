import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "./jwt";
import { TokenPayload } from "./auth.types";
import { UnauthorizedError, ForbiddenError } from "../errors/AppError";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Access token is required"));
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    return next(new UnauthorizedError("Invalid or expired access token"));
  }

  req.user = payload;
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new UnauthorizedError("Authentication required"));
  }
  next();
}

export function requireRole(role: "ADMIN" | "CUSTOMER") {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }
    if (req.user.role !== role) {
      return next(new ForbiddenError(`Access denied. ${role} role required.`));
    }
    next();
  };
}
