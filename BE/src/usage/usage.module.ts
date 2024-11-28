import { Module } from '@nestjs/common';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';
import { TableModule } from '../table/table.module';
import { RedisModule } from '../config/redis/redis.module';
import { QueryDBModule } from '../config/query-database/query-db.moudle';

@Module({
  imports: [TableModule, RedisModule, QueryDBModule],
  controllers: [UsageController],
  providers: [UsageService],
  exports: [UsageService],
})
export class UsageModule {}
