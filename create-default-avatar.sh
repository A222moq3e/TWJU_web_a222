#!/bin/bash

# Create a simple 1x1 PNG file for default avatar
cat > /app/uploads/default-1.png << 'EOF'
PNG

IHDR
IDAT
IENDB`
EOF

# Set proper permissions
chown nextjs:nodejs /app/uploads/default-1.png
chmod 644 /app/uploads/default-1.png
