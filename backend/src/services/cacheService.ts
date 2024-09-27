import { createClient } from 'redis';

console.log('Redis URL:', process.env.REDIS_URL);

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.log('Redis Client Error', err));

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

export const cacheService = {
  connect: async (retries = 0) => {
    try {
      await client.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      if (retries < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
        setTimeout(() => cacheService.connect(retries + 1), RETRY_INTERVAL);
      } else {
        console.error('Max retries reached. Unable to connect to Redis.');
      }
    }
  },
  get: async (key: string) => {
    return await client.get(key);
  },
  set: async (key: string, value: string, expireIn: number) => {
    await client.set(key, value, { EX: expireIn });
  },
  del: async (key: string) => {
    await client.del(key);
  }
};