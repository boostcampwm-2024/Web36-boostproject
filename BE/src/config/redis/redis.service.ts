import Redis from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { QueryDBAdapter } from '../query-database/query-db.adapter';
import { QUERY_DB_ADAPTER } from '../query-database/query-db.moudle';

@Injectable()
export class RedisService {
  private defaultConnection: Redis;
  private eventConnection: Redis;

  constructor(
    @Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
  ) {
    this.setDefaultConnection();
    this.setEventConnection();
  }

  private setDefaultConnection() {
    this.defaultConnection = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });

    this.defaultConnection.on('ready', () => {
      this.defaultConnection.config('SET', 'notify-keyspace-events', 'Ex');
    });
  }

  private setEventConnection() {
    this.eventConnection = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });

    this.defaultConnection.on('ready', () => {
      this.subscribeToExpiredEvents();
    });
  }

  public async getSession(key: string) {
    if (!key) {
      return null;
    }
    return this.defaultConnection.hget(key, 'session');
  }

  public async existSession(key: string) {
    return this.defaultConnection.exists(key);
  }

  public async setNewSession(key: string) {
    const session = await this.existSession(key);
    if (!session) {
      await this.defaultConnection.hset(key, 'rowCount', 0);
      await this.queryDBAdapter.initUserDatabase();
    }
    await this.queryDBAdapter.createConnection();
  }

  public async deleteSession(key: string) {
    await this.defaultConnection.del(key);
  }

  public async setExpireTime(key: string, ttl: number) {
    await this.defaultConnection.expire(key, ttl);
  }

  private subscribeToExpiredEvents() {
    this.eventConnection.subscribe('__keyevent@0__:expired');

    this.eventConnection.on('message', (event, session) => {
      this.queryDBAdapter.closeConnection(session);
    });
  }

  public async getRowCount(key: string) {
    return this.defaultConnection.hget(key, 'rowCount');
  }

  public async updateRowCount(key: string, rowCount: number) {
    await this.defaultConnection.hset(key, 'rowCount', rowCount);
  }

  public getDefaultConnection() {
    return this.defaultConnection;
  }

  public getEventConnection() {
    return this.eventConnection;
  }
}
