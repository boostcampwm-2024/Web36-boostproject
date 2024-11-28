import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { QueryDBModule } from '../config/query-database/admin-query-db.moudle';

@Module({
  imports: [QueryDBModule],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
