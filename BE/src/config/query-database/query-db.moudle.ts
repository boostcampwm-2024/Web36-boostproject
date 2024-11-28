import { Module } from '@nestjs/common';
import { UserDBManager } from './user-db-manager.service';
import { AdminDBManager } from './admin-db-manager.service';

@Module({
  providers: [UserDBManager, AdminDBManager],
  exports: [UserDBManager, AdminDBManager],
})
export class QueryDBModule {}
