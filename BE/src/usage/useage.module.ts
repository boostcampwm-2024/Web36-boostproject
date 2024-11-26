import { Module } from '@nestjs/common';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';
import { QueryDBModule } from 'src/config/query-database/query-db.moudle';
import { RedisService } from 'src/config/redis/redis.service';

@Module({
  imports: [QueryDBModule],
  controllers: [UsageController],
  providers: [UsageService, RedisService],
  exports: [UsageService],
})
export class UsageModule {}
