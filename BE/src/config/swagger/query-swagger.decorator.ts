import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from '../../common/response/response.dto';
import { ResQueryDto } from '../../query/dto/res-query.dto';

export function ExecuteQuerySwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자의 쿼리를 실행 시킨다.',
      description: '현재는 단일 쿼리만 지원합니다.',
    }),
    ApiCreatedResponse({
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
    ApiBadRequestResponse({
      description: 'MySQL에서 요청 쿼리에 대해 오류가 발생할 경우',
    }),
    ApiTooManyRequestsResponse({
      description: 'DB 커넥션이 없을 경우',
    }),
    ApiUnprocessableEntityResponse({
      description: '데이터 용량 제한을 이상으로 삽입하려는 경우',
    }),
  );
}
