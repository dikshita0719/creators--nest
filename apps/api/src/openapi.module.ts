import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { RolesGuard } from './auth/roles.guard';
import { BookingsController } from './bookings/bookings.controller';
import { ListingsController } from './listings/listings.controller';
import { MessagesController } from './messages/messages.controller';
import { AppController } from './app.controller';
import { PaymentService } from './payment.service';
import { PrismaService } from './prisma.service';
import { UsersController } from './users/users.controller';

@Module({
  controllers: [AppController, AuthController, UsersController, ListingsController, BookingsController, MessagesController],
  providers: [
    AuthService,
    PaymentService,
    AuthGuard,
    RolesGuard,
    { provide: PrismaService, useValue: {} },
  ],
})
export class OpenApiModule {}
