ARG NODE_VERSION=22-alpine
ARG NGINX_VERSION=stable-alpine

# Base stage
FROM node:${NODE_VERSION} AS base

WORKDIR /app

RUN apk upgrade --no-cache \
 && corepack enable \
 && corepack prepare pnpm@9.15.0 --activate


# Build stage
FROM base AS builder


ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install --frozen-lockfile

COPY . .


RUN pnpm run build

# Development stage
FROM nginx:${NGINX_VERSION} AS development

RUN apk upgrade --no-cache

COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/cache/nginx/client_temp /var/run/nginx \
    && chown -R nginx:nginx \
        /var/cache/nginx \
        /var/run/nginx \
        /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Production stage
FROM nginx:${NGINX_VERSION} AS production

RUN apk upgrade --no-cache

COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/cache/nginx/client_temp /var/run/nginx \
    && chown -R nginx:nginx \
        /var/cache/nginx \
        /var/run/nginx \
        /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]