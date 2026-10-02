#!/bin/bash
set -e

echo "🚀 Starting Cookscape Website Deployment..."

# Navigate to project directory (supports both folder structures)
if [ -d "/home/deploy/cookscape_newsite/Cookscape_newsite" ]; then
    cd /home/deploy/cookscape_newsite/Cookscape_newsite
elif [ -d "/home/deploy/cookscape_newsite" ]; then
    cd /home/deploy/cookscape_newsite
fi

echo "⏬ Pulling latest code from GitHub..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "💻 Building frontend..."
npm run build

echo "🔄 Restarting PM2 process..."
pm2 reload cookscape-website || pm2 restart cookscape-website

echo "✅ Cookscape Website Deployed Successfully!"
