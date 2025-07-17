FROM node:20-alpine

WORKDIR /app

# Copy the full source first
COPY . .

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

EXPOSE 7778

# Run the API server
CMD ["pnpm", "start"]
