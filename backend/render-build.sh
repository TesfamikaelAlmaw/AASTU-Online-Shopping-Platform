# Render Build Script
# This script runs during deployment on Render

echo "🚀 Starting Render deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"
