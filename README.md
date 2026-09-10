# Framefolk Marketplace

A pragmatic two-sided marketplace MVP connecting clients with videographers and creators. Framefolk is designed to feel like a small creative studio directory: clients can discover a point of view, while creators can present a focused offering and manage booking requests. Auth and payments are intentionally local stubs with documented replacement points.

## Deployment

- [Deployment guide](docs/deployment.md)
- Web: [https://creators-nest-web.vercel.app](https://creators-nest-web.vercel.app)
- API: deploys on Render; use the service URL in `NEXT_PUBLIC_API_URL` and `CORS_ORIGIN`

GitHub Actions CI is passing, and Render auto-deploys the `main` branch after successful changes. The API health endpoint is available at `/health` on the Render service URL.

## Stack

TypeScript, pnpm workspaces, Next.js App Router, NestJS, Prisma, PostgreSQL, Zod, React Hook Form, and Tailwind CSS.

## Prerequisites

- Node.js 22+
- Corepack-enabled pnpm 9+
- PostgreSQL 14+ running locally
- Docker Desktop is optional, but useful for running PostgreSQL without a local install

## Setup

```bash
corepack enable
corepack pnpm install
Copy-Item .env.example .env # PowerShell; use cp .env.example .env in bash
corepack pnpm db:generate
corepack pnpm db:migrate
corepack pnpm db:seed
corepack pnpm dev
```

The default `.env.example` expects `postgresql://postgres:postgres@localhost:5432/creators?schema=public`. With Docker Desktop, start the database first:

```powershell
docker run --name creators-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=creators -p 5432:5432 -d postgres:16
```

If that container already exists, use `docker start creators-postgres` instead.

Open `http://localhost:3000` for the web app. The API runs at `http://localhost:3001`; `GET /health` returns `{ "ok": true }`. Swagger UI is available at `/docs`.

The seed accounts are `admin@example.com`, `creator@example.com`, and `client@example.com`. The stub login only needs an email and any non-empty password.

## Check the core flow

1. Open the web app and choose **Find a creator**.
2. Open the seeded **Event highlight film** offering.
3. Sign in as `client@example.com` and request a booking date.
4. Open **Studio**, sign out by clearing the browser's local storage, and sign in as `creator@example.com`.
5. Confirm the pending booking from the creator dashboard.

The interface uses an editorial studio direction: paper texture, ink typography, coral/cobalt/moss accents, and contact-sheet artwork. The visual language is intentionally expressive on discovery pages while keeping forms, status, prices, and booking actions restrained and scannable for repeated use.

## Commands

- `corepack pnpm dev`: run web and API together
- `corepack pnpm lint`: run all ESLint checks
- `corepack pnpm typecheck`: check all TypeScript packages
- `corepack pnpm test`: run workspace tests
- `corepack pnpm build`: build web and API
- `corepack pnpm db:migrate`: apply the committed Prisma migration
- `corepack pnpm exec prisma migrate deploy`: apply committed migrations to a production database
- `corepack pnpm db:studio`: open Prisma Studio
- `corepack pnpm openapi:export`: regenerate `docs/api/openapi.yaml` from Nest controllers

## API and security notes

The deployed MVP is suitable for testing, not real payments. The JWT is a base64url payload with a `stub` prefix, the API does not verify passwords, and the browser stores it in `localStorage`. `PaymentService` returns a fake intent and simulates capture. Before monetization, replace these stubs with Clerk authentication, secure session handling, Stripe Connect PaymentIntents, persisted provider IDs, and verified webhook handling. See [docs/architecture.md](docs/architecture.md) and [docs/deployment.md](docs/deployment.md).

## Project layout

`apps/web` is the Next frontend, `apps/api` is the Nest API, `packages/types` contains shared Zod contracts, `prisma` contains schema/migrations/seed, and `docs` contains architecture, ADR, and OpenAPI documentation. CI runs install, lint, typecheck, tests, and builds on pushes and pull requests.
