import Redis from 'ioredis';

export class RedisClient {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });
    return this;
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async set(key: string, value: string = '', expiration: number = 60 * 60) {
    return this.redis.set(key, value, 'EX', expiration);
  }

  async del(key: string) {
    return this.redis.del(key);
  }
}
