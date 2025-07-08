/**
 * Age-related type definitions for QuantumVest Enterprise
 * Supports age-based investment strategies, risk profiles, and regulatory compliance
 */

export type AgeRange = "18-25" | "26-35" | "36-50" | "51-65" | "65+";

export interface AgeProfile {
  range: AgeRange;
  label: string;
  description: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  characteristics: {
    riskTolerance: "conservative" | "moderate" | "aggressive";
    investmentHorizon: number; // years
    liquidityNeeds: "low" | "medium" | "high";
    incomeStability: "building" | "peak" | "stable" | "declining";
    primaryGoals: string[];
  };
  recommendedStrategies: {
    growth: number; // percentage
    income: number; // percentage
    preservation: number; // percentage
  };
  legendaryInvestorFocus: {
    buffett: number; // relevance score 0-10
    munger: number;
    dalio: number;
    lynch: number;
  };
}

export interface AgeInvestmentStrategy {
  name: string;
  description: string;
  allocation: {
    stocks: number;
    bonds: number;
    alternatives: number;
    cash: number;
  };
  riskLevel: number; // 1-10
  expectedReturn: number; // annual percentage
  timeframe: string;
  suitableFor: AgeRange[];
}

export interface AgeContext {
  currentAge: AgeRange | null;
  profile: AgeProfile | null;
  strategies: AgeInvestmentStrategy[];
  compliance: {
    isVerified: boolean;
    restrictedProducts: string[];
    requiredDisclosures: string[];
  };
  preferences: {
    showAgeBasedContent: boolean;
    autoUpdateStrategies: boolean;
    hideInappropriateProducts: boolean;
  };
}

export interface AgeContextActions {
  setAge: (age: AgeRange) => void;
  updatePreferences: (preferences: Partial<AgeContext["preferences"]>) => void;
  getRecommendedStrategies: () => AgeInvestmentStrategy[];
  validateProductAccess: (productId: string) => boolean;
  resetAgeData: () => void;
}

export type AgeContextType = AgeContext & AgeContextActions;

// Age-based investment product categories
export interface AgeRestrictedProduct {
  id: string;
  name: string;
  minAge: number;
  maxAge?: number;
  riskLevel: number;
  requiresAdvancedKnowledge: boolean;
  complianceRequirements: string[];
}

// Performance metrics by age group
export interface AgePerformanceMetrics {
  ageRange: AgeRange;
  averageReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  successRate: number; // percentage of profitable outcomes
  timeToGoal: number; // average years to reach financial goals
}

// Age-specific UI customization
export interface AgeUIPreferences {
  fontSize: "small" | "medium" | "large";
  complexity: "simplified" | "standard" | "advanced";
  dashboardLayout: "minimal" | "comprehensive" | "custom";
  notifications: {
    frequency: "minimal" | "standard" | "detailed";
    channels: ("email" | "sms" | "app" | "desktop")[];
  };
}
