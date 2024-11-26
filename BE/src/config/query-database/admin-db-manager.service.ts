import {ConflictException, Injectable, InternalServerErrorException, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {createPool, Pool, QueryResult} from 'mysql2/promise';

@Injectable()
export class AdminDBManager implements OnModuleInit {
  private adminConnection: Pool;

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
  async run(query:string,params?:string[]) : Promise<QueryResult>{
    const [result] = await this.adminConnection.query(query,params);
    return result;
  }

  public async initUserDatabase(identify :string) {
    try {
      const connectInfo = {
        name: identify.substring(0, 10),
        password: identify,
        host: '%',
        database: identify,
      };

      await this.run(`create database ${connectInfo.database};`);
      await this.run(
          `create user '${connectInfo.name}'@'${connectInfo.host}' identified by '${connectInfo.password}';`,
      );
      await this.run(
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

  public async removeDatabaseInfo(identify:string) {
    try {
      const dropDatabase = `drop database ${identify};`;
      await this.run(dropDatabase);
      const dropUser = `drop user '${identify.substring(0, 10)}';`;
      await this.run(dropUser);
    } catch (e) {
      console.error(e);
    }
  }

}
