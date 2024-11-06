import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { QueryDto } from '../../query/dto/query.dto';
import { ResponseDto } from '../../common/response/response.dto';
import { ResQueryDto } from '../../query/dto/res-query.dto';

export function ExecuteQuerySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자의 쿼리를 실행 시킨다.',
      description: '단일 쿼리만 지원합니다.',
    }),
    ApiBody({ type: QueryDto }),
    ApiResponse({
      status: 200,
      description: '사용자 쿼리 요청 성공 시',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(ResQueryDto) },
            },
          },
        ],
      },
    }),
    ApiResponse({
      status: 400,
      description: 'MySQL에서 요청 쿼리에 대해 오류가 발생할 경우',
    }),
  );
}
