import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ListingsController } from './listings.controller';
@Module({ controllers: [ListingsController], providers: [PrismaService, AuthGuard, RolesGuard] })
export class ListingsModule {}
