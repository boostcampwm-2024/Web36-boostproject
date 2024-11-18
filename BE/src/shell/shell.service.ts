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

  async findAll(sessionId: string) {
    return this.shellRepository.find({
      where: { sessionId },
    });
  }

  async create(sessionId: string) {
    const shell = this.shellRepository.create();
    shell.sessionId = sessionId;
    return this.shellRepository.save(shell);
  }

  async update(id: number, updateData: Partial<Shell>) {
    const shell = await this.findShellOrThrow(id);
    const updatedShell = this.shellRepository.create({
      ...updateData,
      sessionId: shell.sessionId,
      user: shell.user,
      createdAt: shell.createdAt,
    });
    return this.shellRepository.save(updatedShell);
  }

  async delete(id: number) {
    const shell = await this.findShellOrThrow(id);
    await this.shellRepository.delete(shell.id);
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

  async isMappingSession(sessionId: string, shellId: number) {
    const shell = await this.shellRepository.findOne({
      where: { id: shellId, sessionId },
    });
    return Boolean(shell);
  }
}
