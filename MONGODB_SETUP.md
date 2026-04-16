# Expense Tracker - MongoDB Setup Guide

Your expense tracker is now connected to MongoDB! Here's how to get it running.

## Prerequisites
- Node.js (v16 or higher)
- Your MongoDB Atlas connection string (already configured in `.env`)

## Setup Instructions

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Start the Backend Server
From the `server` directory:
```bash
npm run dev
```
OR for production:
```bash
npm start
```

The server will run on `http://localhost:5000`

### 3. In Another Terminal, Start the Frontend
From the root directory:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## What Changed

### Frontend (React)
- ✅ Removed localStorage dependency
- ✅ Added API integration with the Express backend
- ✅ Configured Vite proxy to route `/api` requests to the backend
- ✅ Added error handling and loading states
- ✅ All transactions now saved to MongoDB

### Backend (Express + MongoDB)
- ✅ Created Express server with CORS support
- ✅ Connected to MongoDB Atlas
- ✅ Created `Transaction` model with:
  - `description` (string, required)
  - `amount` (number, required, min 0.01)
  - `type` (Income/Expense)
  - `createdAt` and `updatedAt` timestamps (auto)

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/:id` | Get single transaction |
| POST | `/api/transactions` | Create new transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

## Environment Variables
The `.env` file in the server directory contains your MongoDB connection string. Keep it secure and never commit it to version control!

## Troubleshooting

### Backend won't connect to MongoDB
- Check your `.env` file has the correct MONGODB_URI
- Ensure your MongoDB Atlas cluster is running
- Check IP whitelist settings in MongoDB Atlas (should include your current IP or 0.0.0.0)

### Frontend can't reach API
- Ensure the backend server is running on port 5000
- Check that CORS is enabled (it is by default)
- Clear browser cache if you see old errors

### Transactions not persisting
- Verify MongoDB connection: visit `http://localhost:5000/api/health`
- Check browser console for API errors
- Check server console for connection logs

## Next Steps
- Add authentication/user login
- Add categories for transactions
- Add charts and statistics
- Deploy to production (Vercel for frontend, Render/Railway for backend)
