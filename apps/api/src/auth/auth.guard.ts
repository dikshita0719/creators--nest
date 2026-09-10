import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthUser } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string>; cookies?: Record<string, string>; user?: AuthUser }>();
    const header = request.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : request.cookies?.access_token;
    if (!token) throw new UnauthorizedException('Authentication required');
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret || secret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');
      const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
      if (typeof payload === 'string' || !payload.sub || !payload.email || !payload.role || !['client', 'creator', 'admin'].includes(payload.role)) throw new Error('invalid');
      request.user = { id: payload.sub, email: payload.email, role: payload.role };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
