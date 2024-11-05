import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { ShellService } from './shell.service';
import { CreateShellDto } from './dto/create-shell.dto';
import { ExceptionHandler } from '../common/exception/exception.handler';
import { HttpExceptionHandler } from 'src/common/exception/http-exception.handler';

@Controller('shells')
@UseFilters(new HttpExceptionHandler())
@UseFilters(new ExceptionHandler())
export class ShellController {
  constructor(private shellService: ShellService) {}

  @Post()
  async create(@Body() createShellDto: CreateShellDto) {
    const shell = await this.shellService.create(createShellDto);
    const result = {
      status: true,
      data: {
        shellId: shell.shellId,
      },
      message: 'create shell',
    };
    return result;
  }
}
