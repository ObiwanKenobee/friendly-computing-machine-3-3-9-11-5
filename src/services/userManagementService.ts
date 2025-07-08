import { singletonPattern } from "../utils/singletonPattern";

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role:
    | "super_admin"
    | "admin"
    | "moderator"
    | "enterprise_user"
    | "premium_user"
    | "standard_user";
  status:
    | "active"
    | "inactive"
    | "suspended"
    | "pending_verification"
    | "locked";
  permissions: string[];
  groups: string[];
  profile: {
    avatar?: string;
    phone?: string;
    timezone: string;
    language: string;
    twoFactorEnabled: boolean;
    lastLogin?: Date;
    loginCount: number;
    createdAt: Date;
    updatedAt: Date;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    theme: "light" | "dark" | "auto";
    dashboard: Record<string, any>;
  };
  security: {
    passwordLastChanged: Date;
    failedLoginAttempts: number;
    accountLockedUntil?: Date;
    sessionTimeout: number; // minutes
    ipWhitelist?: string[];
    deviceTrust: Array<{
      deviceId: string;
      deviceName: string;
      trusted: boolean;
      lastSeen: Date;
    }>;
  };
  subscription: {
    tier: "free" | "starter" | "professional" | "enterprise";
    status: "active" | "cancelled" | "expired" | "trial";
    startDate: Date;
    endDate?: Date;
    features: string[];
    usage: Record<string, number>;
  };
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  members: string[]; // user IDs
  parentGroup?: string;
  type: "department" | "role" | "project" | "region" | "custom";
  settings: {
    autoAssign: boolean;
    autoAssignRules: Array<{
      condition: string;
      value: any;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  actions: string[]; // 'create', 'read', 'update', 'delete', 'execute'
  conditions?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  category: "system" | "user" | "financial" | "content" | "api" | "admin";
}

export interface UserSession {
  sessionId: string;
  userId: string;
  deviceInfo: {
    userAgent: string;
    ip: string;
    location?: string;
    deviceType: "desktop" | "mobile" | "tablet";
  };
  startTime: Date;
  lastActivity: Date;
  expiresAt: Date;
  status: "active" | "expired" | "revoked";
}

export interface UserActivity {
  id: string;
  userId: string;
  sessionId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  timestamp: Date;
  ip: string;
  userAgent: string;
  outcome: "success" | "failure" | "blocked";
}

export interface BulkOperation {
  id: string;
  type: "create" | "update" | "delete" | "suspend" | "activate" | "export";
  targetUsers: string[];
  parameters: Record<string, any>;
  status: "pending" | "in_progress" | "completed" | "failed" | "cancelled";
  progress: number; // 0-100
  results: {
    successful: number;
    failed: number;
    errors: Array<{
      userId: string;
      error: string;
    }>;
  };
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
}

class UserManagementService {
  private users: Map<string, User> = new Map();
  private groups: Map<string, UserGroup> = new Map();
  private permissions: Map<string, Permission> = new Map();
  private sessions: Map<string, UserSession> = new Map();
  private activities: UserActivity[] = [];
  private bulkOperations: Map<string, BulkOperation> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize with sample data
    await this.createSamplePermissions();
    await this.createSampleGroups();
    await this.createSampleUsers();

    // Start background processes
    this.startSessionCleanup();
    this.startActivityTracking();
    this.startSecurityMonitoring();

    this.isInitialized = true;
    console.log(
      "User Management Service initialized with enterprise user provisioning",
    );
  }

  private async createSamplePermissions(): Promise<void> {
    const samplePermissions: Permission[] = [
      {
        id: "perm-system-admin",
        name: "System Administration",
        description: "Full system administration access",
        resource: "system",
        actions: ["create", "read", "update", "delete", "execute"],
        category: "system",
      },
      {
        id: "perm-user-manage",
        name: "User Management",
        description: "Manage users and their permissions",
        resource: "users",
        actions: ["create", "read", "update", "delete"],
        category: "user",
      },
      {
        id: "perm-financial-view",
        name: "Financial Data View",
        description: "View financial data and reports",
        resource: "financial",
        actions: ["read"],
        category: "financial",
      },
      {
        id: "perm-financial-trade",
        name: "Financial Trading",
        description: "Execute financial transactions and trades",
        resource: "financial",
        actions: ["create", "read", "update", "execute"],
        category: "financial",
      },
      {
        id: "perm-api-access",
        name: "API Access",
        description: "Access to API endpoints",
        resource: "api",
        actions: ["read", "execute"],
        category: "api",
      },
    ];

    for (const permission of samplePermissions) {
      this.permissions.set(permission.id, permission);
    }
  }

  private async createSampleGroups(): Promise<void> {
    const sampleGroups: UserGroup[] = [
      {
        id: "group-super-admins",
        name: "Super Administrators",
        description: "System super administrators with full access",
        permissions: [
          "perm-system-admin",
          "perm-user-manage",
          "perm-financial-view",
          "perm-financial-trade",
        ],
        members: [],
        type: "role",
        settings: {
          autoAssign: false,
          autoAssignRules: [],
        },
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date(),
      },
      {
        id: "group-enterprise-users",
        name: "Enterprise Users",
        description: "Enterprise tier users with advanced features",
        permissions: [
          "perm-financial-view",
          "perm-financial-trade",
          "perm-api-access",
        ],
        members: [],
        type: "role",
        settings: {
          autoAssign: true,
          autoAssignRules: [
            { condition: "subscription.tier", value: "enterprise" },
          ],
        },
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date(),
      },
      {
        id: "group-premium-users",
        name: "Premium Users",
        description: "Premium tier users with enhanced features",
        permissions: ["perm-financial-view", "perm-financial-trade"],
        members: [],
        type: "role",
        settings: {
          autoAssign: true,
          autoAssignRules: [
            { condition: "subscription.tier", value: "professional" },
          ],
        },
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date(),
      },
    ];

    for (const group of sampleGroups) {
      this.groups.set(group.id, group);
    }
  }

  private async createSampleUsers(): Promise<void> {
    const sampleUsers: User[] = [
      {
        id: "user-super-admin",
        email: "admin@quantumvest.io",
        username: "superadmin",
        firstName: "System",
        lastName: "Administrator",
        role: "super_admin",
        status: "active",
        permissions: ["perm-system-admin"],
        groups: ["group-super-admins"],
        profile: {
          timezone: "UTC",
          language: "en-US",
          twoFactorEnabled: true,
          lastLogin: new Date(),
          loginCount: 1247,
          createdAt: new Date("2023-01-01"),
          updatedAt: new Date(),
        },
        preferences: {
          emailNotifications: true,
          smsNotifications: true,
          marketingEmails: false,
          theme: "dark",
          dashboard: { layout: "advanced" },
        },
        security: {
          passwordLastChanged: new Date("2024-02-15"),
          failedLoginAttempts: 0,
          sessionTimeout: 480, // 8 hours
          deviceTrust: [],
        },
        subscription: {
          tier: "enterprise",
          status: "active",
          startDate: new Date("2023-01-01"),
          features: ["unlimited_api", "priority_support", "advanced_analytics"],
          usage: {},
        },
      },
      {
        id: "user-enterprise-001",
        email: "john.doe@enterprise.com",
        username: "john.doe",
        firstName: "John",
        lastName: "Doe",
        role: "enterprise_user",
        status: "active",
        permissions: ["perm-financial-view", "perm-financial-trade"],
        groups: ["group-enterprise-users"],
        profile: {
          phone: "+1-555-0123",
          timezone: "America/New_York",
          language: "en-US",
          twoFactorEnabled: true,
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          loginCount: 89,
          createdAt: new Date("2023-06-15"),
          updatedAt: new Date(),
        },
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: true,
          theme: "light",
          dashboard: { layout: "standard" },
        },
        security: {
          passwordLastChanged: new Date("2024-01-20"),
          failedLoginAttempts: 0,
          sessionTimeout: 240, // 4 hours
          deviceTrust: [
            {
              deviceId: "device-laptop-001",
              deviceName: "MacBook Pro",
              trusted: true,
              lastSeen: new Date(),
            },
          ],
        },
        subscription: {
          tier: "enterprise",
          status: "active",
          startDate: new Date("2023-06-15"),
          endDate: new Date("2024-06-15"),
          features: ["advanced_trading", "api_access", "priority_support"],
          usage: { api_calls: 45230, trades: 156 },
        },
      },
    ];

    for (const user of sampleUsers) {
      this.users.set(user.id, user);

      // Add users to their groups
      for (const groupId of user.groups) {
        const group = this.groups.get(groupId);
        if (group && !group.members.includes(user.id)) {
          group.members.push(user.id);
        }
      }
    }
  }

  async createUser(
    userData: Omit<User, "id" | "profile" | "security" | "subscription">,
  ): Promise<User> {
    const user: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      profile: {
        timezone: "UTC",
        language: "en-US",
        twoFactorEnabled: false,
        loginCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      security: {
        passwordLastChanged: new Date(),
        failedLoginAttempts: 0,
        sessionTimeout: 240, // 4 hours default
        deviceTrust: [],
      },
      subscription: {
        tier: "free",
        status: "trial",
        startDate: new Date(),
        features: ["basic_trading"],
        usage: {},
      },
      ...userData,
    };

    this.users.set(user.id, user);

    // Auto-assign to groups based on rules
    await this.autoAssignUserToGroups(user);

    // Log activity
    await this.logActivity({
      userId: user.id,
      sessionId: "system",
      action: "user_created",
      resource: "users",
      details: { userId: user.id, email: user.email },
      timestamp: new Date(),
      ip: "127.0.0.1",
      userAgent: "system",
      outcome: "success",
    });

    return user;
  }

  async updateUser(
    userId: string,
    updates: Partial<User>,
  ): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    // Update user data
    Object.assign(user, updates);
    user.profile.updatedAt = new Date();

    // Re-evaluate group assignments if role changed
    if (updates.role || updates.subscription) {
      await this.autoAssignUserToGroups(user);
    }

    await this.logActivity({
      userId: user.id,
      sessionId: "system",
      action: "user_updated",
      resource: "users",
      details: { userId, updates: Object.keys(updates) },
      timestamp: new Date(),
      ip: "127.0.0.1",
      userAgent: "system",
      outcome: "success",
    });

    return user;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;

    // Remove from all groups
    for (const group of this.groups.values()) {
      const index = group.members.indexOf(userId);
      if (index > -1) {
        group.members.splice(index, 1);
      }
    }

    // Revoke all sessions
    for (const session of this.sessions.values()) {
      if (session.userId === userId) {
        session.status = "revoked";
      }
    }

    this.users.delete(userId);

    await this.logActivity({
      userId,
      sessionId: "system",
      action: "user_deleted",
      resource: "users",
      details: { userId, email: user.email },
      timestamp: new Date(),
      ip: "127.0.0.1",
      userAgent: "system",
      outcome: "success",
    });

    return true;
  }

  async getUsers(filters?: {
    role?: string;
    status?: string;
    group?: string;
    subscription?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ users: User[]; total: number }> {
    let users = Array.from(this.users.values());

    if (filters?.role) {
      users = users.filter((u) => u.role === filters.role);
    }

    if (filters?.status) {
      users = users.filter((u) => u.status === filters.status);
    }

    if (filters?.group) {
      users = users.filter((u) => u.groups.includes(filters.group!));
    }

    if (filters?.subscription) {
      users = users.filter((u) => u.subscription.tier === filters.subscription);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      users = users.filter(
        (u) =>
          u.email.toLowerCase().includes(search) ||
          u.firstName.toLowerCase().includes(search) ||
          u.lastName.toLowerCase().includes(search) ||
          u.username.toLowerCase().includes(search),
      );
    }

    const total = users.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;

    users = users
      .sort(
        (a, b) => b.profile.createdAt.getTime() - a.profile.createdAt.getTime(),
      )
      .slice(offset, offset + limit);

    return { users, total };
  }

  async suspendUser(
    userId: string,
    reason: string,
    duration?: number,
  ): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;

    user.status = "suspended";

    // Set lock duration if specified
    if (duration) {
      user.security.accountLockedUntil = new Date(
        Date.now() + duration * 60 * 1000,
      );
    }

    // Revoke all active sessions
    for (const session of this.sessions.values()) {
      if (session.userId === userId && session.status === "active") {
        session.status = "revoked";
      }
    }

    await this.logActivity({
      userId,
      sessionId: "system",
      action: "user_suspended",
      resource: "users",
      details: { userId, reason, duration },
      timestamp: new Date(),
      ip: "127.0.0.1",
      userAgent: "system",
      outcome: "success",
    });

    return true;
  }

  async activateUser(userId: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;

    user.status = "active";
    user.security.accountLockedUntil = undefined;
    user.security.failedLoginAttempts = 0;

    await this.logActivity({
      userId,
      sessionId: "system",
      action: "user_activated",
      resource: "users",
      details: { userId },
      timestamp: new Date(),
      ip: "127.0.0.1",
      userAgent: "system",
      outcome: "success",
    });

    return true;
  }

  async createGroup(
    groupData: Omit<UserGroup, "id" | "members" | "createdAt" | "updatedAt">,
  ): Promise<UserGroup> {
    const group: UserGroup = {
      id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      members: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...groupData,
    };

    this.groups.set(group.id, group);
    return group;
  }

  async addUserToGroup(userId: string, groupId: string): Promise<boolean> {
    const user = this.users.get(userId);
    const group = this.groups.get(groupId);

    if (!user || !group) return false;

    if (!group.members.includes(userId)) {
      group.members.push(userId);
    }

    if (!user.groups.includes(groupId)) {
      user.groups.push(groupId);
    }

    // Add group permissions to user
    for (const permissionId of group.permissions) {
      if (!user.permissions.includes(permissionId)) {
        user.permissions.push(permissionId);
      }
    }

    group.updatedAt = new Date();
    user.profile.updatedAt = new Date();

    return true;
  }

  async removeUserFromGroup(userId: string, groupId: string): Promise<boolean> {
    const user = this.users.get(userId);
    const group = this.groups.get(groupId);

    if (!user || !group) return false;

    const groupIndex = group.members.indexOf(userId);
    if (groupIndex > -1) {
      group.members.splice(groupIndex, 1);
    }

    const userGroupIndex = user.groups.indexOf(groupId);
    if (userGroupIndex > -1) {
      user.groups.splice(userGroupIndex, 1);
    }

    // Remove group permissions from user (if not granted by other groups)
    const otherGroupPermissions = new Set<string>();
    for (const otherGroupId of user.groups) {
      const otherGroup = this.groups.get(otherGroupId);
      if (otherGroup) {
        otherGroup.permissions.forEach((p) => otherGroupPermissions.add(p));
      }
    }

    user.permissions = user.permissions.filter((p) =>
      otherGroupPermissions.has(p),
    );

    group.updatedAt = new Date();
    user.profile.updatedAt = new Date();

    return true;
  }

  private async autoAssignUserToGroups(user: User): Promise<void> {
    for (const group of this.groups.values()) {
      if (!group.settings.autoAssign) continue;

      let shouldAssign = true;
      for (const rule of group.settings.autoAssignRules) {
        const value = this.getNestedProperty(user, rule.condition);
        if (value !== rule.value) {
          shouldAssign = false;
          break;
        }
      }

      if (shouldAssign && !user.groups.includes(group.id)) {
        await this.addUserToGroup(user.id, group.id);
      }
    }
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  async createSession(
    userId: string,
    deviceInfo: UserSession["deviceInfo"],
  ): Promise<UserSession> {
    const session: UserSession = {
      sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      deviceInfo,
      startTime: new Date(),
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
      status: "active",
    };

    this.sessions.set(session.sessionId, session);

    // Update user login stats
    const user = this.users.get(userId);
    if (user) {
      user.profile.lastLogin = new Date();
      user.profile.loginCount++;
    }

    await this.logActivity({
      userId,
      sessionId: session.sessionId,
      action: "login",
      resource: "auth",
      details: { deviceInfo },
      timestamp: new Date(),
      ip: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      outcome: "success",
    });

    return session;
  }

  async revokeSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.status = "revoked";

    await this.logActivity({
      userId: session.userId,
      sessionId,
      action: "logout",
      resource: "auth",
      details: { reason: "manual_revoke" },
      timestamp: new Date(),
      ip: session.deviceInfo.ip,
      userAgent: session.deviceInfo.userAgent,
      outcome: "success",
    });

    return true;
  }

  async getUserSessions(userId: string): Promise<UserSession[]> {
    return Array.from(this.sessions.values())
      .filter((s) => s.userId === userId && s.status === "active")
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  async bulkOperation(
    operation: Omit<BulkOperation, "id" | "results" | "createdAt">,
  ): Promise<BulkOperation> {
    const bulkOp: BulkOperation = {
      id: `bulk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      results: { successful: 0, failed: 0, errors: [] },
      createdAt: new Date(),
      ...operation,
    };

    this.bulkOperations.set(bulkOp.id, bulkOp);

    // Process asynchronously
    this.processBulkOperation(bulkOp);

    return bulkOp;
  }

  private async processBulkOperation(operation: BulkOperation): Promise<void> {
    operation.status = "in_progress";
    operation.progress = 0;

    for (let i = 0; i < operation.targetUsers.length; i++) {
      const userId = operation.targetUsers[i];

      try {
        switch (operation.type) {
          case "suspend":
            await this.suspendUser(
              userId,
              operation.parameters.reason || "Bulk operation",
            );
            break;
          case "activate":
            await this.activateUser(userId);
            break;
          case "update":
            await this.updateUser(userId, operation.parameters.updates || {});
            break;
          case "delete":
            await this.deleteUser(userId);
            break;
        }

        operation.results.successful++;
      } catch (error) {
        operation.results.failed++;
        operation.results.errors.push({
          userId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      operation.progress = Math.round(
        ((i + 1) / operation.targetUsers.length) * 100,
      );

      // Small delay to prevent overwhelming the system
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    operation.status = "completed";
    operation.completedAt = new Date();
  }

  async getUserActivities(userId: string, limit = 50): Promise<UserActivity[]> {
    return this.activities
      .filter((a) => a.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private async logActivity(activity: Omit<UserActivity, "id">): Promise<void> {
    const activityRecord: UserActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...activity,
    };

    this.activities.push(activityRecord);

    // Keep only last 10000 activities
    if (this.activities.length > 10000) {
      this.activities = this.activities.slice(-10000);
    }
  }

  private startSessionCleanup(): void {
    setInterval(() => {
      const now = new Date();
      let expiredCount = 0;

      for (const session of this.sessions.values()) {
        if (session.status === "active" && session.expiresAt < now) {
          session.status = "expired";
          expiredCount++;
        }
      }

      if (expiredCount > 0) {
        console.log(`Cleaned up ${expiredCount} expired sessions`);
      }
    }, 300000); // Every 5 minutes
  }

  private startActivityTracking(): void {
    setInterval(() => {
      // Clean up old activities (keep only last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      this.activities = this.activities.filter(
        (a) => a.timestamp > thirtyDaysAgo,
      );
    }, 86400000); // Daily cleanup
  }

  private startSecurityMonitoring(): void {
    setInterval(() => {
      // Monitor for suspicious activities
      const recentActivities = this.activities.filter(
        (a) => a.timestamp > new Date(Date.now() - 60 * 60 * 1000), // Last hour
      );

      // Check for multiple failed logins
      const failedLogins = recentActivities.filter(
        (a) => a.action === "login" && a.outcome === "failure",
      );

      const userFailedLogins = new Map<string, number>();
      for (const activity of failedLogins) {
        const count = userFailedLogins.get(activity.userId) || 0;
        userFailedLogins.set(activity.userId, count + 1);
      }

      // Lock users with too many failed attempts
      for (const [userId, failCount] of userFailedLogins.entries()) {
        if (failCount >= 5) {
          this.suspendUser(userId, "Too many failed login attempts", 30); // 30 minute lock
        }
      }
    }, 300000); // Every 5 minutes
  }

  async getSystemStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    usersByRole: Record<string, number>;
    usersByStatus: Record<string, number>;
    usersBySubscription: Record<string, number>;
    activeSessions: number;
    recentActivities: number;
  }> {
    const users = Array.from(this.users.values());
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const usersByRole: Record<string, number> = {};
    const usersByStatus: Record<string, number> = {};
    const usersBySubscription: Record<string, number> = {};

    for (const user of users) {
      usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
      usersByStatus[user.status] = (usersByStatus[user.status] || 0) + 1;
      usersBySubscription[user.subscription.tier] =
        (usersBySubscription[user.subscription.tier] || 0) + 1;
    }

    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === "active").length,
      usersByRole,
      usersByStatus,
      usersBySubscription,
      activeSessions: Array.from(this.sessions.values()).filter(
        (s) => s.status === "active",
      ).length,
      recentActivities: this.activities.filter((a) => a.timestamp > last24h)
        .length,
    };
  }
}

export const userManagementService = singletonPattern(
  () => new UserManagementService(),
);
