# Multi-stage build for Student Dashboard CTF
FROM node:18-bullseye-slim AS app

# Install socat for HTTP traffic redirection
RUN apt-get update && apt-get install socat -y

# Install server dependencies
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci

# Install web dependencies
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci

# Build the web application
WORKDIR /app/web
COPY web/ ./
RUN npm run build

# Build the server application
WORKDIR /app/server
COPY server/ ./
RUN npm run build

# Generate Prisma Client
RUN npx prisma generate

# Copy environment files
WORKDIR /app
COPY .env .env
COPY server/.env server/.env

# Copy entire uploads directory from repo (ephemeral in container)
RUN mkdir -p uploads
COPY server/uploads/ ./uploads/

# Final stage using pwn.red/jail
FROM pwn.red/jail

# Copy the entire application from the build stage
COPY --from=app / /srv

# Add flag replacement hook
RUN echo 'sed -i "s/REDACTED/${FLAG}/" /tmp/nsjail.cfg' >> /jail/hook.sh

# Copy the run script
COPY ./run.sh /srv/app/run
RUN chmod 755 /srv/app/run

# Set jail environment variables
ENV JAIL_PIDS=30 JAIL_CPU=1000 JAIL_MEM=50M JAIL_TIME=30
ENV JAIL_ENV_NODE_ENV=production JAIL_ENV_FLAG=REDACTED

# Expose port 5000 as required by FlagYard
EXPOSE 5000
