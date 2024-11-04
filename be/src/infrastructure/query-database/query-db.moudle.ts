import { Module } from '@nestjs/common';
import { SingleMySQLAdapter } from './query-db.config';

export const QUERY_DB_ADAPTER = Symbol('QUERY_DB_ADAPTER');

@Module({
  providers: [
    {
      provide: QUERY_DB_ADAPTER,
      useClass: SingleMySQLAdapter,
    },
  ],
  exports: [QUERY_DB_ADAPTER],
})
export class QueryDBModule {}
