import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Shell } from './shell.entity';
import { CreateShellDto } from './dto/create-shell.dto';

@Injectable()
export class ShellService {
  constructor(
    @InjectRepository(Shell)
    private shellRepository: Repository<Shell>,
  ) {}

  create(createShellDto: CreateShellDto): Promise<Shell> {
    const shell = this.shellRepository.create(createShellDto);
    return this.shellRepository.save(shell);
  }
}
