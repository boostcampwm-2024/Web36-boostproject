import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from '../../common/response/response.dto';
import { ResShellDto } from '../../shell/dto/res-shell.dto';

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
