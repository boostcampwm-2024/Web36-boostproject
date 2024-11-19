import { Inject, Injectable } from '@nestjs/common';
import path from 'path';
import { QueryDBAdapter } from 'src/config/query-database/query-db.adapter';
import { QUERY_DB_ADAPTER } from 'src/config/query-database/query-db.moudle';
import { RandomValueGenerator, BooleanGenerator, CityGenerator, CountryGenerator, EmailGenerator, EnumGenerator, NameGenerator, NumberGenerator, PhoneGenerator, SexGenerator } from './domain';
import { RandomRecordInsertDto } from './dto/record.dto';

const TypeToGenerator = {
    "name": NameGenerator,
    "country": CountryGenerator,
    "city": CityGenerator,
    "Email": EmailGenerator,
    "Phone": PhoneGenerator,
    "sex": SexGenerator,
    "boolean": BooleanGenerator,
    "number": NumberGenerator,
    "enum": EnumGenerator
}

@Injectable()
export class RecordService {
    constructor(@Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
    ) { }

    generateCsvFile({ columns, count }: RandomRecordInsertDto): string {
        const columnData = columns.map((column) => { return { 'name': column.name } });
        columnData.forEach((column)=>{ column.values = })
        return 'fool';
    }

    insertRecordIntoDB(): boolean {
        return true;
    }

    insertRandomRecord(sid: string,): boolean {
        return true;
    }
}
