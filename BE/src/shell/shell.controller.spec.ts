import { Test, TestingModule } from '@nestjs/testing';
import { ShellController } from './shell.controller';

describe('ShellController', () => {
  let controller: ShellController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShellController],
    }).compile();

    controller = module.get<ShellController>(ShellController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
