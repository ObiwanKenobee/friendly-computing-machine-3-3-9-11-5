import {
  AfricanMarketData,
  GlobalMarketComparison,
  PricingStrategy,
  RevOpsMetrics,
  CountryMetrics,
  MarketOpportunity,
} from "../types/MarketAnalytics";

export class MarketAnalyticsService {
  private static instance: MarketAnalyticsService;

  public static getInstance(): MarketAnalyticsService {
    if (!MarketAnalyticsService.instance) {
      MarketAnalyticsService.instance = new MarketAnalyticsService();
    }
    return MarketAnalyticsService.instance;
  }

  async getAfricanMarketData(): Promise<AfricanMarketData> {
    // Simulate API call with comprehensive African market data
    return {
      overview: {
        totalPopulation: 1400000000,
        gdpTotal: 2800000000000, // $2.8T
        averageGdpPerCapita: 2000,
        internetPenetration: 43.2,
        mobilePenetration: 88.4,
        financialInclusion: 34.8,
        urbanizationRate: 42.5,
      },
      regions: {
        northAfrica: {
          name: "North Africa",
          countries: [
            "Egypt",
            "Libya",
            "Tunisia",
            "Algeria",
            "Morocco",
            "Sudan",
          ],
          population: 250000000,
          gdp: 850000000000,
          marketPotential: "High",
          keyOpportunities: [
            "Digital banking",
            "Islamic finance",
            "Cross-border payments",
          ],
          averageARPU: 45,
          marketMaturity: "Emerging",
        },
        westAfrica: {
          name: "West Africa",
          countries: [
            "Nigeria",
            "Ghana",
            "Senegal",
            "Mali",
            "Burkina Faso",
            "Ivory Coast",
          ],
          population: 420000000,
          gdp: 720000000000,
          marketPotential: "Very High",
          keyOpportunities: [
            "Mobile money",
            "SME lending",
            "Agricultural finance",
          ],
          averageARPU: 32,
          marketMaturity: "Developing",
        },
        eastAfrica: {
          name: "East Africa",
          countries: ["Kenya", "Tanzania", "Uganda", "Rwanda", "Ethiopia"],
          population: 290000000,
          gdp: 380000000000,
          marketPotential: "High",
          keyOpportunities: [
            "M-Pesa ecosystem",
            "Digital identity",
            "Climate finance",
          ],
          averageARPU: 28,
          marketMaturity: "Emerging",
        },
        centralAfrica: {
          name: "Central Africa",
          countries: ["DRC", "Cameroon", "Chad", "CAR", "Congo"],
          population: 185000000,
          gdp: 190000000000,
          marketPotential: "Medium",
          keyOpportunities: [
            "Resource financing",
            "Infrastructure investment",
            "Diaspora remittances",
          ],
          averageARPU: 18,
          marketMaturity: "Early",
        },
        southernAfrica: {
          name: "Southern Africa",
          countries: [
            "South Africa",
            "Zimbabwe",
            "Botswana",
            "Namibia",
            "Zambia",
          ],
          population: 255000000,
          gdp: 660000000000,
          marketPotential: "High",
          keyOpportunities: [
            "Institutional investment",
            "Pension funds",
            "ESG investing",
          ],
          averageARPU: 52,
          marketMaturity: "Established",
        },
      },
      topCountries: [
        {
          name: "Nigeria",
          code: "NG",
          population: 218000000,
          gdp: 440000000000,
          gdpPerCapita: 2020,
          currency: "NGN",
          exchangeRate: 1650,
          marketSize: "Large",
          penetrationRate: 34.5,
          competitionLevel: "High",
          regulatoryScore: 6.2,
          opportunityScore: 9.1,
          keyStrengths: [
            "Largest population",
            "Oil economy",
            "Tech hub (Lagos)",
          ],
          challenges: [
            "Currency volatility",
            "Regulatory uncertainty",
            "Infrastructure gaps",
          ],
        },
        {
          name: "South Africa",
          code: "ZA",
          population: 60000000,
          gdp: 420000000000,
          gdpPerCapita: 7000,
          currency: "ZAR",
          exchangeRate: 18.5,
          marketSize: "Large",
          penetrationRate: 68.2,
          competitionLevel: "Very High",
          regulatoryScore: 8.1,
          opportunityScore: 7.8,
          keyStrengths: [
            "Developed financial sector",
            "Strong institutions",
            "Regional hub",
          ],
          challenges: [
            "Economic inequality",
            "Political instability",
            "High unemployment",
          ],
        },
        {
          name: "Kenya",
          code: "KE",
          population: 54000000,
          gdp: 110000000000,
          gdpPerCapita: 2040,
          currency: "KES",
          exchangeRate: 150,
          marketSize: "Medium",
          penetrationRate: 45.8,
          competitionLevel: "Medium",
          regulatoryScore: 7.5,
          opportunityScore: 8.9,
          keyStrengths: [
            "M-Pesa innovation",
            "Tech ecosystem",
            "Favorable regulations",
          ],
          challenges: [
            "Limited market size",
            "Infrastructure needs",
            "Regional risks",
          ],
        },
        {
          name: "Egypt",
          code: "EG",
          population: 104000000,
          gdp: 480000000000,
          gdpPerCapita: 4620,
          currency: "EGP",
          exchangeRate: 30.8,
          marketSize: "Large",
          penetrationRate: 52.1,
          competitionLevel: "Medium",
          regulatoryScore: 6.8,
          opportunityScore: 8.2,
          keyStrengths: [
            "Large population",
            "Strategic location",
            "Government support",
          ],
          challenges: [
            "Economic reforms",
            "Currency pressure",
            "Regional instability",
          ],
        },
        {
          name: "Ghana",
          code: "GH",
          population: 32000000,
          gdp: 75000000000,
          gdpPerCapita: 2340,
          currency: "GHS",
          exchangeRate: 12.1,
          marketSize: "Medium",
          penetrationRate: 38.4,
          competitionLevel: "Medium",
          regulatoryScore: 7.8,
          opportunityScore: 8.5,
          keyStrengths: [
            "Political stability",
            "English speaking",
            "Growing middle class",
          ],
          challenges: [
            "Debt sustainability",
            "Limited market size",
            "Infrastructure gaps",
          ],
        },
      ],
    };
  }

  async getGlobalMarketComparison(): Promise<GlobalMarketComparison> {
    return {
      regions: [
        {
          name: "Africa",
          totalMarketSize: 2800000000000,
          averageARPU: 35,
          growthRate: 8.2,
          penetrationRate: 43.2,
          competitionIndex: 5.8,
          opportunityScore: 8.4,
          keyAdvantages: [
            "High growth potential",
            "Young demographics",
            "Mobile-first adoption",
          ],
          marketPosition: "Emerging High-Growth",
        },
        {
          name: "Asia-Pacific",
          totalMarketSize: 12500000000000,
          averageARPU: 85,
          growthRate: 6.1,
          penetrationRate: 67.4,
          competitionIndex: 8.9,
          opportunityScore: 7.1,
          keyAdvantages: [
            "Large established markets",
            "High technology adoption",
            "Regulatory maturity",
          ],
          marketPosition: "Established Competitive",
        },
        {
          name: "Europe",
          totalMarketSize: 8900000000000,
          averageARPU: 125,
          growthRate: 2.8,
          penetrationRate: 85.2,
          competitionIndex: 9.4,
          opportunityScore: 5.2,
          keyAdvantages: [
            "High ARPU",
            "Regulatory clarity",
            "Institutional adoption",
          ],
          marketPosition: "Mature Saturated",
        },
        {
          name: "North America",
          totalMarketSize: 15200000000000,
          averageARPU: 180,
          growthRate: 3.4,
          penetrationRate: 92.1,
          competitionIndex: 9.8,
          opportunityScore: 4.8,
          keyAdvantages: [
            "Highest ARPU",
            "Innovation hub",
            "Capital availability",
          ],
          marketPosition: "Mature Premium",
        },
        {
          name: "Latin America",
          totalMarketSize: 3200000000000,
          averageARPU: 58,
          growthRate: 5.7,
          penetrationRate: 54.8,
          competitionIndex: 6.7,
          opportunityScore: 7.3,
          keyAdvantages: [
            "Growing middle class",
            "Regulatory improvements",
            "Digital adoption",
          ],
          marketPosition: "Emerging Moderate-Growth",
        },
      ],
      marketSizeTrends: {
        historical: [
          { year: 2020, africa: 1800, global: 28500 },
          { year: 2021, africa: 2100, global: 31200 },
          { year: 2022, africa: 2400, global: 34800 },
          { year: 2023, africa: 2800, global: 38900 },
        ],
        projected: [
          { year: 2024, africa: 3300, global: 43200 },
          { year: 2025, africa: 3900, global: 48100 },
          { year: 2026, africa: 4600, global: 53800 },
          { year: 2027, africa: 5500, global: 60200 },
        ],
      },
      competitivePositioning: {
        marketShare: { africa: 7.2, competitors: 92.8 },
        growthRate: { africa: 8.2, competitors: 4.1 },
        customerSatisfaction: { africa: 78, competitors: 72 },
        innovationIndex: { africa: 6.8, competitors: 7.4 },
      },
    };
  }

  async getPricingStrategy(): Promise<PricingStrategy> {
    return {
      globalStrategy: {
        approach: "Market-Adaptive Pricing",
        factors: [
          "Local purchasing power",
          "Competitive landscape",
          "Regulatory environment",
          "Market maturity",
        ],
        principles: [
          "Value-based pricing",
          "Accessibility focus",
          "Growth optimization",
          "Cultural sensitivity",
        ],
      },
      regionalPricing: {
        africa: {
          strategy: "Penetration Pricing",
          basePrice: 15, // USD monthly
          localizedPricing: true,
          freemiumTier: true,
          paymentMethods: [
            "Mobile money",
            "Bank transfer",
            "Cryptocurrency",
            "Cash agents",
          ],
          pricingTiers: [
            {
              name: "Basic",
              price: 5,
              features: ["Portfolio tracking", "Basic analytics", "Mobile app"],
            },
            {
              name: "Standard",
              price: 15,
              features: [
                "AI recommendations",
                "Multi-currency",
                "Community features",
              ],
            },
            {
              name: "Premium",
              price: 35,
              features: [
                "Advanced analytics",
                "Professional tools",
                "Priority support",
              ],
            },
            {
              name: "Enterprise",
              price: 150,
              features: [
                "Institutional features",
                "API access",
                "Custom integration",
              ],
            },
          ],
        },
        global: {
          strategy: "Value-Based Pricing",
          basePrice: 50, // USD monthly
          localizedPricing: true,
          freemiumTier: false,
          paymentMethods: [
            "Credit card",
            "Bank transfer",
            "Digital wallets",
            "Cryptocurrency",
          ],
          pricingTiers: [
            {
              name: "Professional",
              price: 50,
              features: [
                "Full platform access",
                "Advanced analytics",
                "Priority support",
              ],
            },
            {
              name: "Institutional",
              price: 200,
              features: [
                "Enterprise features",
                "API access",
                "Custom solutions",
              ],
            },
            {
              name: "Enterprise",
              price: 500,
              features: [
                "White-label solutions",
                "Dedicated support",
                "Custom development",
              ],
            },
          ],
        },
      },
      marketSpecificAdjustments: {
        currencyVolatility: "Dynamic pricing with currency hedging",
        competitiveResponse: "Real-time competitive monitoring and adjustment",
        regulatoryCompliance: "Jurisdiction-specific pricing models",
        economicConditions: "Recession-proof tiered pricing",
      },
      revenueProjections: {
        year1: { africa: 2500000, global: 15000000, total: 17500000 },
        year2: { africa: 8500000, global: 35000000, total: 43500000 },
        year3: { africa: 22000000, global: 75000000, total: 97000000 },
        year5: { africa: 85000000, global: 220000000, total: 305000000 },
      },
    };
  }

  async getRevOpsMetrics(): Promise<RevOpsMetrics> {
    return {
      overview: {
        totalRevenue: 45000000, // $45M ARR
        growthRate: 156.7, // % YoY
        customerCount: 125000,
        averageARPU: 360, // Annual
        churnRate: 8.4,
        ltv: 2850,
        cac: 185,
        ltvCacRatio: 15.4,
        grossMargin: 87.2,
        burnRate: 2800000, // Monthly
        runwayMonths: 18,
      },
      regionalBreakdown: {
        africa: {
          revenue: 8500000,
          customers: 45000,
          arpu: 189,
          growthRate: 245.8,
          churnRate: 6.2,
          cac: 95,
          ltv: 1850,
          marketShare: 3.2,
        },
        northAmerica: {
          revenue: 18500000,
          customers: 25000,
          arpu: 740,
          growthRate: 128.4,
          churnRate: 5.8,
          cac: 285,
          ltv: 4250,
          marketShare: 0.8,
        },
        europe: {
          revenue: 12000000,
          customers: 32000,
          arpu: 375,
          growthRate: 142.1,
          churnRate: 7.1,
          cac: 195,
          ltv: 2680,
          marketShare: 1.2,
        },
        asiaPacific: {
          revenue: 4500000,
          customers: 18000,
          arpu: 250,
          growthRate: 189.3,
          churnRate: 9.8,
          cac: 145,
          ltv: 1950,
          marketShare: 0.4,
        },
        latam: {
          revenue: 1500000,
          customers: 5000,
          arpu: 300,
          growthRate: 267.4,
          churnRate: 12.1,
          cac: 125,
          ltv: 1650,
          marketShare: 0.6,
        },
      },
      salesMetrics: {
        pipelineValue: 75000000,
        conversionRate: 24.8,
        averageDealSize: 2850,
        salesCycleLength: 45, // days
        quotaAttainment: 118.6,
        newMRR: 2100000,
        expansionMRR: 850000,
        contractionMRR: 180000,
        churnMRR: 320000,
        netMRR: 2450000,
      },
      customerSuccess: {
        nps: 72,
        csat: 8.6,
        firstValueTime: 7, // days
        activationRate: 78.4,
        featureAdoption: 65.2,
        supportTickets: 1250,
        resolutionTime: 4.2, // hours
        escalationRate: 2.8,
      },
      operationalEfficiency: {
        salesEfficiency: 3.2, // Revenue per sales rep
        marketingROI: 4.8,
        customerSupport: 95.6, // % first contact resolution
        productDevelopment: 87.3, // % on-time delivery
        complianceScore: 96.8,
        systemUptime: 99.94,
        apiLatency: 145, // ms
        dataAccuracy: 98.7,
      },
      forecasting: {
        nextQuarter: {
          revenue: 13500000,
          customers: 156000,
          growthRate: 42.3,
        },
        nextYear: {
          revenue: 125000000,
          customers: 450000,
          growthRate: 178.2,
        },
        confidenceLevel: 87.4,
        riskFactors: [
          "Market competition",
          "Regulatory changes",
          "Economic downturns",
          "Technology disruption",
        ],
      },
    };
  }

  async getMarketOpportunities(): Promise<MarketOpportunity[]> {
    return [
      {
        id: "african-mobile-banking",
        title: "African Mobile Banking Expansion",
        description: "Leverage mobile-first approach for unbanked populations",
        region: "Africa",
        marketSize: 850000000,
        timeframe: "6-12 months",
        investmentRequired: 5000000,
        projectedRevenue: 25000000,
        riskLevel: "Medium",
        successProbability: 78.5,
        keyFactors: [
          "Mobile penetration growth",
          "Regulatory support",
          "Local partnerships",
        ],
        competitiveAdvantage: "Cultural sensitivity and local expertise",
      },
      {
        id: "islamic-finance-integration",
        title: "Islamic Finance Product Suite",
        description:
          "Sharia-compliant investment products for MENA and global Muslim populations",
        region: "Global",
        marketSize: 3200000000,
        timeframe: "9-15 months",
        investmentRequired: 8000000,
        projectedRevenue: 45000000,
        riskLevel: "Low",
        successProbability: 85.2,
        keyFactors: [
          "Religious certification",
          "Scholar endorsement",
          "Community trust",
        ],
        competitiveAdvantage:
          "First-mover advantage in AI-driven Islamic finance",
      },
      {
        id: "institutional-africa",
        title: "African Institutional Investment Platform",
        description: "Sovereign wealth funds and pension fund solutions",
        region: "Africa",
        marketSize: 1200000000,
        timeframe: "12-18 months",
        investmentRequired: 12000000,
        projectedRevenue: 65000000,
        riskLevel: "High",
        successProbability: 68.9,
        keyFactors: [
          "Government relationships",
          "Regulatory compliance",
          "Scale requirements",
        ],
        competitiveAdvantage:
          "Quantum identity security and cultural framework",
      },
    ];
  }

  calculateMarketPenetrationPotential(
    country: string,
    currentPenetration: number,
  ): number {
    const baseFactors = {
      internetGrowth: 15.2,
      mobilePenetration: 12.8,
      economicGrowth: 8.5,
      youthDemographics: 18.4,
      urbanization: 6.7,
    };

    const countryMultipliers: { [key: string]: number } = {
      Nigeria: 1.8,
      Kenya: 1.6,
      "South Africa": 1.2,
      Ghana: 1.5,
      Egypt: 1.4,
      Morocco: 1.3,
      Ethiopia: 1.7,
      Tanzania: 1.5,
    };

    const multiplier = countryMultipliers[country] || 1.0;
    const growthPotential =
      Object.values(baseFactors).reduce((sum, factor) => sum + factor, 0) / 5;
    const maxPenetration = Math.min(
      85,
      currentPenetration + growthPotential * multiplier,
    );

    return Math.round(maxPenetration * 10) / 10;
  }

  formatCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  formatLargeNumber(num: number): string {
    if (num >= 1e9) {
      return `${(num / 1e9).toFixed(1)}B`;
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(1)}M`;
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(1)}K`;
    }
    return num.toString();
  }
}

// Export singleton instance for use throughout the application
export const marketAnalyticsService = MarketAnalyticsService.getInstance();

// Export the class for manual instantiation when needed
export default MarketAnalyticsService;
