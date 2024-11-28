import { Module } from '@nestjs/common';
import { AdminDBManager } from './admin-db-manager.service';
import { UserDBManager } from './user-db-manager.service';

@Module({
  providers: [AdminDBManager, UserDBManager],
  exports: [AdminDBManager, UserDBManager],
})
export class QueryDBModule {}
