#!/bin/bash

# Change to server directory
cd /server

# Generate Prisma Client
npx prisma generate

# Initialize database and seed data
npx prisma db push
node dist/seed.js

# Start the server on port 5000
node dist/server.js
