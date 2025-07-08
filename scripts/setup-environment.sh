#!/bin/bash

# QuantumVest Enterprise Environment Setup Script
# This script helps set up environment variables for different deployment environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if environment argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 [local|staging|production]"
    echo ""
    echo "Examples:"
    echo "  $0 local       # Set up local development environment"
    echo "  $0 staging     # Set up staging environment"
    echo "  $0 production  # Set up production environment"
    exit 1
fi

ENVIRONMENT=$1

log_info "Setting up QuantumVest Enterprise environment: $ENVIRONMENT"

# Function to create environment file
create_env_file() {
    local env_type=$1
    local env_file=".env.${env_type}"
    
    if [ "$env_type" = "local" ]; then
        env_file=".env.local"
    fi
    
    log_info "Creating environment file: $env_file"
    
    if [ -f "$env_file" ]; then
        log_warning "Environment file $env_file already exists"
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Skipping environment file creation"
            return 0
        fi
    fi
    
    # Copy the appropriate template
    case $env_type in
        "local")
            if [ -f ".env.local" ]; then
                log_success "Using existing .env.local file"
            else
                log_error ".env.local template not found. Please ensure the file exists."
                return 1
            fi
            ;;
        "staging")
            if [ -f ".env.staging" ]; then
                cp ".env.staging" "$env_file"
                log_success "Created $env_file from staging template"
            else
                log_error ".env.staging template not found"
                return 1
            fi
            ;;
        "production")
            if [ -f ".env.production" ]; then
                cp ".env.production" "$env_file"
                log_success "Created $env_file from production template"
            else
                log_error ".env.production template not found"
                return 1
            fi
            ;;
    esac
}

# Function to validate required environment variables
validate_env() {
    local env_file=$1
    
    log_info "Validating environment variables in $env_file"
    
    # Core required variables
    local required_vars=(
        "VITE_APP_NAME"
        "VITE_APP_VERSION"
        "VITE_APP_ENV"
        "VITE_SUPABASE_URL"
        "VITE_SUPABASE_ANON_KEY"
    )
    
    local missing_vars=()
    
    if [ -f "$env_file" ]; then
        for var in "${required_vars[@]}"; do
            if ! grep -q "^${var}=" "$env_file" || grep -q "^${var}=$" "$env_file" || grep -q "^${var}=your_" "$env_file"; then
                missing_vars+=("$var")
            fi
        done
        
        if [ ${#missing_vars[@]} -eq 0 ]; then
            log_success "All required environment variables are configured"
        else
            log_warning "The following variables need to be configured:"
            for var in "${missing_vars[@]}"; do
                echo "  - $var"
            done
        fi
    else
        log_error "Environment file $env_file not found"
        return 1
    fi
}

# Function to show next steps
show_next_steps() {
    local env_type=$1
    
    echo ""
    log_success "Environment setup complete for: $env_type"
    echo ""
    echo "📋 Next Steps:"
    echo ""
    
    case $env_type in
        "local")
            echo "1. Edit .env.local and fill in your API keys:"
            echo "   - VITE_GOOGLE_MAPS_API_KEY (for geographical features)"
            echo "   - VITE_STRIPE_PUBLIC_KEY (for payments - use test keys)"
            echo "   - VITE_OPENAI_API_KEY (for AI features)"
            echo ""
            echo "2. Start the development server:"
            echo "   npm run dev"
            echo ""
            echo "3. View the application at:"
            echo "   http://localhost:3001"
            ;;
        "staging")
            echo "1. Configure staging-specific API keys in .env.staging"
            echo "2. Deploy to staging environment"
            echo "3. Test all features thoroughly"
            echo "4. Run integration tests"
            ;;
        "production")
            echo "1. ⚠️  IMPORTANT: Replace ALL placeholder values with real production keys"
            echo "2. Ensure all API keys are from production/live environments"
            echo "3. Test in staging environment first"
            echo "4. Deploy using production deployment script"
            echo ""
            echo "🔐 Security reminders:"
            echo "   - Never commit .env files with real secrets"
            echo "   - Use environment-specific keys"
            echo "   - Enable all security features"
            ;;
    esac
    
    echo ""
    echo "📚 Documentation:"
    echo "   - API Documentation: ./API_DOCUMENTATION.md"
    echo "   - AWS Deployment: ./AWS_DEPLOYMENT_README.md"
    echo ""
    echo "🔑 Required API Keys by Priority:"
    echo "   1. Supabase (database) - ✅ Already configured"
    echo "   2. Google Maps (geographical features)"
    echo "   3. Stripe (payments)"
    echo "   4. Google Analytics (tracking)"
    echo "   5. OpenAI (AI features)"
    echo "   6. Market data APIs (optional)"
    echo ""
}

# Function to check API connectivity
check_api_connectivity() {
    local env_file=$1
    
    log_info "Checking API connectivity (optional)"
    
    # Source the environment file
    if [ -f "$env_file" ]; then
        set -a
        source "$env_file"
        set +a
        
        # Check if we can validate some APIs
        if [ ! -z "$VITE_SUPABASE_URL" ] && [ "$VITE_SUPABASE_URL" != "your_supabase_url" ]; then
            log_info "Supabase URL configured: ${VITE_SUPABASE_URL}"
        fi
        
        if [ ! -z "$VITE_GOOGLE_MAPS_API_KEY" ] && [ "$VITE_GOOGLE_MAPS_API_KEY" != "your_google_maps_api_key" ]; then
            log_success "Google Maps API key configured"
        fi
        
        if [ ! -z "$VITE_STRIPE_PUBLIC_KEY" ] && [ "$VITE_STRIPE_PUBLIC_KEY" != "your_stripe_public_key" ]; then
            log_success "Stripe public key configured"
        fi
    fi
}

# Function to create gitignore entries
update_gitignore() {
    log_info "Updating .gitignore for environment files"
    
    # Ensure .gitignore exists
    touch .gitignore
    
    # Add environment file patterns if not already present
    local env_patterns=(
        ".env.local"
        ".env.production"
        ".env.staging"
        ".env*.local"
        "*.env"
    )
    
    for pattern in "${env_patterns[@]}"; do
        if ! grep -q "^${pattern}$" .gitignore 2>/dev/null; then
            echo "$pattern" >> .gitignore
            log_info "Added $pattern to .gitignore"
        fi
    done
    
    log_success ".gitignore updated"
}

# Main execution
main() {
    case $ENVIRONMENT in
        "local"|"staging"|"production")
            create_env_file "$ENVIRONMENT"
            
            local env_file=".env.$ENVIRONMENT"
            if [ "$ENVIRONMENT" = "local" ]; then
                env_file=".env.local"
            fi
            
            validate_env "$env_file"
            check_api_connectivity "$env_file"
            update_gitignore
            show_next_steps "$ENVIRONMENT"
            ;;
        *)
            log_error "Invalid environment: $ENVIRONMENT"
            log_error "Valid options: local, staging, production"
            exit 1
            ;;
    esac
}

# Run main function
main

log_success "🎉 Environment setup completed successfully!"
echo ""
echo "💡 Tip: Keep your API keys secure and never commit them to version control"
echo "📞 Need help? Check the API_DOCUMENTATION.md for detailed setup instructions"
