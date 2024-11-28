import { Body, Controller, Param, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryDto } from './dto/query.dto';
import { ResponseDto } from '../common/response/response.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ResQueryDto } from './dto/res-query.dto';
import { ExecuteQuerySwagger } from '../config/swagger/query-swagger.decorator';
import { Request } from 'express';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ShellGuard } from '../guard/shell.guard';
import { UserDBConnectionInterceptor } from '../interceptors/user-db-connection.interceptor';

@ApiExtraModels(ResponseDto, ResQueryDto)
@ApiTags('쿼리 API')
@Controller('api/shells')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @UseInterceptors(UserDBConnectionInterceptor)
  @ExecuteQuerySwagger()
  @Serialize(ResQueryDto)
  @Post('/:shellId/execute')
  @UseGuards(ShellGuard)
  async executeQuery(
    @Req() req: Request,
    @Param('shellId') shellId: number,
    @Body() queryDto: QueryDto,
  ) {
    return await this.queryService.execute(req, shellId, queryDto);
  }
}
