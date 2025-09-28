#!/bin/bash

# Student Dashboard CTF - FlagYard Challenge Build Script

set -e

echo "🐳 Building Student Dashboard CTF Docker Image for FlagYard..."

# Build the Docker image
docker build -t student-dashboard-ctf:latest .

echo "✅ Docker image built successfully!"
echo ""
echo "FlagYard Challenge Configuration:"
echo "  - Port: 5000"
echo "  - Sandboxed with redpwn/jail"
echo "  - Dynamic flag support"
echo "  - Memory limit: 1GB"
echo ""
echo "To run the challenge:"
echo "  docker-compose up -d"
echo ""
echo "To test with solving script:"
echo "  pip install -r requirements.txt"
echo "  python3 solve.py http://localhost:5000"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f app"
echo ""
echo "To stop the application:"
echo "  docker-compose down"
