import Redis from 'ioredis';

class RedisService {
  private client: Redis | null = null;
  private isConnected: boolean = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 5) {
            return null; // Stop retrying
          }
          return Math.min(times * 100, 3000);
        },
        lazyConnect: true,
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        console.log('[Redis] Connected successfully');
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        console.warn('[Redis] Connection error:', err.message);
      });
    } catch (error) {
      console.warn('[Redis] Initialization error, operating without cache');
    }
  }

  async connect(): Promise<void> {
    if (this.client && !this.isConnected) {
      try {
        await this.client.connect();
      } catch (err: any) {
        console.warn('[Redis] Connect failed:', err.message);
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.isConnected) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.warn(`[Redis] Get failed for key ${key}`);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    if (!this.client || !this.isConnected) return;
    try {
      const stringified = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.setex(key, ttlSeconds, stringified);
      } else {
        await this.client.set(key, stringified);
      }
    } catch (err) {
      console.warn(`[Redis] Set failed for key ${key}`);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.del(key);
    } catch (err) {
      console.warn(`[Redis] Del failed for key ${key}`);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.client || !this.isConnected) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (err) {
      console.warn(`[Redis] Invalidate pattern failed for ${pattern}`);
    }
  }

  getClient(): Redis | null {
    return this.client;
  }
}

export const redisService = new RedisService();
export default redisService;
