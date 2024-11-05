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

  it('shell을 추가할 수 있다.', async () => {
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
});
