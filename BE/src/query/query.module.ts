import {Module} from '@nestjs/common';
import {QueryService} from './query.service';
import {QueryController} from './query.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Shell} from '../shell/shell.entity';
import {ShellService} from '../shell/shell.service';
import {UserDBManager} from "../config/query-database/user-db-manager.service";

@Module({
  imports: [TypeOrmModule.forFeature([Shell])],
  controllers: [QueryController],
  providers: [QueryService, ShellService,UserDBManager],
})
export class QueryModule {}
