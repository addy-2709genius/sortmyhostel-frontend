# 🚀 Deploy Frontend to Vercel

## Step 1: Push Frontend to GitHub

1. **Initialize Git (if not already)**
   ```bash
   cd /Users/aadityarajsoni/Desktop/SORTMENU
   git init
   ```

2. **Create .gitignore** (if not exists)
   - Should include: `node_modules/`, `.env`, `dist/`

3. **Create GitHub Repository**
   - Go to https://github.com/new
   - Repository name: `sortmyhostel-frontend`
   - Make it **Public** or **Private**
   - Click **"Create repository"**

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "Initial frontend setup"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sortmyhostel-frontend.git
   git push -u origin main
   ```

---

## Step 2: Deploy to Vercel

1. **Go to Vercel**
   - Visit: https://vercel.com/dashboard
   - Sign up/Login (use GitHub for quick signup)

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Click **"Import Git Repository"**
   - Select: `YOUR_USERNAME/sortmyhostel-frontend`
   - Click **"Import"**

3. **Configure Project**
   - **Project Name**: `sortmyhostel` (or any name you prefer)
   - **Framework Preset**: **Vite** (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Environment Variables** (Optional)
   - Usually not needed for frontend
   - If you have any, add them here

5. **Deploy**
   - Click **"Deploy"**
   - ⏳ Wait 2-3 minutes
   - Your frontend will be live at: `https://your-project-name.vercel.app`

---

## Step 3: Update API URL

After backend is deployed on Render, update the frontend API URL:

1. **Get Render Backend URL**
   - Your Render backend will be at: `https://sortmyhostel-backend.onrender.com`
   - Or your custom domain

2. **Update Frontend Code**
   - In `src/services/api.js`, update:
   ```javascript
   const API_BASE_URL = 'https://sortmyhostel-backend.onrender.com/api';
   ```

3. **Commit and Push**
   ```bash
   git add src/services/api.js
   git commit -m "Update API URL to Render backend"
   git push
   ```

4. **Vercel will auto-redeploy** (or manually redeploy)

---

## ✅ Success!

Your frontend is now:
- ✅ Deployed on Vercel
- ✅ Connected to Render backend
- ✅ Live and accessible

---

## 🔗 URLs

- **Frontend**: `https://your-project-name.vercel.app`
- **Backend**: `https://sortmyhostel-backend.onrender.com`

---

## 🔧 Troubleshooting

### Build fails
- Check build logs in Vercel dashboard
- Verify `package.json` has correct build script
- Check for TypeScript/ESLint errors

### API not connecting
- Verify backend URL is correct
- Check CORS settings in backend
- Verify backend is running on Render

