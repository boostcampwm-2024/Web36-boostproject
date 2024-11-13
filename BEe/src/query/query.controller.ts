import { Body, Controller, Param, Post, Req, UseFilters } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryDto } from './dto/query.dto';
import { ResponseDto } from '../common/response/response.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ResQueryDto } from './dto/res-query.dto';
import { ExecuteQuerySwagger } from '../config/swagger/query-swagger.decorator';
import { Request } from 'express';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ExceptionHandler } from '../common/exception/exception.handler';

@ApiExtraModels(ResponseDto, ResQueryDto)
@ApiTags('쿼리 API')
@Controller('api/shells')
@UseFilters(new ExceptionHandler())
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @ExecuteQuerySwagger()
  @Serialize(ResQueryDto)
  @Post('/:shellId/execute')
  async executeQuery(
    @Req() req: Request,
    @Param('shellId') shellId: number,
    @Body() queryDto: QueryDto,
  ) {
    return await this.queryService.execute(req.sessionID, shellId, queryDto);
  }
}
