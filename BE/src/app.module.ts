import { MiddlewareConsumer, Module } from '@nestjs/common';
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
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
