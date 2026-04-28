#!/bin/bash

# Campus Connect - Deployment Verification Script
# This script verifies that all deployment requirements are met

echo "================================"
echo "Campus Connect - Deployment Check"
echo "================================"
echo ""

# Check Node version
echo "1. Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Node version: $NODE_VERSION"
NPM_VERSION=$(npm -v)
echo "   NPM version: $NPM_VERSION"
echo ""

# Check if .env files exist
echo "2. Checking environment files..."
if [ -f "backend/.env" ]; then
    echo "   ✓ backend/.env exists"
else
    echo "   ✗ backend/.env missing"
fi

if [ -f "App Ui/.env" ]; then
    echo "   ✓ App Ui/.env exists"
else
    echo "   ✗ App Ui/.env missing"
fi

if [ -f "frontend/.env" ]; then
    echo "   ✓ frontend/.env exists"
else
    echo "   ✗ frontend/.env missing"
fi
echo ""

# Check dependencies
echo "3. Checking node_modules..."
if [ -d "node_modules" ]; then
    echo "   ✓ Root node_modules installed"
else
    echo "   ✗ Root node_modules missing - run: npm install"
fi

if [ -d "backend/node_modules" ]; then
    echo "   ✓ Backend node_modules installed"
else
    echo "   ✗ Backend node_modules missing - run: npm --prefix backend install"
fi

if [ -d "App Ui/node_modules" ]; then
    echo "   ✓ App Ui node_modules installed"
else
    echo "   ✗ App Ui node_modules missing - run: npm --prefix 'App Ui' install"
fi
echo ""

# Check if App Ui is built
echo "4. Checking App Ui build..."
if [ -d "App Ui/dist" ]; then
    echo "   ✓ App Ui/dist exists (built)"
else
    echo "   ✗ App Ui/dist missing - run: npm --prefix 'App Ui' run build"
fi
echo ""

# Check configuration files
echo "5. Checking configuration files..."
if [ -f "vercel.json" ]; then
    echo "   ✓ vercel.json exists"
else
    echo "   ✗ vercel.json missing"
fi

if [ -f ".vercelignore" ]; then
    echo "   ✓ .vercelignore exists"
else
    echo "   ✗ .vercelignore missing"
fi

if [ -f "package.json" ]; then
    echo "   ✓ package.json exists"
else
    echo "   ✗ package.json missing"
fi
echo ""

# Check Node syntax
echo "6. Checking JavaScript syntax..."
node -c "backend/src/app.js" 2>/dev/null && echo "   ✓ backend/src/app.js syntax OK" || echo "   ✗ backend/src/app.js has errors"
node -c "backend/src/config/env.js" 2>/dev/null && echo "   ✓ backend/src/config/env.js syntax OK" || echo "   ✗ backend/src/config/env.js has errors"
echo ""

echo "================================"
echo "Verification Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. If any checks failed, run the suggested commands above"
echo "2. For local testing: npm run dev"
echo "3. For production build: cd 'App Ui' && npm run build"
echo "4. For Vercel deployment: Push to GitHub and connect to Vercel"
echo ""
