import { Module } from '@nestjs/common';
import { ShellGuard } from './shell.guard';
import { ShellService } from '../shell/shell.service';

@Module({
  imports: [ShellService],
  providers: [ShellGuard],
})
export class GuardModule {}
