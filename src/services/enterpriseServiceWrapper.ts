/**
 * Enterprise Service Wrapper
 * Provides error handling and fallback mechanisms for all enterprise services
 */

export class EnterpriseServiceWrapper {
  private static instance: EnterpriseServiceWrapper;
  private errorCache = new Map<string, { error: Error; timestamp: number }>();
  private fallbackCache = new Map<string, any>();

  static getInstance(): EnterpriseServiceWrapper {
    if (!EnterpriseServiceWrapper.instance) {
      EnterpriseServiceWrapper.instance = new EnterpriseServiceWrapper();
    }
    return EnterpriseServiceWrapper.instance;
  }

  async safeServiceCall<T>(
    serviceName: string,
    serviceCall: () => Promise<T>,
    fallbackData?: T,
  ): Promise<T> {
    try {
      // Check if we have a recent error for this service (within 30 seconds)
      const recentError = this.errorCache.get(serviceName);
      if (recentError && Date.now() - recentError.timestamp < 30000) {
        console.warn(`Service ${serviceName} recently failed, using fallback`);
        return this.getFallbackData(serviceName, fallbackData);
      }

      const result = await Promise.race([
        serviceCall(),
        this.createTimeout(5000), // 5 second timeout
      ]);

      // Clear any previous error for this service
      this.errorCache.delete(serviceName);

      // Cache successful result as fallback
      this.fallbackCache.set(serviceName, result);

      return result;
    } catch (error) {
      console.error(`Service ${serviceName} failed:`, error);

      // Cache the error
      this.errorCache.set(serviceName, {
        error: error as Error,
        timestamp: Date.now(),
      });

      return this.getFallbackData(serviceName, fallbackData);
    }
  }

  private async createTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Service call timeout")), ms);
    });
  }

  private getFallbackData<T>(serviceName: string, fallbackData?: T): T {
    // Return cached successful result if available
    const cached = this.fallbackCache.get(serviceName);
    if (cached) {
      return cached;
    }

    // Return provided fallback
    if (fallbackData !== undefined) {
      return fallbackData;
    }

    // Return service-specific fallbacks
    return this.getServiceSpecificFallback(serviceName);
  }

  private getServiceSpecificFallback<T>(serviceName: string): T {
    const fallbacks: Record<string, any> = {
      legendaryInvestorIntegrationService: {
        analyses: [],
        dashboards: [],
        synergies: [],
        strategies: [],
      },
      mungerMentalModelsService: {
        mentalModels: [],
        inversions: [],
        failureIntents: [],
        redTeamChallenges: [],
        latticeRecommendations: [],
      },
      buffettMoatService: {
        moatAnalyses: [],
        timeLockedVaults: [],
        compoundingSimulations: [],
        aiManagers: [],
      },
      dalioSystemsService: {
        ecosystemKits: [],
        swarmAgents: [],
        recommendations: [],
        principles: [],
        transparencyDashboard: null,
      },
      lynchLocalInsightService: {
        localInsights: [],
        microVaults: [],
        knowledgeGraph: [],
        channels: [],
      },
      adaptiveYieldOptimizationService: {
        optimizationResults: [],
        portfolioAnalysis: null,
        riskMetrics: [],
      },
    };

    return fallbacks[serviceName] || {};
  }

  // Helper method for dashboard metrics
  getDashboardMetrics() {
    return {
      totalPortfolioValue: 1250000,
      totalReturn: 12.5,
      monthlyReturn: 2.1,
      riskScore: 35,
      diversificationScore: 85,
      moatStrength: 78,
      localInsightScore: 82,
      mentalModelConfidence: 88,
    };
  }

  // Helper method for performance metrics
  getPerformanceMetrics(timeRange: string) {
    return [
      {
        name: "Portfolio Return",
        value: 12.5,
        change: 2.1,
        trend: "up" as const,
        benchmark: 8.3,
      },
      {
        name: "Risk-Adjusted Return",
        value: 1.85,
        change: 0.15,
        trend: "up" as const,
        benchmark: 1.42,
      },
      {
        name: "Volatility",
        value: 14.2,
        change: -1.8,
        trend: "down" as const,
        benchmark: 16.7,
      },
      {
        name: "Max Drawdown",
        value: -8.5,
        change: 1.2,
        trend: "down" as const,
        benchmark: -12.3,
      },
      {
        name: "Sharpe Ratio",
        value: 1.65,
        change: 0.23,
        trend: "up" as const,
        benchmark: 1.28,
      },
      {
        name: "Win Rate",
        value: 73.5,
        change: 4.2,
        trend: "up" as const,
        benchmark: 68.9,
      },
    ];
  }

  // Helper method for cross-philosophy recommendations
  getCrossPhilosophyRecommendations() {
    return [
      {
        id: "rec_001",
        title: "Mental Models Reinforce Moat Analysis",
        description:
          "Combine ecological thinking with competitive advantage analysis for stronger investment decisions",
        philosophies: ["Munger", "Buffett"],
        confidence: 87,
        impact: "high" as const,
        timeframe: "3-6 months",
        action: "Review Current Holdings",
      },
      {
        id: "rec_002",
        title: "Local Insights Validate Diversification",
        description:
          "Use community knowledge to validate systematic diversification strategies",
        philosophies: ["Lynch", "Dalio"],
        confidence: 82,
        impact: "medium" as const,
        timeframe: "1-3 months",
        action: "Explore Opportunities",
      },
      {
        id: "rec_003",
        title: "Inversion Strengthens Risk Management",
        description:
          "Apply failure mode analysis to all-weather portfolio construction",
        philosophies: ["Munger", "Dalio"],
        confidence: 90,
        impact: "high" as const,
        timeframe: "Immediate",
        action: "Implement Changes",
      },
    ];
  }

  // Health check for all services
  async performHealthCheck(): Promise<{
    status: "healthy" | "degraded" | "critical";
    services: Record<string, boolean>;
    errors: string[];
  }> {
    const services = [
      "legendaryInvestorIntegrationService",
      "mungerMentalModelsService",
      "buffettMoatService",
      "dalioSystemsService",
      "lynchLocalInsightService",
      "adaptiveYieldOptimizationService",
    ];

    const results: Record<string, boolean> = {};
    const errors: string[] = [];
    let healthyCount = 0;

    for (const service of services) {
      const recentError = this.errorCache.get(service);
      const isHealthy =
        !recentError || Date.now() - recentError.timestamp > 60000;

      results[service] = isHealthy;
      if (isHealthy) {
        healthyCount++;
      } else if (recentError) {
        errors.push(`${service}: ${recentError.error.message}`);
      }
    }

    const healthPercentage = (healthyCount / services.length) * 100;
    let status: "healthy" | "degraded" | "critical";

    if (healthPercentage >= 90) {
      status = "healthy";
    } else if (healthPercentage >= 60) {
      status = "degraded";
    } else {
      status = "critical";
    }

    return { status, services: results, errors };
  }
}

export const enterpriseServiceWrapper = EnterpriseServiceWrapper.getInstance();
