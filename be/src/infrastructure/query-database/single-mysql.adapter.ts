import dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { QueryDBAdapter } from './query-db.adapter';
import {
  Connection,
  createConnection,
  createPool,
  Pool,
  RowDataPacket,
} from 'mysql2/promise';

dotenv.config();

@Injectable()
export class SingleMySQLAdapter implements QueryDBAdapter {
  private pool: Pool;

  constructor() {
    this.createPool();
  }

  private createPool() {
    this.pool = createPool({
      host: process.env.QUERY_DB_HOST,
      user: process.env.QUERY_DB_USERNAME,
      password: process.env.QUERY_DB_PASSWORD,
      port: parseInt(process.env.QUERY_DB_PORT || '3306', 10),
      connectionLimit: 10,
    });
  }

  public async createConnection(identify: string) {
    try {
      return await createConnection({
        host: process.env.QUERY_DB_HOST,
        user: process.env.QUERY_DB_USERNAME,
        password: process.env.QUERY_DB_PASSWORD,
        port: parseInt(process.env.QUERY_DB_PORT || '3306', 10),
        database: identify,
      });
    } catch (e) {
      //해당 database가 없을때
      const createDatabase = `create database ${identify};`;
      await this.pool.execute(createDatabase);
      return createConnection({
        host: process.env.QUERY_DB_HOST,
        user: process.env.QUERY_DB_USERNAME,
        password: process.env.QUERY_DB_PASSWORD,
        port: parseInt(process.env.QUERY_DB_PORT || '3306', 10),
        database: identify,
      });
    }
  }

  public async closeConnection(connection: Connection) {
    await connection.end();
  }

  async run(connection: Connection, query: string): Promise<RowDataPacket[]> {
    const [rows] = await connection.execute<RowDataPacket[]>(query);
    return rows;
  }
}
