# Deploy Expense Tracker to Render

Your app is now fully integrated! Frontend and backend run as a single service.

## Deployment Steps on Render

### 1. Push Code to GitHub
First, upload your project to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - expense tracker with MongoDB"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git push -u origin main
```

### 2. Deploy on Render.com

**A) Create Account & Connect GitHub**
- Go to [render.com](https://render.com)
- Sign up and connect your GitHub account
- Grant Render permission to access your repositories

**B) Create a New Service**
- Click **New +** → **Web Service**
- Select your **expense-tracker** repository
- Choose branch: **main**

**C) Configure Service**
- **Name:** `expense-tracker`
- **Environment:** `Node`
- **Build Command:** `npm run server:install && npm run build && cd server && npm run build:frontend`
- **Start Command:** `cd server && npm start`
- **Node Version:** `18` (or latest)

**D) Set Environment Variables**
Click **Environment** and add:
- **MONGODB_URI:** Paste your MongoDB connection string
- **NODE_ENV:** `production`
- **PORT:** `5000`

**E) Create Service**
- Click **Create Web Service**
- Render will build and deploy automatically
- Your app will be at: `https://expense-tracker.onrender.com`

## Project Structure After Integration

```
expense-tracker/
├── src/                          # React frontend
│   ├── App.jsx                  # Updated to use /api routes
│   ├── App.css
│   ├── main.jsx
│   └── ...
├── server/                       # Express backend
│   ├── server.js                # Now serves static frontend
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API endpoints
│   ├── .env                     # DB credentials
│   ├── package.json
│   └── ...
├── package.json                 # Root package
├── vite.config.js              # Frontend build config
├── render.yaml                 # Render deployment config
└── ...
```

## How It Works

1. **Build Phase (Render):**
   - Installs frontend dependencies
   - Builds React to `dist/` folder
   - Installs backend dependencies
   - Backend is ready to serve

2. **Runtime:**
   - Express server starts on port 5000
   - Serves static files from `dist/` folder
   - API routes available at `/api/transactions`
   - All other routes → index.html (SPA routing)

3. **API Communication:**
   - Frontend requests: `GET /api/transactions`
   - Backend processes and returns from MongoDB
   - No need for CORS workarounds in production

## Local Testing Before Deploy

Test the full integration locally:

```bash
# Terminal 1: Build frontend
npm run build

# Terminal 2: Install and start backend
cd server
npm install
npm start
```

Then visit `http://localhost:5000` - your app runs on a single port!

## Troubleshooting Render Deployment

**Build fails:**
- Check build logs in Render dashboard
- Ensure package.json scripts are correct
- Verify Node version compatibility

**App crashes:**
- Check "Logs" in Render dashboard
- Verify MONGODB_URI environment variable is set
- Check MongoDB Atlas whitelist includes Render's IP (0.0.0.0)

**API requests fail:**
- Ensure `/api` routes are working: `curl https://your-app.onrender.com/api/health`
- Check browser console for error details
- Verify MongoDB connection

**Cold start delays:**
- Render spins down free tier apps after inactivity
- First request takes 30 seconds - normal for free tier
- Upgrade to paid plan for instant load times

## Next Steps

✅ Integrated frontend and backend
✅ Ready for single-service deployment
✅ MongoDB persists all data
- Monitor performance on Render dashboard
- Set up custom domain if needed
- Consider upgrading to paid plan for production use

## Environment Setup Example

For local development, create `server/.env`:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

For Render, set via dashboard Environment Variables - never commit .env!
