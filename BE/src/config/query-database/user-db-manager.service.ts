import { Inject, Injectable, Scope } from '@nestjs/common';
import { QueryResult } from 'mysql2/promise';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class UserDBManager {
  constructor(
    @Inject(REQUEST) private readonly request: any,
  ) {}

  async run(query: string): Promise<QueryResult> {
    const connection = await this.request.dbConnection;
    const [result] = await connection.query(query);
    return result;
  }
}
