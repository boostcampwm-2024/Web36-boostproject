import { RowDataPacket } from 'mysql2/promise';

export interface QueryDBAdapter {
  createConnection(identify: string): void;
  closeConnection(identify: string): void;
  run(sessionId: string, query: string): Promise<RowDataPacket[]>;
}
