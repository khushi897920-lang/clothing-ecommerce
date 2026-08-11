import { rabbitMQService } from '../../../shared/rabbitmq/rabbitmq.service';
import { QUEUES, ROUTING_KEYS, PaymentSucceededEvent, PaymentFailedEvent } from '../../../shared/rabbitmq/events';
import { orderRepository } from '../repositories/order.repository';
import { orderService } from '../services/order.service';

export async function setupOrderConsumers(): Promise<void> {
  await rabbitMQService.subscribe(
    QUEUES.ORDER,
    [ROUTING_KEYS.PAYMENT_SUCCEEDED, ROUTING_KEYS.PAYMENT_FAILED],
    async (data: any, routingKey: string) => {
      console.log(`[Order Consumer] Received event: ${routingKey}`);

      if (routingKey === ROUTING_KEYS.PAYMENT_SUCCEEDED) {
        const event = data as PaymentSucceededEvent;
        await orderRepository.updateOrderPaymentStatus(event.orderId, 'PAID');
        await orderService.updateOrderStatus(event.orderId, { status: 'CONFIRMED' });
      } else if (routingKey === ROUTING_KEYS.PAYMENT_FAILED) {
        const event = data as PaymentFailedEvent;
        await orderRepository.updateOrderPaymentStatus(event.orderId, 'FAILED');
      }
    }
  );
}
