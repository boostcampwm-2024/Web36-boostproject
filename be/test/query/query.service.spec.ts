import { QueryService } from '../../src/query/query.service';
import { NotFoundException } from '@nestjs/common';
import { QueryDto } from '../../src/query/dto/query.dto';
import { QueryDBAdapter } from '../../src/config/query-database/query-db.adapter';
import { Repository } from 'typeorm';
import { Shell } from '../../src/shell/shell.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { QUERY_DB_ADAPTER } from '../../src/config/query-database/query-db.moudle';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, RowDataPacket } from 'mysql2/promise';

describe('QueryService', () => {
  let queryService: QueryService;
  let mockQueryDBAdapter: QueryDBAdapter;
  let mockShellRepository: Repository<Shell>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryService,
        {
          provide: QUERY_DB_ADAPTER,
          useValue: {
            createConnection: jest.fn(),
            run: jest.fn(),
            closeConnection: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Shell),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    queryService = module.get<QueryService>(QueryService);
    mockQueryDBAdapter = module.get<QueryDBAdapter>(QUERY_DB_ADAPTER);
    mockShellRepository = module.get<Repository<Shell>>(
      getRepositoryToken(Shell),
    );
  });

  describe('특정 조건을 만족하지 않으면 에러를 반환한다.', () => {
    it('shell-id에 대한 쉘이 존재하지 않으면 에러를 반환한다.', async () => {
      jest.spyOn(mockShellRepository, 'findOne').mockResolvedValue(null);

      await expect(
        queryService.execute('sessionId', 1, {
          query: 'SELECT * FROM users',
        } as QueryDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('테이블 결과값은 최대 100개 까지만 반환한다.', () => {
    const shellId = 1;
    const sessionId = 'sessionId';
    const queryDto: QueryDto = { query: 'SELECT * FROM users' };

    beforeEach(() => {
      jest
        .spyOn(mockShellRepository, 'findOne')
        .mockResolvedValue({ shellId: 1 } as Shell);
      jest
        .spyOn(mockQueryDBAdapter, 'createConnection')
        .mockResolvedValue({} as Connection);
    });

    it('테이블 결과값이 100개가 넘어가면 100개만 반환한다..', async () => {
      jest
        .spyOn(mockQueryDBAdapter, 'run')
        .mockResolvedValue(
          Array.from({ length: 101 }, () => ({ id: 1 })) as RowDataPacket[],
        );
      const result: Shell = await queryService.execute(
        sessionId,
        shellId,
        queryDto,
      );

      expect(Object.keys(result.resultTable).length).toBe(100);
    });

    it('테이블 결과값이 100개보다 적으면 해당 개수만큼만 반환한다.', async () => {
      jest
        .spyOn(mockQueryDBAdapter, 'run')
        .mockResolvedValue(
          Array.from({ length: 99 }, () => ({ id: 1 })) as RowDataPacket[],
        );

      const result: Shell = await queryService.execute(
        sessionId,
        shellId,
        queryDto,
      );

      expect(Object.keys(result.resultTable).length).toBe(99);
    });
  });
});
