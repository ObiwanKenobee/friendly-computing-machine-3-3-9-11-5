import { conversationalIntelligenceService } from "./conversationalIntelligenceService";
import {
  healthcareTokenizationService,
  type PortfolioHealthcareAsset,
} from "./healthcareTokenizationService";

export interface RiskProfile {
  riskTolerance: "conservative" | "moderate" | "aggressive";
  investmentHorizon: "short" | "medium" | "long"; // <1yr, 1-5yr, >5yr
  monthlyIncome: number;
  monthlyExpenses: number;
  emergencyFund: number;
  age: number;
  dependents: number;
  financialKnowledge: "beginner" | "intermediate" | "advanced";
  primaryGoals: Array<
    | "wealth_building"
    | "income_generation"
    | "capital_preservation"
    | "social_impact"
  >;
}

export interface RiskAssessment {
  overallRiskScore: number; // 1-10 scale
  diversificationScore: number;
  volatilityRisk: number;
  liquidityRisk: number;
  concentrationRisk: number;
  geographicRisk: number;
  sectorRisk: number;
  recommendations: RiskRecommendation[];
  alerts: RiskAlert[];
}

export interface RiskRecommendation {
  type:
    | "rebalance"
    | "diversify"
    | "reduce_position"
    | "increase_position"
    | "add_asset"
    | "educational";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  localizedExplanation: string;
  actionRequired: boolean;
  estimatedImpact: number; // Expected improvement in risk score
}

export interface RiskAlert {
  level: "critical" | "warning" | "info";
  title: string;
  message: string;
  localizedMessage: string;
  timestamp: number;
  actionable: boolean;
}

export interface PortfolioStressTest {
  scenarioName: string;
  description: string;
  potentialLoss: number;
  probability: number;
  timeframe: string;
  mitigationStrategies: string[];
}

class RiskAdvisorService {
  private riskProfiles: Map<string, RiskProfile> = new Map();
  private riskAssessments: Map<string, RiskAssessment> = new Map();

  public async createRiskProfile(
    userId: string,
    profile: RiskProfile,
  ): Promise<void> {
    this.riskProfiles.set(userId, profile);
    await this.assessPortfolioRisk(userId);
  }

  public getRiskProfile(userId: string): RiskProfile | null {
    return this.riskProfiles.get(userId) || null;
  }

  public async assessPortfolioRisk(userId: string): Promise<RiskAssessment> {
    const profile = this.riskProfiles.get(userId);
    const portfolio = healthcareTokenizationService.getUserPortfolio();

    if (!profile) {
      throw new Error("Risk profile not found for user");
    }

    const assessment = await this.calculateRiskAssessment(portfolio, profile);
    this.riskAssessments.set(userId, assessment);

    return assessment;
  }

  private async calculateRiskAssessment(
    portfolio: PortfolioHealthcareAsset[],
    profile: RiskProfile,
  ): Promise<RiskAssessment> {
    const diversificationScore = this.calculateDiversificationScore(portfolio);
    const volatilityRisk = this.calculateVolatilityRisk(portfolio);
    const liquidityRisk = this.calculateLiquidityRisk(portfolio);
    const concentrationRisk = this.calculateConcentrationRisk(portfolio);
    const geographicRisk = this.calculateGeographicRisk(portfolio);
    const sectorRisk = this.calculateSectorRisk(portfolio);

    const overallRiskScore = this.calculateOverallRiskScore({
      diversificationScore,
      volatilityRisk,
      liquidityRisk,
      concentrationRisk,
      geographicRisk,
      sectorRisk,
    });

    const recommendations = await this.generateRecommendations(
      portfolio,
      profile,
      {
        diversificationScore,
        volatilityRisk,
        concentrationRisk,
        geographicRisk,
        sectorRisk,
      },
    );

    const alerts = this.generateRiskAlerts(
      portfolio,
      profile,
      overallRiskScore,
    );

    return {
      overallRiskScore,
      diversificationScore,
      volatilityRisk,
      liquidityRisk,
      concentrationRisk,
      geographicRisk,
      sectorRisk,
      recommendations,
      alerts,
    };
  }

  private calculateDiversificationScore(
    portfolio: PortfolioHealthcareAsset[],
  ): number {
    if (portfolio.length === 0) return 0;

    const sectorCount = new Set(portfolio.map((asset) => asset.sector)).size;
    const geographyCount = new Set(portfolio.map((asset) => asset.geography))
      .size;
    const riskLevelCount = new Set(portfolio.map((asset) => asset.riskLevel))
      .size;

    // Diversification score based on spread across sectors, geographies, and risk levels
    const maxSectors = 5; // Maximum possible sectors
    const maxGeographies = 10; // Approximate maximum geographies
    const maxRiskLevels = 3;

    const sectorScore = (sectorCount / maxSectors) * 100;
    const geographyScore = (geographyCount / maxGeographies) * 100;
    const riskScore = (riskLevelCount / maxRiskLevels) * 100;

    return Math.min(100, (sectorScore + geographyScore + riskScore) / 3);
  }

  private calculateVolatilityRisk(
    portfolio: PortfolioHealthcareAsset[],
  ): number {
    if (portfolio.length === 0) return 0;

    const weightedVolatility = portfolio.reduce((total, asset) => {
      const volatilityScore =
        asset.riskLevel === "high"
          ? 80
          : asset.riskLevel === "medium"
            ? 50
            : 20;
      return total + volatilityScore * (asset.percentageOfPortfolio / 100);
    }, 0);

    return Math.min(100, weightedVolatility);
  }

  private calculateLiquidityRisk(
    portfolio: PortfolioHealthcareAsset[],
  ): number {
    if (portfolio.length === 0) return 0;

    // Healthcare tokens generally have moderate liquidity
    // This would typically be based on trading volume and market depth
    const weightedLiquidity = portfolio.reduce((total, asset) => {
      const liquidityScore =
        asset.volume24h > 1000000
          ? 20 // High liquidity
          : asset.volume24h > 500000
            ? 40 // Medium liquidity
            : 70; // Lower liquidity
      return total + liquidityScore * (asset.percentageOfPortfolio / 100);
    }, 0);

    return Math.min(100, weightedLiquidity);
  }

  private calculateConcentrationRisk(
    portfolio: PortfolioHealthcareAsset[],
  ): number {
    if (portfolio.length === 0) return 0;

    // Risk from having too much in any single position
    const maxPosition = Math.max(
      ...portfolio.map((asset) => asset.percentageOfPortfolio),
    );

    // High concentration risk if any single position > 30%
    if (maxPosition > 30) return 80;
    if (maxPosition > 20) return 60;
    if (maxPosition > 15) return 40;
    return 20;
  }

  private calculateGeographicRisk(
    portfolio: PortfolioHealthcareAsset[],
  ): number {
    if (portfolio.length === 0) return 0;

    const geographyWeights = new Map<string, number>();

    portfolio.forEach((asset) => {
      const current = geographyWeights.get(asset.geography) || 0;
      geographyWeights.set(
        asset.geography,
        current + asset.percentageOfPortfolio,
      );
    });

    const maxGeographyExposure = Math.max(...geographyWeights.values());

    // High geographic risk if over-concentrated in one region
    if (maxGeographyExposure > 60) return 80;
    if (maxGeographyExposure > 40) return 50;
    return 20;
  }

  private calculateSectorRisk(portfolio: PortfolioHealthcareAsset[]): number {
    if (portfolio.length === 0) return 0;

    const sectorWeights = new Map<string, number>();

    portfolio.forEach((asset) => {
      const current = sectorWeights.get(asset.sector) || 0;
      sectorWeights.set(asset.sector, current + asset.percentageOfPortfolio);
    });

    const maxSectorExposure = Math.max(...sectorWeights.values());

    // All healthcare is somewhat sector-concentrated, but within healthcare subsectors
    if (maxSectorExposure > 70) return 70;
    if (maxSectorExposure > 50) return 40;
    return 20;
  }

  private calculateOverallRiskScore(risks: {
    diversificationScore: number;
    volatilityRisk: number;
    liquidityRisk: number;
    concentrationRisk: number;
    geographicRisk: number;
    sectorRisk: number;
  }): number {
    // Lower diversification = higher risk
    const diversificationRisk = 100 - risks.diversificationScore;

    const weightedRisk =
      diversificationRisk * 0.25 +
      risks.volatilityRisk * 0.25 +
      risks.concentrationRisk * 0.2 +
      risks.geographicRisk * 0.15 +
      risks.liquidityRisk * 0.1 +
      risks.sectorRisk * 0.05;

    // Convert to 1-10 scale
    return Math.min(10, Math.max(1, Math.round(weightedRisk / 10)));
  }

  private async generateRecommendations(
    portfolio: PortfolioHealthcareAsset[],
    profile: RiskProfile,
    risks: any,
  ): Promise<RiskRecommendation[]> {
    const recommendations: RiskRecommendation[] = [];

    // Diversification recommendations
    if (risks.diversificationScore < 60) {
      recommendations.push({
        type: "diversify",
        priority: "high",
        title: "Improve Portfolio Diversification",
        description:
          "Your portfolio could benefit from more diversification across sectors and regions",
        localizedExplanation: await this.getLocalizedRecommendation(
          "diversification",
          profile,
        ),
        actionRequired: true,
        estimatedImpact: 2,
      });
    }

    // Concentration risk recommendations
    if (risks.concentrationRisk > 60) {
      recommendations.push({
        type: "reduce_position",
        priority: "high",
        title: "Reduce Position Concentration",
        description:
          "Consider reducing your largest position to limit concentration risk",
        localizedExplanation: await this.getLocalizedRecommendation(
          "concentration",
          profile,
        ),
        actionRequired: true,
        estimatedImpact: 1.5,
      });
    }

    // First-time investor education
    if (profile.financialKnowledge === "beginner") {
      recommendations.push({
        type: "educational",
        priority: "medium",
        title: "Healthcare Investment Fundamentals",
        description:
          "Learn about healthcare investment basics and risk management",
        localizedExplanation: await this.getLocalizedRecommendation(
          "education",
          profile,
        ),
        actionRequired: false,
        estimatedImpact: 0,
      });
    }

    // Conservative profile with high-risk investments
    if (profile.riskTolerance === "conservative" && risks.volatilityRisk > 60) {
      recommendations.push({
        type: "rebalance",
        priority: "high",
        title: "Align Risk with Profile",
        description:
          "Your investments are riskier than your stated risk tolerance",
        localizedExplanation: await this.getLocalizedRecommendation(
          "risk_alignment",
          profile,
        ),
        actionRequired: true,
        estimatedImpact: 2.5,
      });
    }

    return recommendations;
  }

  private generateRiskAlerts(
    portfolio: PortfolioHealthcareAsset[],
    profile: RiskProfile,
    overallRiskScore: number,
  ): RiskAlert[] {
    const alerts: RiskAlert[] = [];

    // High risk score alert
    if (overallRiskScore >= 8) {
      alerts.push({
        level: "critical",
        title: "High Portfolio Risk Detected",
        message:
          "Your portfolio risk score is very high. Consider rebalancing.",
        localizedMessage:
          "Your investment risk is quite high. We recommend reviewing your portfolio.",
        timestamp: Date.now(),
        actionable: true,
      });
    }

    // Emergency fund check
    const monthlyExpensesCovered =
      profile.emergencyFund / profile.monthlyExpenses;
    if (monthlyExpensesCovered < 3) {
      alerts.push({
        level: "warning",
        title: "Low Emergency Fund",
        message:
          "Consider building your emergency fund before increasing investments",
        localizedMessage:
          "Build your emergency savings before investing more money",
        timestamp: Date.now(),
        actionable: true,
      });
    }

    // Over-investment warning for beginners
    const totalPortfolioValue = portfolio.reduce(
      (sum, asset) => sum + asset.holdingAmount * asset.currentPrice,
      0,
    );
    const investmentToIncomeRatio =
      totalPortfolioValue / (profile.monthlyIncome * 12);

    if (
      profile.financialKnowledge === "beginner" &&
      investmentToIncomeRatio > 0.1
    ) {
      alerts.push({
        level: "warning",
        title: "Consider Investment Pace",
        message: "As a new investor, consider starting with smaller amounts",
        localizedMessage:
          "Start with small investments to learn and gain experience",
        timestamp: Date.now(),
        actionable: false,
      });
    }

    return alerts;
  }

  private async getLocalizedRecommendation(
    type: string,
    profile: RiskProfile,
  ): Promise<string> {
    const prompts = {
      diversification:
        "Explain portfolio diversification to a first-time investor in simple terms",
      concentration:
        "Explain why having too much money in one investment is risky",
      education:
        "Recommend healthcare investment learning resources for beginners",
      risk_alignment:
        "Explain how to match investments with personal risk tolerance",
    };

    try {
      return await conversationalIntelligenceService.generateResponse(
        prompts[type as keyof typeof prompts] || prompts.education,
        "en", // Would be dynamic based on user preference
        { context: "risk_education", userProfile: profile },
      );
    } catch (error) {
      return "Consider consulting our educational resources or speaking with a financial advisor.";
    }
  }

  public async performStressTest(
    userId: string,
  ): Promise<PortfolioStressTest[]> {
    const portfolio = healthcareTokenizationService.getUserPortfolio();
    const profile = this.riskProfiles.get(userId);

    if (!profile) {
      throw new Error("Risk profile not found");
    }

    const scenarios: PortfolioStressTest[] = [
      {
        scenarioName: "Market Correction",
        description: "General healthcare market decline of 20%",
        potentialLoss: this.calculateScenarioLoss(portfolio, 0.2),
        probability: 0.15,
        timeframe: "6-12 months",
        mitigationStrategies: [
          "Maintain diversification across healthcare subsectors",
          "Keep emergency fund separate from investments",
          "Consider dollar-cost averaging for new investments",
        ],
      },
      {
        scenarioName: "Regulatory Changes",
        description: "New healthcare regulations affecting tokenized assets",
        potentialLoss: this.calculateScenarioLoss(portfolio, 0.35),
        probability: 0.08,
        timeframe: "3-6 months",
        mitigationStrategies: [
          "Stay informed about regulatory developments",
          "Diversify across different regulatory jurisdictions",
          "Consider traditional healthcare investments as hedge",
        ],
      },
      {
        scenarioName: "Technology Disruption",
        description: "Major breakthrough making current solutions obsolete",
        potentialLoss: this.calculateScenarioLoss(portfolio, 0.5),
        probability: 0.05,
        timeframe: "1-2 years",
        mitigationStrategies: [
          "Include innovative early-stage projects in portfolio",
          "Regularly review and update investment thesis",
          "Maintain exposure to established healthcare companies",
        ],
      },
    ];

    return scenarios;
  }

  private calculateScenarioLoss(
    portfolio: PortfolioHealthcareAsset[],
    lossPercentage: number,
  ): number {
    const totalValue = portfolio.reduce(
      (sum, asset) => sum + asset.holdingAmount * asset.currentPrice,
      0,
    );
    return totalValue * lossPercentage;
  }

  public getSimplifiedRiskExplanation(
    userId: string,
    language: string = "en",
  ): string {
    const assessment = this.riskAssessments.get(userId);
    if (!assessment) return "No risk assessment available";

    const riskLevel =
      assessment.overallRiskScore <= 3
        ? "Low"
        : assessment.overallRiskScore <= 6
          ? "Medium"
          : "High";

    const explanations = {
      en: {
        Low: "Your portfolio has low risk. This means steady, predictable returns but slower growth.",
        Medium:
          "Your portfolio has moderate risk. This balances growth potential with stability.",
        High: "Your portfolio has high risk. This means potential for high returns but also significant losses.",
      },
    };

    return explanations.en[riskLevel as keyof typeof explanations.en];
  }
}

export const riskAdvisorService = new RiskAdvisorService();
