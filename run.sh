#!/bin/sh
# Run script for FlagYard challenge
# This script starts the Node.js server directly on port 5000

# Set PATH to include node binaries
export PATH="/srv/app/server/node_modules/.bin:/srv/usr/bin:$PATH"

# Start the Node.js server directly on port 5000
cd /srv/app/server
rm -rf prisma/migrations
npx prisma db push
node dist/seed.js
cd /srv/app
node server/dist/server.js
