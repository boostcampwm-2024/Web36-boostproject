import { Expose } from 'class-transformer';

export class ResUsageDto {
  /**
   * 사용자 DB의 디스크 사용량
   * @example 100
   */
  @Expose()
  diskUsage: number;
}
