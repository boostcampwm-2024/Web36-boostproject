import {
  Injectable,
  Scope,
  Inject,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryDBAdapter } from './query-db.adapter';
import { Request } from 'express';
import {
  Connection,
  ConnectionOptions,
  createConnection,
  Pool,
} from 'mysql2/promise';
import { REQUEST } from '@nestjs/core';
import { SingleMySQLConnectionManager } from './single-mysql-connection-manager';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';

@Injectable({ scope: Scope.REQUEST })
export class SingleMySQLAdapter implements QueryDBAdapter {
  constructor(
    private singleMySQLConnectionManager: SingleMySQLConnectionManager,
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService,
  ) {}

  private getSID(): string {
    return this.request.sessionID;
  }

  getAdminPool(): Pool {
    return this.singleMySQLConnectionManager.getAdminPool();
  }

  getConnection(): Connection {
    return this.singleMySQLConnectionManager.getConnection(this.getSID());
  }

  public async initUserDatabase() {
    const adminConnection = this.singleMySQLConnectionManager.getAdminPool();
    const identify = this.getSID();
    try {
      const connectInfo = {
        name: identify.substring(0, 10),
        password: identify,
        host: '%',
        database: identify,
      };

      await adminConnection.query(`create database ${connectInfo.database};`);
      await adminConnection.query(
        `create user '${connectInfo.name}'@'${connectInfo.host}' identified by '${connectInfo.password}';`,
      );
      await adminConnection.query(
        `grant all privileges on ${connectInfo.database}.* to '${connectInfo.name}'@'${connectInfo.host}';`,
      );
    } catch (error) {
      if (error.code === 'ER_DB_CREATE_EXISTS') {
        throw new ConflictException(
          `Database already exists for user: ${identify}`,
        );
      }
      throw new InternalServerErrorException(
        `Database initialization failed for user: ${identify}`,
      );
    }
  }

  public async createConnection() {
    const identify = this.getSID();
    let userConnection = this.singleMySQLConnectionManager.getConnection(
      this.getSID(),
    );
    if (!userConnection) {
      userConnection = await createConnection({
        host: this.configService.get<string>('QUERY_DB_HOST'),
        user: identify.substring(0, 10),
        password: identify,
        port: this.configService.get<number>('QUERY_DB_PORT', 3306),
        database: identify,
        infileStreamFactory: (path) => {
          return createReadStream(path);
        },
      } as ConnectionOptions);
      this.singleMySQLConnectionManager.setConnection(identify, userConnection);
    }
    await this.run('set profiling = 1;');
  }

  public async closeConnection() {
    await this.singleMySQLConnectionManager.closeConnection(this.getSID());
    await this.removeDatabaseInfo();
    this.singleMySQLConnectionManager.deleteConnection(this.getSID());
  }

  public async run(query: string) {
    const connection = this.getConnection();
    const [result] = await connection.query(query);
    return result;
  }

  private async removeDatabaseInfo() {
    try {
      const adminConnection = this.singleMySQLConnectionManager.getAdminPool();
      const dropDatabase = `drop database ${this.getSID()};`;
      await adminConnection.execute(dropDatabase);

      const dropUser = `drop user '${this.getSID().substring(0, 10)}';`;
      await adminConnection.execute(dropUser);
    } catch (e) {
      console.error(e);
    }
  }
}
