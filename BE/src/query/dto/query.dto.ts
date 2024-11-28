import { IsString } from 'class-validator';

export class QueryDto {
  /**
   * 사용자 쿼리 요청
   * @example "select * from users"
   */
  @IsString()
  query: string;
}
