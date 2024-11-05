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

  static ok(query: string, rows: RowDataPacket[]): ResQueryDto {
    const response = new ResQueryDto();
    response.queryStatus = true;
    response.runTime = '0.01';
    response.queryType = this.detectQueryType(query);
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

  private static detectQueryType(query: string): QueryType {
    const trimmedQuery = query.trim().toUpperCase();
    if (trimmedQuery.startsWith('SELECT')) return QueryType.SELECT;
    if (trimmedQuery.startsWith('INSERT')) return QueryType.INSERT;
    if (trimmedQuery.startsWith('UPDATE')) return QueryType.UPDATE;
    if (trimmedQuery.startsWith('DELETE')) return QueryType.DELETE;
    if (trimmedQuery.startsWith('CREATE')) return QueryType.CREATE;
    if (trimmedQuery.startsWith('DROP')) return QueryType.DROP;
    if (trimmedQuery.startsWith('ALTER')) return QueryType.ALTER;
  }
}
