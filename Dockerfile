# ---- Base Stage ----
# Use a specific Node.js version for consistency.
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# ---- Dependencies Stage ----
# This stage is only for installing dependencies. It gets cached if lockfiles don't change.
FROM base AS deps
# Install pnpm
RUN npm install -g pnpm
# Copy only the files needed for dependency installation
COPY package.json pnpm-lock.yaml ./
# Fetch all dependencies
RUN pnpm fetch

# ---- Build Stage ----
# This stage builds the application code.
FROM base AS build
RUN npm install -g pnpm
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
# You can add a build step here if you have one (e.g., TypeScript compilation)
# RUN pnpm build

# ---- Production Stage ----
# This is the final, lean image that will run in production.
FROM base AS production
ENV NODE_ENV=production
RUN npm install -g pnpm
# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app ./

# Expose the port the app runs on
EXPOSE ${PORT:-5001}

# The command to run the application
CMD [ "pnpm", "start" ]