#!/bin/bash

# Student Dashboard CTF - Docker Build Script

set -e

echo "🐳 Building Student Dashboard CTF Docker Image..."

# Build the Docker image
docker build -t student-dashboard-ctf:latest .

echo "✅ Docker image built successfully!"
echo ""
echo "To run the application:"
echo "  docker-compose up -d"
echo ""
echo "To run without docker-compose:"
echo "  docker run -p 3000:3000 -e DATABASE_URL=postgresql://postgres:password@host.docker.internal:5432/student_dashboard_ctf student-dashboard-ctf:latest"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f app"
echo ""
echo "To stop the application:"
echo "  docker-compose down"
