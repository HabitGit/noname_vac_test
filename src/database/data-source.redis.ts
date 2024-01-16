import { createClient, RedisClientType } from 'redis';

export const cacheClient: RedisClientType = createClient({
  url: process.env.REDIS_HOST_OUTSIDE,
});

cacheClient.on('error', (err) => console.log('Redis client error: ', err));
cacheClient.connect().then(() => console.log('Redis connect'));
