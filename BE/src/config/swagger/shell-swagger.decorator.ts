import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from '../../common/response/response.dto';
import { ResShellDto } from '../../shell/dto/res-shell.dto';
import { ResShellResultDto } from '../../shell/dto/res-shell-result.dto';

export function CreateShellSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '쉘을 생성한다.',
      description: '쉘을 추가하면 쉘을 생성한다.',
    }),
    ApiCreatedResponse({
      description: '쉘 생성 요청 성공 시',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(ResShellDto) },
            },
          },
        ],
      },
    }),
  );
}

export function UpdateShellSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '쉘을 수정한다.',
      description: '쉘에 쿼리를 수정할때 실행.',
    }),
    ApiOkResponse({
      description: '쉘 수정 성공시',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(ResShellDto) },
            },
          },
        ],
      },
    }),
  );
}

export function GetAllShellSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '모든 쉘을 가져온다',
      description: '사용자 세션에 해당하는 모든 쉘을 가져온다',
    }),
    ApiOkResponse({
      description: '성공시',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(ResShellResultDto) },
              },
            },
          },
        ],
      },
    }),
  );
}

export function GetShellSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: '특정 쉘을 가져온다.',
      description: '특정 쉘을 렌더링 할때 실행.',
    }),
    ApiOkResponse({
      description: '성공시',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(ResShellResultDto) },
            },
          },
        ],
      },
    }),
  );
}
