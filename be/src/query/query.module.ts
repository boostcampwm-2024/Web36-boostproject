import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';
import { QueryDBModule } from '../config/query-database/query-db.moudle';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shell } from '../shell/shell.entity';

@Module({
  imports: [QueryDBModule, TypeOrmModule.forFeature([Shell])],
  controllers: [QueryController],
  providers: [QueryService],
})
export class QueryModule {}
