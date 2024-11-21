import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';
import { QueryDBModule } from '../config/query-database/query-db.moudle';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shell } from '../shell/shell.entity';
import { ShellService } from '../shell/shell.service';
import { UsageService } from 'src/usage/usage.service';
import { UsageModule } from 'src/usage/usage.module';

@Module({
  imports: [QueryDBModule, TypeOrmModule.forFeature([Shell]), UsageModule],
  controllers: [QueryController],
  providers: [QueryService, ShellService, UsageService],
})
export class QueryModule {}
