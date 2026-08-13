export const Roles = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = keyof typeof Roles;
