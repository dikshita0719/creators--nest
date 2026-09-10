import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaymentService } from '../payment.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { BookingsController } from './bookings.controller';
@Module({ controllers: [BookingsController], providers: [PrismaService, PaymentService, AuthGuard, RolesGuard] })
export class BookingsModule {}
