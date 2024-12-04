import { RecordService } from '../../src/record/record.service';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { TableService } from '../../src/table/table.service';
import { UsageService } from '../../src/usage/usage.service';
import { ResultSetHeader } from 'mysql2/promise';
import { FileService } from '../../src/record/file.service';
import { CreateRandomRecordDto } from '../../src/record/dto/create-random-record.dto';
import { ResTableDto } from '../../src/table/dto/res-table.dto';
import { BadRequestException } from '@nestjs/common';

const TEST_SESSION_ID = 'db12345678';

const mockFileService = mock<FileService>();
const mockTableService = mock<TableService>();
const mockUsageService = mock<UsageService>();

describe('RecordService', () => {
  let recordService: RecordService;

  beforeAll(() => {
    mockFileService.generateCsvFile.mockResolvedValue('/csvTemp/test.csv');
    mockFileService.insertCsvIntoDB.mockResolvedValue({
      affectedRows: 1,
    } as ResultSetHeader);
    mockUsageService.getRowCount.mockResolvedValue({
      currentUsage: 1,
      availUsage: 10,
    });
    mockUsageService.getRowCount.mockResolvedValue({
      currentUsage: 1,
      availUsage: 10,
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordService,
        { provide: FileService, useValue: mockFileService },
        { provide: TableService, useValue: mockTableService },
        { provide: UsageService, useValue: mockUsageService },
      ],
    }).compile();

    recordService = module.get<RecordService>(RecordService);
  });

  it('요청한 테이블이 존재하지 않으면 에러를 반환한다.', async () => {
    // given
    const TEST_BODY = {
      tableName: 'test1',
    } as CreateRandomRecordDto;

    // when
    mockTableService.find.mockResolvedValue({} as ResTableDto);

    // then
    await expect(
      recordService.validateDto(TEST_BODY, TEST_SESSION_ID),
    ).rejects.toThrow(BadRequestException);
  });

  it('문자열 도메인을 숫자 타입으로 된 컬럼에 넣을 수 없다.', async () => {
    // given
    const TEST_BODY = {
      tableName: 'test1',
      columns: [{ name: 'age', type: 'name' }],
    } as CreateRandomRecordDto;

    // when
    mockTableService.find.mockResolvedValue({
      tableName: 'test1',
      columns: [{ name: 'age', type: 'INT' }],
    } as ResTableDto);

    // then
    await expect(
      recordService.validateDto(TEST_BODY, TEST_SESSION_ID),
    ).rejects.toThrow(BadRequestException);
  });
});
