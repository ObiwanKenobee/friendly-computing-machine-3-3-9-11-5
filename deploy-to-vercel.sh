#!/bin/bash

# QuantumVest Enterprise - Complete Vercel Deployment Script
# Updated for current launch with all enterprise features
# Version: 2.1.0

set -e

echo "🚀 Deploying QuantumVest Enterprise v2.1.0 to Vercel..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

print_header() {
    echo -e "${PURPLE}🔥 $1${NC}"
}

print_enterprise() {
    echo -e "${CYAN}🏢 $1${NC}"
}

# Show deployment banner
echo ""
print_header "========================================"
print_header "  QuantumVest Enterprise Deployment"
print_header "  Version: 2.1.0"
print_header "  Platform: Vercel"
print_header "  Features: All Enterprise + AI + Quantum"
print_header "========================================"
echo ""

# Pre-deployment checks
print_info "🔍 Running comprehensive pre-deployment checks..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel@latest
    print_status "Vercel CLI installed"
fi

# Check Node.js version
NODE_VERSION=$(node --version)
print_info "Node.js version: $NODE_VERSION"

# 1. Clean all previous builds and caches
print_info "🧹 Comprehensive cleanup..."
rm -rf dist/
rm -rf build/
rm -rf .output/
rm -rf node_modules/.vite/
rm -rf .vercel/
rm -rf .cache/
print_status "All build artifacts cleaned"

# 2. Fresh dependency installation
print_info "📦 Installing fresh dependencies..."
npm ci --silent --no-optional
if [ $? -ne 0 ]; then
    print_error "Dependency installation failed"
    exit 1
fi
print_status "Dependencies installed successfully"

# 3. TypeScript validation
print_info "🔍 Running TypeScript validation..."
npm run typecheck
if [ $? -ne 0 ]; then
    print_error "TypeScript validation failed"
    exit 1
fi
print_status "TypeScript validation passed"

# 4. Enterprise features validation
print_enterprise "Validating enterprise features..."

ENTERPRISE_PAGES=(
    "src/pages/enterprise-subscriptions.tsx"
    "src/pages/legendary-investors-enterprise.tsx"
    "src/pages/african-market-enterprise.tsx"
    "src/pages/wildlife-conservation-enterprise.tsx"
    "src/pages/quantum-enterprise-2050.tsx"
    "src/pages/methuselah-enterprise.tsx"
    "src/pages/geographical-consciousness.tsx"
)

for page in "${ENTERPRISE_PAGES[@]}"; do
    if [ -f "$page" ]; then
        print_status "✓ $(basename "$page" .tsx)"
    else
        print_error "Missing enterprise page: $page"
        exit 1
    fi
done

print_enterprise "All enterprise features validated"

# 5. Production build with optimizations
print_info "🏗️ Building optimized production bundle..."
NODE_ENV=production GENERATE_SOURCEMAP=false npm run build:production
if [ $? -ne 0 ]; then
    print_error "Production build failed"
    exit 1
fi
print_status "Production build completed"

# 6. Build output verification
print_info "🔍 Verifying build output..."
if [ ! -f "dist/index.html" ]; then
    print_error "dist/index.html not found - build output is invalid"
    exit 1
fi

if [ ! -d "dist/assets" ]; then
    print_error "dist/assets directory not found - assets missing"
    exit 1
fi

# Check if critical files exist
CRITICAL_FILES=(
    "dist/index.html"
    "dist/robots.txt"
    "dist/site.webmanifest"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "✓ $(basename "$file")"
    else
        print_warning "Missing: $file"
    fi
done

# Get build size info
BUILD_SIZE=$(du -sh dist/ | cut -f1)
print_info "Build size: $BUILD_SIZE"

# 7. Environment configuration
print_info "⚙️ Configuring production environment..."
export NODE_ENV=production
export GENERATE_SOURCEMAP=false
export VITE_APP_ENV=production
export VITE_APP_VERSION=2.1.0

# 8. Vercel authentication check
print_info "🔐 Checking Vercel authentication..."
if ! vercel whoami > /dev/null 2>&1; then
    print_warning "Not logged in to Vercel. Please login:"
    vercel login
fi

VERCEL_USER=$(vercel whoami 2>/dev/null || echo "Unknown")
print_status "Logged in as: $VERCEL_USER"

# 9. Deploy to Vercel
print_info "🚀 Deploying to Vercel..."
echo "Deployment mode: Production"
echo "Framework: Vite"
echo "Build command: npm run build:production"
echo "Output directory: dist"
echo ""

# Deploy with production flag
vercel --prod --yes --local-config vercel.json > deployment.log 2>&1 &
DEPLOY_PID=$!

# Show progress indicator
echo -n "Deploying"
while kill -0 $DEPLOY_PID 2>/dev/null; do
    echo -n "."
    sleep 2
done
wait $DEPLOY_PID
DEPLOY_EXIT_CODE=$?
echo ""

if [ $DEPLOY_EXIT_CODE -eq 0 ]; then
    DEPLOYMENT_URL=$(grep -o 'https://[^[:space:]]*' deployment.log | tail -1)
    print_status "🎉 Deployment successful!"
    echo "Production URL: $DEPLOYMENT_URL"
else
    print_error "Deployment failed"
    echo "Error log:"
    cat deployment.log
    exit 1
fi

# 10. Post-deployment verification
print_info "🔍 Verifying deployment..."
sleep 15

# Test main page
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$DEPLOYMENT_URL" 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
    print_status "Main page: HTTP $HTTP_STATUS"
else
    print_warning "Main page: HTTP $HTTP_STATUS"
fi

# Test enterprise routes
print_enterprise "Testing enterprise routes..."
ENTERPRISE_ROUTES=(
    "/enterprise-subscriptions"
    "/legendary-investors-enterprise"
    "/african-market-enterprise"
    "/wildlife-conservation-enterprise"
    "/quantum-enterprise-2050"
    "/methuselah-enterprise"
    "/geographical-consciousness"
)

WORKING_ROUTES=0
for route in "${ENTERPRISE_ROUTES[@]}"; do
    ROUTE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "${DEPLOYMENT_URL}${route}" 2>/dev/null || echo "000")
    if [ "$ROUTE_STATUS" = "200" ]; then
        print_status "✓ $route: HTTP $ROUTE_STATUS"
        ((WORKING_ROUTES++))
    else
        print_warning "✗ $route: HTTP $ROUTE_STATUS"
    fi
done

print_enterprise "Enterprise routes working: $WORKING_ROUTES/${#ENTERPRISE_ROUTES[@]}"

# 11. Performance check
print_info "⚡ Quick performance check..."
LOAD_TIME=$(curl -s -o /dev/null -w "%{time_total}" --max-time 30 "$DEPLOYMENT_URL" 2>/dev/null || echo "timeout")
if [ "$LOAD_TIME" != "timeout" ]; then
    print_status "Load time: ${LOAD_TIME}s"
else
    print_warning "Load time: timeout"
fi

# 12. Save deployment info
echo "$DEPLOYMENT_URL" > .vercel-deployment-url.txt
echo "$(date)" > .vercel-deployment-date.txt

# Cleanup
rm -f deployment.log

# Success summary
echo ""
print_header "🎉 QuantumVest Enterprise Deployment Complete!"
echo ""
print_info "📊 Deployment Summary:"
echo "   • URL: $DEPLOYMENT_URL"
echo "   • Version: 2.1.0"
echo "   • Build Time: $(date)"
echo "   • Framework: Vite + React + TypeScript"
echo "   • Bundle Size: $BUILD_SIZE"
echo "   • Enterprise Features: $WORKING_ROUTES/${#ENTERPRISE_ROUTES[@]} working"
echo "   • Load Time: ${LOAD_TIME}s"
echo ""
print_info "🔗 Next Steps:"
echo "   1. Test all enterprise features manually"
echo "   2. Monitor performance in Vercel dashboard"
echo "   3. Set up custom domain if needed"
echo "   4. Configure environment variables"
echo "   5. Enable Vercel Analytics"
echo ""
print_info "📱 Vercel Resources:"
echo "   • Dashboard: https://vercel.com/dashboard"
echo "   • Analytics: https://vercel.com/analytics"
echo "   • Functions: https://vercel.com/functions"
echo "   • Domains: https://vercel.com/domains"
echo ""
print_enterprise "Enterprise features deployed and ready!"
print_status "Deployment info saved to .vercel-deployment-url.txt"
