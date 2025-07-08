/**
 * Common TypeScript interfaces to replace 'any' types across the platform
 */

// Base interfaces
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User and Authentication
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
  preferences: UserPreferences;
  culturalProfile: CulturalProfile;
  metadata: Record<string, unknown>;
}

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface CulturalProfile {
  region: string;
  country: string;
  culturalValues: string[];
  religiousRequirements?: string[];
  languagePreferences: string[];
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  thirdPartyIntegrations: boolean;
}

// Analytics and Tracking
export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  eventType: string;
  eventData: Record<string, unknown>;
  timestamp: Date;
  source: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface UserBehaviorData {
  clicks: ClickEvent[];
  scrolls: ScrollEvent[];
  keystrokes: KeystrokeEvent[];
  mouse: MouseEvent[];
  navigation: NavigationEvent[];
}

export interface ClickEvent {
  x: number;
  y: number;
  element: string;
  timestamp: number;
}

export interface ScrollEvent {
  scrollTop: number;
  scrollHeight: number;
  direction: "up" | "down";
  timestamp: number;
}

export interface KeystrokeEvent {
  key: string;
  timeBetweenKeystrokes: number;
  timestamp: number;
}

export interface MouseEvent {
  x: number;
  y: number;
  type: "move" | "click" | "hover";
  timestamp: number;
}

export interface NavigationEvent {
  from: string;
  to: string;
  timestamp: number;
  method: "click" | "back" | "forward" | "direct";
}

// Financial and Investment
export interface FinancialAsset {
  id: string;
  symbol: string;
  name: string;
  type: "stock" | "bond" | "crypto" | "commodity" | "real_estate";
  price: number;
  currency: string;
  marketValue: number;
  change24h: number;
  volume: number;
  metadata: AssetMetadata;
}

export interface AssetMetadata {
  sector?: string;
  industry?: string;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  volatility?: number;
  beta?: number;
  esgScore?: number;
  culturalCompliance?: CulturalCompliance;
}

export interface CulturalCompliance {
  sharia: {
    compliant: boolean;
    score: number;
    issues: string[];
  };
  esg: {
    environmental: number;
    social: number;
    governance: number;
    overall: number;
  };
  cultural: {
    region: string;
    appropriateness: number;
    concerns: string[];
  };
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  totalValue: number;
  currency: string;
  holdings: PortfolioHolding[];
  performance: PerformanceMetrics;
  riskProfile: RiskProfile;
}

export interface PortfolioHolding {
  assetId: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  weight: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface PerformanceMetrics {
  totalReturn: number;
  totalReturnPercent: number;
  sharpeRatio: number;
  volatility: number;
  beta: number;
  maxDrawdown: number;
  timeWeightedReturn: number;
}

export interface RiskProfile {
  level: "conservative" | "moderate" | "aggressive";
  score: number;
  tolerance: number;
  capacity: number;
  timeHorizon: number;
  objectives: string[];
}

// Payment and Subscription
export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  metadata: PaymentMetadata;
}

export interface PaymentMetadata {
  orderId?: string;
  userId?: string;
  planId?: string;
  subscriptionId?: string;
  customFields: Record<string, string>;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: "monthly" | "yearly" | "quarterly";
  features: string[];
  limits: SubscriptionLimits;
}

export interface SubscriptionLimits {
  apiCalls: number;
  storage: number;
  users: number;
  projects: number;
  customFields: Record<string, number>;
}

// Security and Authentication
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: "low" | "medium" | "high" | "critical";
  userId?: string;
  sessionId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  details: SecurityEventDetails;
  resolved: boolean;
}

export type SecurityEventType =
  | "login_attempt"
  | "login_failure"
  | "suspicious_activity"
  | "data_breach"
  | "unauthorized_access"
  | "rate_limit_exceeded"
  | "malware_detected";

export interface SecurityEventDetails {
  description: string;
  riskScore: number;
  mitigationSteps: string[];
  evidence: Record<string, unknown>;
  relatedEvents: string[];
}

// API and Integration
export interface ApiEndpoint {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  description: string;
  parameters: ApiParameter[];
  responses: ApiResponse[];
  authentication: boolean;
  rateLimit: number;
}

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: unknown;
}

export interface DatabaseQuery {
  sql: string;
  parameters: QueryParameter[];
  timeout?: number;
  cacheKey?: string;
  cacheTtl?: number;
}

export interface QueryParameter {
  name: string;
  value: unknown;
  type: "string" | "number" | "boolean" | "date" | "array" | "object";
}

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

// Language and Culture
export interface LanguageData {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  country: string;
  direction: "ltr" | "rtl";
  pluralRules: PluralRule[];
}

export interface PluralRule {
  condition: string;
  form: string;
  example: string;
}

export interface CulturalAdaptation {
  region: string;
  adaptations: AdaptationRule[];
  dateFormats: DateFormat[];
  numberFormats: NumberFormat[];
  colorPreferences: ColorPreference[];
}

export interface AdaptationRule {
  type: "text" | "image" | "color" | "layout";
  selector: string;
  changes: Record<string, unknown>;
  conditions: string[];
}

export interface DateFormat {
  pattern: string;
  example: string;
  usage: string;
}

export interface NumberFormat {
  pattern: string;
  example: string;
  usage: string;
}

export interface ColorPreference {
  name: string;
  hex: string;
  usage: string;
  culturalMeaning: string;
}

// Error Handling
export interface AppError {
  code: string;
  message: string;
  severity: "info" | "warning" | "error" | "critical";
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  stack?: string;
  context: ErrorContext;
}

export interface ErrorContext {
  component?: string;
  action?: string;
  data?: Record<string, unknown>;
  userAgent?: string;
  url?: string;
}

// Configuration
export interface AppConfig {
  api: ApiConfig;
  payment: PaymentConfig;
  security: SecurityConfig;
  features: FeatureConfig;
  analytics: AnalyticsConfig;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  endpoints: Record<string, string>;
}

export interface PaymentConfig {
  providers: PaymentProviderConfig[];
  currencies: string[];
  defaultCurrency: string;
}

export interface PaymentProviderConfig {
  name: string;
  enabled: boolean;
  sandbox: boolean;
  credentials: Record<string, string>;
}

export interface SecurityConfig {
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  mfaRequired: boolean;
}

export interface FeatureConfig {
  flags: Record<string, boolean>;
  experiments: ExperimentConfig[];
}

export interface ExperimentConfig {
  name: string;
  enabled: boolean;
  percentage: number;
  variants: string[];
}

export interface AnalyticsConfig {
  providers: string[];
  sampling: number;
  enabledEvents: string[];
  customDimensions: Record<string, string>;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type Timestamped<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

export type WithMetadata<T> = T & {
  metadata: Record<string, unknown>;
};
