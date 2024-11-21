import { Expose } from 'class-transformer';

export class ResUsageDto {
  /**
   * 사용중인 row 수
   * @example 100
   */
  @Expose()
  totalRowCount: number;
}
