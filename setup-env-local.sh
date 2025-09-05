#!/bin/bash

# Setup script for local .env file
echo "Setting up server/.env file..."

# Create server/.env file
cat > server/.env << EOF
DATABASE_URL="postgresql://postgres:password@localhost:5432/student_dashboard_ctf"
JWT_SECRET="supersecret_admin_signing_key"
EOF

echo "Created server/.env file with JWT secret"
echo "Contents:"
cat server/.env
