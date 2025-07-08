#!/bin/bash

# QuantumVest Enterprise Platform - Production Deployment Script
# Usage: ./scripts/deploy.sh [environment] [region]

set -euo pipefail

# Configuration
ENVIRONMENT=${1:-production}
AWS_REGION=${2:-us-east-1}
PROJECT_NAME="quantumvest"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if required tools are installed
    local tools=("aws" "docker" "npm" "terraform")
    for tool in "${tools[@]}"; do
        if ! command -v $tool &> /dev/null; then
            error "$tool is not installed or not in PATH"
            exit 1
        fi
    done
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS credentials not configured or invalid"
        exit 1
    fi
    
    # Check if we're in the project root
    if [[ ! -f "package.json" ]]; then
        error "Script must be run from project root directory"
        exit 1
    fi
    
    log "Prerequisites check passed"
}

# Validate environment
validate_environment() {
    log "Validating environment: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        production|staging|development)
            info "Deploying to $ENVIRONMENT environment"
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT. Must be production, staging, or development"
            exit 1
            ;;
    esac
}

# Build and test application
build_application() {
    log "Building application..."
    
    # Install dependencies
    info "Installing dependencies..."
    npm ci
    
    # Run tests
    info "Running tests..."
    npm run lint
    
    # Type checking
    info "Running type checking..."
    npx tsc --noEmit
    
    # Build application
    info "Building application for production..."
    npm run build
    
    log "Application build completed successfully"
}

# Build and push Docker image
build_and_push_image() {
    log "Building and pushing Docker image..."
    
    local account_id=$(aws sts get-caller-identity --query Account --output text)
    local ecr_registry="${account_id}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    local repository_name="${ENVIRONMENT}-${PROJECT_NAME}"
    local image_tag="$(git rev-parse --short HEAD)-${TIMESTAMP}"
    local image_uri="${ecr_registry}/${repository_name}:${image_tag}"
    local latest_uri="${ecr_registry}/${repository_name}:latest"
    
    # Login to ECR
    info "Logging in to Amazon ECR..."
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ecr_registry
    
    # Create repository if it doesn't exist
    if ! aws ecr describe-repositories --repository-names $repository_name --region $AWS_REGION &> /dev/null; then
        info "Creating ECR repository: $repository_name"
        aws ecr create-repository --repository-name $repository_name --region $AWS_REGION
    fi
    
    # Build Docker image
    info "Building Docker image..."
    docker build -t $image_uri .
    docker tag $image_uri $latest_uri
    
    # Push to ECR
    info "Pushing Docker image to ECR..."
    docker push $image_uri
    docker push $latest_uri
    
    # Start vulnerability scan
    info "Starting image vulnerability scan..."
    aws ecr start-image-scan --repository-name $repository_name --image-id imageTag=$image_tag --region $AWS_REGION || true
    
    echo $image_uri > .last_image_uri
    log "Docker image built and pushed successfully: $image_uri"
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    log "Deploying infrastructure with Terraform..."
    
    cd terraform
    
    # Initialize Terraform
    info "Initializing Terraform..."
    terraform init -reconfigure
    
    # Create terraform.tfvars if it doesn't exist
    local tfvars_file="terraform.tfvars"
    if [[ ! -f $tfvars_file ]]; then
        warning "Creating default terraform.tfvars file"
        cat > $tfvars_file << EOF
environment = "$ENVIRONMENT"
aws_region = "$AWS_REGION"
domain_names = []
certificate_arn = ""
EOF
        warning "Please update $tfvars_file with your specific values"
    fi
    
    # Plan deployment
    info "Planning Terraform deployment..."
    terraform plan -var="environment=$ENVIRONMENT" -var="aws_region=$AWS_REGION" -out=tfplan
    
    # Apply deployment
    info "Applying Terraform deployment..."
    terraform apply tfplan
    
    # Save outputs
    terraform output -json > ../terraform_outputs.json
    
    cd ..
    log "Infrastructure deployment completed"
}

# Deploy application to ECS
deploy_application() {
    log "Deploying application to ECS..."
    
    local cluster_name="${ENVIRONMENT}-${PROJECT_NAME}-cluster"
    local service_name="${ENVIRONMENT}-${PROJECT_NAME}-service"
    
    # Check if ECS cluster exists
    if ! aws ecs describe-clusters --clusters $cluster_name --region $AWS_REGION &> /dev/null; then
        error "ECS cluster $cluster_name not found. Please run infrastructure deployment first."
        exit 1
    fi
    
    # Update ECS service to force new deployment
    info "Updating ECS service..."
    aws ecs update-service \
        --cluster $cluster_name \
        --service $service_name \
        --force-new-deployment \
        --region $AWS_REGION
    
    # Wait for deployment to complete
    info "Waiting for deployment to stabilize..."
    aws ecs wait services-stable \
        --cluster $cluster_name \
        --services $service_name \
        --region $AWS_REGION
    
    log "Application deployment completed successfully"
}

# Invalidate CloudFront cache
invalidate_cloudfront() {
    log "Invalidating CloudFront cache..."
    
    if [[ -f "terraform_outputs.json" ]]; then
        local distribution_id=$(cat terraform_outputs.json | jq -r '.cloudfront_distribution_id.value')
        
        if [[ "$distribution_id" != "null" && "$distribution_id" != "" ]]; then
            info "Creating CloudFront invalidation for distribution: $distribution_id"
            aws cloudfront create-invalidation \
                --distribution-id $distribution_id \
                --paths "/*" \
                --region $AWS_REGION
            log "CloudFront invalidation created"
        else
            warning "CloudFront distribution ID not found in outputs"
        fi
    else
        warning "Terraform outputs file not found, skipping CloudFront invalidation"
    fi
}

# Run smoke tests
run_smoke_tests() {
    log "Running smoke tests..."
    
    if [[ -f "terraform_outputs.json" ]]; then
        local alb_dns=$(cat terraform_outputs.json | jq -r '.load_balancer_dns_name.value')
        local cloudfront_domain=$(cat terraform_outputs.json | jq -r '.cloudfront_domain_name.value')
        
        # Test ALB endpoint
        if [[ "$alb_dns" != "null" && "$alb_dns" != "" ]]; then
            info "Testing ALB endpoint: https://$alb_dns"
            sleep 30 # Wait for deployment to be ready
            
            if curl -f -s -o /dev/null "https://$alb_dns/health"; then
                log "✅ ALB health check passed"
            else
                error "❌ ALB health check failed"
                exit 1
            fi
        fi
        
        # Test CloudFront endpoint
        if [[ "$cloudfront_domain" != "null" && "$cloudfront_domain" != "" ]]; then
            info "Testing CloudFront endpoint: https://$cloudfront_domain"
            
            if curl -f -s -o /dev/null "https://$cloudfront_domain"; then
                log "✅ CloudFront endpoint accessible"
            else
                warning "⚠️ CloudFront endpoint not accessible (may take time to propagate)"
            fi
        fi
    else
        warning "Terraform outputs file not found, skipping smoke tests"
    fi
}

# Send deployment notification
send_notification() {
    local status=$1
    local webhook_url=${SLACK_WEBHOOK_URL:-}
    
    if [[ -n "$webhook_url" ]]; then
        local color
        local emoji
        
        if [[ "$status" == "success" ]]; then
            color="good"
            emoji="✅"
        else
            color="danger"
            emoji="❌"
        fi
        
        local message="$emoji QuantumVest Enterprise Platform deployment to $ENVIRONMENT $status"
        
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"attachments\":[{\"color\":\"$color\",\"text\":\"$message\"}]}" \
            $webhook_url
    fi
}

# Main deployment function
main() {
    log "Starting QuantumVest Enterprise Platform deployment"
    log "Environment: $ENVIRONMENT"
    log "Region: $AWS_REGION"
    log "Timestamp: $TIMESTAMP"
    
    # Create deployment log directory
    mkdir -p logs
    exec 1> >(tee -a "logs/deploy_${ENVIRONMENT}_${TIMESTAMP}.log")
    exec 2> >(tee -a "logs/deploy_${ENVIRONMENT}_${TIMESTAMP}.log" >&2)
    
    check_prerequisites
    validate_environment
    
    # Confirmation for production
    if [[ "$ENVIRONMENT" == "production" ]]; then
        warning "You are about to deploy to PRODUCTION environment!"
        read -p "Are you sure you want to continue? (yes/no): " confirm
        if [[ "$confirm" != "yes" ]]; then
            error "Deployment cancelled by user"
            exit 1
        fi
    fi
    
    # Record start time
    local start_time=$(date +%s)
    
    # Deployment steps
    build_application
    build_and_push_image
    deploy_infrastructure
    deploy_application
    invalidate_cloudfront
    run_smoke_tests
    
    # Calculate deployment time
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log "🎉 Deployment completed successfully in ${duration} seconds!"
    
    # Show access URLs
    if [[ -f "terraform_outputs.json" ]]; then
        info "Access URLs:"
        local alb_dns=$(cat terraform_outputs.json | jq -r '.load_balancer_dns_name.value')
        local cloudfront_domain=$(cat terraform_outputs.json | jq -r '.cloudfront_domain_name.value')
        
        if [[ "$alb_dns" != "null" ]]; then
            info "  ALB: https://$alb_dns"
        fi
        
        if [[ "$cloudfront_domain" != "null" ]]; then
            info "  CloudFront: https://$cloudfront_domain"
        fi
    fi
    
    send_notification "success"
}

# Cleanup function for script interruption
cleanup() {
    error "Deployment interrupted"
    send_notification "failed"
    exit 1
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Run main function
main "$@"
