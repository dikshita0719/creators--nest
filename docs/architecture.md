# Architecture

## Shape

This repository is a pnpm workspace with two deployable applications and two shared packages:

- `apps/web` is a Next.js App Router frontend. It calls the API through `lib/api.ts` and currently stores the stub token in `localStorage`.
- `apps/api` is a NestJS REST API. Modules own auth, users, listings, and bookings; Prisma provides the database boundary.
- `packages/types` owns Zod input schemas and shared TypeScript output types.
- `packages/config` owns shared TypeScript configuration.
- `prisma` owns the PostgreSQL schema and seed data.

The normal flow is browser -> Next UI -> Nest API -> Prisma -> PostgreSQL. A booking is created as `pending`; a creator confirms it, which calls `PaymentService.capture()` before setting status to `confirmed`.

## Local data

The seed creates admin, creator, and client users plus a listing and pending booking. The auth stub accepts the seeded emails without storing or checking passwords. This is intentionally a development-only boundary.

## Production integration plan

Replace `AuthService` and `AuthGuard` with Clerk or Auth0 token verification. Keep the `AuthUser` shape and role checks so controllers do not need to know the identity provider. Move the web token from `localStorage` to an httpOnly, secure cookie through a Next route handler.

Replace `PaymentService` with Stripe Connect: create a PaymentIntent for the creator-connected account when a booking is requested, persist its ID, capture after confirmation, and process asynchronous webhook events for payment success, failure, refunds, and disputes. Do not treat the browser response as payment authority.
