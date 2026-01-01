# Appointment Booking System - Deployment Guide

## Overview

This document provides comprehensive instructions for deploying the Appointment Booking System in production using Docker containers.

## Prerequisites

- Docker and Docker Compose installed
- At least 2GB RAM and 10GB disk space
- PostgreSQL database access (or use included PostgreSQL container)

## Production Deployment

### 1. Environment Setup

Copy and configure the production environment file:

```bash
cp .env.prod .env
```

Edit `.env` with your production values:

```bash
# Database Configuration
DB_PASSWORD=your-secure-password-here
JWT_SECRET=your-secure-jwt-secret-here-minimum-256-bits

# Google OAuth
VITE_GOOGLE_CLIENT_ID=870977434240-23qht0f9d7r6kn8n1nafcd0uddbf7sfd.apps.googleusercontent.com

# API URLs (update for your domain)
VITE_API_BASE_URL=http://localhost:8080
VITE_API_URL=http://localhost:8080/api
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   - `http://localhost` (for local testing)
   - Your production domain
6. Update `VITE_GOOGLE_CLIENT_ID` in `.env`

### 3. Deploy with Docker Compose

Start all services:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Check service status:

```bash
docker-compose -f docker-compose.prod.yml ps
```

### 4. Verify Deployment

- Frontend: http://localhost (nginx on port 80)
- Backend API: http://localhost:8080
- Database: localhost:5432

Health checks:
```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost/health
```

## Default Credentials

For testing, use these demo credentials:
- Email: `john.doe@email.com`
- Password: `test123`
- Role: ADMIN

## Service Architecture

### Frontend (React + Vite)
- **Port**: 80 (nginx)
- **Build**: Multi-stage Docker build with nginx
- **Features**: Google OAuth, responsive design, appointment booking

### Backend (Spring Boot)
- **Port**: 8080
- **Database**: PostgreSQL
- **Authentication**: JWT + Google OAuth
- **Health Check**: `/actuator/health`

### Database (PostgreSQL)
- **Port**: 5432
- **Database**: `appointment_db`
- **Data**: Pre-loaded with sample doctors and users

## Configuration Files

### Docker Compose
- `docker-compose.prod.yml`: Production deployment
- Includes PostgreSQL, Spring Boot backend, React frontend

### Environment Variables
- `.env.prod`: Template for production environment
- `frontend/.env.production`: Frontend-specific production config

### Dockerfiles
- `backend/Dockerfile`: Spring Boot application
- `frontend/Dockerfile`: React app with nginx

## Security Features

- JWT token authentication
- Google OAuth integration
- HTTPS-ready configuration
- Security headers in nginx
- Non-root user in containers
- Input validation and sanitization

## Monitoring

### Health Checks
All services include health checks:
- Database: `pg_isready`
- Backend: Spring Boot Actuator
- Frontend: nginx health endpoint

### Logs
View service logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f [service-name]
```

Service names: `db`, `backend`, `frontend`

## Scaling

### Horizontal Scaling
To scale the backend:
```bash
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### Load Balancing
Add nginx load balancer configuration for multiple backend instances.

## Backup

### Database Backup
```bash
docker exec appointment-db pg_dump -U postgres appointment_db > backup.sql
```

### Restore Database
```bash
docker exec -i appointment-db psql -U postgres appointment_db < backup.sql
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database container is running
   - Verify credentials in `.env`
   - Check network connectivity

2. **Google OAuth Not Working**
   - Verify `VITE_GOOGLE_CLIENT_ID` is correct
   - Check authorized origins in Google Console
   - Ensure domain is correctly configured

3. **Frontend Build Failed**
   - Check Node.js version compatibility
   - Verify all dependencies are available
   - Check build logs for specific errors

### Debug Commands

```bash
# Check container logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Execute commands in containers
docker exec -it appointment-backend bash
docker exec -it appointment-db psql -U postgres appointment_db

# Rebuild specific service
docker-compose -f docker-compose.prod.yml build [service-name]
```

## Production Considerations

### Domain Setup
1. Update API URLs in environment files
2. Configure SSL/HTTPS certificates
3. Set up proper DNS records
4. Update Google OAuth authorized origins

### Performance Tuning
1. Adjust database connection pool settings
2. Configure nginx caching
3. Optimize Docker resource limits
4. Set up monitoring and alerting

### Security Hardening
1. Use strong passwords and secrets
2. Enable firewall rules
3. Regular security updates
4. Implement rate limiting
5. Set up HTTPS with proper certificates

## Development vs Production

### Key Differences
- Database persistence (volumes)
- Logging levels (INFO vs DEBUG)
- Error handling (production-friendly)
- Security headers and HTTPS
- Resource limits and health checks

### Environment Variables
Development uses `.env` files in each service directory.
Production uses centralized `.env` file with Docker Compose.

## Support

For issues or questions:
1. Check application logs
2. Verify configuration
3. Test individual services
4. Check network connectivity
5. Review this documentation