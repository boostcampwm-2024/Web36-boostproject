import { Body, Controller, Post, Req } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryDto } from './dto/query.dto';
import { ResponseDto } from '../common/response/response.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ResQueryDto } from './dto/res-query.dto';
import { ExecuteQuerySwagger } from '../config/swagger/query-swagger.decorator';
import { Request } from 'express';

@ApiExtraModels(ResponseDto, ResQueryDto)
@ApiTags('쿼리 API')
@Controller('api/shells')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @ExecuteQuerySwagger()
  @Post('execute')
  async executeQuery(@Req() req: Request, @Body() queryDto: QueryDto) {
    return ResponseDto.ok(
      await this.queryService.execute(req.sessionID, queryDto),
    );
  }
}
