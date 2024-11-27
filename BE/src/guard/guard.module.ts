import { Module } from '@nestjs/common';
import { ShellGuard } from './shell.guard';
import { ShellModule } from '../shell/shell.module';

@Module({
  imports: [ShellModule],
  providers: [ShellGuard],
})
export class GuardModule {}
