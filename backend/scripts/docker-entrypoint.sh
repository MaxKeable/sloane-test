#!/bin/sh
set -e

echo "=================================="
echo "AI Hub Backend - Docker Startup"
echo "=================================="
echo "Environment: ${NODE_ENV:-not set}"
echo "Port: ${PORT:-not set}"
echo "Node Version: $(node --version)"
echo "=================================="

# Validate required environment variables based on NODE_ENV
if [ "$NODE_ENV" = "production" ]; then
  echo "Validating production environment variables..."

  if [ -z "$MONGO_URI" ]; then
    echo "ERROR: MONGO_URI is required in production mode"
    exit 1
  fi
  echo "✓ MONGO_URI is set"
else
  echo "Validating development environment variables..."

  if [ -z "$DEV_MONGO_URI" ] && [ -z "$MONGO_URI" ]; then
    echo "ERROR: Either DEV_MONGO_URI or MONGO_URI must be set"
    exit 1
  fi
  echo "✓ Database URI is set"
fi

if [ -z "$CLERK_PUBLISHABLE_KEY" ]; then
  echo "ERROR: CLERK_PUBLISHABLE_KEY is required"
  exit 1
fi
echo "✓ CLERK_PUBLISHABLE_KEY is set"

if [ -z "$OPENAI_API_KEY" ]; then
  echo "ERROR: OPENAI_API_KEY is required"
  exit 1
fi
echo "✓ OPENAI_API_KEY is set"

echo "=================================="
echo "✓ All required environment variables validated"
echo "=================================="
echo "Starting Node.js application..."
echo "=================================="

# Start the application
exec node backend/dist/index.js
