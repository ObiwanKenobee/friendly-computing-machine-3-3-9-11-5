/**
 * Age-based investment strategies for QuantumVest Enterprise
 * Implements legendary investor principles adapted for different life stages
 */

import {
  AgeProfile,
  AgeInvestmentStrategy,
  AgeRange,
  AgePerformanceMetrics,
} from "../types/Age";

// Age profiles with comprehensive characteristics
export const AGE_PROFILES: Record<AgeRange, AgeProfile> = {
  "18-25": {
    range: "18-25",
    label: "Young Professional",
    description: "Building foundation, high growth potential, long-term focus",
    icon: "🚀",
    colors: {
      primary: "#10B981", // emerald-500
      secondary: "#34D399", // emerald-400
      accent: "#059669", // emerald-600
    },
    characteristics: {
      riskTolerance: "aggressive",
      investmentHorizon: 40,
      liquidityNeeds: "low",
      incomeStability: "building",
      primaryGoals: [
        "Wealth accumulation",
        "Emergency fund building",
        "Career development",
        "Financial education",
        "Long-term growth",
      ],
    },
    recommendedStrategies: {
      growth: 80,
      income: 5,
      preservation: 15,
    },
    legendaryInvestorFocus: {
      buffett: 8, // Long-term compounding focus
      munger: 9, // Learning and mental models
      dalio: 6, // Risk management
      lynch: 10, // Growth stock opportunities
    },
  },
  "26-35": {
    range: "26-35",
    label: "Career Builder",
    description:
      "Peak earning years beginning, family planning, aggressive growth",
    icon: "⚡",
    colors: {
      primary: "#3B82F6", // blue-500
      secondary: "#60A5FA", // blue-400
      accent: "#1D4ED8", // blue-700
    },
    characteristics: {
      riskTolerance: "aggressive",
      investmentHorizon: 30,
      liquidityNeeds: "medium",
      incomeStability: "building",
      primaryGoals: [
        "Home ownership",
        "Family planning",
        "Career advancement",
        "Diversified portfolio",
        "Tax optimization",
      ],
    },
    recommendedStrategies: {
      growth: 70,
      income: 15,
      preservation: 15,
    },
    legendaryInvestorFocus: {
      buffett: 9, // Quality companies, moats
      munger: 8, // Rational decision making
      dalio: 7, // Diversification principles
      lynch: 9, // Growth opportunities
    },
  },
  "36-50": {
    range: "36-50",
    label: "Peak Earner",
    description:
      "Prime earning years, balanced approach, family responsibilities",
    icon: "🎯",
    colors: {
      primary: "#8B5CF6", // violet-500
      secondary: "#A78BFA", // violet-400
      accent: "#7C3AED", // violet-600
    },
    characteristics: {
      riskTolerance: "moderate",
      investmentHorizon: 20,
      liquidityNeeds: "medium",
      incomeStability: "peak",
      primaryGoals: [
        "Retirement planning",
        "Education funding",
        "Wealth preservation",
        "Tax efficiency",
        "Estate planning",
      ],
    },
    recommendedStrategies: {
      growth: 55,
      income: 30,
      preservation: 15,
    },
    legendaryInvestorFocus: {
      buffett: 10, // Value investing mastery
      munger: 10, // Mental models refinement
      dalio: 9, // All-weather portfolio
      lynch: 7, // Selective growth
    },
  },
  "51-65": {
    range: "51-65",
    label: "Pre-Retirement",
    description: "Wealth preservation focus, reduced risk, income generation",
    icon: "🛡️",
    colors: {
      primary: "#F59E0B", // amber-500
      secondary: "#FCD34D", // amber-300
      accent: "#D97706", // amber-600
    },
    characteristics: {
      riskTolerance: "moderate",
      investmentHorizon: 15,
      liquidityNeeds: "high",
      incomeStability: "stable",
      primaryGoals: [
        "Retirement preparation",
        "Income generation",
        "Capital preservation",
        "Healthcare planning",
        "Legacy building",
      ],
    },
    recommendedStrategies: {
      growth: 35,
      income: 50,
      preservation: 15,
    },
    legendaryInvestorFocus: {
      buffett: 9, // Dividend aristocrats
      munger: 8, // Risk management
      dalio: 10, // Balanced portfolio
      lynch: 5, // Conservative growth
    },
  },
  "65+": {
    range: "65+",
    label: "Retirement",
    description: "Income focus, capital preservation, legacy planning",
    icon: "🌅",
    colors: {
      primary: "#EF4444", // red-500
      secondary: "#F87171", // red-400
      accent: "#DC2626", // red-600
    },
    characteristics: {
      riskTolerance: "conservative",
      investmentHorizon: 10,
      liquidityNeeds: "high",
      incomeStability: "declining",
      primaryGoals: [
        "Income generation",
        "Capital preservation",
        "Healthcare expenses",
        "Legacy planning",
        "Inflation protection",
      ],
    },
    recommendedStrategies: {
      growth: 20,
      income: 60,
      preservation: 20,
    },
    legendaryInvestorFocus: {
      buffett: 8, // Blue-chip dividends
      munger: 7, // Conservative wisdom
      dalio: 10, // Risk parity
      lynch: 3, // Limited growth focus
    },
  },
};

// Investment strategies tailored to age groups
export const AGE_INVESTMENT_STRATEGIES: AgeInvestmentStrategy[] = [
  // Young Professional Strategies (18-25)
  {
    name: "Aggressive Growth Portfolio",
    description: "High-growth focus with emerging markets and technology",
    allocation: { stocks: 90, bonds: 5, alternatives: 3, cash: 2 },
    riskLevel: 9,
    expectedReturn: 12,
    timeframe: "20+ years",
    suitableFor: ["18-25", "26-35"],
  },
  {
    name: "Lynch Growth Discovery",
    description: "Peter Lynch inspired growth stock selection",
    allocation: { stocks: 85, bonds: 10, alternatives: 3, cash: 2 },
    riskLevel: 8,
    expectedReturn: 11,
    timeframe: "15+ years",
    suitableFor: ["18-25", "26-35"],
  },

  // Career Builder Strategies (26-35)
  {
    name: "Buffett Quality Growth",
    description:
      "High-quality companies with sustainable competitive advantages",
    allocation: { stocks: 75, bonds: 15, alternatives: 7, cash: 3 },
    riskLevel: 7,
    expectedReturn: 10,
    timeframe: "15+ years",
    suitableFor: ["26-35", "36-50"],
  },
  {
    name: "Diversified Growth Portfolio",
    description: "Balanced growth approach with international exposure",
    allocation: { stocks: 70, bonds: 20, alternatives: 8, cash: 2 },
    riskLevel: 6,
    expectedReturn: 9,
    timeframe: "10+ years",
    suitableFor: ["26-35", "36-50"],
  },

  // Peak Earner Strategies (36-50)
  {
    name: "Dalio All-Weather",
    description:
      "Ray Dalio inspired balanced portfolio for all market conditions",
    allocation: { stocks: 55, bonds: 30, alternatives: 12, cash: 3 },
    riskLevel: 5,
    expectedReturn: 8,
    timeframe: "10+ years",
    suitableFor: ["36-50", "51-65"],
  },
  {
    name: "Munger Wisdom Portfolio",
    description:
      "Charlie Munger principles: patience, rationality, and quality",
    allocation: { stocks: 60, bonds: 25, alternatives: 10, cash: 5 },
    riskLevel: 4,
    expectedReturn: 7.5,
    timeframe: "8+ years",
    suitableFor: ["36-50", "51-65"],
  },

  // Pre-Retirement Strategies (51-65)
  {
    name: "Income Generation Focus",
    description: "Dividend-focused portfolio with stable income generation",
    allocation: { stocks: 40, bonds: 45, alternatives: 10, cash: 5 },
    riskLevel: 3,
    expectedReturn: 6.5,
    timeframe: "5+ years",
    suitableFor: ["51-65", "65+"],
  },
  {
    name: "Capital Preservation Plus",
    description: "Conservative growth with emphasis on capital preservation",
    allocation: { stocks: 35, bonds: 50, alternatives: 8, cash: 7 },
    riskLevel: 3,
    expectedReturn: 6,
    timeframe: "5+ years",
    suitableFor: ["51-65", "65+"],
  },

  // Retirement Strategies (65+)
  {
    name: "Retirement Income Portfolio",
    description: "High-yield income with inflation protection",
    allocation: { stocks: 25, bonds: 60, alternatives: 10, cash: 5 },
    riskLevel: 2,
    expectedReturn: 5,
    timeframe: "3+ years",
    suitableFor: ["65+"],
  },
  {
    name: "Legacy Preservation",
    description: "Ultra-conservative approach for wealth preservation",
    allocation: { stocks: 20, bonds: 70, alternatives: 5, cash: 5 },
    riskLevel: 1,
    expectedReturn: 4,
    timeframe: "Ongoing",
    suitableFor: ["65+"],
  },
];

// Performance metrics by age group (historical data simulation)
export const AGE_PERFORMANCE_METRICS: Record<AgeRange, AgePerformanceMetrics> =
  {
    "18-25": {
      ageRange: "18-25",
      averageReturn: 11.2,
      volatility: 18.5,
      sharpeRatio: 0.65,
      maxDrawdown: -35,
      successRate: 78,
      timeToGoal: 25,
    },
    "26-35": {
      ageRange: "26-35",
      averageReturn: 9.8,
      volatility: 15.2,
      sharpeRatio: 0.72,
      maxDrawdown: -28,
      successRate: 82,
      timeToGoal: 18,
    },
    "36-50": {
      ageRange: "36-50",
      averageReturn: 8.1,
      volatility: 12.1,
      sharpeRatio: 0.78,
      maxDrawdown: -22,
      successRate: 85,
      timeToGoal: 12,
    },
    "51-65": {
      ageRange: "51-65",
      averageReturn: 6.5,
      volatility: 9.2,
      sharpeRatio: 0.81,
      maxDrawdown: -15,
      successRate: 88,
      timeToGoal: 8,
    },
    "65+": {
      ageRange: "65+",
      averageReturn: 4.8,
      volatility: 6.1,
      sharpeRatio: 0.75,
      maxDrawdown: -8,
      successRate: 92,
      timeToGoal: 5,
    },
  };

// Utility functions
export const getAgeProfile = (age: AgeRange): AgeProfile => {
  return AGE_PROFILES[age];
};

export const getStrategiesForAge = (age: AgeRange): AgeInvestmentStrategy[] => {
  return AGE_INVESTMENT_STRATEGIES.filter((strategy) =>
    strategy.suitableFor.includes(age),
  );
};

export const calculateAgeBasedAllocation = (
  age: AgeRange,
  riskModifier: number = 1,
): { stocks: number; bonds: number; alternatives: number; cash: number } => {
  const profile = getAgeProfile(age);
  const baseStocks = Math.max(20, 120 - parseInt(age.split("-")[0]));

  return {
    stocks: Math.min(90, baseStocks * riskModifier),
    bonds: Math.max(10, 100 - baseStocks * riskModifier - 10),
    alternatives: Math.min(15, 5 + (riskModifier - 1) * 5),
    cash: Math.max(2, 5 - (riskModifier - 1) * 2),
  };
};

export const getAgeBasedRiskScore = (age: AgeRange): number => {
  const ageNumber = parseInt(age.split("-")[0]);
  return Math.max(1, Math.min(10, 11 - Math.floor(ageNumber / 10)));
};

export const isProductSuitableForAge = (
  productRiskLevel: number,
  productComplexity: "simple" | "moderate" | "complex",
  age: AgeRange,
): boolean => {
  const profile = getAgeProfile(age);
  const ageRiskScore = getAgeBasedRiskScore(age);

  // Basic risk level check
  if (productRiskLevel > ageRiskScore + 2) return false;

  // Complexity check for younger users
  if (age === "18-25" && productComplexity === "complex") return false;

  return true;
};
