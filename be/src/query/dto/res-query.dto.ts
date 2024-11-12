import { QueryType } from '../../common/enums/query-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ResQueryDto {
  constructor() {}

  /**
   * 쿼리 실행 성공 여부
   * @example true
   */
  queryStatus: boolean;

  /**
   * 쿼리 실행 시간 (초)
   * @example "0.01"
   */
  runTime: string;

  /**
   * 쿼리의 타입
   * @example "CREATE"
   */
  queryType: QueryType;

  /**=
   * 실패 시 응답 메시지
   * @example "You have an error in your SQL syntax; check the manual..."
   */
  failMessage: string | null;

  /**
   * 영향받은 행의 수
   * @example 2
   */
  affectedRows: number;

  /**
   * 쿼리 결과 데이터 (테이블 형식)
   */
  @ApiProperty({
    example: [
      { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
      { id: 2, name: 'Jane Doe', email: 'janedoe@example.com' },
    ],
  })
  resultTable: any[];
}
