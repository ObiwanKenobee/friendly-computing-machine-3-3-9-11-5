#!/bin/sh

# QuantumVest Enterprise Health Check Script
# Used by Docker containers and load balancers

set -e

# Configuration
HOST=${HEALTH_CHECK_HOST:-localhost}
PORT=${HEALTH_CHECK_PORT:-80}
TIMEOUT=${HEALTH_CHECK_TIMEOUT:-3}
ENDPOINT=${HEALTH_CHECK_ENDPOINT:-/api/health}

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Main health check
echo "🏥 Running health check..."

# Check if nginx is running
if ! pgrep nginx > /dev/null; then
    print_error "Nginx is not running"
    exit 1
fi

# Check HTTP response
HTTP_STATUS=$(wget --spider --server-response --timeout=$TIMEOUT "http://$HOST:$PORT$ENDPOINT" 2>&1 | grep "HTTP/" | tail -1 | awk '{print $2}' || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    print_success "Health check passed (HTTP $HTTP_STATUS)"
    exit 0
else
    print_error "Health check failed (HTTP $HTTP_STATUS)"
    exit 1
fi
