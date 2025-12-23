# 🚀 Development Workflow Guide

## Local Development Setup

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Backend runs on: **http://localhost:3000**

### 2. Start Frontend Server
```bash
# In a new terminal, from project root
npm run dev
```
Frontend runs on: **http://localhost:5173**

### 3. Access Your Website
Open **http://localhost:5173** in your browser

---

## Making Changes

1. **Edit files** in your code editor
2. **Frontend auto-reloads** (Vite hot reload)
3. **Backend auto-restarts** (Nodemon)
4. **Test changes** in browser

---

## Git Workflow (Push to GitHub)

### Step 1: Check What Changed
```bash
git status
```

### Step 2: Add Your Changes
```bash
# Add all changes
git add .

# Or add specific files
git add src/components/MyComponent.jsx
```

### Step 3: Commit Changes
```bash
git commit -m "Description of your changes"
```

### Step 4: Push to GitHub
```bash
git push origin master
```

---

## Deployment (After Pushing to GitHub)

### Frontend (Vercel)
- **Auto-deploys** when you push to GitHub
- Check: https://vercel.com/dashboard

### Backend (Render)
- **Auto-deploys** when you push to GitHub (if connected)
- Or manually trigger in Render dashboard

---

## Important Notes

- ✅ **Never commit** `.env` files (already in .gitignore)**
- ✅ **Never commit** `node_modules/` (already in .gitignore)
- ✅ **Always test locally** before pushing
- ✅ **Commit frequently** with clear messages

---

## Quick Commands Reference

```bash
# Start development
cd backend && npm run dev          # Terminal 1
cd .. && npm run dev                # Terminal 2

# Git workflow
git status                          # Check changes
git add .                          # Stage changes
git commit -m "Your message"        # Commit
git push origin master              # Push to GitHub

# Check running servers
lsof -ti:3000                      # Backend port
lsof -ti:5173                      # Frontend port
```

---

## Troubleshooting

### Servers not running?
```bash
# Kill existing processes
kill $(lsof -ti:3000) 2>/dev/null
kill $(lsof -ti:5173) 2>/dev/null

# Restart
cd backend && npm run dev
cd .. && npm run dev
```

### Port already in use?
```bash
# Find what's using the port
lsof -i:3000
lsof -i:5173
```

---

**Happy Coding! 🎉**

