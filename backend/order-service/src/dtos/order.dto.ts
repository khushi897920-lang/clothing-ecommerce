import { z } from 'zod';

export const addCartItemSchema = z.object({
  body: z.object({
    variantId: z.string().uuid('Invalid variant ID'),
    quantity: z.number().int().positive('Quantity must be at least 1'),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive('Quantity must be at least 1'),
  }),
});

export const checkoutSchema = z.object({
  body: z.object({
    shippingAddressId: z.string().uuid().optional(),
    shippingAddress: z
      .object({
        name: z.string().min(1).max(150),
        phone: z.string().min(1).max(20),
        address1: z.string().min(1).max(255),
        address2: z.string().max(255).optional(),
        city: z.string().min(1).max(100),
        state: z.string().min(1).max(100),
        postalCode: z.string().min(1).max(20),
        country: z.string().max(100).optional().default('India'),
      })
      .optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
    reason: z.string().optional(),
  }),
});

export type AddCartItemDTO = z.infer<typeof addCartItemSchema>['body'];
export type UpdateCartItemDTO = z.infer<typeof updateCartItemSchema>['body'];
export type CheckoutDTO = z.infer<typeof checkoutSchema>['body'];
export type UpdateOrderStatusDTO = z.infer<typeof updateOrderStatusSchema>['body'];
