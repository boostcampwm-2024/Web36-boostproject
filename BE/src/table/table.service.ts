import { Inject, Injectable } from '@nestjs/common';
import { QUERY_DB_ADAPTER } from '../config/query-database/query-db.moudle';
import { QueryDBAdapter } from '../config/query-database/query-db.adapter';

@Injectable()
export class TableService {
  constructor(
    @Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
  ) {}

  async getSchema(sessionId: string) {
    const tables = await this.queryDBAdapter.run(sessionId, 'SHOW TABLES;');
    //Table 없으면 예외처리
    const tableKey = Object.keys(tables[0])[0];

    const schema = {
      tables: [],
    };

    for (const table of tables) {
      const tableName: string = table[tableKey];

      const [result] = await this.queryDBAdapter.run(
        sessionId,
        `SHOW CREATE TABLE \`${tableName}\`;`,
      );

      const createTableSql = result['Create Table'];

      const columnData = this.getColumns(createTableSql);

      schema.tables.push({
        name: tableName,
        columns: columnData,
      });
    }

    return schema;
  }

  private getColumns(createTableSql: string) {
    const columnDefinitionRegex = /\(([\s\S]+)\)\s+ENGINE=/;
    const columnDefinitionMatch = createTableSql.match(columnDefinitionRegex);
    const columnDefinitions = columnDefinitionMatch
      ? columnDefinitionMatch[1]
      : null;

    const columnRegex =
      /`(\w+)`\s+([\w()]+)(?:\s+NOT\s+NULL)?(?:\s+AUTO_INCREMENT)?(?:\s+DEFAULT\s+[^,]*)?/g;
    const pkRegex = /PRIMARY KEY\s+\((.*?)\)/;
    const uniqueKeyRegex = /UNIQUE KEY `(\w+)` \((.*?)\)/g;
    const foreignKeyRegex =
      /CONSTRAINT `(\w+)` FOREIGN KEY \((.*?)\) REFERENCES `(\w+)` \((.*?)\)/g;
    const indexKeyRegex = /KEY `(\w+)` \((.*?)\)/g;

    const primaryKeyMatch = createTableSql.match(pkRegex);
    const primaryKeys = primaryKeyMatch
      ? primaryKeyMatch[1].replace(/`/g, '').split(',')
      : [];

    const columns = [];
    const columnNames = new Set();

    let match;

    while ((match = columnRegex.exec(columnDefinitions)) !== null) {
      const [, name, type] = match;

      if (columnNames.has(name)) continue;
      columnNames.add(name);

      const constraints = [];
      if (primaryKeys.includes(name)) constraints.push('PK');

      columns.push({
        name,
        type,
        constraint: constraints,
        join: null,
      });
    }

    while ((match = uniqueKeyRegex.exec(createTableSql)) !== null) {
      const [, , uniqueColumns] = match;
      const uniqueCols = uniqueColumns.replace(/`/g, '').split(',');

      uniqueCols.forEach((colName) => {
        const column = columns.find((col) => col.name === colName);
        if (column && !column.constraint.includes('Unique')) {
          column.constraint.push('Unique');
        }
      });
    }

    while ((match = foreignKeyRegex.exec(createTableSql)) !== null) {
      const [, constraintName, columnName, referencedTable, referencedColumn] = match;

      const column = columns.find((col) => col.name === columnName.replace(/`/g, ''));
      if (column) {
        column.constraint.push('FK');
        column.join = `${referencedTable}.${referencedColumn}`;
      }
    }

    while ((match = indexKeyRegex.exec(createTableSql)) !== null) {
      const [, indexName, indexedColumns] = match;
      const indexedCols = indexedColumns.replace(/`/g, '').split(',');

      indexedCols.forEach((colName) => {
        const column = columns.find((col) => col.name === colName);
        if (column && !column.constraint.includes('Index')) {
          column.constraint.push('Index');
        }
      });
    }

    return columns;
  }
}
