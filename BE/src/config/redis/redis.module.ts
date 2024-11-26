import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { AdminQueryDBModule } from '../query-database/admin-query-db.moudle';
import { AdminDBManager } from '../query-database/admin-db-manager.service';

@Module({
  imports: [AdminQueryDBModule],
  providers: [RedisService, AdminDBManager],
  exports: [RedisService],
})
export class RedisModule {}
