import session from 'express-session';
import { NextFunction, Request, Response } from 'express';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import RedisStore from 'connect-redis';
import { RedisClient } from 'src/config/redis/redis.client';
import { QUERY_DB_ADAPTER } from 'src/config/query-database/query-db.moudle';
import { QueryDBAdapter } from 'src/config/query-database/query-db.adapter';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    private readonly redisClient: RedisClient,
    @Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
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
    })(req, res, async () => {
      const session = await this.redisClient.getSession(req.sessionID);
      if (!session) {
        await this.queryDBAdapter.createConnection(req.sessionID);
      }
      next();
    });
  }
}
