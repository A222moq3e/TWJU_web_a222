#!/bin/sh
# Run script for FlagYard challenge
# This script starts the Node.js server and redirects traffic using socat

# Start the Node.js server in the background
cd /srv/app/server
rm -rf prisma/migrations
npx prisma db push
node dist/seed.js
cd /srv/app
node server/dist/server.js &

# Use socat to redirect HTTP traffic to the service running on port 5000
socat - TCP:127.0.0.1:5000,forever
