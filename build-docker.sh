#!/bin/bash

# Student Dashboard CTF - Docker Build Script

set -e

echo "🐳 Building Student Dashboard CTF Docker Image..."

# Build the Docker image
docker build -t student-dashboard-ctf:latest .

echo "✅ Docker image built successfully!"
echo ""
echo "To run the application with docker run only:"
echo "  # Start PostgreSQL:"
echo "  docker run -d --name postgres -e POSTGRES_DB=student_dashboard_ctf -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15-alpine"
echo ""
echo "  # Start the app (Windows/macOS Docker Desktop):"
echo "  docker run -d --name student-dashboard -p 3000:3000 -e NODE_ENV=production -e DATABASE_URL=postgresql://postgres:password@host.docker.internal:5432/student_dashboard_ctf -e JWT_SECRET=supersecret_jwt_signing_key_ -v \"$(pwd)/uploads:/app/uploads\" student-dashboard-ctf:latest"
echo ""
echo "  # Start the app (Linux, when DB is another container on same host network):"
echo "  # 1) Create a user-defined network once: docker network create sd-net"
echo "  # 2) Run Postgres on that network: docker run -d --name postgres --network sd-net -e POSTGRES_DB=student_dashboard_ctf -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15-alpine"
echo "  # 3) Use the container name as host:"
echo "  docker run -d --name student-dashboard --network sd-net -p 3000:3000 -e NODE_ENV=production -e DATABASE_URL=postgresql://postgres:password@postgres:5432/student_dashboard_ctf -e JWT_SECRET=supersecret_jwt_signing_key_ -v \"$(pwd)/uploads:/app/uploads\" student-dashboard-ctf:latest"
echo ""
echo "To view logs:"
echo "  docker logs -f student-dashboard"
echo ""
echo "To stop the application:"
echo "  docker stop student-dashboard postgres && docker rm student-dashboard postgres"
