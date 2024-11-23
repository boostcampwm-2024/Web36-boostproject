import { Injectable, Scope, Inject } from '@nestjs/common';
import { QueryDBAdapter } from './query-db.adapter';
import { Request } from 'express';
import { Connection, Pool } from 'mysql2/promise';
import { REQUEST } from '@nestjs/core';
import { SingleMySQLConnectionManager } from './single-mysql-connection-manager';

@Injectable({ scope: Scope.REQUEST })
export class SingleMySQLAdapter implements QueryDBAdapter {
  constructor(
    private singleMySQLConnectionManager: SingleMySQLConnectionManager,
    @Inject(REQUEST) private readonly request: Request,
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
    await this.singleMySQLConnectionManager.initUserDatabase(this.getSID());
  }

  public async createConnection() {
    await this.singleMySQLConnectionManager.createConnection(this.getSID());
    await this.run('set profiling = 1;');
  }

  public async closeConnection() {
    await this.singleMySQLConnectionManager.createConnection(this.getSID());
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
