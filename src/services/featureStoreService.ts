import { singletonPattern } from "../utils/singletonPattern";

export interface Feature {
  id: string;
  name: string;
  description: string;
  dataType:
    | "numerical"
    | "categorical"
    | "text"
    | "boolean"
    | "datetime"
    | "json";
  group: string;
  tags: string[];
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "deprecated" | "draft";
  version: string;
  transformation?: string; // SQL or code for feature computation
  dependencies: string[]; // dependent feature IDs
  metadata: Record<string, any>;
}

export interface FeatureGroup {
  id: string;
  name: string;
  description: string;
  features: string[]; // feature IDs
  source: "database" | "stream" | "batch" | "api";
  schedule?: string; // cron expression for batch features
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeatureValue {
  featureId: string;
  entityId: string; // user ID, investment ID, etc.
  value: any;
  timestamp: Date;
  version: string;
}

export interface FeatureSet {
  id: string;
  name: string;
  description: string;
  features: string[]; // feature IDs
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  usageCount: number;
}

export interface FeatureStatistics {
  featureId: string;
  count: number;
  nullCount: number;
  uniqueCount: number;
  mean?: number;
  median?: number;
  std?: number;
  min?: any;
  max?: any;
  percentiles?: Record<string, number>;
  topValues?: Array<{ value: any; count: number }>;
  distributionType?: "normal" | "skewed" | "uniform" | "categorical";
  lastUpdated: Date;
}

export interface FeatureLineage {
  featureId: string;
  upstreamFeatures: string[];
  downstreamFeatures: string[];
  models: string[]; // model IDs using this feature
  transformations: Array<{
    type: string;
    description: string;
    code: string;
  }>;
}

export interface FeatureMonitoring {
  featureId: string;
  driftScore: number;
  qualityScore: number;
  freshnessScore: number;
  alerts: Array<{
    type: "drift" | "quality" | "freshness" | "anomaly";
    severity: "low" | "medium" | "high" | "critical";
    message: string;
    timestamp: Date;
    resolved: boolean;
  }>;
  lastChecked: Date;
}

class FeatureStoreService {
  private features: Map<string, Feature> = new Map();
  private featureGroups: Map<string, FeatureGroup> = new Map();
  private featureValues: Map<string, Map<string, FeatureValue[]>> = new Map(); // featureId -> entityId -> values[]
  private featureSets: Map<string, FeatureSet> = new Map();
  private featureStatistics: Map<string, FeatureStatistics> = new Map();
  private featureLineage: Map<string, FeatureLineage> = new Map();
  private featureMonitoring: Map<string, FeatureMonitoring> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize with investment-related features
    await this.createSampleFeatures();
    await this.generateSampleData();

    // Start monitoring
    this.startFeatureMonitoring();

    this.isInitialized = true;
    console.log(
      "Feature Store Service initialized with investment analytics features",
    );
  }

  private async createSampleFeatures(): Promise<void> {
    const sampleFeatures: Feature[] = [
      {
        id: "user-risk-tolerance",
        name: "User Risk Tolerance",
        description:
          "Calculated risk tolerance score based on user behavior and preferences",
        dataType: "numerical",
        group: "user-behavioral",
        tags: ["risk", "user", "behavioral"],
        owner: "data-team",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-03-20"),
        status: "active",
        version: "1.2.0",
        transformation:
          "SELECT calculate_risk_tolerance(age, income, investment_history, questionnaire_responses) FROM users",
        dependencies: [],
        metadata: {
          minValue: 0,
          maxValue: 100,
          unit: "score",
        },
      },
      {
        id: "portfolio-diversification",
        name: "Portfolio Diversification Index",
        description:
          "Measures how diversified a user portfolio is across asset classes",
        dataType: "numerical",
        group: "portfolio-metrics",
        tags: ["portfolio", "diversification", "risk"],
        owner: "quant-team",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-03-18"),
        status: "active",
        version: "2.0.0",
        transformation:
          "SELECT calculate_diversification_index(holdings) FROM portfolios",
        dependencies: ["portfolio-holdings", "asset-correlations"],
        metadata: {
          minValue: 0,
          maxValue: 1,
          interpretation: "Higher values indicate better diversification",
        },
      },
      {
        id: "market-sentiment-score",
        name: "Market Sentiment Score",
        description:
          "Real-time market sentiment derived from news and social media",
        dataType: "numerical",
        group: "market-data",
        tags: ["sentiment", "market", "nlp"],
        owner: "ml-team",
        createdAt: new Date("2024-02-15"),
        updatedAt: new Date("2024-03-25"),
        status: "active",
        version: "1.1.0",
        transformation:
          "SELECT aggregate_sentiment_score(news_sentiment, social_sentiment, analyst_sentiment)",
        dependencies: ["news-sentiment", "social-sentiment"],
        metadata: {
          minValue: -1,
          maxValue: 1,
          refreshInterval: "5m",
        },
      },
      {
        id: "esg-score",
        name: "ESG Score",
        description:
          "Environmental, Social, and Governance score for investments",
        dataType: "numerical",
        group: "sustainability",
        tags: ["esg", "sustainability", "impact"],
        owner: "impact-team",
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-03-22"),
        status: "active",
        version: "1.0.0",
        transformation:
          "SELECT weighted_esg_score(environmental_score, social_score, governance_score)",
        dependencies: [],
        metadata: {
          minValue: 0,
          maxValue: 100,
          categories: ["environmental", "social", "governance"],
        },
      },
      {
        id: "liquidity-ratio",
        name: "Portfolio Liquidity Ratio",
        description:
          "Percentage of portfolio that can be liquidated within 24 hours",
        dataType: "numerical",
        group: "portfolio-metrics",
        tags: ["liquidity", "portfolio", "risk"],
        owner: "risk-team",
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-03-15"),
        status: "active",
        version: "1.0.0",
        transformation:
          "SELECT calculate_liquidity_ratio(holdings, market_data)",
        dependencies: ["portfolio-holdings", "market-liquidity"],
        metadata: {
          minValue: 0,
          maxValue: 1,
          target: 0.3,
        },
      },
    ];

    for (const feature of sampleFeatures) {
      this.features.set(feature.id, feature);
    }

    // Create feature groups
    const groups: FeatureGroup[] = [
      {
        id: "user-behavioral",
        name: "User Behavioral Features",
        description: "Features derived from user behavior and preferences",
        features: ["user-risk-tolerance"],
        source: "batch",
        schedule: "0 2 * * *", // Daily at 2 AM
        owner: "data-team",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-03-20"),
      },
      {
        id: "portfolio-metrics",
        name: "Portfolio Metrics",
        description: "Calculated metrics for portfolio analysis",
        features: ["portfolio-diversification", "liquidity-ratio"],
        source: "batch",
        schedule: "0 */6 * * *", // Every 6 hours
        owner: "quant-team",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-03-18"),
      },
      {
        id: "market-data",
        name: "Market Data Features",
        description: "Real-time market-derived features",
        features: ["market-sentiment-score"],
        source: "stream",
        owner: "ml-team",
        createdAt: new Date("2024-02-15"),
        updatedAt: new Date("2024-03-25"),
      },
    ];

    for (const group of groups) {
      this.featureGroups.set(group.id, group);
    }
  }

  private async generateSampleData(): Promise<void> {
    const entityIds = [
      "user-001",
      "user-002",
      "user-003",
      "portfolio-001",
      "portfolio-002",
    ];

    for (const feature of this.features.values()) {
      const entityMap = new Map<string, FeatureValue[]>();

      for (const entityId of entityIds) {
        const values: FeatureValue[] = [];

        // Generate historical values
        for (let i = 0; i < 30; i++) {
          const timestamp = new Date();
          timestamp.setDate(timestamp.getDate() - i);

          let value: any;
          switch (feature.dataType) {
            case "numerical":
              const min = feature.metadata.minValue || 0;
              const max = feature.metadata.maxValue || 100;
              value = min + Math.random() * (max - min);
              break;
            case "categorical":
              const categories = feature.metadata.categories || ["A", "B", "C"];
              value = categories[Math.floor(Math.random() * categories.length)];
              break;
            case "boolean":
              value = Math.random() > 0.5;
              break;
            default:
              value = Math.random();
          }

          values.push({
            featureId: feature.id,
            entityId,
            value,
            timestamp,
            version: feature.version,
          });
        }

        entityMap.set(entityId, values);
      }

      this.featureValues.set(feature.id, entityMap);
    }

    // Generate feature statistics
    for (const feature of this.features.values()) {
      const allValues = Array.from(
        this.featureValues.get(feature.id)?.values() || [],
      )
        .flat()
        .map((fv) => fv.value);

      if (feature.dataType === "numerical" && allValues.length > 0) {
        const numValues = allValues.filter(
          (v) => typeof v === "number",
        ) as number[];

        if (numValues.length > 0) {
          const sorted = [...numValues].sort((a, b) => a - b);
          const mean = numValues.reduce((a, b) => a + b, 0) / numValues.length;
          const variance =
            numValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
            numValues.length;

          this.featureStatistics.set(feature.id, {
            featureId: feature.id,
            count: numValues.length,
            nullCount: allValues.length - numValues.length,
            uniqueCount: new Set(numValues).size,
            mean,
            median: sorted[Math.floor(sorted.length / 2)],
            std: Math.sqrt(variance),
            min: Math.min(...numValues),
            max: Math.max(...numValues),
            percentiles: {
              "25": sorted[Math.floor(sorted.length * 0.25)],
              "75": sorted[Math.floor(sorted.length * 0.75)],
              "95": sorted[Math.floor(sorted.length * 0.95)],
            },
            distributionType: "normal",
            lastUpdated: new Date(),
          });
        }
      }
    }
  }

  async createFeature(featureData: Partial<Feature>): Promise<Feature> {
    const feature: Feature = {
      id: `feature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: featureData.name || "Unnamed Feature",
      description: featureData.description || "",
      dataType: featureData.dataType || "numerical",
      group: featureData.group || "default",
      tags: featureData.tags || [],
      owner: featureData.owner || "unknown",
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
      version: "1.0.0",
      dependencies: featureData.dependencies || [],
      metadata: featureData.metadata || {},
      ...featureData,
    };

    this.features.set(feature.id, feature);
    return feature;
  }

  async updateFeature(
    featureId: string,
    updates: Partial<Feature>,
  ): Promise<Feature> {
    const feature = this.features.get(featureId);
    if (!feature) {
      throw new Error(`Feature ${featureId} not found`);
    }

    const updatedFeature = {
      ...feature,
      ...updates,
      updatedAt: new Date(),
    };

    this.features.set(featureId, updatedFeature);
    return updatedFeature;
  }

  async getFeature(featureId: string): Promise<Feature | null> {
    return this.features.get(featureId) || null;
  }

  async getFeatures(filters?: {
    group?: string;
    tags?: string[];
    owner?: string;
    status?: string;
    dataType?: string;
  }): Promise<Feature[]> {
    let features = Array.from(this.features.values());

    if (filters?.group) {
      features = features.filter((f) => f.group === filters.group);
    }

    if (filters?.tags) {
      features = features.filter((f) =>
        filters.tags!.some((tag) => f.tags.includes(tag)),
      );
    }

    if (filters?.owner) {
      features = features.filter((f) => f.owner === filters.owner);
    }

    if (filters?.status) {
      features = features.filter((f) => f.status === filters.status);
    }

    if (filters?.dataType) {
      features = features.filter((f) => f.dataType === filters.dataType);
    }

    return features.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    );
  }

  async getFeatureValues(
    featureId: string,
    entityId: string,
    limit = 100,
  ): Promise<FeatureValue[]> {
    const entityMap = this.featureValues.get(featureId);
    if (!entityMap) return [];

    const values = entityMap.get(entityId) || [];
    return values
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getLatestFeatureValue(
    featureId: string,
    entityId: string,
  ): Promise<FeatureValue | null> {
    const values = await this.getFeatureValues(featureId, entityId, 1);
    return values[0] || null;
  }

  async setFeatureValue(
    featureValue: Omit<FeatureValue, "timestamp">,
  ): Promise<void> {
    const value: FeatureValue = {
      ...featureValue,
      timestamp: new Date(),
    };

    let entityMap = this.featureValues.get(featureValue.featureId);
    if (!entityMap) {
      entityMap = new Map();
      this.featureValues.set(featureValue.featureId, entityMap);
    }

    let values = entityMap.get(featureValue.entityId) || [];
    values.unshift(value); // Add to beginning

    // Keep only last 1000 values per entity
    if (values.length > 1000) {
      values = values.slice(0, 1000);
    }

    entityMap.set(featureValue.entityId, values);
  }

  async getFeatureSet(featureSetId: string): Promise<FeatureSet | null> {
    return this.featureSets.get(featureSetId) || null;
  }

  async createFeatureSet(
    name: string,
    description: string,
    featureIds: string[],
  ): Promise<FeatureSet> {
    const featureSet: FeatureSet = {
      id: `featureset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      features: featureIds,
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: "current-user",
      usageCount: 0,
    };

    this.featureSets.set(featureSet.id, featureSet);
    return featureSet;
  }

  async getFeatureVector(
    featureSetId: string,
    entityId: string,
  ): Promise<Record<string, any>> {
    const featureSet = this.featureSets.get(featureSetId);
    if (!featureSet) {
      throw new Error(`Feature set ${featureSetId} not found`);
    }

    const vector: Record<string, any> = {};

    for (const featureId of featureSet.features) {
      const latestValue = await this.getLatestFeatureValue(featureId, entityId);
      vector[featureId] = latestValue?.value || null;
    }

    // Increment usage count
    featureSet.usageCount++;

    return vector;
  }

  async getFeatureStatistics(
    featureId: string,
  ): Promise<FeatureStatistics | null> {
    return this.featureStatistics.get(featureId) || null;
  }

  async getFeatureLineage(featureId: string): Promise<FeatureLineage | null> {
    return this.featureLineage.get(featureId) || null;
  }

  async computeFeatureDrift(
    featureId: string,
    referencePeriodDays = 30,
  ): Promise<number> {
    const values = Array.from(this.featureValues.get(featureId)?.values() || [])
      .flat()
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (values.length < 100) return 0; // Not enough data

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - referencePeriodDays);

    const recentValues = values
      .filter((v) => v.timestamp > cutoffDate)
      .map((v) => v.value);
    const historicalValues = values
      .filter((v) => v.timestamp <= cutoffDate)
      .map((v) => v.value);

    if (recentValues.length < 10 || historicalValues.length < 10) return 0;

    // Simple KL divergence approximation for drift detection
    const recentMean =
      recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const historicalMean =
      historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length;

    const recentStd = Math.sqrt(
      recentValues.reduce((a, b) => a + Math.pow(b - recentMean, 2), 0) /
        recentValues.length,
    );
    const historicalStd = Math.sqrt(
      historicalValues.reduce(
        (a, b) => a + Math.pow(b - historicalMean, 2),
        0,
      ) / historicalValues.length,
    );

    // Simplified drift score
    const meanDrift =
      Math.abs(recentMean - historicalMean) / (historicalStd || 1);
    const stdDrift = Math.abs(recentStd - historicalStd) / (historicalStd || 1);

    return Math.min(1, (meanDrift + stdDrift) / 2);
  }

  private startFeatureMonitoring(): void {
    setInterval(async () => {
      for (const feature of this.features.values()) {
        if (feature.status === "active") {
          const driftScore = await this.computeFeatureDrift(feature.id);
          const stats = this.featureStatistics.get(feature.id);

          const monitoring: FeatureMonitoring = {
            featureId: feature.id,
            driftScore,
            qualityScore: stats ? 1 - stats.nullCount / stats.count : 1,
            freshnessScore: this.calculateFreshnessScore(feature.id),
            alerts: [],
            lastChecked: new Date(),
          };

          // Check for alerts
          if (driftScore > 0.7) {
            monitoring.alerts.push({
              type: "drift",
              severity: driftScore > 0.9 ? "critical" : "high",
              message: `High feature drift detected (score: ${driftScore.toFixed(3)})`,
              timestamp: new Date(),
              resolved: false,
            });
          }

          if (monitoring.qualityScore < 0.8) {
            monitoring.alerts.push({
              type: "quality",
              severity: monitoring.qualityScore < 0.5 ? "critical" : "medium",
              message: `Low data quality detected (score: ${monitoring.qualityScore.toFixed(3)})`,
              timestamp: new Date(),
              resolved: false,
            });
          }

          this.featureMonitoring.set(feature.id, monitoring);
        }
      }
    }, 300000); // Every 5 minutes
  }

  private calculateFreshnessScore(featureId: string): number {
    const entityMap = this.featureValues.get(featureId);
    if (!entityMap) return 0;

    const allValues = Array.from(entityMap.values()).flat();
    if (allValues.length === 0) return 0;

    const latestTimestamp = Math.max(
      ...allValues.map((v) => v.timestamp.getTime()),
    );
    const hoursSinceUpdate = (Date.now() - latestTimestamp) / (1000 * 60 * 60);

    // Score decreases as data gets older
    return Math.max(0, 1 - hoursSinceUpdate / 24); // Full score if updated within last hour, 0 if older than 24 hours
  }

  async getFeatureMonitoring(featureId?: string): Promise<FeatureMonitoring[]> {
    if (featureId) {
      const monitoring = this.featureMonitoring.get(featureId);
      return monitoring ? [monitoring] : [];
    }

    return Array.from(this.featureMonitoring.values());
  }

  async searchFeatures(query: string): Promise<Feature[]> {
    const lowercaseQuery = query.toLowerCase();

    return Array.from(this.features.values()).filter(
      (feature) =>
        feature.name.toLowerCase().includes(lowercaseQuery) ||
        feature.description.toLowerCase().includes(lowercaseQuery) ||
        feature.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    );
  }

  async getPopularFeatures(
    limit = 10,
  ): Promise<Array<{ feature: Feature; usageCount: number }>> {
    // This would typically come from usage analytics
    const features = Array.from(this.features.values())
      .map((feature) => ({
        feature,
        usageCount: Math.floor(Math.random() * 1000),
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);

    return features;
  }
}

export const featureStoreService = singletonPattern(
  () => new FeatureStoreService(),
);
