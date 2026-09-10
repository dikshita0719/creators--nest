import { Module } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PrismaService } from '../prisma.service';
import { MessagesController } from './messages.controller';

@Module({ controllers: [MessagesController], providers: [PrismaService, AuthGuard] })
export class MessagesModule {}