import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof BadRequestException) {
      const { message: msg } = exception.getResponse() as any;
      message = Array.isArray(msg) ? msg.join('\n') : `${msg}`;
      status = exception.getStatus();
    } else if (exception instanceof UnauthorizedException) {
      status = 401;
      message = '身份验证失败，请重新登录';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    response.status(status).json({
      code: status,
      msg: message,
      data: null,
    });
  }
}
