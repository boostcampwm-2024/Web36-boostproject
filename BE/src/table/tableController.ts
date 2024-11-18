import { Controller, Get, Req, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ExceptionHandler } from '../common/exception/exception.handler';
import { TableService } from './table.service';

@ApiTags('에디터 API')
@Controller('api')
@UseFilters(new ExceptionHandler())
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get('/erd')
  async find(@Req() req: Request) {
    return await this.tableService.getSchema(req.sessionID);
  }
}
