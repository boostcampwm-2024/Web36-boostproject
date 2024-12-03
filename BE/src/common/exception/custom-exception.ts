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

export class ConnectionLimitExceedException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too many users right now! Please try again soon.',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
