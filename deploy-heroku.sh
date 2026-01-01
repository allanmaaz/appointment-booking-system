#!/bin/bash

# Heroku Deployment Script
echo "🚀 Deploying to Heroku"

# 1. Install Heroku CLI (if not installed)
# curl https://cli-assets.heroku.com/install.sh | sh

# 2. Login to Heroku
heroku login

# 3. Create Heroku apps
heroku create appointment-booking-api
heroku create appointment-booking-web

# 4. Add PostgreSQL to backend
heroku addons:create heroku-postgresql:mini -a appointment-booking-api

# 5. Set environment variables for backend
heroku config:set JWT_SECRET="your-super-long-jwt-secret-key-here" -a appointment-booking-api
heroku config:set VITE_GOOGLE_CLIENT_ID="870977434240-23qht0f9d7r6kn8n1nafcd0uddbf7sfd.apps.googleusercontent.com" -a appointment-booking-api

# 6. Deploy backend
git subtree push --prefix=backend heroku-api main

# 7. Deploy frontend to Netlify or Vercel (easier than Heroku for React)
echo "Frontend deployment:"
echo "1. Build the frontend: npm run build"
echo "2. Deploy dist/ folder to Netlify/Vercel"
echo "3. Update environment variables in build settings"

echo "✅ Backend deployed to: https://appointment-booking-api.herokuapp.com"