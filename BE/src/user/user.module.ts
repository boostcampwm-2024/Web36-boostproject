import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { QueryDBModule } from 'src/config/query-database/query-db.moudle';

@Module({
  imports: [QueryDBModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
