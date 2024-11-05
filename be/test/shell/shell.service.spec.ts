import { Test, TestingModule } from '@nestjs/testing';
import { ShellService } from '../../src/shell/shell.service';
import { Shell } from '../../src/shell/shell.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ShellService', () => {
  let service: ShellService;
  let repository: Repository<Shell>;

  const mockShell = {
    id: 1,
    shellId: 1,
    sessionId: null,
    runTime: null,
    queryType: null,
    failMessage: null,
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockShell),
    save: jest.fn().mockResolvedValue(mockShell),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShellService,
        {
          provide: getRepositoryToken(Shell),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ShellService>(ShellService);
    repository = module.get<Repository<Shell>>(getRepositoryToken(Shell));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shell을 추가할 수 있다.', async () => {
    const createShellDto = { shellId: 1 };
    mockRepository.findOne.mockResolvedValueOnce(null);

    const createdShell = await service.create(createShellDto);
    const expectedShell = {
      id: 1,
      shellId: 1,
      sessionId: null,
      runTime: null,
      queryType: null,
      failMessage: null,
    };

    expect(repository.create).toHaveBeenCalledWith(createShellDto);
    expect(repository.save).toHaveBeenCalledWith(mockShell);
    expect(createdShell).toEqual(expectedShell);
  });

  test('shell을 삭제할 수 있다.', async () => {
    const shellId = 1;
    mockRepository.delete.mockResolvedValueOnce({ affected: 1 });
    await service.delete(shellId);
    expect(repository.delete).toHaveBeenCalledWith({ shellId });
  });

  test('삭제할 shell이 존재하지 않으면 에러를 발생시킨다.', async () => {
    const shellId = 1;
    mockRepository.delete.mockResolvedValueOnce({ affected: 0 });
    try {
      await service.delete(shellId);
    } catch (e) {
      expect(e.message).toBe('shell not found');
    }
  });
});
