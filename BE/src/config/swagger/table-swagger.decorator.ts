import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from '../../common/response/response.dto';
import { ResTableDto } from '../../table/dto/res-table.dto';
import { ResTablesDto } from '../../table/dto/res-tables.dto';

export function GetTableSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '테이블을 가져온다.',
      description: '요청한 테이블이름에 대한 정보를 가져온다.',
    }),
    ApiOkResponse({
      description: '쉘 생성 요청 성공 시',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(ResTableDto) },
            },
          },
        ],
      },
    }),
  );
}

export function GetTableListSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '모든 테이블 정브를 가져온다.',
      description: '현재 session에 대한 모든 테이블 정보를 가져온다',
    }),
    ApiOkResponse({
      description: '모든 테이블 가져오기 성공시',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(ResTablesDto) },
            },
          },
        ],
      },
    }),
  );
}
