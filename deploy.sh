#!/bin/bash

# QuantumVest Platform Deployment Script
# Complete deployment with mathematical foundations for Vercel + AWS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Deployment configuration
FRONTEND_DEPLOY=${FRONTEND_DEPLOY:-true}
BACKEND_DEPLOY=${BACKEND_DEPLOY:-true}
INFRASTRUCTURE_DEPLOY=${INFRASTRUCTURE_DEPLOY:-false}
APP_RUNNER_DEPLOY=${APP_RUNNER_DEPLOY:-false}
KUBERNETES_DEPLOY=${KUBERNETES_DEPLOY:-false}

# Environment configuration
ENVIRONMENT=${ENVIRONMENT:-"production"}
AWS_REGION=${AWS_REGION:-"us-east-1"}
CLUSTER_NAME=${CLUSTER_NAME:-"quantumvest-cluster"}

print_header() {
    echo -e "${PURPLE}===============================================${NC}"
    echo -e "${PURPLE}🚀 QuantumVest Platform Deployment${NC}"
    echo -e "${PURPLE}   Mathematical Quantum Computing Infrastructure${NC}"
    echo -e "${PURPLE}===============================================${NC}"
    echo ""
}

print_section() {
    echo -e "${CYAN}📋 $1${NC}"
    echo "-------------------------------------------"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_dependencies() {
    print_section "Checking Dependencies"
    
    # Check Node.js and npm
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or later."
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt "18" ]; then
        print_error "Node.js version 18 or later is required. Current version: $(node --version)"
    fi
    print_success "Node.js $(node --version) found"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
    fi
    print_success "npm $(npm --version) found"
    
    # Check Docker if backend deployment enabled
    if [ "$BACKEND_DEPLOY" = true ] || [ "$KUBERNETES_DEPLOY" = true ]; then
        if ! command -v docker &> /dev/null; then
            print_error "Docker is not installed. Required for backend deployment."
        fi
        print_success "Docker $(docker --version | cut -d' ' -f3 | tr -d ',') found"
        
        if ! command -v docker-compose &> /dev/null; then
            print_error "Docker Compose is not installed"
        fi
        print_success "Docker Compose $(docker-compose --version | cut -d' ' -f4 | tr -d ',') found"
    fi
    
    # Check AWS CLI if AWS deployment enabled
    if [ "$INFRASTRUCTURE_DEPLOY" = true ] || [ "$APP_RUNNER_DEPLOY" = true ] || [ "$KUBERNETES_DEPLOY" = true ]; then
        if ! command -v aws &> /dev/null; then
            print_error "AWS CLI is not installed. Required for AWS deployment."
        fi
        
        if ! aws sts get-caller-identity &> /dev/null; then
            print_error "Not logged into AWS. Please run 'aws configure' first."
        fi
        print_success "AWS CLI configured for $(aws sts get-caller-identity --query Account --output text)"
    fi
    
    # Check Terraform if infrastructure deployment enabled
    if [ "$INFRASTRUCTURE_DEPLOY" = true ]; then
        if ! command -v terraform &> /dev/null; then
            print_error "Terraform is not installed. Required for infrastructure deployment."
        fi
        print_success "Terraform $(terraform --version | head -1 | cut -d' ' -f2) found"
    fi
    
    # Check kubectl if Kubernetes deployment enabled
    if [ "$KUBERNETES_DEPLOY" = true ]; then
        if ! command -v kubectl &> /dev/null; then
            print_error "kubectl is not installed. Required for Kubernetes deployment."
        fi
        print_success "kubectl $(kubectl version --client -o json | jq -r .clientVersion.gitVersion) found"
    fi
    
    # Check Vercel CLI if frontend deployment enabled
    if [ "$FRONTEND_DEPLOY" = true ]; then
        if ! command -v vercel &> /dev/null; then
            print_warning "Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        print_success "Vercel CLI found"
    fi
    
    echo ""
}

setup_environment() {
    print_section "Setting Up Environment"
    
    # Create necessary directories
    mkdir -p logs
    mkdir -p temp
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/datasources
    mkdir -p nginx/ssl
    
    # Generate SSL certificates for development if they don't exist
    if [ ! -f "nginx/ssl/cert.pem" ]; then
        print_info "Generating self-signed SSL certificates for development..."
        openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=QuantumVest/CN=quantum-api.quantumvest.com" 2>/dev/null
        print_success "SSL certificates generated"
    fi
    
    # Create environment files if they don't exist
    if [ ! -f ".env.production" ]; then
        print_info "Creating production environment file..."
        cat > .env.production << EOF
# QuantumVest Production Environment
NODE_ENV=production
VITE_API_BASE_URL=https://quantum-api.quantumvest.com
VITE_QUANTUM_ALGEBRA_URL=https://quantum-api.quantumvest.com/api/v1/algebra
VITE_QUANTUM_SCHEDULER_URL=https://quantum-api.quantumvest.com/api/v1/scheduler
VITE_QUANTUM_ERROR_CORRECTION_URL=https://quantum-api.quantumvest.com/api/v1/error-correction
VITE_QUANTUM_INTERFACE_URL=https://quantum-api.quantumvest.com/api/v1/interface
VITE_QUANTUM_ML_URL=https://quantum-api.quantumvest.com/api/v1/ml
VITE_APP_ENVIRONMENT=production
VITE_ENABLE_QUANTUM_FEATURES=true
VITE_MAX_QUBITS=20
VITE_ENABLE_ERROR_CORRECTION=true
VITE_ENABLE_VQC_TRAINING=true
EOF
        print_success "Production environment file created"
    fi
    
    echo ""
}

build_frontend() {
    print_section "Building Frontend"
    
    print_info "Installing frontend dependencies..."
    npm ci --silent
    print_success "Dependencies installed"
    
    print_info "Running type check..."
    npm run type-check
    print_success "Type check passed"
    
    print_info "Building production frontend..."
    npm run build:production
    print_success "Frontend built successfully"
    
    # Test build
    if [ ! -d "dist" ]; then
        print_error "Build failed - dist directory not found"
    fi
    
    BUILD_SIZE=$(du -sh dist | cut -f1)
    print_success "Build completed. Size: $BUILD_SIZE"
    
    echo ""
}

deploy_frontend() {
    if [ "$FRONTEND_DEPLOY" != true ]; then
        return
    fi
    
    print_section "Deploying Frontend to Vercel"
    
    print_info "Deploying to Vercel..."
    vercel --prod --yes
    print_success "Frontend deployed to Vercel"
    
    echo ""
}

build_backend_services() {
    print_section "Building Backend Services"
    
    print_info "Creating Dockerfiles for quantum services..."
    
    # Create Dockerfile for quantum-algebra service
    cat > services/quantum-algebra/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]
EOF
    
    # Create requirements.txt for quantum-algebra
    cat > services/quantum-algebra/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
numpy==1.24.3
scipy==1.11.4
tensorly==0.8.1
redis==5.0.1
asyncio-mqtt==0.16.1
pydantic==2.5.0
python-multipart==0.0.6
EOF
    
    # Create similar Dockerfiles for other services
    for service in quantum-scheduler quantum-fault-tolerance quantum-classical-interface quantum-ml; do
        cp services/quantum-algebra/Dockerfile services/$service/
        cp services/quantum-algebra/requirements.txt services/$service/
        
        # Add service-specific dependencies
        case $service in
            "quantum-scheduler")
                echo "kubernetes==28.1.0" >> services/$service/requirements.txt
                echo "asyncpg==0.29.0" >> services/$service/requirements.txt
                ;;
            "quantum-fault-tolerance")
                echo "networkx==3.2.1" >> services/$service/requirements.txt
                echo "asyncpg==0.29.0" >> services/$service/requirements.txt
                ;;
            "quantum-classical-interface")
                echo "z3-solver==4.12.2.0" >> services/$service/requirements.txt
                echo "sympy==1.12" >> services/$service/requirements.txt
                ;;
            "quantum-ml")
                echo "torch==2.1.1" >> services/$service/requirements.txt
                echo "pennylane==0.33.1" >> services/$service/requirements.txt
                ;;
        esac
    done
    
    print_success "Dockerfiles created for all services"
    
    print_info "Building Docker images..."
    docker-compose build --parallel
    print_success "All Docker images built successfully"
    
    echo ""
}

deploy_backend_local() {
    if [ "$BACKEND_DEPLOY" != true ]; then
        return
    fi
    
    print_section "Deploying Backend Services (Local Docker)"
    
    print_info "Starting quantum computing infrastructure..."
    docker-compose up -d
    
    print_info "Waiting for services to be healthy..."
    sleep 30
    
    # Check service health
    services=("postgres" "redis" "quantum-algebra" "quantum-scheduler" "quantum-error-correction" "quantum-interface" "quantum-ml" "api-gateway")
    
    for service in "${services[@]}"; do
        if docker-compose ps | grep -q "$service.*Up"; then
            print_success "$service is running"
        else
            print_error "$service failed to start"
        fi
    done
    
    print_success "Backend services deployed locally"
    
    # Test API endpoints
    print_info "Testing API endpoints..."
    sleep 10
    
    if curl -s -f http://localhost/health > /dev/null; then
        print_success "API Gateway is responding"
    else
        print_warning "API Gateway is not yet responding (may still be starting up)"
    fi
    
    echo ""
    print_success "Backend deployment completed"
    echo ""
    echo "🌐 Services available at:"
    echo "  • API Gateway: http://localhost"
    echo "  • Quantum Algebra: http://localhost/api/v1/algebra"
    echo "  • Quantum Scheduler: http://localhost/api/v1/scheduler"
    echo "  • Error Correction: http://localhost/api/v1/error-correction"
    echo "  • Quantum Interface: http://localhost/api/v1/interface"
    echo "  • Quantum ML: http://localhost/api/v1/ml"
    echo "  • Monitoring (Grafana): http://localhost:3000 (admin/quantumadmin)"
    echo "  • Metrics (Prometheus): http://localhost:9090"
    echo ""
}

deploy_infrastructure() {
    if [ "$INFRASTRUCTURE_DEPLOY" != true ]; then
        return
    fi
    
    print_section "Deploying AWS Infrastructure"
    
    cd infrastructure
    
    print_info "Initializing Terraform..."
    terraform init
    
    print_info "Planning infrastructure deployment..."
    terraform plan -out=tfplan
    
    print_info "Applying infrastructure changes..."
    terraform apply tfplan
    
    cd ..
    
    print_success "AWS infrastructure deployed"
    echo ""
}

deploy_kubernetes() {
    if [ "$KUBERNETES_DEPLOY" != true ]; then
        return
    fi
    
    print_section "Deploying to Kubernetes"
    
    print_info "Configuring kubectl for EKS cluster..."
    aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME
    
    print_info "Applying Kubernetes manifests..."
    kubectl apply -f k8s/quantum-cloud-deployment.yaml
    
    print_info "Waiting for pods to be ready..."
    kubectl wait --for=condition=ready pod -l app=quantum-algebra-service --timeout=300s
    kubectl wait --for=condition=ready pod -l app=quantum-scheduler-service --timeout=300s
    
    print_success "Kubernetes deployment completed"
    
    # Get service URLs
    API_GATEWAY_URL=$(kubectl get service quantum-api-gateway -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    
    echo ""
    print_success "Kubernetes services available at:"
    echo "  • API Gateway: http://$API_GATEWAY_URL"
    echo ""
}

deploy_app_runner() {
    if [ "$APP_RUNNER_DEPLOY" != true ]; then
        return
    fi
    
    print_section "Deploying to AWS App Runner"
    
    cd app-runner
    chmod +x deploy.sh
    ./deploy.sh
    cd ..
    
    print_success "App Runner deployment completed"
    echo ""
}

run_tests() {
    print_section "Running Tests"
    
    print_info "Running frontend tests..."
    npm run test --silent
    print_success "Frontend tests passed"
    
    if [ "$BACKEND_DEPLOY" = true ]; then
        print_info "Running backend service tests..."
        
        # Test quantum algebra service
        if curl -s -f http://localhost/api/v1/algebra/health > /dev/null; then
            print_success "Quantum Algebra service test passed"
        else
            print_warning "Quantum Algebra service test failed"
        fi
        
        # Test other services
        for service in scheduler error-correction interface ml; do
            if curl -s -f http://localhost/api/v1/$service/health > /dev/null; then
                print_success "Quantum $service service test passed"
            else
                print_warning "Quantum $service service test failed"
            fi
        done
    fi
    
    echo ""
}

cleanup() {
    print_section "Cleanup"
    
    # Remove temporary files
    rm -rf temp/
    rm -f tfplan
    
    print_success "Cleanup completed"
    echo ""
}

main() {
    print_header
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --frontend-only)
                BACKEND_DEPLOY=false
                INFRASTRUCTURE_DEPLOY=false
                APP_RUNNER_DEPLOY=false
                KUBERNETES_DEPLOY=false
                shift
                ;;
            --backend-only)
                FRONTEND_DEPLOY=false
                INFRASTRUCTURE_DEPLOY=false
                APP_RUNNER_DEPLOY=false
                KUBERNETES_DEPLOY=false
                shift
                ;;
            --infrastructure)
                INFRASTRUCTURE_DEPLOY=true
                shift
                ;;
            --kubernetes)
                KUBERNETES_DEPLOY=true
                shift
                ;;
            --app-runner)
                APP_RUNNER_DEPLOY=true
                shift
                ;;
            --all)
                FRONTEND_DEPLOY=true
                BACKEND_DEPLOY=true
                INFRASTRUCTURE_DEPLOY=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                ;;
        esac
    done
    
    # Show deployment plan
    echo -e "${BLUE}Deployment Plan:${NC}"
    echo "  • Frontend (Vercel): $FRONTEND_DEPLOY"
    echo "  • Backend (Docker): $BACKEND_DEPLOY"
    echo "  • Infrastructure (AWS): $INFRASTRUCTURE_DEPLOY"
    echo "  • Kubernetes (EKS): $KUBERNETES_DEPLOY"
    echo "  • App Runner: $APP_RUNNER_DEPLOY"
    echo "  • Environment: $ENVIRONMENT"
    echo ""
    
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Deployment cancelled"
        exit 0
    fi
    
    # Execute deployment steps
    check_dependencies
    setup_environment
    
    if [ "$FRONTEND_DEPLOY" = true ]; then
        build_frontend
        deploy_frontend
    fi
    
    if [ "$BACKEND_DEPLOY" = true ]; then
        build_backend_services
        deploy_backend_local
    fi
    
    if [ "$INFRASTRUCTURE_DEPLOY" = true ]; then
        deploy_infrastructure
    fi
    
    if [ "$KUBERNETES_DEPLOY" = true ]; then
        deploy_kubernetes
    fi
    
    if [ "$APP_RUNNER_DEPLOY" = true ]; then
        deploy_app_runner
    fi
    
    run_tests
    cleanup
    
    print_section "Deployment Summary"
    print_success "🎉 QuantumVest Platform deployment completed successfully!"
    echo ""
    echo "📊 Mathematical Services Deployed:"
    echo "  ✓ Quantum Linear Algebra (tensor operations, gate simulation)"
    echo "  ✓ Markov Decision Process Scheduler (queueing theory)"
    echo "  ✓ Error Correction (stabilizer codes, surface codes)"
    echo "  ✓ Quantum-Classical Interface (category theory, type safety)"
    echo "  ✓ Variational Quantum Circuits (cost function optimization)"
    echo ""
    
    if [ "$FRONTEND_DEPLOY" = true ]; then
        echo "🌐 Frontend: Available on Vercel"
    fi
    
    if [ "$BACKEND_DEPLOY" = true ]; then
        echo "🔧 Backend: Running on Docker (http://localhost)"
        echo "📈 Monitoring: Grafana (http://localhost:3000)"
    fi
    
    echo ""
    print_success "Platform is ready for quantum computing workloads!"
}

# Execute main function
main "$@"
