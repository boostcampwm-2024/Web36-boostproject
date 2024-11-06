import { Body, Controller, Post, Headers } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryDto } from './dto/query.dto';
import { ResponseDto } from '../common/response/response.dto';

@Controller('api/shells')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Post('execute')
  async executeQuery(
    @Headers('authorization') authorization: string,
    @Body() queryDto: QueryDto,
  ) {
    return ResponseDto.ok(
      await this.queryService.execute(authorization, queryDto),
    );
  }
}
