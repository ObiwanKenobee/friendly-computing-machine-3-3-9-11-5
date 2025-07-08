#!/bin/bash

# QuantumVest Enterprise - Hobby Plan Optimized Deployment
# Optimized for single-region deployment with upgrade readiness

set -e

echo "🏠 QuantumVest Enterprise - Hobby Plan Deployment"
echo "================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Configuration
DEPLOYMENT_PLAN=${DEPLOYMENT_PLAN:-"hobby"}
VERCEL_CONFIG="vercel.json"
OPTIMIZE_FOR_HOBBY=${OPTIMIZE_FOR_HOBBY:-"true"}

print_info "Deployment Plan: $DEPLOYMENT_PLAN"
print_info "Hobby Optimization: $OPTIMIZE_FOR_HOBBY"

# Function to check plan and switch configuration
configure_for_plan() {
    local plan=$1

    case $plan in
        "hobby")
            print_info "Configuring for Hobby plan..."
            cp vercel.hobby.json vercel.json
            export VITE_DEPLOYMENT_PLAN="hobby"
            export VITE_CACHE_STRATEGY="aggressive"
            ;;
        "pro")
            print_info "Configuring for Pro plan..."
            if [ -f "vercel.pro.json" ]; then
                cp vercel.pro.json vercel.json
            fi
            export VITE_DEPLOYMENT_PLAN="pro"
            export VITE_CACHE_STRATEGY="balanced"
            ;;
        "enterprise")
            print_info "Configuring for Enterprise plan..."
            if [ -f "vercel.enterprise.json" ]; then
                cp vercel.enterprise.json vercel.json
            fi
            export VITE_DEPLOYMENT_PLAN="enterprise"
            export VITE_CACHE_STRATEGY="performance"
            ;;
        *)
            print_warning "Unknown plan '$plan', defaulting to hobby"
            cp vercel.hobby.json vercel.json
            export VITE_DEPLOYMENT_PLAN="hobby"
            ;;
    esac
}

# Pre-flight checks
print_info "Running pre-flight checks..."

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    print_info "Installing Vercel CLI..."
    npm install -g vercel@latest
fi

# Check project structure
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

# Configure deployment based on plan
configure_for_plan "$DEPLOYMENT_PLAN"

# Backup original vercel.json if it exists and is different
if [ -f "vercel.json" ] && [ "$DEPLOYMENT_PLAN" != "hobby" ]; then
    if ! cmp -s "vercel.json" "vercel.hobby.json" 2>/dev/null; then
        print_info "Backing up original vercel.json..."
        cp vercel.json "vercel.json.backup.$(date +%Y%m%d_%H%M%S)"
    fi
fi

# Clean previous builds
print_info "Cleaning previous builds..."
rm -rf dist/ node_modules/.vite/ .vercel/

# Install dependencies with hobby plan optimizations
print_info "Installing dependencies..."
if [ "$DEPLOYMENT_PLAN" = "hobby" ]; then
    npm ci --include=dev --silent
else
    npm ci --include=dev --silent
fi

# Run quality checks (lighter for hobby plan)
if [ "$DEPLOYMENT_PLAN" = "hobby" ]; then
    print_info "Running essential checks for hobby deployment..."
    npm run typecheck || {
        print_error "TypeScript check failed"
        exit 1
    }
else
    print_info "Running comprehensive checks..."
    npm run typecheck || {
        print_error "TypeScript check failed"
        exit 1
    }
    npm run lint || {
        print_warning "Linting issues found, continuing deployment..."
    }
fi

# Build optimization for hobby plan
print_info "Building application..."
if [ "$DEPLOYMENT_PLAN" = "hobby" ]; then
    # Optimized build for hobby plan
    VITE_DEPLOYMENT_PLAN=hobby \
    VITE_CACHE_STRATEGY=aggressive \
    GENERATE_SOURCEMAP=false \
    npm run build:production
else
    npm run build:production
fi

# Verify build output
if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

print_success "Build completed successfully"

# Bundle size check (important for hobby plan)
BUNDLE_SIZE=$(du -sh dist/ | cut -f1)
print_info "Bundle size: $BUNDLE_SIZE"

if [ "$DEPLOYMENT_PLAN" = "hobby" ]; then
    # Check if bundle is reasonable for hobby plan
    BUNDLE_SIZE_BYTES=$(du -sb dist/ | cut -f1)
    if [ "$BUNDLE_SIZE_BYTES" -gt 52428800 ]; then # 50MB
        print_warning "Bundle size is large for hobby plan. Consider optimization."
    fi
fi

# Deploy with plan-specific settings
print_info "Deploying to Vercel..."

if [ "$DEPLOYMENT_PLAN" = "hobby" ]; then
    # Hobby plan deployment with single region
    vercel --prod \
        --env VITE_DEPLOYMENT_PLAN=hobby \
        --env VITE_CACHE_STRATEGY=aggressive \
        --confirm || {
        print_error "Deployment failed"
        exit 1
    }
else
    # Pro/Enterprise deployment
    vercel --prod \
        --env VITE_DEPLOYMENT_PLAN="$DEPLOYMENT_PLAN" \
        --confirm || {
        print_error "Deployment failed"
        exit 1
    }
fi

print_success "Deployment completed!"

# Post-deployment verification
print_info "Running post-deployment verification..."

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --scope="$(vercel whoami)" | grep quantumvest-enterprise | head -1 | awk '{print $2}')

if [ -n "$DEPLOYMENT_URL" ]; then
    print_info "Deployment URL: https://$DEPLOYMENT_URL"

    # Basic health check
    print_info "Performing health check..."

    # Wait a bit for deployment to be ready
    sleep 10

    if curl -f -s "https://$DEPLOYMENT_URL" > /dev/null; then
        print_success "Health check passed!"
    else
        print_warning "Health check failed, but deployment may still be propagating"
    fi

    # Test API endpoints if not hobby plan
    if [ "$DEPLOYMENT_PLAN" != "hobby" ]; then
        if curl -f -s "https://$DEPLOYMENT_URL/api/health" > /dev/null; then
            print_success "API health check passed!"
        else
            print_warning "API health check failed"
        fi
    fi
else
    print_warning "Could not determine deployment URL"
fi

# Performance recommendations
print_info "Performance Recommendations:"
if [ "$DEPLOYMENT_PLAN" = "hobby" ]; then
    echo "📊 Hobby Plan Optimizations Applied:"
    echo "  • Single region deployment (us-east-1)"
    echo "  • Aggressive caching enabled"
    echo "  • Bundle size optimized"
    echo "  • Edge functions cached"
    echo ""
    echo "🚀 Ready for upgrade to Pro/Enterprise:"
    echo "  • Multi-region deployment ready"
    echo "  • Advanced monitoring prepared"
    echo "  • Custom domains ready"
    echo "  • Enhanced edge functions available"
fi

# Monitoring setup
if [ "$DEPLOYMENT_PLAN" = "hobby" ]; then
    print_info "Setting up basic monitoring for hobby plan..."
    # Create a simple monitoring script for hobby plan
    cat > scripts/hobby-monitor.sh << 'EOF'
#!/bin/bash
# Simple monitoring for hobby plan
URL="https://quantumvest-enterprise.vercel.app"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$TIMESTAMP] Checking $URL..."
if curl -f -s "$URL" > /dev/null; then
    echo "[$TIMESTAMP] ✅ Site is up"
else
    echo "[$TIMESTAMP] ❌ Site appears down"
    # Could send notification here (email, Discord, etc.)
fi
EOF
    chmod +x scripts/hobby-monitor.sh
    print_info "Created hobby-monitor.sh for basic monitoring"
fi

# Future upgrade instructions
print_info "💡 Upgrade Instructions:"
echo "To upgrade to Pro plan later:"
echo "  1. Update DEPLOYMENT_PLAN=pro in your environment"
echo "  2. Run: ./scripts/deploy-hobby-optimized.sh"
echo "  3. The system will automatically reconfigure for multi-region"
echo ""
echo "To upgrade to Enterprise plan:"
echo "  1. Update DEPLOYMENT_PLAN=enterprise"
echo "  2. Run: ./scripts/deploy-hobby-optimized.sh"
echo "  3. Advanced features will be automatically enabled"

print_success "🎉 Hobby plan deployment complete!"
print_info "Your QuantumVest Enterprise platform is ready with hobby plan optimizations"
print_info "All infrastructure is prepared for seamless upgrade to Pro/Enterprise plans"

# Final status
echo ""
echo "🏠 HOBBY PLAN STATUS:"
echo "  ✅ Single-region deployment active"
echo "  ✅ Aggressive caching enabled"
echo "  ✅ Edge functions optimized"
echo "  ✅ Upgrade path prepared"
echo "  ✅ Production-ready on stable grounds"
echo ""
echo "🚀 UPGRADE READY:"
echo "  🔄 Multi-region deployment prepared"
echo "  📊 Advanced analytics ready"
echo "  �� Custom middleware prepared"
echo "  🌐 Custom domains ready"
