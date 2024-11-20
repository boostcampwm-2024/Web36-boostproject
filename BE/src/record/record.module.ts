import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { QueryDBModule } from 'src/config/query-database/query-db.moudle';

@Module({
  imports: [QueryDBModule],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
