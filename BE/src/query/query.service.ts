import {Inject, Injectable} from '@nestjs/common';
import {QueryDto} from './dto/query.dto';
import {QUERY_DB_ADAPTER} from '../config/query-database/query-db.moudle';
import {QueryDBAdapter} from '../config/query-database/query-db.adapter';
import {QueryType} from '../common/enums/query-type.enum';
import {ShellService} from '../shell/shell.service';
import {ResultSetHeader, RowDataPacket} from 'mysql2/promise';

@Injectable()
export class QueryService {
  constructor(
    @Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
    private shellService: ShellService,
  ) {}

  async execute(sessionId: string, shellId: number, queryDto: QueryDto) {
    await this.shellService.findShellOrThrow(shellId);

    const baseUpdateData = {
      sessionId: sessionId,
      query: queryDto.query,
      queryType: this.detectQueryType(queryDto.query),
    };
    try {
      if (baseUpdateData.queryType === QueryType.UNKNOWN) {
        return await this.shellService.replace(shellId, {
          ...baseUpdateData,
          queryStatus: false,
          text: '지원하지 않는 쿼리입니다.',
        });
      }
      const updateData = await this.processQuery(baseUpdateData,sessionId,queryDto.query);

      return await this.shellService.replace(shellId, updateData);
    } catch (e) {
      const text = `ERROR ${e.errno || ''} (${e.sqlState || ''}): ${e.sqlMessage || ''}`;

      const updateData = {
        ...baseUpdateData,
        queryStatus: false,
        failMessage: e.sqlMessage,
        text: text,
      };
      return await this.shellService.replace(shellId, updateData);
    }
  }

  private async processQuery(baseUpdateData: any, sessionId: string, query: string)  {
    const isResultTable = this.existResultTable(baseUpdateData.queryType);

    const rows = await this.queryDBAdapter.run(sessionId, query);
    const runTime = await this.measureQueryRunTime(sessionId);

    let text: string;
    let resultTable: RowDataPacket[];

    if (isResultTable) {
      const resultRows = rows as RowDataPacket[];
      const slicedRows = resultRows.slice(0, Math.min(resultRows.length, 100));
      text =
          slicedRows.length === 0
              ? `Empty set (${runTime} sec)`
              : `${resultRows.length} in set, (${runTime} sec)`;
      resultTable = slicedRows;
    } else {
      const resultHeader = rows as ResultSetHeader;
      text = `Query OK, ${resultHeader.affectedRows} rows affected, (${runTime} sec)`;
    }

    return {
      ...baseUpdateData,
      affectedRows: isResultTable ? 0 : (rows as ResultSetHeader).affectedRows,
      countRows: isResultTable ? (rows as RowDataPacket[]).length : 0,
      queryStatus: true,
      resultTable: isResultTable ? resultTable : [],
      runTime,
      text,
    };
  }

  private existResultTable(type: QueryType) {
    const validTypes: QueryType[] = [
      QueryType.SELECT,
      QueryType.EXPLAIN,
      QueryType.SHOW,
      QueryType.DESCRIBE,
    ];
    return validTypes.includes(type);
  }

  private async measureQueryRunTime(sessionId: string): Promise<string> {
    try {
      const rows = await this.queryDBAdapter.run(sessionId, 'show profiles;') as RowDataPacket[];
      let lastQueryRunTime = rows[rows.length - 1]?.Duration;
      lastQueryRunTime = Math.round(lastQueryRunTime * 1000) / 1000 || 0;
      return lastQueryRunTime.toFixed(3);
    } catch (e) {
      console.error(e);
      return '0.000';
    }
  }

  /*
  TODO 다중 쿼리 가능하면 맨 마지막 쿼리 기준으로
   */
  private detectQueryType(query: string): QueryType | undefined {
    const trimmedQuery = query.trim().toUpperCase();
    const queryType = Object.keys(this.queryTypeMap).find((type) =>
      trimmedQuery.startsWith(type),
    );
    return queryType ? this.queryTypeMap[queryType] : QueryType.UNKNOWN;
  }

  private queryTypeMap: Record<string, QueryType> = {
    SELECT: QueryType.SELECT,
    INSERT: QueryType.INSERT,
    UPDATE: QueryType.UPDATE,
    DELETE: QueryType.DELETE,
    CREATE: QueryType.CREATE,
    DROP: QueryType.DROP,
    ALTER: QueryType.ALTER,
    EXPLAIN: QueryType.EXPLAIN,
    SHOW: QueryType.SHOW,
    TRUNCATE: QueryType.TRUNCATE,
    RENAME: QueryType.RENAME,
    START: QueryType.START,
    COMMIT: QueryType.COMMIT,
    ROLLBACK: QueryType.ROLLBACK,
    SAVEPOINT: QueryType.SAVEPOINT,
    DESCRIBE: QueryType.DESCRIBE,
    SET: QueryType.SET,
    UNKNOWN: QueryType.UNKNOWN,
  };
}
