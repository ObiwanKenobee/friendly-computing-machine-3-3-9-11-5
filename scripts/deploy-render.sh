#!/bin/bash

# QuantumVest Enterprise - OnRender Deployment Script
# Automated deployment with comprehensive checks

set -e  # Exit on any error

echo "🚀 Starting QuantumVest Enterprise deployment to OnRender..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

# Check for render.yaml
if [ ! -f "render.yaml" ]; then
    print_error "render.yaml not found. This file is required for OnRender deployment."
    exit 1
fi

print_status "Running pre-deployment checks..."

# Environment setup
if [ ! -f ".env.production" ]; then
    print_warning "No .env.production found. Creating from template..."
    cp .env.example .env.production
    echo "Please update .env.production with your production values"
fi

# Dependency check
print_info "Checking dependencies..."
npm ci --only=production --silent
if [ $? -ne 0 ]; then
    print_error "Failed to install production dependencies"
    exit 1
fi
print_status "Dependencies installed successfully"

# TypeScript check
print_info "Checking TypeScript..."
npm run typecheck
if [ $? -ne 0 ]; then
    print_error "TypeScript check failed"
    exit 1
fi
print_status "TypeScript check passed"

# Security audit
print_info "Running security audit..."
npm audit --audit-level high --only=prod
if [ $? -ne 0 ]; then
    print_warning "Security vulnerabilities found in production dependencies"
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled"
        exit 1
    fi
fi

# Build test
print_info "Testing production build..."
NODE_ENV=production GENERATE_SOURCEMAP=false npm run build:production
if [ $? -ne 0 ]; then
    print_error "Production build failed"
    exit 1
fi
print_status "Production build successful"

# Test production server locally
print_info "Testing production server..."
npm run start:production &
SERVER_PID=$!
sleep 5

# Test if server is responding
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080" || echo "000")
kill $SERVER_PID 2>/dev/null || true

if [ "$HTTP_STATUS" = "200" ]; then
    print_status "Production server test passed"
else
    print_error "Production server test failed (HTTP $HTTP_STATUS)"
    exit 1
fi

# Clean up build artifacts for fresh deployment
print_status "Cleaning up for deployment..."
rm -rf node_modules/.cache/
rm -rf dist/

print_status "✨ Pre-deployment checks completed successfully!"

echo ""
print_info "📋 OnRender Deployment Checklist:"
echo "1. ✅ render.yaml configuration file present"
echo "2. ✅ TypeScript compilation successful"
echo "3. ✅ Production build working"
echo "4. ✅ Production server test passed"
echo "5. ✅ Security audit completed"

echo ""
print_info "🔧 Next Steps:"
echo "1. Commit your changes to your main branch"
echo "2. Push to your GitHub repository"
echo "3. Connect your repository to OnRender"
echo "4. OnRender will automatically deploy using render.yaml"

echo ""
print_info "📝 OnRender Setup Instructions:"
echo "1. Go to https://dashboard.render.com/"
echo "2. Click 'New' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. OnRender will detect render.yaml automatically"
echo "5. Set up environment variables in OnRender dashboard"

echo ""
print_info "🌍 Required Environment Variables for OnRender:"
echo "- NODE_ENV=production"
echo "- GENERATE_SOURCEMAP=false"
echo "- VITE_APP_NAME=QuantumVest Enterprise"
echo "- VITE_APP_ENV=production"
echo "- PORT=8080"
echo "- Add your custom environment variables from .env.example"

echo ""
print_info "⚙️  OnRender Configuration Summary:"
echo "- Build Command: npm run build:production"
echo "- Start Command: npm run start:production"
echo "- Node Version: 18.x"
echo "- Health Check: /api/health"
echo "- Auto-Deploy: Enabled on main branch"

echo ""
print_warning "🔒 Security Reminders:"
echo "- Never commit sensitive environment variables to git"
echo "- Set up environment variables in OnRender dashboard"
echo "- Enable HTTPS redirect in OnRender settings"
echo "- Configure custom domain if needed"

echo ""
print_status "🎉 Ready for OnRender deployment!"
print_info "Push your changes to trigger automatic deployment"

# Git status check
if git status --porcelain | grep -q .; then
    print_warning "You have uncommitted changes. Consider committing them:"
    git status --short
fi
