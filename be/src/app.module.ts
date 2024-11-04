import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ShellModule } from './shell/shell.module';
import { QueryModule } from './query/query.module';

@Module({
  imports: [UserModule, ShellModule, QueryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
