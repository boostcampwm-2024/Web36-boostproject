import { Injectable, OnModuleInit } from '@nestjs/common';
import fs from 'fs/promises';
import { RANDOM_DATA_TEMP_DIR } from './constant/random-record.constant';

@Injectable()
export class RecordInitializeService implements OnModuleInit {
  async onModuleInit() {
    try {
      await fs.access(RANDOM_DATA_TEMP_DIR);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.mkdir(RANDOM_DATA_TEMP_DIR, { recursive: true });
      } else {
        console.error('csv 폴더 접근 오류: ', err);
      }
    }
  }
}
