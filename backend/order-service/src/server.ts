import app from './app';
import { rabbitMQService } from '../../shared/rabbitmq/rabbitmq.service';
import { setupOrderConsumers } from './consumers/order.consumer';

const PORT = process.env.PORT || 4005;

async function startServer() {
  try {
    await rabbitMQService.init();
    await setupOrderConsumers();
    console.log('[Order Service] RabbitMQ consumers listening');
  } catch (err: any) {
    console.warn('[Order Service] RabbitMQ initialization warning:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`[Order Service] Running on port ${PORT}`);
  });
}

startServer();
