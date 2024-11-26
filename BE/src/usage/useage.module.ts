import { Module } from '@nestjs/common';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';
import { QueryDBModule } from 'src/config/query-database/query-db.moudle';

@Module({
  imports: [QueryDBModule],
  controllers: [UsageController],
  providers: [UsageService],
})
export class UsageModule {}
