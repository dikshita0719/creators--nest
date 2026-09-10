import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';

describe('AuthService', () => {
  const user = { id: 'user-1', email: 'user@example.com', role: 'client' as const, passwordHash: bcrypt.hashSync('correct password', 4) };

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-characters';
  });

  it('rejects an incorrect password', async () => {
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue(user) } };
    const service = new AuthService(prisma as never);

    await expect(service.login(user.email, 'wrong password')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('issues a signed JWT after verifying the password', async () => {
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue(user) } };
    const service = new AuthService(prisma as never);

    const result = await service.login(user.email, 'correct password');

    expect(result.user).toEqual({ id: user.id, email: user.email, role: user.role });
    expect(result.token.split('.')).toHaveLength(3);
  });
});