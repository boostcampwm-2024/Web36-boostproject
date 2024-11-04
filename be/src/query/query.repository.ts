import { Inject } from '@nestjs/common';
import { QueryDBAdapter } from '../infrastructure/query-database/query-db.adapter';
import { QUERY_DB_ADAPTER } from '../infrastructure/query-database/query-db.moudle';

export class QueryRepository {
  constructor(
    @Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
  ) {}
}