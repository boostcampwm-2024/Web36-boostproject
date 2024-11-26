import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { AdminQueryDBModule } from '../config/query-database/admin-query-db.moudle';
import {AdminDBManager} from "../config/query-database/admin-db-manager.service";

@Module({
  imports: [AdminQueryDBModule],
  controllers: [TableController],
  providers: [TableService,AdminDBManager],
})
export class TableModule {}
