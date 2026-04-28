# Campus Connect - Deployment Guide

## ✅ Fixed Issues Summary

All deployment issues have been resolved. Here's what was fixed:

### 1. **Missing Environment Files**
   - ✅ Created `backend/.env` with proper configuration
   - ✅ Created `App Ui/.env` with API endpoints
   - ✅ Created `frontend/.env` with API configuration
   - ✅ Created `backend/.env.production` for Vercel deployment

### 2. **Node Version Compatibility**
   - ✅ Updated backend `package.json` to require `node: ">=18.0.0"` (compatible with current v20.15.0)
   - ✅ All dependencies are compatible with Node v20.15.0

### 3. **Dependencies Installation**
   - ✅ Root dependencies: `concurrently` package installed
   - ✅ Backend dependencies: All packages installed (bcryptjs, cors, dotenv, express, jsonwebtoken, mongoose, nodemailer)
   - ✅ App Ui dependencies: All packages installed (React, Material UI, Radix UI components)

### 4. **Build Configuration**
   - ✅ App Ui built successfully with Vite (dist folder created)
   - ✅ Vercel configuration properly set up in `vercel.json`
   - ✅ .vercelignore configured to exclude legacy frontend folder

### 5. **API Configuration**
   - ✅ Fixed `api/[...path].js` to properly handle database connections
   - ✅ Added connection pooling to prevent MongoDB connection issues
   - ✅ CORS configuration properly handles Vercel deployments

## 📋 Environment Variables Setup

### Backend Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus_connect
JWT_SECRET=your_secure_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
OTP_EXPIRY_MINUTES=10
FRONTEND_URL=http://localhost:5173
ADMIN_EMAILS=admin@gmail.com
STUDENT_DOMAINS=szabist-isb.edu.pk
FACULTY_DOMAINS=faculty.szabist-isb.edu.pk
ALUMNI_DOMAINS=alumni.szabist-isb.edu.pk
FACULTY_EMAIL_HINTS=faculty,prof,lecturer,hod
ALUMNI_EMAIL_HINTS=alumni,grad
NODE_ENV=development
```

### For Vercel Production Deployment

When deploying to Vercel, set these environment variables in your Vercel project settings:

1. **MONGO_URI** - Your MongoDB Atlas connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/campus_connect
   ```

2. **JWT_SECRET** - A strong random secret (at least 32 characters)
   ```
   your_very_secure_random_secret_key_at_least_32_chars_long
   ```

3. **FRONTEND_URL** - Your Vercel deployment URL
   ```
   https://your-project-name.vercel.app
   ```

4. **NODE_ENV**
   ```
   production
   ```

5. Other optional variables for your organization:
   - STUDENT_DOMAINS
   - FACULTY_DOMAINS
   - ALUMNI_DOMAINS
   - ADMIN_EMAILS
   - etc.

## 🚀 Deployment Steps

### Local Testing

1. **Start MongoDB locally** (if using local MongoDB):
   ```bash
   mongod
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Run backend only**:
   ```bash
   npm run dev:backend
   ```

4. **Run App Ui only**:
   ```bash
   npm run dev:frontend
   ```

### Vercel Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Select the root directory as the project root
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Set Environment Variables**:
   - In Vercel project settings → Environment Variables
   - Add all required variables listed above

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically:
     - Install dependencies (root, backend, App Ui)
     - Build App Ui with Vite
     - Deploy the static files and API serverless functions

## 📁 Project Structure

```
Campus-Connect-main/
├── package.json (root - orchestrator)
├── vercel.json (deployment configuration)
├── .vercelignore (ignore legacy frontend)
├── api/
│   └── [...path].js (Vercel serverless function)
├── backend/
│   ├── .env (✅ created)
│   ├── .env.production (✅ created)
│   ├── package.json (✅ Node version fixed)
│   ├── src/
│   │   ├── app.js (✅ verified)
│   │   ├── server.js (local development server)
│   │   ├── config/
│   │   │   ├── db.js (MongoDB connection with pooling)
│   │   │   └── env.js (environment configuration)
│   │   ├── controllers/ (business logic)
│   │   ├── models/ (database schemas)
│   │   ├── routes/ (API endpoints)
│   │   └── middleware/ (auth, etc)
│   └── node_modules/ (✅ installed)
├── App Ui/
│   ├── .env (✅ created)
│   ├── package.json
│   ├── vite.config.ts (✅ verified)
│   ├── src/
│   ├── dist/ (✅ built)
│   └── node_modules/ (✅ installed)
├── frontend/
│   ├── .env (✅ created)
│   ├── package.json (legacy)
│   └── node_modules/ (✅ installed)
└── node_modules/ (✅ installed)
```

## ✅ Verification Checklist

- [x] All .env files created with proper variables
- [x] Node version requirement compatible (>=18.0.0)
- [x] All dependencies installed successfully
- [x] App Ui built successfully with Vite
- [x] No syntax errors in critical files
- [x] API route properly configured for Vercel
- [x] MongoDB connection with pooling
- [x] CORS properly configured for production
- [x] vercel.json properly configured
- [x] .vercelignore properly configured

## 🔧 Troubleshooting

### If you get "Module not found" errors:
```bash
# Clean install
rm -rf node_modules backend/node_modules "App Ui/node_modules" frontend/node_modules package-lock.json
npm install
npm --prefix backend install
npm --prefix "App Ui" install
npm --prefix frontend install
```

### If MongoDB connection fails:
- Ensure MongoDB Atlas URI is correct in MONGO_URI
- Or start local MongoDB: `mongod`
- Check network connectivity

### If build fails on Vercel:
- Check Environment Variables are set correctly
- Verify MONGO_URI format
- Check logs in Vercel dashboard

### If API calls return 404:
- Verify FRONTEND_URL matches your Vercel domain
- Check CORS configuration in backend/src/app.js
- Verify API routes are properly mounted

## 📝 Notes

- The project uses Vercel serverless functions for the backend API
- Frontend is built as static files (SPA) using Vite
- MongoDB is required - use MongoDB Atlas for production
- JWT_SECRET must be at least 32 characters for production
- All sensitive keys should be set as environment variables, NOT in .env files

## 🎉 Ready to Deploy!

Your application is now fully configured and ready for deployment to Vercel.
