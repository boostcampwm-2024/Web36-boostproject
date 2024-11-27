import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shell } from '../shell/shell.entity';
import { ShellService } from '../shell/shell.service';
import { LoggerModule } from 'src/config/logger/logger.module';
import { UserDBManager } from '../config/query-database/user-db-manager.service';
import { UsageModule } from '../usage/usage.module';
import { RedisModule } from '../config/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shell]),
    UsageModule,
    RedisModule,
    LoggerModule,
  ],
  controllers: [QueryController],
  providers: [QueryService, ShellService, UserDBManager],
})
export class QueryModule {}
