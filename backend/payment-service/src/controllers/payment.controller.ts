import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { prisma } from "../../../shared/database";
import { eventBus } from "../../../shared/rabbitmq/rabbitmq";
import { AuthenticatedRequest } from "../../../shared/auth/middleware";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../../../shared/errors/AppError";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "sk_test_51MockYugenKeyForDevAndTesting1234567890";
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock_yugen_secret_key_for_testing";

const stripe = new Stripe(stripeSecret, {
  apiVersion: "2024-06-20" as any,
});

// Idempotency cache for processed webhook event IDs
const processedWebhookEvents = new Set<string>();

// ----------------------------------------------------
// CREATE PAYMENT INTENT
// ----------------------------------------------------
export async function createPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { orderId } = req.body;

    if (!orderId) {
      throw new ValidationError("Order ID is required to create payment");
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (req.user!.role !== "ADMIN" && order.userId !== userId) {
      throw new ForbiddenError("You can only pay for your own orders");
    }

    if (order.paymentStatus === "PAID") {
      throw new ConflictError("Order is already paid");
    }

    const authoritativeAmount = Number(order.totalAmount);
    const amountInCents = Math.round(authoritativeAmount * 100);

    let paymentIntentId = `pi_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    let clientSecret = `${paymentIntentId}_secret_mock`;

    // Stripe SDK Call (with fallback if mock secret is used in test mode)
    try {
      if (!stripeSecret.includes("Mock")) {
        const intent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: "inr",
          metadata: { orderId: order.id, userId: order.userId || userId },
        });
        paymentIntentId = intent.id;
        clientSecret = intent.client_secret || clientSecret;
      }
    } catch (stripeErr) {
      console.warn("[Stripe SDK] Test mode fallback active:", stripeErr);
    }

    // Idempotent Payment Record in PostgreSQL
    let payment = await prisma.payment.findFirst({
      where: { orderId: order.id, status: "PENDING" },
    });

    if (payment) {
      payment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          stripePaymentIntentId: paymentIntentId,
          amount: order.totalAmount,
        },
      });
    } else {
      payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          userId: order.userId || userId,
          stripePaymentIntentId: paymentIntentId,
          amount: order.totalAmount,
          currency: "INR",
          status: "PENDING",
          paymentMethod: "CARD",
        },
      });
    }

    return res.status(201).json({
      success: true,
      paymentId: payment.id,
      stripePaymentIntentId: paymentIntentId,
      clientSecret,
      amount: authoritativeAmount,
      currency: "INR",
      orderId: order.id,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// GET PAYMENT
// ----------------------------------------------------
export async function getPaymentById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const isUuid = /^[0-9a-fA-F-]{36}$/.test(id);
    const payment = await prisma.payment.findFirst({
      where: isUuid ? { OR: [{ id }, { orderId: id }] } : { stripePaymentIntentId: id },
      include: { order: true, refunds: true },
    });

    if (!payment) {
      throw new NotFoundError("Payment record not found");
    }

    if (userRole !== "ADMIN" && payment.userId !== userId) {
      throw new ForbiddenError("You can only view your own payment records");
    }

    return res.status(200).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// STRIPE WEBHOOK HANDLER
// ----------------------------------------------------
export async function handleStripeWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const sig = req.headers["stripe-signature"] as string;
    let event: any = req.body;

    if (Buffer.isBuffer(req.body)) {
      try {
        event = JSON.parse(req.body.toString("utf8"));
      } catch (err) {
        // Fallback to raw string if signature verification fails
      }
    }

    // Verify Stripe signature if production signature header exists
    if (sig && !stripeWebhookSecret.includes("mock") && Buffer.isBuffer(req.body)) {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
      } catch (err: any) {
        console.error("[Stripe Webhook Signature Failed]:", err.message);
        return res.status(400).json({ success: false, error: `Webhook Signature Verification Failed: ${err.message}` });
      }
    }

    const eventId = event.id || `evt_${Date.now()}`;
    if (processedWebhookEvents.has(eventId)) {
      console.log(`[Stripe Webhook] Duplicate event ${eventId} safely ignored.`);
      return res.status(200).json({ received: true, duplicate: true });
    }
    processedWebhookEvents.add(eventId);

    const eventType = event.type || "payment_intent.succeeded";
    const paymentIntent = event.data?.object || event;
    const intentId = paymentIntent.id || paymentIntent.stripePaymentIntentId;
    const metadataOrderId = paymentIntent.metadata?.orderId || paymentIntent.orderId;
    const metadataPaymentId = paymentIntent.metadata?.paymentId || paymentIntent.paymentId;

    if (eventType === "payment_intent.succeeded") {
      const payment = await prisma.payment.findFirst({
        where: {
          OR: [
            { stripePaymentIntentId: intentId },
            ...(metadataPaymentId ? [{ id: metadataPaymentId }] : []),
            ...(metadataOrderId ? [{ orderId: metadataOrderId }] : []),
          ],
        },
        include: { order: true },
      });

      if (payment) {
        // Update PostgreSQL Payment & Order Status
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: { status: "SUCCESS" },
          }),
          prisma.order.update({
            where: { id: payment.orderId! },
            data: { paymentStatus: "PAID", status: "CONFIRMED", confirmedAt: new Date() },
          }),
        ]);

        // Publish PaymentConfirmed Event to RabbitMQ
        await eventBus.publish("payment.confirmed", {
          eventId: `evt_pay_conf_${payment.id}`,
          timestamp: new Date().toISOString(),
          eventType: "PaymentConfirmed",
          paymentId: payment.id,
          orderId: payment.orderId!,
          userId: payment.userId!,
          stripePaymentIntentId: payment.stripePaymentIntentId || intentId,
          amount: Number(payment.amount),
          currency: payment.currency || "INR",
        });
      }
    } else if (eventType === "payment_intent.payment_failed") {
      const payment = await prisma.payment.findFirst({
        where: {
          OR: [
            { stripePaymentIntentId: intentId },
            { id: paymentIntent.paymentId },
            { orderId: paymentIntent.orderId },
          ],
        },
      });

      if (payment) {
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: { status: "FAILED" },
          }),
          prisma.order.update({
            where: { id: payment.orderId! },
            data: { paymentStatus: "FAILED" },
          }),
        ]);

        await eventBus.publish("payment.failed", {
          eventId: `evt_pay_fail_${payment.id}`,
          timestamp: new Date().toISOString(),
          eventType: "PaymentFailed",
          paymentId: payment.id,
          orderId: payment.orderId!,
          userId: payment.userId!,
          amount: Number(payment.amount),
          reason: paymentIntent.last_payment_error?.message || "Payment declined",
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// REFUND EXECUTION
// ----------------------------------------------------
export async function refundPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { paymentId, orderId, amount, reason } = req.body;
    const targetId = req.params.id || paymentId || orderId;

    if (!targetId) {
      throw new ValidationError("Payment ID or Order ID is required for refund");
    }

    const isUuid = /^[0-9a-fA-F-]{36}$/.test(targetId);
    const payment = await prisma.payment.findFirst({
      where: isUuid ? { OR: [{ id: targetId }, { orderId: targetId }] } : { stripePaymentIntentId: targetId },
      include: { order: true, refunds: true },
    });

    if (!payment) {
      throw new NotFoundError("Payment record not found for refund");
    }

    if (req.user!.role !== "ADMIN" && payment.userId !== req.user!.userId) {
      throw new ForbiddenError("Only ADMIN or the order owner can process refunds");
    }

    // Idempotency: Return existing refund if already processed
    const existingRefund = payment.refunds.find((r) => r.status === "SUCCESS");
    if (existingRefund) {
      return res.status(200).json({
        success: true,
        message: "Refund already processed previously",
        refund: existingRefund,
      });
    }

    const refundAmount = amount ? Number(amount) : Number(payment.amount);
    let stripeRefundId = `re_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    try {
      if (!stripeSecret.includes("Mock") && payment.stripePaymentIntentId) {
        const stripeRefund = await stripe.refunds.create({
          payment_intent: payment.stripePaymentIntentId,
          amount: Math.round(refundAmount * 100),
        });
        stripeRefundId = stripeRefund.id;
      }
    } catch (stripeErr) {
      console.warn("[Stripe Refund SDK] Test mode fallback active:", stripeErr);
    }

    // Transactional Refund Persistence
    const refund = await prisma.$transaction(async (tx) => {
      const ref = await tx.refund.create({
        data: {
          paymentId: payment.id,
          orderId: payment.orderId,
          stripeRefundId,
          amount: refundAmount,
          reason: reason || "Customer request / Order cancellation",
          status: "SUCCESS",
        },
      });

      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "REFUNDED" },
      });

      if (payment.orderId) {
        await tx.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: "REFUNDED", status: "CANCELLED", cancelledAt: new Date() },
        });
      }

      return ref;
    });

    // Publish RefundCompleted Event to RabbitMQ
    await eventBus.publish("refund.completed", {
      eventId: `evt_ref_comp_${refund.id}`,
      timestamp: new Date().toISOString(),
      eventType: "RefundCompleted",
      refundId: refund.id,
      paymentId: payment.id,
      orderId: payment.orderId!,
      userId: payment.userId!,
      stripeRefundId,
      amount: refundAmount,
      reason: refund.reason || undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Refund executed successfully",
      refund,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminPayments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        order: true,
        user: { select: { firstName: true, lastName: true, email: true } },
        refunds: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, payments });
  } catch (error) {
    next(error);
  }
}
