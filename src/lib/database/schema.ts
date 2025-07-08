/**
 * QuantumVest Enterprise Database Schema
 * Complete type definitions and models for all platform entities
 */

export interface User {
  id: string;
  email: string;
  username?: string;
  password_hash: string;
  role: "user" | "admin" | "enterprise" | "super_admin";
  subscription_tier:
    | "free"
    | "starter"
    | "professional"
    | "enterprise"
    | "ultra";
  security_level: "standard" | "enhanced" | "military";

  // Profile Information
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  timezone: string;
  language: string;
  country: string;

  // Enterprise Features
  organization_id?: string;
  department?: string;
  employee_id?: string;
  clearance_level?: number;

  // Security & Auth
  mfa_enabled: boolean;
  mfa_secret?: string;
  last_login?: Date;
  login_attempts: number;
  locked_until?: Date;
  password_reset_token?: string;
  password_reset_expires?: Date;

  // Subscription & Billing
  stripe_customer_id?: string;
  paypal_customer_id?: string;
  subscription_status:
    | "active"
    | "inactive"
    | "trial"
    | "cancelled"
    | "expired";
  subscription_expires?: Date;
  trial_ends?: Date;
  billing_cycle: "monthly" | "annual";

  // Activity Tracking
  created_at: Date;
  updated_at: Date;
  last_active?: Date;
  deleted_at?: Date;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: "startup" | "small" | "medium" | "large" | "enterprise";

  // Enterprise Configuration
  subscription_tier: "enterprise" | "ultra";
  max_users: number;
  features_enabled: string[];
  security_policies: SecurityPolicy[];

  // Billing
  billing_email: string;
  billing_address: Address;
  tax_id?: string;

  // Metadata
  created_at: Date;
  updated_at: Date;
  created_by: string;
}

export interface SecurityPolicy {
  id: string;
  organization_id: string;
  name: string;
  type:
    | "authentication"
    | "authorization"
    | "data_access"
    | "network"
    | "compliance";
  rules: Record<string, any>;
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  user_id: string;
  organization_id?: string;

  // Payment Details
  amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  payment_method: "stripe" | "paypal" | "paystack" | "crypto" | "bank_transfer";

  // External References
  stripe_payment_intent_id?: string;
  paypal_order_id?: string;
  paystack_reference?: string;
  crypto_transaction_hash?: string;

  // Subscription
  subscription_id?: string;
  subscription_period_start?: Date;
  subscription_period_end?: Date;

  // Metadata
  description: string;
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: string;
  user_id: string;
  organization_id?: string;

  // Subscription Details
  tier: "free" | "starter" | "professional" | "enterprise" | "ultra";
  status: "active" | "trialing" | "past_due" | "canceled" | "unpaid";
  billing_cycle: "monthly" | "annual";

  // Dates
  current_period_start: Date;
  current_period_end: Date;
  trial_start?: Date;
  trial_end?: Date;
  canceled_at?: Date;
  ended_at?: Date;

  // External References
  stripe_subscription_id?: string;
  paypal_subscription_id?: string;

  // Usage & Limits
  usage_limits: UsageLimits;
  current_usage: CurrentUsage;

  // Metadata
  created_at: Date;
  updated_at: Date;
}

export interface UsageLimits {
  api_calls_per_month: number;
  storage_gb: number;
  users: number;
  features: string[];
  support_level: "community" | "email" | "priority" | "dedicated";
}

export interface CurrentUsage {
  api_calls_this_month: number;
  storage_used_gb: number;
  active_users: number;
  last_calculated: Date;
}

export interface UserInteraction {
  id: string;
  user_id?: string;
  session_id: string;

  // Interaction Details
  type:
    | "click"
    | "scroll"
    | "hover"
    | "focus"
    | "blur"
    | "keypress"
    | "form_submit";
  element: string;
  page_url: string;
  page_title: string;

  // Position & Context
  position: { x: number; y: number };
  viewport: { width: number; height: number };
  device_type: "desktop" | "tablet" | "mobile";
  browser: string;
  os: string;

  // Timing
  timestamp: Date;
  duration?: number;

  // User Context
  authenticated: boolean;
  subscription_tier?: string;
  user_agent: string;
  ip_address?: string;

  // Metadata
  metadata: Record<string, any>;
}

export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  session_id: string;

  // Event Details
  event_name: string;
  event_category: string;
  event_action: string;
  event_label?: string;
  event_value?: number;

  // Page Context
  page_url: string;
  page_title: string;
  referrer?: string;

  // User Context
  user_properties: Record<string, any>;
  device_properties: Record<string, any>;

  // Timestamp
  timestamp: Date;
  server_timestamp: Date;

  // Metadata
  metadata: Record<string, any>;
}

export interface SecurityEvent {
  id: string;
  user_id?: string;
  organization_id?: string;

  // Event Details
  event_type:
    | "login_attempt"
    | "login_success"
    | "login_failure"
    | "mfa_challenge"
    | "password_reset"
    | "suspicious_activity"
    | "policy_violation";
  severity: "low" | "medium" | "high" | "critical";
  description: string;

  // Context
  ip_address: string;
  user_agent: string;
  location: GeoLocation;

  // Risk Assessment
  risk_score: number;
  threat_indicators: string[];
  automated_response?: string;

  // Investigation
  investigated: boolean;
  investigated_by?: string;
  investigation_notes?: string;

  // Timestamp
  timestamp: Date;

  // Metadata
  metadata: Record<string, any>;
}

export interface GeoLocation {
  country: string;
  region: string;
  city: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
}

export interface Address {
  street_line1: string;
  street_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface APIKey {
  id: string;
  user_id: string;
  organization_id?: string;

  // Key Details
  name: string;
  key_hash: string;
  prefix: string;

  // Permissions
  scopes: string[];
  rate_limit: number;

  // Status
  active: boolean;
  last_used?: Date;
  usage_count: number;

  // Dates
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface SystemConfiguration {
  id: string;
  key: string;
  value: any;
  type: "string" | "number" | "boolean" | "json" | "encrypted";
  description: string;

  // Access Control
  environment: "development" | "staging" | "production";
  requires_restart: boolean;

  // Metadata
  created_at: Date;
  updated_at: Date;
  updated_by: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  organization_id?: string;

  // Action Details
  action: string;
  resource_type: string;
  resource_id?: string;
  changes: Record<string, any>;

  // Context
  ip_address: string;
  user_agent: string;
  api_endpoint?: string;

  // Result
  success: boolean;
  error_message?: string;

  // Timestamp
  timestamp: Date;

  // Metadata
  metadata: Record<string, any>;
}

export interface NotificationPreference {
  id: string;
  user_id: string;

  // Channels
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;

  // Types
  security_alerts: boolean;
  billing_notifications: boolean;
  product_updates: boolean;
  marketing_communications: boolean;

  // Frequency
  digest_frequency: "immediate" | "daily" | "weekly" | "monthly";
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  timezone: string;

  // Metadata
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: string;
  user_id?: string;

  // Session Details
  session_token: string;
  device_fingerprint: string;
  ip_address: string;
  user_agent: string;

  // Timing
  created_at: Date;
  last_active: Date;
  expires_at: Date;

  // Context
  authenticated: boolean;
  mfa_verified: boolean;
  location: GeoLocation;

  // Security
  revoked: boolean;
  revoked_reason?: string;
  revoked_at?: Date;

  // Metadata
  metadata: Record<string, any>;
}

// Type guards and utility functions
export const isEnterpriseUser = (user: User): boolean => {
  return ["enterprise", "ultra"].includes(user.subscription_tier);
};

export const hasPermission = (user: User, permission: string): boolean => {
  // Implement role-based permission checking
  const rolePermissions: Record<string, string[]> = {
    user: ["read_own_data", "update_own_profile"],
    admin: [
      "read_own_data",
      "update_own_profile",
      "manage_users",
      "view_analytics",
    ],
    enterprise: [
      "read_own_data",
      "update_own_profile",
      "manage_organization",
      "view_analytics",
      "access_enterprise_features",
    ],
    super_admin: ["*"], // All permissions
  };

  const userPermissions = rolePermissions[user.role] || [];
  return userPermissions.includes("*") || userPermissions.includes(permission);
};

export const isSubscriptionActive = (subscription: Subscription): boolean => {
  return (
    ["active", "trialing"].includes(subscription.status) &&
    new Date() < subscription.current_period_end
  );
};

export const calculateRiskScore = (events: SecurityEvent[]): number => {
  // Implement risk scoring algorithm
  const recentEvents = events.filter(
    (e) => new Date().getTime() - e.timestamp.getTime() < 24 * 60 * 60 * 1000,
  );

  const totalRisk = recentEvents.reduce(
    (sum, event) => sum + event.risk_score,
    0,
  );
  return Math.min(totalRisk, 100);
};

// Database relationships and indexes
export const DatabaseIndexes = {
  users: [
    "email",
    "username",
    "subscription_tier",
    "organization_id",
    "created_at",
    "last_active",
  ],
  organizations: ["domain", "subscription_tier", "created_at"],
  payments: [
    "user_id",
    "organization_id",
    "status",
    "payment_method",
    "created_at",
  ],
  subscriptions: [
    "user_id",
    "organization_id",
    "status",
    "tier",
    "current_period_end",
  ],
  user_interactions: ["user_id", "session_id", "timestamp", "page_url", "type"],
  security_events: [
    "user_id",
    "organization_id",
    "event_type",
    "severity",
    "timestamp",
    "risk_score",
  ],
  audit_logs: [
    "user_id",
    "organization_id",
    "action",
    "resource_type",
    "timestamp",
  ],
};

export type DatabaseEntity =
  | User
  | Organization
  | Payment
  | Subscription
  | UserInteraction
  | AnalyticsEvent
  | SecurityEvent
  | APIKey
  | SystemConfiguration
  | AuditLog
  | NotificationPreference
  | Session;
