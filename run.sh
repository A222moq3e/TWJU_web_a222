#!/bin/bash
# Initialize database and seed data
cd /srv/app/server
rm -rf prisma/migrations
npx prisma db push
node dist/seed.js

# Start the Node.js application on port 5000 in the background
cd /srv
node app/server/dist/server.js &

# Use socat to redirect HTTP traffic to the service running on port 5000
socat - TCP:127.0.0.1:5000,forever
