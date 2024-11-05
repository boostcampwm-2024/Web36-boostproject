import { FieldPacket } from 'mysql2';
import { RowDataPacket } from 'mysql2/promise';

export interface QueryDBAdapter {
  run(query: string): Promise<{ rows: RowDataPacket[]; fields: FieldPacket[] }>;
}
