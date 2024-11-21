import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { QueryDBModule } from 'src/config/query-database/query-db.moudle';
import { UsageModule } from 'src/usage/usage.module';
import { UsageService } from 'src/usage/usage.service';

@Module({
  imports: [QueryDBModule, UsageModule],
  controllers: [RecordController],
  providers: [RecordService, UsageService],
})
export class RecordModule {}
