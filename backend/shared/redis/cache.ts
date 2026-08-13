import Redis from "ioredis";

class CacheManager {
  private static instance: CacheManager;
  private redisClient: Redis | null = null;
  private memoryCache: Map<string, { value: any; expiresAt: number }> = new Map();
  private isRedisConnected: boolean = false;

  private constructor() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    try {
      this.redisClient = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null, // Don't crash if Redis is unavailable
      });

      this.redisClient.on("connect", () => {
        this.isRedisConnected = true;
        console.log("[Redis] Connected to Redis Cache Server");
      });

      this.redisClient.on("error", (err) => {
        this.isRedisConnected = false;
        // Silent fallback to memory cache
      });

      this.redisClient.connect().catch(() => {
        this.isRedisConnected = false;
      });
    } catch (e) {
      this.isRedisConnected = false;
    }
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public async get<T>(key: string): Promise<T | null> {
    if (this.isRedisConnected && this.redisClient) {
      try {
        const data = await this.redisClient.get(key);
        if (data) return JSON.parse(data) as T;
      } catch (err) {
        // Fallback to memory
      }
    }

    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (item.expiresAt < Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }
    return item.value as T;
  }

  public async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    if (this.isRedisConnected && this.redisClient) {
      try {
        await this.redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
        return;
      } catch (err) {
        // Fallback to memory
      }
    }

    this.memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  public async del(key: string): Promise<void> {
    if (this.isRedisConnected && this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch (err) {}
    }
    this.memoryCache.delete(key);
  }

  public async delByPattern(pattern: string): Promise<void> {
    if (this.isRedisConnected && this.redisClient) {
      try {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } catch (err) {}
    }

    const prefix = pattern.replace("*", "");
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }
  }

  public getStatus(): { isRedisConnected: boolean } {
    return { isRedisConnected: this.isRedisConnected };
  }
}

export const cacheManager = CacheManager.getInstance();
