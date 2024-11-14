import Redis from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { QueryDBAdapter } from '../query-database/query-db.adapter';
import { QUERY_DB_ADAPTER } from '../query-database/query-db.moudle';

@Injectable()
export class RedisClient {
  private redis: Redis;
  private pubsub: Redis;

  constructor(
    @Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });

    this.pubsub = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });

    this.redis.on('ready', () => {
      this.redis.config('SET', 'notify-keyspace-events', 'Ex');
      this.subscribeToExpiredEvents();
    });
  }

  async getSession(key: string) {
    if (!key) {
      return null;
    }
    return await this.redis.get(key);
  }

  private subscribeToExpiredEvents() {
    this.pubsub.subscribe('__keyevent@0__:expired');

    this.pubsub.on('message', (event, session) => {
      this.queryDBAdapter.closeConnection(session);
    });
  }

  getRedis() {
    return this.redis;
  }
}
