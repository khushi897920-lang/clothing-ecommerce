import { rabbitMQService } from '../../../shared/rabbitmq/rabbitmq.service';
import { QUEUES, ROUTING_KEYS, OrderCreatedEvent, OrderCancelledEvent, PaymentFailedEvent } from '../../../shared/rabbitmq/events';
import { inventoryService } from '../services/inventory.service';

export async function setupInventoryConsumers(): Promise<void> {
  await rabbitMQService.subscribe(
    QUEUES.INVENTORY,
    [ROUTING_KEYS.ORDER_CREATED, ROUTING_KEYS.ORDER_CANCELLED, ROUTING_KEYS.PAYMENT_FAILED],
    async (data: any, routingKey: string) => {
      console.log(`[Inventory Consumer] Received event: ${routingKey}`);

      if (routingKey === ROUTING_KEYS.ORDER_CREATED) {
        const event = data as OrderCreatedEvent;
        const items = event.items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        }));
        await inventoryService.reserveStock({
          orderId: event.orderId,
          items,
        });
      } else if (routingKey === ROUTING_KEYS.ORDER_CANCELLED) {
        const event = data as OrderCancelledEvent;
        // In full flow, order details contain variant items
        console.log(`[Inventory Consumer] Processing cancellation stock release for order ${event.orderId}`);
      } else if (routingKey === ROUTING_KEYS.PAYMENT_FAILED) {
        const event = data as PaymentFailedEvent;
        console.log(`[Inventory Consumer] Processing payment failed stock release for order ${event.orderId}`);
      }
    }
  );
}
