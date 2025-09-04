#!/bin/bash

# Nuwais Customer Portal - Quick Deployment Script
echo "🚀 Starting Nuwais Customer Portal deployment..."

# Navigate to the customer portal directory
cd "C:\Users\Faisal\CascadeProjects\Nuwais2\customer-portal"

# Install missing dependencies
echo "📦 Installing dependencies..."
npm install @tanstack/react-query@^5.0.0 sonner@^1.4.0

# Build the project
echo "🔨 Building project..."
npm run build

# Add all changes to git
echo "📝 Committing changes..."
git add .
git commit -m "feat: Complete React customer portal implementation

- Add React Router for navigation
- Implement Zustand for state management
- Add TanStack Query for API management
- Create homepage with service showcase
- Add authentication system foundation
- Implement responsive design with Tailwind
- Connect to backend API
- Add error boundaries and loading states"

# Push to GitHub (triggers Vercel deployment)
echo "🚀 Deploying to Vercel..."
git push origin main

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://nuwais.bahrain-ai.com"
echo "📱 Direct Vercel URL: https://nuwais-customer-portal-pdosdy8td-faisal-almerbatis-projects.vercel.app"
echo ""
echo "⏱️  Wait 2-3 minutes for build completion, then test your site!"