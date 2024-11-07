import { Body, Controller, Post, Req } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryDto } from './dto/query.dto';
import { ResponseDto } from '../common/response/response.dto';
import { Request } from 'express';

@Controller('api/shells')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Post('execute')
  async executeQuery(@Body() queryDto: QueryDto, @Req() req: Request) {
    return ResponseDto.ok(
      await this.queryService.execute(req.sessionID, queryDto),
    );
  }
}
