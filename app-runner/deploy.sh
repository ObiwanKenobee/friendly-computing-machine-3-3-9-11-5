#!/bin/bash

# AWS App Runner Deployment Script for Quantum Service Lite
set -e

echo "🚀 Deploying Quantum Service Lite to AWS App Runner..."

# Configuration
SERVICE_NAME="quantum-service-lite"
REGION=${AWS_REGION:-"us-east-1"}
SOURCE_TYPE="ECR"  # or "GITHUB" for GitHub source

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if logged into AWS
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "Not logged into AWS. Please run 'aws configure' first."
    exit 1
fi

print_status "Checking for existing App Runner service..."

# Check if service exists
SERVICE_EXISTS=$(aws apprunner list-services --region $REGION --query "ServiceSummaryList[?ServiceName=='$SERVICE_NAME'].ServiceName" --output text)

if [ "$SERVICE_EXISTS" = "$SERVICE_NAME" ]; then
    print_warning "Service $SERVICE_NAME already exists. Updating..."
    
    # Get service ARN
    SERVICE_ARN=$(aws apprunner list-services --region $REGION --query "ServiceSummaryList[?ServiceName=='$SERVICE_NAME'].ServiceArn" --output text)
    
    print_status "Updating App Runner service..."
    aws apprunner update-service \
        --region $REGION \
        --service-arn $SERVICE_ARN \
        --source-configuration '{
            "ImageRepository": {
                "ImageIdentifier": "public.ecr.aws/docker/library/python:3.11-slim",
                "ImageConfiguration": {
                    "Port": "8080",
                    "RuntimeEnvironmentVariables": {
                        "PORT": "8080",
                        "PYTHONUNBUFFERED": "1",
                        "LOG_LEVEL": "INFO",
                        "MAX_QUBITS": "12"
                    }
                },
                "ImageRepositoryType": "ECR_PUBLIC"
            },
            "AutoDeploymentsEnabled": false
        }' \
        --instance-configuration '{
            "Cpu": "1 vCPU",
            "Memory": "3 GB"
        }' > /dev/null
    
    print_status "Service update initiated. ARN: $SERVICE_ARN"
    
else
    print_status "Creating new App Runner service..."
    
    # Create IAM role for App Runner if it doesn't exist
    ROLE_NAME="AppRunnerInstanceRole-$SERVICE_NAME"
    
    if ! aws iam get-role --role-name $ROLE_NAME &> /dev/null; then
        print_status "Creating IAM role for App Runner..."
        
        # Create trust policy
        cat > trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "tasks.apprunner.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF
        
        aws iam create-role \
            --role-name $ROLE_NAME \
            --assume-role-policy-document file://trust-policy.json > /dev/null
        
        # Attach basic execution policy
        aws iam attach-role-policy \
            --role-name $ROLE_NAME \
            --policy-arn arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess
        
        rm trust-policy.json
        print_status "IAM role created: $ROLE_NAME"
    fi
    
    # Get role ARN
    ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
    
    # Create App Runner service
    aws apprunner create-service \
        --region $REGION \
        --service-name $SERVICE_NAME \
        --source-configuration '{
            "ImageRepository": {
                "ImageIdentifier": "public.ecr.aws/docker/library/python:3.11-slim",
                "ImageConfiguration": {
                    "Port": "8080",
                    "RuntimeEnvironmentVariables": {
                        "PORT": "8080",
                        "PYTHONUNBUFFERED": "1",
                        "LOG_LEVEL": "INFO",
                        "MAX_QUBITS": "12",
                        "MAX_SHOTS": "10000"
                    },
                    "StartCommand": "pip install fastapi uvicorn numpy scipy pydantic && python -c \"
import asyncio
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import uvicorn
import os

app = FastAPI(title='Quantum Service Lite')

@app.get('/')
async def root():
    return {'message': 'QuantumVest Quantum Service Lite', 'status': 'running'}

@app.get('/health')
async def health():
    return {'status': 'healthy', 'service': 'quantum-lite'}

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    uvicorn.run(app, host='0.0.0.0', port=port)
\""
                },
                "ImageRepositoryType": "ECR_PUBLIC"
            },
            "AutoDeploymentsEnabled": false
        }' \
        --instance-configuration '{
            "Cpu": "1 vCPU",
            "Memory": "3 GB",
            "InstanceRoleArn": "'$ROLE_ARN'"
        }' \
        --health-check-configuration '{
            "Protocol": "HTTP",
            "Path": "/health",
            "Interval": 30,
            "Timeout": 5,
            "HealthyThreshold": 2,
            "UnhealthyThreshold": 3
        }' > apprunner-output.json
    
    SERVICE_ARN=$(cat apprunner-output.json | grep -o '"ServiceArn": "[^"]*"' | cut -d'"' -f4)
    rm apprunner-output.json
    
    print_status "App Runner service created. ARN: $SERVICE_ARN"
fi

# Wait for deployment to complete
print_status "Waiting for deployment to complete..."

while true; do
    STATUS=$(aws apprunner describe-service --region $REGION --service-arn $SERVICE_ARN --query 'Service.Status' --output text)
    
    case $STATUS in
        "RUNNING")
            print_status "✅ Deployment completed successfully!"
            break
            ;;
        "CREATE_FAILED"|"UPDATE_FAILED"|"DELETE_FAILED")
            print_error "❌ Deployment failed with status: $STATUS"
            exit 1
            ;;
        *)
            print_status "⏳ Current status: $STATUS (waiting...)"
            sleep 30
            ;;
    esac
done

# Get service URL
SERVICE_URL=$(aws apprunner describe-service --region $REGION --service-arn $SERVICE_ARN --query 'Service.ServiceUrl' --output text)

print_status "🎉 Quantum Service Lite deployed successfully!"
echo ""
echo "📊 Service Information:"
echo "  • Service Name: $SERVICE_NAME"
echo "  • Service URL: https://$SERVICE_URL"
echo "  • Health Check: https://$SERVICE_URL/health"
echo "  • API Docs: https://$SERVICE_URL/docs"
echo "  • Region: $REGION"
echo "  • Status: RUNNING"
echo ""
echo "🧪 Test the service:"
echo "  curl https://$SERVICE_URL/health"
echo ""
echo "🔧 Manage the service:"
echo "  aws apprunner describe-service --service-arn $SERVICE_ARN --region $REGION"
echo "  aws apprunner delete-service --service-arn $SERVICE_ARN --region $REGION"

# Test the deployment
print_status "Testing deployment..."
if curl -s -f "https://$SERVICE_URL/health" > /dev/null; then
    print_status "✅ Service is responding correctly!"
else
    print_warning "⚠️  Service may still be starting up. Please wait a few minutes and test manually."
fi

echo ""
print_status "🚀 Deployment complete! Your quantum service is ready to use."
