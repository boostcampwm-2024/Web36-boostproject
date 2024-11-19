import { Inject, Injectable } from '@nestjs/common';
import path from 'path';
import { QueryDBAdapter } from 'src/config/query-database/query-db.adapter';
import { QUERY_DB_ADAPTER } from 'src/config/query-database/query-db.moudle';

@Injectable()
export class RecordService {
    constructor(@Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
    ) { }

    generateCsvFile(): string {
        return 'fool';
    }

    insertRecordIntoDB(): boolean {
        return true;
    }

    insertRandomRecord() : boolean {
        return true;
    }
}
