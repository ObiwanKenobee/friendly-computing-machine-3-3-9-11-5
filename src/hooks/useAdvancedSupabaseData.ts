
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

// Types for the new database entities
export type UserArchetype = 'visionary_ceo' | 'technical_cto' | 'data_scientist' | 'ai_researcher' | 
  'blockchain_developer' | 'security_architect' | 'product_manager' | 'ux_designer' | 
  'devops_engineer' | 'compliance_officer' | 'sales_director' | 'marketing_strategist' | 
  'customer_success' | 'finance_controller' | 'operations_manager' | 'hr_specialist' | 
  'legal_counsel' | 'investor_relations';

export type InteractionType = 'voice_command' | 'gesture_control' | 'brain_interface' | 
  'ar_interaction' | 'holographic_display' | 'haptic_feedback' | 'eye_tracking' | 
  'ai_assistant' | 'collaborative_whiteboard' | 'immersive_vr' | 'predictive_interface';

// Hook for workspace environments
export const useWorkspaceEnvironments = () => {
  return useQuery({
    queryKey: ['workspace-environments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspace_environments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

// Hook for interaction sessions
export const useInteractionSessions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['interaction-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('interaction_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
};

// Hook for creating interaction sessions
export const useCreateInteractionSession = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (sessionData: {
      session_type: InteractionType;
      workspace_id?: string;
      interaction_data?: any;
      biometric_data?: any;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('interaction_sessions')
        .insert({
          user_id: user.id,
          ...sessionData
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interaction-sessions'] });
    }
  });
};

// Hook for knowledge nodes
export const useKnowledgeNodes = () => {
  return useQuery({
    queryKey: ['knowledge-nodes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_nodes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

// Hook for ML experiments
export const useMLExperiments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['ml-experiments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('ml_experiments')
        .select(`
          *,
          ai_models (
            name,
            model_type,
            status
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
};

// Hook for blockchain innovations
export const useBlockchainInnovations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['blockchain-innovations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('blockchain_innovations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
};

// Hook for innovation pipeline
export const useInnovationPipeline = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['innovation-pipeline', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('innovation_pipeline')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
};

// Hook for communication channels
export const useCommunicationChannels = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['communication-channels', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('communication_channels')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
};

// Hook for security protocols
export const useSecurityProtocols = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['security-protocols', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('security_protocols')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
};

// Hook for analytics engines
export const useAnalyticsEngines = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['analytics-engines', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('analytics_engines')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
};

// Hook for updating user archetype
export const useUpdateUserArchetype = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (archetype: UserArchetype) => {
      if (!user) throw new Error('User not authenticated');
      
      // First check if user profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (existingProfile) {
        // Update existing profile - only update archetype and updated_at
        const { data, error } = await supabase
          .from('user_profiles')
          .update({ 
            archetype,
            updated_at: new Date().toISOString() 
          })
          .eq('id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new profile with required fields
        const { data, error } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email || 'User',
            email: user.email || '',
            role: 'member',
            archetype,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    }
  });
};
