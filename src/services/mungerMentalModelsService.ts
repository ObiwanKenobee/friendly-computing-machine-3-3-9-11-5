import { singletonPattern } from "../utils/singletonPattern";

export interface MentalModel {
  id: string;
  name: string;
  discipline:
    | "psychology"
    | "economics"
    | "biology"
    | "physics"
    | "mathematics"
    | "ecology"
    | "anthropology";
  description: string;
  applicability: "high" | "medium" | "low";
  reliability: number; // 0-100
  biasWarnings: string[];
  ecosystemRelevance: number; // 0-100
  inversionPotential: number; // 0-100
}

export interface InversionAnalysis {
  id: string;
  scenario: string;
  question: string;
  failureModes: string[];
  avoidanceStrategies: string[];
  mitigationPlans: string[];
  probabilityOfFailure: number; // 0-100
  impactSeverity: number; // 0-100
  riskScore: number; // probability * impact
  inverseMeasures: string[];
}

export interface LatticeRecommendation {
  id: string;
  vaultId: string;
  modelsCombined: string[];
  confidence: number; // 0-100
  reasoning: string;
  inversionChecks: string[];
  potentialBlindSpots: string[];
  crossDisciplinaryInsights: string[];
  actionPlan: string;
  fallbackStrategies: string[];
}

export interface AvoidFailureIntent {
  id: string;
  userId: string;
  intent: string; // "What must not happen?"
  category:
    | "asset_misallocation"
    | "community_distrust"
    | "ecosystem_degradation"
    | "regulatory_violation"
    | "reputation_damage";
  severity: "critical" | "high" | "medium" | "low";
  triggerConditions: string[];
  guardrails: string[];
  redTeamChallenges: string[];
  monitoringMetrics: string[];
  lastReview: Date;
  status: "active" | "triggered" | "resolved";
}

export interface RedTeamChallenge {
  id: string;
  intentId: string;
  challenge: string;
  challenger:
    | "ai_devil_advocate"
    | "contrarian_model"
    | "failure_analyst"
    | "bias_detector";
  evidence: string[];
  counterArguments: string[];
  riskLevel: number; // 0-100
  actionRequired: boolean;
  resolution: string | null;
}

export interface BoardLayerGovernance {
  id: string;
  fundId: string;
  governanceType:
    | "veto_power"
    | "sanity_check"
    | "reverse_scenario"
    | "bias_detection";
  rules: string[];
  vetoPowers: string[];
  sanityChecks: string[];
  reverseScenarios: string[];
  lastExecution: Date;
  effectivenessScore: number; // 0-100
}

class MungerMentalModelsService {
  private mentalModels: Map<string, MentalModel> = new Map();
  private inversionAnalyses: Map<string, InversionAnalysis> = new Map();
  private latticeRecommendations: Map<string, LatticeRecommendation> =
    new Map();
  private avoidFailureIntents: Map<string, AvoidFailureIntent> = new Map();
  private redTeamChallenges: Map<string, RedTeamChallenge> = new Map();
  private boardLayerGovernance: Map<string, BoardLayerGovernance> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await this.createMentalModels();
    await this.setupInversionFrameworks();
    await this.initializeGovernanceLayers();

    this.startInversionMonitoring();
    this.startRedTeamChallenges();
    this.startLatticeAnalysis();

    this.isInitialized = true;
    console.log(
      "Munger Mental Models Service initialized with lattice thinking and inversion principles",
    );
  }

  private async createMentalModels(): Promise<void> {
    const models: MentalModel[] = [
      {
        id: "model-ecological-resilience",
        name: "Ecological Resilience Theory",
        discipline: "ecology",
        description:
          "Systems maintain function through diversity and redundancy, preventing catastrophic collapse",
        applicability: "high",
        reliability: 94,
        biasWarnings: ["Complexity bias", "System justification bias"],
        ecosystemRelevance: 98,
        inversionPotential: 92,
      },
      {
        id: "model-network-effects",
        name: "Network Effects Model",
        discipline: "economics",
        description:
          "Value increases exponentially with network size - applies to conservation communities",
        applicability: "high",
        reliability: 89,
        biasWarnings: ["Winner-take-all thinking", "Exponential growth bias"],
        ecosystemRelevance: 87,
        inversionPotential: 85,
      },
      {
        id: "model-tragedy-commons",
        name: "Tragedy of the Commons",
        discipline: "economics",
        description:
          "Shared resources depleted when individual rational behavior conflicts with collective good",
        applicability: "high",
        reliability: 96,
        biasWarnings: ["Fatalism bias", "Oversimplification of governance"],
        ecosystemRelevance: 95,
        inversionPotential: 93,
      },
      {
        id: "model-social-proof",
        name: "Social Proof Psychology",
        discipline: "psychology",
        description:
          "People follow behavior of others, especially in uncertainty - critical for conservation adoption",
        applicability: "high",
        reliability: 91,
        biasWarnings: ["Herd mentality", "False consensus effect"],
        ecosystemRelevance: 84,
        inversionPotential: 88,
      },
      {
        id: "model-pareto-principle",
        name: "Pareto Principle (80/20 Rule)",
        discipline: "mathematics",
        description:
          "80% of outcomes from 20% of causes - focus on high-impact conservation areas",
        applicability: "high",
        reliability: 87,
        biasWarnings: ["Oversimplification bias", "Cherry-picking data"],
        ecosystemRelevance: 82,
        inversionPotential: 79,
      },
      {
        id: "model-tribal-cooperation",
        name: "Tribal Cooperation Model",
        discipline: "anthropology",
        description:
          "Humans cooperate best in tribes of 50-150, with shared identity and purpose",
        applicability: "high",
        reliability: 93,
        biasWarnings: ["In-group bias", "Us-vs-them thinking"],
        ecosystemRelevance: 91,
        inversionPotential: 86,
      },
      {
        id: "model-circular-economy",
        name: "Circular Economy Model",
        discipline: "economics",
        description:
          "Waste elimination through design, keeping materials in use, regenerating natural systems",
        applicability: "high",
        reliability: 85,
        biasWarnings: ["Technological optimism", "Linear thinking"],
        ecosystemRelevance: 94,
        inversionPotential: 81,
      },
      {
        id: "model-tipping-points",
        name: "Ecological Tipping Points",
        discipline: "ecology",
        description:
          "Small changes can trigger large system shifts once critical thresholds are crossed",
        applicability: "high",
        reliability: 92,
        biasWarnings: ["Threshold illusion", "Linear extrapolation"],
        ecosystemRelevance: 97,
        inversionPotential: 94,
      },
    ];

    for (const model of models) {
      this.mentalModels.set(model.id, model);
    }
  }

  private async setupInversionFrameworks(): Promise<void> {
    const inversions: InversionAnalysis[] = [
      {
        id: "inversion-asset-misallocation",
        scenario: "Asset Misallocation Prevention",
        question: "How could we completely misallocate conservation funding?",
        failureModes: [
          "Funding popular but ineffective projects",
          "Ignoring local community needs",
          "Over-investing in single ecosystem type",
          "Lack of impact measurement",
          "Political capture of funds",
        ],
        avoidanceStrategies: [
          "Diversify across ecosystem types and regions",
          "Mandatory community involvement requirements",
          "Impact measurement before funding release",
          "Independent governance structures",
          "Transparent allocation algorithms",
        ],
        mitigationPlans: [
          "Regular portfolio rebalancing",
          "Community feedback loops",
          "Independent impact audits",
          "Automated governance triggers",
          "Emergency reallocation protocols",
        ],
        probabilityOfFailure: 35,
        impactSeverity: 85,
        riskScore: 30, // 35 * 85 / 100
        inverseMeasures: [
          "Require proof of local benefit before funding",
          "Implement cooling-off periods for popular projects",
          "Mandate contrarian impact assessments",
          "Create dedicated devil's advocate roles",
        ],
      },
      {
        id: "inversion-community-distrust",
        scenario: "Community Trust Breakdown",
        question: "How could we completely destroy community trust?",
        failureModes: [
          "Broken promises on conservation outcomes",
          "Excluding locals from decision-making",
          "Cultural insensitivity in implementation",
          "Lack of transparency in fund usage",
          "Imposing external values without consultation",
        ],
        avoidanceStrategies: [
          "Under-promise and over-deliver",
          "Local leadership in all major decisions",
          "Cultural advisors for each region",
          "Real-time fund usage transparency",
          "Community-driven value definition",
        ],
        mitigationPlans: [
          "Trust repair protocols",
          "Community compensation mechanisms",
          "Cultural sensitivity training",
          "Independent trust monitoring",
          "Restorative justice processes",
        ],
        probabilityOfFailure: 28,
        impactSeverity: 92,
        riskScore: 26,
        inverseMeasures: [
          "Never implement without community approval",
          "Mandate local benefit sharing",
          "Require cultural impact assessments",
          "Implement community veto powers",
        ],
      },
      {
        id: "inversion-ecosystem-degradation",
        scenario: "Accelerated Ecosystem Destruction",
        question:
          "How could our conservation efforts actually harm ecosystems?",
        failureModes: [
          "Over-tourism from conservation marketing",
          "Monoculture restoration instead of biodiversity",
          "Ignoring ecological interconnections",
          "Short-term thinking over long-term health",
          "Technology solutions disrupting natural processes",
        ],
        avoidanceStrategies: [
          "Carrying capacity limits for all sites",
          "Native species prioritization",
          "Whole ecosystem approach",
          "Multi-generational planning horizons",
          "Nature-first solution hierarchy",
        ],
        mitigationPlans: [
          "Rapid ecosystem health monitoring",
          "Adaptive management protocols",
          "Indigenous knowledge integration",
          "Climate change adaptation strategies",
          "Restoration rather than replacement",
        ],
        probabilityOfFailure: 22,
        impactSeverity: 96,
        riskScore: 21,
        inverseMeasures: [
          "No action without ecological impact assessment",
          "Mandatory indigenous knowledge consultation",
          "Precautionary principle application",
          "Regular ecosystem health audits",
        ],
      },
    ];

    for (const inversion of inversions) {
      this.inversionAnalyses.set(inversion.id, inversion);
    }
  }

  private async initializeGovernanceLayers(): Promise<void> {
    const governanceSystems: BoardLayerGovernance[] = [
      {
        id: "governance-veto-power",
        fundId: "all-funds",
        governanceType: "veto_power",
        rules: [
          "Community representatives can veto any proposal affecting their region",
          "Scientific advisors can veto ecologically harmful proposals",
          "Ethics board can veto culturally insensitive initiatives",
          "Financial oversight can veto fiscally irresponsible allocations",
        ],
        vetoPowers: [
          "Community veto (requires 60% local opposition)",
          "Scientific veto (requires peer review disagreement)",
          "Ethics veto (requires ethics board majority)",
          "Financial veto (requires risk assessment failure)",
        ],
        sanityChecks: [
          "Does this benefit the stated community?",
          "Is the ecological science sound?",
          "Are cultural values respected?",
          "Is the financial model sustainable?",
        ],
        reverseScenarios: [
          "What if this project fails completely?",
          "What if local communities reject this?",
          "What if environmental conditions change?",
          "What if funding is cut in half?",
        ],
        lastExecution: new Date(),
        effectivenessScore: 87,
      },
      {
        id: "governance-reverse-scenario",
        fundId: "all-funds",
        governanceType: "reverse_scenario",
        rules: [
          "All major decisions must pass reverse scenario analysis",
          "Consider worst-case outcomes before proceeding",
          "Plan for failure modes from the beginning",
          "Build redundancy for critical functions",
        ],
        vetoPowers: [],
        sanityChecks: [
          "Have we considered what could go wrong?",
          "Do we have contingency plans?",
          "Can the project survive without key assumptions?",
          "Are we prepared for adverse outcomes?",
        ],
        reverseScenarios: [
          "Complete project failure scenario",
          "Community rejection scenario",
          "Environmental catastrophe scenario",
          "Economic collapse scenario",
          "Regulatory shutdown scenario",
        ],
        lastExecution: new Date(),
        effectivenessScore: 91,
      },
    ];

    for (const governance of governanceSystems) {
      this.boardLayerGovernance.set(governance.id, governance);
    }
  }

  async createAvoidFailureIntent(
    userId: string,
    intent: string,
    category: AvoidFailureIntent["category"],
  ): Promise<AvoidFailureIntent> {
    const intentId = `intent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const avoidanceIntent: AvoidFailureIntent = {
      id: intentId,
      userId,
      intent,
      category,
      severity: this.calculateIntentSeverity(category),
      triggerConditions: this.generateTriggerConditions(category),
      guardrails: this.generateGuardrails(category),
      redTeamChallenges: [],
      monitoringMetrics: this.generateMonitoringMetrics(category),
      lastReview: new Date(),
      status: "active",
    };

    this.avoidFailureIntents.set(intentId, avoidanceIntent);

    // Generate initial red team challenges
    await this.generateRedTeamChallenges(intentId);

    return avoidanceIntent;
  }

  private calculateIntentSeverity(
    category: AvoidFailureIntent["category"],
  ): AvoidFailureIntent["severity"] {
    const severityMap = {
      asset_misallocation: "high" as const,
      community_distrust: "critical" as const,
      ecosystem_degradation: "critical" as const,
      regulatory_violation: "high" as const,
      reputation_damage: "medium" as const,
    };
    return severityMap[category];
  }

  private generateTriggerConditions(
    category: AvoidFailureIntent["category"],
  ): string[] {
    const conditionsMap = {
      asset_misallocation: [
        "Portfolio concentration > 40% in single asset",
        "Impact metrics declining for 3 consecutive quarters",
        "Community satisfaction < 60%",
        "ROI variance > 2 standard deviations",
      ],
      community_distrust: [
        "Community approval rating < 50%",
        "Protest or opposition movements",
        "Local media criticism",
        "Community leader withdrawal",
      ],
      ecosystem_degradation: [
        "Biodiversity index declining",
        "Carbon sequestration reduction",
        "Species population decline",
        "Habitat fragmentation increase",
      ],
      regulatory_violation: [
        "Compliance score < 90%",
        "Regulatory warnings received",
        "Legal challenges filed",
        "Audit findings",
      ],
      reputation_damage: [
        "Negative media coverage",
        "Stakeholder complaints",
        "Social media sentiment < -50%",
        "Partner withdrawals",
      ],
    };
    return conditionsMap[category];
  }

  private generateGuardrails(
    category: AvoidFailureIntent["category"],
  ): string[] {
    const guardrailsMap = {
      asset_misallocation: [
        "Maximum 30% allocation in any single vault",
        "Mandatory diversification requirements",
        "Impact measurement before additional funding",
        "Independent allocation oversight",
      ],
      community_distrust: [
        "Community approval required for all major decisions",
        "Regular community feedback sessions",
        "Cultural sensitivity assessments",
        "Local benefit sharing requirements",
      ],
      ecosystem_degradation: [
        "Ecological impact assessments for all projects",
        "Biodiversity monitoring requirements",
        "Indigenous knowledge integration",
        "Precautionary principle application",
      ],
      regulatory_violation: [
        "Legal compliance checks before implementation",
        "Regular regulatory update monitoring",
        "Compliance officer oversight",
        "Legal risk assessments",
      ],
      reputation_damage: [
        "Stakeholder communication protocols",
        "Crisis communication plans",
        "Regular reputation monitoring",
        "Proactive transparency measures",
      ],
    };
    return guardrailsMap[category];
  }

  private generateMonitoringMetrics(
    category: AvoidFailureIntent["category"],
  ): string[] {
    const metricsMap = {
      asset_misallocation: [
        "Portfolio concentration ratios",
        "Risk-adjusted returns",
        "Impact per dollar invested",
        "Stakeholder satisfaction scores",
      ],
      community_distrust: [
        "Community approval ratings",
        "Participation rates in consultations",
        "Local employment levels",
        "Cultural preservation metrics",
      ],
      ecosystem_degradation: [
        "Biodiversity indices",
        "Carbon sequestration rates",
        "Species population counts",
        "Habitat connectivity measures",
      ],
      regulatory_violation: [
        "Compliance audit scores",
        "Legal risk assessments",
        "Regulatory change impact",
        "Violation frequency",
      ],
      reputation_damage: [
        "Media sentiment analysis",
        "Stakeholder Net Promoter Score",
        "Social media mentions",
        "Partner relationship health",
      ],
    };
    return metricsMap[category];
  }

  private async generateRedTeamChallenges(intentId: string): Promise<void> {
    const intent = this.avoidFailureIntents.get(intentId);
    if (!intent) return;

    const challengeTypes: RedTeamChallenge["challenger"][] = [
      "ai_devil_advocate",
      "contrarian_model",
      "failure_analyst",
      "bias_detector",
    ];

    for (const challengerType of challengeTypes) {
      const challenge = this.createRedTeamChallenge(intent, challengerType);
      this.redTeamChallenges.set(challenge.id, challenge);
      intent.redTeamChallenges.push(challenge.id);
    }
  }

  private createRedTeamChallenge(
    intent: AvoidFailureIntent,
    challenger: RedTeamChallenge["challenger"],
  ): RedTeamChallenge {
    const challengeId = `challenge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const challengeTemplates = {
      ai_devil_advocate: {
        prefix: "Playing devil's advocate:",
        challenges: [
          "What if your assumptions about community cooperation are wrong?",
          "How do you know this won't create unintended consequences?",
          "What evidence contradicts your current approach?",
          "What are you not seeing due to confirmation bias?",
        ],
      },
      contrarian_model: {
        prefix: "Contrarian perspective:",
        challenges: [
          "Everyone believes this will work - what if consensus is wrong?",
          "What if doing nothing is actually the better option?",
          "How might this popular approach be fundamentally flawed?",
          "What if the opposite strategy yields better results?",
        ],
      },
      failure_analyst: {
        prefix: "Failure mode analysis:",
        challenges: [
          "How could this fail in ways you haven't considered?",
          "What single point of failure could destroy everything?",
          "How might success in one area cause failure in another?",
          "What failure patterns from similar projects apply here?",
        ],
      },
      bias_detector: {
        prefix: "Cognitive bias check:",
        challenges: [
          "Are you suffering from overconfidence bias?",
          "How might survivorship bias be affecting your data?",
          "Could anchoring bias be skewing your risk assessment?",
          "Is confirmation bias filtering out contradictory evidence?",
        ],
      },
    };

    const template = challengeTemplates[challenger];
    const selectedChallenge =
      template.challenges[
        Math.floor(Math.random() * template.challenges.length)
      ];

    return {
      id: challengeId,
      intentId: intent.id,
      challenge: `${template.prefix} ${selectedChallenge}`,
      challenger,
      evidence: this.generateEvidenceForChallenge(intent, challenger),
      counterArguments: this.generateCounterArguments(intent, challenger),
      riskLevel: Math.floor(Math.random() * 40) + 60, // 60-100 for red team challenges
      actionRequired: true,
      resolution: null,
    };
  }

  private generateEvidenceForChallenge(
    intent: AvoidFailureIntent,
    challenger: RedTeamChallenge["challenger"],
  ): string[] {
    // Simplified evidence generation - in production, this would use AI/ML models
    const evidenceTemplates = {
      ai_devil_advocate: [
        "Historical data shows 40% of similar initiatives failed due to unforeseen factors",
        "Community cooperation rates decline under economic pressure",
        "Complexity theory suggests simple solutions often miss emergent behaviors",
      ],
      contrarian_model: [
        "Popular conservation strategies have 60% failure rate",
        "Market consensus often wrong at critical turning points",
        "Successful contrarian approaches in similar contexts",
      ],
      failure_analyst: [
        "Single point of failure analysis reveals critical dependencies",
        "Similar projects failed when key assumptions proved false",
        "Success metrics often mask underlying systemic issues",
      ],
      bias_detector: [
        "Overconfidence bias present in 80% of failed projects",
        "Selection bias evident in reference case studies",
        "Confirmation bias detected in data interpretation",
      ],
    };

    return evidenceTemplates[challenger] || [];
  }

  private generateCounterArguments(
    intent: AvoidFailureIntent,
    challenger: RedTeamChallenge["challenger"],
  ): string[] {
    return [
      "Risk mitigation strategies address major failure modes",
      "Multiple validation sources reduce bias impact",
      "Adaptive management allows course correction",
      "Historical precedents may not apply to current context",
    ];
  }

  async generateLatticeRecommendation(
    vaultId: string,
  ): Promise<LatticeRecommendation> {
    const relevantModels = this.selectRelevantModels(vaultId);
    const inversionChecks = await this.performInversionChecks(vaultId);

    const recommendation: LatticeRecommendation = {
      id: `lattice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      vaultId,
      modelsCombined: relevantModels.map((m) => m.name),
      confidence: this.calculateLatticeConfidence(relevantModels),
      reasoning: this.generateLatticeReasoning(relevantModels),
      inversionChecks: inversionChecks.map((check) => check.question),
      potentialBlindSpots: this.identifyBlindSpots(relevantModels),
      crossDisciplinaryInsights:
        this.generateCrossDisciplinaryInsights(relevantModels),
      actionPlan: this.generateActionPlan(relevantModels, inversionChecks),
      fallbackStrategies: this.generateFallbackStrategies(vaultId),
    };

    this.latticeRecommendations.set(recommendation.id, recommendation);
    return recommendation;
  }

  private selectRelevantModels(vaultId: string): MentalModel[] {
    // Select top models based on ecosystem relevance and applicability
    return Array.from(this.mentalModels.values())
      .filter((model) => model.applicability === "high")
      .sort((a, b) => b.ecosystemRelevance - a.ecosystemRelevance)
      .slice(0, 4); // Use top 4 models for lattice thinking
  }

  private async performInversionChecks(
    vaultId: string,
  ): Promise<InversionAnalysis[]> {
    return Array.from(this.inversionAnalyses.values());
  }

  private calculateLatticeConfidence(models: MentalModel[]): number {
    const avgReliability =
      models.reduce((sum, m) => sum + m.reliability, 0) / models.length;
    const modelDiversity = new Set(models.map((m) => m.discipline)).size;
    const diversityBonus = Math.min(modelDiversity * 5, 20); // Max 20% bonus for diversity

    return Math.min(avgReliability + diversityBonus, 100);
  }

  private generateLatticeReasoning(models: MentalModel[]): string {
    const disciplines = models.map((m) => m.discipline);
    const uniqueDisciplines = [...new Set(disciplines)];

    return (
      `Combining insights from ${uniqueDisciplines.join(", ")} creates multidisciplinary understanding. ` +
      `Key models: ${models.map((m) => m.name).join(", ")}. ` +
      `This lattice approach reduces single-perspective bias and reveals system interactions.`
    );
  }

  private identifyBlindSpots(models: MentalModel[]): string[] {
    const allDisciplines = [
      "psychology",
      "economics",
      "biology",
      "physics",
      "mathematics",
      "ecology",
      "anthropology",
    ];
    const usedDisciplines = models.map((m) => m.discipline);
    const missingDisciplines = allDisciplines.filter(
      (d) => !usedDisciplines.includes(d),
    );

    return [
      ...missingDisciplines.map((d) => `Missing ${d} perspective`),
      "Potential model interactions not considered",
      "Time-dependent model validity",
      "Cultural context limitations",
    ];
  }

  private generateCrossDisciplinaryInsights(models: MentalModel[]): string[] {
    return [
      "Network effects amplify ecological resilience",
      "Social proof drives conservation behavior adoption",
      "Tipping points apply to both ecosystems and social systems",
      "Circular economy principles mirror natural cycles",
      "Tribal cooperation enables large-scale conservation",
    ];
  }

  private generateActionPlan(
    models: MentalModel[],
    inversions: InversionAnalysis[],
  ): string {
    return (
      "Apply network effects to build conservation community, " +
      "use social proof to drive adoption, monitor for tipping points, " +
      "implement circular economy principles, leverage tribal cooperation, " +
      "while actively avoiding identified failure modes through inversion planning."
    );
  }

  private generateFallbackStrategies(vaultId: string): string[] {
    return [
      "Pivot to alternative ecosystem if primary target fails",
      "Scale down to minimum viable conservation unit",
      "Partner with established conservation organizations",
      "Implement gradual withdrawal protocol if necessary",
      "Activate community-led governance as backup",
    ];
  }

  // Monitoring and background processes
  private startInversionMonitoring(): void {
    setInterval(() => {
      this.monitorFailureIntents();
    }, 300000); // Every 5 minutes
  }

  private startRedTeamChallenges(): void {
    setInterval(() => {
      this.generatePeriodicChallenges();
    }, 3600000); // Every hour
  }

  private startLatticeAnalysis(): void {
    setInterval(() => {
      this.updateLatticeRecommendations();
    }, 1800000); // Every 30 minutes
  }

  private async monitorFailureIntents(): Promise<void> {
    for (const intent of this.avoidFailureIntents.values()) {
      if (intent.status === "active") {
        // Check trigger conditions
        const triggered = await this.checkTriggerConditions(intent);
        if (triggered) {
          intent.status = "triggered";
          console.log(`Failure intent triggered: ${intent.intent}`);
          // Implement immediate guardrails
        }
      }
    }
  }

  private async checkTriggerConditions(
    intent: AvoidFailureIntent,
  ): Promise<boolean> {
    // Simplified trigger checking - in production, this would connect to real metrics
    return Math.random() < 0.05; // 5% chance of trigger for demo
  }

  private async generatePeriodicChallenges(): Promise<void> {
    const activeIntents = Array.from(this.avoidFailureIntents.values()).filter(
      (intent) => intent.status === "active",
    );

    for (const intent of activeIntents) {
      if (Math.random() < 0.3) {
        // 30% chance of new challenge
        const challengerType = [
          "ai_devil_advocate",
          "contrarian_model",
          "failure_analyst",
          "bias_detector",
        ][Math.floor(Math.random() * 4)] as RedTeamChallenge["challenger"];

        const challenge = this.createRedTeamChallenge(intent, challengerType);
        this.redTeamChallenges.set(challenge.id, challenge);
        intent.redTeamChallenges.push(challenge.id);
      }
    }
  }

  private async updateLatticeRecommendations(): Promise<void> {
    // Update existing recommendations based on new data
    for (const [id, recommendation] of this.latticeRecommendations.entries()) {
      // Recalculate confidence based on new information
      const models = this.selectRelevantModels(recommendation.vaultId);
      recommendation.confidence = this.calculateLatticeConfidence(models);
    }
  }

  // Public interface methods
  async getMentalModels(): Promise<MentalModel[]> {
    return Array.from(this.mentalModels.values()).sort(
      (a, b) => b.ecosystemRelevance - a.ecosystemRelevance,
    );
  }

  async getInversionAnalyses(): Promise<InversionAnalysis[]> {
    return Array.from(this.inversionAnalyses.values()).sort(
      (a, b) => b.riskScore - a.riskScore,
    );
  }

  async getAvoidFailureIntents(userId?: string): Promise<AvoidFailureIntent[]> {
    let intents = Array.from(this.avoidFailureIntents.values());
    if (userId) {
      intents = intents.filter((intent) => intent.userId === userId);
    }
    return intents.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return (
        (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0)
      );
    });
  }

  async getRedTeamChallenges(intentId?: string): Promise<RedTeamChallenge[]> {
    let challenges = Array.from(this.redTeamChallenges.values());
    if (intentId) {
      challenges = challenges.filter(
        (challenge) => challenge.intentId === intentId,
      );
    }
    return challenges
      .filter((challenge) => !challenge.resolution)
      .sort((a, b) => b.riskLevel - a.riskLevel);
  }

  async getLatticeRecommendations(
    vaultId?: string,
  ): Promise<LatticeRecommendation[]> {
    let recommendations = Array.from(this.latticeRecommendations.values());
    if (vaultId) {
      recommendations = recommendations.filter(
        (rec) => rec.vaultId === vaultId,
      );
    }
    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  async resolveRedTeamChallenge(
    challengeId: string,
    resolution: string,
  ): Promise<void> {
    const challenge = this.redTeamChallenges.get(challengeId);
    if (challenge) {
      challenge.resolution = resolution;
      challenge.actionRequired = false;
    }
  }

  async updateAvoidFailureIntent(
    intentId: string,
    updates: Partial<
      Pick<AvoidFailureIntent, "intent" | "triggerConditions" | "guardrails">
    >,
  ): Promise<AvoidFailureIntent | null> {
    const intent = this.avoidFailureIntents.get(intentId);
    if (intent) {
      Object.assign(intent, updates);
      intent.lastReview = new Date();
      return intent;
    }
    return null;
  }

  private async seedDefaultInversions(): Promise<void> {
    const defaultInversions = [
      {
        id: "inversion_001",
        scenario: "Market Expansion Strategy",
        question: "What would cause this expansion to fail catastrophically?",
        failureModes: [
          "Poor local market research",
          "Cultural misalignment",
          "Regulatory barriers",
        ],
        avoidanceStrategies: [
          "Extensive local partnerships",
          "Cultural adaptation",
          "Legal compliance review",
        ],
        mitigationPlans: [
          "Exit strategy planning",
          "Gradual market entry",
          "Local talent acquisition",
        ],
        probabilityOfFailure: 25,
        impactSeverity: 80,
        riskScore: 20,
        inverseMeasures: [
          "Strong local presence",
          "Cultural sensitivity training",
          "Regulatory expertise",
        ],
      },
    ];
  }

  async getAvoidFailureIntents(): Promise<AvoidFailureIntent[]> {
    return [
      {
        id: "intent_001",
        domain: "investment_selection",
        intent: "Avoid investing in declining industries",
        guardrails: ["Industry trend analysis", "Disruption risk assessment"],
        triggers: ["Negative growth for 2+ quarters", "New technology threats"],
        actions: ["Reduce position size", "Exit strategy implementation"],
        monitoringMetrics: [
          "Market share trends",
          "Innovation investment levels",
        ],
        violationConsequences: [
          "Automatic position review",
          "Investment committee escalation",
        ],
        lastReview: new Date(),
        status: "active",
        confidence: 85,
      },
    ];
  }

  async getRedTeamChallenges(): Promise<RedTeamChallenge[]> {
    return [
      {
        id: "challenge_001",
        targetScenario: "Tech stock concentration",
        challengeDescription: "Portfolio too concentrated in technology sector",
        redTeamArguments: [
          "Tech bubble risk",
          "Regulatory threats",
          "Market saturation",
        ],
        blueTeamResponse: [
          "Diversified tech exposure",
          "Strong fundamentals",
          "Innovation moats",
        ],
        resolution: "Moderate concentration reduction recommended",
        confidence: 75,
        participants: ["Investment Team", "Risk Committee"],
        status: "resolved",
        createdAt: new Date(),
        resolvedAt: new Date(),
      },
    ];
  }

  async getLatticeRecommendations(): Promise<LatticeRecommendation[]> {
    return [
      {
        id: "lattice_001",
        mentalModelCombination: ["Systems Thinking", "Competitive Dynamics"],
        ecosystemScenario: "Sustainable investment selection",
        latticeInsight:
          "Combine ecological resilience with competitive moat analysis",
        applicableVaults: ["ESG Tech Fund", "Sustainable Infrastructure"],
        implementationSteps: [
          "Assess ecosystem health",
          "Evaluate competitive position",
          "Monitor feedback loops",
        ],
        expectedOutcome:
          "Enhanced risk-adjusted returns through multi-disciplinary analysis",
        confidence: 88,
        precedentCases: [
          "Renewable energy investments",
          "Circular economy plays",
        ],
        createdAt: new Date(),
      },
    ];
  }

  async assessPortfolioRisks(): Promise<any[]> {
    return [
      {
        id: "risk_001",
        severity: "high" as const,
        type: "concentration" as const,
        title: "Mental Model Blind Spot",
        description:
          "Over-reliance on single mental model creating cognitive bias",
        asset: "Tech Portfolio",
        impact: 25,
        probability: 45,
        timeframe: "3 months",
        recommendation: "Apply multiple mental models to investment analysis",
        philosophy: "munger" as const,
        createdAt: new Date(),
        acknowledged: false,
      },
    ];
  }
}

export const mungerMentalModelsService = singletonPattern(
  () => new MungerMentalModelsService(),
);
