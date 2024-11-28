import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ShellService } from './shell.service';
import { UpdateShellDto } from './dto/update-shell.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ResShellDto } from './dto/res-shell.dto';
import { ApiExtraModels } from '@nestjs/swagger';
import { ResponseDto } from '../common/response/response.dto';
import {
  CreateShellSwagger,
  GetAllShellSwagger,
  GetShellSwagger,
  UpdateShellSwagger,
} from '../config/swagger/shell-swagger.decorator';
import { Request } from 'express';
import { ShellGuard } from '../guard/shell.guard';
import { ResShellResultDto } from './dto/res-shell-result.dto';

@ApiExtraModels(ResponseDto, ResShellDto, ResShellResultDto)
@Controller('api/shells')
export class ShellController {
  constructor(private shellService: ShellService) {}

  @Get()
  @GetAllShellSwagger()
  @Serialize(ResShellResultDto)
  async findAll(@Req() req: Request) {
    const sessionId = req.sessionID;
    return await this.shellService.findAll(sessionId);
  }

  @Get(':shellId')
  @GetShellSwagger()
  @Serialize(ResShellResultDto)
  async findOne(@Param('shellId') shellId: number) {
    return await this.shellService.findShellOrThrow(shellId);
  }

  @Post()
  @Serialize(ResShellDto)
  @CreateShellSwagger()
  async create(@Req() req: Request) {
    const sessionId = req.sessionID;
    return await this.shellService.create(sessionId);
  }

  @Put(':shellId')
  @Serialize(ResShellDto)
  @UpdateShellSwagger()
  @UseGuards(ShellGuard)
  async update(
    @Param('shellId') shellId: number,
    @Body() updateShellDto: UpdateShellDto,
  ) {
    return await this.shellService.update(shellId, updateShellDto);
  }

  @Delete(':shellId')
  @UseGuards(ShellGuard)
  async delete(@Param('shellId') shellId: number) {
    await this.shellService.delete(shellId);
  }
}
