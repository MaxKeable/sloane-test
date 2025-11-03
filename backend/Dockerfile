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

# Generate Prisma client
RUN npx prisma generate --schema=./backend/src/model/db/schema.prisma

# Build backend
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

EXPOSE 8080

# Start the backend server
CMD ["node", "backend/dist/index.js"]