
import { z } from 'zod';
import type { UserArchetype, InteractionType } from '@/types/api';

// User schemas
export const userProfileSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  department: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
  archetype: z.enum([
    'visionary_ceo', 'technical_cto', 'data_scientist', 'ai_researcher',
    'blockchain_developer', 'security_architect', 'product_manager',
    'ux_designer', 'devops_engineer', 'compliance_officer',
    'sales_director', 'marketing_strategist', 'customer_success',
    'finance_controller', 'operations_manager', 'hr_specialist',
    'legal_counsel', 'investor_relations'
  ] as const).optional(),
});

// Interaction schemas
export const interactionSessionSchema = z.object({
  session_type: z.enum([
    'voice_command', 'gesture_control', 'brain_interface', 'ar_interaction',
    'holographic_display', 'haptic_feedback', 'eye_tracking', 'ai_assistant',
    'collaborative_whiteboard', 'immersive_vr', 'predictive_interface'
  ] as const),
  workspace_id: z.string().uuid().optional(),
  interaction_data: z.record(z.any()).optional(),
  biometric_data: z.record(z.any()).optional(),
});

// ML experiment schemas
export const mlExperimentSchema = z.object({
  model_id: z.string().uuid(),
  experiment_name: z.string().min(1, 'Experiment name is required').max(200),
  hypothesis: z.string().min(1, 'Hypothesis is required'),
  parameters: z.record(z.any()),
});

// Innovation schemas
export const innovationSchema = z.object({
  innovation_title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  stage: z.enum([
    'ideation', 'research', 'prototype', 'testing', 'scaling', 'deployment', 'optimization'
  ] as const),
  technology_stack: z.record(z.any()),
  market_potential: z.record(z.any()),
  technical_feasibility: z.number().min(0).max(100),
  business_viability: z.number().min(0).max(100),
});

// Security schemas
export const securityProtocolSchema = z.object({
  protocol_name: z.string().min(1, 'Protocol name is required').max(200),
  protocol_type: z.enum([
    'authentication', 'authorization', 'encryption', 'monitoring', 'incident_response'
  ] as const),
  threat_level: z.enum(['low', 'medium', 'high', 'critical', 'quantum_resistant'] as const),
  implementation_details: z.record(z.any()),
  compliance_frameworks: z.record(z.any()),
});

// Communication schemas
export const communicationChannelSchema = z.object({
  name: z.string().min(1, 'Channel name is required').max(100),
  channel_type: z.enum([
    'voice', 'video', 'text', 'holographic', 'neural', 'collaborative'
  ] as const),
  participants: z.array(z.string().uuid()),
  encryption_level: z.enum(['basic', 'military', 'quantum'] as const),
  ai_moderation: z.boolean(),
  real_time_translation: z.boolean(),
  sentiment_analysis: z.boolean(),
});

// API request schemas
export const biometricAnalysisSchema = z.object({
  session_id: z.string().uuid(),
  biometric_data: z.object({
    heart_rate: z.number().min(30).max(220).optional(),
    stress_level: z.number().min(0).max(100).optional(),
    focus_score: z.number().min(0).max(100).optional(),
    cognitive_load: z.number().min(0).max(100).optional(),
    eye_tracking_data: z.any().optional(),
    brain_activity: z.any().optional(),
  }),
});

export const insightGenerationSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  context: z.record(z.any()).optional(),
  archetype: z.enum([
    'visionary_ceo', 'technical_cto', 'data_scientist', 'ai_researcher',
    'blockchain_developer', 'security_architect', 'product_manager',
    'ux_designer', 'devops_engineer', 'compliance_officer',
    'sales_director', 'marketing_strategist', 'customer_success',
    'finance_controller', 'operations_manager', 'hr_specialist',
    'legal_counsel', 'investor_relations'
  ] as const).optional(),
  domain: z.string().optional(),
});

export const collaborationRequestSchema = z.object({
  innovation_id: z.string().uuid(),
  required_archetypes: z.array(z.enum([
    'visionary_ceo', 'technical_cto', 'data_scientist', 'ai_researcher',
    'blockchain_developer', 'security_architect', 'product_manager',
    'ux_designer', 'devops_engineer', 'compliance_officer',
    'sales_director', 'marketing_strategist', 'customer_success',
    'finance_controller', 'operations_manager', 'hr_specialist',
    'legal_counsel', 'investor_relations'
  ] as const)),
  collaboration_type: z.enum(['research', 'development', 'testing', 'deployment'] as const),
  timeline: z.string().optional(),
  budget_constraints: z.record(z.any()).optional(),
});
