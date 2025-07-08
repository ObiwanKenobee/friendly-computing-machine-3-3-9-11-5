export interface TokenizedAsset {
  id: string;
  name: string;
  symbol: string;
  description: string;
  assetType:
    | "real-estate"
    | "commodity"
    | "art"
    | "collectible"
    | "business"
    | "crypto";
  totalSupply: number;
  availableSupply: number;
  pricePerToken: number;
  currency: string;
  minInvestment: number;
  contractAddress: string;
  blockchain: string;
  images: string[];
  documents: string[];
  metadata: AssetMetadata;
  performance: AssetPerformance;
  compliance: ComplianceInfo;
  tokenomics: Tokenomics;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetMetadata {
  location?: {
    address: string;
    coordinates: [number, number];
    country: string;
  };
  physicalAttributes?: Record<string, any>;
  valuation: {
    method: string;
    date: Date;
    value: number;
    assessor: string;
  };
  legalStructure: string;
  custodian?: string;
  insurance?: {
    provider: string;
    coverage: number;
    policy: string;
  };
}

export interface AssetPerformance {
  historicalPrices: PricePoint[];
  dividends: Dividend[];
  appreciation: number;
  totalReturn: number;
  volatility: number;
  liquidity: {
    averageDailyVolume: number;
    bidAskSpread: number;
  };
}

export interface PricePoint {
  date: Date;
  price: number;
  volume: number;
}

export interface Dividend {
  date: Date;
  amount: number;
  type: "cash" | "token" | "yield";
}

export interface ComplianceInfo {
  kycRequired: boolean;
  accreditedOnly: boolean;
  jurisdictionRestrictions: string[];
  regulatoryFramework: string;
  auditReports: string[];
  certifications: string[];
}

export interface Tokenomics {
  distributionSchedule: DistributionEvent[];
  lockupPeriods: LockupPeriod[];
  governanceRights: boolean;
  votingWeight: number;
  redemptionRights: boolean;
  transferRestrictions: string[];
}

export interface DistributionEvent {
  date: Date;
  amount: number;
  reason: string;
}

export interface LockupPeriod {
  startDate: Date;
  endDate: Date;
  percentage: number;
  reason: string;
}

export interface TokenHolding {
  assetId: string;
  userId: string;
  quantity: number;
  averageCost: number;
  currentValue: number;
  unrealizedGainLoss: number;
  purchaseDate: Date;
  lastUpdated: Date;
}
