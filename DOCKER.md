# Docker Deployment Guide

This guide explains how to build and deploy the Student Dashboard CTF using Docker.

## Quick Start

### Docker Run (No shell scripts)

1. **Build the application image:**
   ```bash
   docker build -t student-dashboard-ctf:latest .
   ```

2. **Start PostgreSQL:**
   ```bash
   docker run -d --name postgres \
     -e POSTGRES_DB=student_dashboard_ctf \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password \
     -p 5432:5432 \
     postgres:15-alpine
   ```

3. **Run the application (Windows/macOS Docker Desktop):**
   ```bash
   docker run -d --name student-dashboard \
     -p 10009:3000 \
     -e NODE_ENV=production \
     -e DATABASE_URL=postgresql://postgres:password@host.docker.internal:5432/student_dashboard_ctf \
     -e JWT_SECRET=supersecret_jwt_signing_key_ \
     -v "$(pwd)/uploads:/app/uploads" \
     student-dashboard-ctf:latest
   ```

4. **Run the application (Linux using a user-defined network):**
   ```bash
   docker network create sd-net || true
   docker network connect sd-net postgres || true
   docker run -d --name student-dashboard \
     --network sd-net \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e DATABASE_URL=postgresql://postgres:password@postgres:5432/student_dashboard_ctf \
     -e JWT_SECRET=supersecret_jwt_signing_key_ \
     -v "$(pwd)/uploads:/app/uploads" \
     student-dashboard-ctf:latest
   ```

5. **Initialize the database:**
   ```bash
   docker exec student-dashboard npx prisma migrate deploy
   docker exec student-dashboard npx prisma db seed
   ```

6. **Access the application:**
   - Web interface: http://localhost:3000
   - API: http://localhost:3000/api

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `CORS_ORIGIN` | CORS allowed origins | `*` |

## Database Setup

The application uses PostgreSQL with Prisma ORM. The database schema is automatically applied when the container starts.

### Manual Database Operations

```bash
# Run migrations
docker exec student-dashboard npx prisma migrate deploy

# Seed the database
docker exec student-dashboard npx prisma db seed

# Reset the database
docker exec student-dashboard npx prisma migrate reset

# View database
docker exec student-dashboard npx prisma studio
```

## File Uploads

The application stores uploaded files in the `uploads/` directory. This directory is mounted as a volume in the Docker container to persist files between container restarts.

## Health Checks

The application includes health checks to monitor service status:

- **Application health:** `GET /api/health`
- **Database health:** Built into the application startup

## Troubleshooting

### Common Issues

1. **Database connection failed:**
   - Ensure PostgreSQL is running and accessible
   - Check the `DATABASE_URL` environment variable
   - Verify network connectivity between containers

2. **File upload issues:**
   - Check that the `uploads/` directory has proper permissions
   - Ensure the directory is mounted as a volume

3. **Build failures:**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild without cache: `docker build --no-cache -t student-dashboard-ctf .`

### Logs

```bash
# View application logs
docker logs -f student-dashboard

# View database logs
docker logs -f postgres

# View all logs
docker logs -f student-dashboard postgres
```

### Debugging

```bash
# Access container shell
docker exec -it student-dashboard sh

# Check database connection
docker exec student-dashboard npx prisma db pull

# View environment variables
docker exec student-dashboard env
```

## Security Considerations

- Change default passwords in production
- Use strong JWT secrets
- Configure proper CORS origins
- Enable HTTPS in production
- Regularly update base images

## Production Deployment

For production deployment:

1. Use a reverse proxy (nginx, Traefik)
2. Enable HTTPS with SSL certificates
3. Use secrets management for sensitive data
4. Configure proper logging and monitoring
5. Set up automated backups for the database
6. Use container orchestration (Kubernetes, Docker Swarm)
