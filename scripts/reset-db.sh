#!/bin/bash

# Reset database script

set -e

echo "⚠️  WARNING: This will delete ALL data in the database!"
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo "🗑️  Resetting database..."

# Stop and remove containers
docker-compose down -v

# Start fresh PostgreSQL
docker-compose up -d postgres

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
sleep 5

# Push schema
echo "🗄️  Pushing schema..."
npm run db:push

# Seed
echo "🌱 Seeding..."
npm run db:seed

echo "✅ Database reset complete!"
