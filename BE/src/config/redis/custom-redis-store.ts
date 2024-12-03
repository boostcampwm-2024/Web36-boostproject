import { SessionData, Store } from 'express-session';
import { RedisService } from './redis.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CustomRedisStore extends Store {
  constructor(@Inject() private readonly redisService: RedisService) {
    super();
  }

  async set(
    sid: string,
    session: SessionData,
    cb: (err?: any) => void,
  ): Promise<void> {
    return cb();
  }

  async get(
    sid: string,
    cb: (err: any, session?: SessionData | null) => void,
  ): Promise<void> {
    try {
      const data = await this.redisService.getSession(sid);
      return cb(data);
    } catch (err) {
      return cb(err);
    }
  }

  async destroy(sid: string, cb: (err?: any) => void): Promise<void> {
    try {
      await this.redisService.deleteSession(sid);
      return cb();
    } catch (err) {
      cb(err);
    }
  }
}
