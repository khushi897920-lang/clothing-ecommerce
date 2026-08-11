import { paymentRepository, PaymentRepository } from '../repositories/payment.repository';
import { stripeService, StripeService } from './stripe.service';
import { CreatePaymentIntentDTO, RefundPaymentDTO } from '../dtos/payment.dto';
import { AppError } from '../../../shared/middleware/error.middleware';
import { rabbitMQService } from '../../../shared/rabbitmq/rabbitmq.service';
import { ROUTING_KEYS } from '../../../shared/rabbitmq/events';

export class PaymentService {
  private repository: PaymentRepository;
  private stripe: StripeService;

  constructor(repository: PaymentRepository = paymentRepository, stripe: StripeService = stripeService) {
    this.repository = repository;
    this.stripe = stripe;
  }

  async createPaymentIntent(userId: string, dto: CreatePaymentIntentDTO) {
    const intent = await this.stripe.createPaymentIntent(dto.amount, dto.currency, {
      orderId: dto.orderId,
      userId,
    });

    const payment = await this.repository.createPayment({
      orderId: dto.orderId,
      userId,
      stripePaymentIntentId: intent.id,
      amount: dto.amount,
      currency: dto.currency || 'INR',
    });

    // Publish PaymentInitiated event
    await rabbitMQService.publish(ROUTING_KEYS.PAYMENT_INITIATED, {
      paymentId: payment.id,
      orderId: payment.orderId!,
      userId: payment.userId!,
      amount: Number(payment.amount),
      currency: payment.currency || 'INR',
      stripePaymentIntentId: intent.id,
      initiatedAt: new Date().toISOString(),
    });

    return {
      paymentId: payment.id,
      clientSecret: intent.client_secret,
      stripePaymentIntentId: intent.id,
      amount: dto.amount,
      currency: dto.currency || 'INR',
      status: payment.status,
    };
  }

  async processWebhook(payload: any, signature?: string) {
    let event = payload;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (signature && webhookSecret) {
      try {
        event = this.stripe.constructWebhookEvent(payload, signature, webhookSecret);
      } catch (err: any) {
        throw new AppError(`Webhook Error: ${err.message}`, 400);
      }
    }

    const type = event.type || event.event;
    const dataObject = event.data?.object || event;

    if (type === 'payment_intent.succeeded' || event.status === 'succeeded') {
      const intentId = dataObject.id;
      const payment = await this.repository.findPaymentByStripeIntentId(intentId);

      if (payment) {
        await this.repository.updatePaymentStatus(payment.id, 'SUCCESS');

        await rabbitMQService.publish(ROUTING_KEYS.PAYMENT_SUCCEEDED, {
          paymentId: payment.id,
          orderId: payment.orderId!,
          userId: payment.userId!,
          amount: Number(payment.amount),
          stripePaymentIntentId: intentId,
          succeededAt: new Date().toISOString(),
        });
      }
    } else if (type === 'payment_intent.payment_failed' || event.status === 'failed') {
      const intentId = dataObject.id;
      const payment = await this.repository.findPaymentByStripeIntentId(intentId);

      if (payment) {
        await this.repository.updatePaymentStatus(payment.id, 'FAILED');

        await rabbitMQService.publish(ROUTING_KEYS.PAYMENT_FAILED, {
          paymentId: payment.id,
          orderId: payment.orderId!,
          userId: payment.userId!,
          reason: dataObject.last_payment_error?.message || 'Payment failed',
          failedAt: new Date().toISOString(),
        });
      }
    }

    return { received: true };
  }

  async processRefund(userId: string, userRole: string, dto: RefundPaymentDTO) {
    const payment = await this.repository.findPaymentById(dto.paymentId);
    if (!payment) {
      throw new AppError('Payment record not found', 404);
    }

    if (userRole !== 'ADMIN' && payment.userId !== userId) {
      throw new AppError('Access denied', 403);
    }

    if (payment.status !== 'SUCCESS') {
      throw new AppError('Only successful payments can be refunded', 400);
    }

    const refundAmount = dto.amount || Number(payment.amount);
    const stripeRefund = await this.stripe.createRefund(
      payment.stripePaymentIntentId!,
      refundAmount,
      dto.reason
    );

    const refund = await this.repository.createRefund({
      paymentId: payment.id,
      orderId: payment.orderId!,
      stripeRefundId: stripeRefund.id,
      amount: refundAmount,
      reason: dto.reason,
    });

    await this.repository.updatePaymentStatus(payment.id, 'REFUNDED');

    // Publish PaymentRefunded event
    await rabbitMQService.publish(ROUTING_KEYS.PAYMENT_REFUNDED, {
      paymentId: payment.id,
      refundId: refund.id,
      orderId: payment.orderId!,
      userId: payment.userId!,
      amount: refundAmount,
      refundedAt: new Date().toISOString(),
    });

    return refund;
  }

  async getOrderPayments(orderId: string, userId: string, userRole: string) {
    const payments = await this.repository.findPaymentsByOrderId(orderId);
    if (payments.length > 0 && userRole !== 'ADMIN' && payments[0].userId !== userId) {
      throw new AppError('Access denied', 403);
    }
    return payments;
  }
}

export const paymentService = new PaymentService();
