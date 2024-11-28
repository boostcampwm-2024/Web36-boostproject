import { HttpException, HttpStatus } from '@nestjs/common';

export class DataLimitExceedException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Too much data! Please reduce it and try again.',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
