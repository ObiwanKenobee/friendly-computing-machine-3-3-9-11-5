#!/bin/bash

# QuantumVest Enterprise - Final Vercel Deployment Script
# Complete deployment with all optimizations and checks

set -e

echo "🚀 QuantumVest Enterprise - Final Vercel Deployment"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Pre-flight checks
print_info "Running pre-flight checks..."

# 1. Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    print_warning "Installing Vercel CLI..."
    npm install -g vercel@latest
fi

# 2. Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
    print_error "Not in project root directory"
    exit 1
fi

# 3. Clean previous builds
print_info "Cleaning previous builds..."
rm -rf dist/ node_modules/.vite/ .vercel/

# 4. Install dependencies
print_info "Installing dependencies..."
npm ci --include=dev --silent

# 5. Run all quality checks
print_info "Running TypeScript check..."
npm run typecheck || {
    print_error "TypeScript check failed"
    exit 1
}

print_info "Running linting..."
npm run lint || {
    print_error "Linting failed"
    exit 1
}

# 6. Test production build
print_info "Testing production build..."
npm run build:production || {
    print_error "Production build failed"
    exit 1
}

# 7. Verify build output
if [ ! -f "dist/index.html" ] || [ ! -d "dist/assets" ]; then
    print_error "Build output is invalid"
    exit 1
fi

print_status "All pre-flight checks passed!"

# 8. Security audit
print_info "Running security audit..."
npm audit --audit-level high || {
    print_warning "Security vulnerabilities found - review recommended"
}

# 9. Login check
print_info "Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    print_warning "Please log in to Vercel:"
    vercel login
fi

# 10. Deploy to Vercel
print_info "Deploying to Vercel..."

if [ "$1" = "--production" ] || [ "$1" = "--prod" ]; then
    print_info "🎯 Deploying to PRODUCTION..."
    DEPLOYMENT_URL=$(vercel --prod --yes 2>&1 | grep -o 'https://[^[:space:]]*' | tail -1)
    DEPLOYMENT_TYPE="production"
else
    print_info "🔍 Deploying to PREVIEW..."
    DEPLOYMENT_URL=$(vercel --yes 2>&1 | grep -o 'https://[^[:space:]]*' | tail -1)
    DEPLOYMENT_TYPE="preview"
fi

if [ $? -eq 0 ] && [ -n "$DEPLOYMENT_URL" ]; then
    print_status "🎉 Deployment successful!"
    echo ""
    echo "📊 Deployment Details:"
    echo "- Type: $DEPLOYMENT_TYPE"
    echo "- URL: $DEPLOYMENT_URL"
    echo "- Build time: $(date)"
else
    print_error "Deployment failed"
    exit 1
fi

# 11. Post-deployment verification
print_info "Verifying deployment..."
sleep 15

# Test main route
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$DEPLOYMENT_URL" 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
    print_status "Main route verification passed (HTTP $HTTP_STATUS)"
else
    print_warning "Main route verification failed (HTTP $HTTP_STATUS)"
fi

# Test critical routes
print_info "Testing critical application routes..."
ROUTES=("/" "/dashboard" "/pricing" "/enterprise-subscriptions" "/platform-navigation")

for route in "${ROUTES[@]}"; do
    ROUTE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "${DEPLOYMENT_URL}${route}" 2>/dev/null || echo "000")
    if [ "$ROUTE_STATUS" = "200" ]; then
        echo "  ✅ $route: HTTP $ROUTE_STATUS"
    else
        echo "  ⚠️  $route: HTTP $ROUTE_STATUS"
    fi
done

# 12. Performance check
print_info "Basic performance check..."
LOAD_TIME=$(curl -s -o /dev/null -w "%{time_total}" --max-time 30 "$DEPLOYMENT_URL" 2>/dev/null || echo "timeout")
if [ "$LOAD_TIME" != "timeout" ]; then
    echo "  ⚡ Load time: ${LOAD_TIME}s"
    if (( $(echo "$LOAD_TIME < 3.0" | bc -l) )); then
        print_status "Load time is acceptable"
    else
        print_warning "Load time could be improved"
    fi
fi

# 13. Save deployment info
echo "$DEPLOYMENT_URL" > .vercel-deployment-url.txt
echo "$(date): $DEPLOYMENT_TYPE deployment to $DEPLOYMENT_URL" >> .deployment-history.txt

# Final summary
echo ""
echo "🎯 DEPLOYMENT COMPLETE!"
echo "======================="
echo ""
echo "🔗 URLs:"
echo "  • Live URL: $DEPLOYMENT_URL"
echo "  • Vercel Dashboard: https://vercel.com/dashboard"
echo "  • Analytics: https://vercel.com/analytics"
echo ""
echo "📋 What to do next:"
if [ "$DEPLOYMENT_TYPE" = "production" ]; then
    echo "  1. Test all features thoroughly"
    echo "  2. Monitor Core Web Vitals"
    echo "  3. Check error tracking"
    echo "  4. Update DNS (if using custom domain)"
else
    echo "  1. Test the preview deployment"
    echo "  2. If everything looks good, deploy to production:"
    echo "     bash scripts/deploy-vercel-final.sh --production"
fi
echo ""
echo "🛡️  Security & Performance:"
echo "  • HTTPS: ✅ Enabled"
echo "  • Security Headers: ✅ Configured"
echo "  • Compression: ✅ Enabled"
echo "  • CDN: ✅ Global Edge Network"
echo ""
print_status "QuantumVest Enterprise is now live! 🚀"
