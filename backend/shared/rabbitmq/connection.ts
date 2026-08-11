import amqp, { Connection, Channel } from 'amqplib';

export class RabbitMQConnection {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private isConnecting: boolean = false;

  async connect(url?: string): Promise<{ connection: Connection; channel: Channel }> {
    if (this.connection && this.channel) {
      return { connection: this.connection, channel: this.channel };
    }

    if (this.isConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return this.connect(url);
    }

    this.isConnecting = true;
    const rabbitUrl = url || process.env.RABBITMQ_URL || 'amqp://localhost:5672';

    try {
      this.connection = await amqp.connect(rabbitUrl);
      this.channel = await this.connection.createChannel();

      this.connection.on('error', (err) => {
        console.error('[RabbitMQ] Connection error:', err.message);
        this.reset();
      });

      this.connection.on('close', () => {
        console.warn('[RabbitMQ] Connection closed');
        this.reset();
      });

      this.isConnecting = false;
      console.log('[RabbitMQ] Connected successfully');
      return { connection: this.connection, channel: this.channel };
    } catch (error: any) {
      this.isConnecting = false;
      console.warn(`[RabbitMQ] Failed to connect: ${error.message}`);
      throw error;
    }
  }

  getChannel(): Channel | null {
    return this.channel;
  }

  getConnection(): Connection | null {
    return this.connection;
  }

  private reset() {
    this.connection = null;
    this.channel = null;
    this.isConnecting = false;
  }

  async close(): Promise<void> {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
    } catch (err) {
      // Ignore cleanup error
    } finally {
      this.reset();
    }
  }
}

export const rabbitMQConnection = new RabbitMQConnection();
export default rabbitMQConnection;
