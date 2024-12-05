import session from 'express-session';
import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CustomRedisStore } from 'src/config/redis/custom-redis-store';
import { RedisService } from 'src/config/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/config/logger/logger.service';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    session({
      secret: this.configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: true,
      store: new CustomRedisStore(this.redisService),
      rolling: true,
      genid: () => {
        return 'db' + uuidv4().replace(/[^a-zA-Z0-9]/g, '');
      },
      name: 'sid',
    })(req, res, async () => {
      try {
        await this.redisService.setNewSession(req.sessionID);
        next();
      } catch (error) {
        res.status(500).json({
          status: false,
          error: {
            code: 500,
            message: error.message,
          },
        });
        this.loggerService.error({
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toLocaleString('ko-KR', {
            timeZone: 'Asia/Seoul',
          }),
        });
      }
    });
  }
}
