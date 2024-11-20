import { Inject, Injectable } from '@nestjs/common';
import { QueryDto } from './dto/query.dto';
import { QUERY_DB_ADAPTER } from '../config/query-database/query-db.moudle';
import { QueryDBAdapter } from '../config/query-database/query-db.adapter';
import { QueryType } from '../common/enums/query-type.enum';
import { ShellService } from '../shell/shell.service';

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
      const rows = await this.queryDBAdapter.run(sessionId, queryDto.query);
      const slicedRows = rows.length > 100 ? rows.slice(0, 100) : rows;
      const runTime = await this.measureQueryRunTime(sessionId);
      const text = `Query OK, ${rows.length || 0} rows affected (${runTime || '0.00'} sec)`;

      const updateData = {
        ...baseUpdateData,
        affectedRows: rows.length,
        queryStatus: true,
        ...(this.existResultTable(baseUpdateData.queryType) && {
          resultTable: slicedRows,
        }),
        runTime: runTime,
        text: text,
      };
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
      const rows = await this.queryDBAdapter.run(sessionId, 'show profiles;');
      let lastQueryRunTime = rows[rows.length - 1]?.Duration;
      lastQueryRunTime = Math.round(lastQueryRunTime * 1000) / 1000 || 0;
      return lastQueryRunTime.toFixed(3);
    } catch (e) {
      console.error(e);
      return '0.00';
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
