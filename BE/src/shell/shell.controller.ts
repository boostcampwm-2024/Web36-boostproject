import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { ShellService } from './shell.service';
import { ExceptionHandler } from '../common/exception/exception.handler';
import { UpdateShellDto } from './dto/update-shell.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ResShellDto } from './dto/res-shell.dto';
import { ApiExtraModels } from '@nestjs/swagger';
import { ResponseDto } from '../common/response/response.dto';
import {
  CreateShellSwagger,
  UpdateShellSwagger,
} from '../config/swagger/shell-swagger.decorator';

@ApiExtraModels(ResponseDto, ResShellDto)
@Controller('api/shells')
@UseFilters(new ExceptionHandler())
export class ShellController {
  constructor(private shellService: ShellService) {}

  @Get()
  @Serialize(ResShellDto)
  async findAll() {
    return await this.shellService.findAll();
  }

  @Get(':shellId')
  @Serialize(ResShellDto)
  async findOne(@Param('shellId') shellId: number) {
    return await this.shellService.findShellOrThrow(shellId);
  }

  @Post()
  @Serialize(ResShellDto)
  @CreateShellSwagger()
  async create() {
    return await this.shellService.create();
  }

  @Put(':shellId')
  @Serialize(ResShellDto)
  @UpdateShellSwagger()
  async update(
    @Param('shellId') shellId: number,
    @Body() updateShellDto: UpdateShellDto,
  ) {
    return await this.shellService.update(shellId, updateShellDto);
  }

  @Delete(':shellId')
  async delete(@Param('shellId') shellId: number) {
    await this.shellService.delete(shellId);
  }
}
