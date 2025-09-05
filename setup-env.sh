#!/bin/bash

# Setup script for /etc/.env file
# This script copies the sample environment file to /etc/.env

echo "Setting up /etc/.env file..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (use sudo)"
    exit 1
fi

# Copy the sample file
if [ -f "./ops/sample-etc-dot-env" ]; then
    cp ./ops/sample-etc-dot-env /etc/.env
    chmod 644 /etc/.env
    echo "Successfully created /etc/.env"
    echo "Contents:"
    cat /etc/.env
else
    echo "Error: ops/sample-etc-dot-env not found"
    exit 1
fi
