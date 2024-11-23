import { Body, Controller, Post, Req, UseFilters } from '@nestjs/common';
import { RecordService } from './record.service';
import { RandomRecordInsertDto } from './dto/record.dto';
import { ApiExtraModels } from '@nestjs/swagger';
import { ExceptionHandler } from 'src/common/exception/exception.handler';
import { Request } from 'express';

@ApiExtraModels(RandomRecordInsertDto)
@UseFilters(new ExceptionHandler())
@Controller('api/record')
export class RecordController {
  constructor(private recordService: RecordService) {}

  @Post()
  insertRandomRecord(@Body() body: RandomRecordInsertDto, @Req() req: Request) {
    const status = this.recordService.insertRandomRecord(req.sessionID, body);
    return status;
  }
}
