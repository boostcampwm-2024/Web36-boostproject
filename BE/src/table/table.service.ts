import { Injectable } from '@nestjs/common';
import { ColumnDto, ResTableDto } from './dto/res-table.dto';
import { ResTablesDto } from './dto/res-tables.dto';
import { AdminDBManager } from '../config/query-database/admin-db-manager.service';

@Injectable()
export class TableService {
  constructor(private readonly adminDBManager: AdminDBManager) {}

  async findAll(sessionId: string) {
    const tables = await this.getTables(sessionId);
    const columns = await this.getColumns(sessionId);
    const foreignKeys = await this.getForeignKeys(sessionId);
    const indexes = await this.getIndexes(sessionId);

    return new ResTablesDto(
      this.mapTablesWithColumnsAndKeys(tables, columns, foreignKeys, indexes),
    );
  }

  async find(sessionId: string, tableName: string) {
    const tables = await this.getTables(sessionId, tableName);
    const columns = await this.getColumns(sessionId, tableName);
    const foreignKeys = await this.getForeignKeys(sessionId, tableName);
    const indexes = await this.getIndexes(sessionId);

    return (
      this.mapTablesWithColumnsAndKeys(
        tables,
        columns,
        foreignKeys,
        indexes,
      )[0] || []
    );
  }

  async getTables(schema: string, tableName?: string) {
    const query = `
    SELECT TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = ? ${tableName ? 'AND TABLE_NAME = ?' : ''}
  `;
    const params = tableName ? [schema, tableName] : [schema];
    const [tables] = await this.adminDBManager.run(query, params);
    return tables as any[];
  }

  private async getColumns(schema: string, tableName?: string) {
    const query = `
    SELECT TABLE_NAME, COLUMN_NAME, COLUMN_TYPE, COLUMN_KEY, EXTRA, IS_NULLABLE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ? ${tableName ? 'AND TABLE_NAME = ?' : ''}
    ORDER BY ORDINAL_POSITION
  `;
    const params = tableName ? [schema, tableName] : [schema];
    const [columns] = await this.adminDBManager.run(query, params);
    return columns as any[];
  }

  private async getForeignKeys(schema: string, tableName?: string) {
    const query = `
    SELECT 
      TABLE_NAME, 
      COLUMN_NAME, 
      REFERENCED_TABLE_NAME, 
      REFERENCED_COLUMN_NAME
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = ? 
    ${tableName ? 'AND TABLE_NAME = ?' : ''} 
    AND REFERENCED_TABLE_NAME IS NOT NULL
  `;
    const params = tableName ? [schema, tableName] : [schema];
    const [foreignKey] = await this.adminDBManager.run(query, params);
    return foreignKey as any[];
  }

  private async getIndexes(schema: string, tableName?: string) {
    const query = `
    SELECT TABLE_NAME, COLUMN_NAME, INDEX_NAME, NON_UNIQUE
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = ? ${tableName ? 'AND TABLE_NAME = ?' : ''}
  `;
    const params = tableName ? [schema, tableName] : [schema];
    const [indexes] = await this.adminDBManager.run(query, params);
    return indexes as any[];
  }

  private mapTablesWithColumnsAndKeys(
    tables: any[],
    columns: any[],
    foreignKeys: any[],
    indexes: any[],
  ): ResTableDto[] {
    return tables.map((table) => {
      const tableColumns = columns.filter(
        (col) => col.TABLE_NAME === table.TABLE_NAME,
      );

      const columnDtos = tableColumns.map((col) => {
        const fk = foreignKeys.find(
          (key) =>
            key.TABLE_NAME === col.TABLE_NAME &&
            key.COLUMN_NAME === col.COLUMN_NAME,
        );

        const hasIndex = indexes.some(
          (idx) =>
            idx.TABLE_NAME === col.TABLE_NAME &&
            idx.COLUMN_NAME === col.COLUMN_NAME,
        );

        return new ColumnDto({
          name: col.COLUMN_NAME,
          type: col.COLUMN_TYPE,
          PK: col.COLUMN_KEY === 'PRI',
          FK: fk
            ? `${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`
            : null,
          UQ: col.COLUMN_KEY === 'UNI',
          AI: col.EXTRA.includes('auto_increment'),
          NN: col.IS_NULLABLE === 'NO',
          IDX: hasIndex,
        });
      });

      return new ResTableDto({
        tableName: table.TABLE_NAME || null,
        columns: columnDtos || null,
      });
    });
  }
}
