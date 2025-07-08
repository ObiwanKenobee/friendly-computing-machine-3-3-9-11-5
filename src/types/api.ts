
// Core API response types
export interface APIResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Archetype Types
export type UserArchetype = 
  | 'visionary_ceo' | 'technical_cto' | 'data_scientist' | 'ai_researcher'
  | 'blockchain_developer' | 'security_architect' | 'product_manager' 
  | 'ux_designer' | 'devops_engineer' | 'compliance_officer' 
  | 'sales_director' | 'marketing_strategist' | 'customer_success' 
  | 'finance_controller' | 'operations_manager' | 'hr_specialist' 
  | 'legal_counsel' | 'investor_relations';

// Interaction Types
export type InteractionType = 
  | 'voice_command' | 'gesture_control' | 'brain_interface' | 'ar_interaction'
  | 'holographic_display' | 'haptic_feedback' | 'eye_tracking' | 'ai_assistant'
  | 'collaborative_whiteboard' | 'immersive_vr' | 'predictive_interface';

// Workspace Environment Types
export interface WorkspaceEnvironment {
  id: string;
  name: string;
  archetype: UserArchetype;
  environment_type: 'physical' | 'virtual' | 'hybrid' | 'augmented';
  capabilities: Record<string, any>;
  hardware_requirements: Record<string, any>;
  software_stack: Record<string, any>;
  interaction_modes: InteractionType[];
  created_at: string;
  updated_at: string;
}

// Interaction Session Types
export interface InteractionSession {
  id: string;
  user_id: string;
  session_type: InteractionType;
  workspace_id?: string;
  start_time: string;
  end_time?: string;
  interaction_data: Record<string, any>;
  biometric_data: Record<string, any>;
  performance_metrics: Record<string, any>;
  ai_insights: Record<string, any>;
  created_at: string;
}

// ML Experiment Types
export interface MLExperiment {
  id: string;
  model_id: string;
  experiment_name: string;
  researcher_id: string;
  hypothesis: string;
  parameters: Record<string, any>;
  dataset_info: Record<string, any>;
  results: Record<string, any>;
  status: 'running' | 'completed' | 'failed' | 'paused';
  compute_resources: Record<string, any>;
  cost_estimate: number;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

// Blockchain Innovation Types
export interface BlockchainInnovation {
  id: string;
  innovation_name: string;
  category: 'defi' | 'nft' | 'dao' | 'smart_contract' | 'consensus' | 'privacy' | 'scaling';
  developer_id: string;
  blockchain_network: string;
  technical_specs: Record<string, any>;
  economic_model: Record<string, any>;
  governance_structure: Record<string, any>;
  audit_status: 'pending' | 'in_progress' | 'completed' | 'failed';
  deployment_stage: 'concept' | 'testnet' | 'mainnet' | 'deprecated';
  community_adoption: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Knowledge Node Types
export interface KnowledgeNode {
  id: string;
  entity_type: 'concept' | 'technology' | 'process' | 'insight' | 'innovation';
  title: string;
  description: string;
  category: string;
  metadata: Record<string, any>;
  confidence_score: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Innovation Pipeline Types
export interface InnovationItem {
  id: string;
  innovation_title: string;
  description: string;
  innovator_id: string;
  stage: 'ideation' | 'research' | 'prototype' | 'testing' | 'scaling' | 'deployment' | 'optimization';
  technology_stack: Record<string, any>;
  market_potential: Record<string, any>;
  technical_feasibility: number;
  business_viability: number;
  impact_assessment: Record<string, any>;
  resource_requirements: Record<string, any>;
  timeline: Record<string, any>;
  stakeholders: string[];
  created_at: string;
  updated_at: string;
}

// Security Protocol Types
export interface SecurityProtocol {
  id: string;
  protocol_name: string;
  security_architect_id: string;
  protocol_type: 'authentication' | 'authorization' | 'encryption' | 'monitoring' | 'incident_response';
  threat_level: 'low' | 'medium' | 'high' | 'critical' | 'quantum_resistant';
  implementation_details: Record<string, any>;
  compliance_frameworks: Record<string, any>;
  testing_results: Record<string, any>;
  deployment_status: 'draft' | 'testing' | 'deployed' | 'deprecated';
  last_audit?: string;
  created_at: string;
  updated_at: string;
}

// Analytics Engine Types
export interface AnalyticsEngine {
  id: string;
  engine_name: string;
  analyst_id: string;
  data_sources: Record<string, any>;
  processing_algorithms: Record<string, any>;
  output_formats: Record<string, any>;
  real_time_capabilities: boolean;
  predictive_models: Record<string, any>;
  visualization_types: Record<string, any>;
  automation_level: 'manual' | 'semi_automated' | 'fully_automated' | 'ai_driven';
  performance_metrics: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Communication Channel Types
export interface CommunicationChannel {
  id: string;
  name: string;
  channel_type: 'voice' | 'video' | 'text' | 'holographic' | 'neural' | 'collaborative';
  participants: string[];
  archetype_restrictions?: UserArchetype[];
  encryption_level: 'basic' | 'military' | 'quantum';
  ai_moderation: boolean;
  real_time_translation: boolean;
  sentiment_analysis: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// API Request/Response Types
export interface BiometricAnalysisRequest {
  session_id: string;
  biometric_data: {
    heart_rate?: number;
    stress_level?: number;
    focus_score?: number;
    cognitive_load?: number;
    eye_tracking_data?: any;
    brain_activity?: any;
  };
}

export interface InsightGenerationRequest {
  query: string;
  context?: Record<string, any>;
  archetype?: UserArchetype;
  domain?: string;
}

export interface CollaborationRequest {
  innovation_id: string;
  required_archetypes: UserArchetype[];
  collaboration_type: 'research' | 'development' | 'testing' | 'deployment';
  timeline?: string;
  budget_constraints?: Record<string, any>;
}

export interface PredictiveAnalyticsRequest {
  data_sources: string[];
  prediction_type: 'market_trends' | 'user_behavior' | 'system_performance' | 'innovation_success';
  time_horizon: 'short_term' | 'medium_term' | 'long_term';
  archetype_context?: UserArchetype;
}
