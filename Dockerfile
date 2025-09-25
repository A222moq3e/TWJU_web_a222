# Multi-stage build for Student Dashboard CTF
FROM node:18-bullseye-slim AS base

## (deps stage removed; not needed on Debian base)

# Install server dependencies
FROM base AS server-deps
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci

# Install web dependencies
FROM base AS web-deps
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci

# Build the web application
FROM base AS web-builder
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

# Build the server application
FROM base AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Install PostgreSQL client for database operations
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built applications
COPY --from=web-builder --chown=nextjs:nodejs /app/web/dist ./web/dist
COPY --from=server-builder --chown=nextjs:nodejs /app/server/dist ./server/dist
COPY --from=server-builder --chown=nextjs:nodejs /app/server/node_modules ./server/node_modules
COPY --from=server-builder --chown=nextjs:nodejs /app/server/package*.json ./server/
COPY --from=server-builder --chown=nextjs:nodejs /app/server/prisma ./server/prisma

# Generate Prisma Client for linux-musl inside the final image
WORKDIR /app/server
RUN npx prisma generate
WORKDIR /app

# Copy startup script
COPY startup.sh /app/startup.sh
RUN chmod +x /app/startup.sh

# Copy environment file template
COPY ops/sample-etc-dot-env .env

# Create uploads directory
RUN mkdir -p uploads && chown nextjs:nodejs uploads

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application with startup script
CMD ["/app/startup.sh"]
