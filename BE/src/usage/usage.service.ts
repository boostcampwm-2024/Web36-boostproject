import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';
import { QueryDBAdapter } from 'src/config/query-database/query-db.adapter';
import { QUERY_DB_ADAPTER } from 'src/config/query-database/query-db.moudle';

@Injectable()
export class UsageService {
  MAX_ROW_COUNT = 5;
  constructor(
    @Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
  ) {}

  public async getTotalRowCount(identify: string): Promise<number> {
    const tableList = await this.getTableList(identify);
    const rowCntList = await this.getRowCountList(identify, tableList);
    const totalRowCnt = rowCntList.reduce((acc, rowCount) => acc + rowCount, 0);

    return totalRowCnt;
  }

  private async getTableList(identify: string): Promise<any[]> {
    const getTabelListQuery = `SHOW TABLES FROM ${identify}`;
    const [rows] = await this.queryDBAdapter
      .getAdminPool()
      .query<RowDataPacket[]>(getTabelListQuery);
    return rows.map((row) => Object.values(row)[0]);
  }

  private async getRowCountList(identify: string, tableList: any[]) {
    const queries = tableList.map((table) => {
      const getRowCntQuery = `SELECT count(*) as rowCount FROM ${identify}.${table}`;
      return this.queryDBAdapter.getAdminPool().query(getRowCntQuery);
    });
    const result = await Promise.all(queries);
    const rowCounts = result.map(([rows]) => rows[0].rowCount);
    return rowCounts;
  }

  public async detectFullUsage(sessionId: string, addRowCount: number) {
    const currentRowCount = await this.getTotalRowCount(sessionId);
    if (currentRowCount + addRowCount > this.MAX_ROW_COUNT) {
      throw new UnauthorizedException('테이블 최대 용량을 초과하였습니다.');
    }
  }
}
