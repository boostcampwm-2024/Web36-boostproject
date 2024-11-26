import {Inject, Injectable, OnModuleDestroy, Scope} from '@nestjs/common';
import {Request} from 'express';
import {Connection, createConnection, QueryResult} from 'mysql2/promise';
import {ConfigService} from '@nestjs/config';
import {REQUEST} from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class UserDBManager implements OnModuleDestroy {
  private connection: Connection;

  constructor(
      private readonly configService: ConfigService,
      @Inject(REQUEST) private readonly request: Request,
  ) {}

  onModuleDestroy() {
    if (this.connection) {
      this.connection.end();
    }
  }

  async run(query: string) : Promise<QueryResult> {
    if (!this.connection) {
      await this.createConnection();
    }
    const [result] = await this.connection.query(query);
    return result;
  }

  private async createConnection() {
    const identify = this.request.sessionID;
    this.connection = await createConnection({
      host: this.configService.get<string>('QUERY_DB_HOST'),
      user: identify.substring(0, 10),
      password: identify,
      port: this.configService.get<number>('QUERY_DB_PORT', 3306),
      database: identify,
    });
  }

}