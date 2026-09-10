# ADR-0001: TypeScript full-stack monorepo

- Status: accepted
- Date: 2026-09-10

## Decision

Use TypeScript across a pnpm workspace, Next.js for the web app, NestJS for the API, Prisma for PostgreSQL access, and Zod for shared validation.

## Rationale

One language reduces context switching and makes contracts reusable between the browser and API. Next App Router gives a practical path to server-rendered listing pages while keeping interactive booking forms simple. NestJS gives clear module and guard boundaries for role checks. Prisma makes the relational marketplace model explicit and keeps migrations reviewable. Zod provides runtime validation at the API boundary and the same inferred types in the web app.

Auth and payments are deliberately adapters in this MVP. This keeps local setup cheap while leaving clear replacement points for Clerk/Auth0 and Stripe Connect.
