import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { PUBLIC_RESPONSE_KEY } from './decorators/public-response.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 检查控制器或处理函数上是否有PublicResponse装饰器
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_RESPONSE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果标记为公共响应，则不进行封装
    if (isPublic) {
      return next.handle();
    }

    // 否则使用标准响应封装
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        msg: 'success',
        data,
      })),
    );
  }
}
