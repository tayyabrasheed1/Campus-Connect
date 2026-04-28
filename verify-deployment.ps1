$ErrorActionPreference = "SilentlyContinue"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Campus Connect - Deployment Check" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check Node version
Write-Host "1. Checking Node.js version..." -ForegroundColor Yellow
$NodeVersion = node -v
$NpmVersion = npm -v
Write-Host "   Node version: $NodeVersion"
Write-Host "   NPM version: $NpmVersion"
Write-Host ""

# Check if .env files exist
Write-Host "2. Checking environment files..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    Write-Host "   ✓ backend\.env exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ backend\.env missing" -ForegroundColor Red
}

if (Test-Path "App Ui\.env") {
    Write-Host "   ✓ App Ui\.env exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ App Ui\.env missing" -ForegroundColor Red
}

if (Test-Path "frontend\.env") {
    Write-Host "   ✓ frontend\.env exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ frontend\.env missing" -ForegroundColor Red
}
Write-Host ""

# Check dependencies
Write-Host "3. Checking node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✓ Root node_modules installed" -ForegroundColor Green
} else {
    Write-Host "   ✗ Root node_modules missing - run: npm install" -ForegroundColor Red
}

if (Test-Path "backend\node_modules") {
    Write-Host "   ✓ Backend node_modules installed" -ForegroundColor Green
} else {
    Write-Host "   ✗ Backend node_modules missing - run: npm --prefix backend install" -ForegroundColor Red
}

if (Test-Path "App Ui\node_modules") {
    Write-Host "   ✓ App Ui node_modules installed" -ForegroundColor Green
} else {
    Write-Host "   ✗ App Ui node_modules missing - run: npm --prefix 'App Ui' install" -ForegroundColor Red
}
Write-Host ""

# Check if App Ui is built
Write-Host "4. Checking App Ui build..." -ForegroundColor Yellow
if (Test-Path "App Ui\dist") {
    Write-Host "   ✓ App Ui\dist exists (built)" -ForegroundColor Green
} else {
    Write-Host "   ✗ App Ui\dist missing - run: npm --prefix 'App Ui' run build" -ForegroundColor Red
}
Write-Host ""

# Check configuration files
Write-Host "5. Checking configuration files..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Write-Host "   ✓ vercel.json exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ vercel.json missing" -ForegroundColor Red
}

if (Test-Path ".vercelignore") {
    Write-Host "   ✓ .vercelignore exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ .vercelignore missing" -ForegroundColor Red
}

if (Test-Path "package.json") {
    Write-Host "   ✓ package.json exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ package.json missing" -ForegroundColor Red
}
Write-Host ""

# Check Node syntax
Write-Host "6. Checking JavaScript syntax..." -ForegroundColor Yellow
$AppCheck = node -c "backend/src/app.js" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ backend/src/app.js syntax OK" -ForegroundColor Green
} else {
    Write-Host "   ✗ backend/src/app.js has errors" -ForegroundColor Red
}

$EnvCheck = node -c "backend/src/config/env.js" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ backend/src/config/env.js syntax OK" -ForegroundColor Green
} else {
    Write-Host "   ✗ backend/src/config/env.js has errors" -ForegroundColor Red
}
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Verification Complete!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. If any checks failed, run the suggested commands above"
Write-Host "2. For local testing: npm run dev"
Write-Host "3. For production build: cd 'App Ui' && npm run build"
Write-Host "4. For Vercel deployment: Push to GitHub and connect to Vercel"
Write-Host ""
