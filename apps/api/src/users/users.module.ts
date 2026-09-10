import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';
import { UsersController } from './users.controller';
@Module({ controllers: [UsersController], providers: [PrismaService, AuthGuard] })
export class UsersModule {}
