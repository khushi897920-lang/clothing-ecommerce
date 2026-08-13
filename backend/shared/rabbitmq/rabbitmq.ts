import amqp from "amqplib";
import { BaseEvent } from "../events/event.types";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const EXCHANGE_NAME = "yugen_events";

type EventHandler = (event: any) => Promise<void>;

class RabbitMQManager {
  private connection: any = null;
  private channel: any = null;
  private isConnected = false;
  private localSubscribers: Map<string, EventHandler[]> = new Map();
  private processedEventIds = new Set<string>();

  async connect(): Promise<boolean> {
    if (this.isConnected) return true;
    if (process.env.NODE_ENV === "test") {
      this.isConnected = false;
      return false;
    }

    try {
      this.connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });
      this.isConnected = true;
      console.log("[RabbitMQ] Connected to broker & topic exchange asserted.");
      return true;
    } catch (err) {
      console.warn("[RabbitMQ] Real broker unavailable. Using resilient in-memory fallback event bus.");
      this.isConnected = false;
      return false;
    }
  }

  async publish<T extends BaseEvent>(routingKey: string, event: T): Promise<void> {
    // Idempotency Tracking: Record event ID
    if (event.eventId && this.processedEventIds.has(event.eventId)) {
      console.log(`[EventBus] Duplicate event ${event.eventId} ignored.`);
      return;
    }
    if (event.eventId) {
      this.processedEventIds.add(event.eventId);
    }

    if (this.isConnected && this.channel) {
      try {
        const buffer = Buffer.from(JSON.stringify(event));
        this.channel.publish(EXCHANGE_NAME, routingKey, buffer, { persistent: true });
        console.log(`[RabbitMQ] Published ${event.eventType} (Key: ${routingKey})`);
      } catch (err) {
        console.error(`[RabbitMQ] Publish error, delivering to in-memory subscribers:`, err);
        await this.deliverLocal(routingKey, event);
      }
    } else {
      await this.deliverLocal(routingKey, event);
    }
  }

  async subscribe(queueName: string, routingKeyPattern: string, handler: EventHandler): Promise<void> {
    // Register for in-memory dispatch
    if (!this.localSubscribers.has(routingKeyPattern)) {
      this.localSubscribers.set(routingKeyPattern, []);
    }
    this.localSubscribers.get(routingKeyPattern)!.push(handler);

    if (this.isConnected && this.channel) {
      try {
        await this.channel.assertQueue(queueName, {
          durable: true,
          deadLetterExchange: EXCHANGE_NAME,
          deadLetterRoutingKey: "dlq",
        });
        await this.channel.bindQueue(queueName, EXCHANGE_NAME, routingKeyPattern);

        await this.channel.consume(queueName, async (msg: any) => {
          if (!msg) return;
          try {
            const event: BaseEvent = JSON.parse(msg.content.toString());
            await handler(event);
            this.channel?.ack(msg);
          } catch (err) {
            console.error(`[RabbitMQ] Error handling message in ${queueName}:`, err);
            this.channel?.nack(msg, false, false);
          }
        });
      } catch (err) {
        console.warn(`[RabbitMQ] Queue subscription fallback for ${queueName}:`, err);
      }
    }
  }

  private async deliverLocal(routingKey: string, event: BaseEvent): Promise<void> {
    for (const [pattern, handlers] of this.localSubscribers.entries()) {
      if (this.matchRoutingKey(pattern, routingKey)) {
        for (const handler of handlers) {
          try {
            await handler(event);
          } catch (err) {
            console.error(`[InMemoryEventBus] Error handling ${event.eventType}:`, err);
          }
        }
      }
    }
  }

  private matchRoutingKey(pattern: string, key: string): boolean {
    if (pattern === "#" || pattern === key) return true;
    const pParts = pattern.split(".");
    const kParts = key.split(".");
    if (pParts.length !== kParts.length && !pattern.includes("#")) return false;

    for (let i = 0; i < pParts.length; i++) {
      if (pParts[i] === "#") return true;
      if (pParts[i] !== "*" && pParts[i] !== kParts[i]) return false;
    }
    return true;
  }

  clearIdempotencyCache() {
    this.processedEventIds.clear();
  }
}

export const eventBus = new RabbitMQManager();
