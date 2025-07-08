export interface Wallet {
  id: string;
  userId: string;
  type: "custodial" | "non-custodial" | "hybrid";
  addresses: WalletAddress[];
  balances: Balance[];
  settings: WalletSettings;
  security: SecuritySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletAddress {
  address: string;
  blockchain: string;
  isActive: boolean;
  label?: string;
  derivationPath?: string;
}

export interface Balance {
  asset: string;
  amount: number;
  locked: number;
  available: number;
  fiatValue: number;
  currency: string;
  blockchain?: string;
  contractAddress?: string;
  lastUpdated: Date;
}

export interface WalletSettings {
  defaultCurrency: string;
  preferredLanguage: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  trading: TradingSettings;
}

export interface NotificationSettings {
  priceAlerts: boolean;
  transactionConfirmations: boolean;
  securityAlerts: boolean;
  marketNews: boolean;
  portfolioUpdates: boolean;
}

export interface PrivacySettings {
  hideBalances: boolean;
  anonymousMode: boolean;
  shareData: boolean;
}

export interface TradingSettings {
  slippageTolerance: number;
  gasPreference: "slow" | "standard" | "fast";
  autoApproval: boolean;
  maxTransactionAmount: number;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  sessionTimeout: number;
  whitelistedAddresses: string[];
  withdrawalLimits: WithdrawalLimit[];
}

export interface WithdrawalLimit {
  period: "daily" | "weekly" | "monthly";
  amount: number;
  currency: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type:
    | "send"
    | "receive"
    | "swap"
    | "stake"
    | "unstake"
    | "invest"
    | "withdraw";
  status: "pending" | "confirmed" | "failed" | "cancelled";
  fromAddress?: string;
  toAddress?: string;
  amount: number;
  asset: string;
  fee: number;
  feeAsset: string;
  hash?: string;
  blockchain: string;
  blockNumber?: number;
  confirmations: number;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  confirmedAt?: Date;
}

export interface SwapQuote {
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  slippage: number;
  fee: number;
  route: SwapRoute[];
  validUntil: Date;
  gasEstimate: number;
}

export interface SwapRoute {
  protocol: string;
  poolAddress: string;
  percentage: number;
}
