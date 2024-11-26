import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from '../../common/response/response.dto';
import { ResQueryDto } from '../../query/dto/res-query.dto';
import { ResRecordDto } from '../../record/dto/res-record.dto';

export function ExecuteRecordSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자는 테이블에 조건에 따른 랜덤 데이터를 삽입할 수 있다.',
      description: '테이블에 따라 삽입이 가능합니다.',
    }),
    ApiCreatedResponse({
      description: '요청 성공 시',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(ResRecordDto) },
            },
          },
        ],
      },
    }),
    ApiBadRequestResponse({
      description: 'MySQL에서 요청 쿼리에 대해 오류가 발생할 경우',
    }),
  );
}
