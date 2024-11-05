import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(Error)
export class ExceptionHandler implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const message = exception.message;

    response.status(HttpStatus.BAD_REQUEST).json({
      status: false,
      error: {
        code: 400,
        message: message,
      },
    });
  }
}
