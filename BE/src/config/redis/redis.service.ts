import Redis from 'ioredis';
import {Injectable} from '@nestjs/common';
import {AdminDBManager} from "../query-database/admin-db-manager.service";

@Injectable()
export class RedisService {
  private defaultConnection: Redis;
  private eventConnection: Redis;

  constructor(
    private readonly adminDBManager: AdminDBManager,
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
    return this.defaultConnection.get(key);
  }

  public async setNewSession(key: string) {
    const session = await this.getSession(key);
    if (!session) await this.adminDBManager.initUserDatabase(key);
  }

  private subscribeToExpiredEvents() {
    this.eventConnection.subscribe('__keyevent@0__:expired');

    this.eventConnection.on('message', (event,session) => {
      this.adminDBManager.removeDatabaseInfo(session);
    });
  }

  public getDefaultConnection() {
    return this.defaultConnection;
  }
}
