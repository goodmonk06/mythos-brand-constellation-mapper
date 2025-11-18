#!/bin/bash

# Setup script for Mythos Brand Constellation Mapper

set -e

echo "🌟 Setting up Mythos Brand Constellation Mapper..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ Docker version: $(docker --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created. Edit if needed."
else
    echo "✓ .env file already exists"
fi

# Start PostgreSQL
echo ""
echo "🐘 Starting PostgreSQL..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Push database schema
echo ""
echo "🗄️  Pushing database schema..."
npm run db:push

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npm run db:generate

# Seed database
echo ""
echo "🌱 Seeding database with example data..."
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "📊 To open Prisma Studio:"
echo "   npm run db:studio"
echo ""
echo "🌐 Visit http://localhost:3000 when the dev server is running"
