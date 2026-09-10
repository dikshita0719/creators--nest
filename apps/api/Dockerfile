FROM node:20-alpine

WORKDIR /app

RUN npm install --global pnpm@9.15.4

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/types ./packages/types
COPY packages/config ./packages/config
COPY apps/api ./apps/api
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @creators/types build
RUN pnpm exec prisma generate --schema prisma/schema.prisma
RUN pnpm --filter api build

WORKDIR /app/apps/api

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3001/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["sh", "-c", "pnpm exec prisma migrate deploy --schema ../../prisma/schema.prisma && node dist/src/main.js"]