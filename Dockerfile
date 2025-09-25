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

# Copy environment file template
COPY ops/sample-etc-dot-env .env

# Create uploads directory and default avatar
RUN mkdir -p uploads && chown nextjs:nodejs uploads

# Create default avatar file
RUN echo -e '\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90\x77\x53\xDE\x00\x00\x00\x0C\x49\x44\x41\x54\x08\x99\x01\x01\x00\x00\x00\xFF\xFF\x00\x00\x00\x02\x00\x01\x00\x00\x00\x00\x49\x45\x4E\x44\xAE\x42\x60\x82' > uploads/default-1.png && chown nextjs:nodejs uploads/default-1.png

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server/dist/server.js"]
