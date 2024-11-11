import { Inject, Injectable } from '@nestjs/common';
import { QueryDto } from './dto/query.dto';
import { QUERY_DB_ADAPTER } from '../config/query-database/query-db.moudle';
import { QueryDBAdapter } from '../config/query-database/query-db.adapter';
import { ResQueryDto } from './dto/res-query.dto';

@Injectable()
export class QueryService {
  constructor(
    @Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
  ) {}

  async execute(userId: string, queryDto: QueryDto) {
    const connection = await this.queryDBAdapter.createConnection(userId);
    try {
      const rows = await this.queryDBAdapter.run(connection, queryDto.query);
      return ResQueryDto.ok(queryDto.query, rows);
    } catch (e) {
      return ResQueryDto.fail(e.sqlMessage);
    } finally {
      this.queryDBAdapter.closeConnection(connection);
    }
  }
}
