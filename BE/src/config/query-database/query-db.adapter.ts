import { Connection, Pool, RowDataPacket } from 'mysql2/promise';

export interface QueryDBAdapter {
  createConnection(identify: string): void;
  initUserDatabase(identify: string): Promise<void>;
  closeConnection(identify: string): void;
  run(sessionId: string, query: string): Promise<RowDataPacket[]>;
  getConnection(identify: string): Connection;
  getAdminPool(): Pool;
}
