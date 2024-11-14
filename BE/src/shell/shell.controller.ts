import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseFilters, UseGuards
} from "@nestjs/common";
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
import { Request } from 'express';
import { ShellGuard } from "../guard/shell.guard";

@ApiExtraModels(ResponseDto, ResShellDto)
@Controller('api/shells')
@UseFilters(new ExceptionHandler())
export class ShellController {
  constructor(private shellService: ShellService) {}

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
