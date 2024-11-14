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
    return await this.defaultConnection.get(key);
  }

  public async setNewSession(key: string) {
    const session = await this.getSession(key);
    if (!session) {
      await this.queryDBAdapter.createConnection(key);
    }
  }

  private subscribeToExpiredEvents() {
    this.eventConnection.subscribe('__keyevent@0__:expired');

    this.eventConnection.on('message', (event, session) => {
      this.queryDBAdapter.closeConnection(session);
    });
  }

  public getDefaultConnection() {
    return this.defaultConnection;
  }

  public getEventConnection() {
    return this.eventConnection;
  }
}
