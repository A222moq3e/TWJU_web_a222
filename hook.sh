#!/bin/bash

# Replace REDACTED with actual flag in environment
if [ ! -z "$FLAG" ]; then
    # Update the server environment to use the actual flag
    export JAIL_ENV_FLAG="$FLAG"
    
    # Create a flag file that the application can read
    echo "$FLAG" > /srv/flag.txt
    chmod 644 /srv/flag.txt
fi
