import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  Response,
  // Request,
} from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    console.log('status yeah', status);
    response.status(status).json({
      statusCode: status,
      error: message['error'],
      message:
        status === HttpStatus.UNAUTHORIZED
          ? 'You are not authenticated!'
          : message['message'],
    });
  }
}
