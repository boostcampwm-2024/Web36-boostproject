import { Connection, RowDataPacket } from 'mysql2/promise';

export interface QueryDBAdapter {
  createConnection(identify: string): Promise<Connection>;
  closeConnection(connection: Connection): void;
  run(connection: Connection, query: string): Promise<RowDataPacket[]>;
}
