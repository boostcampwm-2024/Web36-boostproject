import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/config/redis/redis.service';
import { TableService } from '../table/table.service';
import { DataLimitExceedException } from '../common/exception/custom-exception';
import { UserDBManager } from '../config/query-database/user-db-manager.service';

@Injectable()
export class UsageService {
  MAX_ROW_COUNT = 10;
  constructor(
    private readonly userDBManager: UserDBManager,
    private readonly redisService: RedisService,
    private readonly tableService: TableService,
  ) {}

  public async getRowCount(identify: string) {
    const rowCount = await this.redisService.getRowCount(identify);
    return {
      currentUsage: parseInt(rowCount, 10),
      availUsage: this.MAX_ROW_COUNT,
    };
  }

  public async updateRowCount(req: any) {
    const tableList: string[] = (
      await this.tableService.getTables(req.sessionID)
    ).map((table) => table.TABLE_NAME);
    if (tableList.length === 0) {
      return {
        currentUsage: 0,
        availUsage: this.MAX_ROW_COUNT,
      };
    }
    const query = this.createSumQuery(req, tableList);
    const result = await this.userDBManager.run(req, query);
    const rowCount = parseInt(result[0].total_rows, 10);

    if (rowCount > this.MAX_ROW_COUNT) throw new DataLimitExceedException();

    await this.redisService.setRowCount(req.sessionID, rowCount);
  }

  private createSumQuery(req: any, tableNameList: string[]): string {
    const unionQueries = tableNameList
      .map(
        (tableName) =>
          `SELECT '${tableName}' AS table_name, COUNT(*) AS row_count FROM ${tableName}`,
      )
      .join(' UNION ALL ');

    return `
      SELECT SUM(row_count) AS total_rows
      FROM (
        ${unionQueries}
      ) AS combined_counts;
    `;
  }
}
