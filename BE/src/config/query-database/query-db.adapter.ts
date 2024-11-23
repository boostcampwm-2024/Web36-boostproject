import { Connection, Pool, QueryResult } from 'mysql2/promise';

export interface QueryDBAdapter {
  createConnection(): void;
  initUserDatabase(): Promise<void>;
  closeConnection(): void;
  run(query: string): Promise<QueryResult>;
  getConnection(): Connection;
  getAdminPool(): Pool;
}
