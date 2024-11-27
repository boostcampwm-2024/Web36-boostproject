import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const infoFileOptions = {
  level: 'info',
  dirname: 'logs',
  filename: '%DATE%-info.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
};

const errorFileOptions = {
  level: 'error',
  dirname: 'logs',
  filename: '%DATE%-error.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
};

export const winstonLogger = WinstonModule.createLogger({
  level: 'info', // 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        utilities.format.nestLike('Q-Lab', {
          prettyPrint: true,
          colors: true,
          appName: true,
        }),
      ),
    }),
    // error log file
    new winston.transports.DailyRotateFile(errorFileOptions),
    // info log file
    new winston.transports.DailyRotateFile(infoFileOptions),
  ],
});
