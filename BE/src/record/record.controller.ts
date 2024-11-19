import { Body, Controller, Post, Req, UseFilters } from '@nestjs/common';
import { RecordService } from './record.service';
import { RandomRecordInsertDto } from './dto/record.dto';
import { ApiExtraModels } from '@nestjs/swagger';
import { ExceptionHandler } from 'src/common/exception/exception.handler';

@ApiExtraModels(RandomRecordInsertDto)
@UseFilters(new ExceptionHandler())
@Controller('api/record')
export class RecordController {
    constructor(private recordService: RecordService) { }

    @Post()
    insertRandomRecord(@Body() body: RandomRecordInsertDto, @Req() req: Request) {
        console.log(body);
        const status = this.recordService.insertRandomRecord();
        return { status };
    }
}
