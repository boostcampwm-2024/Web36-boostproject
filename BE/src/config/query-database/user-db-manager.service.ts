import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { createConnection, QueryResult } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class UserDBManager {
  constructor(
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async run(query: string): Promise<QueryResult> {
    const connection = await this.createConnection();
    try {
      const [result] = await connection.query(query);
      return result;
    } finally {
      await connection.end();
    }
  }

  private async createConnection() {
    const identify = this.request.sessionID;
    return createConnection({
      host: this.configService.get<string>('QUERY_DB_HOST'),
      user: identify.substring(0, 10),
      password: identify,
      port: this.configService.get<number>('QUERY_DB_PORT', 3306),
      database: identify,
    });
  }
}
