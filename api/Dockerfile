# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app
# Copy only package files first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./
# Install pnpm globally in the builder stage
RUN npm install -g pnpm
# Fetch and install all dependencies for the build
RUN pnpm fetch --prod && pnpm install --frozen-lockfile
# Copy the rest of the application code
COPY . .
# If your API needs a build step (e.g., TypeScript compilation), add it here:
# RUN pnpm build

# ---- Production Stage ----
FROM node:20-alpine
WORKDIR /app
# Install pnpm globally in the production stage as well
# This ensures 'pnpm' command is available for CMD or other scripts
RUN npm install -g pnpm
# Copy the built application from the builder stage
COPY --from=builder /app /app
# Install only production dependencies (pnpm is now available)
RUN pnpm install --prod --frozen-lockfile
ENV NODE_ENV=production
EXPOSE 7777

CMD ["pnpm", "start"] 
    