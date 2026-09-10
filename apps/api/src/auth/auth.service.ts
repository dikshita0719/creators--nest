import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export type AuthUser = { id: string; email: string; role: 'client' | 'creator' | 'admin' };

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(input: { email: string; password: string; role: 'client' | 'creator'; displayName?: string }) {
    const user = await this.prisma.user.create({ data: { email: input.email, role: input.role, profile: { create: { displayName: input.displayName ?? input.email.split('@')[0] } }, ...(input.role === 'creator' ? { creator: { create: { categories: [], hourlyRate: 0 } } } : {}) } });
    return this.issue(user);
  }

  async login(email: string): Promise<{ token: string; user: AuthUser }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.issue(user);
  }

  issue(user: AuthUser) {
    const token = `stub.${Buffer.from(JSON.stringify(user)).toString('base64url')}.signature`;
    return { token, user };
  }
}
