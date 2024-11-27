import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { RedisModule } from '../config/redis/redis.module';
import { UserDBManager } from '../config/query-database/user-db-manager.service';
import { UsageModule } from '../usage/usage.module';
import { RecordInitializeService } from './record-initialize.service';

@Module({
  imports: [RedisModule, UsageModule],
  controllers: [RecordController],
  providers: [RecordService, UserDBManager, RecordInitializeService],
})
export class RecordModule {}
