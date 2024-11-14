import { Module } from '@nestjs/common';
import { ShellController } from './shell.controller';
import { ShellService } from './shell.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shell } from './shell.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shell])],
  controllers: [ShellController],
  providers: [ShellService],
})
export class ShellModule {}