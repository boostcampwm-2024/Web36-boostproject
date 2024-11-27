import { Module } from '@nestjs/common';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';
import { UserDBManager } from '../config/query-database/user-db-manager.service';
import { TableModule } from '../table/table.module';
import { RedisModule } from '../config/redis/redis.module';

@Module({
  imports: [TableModule, RedisModule],
  controllers: [UsageController],
  providers: [UsageService, UserDBManager],
  exports: [UsageService],
})
export class UsageModule {}
