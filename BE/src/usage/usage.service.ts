import { Inject, Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';
import { QueryDBAdapter } from 'src/config/query-database/query-db.adapter';
import { QUERY_DB_ADAPTER } from 'src/config/query-database/query-db.moudle';

@Injectable()
export class UsageService {
  MAX_ROW_COUNT = 10;
  constructor(
    @Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
  ) {}

  public async getRowCount(identify: string) {
    const tableList = await this.getTableList(identify);
    console.log('tables', tableList);
    if (tableList.length === 0) {
      return {
        currentUsage: 0,
        availUsage: this.MAX_ROW_COUNT,
      };
    }

    const query = this.createSumQuery(tableList);
    const result = await this.queryDBAdapter.run(query);
    const rowCount = parseInt(result[0].total_rows, 10);
    return {
      currentUsage: rowCount,
      availUsage: this.MAX_ROW_COUNT,
    };
  }

  public async getTableList(identify: string) {
    const getTabelListQuery = `SELECT GROUP_CONCAT(TABLE_NAME) AS table_name
      FROM information_schema.tables
      WHERE table_schema = '${identify}'
      AND TABLE_TYPE = 'BASE TABLE';`;

    const [tableList] = await this.queryDBAdapter
      .getAdminPool()
      .query<RowDataPacket[]>(getTabelListQuery);
    console.log('tableList', tableList);
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
