import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { EnumGenerator, NumberGenerator, RandomValueGenerator } from './domain';
import {
  CreateRandomRecordDto,
  RandomColumnInfo,
} from './dto/create-random-record.dto';
import { RandomColumnEntity } from './random-column.entity';
import fs from 'fs/promises';
import crypto from 'crypto';
import path from 'path';
import { ResultSetHeader } from 'mysql2';
import { ResRecordDto } from './dto/res-record.dto';
import {
  generalDomain,
  RANDOM_DATA_TEMP_DIR,
  RECORD_PROCESS_BATCH_SIZE,
  TypeToConstructor,
} from './constant/random-record.constant';
import { UserDBManager } from '../config/query-database/user-db-manager.service';

@Injectable()
export class RecordService implements OnModuleInit {
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

  async insertRandomRecord(
    req: any,
    createRandomRecordDto: CreateRandomRecordDto,
  ): Promise<ResRecordDto> {
    const columnEntities: RandomColumnEntity[] =
      createRandomRecordDto.columns.map((column) => this.toEntity(column));
    const columnNames = columnEntities.map((column) => column.name);

    const csvFilePath = await this.generateCsvFile(
      columnEntities,
      createRandomRecordDto.count,
    );

    const result = await this.insertCsvIntoDB(
      req,
      csvFilePath,
      createRandomRecordDto.tableName,
      columnNames,
    );

    await this.deleteFile(csvFilePath);

    return new ResRecordDto({
      status: result.affectedRows === createRandomRecordDto.count,
      text: `${createRandomRecordDto.tableName} 에 랜덤 레코드 ${result.affectedRows}개 삽입되었습니다.`,
    });
  }

  private toEntity(randomColumnInfo: RandomColumnInfo): RandomColumnEntity {
    let generator: RandomValueGenerator<any>;
    if (generalDomain.includes(randomColumnInfo.type))
      generator = new TypeToConstructor[randomColumnInfo.type]();
    if (randomColumnInfo.type === 'enum')
      generator = new EnumGenerator(randomColumnInfo.enum);
    if (randomColumnInfo.type === 'number')
      generator = new NumberGenerator(
        randomColumnInfo.min ?? 0,
        randomColumnInfo.max ?? 100,
      );
    return {
      name: randomColumnInfo.name,
      type: randomColumnInfo.type,
      generator,
      data: [],
      blank: randomColumnInfo.blank,
    };
  }

  private async generateCsvFile(
    columnEntities: RandomColumnEntity[],
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

  private transpose(matrix) {
    return matrix.reduce(
      (acc, row) => row.map((_, i) => [...(acc[i] || []), row[i]]),
      [],
    );
  }

  private generateCsvHeader(columnEntities: RandomColumnEntity[]): string {
    return columnEntities.map((column) => column.name).join(', ') + '\n';
  }

  private generateCsvData(
    columnEntities: RandomColumnEntity[],
    rows: number,
  ): string {
    let data = columnEntities.map((column) =>
      column.generator.getRandomValues(rows, column.blank),
    );
    data = this.transpose(data);
    return data.map((row) => row.join(',')).join('\n') + '\n';
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
      console.error('랜덤 데이터 DB 삽입중 에러:', err);
      throw new InternalServerErrorException({
        message: '랜덤 데이터 DB 삽입중 에러:' + err.message,
        error: err.message,
      });
    }

    return queryResult;
  }

  private async deleteFile(filePath: string): Promise<boolean> {
    try {
      await fs.unlink(filePath);
      return true;
    } catch (err) {
      console.error('CSV 파일 삭제 실패:', err);
      throw new InternalServerErrorException({
        message: 'CSV 파일 삭제 실패: ' + err.message,
        error: err.message,
      });
    }
  }
}
