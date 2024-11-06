import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { ShellService } from './shell.service';
import { CreateShellDto } from './dto/create-shell.dto';
import { ExceptionHandler } from '../common/exception/exception.handler';
import { UpdateShellDto } from './dto/update-shell.dto';

@Controller('api/shells')
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

  @Put(':shellId')
  async update(
    @Param('shellId') shellId: number,
    @Body() updateShellDto: UpdateShellDto,
  ) {
    const shell = await this.shellService.update(shellId, updateShellDto);
    const result = {
      status: true,
      data: {
        shellId: shell.shellId,
        query: shell.query,
      },
      message: 'update shell',
    };
    return result;
  }

  @Delete(':shellId')
  async delete(@Param('shellId') shellId: number) {
    await this.shellService.delete(shellId);
    const result = {
      status: true,
      data: {
        shellId: shellId,
      },
      message: 'delete shell',
    };
    return result;
  }
}
