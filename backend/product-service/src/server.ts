import app from './app';
import { redisService } from '../../shared/redis/client';

const PORT = process.env.PORT || 4003;

async function startServer() {
  try {
    await redisService.connect();
    console.log('[Product Service] Redis connected');
  } catch (err: any) {
    console.warn('[Product Service] Redis connection warning:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`[Product Service] Running on port ${PORT}`);
  });
}

startServer();
