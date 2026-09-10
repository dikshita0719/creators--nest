import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUser } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string>; user?: AuthUser }>();
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedException('Bearer token required');
    try {
      const payload = JSON.parse(Buffer.from(header.slice(7).split('.')[1], 'base64url').toString()) as AuthUser;
      if (!payload.id || !payload.role) throw new Error('invalid');
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid stub token');
    }
  }
}
