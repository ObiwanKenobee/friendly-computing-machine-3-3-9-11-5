export const databaseConfig = {
  // Primary Database (Supabase)
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
    serviceRoleKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY || "",
    schema: "public",
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true,
      flowType: "pkce",
    },
    realtime: {
      enabled: true,
      heartbeatIntervalMs: 30000,
      reconnectAfterMs: (attempts: number) => Math.min(attempts * 1000, 30000),
    },
  },

  // Cache Configuration (Redis/Memory)
  cache: {
    type: "memory", // 'redis' | 'memory'
    redis: {
      url: import.meta.env.VITE_REDIS_URL || "",
      password: import.meta.env.VITE_REDIS_PASSWORD || "",
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    },
    memory: {
      maxSize: 1000,
      ttl: 3600, // 1 hour default
    },
    settings: {
      defaultTTL: 3600, // 1 hour
      keyPrefix: "quantumvest:",
      compression: true,
    },
  },

  // Database Tables Schema
  tables: {
    // User Management
    users: {
      name: "users",
      columns: [
        "id",
        "email",
        "username",
        "first_name",
        "last_name",
        "avatar_url",
        "date_of_birth",
        "country",
        "language",
        "currency",
        "timezone",
        "cultural_framework",
        "risk_tolerance",
        "investment_experience",
        "annual_income",
        "net_worth",
        "kyc_status",
        "kyc_documents",
        "verification_level",
        "created_at",
        "updated_at",
        "last_login",
      ],
    },

    // Portfolio Management
    portfolios: {
      name: "portfolios",
      columns: [
        "id",
        "user_id",
        "name",
        "description",
        "type",
        "total_value",
        "available_cash",
        "invested_amount",
        "unrealized_pnl",
        "realized_pnl",
        "allocation_strategy",
        "risk_score",
        "performance_metrics",
        "benchmark",
        "created_at",
        "updated_at",
      ],
    },

    holdings: {
      name: "holdings",
      columns: [
        "id",
        "portfolio_id",
        "asset_id",
        "asset_type",
        "symbol",
        "quantity",
        "average_cost",
        "current_price",
        "market_value",
        "unrealized_pnl",
        "weight",
        "acquisition_date",
        "last_updated",
      ],
    },

    // Investment Products
    tokenized_assets: {
      name: "tokenized_assets",
      columns: [
        "id",
        "name",
        "symbol",
        "description",
        "asset_type",
        "total_supply",
        "available_supply",
        "price_per_token",
        "currency",
        "min_investment",
        "contract_address",
        "blockchain",
        "metadata",
        "performance_data",
        "compliance_info",
        "created_at",
        "updated_at",
      ],
    },

    crowdfunding_projects: {
      name: "crowdfunding_projects",
      columns: [
        "id",
        "title",
        "description",
        "category",
        "organizer_id",
        "target_amount",
        "current_amount",
        "currency",
        "start_date",
        "end_date",
        "status",
        "min_investment",
        "max_investment",
        "expected_return",
        "risk_level",
        "cultural_tags",
        "location",
        "images",
        "documents",
        "created_at",
        "updated_at",
      ],
    },

    perpetual_funds: {
      name: "perpetual_funds",
      columns: [
        "id",
        "name",
        "description",
        "strategy",
        "manager_id",
        "aum",
        "nav",
        "inception_date",
        "performance_data",
        "fee_structure",
        "min_investment",
        "currency",
        "benchmark",
        "allocations",
        "compliance_data",
        "created_at",
        "updated_at",
      ],
    },

    // Risk Management
    risk_assessments: {
      name: "risk_assessments",
      columns: [
        "id",
        "user_id",
        "portfolio_id",
        "overall_risk_score",
        "risk_grade",
        "assessment_date",
        "risk_factors",
        "metrics",
        "recommendations",
        "scenario_analysis",
        "compliance_risk",
        "created_at",
      ],
    },

    // Cultural Investments
    cultural_investments: {
      name: "cultural_investments",
      columns: [
        "id",
        "name",
        "description",
        "framework_type",
        "screening_criteria",
        "compliance_score",
        "compliance_grade",
        "certification_data",
        "performance_metrics",
        "community_data",
        "created_at",
        "updated_at",
      ],
    },

    // Community Funds
    community_funds: {
      name: "community_funds",
      columns: [
        "id",
        "name",
        "description",
        "community_profile",
        "governance_structure",
        "funding_structure",
        "total_members",
        "total_projects",
        "performance_data",
        "impact_metrics",
        "created_at",
        "updated_at",
      ],
    },

    community_projects: {
      name: "community_projects",
      columns: [
        "id",
        "fund_id",
        "title",
        "description",
        "category",
        "budget",
        "spent",
        "status",
        "timeline",
        "stakeholders",
        "milestones",
        "impact_data",
        "created_at",
        "updated_at",
      ],
    },

    // AI and Analytics
    ai_recommendations: {
      name: "ai_recommendations",
      columns: [
        "id",
        "user_id",
        "type",
        "asset",
        "confidence",
        "reasoning",
        "expected_return",
        "risk_score",
        "time_horizon",
        "cultural_compliance",
        "status",
        "created_at",
        "expires_at",
      ],
    },

    market_insights: {
      name: "market_insights",
      columns: [
        "id",
        "title",
        "summary",
        "category",
        "impact",
        "relevant_assets",
        "confidence",
        "source",
        "tags",
        "created_at",
      ],
    },

    // Transactions and Orders
    transactions: {
      name: "transactions",
      columns: [
        "id",
        "user_id",
        "portfolio_id",
        "type",
        "asset_id",
        "quantity",
        "price",
        "total_amount",
        "fee",
        "currency",
        "status",
        "settlement_date",
        "order_id",
        "notes",
        "created_at",
      ],
    },

    // Wallets and Payments
    wallets: {
      name: "wallets",
      columns: [
        "id",
        "user_id",
        "type",
        "addresses",
        "balances",
        "settings",
        "security_settings",
        "created_at",
        "updated_at",
      ],
    },

    // Education and Literacy
    educational_content: {
      name: "educational_content",
      columns: [
        "id",
        "title",
        "description",
        "content",
        "type",
        "category",
        "difficulty_level",
        "duration",
        "language",
        "cultural_context",
        "tags",
        "author_id",
        "status",
        "views",
        "ratings",
        "created_at",
        "updated_at",
      ],
    },

    user_progress: {
      name: "user_progress",
      columns: [
        "id",
        "user_id",
        "content_id",
        "status",
        "progress",
        "score",
        "time_spent",
        "completed_at",
        "created_at",
      ],
    },

    // Notifications and Communications
    notifications: {
      name: "notifications",
      columns: [
        "id",
        "user_id",
        "title",
        "message",
        "type",
        "category",
        "priority",
        "status",
        "data",
        "sent_at",
        "read_at",
        "created_at",
      ],
    },

    // System and Audit
    audit_logs: {
      name: "audit_logs",
      columns: [
        "id",
        "user_id",
        "action",
        "entity_type",
        "entity_id",
        "old_data",
        "new_data",
        "ip_address",
        "user_agent",
        "session_id",
        "created_at",
      ],
    },

    system_settings: {
      name: "system_settings",
      columns: [
        "id",
        "key",
        "value",
        "type",
        "description",
        "category",
        "is_public",
        "created_at",
        "updated_at",
      ],
    },
  },

  // Indexes for Performance
  indexes: {
    users: ["email", "username", "kyc_status", "created_at"],
    portfolios: ["user_id", "type", "created_at"],
    holdings: ["portfolio_id", "asset_id", "asset_type"],
    tokenized_assets: ["symbol", "asset_type", "blockchain", "status"],
    crowdfunding_projects: ["category", "status", "end_date", "cultural_tags"],
    transactions: ["user_id", "portfolio_id", "type", "created_at", "status"],
    ai_recommendations: ["user_id", "type", "created_at", "expires_at"],
    market_insights: ["category", "created_at", "impact"],
  },

  // Real-time Subscriptions
  subscriptions: {
    portfolioUpdates: {
      table: "portfolios",
      event: "*",
      filter: "user_id=eq.{userId}",
    },
    holdingsUpdates: {
      table: "holdings",
      event: "*",
      filter: "portfolio_id=in.({portfolioIds})",
    },
    transactionUpdates: {
      table: "transactions",
      event: "*",
      filter: "user_id=eq.{userId}",
    },
    aiRecommendations: {
      table: "ai_recommendations",
      event: "INSERT",
      filter: "user_id=eq.{userId}",
    },
    marketInsights: {
      table: "market_insights",
      event: "INSERT",
      filter: null,
    },
    notifications: {
      table: "notifications",
      event: "INSERT",
      filter: "user_id=eq.{userId}",
    },
  },

  // Connection Pool Settings
  connectionPool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  },

  // Backup and Recovery
  backup: {
    enabled: true,
    frequency: "daily", // 'hourly' | 'daily' | 'weekly'
    retention: {
      daily: 30, // Keep 30 daily backups
      weekly: 12, // Keep 12 weekly backups
      monthly: 12, // Keep 12 monthly backups
    },
    compression: true,
    encryption: true,
  },

  // Performance Monitoring
  monitoring: {
    slowQueryThreshold: 1000, // milliseconds
    logQueries: import.meta.env.NODE_ENV === "development",
    enableMetrics: true,
    metricsInterval: 60000, // 1 minute
  },

  // Data Retention Policies
  retention: {
    auditLogs: 2592000000, // 30 days
    marketInsights: 7776000000, // 90 days
    notifications: 2592000000, // 30 days
    aiRecommendations: 604800000, // 7 days
    userSessions: 86400000, // 1 day
  },
};

// Helper Functions
export const getTableConfig = (tableName: string) => {
  return databaseConfig.tables[tableName as keyof typeof databaseConfig.tables];
};

export const getSubscriptionConfig = (subscription: string) => {
  return databaseConfig.subscriptions[
    subscription as keyof typeof databaseConfig.subscriptions
  ];
};

export const buildSubscriptionFilter = (
  subscription: string,
  params: Record<string, any>,
) => {
  const config = getSubscriptionConfig(subscription);
  if (!config?.filter) return null;

  let filter = config.filter;
  Object.entries(params).forEach(([key, value]) => {
    filter = filter.replace(`{${key}}`, value);
  });

  return filter;
};

export const getIndexes = (tableName: string): string[] => {
  return (
    databaseConfig.indexes[tableName as keyof typeof databaseConfig.indexes] ||
    []
  );
};

export default databaseConfig;
