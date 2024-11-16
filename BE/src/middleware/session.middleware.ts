import session from 'express-session';
import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import RedisStore from 'connect-redis';
import { SessionService } from 'src/config/redis/redis.service';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly sessionService: SessionService) {}

  use(req: Request, res: Response, next: NextFunction) {
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      rolling: true,
      store: new RedisStore({
        client: this.sessionService.getDefaultConnection(),
        prefix: '',
      }),
      genid: () => {
        const uuid = 'db' + uuidv4().replace(/[^a-zA-Z0-9]/g, '');
        return uuid;
      },
      cookie: {
        maxAge: 1000 * 60 * 60,
      },
      name: 'sid',
    })(req, res, async () => {
      await this.sessionService.setNewSession(req.sessionID);
      next();
    });
  }
}
