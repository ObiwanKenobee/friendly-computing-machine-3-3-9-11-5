/**
 * Payment Processing Type Definitions
 * Comprehensive types for PayPal and Paystack integration
 */

export interface PaymentConfig {
  paypal: {
    clientId: string;
    clientSecret: string;
    environment: "sandbox" | "live";
    webhookId?: string;
  };
  paystack: {
    publicKey: string;
    secretKey: string;
    environment: "test" | "live";
    webhookSecret?: string;
  };
  security: {
    encryptionKey: string;
    maxAmount: number;
    allowedCurrencies: string[];
    ipWhitelist?: string[];
  };
}

export interface PaymentMethod {
  id: string;
  type: "paypal" | "paystack" | "card" | "bank_transfer" | "mobile_money";
  provider: "paypal" | "paystack";
  name: string;
  description: string;
  isActive: boolean;
  supportedCurrencies: string[];
  supportedCountries: string[];
  processingTime: string;
  fees: PaymentFees;
  limits: PaymentLimits;
}

export interface PaymentFees {
  percentage: number;
  fixed: number;
  currency: string;
  minimumFee?: number;
  maximumFee?: number;
  crossBorderFee?: number;
  chargeback?: number;
}

export interface PaymentLimits {
  minimum: number;
  maximum: number;
  daily?: number;
  monthly?: number;
  currency: string;
}

export interface PaymentCustomer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: PaymentAddress;
  metadata?: Record<string, any>;
  riskScore?: number;
  verified: boolean;
  createdAt: Date;
  lastPayment?: Date;
}

export interface PaymentAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentInstrument {
  id: string;
  type: "credit_card" | "debit_card" | "bank_account" | "digital_wallet";
  provider: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isVerified: boolean;
  metadata?: Record<string, any>;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status:
    | "created"
    | "pending"
    | "authorized"
    | "captured"
    | "cancelled"
    | "expired";
  customer: PaymentCustomer;
  items?: PaymentItem[];
  shipping?: PaymentShipping;
  tax?: PaymentTax;
  discounts?: PaymentDiscount[];
  metadata?: Record<string, any>;
  createdAt: Date;
  expiresAt?: Date;
}

export interface PaymentItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  category?: string;
  sku?: string;
  taxable: boolean;
}

export interface PaymentShipping {
  method: string;
  cost: number;
  currency: string;
  address: PaymentAddress;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export interface PaymentTax {
  amount: number;
  currency: string;
  rate: number;
  type: "vat" | "sales_tax" | "gst";
  jurisdiction: string;
}

export interface PaymentDiscount {
  id: string;
  code?: string;
  type: "percentage" | "fixed_amount";
  value: number;
  amount: number;
  currency: string;
  description: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  paymentId: string;
  provider: "paypal" | "paystack";
  providerTransactionId: string;
  type: "payment" | "refund" | "chargeback" | "dispute";
  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "disputed";
  amount: number;
  currency: string;
  fees: PaymentFees;
  netAmount: number;
  customer: PaymentCustomer;
  paymentMethod: PaymentMethod;
  processingTime?: number;
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  settledAt?: Date;
}

export interface PaymentRefund {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  reason: string;
  status: "pending" | "processing" | "completed" | "failed";
  provider: "paypal" | "paystack";
  providerRefundId: string;
  requestedBy: string;
  approvedBy?: string;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  processedAt?: Date;
}

export interface PaymentDispute {
  id: string;
  transactionId: string;
  type:
    | "chargeback"
    | "inquiry"
    | "fraud"
    | "authorization"
    | "processing_error";
  status: "open" | "under_review" | "waiting_response" | "resolved" | "lost";
  amount: number;
  currency: string;
  reason: string;
  evidence?: PaymentDisputeEvidence[];
  provider: "paypal" | "paystack";
  providerDisputeId: string;
  dueDate?: Date;
  resolvedAt?: Date;
  outcome?: "won" | "lost" | "liability_shifted";
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface PaymentDisputeEvidence {
  id: string;
  type:
    | "receipt"
    | "shipping_proof"
    | "customer_communication"
    | "service_proof"
    | "other";
  description: string;
  fileUrl?: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface PaymentWebhook {
  id: string;
  provider: "paypal" | "paystack";
  eventType: string;
  eventId: string;
  data: any;
  signature: string;
  verified: boolean;
  processed: boolean;
  attempts: number;
  maxAttempts: number;
  lastAttempt?: Date;
  nextAttempt?: Date;
  error?: string;
  createdAt: Date;
  processedAt?: Date;
}

export interface PaymentAnalytics {
  period: "hour" | "day" | "week" | "month" | "year";
  startDate: Date;
  endDate: Date;
  metrics: {
    totalTransactions: number;
    totalAmount: number;
    currency: string;
    successRate: number;
    averageAmount: number;
    refundRate: number;
    chargebackRate: number;
    disputeRate: number;
    processingTime: {
      average: number;
      p50: number;
      p95: number;
      p99: number;
    };
  };
  breakdown: {
    byProvider: Record<string, PaymentMetrics>;
    byPaymentMethod: Record<string, PaymentMetrics>;
    byCurrency: Record<string, PaymentMetrics>;
    byCountry: Record<string, PaymentMetrics>;
    byStatus: Record<string, number>;
  };
}

export interface PaymentMetrics {
  count: number;
  amount: number;
  successRate: number;
  averageAmount: number;
  fees: number;
}

export interface PaymentSecurityEvent {
  id: string;
  type:
    | "fraud_attempt"
    | "suspicious_activity"
    | "velocity_breach"
    | "blacklist_match"
    | "rule_violation";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  transactionId?: string;
  customerId?: string;
  ipAddress: string;
  userAgent: string;
  geolocation?: {
    country: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  riskScore: number;
  action: "allow" | "review" | "block" | "challenge";
  rules: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface PaymentSettings {
  general: {
    companyName: string;
    supportEmail: string;
    defaultCurrency: string;
    timezone: string;
    locale: string;
  };
  paypal: {
    enabled: boolean;
    environment: "sandbox" | "live";
    brandName: string;
    logoUrl?: string;
    colorScheme?: "blue" | "gold" | "silver" | "white" | "black";
    shape?: "pill" | "rect";
    layout?: "vertical" | "horizontal";
  };
  paystack: {
    enabled: boolean;
    environment: "test" | "live";
    brandName: string;
    logoUrl?: string;
    primaryColor?: string;
    supportedChannels: string[];
  };
  security: {
    fraudDetection: boolean;
    velocityChecking: boolean;
    ipWhitelisting: boolean;
    amountLimits: boolean;
    geolocationBlocking: boolean;
    requireCvv: boolean;
    require3ds: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    webhookNotifications: boolean;
    smsNotifications: boolean;
    slackIntegration?: {
      enabled: boolean;
      webhookUrl: string;
      channels: string[];
    };
  };
  reconciliation: {
    autoReconciliation: boolean;
    reconciliationSchedule: string;
    discrepancyThreshold: number;
    alertOnDiscrepancy: boolean;
  };
}

export interface PaymentIntegration {
  id: string;
  name: string;
  type:
    | "accounting"
    | "crm"
    | "erp"
    | "analytics"
    | "notifications"
    | "fraud"
    | "other";
  provider: string;
  enabled: boolean;
  config: Record<string, any>;
  lastSync?: Date;
  syncStatus: "success" | "error" | "pending";
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentReport {
  id: string;
  name: string;
  type:
    | "transactions"
    | "settlements"
    | "disputes"
    | "refunds"
    | "fees"
    | "reconciliation";
  format: "csv" | "excel" | "pdf" | "json";
  filters: Record<string, any>;
  schedule?: {
    frequency: "daily" | "weekly" | "monthly";
    time: string;
    timezone: string;
    recipients: string[];
  };
  lastGenerated?: Date;
  fileUrl?: string;
  status: "pending" | "generating" | "completed" | "failed";
  createdAt: Date;
  createdBy: string;
}

// API Response Types
export interface PaymentApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Event Types
export type PaymentEventType =
  | "payment.created"
  | "payment.pending"
  | "payment.completed"
  | "payment.failed"
  | "payment.cancelled"
  | "refund.created"
  | "refund.completed"
  | "dispute.created"
  | "dispute.resolved"
  | "webhook.failed"
  | "security.fraud_detected";

export interface PaymentEvent {
  id: string;
  type: PaymentEventType;
  data: any;
  timestamp: Date;
  version: string;
}
