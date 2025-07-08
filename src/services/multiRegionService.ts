import { singletonPattern } from "../utils/singletonPattern";

export interface Region {
  id: string;
  name: string;
  code: string; // ISO country code
  continent: string;
  status: "active" | "expanding" | "planning" | "launched" | "suspended";
  infrastructure: {
    cdnEndpoints: string[];
    datacenters: string[];
    edgeLocations: number;
    bandwidth: number; // Gbps
    latency: number; // ms to nearest major city
  };
  metrics: {
    users: number;
    revenue: number; // USD
    growth: number; // percentage
    uptime: number; // percentage
    errorRate: number; // percentage
  };
  compliance: {
    score: number; // 0-100
    regulations: string[];
    certifications: string[];
    lastAudit: Date;
    nextAudit: Date;
  };
  localization: {
    progress: number; // 0-100
    languages: string[];
    currencies: string[];
    culturalFeatures: string[];
  };
  businessMetrics: {
    marketPenetration: number; // percentage
    competitorAnalysis: Record<string, number>;
    seasonalTrends: Array<{ month: string; multiplier: number }>;
    userSegmentation: Record<string, number>;
  };
  launchDate: Date;
  lastUpdated: Date;
}

export interface RegionExpansionPlan {
  id: string;
  targetRegion: string;
  status: "planning" | "in_progress" | "review" | "approved" | "launched";
  timeline: {
    planning: { start: Date; end: Date; completed: boolean };
    infrastructure: { start: Date; end: Date; completed: boolean };
    localization: { start: Date; end: Date; completed: boolean };
    compliance: { start: Date; end: Date; completed: boolean };
    launch: { start: Date; end: Date; completed: boolean };
  };
  budget: {
    total: number;
    spent: number;
    allocated: Record<string, number>;
  };
  risks: Array<{
    type: "technical" | "regulatory" | "market" | "cultural" | "financial";
    description: string;
    probability: number; // 0-100
    impact: number; // 0-100
    mitigation: string;
  }>;
  stakeholders: Array<{
    name: string;
    role: string;
    responsibility: string;
    contact: string;
  }>;
  milestones: Array<{
    name: string;
    dueDate: Date;
    completed: boolean;
    description: string;
  }>;
}

export interface CDNMetrics {
  endpoint: string;
  region: string;
  requests: number;
  bandwidth: number; // GB
  cacheHitRate: number; // percentage
  avgResponseTime: number; // ms
  errors: number;
  uptime: number; // percentage
}

export interface EdgeLocation {
  id: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  status: "active" | "maintenance" | "offline";
  capacity: number; // requests per second
  utilization: number; // percentage
  connectedRegions: string[];
}

class MultiRegionService {
  private regions: Map<string, Region> = new Map();
  private expansionPlans: Map<string, RegionExpansionPlan> = new Map();
  private cdnMetrics: Map<string, CDNMetrics> = new Map();
  private edgeLocations: Map<string, EdgeLocation> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize with sample regions
    await this.createSampleRegions();
    await this.createSampleExpansionPlans();
    await this.initializeCDNMetrics();
    await this.initializeEdgeLocations();

    // Start monitoring services
    this.startRegionMonitoring();
    this.startPerformanceTracking();

    this.isInitialized = true;
    console.log(
      "Multi-Region Service initialized with global infrastructure management",
    );
  }

  private async createSampleRegions(): Promise<void> {
    const sampleRegions: Region[] = [
      {
        id: "us-east",
        name: "United States East",
        code: "US",
        continent: "North America",
        status: "active",
        infrastructure: {
          cdnEndpoints: [
            "us-east-1.quantumvest.io",
            "us-east-2.quantumvest.io",
          ],
          datacenters: ["Virginia", "New York", "Florida"],
          edgeLocations: 25,
          bandwidth: 100,
          latency: 15,
        },
        metrics: {
          users: 45680,
          revenue: 2800000,
          growth: 12.3,
          uptime: 99.97,
          errorRate: 0.03,
        },
        compliance: {
          score: 98,
          regulations: ["SOX", "CCPA", "FINRA"],
          certifications: ["SOC2", "ISO27001", "PCI-DSS"],
          lastAudit: new Date("2024-02-15"),
          nextAudit: new Date("2024-08-15"),
        },
        localization: {
          progress: 100,
          languages: ["en-US", "es-US"],
          currencies: ["USD"],
          culturalFeatures: [
            "US Tax Integration",
            "SEC Compliance",
            "401k Support",
          ],
        },
        businessMetrics: {
          marketPenetration: 15.2,
          competitorAnalysis: {
            Robinhood: 25,
            "E*TRADE": 18,
            "TD Ameritrade": 22,
          },
          seasonalTrends: [
            { month: "Q1", multiplier: 1.2 },
            { month: "Q2", multiplier: 0.9 },
            { month: "Q3", multiplier: 0.8 },
            { month: "Q4", multiplier: 1.1 },
          ],
          userSegmentation: { Retail: 65, Professional: 25, Institutional: 10 },
        },
        launchDate: new Date("2023-01-15"),
        lastUpdated: new Date(),
      },
      {
        id: "eu-west",
        name: "European Union",
        code: "EU",
        continent: "Europe",
        status: "active",
        infrastructure: {
          cdnEndpoints: [
            "eu-west-1.quantumvest.io",
            "eu-central-1.quantumvest.io",
          ],
          datacenters: ["Frankfurt", "Amsterdam", "Dublin"],
          edgeLocations: 32,
          bandwidth: 80,
          latency: 12,
        },
        metrics: {
          users: 28940,
          revenue: 1950000,
          growth: 8.7,
          uptime: 99.95,
          errorRate: 0.05,
        },
        compliance: {
          score: 96,
          regulations: ["GDPR", "MiFID II", "PSD2"],
          certifications: ["SOC2", "ISO27001", "CISPE"],
          lastAudit: new Date("2024-01-20"),
          nextAudit: new Date("2024-07-20"),
        },
        localization: {
          progress: 95,
          languages: ["en-GB", "de-DE", "fr-FR", "es-ES", "it-IT"],
          currencies: ["EUR", "GBP", "CHF"],
          culturalFeatures: ["SEPA Payments", "EU Passport", "VAT Integration"],
        },
        businessMetrics: {
          marketPenetration: 8.5,
          competitorAnalysis: { Trading212: 15, eToro: 20, Degiro: 12 },
          seasonalTrends: [
            { month: "Q1", multiplier: 1.0 },
            { month: "Q2", multiplier: 1.1 },
            { month: "Q3", multiplier: 0.7 },
            { month: "Q4", multiplier: 1.2 },
          ],
          userSegmentation: { Retail: 70, Professional: 20, Institutional: 10 },
        },
        launchDate: new Date("2023-03-01"),
        lastUpdated: new Date(),
      },
      {
        id: "africa-west",
        name: "West Africa",
        code: "NG",
        continent: "Africa",
        status: "expanding",
        infrastructure: {
          cdnEndpoints: ["africa-west-1.quantumvest.io"],
          datacenters: ["Lagos", "Accra"],
          edgeLocations: 8,
          bandwidth: 25,
          latency: 45,
        },
        metrics: {
          users: 18750,
          revenue: 650000,
          growth: 35.2,
          uptime: 99.8,
          errorRate: 0.2,
        },
        compliance: {
          score: 82,
          regulations: ["NDPR", "GDPR", "CBN Guidelines"],
          certifications: ["ISO27001"],
          lastAudit: new Date("2024-03-01"),
          nextAudit: new Date("2024-09-01"),
        },
        localization: {
          progress: 78,
          languages: ["en-NG", "ha-NG", "yo-NG", "ig-NG"],
          currencies: ["NGN", "GHS", "USD"],
          culturalFeatures: [
            "Mobile Money",
            "Islamic Banking",
            "Community Funds",
          ],
        },
        businessMetrics: {
          marketPenetration: 2.1,
          competitorAnalysis: { Piggyvest: 30, Bamboo: 15, Risevest: 20 },
          seasonalTrends: [
            { month: "Q1", multiplier: 0.9 },
            { month: "Q2", multiplier: 1.3 },
            { month: "Q3", multiplier: 1.1 },
            { month: "Q4", multiplier: 0.7 },
          ],
          userSegmentation: { Retail: 85, Professional: 12, Institutional: 3 },
        },
        launchDate: new Date("2023-08-15"),
        lastUpdated: new Date(),
      },
      {
        id: "asia-pacific",
        name: "Asia Pacific",
        code: "SG",
        continent: "Asia",
        status: "planning",
        infrastructure: {
          cdnEndpoints: ["asia-pacific-1.quantumvest.io"],
          datacenters: ["Singapore"],
          edgeLocations: 12,
          bandwidth: 50,
          latency: 25,
        },
        metrics: {
          users: 5420,
          revenue: 420000,
          growth: 28.5,
          uptime: 99.9,
          errorRate: 0.1,
        },
        compliance: {
          score: 88,
          regulations: ["PDPA", "MAS Guidelines", "GDPR"],
          certifications: ["SOC2", "ISO27001"],
          lastAudit: new Date("2024-02-01"),
          nextAudit: new Date("2024-08-01"),
        },
        localization: {
          progress: 65,
          languages: ["en-SG", "zh-CN", "ms-MY", "ta-SG"],
          currencies: ["SGD", "MYR", "USD"],
          culturalFeatures: [
            "CPF Integration",
            "Multi-cultural UI",
            "Halal Investing",
          ],
        },
        businessMetrics: {
          marketPenetration: 1.2,
          competitorAnalysis: { "Tiger Brokers": 25, Saxo: 18, POEMS: 15 },
          seasonalTrends: [
            { month: "Q1", multiplier: 1.2 },
            { month: "Q2", multiplier: 1.0 },
            { month: "Q3", multiplier: 0.9 },
            { month: "Q4", multiplier: 1.3 },
          ],
          userSegmentation: { Retail: 60, Professional: 30, Institutional: 10 },
        },
        launchDate: new Date("2024-01-15"),
        lastUpdated: new Date(),
      },
      {
        id: "latam",
        name: "Latin America",
        code: "BR",
        continent: "South America",
        status: "launched",
        infrastructure: {
          cdnEndpoints: ["latam-1.quantumvest.io"],
          datacenters: ["São Paulo", "Mexico City"],
          edgeLocations: 15,
          bandwidth: 40,
          latency: 35,
        },
        metrics: {
          users: 12380,
          revenue: 890000,
          growth: 45.8,
          uptime: 99.85,
          errorRate: 0.15,
        },
        compliance: {
          score: 79,
          regulations: ["LGPD", "GDPR", "CVM Rules"],
          certifications: ["ISO27001"],
          lastAudit: new Date("2024-01-10"),
          nextAudit: new Date("2024-07-10"),
        },
        localization: {
          progress: 72,
          languages: ["pt-BR", "es-MX", "es-AR"],
          currencies: ["BRL", "MXN", "USD"],
          culturalFeatures: [
            "PIX Integration",
            "Crypto Support",
            "Football Sponsorships",
          ],
        },
        businessMetrics: {
          marketPenetration: 3.8,
          competitorAnalysis: {
            "XP Investimentos": 35,
            "Nu Invest": 25,
            Rico: 18,
          },
          seasonalTrends: [
            { month: "Q1", multiplier: 1.1 },
            { month: "Q2", multiplier: 0.8 },
            { month: "Q3", multiplier: 0.9 },
            { month: "Q4", multiplier: 1.4 },
          ],
          userSegmentation: { Retail: 80, Professional: 15, Institutional: 5 },
        },
        launchDate: new Date("2023-11-01"),
        lastUpdated: new Date(),
      },
    ];

    for (const region of sampleRegions) {
      this.regions.set(region.id, region);
    }
  }

  private async createSampleExpansionPlans(): Promise<void> {
    const samplePlans: RegionExpansionPlan[] = [
      {
        id: "expansion-middle-east",
        targetRegion: "Middle East (UAE)",
        status: "planning",
        timeline: {
          planning: {
            start: new Date("2024-04-01"),
            end: new Date("2024-06-01"),
            completed: false,
          },
          infrastructure: {
            start: new Date("2024-06-01"),
            end: new Date("2024-08-01"),
            completed: false,
          },
          localization: {
            start: new Date("2024-07-01"),
            end: new Date("2024-09-01"),
            completed: false,
          },
          compliance: {
            start: new Date("2024-08-01"),
            end: new Date("2024-10-01"),
            completed: false,
          },
          launch: {
            start: new Date("2024-10-01"),
            end: new Date("2024-11-01"),
            completed: false,
          },
        },
        budget: {
          total: 2500000,
          spent: 150000,
          allocated: {
            Infrastructure: 800000,
            Localization: 400000,
            Compliance: 300000,
            Marketing: 600000,
            Operations: 400000,
          },
        },
        risks: [
          {
            type: "regulatory",
            description: "Complex Islamic finance compliance requirements",
            probability: 70,
            impact: 80,
            mitigation:
              "Partner with local Islamic finance experts and regulatory consultants",
          },
          {
            type: "cultural",
            description: "Need for culturally appropriate investment products",
            probability: 60,
            impact: 70,
            mitigation:
              "Develop Sharia-compliant investment options and UI adaptations",
          },
        ],
        stakeholders: [
          {
            name: "Ahmed Al-Rashid",
            role: "Regional Director",
            responsibility: "Overall expansion strategy",
            contact: "ahmed@quantumvest.io",
          },
          {
            name: "Sarah Johnson",
            role: "Compliance Lead",
            responsibility: "Regulatory approvals",
            contact: "sarah@quantumvest.io",
          },
        ],
        milestones: [
          {
            name: "Market Research Complete",
            dueDate: new Date("2024-05-01"),
            completed: false,
            description: "Complete market analysis and competitor research",
          },
          {
            name: "Regulatory Approval",
            dueDate: new Date("2024-09-01"),
            completed: false,
            description: "Obtain necessary financial services licenses",
          },
          {
            name: "Beta Launch",
            dueDate: new Date("2024-10-15"),
            completed: false,
            description: "Launch beta version with select users",
          },
        ],
      },
    ];

    for (const plan of samplePlans) {
      this.expansionPlans.set(plan.id, plan);
    }
  }

  private async initializeCDNMetrics(): Promise<void> {
    // Sample CDN metrics for monitoring
    const sampleMetrics: CDNMetrics[] = [
      {
        endpoint: "us-east-1.quantumvest.io",
        region: "us-east",
        requests: 2500000,
        bandwidth: 1500,
        cacheHitRate: 92,
        avgResponseTime: 45,
        errors: 125,
        uptime: 99.98,
      },
      {
        endpoint: "eu-west-1.quantumvest.io",
        region: "eu-west",
        requests: 1800000,
        bandwidth: 1200,
        cacheHitRate: 89,
        avgResponseTime: 52,
        errors: 89,
        uptime: 99.95,
      },
    ];

    for (const metric of sampleMetrics) {
      this.cdnMetrics.set(metric.endpoint, metric);
    }
  }

  private async initializeEdgeLocations(): Promise<void> {
    const sampleEdgeLocations: EdgeLocation[] = [
      {
        id: "edge-nyc",
        city: "New York",
        country: "United States",
        coordinates: { lat: 40.7128, lng: -74.006 },
        status: "active",
        capacity: 10000,
        utilization: 65,
        connectedRegions: ["us-east", "eu-west"],
      },
      {
        id: "edge-london",
        city: "London",
        country: "United Kingdom",
        coordinates: { lat: 51.5074, lng: -0.1278 },
        status: "active",
        capacity: 8000,
        utilization: 58,
        connectedRegions: ["eu-west", "us-east"],
      },
      {
        id: "edge-lagos",
        city: "Lagos",
        country: "Nigeria",
        coordinates: { lat: 6.5244, lng: 3.3792 },
        status: "active",
        capacity: 3000,
        utilization: 72,
        connectedRegions: ["africa-west"],
      },
    ];

    for (const edge of sampleEdgeLocations) {
      this.edgeLocations.set(edge.id, edge);
    }
  }

  async getRegions(): Promise<Region[]> {
    return Array.from(this.regions.values()).sort(
      (a, b) => b.metrics.users - a.metrics.users,
    );
  }

  async getRegion(regionId: string): Promise<Region | null> {
    return this.regions.get(regionId) || null;
  }

  async createRegion(
    regionData: Omit<Region, "id" | "lastUpdated">,
  ): Promise<Region> {
    const region: Region = {
      id: `region-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date(),
      ...regionData,
    };

    this.regions.set(region.id, region);
    return region;
  }

  async updateRegionMetrics(
    regionId: string,
    metrics: Partial<Region["metrics"]>,
  ): Promise<Region | null> {
    const region = this.regions.get(regionId);
    if (!region) return null;

    region.metrics = { ...region.metrics, ...metrics };
    region.lastUpdated = new Date();

    return region;
  }

  async getExpansionPlans(): Promise<RegionExpansionPlan[]> {
    return Array.from(this.expansionPlans.values()).sort(
      (a, b) =>
        a.timeline.launch.start.getTime() - b.timeline.launch.start.getTime(),
    );
  }

  async createExpansionPlan(
    planData: Omit<RegionExpansionPlan, "id">,
  ): Promise<RegionExpansionPlan> {
    const plan: RegionExpansionPlan = {
      id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...planData,
    };

    this.expansionPlans.set(plan.id, plan);
    return plan;
  }

  async updateExpansionPlan(
    planId: string,
    updates: Partial<RegionExpansionPlan>,
  ): Promise<RegionExpansionPlan | null> {
    const plan = this.expansionPlans.get(planId);
    if (!plan) return null;

    Object.assign(plan, updates);
    return plan;
  }

  async getCDNMetrics(): Promise<CDNMetrics[]> {
    return Array.from(this.cdnMetrics.values());
  }

  async getEdgeLocations(): Promise<EdgeLocation[]> {
    return Array.from(this.edgeLocations.values());
  }

  async deployToRegion(
    regionId: string,
    deploymentConfig: {
      services: string[];
      version: string;
      rolloutStrategy: "blue_green" | "canary" | "rolling";
      healthChecks: boolean;
    },
  ): Promise<{
    deploymentId: string;
    status: string;
    estimatedCompletion: Date;
  }> {
    const region = this.regions.get(regionId);
    if (!region) {
      throw new Error(`Region ${regionId} not found`);
    }

    const deploymentId = `deploy-${regionId}-${Date.now()}`;
    const estimatedCompletion = new Date();
    estimatedCompletion.setMinutes(estimatedCompletion.getMinutes() + 30); // 30 minute deployment

    // Simulate deployment process
    setTimeout(() => {
      console.log(
        `Deployment ${deploymentId} completed for region ${region.name}`,
      );
    }, 5000);

    return {
      deploymentId,
      status: "in_progress",
      estimatedCompletion,
    };
  }

  async scaleRegion(
    regionId: string,
    scalingConfig: {
      targetCapacity: number;
      autoScaling: boolean;
      minInstances: number;
      maxInstances: number;
    },
  ): Promise<{
    scalingId: string;
    currentCapacity: number;
    targetCapacity: number;
  }> {
    const region = this.regions.get(regionId);
    if (!region) {
      throw new Error(`Region ${regionId} not found`);
    }

    const scalingId = `scale-${regionId}-${Date.now()}`;
    const currentCapacity = region.infrastructure.edgeLocations * 1000; // Simplified calculation

    // Simulate scaling operation
    setTimeout(() => {
      region.infrastructure.edgeLocations = Math.ceil(
        scalingConfig.targetCapacity / 1000,
      );
      console.log(
        `Region ${region.name} scaled to ${scalingConfig.targetCapacity} capacity`,
      );
    }, 3000);

    return {
      scalingId,
      currentCapacity,
      targetCapacity: scalingConfig.targetCapacity,
    };
  }

  async getRegionHealth(regionId?: string): Promise<
    {
      region: string;
      overall: "healthy" | "warning" | "critical";
      metrics: {
        uptime: number;
        errorRate: number;
        latency: number;
        throughput: number;
      };
      issues: string[];
    }[]
  > {
    const regions = regionId
      ? [this.regions.get(regionId)].filter(Boolean)
      : Array.from(this.regions.values());

    return regions.map((region) => {
      const issues: string[] = [];
      let overall: "healthy" | "warning" | "critical" = "healthy";

      if (region!.metrics.uptime < 99.5) {
        issues.push("Low uptime detected");
        overall = "critical";
      } else if (region!.metrics.uptime < 99.9) {
        issues.push("Uptime below target");
        overall = "warning";
      }

      if (region!.metrics.errorRate > 0.5) {
        issues.push("High error rate");
        overall = "critical";
      } else if (region!.metrics.errorRate > 0.1) {
        issues.push("Elevated error rate");
        if (overall === "healthy") overall = "warning";
      }

      if (region!.infrastructure.latency > 100) {
        issues.push("High latency detected");
        overall = "critical";
      } else if (region!.infrastructure.latency > 50) {
        issues.push("Latency above optimal");
        if (overall === "healthy") overall = "warning";
      }

      return {
        region: region!.name,
        overall,
        metrics: {
          uptime: region!.metrics.uptime,
          errorRate: region!.metrics.errorRate,
          latency: region!.infrastructure.latency,
          throughput: region!.infrastructure.bandwidth,
        },
        issues,
      };
    });
  }

  private startRegionMonitoring(): void {
    setInterval(() => {
      // Simulate real-time metric updates
      for (const region of this.regions.values()) {
        // Update metrics with small variations
        region.metrics.uptime = Math.min(
          100,
          Math.max(95, region.metrics.uptime + (Math.random() - 0.5) * 0.1),
        );

        region.metrics.errorRate = Math.max(
          0,
          region.metrics.errorRate + (Math.random() - 0.5) * 0.02,
        );

        region.infrastructure.latency = Math.max(
          5,
          region.infrastructure.latency + (Math.random() - 0.5) * 5,
        );

        // Simulate user growth
        if (Math.random() > 0.7) {
          // 30% chance of user growth update
          const growthFactor = 1 + Math.random() * 0.02; // Up to 2% growth
          region.metrics.users = Math.floor(
            region.metrics.users * growthFactor,
          );
        }

        region.lastUpdated = new Date();
      }
    }, 30000); // Every 30 seconds
  }

  private startPerformanceTracking(): void {
    setInterval(() => {
      // Update CDN metrics
      for (const metric of this.cdnMetrics.values()) {
        metric.requests += Math.floor(Math.random() * 10000);
        metric.bandwidth += Math.random() * 10;
        metric.cacheHitRate = Math.min(
          100,
          Math.max(70, metric.cacheHitRate + (Math.random() - 0.5) * 2),
        );
        metric.avgResponseTime = Math.max(
          10,
          metric.avgResponseTime + (Math.random() - 0.5) * 10,
        );
      }

      // Update edge location utilization
      for (const edge of this.edgeLocations.values()) {
        edge.utilization = Math.min(
          100,
          Math.max(10, edge.utilization + (Math.random() - 0.5) * 10),
        );
      }
    }, 60000); // Every minute
  }

  async getGlobalStats(): Promise<{
    totalRegions: number;
    activeRegions: number;
    totalUsers: number;
    totalRevenue: number;
    averageUptime: number;
    totalEdgeLocations: number;
    globalLatency: number;
  }> {
    const regions = Array.from(this.regions.values());
    const activeRegions = regions.filter((r) => r.status === "active");

    return {
      totalRegions: regions.length,
      activeRegions: activeRegions.length,
      totalUsers: regions.reduce((sum, r) => sum + r.metrics.users, 0),
      totalRevenue: regions.reduce((sum, r) => sum + r.metrics.revenue, 0),
      averageUptime:
        regions.reduce((sum, r) => sum + r.metrics.uptime, 0) / regions.length,
      totalEdgeLocations: regions.reduce(
        (sum, r) => sum + r.infrastructure.edgeLocations,
        0,
      ),
      globalLatency:
        regions.reduce((sum, r) => sum + r.infrastructure.latency, 0) /
        regions.length,
    };
  }

  async getRegionRecommendations(): Promise<string[]> {
    const recommendations: string[] = [];
    const regions = Array.from(this.regions.values());

    // Check for regions with high growth potential
    const highGrowthRegions = regions.filter((r) => r.metrics.growth > 30);
    if (highGrowthRegions.length > 0) {
      recommendations.push(
        `Consider increasing infrastructure capacity in ${highGrowthRegions[0].name} due to high growth rate of ${highGrowthRegions[0].metrics.growth}%`,
      );
    }

    // Check for compliance issues
    const lowComplianceRegions = regions.filter((r) => r.compliance.score < 85);
    if (lowComplianceRegions.length > 0) {
      recommendations.push(
        `Address compliance issues in ${lowComplianceRegions[0].name} (score: ${lowComplianceRegions[0].compliance.score}%)`,
      );
    }

    // Check for localization gaps
    const lowLocalizationRegions = regions.filter(
      (r) => r.localization.progress < 80,
    );
    if (lowLocalizationRegions.length > 0) {
      recommendations.push(
        `Complete localization for ${lowLocalizationRegions[0].name} (${lowLocalizationRegions[0].localization.progress}% complete)`,
      );
    }

    return recommendations;
  }
}

export const multiRegionService = singletonPattern(
  () => new MultiRegionService(),
);
