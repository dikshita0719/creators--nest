import { NotFoundException } from '@nestjs/common';
import { MessagesController } from '../src/messages/messages.controller';

function createDependencies() {
  return {
    booking: { findFirst: jest.fn() },
    message: { findMany: jest.fn(), create: jest.fn() },
  };
}

describe('MessagesController', () => {
  it('rejects a user who is not part of the booking', async () => {
    const dependencies = createDependencies();
    dependencies.booking.findFirst.mockResolvedValue(null);
    const controller = new MessagesController(dependencies as never);

    await expect(controller.list('booking-1', { user: { id: 'other-user', role: 'client' } })).rejects.toBeInstanceOf(NotFoundException);
    expect(dependencies.message.findMany).not.toHaveBeenCalled();
  });

  it('creates a message with the authenticated sender', async () => {
    const dependencies = createDependencies();
    dependencies.booking.findFirst.mockResolvedValue({ id: 'booking-1' });
    dependencies.message.create.mockResolvedValue({ id: 'message-1', bookingId: 'booking-1', senderId: 'client-1', content: 'Hello' });
    const controller = new MessagesController(dependencies as never);

    const result = await controller.create('booking-1', { user: { id: 'client-1', role: 'client' } }, { content: 'Hello' });

    expect(dependencies.message.create).toHaveBeenCalledWith({ data: { bookingId: 'booking-1', senderId: 'client-1', content: 'Hello' } });
    expect(result).toEqual(expect.objectContaining({ senderId: 'client-1' }));
  });
});