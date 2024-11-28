import {
  CallHandler,
  ExecutionContext, HttpException, HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { createConnection } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import { Observable, tap } from 'rxjs';
import { createReadStream } from 'fs';

@Injectable()
export class UserDBConnectionInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const identify = request.sessionID;

    try {
      request.dbConnection = await createConnection({
        host: this.configService.get<string>('QUERY_DB_HOST'),
        user: identify.substring(0, 10),
        password: identify,
        port: this.configService.get<number>('QUERY_DB_PORT', 3306),
        database: identify,
        infileStreamFactory: (path) => {
          return createReadStream(path);
        },
      });

      await request.dbConnection.query('set profiling = 1');
    } catch (error) {
      console.error('커넥션 제한으로 인한 에러', error);
      throw new HttpException(
        {
          status: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too many users right now! Please try again soon.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await request.dbConnection.query('set profiling = 1');

    return next.handle().pipe(
      tap(async () => {
        await request.dbConnection.end();
      }),
    );
  }
}
