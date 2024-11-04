import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ShellService } from './shell.service';
import { CreateShellDto } from './dto/create-shell.dto';

@Controller('shells')
export class ShellController {
  constructor(private shellService: ShellService) {}

  @Post()
  async create(
    @Body() createShellDto: CreateShellDto,
    @Res() response: Response,
  ) {
    const shell = await this.shellService.create(createShellDto);
    const result = {
      status: true,
      data: {
        shellId: shell.shellId,
      },
      message: 'create shell',
    };
    return response.status(HttpStatus.CREATED).json(result);
  }
}
