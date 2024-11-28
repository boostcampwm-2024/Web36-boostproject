import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import {
  LoggerService,
  RequestInfo,
  ResponseInfo,
} from 'src/config/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const requestInfo: RequestInfo = {
      method: context.switchToHttp().getRequest().method,
      url: context.switchToHttp().getRequest().url,
      body: context.switchToHttp().getRequest().body,
      sessionId: context.switchToHttp().getRequest().sessionID,
    };
    this.loggerService.logRequest(requestInfo);
    return next.handle().pipe(
      tap(() => {
        const responseInfo: ResponseInfo = {
          status: context.switchToHttp().getResponse().statusCode,
        };
        this.loggerService.logResponse(responseInfo);
      }),
    );
  }
}
