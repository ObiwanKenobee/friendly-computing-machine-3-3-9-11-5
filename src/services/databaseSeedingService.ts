import { superAdminAuthService } from "./superAdminAuthService";
import { DatabaseUser } from "@/types/common";

export interface SeedingResult {
  success: boolean;
  message: string;
  details?: string[];
}

export class DatabaseSeedingService {
  private static instance: DatabaseSeedingService;

  static getInstance(): DatabaseSeedingService {
    if (!DatabaseSeedingService.instance) {
      DatabaseSeedingService.instance = new DatabaseSeedingService();
    }
    return DatabaseSeedingService.instance;
  }

  private constructor() {}

  /**
   * Run all database seeding operations
   */
  async seedDatabase(): Promise<SeedingResult> {
    console.log("🌱 Starting database seeding...");
    const results: string[] = [];
    let hasErrors = false;

    try {
      // 1. Seed Super Admin
      const superAdminResult = await this.seedSuperAdmin();
      results.push(superAdminResult);

      // 2. Seed Default Users
      const usersResult = await this.seedDefaultUsers();
      results.push(usersResult);

      // 3. Seed System Configuration
      const configResult = await this.seedSystemConfiguration();
      results.push(configResult);

      // 4. Seed Sample Data
      const sampleDataResult = await this.seedSampleData();
      results.push(sampleDataResult);

      console.log("✅ Database seeding completed successfully");

      return {
        success: !hasErrors,
        message: "Database seeding completed",
        details: results,
      };
    } catch (error) {
      console.error("❌ Database seeding failed:", error);

      return {
        success: false,
        message: "Database seeding failed",
        details: [
          ...results,
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        ],
      };
    }
  }

  /**
   * Seed Super Admin User
   */
  private async seedSuperAdmin(): Promise<string> {
    try {
      const success = await superAdminAuthService.seedDefaultSuperAdmin();

      if (success) {
        return "✅ Super Admin: Created successfully";
      } else {
        return "⚠️  Super Admin: Already exists or seeding skipped";
      }
    } catch (error) {
      console.error("Super Admin seeding failed:", error);
      return "❌ Super Admin: Seeding failed";
    }
  }

  /**
   * Seed default regular users
   */
  private async seedDefaultUsers(): Promise<string> {
    try {
      const defaultUsers = this.getDefaultUsers();
      const existingUsers = this.getStoredRegularUsers();

      // Only seed if no users exist
      if (existingUsers.length === 0) {
        localStorage.setItem("regular_users", JSON.stringify(defaultUsers));
        return `✅ Regular Users: Seeded ${defaultUsers.length} default users`;
      } else {
        return `⚠️  Regular Users: ${existingUsers.length} users already exist`;
      }
    } catch (error) {
      console.error("Regular users seeding failed:", error);
      return "❌ Regular Users: Seeding failed";
    }
  }

  /**
   * Seed system configuration
   */
  private async seedSystemConfiguration(): Promise<string> {
    try {
      const defaultConfig = {
        appName: "QuantumVest Enterprise",
        version: "1.0.0",
        environment: import.meta.env.MODE || "development",
        features: {
          mfaEnabled: true,
          auditLogging: true,
          realTimeMonitoring: true,
          backupSchedule: "daily",
          maintenanceMode: false,
        },
        security: {
          sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
          maxLoginAttempts: 5,
          lockoutDuration: 30 * 60 * 1000, // 30 minutes
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
          },
        },
        database: {
          maxConnections: 100,
          queryTimeout: 30000,
          backupRetention: 30, // days
        },
        monitoring: {
          healthCheckInterval: 60000, // 1 minute
          alertThresholds: {
            cpuUsage: 80,
            memoryUsage: 85,
            diskUsage: 90,
            responseTime: 2000,
          },
        },
        seededAt: new Date().toISOString(),
      };

      const existingConfig = localStorage.getItem("system_config");
      if (!existingConfig) {
        localStorage.setItem("system_config", JSON.stringify(defaultConfig));
        return "✅ System Config: Default configuration seeded";
      } else {
        return "⚠️  System Config: Configuration already exists";
      }
    } catch (error) {
      console.error("System configuration seeding failed:", error);
      return "❌ System Config: Seeding failed";
    }
  }

  /**
   * Seed sample data for testing
   */
  private async seedSampleData(): Promise<string> {
    try {
      const sampleData = {
        auditLogs: this.generateSampleAuditLogs(),
        systemMetrics: this.generateSampleMetrics(),
        userActivities: this.generateSampleUserActivities(),
        seededAt: new Date().toISOString(),
      };

      const existingData = localStorage.getItem("sample_data");
      if (!existingData) {
        localStorage.setItem("sample_data", JSON.stringify(sampleData));
        return "✅ Sample Data: Test data seeded successfully";
      } else {
        return "⚠️  Sample Data: Sample data already exists";
      }
    } catch (error) {
      console.error("Sample data seeding failed:", error);
      return "❌ Sample Data: Seeding failed";
    }
  }

  /**
   * Get default regular users for seeding
   */
  private getDefaultUsers(): DatabaseUser[] {
    return [
      {
        id: "user_001",
        username: "john.doe",
        email: "john.doe@quantumvest.com",
        fullName: "John Doe",
        passwordHash: "hashed_password_1", // In production, properly hash these
        role: "user",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user_002",
        username: "sarah.smith",
        email: "sarah.smith@quantumvest.com",
        fullName: "Sarah Smith",
        passwordHash: "hashed_password_2",
        role: "analyst",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user_003",
        username: "mike.johnson",
        email: "mike.johnson@quantumvest.com",
        fullName: "Mike Johnson",
        passwordHash: "hashed_password_3",
        role: "manager",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Generate sample audit logs
   */
  private generateSampleAuditLogs(): Array<any> {
    const actions = [
      "login",
      "logout",
      "data_access",
      "config_change",
      "user_creation",
    ];
    const users = ["john.doe", "sarah.smith", "mike.johnson", "superadmin"];
    const logs = [];

    for (let i = 0; i < 50; i++) {
      logs.push({
        id: `audit_${i + 1}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        user: users[Math.floor(Math.random() * users.length)],
        timestamp: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        details: `Sample audit log entry ${i + 1}`,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        success: Math.random() > 0.1, // 90% success rate
      });
    }

    return logs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  /**
   * Generate sample system metrics
   */
  private generateSampleMetrics(): Array<any> {
    const metrics = [];
    const now = Date.now();

    for (let i = 0; i < 24; i++) {
      // 24 hours of data
      metrics.push({
        timestamp: new Date(now - i * 60 * 60 * 1000).toISOString(),
        cpuUsage: Math.random() * 100,
        memoryUsage: 60 + Math.random() * 30,
        diskUsage: 45 + Math.random() * 20,
        networkLatency: 50 + Math.random() * 100,
        activeUsers: Math.floor(800 + Math.random() * 400),
        requestsPerSecond: Math.floor(100 + Math.random() * 200),
      });
    }

    return metrics.reverse(); // Chronological order
  }

  /**
   * Generate sample user activities
   */
  private generateSampleUserActivities(): Array<any> {
    const activities = [
      "page_view",
      "button_click",
      "form_submit",
      "file_download",
      "api_call",
    ];
    const pages = ["dashboard", "analytics", "settings", "reports", "profile"];
    const userActivities = [];

    for (let i = 0; i < 100; i++) {
      userActivities.push({
        id: `activity_${i + 1}`,
        userId: `user_${Math.floor(Math.random() * 3) + 1}`,
        activity: activities[Math.floor(Math.random() * activities.length)],
        page: pages[Math.floor(Math.random() * pages.length)],
        timestamp: new Date(
          Date.now() - Math.random() * 24 * 60 * 60 * 1000,
        ).toISOString(),
        duration: Math.floor(Math.random() * 300000), // up to 5 minutes
        metadata: {
          browser: "Chrome",
          device: "Desktop",
          location: "New York",
        },
      });
    }

    return userActivities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  /**
   * Get stored regular users
   */
  private getStoredRegularUsers(): DatabaseUser[] {
    const stored = localStorage.getItem("regular_users");
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Clear all seeded data (for testing purposes)
   */
  async clearSeededData(): Promise<void> {
    console.log("🧹 Clearing all seeded data...");

    const keysToRemove = [
      "superadmin_users",
      "regular_users",
      "system_config",
      "sample_data",
      "superadmin_sessions",
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    console.log("✅ All seeded data cleared");
  }

  /**
   * Get seeding status
   */
  getSeedingStatus(): {
    superAdmin: boolean;
    regularUsers: boolean;
    systemConfig: boolean;
    sampleData: boolean;
  } {
    return {
      superAdmin: localStorage.getItem("superadmin_users") !== null,
      regularUsers: localStorage.getItem("regular_users") !== null,
      systemConfig: localStorage.getItem("system_config") !== null,
      sampleData: localStorage.getItem("sample_data") !== null,
    };
  }
}

// Export singleton instance
export const databaseSeedingService = DatabaseSeedingService.getInstance();
export default DatabaseSeedingService;
