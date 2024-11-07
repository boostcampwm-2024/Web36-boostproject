import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';
import { QueryDBModule } from '../config/query-database/query-db.moudle';

@Module({
  imports: [QueryDBModule],
  controllers: [QueryController],
  providers: [QueryService],
})
export class QueryModule {}
