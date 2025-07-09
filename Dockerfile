FROM node:20-alpine

WORKDIR /app

# Copy package manager files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/dashboard/package.json ./apps/dashboard/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

# Build dashboard for production
RUN pnpm --filter dashboard build

EXPOSE 7777 7778

# Start both apps in parallel using 'pnpm concurrently'
RUN pnpm add -w concurrently

CMD ["pnpm", "concurrently", "--kill-others", "--names", "api,dashboard", "pnpm --filter api start", "pnpm --filter dashboard dev"]