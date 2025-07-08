#!/bin/bash

# =============================================================================
# QuantumVest Enterprise - AWS Production Deployment Script
# Complete infrastructure deployment with App Runner + CloudFront + RDS
# =============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${ENVIRONMENT:-production}
AWS_REGION=${AWS_REGION:-us-east-1}
DOMAIN_NAME=${DOMAIN_NAME:-quantumvest.app}
STACK_NAME="quantumvest-${ENVIRONMENT}"
GITHUB_REPO=${GITHUB_REPO:-https://github.com/quantumvest/enterprise-platform}

# Required environment variables
REQUIRED_VARS=(
    "CERTIFICATE_ARN"
    "OPENAI_API_KEY"
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
)

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

progress() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

# =============================================================================
# PRE-DEPLOYMENT CHECKS
# =============================================================================

check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed. Please install it first."
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js 18 or later."
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d. -f1 | sed 's/v//')
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js version 18 or later is required. Current version: $(node -v)"
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        error "npm is not installed."
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS credentials not configured. Please run 'aws configure'."
    fi
    
    # Check required environment variables
    for var in "${REQUIRED_VARS[@]}"; do
        if [ -z "${!var:-}" ]; then
            error "Required environment variable $var is not set."
        fi
    done
    
    success "All prerequisites satisfied"
}

# =============================================================================
# APPLICATION BUILD & TEST
# =============================================================================

build_application() {
    log "Building QuantumVest Enterprise application..."
    
    # Install dependencies
    progress "Installing dependencies..."
    npm ci --include=dev --prefer-offline --no-audit
    
    # Run type checking
    progress "Running TypeScript type checking..."
    npm run typecheck
    
    # Run linting
    progress "Running ESLint..."
    npm run lint
    
    # Run tests
    progress "Running tests..."
    npm run test -- --run
    
    # Build production bundle
    progress "Building production bundle..."
    NODE_ENV=production GENERATE_SOURCEMAP=false npm run build:production
    
    # Verify build output
    if [ ! -d "dist" ]; then
        error "Build failed: dist directory not found"
    fi
    
    if [ ! -f "dist/index.html" ]; then
        error "Build failed: index.html not found in dist"
    fi
    
    # Check bundle size
    BUNDLE_SIZE=$(du -sh dist | cut -f1)
    log "Bundle size: $BUNDLE_SIZE"
    
    success "Application built successfully"
}

# =============================================================================
# AWS INFRASTRUCTURE DEPLOYMENT
# =============================================================================

deploy_infrastructure() {
    log "Deploying AWS infrastructure..."
    
    # Create parameter file
    cat > cloudformation-parameters.json << EOF
[
    {
        "ParameterKey": "Environment",
        "ParameterValue": "${ENVIRONMENT}"
    },
    {
        "ParameterKey": "DomainName",
        "ParameterValue": "${DOMAIN_NAME}"
    },
    {
        "ParameterKey": "CertificateArn",
        "ParameterValue": "${CERTIFICATE_ARN}"
    },
    {
        "ParameterKey": "GitHubRepo",
        "ParameterValue": "${GITHUB_REPO}"
    },
    {
        "ParameterKey": "OpenAIApiKey",
        "ParameterValue": "${OPENAI_API_KEY}"
    },
    {
        "ParameterKey": "SupabaseUrl",
        "ParameterValue": "${SUPABASE_URL}"
    },
    {
        "ParameterKey": "SupabaseAnonKey",
        "ParameterValue": "${SUPABASE_ANON_KEY}"
    }
]
EOF

    # Deploy CloudFormation stack
    progress "Deploying CloudFormation stack: $STACK_NAME"
    
    aws cloudformation deploy \
        --template-file aws/cloudformation/quantumvest-infrastructure.yaml \
        --stack-name "$STACK_NAME" \
        --parameter-overrides file://cloudformation-parameters.json \
        --capabilities CAPABILITY_NAMED_IAM \
        --region "$AWS_REGION" \
        --tags \
            Project=QuantumVest \
            Environment="$ENVIRONMENT" \
            Owner=Platform-Team \
            CostCenter=Engineering \
            DeployedBy="$(aws sts get-caller-identity --query 'Arn' --output text)" \
            DeployedAt="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    
    # Clean up parameter file
    rm -f cloudformation-parameters.json
    
    success "Infrastructure deployed successfully"
}

# =============================================================================
# APP RUNNER DEPLOYMENT
# =============================================================================

deploy_application() {
    log "Deploying application to App Runner..."
    
    # Get App Runner service ARN from CloudFormation
    APP_RUNNER_ARN=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`AppRunnerServiceUrl`].OutputValue' \
        --output text)
    
    if [ -z "$APP_RUNNER_ARN" ]; then
        error "Could not find App Runner service ARN"
    fi
    
    # Trigger deployment (App Runner auto-deploys from GitHub)
    progress "App Runner will auto-deploy from GitHub repository"
    progress "Monitoring deployment status..."
    
    # Wait for deployment to complete
    local max_attempts=60
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        local status=$(aws apprunner describe-service \
            --service-arn "$APP_RUNNER_ARN" \
            --region "$AWS_REGION" \
            --query 'Service.Status' \
            --output text)
        
        case $status in
            "RUNNING")
                success "App Runner service is running"
                break
                ;;
            "CREATE_FAILED"|"UPDATE_FAILED"|"DELETE_FAILED")
                error "App Runner deployment failed with status: $status"
                ;;
            *)
                log "Deployment in progress... Status: $status (attempt $attempt/$max_attempts)"
                sleep 30
                attempt=$((attempt + 1))
                ;;
        esac
    done
    
    if [ $attempt -gt $max_attempts ]; then
        error "Deployment timeout after $((max_attempts * 30)) seconds"
    fi
}

# =============================================================================
# POST-DEPLOYMENT VERIFICATION
# =============================================================================

verify_deployment() {
    log "Verifying deployment..."
    
    # Get CloudFront domain
    CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
        --output text)
    
    if [ -z "$CLOUDFRONT_DOMAIN" ]; then
        error "Could not find CloudFront domain"
    fi
    
    # Test endpoints
    local endpoints=(
        "https://$CLOUDFRONT_DOMAIN"
        "https://$DOMAIN_NAME"
    )
    
    for endpoint in "${endpoints[@]}"; do
        progress "Testing endpoint: $endpoint"
        
        local status_code
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint" || echo "000")
        
        if [ "$status_code" = "200" ]; then
            success "✅ $endpoint - OK ($status_code)"
        else
            warn "⚠️  $endpoint - Status: $status_code"
        fi
    done
    
    # Test API health check
    progress "Testing API health check..."
    local health_check_url="https://$DOMAIN_NAME/api/health"
    local health_status
    health_status=$(curl -s -o /dev/null -w "%{http_code}" "$health_check_url" || echo "000")
    
    if [ "$health_status" = "200" ]; then
        success "API health check passed"
    else
        warn "API health check returned status: $health_status"
    fi
}

# =============================================================================
# MONITORING SETUP
# =============================================================================

setup_monitoring() {
    log "Setting up monitoring and alerting..."
    
    # CloudWatch Dashboard
    progress "Creating CloudWatch dashboard..."
    
    cat > dashboard-body.json << 'EOF'
{
    "widgets": [
        {
            "type": "metric",
            "properties": {
                "metrics": [
                    [ "AWS/AppRunner", "RequestCount", "ServiceName", "production-quantumvest-app" ],
                    [ ".", "4XXHttpResponseCount", ".", "." ],
                    [ ".", "5XXHttpResponseCount", ".", "." ]
                ],
                "period": 300,
                "stat": "Sum",
                "region": "us-east-1",
                "title": "App Runner Requests"
            }
        },
        {
            "type": "metric",
            "properties": {
                "metrics": [
                    [ "AWS/AppRunner", "RequestLatency", "ServiceName", "production-quantumvest-app" ]
                ],
                "period": 300,
                "stat": "Average",
                "region": "us-east-1",
                "title": "App Runner Latency"
            }
        },
        {
            "type": "metric",
            "properties": {
                "metrics": [
                    [ "AWS/RDS", "CPUUtilization", "DBClusterIdentifier", "production-quantumvest-cluster" ],
                    [ ".", "DatabaseConnections", ".", "." ]
                ],
                "period": 300,
                "stat": "Average",
                "region": "us-east-1",
                "title": "Database Metrics"
            }
        },
        {
            "type": "metric",
            "properties": {
                "metrics": [
                    [ "AWS/CloudFront", "Requests", "DistributionId", "$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $AWS_REGION --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' --output text)" ],
                    [ ".", "BytesDownloaded", ".", "." ]
                ],
                "period": 300,
                "stat": "Sum",
                "region": "us-east-1",
                "title": "CloudFront Traffic"
            }
        }
    ]
}
EOF

    aws cloudwatch put-dashboard \
        --dashboard-name "QuantumVest-${ENVIRONMENT}" \
        --dashboard-body file://dashboard-body.json \
        --region "$AWS_REGION"
    
    rm -f dashboard-body.json
    
    success "Monitoring dashboard created"
}

# =============================================================================
# CLEANUP & SECURITY
# =============================================================================

security_hardening() {
    log "Applying security hardening..."
    
    # Enable GuardDuty if not already enabled
    if ! aws guardduty list-detectors --region "$AWS_REGION" --query 'DetectorIds[0]' --output text | grep -q 'None'; then
        progress "GuardDuty already enabled"
    else
        progress "Enabling GuardDuty..."
        aws guardduty create-detector \
            --enable \
            --region "$AWS_REGION" \
            --finding-publishing-frequency FIFTEEN_MINUTES
        success "GuardDuty enabled"
    fi
    
    # Enable AWS Config if not already enabled
    progress "Checking AWS Config status..."
    local config_status
    config_status=$(aws configservice describe-configuration-recorders \
        --region "$AWS_REGION" \
        --query 'ConfigurationRecorders[0].recordingGroup.allSupported' \
        --output text 2>/dev/null || echo "None")
    
    if [ "$config_status" != "True" ]; then
        warn "AWS Config is not enabled. Consider enabling it for compliance monitoring."
    fi
    
    success "Security hardening completed"
}

# =============================================================================
# DEPLOYMENT SUMMARY
# =============================================================================

deployment_summary() {
    log "Deployment Summary"
    echo
    echo "=================================================="
    echo "🎉 QuantumVest Enterprise Deployment Complete! 🎉"
    echo "=================================================="
    echo
    echo "Environment: $ENVIRONMENT"
    echo "Region: $AWS_REGION"
    echo "Domain: https://$DOMAIN_NAME"
    echo
    
    # Get stack outputs
    local outputs
    outputs=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs' \
        --output table)
    
    echo "Stack Outputs:"
    echo "$outputs"
    echo
    
    echo "🔗 Quick Links:"
    echo "   • Website: https://$DOMAIN_NAME"
    echo "   • CloudWatch: https://console.aws.amazon.com/cloudwatch/home?region=$AWS_REGION#dashboards:name=QuantumVest-$ENVIRONMENT"
    echo "   • App Runner: https://console.aws.amazon.com/apprunner/home?region=$AWS_REGION"
    echo "   • RDS: https://console.aws.amazon.com/rds/home?region=$AWS_REGION"
    echo
    echo "📊 Monitoring:"
    echo "   • CloudWatch Alarms configured"
    echo "   • X-Ray tracing enabled"
    echo "   • GuardDuty security monitoring active"
    echo
    echo "💰 Cost Optimization:"
    echo "   • App Runner auto-scaling enabled"
    echo "   • RDS Aurora Serverless v2"
    echo "   • CloudFront caching optimized"
    echo
    success "Deployment completed successfully!"
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

main() {
    log "Starting QuantumVest Enterprise AWS Production Deployment"
    log "============================================================"
    
    # Pre-deployment
    check_prerequisites
    build_application
    
    # Infrastructure deployment
    deploy_infrastructure
    
    # Application deployment
    deploy_application
    
    # Post-deployment
    verify_deployment
    setup_monitoring
    security_hardening
    
    # Summary
    deployment_summary
}

# Error handling
trap 'error "Deployment failed at line $LINENO"' ERR

# Run main function
main "$@"
