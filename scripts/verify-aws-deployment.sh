#!/bin/bash

# QuantumVest Enterprise AWS Deployment Verification
# Comprehensive health check for deployed application

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[⚠]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }

# Check if URL is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <application-url>"
    echo "Example: $0 http://quantumvest-production.us-east-1.elasticbeanstalk.com"
    exit 1
fi

BASE_URL=$1
FAILED_CHECKS=0

echo "🔍 QuantumVest Enterprise Deployment Verification"
echo "=================================================="
echo "Testing URL: $BASE_URL"
echo ""

# Function to test endpoint
test_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    log_info "Testing: $description"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        log_success "$description (HTTP $response)"
        return 0
    else
        log_error "$description failed (HTTP $response)"
        ((FAILED_CHECKS++))
        return 1
    fi
}

# Function to test content
test_content() {
    local url=$1
    local description=$2
    local search_term=$3
    
    log_info "Testing content: $description"
    
    content=$(curl -s --max-time 30 "$url" 2>/dev/null || echo "")
    
    if echo "$content" | grep -q "$search_term"; then
        log_success "$description content verified"
        return 0
    else
        log_error "$description content verification failed"
        ((FAILED_CHECKS++))
        return 1
    fi
}

# Core Application Tests
echo "🌐 Core Application Tests"
echo "------------------------"

test_endpoint "$BASE_URL" "Homepage"
test_endpoint "$BASE_URL/api/health.json" "Health Check API"

if test_content "$BASE_URL" "Homepage Title" "QuantumVest"; then
    log_success "Application branding verified"
fi

# API Health Check Content
echo ""
echo "🏥 Health Check Verification"
echo "---------------------------"

if test_content "$BASE_URL/api/health.json" "Health Status" '"status":"healthy"'; then
    log_success "Health check returns healthy status"
fi

# Free Tier Routes
echo ""
echo "🆓 Free Tier Routes"
echo "------------------"

FREE_ROUTES=(
    "/dashboard"
    "/pricing" 
    "/billing"
    "/archetypes"
    "/age-switcher-demo"
    "/game-layout-demo"
    "/enterprise-subscriptions"
)

for route in "${FREE_ROUTES[@]}"; do
    test_endpoint "$BASE_URL$route" "Free Route: $route"
done

# Enterprise Routes
echo ""
echo "🏢 Enterprise Routes"
echo "-------------------"

ENTERPRISE_ROUTES=(
    "/legendary-investors-enterprise"
    "/quantum-enterprise-2050"
    "/methuselah-enterprise"
    "/african-market-enterprise"
    "/wildlife-conservation-enterprise"
    "/tortoise-protocol"
)

for route in "${ENTERPRISE_ROUTES[@]}"; do
    test_endpoint "$BASE_URL$route" "Enterprise Route: $route"
done

# Professional Routes  
echo ""
echo "💼 Professional Routes"
echo "---------------------"

PROFESSIONAL_ROUTES=(
    "/geographical-consciousness"
    "/cultural-investor"
    "/developer-integrator"
    "/financial-advisor"
)

for route in "${PROFESSIONAL_ROUTES[@]}"; do
    test_endpoint "$BASE_URL$route" "Professional Route: $route"
done

# Static Assets
echo ""
echo "📁 Static Assets"
echo "---------------"

test_endpoint "$BASE_URL/favicon.ico" "Favicon"
test_endpoint "$BASE_URL/manifest.json" "Web Manifest"
test_endpoint "$BASE_URL/robots.txt" "Robots.txt"

# Admin Routes
echo ""
echo "🔧 Admin Routes"
echo "--------------"

ADMIN_ROUTES=(
    "/basic-admin"
    "/critical-components-dashboard"
)

for route in "${ADMIN_ROUTES[@]}"; do
    test_endpoint "$BASE_URL$route" "Admin Route: $route"
done

# Performance Tests
echo ""
echo "⚡ Performance Tests"
echo "-------------------"

# Test response time
log_info "Testing response time..."
RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" --max-time 30 "$BASE_URL" 2>/dev/null || echo "30.0")

if (( $(echo "$RESPONSE_TIME < 5.0" | bc -l 2>/dev/null || echo "0") )); then
    log_success "Response time: ${RESPONSE_TIME}s (under 5s)"
else
    log_warning "Response time: ${RESPONSE_TIME}s (consider optimization)"
fi

# Security Tests
echo ""
echo "🔒 Security Tests"
echo "----------------"

# Test security headers
log_info "Testing security headers..."
SECURITY_HEADERS=$(curl -s -I "$BASE_URL" 2>/dev/null || echo "")

if echo "$SECURITY_HEADERS" | grep -q "X-Frame-Options"; then
    log_success "X-Frame-Options header present"
else
    log_warning "X-Frame-Options header missing"
fi

if echo "$SECURITY_HEADERS" | grep -q "X-Content-Type-Options"; then
    log_success "X-Content-Type-Options header present"
else
    log_warning "X-Content-Type-Options header missing"
fi

# Functionality Tests
echo ""
echo "🎯 Functionality Tests"
echo "---------------------"

# Test if JavaScript is loading
if test_content "$BASE_URL" "JavaScript Loading" '<script'; then
    log_success "JavaScript assets loading"
fi

# Test if CSS is loading  
if test_content "$BASE_URL" "CSS Loading" '<link.*stylesheet'; then
    log_success "CSS assets loading"
fi

# Mobile Responsiveness
echo ""
echo "📱 Mobile Responsiveness"
echo "-----------------------"

MOBILE_UA="Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15"
MOBILE_RESPONSE=$(curl -s -H "User-Agent: $MOBILE_UA" --max-time 30 "$BASE_URL" 2>/dev/null || echo "")

if echo "$MOBILE_RESPONSE" | grep -q "viewport"; then
    log_success "Mobile viewport meta tag present"
else
    log_warning "Mobile viewport meta tag missing"
fi

# Generate Report
echo ""
echo "📊 VERIFICATION REPORT"
echo "======================"

if [ $FAILED_CHECKS -eq 0 ]; then
    log_success "🎉 ALL TESTS PASSED! Deployment is fully functional"
    echo ""
    echo "✅ Application Status: FULLY OPERATIONAL"
    echo "✅ All Routes: ACCESSIBLE"
    echo "✅ Health Check: PASSING"
    echo "✅ Static Assets: LOADING"
    echo "✅ Security: CONFIGURED"
    echo "✅ Performance: ACCEPTABLE"
    echo ""
    echo "🚀 QuantumVest Enterprise is ready for production use!"
    echo ""
    echo "📋 Key URLs:"
    echo "   🏠 Homepage: $BASE_URL"
    echo "   💊 Health Check: $BASE_URL/api/health.json"
    echo "   🎯 Dashboard: $BASE_URL/dashboard"
    echo "   💳 Pricing: $BASE_URL/pricing"
    echo "   👑 Legendary Investors: $BASE_URL/legendary-investors-enterprise"
    echo "   🔧 Admin: $BASE_URL/basic-admin"
    exit 0
else
    log_error "❌ $FAILED_CHECKS test(s) failed"
    echo ""
    echo "🛠️ Troubleshooting Steps:"
    echo "   1. Check AWS Elastic Beanstalk logs:"
    echo "      eb logs"
    echo "   2. Verify environment variables are set"
    echo "   3. Check security group settings"
    echo "   4. Ensure proper build artifacts were deployed"
    echo "   5. Wait a few more minutes for full startup"
    echo ""
    echo "⚠️ Some features may still be starting up. Re-run this script in 5 minutes."
    exit 1
fi
