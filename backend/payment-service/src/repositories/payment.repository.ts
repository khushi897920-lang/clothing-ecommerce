import { prisma } from '../../../shared/prisma/client';
import { Payment, Refund, PaymentStatus, RefundStatus } from '@prisma/client';

export class PaymentRepository {
  async createPayment(data: {
    orderId: string;
    userId: string;
    stripePaymentIntentId: string;
    amount: number;
    currency?: string;
    paymentMethod?: string;
  }): Promise<Payment> {
    return prisma.payment.create({
      data: {
        orderId: data.orderId,
        userId: data.userId,
        stripePaymentIntentId: data.stripePaymentIntentId,
        amount: data.amount,
        currency: data.currency || 'INR',
        status: 'PENDING',
        paymentMethod: data.paymentMethod || 'card',
      },
    });
  }

  async findPaymentById(id: string): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { id },
      include: { refunds: true },
    });
  }

  async findPaymentByStripeIntentId(stripePaymentIntentId: string): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { stripePaymentIntentId },
    });
  }

  async findPaymentsByOrderId(orderId: string): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: { orderId },
      include: { refunds: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<Payment> {
    return prisma.payment.update({
      where: { id },
      data: { status },
    });
  }

  async createRefund(data: {
    paymentId: string;
    orderId: string;
    stripeRefundId: string;
    amount: number;
    reason?: string;
    status?: RefundStatus;
  }): Promise<Refund> {
    return prisma.refund.create({
      data: {
        paymentId: data.paymentId,
        orderId: data.orderId,
        stripeRefundId: data.stripeRefundId,
        amount: data.amount,
        reason: data.reason,
        status: data.status || 'SUCCESS',
      },
    });
  }
}

export const paymentRepository = new PaymentRepository();
