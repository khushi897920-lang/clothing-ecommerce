import app from './app';
import { rabbitMQService } from '../../shared/rabbitmq/rabbitmq.service';

const PORT = process.env.PORT || 4001;

async function startServer() {
  try {
    await rabbitMQService.init();
    console.log('[Auth Service] RabbitMQ initialized');
  } catch (err: any) {
    console.warn('[Auth Service] RabbitMQ initialization warning:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`[Auth Service] Running on port ${PORT}`);
  });
}

startServer();
