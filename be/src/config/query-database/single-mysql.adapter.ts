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
      const username = identify.substring(0, 10);
      return await createConnection({
        host: process.env.QUERY_DB_HOST,
        user: username,
        password: identify,
        port: parseInt(process.env.QUERY_DB_PORT || '3306', 10),
        database: identify,
      });
    } catch (e) {
      //해당 database가 없을때
      const username = identify.substring(0, 10);

      const createDatabase = `create database ${identify};`;
      const createUser = `create user '${username}'@'%' identified by '${identify}';`;
      const grantPrivilege = `grant all privileges on ${identify}.* to '${username}'@'%';`; // 사용자 db에 대해서만 권한 부여
      await this.pool.execute(createDatabase);
      await this.pool.execute(createUser);
      await this.pool.execute(grantPrivilege);

      return createConnection({
        host: process.env.QUERY_DB_HOST,
        user: username,
        password: identify,
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

  async dropDatabase(identify: string) {
    try {
      const dropDatabase = `drop database ${identify};`;
      await this.pool.execute(dropDatabase);
    } catch (e) {
      console.error(e);
    }
  }
}
