import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import fs from 'fs/promises';
import {
  RANDOM_DATA_TEMP_DIR,
  RECORD_PROCESS_BATCH_SIZE,
} from './constant/random-record.constant';
import { UserDBManager } from '../config/query-database/user-db-manager.service';
import { RandomColumnModel } from './random-column.entity';
import * as path from 'node:path';
import { ResultSetHeader } from 'mysql2/promise';
import * as crypto from 'node:crypto';

@Injectable()
export class FileService implements OnModuleInit {
  constructor(private readonly userDBManager: UserDBManager) {}

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

  async generateCsvFile(
    columnEntities: RandomColumnModel[],
    rows: number,
  ): Promise<string> {
    const randomString = crypto.randomBytes(10).toString('hex');
    const filePath = path.join(RANDOM_DATA_TEMP_DIR, `${randomString}.csv`);
    const header = this.generateCsvHeader(columnEntities);
    await fs.writeFile(filePath, header);

    let remainRows = rows;
    while (remainRows > 0) {
      const batchSize = Math.min(remainRows, RECORD_PROCESS_BATCH_SIZE);
      const data = this.generateCsvData(columnEntities, batchSize);
      try {
        await fs.writeFile(filePath, data, { flag: 'a' });
      } catch (err) {
        console.error('CSV 파일 쓰기 실패:', err);
        throw new InternalServerErrorException({
          message: 'CSV 파일 쓰기 실패:: ' + err.message,
          error: err.message,
        });
      }
      remainRows -= batchSize;
    }
    return filePath;
  }

  async insertCsvIntoDB(
    req: any,
    csvFilePath: string,
    tableName: string,
    columnNames: string[],
  ): Promise<ResultSetHeader> {
    const query = `
      LOAD DATA LOCAL INFILE \'${csvFilePath.replace(/\\/g, '\\\\')}\'
      INTO TABLE ${tableName}
      FIELDS TERMINATED BY ','
      LINES TERMINATED BY '\\n'
      IGNORE 1 ROWS
      \(${columnNames.map((col) => `\`${col}\``).join(',')}\);
    `;
    let queryResult: ResultSetHeader;

    try {
      queryResult = (await this.userDBManager.run(
        req,
        query,
      )) as ResultSetHeader;
    } catch (err) {
      throw new InternalServerErrorException({
        message: '랜덤 데이터 DB 삽입중 에러:' + err.message,
        error: err.message,
      });
    }

    return queryResult;
  }

  async deleteFile(filePath: string) {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'CSV 파일 삭제 실패: ' + err.message,
        error: err.message,
      });
    }
  }

  private generateCsvHeader(columnEntities: RandomColumnModel[]): string {
    return columnEntities.map((column) => column.name).join(', ') + '\n';
  }

  private generateCsvData(
    columnEntities: RandomColumnModel[],
    rows: number,
  ): string {
    let data = columnEntities.map((column) =>
      column.generator.getRandomValues(rows, column.blank),
    );
    data = this.transpose(data);
    return data.map((row) => row.join(',')).join('\n') + '\n';
  }

  private transpose(matrix) {
    return matrix.reduce(
      (acc, row) => row.map((_, i) => [...(acc[i] || []), row[i]]),
      [],
    );
  }
}
