import riskCalculator from "../utils/riskCalculator";
import { aiService } from "./aiService";
import { fetcher } from "../utils/fetcher";
import type {
  RiskAssessment,
  RiskFactor,
  RiskMetrics,
  RiskRecommendation,
  ScenarioAnalysis,
  MonteCarloResult,
} from "../types/RiskAssessment";
import type {
  PortfolioData,
  Holding,
  MarketData,
} from "../utils/riskCalculator";

export class RiskManagementService {
  private static instance: RiskManagementService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly cacheTTL = 30 * 60 * 1000; // 30 minutes

  static getInstance(): RiskManagementService {
    if (!RiskManagementService.instance) {
      RiskManagementService.instance = new RiskManagementService();
    }
    return RiskManagementService.instance;
  }

  /**
   * Perform comprehensive risk assessment
   */
  async performRiskAssessment(
    userId: string,
    portfolioId: string,
    portfolioData: PortfolioData,
    marketData?: MarketData,
  ): Promise<RiskAssessment> {
    const cacheKey = `risk:${portfolioId}:${JSON.stringify(portfolioData)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Calculate overall risk score
      const overallRiskScore =
        riskCalculator.calculateOverallRiskScore(portfolioData);
      const riskGrade = riskCalculator.calculateRiskGrade(overallRiskScore);

      // Calculate risk factors
      const factors = riskCalculator.calculateRiskFactors(portfolioData);

      // Calculate risk metrics
      const metrics = await this.calculateAdvancedMetrics(
        portfolioData,
        marketData,
      );

      // Generate recommendations
      const recommendations = await this.generateRecommendations(
        overallRiskScore,
        factors,
        portfolioData,
      );

      // Perform scenario analysis
      const scenario = await this.performScenarioAnalysis(portfolioData);

      // Assess compliance risk
      const compliance = await this.assessComplianceRisk(portfolioData, userId);

      const riskAssessment: RiskAssessment = {
        id: this.generateId(),
        userId,
        portfolioId,
        overallRiskScore,
        riskGrade,
        assessmentDate: new Date(),
        factors,
        metrics,
        recommendations,
        scenario,
        compliance,
      };

      this.setCache(cacheKey, riskAssessment);
      return riskAssessment;
    } catch (error) {
      console.error("Error performing risk assessment:", error);
      throw new Error("Failed to perform risk assessment");
    }
  }

  /**
   * Monitor portfolio risk in real-time
   */
  async monitorRisk(
    portfolioId: string,
    thresholds: {
      riskScore?: number;
      volatility?: number;
      drawdown?: number;
      concentration?: number;
    },
  ): Promise<{
    alerts: Array<{
      type: string;
      severity: "low" | "medium" | "high" | "critical";
      message: string;
      threshold: number;
      current: number;
    }>;
    recommendations: string[];
  }> {
    try {
      const alerts = [];
      const recommendations = [];

      // Get current portfolio data
      const portfolioData = await this.getPortfolioData(portfolioId);

      // Check risk score threshold
      if (thresholds.riskScore) {
        const currentRisk =
          riskCalculator.calculateOverallRiskScore(portfolioData);
        if (currentRisk > thresholds.riskScore) {
          alerts.push({
            type: "risk_score",
            severity: this.getSeverity(currentRisk, thresholds.riskScore),
            message: `Portfolio risk score (${currentRisk.toFixed(1)}) exceeds threshold (${thresholds.riskScore})`,
            threshold: thresholds.riskScore,
            current: currentRisk,
          });
          recommendations.push(
            "Consider reducing portfolio risk through diversification or position sizing",
          );
        }
      }

      // Check volatility threshold
      if (thresholds.volatility) {
        const volatility = this.calculateCurrentVolatility(portfolioData);
        if (volatility > thresholds.volatility) {
          alerts.push({
            type: "volatility",
            severity: this.getSeverity(volatility, thresholds.volatility),
            message: `Portfolio volatility (${(volatility * 100).toFixed(1)}%) exceeds threshold (${(thresholds.volatility * 100).toFixed(1)}%)`,
            threshold: thresholds.volatility,
            current: volatility,
          });
          recommendations.push(
            "Consider adding lower volatility assets to reduce portfolio risk",
          );
        }
      }

      // Check concentration risk
      if (thresholds.concentration) {
        const concentration = riskCalculator.calculateConcentrationRisk(
          portfolioData.holdings,
        );
        if (concentration > thresholds.concentration) {
          alerts.push({
            type: "concentration",
            severity: this.getSeverity(concentration, thresholds.concentration),
            message: `Portfolio concentration (${(concentration * 100).toFixed(1)}%) exceeds threshold (${(thresholds.concentration * 100).toFixed(1)}%)`,
            threshold: thresholds.concentration,
            current: concentration,
          });
          recommendations.push(
            "Diversify holdings to reduce concentration risk",
          );
        }
      }

      return { alerts, recommendations };
    } catch (error) {
      console.error("Error monitoring risk:", error);
      throw new Error("Failed to monitor portfolio risk");
    }
  }

  /**
   * Calculate Value at Risk (VaR) for different time horizons
   */
  async calculateVaR(
    portfolioData: PortfolioData,
    confidenceLevel: number = 0.95,
    timeHorizons: number[] = [1, 7, 30],
  ): Promise<Record<string, number>> {
    try {
      const returns = this.extractPortfolioReturns(portfolioData);
      const varResults: Record<string, number> = {};

      for (const horizon of timeHorizons) {
        const var95 = riskCalculator.calculateVaR(
          returns,
          confidenceLevel,
          horizon,
        );
        varResults[`${horizon}d`] = var95;
      }

      return varResults;
    } catch (error) {
      console.error("Error calculating VaR:", error);
      throw new Error("Failed to calculate Value at Risk");
    }
  }

  /**
   * Perform stress testing
   */
  async performStressTesting(
    portfolioData: PortfolioData,
    scenarios?: Array<{
      name: string;
      shocks: Record<string, number>;
      probability: number;
    }>,
  ): Promise<
    Array<{
      scenario: string;
      portfolioImpact: number;
      worstAsset: string;
      timeToRecover: number;
    }>
  > {
    try {
      const defaultScenarios = scenarios || this.getDefaultStressScenarios();
      return riskCalculator.analyzeStressScenarios(
        portfolioData,
        defaultScenarios,
      );
    } catch (error) {
      console.error("Error performing stress testing:", error);
      throw new Error("Failed to perform stress testing");
    }
  }

  /**
   * Run Monte Carlo simulation
   */
  async runMonteCarloSimulation(
    portfolioData: PortfolioData,
    simulations: number = 10000,
    timeHorizon: number = 252,
  ): Promise<MonteCarloResult> {
    try {
      return riskCalculator.runMonteCarloSimulation(
        portfolioData,
        simulations,
        timeHorizon,
      );
    } catch (error) {
      console.error("Error running Monte Carlo simulation:", error);
      throw new Error("Failed to run Monte Carlo simulation");
    }
  }

  /**
   * Calculate portfolio correlation matrix
   */
  async calculateCorrelationMatrix(
    portfolioData: PortfolioData,
  ): Promise<Record<string, Record<string, number>>> {
    try {
      return riskCalculator.calculateCorrelationMatrix(portfolioData.holdings);
    } catch (error) {
      console.error("Error calculating correlation matrix:", error);
      throw new Error("Failed to calculate correlation matrix");
    }
  }

  /**
   * Optimize portfolio for risk-return
   */
  async optimizePortfolio(
    portfolioData: PortfolioData,
    targetReturn?: number,
    maxRisk?: number,
  ): Promise<{
    optimizedWeights: Record<string, number>;
    expectedReturn: number;
    expectedRisk: number;
    sharpeRatio: number;
    changes: Array<{
      asset: string;
      currentWeight: number;
      suggestedWeight: number;
      change: number;
    }>;
  }> {
    try {
      // This would typically use mean-variance optimization
      // For now, we'll provide a simplified implementation
      const currentWeights = this.getCurrentWeights(portfolioData);
      const optimizedWeights = await this.performOptimization(
        portfolioData,
        targetReturn,
        maxRisk,
      );

      const changes = Object.keys(currentWeights).map((asset) => ({
        asset,
        currentWeight: currentWeights[asset] || 0,
        suggestedWeight: optimizedWeights[asset] || 0,
        change: (optimizedWeights[asset] || 0) - (currentWeights[asset] || 0),
      }));

      return {
        optimizedWeights,
        expectedReturn: this.calculateExpectedReturn(
          optimizedWeights,
          portfolioData,
        ),
        expectedRisk: this.calculateExpectedRisk(
          optimizedWeights,
          portfolioData,
        ),
        sharpeRatio: 1.2, // Placeholder
        changes,
      };
    } catch (error) {
      console.error("Error optimizing portfolio:", error);
      throw new Error("Failed to optimize portfolio");
    }
  }

  /**
   * Generate risk report
   */
  async generateRiskReport(
    portfolioId: string,
    userId: string,
    format: "summary" | "detailed" | "regulatory" = "summary",
  ): Promise<{
    title: string;
    sections: Array<{
      title: string;
      content: string;
      charts?: any[];
      tables?: any[];
    }>;
    generatedAt: Date;
    validUntil: Date;
  }> {
    try {
      const portfolioData = await this.getPortfolioData(portfolioId);
      const riskAssessment = await this.performRiskAssessment(
        userId,
        portfolioId,
        portfolioData,
      );

      const report = {
        title: `Risk Assessment Report - Portfolio ${portfolioId}`,
        sections: [],
        generatedAt: new Date(),
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      switch (format) {
        case "summary":
          report.sections = await this.generateSummaryReport(
            riskAssessment,
            portfolioData,
          );
          break;
        case "detailed":
          report.sections = await this.generateDetailedReport(
            riskAssessment,
            portfolioData,
          );
          break;
        case "regulatory":
          report.sections = await this.generateRegulatoryReport(
            riskAssessment,
            portfolioData,
          );
          break;
      }

      return report;
    } catch (error) {
      console.error("Error generating risk report:", error);
      throw new Error("Failed to generate risk report");
    }
  }

  /**
   * Calculate advanced risk metrics
   */
  private async calculateAdvancedMetrics(
    portfolioData: PortfolioData,
    marketData?: MarketData,
  ): Promise<RiskMetrics> {
    try {
      const returns = this.extractPortfolioReturns(portfolioData);
      const defaultMarketData: MarketData = marketData || {
        riskFreeRate: 0.02,
        marketReturn: 0.08,
        marketVolatility: 0.15,
        correlationMatrix: {},
      };

      return riskCalculator.calculateRiskMetrics(
        portfolioData,
        defaultMarketData,
      );
    } catch (error) {
      console.error("Error calculating advanced metrics:", error);
      throw new Error("Failed to calculate advanced risk metrics");
    }
  }

  /**
   * Generate risk recommendations
   */
  private async generateRecommendations(
    riskScore: number,
    factors: RiskFactor[],
    portfolioData: PortfolioData,
  ): Promise<RiskRecommendation[]> {
    try {
      // Use AI to generate sophisticated recommendations
      const aiRecommendations = await aiService.generateRecommendations(
        "user_id", // This should be passed from context
        portfolioData,
        {
          riskTolerance: portfolioData.riskTolerance,
          investmentGoals: [],
          timeHorizon: portfolioData.timeHorizon,
          culturalPreferences: [],
          excludedSectors: [],
          minInvestmentAmount: 0,
          maxPositionSize: 0.3,
        },
      );

      // Convert AI recommendations to risk recommendations
      const riskRecommendations: RiskRecommendation[] = aiRecommendations.map(
        (rec) => ({
          type: "rebalance",
          priority:
            rec.confidence > 0.8
              ? "high"
              : rec.confidence > 0.6
                ? "medium"
                : "low",
          description: rec.reasoning,
          expectedImpact: rec.expectedReturn,
          implementation: [`Consider ${rec.type} ${rec.asset}`],
          cost: 0,
          timeframe: rec.timeHorizon,
        }),
      );

      // Add algorithmic recommendations
      const algorithmicRecs = riskCalculator.generateRiskRecommendations(
        riskScore,
        factors,
        portfolioData,
      );

      return [...riskRecommendations, ...algorithmicRecs];
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return [];
    }
  }

  /**
   * Perform scenario analysis
   */
  private async performScenarioAnalysis(
    portfolioData: PortfolioData,
  ): Promise<ScenarioAnalysis> {
    try {
      const scenarios = this.getDefaultStressScenarios();
      const stressTesting = await this.performStressTesting(
        portfolioData,
        scenarios,
      );
      const monteCarlo = await this.runMonteCarloSimulation(portfolioData);

      return {
        scenarios: scenarios.map((s) => ({
          name: s.name,
          description: `Stress test scenario: ${s.name}`,
          probability: s.probability,
          portfolioImpact: 0, // Would be calculated from stress testing
          duration: 30, // days
          recovery: 90, // days
          factors: Object.entries(s.shocks).map(([asset, shock]) => ({
            asset,
            shock,
            timeframe: "1 day",
          })),
        })),
        stressTesting: stressTesting.map((st) => ({
          name: st.scenario,
          type: "hypothetical" as const,
          portfolioLoss: st.portfolioImpact,
          worstAsset: st.worstAsset,
          timeToRecover: st.timeToRecover,
          date: new Date(),
        })),
        monteCarlo,
      };
    } catch (error) {
      console.error("Error performing scenario analysis:", error);
      throw new Error("Failed to perform scenario analysis");
    }
  }

  /**
   * Assess compliance risk
   */
  private async assessComplianceRisk(
    portfolioData: PortfolioData,
    userId: string,
  ): Promise<any> {
    try {
      // This would integrate with regulatory databases and compliance rules
      return {
        score: 85,
        violations: [],
        monitoring: [],
      };
    } catch (error) {
      console.error("Error assessing compliance risk:", error);
      return {
        score: 0,
        violations: [],
        monitoring: [],
      };
    }
  }

  /**
   * Get default stress test scenarios
   */
  private getDefaultStressScenarios() {
    return [
      {
        name: "Market Crash",
        shocks: { STOCK: -0.3, BOND: -0.1, CRYPTO: -0.5 },
        probability: 0.05,
      },
      {
        name: "Interest Rate Spike",
        shocks: { BOND: -0.2, REIT: -0.15, STOCK: -0.1 },
        probability: 0.1,
      },
      {
        name: "Inflation Shock",
        shocks: { COMMODITY: 0.2, STOCK: -0.05, BOND: -0.15 },
        probability: 0.15,
      },
      {
        name: "Geopolitical Crisis",
        shocks: { EMERGING: -0.25, COMMODITY: 0.15, SAFE_HAVEN: 0.1 },
        probability: 0.08,
      },
    ];
  }

  /**
   * Helper methods
   */
  private async getPortfolioData(portfolioId: string): Promise<PortfolioData> {
    // This would fetch actual portfolio data
    return {
      holdings: [],
      totalValue: 0,
      timeHorizon: 1,
      riskTolerance: "moderate",
    };
  }

  private extractPortfolioReturns(portfolioData: PortfolioData): number[] {
    // Extract historical returns from portfolio holdings
    return portfolioData.holdings.flatMap((h) => h.historicalReturns || []);
  }

  private calculateCurrentVolatility(portfolioData: PortfolioData): number {
    return portfolioData.holdings.reduce(
      (sum, holding) => sum + holding.weight * holding.volatility,
      0,
    );
  }

  private getSeverity(
    current: number,
    threshold: number,
  ): "low" | "medium" | "high" | "critical" {
    const ratio = current / threshold;
    if (ratio > 2) return "critical";
    if (ratio > 1.5) return "high";
    if (ratio > 1.2) return "medium";
    return "low";
  }

  private getCurrentWeights(
    portfolioData: PortfolioData,
  ): Record<string, number> {
    const weights: Record<string, number> = {};
    portfolioData.holdings.forEach((holding) => {
      weights[holding.symbol] = holding.weight;
    });
    return weights;
  }

  private async performOptimization(
    portfolioData: PortfolioData,
    targetReturn?: number,
    maxRisk?: number,
  ): Promise<Record<string, number>> {
    // Simplified optimization - in reality, this would use sophisticated algorithms
    const weights: Record<string, number> = {};
    const equalWeight = 1 / portfolioData.holdings.length;

    portfolioData.holdings.forEach((holding) => {
      weights[holding.symbol] = equalWeight;
    });

    return weights;
  }

  private calculateExpectedReturn(
    weights: Record<string, number>,
    portfolioData: PortfolioData,
  ): number {
    // Simplified calculation
    return 0.08; // 8% placeholder
  }

  private calculateExpectedRisk(
    weights: Record<string, number>,
    portfolioData: PortfolioData,
  ): number {
    // Simplified calculation
    return 0.15; // 15% placeholder
  }

  private async generateSummaryReport(
    riskAssessment: RiskAssessment,
    portfolioData: PortfolioData,
  ): Promise<any[]> {
    return [
      {
        title: "Risk Overview",
        content: `Portfolio risk score: ${riskAssessment.overallRiskScore.toFixed(1)} (Grade: ${riskAssessment.riskGrade})`,
      },
      {
        title: "Key Risk Factors",
        content: riskAssessment.factors
          .slice(0, 3)
          .map((f) => f.name)
          .join(", "),
      },
    ];
  }

  private async generateDetailedReport(
    riskAssessment: RiskAssessment,
    portfolioData: PortfolioData,
  ): Promise<any[]> {
    return [
      {
        title: "Executive Summary",
        content: `Comprehensive risk analysis for portfolio ${riskAssessment.portfolioId}`,
      },
      {
        title: "Risk Metrics",
        content: `VaR (95%): ${riskAssessment.metrics.valueAtRisk.oneDay.toFixed(2)}%`,
      },
      {
        title: "Recommendations",
        content: riskAssessment.recommendations
          .map((r) => r.description)
          .join("\n"),
      },
    ];
  }

  private async generateRegulatoryReport(
    riskAssessment: RiskAssessment,
    portfolioData: PortfolioData,
  ): Promise<any[]> {
    return [
      {
        title: "Regulatory Compliance",
        content: `Compliance score: ${riskAssessment.compliance.score}/100`,
      },
      {
        title: "Risk Disclosure",
        content: "Investment risks and regulatory requirements disclosure",
      },
    ];
  }

  private getFromCache(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.timestamp + this.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private generateId(): string {
    return `risk_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

// Export singleton instance for use throughout the application
export const riskManagementService = RiskManagementService.getInstance();

// Export the class for manual instantiation when needed
export default RiskManagementService;
