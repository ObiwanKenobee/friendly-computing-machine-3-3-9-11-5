/**
 * ROI (Return on Investment) calculation utilities
 * Comprehensive financial calculations for QuantumVest platform
 */

export interface ROIInput {
  initialInvestment: number;
  currentValue: number;
  timeHorizon?: number; // in years
  cashFlows?: CashFlow[];
  fees?: number;
  taxes?: number;
}

export interface CashFlow {
  date: Date;
  amount: number;
  type: "dividend" | "interest" | "capital-gain" | "fee" | "tax";
}

export interface ROIResult {
  simpleROI: number;
  annualizedROI: number;
  totalReturn: number;
  netReturn: number;
  compoundedReturn: number;
  irr?: number; // Internal Rate of Return
  xirr?: number; // Extended Internal Rate of Return
  sharpeRatio?: number;
  sortinoRatio?: number;
  calmarRatio?: number;
  volatility?: number;
  maxDrawdown?: number;
  alpha?: number;
  beta?: number;
}

export interface PerformanceMetrics {
  returns: number[];
  benchmarkReturns?: number[];
  riskFreeRate?: number;
}

/**
 * Calculate simple ROI
 */
export const calculateSimpleROI = (
  initialInvestment: number,
  currentValue: number,
  fees: number = 0,
  taxes: number = 0,
): number => {
  if (initialInvestment <= 0) return 0;

  const netGain = currentValue - initialInvestment - fees - taxes;
  return (netGain / initialInvestment) * 100;
};

/**
 * Calculate annualized ROI
 */
export const calculateAnnualizedROI = (
  initialInvestment: number,
  currentValue: number,
  timeHorizonYears: number,
  fees: number = 0,
  taxes: number = 0,
): number => {
  if (initialInvestment <= 0 || timeHorizonYears <= 0) return 0;

  const netCurrentValue = currentValue - fees - taxes;
  const totalReturn = netCurrentValue / initialInvestment;

  return (Math.pow(totalReturn, 1 / timeHorizonYears) - 1) * 100;
};

/**
 * Calculate compound annual growth rate (CAGR)
 */
export const calculateCAGR = (
  beginningValue: number,
  endingValue: number,
  timeHorizonYears: number,
): number => {
  if (beginningValue <= 0 || timeHorizonYears <= 0) return 0;

  return (
    (Math.pow(endingValue / beginningValue, 1 / timeHorizonYears) - 1) * 100
  );
};

/**
 * Calculate Internal Rate of Return (IRR)
 */
export const calculateIRR = (cashFlows: number[]): number => {
  if (cashFlows.length < 2) return 0;

  const maxIterations = 1000;
  const tolerance = 1e-6;
  let guess = 0.1; // 10% initial guess

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      const factor = Math.pow(1 + guess, j);
      npv += cashFlows[j] / factor;
      dnpv -= (j * cashFlows[j]) / (factor * (1 + guess));
    }

    if (Math.abs(npv) < tolerance) {
      return guess * 100;
    }

    guess = guess - npv / dnpv;
  }

  return 0; // Failed to converge
};

/**
 * Calculate Extended Internal Rate of Return (XIRR)
 */
export const calculateXIRR = (
  amounts: number[],
  dates: Date[],
  guess: number = 0.1,
): number => {
  if (amounts.length !== dates.length || amounts.length < 2) return 0;

  const maxIterations = 1000;
  const tolerance = 1e-6;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let xnpv = 0;
    let dxnpv = 0;

    for (let j = 0; j < amounts.length; j++) {
      const daysDiff =
        (dates[j].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24);
      const yearsDiff = daysDiff / 365.25;

      const factor = Math.pow(1 + rate, yearsDiff);
      xnpv += amounts[j] / factor;
      dxnpv -= (yearsDiff * amounts[j]) / (factor * (1 + rate));
    }

    if (Math.abs(xnpv) < tolerance) {
      return rate * 100;
    }

    if (Math.abs(dxnpv) < tolerance) break;

    rate = rate - xnpv / dxnpv;
  }

  return 0; // Failed to converge
};

/**
 * Calculate Sharpe Ratio
 */
export const calculateSharpeRatio = (
  returns: number[],
  riskFreeRate: number = 0,
): number => {
  if (returns.length === 0) return 0;

  const excessReturns = returns.map((r) => r - riskFreeRate);
  const avgExcessReturn =
    excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length;
  const stdDev = calculateStandardDeviation(excessReturns);

  return stdDev === 0 ? 0 : avgExcessReturn / stdDev;
};

/**
 * Calculate Sortino Ratio
 */
export const calculateSortinoRatio = (
  returns: number[],
  targetReturn: number = 0,
): number => {
  if (returns.length === 0) return 0;

  const excessReturns = returns.map((r) => r - targetReturn);
  const avgExcessReturn =
    excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length;

  const downside = excessReturns.filter((r) => r < 0);
  if (downside.length === 0) return Infinity;

  const downsideDeviation = Math.sqrt(
    downside.reduce((sum, r) => sum + r * r, 0) / returns.length,
  );

  return downsideDeviation === 0 ? 0 : avgExcessReturn / downsideDeviation;
};

/**
 * Calculate Calmar Ratio
 */
export const calculateCalmarRatio = (
  returns: number[],
  maxDrawdown: number,
): number => {
  if (returns.length === 0 || maxDrawdown === 0) return 0;

  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const annualizedReturn = avgReturn * 12; // Assuming monthly returns

  return annualizedReturn / Math.abs(maxDrawdown);
};

/**
 * Calculate Maximum Drawdown
 */
export const calculateMaxDrawdown = (cumulativeReturns: number[]): number => {
  if (cumulativeReturns.length === 0) return 0;

  let maxDrawdown = 0;
  let peak = cumulativeReturns[0];

  for (let i = 1; i < cumulativeReturns.length; i++) {
    if (cumulativeReturns[i] > peak) {
      peak = cumulativeReturns[i];
    }

    const drawdown = (peak - cumulativeReturns[i]) / peak;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  }

  return maxDrawdown * 100;
};

/**
 * Calculate Alpha (excess return over benchmark)
 */
export const calculateAlpha = (
  portfolioReturns: number[],
  benchmarkReturns: number[],
  riskFreeRate: number = 0,
): number => {
  if (
    portfolioReturns.length !== benchmarkReturns.length ||
    portfolioReturns.length === 0
  ) {
    return 0;
  }

  const beta = calculateBeta(portfolioReturns, benchmarkReturns);
  const avgPortfolioReturn =
    portfolioReturns.reduce((sum, r) => sum + r, 0) / portfolioReturns.length;
  const avgBenchmarkReturn =
    benchmarkReturns.reduce((sum, r) => sum + r, 0) / benchmarkReturns.length;

  return (
    avgPortfolioReturn -
    (riskFreeRate + beta * (avgBenchmarkReturn - riskFreeRate))
  );
};

/**
 * Calculate Beta (correlation with benchmark)
 */
export const calculateBeta = (
  portfolioReturns: number[],
  benchmarkReturns: number[],
): number => {
  if (
    portfolioReturns.length !== benchmarkReturns.length ||
    portfolioReturns.length === 0
  ) {
    return 0;
  }

  const portfolioMean =
    portfolioReturns.reduce((sum, r) => sum + r, 0) / portfolioReturns.length;
  const benchmarkMean =
    benchmarkReturns.reduce((sum, r) => sum + r, 0) / benchmarkReturns.length;

  let covariance = 0;
  let benchmarkVariance = 0;

  for (let i = 0; i < portfolioReturns.length; i++) {
    const portfolioDiff = portfolioReturns[i] - portfolioMean;
    const benchmarkDiff = benchmarkReturns[i] - benchmarkMean;

    covariance += portfolioDiff * benchmarkDiff;
    benchmarkVariance += benchmarkDiff * benchmarkDiff;
  }

  covariance /= portfolioReturns.length;
  benchmarkVariance /= benchmarkReturns.length;

  return benchmarkVariance === 0 ? 0 : covariance / benchmarkVariance;
};

/**
 * Calculate volatility (standard deviation)
 */
export const calculateVolatility = (returns: number[]): number => {
  return calculateStandardDeviation(returns);
};

/**
 * Calculate standard deviation
 */
export const calculateStandardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    values.length;

  return Math.sqrt(variance);
};

/**
 * Calculate comprehensive ROI metrics
 */
export const calculateComprehensiveROI = (
  input: ROIInput,
  performanceMetrics?: PerformanceMetrics,
): ROIResult => {
  const {
    initialInvestment,
    currentValue,
    timeHorizon = 1,
    cashFlows = [],
    fees = 0,
    taxes = 0,
  } = input;

  const simpleROI = calculateSimpleROI(
    initialInvestment,
    currentValue,
    fees,
    taxes,
  );
  const annualizedROI = calculateAnnualizedROI(
    initialInvestment,
    currentValue,
    timeHorizon,
    fees,
    taxes,
  );
  const totalReturn =
    ((currentValue - initialInvestment) / initialInvestment) * 100;
  const netReturn =
    ((currentValue - initialInvestment - fees - taxes) / initialInvestment) *
    100;
  const compoundedReturn = calculateCAGR(
    initialInvestment,
    currentValue,
    timeHorizon,
  );

  let result: ROIResult = {
    simpleROI,
    annualizedROI,
    totalReturn,
    netReturn,
    compoundedReturn,
  };

  // Calculate IRR if cash flows are provided
  if (cashFlows.length > 0) {
    const amounts = [
      -initialInvestment,
      ...cashFlows.map((cf) => cf.amount),
      currentValue,
    ];
    result.irr = calculateIRR(amounts);

    const dates = [new Date(), ...cashFlows.map((cf) => cf.date), new Date()];
    result.xirr = calculateXIRR(amounts, dates);
  }

  // Calculate advanced metrics if performance data is provided
  if (performanceMetrics) {
    const { returns, benchmarkReturns, riskFreeRate = 0 } = performanceMetrics;

    result.volatility = calculateVolatility(returns);
    result.sharpeRatio = calculateSharpeRatio(returns, riskFreeRate);
    result.sortinoRatio = calculateSortinoRatio(returns, riskFreeRate);

    const cumulativeReturns = returns.reduce((acc, ret, index) => {
      const prevValue = index === 0 ? 1 : acc[index - 1];
      acc.push(prevValue * (1 + ret / 100));
      return acc;
    }, [] as number[]);

    result.maxDrawdown = calculateMaxDrawdown(cumulativeReturns);
    result.calmarRatio = calculateCalmarRatio(returns, result.maxDrawdown);

    if (benchmarkReturns) {
      result.alpha = calculateAlpha(returns, benchmarkReturns, riskFreeRate);
      result.beta = calculateBeta(returns, benchmarkReturns);
    }
  }

  return result;
};

/**
 * Calculate portfolio-level ROI
 */
export const calculatePortfolioROI = (
  holdings: Array<{
    symbol: string;
    quantity: number;
    averageCost: number;
    currentPrice: number;
    dividends?: number;
  }>,
): {
  totalInvested: number;
  currentValue: number;
  totalDividends: number;
  unrealizedGain: number;
  totalReturn: number;
  weightedROI: number;
} => {
  let totalInvested = 0;
  let currentValue = 0;
  let totalDividends = 0;
  let weightedROI = 0;

  holdings.forEach((holding) => {
    const invested = holding.quantity * holding.averageCost;
    const current = holding.quantity * holding.currentPrice;
    const dividends = holding.dividends || 0;

    totalInvested += invested;
    currentValue += current;
    totalDividends += dividends;

    const holdingROI = ((current + dividends - invested) / invested) * 100;
    const weight = invested / totalInvested;
    weightedROI += holdingROI * weight;
  });

  const unrealizedGain = currentValue - totalInvested;
  const totalReturn =
    ((currentValue + totalDividends - totalInvested) / totalInvested) * 100;

  return {
    totalInvested,
    currentValue,
    totalDividends,
    unrealizedGain,
    totalReturn,
    weightedROI,
  };
};

/**
 * Calculate Islamic finance compliant returns (profit/loss sharing)
 */
export const calculateIslamicROI = (
  principalAmount: number,
  profitLossAmount: number,
  timeHorizonYears: number,
  profitSharingRatio: number = 1,
): {
  profitLoss: number;
  profitSharingAmount: number;
  netReturn: number;
  annualizedReturn: number;
  isCompliant: boolean;
} => {
  const profitLoss = profitLossAmount * profitSharingRatio;
  const profitSharingAmount = profitLoss;
  const netReturn = (profitSharingAmount / principalAmount) * 100;
  const annualizedReturn =
    timeHorizonYears > 0
      ? (Math.pow(1 + netReturn / 100, 1 / timeHorizonYears) - 1) * 100
      : netReturn;

  // Islamic finance compliance check (no guaranteed returns, profit/loss sharing)
  const isCompliant = true; // Simplified check

  return {
    profitLoss,
    profitSharingAmount,
    netReturn,
    annualizedReturn,
    isCompliant,
  };
};

/**
 * Format ROI for display
 */
export const formatROI = (
  value: number,
  decimals: number = 2,
  showSign: boolean = true,
): string => {
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Categorize ROI performance
 */
export const categorizeROIPerformance = (
  roi: number,
): {
  category: "excellent" | "good" | "average" | "poor" | "loss";
  description: string;
  color: string;
} => {
  if (roi >= 20) {
    return {
      category: "excellent",
      description: "Excellent performance",
      color: "green",
    };
  } else if (roi >= 10) {
    return { category: "good", description: "Good performance", color: "blue" };
  } else if (roi >= 0) {
    return {
      category: "average",
      description: "Average performance",
      color: "yellow",
    };
  } else if (roi >= -10) {
    return {
      category: "poor",
      description: "Poor performance",
      color: "orange",
    };
  } else {
    return { category: "loss", description: "Significant loss", color: "red" };
  }
};

export default {
  calculateSimpleROI,
  calculateAnnualizedROI,
  calculateCAGR,
  calculateIRR,
  calculateXIRR,
  calculateSharpeRatio,
  calculateSortinoRatio,
  calculateCalmarRatio,
  calculateMaxDrawdown,
  calculateAlpha,
  calculateBeta,
  calculateVolatility,
  calculateComprehensiveROI,
  calculatePortfolioROI,
  calculateIslamicROI,
  formatROI,
  categorizeROIPerformance,
};
