import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import {
  ErrorInfo,
  LoggerService,
  RequestInfo,
  ResponseInfo,
} from 'src/config/logger/logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const logId = uuidv4();
    const requestInfo: RequestInfo = {
      id: logId,
      method: context.switchToHttp().getRequest().method,
      url: context.switchToHttp().getRequest().url,
      body: context.switchToHttp().getRequest().body,
      sessionId: context.switchToHttp().getRequest().sessionID,
      timestamp: new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
      }),
    };
    this.loggerService.logRequest(requestInfo);
    return next.handle().pipe(
      tap(() => {
        const responseInfo: ResponseInfo = {
          id: logId,
          status: context.switchToHttp().getResponse().statusCode,
          body: context.switchToHttp().getResponse().body,
          timestamp: new Date().toLocaleString('ko-KR', {
            timeZone: 'Asia/Seoul',
          }),
        };
        this.loggerService.logResponse(responseInfo);
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          const responseInfo: ResponseInfo = {
            id: logId,
            status: err.getStatus(),
            body: err.getResponse(),
            timestamp: new Date().toLocaleString('ko-KR', {
              timeZone: 'Asia/Seoul',
            }),
          };
          this.loggerService.logResponse(responseInfo);
        } else {
          const errorInfo: ErrorInfo = {
            id: logId,
            message: err['message'],
            stack: err['stack'],
            timestamp: new Date().toLocaleString('ko-KR', {
              timeZone: 'Asia/Seoul',
            }),
          };
          this.loggerService.error(errorInfo);
        }
        throw err;
      }),
    );
  }
}
