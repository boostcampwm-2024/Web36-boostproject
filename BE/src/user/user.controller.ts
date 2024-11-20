import { Controller, Get, Req, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { ExceptionHandler } from 'src/common/exception/exception.handler';
import { ApiExtraModels } from '@nestjs/swagger';
import { ResUsageDto } from './dto/res-usage.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Controller('/api/user')
@ApiExtraModels(ResUsageDto)
@UseFilters(new ExceptionHandler())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/usage')
  @Serialize(ResUsageDto)
  async getUsage(@Req() req: Request) {
    const sessionId = req.sessionID;
    return await this.userService.getTotalRowCount(sessionId);
  }
}
