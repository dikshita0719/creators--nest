# Contributing

1. Copy `.env.example` to `.env` and ensure PostgreSQL is running.
2. Run `corepack enable`, `pnpm install`, and `pnpm db:migrate`.
3. Make focused changes and add a test when behavior changes.
4. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` before opening a pull request.

Use conventional, readable TypeScript. Keep provider-specific auth and payment code behind the existing service boundaries.
