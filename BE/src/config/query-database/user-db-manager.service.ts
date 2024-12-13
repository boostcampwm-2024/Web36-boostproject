import { Injectable } from '@nestjs/common';
import { QueryResult } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserDBManager {
  constructor(private readonly configService: ConfigService) {}
  async run(req: any, query: string): Promise<QueryResult> {
    const connection = await req.dbConnection;
    const [result] = await connection.query(query);
    return result;
  }
}
