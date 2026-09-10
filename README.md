# Framefolk Marketplace

A pragmatic two-sided marketplace MVP connecting clients with videographers and creators. The web app supports browsing listings, stub registration/login, booking requests, and creator confirmation. Auth and payments are intentionally local stubs with documented replacement points.

## Stack

TypeScript, pnpm workspaces, Next.js App Router, NestJS, Prisma, PostgreSQL, Zod, React Hook Form, and Tailwind CSS.

## Prerequisites

- Node.js 22+
- Corepack-enabled pnpm 9+
- PostgreSQL 14+ running locally

## Setup

```bash
cp .env.example .env
corepack enable
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open `http://localhost:3000` for the web app. The API runs at `http://localhost:3001`; `GET /health` returns `{ "ok": true }`. Swagger UI is available at `/docs`.

The seed accounts are `admin@example.com`, `creator@example.com`, and `client@example.com`. The stub login only needs an email and any non-empty password. Use `client@example.com` to request the seeded listing, then `creator@example.com` to confirm it.

## Commands

- `pnpm dev`: run web and API together
- `pnpm lint`: run formatting/lint checks
- `pnpm typecheck`: check all TypeScript packages
- `pnpm test`: run workspace tests
- `pnpm build`: build web and API
- `pnpm db:migrate`: create/apply a Prisma migration
- `pnpm db:studio`: open Prisma Studio
- `pnpm openapi:export`: refresh the checked-in OpenAPI document

## API and security notes

The JWT is a base64url payload with a `stub` prefix, and the API does not verify passwords. The browser stores it in `localStorage` for MVP simplicity. Before production, use Clerk/Auth0 verification and an httpOnly secure cookie. `PaymentService` returns a fake intent and logs capture; replace it with Stripe Connect PaymentIntents, persisted provider IDs, and webhook handling. See `docs/architecture.md`.

## Project layout

`apps/web` is the Next frontend, `apps/api` is the Nest API, `packages/types` contains shared Zod contracts, `prisma` contains schema/seed, and `docs` contains architecture, ADR, and OpenAPI documentation.
