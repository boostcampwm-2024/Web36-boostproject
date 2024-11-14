import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Shell } from './shell.entity';

@Injectable()
export class ShellService {
  constructor(
    @InjectRepository(Shell)
    private shellRepository: Repository<Shell>,
  ) {}

  async create() {
    const shell = this.shellRepository.create();
    return this.shellRepository.save(shell);
  }

  async update(id: number, updateData: Partial<Shell>) {
    const shell = await this.findShellOrThrow(id);
    Object.assign(shell, updateData);
    return this.shellRepository.save(shell);
  }

  async delete(id: number) {
    const shell = await this.findShellOrThrow(id);
    await this.shellRepository.delete(shell);
  }

  async findShellOrThrow(id: number) {
    const shell = await this.shellRepository.findOne({
      where: { id },
    });
    if (!shell) {
      throw new NotFoundException('존재하지 않는 shellId 입니다.');
    }
    return shell;
  }
}
