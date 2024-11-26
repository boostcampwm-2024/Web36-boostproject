import session from 'express-session';
import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CustomRedisStore } from 'src/config/redis/custom-redis.store';
import { RedisService } from 'src/config/redis/redis.service';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  use(req: Request, res: Response, next: NextFunction) {
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      rolling: true,
      store: new CustomRedisStore(this.redisService),
      genid: () => {
        return 'db' + uuidv4().replace(/[^a-zA-Z0-9]/g, '');
      },
      cookie: {
        maxAge: 1000 * 60 * 60, // 1시간 (ms)
      },
      name: 'sid',
    })(req, res, async () => {
      await this.redisService.setNewSession(req.sessionID, req.session);
      next();
    });
  }
}
