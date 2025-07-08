export interface AIRecommendation {
  id: string;
  userId: string;
  type: "buy" | "sell" | "hold" | "rebalance";
  asset: string;
  confidence: number;
  reasoning: string;
  expectedReturn: number;
  riskScore: number;
  timeHorizon: string;
  culturalCompliance?: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface PortfolioAnalysis {
  totalValue: number;
  riskScore: number;
  diversificationScore: number;
  culturalComplianceScore: number;
  expectedAnnualReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface AIAdvisorConfig {
  riskTolerance: "conservative" | "moderate" | "aggressive";
  investmentGoals: string[];
  timeHorizon: number;
  culturalPreferences: string[];
  excludedSectors: string[];
  minInvestmentAmount: number;
  maxPositionSize: number;
}

export interface MarketInsight {
  id: string;
  title: string;
  summary: string;
  category: "market" | "economic" | "geopolitical" | "sector";
  impact: "high" | "medium" | "low";
  relevantAssets: string[];
  confidence: number;
  source: string;
  createdAt: Date;
}
