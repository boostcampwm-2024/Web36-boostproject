import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './tableController';
import { QueryDBModule } from '../config/query-database/query-db.moudle';

@Module({
  imports: [QueryDBModule],
  controllers: [TableController],
  providers: [TableService],
})
export class TableModule {}
