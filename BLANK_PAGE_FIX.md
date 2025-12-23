# 🔧 Blank Page Troubleshooting Guide

## Quick Fixes

### 1. **Clear Browser Cache**
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac) for hard refresh
- Or clear browser cache completely

### 2. **Check Browser Console**
1. Open **Developer Tools**: Press `F12` or `Cmd+Option+I` (Mac)
2. Go to **Console** tab
3. Look for **red error messages**
4. Share any errors you see

### 3. **Check Network Tab**
1. Open **Developer Tools** (`F12`)
2. Go to **Network** tab
3. Refresh the page (`F5`)
4. Look for **failed requests** (red status codes)
5. Click on failed requests to see error details

### 4. **Try Incognito/Private Window**
- Open a new incognito/private window
- Navigate to `http://localhost:5173`

### 5. **Verify Servers Are Running**
```bash
# Check backend
curl http://localhost:3000/health

# Check frontend
curl http://localhost:5173
```

---

## Common Issues & Solutions

### Issue: CORS Error
**Error in console:** `Access to fetch at 'http://localhost:3000' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution:**
- Backend CORS is already configured
- Make sure backend is running on port 3000
- Restart backend: `cd backend && npm run dev`

### Issue: 404 Errors
**Error in console:** `Failed to load resource: the server responded with a status of 404`

**Solution:**
- Check if file exists in `public/` folder
- Verify imports in components

### Issue: Syntax Error
**Error in console:** `Uncaught SyntaxError: ...`

**Solution:**
- Check the file mentioned in error
- Look for missing imports or typos

### Issue: React Error
**Error in console:** `Uncaught Error: ...`

**Solution:**
- Check component imports
- Verify all dependencies are installed: `npm install`

---

## Manual Server Restart

If servers aren't running:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd /Users/aadityarajsoni/Desktop/SORTMENU
npm run dev
```

---

## Still Not Working?

1. **Share the browser console errors** (screenshot or copy text)
2. **Share the Network tab errors** (failed requests)
3. **Check if both servers are running:**
   ```bash
   lsof -ti:3000  # Backend
   lsof -ti:5173  # Frontend
   ```

---

**Current Status:**
- ✅ API URL fixed (using `import.meta.env` instead of `process.env`)
- ✅ Frontend server restarted
- ✅ Backend server running

**Next Step:** Open browser console and check for errors!

