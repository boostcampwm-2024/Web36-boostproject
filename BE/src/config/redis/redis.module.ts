import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { QueryDBModule } from '../query-database/query-db.moudle';

@Module({
  imports: [QueryDBModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
