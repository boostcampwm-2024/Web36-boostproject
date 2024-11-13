import { QueryService } from '../../src/query/query.service';
import { QueryDto } from '../../src/query/dto/query.dto';
import { QueryDBAdapter } from '../../src/config/query-database/query-db.adapter';
import { Test, TestingModule } from '@nestjs/testing';
import { QUERY_DB_ADAPTER } from '../../src/config/query-database/query-db.moudle';
import { Connection } from 'mysql2/promise';
import { ShellService } from '../../src/shell/shell.service';

describe('QueryService', () => {
  let queryService: QueryService;
  let mockQueryDBAdapter: QueryDBAdapter;
  let mockShellService: ShellService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryService,
        {
          provide: QUERY_DB_ADAPTER,
          useValue: {
            getConnection: jest.fn(),
            run: jest.fn(),
          },
        },
        {
          provide: ShellService,
          useValue: {
            findShellOrThrow: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    queryService = module.get<QueryService>(QueryService);
    mockQueryDBAdapter = module.get<QueryDBAdapter>(QUERY_DB_ADAPTER);
    mockShellService = module.get<ShellService>(ShellService);
  });

  describe('테이블 결과값은 최대 100개 까지만 반환한다.', () => {
    const shellId = 1;
    const sessionId = 'sessionId';
    const queryDto: QueryDto = { query: 'SELECT * FROM users' };

    beforeEach(() => {
      jest.spyOn(mockShellService, 'findShellOrThrow').mockResolvedValue(null);
    });

    it('테이블 결과값이 100개가 넘어가면 100개만 반환한다..', async () => {
      const rows = new Array(150).fill({ test: 'data' });
      jest.spyOn(mockQueryDBAdapter, 'run').mockResolvedValue(rows);

      await queryService.execute(sessionId, shellId, queryDto);

      expect(mockShellService.update).toHaveBeenCalledWith(
        shellId,
        expect.objectContaining({
          resultTable: rows.slice(0, 100),
        }),
      );
    });

    it('테이블 결과값이 100개보다 적으면 그대로 반환한다.', async () => {
      const rows = new Array(99).fill({ test: 'data' });
      jest.spyOn(mockQueryDBAdapter, 'run').mockResolvedValue(rows);

      await queryService.execute(sessionId, shellId, queryDto);

      expect(mockShellService.update).toHaveBeenCalledWith(
        shellId,
        expect.objectContaining({
          resultTable: rows,
        }),
      );
    });
  });
});
