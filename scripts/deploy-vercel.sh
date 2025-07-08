#!/bin/bash

# QuantumVest Enterprise - Vercel Deployment Script
# Automated deployment with pre-deployment checks

set -e  # Exit on any error

echo "🚀 Starting QuantumVest Enterprise deployment to Vercel..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed"
    echo "Please install it with: npm install -g vercel"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

# Environment check
if [ ! -f ".env.production" ] && [ ! -f ".env.local" ]; then
    print_warning "No environment file found. Creating basic .env.local..."
    cp .env.example .env.local
fi

print_status "Running pre-deployment checks..."

# TypeScript check
echo "Checking TypeScript..."
npm run typecheck
if [ $? -ne 0 ]; then
    print_error "TypeScript check failed"
    exit 1
fi
print_status "TypeScript check passed"

# Build test
echo "Testing production build..."
npm run build:production
if [ $? -ne 0 ]; then
    print_error "Production build failed"
    exit 1
fi
print_status "Production build successful"

# Security audit
echo "Running security audit..."
npm audit --audit-level high
if [ $? -ne 0 ]; then
    print_warning "Security vulnerabilities found. Review before proceeding."
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled"
        exit 1
    fi
fi

# Clean build artifacts
print_status "Cleaning previous builds..."
rm -rf dist/

# Set production environment
export NODE_ENV=production
export GENERATE_SOURCEMAP=false

print_status "Deploying to Vercel..."

# Deploy with Vercel
if [ "$1" = "--production" ]; then
    vercel --prod --yes
    print_status "🎉 Production deployment successful!"
    echo "Your app is live at: $(vercel --prod --yes 2>&1 | grep -o 'https://[^[:space:]]*')"
else
    vercel --yes
    print_status "🎉 Preview deployment successful!"
    echo "Preview URL: $(vercel --yes 2>&1 | grep -o 'https://[^[:space:]]*')"
fi

# Post-deployment checks
print_status "Running post-deployment checks..."

# Wait a moment for deployment to be available
sleep 10

# Basic health check
DEPLOYMENT_URL=$(vercel ls quantumvest-enterprise --scope=team 2>/dev/null | head -2 | tail -1 | awk '{print $2}' || echo "")
if [ -n "$DEPLOYMENT_URL" ]; then
    echo "Testing deployment health..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DEPLOYMENT_URL" || echo "000")
    if [ "$HTTP_STATUS" = "200" ]; then
        print_status "Deployment health check passed"
    else
        print_warning "Deployment may have issues (HTTP $HTTP_STATUS)"
    fi
else
    print_warning "Could not determine deployment URL for health check"
fi

print_status "Deployment completed successfully! 🎉"

# Performance recommendations
echo ""
echo "📊 Performance Recommendations:"
echo "- Monitor Core Web Vitals in Vercel Analytics"
echo "- Check bundle size with npm run build:analyze"
echo "- Review Lighthouse scores"
echo "- Monitor error rates in production"

echo ""
echo "🔗 Useful Links:"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Analytics: https://vercel.com/analytics"
echo "- Logs: https://vercel.com/logs"
