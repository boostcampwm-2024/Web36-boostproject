import {
  Connection,
  Pool, QueryResult,
} from 'mysql2/promise';


export interface QueryDBAdapter {
  createConnection(identify: string): void;
  initUserDatabase(identify: string): Promise<void>;
  closeConnection(identify: string): void;
  run(identify: string, query: string): Promise<QueryResult>;
  getConnection(identify: string): Connection;
  getAdminPool(): Pool;
}
