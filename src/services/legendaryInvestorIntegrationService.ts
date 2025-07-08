import { singletonPattern } from "../utils/singletonPattern";
import { mungerMentalModelsService } from "./mungerMentalModelsService";
import { buffettMoatService } from "./buffettMoatService";
import { dalioSystemsService } from "./dalioSystemsService";
import { lynchLocalInsightService } from "./lynchLocalInsightService";

export interface LegendaryInvestorAnalysis {
  vaultId: string;
  overallScore: number; // 0-100
  philosophyScores: {
    mungerLattice: number; // Mental models + inversion
    buffettMoats: number; // Economic moats + long-term
    dalioSystems: number; // Diversification + transparency
    lynchLocal: number; // Local knowledge
  };
  combinedRecommendation: "strong_buy" | "buy" | "hold" | "sell" | "avoid";
  reasoning: string;
  riskAssessment: {
    failureModes: string[];
    diversificationBenefits: string[];
    moatProtection: string[];
    localSupport: string[];
  };
  opportunities: {
    contrarian: string[];
    longTerm: string[];
    local: string[];
    systematic: string[];
  };
  implementationPlan: {
    phase1_research: string[];
    phase2_community: string[];
    phase3_investment: string[];
    phase4_monitoring: string[];
  };
}

export interface EnterpriseInvestorDashboard {
  id: string;
  userId: string;
  subscription: "free" | "starter" | "professional" | "enterprise";
  activatedPhilosophies: string[];
  portfolioAllocations: Record<string, number>; // philosophy -> percentage
  performanceMetrics: {
    totalReturn: number;
    riskAdjustedReturn: number;
    diversificationScore: number;
    localKnowledgeUtilization: number;
    mentalModelAccuracy: number;
  };
  alerts: EnterpriseAlert[];
  insights: EnterpriseInsight[];
  lastUpdated: Date;
}

export interface EnterpriseAlert {
  id: string;
  type:
    | "contrarian_opportunity"
    | "moat_deterioration"
    | "local_risk"
    | "system_imbalance"
    | "inversion_warning";
  severity: "low" | "medium" | "high" | "critical";
  philosophy: "munger" | "buffett" | "dalio" | "lynch";
  title: string;
  description: string;
  actionRequired: string;
  deadline?: Date;
  relatedVaults: string[];
  timestamp: Date;
  resolved: boolean;
}

export interface EnterpriseInsight {
  id: string;
  category:
    | "market_timing"
    | "risk_management"
    | "opportunity_identification"
    | "portfolio_optimization";
  philosophyCombination: string[];
  title: string;
  insight: string;
  actionableSteps: string[];
  confidence: number; // 0-100
  timeHorizon: "immediate" | "short" | "medium" | "long";
  impact: "low" | "medium" | "high" | "transformational";
  timestamp: Date;
}

export interface CrossPhilosophySynergy {
  id: string;
  philosophyCombination: string[];
  synergyType: "reinforcing" | "complementary" | "balancing" | "amplifying";
  description: string;
  examples: string[];
  implementationGuide: string;
  riskMitigation: string;
  expectedBenefit: number; // 0-100
}

export interface AdaptiveInvestmentStrategy {
  id: string;
  name: string;
  primaryPhilosophy: "munger" | "buffett" | "dalio" | "lynch";
  supportingPhilosophies: string[];
  marketConditions: "bull" | "bear" | "sideways" | "volatile" | "crisis";
  strategy: {
    allocation: Record<string, number>; // asset type -> percentage
    riskLevel: "conservative" | "moderate" | "aggressive";
    timeHorizon: "short" | "medium" | "long";
    rebalancingFrequency: "monthly" | "quarterly" | "semi_annual" | "annual";
  };
  triggers: {
    activationConditions: string[];
    exitConditions: string[];
    adjustmentTriggers: string[];
  };
  expectedOutcomes: {
    bestCase: number;
    baseCase: number;
    worstCase: number;
    probability: number;
  };
}

class LegendaryInvestorIntegrationService {
  private analyses: Map<string, LegendaryInvestorAnalysis> = new Map();
  private enterpriseDashboards: Map<string, EnterpriseInvestorDashboard> =
    new Map();
  private crossPhilosophySynergies: Map<string, CrossPhilosophySynergy> =
    new Map();
  private adaptiveStrategies: Map<string, AdaptiveInvestmentStrategy> =
    new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize all constituent services
    await Promise.all([
      mungerMentalModelsService.initialize(),
      buffettMoatService.initialize(),
      dalioSystemsService.initialize(),
      lynchLocalInsightService.initialize(),
    ]);

    await this.setupCrossPhilosophySynergies();
    await this.createAdaptiveStrategies();

    this.startIntegratedAnalysis();
    this.startSynergyMonitoring();
    this.startAdaptiveStrategyManagement();

    this.isInitialized = true;
    console.log(
      "Legendary Investor Integration Service initialized with all four philosophies",
    );
  }

  private async setupCrossPhilosophySynergies(): Promise<void> {
    const synergies: CrossPhilosophySynergy[] = [
      {
        id: "synergy-munger-buffett",
        philosophyCombination: ["munger", "buffett"],
        synergyType: "reinforcing",
        description:
          "Munger's mental models reinforce Buffett's moat analysis by providing multiple disciplinary lenses to evaluate competitive advantages",
        examples: [
          "Network effects model validates ecosystem connectivity moats",
          "Psychology models explain community adoption barriers",
          "Ecological resilience models support long-term moat durability",
        ],
        implementationGuide:
          "Apply mental models during moat evaluation, use inversion to stress-test moat permanence",
        riskMitigation:
          "Mental models prevent overconfidence in moat strength assessments",
        expectedBenefit: 87,
      },
      {
        id: "synergy-dalio-lynch",
        philosophyCombination: ["dalio", "lynch"],
        synergyType: "complementary",
        description:
          "Dalio's systematic diversification balances Lynch's concentrated local knowledge investments",
        examples: [
          "Global portfolio contains multiple Lynch-style local opportunities",
          "Local insights inform global asset allocation decisions",
          "Systematic rebalancing captures local opportunity cycles",
        ],
        implementationGuide:
          "Build diversified portfolio of locally-validated opportunities across multiple regions",
        riskMitigation:
          "Diversification limits risk of local knowledge blind spots",
        expectedBenefit: 82,
      },
      {
        id: "synergy-munger-dalio",
        philosophyCombination: ["munger", "dalio"],
        synergyType: "amplifying",
        description:
          "Munger's inversion principles amplify Dalio's radical transparency by systematically identifying what could go wrong",
        examples: [
          "Inversion analysis reveals portfolio failure modes",
          "Mental models improve transparency framework design",
          "Bias detection enhances decision-making processes",
        ],
        implementationGuide:
          "Integrate inversion checks into all transparent decision processes",
        riskMitigation:
          "Systematic failure mode analysis prevents overconfidence",
        expectedBenefit: 91,
      },
      {
        id: "synergy-buffett-lynch",
        philosophyCombination: ["buffett", "lynch"],
        synergyType: "balancing",
        description:
          "Buffett's long-term moat focus balances Lynch's local opportunity responsiveness",
        examples: [
          "Local insights validate long-term moat sustainability",
          "Community knowledge confirms ecosystem permanence",
          "Local expertise guides moat development strategies",
        ],
        implementationGuide:
          "Use local knowledge to validate and strengthen identified moats over time",
        riskMitigation:
          "Local expertise prevents academic moat analysis disconnected from reality",
        expectedBenefit: 85,
      },
      {
        id: "synergy-all-four",
        philosophyCombination: ["munger", "buffett", "dalio", "lynch"],
        synergyType: "amplifying",
        description:
          "All four philosophies create a comprehensive investment framework that is wise, durable, transparent, and grounded",
        examples: [
          "Mental models guide systematic diversification",
          "Local knowledge validates moat strength",
          "Transparency reveals failure modes",
          "Long-term thinking grounds local enthusiasm",
        ],
        implementationGuide:
          "Create investment committee representing all four philosophies for major decisions",
        riskMitigation:
          "Each philosophy compensates for others' potential blind spots",
        expectedBenefit: 96,
      },
    ];

    for (const synergy of synergies) {
      this.crossPhilosophySynergies.set(synergy.id, synergy);
    }
  }

  private async createAdaptiveStrategies(): Promise<void> {
    const strategies: AdaptiveInvestmentStrategy[] = [
      {
        id: "strategy-crisis-response",
        name: "Crisis Response Strategy",
        primaryPhilosophy: "munger",
        supportingPhilosophies: ["buffett", "lynch"],
        marketConditions: "crisis",
        strategy: {
          allocation: {
            high_moat_ecosystems: 40,
            local_community_projects: 30,
            emergency_reserves: 20,
            contrarian_opportunities: 10,
          },
          riskLevel: "conservative",
          timeHorizon: "medium",
          rebalancingFrequency: "monthly",
        },
        triggers: {
          activationConditions: [
            "Market volatility > 40%",
            "Multiple ecosystem threats identified",
            "Community trust scores declining",
          ],
          exitConditions: [
            "Market stability restored",
            "Community confidence improving",
            "Ecosystem threats mitigated",
          ],
          adjustmentTriggers: [
            "Local opportunity emergence",
            "Moat strength changes",
            "Community feedback shifts",
          ],
        },
        expectedOutcomes: {
          bestCase: 0.15,
          baseCase: 0.08,
          worstCase: 0.02,
          probability: 0.75,
        },
      },
      {
        id: "strategy-growth-capture",
        name: "Growth Capture Strategy",
        primaryPhilosophy: "lynch",
        supportingPhilosophies: ["buffett", "dalio"],
        marketConditions: "bull",
        strategy: {
          allocation: {
            emerging_local_opportunities: 35,
            established_moat_ecosystems: 25,
            diversified_global_portfolio: 25,
            innovation_ventures: 15,
          },
          riskLevel: "moderate",
          timeHorizon: "medium",
          rebalancingFrequency: "quarterly",
        },
        triggers: {
          activationConditions: [
            "Local opportunity pipeline strong",
            "Community engagement high",
            "Market sentiment positive",
          ],
          exitConditions: [
            "Local opportunities saturated",
            "Market overheating signals",
            "Community resistance increasing",
          ],
          adjustmentTriggers: [
            "New local insights available",
            "Moat development opportunities",
            "Diversification rebalancing needed",
          ],
        },
        expectedOutcomes: {
          bestCase: 0.25,
          baseCase: 0.14,
          worstCase: 0.06,
          probability: 0.65,
        },
      },
      {
        id: "strategy-all-weather-excellence",
        name: "All-Weather Excellence Strategy",
        primaryPhilosophy: "dalio",
        supportingPhilosophies: ["munger", "buffett", "lynch"],
        marketConditions: "sideways",
        strategy: {
          allocation: {
            global_ecosystem_diversification: 30,
            high_moat_permanent_assets: 25,
            local_knowledge_micro_investments: 25,
            systematic_rebalancing_fund: 20,
          },
          riskLevel: "moderate",
          timeHorizon: "long",
          rebalancingFrequency: "quarterly",
        },
        triggers: {
          activationConditions: [
            "Market volatility moderate",
            "No clear trend direction",
            "All philosophies showing value",
          ],
          exitConditions: [
            "Strong trend emerges",
            "Crisis conditions develop",
            "Major opportunities concentrate",
          ],
          adjustmentTriggers: [
            "Correlation changes detected",
            "New mental models validated",
            "Local knowledge updates",
          ],
        },
        expectedOutcomes: {
          bestCase: 0.18,
          baseCase: 0.12,
          worstCase: 0.05,
          probability: 0.85,
        },
      },
    ];

    for (const strategy of strategies) {
      this.adaptiveStrategies.set(strategy.id, strategy);
    }
  }

  async generateIntegratedAnalysis(
    vaultId: string,
  ): Promise<LegendaryInvestorAnalysis> {
    // Get analysis from each philosophy
    const [
      latticeRecommendations,
      moatAnalysis,
      portfolioAnalysis,
      localInsights,
    ] = await Promise.all([
      mungerMentalModelsService.getLatticeRecommendations(vaultId),
      buffettMoatService.getMoatAnalysis(vaultId),
      dalioSystemsService.getPortfolioAnalysis("kit-all-weather-ecosystem"),
      lynchLocalInsightService.getLocalInsights({ region: "all" }),
    ]);

    // Calculate individual philosophy scores
    const mungerScore = this.calculateMungerScore(latticeRecommendations);
    const buffettScore = this.calculateBuffettScore(moatAnalysis);
    const dalioScore = this.calculateDalioScore(portfolioAnalysis);
    const lynchScore = this.calculateLynchScore(localInsights, vaultId);

    // Calculate weighted overall score
    const overallScore =
      mungerScore * 0.25 +
      buffettScore * 0.3 +
      dalioScore * 0.25 +
      lynchScore * 0.2;

    // Generate combined recommendation
    const combinedRecommendation = this.generateCombinedRecommendation(
      overallScore,
      mungerScore,
      buffettScore,
      dalioScore,
      lynchScore,
    );

    // Generate comprehensive reasoning
    const reasoning = this.generateIntegratedReasoning(
      mungerScore,
      buffettScore,
      dalioScore,
      lynchScore,
      combinedRecommendation,
    );

    // Create risk assessment
    const riskAssessment = await this.generateRiskAssessment(vaultId);

    // Identify opportunities
    const opportunities = await this.identifyOpportunities(vaultId);

    // Create implementation plan
    const implementationPlan = await this.createImplementationPlan(
      vaultId,
      combinedRecommendation,
    );

    const analysis: LegendaryInvestorAnalysis = {
      vaultId,
      overallScore,
      philosophyScores: {
        mungerLattice: mungerScore,
        buffettMoats: buffettScore,
        dalioSystems: dalioScore,
        lynchLocal: lynchScore,
      },
      combinedRecommendation,
      reasoning,
      riskAssessment,
      opportunities,
      implementationPlan,
    };

    this.analyses.set(vaultId, analysis);
    return analysis;
  }

  private calculateMungerScore(recommendations: any[]): number {
    if (!recommendations || recommendations.length === 0) return 50;
    return (
      recommendations.reduce((sum, rec) => sum + rec.confidence, 0) /
      recommendations.length
    );
  }

  private calculateBuffettScore(analysis: any): number {
    if (!analysis) return 50;
    return analysis.overallMoatScore || 50;
  }

  private calculateDalioScore(analysis: any): number {
    if (!analysis) return 50;
    return analysis.diversificationAnalysis?.score || 50;
  }

  private calculateLynchScore(insights: any[], vaultId: string): number {
    if (!insights || insights.length === 0) return 50;

    // Find insights related to this vault
    const relevantInsights = insights.filter(
      (insight) =>
        insight.vaultCandidate &&
        insight.vaultCandidate.toLowerCase().includes(vaultId.toLowerCase()),
    );

    if (relevantInsights.length === 0) return 60; // Neutral score if no local insights

    return (
      relevantInsights.reduce((sum, insight) => sum + insight.impactScore, 0) /
      relevantInsights.length
    );
  }

  private generateCombinedRecommendation(
    overallScore: number,
    mungerScore: number,
    buffettScore: number,
    dalioScore: number,
    lynchScore: number,
  ): LegendaryInvestorAnalysis["combinedRecommendation"] {
    // Consider both overall score and individual philosophy alignment
    const minScore = Math.min(
      mungerScore,
      buffettScore,
      dalioScore,
      lynchScore,
    );

    // If any philosophy strongly objects (score < 30), be cautious
    if (minScore < 30) {
      return overallScore > 70 ? "hold" : "avoid";
    }

    // Strong alignment across all philosophies
    if (overallScore >= 85 && minScore >= 70) return "strong_buy";
    if (overallScore >= 75 && minScore >= 60) return "buy";
    if (overallScore >= 60) return "hold";
    if (overallScore >= 45) return "sell";
    return "avoid";
  }

  private generateIntegratedReasoning(
    mungerScore: number,
    buffettScore: number,
    dalioScore: number,
    lynchScore: number,
    recommendation: string,
  ): string {
    const reasons: string[] = [];

    if (mungerScore >= 80) {
      reasons.push(
        "Strong mental model validation with effective inversion analysis",
      );
    } else if (mungerScore <= 40) {
      reasons.push("Mental model concerns and failure mode risks identified");
    }

    if (buffettScore >= 80) {
      reasons.push("Exceptional moat strength with long-term durability");
    } else if (buffettScore <= 40) {
      reasons.push("Weak competitive positioning and moat vulnerabilities");
    }

    if (dalioScore >= 80) {
      reasons.push(
        "Excellent diversification benefits and systematic integration",
      );
    } else if (dalioScore <= 40) {
      reasons.push(
        "Poor fit with diversified portfolio and correlation concerns",
      );
    }

    if (lynchScore >= 80) {
      reasons.push("Strong local knowledge validation and community support");
    } else if (lynchScore <= 40) {
      reasons.push("Limited local insights and community acceptance questions");
    }

    const prefix =
      recommendation === "strong_buy"
        ? "Compelling opportunity:"
        : recommendation === "buy"
          ? "Attractive investment:"
          : recommendation === "hold"
            ? "Mixed signals:"
            : recommendation === "sell"
              ? "Concerning indicators:"
              : "Avoid due to:";

    return `${prefix} ${reasons.join("; ")}.`;
  }

  private async generateRiskAssessment(
    vaultId: string,
  ): Promise<LegendaryInvestorAnalysis["riskAssessment"]> {
    const [inversionAnalyses, moatAnalysis, portfolioAnalysis, localInsights] =
      await Promise.all([
        mungerMentalModelsService.getInversionAnalyses(),
        buffettMoatService.getMoatAnalysis(vaultId),
        dalioSystemsService.getPortfolioAnalysis("kit-all-weather-ecosystem"),
        lynchLocalInsightService.getLocalInsights({ region: "all" }),
      ]);

    return {
      failureModes: inversionAnalyses
        .map((analysis) => analysis.failureModes)
        .flat()
        .slice(0, 5),
      diversificationBenefits: [
        "Geographic risk distribution",
        "Ecosystem type diversification",
        "Time horizon balance",
        "Currency exposure spreading",
      ],
      moatProtection: moatAnalysis?.primaryMoats?.map((moat) => moat.name) || [
        "Limited moat protection",
      ],
      localSupport: localInsights
        .filter((insight) => insight.localKnowledge.communityRelations > 70)
        .map((insight) => `${insight.region}: ${insight.title}`)
        .slice(0, 3),
    };
  }

  private async identifyOpportunities(
    vaultId: string,
  ): Promise<LegendaryInvestorAnalysis["opportunities"]> {
    const [
      contrairianAlerts,
      compoundingSimulations,
      allWorldKits,
      localOpportunities,
    ] = await Promise.all([
      // contrairianAlerts would come from existing legendary investor service
      Promise.resolve([]),
      buffettMoatService.getAllCompoundingSimulations(),
      dalioSystemsService.getAllWorldEcosystemKits(),
      lynchLocalInsightService.getLocalOpportunities(),
    ]);

    return {
      contrarian: [
        "Maximum pessimism in sector creates entry opportunity",
        "Community concerns at peak provide value entry",
        "Regulatory uncertainty creating artificial discount",
      ],
      longTerm: [
        "Compounding ecosystem health over decades",
        "Moat strengthening through community investment",
        "Permanent capital advantages in conservation",
      ],
      local: localOpportunities.slice(0, 3).map((opp) => opp.name),
      systematic: [
        "Portfolio rebalancing opportunity",
        "Correlation benefit addition",
        "Risk-adjusted return improvement",
      ],
    };
  }

  private async createImplementationPlan(
    vaultId: string,
    recommendation: string,
  ): Promise<LegendaryInvestorAnalysis["implementationPlan"]> {
    if (recommendation === "avoid" || recommendation === "sell") {
      return {
        phase1_research: [
          "Document avoidance reasoning",
          "Monitor for changes",
        ],
        phase2_community: ["Maintain stakeholder relationships"],
        phase3_investment: ["Avoid allocation", "Consider alternatives"],
        phase4_monitoring: ["Quarterly review for improvements"],
      };
    }

    return {
      phase1_research: [
        "Complete mental model analysis",
        "Validate moat assessment",
        "Review diversification impact",
        "Gather additional local insights",
      ],
      phase2_community: [
        "Engage local stakeholders",
        "Build community partnerships",
        "Establish communication channels",
        "Create feedback mechanisms",
      ],
      phase3_investment: [
        "Determine optimal allocation size",
        "Structure long-term commitment",
        "Implement gradual entry strategy",
        "Set performance milestones",
      ],
      phase4_monitoring: [
        "Track ecosystem health metrics",
        "Monitor community sentiment",
        "Review competitive dynamics",
        "Assess portfolio balance",
      ],
    };
  }

  async createEnterpriseInvestorDashboard(
    userId: string,
    subscription: EnterpriseInvestorDashboard["subscription"],
  ): Promise<EnterpriseInvestorDashboard> {
    const dashboardId = `enterprise-${userId}`;

    // Define subscription-based access
    const subscriptionAccess = {
      free: ["munger"],
      starter: ["munger", "lynch"],
      professional: ["munger", "buffett", "lynch"],
      enterprise: ["munger", "buffett", "dalio", "lynch"],
    };

    const dashboard: EnterpriseInvestorDashboard = {
      id: dashboardId,
      userId,
      subscription,
      activatedPhilosophies: subscriptionAccess[subscription],
      portfolioAllocations: this.getDefaultAllocations(subscription),
      performanceMetrics: {
        totalReturn: 0.089,
        riskAdjustedReturn: 0.067,
        diversificationScore: 75,
        localKnowledgeUtilization: 68,
        mentalModelAccuracy: 84,
      },
      alerts: [],
      insights: [],
      lastUpdated: new Date(),
    };

    this.enterpriseDashboards.set(dashboardId, dashboard);
    return dashboard;
  }

  private getDefaultAllocations(subscription: string): Record<string, number> {
    switch (subscription) {
      case "free":
        return { munger: 100 };
      case "starter":
        return { munger: 60, lynch: 40 };
      case "professional":
        return { munger: 30, buffett: 40, lynch: 30 };
      case "enterprise":
        return { munger: 25, buffett: 30, dalio: 25, lynch: 20 };
      default:
        return { munger: 100 };
    }
  }

  // Background processes
  private startIntegratedAnalysis(): void {
    setInterval(() => {
      this.updateIntegratedAnalyses();
    }, 3600000); // Every hour
  }

  private startSynergyMonitoring(): void {
    setInterval(() => {
      this.monitorPhilosophySynergies();
    }, 7200000); // Every 2 hours
  }

  private startAdaptiveStrategyManagement(): void {
    setInterval(() => {
      this.updateAdaptiveStrategies();
    }, 86400000); // Daily
  }

  private async updateIntegratedAnalyses(): Promise<void> {
    // Update all vault analyses
    const vaultIds = [
      "vault-amazon-rainforest",
      "vault-antarctic-krill",
      "vault-sahel-reforestation",
    ];

    for (const vaultId of vaultIds) {
      await this.generateIntegratedAnalysis(vaultId);
    }
  }

  private async monitorPhilosophySynergies(): Promise<void> {
    // Monitor and update synergy effectiveness
    for (const [id, synergy] of this.crossPhilosophySynergies.entries()) {
      // Simulate synergy effectiveness tracking
      const effectiveness = 80 + Math.random() * 20; // 80-100% effectiveness
      synergy.expectedBenefit =
        synergy.expectedBenefit * 0.9 + effectiveness * 0.1;
    }
  }

  private async updateAdaptiveStrategies(): Promise<void> {
    // Update strategy outcomes based on market conditions
    for (const [id, strategy] of this.adaptiveStrategies.entries()) {
      // Simulate performance updates
      const performance = 0.05 + Math.random() * 0.15; // 5-20% returns
      strategy.expectedOutcomes.baseCase =
        strategy.expectedOutcomes.baseCase * 0.8 + performance * 0.2;
    }
  }

  // Public interface methods
  async getIntegratedAnalysis(
    vaultId: string,
  ): Promise<LegendaryInvestorAnalysis | null> {
    let analysis = this.analyses.get(vaultId);
    if (!analysis) {
      analysis = await this.generateIntegratedAnalysis(vaultId);
    }
    return analysis;
  }

  async getAllIntegratedAnalyses(): Promise<LegendaryInvestorAnalysis[]> {
    return Array.from(this.analyses.values()).sort(
      (a, b) => b.overallScore - a.overallScore,
    );
  }

  async getEnterpriseInvestorDashboard(
    userId: string,
  ): Promise<EnterpriseInvestorDashboard | null> {
    return this.enterpriseDashboards.get(`enterprise-${userId}`) || null;
  }

  async getCrossPhilosophySynergies(): Promise<CrossPhilosophySynergy[]> {
    return Array.from(this.crossPhilosophySynergies.values()).sort(
      (a, b) => b.expectedBenefit - a.expectedBenefit,
    );
  }

  async getAdaptiveStrategies(
    marketConditions?: string,
  ): Promise<AdaptiveInvestmentStrategy[]> {
    let strategies = Array.from(this.adaptiveStrategies.values());
    if (marketConditions) {
      strategies = strategies.filter(
        (strategy) => strategy.marketConditions === marketConditions,
      );
    }
    return strategies.sort(
      (a, b) => b.expectedOutcomes.probability - a.expectedOutcomes.probability,
    );
  }

  async generateEnterpriseInsights(
    userId: string,
  ): Promise<EnterpriseInsight[]> {
    const dashboard = await this.getEnterpriseInvestorDashboard(userId);
    if (!dashboard) return [];

    const insights: EnterpriseInsight[] = [
      {
        id: `insight-${Date.now()}-1`,
        category: "portfolio_optimization",
        philosophyCombination: ["munger", "buffett"],
        title: "Mental Models Reinforce Moat Analysis",
        insight:
          "Combining ecological resilience models with moat analysis reveals ecosystem investments with exceptional long-term defensibility",
        actionableSteps: [
          "Review current investments through multiple mental models",
          "Prioritize ecosystems with network effects and switching costs",
          "Apply inversion to test moat permanence assumptions",
        ],
        confidence: 87,
        timeHorizon: "medium",
        impact: "high",
        timestamp: new Date(),
      },
      {
        id: `insight-${Date.now()}-2`,
        category: "opportunity_identification",
        philosophyCombination: ["dalio", "lynch"],
        title: "Local Knowledge Validates Global Diversification",
        insight:
          "Systematic diversification combined with local insights identifies undervalued opportunities in overlooked regions",
        actionableSteps: [
          "Map local knowledge gaps in current portfolio",
          "Identify high-impact local opportunities",
          "Balance global diversification with local concentration",
        ],
        confidence: 82,
        timeHorizon: "short",
        impact: "medium",
        timestamp: new Date(),
      },
      {
        id: `insight-${Date.now()}-3`,
        category: "risk_management",
        philosophyCombination: ["munger", "dalio"],
        title: "Inversion Enhances Systematic Risk Management",
        insight:
          "Applying Munger's inversion to Dalio's all-weather approach reveals portfolio failure modes and strengthens risk management",
        actionableSteps: [
          "Conduct inversion analysis on current allocation",
          "Identify systematic failure modes",
          "Implement guardrails for identified risks",
        ],
        confidence: 91,
        timeHorizon: "immediate",
        impact: "high",
        timestamp: new Date(),
      },
    ];

    // Update dashboard with insights
    if (dashboard) {
      dashboard.insights = insights;
      dashboard.lastUpdated = new Date();
    }

    return insights;
  }

  async updatePortfolioAllocation(
    userId: string,
    newAllocations: Record<string, number>,
  ): Promise<{ success: boolean; message: string }> {
    const dashboard = await this.getEnterpriseInvestorDashboard(userId);
    if (!dashboard) {
      return { success: false, message: "Dashboard not found" };
    }

    // Validate allocation totals to 100%
    const total = Object.values(newAllocations).reduce(
      (sum, val) => sum + val,
      0,
    );
    if (Math.abs(total - 100) > 0.01) {
      return { success: false, message: "Allocations must total 100%" };
    }

    // Validate subscription access
    const invalidPhilosophies = Object.keys(newAllocations).filter(
      (philosophy) => !dashboard.activatedPhilosophies.includes(philosophy),
    );

    if (invalidPhilosophies.length > 0) {
      return {
        success: false,
        message: `Subscription does not include: ${invalidPhilosophies.join(", ")}`,
      };
    }

    dashboard.portfolioAllocations = newAllocations;
    dashboard.lastUpdated = new Date();

    return {
      success: true,
      message: "Portfolio allocation updated successfully",
    };
  }

  async generateMarketTimingInsight(): Promise<EnterpriseInsight> {
    // Combine all philosophies for market timing
    const mungerInversions =
      await mungerMentalModelsService.getInversionAnalyses();
    const moatTrends = await buffettMoatService.getAllMoatAnalyses();
    const dalioBalance = await dalioSystemsService.getAllWorldEcosystemKits();
    const localSentiment = await lynchLocalInsightService.getLocalInsights();

    const insight: EnterpriseInsight = {
      id: `market-timing-${Date.now()}`,
      category: "market_timing",
      philosophyCombination: ["munger", "buffett", "dalio", "lynch"],
      title: "Four-Philosophy Market Assessment",
      insight:
        "Current market conditions show: Munger inversion signals caution, Buffett moats remain strong, Dalio balance favors diversification, Lynch local sentiment mixed",
      actionableSteps: [
        "Maintain defensive positioning per Munger analysis",
        "Focus on highest-moat opportunities per Buffett",
        "Rebalance portfolio per Dalio principles",
        "Monitor local developments per Lynch approach",
      ],
      confidence: 85,
      timeHorizon: "short",
      impact: "high",
      timestamp: new Date(),
    };

    return insight;
  }

  // Additional methods for enterprise dashboard
  async getDashboardMetrics(): Promise<any> {
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

  async getCrossPhilosophyRecommendations(): Promise<any[]> {
    return [
      {
        id: "rec_001",
        title: "Mental Models Reinforce Moat Analysis",
        description:
          "Combine ecological thinking with competitive advantage analysis for stronger investment decisions",
        philosophies: ["Munger", "Buffett"],
        confidence: 87,
        impact: "high",
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
        impact: "medium",
        timeframe: "1-3 months",
        action: "Explore Opportunities",
      },
    ];
  }

  async getPerformanceMetrics(timeRange: string): Promise<any[]> {
    return [
      {
        name: "Portfolio Return",
        value: 12.5,
        change: 2.1,
        trend: "up",
        benchmark: 8.3,
      },
      {
        name: "Risk-Adjusted Return",
        value: 1.85,
        change: 0.15,
        trend: "up",
        benchmark: 1.42,
      },
      {
        name: "Max Drawdown",
        value: -8.5,
        change: 1.2,
        trend: "down",
        benchmark: -12.3,
      },
    ];
  }

  async getCurrentPortfolioAssets(): Promise<any[]> {
    return [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        currentPrice: 185.25,
        weight: 15.2,
        value: 190000,
        dayChange: 2.1,
        weekChange: 3.8,
        monthChange: 8.5,
        yearChange: 24.7,
        volatility: 0.28,
        sharpeRatio: 1.45,
        moatScore: 92,
        mungerScore: 88,
        lynchInsightScore: 85,
        dalioRiskScore: 25,
      },
      {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        currentPrice: 378.9,
        weight: 12.8,
        value: 160000,
        dayChange: 1.5,
        weekChange: 2.2,
        monthChange: 6.3,
        yearChange: 18.9,
        volatility: 0.24,
        sharpeRatio: 1.62,
        moatScore: 90,
        mungerScore: 85,
        lynchInsightScore: 78,
        dalioRiskScore: 22,
      },
    ];
  }

  async applyPortfolioOptimization(options: any): Promise<void> {
    console.log("Applying portfolio optimization:", options);
    // Simulate optimization application
  }

  async getSubscriptionTiers(): Promise<any[]> {
    return [
      {
        id: "free_monthly",
        name: "Free",
        price: 0,
        period: "month",
        description: "Basic access to legendary investor insights",
        billing_cycle: "monthly",
        currency: "USD",
        popular: false,
        enterprise: false,
        features: [
          { name: "Limited Munger mental models", included: true },
          { name: "Basic Buffett moat analysis", included: true },
          { name: "Simple portfolio tracking", included: true },
          { name: "Community forum access", included: true },
          { name: "Advanced analytics", included: false },
          { name: "Real-time alerts", included: false },
        ],
        archetype_access: ["emerging_market_citizen"],
        limits: {
          api_calls: 1000,
          storage_gb: 1,
          concurrent_sessions: 1,
          support_level: "community",
        },
      },
      {
        id: "professional_monthly",
        name: "Professional",
        price: 149,
        period: "month",
        description: "Advanced investment intelligence for serious investors",
        billing_cycle: "monthly",
        currency: "USD",
        popular: true,
        enterprise: false,
        features: [
          { name: "Complete legendary investor suite", included: true },
          { name: "Advanced MCTS optimization", included: true },
          { name: "Real-time market alerts", included: true },
          { name: "Unlimited portfolio tracking", included: true },
          { name: "API access", included: true },
          { name: "Priority support", included: true },
        ],
        archetype_access: [
          "financial_advisor",
          "cultural_investor",
          "diaspora_investor",
          "developer_integrator",
          "public_sector_ngo",
          "quant_data_driven_investor",
        ],
        limits: {
          api_calls: 100000,
          storage_gb: 10,
          concurrent_sessions: 5,
          support_level: "priority",
        },
      },
    ];
  }
}

export const legendaryInvestorIntegrationService = singletonPattern(
  () => new LegendaryInvestorIntegrationService(),
);
