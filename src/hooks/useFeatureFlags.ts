
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { API_CONFIG } from '@/config/api';

export interface FeatureFlags {
  voiceCommands: boolean;
  gestureControl: boolean;
  brainInterface: boolean;
  arInteraction: boolean;
  holographicDisplay: boolean;
  hapticFeedback: boolean;
  eyeTracking: boolean;
  quantumEncryption: boolean;
  neuralCollaboration: boolean;
  predictiveInterface: boolean;
  advancedAnalytics: boolean;
  realTimeCollaboration: boolean;
  aiAssistant: boolean;
  blockchainIntegration: boolean;
}

export const useFeatureFlags = () => {
  const { user } = useAuth();
  const [flags, setFlags] = useState<FeatureFlags>({
    voiceCommands: API_CONFIG.FEATURE_FLAGS.VOICE_COMMANDS,
    gestureControl: API_CONFIG.FEATURE_FLAGS.GESTURE_CONTROL,
    brainInterface: API_CONFIG.FEATURE_FLAGS.BRAIN_INTERFACE,
    arInteraction: API_CONFIG.FEATURE_FLAGS.AR_INTERACTION,
    holographicDisplay: API_CONFIG.FEATURE_FLAGS.HOLOGRAPHIC_DISPLAY,
    hapticFeedback: API_CONFIG.FEATURE_FLAGS.HAPTIC_FEEDBACK,
    eyeTracking: API_CONFIG.FEATURE_FLAGS.EYE_TRACKING,
    quantumEncryption: API_CONFIG.FEATURE_FLAGS.QUANTUM_ENCRYPTION,
    neuralCollaboration: API_CONFIG.FEATURE_FLAGS.NEURAL_COLLABORATION,
    predictiveInterface: API_CONFIG.FEATURE_FLAGS.PREDICTIVE_INTERFACE,
    advancedAnalytics: true,
    realTimeCollaboration: true,
    aiAssistant: true,
    blockchainIntegration: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch user-specific feature flags
    // from the backend based on their subscription, role, or A/B testing groups
    const loadFeatureFlags = async () => {
      try {
        if (user) {
          // Simulate API call to get user-specific flags
          // const response = await apiClient.request('/api/feature-flags');
          // setFlags(response.flags);
          
          // For now, use default flags based on user archetype
          const userArchetype = user.user_metadata?.archetype;
          if (userArchetype === 'visionary_ceo' || userArchetype === 'technical_cto') {
            setFlags(prev => ({
              ...prev,
              brainInterface: true,
              holographicDisplay: true,
              quantumEncryption: true,
              neuralCollaboration: true,
            }));
          }
        }
      } catch (error) {
        console.error('Error loading feature flags:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeatureFlags();
  }, [user]);

  const isEnabled = (feature: keyof FeatureFlags): boolean => {
    return flags[feature] || false;
  };

  const hasAnyEnabled = (features: (keyof FeatureFlags)[]): boolean => {
    return features.some(feature => flags[feature]);
  };

  const getEnabledFeatures = (): (keyof FeatureFlags)[] => {
    return Object.entries(flags)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => feature as keyof FeatureFlags);
  };

  return {
    flags,
    loading,
    isEnabled,
    hasAnyEnabled,
    getEnabledFeatures,
  };
};
