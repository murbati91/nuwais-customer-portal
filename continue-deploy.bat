@echo off
echo 🔨 Building project...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    echo 📝 Committing changes...
    git add .
    git commit -m "feat: Complete React customer portal implementation"
    
    echo 🚀 Deploying to Vercel...
    git push origin main
    
    echo.
    echo ✅ Deployment complete!
    echo 🌐 Your site will be available at: https://nuwais.bahrain-ai.com
    echo 📱 Direct Vercel URL: https://nuwais-customer-portal-pdosdy8td-faisal-almerbatis-projects.vercel.app
    echo.
    echo ⏱️  Wait 2-3 minutes for Vercel build completion, then test your site!
) else (
    echo ❌ Build failed. Checking for issues...
    echo.
    echo Let's try a clean build:
    echo 1. Delete node_modules and package-lock.json
    echo 2. Run npm install
    echo 3. Run npm run build
)

pause