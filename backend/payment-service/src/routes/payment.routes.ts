import express, { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authenticateJwt } from '../../../shared/middleware/auth.middleware';
import { validateRequest } from '../../../shared/middleware/validate.middleware';
import { asyncHandler } from '../../../shared/middleware/error.middleware';
import { createPaymentIntentSchema, refundPaymentSchema } from '../dtos/payment.dto';

const router = Router();

// Webhook endpoint (Raw body or JSON)
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(paymentController.handleWebhook));

// Authenticated payment routes
router.use(authenticateJwt);

router.post(
  '/create-intent',
  validateRequest(createPaymentIntentSchema),
  asyncHandler(paymentController.createPaymentIntent)
);

router.post(
  '/refund',
  validateRequest(refundPaymentSchema),
  asyncHandler(paymentController.refund)
);

router.get('/order/:orderId', asyncHandler(paymentController.getOrderPayments));

export default router;
