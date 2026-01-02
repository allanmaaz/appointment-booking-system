# 🌐 Internet Deployment Guide

## Quick Setup (5 minutes)

### 1. 📦 First, commit your code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Appointment Booking System"

# Create GitHub repository and push
# Go to https://github.com/new and create a repository
git remote add origin https://github.com/yourusername/appointment-booking.git
git branch -M main
git push -u origin main
```

### 2. 🚀 Deploy Backend on Railway

1. **Sign up**: Go to [railway.app](https://railway.app) and sign in with GitHub
2. **New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select Repository**: Choose your appointment-booking repository
4. **Configure**:
   - Select the `backend` folder
   - Railway will auto-detect the Dockerfile
5. **Environment Variables**: Add these in Railway dashboard:
   ```
   SPRING_DATASOURCE_URL=postgresql://postgres:password@railway-db:5432/appointment_db
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=your_secure_password
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   SPRING_PROFILES_ACTIVE=prod
   ```
6. **Add Database**: In Railway, click "New" → "Database" → "PostgreSQL"
7. **Deploy**: Railway will automatically deploy your backend

**Your backend will be available at**: `https://yourapp-name.railway.app`

### 3. 🎨 Deploy Frontend on Vercel

1. **Sign up**: Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. **New Project**: Click "New Project" → Import your GitHub repository
3. **Configure**:
   - Select the `frontend` folder
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**: Add in Vercel dashboard:
   ```
   VITE_API_URL=https://yourapp-name.railway.app/api
   VITE_API_BASE_URL=https://yourapp-name.railway.app
   VITE_APP_URL=https://yourapp-name.vercel.app
   ```
5. **Deploy**: Vercel will automatically build and deploy

**Your frontend will be available at**: `https://yourapp-name.vercel.app`

## 🔧 Alternative Options

### Option 1: Free Tier (Recommended)
- **Frontend**: Vercel (Free)
- **Backend**: Railway (Free tier - $5 credit)
- **Database**: Railway PostgreSQL (Free)
- **Cost**: $0-5/month

### Option 2: Heroku
```bash
# Install Heroku CLI
# Deploy backend
cd backend
heroku create yourapp-backend
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main

# Deploy frontend
cd ../frontend
heroku create yourapp-frontend
heroku buildpacks:set mars/create-react-app
git push heroku main
```

### Option 3: AWS/Google Cloud
- Use Docker images we created
- Deploy to ECS, Cloud Run, or similar services

## 📱 Update Frontend Configuration

Update `vercel.json` with your actual backend URL:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR-BACKEND-URL.railway.app/api/$1"
    }
  ]
}
```

## 🔐 Security Setup

1. **Environment Variables**:
   - Never commit `.env` files
   - Use strong passwords and JWT secrets
   - Use Railway/Vercel environment variable settings

2. **Database Security**:
   - Railway automatically secures your database
   - Use strong passwords
   - Enable SSL connections

3. **CORS Configuration**:
   - Update backend CORS settings for your domain
   - Add your frontend URL to allowed origins

## 🚀 Quick Deploy Commands

```bash
# Frontend to Vercel
cd frontend
npm install -g vercel
vercel --prod

# Backend to Railway
cd backend
npm install -g @railway/cli
railway login
railway deploy
```

## 📊 Monitoring

- **Railway**: Built-in monitoring and logs
- **Vercel**: Analytics and performance monitoring
- **Health Checks**: Both platforms provide automatic health monitoring

## 💰 Cost Breakdown

**Free Tier Usage**:
- Vercel: 100GB bandwidth, unlimited sites
- Railway: $5 free credit, then $0.000231 per GB-hour
- Expected monthly cost: $0-10 for moderate traffic

## 🎯 Your Live URLs

After deployment, you'll have:
- **Frontend**: `https://appointment-booking.vercel.app`
- **Backend**: `https://appointment-booking-backend.railway.app`
- **Admin Panel**: `https://appointment-booking.vercel.app/admin`

## 🔄 Auto-Deploy

Both platforms support auto-deployment:
- **Push to GitHub** → **Automatic deployment**
- **Branch protection** and staging environments available
- **Rollback** capabilities built-in

---

## 🆘 Need Help?

1. **Railway Issues**: Check logs in Railway dashboard
2. **Vercel Issues**: Check function logs and build logs
3. **Database Issues**: Check Railway database connection strings
4. **CORS Issues**: Update backend allowed origins

**Success!** Your appointment booking system will be live on the internet! 🎉