export interface TokenPayload {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface AuthUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: "CUSTOMER" | "ADMIN";
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
