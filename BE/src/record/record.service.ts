import { BadRequestException, Injectable } from '@nestjs/common';
import { EnumGenerator, NumberGenerator, RandomValueGenerator } from './domain';
import {
  CreateRandomRecordDto,
  RandomColumnInfo,
} from './dto/create-random-record.dto';
import { RandomColumnModel } from './random-column.entity';
import { ResRecordDto } from './dto/res-record.dto';
import {
  DomainToTypes,
  generalDomain,
  mysqlToJsType,
  TypeToConstructor,
} from './constant/random-record.constant';
import { UsageService } from '../usage/usage.service';
import { FileService } from './file.service';
import { TableService } from '../table/table.service';
import { ResTableDto } from '../table/dto/res-table.dto';

@Injectable()
export class RecordService {
  constructor(
    private readonly usageService: UsageService,
    private readonly tableService: TableService,
    private readonly fileService: FileService,
  ) {}

  async validateDto(
    createRandomRecordDto: CreateRandomRecordDto,
    identify: string,
  ) {
    const tableInfo: ResTableDto = (await this.tableService.find(
      identify,
      createRandomRecordDto.tableName,
    )) as ResTableDto;

    if (!tableInfo?.tableName)
      throw new BadRequestException(
        `${createRandomRecordDto.tableName} 테이블이 존재하지 않습니다.`,
      );

    const baseColumns = tableInfo.columns;
    const columnInfos: RandomColumnInfo[] = createRandomRecordDto.columns;

    columnInfos.forEach((columnInfo) => {
      const targetName = columnInfo.name;
      const targetDomain = columnInfo.type;
      const baseColumn = baseColumns.find(
        (column) => column.name === columnInfo.name,
      );

      if (!baseColumn)
        throw new BadRequestException(
          `${targetName} 컬럼이 ${createRandomRecordDto.tableName} 에 존재하지 않습니다.`,
        );

      if (!this.checkDomainAvailability(baseColumn.type, targetDomain))
        throw new BadRequestException(
          `${targetName}(${baseColumn.type}) 컬럼에 ${targetDomain} 랜덤 값을 넣을 수 없습니다.`,
        );
    });
  }

  checkDomainAvailability(mysqlType: string, targetDomain: string) {
    const baseType = mysqlToJsType(mysqlType);
    const targetType = DomainToTypes[targetDomain];
    return !(baseType === 'number' && targetType === 'string');
  }
  async insertRandomRecord(
    req: any,
    createRandomRecordDto: CreateRandomRecordDto,
  ): Promise<ResRecordDto> {
    const columnEntities: RandomColumnModel[] =
      createRandomRecordDto.columns.map((column) => this.toEntity(column));
    const columnNames = columnEntities.map((column) => column.name);

    const csvFilePaths = await this.fileService.generateCsvFile(
      columnEntities,
      createRandomRecordDto.count,
    );

    const affectedRows = await this.fileService.loadCSVFilesToDB(
      req,
      csvFilePaths,
      createRandomRecordDto.tableName,
      columnNames,
    );

    for (const csvFilepath of csvFilePaths) {
      this.fileService.deleteFile(csvFilepath);
    }

    await this.usageService.updateRowCount(req);

    return new ResRecordDto({
      status: affectedRows === createRandomRecordDto.count,
      text: `${createRandomRecordDto.tableName} 에 랜덤 레코드 ${affectedRows}개 삽입되었습니다.`,
    });
  }

  private toEntity(randomColumnInfo: RandomColumnInfo): RandomColumnModel {
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
}
