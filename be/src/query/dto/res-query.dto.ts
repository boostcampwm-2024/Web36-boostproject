import { QueryType } from '../../common/enums/query-type.enum';
import { RowDataPacket } from 'mysql2/promise';

export class ResQueryDto {
  constructor() {}

  queryStatus: boolean;
  runTime: string;
  queryType: QueryType;
  failMessage: string | null;
  affectedRows: number;
  table: any[];

  static ok(rows: RowDataPacket[]): ResQueryDto {
    const response = new ResQueryDto();
    response.queryStatus = true;
    response.runTime = '0.01';
    response.queryType = QueryType.SELECT;
    response.affectedRows = rows.length;
    response.table = rows;
    return response;
  }

  static fail(failMessage: string): ResQueryDto {
    const response = new ResQueryDto();
    response.queryStatus = false;
    response.failMessage = failMessage;
    return response;
  }
}
