import { singletonPattern } from "../utils/singletonPattern";

export interface Currency {
  code: string; // ISO 4217 code
  name: string;
  symbol: string;
  decimals: number;
  regions: string[];
  status: "active" | "inactive" | "deprecated";
  type: "fiat" | "crypto" | "stable_coin" | "cbdc";
  volatility: "low" | "medium" | "high" | "extreme";
  liquidity: number; // 0-100 score
  tradingPairs: string[];
  regulation: {
    kycRequired: boolean;
    amlCompliance: boolean;
    reportingThreshold: number;
    restrictedRegions: string[];
  };
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  inverseRate: number;
  spread: number; // percentage
  lastUpdated: Date;
  source: "central_bank" | "market_data" | "aggregated" | "internal";
  confidence: number; // 0-100
  dailyChange: number; // percentage
  weeklyChange: number; // percentage
  monthlyChange: number; // percentage
}

export interface CurrencyTransaction {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  fees: {
    exchangeFee: number;
    networkFee: number;
    processingFee: number;
    total: number;
  };
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  userId: string;
  timestamp: Date;
  completedAt?: Date;
  reference: string;
  method: "spot" | "forward" | "swap";
  provider: string;
}

export interface CurrencyWallet {
  userId: string;
  currency: string;
  balance: number;
  lockedBalance: number; // funds in pending transactions
  averageCost: number; // average cost basis
  lastTransaction: Date;
  autoConvert: {
    enabled: boolean;
    targetCurrency: string;
    threshold: number;
    conditions: string[];
  };
}

export interface RiskManagement {
  userId: string;
  currency: string;
  limits: {
    dailyLimit: number;
    monthlyLimit: number;
    transactionLimit: number;
  };
  usage: {
    dailyUsed: number;
    monthlyUsed: number;
    lastReset: Date;
  };
  riskScore: number; // 0-100
  flags: Array<{
    type: "velocity" | "amount" | "pattern" | "location" | "compliance";
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    timestamp: Date;
  }>;
}

export interface HedgingStrategy {
  id: string;
  name: string;
  description: string;
  baseCurrency: string;
  targetCurrencies: string[];
  strategy: "forward_contract" | "options" | "currency_swap" | "natural_hedge";
  allocation: Record<string, number>; // currency -> percentage
  rebalanceFrequency: "daily" | "weekly" | "monthly" | "quarterly";
  riskTolerance: "conservative" | "moderate" | "aggressive";
  active: boolean;
  performance: {
    totalReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export interface ComplianceReport {
  reportId: string;
  period: { start: Date; end: Date };
  currency: string;
  region: string;
  transactions: {
    count: number;
    totalVolume: number;
    averageSize: number;
    flaggedTransactions: number;
  };
  compliance: {
    kycCompliance: number; // percentage
    amlCompliance: number; // percentage
    reportingCompliance: number; // percentage
    issues: Array<{
      type: string;
      description: string;
      severity: "low" | "medium" | "high";
      count: number;
    }>;
  };
  recommendations: string[];
  generatedAt: Date;
}

class MultiCurrencyService {
  private currencies: Map<string, Currency> = new Map();
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  private transactions: Map<string, CurrencyTransaction> = new Map();
  private wallets: Map<string, CurrencyWallet> = new Map();
  private riskManagement: Map<string, RiskManagement> = new Map();
  private hedgingStrategies: Map<string, HedgingStrategy> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize currencies and exchange rates
    await this.createSampleCurrencies();
    await this.createSampleExchangeRates();
    await this.createSampleWallets();
    await this.createSampleHedgingStrategies();

    // Start real-time services
    this.startExchangeRateUpdates();
    this.startRiskMonitoring();
    this.startComplianceMonitoring();

    this.isInitialized = true;
    console.log(
      "Multi-Currency Service initialized with global payment support",
    );
  }

  private async createSampleCurrencies(): Promise<void> {
    const sampleCurrencies: Currency[] = [
      {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        decimals: 2,
        regions: ["us-east", "us-west", "us-central"],
        status: "active",
        type: "fiat",
        volatility: "low",
        liquidity: 100,
        tradingPairs: ["EUR", "GBP", "JPY", "CAD", "AUD", "CHF"],
        regulation: {
          kycRequired: true,
          amlCompliance: true,
          reportingThreshold: 10000,
          restrictedRegions: [],
        },
      },
      {
        code: "EUR",
        name: "Euro",
        symbol: "€",
        decimals: 2,
        regions: ["eu-west", "eu-central", "eu-north"],
        status: "active",
        type: "fiat",
        volatility: "low",
        liquidity: 95,
        tradingPairs: ["USD", "GBP", "JPY", "CHF", "SEK"],
        regulation: {
          kycRequired: true,
          amlCompliance: true,
          reportingThreshold: 10000,
          restrictedRegions: [],
        },
      },
      {
        code: "NGN",
        name: "Nigerian Naira",
        symbol: "₦",
        decimals: 2,
        regions: ["africa-west"],
        status: "active",
        type: "fiat",
        volatility: "high",
        liquidity: 65,
        tradingPairs: ["USD", "EUR", "GBP"],
        regulation: {
          kycRequired: true,
          amlCompliance: true,
          reportingThreshold: 5000000, // 5M NGN
          restrictedRegions: [],
        },
      },
      {
        code: "ZAR",
        name: "South African Rand",
        symbol: "R",
        decimals: 2,
        regions: ["africa-south"],
        status: "active",
        type: "fiat",
        volatility: "medium",
        liquidity: 70,
        tradingPairs: ["USD", "EUR", "GBP"],
        regulation: {
          kycRequired: true,
          amlCompliance: true,
          reportingThreshold: 25000,
          restrictedRegions: [],
        },
      },
      {
        code: "BTC",
        name: "Bitcoin",
        symbol: "₿",
        decimals: 8,
        regions: ["global"],
        status: "active",
        type: "crypto",
        volatility: "extreme",
        liquidity: 85,
        tradingPairs: ["USD", "EUR", "USDT"],
        regulation: {
          kycRequired: true,
          amlCompliance: true,
          reportingThreshold: 1000,
          restrictedRegions: ["china", "bangladesh"],
        },
      },
      {
        code: "USDC",
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        regions: ["global"],
        status: "active",
        type: "stable_coin",
        volatility: "low",
        liquidity: 90,
        tradingPairs: ["USD", "EUR", "BTC", "ETH"],
        regulation: {
          kycRequired: true,
          amlCompliance: true,
          reportingThreshold: 3000,
          restrictedRegions: [],
        },
      },
    ];

    for (const currency of sampleCurrencies) {
      this.currencies.set(currency.code, currency);
    }
  }

  private async createSampleExchangeRates(): Promise<void> {
    const baseCurrencies = ["USD", "EUR", "GBP"];
    const targetCurrencies = ["USD", "EUR", "GBP", "NGN", "ZAR", "BTC", "USDC"];

    for (const base of baseCurrencies) {
      for (const target of targetCurrencies) {
        if (base === target) continue;

        const rate = this.generateExchangeRate(base, target);
        const key = `${base}-${target}`;

        this.exchangeRates.set(key, {
          fromCurrency: base,
          toCurrency: target,
          rate: rate,
          inverseRate: 1 / rate,
          spread: this.calculateSpread(base, target),
          lastUpdated: new Date(),
          source: "market_data",
          confidence: 95 + Math.random() * 5,
          dailyChange: (Math.random() - 0.5) * 4, // ±2%
          weeklyChange: (Math.random() - 0.5) * 10, // ±5%
          monthlyChange: (Math.random() - 0.5) * 20, // ±10%
        });
      }
    }
  }

  private generateExchangeRate(
    fromCurrency: string,
    toCurrency: string,
  ): number {
    // Simplified exchange rate generation
    const rates: Record<string, number> = {
      "USD-EUR": 0.85,
      "USD-GBP": 0.73,
      "USD-NGN": 415.5,
      "USD-ZAR": 18.25,
      "USD-BTC": 0.000023,
      "USD-USDC": 1.001,
      "EUR-USD": 1.18,
      "EUR-GBP": 0.86,
      "EUR-NGN": 489.5,
      "GBP-USD": 1.37,
      "GBP-EUR": 1.16,
    };

    const key = `${fromCurrency}-${toCurrency}`;
    const baseRate = rates[key];

    if (baseRate) {
      // Add some volatility
      const volatility = this.currencies.get(fromCurrency)?.volatility || "low";
      const variationPercent =
        volatility === "low"
          ? 0.005
          : volatility === "medium"
            ? 0.02
            : volatility === "high"
              ? 0.05
              : 0.1;

      const variation = (Math.random() - 0.5) * variationPercent * 2;
      return baseRate * (1 + variation);
    }

    // Generate inverse if available
    const inverseKey = `${toCurrency}-${fromCurrency}`;
    const inverseRate = rates[inverseKey];
    if (inverseRate) {
      return 1 / inverseRate;
    }

    // Default fallback
    return 1;
  }

  private calculateSpread(fromCurrency: string, toCurrency: string): number {
    const fromCur = this.currencies.get(fromCurrency);
    const toCur = this.currencies.get(toCurrency);

    if (!fromCur || !toCur) return 0.5; // Default 0.5%

    let spread = 0.1; // Base spread

    // Increase spread for less liquid currencies
    if (fromCur.liquidity < 80) spread += 0.2;
    if (toCur.liquidity < 80) spread += 0.2;

    // Increase spread for crypto
    if (fromCur.type === "crypto" || toCur.type === "crypto") spread += 0.3;

    // Increase spread for high volatility
    if (fromCur.volatility === "high" || toCur.volatility === "high")
      spread += 0.2;
    if (fromCur.volatility === "extreme" || toCur.volatility === "extreme")
      spread += 0.5;

    return Math.min(spread, 2.0); // Cap at 2%
  }

  private async createSampleWallets(): Promise<void> {
    const sampleUsers = ["user-001", "user-002", "user-003"];
    const currencies = ["USD", "EUR", "NGN", "BTC", "USDC"];

    for (const userId of sampleUsers) {
      for (const currency of currencies) {
        const wallet: CurrencyWallet = {
          userId,
          currency,
          balance: Math.random() * 10000,
          lockedBalance: Math.random() * 100,
          averageCost: Math.random() * 50000,
          lastTransaction: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
          ),
          autoConvert: {
            enabled: Math.random() > 0.7,
            targetCurrency: "USD",
            threshold: 100,
            conditions: ["daily_limit", "volatility_threshold"],
          },
        };

        const key = `${userId}-${currency}`;
        this.wallets.set(key, wallet);
      }
    }
  }

  private async createSampleHedgingStrategies(): Promise<void> {
    const strategies: HedgingStrategy[] = [
      {
        id: "hedge-001",
        name: "Conservative Multi-Currency Hedge",
        description: "Low-risk hedging strategy for currency exposure",
        baseCurrency: "USD",
        targetCurrencies: ["EUR", "GBP", "JPY"],
        strategy: "forward_contract",
        allocation: { EUR: 40, GBP: 35, JPY: 25 },
        rebalanceFrequency: "monthly",
        riskTolerance: "conservative",
        active: true,
        performance: {
          totalReturn: 8.5,
          volatility: 12.3,
          sharpeRatio: 0.69,
          maxDrawdown: -4.2,
        },
      },
      {
        id: "hedge-002",
        name: "Emerging Markets Hedge",
        description: "Hedging strategy for emerging market currency exposure",
        baseCurrency: "USD",
        targetCurrencies: ["NGN", "ZAR", "BRL"],
        strategy: "options",
        allocation: { NGN: 50, ZAR: 30, BRL: 20 },
        rebalanceFrequency: "weekly",
        riskTolerance: "aggressive",
        active: true,
        performance: {
          totalReturn: 15.2,
          volatility: 25.8,
          sharpeRatio: 0.59,
          maxDrawdown: -12.1,
        },
      },
    ];

    for (const strategy of strategies) {
      this.hedgingStrategies.set(strategy.id, strategy);
    }
  }

  async getCurrencies(filters?: {
    type?: string;
    region?: string;
    status?: string;
    volatility?: string;
  }): Promise<Currency[]> {
    let currencies = Array.from(this.currencies.values());

    if (filters?.type) {
      currencies = currencies.filter((c) => c.type === filters.type);
    }

    if (filters?.region) {
      currencies = currencies.filter(
        (c) =>
          c.regions.includes(filters.region!) || c.regions.includes("global"),
      );
    }

    if (filters?.status) {
      currencies = currencies.filter((c) => c.status === filters.status);
    }

    if (filters?.volatility) {
      currencies = currencies.filter(
        (c) => c.volatility === filters.volatility,
      );
    }

    return currencies.sort((a, b) => b.liquidity - a.liquidity);
  }

  async getExchangeRate(
    fromCurrency: string,
    toCurrency: string,
  ): Promise<ExchangeRate | null> {
    const key = `${fromCurrency}-${toCurrency}`;
    return this.exchangeRates.get(key) || null;
  }

  async convertCurrency(
    fromCurrency: string,
    toCurrency: string,
    amount: number,
    userId: string,
    method: "spot" | "forward" | "swap" = "spot",
  ): Promise<CurrencyTransaction> {
    const exchangeRate = await this.getExchangeRate(fromCurrency, toCurrency);
    if (!exchangeRate) {
      throw new Error(
        `Exchange rate not available for ${fromCurrency}-${toCurrency}`,
      );
    }

    // Check risk limits
    await this.checkRiskLimits(userId, fromCurrency, amount);

    const toAmount = amount * exchangeRate.rate;
    const fees = this.calculateFees(amount, fromCurrency, toCurrency, method);

    const transaction: CurrencyTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fromCurrency,
      toCurrency,
      fromAmount: amount,
      toAmount: toAmount - fees.total,
      exchangeRate: exchangeRate.rate,
      fees,
      status: "pending",
      userId,
      timestamp: new Date(),
      reference: `REF-${Date.now()}`,
      method,
      provider: "quantumvest-exchange",
    };

    this.transactions.set(transaction.id, transaction);

    // Process transaction asynchronously
    this.processTransaction(transaction);

    return transaction;
  }

  private calculateFees(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    method: string,
  ): CurrencyTransaction["fees"] {
    const fromCur = this.currencies.get(fromCurrency);
    const toCur = this.currencies.get(toCurrency);

    let exchangeFeeRate = 0.002; // 0.2% base
    let networkFeeRate = 0.001; // 0.1% base
    let processingFeeRate = 0.0005; // 0.05% base

    // Adjust for currency types
    if (fromCur?.type === "crypto" || toCur?.type === "crypto") {
      exchangeFeeRate += 0.003;
      networkFeeRate += 0.002;
    }

    // Adjust for method
    if (method === "forward") {
      exchangeFeeRate += 0.001;
    } else if (method === "swap") {
      exchangeFeeRate += 0.0015;
    }

    const exchangeFee = amount * exchangeFeeRate;
    const networkFee = amount * networkFeeRate;
    const processingFee = amount * processingFeeRate;
    const total = exchangeFee + networkFee + processingFee;

    return { exchangeFee, networkFee, processingFee, total };
  }

  private async checkRiskLimits(
    userId: string,
    currency: string,
    amount: number,
  ): Promise<void> {
    const key = `${userId}-${currency}`;
    let riskData = this.riskManagement.get(key);

    if (!riskData) {
      riskData = {
        userId,
        currency,
        limits: {
          dailyLimit: 50000,
          monthlyLimit: 200000,
          transactionLimit: 10000,
        },
        usage: {
          dailyUsed: 0,
          monthlyUsed: 0,
          lastReset: new Date(),
        },
        riskScore: 25,
        flags: [],
      };
      this.riskManagement.set(key, riskData);
    }

    // Check transaction limit
    if (amount > riskData.limits.transactionLimit) {
      throw new Error(
        `Transaction amount exceeds limit of ${riskData.limits.transactionLimit} ${currency}`,
      );
    }

    // Check daily limit
    if (riskData.usage.dailyUsed + amount > riskData.limits.dailyLimit) {
      throw new Error(
        `Transaction would exceed daily limit of ${riskData.limits.dailyLimit} ${currency}`,
      );
    }

    // Check monthly limit
    if (riskData.usage.monthlyUsed + amount > riskData.limits.monthlyLimit) {
      throw new Error(
        `Transaction would exceed monthly limit of ${riskData.limits.monthlyLimit} ${currency}`,
      );
    }

    // Update usage
    riskData.usage.dailyUsed += amount;
    riskData.usage.monthlyUsed += amount;
  }

  private async processTransaction(
    transaction: CurrencyTransaction,
  ): Promise<void> {
    // Simulate processing time
    const processingTime =
      transaction.method === "spot"
        ? 2000
        : transaction.method === "forward"
          ? 5000
          : 10000;

    setTimeout(() => {
      transaction.status = "processing";

      // Simulate success/failure (95% success rate)
      setTimeout(() => {
        if (Math.random() > 0.05) {
          transaction.status = "completed";
          transaction.completedAt = new Date();

          // Update wallet balances
          this.updateWalletBalances(transaction);
        } else {
          transaction.status = "failed";
        }
      }, processingTime / 2);
    }, processingTime / 2);
  }

  private updateWalletBalances(transaction: CurrencyTransaction): void {
    const fromKey = `${transaction.userId}-${transaction.fromCurrency}`;
    const toKey = `${transaction.userId}-${transaction.toCurrency}`;

    const fromWallet = this.wallets.get(fromKey);
    const toWallet = this.wallets.get(toKey);

    if (fromWallet) {
      fromWallet.balance -= transaction.fromAmount;
      fromWallet.lockedBalance -= transaction.fromAmount; // Remove from locked
      fromWallet.lastTransaction = new Date();
    }

    if (toWallet) {
      toWallet.balance += transaction.toAmount;
      toWallet.lastTransaction = new Date();
    }
  }

  async getTransactions(
    userId?: string,
    currency?: string,
    status?: string,
    limit = 50,
  ): Promise<CurrencyTransaction[]> {
    let transactions = Array.from(this.transactions.values());

    if (userId) {
      transactions = transactions.filter((t) => t.userId === userId);
    }

    if (currency) {
      transactions = transactions.filter(
        (t) => t.fromCurrency === currency || t.toCurrency === currency,
      );
    }

    if (status) {
      transactions = transactions.filter((t) => t.status === status);
    }

    return transactions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getWallets(userId: string): Promise<CurrencyWallet[]> {
    const wallets = Array.from(this.wallets.values()).filter(
      (w) => w.userId === userId,
    );

    return wallets.sort((a, b) => b.balance - a.balance);
  }

  async getWallet(
    userId: string,
    currency: string,
  ): Promise<CurrencyWallet | null> {
    const key = `${userId}-${currency}`;
    return this.wallets.get(key) || null;
  }

  async getHedgingStrategies(): Promise<HedgingStrategy[]> {
    return Array.from(this.hedgingStrategies.values()).sort(
      (a, b) => b.performance.totalReturn - a.performance.totalReturn,
    );
  }

  async createHedgingStrategy(
    strategyData: Omit<HedgingStrategy, "id" | "performance">,
  ): Promise<HedgingStrategy> {
    const strategy: HedgingStrategy = {
      id: `hedge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      performance: {
        totalReturn: 0,
        volatility: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
      },
      ...strategyData,
    };

    this.hedgingStrategies.set(strategy.id, strategy);
    return strategy;
  }

  async generateComplianceReport(
    currency: string,
    region: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ComplianceReport> {
    const transactions = Array.from(this.transactions.values()).filter(
      (t) =>
        (t.fromCurrency === currency || t.toCurrency === currency) &&
        t.timestamp >= startDate &&
        t.timestamp <= endDate,
    );

    const totalVolume = transactions.reduce(
      (sum, t) =>
        sum + (t.fromCurrency === currency ? t.fromAmount : t.toAmount),
      0,
    );

    const flaggedTransactions = transactions.filter(
      (t) => t.fromAmount > 10000 || t.toAmount > 10000,
    ).length;

    const report: ComplianceReport = {
      reportId: `report-${Date.now()}`,
      period: { start: startDate, end: endDate },
      currency,
      region,
      transactions: {
        count: transactions.length,
        totalVolume,
        averageSize: totalVolume / transactions.length || 0,
        flaggedTransactions,
      },
      compliance: {
        kycCompliance: 95 + Math.random() * 5,
        amlCompliance: 92 + Math.random() * 8,
        reportingCompliance: 98 + Math.random() * 2,
        issues: [],
      },
      recommendations: [
        "Enhance real-time transaction monitoring",
        "Implement advanced AML screening",
        "Strengthen KYC verification processes",
      ],
      generatedAt: new Date(),
    };

    // Add issues if compliance is low
    if (report.compliance.amlCompliance < 95) {
      report.compliance.issues.push({
        type: "AML Compliance",
        description: "Some transactions lack proper AML screening",
        severity: "medium",
        count: Math.floor(transactions.length * 0.05),
      });
    }

    return report;
  }

  private startExchangeRateUpdates(): void {
    setInterval(() => {
      // Update exchange rates with market fluctuations
      for (const rate of this.exchangeRates.values()) {
        const currency = this.currencies.get(rate.fromCurrency);
        if (!currency) continue;

        const volatilityFactor =
          currency.volatility === "low"
            ? 0.001
            : currency.volatility === "medium"
              ? 0.005
              : currency.volatility === "high"
                ? 0.02
                : 0.05;

        const change = (Math.random() - 0.5) * volatilityFactor * 2;
        rate.rate *= 1 + change;
        rate.inverseRate = 1 / rate.rate;
        rate.dailyChange = change * 100;
        rate.lastUpdated = new Date();
      }
    }, 5000); // Update every 5 seconds
  }

  private startRiskMonitoring(): void {
    setInterval(() => {
      // Reset daily limits
      const now = new Date();
      for (const risk of this.riskManagement.values()) {
        const lastReset = risk.usage.lastReset;
        const daysSinceReset =
          (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceReset >= 1) {
          risk.usage.dailyUsed = 0;
          risk.usage.lastReset = now;
        }

        // Reset monthly limits
        if (daysSinceReset >= 30) {
          risk.usage.monthlyUsed = 0;
        }

        // Update risk scores based on usage patterns
        const utilizationRatio = risk.usage.dailyUsed / risk.limits.dailyLimit;
        if (utilizationRatio > 0.8) {
          risk.riskScore = Math.min(100, risk.riskScore + 5);
        } else if (utilizationRatio < 0.2) {
          risk.riskScore = Math.max(0, risk.riskScore - 1);
        }
      }
    }, 300000); // Every 5 minutes
  }

  private startComplianceMonitoring(): void {
    setInterval(() => {
      // Monitor for suspicious patterns
      const recentTransactions = Array.from(this.transactions.values()).filter(
        (t) => t.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000),
      ); // Last 24 hours

      const userTransactionCounts = new Map<string, number>();
      for (const transaction of recentTransactions) {
        const count = userTransactionCounts.get(transaction.userId) || 0;
        userTransactionCounts.set(transaction.userId, count + 1);
      }

      // Flag users with excessive transactions
      for (const [userId, count] of userTransactionCounts.entries()) {
        if (count > 50) {
          // More than 50 transactions per day
          console.warn(
            `High transaction velocity detected for user ${userId}: ${count} transactions`,
          );
        }
      }
    }, 600000); // Every 10 minutes
  }

  async getCurrencyStats(): Promise<{
    totalCurrencies: number;
    activeCurrencies: number;
    totalVolume24h: number;
    totalTransactions24h: number;
    averageSpread: number;
    topCurrencies: Array<{
      currency: string;
      volume: number;
      transactions: number;
    }>;
  }> {
    const currencies = Array.from(this.currencies.values());
    const activeCurrencies = currencies.filter((c) => c.status === "active");

    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentTransactions = Array.from(this.transactions.values()).filter(
      (t) => t.timestamp > last24h,
    );

    const totalVolume24h = recentTransactions.reduce(
      (sum, t) => sum + t.fromAmount,
      0,
    );
    const averageSpread =
      Array.from(this.exchangeRates.values()).reduce(
        (sum, r) => sum + r.spread,
        0,
      ) / this.exchangeRates.size;

    // Calculate top currencies by volume
    const currencyVolumes = new Map<
      string,
      { volume: number; transactions: number }
    >();
    for (const transaction of recentTransactions) {
      const existing = currencyVolumes.get(transaction.fromCurrency) || {
        volume: 0,
        transactions: 0,
      };
      existing.volume += transaction.fromAmount;
      existing.transactions += 1;
      currencyVolumes.set(transaction.fromCurrency, existing);
    }

    const topCurrencies = Array.from(currencyVolumes.entries())
      .map(([currency, data]) => ({ currency, ...data }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);

    return {
      totalCurrencies: currencies.length,
      activeCurrencies: activeCurrencies.length,
      totalVolume24h,
      totalTransactions24h: recentTransactions.length,
      averageSpread,
      topCurrencies,
    };
  }
}

export const multiCurrencyService = singletonPattern(
  () => new MultiCurrencyService(),
);
