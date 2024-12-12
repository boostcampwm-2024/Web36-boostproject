import { Injectable } from '@nestjs/common';
import {Connection, createConnection, QueryResult} from 'mysql2/promise';
import { createReadStream } from 'fs';
import { ConfigService } from '@nestjs/config';
import { ConnectionLimitExceedException } from '../../common/exception/custom-exception';

@Injectable()
export class UserDBManager {
  constructor(private readonly configService: ConfigService) {}
  async run(req: any, query: string): Promise<QueryResult> {
    const connection = await req.dbConnection;
    const [result] = await connection.query(query);
    return result;
  }

  async runWithNewConnection(req: any, query: string): Promise<QueryResult> {
    let dbConnection: Connection;
    const identify = req.sessionID;
    try {
      dbConnection = await createConnection({
        host: this.configService.get<string>('QUERY_DB_HOST'),
        user: identify.substring(0, 10),
        password: identify,
        port: this.configService.get<number>('QUERY_DB_PORT', 3306),
        database: identify.substring(0, 10),
        infileStreamFactory: (path) => {
          return createReadStream(path);
        },
      });
    } catch (err) {
      if (err.errno == 1040) {
        throw new ConnectionLimitExceedException();
      }
      throw err;
    }
    const [result] = await dbConnection.query(query);
    await dbConnection.end();
    return result;
  }
}
