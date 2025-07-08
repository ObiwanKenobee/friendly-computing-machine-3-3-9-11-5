export interface PerpetualFund {
  id: string;
  name: string;
  description: string;
  strategy: FundStrategy;
  aum: number;
  nav: number;
  inception: Date;
  performance: FundPerformance;
  fees: FeeStructure;
  allocations: AssetAllocation[];
  subscriptions: Subscription[];
  redemptions: Redemption[];
  distributions: Distribution[];
  governance: GovernanceStructure;
  compliance: FundCompliance;
  metadata: FundMetadata;
}

export interface FundStrategy {
  type: "growth" | "value" | "income" | "balanced" | "alternative" | "thematic";
  objective: string;
  benchmark: string;
  investmentUniverse: string[];
  constraints: InvestmentConstraint[];
  rebalancingFrequency: string;
  culturalScreening: boolean;
  esgIntegration: boolean;
}

export interface InvestmentConstraint {
  type: "sector" | "geography" | "market-cap" | "rating" | "liquidity";
  parameter: string;
  limit: number;
  description: string;
}

export interface FundPerformance {
  returns: ReturnMetric[];
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  alpha: number;
  beta: number;
  informationRatio: number;
  trackingError: number;
  winRate: number;
}

export interface ReturnMetric {
  period: "mtd" | "qtd" | "ytd" | "1y" | "3y" | "5y" | "inception";
  gross: number;
  net: number;
  benchmark: number;
  excess: number;
}

export interface FeeStructure {
  managementFee: number;
  performanceFee: number;
  highWaterMark: boolean;
  hurdleRate?: number;
  entryFee?: number;
  exitFee?: number;
  adminFee?: number;
}

export interface AssetAllocation {
  asset: string;
  weight: number;
  targetWeight: number;
  value: number;
  quantity: number;
  sector: string;
  geography: string;
  currency: string;
  lastRebalanced: Date;
}

export interface Subscription {
  id: string;
  investorId: string;
  amount: number;
  units: number;
  pricePerUnit: number;
  settlementDate: Date;
  status: "pending" | "settled" | "failed";
  type: "initial" | "additional";
}

export interface Redemption {
  id: string;
  investorId: string;
  units: number;
  amount: number;
  pricePerUnit: number;
  requestDate: Date;
  settlementDate: Date;
  status: "pending" | "settled" | "failed";
  type: "partial" | "full";
}

export interface Distribution {
  id: string;
  type: "dividend" | "capital-gain" | "return-of-capital";
  amount: number;
  perUnit: number;
  exDate: Date;
  payDate: Date;
  currency: string;
  taxable: boolean;
}

export interface GovernanceStructure {
  manager: string;
  administrator: string;
  custodian: string;
  auditor: string;
  boardMembers: BoardMember[];
  votingRights: VotingRights[];
  reportingFrequency: string;
}

export interface BoardMember {
  name: string;
  role: string;
  independent: boolean;
  tenure: number;
}

export interface VotingRights {
  type: string;
  threshold: number;
  quorum: number;
  description: string;
}

export interface FundCompliance {
  regulatory: string[];
  licences: string[];
  auditDate: Date;
  nextAudit: Date;
  restrictions: string[];
  monitoring: ComplianceCheck[];
}

export interface ComplianceCheck {
  rule: string;
  status: "compliant" | "breach" | "warning";
  lastChecked: Date;
  nextCheck: Date;
}

export interface FundMetadata {
  domicile: string;
  baseCurrency: string;
  minimumInvestment: number;
  dealingFrequency: string;
  noticePeriod: number;
  settlementPeriod: number;
  isin?: string;
  bloomberg?: string;
  website?: string;
  factSheet?: string;
}

export interface MicroFund extends Omit<PerpetualFund, "minimumInvestment"> {
  minimumInvestment: number;
  microStrategy: MicroStrategy;
  socialImpact: SocialImpactMetrics;
}

export interface MicroStrategy {
  theme: string;
  impactGoals: string[];
  communityFocus: boolean;
  localCurrency: boolean;
  educationalComponent: boolean;
}

export interface SocialImpactMetrics {
  sdgAlignment: string[];
  beneficiaries: number;
  impactReports: string[];
  carbonFootprint: number;
  socialReturn: number;
}
