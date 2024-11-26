import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { AdminQueryDBModule } from 'src/config/query-database/admin-query-db.moudle';
import {UserDBManager} from "../config/query-database/user-db-manager.service";

@Module({
  controllers: [RecordController],
  providers: [RecordService,UserDBManager],
})
export class RecordModule {}
