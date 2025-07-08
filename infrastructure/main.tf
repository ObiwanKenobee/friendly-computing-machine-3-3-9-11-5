terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# EKS Cluster for Quantum-Classical Hybrid Workloads
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "quantumvest-cluster"
  cluster_version = "1.28"

  vpc_id                         = module.vpc.vpc_id
  subnet_ids                     = module.vpc.private_subnets
  cluster_endpoint_public_access = true

  # Quantum Computing Node Groups
  eks_managed_node_groups = {
    quantum_simulators = {
      name = "quantum-simulators"
      
      instance_types = ["c6i.32xlarge", "r6i.32xlarge"] # High-memory for quantum simulation
      capacity_type  = "ON_DEMAND"
      
      min_size     = 1
      max_size     = 10
      desired_size = 2

      labels = {
        workload-type = "quantum-simulation"
        node-class    = "compute-intensive"
      }

      taints = {
        quantum-only = {
          key    = "quantum-simulation"
          value  = "true"
          effect = "NO_SCHEDULE"
        }
      }
    }

    classical_workers = {
      name = "classical-workers"
      
      instance_types = ["m6i.2xlarge", "m6i.4xlarge"]
      capacity_type  = "SPOT"
      
      min_size     = 2
      max_size     = 20
      desired_size = 5

      labels = {
        workload-type = "classical-processing"
        node-class    = "general-purpose"
      }
    }

    ml_training = {
      name = "ml-training"
      
      instance_types = ["p4d.24xlarge", "g5.48xlarge"] # GPU instances for VQC training
      capacity_type  = "ON_DEMAND"
      
      min_size     = 0
      max_size     = 5
      desired_size = 1

      labels = {
        workload-type = "quantum-ml"
        node-class    = "gpu-accelerated"
      }
    }
  }

  tags = {
    Environment = var.environment
    Project     = "QuantumVest"
    Component   = "Quantum-Cloud-Infrastructure"
  }
}

# VPC for Quantum Cloud Infrastructure
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "quantumvest-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = true

  # Enable DNS resolution for quantum service discovery
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Environment                                        = var.environment
    "kubernetes.io/cluster/quantumvest-cluster"       = "shared"
  }
}

# RDS Aurora for Quantum State Storage
resource "aws_rds_cluster" "quantum_states" {
  cluster_identifier     = "quantum-states-cluster"
  engine                 = "aurora-postgresql"
  engine_version         = "15.3"
  database_name          = "quantumstates"
  master_username        = var.db_username
  master_password        = var.db_password
  
  vpc_security_group_ids = [aws_security_group.quantum_db.id]
  db_subnet_group_name   = aws_db_subnet_group.quantum.name
  
  backup_retention_period = 7
  preferred_backup_window = "07:00-09:00"
  
  # Enable encryption for quantum data security
  storage_encrypted = true
  kms_key_id       = aws_kms_key.quantum_encryption.arn
  
  # High availability for fault tolerance
  availability_zones = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  
  tags = {
    Name        = "quantum-states-cluster"
    Environment = var.environment
    Component   = "Quantum-State-Storage"
  }
}

resource "aws_rds_cluster_instance" "quantum_states_instances" {
  count              = 2
  identifier         = "quantum-states-${count.index}"
  cluster_identifier = aws_rds_cluster.quantum_states.id
  instance_class     = "db.r6g.2xlarge" # Memory-optimized for large quantum states
  engine             = aws_rds_cluster.quantum_states.engine
  engine_version     = aws_rds_cluster.quantum_states.engine_version
  
  performance_insights_enabled = true
  monitoring_interval          = 60
  monitoring_role_arn         = aws_iam_role.rds_enhanced_monitoring.arn
}

# Redis ElastiCache for Quantum Circuit Caching
resource "aws_elasticache_replication_group" "quantum_cache" {
  replication_group_id       = "quantum-circuit-cache"
  description               = "Redis cache for quantum circuits and intermediate results"
  
  node_type                 = "cache.r7g.2xlarge"
  port                     = 6379
  parameter_group_name     = "default.redis7"
  
  num_cache_clusters       = 3
  automatic_failover_enabled = true
  multi_az_enabled         = true
  
  subnet_group_name        = aws_elasticache_subnet_group.quantum.name
  security_group_ids       = [aws_security_group.quantum_cache.id]
  
  # Enable encryption
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                = var.redis_auth_token
  
  tags = {
    Name        = "quantum-circuit-cache"
    Environment = var.environment
    Component   = "Quantum-Circuit-Caching"
  }
}

# S3 Bucket for Quantum Algorithm Storage
resource "aws_s3_bucket" "quantum_algorithms" {
  bucket = "quantumvest-algorithms-${var.environment}-${random_string.bucket_suffix.result}"
  
  tags = {
    Name        = "quantum-algorithms-storage"
    Environment = var.environment
    Component   = "Quantum-Algorithm-Storage"
  }
}

resource "aws_s3_bucket_encryption_configuration" "quantum_algorithms" {
  bucket = aws_s3_bucket.quantum_algorithms.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.quantum_encryption.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

# KMS Key for Quantum Data Encryption
resource "aws_kms_key" "quantum_encryption" {
  description             = "KMS key for quantum data encryption"
  deletion_window_in_days = 7
  
  tags = {
    Name        = "quantum-encryption-key"
    Environment = var.environment
    Component   = "Quantum-Encryption"
  }
}

resource "aws_kms_alias" "quantum_encryption" {
  name          = "alias/quantum-encryption-${var.environment}"
  target_key_id = aws_kms_key.quantum_encryption.key_id
}

# Security Groups
resource "aws_security_group" "quantum_db" {
  name_prefix = "quantum-db-"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "quantum-db-sg"
  }
}

resource "aws_security_group" "quantum_cache" {
  name_prefix = "quantum-cache-"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "quantum-cache-sg"
  }
}

# Subnet Groups
resource "aws_db_subnet_group" "quantum" {
  name       = "quantum-db-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = {
    Name = "quantum-db-subnet-group"
  }
}

resource "aws_elasticache_subnet_group" "quantum" {
  name       = "quantum-cache-subnet-group"
  subnet_ids = module.vpc.private_subnets
}

# IAM Role for RDS Enhanced Monitoring
resource "aws_iam_role" "rds_enhanced_monitoring" {
  name = "rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "rds_enhanced_monitoring" {
  role       = aws_iam_role.rds_enhanced_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# Random string for unique bucket naming
resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Variables
variable "aws_region" {
  description = "AWS region for quantum cloud deployment"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "db_username" {
  description = "Database username for quantum states"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password for quantum states"
  type        = string
  sensitive   = true
}

variable "redis_auth_token" {
  description = "Redis authentication token"
  type        = string
  sensitive   = true
}

# Outputs
output "eks_cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "quantum_db_endpoint" {
  description = "Quantum states database endpoint"
  value       = aws_rds_cluster.quantum_states.endpoint
  sensitive   = true
}

output "quantum_cache_endpoint" {
  description = "Quantum circuit cache endpoint"
  value       = aws_elasticache_replication_group.quantum_cache.configuration_endpoint_address
}
