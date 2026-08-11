import Stripe from 'stripe';

export class StripeService {
  private stripe: Stripe | null = null;

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
    try {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2024-04-10' as any,
      });
    } catch (err: any) {
      console.warn('[StripeService] Stripe SDK initialization warning:', err.message);
    }
  }

  async createPaymentIntent(amount: number, currency: string = 'INR', metadata?: Record<string, string>) {
    if (!this.stripe || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      // Return mock Stripe PaymentIntent structure for development/test mode
      const mockIntentId = `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const mockClientSecret = `${mockIntentId}_secret_mock`;
      return {
        id: mockIntentId,
        client_secret: mockClientSecret,
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        status: 'requires_payment_method',
      };
    }

    // Convert amount to smallest currency unit (cents/paise)
    const amountInSmallestUnit = Math.round(amount * 100);
    return this.stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: { enabled: true },
    });
  }

  async createRefund(paymentIntentId: string, amount?: number, reason?: string) {
    if (!this.stripe || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      const mockRefundId = `re_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return {
        id: mockRefundId,
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : 1000,
        status: 'succeeded',
      };
    }

    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount && { amount: Math.round(amount * 100) }),
      ...(reason && { reason: 'requested_by_customer' }),
    });
  }

  constructWebhookEvent(payload: string | Buffer, signature: string, secret: string) {
    if (!this.stripe) {
      throw new Error('Stripe is not initialized');
    }
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }
}

export const stripeService = new StripeService();
