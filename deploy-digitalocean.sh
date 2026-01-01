#!/bin/bash

# DigitalOcean Deployment Script
echo "🚀 Deploying Appointment Booking System to DigitalOcean"

# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Clone your repository
git clone https://github.com/yourusername/appointment-booking.git
cd appointment-booking

# 5. Setup environment
cp .env.prod .env

# Edit this with your domain
echo "Edit .env file with your domain:"
echo "VITE_API_BASE_URL=https://your-domain.com:8080"
echo "VITE_API_URL=https://your-domain.com:8080/api"

# 6. Deploy
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Deployment complete!"
echo "🌐 Frontend: http://your-domain.com"
echo "🔗 Backend: http://your-domain.com:8080"