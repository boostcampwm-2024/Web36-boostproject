import { exec } from 'child_process';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';
import { QueryDBAdapter } from 'src/config/query-database/query-db.adapter';
import { QUERY_DB_ADAPTER } from 'src/config/query-database/query-db.moudle';
import { promisify } from 'util';

@Injectable()
export class UsageService {
  MAX_ROW_COUNT = 5;
  MAX_DISK_USAGE_KB = 10000;
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

  public async detectFullRowCount(sessionId: string, addRowCount: number) {
    const currentRowCount = await this.getTotalRowCount(sessionId);
    if (currentRowCount + addRowCount > this.MAX_ROW_COUNT) {
      throw new UnauthorizedException('테이블 최대 용량을 초과하였습니다.');
    }
  }

  public async getDiskUsage(identify: string) {
    const execPromise = promisify(exec);
    const getDiskUsageCommand = `du -sk ../db/query/${identify}`;
    const { stdout } = await execPromise(getDiskUsageCommand);
    const usageSizeKb = parseInt(stdout.split('\t')[0], 10) | 0;
    return usageSizeKb;
  }

  public async detectFullUsage(sessionId: string, addData: number = 65) {
    const currentdiskUsage = await this.getDiskUsage(sessionId);
    console.log(currentdiskUsage, addData, this.MAX_DISK_USAGE_KB);
    if (currentdiskUsage + addData > this.MAX_DISK_USAGE_KB) {
      throw new UnauthorizedException('테이블 최대 용량을 초과하였습니다.');
    }
  }
}
