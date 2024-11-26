import { Inject, Injectable } from '@nestjs/common';
import { QueryDBAdapter } from 'src/config/query-database/query-db.adapter';
import { QUERY_DB_ADAPTER } from 'src/config/query-database/query-db.moudle';
import { RedisService } from 'src/config/redis/redis.service';

@Injectable()
export class UsageService {
  MAX_ROW_COUNT = 10;
  constructor(
    @Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
    private readonly redisService: RedisService,
  ) {}

  public async getRowCount(identify: string) {
    const rowCount = await this.redisService.getRowCount(identify);
    return {
      currentUsage: parseInt(rowCount, 10),
      availUsage: this.MAX_ROW_COUNT,
    };
  }

  public async updateRowCount(identify: string) {
    const tableList = await this.getTableList(identify);
    if (tableList.length === 0) {
      return {
        currentUsage: 0,
        availUsage: this.MAX_ROW_COUNT,
      };
    }
    const query = this.createSumQuery(tableList);
    const result = await this.queryDBAdapter.run(query);
    const rowCount = parseInt(result[0].total_rows, 10);

    this.redisService.updateRowCount(identify, rowCount);
  }

  private async getTableList(identify: string) {
    const getTabelListQuery = `SELECT GROUP_CONCAT(TABLE_NAME) AS table_name
      FROM information_schema.tables
      WHERE table_schema = '${identify}'
      AND TABLE_TYPE = 'BASE TABLE';`;

    const [tableList] = await this.queryDBAdapter
      .getAdminPool()
      .query(getTabelListQuery);
    const tableNameList = tableList[0].table_name.split(',');
    return tableNameList;
  }

  private createSumQuery(tableNameList: any[]): string {
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
