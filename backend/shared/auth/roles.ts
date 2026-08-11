export const Roles = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof Roles)[keyof typeof Roles];
