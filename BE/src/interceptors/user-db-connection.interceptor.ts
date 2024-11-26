import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { createConnection } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import { Observable, tap } from 'rxjs';

@Injectable()
export class UserDBConnectionInterceptor implements NestInterceptor {

  constructor(private readonly configService: ConfigService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const identify = request.sessionID;

    request.dbConnection = await createConnection({
      host: this.configService.get<string>('QUERY_DB_HOST'),
      user: identify.substring(0, 10),
      password: identify,
      port: this.configService.get<number>('QUERY_DB_PORT', 3306),
      database: identify,
    });

    await request.dbConnection.query('set profiling = 1');

    return next.handle().pipe(
      tap(async () => {
        await request.dbConnection.end();
      }),
    );
  }
}