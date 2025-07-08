import type {
  RiskAssessment,
  RiskFactor,
  RiskMetrics,
} from "../types/RiskAssessment";

export interface PortfolioData {
  holdings: Holding[];
  totalValue: number;
  timeHorizon: number;
  riskTolerance: "conservative" | "moderate" | "aggressive";
}

export interface Holding {
  symbol: string;
  quantity: number;
  currentPrice: number;
  weight: number;
  historicalReturns: number[];
  volatility: number;
  beta?: number;
  sector: string;
  assetClass: string;
  correlation?: Record<string, number>;
}

export interface MarketData {
  riskFreeRate: number;
  marketReturn: number;
  marketVolatility: number;
  correlationMatrix: Record<string, Record<string, number>>;
}

export interface ScenarioInput {
  name: string;
  shocks: Record<string, number>;
  probability: number;
}

/**
 * Calculate overall portfolio risk score (0-100 scale)
 */
export const calculateOverallRiskScore = (portfolio: PortfolioData): number => {
  const { holdings, riskTolerance } = portfolio;

  // Calculate weighted average volatility
  const weightedVolatility = holdings.reduce((sum, holding) => {
    return sum + holding.weight * holding.volatility;
  }, 0);

  // Calculate concentration risk
  const concentrationRisk = calculateConcentrationRisk(holdings);

  // Calculate diversification score
  const diversificationScore = calculateDiversificationScore(holdings);

  // Base risk score from volatility (0-100)
  let riskScore = Math.min(weightedVolatility * 100, 100);

  // Adjust for concentration risk (increase risk)
  riskScore += concentrationRisk * 20;

  // Adjust for diversification (decrease risk)
  riskScore -= (diversificationScore / 100) * 15;

  // Adjust for risk tolerance
  const toleranceMultiplier = {
    conservative: 1.2,
    moderate: 1.0,
    aggressive: 0.8,
  };

  riskScore *= toleranceMultiplier[riskTolerance];

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, riskScore));
};

/**
 * Calculate risk grade based on risk score
 */
export const calculateRiskGrade = (
  riskScore: number,
): "A" | "B" | "C" | "D" | "F" => {
  if (riskScore <= 20) return "A";
  if (riskScore <= 40) return "B";
  if (riskScore <= 60) return "C";
  if (riskScore <= 80) return "D";
  return "F";
};

/**
 * Calculate concentration risk (single asset concentration)
 */
export const calculateConcentrationRisk = (holdings: Holding[]): number => {
  if (holdings.length === 0) return 1;

  // Calculate Herfindahl-Hirschman Index for concentration
  const hhi = holdings.reduce((sum, holding) => {
    return sum + holding.weight * holding.weight;
  }, 0);

  // Normalize to 0-1 scale (1 = maximum concentration)
  return Math.min(hhi, 1);
};

/**
 * Calculate diversification score (0-100, higher is better)
 */
export const calculateDiversificationScore = (holdings: Holding[]): number => {
  if (holdings.length === 0) return 0;

  // Sector diversification
  const sectors = new Set(holdings.map((h) => h.sector));
  const sectorScore = Math.min(sectors.size * 10, 50);

  // Asset class diversification
  const assetClasses = new Set(holdings.map((h) => h.assetClass));
  const assetClassScore = Math.min(assetClasses.size * 15, 50);

  // Number of holdings
  const holdingCountScore = Math.min(holdings.length * 2, 20);

  // Weight distribution
  const maxWeight = Math.max(...holdings.map((h) => h.weight));
  const weightScore = Math.max(0, (0.3 - maxWeight) * 100); // Penalty if any holding > 30%

  return Math.min(
    sectorScore + assetClassScore + holdingCountScore + weightScore,
    100,
  );
};

/**
 * Calculate Value at Risk (VaR) using historical simulation
 */
export const calculateVaR = (
  returns: number[],
  confidenceLevel: number = 0.95,
  timeHorizon: number = 1,
): number => {
  if (returns.length === 0) return 0;

  const sortedReturns = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidenceLevel) * sortedReturns.length);
  const var95 = sortedReturns[index] || 0;

  // Scale for time horizon (assuming daily returns)
  return var95 * Math.sqrt(timeHorizon);
};

/**
 * Calculate Expected Shortfall (Conditional VaR)
 */
export const calculateExpectedShortfall = (
  returns: number[],
  confidenceLevel: number = 0.95,
): number => {
  if (returns.length === 0) return 0;

  const sortedReturns = [...returns].sort((a, b) => a - b);
  const varIndex = Math.floor((1 - confidenceLevel) * sortedReturns.length);

  const tailReturns = sortedReturns.slice(0, varIndex + 1);
  return tailReturns.reduce((sum, ret) => sum + ret, 0) / tailReturns.length;
};

/**
 * Calculate portfolio beta
 */
export const calculatePortfolioBeta = (
  holdings: Holding[],
  marketReturns: number[],
): number => {
  if (holdings.length === 0) return 1;

  return holdings.reduce((weightedBeta, holding) => {
    const beta =
      holding.beta || calculateBeta(holding.historicalReturns, marketReturns);
    return weightedBeta + holding.weight * beta;
  }, 0);
};

/**
 * Calculate beta for a single asset
 */
export const calculateBeta = (
  assetReturns: number[],
  marketReturns: number[],
): number => {
  if (assetReturns.length !== marketReturns.length || assetReturns.length < 2) {
    return 1;
  }

  const assetMean =
    assetReturns.reduce((sum, ret) => sum + ret, 0) / assetReturns.length;
  const marketMean =
    marketReturns.reduce((sum, ret) => sum + ret, 0) / marketReturns.length;

  let covariance = 0;
  let marketVariance = 0;

  for (let i = 0; i < assetReturns.length; i++) {
    const assetDiff = assetReturns[i] - assetMean;
    const marketDiff = marketReturns[i] - marketMean;

    covariance += assetDiff * marketDiff;
    marketVariance += marketDiff * marketDiff;
  }

  return marketVariance === 0 ? 1 : covariance / marketVariance;
};

/**
 * Calculate correlation matrix for portfolio holdings
 */
export const calculateCorrelationMatrix = (
  holdings: Holding[],
): Record<string, Record<string, number>> => {
  const matrix: Record<string, Record<string, number>> = {};

  holdings.forEach((holding1) => {
    matrix[holding1.symbol] = {};

    holdings.forEach((holding2) => {
      if (holding1.symbol === holding2.symbol) {
        matrix[holding1.symbol][holding2.symbol] = 1;
      } else {
        const correlation = calculateCorrelation(
          holding1.historicalReturns,
          holding2.historicalReturns,
        );
        matrix[holding1.symbol][holding2.symbol] = correlation;
      }
    });
  });

  return matrix;
};

/**
 * Calculate correlation between two return series
 */
export const calculateCorrelation = (
  returns1: number[],
  returns2: number[],
): number => {
  if (returns1.length !== returns2.length || returns1.length < 2) {
    return 0;
  }

  const mean1 = returns1.reduce((sum, ret) => sum + ret, 0) / returns1.length;
  const mean2 = returns2.reduce((sum, ret) => sum + ret, 0) / returns2.length;

  let covariance = 0;
  let variance1 = 0;
  let variance2 = 0;

  for (let i = 0; i < returns1.length; i++) {
    const diff1 = returns1[i] - mean1;
    const diff2 = returns2[i] - mean2;

    covariance += diff1 * diff2;
    variance1 += diff1 * diff1;
    variance2 += diff2 * diff2;
  }

  const stdDev1 = Math.sqrt(variance1 / returns1.length);
  const stdDev2 = Math.sqrt(variance2 / returns2.length);

  return stdDev1 === 0 || stdDev2 === 0
    ? 0
    : covariance / (returns1.length * stdDev1 * stdDev2);
};

/**
 * Perform Monte Carlo simulation for portfolio risk
 */
export const runMonteCarloSimulation = (
  portfolio: PortfolioData,
  simulations: number = 10000,
  timeHorizon: number = 252, // Trading days in a year
): {
  outcomes: number[];
  percentiles: Record<string, number>;
  shortfallProbability: number;
  expectedReturn: number;
  volatility: number;
} => {
  const outcomes: number[] = [];

  for (let i = 0; i < simulations; i++) {
    let portfolioReturn = 0;

    portfolio.holdings.forEach((holding) => {
      // Generate random return based on normal distribution
      const randomReturn = generateNormalRandom(0, holding.volatility);
      portfolioReturn += holding.weight * randomReturn;
    });

    // Scale for time horizon
    const annualizedReturn = portfolioReturn * Math.sqrt(timeHorizon);
    outcomes.push(annualizedReturn);
  }

  outcomes.sort((a, b) => a - b);

  const percentiles = {
    "1%": outcomes[Math.floor(0.01 * outcomes.length)],
    "5%": outcomes[Math.floor(0.05 * outcomes.length)],
    "10%": outcomes[Math.floor(0.1 * outcomes.length)],
    "25%": outcomes[Math.floor(0.25 * outcomes.length)],
    "50%": outcomes[Math.floor(0.5 * outcomes.length)],
    "75%": outcomes[Math.floor(0.75 * outcomes.length)],
    "90%": outcomes[Math.floor(0.9 * outcomes.length)],
    "95%": outcomes[Math.floor(0.95 * outcomes.length)],
    "99%": outcomes[Math.floor(0.99 * outcomes.length)],
  };

  const shortfallProbability =
    outcomes.filter((outcome) => outcome < 0).length / outcomes.length;
  const expectedReturn =
    outcomes.reduce((sum, outcome) => sum + outcome, 0) / outcomes.length;
  const volatility = Math.sqrt(
    outcomes.reduce(
      (sum, outcome) => sum + Math.pow(outcome - expectedReturn, 2),
      0,
    ) / outcomes.length,
  );

  return {
    outcomes,
    percentiles,
    shortfallProbability,
    expectedReturn,
    volatility,
  };
};

/**
 * Generate normally distributed random number (Box-Muller transform)
 */
export const generateNormalRandom = (
  mean: number = 0,
  stdDev: number = 1,
): number => {
  const u1 = Math.random();
  const u2 = Math.random();

  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * stdDev + mean;
};

/**
 * Analyze stress test scenarios
 */
export const analyzeStressScenarios = (
  portfolio: PortfolioData,
  scenarios: ScenarioInput[],
): Array<{
  scenario: string;
  portfolioImpact: number;
  worstAsset: string;
  timeToRecover: number;
}> => {
  return scenarios.map((scenario) => {
    let portfolioImpact = 0;
    let worstAssetImpact = 0;
    let worstAsset = "";

    portfolio.holdings.forEach((holding) => {
      const shock =
        scenario.shocks[holding.symbol] || scenario.shocks[holding.sector] || 0;
      const impact = holding.weight * shock;
      portfolioImpact += impact;

      if (Math.abs(impact) > Math.abs(worstAssetImpact)) {
        worstAssetImpact = impact;
        worstAsset = holding.symbol;
      }
    });

    // Estimate recovery time based on historical volatility
    const avgVolatility = portfolio.holdings.reduce(
      (sum, h) => sum + h.volatility * h.weight,
      0,
    );
    const timeToRecover = Math.abs(portfolioImpact) / (avgVolatility * 0.1); // Rough estimate

    return {
      scenario: scenario.name,
      portfolioImpact,
      worstAsset,
      timeToRecover,
    };
  });
};

/**
 * Calculate risk factors for a portfolio
 */
export const calculateRiskFactors = (
  portfolio: PortfolioData,
): RiskFactor[] => {
  const factors: RiskFactor[] = [];

  // Market Risk
  const marketBeta = calculatePortfolioBeta(portfolio.holdings, []);
  factors.push({
    name: "Market Risk",
    category: "market",
    score: Math.min(marketBeta * 50, 100),
    weight: 0.3,
    description: "Sensitivity to market movements",
    impact: marketBeta > 1.2 ? "high" : marketBeta > 0.8 ? "medium" : "low",
    mitigation: ["Diversification", "Hedging", "Asset allocation"],
  });

  // Concentration Risk
  const concentrationRisk = calculateConcentrationRisk(portfolio.holdings);
  factors.push({
    name: "Concentration Risk",
    category: "concentration",
    score: concentrationRisk * 100,
    weight: 0.2,
    description: "Risk from concentrated positions",
    impact:
      concentrationRisk > 0.5
        ? "high"
        : concentrationRisk > 0.25
          ? "medium"
          : "low",
    mitigation: ["Diversification", "Position sizing", "Rebalancing"],
  });

  // Volatility Risk
  const avgVolatility = portfolio.holdings.reduce(
    (sum, h) => sum + h.volatility * h.weight,
    0,
  );
  factors.push({
    name: "Volatility Risk",
    category: "market",
    score: Math.min(avgVolatility * 200, 100),
    weight: 0.25,
    description: "Price fluctuation risk",
    impact:
      avgVolatility > 0.3 ? "high" : avgVolatility > 0.15 ? "medium" : "low",
    mitigation: [
      "Diversification",
      "Lower-volatility assets",
      "Dollar-cost averaging",
    ],
  });

  // Liquidity Risk
  const liquidityScore =
    portfolio.holdings.length > 20 ? 20 : portfolio.holdings.length * 5;
  factors.push({
    name: "Liquidity Risk",
    category: "liquidity",
    score: Math.max(0, 100 - liquidityScore),
    weight: 0.15,
    description: "Risk of not being able to sell quickly",
    impact:
      liquidityScore < 50 ? "high" : liquidityScore < 75 ? "medium" : "low",
    mitigation: [
      "Include liquid assets",
      "Diversify across markets",
      "Emergency fund",
    ],
  });

  // Currency Risk (if international exposure)
  const hasInternational = portfolio.holdings.some((h) =>
    h.sector.includes("International"),
  );
  if (hasInternational) {
    factors.push({
      name: "Currency Risk",
      category: "market",
      score: 30,
      weight: 0.1,
      description: "Risk from currency fluctuations",
      impact: "medium",
      mitigation: [
        "Currency hedging",
        "Diversified currency exposure",
        "Local currency assets",
      ],
    });
  }

  return factors;
};

/**
 * Calculate comprehensive risk metrics
 */
export const calculateRiskMetrics = (
  portfolio: PortfolioData,
  marketData: MarketData,
): RiskMetrics => {
  const portfolioReturns = portfolio.holdings.flatMap(
    (h) => h.historicalReturns,
  );

  return {
    valueAtRisk: {
      oneDay: calculateVaR(portfolioReturns, 0.95, 1),
      oneWeek: calculateVaR(portfolioReturns, 0.95, 7),
      oneMonth: calculateVaR(portfolioReturns, 0.95, 30),
      confidenceLevel: 0.95,
      methodology: "historical",
    },
    expectedShortfall: calculateExpectedShortfall(portfolioReturns, 0.95),
    maximumDrawdown: calculateMaxDrawdown(portfolioReturns),
    volatility: {
      realized: portfolio.holdings.reduce(
        (sum, h) => sum + h.volatility * h.weight,
        0,
      ),
      implied: 0, // Would need options data
      garch: 0, // Would need GARCH model
      period: 252,
      annualized: true,
    },
    beta: calculatePortfolioBeta(portfolio.holdings, []),
    correlation: calculateCorrelationMatrix(portfolio.holdings),
    sharpeRatio: calculateSharpeRatio(
      portfolioReturns,
      marketData.riskFreeRate,
    ),
    sortinoRatio: calculateSortinoRatio(
      portfolioReturns,
      marketData.riskFreeRate,
    ),
    calmarRatio: 0, // Would need more data
  };
};

/**
 * Calculate maximum drawdown from return series
 */
export const calculateMaxDrawdown = (returns: number[]): number => {
  if (returns.length === 0) return 0;

  let maxDrawdown = 0;
  let peak = 1;
  let current = 1;

  for (const ret of returns) {
    current *= 1 + ret;
    if (current > peak) {
      peak = current;
    }
    const drawdown = (peak - current) / peak;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  }

  return maxDrawdown;
};

/**
 * Calculate Sharpe ratio
 */
export const calculateSharpeRatio = (
  returns: number[],
  riskFreeRate: number,
): number => {
  if (returns.length === 0) return 0;

  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const excessReturn = avgReturn - riskFreeRate / 252; // Daily risk-free rate

  const stdDev = Math.sqrt(
    returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) /
      returns.length,
  );

  return stdDev === 0
    ? 0
    : (excessReturn * Math.sqrt(252)) / (stdDev * Math.sqrt(252));
};

/**
 * Calculate Sortino ratio
 */
export const calculateSortinoRatio = (
  returns: number[],
  targetReturn: number,
): number => {
  if (returns.length === 0) return 0;

  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const excessReturn = avgReturn - targetReturn / 252;

  const downside = returns.filter((ret) => ret < targetReturn / 252);
  if (downside.length === 0) return Infinity;

  const downsideDeviation = Math.sqrt(
    downside.reduce(
      (sum, ret) => sum + Math.pow(ret - targetReturn / 252, 2),
      0,
    ) / returns.length,
  );

  return downsideDeviation === 0
    ? 0
    : (excessReturn * Math.sqrt(252)) / (downsideDeviation * Math.sqrt(252));
};

/**
 * Generate risk recommendations based on analysis
 */
export const generateRiskRecommendations = (
  riskScore: number,
  riskFactors: RiskFactor[],
  portfolio: PortfolioData,
): Array<{
  type:
    | "rebalance"
    | "hedge"
    | "diversify"
    | "reduce-exposure"
    | "add-protection";
  priority: "high" | "medium" | "low";
  description: string;
  expectedImpact: number;
  implementation: string[];
}> => {
  const recommendations = [];

  // High risk score recommendations
  if (riskScore > 80) {
    recommendations.push({
      type: "reduce-exposure" as const,
      priority: "high" as const,
      description: "Reduce overall portfolio risk through position sizing",
      expectedImpact: 15,
      implementation: [
        "Reduce position sizes",
        "Add cash allocation",
        "Move to lower-risk assets",
      ],
    });
  }

  // Concentration risk
  const concentrationFactor = riskFactors.find(
    (f) => f.name === "Concentration Risk",
  );
  if (concentrationFactor && concentrationFactor.score > 50) {
    recommendations.push({
      type: "diversify" as const,
      priority: "high" as const,
      description: "Improve diversification to reduce concentration risk",
      expectedImpact: 20,
      implementation: [
        "Add more holdings",
        "Diversify across sectors",
        "Include different asset classes",
      ],
    });
  }

  // High volatility
  const volatilityFactor = riskFactors.find(
    (f) => f.name === "Volatility Risk",
  );
  if (volatilityFactor && volatilityFactor.score > 60) {
    recommendations.push({
      type: "add-protection" as const,
      priority: "medium" as const,
      description: "Add protective strategies to reduce volatility",
      expectedImpact: 10,
      implementation: [
        "Consider protective puts",
        "Add bonds or stable assets",
        "Implement stop-loss orders",
      ],
    });
  }

  return recommendations;
};

export default {
  calculateOverallRiskScore,
  calculateRiskGrade,
  calculateConcentrationRisk,
  calculateDiversificationScore,
  calculateVaR,
  calculateExpectedShortfall,
  calculatePortfolioBeta,
  calculateBeta,
  calculateCorrelationMatrix,
  runMonteCarloSimulation,
  analyzeStressScenarios,
  calculateRiskFactors,
  calculateRiskMetrics,
  generateRiskRecommendations,
};
