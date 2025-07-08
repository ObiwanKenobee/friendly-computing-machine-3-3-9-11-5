/**
 * Security utility functions and constants
 * Extracted from components to fix fast refresh violations
 */

import { SecurityEvent } from "../types/common";

// Security configuration constants
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 3600000, // 1 hour
  MAX_LOGIN_ATTEMPTS: 5,
  MFA_TIMEOUT: 300000, // 5 minutes
  SECURITY_CHECK_INTERVAL: 60000, // 1 minute
  THREAT_LEVELS: {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    CRITICAL: "critical",
  } as const,
};

// Security utility functions
export const securityUtils = {
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  },

  calculateRiskScore(events: SecurityEvent[]): number {
    if (events.length === 0) return 0;

    const severityWeights = {
      info: 1,
      warning: 2,
      error: 3,
      critical: 5,
    };

    const totalScore = events.reduce((sum, event) => {
      return sum + (severityWeights[event.severity] || 1);
    }, 0);

    return Math.min(100, (totalScore / events.length) * 10);
  },

  isHighRiskSession(riskScore: number, sessionDuration: number): boolean {
    return riskScore > 70 || sessionDuration > SECURITY_CONFIG.SESSION_TIMEOUT;
  },

  sanitizeUserInput(input: string): string {
    return input
      .replace(/[<>]/g, "") // Remove potential XSS characters
      .replace(/['";]/g, "") // Remove SQL injection characters
      .trim();
  },

  validateSecurityLevel(level: string): boolean {
    return Object.values(SECURITY_CONFIG.THREAT_LEVELS).includes(level as any);
  },

  formatSecurityMessage(event: SecurityEvent): string {
    const timestamp = event.timestamp.toLocaleString();
    return `[${event.severity.toUpperCase()}] ${event.details.description} at ${timestamp}`;
  },
};

// Authentication helper functions
export const authUtils = {
  generateMFACode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  hashPassword(password: string): string {
    // This is a simplified hash - in production use bcrypt or similar
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  },
};

// Permission utility functions
export const permissionUtils = {
  checkPermission(
    userPermissions: string[],
    requiredPermission: string,
  ): boolean {
    return (
      userPermissions.includes(requiredPermission) ||
      userPermissions.includes("admin")
    );
  },

  checkMultiplePermissions(
    userPermissions: string[],
    requiredPermissions: string[],
  ): boolean {
    return requiredPermissions.every((permission) =>
      this.checkPermission(userPermissions, permission),
    );
  },

  filterByPermissions<T extends { requiredPermissions?: string[] }>(
    items: T[],
    userPermissions: string[],
  ): T[] {
    return items.filter((item) => {
      if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
        return true;
      }
      return this.checkMultiplePermissions(
        userPermissions,
        item.requiredPermissions,
      );
    });
  },
};

// Error boundary utility functions
export const errorBoundaryUtils = {
  getErrorInfo(error: Error, errorInfo?: { componentStack: string }) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  },

  logError(error: Error, errorInfo?: { componentStack: string }) {
    const info = this.getErrorInfo(error, errorInfo);
    console.error("Error Boundary caught an error:", info);

    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error, { extra: info });
    }
  },

  shouldShowErrorDetails(): boolean {
    return import.meta.env.DEV;
  },

  getErrorMessage(error: Error): string {
    if (this.shouldShowErrorDetails()) {
      return error.message;
    }
    return "An unexpected error occurred. Please try again.";
  },
};
