import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ShellModule } from './shell/shell.module';
import { QueryModule } from './query/query.module';

import { Shell } from 'src/shell/shell.entity';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { SessionMiddleware } from './session/session.middleware';
import { RedisModule } from './config/redis/redis.module';
import { QueryDBModule } from './config/query-database/query-db.moudle';
import { ServiceDBModule } from './config/service-database/service-db.module';

dotenv.config();

@Module({
  imports: [
    ServiceDBModule,
    TypeOrmModule.forFeature([User, Shell]),
    UserModule,
    ShellModule,
    QueryModule,
    RedisModule,
    QueryDBModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
