import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { AdminDBManager } from '../query-database/admin-db-manager.service';

@Injectable()
export class RedisService {
  private defaultConnection: Redis;
  private eventConnection: Redis;

  constructor(private readonly adminDBManager: AdminDBManager) {
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
    return this.defaultConnection.hgetall(key);
  }

  public async existSession(key: string) {
    return this.defaultConnection.exists(key);
  }

  public async setNewSession(key: string) {
    const session = await this.existSession(key);
    if (!session) {
      await this.defaultConnection.hset(key, 'rowCount', 0);
      await this.adminDBManager.initUserDatabase(key);
    }
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
      this.adminDBManager.removeDatabaseInfo(session);
    });
  }

  public async getRowCount(key: string) {
    return this.defaultConnection.hget(key, 'rowCount');
  }

  public async setRowCount(key: string, rowCount: number) {
    await this.defaultConnection.hset(key, 'rowCount', rowCount);
  }

  public getDefaultConnection() {
    return this.defaultConnection;
  }
}
