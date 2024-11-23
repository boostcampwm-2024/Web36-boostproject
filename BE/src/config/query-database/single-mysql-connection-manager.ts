import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import {
  Connection,
  ConnectionOptions,
  createConnection,
  createPool,
  Pool,
} from 'mysql2/promise';

@Injectable()
export class SingleMySQLConnectionManager implements OnModuleInit {
  private adminConnection: Pool;
  private userConnectionList: Record<string, Connection> = {};

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.createAdminConnection();
  }

  public getConnection(identify: string): Connection {
    return this.userConnectionList[identify];
  }

  public getAdminPool() {
    return this.adminConnection;
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

  public async createConnection(identify: string) {
    if (!this.getConnection(identify)) {
      this.userConnectionList[identify] = await createConnection({
        host: this.configService.get<string>('QUERY_DB_HOST'),
        user: identify.substring(0, 10),
        password: identify,
        port: this.configService.get<number>('QUERY_DB_PORT', 3306),
        database: identify,
        infileStreamFactory: (path) => {
          return createReadStream(path);
        },
      } as ConnectionOptions);
    }
  }

  public async initUserDatabase(identify: string) {
    try {
      const connectInfo = {
        name: identify.substring(0, 10),
        password: identify,
        host: '%',
        database: identify,
      };

      await this.adminConnection.query(
        `create database ${connectInfo.database};`,
      );
      await this.adminConnection.query(
        `create user '${connectInfo.name}'@'${connectInfo.host}' identified by '${connectInfo.password}';`,
      );
      await this.adminConnection.query(
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

  public async closeConnection(identify: string) {
    await this.userConnectionList[identify].end();
  }

  public deleteConnection(identify: string) {
    delete this.userConnectionList[identify];
  }
}
