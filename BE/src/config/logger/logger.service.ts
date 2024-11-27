import { HttpStatus } from '@nestjs/common';
import { winstonConfig } from './winston.config';
import { WinstonModule } from 'nest-winston';

export interface RequestInfo {
  method: string;
  url: string;
  body: any;
  sessionId: string;
}

export interface ResponseInfo {
  status: number;
}

export class LoggerService {
  private logger;

  constructor() {
    this.logger = WinstonModule.createLogger(winstonConfig);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  logRequest(reqInfo: RequestInfo) {
    this.logger.log(
      `[Request] ${reqInfo.method} ${reqInfo.url} SID: ${reqInfo.sessionId}`,
    );
  }
  logResponse(res: ResponseInfo) {
    if (res.status == HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`[Response] ${res.status} ${HttpStatus[res.status]}`);
      return;
    }
    this.logger.log(`[Response] ${res.status} ${HttpStatus[res.status]}`);
  }
}
