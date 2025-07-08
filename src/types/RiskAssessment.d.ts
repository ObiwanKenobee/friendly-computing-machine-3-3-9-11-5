export interface RiskAssessment {
  id: string;
  userId: string;
  portfolioId: string;
  overallRiskScore: number;
  riskGrade: "A" | "B" | "C" | "D" | "F";
  assessmentDate: Date;
  factors: RiskFactor[];
  metrics: RiskMetrics;
  recommendations: RiskRecommendation[];
  scenario: ScenarioAnalysis;
  compliance: ComplianceRisk;
}

export interface RiskFactor {
  name: string;
  category:
    | "market"
    | "credit"
    | "liquidity"
    | "operational"
    | "regulatory"
    | "concentration";
  score: number;
  weight: number;
  description: string;
  impact: "high" | "medium" | "low";
  mitigation: string[];
}

export interface RiskMetrics {
  valueAtRisk: VaRMetric;
  expectedShortfall: number;
  maximumDrawdown: number;
  volatility: VolatilityMetric;
  beta: number;
  correlation: CorrelationMatrix;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
}

export interface VaRMetric {
  oneDay: number;
  oneWeek: number;
  oneMonth: number;
  confidenceLevel: number;
  methodology: "historical" | "parametric" | "monte-carlo";
}

export interface VolatilityMetric {
  realized: number;
  implied: number;
  garch: number;
  period: number;
  annualized: boolean;
}

export interface CorrelationMatrix {
  [assetPair: string]: number;
}

export interface RiskRecommendation {
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
  cost: number;
  timeframe: string;
}

export interface ScenarioAnalysis {
  scenarios: Scenario[];
  stressTesting: StressTest[];
  monteCarlo: MonteCarloResult;
}

export interface Scenario {
  name: string;
  description: string;
  probability: number;
  portfolioImpact: number;
  duration: number;
  recovery: number;
  factors: ScenarioFactor[];
}

export interface ScenarioFactor {
  asset: string;
  shock: number;
  timeframe: string;
}

export interface StressTest {
  name: string;
  type: "historical" | "hypothetical" | "regulatory";
  portfolioLoss: number;
  worstAsset: string;
  timeToRecover: number;
  date: Date;
}

export interface MonteCarloResult {
  simulations: number;
  timeHorizon: number;
  outcomes: ProbabilityOutcome[];
  percentiles: Record<string, number>;
  shortfallProbability: number;
}

export interface ProbabilityOutcome {
  return: number;
  probability: number;
}

export interface ComplianceRisk {
  score: number;
  violations: ComplianceViolation[];
  monitoring: ComplianceMonitoring[];
}

export interface ComplianceViolation {
  rule: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  remediation: string;
  deadline?: Date;
}

export interface ComplianceMonitoring {
  metric: string;
  threshold: number;
  current: number;
  status: "compliant" | "warning" | "violation";
  frequency: string;
}
