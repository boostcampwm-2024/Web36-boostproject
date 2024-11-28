import { Expose } from 'class-transformer';

export class ResUsageDto {
  /**
   * 사용중인 row 수
   * @example 100
   */
  @Expose()
  currentUsage: number;

  /**
   * 사용가능한 최대 row 수
   * @example 10000
   */
  @Expose()
  availUsage: number;
}
