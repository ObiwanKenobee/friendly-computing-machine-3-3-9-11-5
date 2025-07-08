
export const API_CONFIG = {
  // Base configuration
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.quantumtech.com',
  SUPABASE_URL: 'https://jklewwlnrlzomkaetjjo.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGV3d2xucmx6b21rYWV0ampvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MTIxNDEsImV4cCI6MjA1MTk4ODE0MX0.8VjOmAuOnX3L6qYBWm5sUSxxu2jA-V-79g60LeFs5dE',
  
  // API endpoints configuration
  ENDPOINTS: {
    // Authentication & User Management
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile',
      ARCHETYPE: '/auth/archetype'
    },
    
    // Advanced Interaction Systems
    INTERACTIONS: {
      SESSIONS: '/api/interactions/sessions',
      BIOMETRIC: '/api/interactions/biometric',
      VOICE_COMMANDS: '/api/interactions/voice',
      GESTURE_CONTROL: '/api/interactions/gestures',
      BRAIN_INTERFACE: '/api/interactions/neural',
      AR_INTERFACE: '/api/interactions/ar',
      HOLOGRAPHIC: '/api/interactions/holographic',
      HAPTIC_FEEDBACK: '/api/interactions/haptic',
      EYE_TRACKING: '/api/interactions/eye-tracking',
      COLLABORATIVE_WHITEBOARD: '/api/interactions/whiteboard',
      IMMERSIVE_VR: '/api/interactions/vr',
      PREDICTIVE_INTERFACE: '/api/interactions/predictive'
    },
    
    // Workspace & Environment Management
    WORKSPACES: {
      ENVIRONMENTS: '/api/workspaces/environments',
      CONFIGURATIONS: '/api/workspaces/configurations',
      HARDWARE: '/api/workspaces/hardware',
      SOFTWARE_STACK: '/api/workspaces/software',
      CAPABILITIES: '/api/workspaces/capabilities'
    },
    
    // AI & Machine Learning Platform
    AI_ML: {
      MODELS: '/api/ml/models',
      EXPERIMENTS: '/api/ml/experiments',
      TRAINING: '/api/ml/training',
      INFERENCE: '/api/ml/inference',
      DATASETS: '/api/ml/datasets',
      PIPELINES: '/api/ml/pipelines',
      MONITORING: '/api/ml/monitoring',
      OPTIMIZATION: '/api/ml/optimization'
    },
    
    // Blockchain & Web3 Integration
    BLOCKCHAIN: {
      INNOVATIONS: '/api/blockchain/innovations',
      SMART_CONTRACTS: '/api/blockchain/contracts',
      CONSENSUS: '/api/blockchain/consensus',
      DEFI: '/api/blockchain/defi',
      NFT: '/api/blockchain/nft',
      DAO: '/api/blockchain/dao',
      PRIVACY: '/api/blockchain/privacy',
      SCALING: '/api/blockchain/scaling',
      AUDITS: '/api/blockchain/audits'
    },
    
    // Knowledge Graph & Intelligence
    KNOWLEDGE: {
      NODES: '/api/knowledge/nodes',
      RELATIONSHIPS: '/api/knowledge/relationships',
      INSIGHTS: '/api/knowledge/insights',
      DISCOVERY: '/api/knowledge/discovery',
      TRENDING: '/api/knowledge/trending',
      SEARCH: '/api/knowledge/search',
      RECOMMENDATIONS: '/api/knowledge/recommendations'
    },
    
    // Innovation Pipeline Management
    INNOVATION: {
      PIPELINE: '/api/innovation/pipeline',
      IDEATION: '/api/innovation/ideation',
      RESEARCH: '/api/innovation/research',
      PROTOTYPING: '/api/innovation/prototyping',
      TESTING: '/api/innovation/testing',
      SCALING: '/api/innovation/scaling',
      DEPLOYMENT: '/api/innovation/deployment',
      OPTIMIZATION: '/api/innovation/optimization',
      COLLABORATION: '/api/innovation/collaboration',
      METRICS: '/api/innovation/metrics'
    },
    
    // Security & Compliance
    SECURITY: {
      PROTOCOLS: '/api/security/protocols',
      AUDITS: '/api/security/audits',
      COMPLIANCE: '/api/security/compliance',
      MONITORING: '/api/security/monitoring',
      INCIDENTS: '/api/security/incidents',
      THREATS: '/api/security/threats',
      ENCRYPTION: '/api/security/encryption',
      QUANTUM_RESISTANCE: '/api/security/quantum'
    },
    
    // Analytics & Business Intelligence
    ANALYTICS: {
      ENGINES: '/api/analytics/engines',
      DASHBOARDS: '/api/analytics/dashboards',
      REPORTS: '/api/analytics/reports',
      REAL_TIME: '/api/analytics/real-time',
      PREDICTIVE: '/api/analytics/predictive',
      BEHAVIORAL: '/api/analytics/behavioral',
      PERFORMANCE: '/api/analytics/performance',
      MARKET: '/api/analytics/market'
    },
    
    // Communication & Collaboration
    COMMUNICATION: {
      CHANNELS: '/api/communication/channels',
      MESSAGES: '/api/communication/messages',
      VIDEO_CONF: '/api/communication/video',
      HOLOGRAPHIC_MEET: '/api/communication/holographic',
      NEURAL_LINK: '/api/communication/neural',
      TRANSLATION: '/api/communication/translation',
      SENTIMENT: '/api/communication/sentiment',
      MODERATION: '/api/communication/moderation'
    },
    
    // Project & Team Management
    PROJECTS: {
      LIST: '/api/projects',
      DETAILS: '/api/projects/:id',
      COLLABORATIONS: '/api/projects/:id/collaborations',
      RESOURCES: '/api/projects/:id/resources',
      TIMELINE: '/api/projects/:id/timeline',
      PERFORMANCE: '/api/projects/:id/performance'
    },
    
    // Edge Functions
    EDGE_FUNCTIONS: {
      INTERACTION_ANALYTICS: '/functions/v1/interaction-analytics',
      KNOWLEDGE_AI: '/functions/v1/knowledge-ai',
      INNOVATION_ORCHESTRATOR: '/functions/v1/innovation-orchestrator'
    }
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client-Version': '1.0.0',
      'X-Platform': 'QuantumTech-Enterprise'
    }
  },
  
  // WebSocket configuration for real-time features
  WEBSOCKET: {
    BASE_URL: 'wss://ws.quantumtech.com',
    CHANNELS: {
      USER_PRESENCE: '/ws/presence',
      COLLABORATION: '/ws/collaboration',
      NOTIFICATIONS: '/ws/notifications',
      REAL_TIME_ANALYTICS: '/ws/analytics',
      NEURAL_INTERFACE: '/ws/neural',
      HOLOGRAPHIC_SYNC: '/ws/holographic'
    },
    RECONNECT_INTERVAL: 5000,
    MAX_RECONNECT_ATTEMPTS: 10
  },
  
  // Rate limiting configuration
  RATE_LIMITS: {
    STANDARD: {
      requests: 1000,
      window: 3600000 // 1 hour
    },
    PREMIUM: {
      requests: 10000,
      window: 3600000
    },
    ENTERPRISE: {
      requests: 100000,
      window: 3600000
    }
  },
  
  // Feature flags for different archetypes
  FEATURE_FLAGS: {
    VOICE_COMMANDS: true,
    GESTURE_CONTROL: true,
    BRAIN_INTERFACE: false, // Beta feature
    AR_INTERACTION: true,
    HOLOGRAPHIC_DISPLAY: false, // Premium feature
    HAPTIC_FEEDBACK: true,
    EYE_TRACKING: true,
    QUANTUM_ENCRYPTION: false, // Enterprise only
    NEURAL_COLLABORATION: false, // Research phase
    PREDICTIVE_INTERFACE: true
  }
} as const;

export type APIEndpoints = typeof API_CONFIG.ENDPOINTS;
export type InteractionType = keyof typeof API_CONFIG.ENDPOINTS.INTERACTIONS;
export type AnalyticsType = keyof typeof API_CONFIG.ENDPOINTS.ANALYTICS;
