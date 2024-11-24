import { Module } from '@nestjs/common';
import { SingleMySQLAdapter } from './single-mysql.adapter';
import { SingleMySQLConnectionManager } from './single-mysql-connection-manager';
import { ConfigModule } from '@nestjs/config';

export const QUERY_DB_ADAPTER = 'QUERY_DB_ADAPTER';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: QUERY_DB_ADAPTER,
      useClass: SingleMySQLAdapter,
    },
    SingleMySQLConnectionManager,
  ],
  exports: [QUERY_DB_ADAPTER],
})
export class QueryDBModule {}
