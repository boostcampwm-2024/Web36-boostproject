import { utilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as dotenv from 'dotenv';

dotenv.config();

const infoFileOptions = {
  level: 'info',
  dirname: 'logs',
  filename: 'info.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
};

const errorFileOptions = {
  level: 'error',
  dirname: 'logs',
  filename: 'error.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
};

export const winstonConfig = {
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
      silent: process.env.NODE_ENV !== 'debug',
    }),
    // error log file
    new winston.transports.DailyRotateFile(errorFileOptions),
    // info log file
    new winston.transports.DailyRotateFile(infoFileOptions),
  ],
};
