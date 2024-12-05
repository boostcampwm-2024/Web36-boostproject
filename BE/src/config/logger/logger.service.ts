import { HttpStatus } from '@nestjs/common';
import { winstonConfig } from './winston.config';
import { WinstonModule } from 'nest-winston';
import { timestamp } from 'rxjs';

export interface RequestInfo {
  timestamp: string;
  id: string;
  method: string;
  url: string;
  body: any;
  sessionId: string;
}

export interface ResponseInfo {
  timestamp: string;
  id: string;
  status: number;
  body?: any;
}

export interface ErrorInfo {
  timestamp: string;
  id?: string;
  message: string;
  stack?: string;
}

export class LoggerService {
  private logger;

  constructor() {
    this.logger = WinstonModule.createLogger(winstonConfig);
  }

  warn(message: string, error: any) {
    this.logger.warn(`[${message}]\n${error}`);
  }

  logRequest(reqInfo: RequestInfo) {
    this.logger.log({
      message: `[Request] ${reqInfo.method} ${reqInfo.url}}`,
      id: reqInfo.id,
      method: reqInfo.method,
      url: reqInfo.url,
      sid: reqInfo.sessionId,
      body: reqInfo.body || '',
      timestamp: reqInfo.timestamp,
    });
  }

  logResponse(resInfo: ResponseInfo) {
    this.logger.log({
      message: `[Response] ${resInfo.status} ${HttpStatus[resInfo.status]}`,
      id: resInfo.id,
      status: resInfo.status,
      body: resInfo.body || '',
      timestamp: resInfo.timestamp,
    });
  }

  error(errorInfo: ErrorInfo) {
    this.logger.error({
      message: `[Error] ${errorInfo.message}`,
      id: errorInfo.id,
      stack: errorInfo.stack || '',
      timestamp: errorInfo.timestamp,
    });
  }
}
