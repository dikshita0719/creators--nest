import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { ListingsModule } from './listings/listings.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { AppController } from './app.controller';

@Module({ controllers: [AppController], imports: [AuthModule, UsersModule, ListingsModule, BookingsModule], providers: [PrismaService] })
export class AppModule {}
