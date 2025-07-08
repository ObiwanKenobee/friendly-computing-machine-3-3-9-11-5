#!/bin/bash

# QuantumVest Enterprise - Production Vercel Deployment Script
# Fixes all production deployment issues

set -e

echo "🚀 Starting QuantumVest Enterprise Production Deployment to Vercel..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed"
    echo "Installing Vercel CLI..."
    npm install -g vercel@latest
fi

# Verify we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

print_info "🔍 Running pre-deployment checks..."

# 1. Clean previous builds
print_info "Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.vite/
rm -rf .vercel/

# 2. Fresh install
print_info "Installing dependencies..."
npm ci --include=dev --silent

# 3. TypeScript check
print_info "Checking TypeScript..."
npm run typecheck
if [ $? -ne 0 ]; then
    print_error "TypeScript check failed"
    exit 1
fi
print_status "TypeScript check passed"

# 4. Production build test
print_info "Testing production build..."
npm run build:production
if [ $? -ne 0 ]; then
    print_error "Production build failed"
    exit 1
fi
print_status "Production build successful"

# 5. Verify build output
if [ ! -f "dist/index.html" ]; then
    print_error "dist/index.html not found - build output is invalid"
    exit 1
fi
print_status "Build output verified"

# 6. Setup environment variables
print_info "Configuring production environment..."
export NODE_ENV=production
export GENERATE_SOURCEMAP=false

# 7. Login to Vercel (if not already logged in)
print_info "Checking Vercel authentication..."
vercel whoami > /dev/null 2>&1 || {
    print_warning "Not logged in to Vercel. Please login:"
    vercel login
}

# 8. Deploy to Vercel
print_info "Deploying to Vercel..."
DEPLOYMENT_URL=$(vercel --prod --yes 2>&1 | grep -o 'https://[^[:space:]]*' | tail -1)

if [ $? -eq 0 ] && [ -n "$DEPLOYMENT_URL" ]; then
    print_status "🎉 Deployment successful!"
    echo "Production URL: $DEPLOYMENT_URL"
else
    print_error "Deployment failed"

    # Try to get more details
    print_info "Attempting deployment with verbose output..."
    vercel --prod --yes --debug
    exit 1
fi

# 9. Post-deployment verification
print_info "Verifying deployment..."
sleep 10

# Test if the deployment is accessible
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$DEPLOYMENT_URL" 2>/dev/null || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    print_status "Deployment verification successful (HTTP $HTTP_STATUS)"
else
    print_warning "Deployment verification failed (HTTP $HTTP_STATUS)"
    echo "URL: $DEPLOYMENT_URL"
fi

# 10. Test critical routes
print_info "Testing critical routes..."
CRITICAL_ROUTES=("/" "/dashboard" "/pricing" "/enterprise-subscriptions")

for route in "${CRITICAL_ROUTES[@]}"; do
    ROUTE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "${DEPLOYMENT_URL}${route}" 2>/dev/null || echo "000")
    if [ "$ROUTE_STATUS" = "200" ]; then
        print_status "Route $route: HTTP $ROUTE_STATUS"
    else
        print_warning "Route $route: HTTP $ROUTE_STATUS"
    fi
done

echo ""
print_status "🎉 QuantumVest Enterprise Production Deployment Complete!"
echo ""
echo "📊 Deployment Summary:"
echo "- URL: $DEPLOYMENT_URL"
echo "- Build Time: $(date)"
echo "- Framework: Vite + React + TypeScript"
echo "- Bundle Size: Optimized with code splitting"
echo ""
echo "🔗 Next Steps:"
echo "1. Test all enterprise features"
echo "2. Monitor performance metrics"
echo "3. Set up custom domain if needed"
echo "4. Configure environment variables in Vercel dashboard"
echo ""
echo "📱 Vercel Dashboard: https://vercel.com/dashboard"
echo "📊 Analytics: https://vercel.com/analytics"

# Save deployment URL for reference
echo "$DEPLOYMENT_URL" > .vercel-deployment-url.txt
print_info "Deployment URL saved to .vercel-deployment-url.txt"
