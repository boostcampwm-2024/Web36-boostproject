import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(BadRequestException)
export class HttpExceptionHandler implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message = Array.isArray(exceptionResponse['message'])
      ? exceptionResponse['message'].join(', ')
      : exceptionResponse['message'] || exception.message;

    response.status(status).json({
      status: false,
      error: {
        code: status,
        message: message,
      },
    });
  }
}
