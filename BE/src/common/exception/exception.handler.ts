import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(Error)
export class ExceptionHandler implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      error instanceof HttpException ? error.getResponse() : null;

    const message =
      exceptionResponse && Array.isArray(exceptionResponse['message'])
        ? exceptionResponse['message'].join(', ')
        : error.message;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(error);
    }
    response.status(status).json({
      status: false,
      error: {
        code: status,
        message: message,
      },
    });
  }
}
