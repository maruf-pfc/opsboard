# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm fetch --prod
COPY . . 
RUN pnpm install --frozen-lockfile \
  && pnpm build

# ---- Production Stage ----
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app /app

RUN pnpm install --prod --frozen-lockfile
ENV NODE_ENV=production
EXPOSE 7778

CMD ["pnpm", "start"]
