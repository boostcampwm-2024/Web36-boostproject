import { Inject, Injectable } from '@nestjs/common';
import { QUERY_DB_ADAPTER } from '../config/query-database/query-db.moudle';
import { QueryDBAdapter } from '../config/query-database/query-db.adapter';
import { Pool } from 'mysql2/promise';
import { ColumnDto, ResTableDto } from './dto/res-table.dto';
import {ResTablesDto} from "./dto/res-tables.dto";

@Injectable()
export class TableService {
  constructor(
    @Inject(QUERY_DB_ADAPTER) private readonly queryDBAdapter: QueryDBAdapter,
  ) {}

  async findAll(sessionId: string) {
    const pool = this.queryDBAdapter.getAdminPool(sessionId);

    const tables = await this.getTables(pool, sessionId);
    const columns = await this.getColumns(pool, sessionId);
    const foreignKeys = await this.getForeignKeys(pool, sessionId);

    return new ResTablesDto(this.mapTablesWithColumnsAndKeys(tables, columns, foreignKeys));
  }

  async find(sessionId: string, tableName: string) {
    const pool = this.queryDBAdapter.getAdminPool(sessionId);

    const tables = await this.getTables(pool, sessionId, tableName);
    const columns = await this.getColumns(pool, sessionId, tableName);
    const foreignKeys = await this.getForeignKeys(pool, sessionId, tableName);

    return this.mapTablesWithColumnsAndKeys(tables, columns, foreignKeys)[0] || [];
  }

  private async getTables(pool: Pool, schema: string, tableName?: string) {
    const query = `
    SELECT TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = ? ${tableName ? 'AND TABLE_NAME = ?' : ''}
  `;
    const params = tableName ? [schema, tableName] : [schema];
    const [tables] = await pool.query(query, params);
    return tables as any[];
  }

  private async getColumns(pool: Pool, schema: string, tableName?: string) {
    const query = `
    SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_KEY, EXTRA, IS_NULLABLE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ? ${tableName ? 'AND TABLE_NAME = ?' : ''}
  `;
    const params = tableName ? [schema, tableName] : [schema];
    const [columns] = await pool.query(query, params);
    return columns as any[];
  }

  private async getForeignKeys(pool: Pool, schema: string, tableName?: string) {
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
    const [foreignKeys] = await pool.query(query, params);
    return foreignKeys as any[];
  }

  private mapTablesWithColumnsAndKeys(
    tables: any[],
    columns: any[],
    foreignKeys: any[],
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

        return new ColumnDto({
          name: col.COLUMN_NAME,
          type: col.DATA_TYPE,
          PK: col.COLUMN_KEY === 'PRI',
          FK: fk
            ? `${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`
            : null,
          UQ: col.COLUMN_KEY === 'UNI',
          AI: col.EXTRA.includes('auto_increment'),
          NN: col.IS_NULLABLE === 'NO',
          IDX: col.COLUMN_KEY === 'MUL',
        });
      });

      return new ResTableDto({
        tableName: table.TABLE_NAME || null,
        columns: columnDtos || null,
      });
    });
  }
}
