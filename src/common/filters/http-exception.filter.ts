import { Response } from 'express';
import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    const responseObject = {
      code: status,
      message
    };

    return response.status(status).json(responseObject);
  }
}
