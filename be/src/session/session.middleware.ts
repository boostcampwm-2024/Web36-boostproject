import session from 'express-session';
import createMemoryStore from 'memorystore';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';

dotenv.config();

export class SessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    cookieParser()(req, res, () => {
      const store = createMemoryStore(session);
      const sessionId = req.cookies?.sid;

      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new store({ checkPeriod: 1000 * 60 * 60 }), // 1시간
        genid: () => {
          const uuid = 'db' + uuidv4().replace(/[^a-zA-Z0-9]/g, '');
          return sessionId || uuid;
        },
        cookie: {
          maxAge: 1000 * 60 * 60,
        },
      })(req, res, next);
    });
  }
}
