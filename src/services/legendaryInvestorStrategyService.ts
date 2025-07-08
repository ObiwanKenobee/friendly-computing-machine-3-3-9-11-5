import { singletonPattern } from "../utils/singletonPattern";

export interface InvestorPhilosophy {
  id: string;
  name: string;
  investor:
    | "benjamin_graham"
    | "warren_buffett"
    | "howard_marks"
    | "john_templeton";
  description: string;
  coreInsight: string;
  keyPrinciples: string[];
  implementationStrategy: string;
  riskTolerance:
    | "very_conservative"
    | "conservative"
    | "moderate"
    | "aggressive";
  timeHorizon: "short" | "medium" | "long" | "permanent";
  marketApproach: "value" | "growth" | "contrarian" | "cyclical";
}

export interface ValueVault {
  id: string;
  name: string;
  description: string;
  ecosystemType:
    | "rainforest"
    | "wetlands"
    | "marine"
    | "desert"
    | "tundra"
    | "grassland";
  region: string;
  intrinsicValue: number;
  currentPrice: number;
  safetyMargin: number; // percentage below intrinsic value
  grahamScore: number; // 0-100 Benjamin Graham safety rating
  buffettMoatScore: number; // 0-100 competitive moat strength
  marksCyclePhase: "early" | "growth" | "mature" | "decline" | "recovery";
  templetonContrarian: number; // 0-100 contrarian opportunity score
  tokenSupply: number;
  lockedTokens: number;
  yieldRate: number;
  minimumLockPeriod: number; // days
  maxLockPeriod: number; // days
  lockMultiplier: number; // yield multiplier for longer locks
  status: "pre_launch" | "active" | "oversubscribed" | "mature" | "declining";
  lastRebalance: Date;
  nextRebalance: Date;
  conservationImpact: {
    speciesProtected: number;
    carbonSequestered: number; // tons per year
    habitatRestored: number; // hectares
    communityJobs: number;
    biodiversityIndex: number; // 0-100
  };
}

export interface InvestorAgent {
  id: string;
  name: string;
  philosophy: InvestorPhilosophy["investor"];
  active: boolean;
  confidence: number; // 0-100
  currentRecommendations: AgentRecommendation[];
  portfolioAllocation: Record<string, number>; // vaultId -> percentage
  performance: {
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    avgHoldingPeriod: number; // days
  };
  lastUpdate: Date;
}

export interface AgentRecommendation {
  id: string;
  agentId: string;
  vaultId: string;
  action: "buy" | "sell" | "hold" | "lock" | "rebalance";
  reasoning: string;
  confidence: number; // 0-100
  urgency: "low" | "medium" | "high" | "critical";
  targetAllocation: number; // percentage
  expectedReturn: number;
  riskAssessment: string;
  philosophyAlignment: {
    graham_safety: number; // 0-100
    buffett_moat: number; // 0-100
    marks_cycle: number; // 0-100
    templeton_contrarian: number; // 0-100
  };
  timestamp: Date;
  validUntil: Date;
}

export interface CyclicAnalysis {
  ecosystemType: string;
  region: string;
  currentPhase:
    | "early_spring"
    | "late_spring"
    | "summer"
    | "early_autumn"
    | "late_autumn"
    | "winter";
  cycleConfidence: number; // 0-100
  seasonalPatterns: {
    biodiversity: number[];
    carbon_absorption: number[];
    conservation_activity: number[];
    funding_flows: number[];
  };
  predictedTurning: {
    phase: string;
    confidence: number;
    timeframe: string;
    implications: string[];
  };
  arbitrageOpportunity: number; // 0-100 score
}

export interface ContrairianAlert {
  id: string;
  vaultId: string;
  alertType:
    | "undervalued_ecosystem"
    | "sentiment_extreme"
    | "frontier_opportunity"
    | "recovery_signal";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  templetonScore: number; // 0-100 contrarian opportunity
  marketSentiment: number; // -100 to 100 (negative = pessimistic)
  fundamentalHealth: number; // 0-100 ecosystem health
  catalysts: string[];
  timeWindow: string;
  potentialReturn: number;
  riskFactors: string[];
  created: Date;
  resolved: boolean;
}

export interface SentimentOverlay {
  vaultId: string;
  overallSentiment: number; // -100 to 100
  crowdConfidence: number; // 0-100
  expertConsensus: number; // -100 to 100
  mediaAttention: number; // 0-100
  institutionalFlow: number; // -100 to 100 (inflow/outflow)
  retailFlow: number; // -100 to 100
  fearGreedIndex: number; // 0-100
  contrairianSignal: "strong_buy" | "buy" | "neutral" | "sell" | "strong_sell";
  lastUpdated: Date;
}

class LegendaryInvestorStrategyService {
  private philosophies: Map<string, InvestorPhilosophy> = new Map();
  private valueVaults: Map<string, ValueVault> = new Map();
  private investorAgents: Map<string, InvestorAgent> = new Map();
  private cyclicAnalyses: Map<string, CyclicAnalysis> = new Map();
  private contrairianAlerts: Map<string, ContrairianAlert> = new Map();
  private sentimentData: Map<string, SentimentOverlay> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize legendary investor philosophies
    await this.createInvestorPhilosophies();
    await this.createValueVaults();
    await this.createInvestorAgents();

    // Start intelligent monitoring systems
    this.startCyclicAnalysis();
    this.startContrairianMonitoring();
    this.startSentimentTracking();
    this.startAgentRecommendations();

    this.isInitialized = true;
    console.log(
      "Legendary Investor Strategy Service initialized with Graham-Buffett-Marks-Templeton intelligence",
    );
  }

  private async createInvestorPhilosophies(): Promise<void> {
    const philosophies: InvestorPhilosophy[] = [
      {
        id: "philosophy-benjamin-graham",
        name: "Margin of Safety & Value Discipline",
        investor: "benjamin_graham",
        description:
          "Buy assets below intrinsic value to ensure safety and long-term returns",
        coreInsight:
          "Price is what you pay, value is what you get. Always maintain a margin of safety.",
        keyPrinciples: [
          "Buy below intrinsic value",
          "Maintain significant safety margin",
          "Focus on asset backing",
          "Ignore market mood swings",
          "Diversify intelligently",
          "Be patient for opportunities",
        ],
        implementationStrategy:
          "ValueVaults™ with built-in safety buffers and continuous intrinsic value monitoring",
        riskTolerance: "very_conservative",
        timeHorizon: "long",
        marketApproach: "value",
      },
      {
        id: "philosophy-warren-buffett",
        name: "Quality, Moats & Long-term Compounding",
        investor: "warren_buffett",
        description:
          "Invest in high-moat businesses and hold them permanently for compounding returns",
        coreInsight:
          "Time is the friend of the wonderful business, the enemy of the mediocre.",
        keyPrinciples: [
          "Invest in quality with moats",
          "Hold for decades, not quarters",
          "Compound through reinvestment",
          "Focus on ecosystem resilience",
          "Understand the conservation business",
          "Buy when others are fearful",
        ],
        implementationStrategy:
          "MoatScore Index with time-lock incentives for ecosystem preservation",
        riskTolerance: "conservative",
        timeHorizon: "permanent",
        marketApproach: "value",
      },
      {
        id: "philosophy-howard-marks",
        name: "Cycles & Second-Level Thinking",
        investor: "howard_marks",
        description:
          "Anticipate cycles and think deeper than consensus for superior returns",
        coreInsight:
          "The most important thing is knowing where we stand in cycles.",
        keyPrinciples: [
          "Think in cycles, not trends",
          "Practice second-level thinking",
          "Control risk above all",
          "Be aware of market psychology",
          "Time entries and exits",
          "Question conventional wisdom",
        ],
        implementationStrategy:
          "Cyclic Arbitrage Agents monitoring global ecosystem cycles and sentiment",
        riskTolerance: "moderate",
        timeHorizon: "medium",
        marketApproach: "cyclical",
      },
      {
        id: "philosophy-john-templeton",
        name: "Global Contrarian Value",
        investor: "john_templeton",
        description:
          "Find the best bargains in overlooked markets and sectors globally",
        coreInsight:
          "The best bargains are found among things that are most hated.",
        keyPrinciples: [
          "Buy at maximum pessimism",
          "Sell at maximum optimism",
          "Search globally for value",
          "Invest in unloved sectors",
          "Think independently",
          "Have infinite patience",
        ],
        implementationStrategy:
          "Frontier Vault Workshops in neglected ecosystems with contrarian alerts",
        riskTolerance: "aggressive",
        timeHorizon: "long",
        marketApproach: "contrarian",
      },
    ];

    for (const philosophy of philosophies) {
      this.philosophies.set(philosophy.id, philosophy);
    }
  }

  private async createValueVaults(): Promise<void> {
    const sampleVaults: ValueVault[] = [
      {
        id: "vault-amazon-rainforest",
        name: "Amazon Rainforest Preservation Vault",
        description:
          "Protecting the lungs of the Earth through tokenized conservation",
        ecosystemType: "rainforest",
        region: "Brazil/Peru/Colombia",
        intrinsicValue: 15000000, // $15M intrinsic value
        currentPrice: 11250000, // $11.25M current price
        safetyMargin: 25, // 25% below intrinsic value
        grahamScore: 92, // Excellent Graham safety score
        buffettMoatScore: 88, // Strong ecosystem moat
        marksCyclePhase: "early", // Early in conservation cycle
        templetonContrarian: 76, // Good contrarian opportunity
        tokenSupply: 1000000,
        lockedTokens: 340000,
        yieldRate: 0.08, // 8% base yield
        minimumLockPeriod: 365, // 1 year minimum
        maxLockPeriod: 3650, // 10 years maximum
        lockMultiplier: 2.5, // 2.5x yield for max lock
        status: "active",
        lastRebalance: new Date("2024-03-15"),
        nextRebalance: new Date("2024-06-15"),
        conservationImpact: {
          speciesProtected: 2847,
          carbonSequestered: 125000,
          habitatRestored: 45000,
          communityJobs: 1250,
          biodiversityIndex: 94,
        },
      },
      {
        id: "vault-antarctic-krill",
        name: "Antarctic Krill Conservation Vault",
        description: "Frontier ecosystem protection in the Southern Ocean",
        ecosystemType: "marine",
        region: "Antarctic",
        intrinsicValue: 8500000,
        currentPrice: 4250000, // 50% discount - major contrarian opportunity
        safetyMargin: 50,
        grahamScore: 96, // Exceptional safety
        buffettMoatScore: 71, // Moderate moat
        marksCyclePhase: "decline", // Currently out of favor
        templetonContrarian: 94, // Excellent contrarian score
        tokenSupply: 500000,
        lockedTokens: 45000,
        yieldRate: 0.12, // 12% base yield due to risk
        minimumLockPeriod: 730, // 2 years minimum
        maxLockPeriod: 5475, // 15 years maximum
        lockMultiplier: 3.2,
        status: "pre_launch",
        lastRebalance: new Date("2024-03-01"),
        nextRebalance: new Date("2024-09-01"),
        conservationImpact: {
          speciesProtected: 156,
          carbonSequestered: 85000,
          habitatRestored: 125000,
          communityJobs: 340,
          biodiversityIndex: 78,
        },
      },
      {
        id: "vault-sahel-reforestation",
        name: "Sahel Reforestation Recovery Vault",
        description:
          "Reversing desertification through strategic reforestation",
        ecosystemType: "grassland",
        region: "West Africa",
        intrinsicValue: 6200000,
        currentPrice: 4960000, // 20% discount
        safetyMargin: 20,
        grahamScore: 84,
        buffettMoatScore: 82, // Strong moat due to climate urgency
        marksCyclePhase: "recovery", // Early recovery phase
        templetonContrarian: 89, // Strong contrarian play
        tokenSupply: 750000,
        lockedTokens: 189000,
        yieldRate: 0.095, // 9.5% base yield
        minimumLockPeriod: 545, // 18 months minimum
        maxLockPeriod: 3650,
        lockMultiplier: 2.8,
        status: "active",
        lastRebalance: new Date("2024-02-28"),
        nextRebalance: new Date("2024-05-28"),
        conservationImpact: {
          speciesProtected: 789,
          carbonSequestered: 78000,
          habitatRestored: 28000,
          communityJobs: 2100,
          biodiversityIndex: 72,
        },
      },
    ];

    for (const vault of sampleVaults) {
      this.valueVaults.set(vault.id, vault);
    }
  }

  private async createInvestorAgents(): Promise<void> {
    const agents: InvestorAgent[] = [
      {
        id: "agent-benjamin-graham",
        name: "Graham Safety Sentinel",
        philosophy: "benjamin_graham",
        active: true,
        confidence: 94,
        currentRecommendations: [],
        portfolioAllocation: {
          "vault-amazon-rainforest": 35,
          "vault-antarctic-krill": 40,
          "vault-sahel-reforestation": 25,
        },
        performance: {
          totalReturn: 0.147, // 14.7% total return
          annualizedReturn: 0.089, // 8.9% annualized
          sharpeRatio: 1.34,
          maxDrawdown: -0.061, // -6.1% max drawdown
          winRate: 0.78,
          avgHoldingPeriod: 847, // days
        },
        lastUpdate: new Date(),
      },
      {
        id: "agent-warren-buffett",
        name: "Buffett Moat Monitor",
        philosophy: "warren_buffett",
        active: true,
        confidence: 91,
        currentRecommendations: [],
        portfolioAllocation: {
          "vault-amazon-rainforest": 65,
          "vault-sahel-reforestation": 35,
        },
        performance: {
          totalReturn: 0.234,
          annualizedReturn: 0.124,
          sharpeRatio: 1.67,
          maxDrawdown: -0.043,
          winRate: 0.82,
          avgHoldingPeriod: 1247,
        },
        lastUpdate: new Date(),
      },
      {
        id: "agent-howard-marks",
        name: "Marks Cycle Tracker",
        philosophy: "howard_marks",
        active: true,
        confidence: 87,
        currentRecommendations: [],
        portfolioAllocation: {
          "vault-amazon-rainforest": 25,
          "vault-antarctic-krill": 35,
          "vault-sahel-reforestation": 40,
        },
        performance: {
          totalReturn: 0.189,
          annualizedReturn: 0.098,
          sharpeRatio: 1.45,
          maxDrawdown: -0.078,
          winRate: 0.74,
          avgHoldingPeriod: 423,
        },
        lastUpdate: new Date(),
      },
      {
        id: "agent-john-templeton",
        name: "Templeton Contrarian Scout",
        philosophy: "john_templeton",
        active: true,
        confidence: 89,
        currentRecommendations: [],
        portfolioAllocation: {
          "vault-antarctic-krill": 55,
          "vault-sahel-reforestation": 30,
          "vault-amazon-rainforest": 15,
        },
        performance: {
          totalReturn: 0.312,
          annualizedReturn: 0.156,
          sharpeRatio: 1.23,
          maxDrawdown: -0.134,
          winRate: 0.69,
          avgHoldingPeriod: 634,
        },
        lastUpdate: new Date(),
      },
    ];

    for (const agent of agents) {
      this.investorAgents.set(agent.id, agent);
    }
  }

  async getValueVaults(filters?: {
    ecosystemType?: string;
    region?: string;
    minSafetyMargin?: number;
    philosophyFocus?: string;
  }): Promise<ValueVault[]> {
    let vaults = Array.from(this.valueVaults.values());

    if (filters?.ecosystemType) {
      vaults = vaults.filter((v) => v.ecosystemType === filters.ecosystemType);
    }

    if (filters?.region) {
      vaults = vaults.filter((v) =>
        v.region.toLowerCase().includes(filters.region!.toLowerCase()),
      );
    }

    if (filters?.minSafetyMargin) {
      vaults = vaults.filter((v) => v.safetyMargin >= filters.minSafetyMargin!);
    }

    if (filters?.philosophyFocus) {
      vaults = vaults.sort((a, b) => {
        switch (filters.philosophyFocus) {
          case "graham":
            return b.grahamScore - a.grahamScore;
          case "buffett":
            return b.buffettMoatScore - a.buffettMoatScore;
          case "templeton":
            return b.templetonContrarian - a.templetonContrarian;
          default:
            return 0;
        }
      });
    }

    return vaults;
  }

  async getInvestorAgents(): Promise<InvestorAgent[]> {
    return Array.from(this.investorAgents.values()).sort(
      (a, b) => b.performance.annualizedReturn - a.performance.annualizedReturn,
    );
  }

  async getAgentRecommendations(
    agentId?: string,
  ): Promise<AgentRecommendation[]> {
    if (agentId) {
      const agent = this.investorAgents.get(agentId);
      return agent ? agent.currentRecommendations : [];
    }

    const allRecommendations: AgentRecommendation[] = [];
    for (const agent of this.investorAgents.values()) {
      allRecommendations.push(...agent.currentRecommendations);
    }

    return allRecommendations.sort((a, b) => {
      // Sort by urgency and confidence
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const urgencyDiff =
        (urgencyOrder[b.urgency] || 0) - (urgencyOrder[a.urgency] || 0);
      if (urgencyDiff !== 0) return urgencyDiff;

      return b.confidence - a.confidence;
    });
  }

  async generateCompositeScore(vaultId: string): Promise<{
    overallScore: number;
    grahamSafety: number;
    buffettMoat: number;
    marksCycle: number;
    templetonContrarian: number;
    recommendation: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";
    reasoning: string;
  }> {
    const vault = this.valueVaults.get(vaultId);
    if (!vault) {
      throw new Error(`Vault ${vaultId} not found`);
    }

    const grahamSafety = vault.grahamScore;
    const buffettMoat = vault.buffettMoatScore;
    const marksCycle = this.getCycleScore(vault);
    const templetonContrarian = vault.templetonContrarian;

    // Weighted composite score
    const overallScore =
      grahamSafety * 0.3 + // 30% weight on safety
      buffettMoat * 0.25 + // 25% weight on moat
      marksCycle * 0.25 + // 25% weight on cycle timing
      templetonContrarian * 0.2; // 20% weight on contrarian value

    let recommendation: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";
    let reasoning: string;

    if (overallScore >= 85) {
      recommendation = "strong_buy";
      reasoning =
        "Exceptional opportunity combining Graham safety, Buffett quality, optimal cycle timing, and contrarian value";
    } else if (overallScore >= 75) {
      recommendation = "buy";
      reasoning =
        "Strong fundamentals with good safety margin and attractive value proposition";
    } else if (overallScore >= 60) {
      recommendation = "hold";
      reasoning =
        "Decent fundamentals but waiting for better entry or cycle timing";
    } else if (overallScore >= 45) {
      recommendation = "sell";
      reasoning = "Weakening fundamentals or overvaluation concerns";
    } else {
      recommendation = "strong_sell";
      reasoning = "Poor fundamentals across multiple investment criteria";
    }

    return {
      overallScore,
      grahamSafety,
      buffettMoat,
      marksCycle,
      templetonContrarian,
      recommendation,
      reasoning,
    };
  }

  private getCycleScore(vault: ValueVault): number {
    // Calculate cycle score based on phase and timing
    const phaseScores = {
      early: 85, // Best time to buy
      growth: 70, // Good time to hold
      mature: 50, // Hold or reduce
      decline: 30, // Avoid or sell
      recovery: 90, // Excellent contrarian opportunity
    };

    return phaseScores[vault.marksCyclePhase] || 50;
  }

  async getContrairianAlerts(): Promise<ContrairianAlert[]> {
    return Array.from(this.contrairianAlerts.values())
      .filter((alert) => !alert.resolved)
      .sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const severityDiff =
          (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
        if (severityDiff !== 0) return severityDiff;

        return b.templetonScore - a.templetonScore;
      });
  }

  async getSentimentOverlay(vaultId: string): Promise<SentimentOverlay | null> {
    return this.sentimentData.get(vaultId) || null;
  }

  async createLockPosition(
    vaultId: string,
    amount: number,
    lockPeriod: number,
    philosophy: "graham" | "buffett" | "marks" | "templeton",
  ): Promise<{
    positionId: string;
    baseYield: number;
    lockMultiplier: number;
    totalYield: number;
    philosophyBonus: number;
    unlockDate: Date;
  }> {
    const vault = this.valueVaults.get(vaultId);
    if (!vault) {
      throw new Error(`Vault ${vaultId} not found`);
    }

    if (
      lockPeriod < vault.minimumLockPeriod ||
      lockPeriod > vault.maxLockPeriod
    ) {
      throw new Error(
        `Lock period must be between ${vault.minimumLockPeriod} and ${vault.maxLockPeriod} days`,
      );
    }

    // Calculate philosophy-specific bonuses
    const philosophyBonuses = {
      graham: (vault.grahamScore / 100) * 0.02, // Up to 2% bonus for safety
      buffett: (vault.buffettMoatScore / 100) * 0.025, // Up to 2.5% bonus for moat
      marks: (this.getCycleScore(vault) / 100) * 0.02, // Up to 2% bonus for cycle timing
      templeton: (vault.templetonContrarian / 100) * 0.03, // Up to 3% bonus for contrarian value
    };

    const philosophyBonus = philosophyBonuses[philosophy];
    const lockRatio = lockPeriod / vault.maxLockPeriod;
    const lockMultiplier = 1 + (vault.lockMultiplier - 1) * lockRatio;
    const totalYield = (vault.yieldRate + philosophyBonus) * lockMultiplier;

    const position = {
      positionId: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      baseYield: vault.yieldRate,
      lockMultiplier,
      totalYield,
      philosophyBonus,
      unlockDate: new Date(Date.now() + lockPeriod * 24 * 60 * 60 * 1000),
    };

    // Update vault locked tokens
    vault.lockedTokens += amount;

    return position;
  }

  private startCyclicAnalysis(): void {
    setInterval(() => {
      // Update cyclic analysis for each ecosystem type
      const ecosystemTypes = [
        "rainforest",
        "wetlands",
        "marine",
        "desert",
        "tundra",
        "grassland",
      ];

      for (const type of ecosystemTypes) {
        this.updateCyclicAnalysis(type);
      }
    }, 3600000); // Every hour
  }

  private updateCyclicAnalysis(ecosystemType: string): void {
    // Simulate sophisticated cycle analysis
    const phases = [
      "early_spring",
      "late_spring",
      "summer",
      "early_autumn",
      "late_autumn",
      "winter",
    ];
    const currentPhase = phases[Math.floor(Math.random() * phases.length)];

    const analysis: CyclicAnalysis = {
      ecosystemType,
      region: "Global",
      currentPhase: currentPhase as any,
      cycleConfidence: 75 + Math.random() * 20,
      seasonalPatterns: {
        biodiversity: Array.from({ length: 12 }, () => Math.random() * 100),
        carbon_absorption: Array.from(
          { length: 12 },
          () => Math.random() * 100,
        ),
        conservation_activity: Array.from(
          { length: 12 },
          () => Math.random() * 100,
        ),
        funding_flows: Array.from({ length: 12 }, () => Math.random() * 100),
      },
      predictedTurning: {
        phase: phases[(phases.indexOf(currentPhase) + 1) % phases.length],
        confidence: 70 + Math.random() * 25,
        timeframe: "2-4 months",
        implications: [
          "Increased conservation activity expected",
          "Optimal funding window approaching",
          "Ecosystem recovery phase beginning",
        ],
      },
      arbitrageOpportunity: Math.random() * 100,
    };

    this.cyclicAnalyses.set(ecosystemType, analysis);
  }

  private startContrairianMonitoring(): void {
    setInterval(() => {
      // Check for contrarian opportunities
      for (const vault of this.valueVaults.values()) {
        this.checkContrairianOpportunity(vault);
      }
    }, 1800000); // Every 30 minutes
  }

  private checkContrairianOpportunity(vault: ValueVault): void {
    const sentiment = this.sentimentData.get(vault.id);
    if (!sentiment) return;

    // Generate contrarian alert if conditions are met
    if (sentiment.overallSentiment < -60 && vault.templetonContrarian > 80) {
      const alert: ContrairianAlert = {
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        vaultId: vault.id,
        alertType: "undervalued_ecosystem",
        severity: "high",
        title: `Templeton-Style Opportunity: ${vault.name}`,
        description: `Extreme pessimism meets strong fundamentals - classic contrarian setup`,
        templetonScore: vault.templetonContrarian,
        marketSentiment: sentiment.overallSentiment,
        fundamentalHealth: vault.conservationImpact.biodiversityIndex,
        catalysts: [
          "Maximum pessimism reached",
          "Strong ecosystem fundamentals",
          "Institutional selling exhausted",
          "Recovery catalysts emerging",
        ],
        timeWindow: "3-6 months optimal entry",
        potentialReturn: 0.25 + Math.random() * 0.5, // 25-75% potential return
        riskFactors: [
          "Continued negative sentiment",
          "Regulatory headwinds",
          "Economic downturns",
        ],
        created: new Date(),
        resolved: false,
      };

      this.contrairianAlerts.set(alert.id, alert);
    }
  }

  private startSentimentTracking(): void {
    setInterval(() => {
      // Update sentiment data for all vaults
      for (const vault of this.valueVaults.values()) {
        this.updateSentimentOverlay(vault.id);
      }
    }, 900000); // Every 15 minutes
  }

  private updateSentimentOverlay(vaultId: string): void {
    const overallSentiment = (Math.random() - 0.5) * 200; // -100 to 100
    const crowdConfidence = Math.random() * 100;
    const fearGreedIndex = Math.random() * 100;

    let contrairianSignal: SentimentOverlay["contrairianSignal"];
    if (overallSentiment < -70) contrairianSignal = "strong_buy";
    else if (overallSentiment < -30) contrairianSignal = "buy";
    else if (overallSentiment > 70) contrairianSignal = "strong_sell";
    else if (overallSentiment > 30) contrairianSignal = "sell";
    else contrairianSignal = "neutral";

    const overlay: SentimentOverlay = {
      vaultId,
      overallSentiment,
      crowdConfidence,
      expertConsensus: (Math.random() - 0.5) * 200,
      mediaAttention: Math.random() * 100,
      institutionalFlow: (Math.random() - 0.5) * 200,
      retailFlow: (Math.random() - 0.5) * 200,
      fearGreedIndex,
      contrairianSignal,
      lastUpdated: new Date(),
    };

    this.sentimentData.set(vaultId, overlay);
  }

  private startAgentRecommendations(): void {
    setInterval(() => {
      // Generate recommendations from each agent
      for (const agent of this.investorAgents.values()) {
        this.generateAgentRecommendations(agent);
      }
    }, 600000); // Every 10 minutes
  }

  private generateAgentRecommendations(agent: InvestorAgent): void {
    // Clear old recommendations
    agent.currentRecommendations = [];

    // Generate new recommendations based on philosophy
    for (const vault of this.valueVaults.values()) {
      const recommendation = this.createPhilosophyRecommendation(agent, vault);
      if (recommendation) {
        agent.currentRecommendations.push(recommendation);
      }
    }

    agent.lastUpdate = new Date();
  }

  private createPhilosophyRecommendation(
    agent: InvestorAgent,
    vault: ValueVault,
  ): AgentRecommendation | null {
    let action: AgentRecommendation["action"] = "hold";
    let confidence = 50;
    let reasoning = "";
    let urgency: AgentRecommendation["urgency"] = "medium";

    switch (agent.philosophy) {
      case "benjamin_graham":
        if (vault.safetyMargin > 30) {
          action = "buy";
          confidence = vault.grahamScore;
          reasoning = `Exceptional safety margin of ${vault.safetyMargin}% provides Graham-style protection`;
          urgency = vault.grahamScore > 90 ? "high" : "medium";
        }
        break;

      case "warren_buffett":
        if (vault.buffettMoatScore > 80) {
          action = "lock";
          confidence = vault.buffettMoatScore;
          reasoning = `Strong ecosystem moat (${vault.buffettMoatScore}/100) warrants long-term lock position`;
          urgency = "medium";
        }
        break;

      case "howard_marks":
        if (
          vault.marksCyclePhase === "early" ||
          vault.marksCyclePhase === "recovery"
        ) {
          action = "buy";
          confidence = this.getCycleScore(vault);
          reasoning = `Optimal cycle timing - ${vault.marksCyclePhase} phase offers attractive entry`;
          urgency = vault.marksCyclePhase === "recovery" ? "high" : "medium";
        }
        break;

      case "john_templeton":
        if (vault.templetonContrarian > 85) {
          action = "buy";
          confidence = vault.templetonContrarian;
          reasoning = `Extreme contrarian opportunity - market pessimism creates exceptional value`;
          urgency = "high";
        }
        break;
    }

    if (action === "hold" && confidence < 60) return null;

    const recommendation: AgentRecommendation = {
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      agentId: agent.id,
      vaultId: vault.id,
      action,
      reasoning,
      confidence,
      urgency,
      targetAllocation: action === "buy" ? 25 : action === "lock" ? 35 : 15,
      expectedReturn: vault.yieldRate * (1 + vault.templetonContrarian / 500),
      riskAssessment:
        vault.safetyMargin > 25
          ? "Low risk with strong safety margin"
          : "Moderate risk - monitor closely",
      philosophyAlignment: {
        graham_safety: vault.grahamScore,
        buffett_moat: vault.buffettMoatScore,
        marks_cycle: this.getCycleScore(vault),
        templeton_contrarian: vault.templetonContrarian,
      },
      timestamp: new Date(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24 hours
    };

    return recommendation;
  }

  async getInvestmentInsights(): Promise<{
    marketOverview: string;
    philosophyFocus: string;
    topOpportunities: string[];
    riskWarnings: string[];
    cycleTiming: string;
  }> {
    const vaults = Array.from(this.valueVaults.values());
    const avgSafetyMargin =
      vaults.reduce((sum, v) => sum + v.safetyMargin, 0) / vaults.length;
    const avgMoatScore =
      vaults.reduce((sum, v) => sum + v.buffettMoatScore, 0) / vaults.length;

    return {
      marketOverview: `Current market shows ${avgSafetyMargin.toFixed(1)}% average safety margin with ${avgMoatScore.toFixed(1)}/100 moat strength`,
      philosophyFocus:
        avgSafetyMargin > 25
          ? "Graham-style value opportunities abundant"
          : "Buffett-quality moats more important in current cycle",
      topOpportunities: [
        "Antarctic Krill - Extreme contrarian value at 50% discount",
        "Sahel Reforestation - Early recovery cycle with strong moats",
        "Amazon Rainforest - Premium quality at reasonable Graham margin",
      ],
      riskWarnings: [
        "Monitor cycle transitions for optimal timing",
        "Sentiment extremes create both opportunity and risk",
        "Maintain safety margins in uncertain periods",
      ],
      cycleTiming:
        "Early to mid-cycle positioning optimal across most ecosystems",
    };
  }
}

export const legendaryInvestorStrategyService = singletonPattern(
  () => new LegendaryInvestorStrategyService(),
);
