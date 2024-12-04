import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';

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

    let message =
      exceptionResponse && Array.isArray(exceptionResponse['message'])
        ? exceptionResponse['message'].join(', ')
        : error.message;

    if (error instanceof ZodValidationException)
      message = error.getZodError().errors[0].message;

    response.status(status).json({
      status: false,
      error: {
        code: status,
        message: message,
      },
    });
  }
}
