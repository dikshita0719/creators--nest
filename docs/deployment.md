# Deployment Guide

This guide deploys the marketplace with Neon for PostgreSQL, Render for the NestJS API, and Vercel for the Next.js web app.

## 1. Database Setup (Neon)

1. Sign up at [neon.tech](https://neon.tech).
2. Create a new project.
3. Copy the project's PostgreSQL connection string.
4. Set `DATABASE_URL` locally in `.env`.

   ```env
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```

5. Install dependencies and apply the committed migrations:

   ```bash
   corepack pnpm install
   corepack pnpm db:migrate
   ```

6. Verify the database connection and inspect the schema:

   ```bash
   corepack pnpm db:studio
   ```

Keep the Neon connection string private. Use the pooled connection string for application traffic when Neon provides one, and use the direct connection string for Prisma migrations if required by the project configuration.

## 2. Deploy API (Render)

1. Connect the GitHub repository to [Render](https://render.com).
2. Create a new **Web Service**.
3. Use these settings:

   | Setting           | Value                 |
   | ----------------- | --------------------- |
   | Name              | `creators-nest-api`   |
   | Region            | Closest to your users |
   | Root Directory    | `apps/api`            |
   | Environment       | `Docker`              |
   | Dockerfile Path   | `apps/api/Dockerfile` |
   | Health Check Path | `/health`             |

4. Add all API and integration environment variables from the root `.env.example`, including `DATABASE_URL`, `PORT`, `CORS_ORIGIN`, Clerk, Stripe, UploadThing, Resend, and Mux variables.
5. Deploy the service.
6. Copy the API URL, for example:

   [https://creators-nest-api.onrender.com](https://creators-nest-api.onrender.com)

### Render monorepo note

The current Dockerfile copies the root workspace manifest, lockfile, shared packages, and Prisma schema. Docker therefore needs the repository root as its build context. If Render cannot resolve `apps/api/Dockerfile` with `apps/api` as the root directory, use the repository root as the Root Directory and keep `apps/api/Dockerfile` as the Dockerfile Path. This preserves the Dockerfile's access to the pnpm workspace files.

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

4. Add the web environment variables. Set `NEXT_PUBLIC_API_URL` to the Render API URL, for example:

   ```env
   NEXT_PUBLIC_API_URL=https://creators-nest-api.onrender.com
   ```

   Add the public Clerk and Stripe variables required by the web app. Keep server-only secrets out of `NEXT_PUBLIC_*` variables.

5. Deploy the project.
6. Copy the web URL, for example:

   [https://creators-nest.vercel.app](https://creators-nest.vercel.app)

If Vercel cannot install from the `apps/web` directory because it needs the workspace lockfile, set the repository root as the install context and keep the web project directory as `apps/web`. The build must still target the web workspace.

## 4. Verify Deployment

1. Check API health:

   [https://your-api.onrender.com/health](https://your-api.onrender.com/health)

   The response should be:

   ```json
   { "ok": true }
   ```

2. Check that the web app loads:

   [https://your-web.vercel.app](https://your-web.vercel.app)

3. Check that API CORS allows the deployed web domain. Set the Render `CORS_ORIGIN` value to the exact Vercel origin, without a trailing path:

   ```env
   CORS_ORIGIN=https://your-web.vercel.app
   ```

4. Test the browser flow: sign in, browse a listing, submit a booking request, and confirm that the API responds without CORS or database errors.
