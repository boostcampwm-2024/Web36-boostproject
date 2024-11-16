import { Connection, RowDataPacket } from 'mysql2/promise';

export interface QueryDBAdapter {
  createConnection(identify: string, existSession: boolean): void;
  closeConnection(identify: string): void;
  run(sessionId: string, query: string): Promise<RowDataPacket[]>;
  getConnection(identify: string): Connection;
}
