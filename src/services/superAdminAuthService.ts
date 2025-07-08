import { DatabaseUser, AuthSession } from "@/types/common";

// Super Admin User Interface
export interface SuperAdminUser extends DatabaseUser {
  role: "super_admin";
  permissions: SuperAdminPermission[];
  lastLogin?: string;
  loginAttempts: number;
  locked: boolean;
  mfaEnabled: boolean;
  createdBy: string;
  departmentAccess: string[];
}

export interface SuperAdminPermission {
  resource: string;
  actions: ("create" | "read" | "update" | "delete" | "execute")[];
  scope: "global" | "department" | "user";
}

export interface SuperAdminSession extends AuthSession {
  user: SuperAdminUser;
  permissions: SuperAdminPermission[];
  accessLevel: "full" | "restricted" | "read_only";
  sessionStart: string;
  lastActivity: string;
}

// Login Request/Response Types
export interface SuperAdminLoginRequest {
  username: string;
  password: string;
  mfaCode?: string;
  rememberMe?: boolean;
}

export interface SuperAdminLoginResponse {
  success: boolean;
  session?: SuperAdminSession;
  requiresMFA?: boolean;
  message: string;
  expiresAt?: string;
}

// Default Super Admin Credentials (for seeding)
export const DEFAULT_SUPER_ADMIN_CREDENTIALS = {
  username: "superadmin",
  password: "QuantumVest@2024!",
  email: "admin@quantumvest.com",
  fullName: "System Administrator",
  role: "super_admin" as const,
  permissions: [
    {
      resource: "*",
      actions: ["create", "read", "update", "delete", "execute"],
      scope: "global" as const,
    },
    {
      resource: "users",
      actions: ["create", "read", "update", "delete"],
      scope: "global" as const,
    },
    {
      resource: "system",
      actions: ["read", "update", "execute"],
      scope: "global" as const,
    },
    {
      resource: "database",
      actions: ["read", "update", "execute"],
      scope: "global" as const,
    },
    { resource: "audit", actions: ["read"], scope: "global" as const },
    {
      resource: "security",
      actions: ["read", "update", "execute"],
      scope: "global" as const,
    },
  ],
  departmentAccess: ["*"],
  mfaEnabled: true,
};

export class SuperAdminAuthService {
  private static instance: SuperAdminAuthService;
  private currentSession: SuperAdminSession | null = null;
  private readonly SESSION_KEY = "superadmin_session";
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

  static getInstance(): SuperAdminAuthService {
    if (!SuperAdminAuthService.instance) {
      SuperAdminAuthService.instance = new SuperAdminAuthService();
    }
    return SuperAdminAuthService.instance;
  }

  private constructor() {
    this.loadSessionFromStorage();
  }

  /**
   * Seed default super admin user in database
   */
  async seedDefaultSuperAdmin(): Promise<boolean> {
    try {
      console.log("Seeding default super admin credentials...");

      // Check if super admin already exists
      const existingAdmin = await this.findUserByUsername(
        DEFAULT_SUPER_ADMIN_CREDENTIALS.username,
      );
      if (existingAdmin) {
        console.log("Super admin already exists, skipping seed");
        return true;
      }

      // Create super admin user
      const hashedPassword = await this.hashPassword(
        DEFAULT_SUPER_ADMIN_CREDENTIALS.password,
      );
      const superAdminUser: SuperAdminUser = {
        id: this.generateId(),
        username: DEFAULT_SUPER_ADMIN_CREDENTIALS.username,
        email: DEFAULT_SUPER_ADMIN_CREDENTIALS.email,
        fullName: DEFAULT_SUPER_ADMIN_CREDENTIALS.fullName,
        passwordHash: hashedPassword,
        role: DEFAULT_SUPER_ADMIN_CREDENTIALS.role,
        permissions: DEFAULT_SUPER_ADMIN_CREDENTIALS.permissions,
        departmentAccess: DEFAULT_SUPER_ADMIN_CREDENTIALS.departmentAccess,
        mfaEnabled: DEFAULT_SUPER_ADMIN_CREDENTIALS.mfaEnabled,
        loginAttempts: 0,
        locked: false,
        createdBy: "system",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };

      await this.saveUserToDatabase(superAdminUser);

      console.log("✅ Super admin seeded successfully");
      console.log(`Username: ${DEFAULT_SUPER_ADMIN_CREDENTIALS.username}`);
      console.log(`Password: ${DEFAULT_SUPER_ADMIN_CREDENTIALS.password}`);
      console.log("⚠️  Please change the default password after first login");

      return true;
    } catch (error) {
      console.error("Failed to seed super admin:", error);
      return false;
    }
  }

  /**
   * Login super admin
   */
  async login(
    credentials: SuperAdminLoginRequest,
  ): Promise<SuperAdminLoginResponse> {
    try {
      // Find user by username
      const user = await this.findUserByUsername(credentials.username);
      if (!user) {
        return {
          success: false,
          message: "Invalid credentials",
        };
      }

      // Check if account is locked
      if (user.locked) {
        return {
          success: false,
          message: "Account is locked due to multiple failed login attempts",
        };
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(
        credentials.password,
        user.passwordHash,
      );
      if (!isValidPassword) {
        await this.incrementLoginAttempts(user.id);
        return {
          success: false,
          message: "Invalid credentials",
        };
      }

      // Check MFA if enabled
      if (user.mfaEnabled && !credentials.mfaCode) {
        return {
          success: false,
          requiresMFA: true,
          message: "MFA code required",
        };
      }

      if (user.mfaEnabled && credentials.mfaCode) {
        const isMfaValid = await this.verifyMFA(user.id, credentials.mfaCode);
        if (!isMfaValid) {
          return {
            success: false,
            message: "Invalid MFA code",
          };
        }
      }

      // Create session
      const session = await this.createSession(user);
      this.currentSession = session;

      // Update last login
      await this.updateLastLogin(user.id);

      // Store session
      if (credentials.rememberMe) {
        this.saveSessionToStorage(session);
      }

      return {
        success: true,
        session,
        message: "Login successful",
        expiresAt: session.expiresAt,
      };
    } catch (error) {
      console.error("Super admin login error:", error);
      return {
        success: false,
        message: "Login failed due to system error",
      };
    }
  }

  /**
   * Logout super admin
   */
  async logout(): Promise<void> {
    if (this.currentSession) {
      await this.invalidateSession(this.currentSession.sessionId);
      this.currentSession = null;
      this.clearSessionFromStorage();
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): SuperAdminSession | null {
    return this.currentSession;
  }

  /**
   * Check if user has permission
   */
  hasPermission(resource: string, action: string): boolean {
    if (!this.currentSession) return false;

    return this.currentSession.permissions.some((permission) => {
      // Global wildcard permission
      if (permission.resource === "*") {
        return permission.actions.includes(action as any);
      }

      // Specific resource permission
      if (permission.resource === resource) {
        return permission.actions.includes(action as any);
      }

      return false;
    });
  }

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    if (!this.currentSession) return false;

    try {
      const user = await this.findUserById(this.currentSession.user.id);
      if (!user) return false;

      // Verify current password
      const isCurrentPasswordValid = await this.verifyPassword(
        currentPassword,
        user.passwordHash,
      );
      if (!isCurrentPasswordValid) return false;

      // Hash new password
      const newPasswordHash = await this.hashPassword(newPassword);

      // Update password
      await this.updateUserPassword(user.id, newPasswordHash);

      return true;
    } catch (error) {
      console.error("Password change error:", error);
      return false;
    }
  }

  // Private helper methods
  private async findUserByUsername(
    username: string,
  ): Promise<SuperAdminUser | null> {
    // Simulate database lookup
    const storedUsers = this.getStoredUsers();
    return storedUsers.find((user) => user.username === username) || null;
  }

  private async findUserById(id: string): Promise<SuperAdminUser | null> {
    const storedUsers = this.getStoredUsers();
    return storedUsers.find((user) => user.id === id) || null;
  }

  private async saveUserToDatabase(user: SuperAdminUser): Promise<void> {
    const users = this.getStoredUsers();
    users.push(user);
    localStorage.setItem("superadmin_users", JSON.stringify(users));
  }

  private getStoredUsers(): SuperAdminUser[] {
    const stored = localStorage.getItem("superadmin_users");
    return stored ? JSON.parse(stored) : [];
  }

  private async hashPassword(password: string): Promise<string> {
    // Simple hash for demo (use bcrypt in production)
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "quantumvest_salt");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  private async verifyMFA(userId: string, code: string): Promise<boolean> {
    // Simple MFA verification (implement TOTP in production)
    return code === "123456"; // Demo code
  }

  private async createSession(
    user: SuperAdminUser,
  ): Promise<SuperAdminSession> {
    const sessionId = this.generateId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8 hours

    return {
      sessionId,
      user,
      permissions: user.permissions,
      accessLevel: "full",
      sessionStart: now.toISOString(),
      lastActivity: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isValid: true,
    };
  }

  private async invalidateSession(sessionId: string): Promise<void> {
    // Remove from active sessions
    const sessions = this.getStoredSessions();
    const filteredSessions = sessions.filter((s) => s.sessionId !== sessionId);
    localStorage.setItem(
      "superadmin_sessions",
      JSON.stringify(filteredSessions),
    );
  }

  private getStoredSessions(): SuperAdminSession[] {
    const stored = localStorage.getItem("superadmin_sessions");
    return stored ? JSON.parse(stored) : [];
  }

  private saveSessionToStorage(session: SuperAdminSession): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  }

  private loadSessionFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY);
      if (stored) {
        const session = JSON.parse(stored);
        // Check if session is still valid
        if (new Date(session.expiresAt) > new Date()) {
          this.currentSession = session;
        } else {
          this.clearSessionFromStorage();
        }
      }
    } catch (error) {
      console.error("Failed to load session from storage:", error);
      this.clearSessionFromStorage();
    }
  }

  private clearSessionFromStorage(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  private async incrementLoginAttempts(userId: string): Promise<void> {
    const users = this.getStoredUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex >= 0) {
      users[userIndex].loginAttempts++;
      if (users[userIndex].loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
        users[userIndex].locked = true;
      }
      localStorage.setItem("superadmin_users", JSON.stringify(users));
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    const users = this.getStoredUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex >= 0) {
      users[userIndex].lastLogin = new Date().toISOString();
      users[userIndex].loginAttempts = 0; // Reset login attempts on successful login
      users[userIndex].locked = false;
      localStorage.setItem("superadmin_users", JSON.stringify(users));
    }
  }

  private async updateUserPassword(
    userId: string,
    passwordHash: string,
  ): Promise<void> {
    const users = this.getStoredUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex >= 0) {
      users[userIndex].passwordHash = passwordHash;
      users[userIndex].updatedAt = new Date().toISOString();
      localStorage.setItem("superadmin_users", JSON.stringify(users));
    }
  }

  private generateId(): string {
    return `sa_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

// Export singleton instance
export const superAdminAuthService = SuperAdminAuthService.getInstance();
export default SuperAdminAuthService;
