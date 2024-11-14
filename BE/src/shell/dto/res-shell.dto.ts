import { Expose } from 'class-transformer';

export class ResShellDto {
  /**
   * 쉘 Id
   * @example 1
   */
  @Expose()
  id: number;
  /**
   * 저장된 쿼리, 쿼리 생성시에는 없다
   * @example "select * from users;"
   */
  @Expose()
  query: string;
}
