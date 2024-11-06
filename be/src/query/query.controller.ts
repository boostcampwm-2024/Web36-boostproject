import { Body, Controller, Post, Headers } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryDto } from './dto/query.dto';
import { ResponseDto } from '../common/response/response.dto';
import {
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import { ResQueryDto } from './dto/res-query.dto';
import { ExecuteQuerySwagger } from '../config/swagger/query-swagger.decorator';

@ApiExtraModels(ResponseDto, ResQueryDto)
@ApiTags('쿼리 API')
@Controller('api/shells')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Post('execute')
  @ExecuteQuerySwagger()
  async executeQuery(
    @Headers('authorization') authorization: string,
    @Body() queryDto: QueryDto,
  ) {
    return ResponseDto.ok(
      await this.queryService.execute(authorization, queryDto),
    );
  }
}
