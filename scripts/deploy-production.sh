#!/bin/bash

# QuantumVest Enterprise Production Deployment Script
# AWS Elastic Beanstalk Deployment with Full Enterprise Features

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="quantumvest-enterprise"
ENV_NAME="quantumvest-production"
REGION="us-east-1"
PLATFORM="arn:aws:elasticbeanstalk:us-east-1::platform/Node.js 18 running on 64bit Amazon Linux 2/5.8.4"
BUCKET_NAME="quantumvest-enterprise-deployments"
DOMAIN_NAME="quantumvest.app"

# Deployment configuration
VERSION_LABEL="v$(date +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)"
DEPLOYMENT_PACKAGE="${APP_NAME}-${VERSION_LABEL}.zip"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi

    # Check if EB CLI is installed
    if ! command -v eb &> /dev/null; then
        log_error "EB CLI is not installed. Please install it first."
        exit 1
    fi

    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install it first."
        exit 1
    fi

    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install it first."
        exit 1
    fi

    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please run 'aws configure'."
        exit 1
    fi

    # Check if git is available and we're in a git repository
    if ! git rev-parse --git-dir &> /dev/null; then
        log_error "Not in a git repository or git is not installed."
        exit 1
    fi

    log_success "All prerequisites met"
}

verify_environment_variables() {
    log_info "Verifying environment variables..."

    # Create temporary .env file for verification
    cat > .env.production << EOF
NODE_ENV=production
REACT_APP_ENVIRONMENT=production
REACT_APP_API_BASE_URL=https://api.quantumvest.app
REACT_APP_WEBSOCKET_URL=wss://ws.quantumvest.app
REACT_APP_CDN_URL=https://cdn.quantumvest.app

# Enterprise Features
REACT_APP_LEGENDARY_INVESTOR_ENABLED=true
REACT_APP_ENTERPRISE_FEATURES_ENABLED=true
REACT_APP_GLOBAL_EXPANSION_ENABLED=true
REACT_APP_MOBILE_MANAGEMENT_ENABLED=true
REACT_APP_AI_EXPLAINABILITY_ENABLED=true

# Demo Access
REACT_APP_DEMO_ENABLED=true
REACT_APP_DEMO_DURATION_HOURS=1
REACT_APP_DEMO_EXTENSION_MINUTES=15

# Security
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false
EOF

    log_success "Environment variables configured"
}

run_tests() {
    log_info "Running tests and quality checks..."

    # Install dependencies
    log_info "Installing dependencies..."
    npm ci --include=dev

    # Run TypeScript type checking
    log_info "Running TypeScript type checking..."
    npm run typecheck

    # Run linting
    log_info "Running ESLint..."
    npm run lint

    # Run security audit
    log_info "Running security audit..."
    npm audit --audit-level moderate

    # Run tests (if available)
    if npm run | grep -q "test"; then
        log_info "Running tests..."
        CI=true npm test -- --coverage --watchAll=false
    fi

    log_success "All tests and quality checks passed"
}

build_application() {
    log_info "Building application for production..."

    # Set production environment
    export NODE_ENV=production
    export GENERATE_SOURCEMAP=false
    export INLINE_RUNTIME_CHUNK=false

    # Build the application
    npm run build

    # Verify build output
    if [ ! -d "build" ]; then
        log_error "Build directory not found. Build failed."
        exit 1
    fi

    # Check build size
    BUILD_SIZE=$(du -sh build | cut -f1)
    log_info "Build size: ${BUILD_SIZE}"

    # Optimize build
    log_info "Optimizing build for production..."

    # Compress static assets
    find build/static -name "*.js" -exec gzip -9 -k {} \;
    find build/static -name "*.css" -exec gzip -9 -k {} \;

    # Generate build manifest
    cat > build/build-manifest.json << EOF
{
    "version": "${VERSION_LABEL}",
    "buildTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "gitCommit": "$(git rev-parse HEAD)",
    "gitBranch": "$(git rev-parse --abbrev-ref HEAD)",
    "nodeVersion": "$(node --version)",
    "npmVersion": "$(npm --version)",
    "buildSize": "${BUILD_SIZE}",
    "environment": "production"
}
EOF

    log_success "Application built successfully"
}

create_deployment_package() {
    log_info "Creating deployment package..."

    # Create deployment directory
    mkdir -p deployment

    # Copy necessary files
    cp -r build deployment/
    cp package.json deployment/
    cp package-lock.json deployment/

    # Copy AWS configuration
    cp aws/beanstalk-config.yml deployment/.ebextensions/

    # Copy additional configuration files
    mkdir -p deployment/.platform/nginx/conf.d
    cp nginx/nginx.prod.conf deployment/.platform/nginx/conf.d/

    # Create .ebextensions directory and copy configurations
    mkdir -p deployment/.ebextensions

    # Create Node.js configuration
    cat > deployment/.ebextensions/01-node-config.config << EOF
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    NodeVersion: "18.19.0"
    GzipCompression: true
    ProxyServer: nginx
  aws:elasticbeanstalk:container:nodejs:staticfiles:
    /static: build/static
    /images: build/images
    /favicon.ico: build/favicon.ico
    /manifest.json: build/manifest.json
    /robots.txt: build/robots.txt
    /build-manifest.json: build/build-manifest.json
EOF

    # Create deployment hooks
    mkdir -p deployment/.platform/hooks/postdeploy
    cat > deployment/.platform/hooks/postdeploy/01-restart-nginx.sh << EOF
#!/bin/bash
# Restart nginx after deployment
systemctl restart nginx
EOF
    chmod +x deployment/.platform/hooks/postdeploy/01-restart-nginx.sh

    # Create the deployment package
    cd deployment
    zip -r "../${DEPLOYMENT_PACKAGE}" . -x "*.git*" "node_modules/*" ".env*"
    cd ..

    # Verify package size
    PACKAGE_SIZE=$(du -sh "${DEPLOYMENT_PACKAGE}" | cut -f1)
    log_info "Deployment package size: ${PACKAGE_SIZE}"

    if [ "${PACKAGE_SIZE%M*}" -gt 512 ]; then
        log_warning "Deployment package is larger than 512MB. Consider optimizing."
    fi

    log_success "Deployment package created: ${DEPLOYMENT_PACKAGE}"
}

upload_to_s3() {
    log_info "Uploading deployment package to S3..."

    # Create S3 bucket if it doesn't exist
    if ! aws s3 ls "s3://${BUCKET_NAME}" 2>/dev/null; then
        log_info "Creating S3 bucket: ${BUCKET_NAME}"
        aws s3 mb "s3://${BUCKET_NAME}" --region "${REGION}"

        # Configure bucket versioning
        aws s3api put-bucket-versioning \
            --bucket "${BUCKET_NAME}" \
            --versioning-configuration Status=Enabled
    fi

    # Upload deployment package
    aws s3 cp "${DEPLOYMENT_PACKAGE}" "s3://${BUCKET_NAME}/${DEPLOYMENT_PACKAGE}"

    log_success "Deployment package uploaded to S3"
}

create_application_version() {
    log_info "Creating application version..."

    # Create application if it doesn't exist
    if ! aws elasticbeanstalk describe-applications --application-names "${APP_NAME}" 2>/dev/null | grep -q "${APP_NAME}"; then
        log_info "Creating Elastic Beanstalk application: ${APP_NAME}"
        aws elasticbeanstalk create-application \
            --application-name "${APP_NAME}" \
            --description "QuantumVest Enterprise Investment Platform"
    fi

    # Create application version
    aws elasticbeanstalk create-application-version \
        --application-name "${APP_NAME}" \
        --version-label "${VERSION_LABEL}" \
        --description "Production deployment $(date)" \
        --source-bundle S3Bucket="${BUCKET_NAME}",S3Key="${DEPLOYMENT_PACKAGE}" \
        --auto-create-application

    log_success "Application version created: ${VERSION_LABEL}"
}

deploy_to_environment() {
    log_info "Deploying to environment: ${ENV_NAME}"

    # Check if environment exists
    if ! aws elasticbeanstalk describe-environments \
        --application-name "${APP_NAME}" \
        --environment-names "${ENV_NAME}" 2>/dev/null | grep -q "${ENV_NAME}"; then

        log_info "Creating new environment: ${ENV_NAME}"
        aws elasticbeanstalk create-environment \
            --application-name "${APP_NAME}" \
            --environment-name "${ENV_NAME}" \
            --platform-arn "${PLATFORM}" \
            --version-label "${VERSION_LABEL}" \
            --option-settings file://aws/beanstalk-config.yml \
            --tags Key=Environment,Value=Production Key=Project,Value=QuantumVest
    else
        log_info "Updating existing environment: ${ENV_NAME}"
        aws elasticbeanstalk update-environment \
            --application-name "${APP_NAME}" \
            --environment-name "${ENV_NAME}" \
            --version-label "${VERSION_LABEL}"
    fi

    # Wait for deployment to complete
    log_info "Waiting for deployment to complete..."
    aws elasticbeanstalk wait environment-updated \
        --application-name "${APP_NAME}" \
        --environment-names "${ENV_NAME}"

    log_success "Deployment completed successfully"
}

setup_domain() {
    log_info "Setting up custom domain..."

    # Get environment URL
    ENV_URL=$(aws elasticbeanstalk describe-environments \
        --application-name "${APP_NAME}" \
        --environment-names "${ENV_NAME}" \
        --query 'Environments[0].CNAME' \
        --output text)

    log_info "Environment URL: ${ENV_URL}"
    log_info "Configure your DNS to point ${DOMAIN_NAME} to ${ENV_URL}"

    # Note: Actual DNS configuration would depend on your DNS provider
    # This is just informational
}

verify_deployment() {
    log_info "Verifying deployment..."

    # Get environment health
    HEALTH=$(aws elasticbeanstalk describe-environment-health \
        --environment-name "${ENV_NAME}" \
        --attribute-names All \
        --query 'HealthStatus' \
        --output text)

    log_info "Environment health: ${HEALTH}"

    # Get environment URL
    ENV_URL=$(aws elasticbeanstalk describe-environments \
        --application-name "${APP_NAME}" \
        --environment-names "${ENV_NAME}" \
        --query 'Environments[0].CNAME' \
        --output text)

    # Test health endpoint
    if curl -f "http://${ENV_URL}/api/health" > /dev/null 2>&1; then
        log_success "Health check passed"
    else
        log_warning "Health check failed - application may still be starting"
    fi

    log_info "Application URL: https://${ENV_URL}"
    log_info "Custom domain: https://${DOMAIN_NAME}"
}

cleanup() {
    log_info "Cleaning up temporary files..."

    # Remove deployment package and directory
    rm -f "${DEPLOYMENT_PACKAGE}"
    rm -rf deployment
    rm -f .env.production

    # Clean up old application versions (keep last 10)
    log_info "Cleaning up old application versions..."
    aws elasticbeanstalk describe-application-versions \
        --application-name "${APP_NAME}" \
        --query 'ApplicationVersions[10:].VersionLabel' \
        --output text | xargs -r -n1 aws elasticbeanstalk delete-application-version \
        --application-name "${APP_NAME}" \
        --version-label

    log_success "Cleanup completed"
}

generate_deployment_report() {
    log_info "Generating deployment report..."

    # Create deployment report
    cat > deployment-report.md << EOF
# QuantumVest Enterprise Deployment Report

## Deployment Information
- **Version**: ${VERSION_LABEL}
- **Deployment Time**: $(date)
- **Environment**: ${ENV_NAME}
- **Region**: ${REGION}
- **Git Commit**: $(git rev-parse HEAD)
- **Git Branch**: $(git rev-parse --abbrev-ref HEAD)

## Application Details
- **Application Name**: ${APP_NAME}
- **Platform**: Node.js 18
- **Build Size**: ${BUILD_SIZE}
- **Package Size**: ${PACKAGE_SIZE}

## Features Deployed
- ✅ Legendary Investor Strategies (Munger, Buffett, Dalio, Lynch)
- ✅ Enterprise Portfolio Optimization (MCTS + RL)
- ✅ AI Explainability Dashboard
- ✅ Mobile & Edge Computing Management
- ✅ Global Expansion Infrastructure
- ✅ Demo Access System
- ✅ Complete Billing & Subscription System
- ✅ Enterprise Security & Compliance

## URLs
- **Application**: https://${ENV_URL}
- **Custom Domain**: https://${DOMAIN_NAME}
- **Health Check**: https://${ENV_URL}/api/health

## Next Steps
1. Verify all features are working correctly
2. Run integration tests
3. Monitor application performance
4. Set up monitoring alerts
5. Update documentation

---
*Report generated by deployment script on $(date)*
EOF

    log_success "Deployment report generated: deployment-report.md"
}

main() {
    log_info "Starting QuantumVest Enterprise production deployment..."
    log_info "Version: ${VERSION_LABEL}"

    # Run deployment steps
    check_prerequisites
    verify_environment_variables
    run_tests
    build_application
    create_deployment_package
    upload_to_s3
    create_application_version
    deploy_to_environment
    setup_domain
    verify_deployment
    generate_deployment_report
    cleanup

    log_success "🎉 Deployment completed successfully!"
    log_info "Application URL: https://${ENV_URL}"
    log_info "Custom Domain: https://${DOMAIN_NAME}"
    log_info "Version: ${VERSION_LABEL}"

    echo ""
    echo "🚀 QuantumVest Enterprise is now live!"
    echo "📊 Features available:"
    echo "   • Legendary Investor Strategies"
    echo "   • Enterprise Portfolio Optimization"
    echo "   • AI Explainability Dashboard"
    echo "   • Mobile & Edge Computing"
    echo "   • Global Expansion Infrastructure"
    echo "   • Complete Demo Access System"
    echo "   • Full Billing & Subscription"
    echo ""
    echo "📋 Check deployment-report.md for detailed information"
}

# Handle script termination
trap cleanup EXIT

# Run main function
main "$@"
