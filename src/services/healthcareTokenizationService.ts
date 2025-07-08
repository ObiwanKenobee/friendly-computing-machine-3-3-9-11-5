import { realTimeDataSyncSystem } from "./realTimeDataSyncSystem";
import { conversationalIntelligenceService } from "./conversationalIntelligenceService";

export interface HealthcareAsset {
  id: string;
  name: string;
  tokenSymbol: string;
  currentPrice: number;
  priceHistory: Array<{ timestamp: number; price: number }>;
  roi24h: number;
  roi7d: number;
  roi30d: number;
  marketCap: number;
  volume24h: number;
  description: string;
  riskLevel: "low" | "medium" | "high";
  geography: string;
  sector:
    | "pharmaceuticals"
    | "medical_devices"
    | "telemedicine"
    | "health_insurance"
    | "biotechnology";
  impactMetrics: {
    patientsServed: number;
    facilitiesSupported: number;
    treatmentsProvided: number;
    accessibilityImprovement: number;
  };
  aiInsights: {
    prediction: "bullish" | "bearish" | "neutral";
    confidence: number;
    reasoning: string;
    localizedExplanation: string;
  };
}

export interface PortfolioHealthcareAsset extends HealthcareAsset {
  holdingAmount: number;
  investmentValue: number;
  unrealizedGains: number;
  percentageOfPortfolio: number;
  entryPrice: number;
  entryDate: number;
}

class HealthcareTokenizationService {
  private assets: Map<string, HealthcareAsset> = new Map();
  private userPortfolio: Map<string, PortfolioHealthcareAsset> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private readonly UPDATE_FREQUENCY = 30000; // 30 seconds

  constructor() {
    this.initializeSampleAssets();
    this.startRealTimeUpdates();
  }

  private initializeSampleAssets(): void {
    const sampleAssets: HealthcareAsset[] = [
      {
        id: "afri-health-01",
        name: "African Primary Healthcare Token",
        tokenSymbol: "APHT",
        currentPrice: 0.45,
        priceHistory: this.generatePriceHistory(0.45),
        roi24h: 2.3,
        roi7d: 8.7,
        roi30d: 15.2,
        marketCap: 12500000,
        volume24h: 850000,
        description:
          "Tokenized investment in primary healthcare infrastructure across Sub-Saharan Africa",
        riskLevel: "medium",
        geography: "Sub-Saharan Africa",
        sector: "pharmaceuticals",
        impactMetrics: {
          patientsServed: 125000,
          facilitiesSupported: 89,
          treatmentsProvided: 340000,
          accessibilityImprovement: 67,
        },
        aiInsights: {
          prediction: "bullish",
          confidence: 0.78,
          reasoning:
            "Growing demand for healthcare access, government support, and WHO partnership announcements",
          localizedExplanation:
            "Strong growth expected due to increased healthcare needs and government backing",
        },
      },
      {
        id: "telemedicine-asia",
        name: "Asian Telemedicine Network",
        tokenSymbol: "ATNET",
        currentPrice: 1.23,
        priceHistory: this.generatePriceHistory(1.23),
        roi24h: -1.2,
        roi7d: 4.5,
        roi30d: 22.8,
        marketCap: 45000000,
        volume24h: 2100000,
        description:
          "Decentralized telemedicine platform serving rural communities in Southeast Asia",
        riskLevel: "high",
        geography: "Southeast Asia",
        sector: "telemedicine",
        impactMetrics: {
          patientsServed: 280000,
          facilitiesSupported: 156,
          treatmentsProvided: 890000,
          accessibilityImprovement: 85,
        },
        aiInsights: {
          prediction: "bullish",
          confidence: 0.82,
          reasoning:
            "Rapid digital adoption, regulatory clarity, and expanding rural internet infrastructure",
          localizedExplanation:
            "High growth potential as more rural areas gain internet access and adopt digital health",
        },
      },
      {
        id: "vaccine-supply-chain",
        name: "Global Vaccine Supply Chain",
        tokenSymbol: "GVSC",
        currentPrice: 2.67,
        priceHistory: this.generatePriceHistory(2.67),
        roi24h: 0.8,
        roi7d: -2.1,
        roi30d: 12.4,
        marketCap: 78000000,
        volume24h: 1800000,
        description:
          "Blockchain-based vaccine supply chain management for emerging markets",
        riskLevel: "low",
        geography: "Global",
        sector: "pharmaceuticals",
        impactMetrics: {
          patientsServed: 450000,
          facilitiesSupported: 234,
          treatmentsProvided: 1200000,
          accessibilityImprovement: 92,
        },
        aiInsights: {
          prediction: "neutral",
          confidence: 0.65,
          reasoning:
            "Stable demand but regulatory uncertainties in some regions may impact short-term growth",
          localizedExplanation:
            "Steady investment with consistent returns, good for risk-averse first-time investors",
        },
      },
    ];

    sampleAssets.forEach((asset) => this.assets.set(asset.id, asset));
  }

  private generatePriceHistory(
    currentPrice: number,
  ): Array<{ timestamp: number; price: number }> {
    const history: Array<{ timestamp: number; price: number }> = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    for (let i = 30; i >= 0; i--) {
      const timestamp = now - i * dayMs;
      const volatility = 0.1; // 10% volatility
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = currentPrice * (1 + randomChange);
      history.push({ timestamp, price: Math.max(0.01, price) });
    }

    return history;
  }

  private startRealTimeUpdates(): void {
    this.updateInterval = setInterval(() => {
      this.updateAssetPrices();
      this.syncWithRealTimeSystem();
    }, this.UPDATE_FREQUENCY);
  }

  private updateAssetPrices(): void {
    this.assets.forEach((asset, id) => {
      const volatility =
        asset.riskLevel === "high"
          ? 0.05
          : asset.riskLevel === "medium"
            ? 0.03
            : 0.01;
      const randomChange = (Math.random() - 0.5) * volatility;
      const newPrice = asset.currentPrice * (1 + randomChange);

      const previousPrice =
        asset.priceHistory[asset.priceHistory.length - 1]?.price ||
        asset.currentPrice;
      const roi24h = ((newPrice - previousPrice) / previousPrice) * 100;

      const updatedAsset: HealthcareAsset = {
        ...asset,
        currentPrice: Math.max(0.01, newPrice),
        roi24h: parseFloat(roi24h.toFixed(2)),
        priceHistory: [
          ...asset.priceHistory.slice(-29),
          { timestamp: Date.now(), price: newPrice },
        ],
      };

      this.assets.set(id, updatedAsset);
    });
  }

  private async syncWithRealTimeSystem(): Promise<void> {
    try {
      const portfolioData = Array.from(this.userPortfolio.values());
      await realTimeDataSyncSystem.syncData(
        "healthcare-portfolio",
        portfolioData,
      );
    } catch (error) {
      console.error("Failed to sync healthcare portfolio data:", error);
    }
  }

  public getAllAssets(): HealthcareAsset[] {
    return Array.from(this.assets.values());
  }

  public getAssetById(id: string): HealthcareAsset | null {
    return this.assets.get(id) || null;
  }

  public getUserPortfolio(): PortfolioHealthcareAsset[] {
    return Array.from(this.userPortfolio.values());
  }

  public addToPortfolio(assetId: string, amount: number): boolean {
    const asset = this.assets.get(assetId);
    if (!asset) return false;

    const investmentValue = amount * asset.currentPrice;
    const portfolioAsset: PortfolioHealthcareAsset = {
      ...asset,
      holdingAmount: amount,
      investmentValue,
      unrealizedGains: 0,
      percentageOfPortfolio: 0, // Will be calculated in getPortfolioSummary
      entryPrice: asset.currentPrice,
      entryDate: Date.now(),
    };

    this.userPortfolio.set(assetId, portfolioAsset);
    return true;
  }

  public getPortfolioSummary(): {
    totalValue: number;
    totalUnrealizedGains: number;
    totalRoi: number;
    riskDistribution: { low: number; medium: number; high: number };
    impactSummary: {
      totalPatientsServed: number;
      totalFacilitiesSupported: number;
      totalTreatmentsProvided: number;
      averageAccessibilityImprovement: number;
    };
  } {
    const portfolio = Array.from(this.userPortfolio.values());

    const totalValue = portfolio.reduce((sum, asset) => {
      const currentValue = asset.holdingAmount * asset.currentPrice;
      return sum + currentValue;
    }, 0);

    const totalInvestment = portfolio.reduce(
      (sum, asset) => sum + asset.investmentValue,
      0,
    );
    const totalUnrealizedGains = totalValue - totalInvestment;
    const totalRoi =
      totalInvestment > 0 ? (totalUnrealizedGains / totalInvestment) * 100 : 0;

    // Update portfolio percentages and unrealized gains
    portfolio.forEach((asset) => {
      const currentValue = asset.holdingAmount * asset.currentPrice;
      asset.percentageOfPortfolio =
        totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
      asset.unrealizedGains = currentValue - asset.investmentValue;
      this.userPortfolio.set(asset.id, asset);
    });

    // Risk distribution
    const riskDistribution = { low: 0, medium: 0, high: 0 };
    portfolio.forEach((asset) => {
      const assetValue = asset.holdingAmount * asset.currentPrice;
      const percentage = totalValue > 0 ? (assetValue / totalValue) * 100 : 0;
      riskDistribution[asset.riskLevel] += percentage;
    });

    // Impact summary
    const impactSummary = portfolio.reduce(
      (acc, asset) => {
        const weight = asset.percentageOfPortfolio / 100;
        return {
          totalPatientsServed:
            acc.totalPatientsServed +
            asset.impactMetrics.patientsServed * weight,
          totalFacilitiesSupported:
            acc.totalFacilitiesSupported +
            asset.impactMetrics.facilitiesSupported * weight,
          totalTreatmentsProvided:
            acc.totalTreatmentsProvided +
            asset.impactMetrics.treatmentsProvided * weight,
          averageAccessibilityImprovement:
            acc.averageAccessibilityImprovement +
            asset.impactMetrics.accessibilityImprovement * weight,
        };
      },
      {
        totalPatientsServed: 0,
        totalFacilitiesSupported: 0,
        totalTreatmentsProvided: 0,
        averageAccessibilityImprovement: 0,
      },
    );

    return {
      totalValue,
      totalUnrealizedGains,
      totalRoi,
      riskDistribution,
      impactSummary,
    };
  }

  public async getLocalizedInsights(
    assetId: string,
    language: string = "en",
  ): Promise<string> {
    const asset = this.assets.get(assetId);
    if (!asset) return "Asset not found";

    try {
      const insight = await conversationalIntelligenceService.generateResponse(
        `Explain the healthcare investment opportunity for ${asset.name} to a first-time investor in simple terms`,
        language,
        {
          assetData: asset,
          context: "healthcare_investment_education",
        },
      );
      return insight;
    } catch (error) {
      return asset.aiInsights.localizedExplanation;
    }
  }

  public getAssetsByGeography(geography: string): HealthcareAsset[] {
    return Array.from(this.assets.values()).filter((asset) =>
      asset.geography.toLowerCase().includes(geography.toLowerCase()),
    );
  }

  public getAssetsBySector(sector: string): HealthcareAsset[] {
    return Array.from(this.assets.values()).filter(
      (asset) => asset.sector === sector,
    );
  }

  public getRecommendationsForFirstTimeInvestor(): {
    conservative: HealthcareAsset[];
    balanced: HealthcareAsset[];
    growth: HealthcareAsset[];
  } {
    const allAssets = Array.from(this.assets.values());

    return {
      conservative: allAssets.filter((asset) => asset.riskLevel === "low"),
      balanced: allAssets.filter((asset) => asset.riskLevel === "medium"),
      growth: allAssets.filter((asset) => asset.riskLevel === "high"),
    };
  }

  public destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export const healthcareTokenizationService =
  new HealthcareTokenizationService();
