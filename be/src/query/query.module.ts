import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';
import { QueryDBModule } from '../infrastructure/query-database/query-db.moudle';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [QueryDBModule, SessionModule],
  controllers: [QueryController],
  providers: [QueryService],
})
export class QueryModule {}
