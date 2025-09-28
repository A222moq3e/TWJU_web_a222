#!/bin/bash
# Start the Node.js application on port 5000 in the background
(cd /srv/app && node server/dist/server.js)&

# Use socat to redirect HTTP traffic to the service running on port 5000
socat - TCP:127.0.0.1:5000,forever
