import {
  Body,
  Controller,
  Post,
  Req,
  // UnauthorizedException,
} from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryDto } from './dto/query.dto';
import { ResponseDto } from '../common/response/response.dto';
import { Request } from 'express';
// import { SessionService } from 'src/session/session.service';

@Controller('api/shells')
export class QueryController {
  constructor(
    private readonly queryService: QueryService,
    // private readonly sessionService: SessionService,
  ) {}

  @Post('execute')
  async executeQuery(@Body() queryDto: QueryDto, @Req() req: Request) {
    // console.log(req.sessionID);
    // if (!this.sessionService.isValidSession(req.sessionID)) {
    //   throw new UnauthorizedException('올바르지 않은 session id 입니다.');
    // }
    return ResponseDto.ok(
      await this.queryService.execute(req.sessionID, queryDto),
    );
  }
}
