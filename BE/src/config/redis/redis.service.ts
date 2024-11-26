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

  public async setSession(key: string, sessionInfo: object) {
    await this.defaultConnection.hset(key, 'session', JSON.stringify(sessionInfo));
  }

  public async setNewSession(key: string, sessionInfo: object) {
    const session = await this.existSession(key);
    if (!session) {
      await this.defaultConnection.hset(key, 'session', JSON.stringify(sessionInfo));
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

  public async getRowCount(identify: string) {
    return this.defaultConnection.hget(identify, 'rowCount');
  }

  public async updateRowCount(identify: string, rowCount: number) {
    await this.defaultConnection.hset(identify, 'rowCount', rowCount);
  }

  public getDefaultConnection() {
    return this.defaultConnection;
  }

  public getEventConnection() {
    return this.eventConnection;
  }
}
