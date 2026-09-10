import { BookingsController } from '../src/bookings/bookings.controller';

function createDependencies() {
  return {
    prisma: {
      listing: { findUniqueOrThrow: jest.fn() },
      booking: {
        create: jest.fn(),
        findFirstOrThrow: jest.fn(),
        update: jest.fn(),
      },
    },
    payments: {
      createIntent: jest.fn(),
      capture: jest.fn(),
    },
  };
}

describe('BookingsController', () => {
  it('creates a pending booking and payment intent for a client', async () => {
    const dependencies = createDependencies();
    dependencies.prisma.listing.findUniqueOrThrow.mockResolvedValue({ id: 'listing-1', creatorId: 'creator-1', price: 1200, currency: 'USD' });
    dependencies.prisma.booking.create.mockResolvedValue({ id: 'booking-1', amount: 1200, currency: 'USD', status: 'pending' });
    dependencies.payments.createIntent.mockResolvedValue({ paymentIntentId: 'pi_stub_1' });
    const controller = new BookingsController(dependencies.prisma as never, dependencies.payments as never);

    const result = await controller.create(
      { user: { id: 'client-1', role: 'client' } },
      { listingId: 'listing-1', startAt: new Date('2026-10-15T10:00:00Z'), endAt: new Date('2026-10-15T18:00:00Z') },
    );

    expect(dependencies.prisma.booking.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ clientId: 'client-1', creatorId: 'creator-1', amount: 1200, currency: 'USD' }) }));
    expect(dependencies.payments.createIntent).toHaveBeenCalledWith(1200, 'USD');
    expect(result).toEqual(expect.objectContaining({ id: 'booking-1', payment: { paymentIntentId: 'pi_stub_1' } }));
  });

  it('captures payment before confirming a pending creator booking', async () => {
    const dependencies = createDependencies();
    dependencies.prisma.booking.findFirstOrThrow.mockResolvedValue({ id: 'booking-1', status: 'pending' });
    dependencies.payments.capture.mockResolvedValue({ success: true });
    dependencies.prisma.booking.update.mockResolvedValue({ id: 'booking-1', status: 'confirmed' });
    const controller = new BookingsController(dependencies.prisma as never, dependencies.payments as never);

    const result = await controller.confirm('booking-1', { user: { id: 'creator-1', role: 'creator' } });

    expect(dependencies.payments.capture).toHaveBeenCalledWith('pi_stub_booking-1');
    expect(dependencies.prisma.booking.update).toHaveBeenCalledWith({ where: { id: 'booking-1' }, data: { status: 'confirmed' } });
    expect(result).toEqual({ id: 'booking-1', status: 'confirmed' });
  });
});
