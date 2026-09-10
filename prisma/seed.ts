import { PrismaClient, UserRole, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();
const demoPasswordHash = '$2b$12$lidSoP6hJhYrTBf7hsPZPewNVeAigzDBoEFLGF11BEKbNWLAA33Pu';

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { passwordHash: demoPasswordHash },
    create: { email: 'admin@example.com', passwordHash: demoPasswordHash, role: UserRole.admin, profile: { create: { displayName: 'Marketplace Admin' } } },
  });
  const creator = await prisma.user.upsert({
    where: { email: 'creator@example.com' },
    update: { passwordHash: demoPasswordHash },
    create: { email: 'creator@example.com', passwordHash: demoPasswordHash, role: UserRole.creator, profile: { create: { displayName: 'Alex Creator', bio: 'Documentary and event videographer', location: 'Portland' } }, creator: { create: { categories: ['events', 'documentary'], hourlyRate: 150 } } },
  });
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: { passwordHash: demoPasswordHash },
    create: { email: 'client@example.com', passwordHash: demoPasswordHash, role: UserRole.client, profile: { create: { displayName: 'Jamie Client' } } },
  });
  const listing = await prisma.listing.upsert({
    where: { id: 'sample-listing' },
    update: {},
    create: { id: 'sample-listing', creatorId: creator.id, title: 'Event highlight film', description: 'A polished 3-minute highlight film for your next event.', price: 1200, currency: 'USD' },
  });
  await prisma.booking.upsert({
    where: { id: 'sample-booking' },
    update: {},
    create: { id: 'sample-booking', clientId: client.id, creatorId: creator.id, listingId: listing.id, startAt: new Date('2026-10-15T10:00:00Z'), endAt: new Date('2026-10-15T18:00:00Z'), status: BookingStatus.pending, amount: listing.price, currency: listing.currency },
  });
  console.log(`Seeded ${admin.email}, ${creator.email}, ${client.email}, and sample booking. Demo password: password123`);
}

main().finally(() => prisma.$disconnect());
