# Deployment Guide

This guide deploys the marketplace with Neon for PostgreSQL, Render for the NestJS API, and Vercel for the Next.js web app.

## 1. Database Setup (Neon)

1. Sign up at [neon.tech](https://neon.tech).
2. Create a new project.
3. Click **Connect** and copy both PostgreSQL connection strings:
   - The pooled URL, whose hostname includes `-pooler`, for the Render API.
   - The direct or unpooled URL, whose hostname does not include `-pooler`, for Prisma CLI commands.
4. Set both values locally in `.env` and in the Render API service.

   ```env
   DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
   DATABASE_URL_UNPOOLED=postgresql://user:password@host:5432/dbname?sslmode=require
   ```

5. Install dependencies and apply the committed production migrations:

   ```powershell
   $env:DATABASE_URL="your-neon-pooled-connection-string"
   $env:DATABASE_URL_UNPOOLED="your-neon-direct-connection-string"
   corepack pnpm install
   corepack pnpm exec prisma migrate deploy --schema prisma/schema.prisma
   ```

6. Verify the database connection and inspect the schema:

   ```bash
   corepack pnpm db:studio
   ```

Keep both Neon connection strings private. Do not commit them to GitHub or add them to Vercel. Do not run `db:seed` against the production database unless demo data is intentional.

## 2. Deploy API (Render)

1. Connect the GitHub repository to [Render](https://render.com).
2. Create a new **Web Service**.
3. Use these settings:

   | Setting           | Value                         |
   | ----------------- | ----------------------------- |
   | Name              | `creators-nest-api`           |
   | Region            | Closest to your users         |
   | Root Directory    | Leave blank (repository root) |
   | Environment       | `Docker`                      |
   | Dockerfile Path   | `apps/api/Dockerfile`         |
   | Health Check Path | `/health`                     |

4. Add these required environment variables:

   ```env
   DATABASE_URL=your-neon-pooled-connection-string
   DATABASE_URL_UNPOOLED=your-neon-direct-connection-string
   NODE_ENV=production
   CORS_ORIGIN=https://creators-nest-web.vercel.app
   JWT_SECRET=your-long-random-secret
   ```

   Render provides `PORT` automatically. Add the Clerk, Stripe, UploadThing, Resend, and Mux variables from `.env.example` when those integrations are configured.

5. Deploy the service.
6. Copy the API URL assigned by Render, for example:

   [https://your-api.onrender.com](https://your-api.onrender.com)

### Render monorepo note

The current Dockerfile copies the root workspace manifest, lockfile, shared packages, and Prisma schema. Leave Render's Root Directory blank so Docker uses the repository root as its build context. The image compiles `@creators/types`, generates Prisma Client, builds the API, and starts `dist/src/main.js`.

Enable Render auto-deploy for the `main` branch after the service is connected to GitHub. GitHub Actions runs install, Prisma generation, lint, typecheck, tests, and builds on pushes and pull requests. A passing CI run should be followed by the Render deployment for the pushed commit.

## 3. Deploy Web (Vercel)

1. Import the GitHub repository into [Vercel](https://vercel.com).
2. Select **Next.js** as the framework.
3. Use these settings:

   | Setting          | Value          |
   | ---------------- | -------------- |
   | Root Directory   | `apps/web`     |
   | Build Command    | `pnpm build`   |
   | Output Directory | `.next`        |
   | Install Command  | `pnpm install` |

4. Add the web environment variable. Set `NEXT_PUBLIC_API_URL` to the actual Render API URL, for example:

   ```env
   NEXT_PUBLIC_API_URL=https://creators-nest-api.onrender.com
   ```

   Add the public Clerk and Stripe variables required by the web app. Keep server-only secrets out of `NEXT_PUBLIC_*` variables.

5. Deploy the project.
6. The current deployed web URL is:

   [https://creators-nest-web.vercel.app](https://creators-nest-web.vercel.app)

If Vercel cannot install from the `apps/web` directory because it needs the workspace lockfile, set the repository root as the install context and keep the web project directory as `apps/web`. The build must still target the web workspace.

## 4. Verify Deployment

1. Check API health using the actual Render URL:

   [https://your-api.onrender.com/health](https://your-api.onrender.com/health)

   The response should be:

   ```json
   { "ok": true }
   ```

2. Check that the deployed web app loads:

   [https://creators-nest-web.vercel.app](https://creators-nest-web.vercel.app)

3. Check that API CORS allows the deployed web domain. Set the Render `CORS_ORIGIN` value to the exact Vercel origin, without a trailing path:

   ```env
   CORS_ORIGIN=https://creators-nest-web.vercel.app
   ```

4. Test the browser flow: sign in, browse a listing, submit a booking request, and confirm that the API responds without CORS or database errors.

## Current MVP limitations

The deployment is suitable for testing, but the current authentication and payment implementations are still stubs. The API does not yet verify passwords or sign real JWTs, and payment intents and captures are simulated. Implement Clerk authentication and Stripe Connect with verified webhooks before accepting real users' money.
