import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import {
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
    };
    this.loggerService.logRequest(requestInfo);
    return next.handle().pipe(
      tap(() => {
        const responseInfo: ResponseInfo = {
          id: logId,
          status: context.switchToHttp().getResponse().statusCode,
          body: context.switchToHttp().getResponse().body,
        };
        this.loggerService.logResponse(responseInfo);
      }),
      catchError((err) => {
        let responseInfo: ResponseInfo;
        if (err instanceof HttpException) {
          responseInfo = {
            id: logId,
            status: err.getStatus(),
            errMessage: err.message,
          };
          this.loggerService.logResponse(responseInfo);
        } else {
          responseInfo = {
            id: logId,
            status: 500,
            errMessage: `${err}`,
          };
          this.loggerService.error(responseInfo);
        }
        throw err;
      }),
    );
  }
}
