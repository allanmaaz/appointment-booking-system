#!/bin/bash

# Appointment Booking System - Deployment Script
echo "🚀 Starting deployment of Appointment Booking System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Set environment variables if .env file doesn't exist
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating with default values..."
    echo "POSTGRES_PASSWORD=appointment_secure_password" > .env
    echo "JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')" >> .env
    echo "✅ Created .env file with secure defaults"
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old images (optional - uncomment if you want to rebuild everything)
# echo "🗑️  Removing old images..."
# docker-compose down --rmi all

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Check database
if docker-compose exec postgres pg_isready -U postgres -d appointment_db > /dev/null 2>&1; then
    echo "✅ Database is ready"
else
    echo "❌ Database is not responding"
fi

# Check backend
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not responding"
fi

# Check frontend
if curl -f http://localhost:80/health > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is not responding"
fi

echo ""
echo "🎉 Deployment complete!"
echo "📱 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:8080/api"
echo "🗄️  Database: postgresql://localhost:5432/appointment_db"
echo ""
echo "📋 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"