FROM node:20-alpine

WORKDIR /app

# Copy root-level package manager files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy app-specific package.json for dependency filtering
COPY apps/api/package.json ./apps/api/

# Install pnpm globally and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy the full source (after deps for better caching)
COPY . .

EXPOSE 7778

# Run the API server
CMD ["pnpm", "--filter", "./apps/api", "start"]
