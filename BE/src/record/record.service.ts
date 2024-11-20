import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { QueryDBAdapter } from 'src/config/query-database/query-db.adapter';
import { QUERY_DB_ADAPTER } from 'src/config/query-database/query-db.moudle';
import {
  RandomValueGenerator,
  BooleanGenerator,
  CityGenerator,
  CountryGenerator,
  EmailGenerator,
  EnumGenerator,
  NameGenerator,
  NumberGenerator,
  PhoneGenerator,
  SexGenerator,
} from './domain';
import { RandomColumnInfo, RandomRecordInsertDto } from './dto/record.dto';
import { RandomColumnEntity } from './randomColumn.entity';
import fs from 'fs/promises';
import crypto from 'crypto';
import path from 'path';
import { ResultSetHeader } from 'mysql2';

const RANDOM_DATA_TEMP_DIR = 'csvTemp';
const RECORD_PROCESS_BATCH_SIZE = 10000;

const generalDomain = [
  'name',
  'country',
  'city',
  'email',
  'phone',
  'sex',
  'boolean',
];

const TypeToConstructor = {
  name: NameGenerator,
  country: CountryGenerator,
  city: CityGenerator,
  email: EmailGenerator,
  phone: PhoneGenerator,
  sex: SexGenerator,
  boolean: BooleanGenerator,
};

@Injectable()
export class RecordService implements OnModuleInit {
  constructor(
    @Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
  ) {}

  async onModuleInit() {
    try {
      await fs.access(RANDOM_DATA_TEMP_DIR);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.mkdir(RANDOM_DATA_TEMP_DIR, { recursive: true });
        console.log('csvTemp 폴더를 생성했습니다.');
      } else {
        console.error('폴더 확인 중 오류 발생 : ', err);
      }
    }
  }

  private toEntity(column: RandomColumnInfo): RandomColumnEntity {
    let generator: RandomValueGenerator<any>;
    if (generalDomain.includes(column.type))
      generator = new TypeToConstructor[column.type]();
    if (column.type === 'enum') generator = new EnumGenerator(column.enum);
    if (column.type === 'number')
      generator = new NumberGenerator(column.min ?? 0, column.max ?? 100);
    return {
      name: column.name,
      type: column.type,
      generator,
      data: [],
      blank: column.blank,
    };
  }

  private async generateCsvFile(
    sid: string,
    columnEntities: RandomColumnEntity[],
    rows: number,
  ): Promise<string> {
    const randomString = crypto.randomBytes(4).toString('hex');
    const filePath = path.join(
      RANDOM_DATA_TEMP_DIR,
      `${sid}.${randomString}.csv`,
    );
    const header = this.generateCsvHeader(columnEntities);
    await fs.writeFile(filePath, header);

    let remainRows = rows;
    while (remainRows > 0) {
      const batchSize = Math.min(remainRows, RECORD_PROCESS_BATCH_SIZE);
      const data = this.generateCsvData(columnEntities, batchSize);
      try {
        await fs.writeFile(filePath, data, { flag: 'a' });
      } catch (err) {
        console.error(err);
        throw new InternalServerErrorException({
          message: 'CSV 파일 쓰기 실패',
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
    sid: string,
    csvFilePath: string,
    tableName: string,
    columnNames: string[],
  ): Promise<ResultSetHeader> {
    const sql = `
      LOAD DATA LOCAL INFILE \'${csvFilePath.replace(/\\/g, '\\\\')}\'
      INTO TABLE ${tableName}
      FIELDS TERMINATED BY ',' 
      LINES TERMINATED BY '\\n'
      IGNORE 1 ROWS
      \(${columnNames.map((col) => `\`${col}\``).join(',')}\);
    `;
    let queryResult: ResultSetHeader;

    try {
      queryResult = (await this.queryDBAdapter.run(
        sid,
        sql,
      )) as unknown as ResultSetHeader;
    } catch (err) {
      console.error('Error while inserting data into DB:', err);
      throw new InternalServerErrorException({
        message: 'DB .csv load Data 실패',
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
      console.error('Error while deleting the file:', err);
      throw new InternalServerErrorException({
        message: 'CSV 파일 쓰기 실패',
        error: err.message,
      });
    }
  }

  async insertRandomRecord(
    sid: string,
    recordDto: RandomRecordInsertDto,
  ): Promise<object> {
    const columnEntities: RandomColumnEntity[] = recordDto.columns.map(
      (column) => this.toEntity(column),
    );
    const columnNames = columnEntities.map((column) => column.name);

    const csvFilePath = await this.generateCsvFile(
      sid,
      columnEntities,
      recordDto.count,
    );

    const result = await this.insertCsvIntoDB(
      sid,
      csvFilePath,
      recordDto.tableName,
      columnNames,
    );
    await this.deleteFile(csvFilePath);

    return {
      status: result.affectedRows === recordDto.count,
      text: `${recordDto.tableName} 에 랜덤 레코드 ${result.affectedRows}개 삽입되었습니다.`,
    };
  }
}
