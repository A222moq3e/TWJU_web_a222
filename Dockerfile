# Multi-stage build for Student Dashboard CTF
FROM node:18-bullseye-slim AS base

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

# Production image with socat for port redirection
FROM base AS app
RUN apt-get update && apt-get install socat -y
WORKDIR /app

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

# Copy environment files
COPY .env .env
COPY server/.env server/.env

# Copy entire uploads directory from repo (ephemeral in container)
RUN mkdir -p uploads && chown nextjs:nodejs uploads
COPY --chown=nextjs:nodejs server/uploads/ ./uploads/

# Switch to non-root user
USER nextjs

# Use redpwn/jail for sandboxing
FROM pwn.red/jail
COPY --from=app / /srv

# Create hook script to inject flag
RUN echo 'sed -i "s/REDACTED/${FLAG}/" /tmp/nsjail.cfg' >> /jail/hook.sh

# Copy run script
COPY ./run.sh /srv/app/run
RUN chmod +x /srv/app/run

# Create symlinks for binaries in jail environment
RUN ln -sf /srv/app/server/node_modules/.bin/node /jail/node
RUN ln -sf /srv/app/server/node_modules/.bin/npx /jail/npx
RUN ln -sf /srv/usr/bin/socat /jail/socat

# Jail configuration
ENV JAIL_PIDS=30 JAIL_CPU=1000 JAIL_MEM=1G JAIL_TIME=30
ENV JAIL_ENV_NODE_ENV=production JAIL_ENV_DATABASE_URL=file:./dev.db JAIL_ENV_JWT_SECRET=supers3cr3t_adm1n_s1gn1ng_k3y_a222 JAIL_ENV_FLAG=REDACTED

# Expose port 5000 as required
EXPOSE 5000
