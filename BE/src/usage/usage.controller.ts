import { Controller, Get, Req, UseFilters, UseInterceptors } from '@nestjs/common';
import { UsageService } from './usage.service';
import { Request } from 'express';
import { ExceptionHandler } from 'src/common/exception/exception.handler';
import { ApiExtraModels } from '@nestjs/swagger';
import { ResUsageDto } from './dto/res-usage.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDBConnectionInterceptor } from '../interceptors/user-db-connection.interceptor';

@Controller('/api/usage')
@ApiExtraModels(ResUsageDto)
@UseFilters(new ExceptionHandler())
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @UseInterceptors(UserDBConnectionInterceptor)
  @Get()
  @Serialize(ResUsageDto)
  async getUsage(@Req() req: Request) {
    const sessionId = req.sessionID;
    return this.usageService.getRowCount(sessionId);
  }
}
