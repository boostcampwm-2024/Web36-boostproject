import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

@Injectable()
export class UsageService {
  MAX_DISK_USAGE_KB = 300;

  public async getDiskUsage(identify: string) {
    const execPromise = promisify(exec);
    const getDiskUsageCommand = `du -sk ../db/query/${identify}`;
    const { stdout } = await execPromise(getDiskUsageCommand);
    const usageSizeKb = parseInt(stdout.split('\t')[0], 10) | 0;
    return usageSizeKb;
  }

  public async detectFullUsage(sessionId: string, addData: number = 65) {
    const currentdiskUsage = await this.getDiskUsage(sessionId);
    if (currentdiskUsage + addData > this.MAX_DISK_USAGE_KB) {
      return true;
    }
    return false;
  }
}
