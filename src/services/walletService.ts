import { blockchainService } from "./blockchainService";
import { localizationService } from "./localizationService";
import { fetcher } from "../utils/fetcher";
import { formatCurrency } from "../utils/formatCurrency";
import type {
  Wallet,
  WalletAddress,
  Balance,
  Transaction,
  SwapQuote,
  SwapRoute,
} from "../types/Wallet";

export class WalletService {
  private static instance: WalletService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly cacheTTL = 5 * 60 * 1000; // 5 minutes for balance cache
  private readonly priceCache = new Map<
    string,
    { price: number; timestamp: number }
  >();
  private readonly priceCacheTTL = 60 * 1000; // 1 minute for price cache

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  /**
   * Create a new wallet for user
   */
  async createWallet(
    userId: string,
    type: "custodial" | "non-custodial" | "hybrid" = "hybrid",
  ): Promise<Wallet> {
    try {
      const wallet: Wallet = {
        id: this.generateId(),
        userId,
        type,
        addresses: [],
        balances: [],
        settings: {
          defaultCurrency: "USD",
          preferredLanguage: "en",
          notifications: {
            priceAlerts: true,
            transactionConfirmations: true,
            securityAlerts: true,
            marketNews: false,
            portfolioUpdates: true,
          },
          privacy: {
            hideBalances: false,
            anonymousMode: false,
            shareData: true,
          },
          trading: {
            slippageTolerance: 0.5,
            gasPreference: "standard",
            autoApproval: false,
            maxTransactionAmount: 10000,
          },
        },
        security: {
          twoFactorEnabled: false,
          biometricEnabled: false,
          sessionTimeout: 30,
          whitelistedAddresses: [],
          withdrawalLimits: [
            { period: "daily", amount: 5000, currency: "USD" },
            { period: "weekly", amount: 25000, currency: "USD" },
            { period: "monthly", amount: 100000, currency: "USD" },
          ],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Generate addresses for supported blockchains if non-custodial
      if (type !== "custodial") {
        wallet.addresses = await this.generateAddresses(wallet.id);
      }

      return wallet;
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw new Error("Failed to create wallet");
    }
  }

  /**
   * Get wallet by ID
   */
  async getWallet(walletId: string): Promise<Wallet | null> {
    try {
      // In a real implementation, this would fetch from database
      const cacheKey = `wallet:${walletId}`;
      return this.getFromCache(cacheKey);
    } catch (error) {
      console.error("Error getting wallet:", error);
      return null;
    }
  }

  /**
   * Get wallet balances across all supported currencies
   */
  async getBalances(
    walletId: string,
    refreshCache: boolean = false,
  ): Promise<Balance[]> {
    const cacheKey = `balances:${walletId}`;

    if (!refreshCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const wallet = await this.getWallet(walletId);
      if (!wallet) throw new Error("Wallet not found");

      const balances: Balance[] = [];

      // Get crypto balances
      for (const address of wallet.addresses) {
        const cryptoBalances = await this.getCryptoBalances(address);
        balances.push(...cryptoBalances);
      }

      // Get fiat balances (for custodial/hybrid wallets)
      if (wallet.type !== "non-custodial") {
        const fiatBalances = await this.getFiatBalances(walletId);
        balances.push(...fiatBalances);
      }

      // Update fiat values
      const balancesWithFiatValues = await this.updateFiatValues(
        balances,
        wallet.settings.defaultCurrency,
      );

      this.setCache(cacheKey, balancesWithFiatValues);
      return balancesWithFiatValues;
    } catch (error) {
      console.error("Error getting balances:", error);
      throw new Error("Failed to get wallet balances");
    }
  }

  /**
   * Send transaction
   */
  async sendTransaction(
    walletId: string,
    toAddress: string,
    amount: number,
    asset: string,
    options: {
      memo?: string;
      gasPrice?: string;
      gasLimit?: number;
      priority?: "slow" | "standard" | "fast";
    } = {},
  ): Promise<Transaction> {
    try {
      const wallet = await this.getWallet(walletId);
      if (!wallet) throw new Error("Wallet not found");

      // Validate transaction
      await this.validateTransaction(wallet, toAddress, amount, asset);

      // Check if it's a crypto or fiat transaction
      const isCrypto = this.isCryptoAsset(asset);

      if (isCrypto) {
        return await this.sendCryptoTransaction(
          wallet,
          toAddress,
          amount,
          asset,
          options,
        );
      } else {
        return await this.sendFiatTransaction(
          wallet,
          toAddress,
          amount,
          asset,
          options,
        );
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw new Error("Failed to send transaction");
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(
    walletId: string,
    filters: {
      asset?: string;
      type?: Transaction["type"];
      status?: Transaction["status"];
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<Transaction[]> {
    try {
      const wallet = await this.getWallet(walletId);
      if (!wallet) throw new Error("Wallet not found");

      const transactions: Transaction[] = [];

      // Get crypto transactions
      for (const address of wallet.addresses) {
        const cryptoTxs = await blockchainService.getTransactionHistory(
          address.address,
          undefined,
          address.blockchain,
        );
        transactions.push(...cryptoTxs);
      }

      // Get fiat transactions (for custodial/hybrid wallets)
      if (wallet.type !== "non-custodial") {
        const fiatTxs = await this.getFiatTransactionHistory(walletId);
        transactions.push(...fiatTxs);
      }

      // Apply filters and sorting
      let filteredTxs = transactions;

      if (filters.asset) {
        filteredTxs = filteredTxs.filter((tx) => tx.asset === filters.asset);
      }

      if (filters.type) {
        filteredTxs = filteredTxs.filter((tx) => tx.type === filters.type);
      }

      if (filters.status) {
        filteredTxs = filteredTxs.filter((tx) => tx.status === filters.status);
      }

      if (filters.startDate) {
        filteredTxs = filteredTxs.filter(
          (tx) => tx.createdAt >= filters.startDate!,
        );
      }

      if (filters.endDate) {
        filteredTxs = filteredTxs.filter(
          (tx) => tx.createdAt <= filters.endDate!,
        );
      }

      // Sort by date (newest first)
      filteredTxs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Apply pagination
      const offset = filters.offset || 0;
      const limit = filters.limit || 50;

      return filteredTxs.slice(offset, offset + limit);
    } catch (error) {
      console.error("Error getting transaction history:", error);
      throw new Error("Failed to get transaction history");
    }
  }

  /**
   * Swap assets (crypto to crypto, fiat to crypto, etc.)
   */
  async swapAssets(
    walletId: string,
    fromAsset: string,
    toAsset: string,
    amount: number,
    slippageTolerance: number = 0.5,
  ): Promise<Transaction> {
    try {
      const wallet = await this.getWallet(walletId);
      if (!wallet) throw new Error("Wallet not found");

      // Get swap quote
      const quote = await this.getSwapQuote(
        fromAsset,
        toAsset,
        amount,
        slippageTolerance,
      );

      // Validate swap
      await this.validateSwap(wallet, fromAsset, toAsset, amount, quote);

      // Execute swap
      return await this.executeSwap(wallet, quote);
    } catch (error) {
      console.error("Error swapping assets:", error);
      throw new Error("Failed to swap assets");
    }
  }

  /**
   * Get swap quote
   */
  async getSwapQuote(
    fromAsset: string,
    toAsset: string,
    fromAmount: number,
    slippageTolerance: number = 0.5,
  ): Promise<SwapQuote> {
    try {
      // This would integrate with DEX aggregators like 1inch, Paraswap, etc.
      const response = await fetcher.get("/api/swap/quote", {
        params: {
          fromAsset,
          toAsset,
          fromAmount: fromAmount.toString(),
          slippageTolerance: slippageTolerance.toString(),
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error getting swap quote:", error);
      throw new Error("Failed to get swap quote");
    }
  }

  /**
   * Stake assets
   */
  async stakeAssets(
    walletId: string,
    asset: string,
    amount: number,
    validatorAddress?: string,
  ): Promise<Transaction> {
    try {
      const wallet = await this.getWallet(walletId);
      if (!wallet) throw new Error("Wallet not found");

      // Validate staking
      await this.validateStaking(wallet, asset, amount);

      // Execute staking transaction
      const transaction: Transaction = {
        id: this.generateId(),
        walletId,
        type: "stake",
        status: "pending",
        toAddress: validatorAddress || "",
        amount,
        asset,
        fee: 0.001, // Placeholder
        feeAsset: asset,
        blockchain: this.getBlockchainForAsset(asset),
        blockNumber: 0,
        confirmations: 0,
        metadata: {
          staking: {
            validator: validatorAddress,
            estimatedApy: 5.5, // Placeholder
            lockupPeriod: 21, // days
          },
        },
        createdAt: new Date(),
      };

      return transaction;
    } catch (error) {
      console.error("Error staking assets:", error);
      throw new Error("Failed to stake assets");
    }
  }

  /**
   * Unstake assets
   */
  async unstakeAssets(
    walletId: string,
    asset: string,
    amount: number,
    validatorAddress?: string,
  ): Promise<Transaction> {
    try {
      const wallet = await this.getWallet(walletId);
      if (!wallet) throw new Error("Wallet not found");

      const transaction: Transaction = {
        id: this.generateId(),
        walletId,
        type: "unstake",
        status: "pending",
        fromAddress: validatorAddress || "",
        amount,
        asset,
        fee: 0.001, // Placeholder
        feeAsset: asset,
        blockchain: this.getBlockchainForAsset(asset),
        blockNumber: 0,
        confirmations: 0,
        metadata: {
          unstaking: {
            validator: validatorAddress,
            unbondingPeriod: 21, // days
          },
        },
        createdAt: new Date(),
      };

      return transaction;
    } catch (error) {
      console.error("Error unstaking assets:", error);
      throw new Error("Failed to unstake assets");
    }
  }

  /**
   * Add address to wallet
   */
  async addAddress(
    walletId: string,
    blockchain: string,
    address: string,
    label?: string,
  ): Promise<WalletAddress> {
    try {
      // Validate address format
      await this.validateAddress(address, blockchain);

      const walletAddress: WalletAddress = {
        address,
        blockchain,
        isActive: true,
        label,
      };

      // In a real implementation, this would update the database
      return walletAddress;
    } catch (error) {
      console.error("Error adding address:", error);
      throw new Error("Failed to add address to wallet");
    }
  }

  /**
   * Update wallet settings
   */
  async updateWalletSettings(
    walletId: string,
    settings: Partial<Wallet["settings"]>,
  ): Promise<Wallet> {
    try {
      const wallet = await this.getWallet(walletId);
      if (!wallet) throw new Error("Wallet not found");

      wallet.settings = { ...wallet.settings, ...settings };
      wallet.updatedAt = new Date();

      // In a real implementation, this would update the database
      return wallet;
    } catch (error) {
      console.error("Error updating wallet settings:", error);
      throw new Error("Failed to update wallet settings");
    }
  }

  /**
   * Generate addresses for supported blockchains
   */
  private async generateAddresses(walletId: string): Promise<WalletAddress[]> {
    const addresses: WalletAddress[] = [];

    try {
      // For demo purposes, we'll use placeholder addresses
      const blockchains = ["ethereum", "polygon", "bsc", "arbitrum"];

      for (const blockchain of blockchains) {
        addresses.push({
          address: this.generatePlaceholderAddress(blockchain),
          blockchain,
          isActive: true,
          label: `${blockchain} address`,
        });
      }

      return addresses;
    } catch (error) {
      console.error("Error generating addresses:", error);
      return [];
    }
  }

  /**
   * Get crypto balances for an address
   */
  private async getCryptoBalances(address: WalletAddress): Promise<Balance[]> {
    try {
      const balances: Balance[] = [];

      // Get native token balance
      const nativeBalance = await this.getNativeTokenBalance(
        address.address,
        address.blockchain,
      );
      if (nativeBalance > 0) {
        balances.push({
          asset: this.getNativeAsset(address.blockchain),
          amount: nativeBalance,
          locked: 0,
          available: nativeBalance,
          fiatValue: 0, // Will be updated later
          currency: "USD",
          blockchain: address.blockchain,
          lastUpdated: new Date(),
        });
      }

      // Get token balances
      const tokenBalances = await this.getTokenBalances(
        address.address,
        address.blockchain,
      );
      balances.push(...tokenBalances);

      return balances;
    } catch (error) {
      console.error("Error getting crypto balances:", error);
      return [];
    }
  }

  /**
   * Get fiat balances for custodial wallets
   */
  private async getFiatBalances(walletId: string): Promise<Balance[]> {
    try {
      // This would integrate with banking/custody APIs
      const fiatBalances: Balance[] = [
        {
          asset: "USD",
          amount: 1000, // Placeholder
          locked: 0,
          available: 1000,
          fiatValue: 1000,
          currency: "USD",
          lastUpdated: new Date(),
        },
      ];

      return fiatBalances;
    } catch (error) {
      console.error("Error getting fiat balances:", error);
      return [];
    }
  }

  /**
   * Update fiat values for all balances
   */
  private async updateFiatValues(
    balances: Balance[],
    baseCurrency: string,
  ): Promise<Balance[]> {
    try {
      for (const balance of balances) {
        if (balance.asset !== baseCurrency) {
          const price = await this.getAssetPrice(balance.asset, baseCurrency);
          balance.fiatValue = balance.amount * price;
          balance.currency = baseCurrency;
        }
      }

      return balances;
    } catch (error) {
      console.error("Error updating fiat values:", error);
      return balances;
    }
  }

  /**
   * Get asset price in target currency
   */
  private async getAssetPrice(
    asset: string,
    targetCurrency: string,
  ): Promise<number> {
    const cacheKey = `price:${asset}:${targetCurrency}`;
    const cached = this.priceCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.priceCacheTTL) {
      return cached.price;
    }

    try {
      // This would integrate with price APIs like CoinGecko, CoinMarketCap, etc.
      const response = await fetcher.get("/api/prices", {
        params: { asset, currency: targetCurrency },
      });

      const price = response.data.price || 0;
      this.priceCache.set(cacheKey, { price, timestamp: Date.now() });

      return price;
    } catch (error) {
      console.error("Error getting asset price:", error);
      return 0;
    }
  }

  /**
   * Validate transaction
   */
  private async validateTransaction(
    wallet: Wallet,
    toAddress: string,
    amount: number,
    asset: string,
  ): Promise<void> {
    // Check withdrawal limits
    await this.checkWithdrawalLimits(wallet, amount, asset);

    // Validate address format
    if (this.isCryptoAsset(asset)) {
      const blockchain = this.getBlockchainForAsset(asset);
      await this.validateAddress(toAddress, blockchain);
    }

    // Check sufficient balance
    const balances = await this.getBalances(wallet.id);
    const assetBalance = balances.find((b) => b.asset === asset);

    if (!assetBalance || assetBalance.available < amount) {
      throw new Error("Insufficient balance");
    }
  }

  /**
   * Helper methods
   */
  private generatePlaceholderAddress(blockchain: string): string {
    // Generate a placeholder address for demo purposes
    const prefixes = {
      ethereum: "0x",
      polygon: "0x",
      bsc: "0x",
      arbitrum: "0x",
      bitcoin: "1",
    };

    const prefix = prefixes[blockchain as keyof typeof prefixes] || "0x";
    const randomHex = Math.random().toString(16).substring(2, 42);

    return prefix + randomHex.padEnd(40, "0");
  }

  private async getNativeTokenBalance(
    address: string,
    blockchain: string,
  ): Promise<number> {
    try {
      return await blockchainService.getTokenBalance(
        "native",
        address,
        blockchain,
      );
    } catch (error) {
      return 0;
    }
  }

  private async getTokenBalances(
    address: string,
    blockchain: string,
  ): Promise<Balance[]> {
    // This would fetch all token balances for the address
    return [];
  }

  private getNativeAsset(blockchain: string): string {
    const nativeAssets: Record<string, string> = {
      ethereum: "ETH",
      polygon: "MATIC",
      bsc: "BNB",
      arbitrum: "ETH",
      bitcoin: "BTC",
    };

    return nativeAssets[blockchain] || "ETH";
  }

  private isCryptoAsset(asset: string): boolean {
    const cryptoAssets = ["ETH", "BTC", "MATIC", "BNB", "USDC", "USDT"];
    return cryptoAssets.includes(asset);
  }

  private getBlockchainForAsset(asset: string): string {
    const assetBlockchains: Record<string, string> = {
      ETH: "ethereum",
      BTC: "bitcoin",
      MATIC: "polygon",
      BNB: "bsc",
      USDC: "ethereum",
      USDT: "ethereum",
    };

    return assetBlockchains[asset] || "ethereum";
  }

  private async validateAddress(
    address: string,
    blockchain: string,
  ): Promise<void> {
    // Validate address format based on blockchain
    // This is a simplified validation
    if (!address || address.length < 20) {
      throw new Error("Invalid address format");
    }
  }

  private async checkWithdrawalLimits(
    wallet: Wallet,
    amount: number,
    asset: string,
  ): Promise<void> {
    // Check against withdrawal limits
    // This would check daily/weekly/monthly limits
  }

  private async sendCryptoTransaction(
    wallet: Wallet,
    toAddress: string,
    amount: number,
    asset: string,
    options: any,
  ): Promise<Transaction> {
    // This would use the blockchain service to send crypto
    const blockchain = this.getBlockchainForAsset(asset);
    const fromAddress =
      wallet.addresses.find((a) => a.blockchain === blockchain)?.address || "";

    return await blockchainService.transferTokens(
      asset,
      toAddress,
      amount,
      blockchain,
    );
  }

  private async sendFiatTransaction(
    wallet: Wallet,
    toAddress: string,
    amount: number,
    asset: string,
    options: any,
  ): Promise<Transaction> {
    // This would integrate with banking APIs for fiat transfers
    return {
      id: this.generateId(),
      walletId: wallet.id,
      type: "send",
      status: "pending",
      toAddress,
      amount,
      asset,
      fee: 0,
      feeAsset: asset,
      blockchain: "fiat",
      blockNumber: 0,
      confirmations: 0,
      createdAt: new Date(),
    };
  }

  private async getFiatTransactionHistory(
    walletId: string,
  ): Promise<Transaction[]> {
    // This would fetch fiat transaction history
    return [];
  }

  private async validateSwap(
    wallet: Wallet,
    fromAsset: string,
    toAsset: string,
    amount: number,
    quote: SwapQuote,
  ): Promise<void> {
    // Validate swap parameters
  }

  private async executeSwap(
    wallet: Wallet,
    quote: SwapQuote,
  ): Promise<Transaction> {
    // Execute the swap transaction
    return {
      id: this.generateId(),
      walletId: wallet.id,
      type: "swap",
      status: "pending",
      amount: quote.fromAmount,
      asset: quote.fromAsset,
      fee: quote.fee,
      feeAsset: quote.fromAsset,
      blockchain: this.getBlockchainForAsset(quote.fromAsset),
      blockNumber: 0,
      confirmations: 0,
      metadata: {
        swap: {
          fromAsset: quote.fromAsset,
          toAsset: quote.toAsset,
          fromAmount: quote.fromAmount,
          toAmount: quote.toAmount,
          rate: quote.rate,
          slippage: quote.slippage,
        },
      },
      createdAt: new Date(),
    };
  }

  private async validateStaking(
    wallet: Wallet,
    asset: string,
    amount: number,
  ): Promise<void> {
    // Validate staking parameters
  }

  private getFromCache(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.timestamp + this.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private generateId(): string {
    return `wallet_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

// Export the class for manual instantiation when needed
export default WalletService;
