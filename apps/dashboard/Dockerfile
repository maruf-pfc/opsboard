FROM node:20-alpine

WORKDIR /app

# Copy root-level package manager files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy app-specific package.json
COPY apps/dashboard/package.json ./apps/dashboard/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy the full source
COPY . .

# Build dashboard for production
RUN pnpm --filter "./apps/dashboard" build

EXPOSE 7777

# Serve the production build (assumes you use a custom start script or a server like Next.js standalone export)
CMD ["pnpm", "--filter", "./apps/dashboard", "start"]
