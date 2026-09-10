import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma.service';

export type AuthUser = { id: string; email: string; role: 'client' | 'creator' | 'admin' };

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(input: { email: string; password: string; role: 'client' | 'creator'; displayName?: string }) {
    const email = input.email.toLowerCase();
    const user = await this.prisma.user.create({ data: { email, passwordHash: await bcrypt.hash(input.password, 12), role: input.role, profile: { create: { displayName: input.displayName ?? email.split('@')[0] } }, ...(input.role === 'creator' ? { creator: { create: { categories: [], hourlyRate: 0 } } } : {}) } });
    return this.issue(this.toAuthUser(user));
  }

  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) throw new UnauthorizedException('Invalid credentials');
    return this.issue(this.toAuthUser(user));
  }

  issue(user: AuthUser) {
    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, this.jwtSecret(), { algorithm: 'HS256', expiresIn: '1h' });
    return { token, user };
  }

  private toAuthUser(user: { id: string; email: string; role: AuthUser['role'] }): AuthUser {
    return { id: user.id, email: user.email, role: user.role };
  }

  private jwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');
    return secret;
  }
}
