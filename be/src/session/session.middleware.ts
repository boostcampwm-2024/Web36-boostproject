import session from 'express-session';
import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';
import RedisStore from 'connect-redis';
import { RedisClient } from 'src/config/redis/redis.client';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly redisClient: RedisClient) {}

  use(req: Request, res: Response, next: NextFunction) {
    cookieParser()(req, res, async () => {
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        rolling: true,
        store: new RedisStore({
          client: this.redisClient.getRedis(),
          prefix: '',
        }),
        genid: () => {
          const uuid = 'db' + uuidv4().replace(/[^a-zA-Z0-9]/g, '');
          return uuid;
        },
        cookie: {
          maxAge: 1000 * 60,
        },
        name: 'sid',
      })(req, res, next);
    });
  }
}
