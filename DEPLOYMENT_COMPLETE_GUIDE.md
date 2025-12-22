# 🚀 Complete Deployment Guide: Frontend (Vercel) + Backend (Render)

## 📋 Overview

- **Frontend**: Deploy to Vercel (React/Vite)
- **Backend**: Deploy to Render (Node.js/Express)
- **Database**: MongoDB Atlas (already set up)

---

## 🎯 Step-by-Step Deployment

### PART 1: Deploy Backend to Render (15 minutes)

#### Step 1: Backend is Already on GitHub ✅
- Repository: `addy-2709genius/sortmyhostel-backend`
- Render config added: `render.yaml`
- Ready to deploy!

#### Step 2: Deploy to Render

1. **Go to Render**
   - Visit: https://render.com
   - Sign up/Login (use GitHub)

2. **Create Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect: `addy-2709genius/sortmyhostel-backend`

3. **Configure**
   - **Name**: `sortmyhostel-backend`
   - **Region**: Choose closest (e.g., `Oregon`)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run prisma:generate`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

4. **Environment Variables**
   Add these 5 variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |
   | `DATABASE_URL` | `mongodb+srv://sortmyhostel_user:zcFs3clpMc4He0EU@cluster0.ajqejnh.mongodb.net/sortmyhostel?retryWrites=true&w=majority` |
   | `FRONTEND_URL` | `https://your-frontend.vercel.app` (update after frontend deploy) |
   | `JWT_SECRET` | `bZBdkilZBRIbSqVl2NmMtxUTUabbVOw/1giAVZrc2Ko=` |

   **Important:** NO quotes, NO spaces

5. **Deploy**
   - Click **"Create Web Service"**
   - ⏳ Wait 5-10 minutes
   - Your backend will be at: `https://sortmyhostel-backend.onrender.com`

6. **Test Backend**
   ```
   https://sortmyhostel-backend.onrender.com/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

✅ **Backend deployed!**

---

### PART 2: Deploy Frontend to Vercel (10 minutes)

#### Step 1: Push Frontend to GitHub

1. **Initialize Git** (if not already)
   ```bash
   cd /Users/aadityarajsoni/Desktop/SORTMENU
   git init
   git add .
   git commit -m "Initial frontend setup for Vercel"
   ```

2. **Create GitHub Repository**
   - Go to: https://github.com/new
   - Name: `sortmyhostel-frontend`
   - Create repository

3. **Push to GitHub**
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sortmyhostel-frontend.git
   git push -u origin main
   ```

#### Step 2: Deploy to Vercel

1. **Go to Vercel**
   - Visit: https://vercel.com/dashboard
   - Sign up/Login (use GitHub)

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Select: `YOUR_USERNAME/sortmyhostel-frontend`
   - Click **"Import"**

3. **Configure**
   - **Project Name**: `sortmyhostel` (or any name)
   - **Framework**: **Vite** (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto)
   - **Output Directory**: `dist` (auto)

4. **Environment Variables** (Optional)
   - Usually not needed
   - If you want to use env var for API URL:
     - Key: `VITE_API_URL`
     - Value: `https://sortmyhostel-backend.onrender.com/api`

5. **Deploy**
   - Click **"Deploy"**
   - ⏳ Wait 2-3 minutes
   - Your frontend will be at: `https://your-project-name.vercel.app`

✅ **Frontend deployed!**

---

### PART 3: Connect Frontend to Backend (5 minutes)

#### Step 1: Update Frontend API URL

1. **Get Render Backend URL**
   - Your Render backend URL: `https://sortmyhostel-backend.onrender.com`

2. **Update Frontend Code**
   - In `src/services/api.js`, the URL is already set to Render
   - If needed, update to:
   ```javascript
   const API_BASE_URL = 'https://sortmyhostel-backend.onrender.com/api';
   ```

3. **Commit and Push**
   ```bash
   git add src/services/api.js
   git commit -m "Update API URL to Render backend"
   git push
   ```
   - Vercel will auto-redeploy

#### Step 2: Update Backend CORS

1. **Go to Render Dashboard**
   - Your service → **Environment**
   - Find `FRONTEND_URL`
   - Update to: `https://your-frontend.vercel.app`
   - Save (auto-redeploys)

✅ **Frontend and Backend connected!**

---

## ✅ Final URLs

- **Frontend**: `https://your-project-name.vercel.app`
- **Backend**: `https://sortmyhostel-backend.onrender.com`
- **Health Check**: `https://sortmyhostel-backend.onrender.com/health`

---

## 🧪 Testing

1. **Test Backend**
   ```bash
   curl https://sortmyhostel-backend.onrender.com/health
   ```

2. **Test Frontend**
   - Open: `https://your-project-name.vercel.app`
   - Check browser console for errors
   - Test all features

3. **Test API Connection**
   - Open browser DevTools → Network tab
   - Check API requests are going to Render backend
   - Verify responses are successful

---

## 🔧 Troubleshooting

### Backend Issues

**Service won't start:**
- Check Render build logs
- Verify all environment variables
- Check `DATABASE_URL` is correct (no quotes)

**Database connection fails:**
- Verify MongoDB Atlas IP whitelist: `0.0.0.0/0`
- Check credentials in `DATABASE_URL`

**Slow first request:**
- Normal for Render free tier (spins down after 15 min)
- First request after spin-down takes ~30 seconds

### Frontend Issues

**Build fails:**
- Check Vercel build logs
- Verify `package.json` has correct scripts
- Check for TypeScript/ESLint errors

**API not connecting:**
- Verify backend URL in `src/services/api.js`
- Check CORS settings in backend
- Verify backend is running on Render

**CORS errors:**
- Update `FRONTEND_URL` in Render environment variables
- Make sure it matches your Vercel frontend URL exactly

---

## 📝 Important Notes

### Render Free Tier
- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 512 MB RAM limit
- 750 hours/month free (enough for 24/7)

### Vercel Free Tier
- Unlimited deployments
- Auto-deploys on git push
- Global CDN
- Fast builds

---

## 🎉 Success Checklist

- [ ] Backend deployed on Render
- [ ] Backend health check working
- [ ] Frontend deployed on Vercel
- [ ] Frontend API URL updated
- [ ] Backend `FRONTEND_URL` updated
- [ ] Frontend and backend connected
- [ ] All features working
- [ ] No CORS errors
- [ ] Database connected

---

## 🚀 You're Done!

Your full-stack application is now:
- ✅ Frontend live on Vercel
- ✅ Backend live on Render
- ✅ Database connected (MongoDB Atlas)
- ✅ Everything working together!

---

## 📚 Reference Files

- **Backend Render Guide**: `backend/BACKEND_RENDER_DEPLOY.md`
- **Frontend Vercel Guide**: `FRONTEND_VERCEL_DEPLOY.md`
- **Backend Config**: `backend/render.yaml`
- **Frontend Config**: `vercel.json`

