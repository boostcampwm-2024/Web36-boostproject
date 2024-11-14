import { Expose, Transform } from 'class-transformer';

export class ResShellResultDto {
  /**
   * 쉘 Id
   * @example 1
   */
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  /**
   * 쿼리 실행 성공 여부
   * @example true
   */
  @Expose()
  queryStatus: boolean;

  /**
   * 쿼리 실행 시간 (초)
   * @example "0.01"
   */
  @Expose()
  runTime: string;

  /**
   * 쿼리의 타입
   * @example "CREATE"
   */
  @Expose()
  query: string;

  /**
   * 사용자 쿼리 요청
   * @example "select * from users"
   */
  @Expose()
  queryType: string;

  /**
   * 실패 시 응답 메시지
   * @example "You have an error in your SQL syntax; check the manual..."
   */
  @Expose()
  failMessage: string;

  /**
   * 영향받은 행의 수
   * @example 2
   */
  @Expose()
  affectedRows: number;

  /**
   * 쿼리 결과 데이터 (테이블 형식)
   */
  @Expose()
  table: object;
}
