import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { QueryDBModule } from 'src/config/query-database/query-db.moudle';
import { UsageService } from 'src/usage/usage.service';
import { RedisModule } from 'src/config/redis/redis.module';

@Module({
  imports: [QueryDBModule, RedisModule],
  controllers: [RecordController],
  providers: [RecordService, UsageService],
})
export class RecordModule {}
