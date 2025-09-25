# Docker Compose Deployment Guide

This guide explains how to build and deploy the Student Dashboard CTF using Docker Compose.

## Quick Start

1. **Build and start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Initialize the database:**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   docker-compose exec app npx prisma db seed
   ```

3. **Access the application:**
   - Web interface: http://localhost:10009
   - API: http://localhost:10009/api

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@postgres:5432/student_dashboard_ctf` |
| `JWT_SECRET` | JWT signing secret | `supersecret_jwt_signing_key_` |

## Database Setup

The application uses PostgreSQL with Prisma ORM. The database schema is automatically applied when the container starts.

### Manual Database Operations

```bash
# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed the database
docker-compose exec app npx prisma db seed

# Reset the database
docker-compose exec app npx prisma migrate reset

# View database
docker-compose exec app npx prisma studio
```

## File Uploads

The application stores uploaded files in the `student-uploads` Docker volume, which persists files between container restarts.

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
   - Check that the `student-uploads` volume is properly mounted
   - Ensure the directory has proper permissions

3. **Build failures:**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild without cache: `docker-compose build --no-cache`

### Logs

```bash
# View application logs
docker-compose logs -f app

# View database logs
docker-compose logs -f postgres

# View all logs
docker-compose logs -f
```

### Debugging

```bash
# Access container shell
docker-compose exec app sh

# Check database connection
docker-compose exec app npx prisma db pull

# View environment variables
docker-compose exec app env
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