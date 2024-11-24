import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, createPool, Pool } from 'mysql2/promise';

@Injectable()
export class SingleMySQLConnectionManager implements OnModuleInit {
  private adminConnection: Pool;
  private userConnectionList: Record<string, Connection> = {};

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.createAdminConnection();
  }

  private createAdminConnection() {
    this.adminConnection = createPool({
      host: this.configService.get<string>('QUERY_DB_HOST'),
      user: this.configService.get<string>('QUERY_DB_USER'),
      password: this.configService.get<string>('QUERY_DB_PASSWORD'),
      port: this.configService.get<number>('QUERY_DB_PORT', 3306),
      connectionLimit: 10,
    });
  }

  public getConnection(identify: string): Connection {
    return this.userConnectionList[identify];
  }

  public setConnection(identify: string, connection: Connection) {
    this.userConnectionList[identify] = connection;
  }

  public getAdminPool() {
    return this.adminConnection;
  }

  public async closeConnection(identify: string) {
    await this.userConnectionList[identify].end();
  }

  public deleteConnection(identify: string) {
    delete this.userConnectionList[identify];
  }
}
