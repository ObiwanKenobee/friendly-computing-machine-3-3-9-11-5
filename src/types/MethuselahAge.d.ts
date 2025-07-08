/**
 * Extended Age Types for Methuselah Life Cycle Simulation
 * Covering investment strategies across centuries of life
 */

import { AgeRange, AgeProfile, AgeInvestmentStrategy } from "./Age";

// Extended age ranges for Methuselah simulation (969 years)
export type MethuselahAgeRange =
  | "18-50" // Foundation Era
  | "51-100" // Mastery Era
  | "101-200" // Wisdom Era
  | "201-400" // Legacy Era
  | "401-600" // Transcendence Era
  | "601-800" // Immortal Era
  | "801-969"; // Methuselah Era

export interface MethuselahAgeProfile extends Omit<AgeProfile, "range"> {
  range: MethuselahAgeRange;
  era: string;
  centuryFocus: string;
  innovationPriorities: string[];
  technologyAdoption: "early" | "mainstream" | "conservative" | "transcendent";
  socialImpact: "building" | "leading" | "mentoring" | "transcending";
  wealthDistribution: {
    personal: number;
    family: number;
    society: number;
    humanity: number;
    universe: number;
  };
  cognitiveEvolution: {
    pattern: "expanding" | "consolidating" | "transcending";
    focus: string[];
    capabilities: string[];
  };
  relationshipDynamics: {
    generations: number; // How many generations they've witnessed
    roles: string[];
    influence: "local" | "regional" | "global" | "universal";
  };
}

export interface MethuselahInnovation {
  id: string;
  name: string;
  description: string;
  era: MethuselahAgeRange;
  category: "biological" | "technological" | "social" | "spiritual" | "cosmic";
  impact: "personal" | "family" | "community" | "civilization" | "universal";
  adoptionCurve: {
    early: MethuselahAgeRange[];
    mainstream: MethuselahAgeRange[];
    late: MethuselahAgeRange[];
  };
  investmentThemes: string[];
  riskLevel: number; // 1-10
  timeHorizon: number; // years
  expectedReturn: number; // percentage
}

export interface MethuselahLifeStage {
  range: MethuselahAgeRange;
  name: string;
  description: string;
  duration: number; // years
  keyMilestones: string[];
  dominantConcerns: string[];
  investmentPhilosophy: string;
  innovationFocus: MethuselahInnovation[];
  societalRole: string;
  legacyBuilding: {
    biological: string[];
    intellectual: string[];
    technological: string[];
    spiritual: string[];
  };
  riskManagement: {
    mortalityRisk: number;
    obsolescenceRisk: number;
    relevanceRisk: number;
    adaptabilityChallenge: number;
  };
}

export interface MethuselahPortfolio {
  ageRange: MethuselahAgeRange;
  totalWealth: number; // in trillions
  allocation: {
    // Traditional assets (diminishing over time)
    stocks: number;
    bonds: number;
    realEstate: number;
    commodities: number;

    // Century-scale assets (growing over time)
    longevityTech: number;
    spaceInfrastructure: number;
    consciousnesstech: number;
    quantumComputing: number;
    bioengineering: number;

    // Transcendent assets (emerging in later eras)
    interstellarClaims: number;
    timeManipulation: number;
    universalKnowledge: number;
    cosmicEnergy: number;
    realityShaping: number;
  };
  liquidityNeeds: {
    immediate: number; // next decade
    century: number; // next 100 years
    millennium: number; // next 1000 years
  };
  successorPlanning: {
    directDescendants: number;
    institutionalBeneficiaries: number;
    civilizationalLegacies: number;
  };
}

export interface MethuselahSimulation {
  currentAge: number;
  currentEra: MethuselahAgeRange;
  lifeProgress: number; // percentage (0-100)
  totalNetWorth: number;
  generationsWitnessed: number;
  civilizationsInfluenced: number;
  innovationsSponsored: number;
  portfolio: MethuselahPortfolio;
  nextMilestones: string[];
  historicalAchievements: string[];
  currentChallenges: string[];
  wisdomAccumulated: string[];
  relationshipNetwork: {
    livingDescendants: number;
    institutionalLegacies: number;
    globalInfluence: number;
    universalImpact: number;
  };
}

export interface MethuselahInvestmentStrategy
  extends Omit<AgeInvestmentStrategy, "suitableFor"> {
  suitableFor: MethuselahAgeRange[];
  centuryFocus: string;
  civilizationalImpact: string;
  transcendenceLevel: number; // 1-10
  universalAlignment: boolean;
}

// Enterprise innovation categories across eras
export interface EnterpriseInnovationEra {
  era: MethuselahAgeRange;
  name: string;
  dominantTechnologies: string[];
  investmentThemes: string[];
  societalShifts: string[];
  businessModels: string[];
  riskFactors: string[];
  opportunities: string[];
  legendaryAdaptations: {
    buffett: string;
    munger: string;
    dalio: string;
    lynch: string;
  };
}

// Life completion simulation
export interface LifeCompletionMetrics {
  knowledgeAccumulation: number; // 0-100%
  wealthDistribution: number; // 0-100%
  legacyEstablishment: number; // 0-100%
  wisdomTransfer: number; // 0-100%
  universalContribution: number; // 0-100%
  transcendencePreparation: number; // 0-100%
  overallCompletion: number; // 0-100%
}

export interface MethuselahContext {
  simulation: MethuselahSimulation;
  lifeStages: MethuselahLifeStage[];
  innovations: MethuselahInnovation[];
  completionMetrics: LifeCompletionMetrics;
  currentRecommendations: string[];
  nextEraPreparation: string[];
}

export interface MethuselahContextActions {
  simulateAgeProgression: (targetAge: number) => void;
  switchToEra: (era: MethuselahAgeRange) => void;
  addInnovationInvestment: (innovationId: string, amount: number) => void;
  updatePortfolioAllocation: (
    allocation: Partial<MethuselahPortfolio["allocation"]>,
  ) => void;
  calculateLifeCompletion: () => LifeCompletionMetrics;
  generateEraRecommendations: (era: MethuselahAgeRange) => string[];
  getInnovationOpportunities: () => MethuselahInnovation[];
  simulateGenerationalTransition: () => void;
  resetSimulation: () => void;
}

export type MethuselahContextType = MethuselahContext &
  MethuselahContextActions;
