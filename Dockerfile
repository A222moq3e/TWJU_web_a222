# Multi-stage build for Student Dashboard CTF with redpwn/jail
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

# Production image with redpwn/jail
FROM pwn.red/jail

# Copy built applications to /srv (jail root)
COPY --from=web-builder /app/web/dist /srv/web/dist
COPY --from=server-builder /app/server/dist /srv/server/dist
COPY --from=server-builder /app/server/node_modules /srv/server/node_modules
COPY --from=server-builder /app/server/package*.json /srv/server/
COPY --from=server-builder /app/server/prisma /srv/server/prisma

# Copy uploads directory
RUN mkdir -p /srv/uploads
COPY --from=server-builder /app/server/uploads/ /srv/uploads/

# Create app directory and run script
RUN mkdir -p /srv/app
COPY ./run.sh /srv/app/run
RUN chmod 755 /srv/app/run

# Create jail hook script for flag injection
RUN mkdir -p /jail
COPY ./hook.sh /jail/hook.sh
RUN chmod 755 /jail/hook.sh

# Configure redpwn/jail environment
ENV JAIL_PIDS=30
ENV JAIL_CPU=1000
ENV JAIL_MEM=50M
ENV JAIL_TIME=30
ENV JAIL_CONNS=0
ENV JAIL_CONNS_PER_IP=0
ENV JAIL_POW=0
ENV JAIL_PORT=5000
ENV JAIL_ENV_NODE_ENV=production
ENV JAIL_ENV_DATABASE_URL=file:./dev.db
ENV JAIL_ENV_JWT_SECRET=supers3cr3t_adm1n_s1gn1ng_k3y_a222
ENV JAIL_ENV_FLAG=REDACTED

EXPOSE 5000