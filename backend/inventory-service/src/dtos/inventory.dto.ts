import { z } from 'zod';

export const updateStockSchema = z.object({
  body: z.object({
    stockQuantity: z.number().int().nonnegative('Stock quantity must be zero or positive'),
  }),
});

export const reserveStockSchema = z.object({
  body: z.object({
    orderId: z.string().uuid(),
    items: z.array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    ),
  }),
});

export const releaseStockSchema = z.object({
  body: z.object({
    orderId: z.string().uuid(),
    items: z.array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    ),
    reason: z.string().optional().default('Order cancelled'),
  }),
});

export type UpdateStockDTO = z.infer<typeof updateStockSchema>['body'];
export type ReserveStockDTO = z.infer<typeof reserveStockSchema>['body'];
export type ReleaseStockDTO = z.infer<typeof releaseStockSchema>['body'];
