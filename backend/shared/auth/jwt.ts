import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "yugen_super_secret_jwt_key_2026";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "yugen_super_secret_refresh_key_2026";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}
