# Stage 1: Builder
FROM node:22-slim AS builder

WORKDIR /app

# Install turbo globally
RUN npm install -g turbo

# Copy entire monorepo
COPY . .

# Prune to only include backend and its deps
RUN turbo prune backend --docker

# Stage 2: Installer
FROM node:22-slim AS installer

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set target platform for Azure Web App (x64/amd64)
ENV npm_config_target_platform=linux
ENV npm_config_target_arch=x64

# Copy pruned monorepo from builder
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/full/ .

# Install dependencies
RUN npm ci

# Build backend (includes Prisma generation via build script)
RUN npm run build --workspace=backend

# Stage 3: Runner
FROM node:22-slim AS runner

WORKDIR /app

# Install OpenSSL for Prisma runtime
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=8080

# Copy built backend from installer
COPY --from=installer /app ./

# Copy entrypoint script
COPY backend/scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Create logs directory with proper permissions and make entrypoint executable
RUN mkdir -p /app/backend/logs && \
    chmod 777 /app/backend/logs && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# Use non-root user for security
USER node

EXPOSE 8080

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Set working directory
WORKDIR /app

# Use entrypoint script to validate environment and start server
CMD ["/usr/local/bin/docker-entrypoint.sh"]