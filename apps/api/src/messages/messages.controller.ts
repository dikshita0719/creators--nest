import { Body, Controller, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createMessageInputSchema } from '@creators/types';
import { AuthGuard } from '../auth/auth.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { PrismaService } from '../prisma.service';

@Controller('bookings/:bookingId/messages')
@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Param('bookingId') bookingId: string, @Req() request: any) {
    await this.authorizeBooking(bookingId, request.user);
    return this.prisma.message.findMany({ where: { bookingId }, orderBy: { createdAt: 'asc' }, include: { sender: { include: { profile: true } } } });
  }

  @Post()
  async create(@Param('bookingId') bookingId: string, @Req() request: any, @Body(new ZodValidationPipe(createMessageInputSchema)) body: any) {
    await this.authorizeBooking(bookingId, request.user);
    return this.prisma.message.create({ data: { bookingId, senderId: request.user.id, content: body.content } });
  }

  private async authorizeBooking(bookingId: string, user: { id: string; role: string }) {
    const booking = await this.prisma.booking.findFirst({ where: { id: bookingId, OR: [{ clientId: user.id }, { creatorId: user.id }, ...(user.role === 'admin' ? [{}] : [])] }, select: { id: true } });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}