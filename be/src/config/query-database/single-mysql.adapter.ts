import dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { QueryDBAdapter } from './query-db.adapter';
import { Connection, createConnection, RowDataPacket } from 'mysql2/promise';

dotenv.config();

@Injectable()
export class SingleMySQLAdapter implements QueryDBAdapter {
  private adminConnection: Connection;
  private userConnectionList: Record<string, Connection> = {};

  constructor() {
    this.createAdminConnection();
  }

  private async createAdminConnection() {
    this.adminConnection = await createConnection({
      host: process.env.QUERY_DB_HOST,
      user: process.env.QUERY_DB_USER,
      password: process.env.QUERY_DB_PASSWORD,
      port: parseInt(process.env.QUERY_DB_PORT || '3306', 10),
    });
  }

  public async createConnection(identify: string) {
    const username = identify.substring(0, 10);

    const createDatabase = `create database ${identify};`;
    const createUser = `create user '${username}'@'%' identified by '${identify}';`;
    const grantPrivilege = `grant all privileges on ${identify}.* to '${username}'@'%';`; // 사용자 db에 대해서만 권한 부여
    await this.adminConnection.execute(createDatabase);
    await this.adminConnection.execute(createUser);
    await this.adminConnection.execute(grantPrivilege);

    const connection = await createConnection({
      host: process.env.QUERY_DB_HOST,
      user: username,
      password: identify,
      port: parseInt(process.env.QUERY_DB_PORT || '3306', 10),
      database: identify,
    });
    this.userConnectionList[identify] = connection;
  }

  public getConnection(identify: string): Connection {
    return this.userConnectionList[identify];
  }

  public async closeConnection(identify: string) {
    await this.userConnectionList[identify].end();
    await this.removeDatabaseInfo(identify);
  }

  public async run(
    connection: Connection,
    query: string,
  ): Promise<RowDataPacket[]> {
    const [rows] = await connection.execute<RowDataPacket[]>(query);
    return rows;
  }

  private async removeDatabaseInfo(identify: string) {
    try {
      const dropDatabase = `drop database ${identify};`;
      await this.adminConnection.execute(dropDatabase);

      const dropUser = `drop user '${identify.substring(0, 10)}';`;
      await this.adminConnection.execute(dropUser);
    } catch (e) {
      // console.error(e);
    }
  }
}
