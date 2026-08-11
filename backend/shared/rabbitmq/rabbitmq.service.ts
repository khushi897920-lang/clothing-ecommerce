import { Channel } from 'amqplib';
import { rabbitMQConnection } from './connection';
import { EXCHANGES, QUEUES } from './events';

export class RabbitMQService {
  private channel: Channel | null = null;

  async init(): Promise<void> {
    try {
      const { channel } = await rabbitMQConnection.connect();
      this.channel = channel;

      // 1. Declare Main Topic Exchange
      await this.channel.assertExchange(EXCHANGES.EVENTS, 'topic', { durable: true });

      // 2. Declare Dead Letter Exchange (DLX) & DLQ
      await this.channel.assertExchange(EXCHANGES.DLX, 'topic', { durable: true });
      await this.channel.assertQueue(QUEUES.DLQ, { durable: true });
      await this.channel.bindQueue(QUEUES.DLQ, EXCHANGES.DLX, '#');
    } catch (err: any) {
      console.warn('[RabbitMQService] Initialization error:', err.message);
    }
  }

  async publish(routingKey: string, payload: any): Promise<boolean> {
    try {
      if (!this.channel) {
        await this.init();
      }
      if (!this.channel) {
        console.warn(`[RabbitMQService] Cannot publish ${routingKey}: channel unavailable`);
        return false;
      }

      const buffer = Buffer.from(JSON.stringify(payload));
      const published = this.channel.publish(EXCHANGES.EVENTS, routingKey, buffer, {
        persistent: true,
        contentType: 'application/json',
        timestamp: Date.now(),
      });

      console.log(`[RabbitMQ] Published event: ${routingKey}`);
      return published;
    } catch (error: any) {
      console.error(`[RabbitMQ] Error publishing event ${routingKey}:`, error.message);
      return false;
    }
  }

  async subscribe(
    queueName: string,
    bindingKeys: string[],
    handler: (data: any, routingKey: string) => Promise<void>
  ): Promise<void> {
    try {
      if (!this.channel) {
        await this.init();
      }
      if (!this.channel) {
        console.warn(`[RabbitMQService] Cannot subscribe to ${queueName}: channel unavailable`);
        return;
      }

      // Assert queue with DLX configuration
      await this.channel.assertQueue(queueName, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': EXCHANGES.DLX,
          'x-dead-letter-routing-key': `dlx.${queueName}`,
        },
      });

      // Bind all keys
      for (const key of bindingKeys) {
        await this.channel.bindQueue(queueName, EXCHANGES.EVENTS, key);
      }

      await this.channel.prefetch(10);

      await this.channel.consume(
        queueName,
        async (msg) => {
          if (!msg) return;

          const routingKey = msg.fields.routingKey;
          try {
            const content = JSON.parse(msg.content.toString());
            await handler(content, routingKey);
            this.channel?.ack(msg);
          } catch (handlerError: any) {
            console.error(
              `[RabbitMQ] Error handling message on ${queueName} (${routingKey}):`,
              handlerError.message
            );
            // Reject and send to Dead Letter Queue if processing fails repeatedly
            this.channel?.nack(msg, false, false);
          }
        },
        { noAck: false }
      );

      console.log(`[RabbitMQ] Subscribed queue ${queueName} to keys:`, bindingKeys);
    } catch (err: any) {
      console.error(`[RabbitMQService] Error setting up consumer for ${queueName}:`, err.message);
    }
  }
}

export const rabbitMQService = new RabbitMQService();
export default rabbitMQService;
