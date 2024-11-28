import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { QueryType } from 'src/common/enums/query-type.enum';

export class ResShellResultDto {
  /**
   * 쉘 Id
   * @example 1
   */
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  /**
   * 사용자 쿼리 요청
   * @example "select * from users"
   */
  @Expose()
  query: string;

  /**
   * 쿼리 실행 성공 여부
   * @example true
   */
  @Expose()
  queryStatus: boolean;

  /**
   * 쿼리의 타입
   * @example "CREATE"
   */
  @Expose()
  queryType: QueryType;

  /**
   * 쿼리 결과 문구
   */
  @Expose()
  text: string;

  /**
   * 쿼리 결과 데이터 (테이블 형식)
   */
  @ApiProperty({
    example: [
      { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
      { id: 2, name: 'Jane Doe', email: 'janedoe@example.com' },
    ],
  })
  @Expose()
  resultTable: any[];
}
