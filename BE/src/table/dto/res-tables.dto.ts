import {Expose} from "class-transformer";
import {ResTableDto} from "./res-table.dto";

export class ResTablesDto{
    @Expose()
    tables : ResTableDto[];

    constructor(tables: ResTableDto[]) {
        this.tables = tables;
    }
}