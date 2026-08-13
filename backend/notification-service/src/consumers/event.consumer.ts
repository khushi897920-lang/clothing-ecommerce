import { prisma } from "../../../shared/database";
import { eventBus } from "../../../shared/rabbitmq/rabbitmq";
import { sendEmail } from "../services/email.service";
import {
  OrderPlacedEvent,
  PaymentConfirmedEvent,
  PaymentFailedEvent,
  ShipmentUpdatedEvent,
  RefundCompletedEvent,
} from "../../../shared/events/event.types";

export async function setupNotificationConsumers() {
  await eventBus.connect();

  // 1. Order Placed Event
  await eventBus.subscribe("notification_queue", "order.placed", async (evt: any) => {
    const event = evt as OrderPlacedEvent;
    if (!event.userId) return;

    await prisma.notification.create({
      data: {
        userId: event.userId,
        type: "ORDER_CONFIRMED",
        title: "Order Placed Successfully",
        message: `Your order #${event.orderNumber} for ₹${event.totalAmount} has been placed.`,
        isRead: false,
      },
    });

    const user = await prisma.user.findUnique({ where: { id: event.userId } });
    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: `Order Confirmation - #${event.orderNumber}`,
        html: `<h2>Thank you for your order, ${user.firstName}!</h2><p>Your order #${event.orderNumber} for ₹${event.totalAmount} has been received.</p>`,
      });
    }
  });

  // 2. Payment Confirmed Event
  await eventBus.subscribe("notification_queue", "payment.confirmed", async (evt: any) => {
    const event = evt as PaymentConfirmedEvent;
    if (!event.userId) return;

    await prisma.notification.create({
      data: {
        userId: event.userId,
        type: "PAYMENT_CONFIRMED",
        title: "Payment Confirmed",
        message: `Payment of ₹${event.amount} for your order has been received successfully.`,
        isRead: false,
      },
    });
  });

  // 3. Payment Failed Event
  await eventBus.subscribe("notification_queue", "payment.failed", async (evt: any) => {
    const event = evt as PaymentFailedEvent;
    if (!event.userId) return;

    await prisma.notification.create({
      data: {
        userId: event.userId,
        type: "PAYMENT_FAILED",
        title: "Payment Failed",
        message: `Payment of ₹${event.amount} was declined. ${event.reason || ""}`,
        isRead: false,
      },
    });
  });

  // 4. Shipment Updated Event
  await eventBus.subscribe("notification_queue", "shipment.updated", async (evt: any) => {
    const event = evt as ShipmentUpdatedEvent;
    if (!event.userId) return;

    let notifType: any = "ORDER_SHIPPED";
    if (event.status === "DELIVERED") notifType = "ORDER_DELIVERED";
    if (event.status === "CONFIRMED") notifType = "ORDER_CONFIRMED";

    await prisma.notification.create({
      data: {
        userId: event.userId,
        type: notifType,
        title: `Order Status: ${event.status}`,
        message: `Your order #${event.orderNumber} has been updated to status: ${event.status}.`,
        isRead: false,
      },
    });
  });

  // 5. Refund Completed Event
  await eventBus.subscribe("notification_queue", "refund.completed", async (evt: any) => {
    const event = evt as RefundCompletedEvent;
    if (!event.userId) return;

    await prisma.notification.create({
      data: {
        userId: event.userId,
        type: "REFUND_COMPLETED",
        title: "Refund Completed",
        message: `A refund of ₹${event.amount} has been processed for your order.`,
        isRead: false,
      },
    });
  });
}
