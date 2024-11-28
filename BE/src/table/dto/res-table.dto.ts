import { Expose } from 'class-transformer';

export class ResTableDto {
  @Expose()
  tableName: string;

  @Expose()
  columns: ColumnDto[];

  constructor(init?: Partial<ResTableDto>) {
    Object.assign(this, init);
  }
}

export class ColumnDto {
  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  PK: boolean;

  @Expose()
  FK: string;

  @Expose()
  IDX: boolean;

  @Expose()
  UQ: boolean;

  @Expose()
  AI: boolean;

  @Expose()
  NN: boolean;

  constructor(init?: Partial<ColumnDto>) {
    Object.assign(this, init);
  }
}
