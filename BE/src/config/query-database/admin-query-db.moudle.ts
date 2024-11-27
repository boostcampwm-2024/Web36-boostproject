import { Module } from '@nestjs/common';
import { AdminDBManager } from './admin-db-manager.service';

@Module({
  providers: [AdminDBManager],
})
export class AdminQueryDBModule {}
