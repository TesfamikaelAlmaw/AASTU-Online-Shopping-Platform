# AASTU Online Shopping Platform - Deployment

This project is configured for automatic deployment:
- **Frontend**: Vercel
- **Backend**: Render

## Quick Deploy

### Prerequisites
1. GitHub account
2. Vercel account
3. Render account
4. MongoDB Atlas account

### Deploy Backend (Render)
1. Connect GitHub repository to Render
2. Set root directory to `backend`
3. Build command: `npm install && npm run build`
4. Start command: `npm run start:prod`
5. Add environment variables (see DEPLOYMENT_GUIDE.md)

### Deploy Frontend (Vercel)
1. Import project from GitHub
2. Set root directory to `frontend`
3. Framework: Vite
4. Build command: `npm run build`
5. Add environment variable: `VITE_NEST_APP_URL`

## Full Documentation

See [DEPLOYMENT_GUIDE.md](../../../.gemini/antigravity/brain/58a18a3b-6803-4b42-b939-c16cc93385f5/DEPLOYMENT_GUIDE.md) for complete step-by-step instructions.

## Environment Variables

### Frontend (Vercel)
```
VITE_NEST_APP_URL=https://your-backend.onrender.com
```

### Backend (Render)
```
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CORS_ORIGIN=https://your-frontend.vercel.app
```

## CI/CD

Automatic deployments trigger on every push to `main` branch.
