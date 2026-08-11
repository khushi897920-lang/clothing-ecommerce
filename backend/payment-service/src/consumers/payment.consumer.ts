import { rabbitMQService } from '../../../shared/rabbitmq/rabbitmq.service';
import { QUEUES, ROUTING_KEYS, OrderCreatedEvent } from '../../../shared/rabbitmq/events';

export async function setupPaymentConsumers(): Promise<void> {
  await rabbitMQService.subscribe(
    QUEUES.PAYMENT,
    [ROUTING_KEYS.ORDER_CREATED],
    async (data: any, routingKey: string) => {
      console.log(`[Payment Consumer] Received event: ${routingKey}`);
      if (routingKey === ROUTING_KEYS.ORDER_CREATED) {
        const event = data as OrderCreatedEvent;
        console.log(`[Payment Consumer] Ready for payment processing for order ${event.orderId}`);
      }
    }
  );
}
