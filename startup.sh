#!/bin/bash

# Student Dashboard CTF - Startup Script
set -e

echo "🚀 Starting Student Dashboard CTF..."

# Extract database connection details from DATABASE_URL
if [ -n "$DATABASE_URL" ]; then
  # Parse DATABASE_URL: postgresql://user:password@host:port/database
  DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
  DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
  DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
  
  # Default values if parsing fails
  DB_HOST=${DB_HOST:-postgres}
  DB_PORT=${DB_PORT:-5432}
  DB_USER=${DB_USER:-postgres}
else
  DB_HOST=${DB_HOST:-postgres}
  DB_PORT=${DB_PORT:-5432}
  DB_USER=${DB_USER:-postgres}
fi

# Wait for database to be ready
echo "⏳ Waiting for database connection to $DB_HOST:$DB_PORT..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Run database migrations
echo "📊 Running database migrations..."
cd /app/server
npx prisma migrate deploy

# Seed the database
echo "🌱 Seeding database..."
npx prisma db seed

# Start the application
echo "🎯 Starting application server..."
cd /app
exec node server/dist/server.js
