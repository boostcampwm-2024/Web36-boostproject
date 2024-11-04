import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { QueryDBAdapter } from './query-db.adapter';
import { Connection } from 'mysql2/promise';

dotenv.config();

@Injectable()
export class SingleMySQLAdapter implements QueryDBAdapter {
  async connect(identify: string): Promise<Connection> {
    return createConnection({
      host: process.env.QUERY_DB_HOST,
      user: process.env.QUERY_DB_USER,
      password: process.env.QUERY_DB_PASSWORD,
      database: identify,
      port: parseInt(process.env.QUERY_DB_PORT || '3306', 10),
    });
  }
}
