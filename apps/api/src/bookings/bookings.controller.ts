import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { createBookingInputSchema } from '@creators/types';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { PrismaService } from '../prisma.service';
import { PaymentService } from '../payment.service';

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly prisma: PrismaService, private readonly payments: PaymentService) {}
  @Get()
  list(@Req() request: any) {
    const where = request.user.role === 'creator' ? { creatorId: request.user.id } : request.user.role === 'admin' ? {} : { clientId: request.user.id };
    return this.prisma.booking.findMany({ where, orderBy: { createdAt: 'desc' }, include: { listing: true } });
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('client')
  async create(@Req() request: any, @Body(new ZodValidationPipe(createBookingInputSchema)) body: any) {
    const listing = await this.prisma.listing.findUniqueOrThrow({ where: { id: body.listingId } });
    const booking = await this.prisma.booking.create({ data: { clientId: request.user.id, creatorId: listing.creatorId, listingId: listing.id, startAt: body.startAt, endAt: body.endAt, amount: listing.price, currency: listing.currency } });
    return { ...booking, payment: await this.payments.createIntent(booking.amount, booking.currency) };
  }
  @Get(':id')
  get(@Param('id') id: string, @Req() request: any) { return this.prisma.booking.findFirstOrThrow({ where: { id, OR: [{ clientId: request.user.id }, { creatorId: request.user.id }, ...(request.user.role === 'admin' ? [{}] : [])] }, include: { listing: true, client: { include: { profile: true } }, creator: { include: { user: { include: { profile: true } } } } } }); }
  @Post(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles('creator')
  async confirm(@Param('id') id: string, @Req() request: any) {
    const booking = await this.prisma.booking.findFirstOrThrow({ where: { id, creatorId: request.user.id, status: 'pending' } });
    const payment = await this.payments.capture(`pi_stub_${booking.id}`);
    return this.prisma.booking.update({ where: { id }, data: { status: payment.success ? 'confirmed' : 'pending' } });
  }
}
