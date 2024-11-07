import { Module } from '@nestjs/common';
import { RedisClient } from './redis.client';
import { QueryDBModule } from '../query-database/query-db.moudle';

@Module({
  imports: [QueryDBModule],
  providers: [RedisClient],
  exports: [RedisClient],
})
export class RedisModule {}
