export const aiConfig = {
  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
    model: "gpt-4-turbo-preview",
    temperature: 0.7,
    maxTokens: 4000,
    endpoints: {
      chat: "https://api.openai.com/v1/chat/completions",
      embeddings: "https://api.openai.com/v1/embeddings",
    },
  },

  // Aladdin AI Configuration (BlackRock)
  aladdin: {
    apiKey: import.meta.env.VITE_ALADDIN_API_KEY || "",
    baseUrl:
      import.meta.env.VITE_ALADDIN_BASE_URL ||
      "https://api.aladdin.blackrock.com",
    version: "v1",
    endpoints: {
      riskAnalysis: "/risk/analysis",
      portfolioOptimization: "/portfolio/optimize",
      marketInsights: "/market/insights",
      esgScoring: "/esg/score",
    },
    timeout: 30000,
  },

  // Custom AI Models
  custom: {
    riskModelEndpoint: import.meta.env.VITE_RISK_MODEL_ENDPOINT || "",
    culturalScreeningEndpoint:
      import.meta.env.VITE_CULTURAL_SCREENING_ENDPOINT || "",
    marketSentimentEndpoint:
      import.meta.env.VITE_MARKET_SENTIMENT_ENDPOINT || "",
  },

  // AI Features Configuration
  features: {
    portfolioRecommendations: {
      enabled: true,
      refreshInterval: 3600000, // 1 hour
      confidenceThreshold: 0.7,
      maxRecommendations: 10,
    },
    riskAssessment: {
      enabled: true,
      refreshInterval: 1800000, // 30 minutes
      scenarios: ["market_crash", "inflation_spike", "geopolitical_risk"],
      monteCarloSims: 10000,
    },
    culturalScreening: {
      enabled: true,
      frameworks: ["islamic", "esg", "christian", "buddhist"],
      strictMode: false,
      customRules: true,
    },
    marketInsights: {
      enabled: true,
      sources: ["news", "social", "earnings", "economic"],
      languages: ["en", "ar", "zh", "es", "fr"],
      refreshInterval: 900000, // 15 minutes
    },
    chatbot: {
      enabled: true,
      model: "gpt-4-turbo-preview",
      systemPrompt: `You are a helpful financial advisor assistant for QuantumVest. 
        You provide culturally sensitive investment advice and help users understand 
        complex financial concepts. Always consider the user's cultural and religious 
        preferences when making recommendations.`,
      maxHistory: 10,
      temperature: 0.6,
    },
  },

  // Rate Limiting
  rateLimits: {
    openai: {
      requestsPerMinute: 60,
      tokensPerMinute: 150000,
    },
    aladdin: {
      requestsPerMinute: 100,
      requestsPerDay: 10000,
    },
    custom: {
      requestsPerMinute: 30,
    },
  },

  // Caching Configuration
  cache: {
    enabled: true,
    ttl: {
      recommendations: 3600, // 1 hour
      riskAssessment: 1800, // 30 minutes
      marketData: 300, // 5 minutes
      culturalScreening: 86400, // 24 hours
    },
    maxSize: 1000, // Maximum number of cached items
  },

  // Monitoring and Logging
  monitoring: {
    enabled: true,
    logLevel: "info",
    trackUsage: true,
    trackPerformance: true,
    alertThresholds: {
      errorRate: 0.05, // 5%
      responseTime: 5000, // 5 seconds
      accuracy: 0.8, // 80%
    },
  },
};

// Validation function for AI configuration
export const validateAIConfig = (): boolean => {
  const requiredKeys = ["openai.apiKey"];

  for (const key of requiredKeys) {
    const value = key.split(".").reduce((obj, k) => obj?.[k], aiConfig);
    if (!value) {
      console.warn(`Missing required AI configuration: ${key}`);
      return false;
    }
  }

  return true;
};

// Helper function to get API headers
export const getAIHeaders = (service: "openai" | "aladdin" | "custom") => {
  const baseHeaders = {
    "Content-Type": "application/json",
  };

  switch (service) {
    case "openai":
      return {
        ...baseHeaders,
        Authorization: `Bearer ${aiConfig.openai.apiKey}`,
      };
    case "aladdin":
      return {
        ...baseHeaders,
        "X-API-Key": aiConfig.aladdin.apiKey,
        "X-API-Version": aiConfig.aladdin.version,
      };
    case "custom":
      return baseHeaders;
    default:
      return baseHeaders;
  }
};

export default aiConfig;
