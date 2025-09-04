@echo off
echo 🧪 Testing build process...

echo 📋 Checking current directory...
cd

echo 📦 Checking if dependencies are installed...
if exist "node_modules" (
    echo ✅ node_modules found
) else (
    echo ❌ node_modules not found, installing...
    npm install
)

echo 🔨 Attempting build...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    echo 📁 Build output created in 'dist' folder
    
    echo 📝 Ready to deploy! Running git commands...
    git add .
    git status
    
    echo.
    echo 🚀 Would you like to deploy? (Y/N)
    set /p choice="Enter choice: "
    
    if /i "%choice%"=="Y" (
        git commit -m "feat: Complete React customer portal - working build"
        git push origin main
        echo ✅ Deployed! Check your Vercel dashboard for build status.
    ) else (
        echo 📋 Build ready. You can deploy manually when ready.
    )
) else (
    echo ❌ Build failed. Let's troubleshoot...
    echo.
    echo 🔍 Checking for common issues:
    echo 1. Missing dependencies
    echo 2. TypeScript errors
    echo 3. Import/export issues
    
    echo.
    echo 🛠️ Try this fix:
    echo npm install --force
    echo npm run build
)

pause