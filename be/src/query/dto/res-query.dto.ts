import { QueryType } from '../../common/enums/query-type.enum';

export class ResQueryDto {
  shellId: number;
  queryStatus: boolean;
  runTime: string;
  queryType: QueryType;
  failMessage: string | null;
  affectedRows: number;
  table: any[];
}
