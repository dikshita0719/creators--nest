import { ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from '../src/auth/auth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-characters';
  });

  it('rejects a forged payload with an invalid signature', () => {
    const request = { headers: { authorization: `Bearer stub.${Buffer.from(JSON.stringify({ id: 'attacker', role: 'admin' })).toString('base64url')}.signature` } };
    const context = { switchToHttp: () => ({ getRequest: () => request }) } as ExecutionContext;

    expect(() => new AuthGuard().canActivate(context)).toThrow('Invalid token');
  });

  it('attaches claims from a valid signed token', () => {
    const token = jwt.sign({ sub: 'user-1', email: 'user@example.com', role: 'client' }, process.env.JWT_SECRET!, { algorithm: 'HS256' });
    const request = { headers: { authorization: `Bearer ${token}` } } as { headers: Record<string, string>; user?: unknown };
    const context = { switchToHttp: () => ({ getRequest: () => request }) } as ExecutionContext;

    expect(new AuthGuard().canActivate(context)).toBe(true);
    expect(request.user).toEqual({ id: 'user-1', email: 'user@example.com', role: 'client' });
  });

  it('authenticates from the httpOnly cookie', () => {
    const token = jwt.sign({ sub: 'user-1', email: 'user@example.com', role: 'client' }, process.env.JWT_SECRET!, { algorithm: 'HS256' });
    const request = { headers: {}, cookies: { access_token: token } } as { headers: Record<string, string>; cookies: Record<string, string>; user?: unknown };
    const context = { switchToHttp: () => ({ getRequest: () => request }) } as ExecutionContext;

    expect(new AuthGuard().canActivate(context)).toBe(true);
    expect(request.user).toEqual({ id: 'user-1', email: 'user@example.com', role: 'client' });
  });
});