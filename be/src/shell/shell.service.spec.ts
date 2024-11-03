import { Test, TestingModule } from '@nestjs/testing';
import { ShellService } from './shell.service';

describe('ShellService', () => {
  let service: ShellService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShellService],
    }).compile();

    service = module.get<ShellService>(ShellService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
