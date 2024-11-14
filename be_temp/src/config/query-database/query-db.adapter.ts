import { Connection, RowDataPacket } from 'mysql2/promise';

export interface QueryDBAdapter {
  createConnection(identify: string): void;
  getConnection(identify: string): Connection;
  closeConnection(identify: string): void;
  run(connection: Connection, query: string): Promise<RowDataPacket[]>;
}
