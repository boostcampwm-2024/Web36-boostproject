import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ShellModule } from './shell/shell.module';
import { QueryModule } from './query/query.module';

import { Shell } from 'src/shell/shell.entity';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { SessionMiddleware } from './middleware/session.middleware';
import { RedisModule } from './config/redis/redis.module';
import { ServiceDBModule } from './config/service-database/service-db.module';
import { RecordModule } from './record/record.module';
import { TableModule } from './table/table.module';
import { UsageModule } from './usage/useage.module';
import { LoggerModule } from './config/logger/logger.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

dotenv.config();

@Module({
  imports: [
    ServiceDBModule,
    TypeOrmModule.forFeature([User, Shell]),
    UserModule,
    ShellModule,
    QueryModule,
    RedisModule,
    RecordModule,
    TableModule,
    UsageModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
