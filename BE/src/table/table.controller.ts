import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { TableService } from './table.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ResTableDto } from './dto/res-table.dto';
import { ResTablesDto } from './dto/res-tables.dto';
import { GetTableListSwagger, GetTableSwagger } from '../config/swagger/table-swagger.decorator';
import { ResponseDto } from '../common/response/response.dto';

@ApiExtraModels(ResponseDto, ResTablesDto, ResTableDto)
@ApiTags('테이블 가져오기 API')
@Controller('api')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @GetTableListSwagger()
  @Serialize(ResTablesDto)
  @Get('/tables')
  async findAll(@Req() req: Request) {
    return await this.tableService.findAll(req.sessionID);
  }

  @GetTableSwagger()
  @Serialize(ResTableDto)
  @Get('/tables/:tableName')
  async find(@Req() req: Request, @Param('tableName') tableName: string) {
    return await this.tableService.find(req.sessionID, tableName);
  }
}
