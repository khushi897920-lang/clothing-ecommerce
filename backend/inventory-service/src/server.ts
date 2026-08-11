import app from './app';
import { rabbitMQService } from '../../shared/rabbitmq/rabbitmq.service';
import { setupInventoryConsumers } from './consumers/inventory.consumer';

const PORT = process.env.PORT || 4004;

async function startServer() {
  try {
    await rabbitMQService.init();
    await setupInventoryConsumers();
    console.log('[Inventory Service] RabbitMQ consumers listening');
  } catch (err: any) {
    console.warn('[Inventory Service] RabbitMQ initialization warning:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`[Inventory Service] Running on port ${PORT}`);
  });
}

startServer();
