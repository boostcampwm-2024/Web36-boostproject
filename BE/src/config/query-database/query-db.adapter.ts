import { Connection, Pool, QueryResult } from 'mysql2/promise';

export interface QueryDBAdapter {
  createConnection(): Promise<void>;
  initUserDatabase(): Promise<void>;
  closeConnection(): Promise<void>;
  run(query: string): Promise<QueryResult>;
  getConnection(): Connection;
  getAdminPool(): Pool;
}
