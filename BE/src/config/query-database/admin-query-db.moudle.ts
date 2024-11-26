import { Module } from '@nestjs/common';
import { AdminDBManager } from './admin-db-manager.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [AdminDBManager],
})
export class AdminQueryDBModule {}
