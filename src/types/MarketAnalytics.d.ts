export interface CountryMetrics {
  name: string;
  code: string;
  population: number;
  gdp: number;
  gdpPerCapita: number;
  currency: string;
  exchangeRate: number;
  marketSize: "Small" | "Medium" | "Large";
  penetrationRate: number;
  competitionLevel: "Low" | "Medium" | "High" | "Very High";
  regulatoryScore: number; // 1-10 scale
  opportunityScore: number; // 1-10 scale
  keyStrengths: string[];
  challenges: string[];
}

export interface RegionData {
  name: string;
  countries: string[];
  population: number;
  gdp: number;
  marketPotential: "Low" | "Medium" | "High" | "Very High";
  keyOpportunities: string[];
  averageARPU: number;
  marketMaturity:
    | "Early"
    | "Developing"
    | "Emerging"
    | "Established"
    | "Mature";
}

export interface AfricanMarketData {
  overview: {
    totalPopulation: number;
    gdpTotal: number;
    averageGdpPerCapita: number;
    internetPenetration: number;
    mobilePenetration: number;
    financialInclusion: number;
    urbanizationRate: number;
  };
  regions: {
    northAfrica: RegionData;
    westAfrica: RegionData;
    eastAfrica: RegionData;
    centralAfrica: RegionData;
    southernAfrica: RegionData;
  };
  topCountries: CountryMetrics[];
}

export interface GlobalRegion {
  name: string;
  totalMarketSize: number;
  averageARPU: number;
  growthRate: number;
  penetrationRate: number;
  competitionIndex: number;
  opportunityScore: number;
  keyAdvantages: string[];
  marketPosition: string;
}

export interface GlobalMarketComparison {
  regions: GlobalRegion[];
  marketSizeTrends: {
    historical: Array<{ year: number; africa: number; global: number }>;
    projected: Array<{ year: number; africa: number; global: number }>;
  };
  competitivePositioning: {
    marketShare: { africa: number; competitors: number };
    growthRate: { africa: number; competitors: number };
    customerSatisfaction: { africa: number; competitors: number };
    innovationIndex: { africa: number; competitors: number };
  };
}

export interface PricingTier {
  name: string;
  price: number;
  features: string[];
}

export interface RegionalPricing {
  strategy: string;
  basePrice: number;
  localizedPricing: boolean;
  freemiumTier: boolean;
  paymentMethods: string[];
  pricingTiers: PricingTier[];
}

export interface PricingStrategy {
  globalStrategy: {
    approach: string;
    factors: string[];
    principles: string[];
  };
  regionalPricing: {
    africa: RegionalPricing;
    global: RegionalPricing;
  };
  marketSpecificAdjustments: {
    currencyVolatility: string;
    competitiveResponse: string;
    regulatoryCompliance: string;
    economicConditions: string;
  };
  revenueProjections: {
    year1: { africa: number; global: number; total: number };
    year2: { africa: number; global: number; total: number };
    year3: { africa: number; global: number; total: number };
    year5: { africa: number; global: number; total: number };
  };
}

export interface RegionalRevOpsMetrics {
  revenue: number;
  customers: number;
  arpu: number;
  growthRate: number;
  churnRate: number;
  cac: number;
  ltv: number;
  marketShare: number;
}

export interface RevOpsMetrics {
  overview: {
    totalRevenue: number;
    growthRate: number;
    customerCount: number;
    averageARPU: number;
    churnRate: number;
    ltv: number;
    cac: number;
    ltvCacRatio: number;
    grossMargin: number;
    burnRate: number;
    runwayMonths: number;
  };
  regionalBreakdown: {
    africa: RegionalRevOpsMetrics;
    northAmerica: RegionalRevOpsMetrics;
    europe: RegionalRevOpsMetrics;
    asiaPacific: RegionalRevOpsMetrics;
    latam: RegionalRevOpsMetrics;
  };
  salesMetrics: {
    pipelineValue: number;
    conversionRate: number;
    averageDealSize: number;
    salesCycleLength: number;
    quotaAttainment: number;
    newMRR: number;
    expansionMRR: number;
    contractionMRR: number;
    churnMRR: number;
    netMRR: number;
  };
  customerSuccess: {
    nps: number;
    csat: number;
    firstValueTime: number;
    activationRate: number;
    featureAdoption: number;
    supportTickets: number;
    resolutionTime: number;
    escalationRate: number;
  };
  operationalEfficiency: {
    salesEfficiency: number;
    marketingROI: number;
    customerSupport: number;
    productDevelopment: number;
    complianceScore: number;
    systemUptime: number;
    apiLatency: number;
    dataAccuracy: number;
  };
  forecasting: {
    nextQuarter: {
      revenue: number;
      customers: number;
      growthRate: number;
    };
    nextYear: {
      revenue: number;
      customers: number;
      growthRate: number;
    };
    confidenceLevel: number;
    riskFactors: string[];
  };
}

export interface MarketOpportunity {
  id: string;
  title: string;
  description: string;
  region: string;
  marketSize: number;
  timeframe: string;
  investmentRequired: number;
  projectedRevenue: number;
  riskLevel: "Low" | "Medium" | "High";
  successProbability: number;
  keyFactors: string[];
  competitiveAdvantage: string;
}

export interface MarketInsight {
  type: "opportunity" | "risk" | "trend";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  impact: number;
  timeframe: string;
  actionItems: string[];
}

export interface CompetitiveAnalysis {
  competitor: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  threatLevel: "Low" | "Medium" | "High";
  strategy: string;
}

export interface MarketForecast {
  period: string;
  revenue: number;
  customers: number;
  marketShare: number;
  confidence: number;
  assumptions: string[];
  risks: string[];
}
