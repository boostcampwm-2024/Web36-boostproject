import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QueryDto } from './dto/query.dto';
import { QUERY_DB_ADAPTER } from '../config/query-database/query-db.moudle';
import { QueryDBAdapter } from '../config/query-database/query-db.adapter';
import { QueryType } from '../common/enums/query-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Shell } from '../shell/shell.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QueryService {
  constructor(
    @Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
    @InjectRepository(Shell)
    private shellRepository: Repository<Shell>,
  ) {}

  async execute(sessionId: string, shellId: number, queryDto: QueryDto) {
    const shell = await this.shellRepository.findOne({ where: { shellId } });
    if (!shell) {
      throw new NotFoundException('존재하지 않는 shellId 입니다.');
    }

    const connection = await this.queryDBAdapter.createConnection(sessionId);
    const baseUpdateData = {
      query: queryDto.query,
      queryType: this.detectQueryType(queryDto.query),
    };

    try {
      const rows = await this.queryDBAdapter.run(connection, queryDto.query);
      const slicedRows = rows.length > 100 ? rows.slice(0, 100) : rows;

      await this.updateShell(shellId, shell, {
        ...baseUpdateData,
        affectedRows: rows.length,
        queryStatus: true,
        resultTable: slicedRows,
      });
    } catch (e) {
      await this.updateShell(shellId, shell, {
        ...baseUpdateData,
        queryStatus: false,
        failMessage: e.sqlMessage,
      });
    } finally {
      this.queryDBAdapter.closeConnection(connection);
    }

    return shell;
  }

  private async updateShell(
    shellId: number,
    shell: Shell,
    updateData: Partial<Shell>,
  ) {
    await this.shellRepository.update({ shellId }, updateData);
    Object.assign(shell, updateData);
  }

  /*
  TODO 다중 쿼리 가능하면 맨 마지막 쿼리 기준으로
   */
  private detectQueryType(query: string): QueryType | undefined {
    const trimmedQuery = query.trim().toUpperCase();
    const queryType = Object.keys(this.queryTypeMap).find((type) =>
      trimmedQuery.startsWith(type),
    );
    return queryType ? this.queryTypeMap[queryType] : undefined;
  }

  private queryTypeMap: Record<string, QueryType> = {
    SELECT: QueryType.SELECT,
    INSERT: QueryType.INSERT,
    UPDATE: QueryType.UPDATE,
    DELETE: QueryType.DELETE,
    CREATE: QueryType.CREATE,
    DROP: QueryType.DROP,
    ALTER: QueryType.ALTER,
  };
}
