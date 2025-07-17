# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm \
  && pnpm install --frozen-lockfile \
  && pnpm build

# ---- Production Stage ----
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app /app
RUN npm install -g pnpm \
  && pnpm install --prod --frozen-lockfile
ENV NODE_ENV=production
EXPOSE 7777

CMD ["pnpm", "start"] 