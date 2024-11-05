import { Module } from '@nestjs/common';
import { SingleMySQLAdapter } from './single-mysql.adapter';

export const QUERY_DB_ADAPTER = 'QUERY_DB_ADAPTER';

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
