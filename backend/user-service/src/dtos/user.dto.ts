import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    phone: z.string().max(20).optional(),
  }),
});

export const createAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(1).max(150),
    phone: z.string().min(1).max(20),
    addressLine1: z.string().min(1).max(255),
    addressLine2: z.string().max(255).optional(),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(20),
    country: z.string().max(100).optional().default('India'),
    isDefault: z.boolean().optional().default(false),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(1).max(150).optional(),
    phone: z.string().min(1).max(20).optional(),
    addressLine1: z.string().min(1).max(255).optional(),
    addressLine2: z.string().max(255).optional(),
    city: z.string().min(1).max(100).optional(),
    state: z.string().min(1).max(100).optional(),
    postalCode: z.string().min(1).max(20).optional(),
    country: z.string().max(100).optional(),
    isDefault: z.boolean().optional(),
  }),
});

export const addWishlistSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID format'),
  }),
});

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>['body'];
export type CreateAddressDTO = z.infer<typeof createAddressSchema>['body'];
export type UpdateAddressDTO = z.infer<typeof updateAddressSchema>['body'];
export type AddWishlistDTO = z.infer<typeof addWishlistSchema>['body'];
