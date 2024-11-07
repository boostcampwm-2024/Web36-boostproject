import session from 'express-session';
import { NextFunction, Request, Response } from 'express';
import { NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';
import { RedisClient } from '../infrastructure/redis/redis.client';
import RedisStore from 'connect-redis';

export class SessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    cookieParser()(req, res, () => {
      const sessionId = req.cookies?.sid;
      const redisClient = new RedisClient();
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new RedisStore({ client: redisClient }),
        genid: () => {
          const uuid = 'db' + uuidv4().replace(/[^a-zA-Z0-9]/g, '');
          if (!sessionId) {
            redisClient.set(uuid);
          }
          return sessionId || uuid;
        },
        cookie: {
          maxAge: 1000 * 60 * 60,
        },
      })(req, res, next);
    });
  }
}
