import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { User } from '../../user/user.entity';
import { Shell } from '../../shell/shell.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Shell],
      synchronize: false,
    }),
  ],
  exports: [TypeOrmModule],
})
export class ServiceDBModule {}
