import session from 'express-session';
import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';
import RedisStore from 'connect-redis';
import { RedisClient } from 'src/infrastructure/redis/redis.client';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly redisClient: RedisClient) {}

  private async validateSessionId(sessionId: string): Promise<string> {
    const getKey = await this.redisClient.getSession(sessionId);
    if (getKey !== null) {
      return sessionId;
    }
    return null;
  }

  use(req: Request, res: Response, next: NextFunction) {
    cookieParser()(req, res, async () => {
      const sessionId = req.cookies?.sid;
      const validSessionId = await this.validateSessionId(sessionId);

      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: new RedisStore({ client: this.redisClient }),
        genid: () => {
          const uuid = 'db' + uuidv4().replace(/[^a-zA-Z0-9]/g, '');
          if (validSessionId !== null) {
            return sessionId;
          }
          this.redisClient.setSession(uuid);
          return validSessionId || uuid;
        },
        cookie: {
          maxAge: 1000 * 60 * 60,
        },
        name: 'sid',
      })(req, res, next);
    });
  }
}
