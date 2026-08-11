import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid('Invalid order ID format'),
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().optional().default('INR'),
  }),
});

export const refundPaymentSchema = z.object({
  body: z.object({
    paymentId: z.string().uuid('Invalid payment ID format'),
    amount: z.number().positive().optional(),
    reason: z.string().optional().default('Customer requested refund'),
  }),
});

export type CreatePaymentIntentDTO = z.infer<typeof createPaymentIntentSchema>['body'];
export type RefundPaymentDTO = z.infer<typeof refundPaymentSchema>['body'];
