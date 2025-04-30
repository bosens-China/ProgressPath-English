import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './public.decorator';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('未提供访问令牌');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      // 验证 token 类型 (根据之前的逻辑)
      if (
        !payload.type ||
        (payload.type !== 'admin' && payload.type !== 'user')
      ) {
        throw new UnauthorizedException('无效的令牌类型');
      }

      // 将 payload 附加到请求对象，以便后续使用
      request['user'] = payload;
    } catch (error) {
      // 处理 JWT 错误 (例如过期、无效签名)
      if (
        error instanceof Error &&
        (error.name === 'TokenExpiredError' ||
          error.name === 'JsonWebTokenError')
      ) {
        throw new UnauthorizedException('无效或过期的访问令牌');
      }
      // 抛出其他验证过程中可能出现的错误
      throw new UnauthorizedException(error.message || '身份验证失败');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
