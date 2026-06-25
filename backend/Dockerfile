# Base Stage
FROM node:22-alpine AS base

RUN apk upgrade --no-cache \
 && corepack enable \
 && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Builder Stage
FROM base AS builder

COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# Development Stage
FROM base AS development

ENV NODE_ENV=development

COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 5000

CMD ["pnpm", "run", "dev"]

# Production Stage
FROM base AS production

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["pnpm", "start"]