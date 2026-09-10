import { z } from 'zod';

export const userRoleSchema = z.enum(['client', 'creator', 'admin']);
export const bookingStatusSchema = z.enum(['pending', 'confirmed', 'completed', 'cancelled']);

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  createdAt: z.coerce.date(),
});

export const listingSchema = z.object({
  id: z.string(),
  creatorId: z.string(),
  title: z.string().min(1),
  description: z.string(),
  price: z.number().int().nonnegative(),
  currency: z.string().length(3),
  active: z.boolean(),
});

export const bookingSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  creatorId: z.string(),
  listingId: z.string(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  status: bookingStatusSchema,
  amount: z.number().int().nonnegative(),
  currency: z.string().length(3),
  createdAt: z.coerce.date(),
});

export const registerInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: userRoleSchema.exclude(['admin']).default('client'),
  displayName: z.string().min(1).optional(),
});

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createListingInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().int().nonnegative(),
  currency: z.string().length(3).default('USD'),
});

export const createBookingInputSchema = z.object({
  listingId: z.string().min(1),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
}).refine((input) => input.endAt > input.startAt, {
  message: 'End time must be after start time',
  path: ['endAt'],
});

export type User = z.infer<typeof userSchema>;
export type Listing = z.infer<typeof listingSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type CreateListingInput = z.infer<typeof createListingInputSchema>;
export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;
