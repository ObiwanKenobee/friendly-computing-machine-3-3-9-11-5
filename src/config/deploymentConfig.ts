/**
 * Deployment Configuration for Hobby/Pro/Enterprise Plans
 * Provides adaptive configuration that works within hobby constraints
 * while being ready for multi-region scaling
 */

export interface DeploymentRegion {
  id: string;
  name: string;
  code: string;
  primary: boolean;
  available: boolean;
  latency?: number;
}

export interface DeploymentConfig {
  plan: "hobby" | "pro" | "enterprise";
  regions: DeploymentRegion[];
  serverless: {
    provider: "vercel" | "supabase" | "hybrid";
    regions: string[];
    edgeFunctions: boolean;
    customDomains: boolean;
  };
  features: {
    multiRegion: boolean;
    edgeOptimization: boolean;
    customMiddleware: boolean;
    advancedAnalytics: boolean;
  };
}

// Available regions (mapped to both Vercel and Supabase regions)
export const AVAILABLE_REGIONS: DeploymentRegion[] = [
  {
    id: "us-east-1",
    name: "US East (Virginia)",
    code: "iad1",
    primary: true,
    available: true,
  },
  {
    id: "us-west-2",
    name: "US West (Oregon)",
    code: "sfo1",
    primary: false,
    available: true,
  },
  {
    id: "eu-west-1",
    name: "Europe (London)",
    code: "lhr1",
    primary: false,
    available: true,
  },
  {
    id: "ap-southeast-1",
    name: "Asia Pacific (Singapore)",
    code: "sin1",
    primary: false,
    available: false,
  },
  {
    id: "ap-northeast-1",
    name: "Asia Pacific (Tokyo)",
    code: "nrt1",
    primary: false,
    available: false,
  },
];

// Plan-specific configurations
export const DEPLOYMENT_CONFIGS: Record<string, DeploymentConfig> = {
  hobby: {
    plan: "hobby",
    regions: AVAILABLE_REGIONS.filter((r) => r.primary), // Single region only
    serverless: {
      provider: "hybrid",
      regions: ["us-east-1"],
      edgeFunctions: true,
      customDomains: false,
    },
    features: {
      multiRegion: false,
      edgeOptimization: true, // Can still optimize for single region
      customMiddleware: false,
      advancedAnalytics: false,
    },
  },
  pro: {
    plan: "pro",
    regions: AVAILABLE_REGIONS.filter((r) => r.available),
    serverless: {
      provider: "hybrid",
      regions: ["us-east-1", "us-west-2", "eu-west-1"],
      edgeFunctions: true,
      customDomains: true,
    },
    features: {
      multiRegion: true,
      edgeOptimization: true,
      customMiddleware: true,
      advancedAnalytics: true,
    },
  },
  enterprise: {
    plan: "enterprise",
    regions: AVAILABLE_REGIONS,
    serverless: {
      provider: "hybrid",
      regions: AVAILABLE_REGIONS.map((r) => r.id),
      edgeFunctions: true,
      customDomains: true,
    },
    features: {
      multiRegion: true,
      edgeOptimization: true,
      customMiddleware: true,
      advancedAnalytics: true,
    },
  },
};

// Dynamic configuration based on detected plan
export function getDeploymentConfig(): DeploymentConfig {
  const planType = import.meta.env.VITE_DEPLOYMENT_PLAN || "hobby";
  return DEPLOYMENT_CONFIGS[planType] || DEPLOYMENT_CONFIGS.hobby;
}

// Edge function deployment strategy
export interface EdgeFunctionConfig {
  name: string;
  region: string;
  provider: "supabase" | "vercel";
  fallback?: string;
  caching: boolean;
}

export const EDGE_FUNCTION_STRATEGIES: Record<string, EdgeFunctionConfig[]> = {
  hobby: [
    {
      name: "interaction-analytics",
      region: "us-east-1",
      provider: "supabase",
      caching: true,
    },
    {
      name: "knowledge-ai",
      region: "us-east-1",
      provider: "supabase",
      caching: true,
    },
    {
      name: "innovation-orchestrator",
      region: "us-east-1",
      provider: "supabase",
      caching: true,
    },
  ],
  pro: [
    {
      name: "interaction-analytics",
      region: "us-east-1",
      provider: "supabase",
      fallback: "us-west-2",
      caching: true,
    },
    {
      name: "knowledge-ai",
      region: "us-west-2",
      provider: "supabase",
      fallback: "us-east-1",
      caching: true,
    },
    {
      name: "innovation-orchestrator",
      region: "eu-west-1",
      provider: "supabase",
      fallback: "us-east-1",
      caching: true,
    },
  ],
  enterprise: [
    {
      name: "interaction-analytics",
      region: "us-east-1",
      provider: "vercel",
      fallback: "us-west-2",
      caching: true,
    },
    {
      name: "knowledge-ai",
      region: "us-west-2",
      provider: "vercel",
      fallback: "eu-west-1",
      caching: true,
    },
    {
      name: "innovation-orchestrator",
      region: "eu-west-1",
      provider: "vercel",
      fallback: "ap-southeast-1",
      caching: true,
    },
  ],
};

// Load balancing strategy for hobby plan
export interface LoadBalancingConfig {
  strategy: "round-robin" | "least-latency" | "geographic" | "single-region";
  fallbackBehavior: "queue" | "cache" | "degrade";
  retryAttempts: number;
  timeout: number;
}

export const LOAD_BALANCING_CONFIGS: Record<string, LoadBalancingConfig> = {
  hobby: {
    strategy: "single-region",
    fallbackBehavior: "cache",
    retryAttempts: 3,
    timeout: 15000,
  },
  pro: {
    strategy: "least-latency",
    fallbackBehavior: "queue",
    retryAttempts: 5,
    timeout: 30000,
  },
  enterprise: {
    strategy: "geographic",
    fallbackBehavior: "queue",
    retryAttempts: 10,
    timeout: 45000,
  },
};

// Caching strategy for different plans
export interface CachingConfig {
  enableEdgeCache: boolean;
  enableBrowserCache: boolean;
  enableDatabaseCache: boolean;
  ttl: {
    static: number;
    api: number;
    dynamic: number;
  };
}

export const CACHING_CONFIGS: Record<string, CachingConfig> = {
  hobby: {
    enableEdgeCache: true,
    enableBrowserCache: true,
    enableDatabaseCache: false,
    ttl: {
      static: 86400, // 24 hours
      api: 300, // 5 minutes
      dynamic: 60, // 1 minute
    },
  },
  pro: {
    enableEdgeCache: true,
    enableBrowserCache: true,
    enableDatabaseCache: true,
    ttl: {
      static: 86400, // 24 hours
      api: 600, // 10 minutes
      dynamic: 120, // 2 minutes
    },
  },
  enterprise: {
    enableEdgeCache: true,
    enableBrowserCache: true,
    enableDatabaseCache: true,
    ttl: {
      static: 259200, // 3 days
      api: 1800, // 30 minutes
      dynamic: 300, // 5 minutes
    },
  },
};

export function getCurrentConfig() {
  const plan = import.meta.env.VITE_DEPLOYMENT_PLAN || "hobby";
  return {
    deployment: getDeploymentConfig(),
    edgeFunctions:
      EDGE_FUNCTION_STRATEGIES[plan] || EDGE_FUNCTION_STRATEGIES.hobby,
    loadBalancing: LOAD_BALANCING_CONFIGS[plan] || LOAD_BALANCING_CONFIGS.hobby,
    caching: CACHING_CONFIGS[plan] || CACHING_CONFIGS.hobby,
  };
}
