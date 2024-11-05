import dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { QueryDBAdapter } from './query-db.adapter';
import { createPool, Pool, RowDataPacket } from 'mysql2/promise';
import { FieldPacket } from 'mysql2';

dotenv.config();

@Injectable()
export class SingleMySQLAdapter implements QueryDBAdapter {
  private pool: Pool;

  constructor() {
    this.initializePool();
  }

  private initializePool() {
    this.pool = createPool({
      host: process.env.QUERY_DB_HOST,
      user: process.env.QUERY_DB_USER,
      password: process.env.QUERY_DB_PASSWORD,
      port: parseInt(process.env.QUERY_DB_PORT || '3306', 10),
      connectionLimit: 10,
    });
  }

  async run(
    query: string,
  ): Promise<{ rows: RowDataPacket[]; fields: FieldPacket[] }> {
    if (!this.pool) {
      this.initializePool();
    }
    try {
      const [rows, fields] = await this.pool.execute<RowDataPacket[]>(query);
      return { rows, fields };
    } catch (e) {
      throw Error(e);
    }
  }
}
