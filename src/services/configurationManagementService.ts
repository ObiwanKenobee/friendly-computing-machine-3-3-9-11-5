import { singletonPattern } from "../utils/singletonPattern";

export interface ConfigurationSetting {
  key: string;
  value: any;
  type: "string" | "number" | "boolean" | "array" | "object";
  description: string;
  category: string;
  sensitive: boolean;
  environment: "development" | "staging" | "production" | "all";
  lastModified: Date;
  modifiedBy: string;
  validation?: {
    required: boolean;
    minValue?: number;
    maxValue?: number;
    allowedValues?: any[];
    pattern?: string;
  };
}

export interface SystemConfiguration {
  category: string;
  settings: ConfigurationSetting[];
}

class ConfigurationManagementService {
  private configurations: Map<string, SystemConfiguration> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await this.createDefaultConfigurations();

    this.isInitialized = true;
    console.log("Configuration Management Service initialized");
  }

  private async createDefaultConfigurations(): Promise<void> {
    const defaultConfigs: SystemConfiguration[] = [
      {
        category: "security",
        settings: [
          {
            key: "mfa_required",
            value: true,
            type: "boolean",
            description: "Require multi-factor authentication for all users",
            category: "security",
            sensitive: false,
            environment: "all",
            lastModified: new Date(),
            modifiedBy: "system",
            validation: { required: true },
          },
          {
            key: "session_timeout",
            value: 3600,
            type: "number",
            description: "Session timeout in seconds",
            category: "security",
            sensitive: false,
            environment: "all",
            lastModified: new Date(),
            modifiedBy: "system",
            validation: { required: true, minValue: 300, maxValue: 86400 },
          },
          {
            key: "api_rate_limit",
            value: 1000,
            type: "number",
            description: "API rate limit per hour per user",
            category: "security",
            sensitive: false,
            environment: "all",
            lastModified: new Date(),
            modifiedBy: "system",
            validation: { required: true, minValue: 100, maxValue: 10000 },
          },
        ],
      },
      {
        category: "database",
        settings: [
          {
            key: "connection_pool_size",
            value: 20,
            type: "number",
            description: "Maximum database connection pool size",
            category: "database",
            sensitive: false,
            environment: "all",
            lastModified: new Date(),
            modifiedBy: "system",
            validation: { required: true, minValue: 5, maxValue: 100 },
          },
          {
            key: "query_timeout",
            value: 30000,
            type: "number",
            description: "Database query timeout in milliseconds",
            category: "database",
            sensitive: false,
            environment: "all",
            lastModified: new Date(),
            modifiedBy: "system",
            validation: { required: true, minValue: 1000, maxValue: 300000 },
          },
        ],
      },
      {
        category: "features",
        settings: [
          {
            key: "legendary_investor_enabled",
            value: true,
            type: "boolean",
            description: "Enable legendary investor strategy features",
            category: "features",
            sensitive: false,
            environment: "all",
            lastModified: new Date(),
            modifiedBy: "system",
            validation: { required: true },
          },
          {
            key: "ai_explainability_enabled",
            value: true,
            type: "boolean",
            description: "Enable AI explainability dashboard",
            category: "features",
            sensitive: false,
            environment: "all",
            lastModified: new Date(),
            modifiedBy: "system",
            validation: { required: true },
          },
        ],
      },
    ];

    for (const config of defaultConfigs) {
      this.configurations.set(config.category, config);
    }
  }

  async getConfigurations(): Promise<SystemConfiguration[]> {
    return Array.from(this.configurations.values());
  }

  async getConfiguration(
    category: string,
  ): Promise<SystemConfiguration | null> {
    return this.configurations.get(category) || null;
  }

  async updateConfiguration(
    category: string,
    key: string,
    value: any,
  ): Promise<boolean> {
    const config = this.configurations.get(category);
    if (!config) return false;

    const setting = config.settings.find((s) => s.key === key);
    if (!setting) return false;

    // Validate new value
    if (!this.validateValue(setting, value)) {
      throw new Error(`Invalid value for ${key}`);
    }

    setting.value = value;
    setting.lastModified = new Date();
    setting.modifiedBy = "admin"; // In real app, get from context

    return true;
  }

  private validateValue(setting: ConfigurationSetting, value: any): boolean {
    const validation = setting.validation;
    if (!validation) return true;

    if (validation.required && (value === null || value === undefined)) {
      return false;
    }

    if (setting.type === "number") {
      if (typeof value !== "number") return false;
      if (validation.minValue !== undefined && value < validation.minValue)
        return false;
      if (validation.maxValue !== undefined && value > validation.maxValue)
        return false;
    }

    if (validation.allowedValues && !validation.allowedValues.includes(value)) {
      return false;
    }

    if (validation.pattern && typeof value === "string") {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) return false;
    }

    return true;
  }
}

export const configurationManagementService = singletonPattern(
  () => new ConfigurationManagementService(),
);
