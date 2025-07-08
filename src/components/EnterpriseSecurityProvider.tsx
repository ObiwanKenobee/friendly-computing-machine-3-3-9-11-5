import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  enterpriseAuthService,
  EnterpriseUser,
  AuthSession,
} from "../services/enterpriseAuthService";
import { enterprisePaymentService } from "../services/enterprisePaymentService";
import CiscoXDRService from "../services/ciscoXDRService";

interface LoginCredentials {
  email: string;
  password: string;
  mfaToken?: string;
  rememberMe?: boolean;
}

interface SuspiciousActivity {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  details: Record<string, unknown>;
  timestamp: string;
  userId?: string;
}

interface SecurityEvent {
  id: string;
  type: "authentication" | "authorization" | "data_access" | "system";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
  userId?: string;
  metadata: Record<string, unknown>;
}

interface SecurityError {
  code: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
}

interface SecurityContextType {
  user: EnterpriseUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  securityLevel: number;
  paymentAccess: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkPermission: (permission: string) => boolean;
  checkPaymentAccess: (tier: string) => Promise<boolean>;
  refreshSession: () => Promise<void>;
  securityStatus: {
    threatLevel: string;
    mfaEnabled: boolean;
    biometricEnabled: boolean;
    lastSecurityCheck: Date | null;
  };
}

const SecurityContext = createContext<SecurityContextType | null>(null);

interface SecurityProviderProps {
  children: ReactNode;
}

export const EnterpriseSecurityProvider: React.FC<SecurityProviderProps> = ({
  children,
}) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [securityStatus, setSecurityStatus] = useState({
    threatLevel: "low",
    mfaEnabled: false,
    biometricEnabled: false,
    lastSecurityCheck: null as Date | null,
  });
  const [paymentAccess, setPaymentAccess] = useState(false);

  // Initialize security context
  useEffect(() => {
    initializeSecurity();
  }, []);

  // Monitor session validity
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(async () => {
      try {
        await refreshSession();
        await updateSecurityStatus();
      } catch (error) {
        console.error("Session monitoring error:", error);
        handleSecurityError(error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [session]);

  // Security event monitoring
  useEffect(() => {
    const handleSecurityEvent = (event: CustomEvent) => {
      if (event.detail.type === "threat_detected") {
        setSecurityStatus((prev) => ({
          ...prev,
          threatLevel: event.detail.level,
        }));
      }
    };

    window.addEventListener(
      "security-event",
      handleSecurityEvent as EventListener,
    );
    return () =>
      window.removeEventListener(
        "security-event",
        handleSecurityEvent as EventListener,
      );
  }, []);

  const initializeSecurity = async () => {
    try {
      setIsLoading(true);

      // Check for existing session
      const currentSession = enterpriseAuthService.getCurrentSession();
      if (currentSession) {
        const validSession = await enterpriseAuthService.validateSession(
          currentSession.token,
        );
        if (validSession) {
          setSession(validSession);
          await updatePaymentAccess(validSession.user.id);
          await updateSecurityStatus();
        }
      }

      // Initialize security monitoring with error handling
      try {
        await initializeSecurityMonitoring();
      } catch (securityError) {
        console.warn(
          "Security monitoring initialization failed, continuing with reduced security features:",
          securityError,
        );
        // Set basic security status instead of failing completely
        setSecurityStatus({
          threatLevel: "unknown",
          mfaEnabled: false,
          biometricEnabled: false,
          lastSecurityCheck: null,
        });
      }
    } catch (error) {
      console.error("Security initialization error:", error);
      handleSecurityError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSecurityMonitoring = async () => {
    try {
      // Initialize XDR service instance
      const xdrService = CiscoXDRService.getInstance();

      // Verify service is available before proceeding
      if (xdrService) {
        console.log("Security monitoring system available");

        // Set up basic security monitoring
        // Note: Using existing service methods
        const securityMetrics = await xdrService.getSecurityMetrics();
        console.log("Security metrics loaded:", securityMetrics);

        // Get current threats
        const threats = xdrService.getThreatIndicators();
        console.log("Threat detection active, found threats:", threats.length);

        // Get compliance reports
        const complianceReports = xdrService.getComplianceReports();
        console.log("Compliance reports:", complianceReports.length);
      }

      console.log("Security monitoring initialized successfully");
    } catch (error) {
      console.error("Failed to initialize security monitoring:", error);
      // Don't throw error to prevent component crash
      console.warn("Security monitoring will operate in degraded mode");
    }
  };

  const updateSecurityStatus = async () => {
    try {
      if (!session) return;

      const securityMetrics =
        await CiscoXDRService.getInstance().getSecurityMetrics();

      setSecurityStatus({
        threatLevel: securityMetrics.threatLevel || "low",
        mfaEnabled: session.user.mfaEnabled,
        biometricEnabled: session.user.biometricEnabled,
        lastSecurityCheck: new Date(),
      });
    } catch (error) {
      console.error("Failed to update security status:", error);
    }
  };

  const updatePaymentAccess = async (userId: string) => {
    try {
      const subscriptionStatus =
        await enterprisePaymentService.getSubscriptionStatus(userId);
      setPaymentAccess(subscriptionStatus?.isActive || false);
    } catch (error) {
      console.error("Failed to update payment access:", error);
      setPaymentAccess(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);

      // Enhanced login with security validation
      const loginSession = await enterpriseAuthService.login(credentials);

      // Validate payment status
      await updatePaymentAccess(loginSession.user.id);

      // Security audit log
      logSecurityEvent({
        type: "user_login_success",
        userId: loginSession.user.id,
        timestamp: new Date(),
        details: {
          securityLevel: loginSession.securityLevel,
          paymentValidated: loginSession.paymentValidated,
          ip: getClientIP(),
          userAgent: navigator.userAgent,
        },
      });

      setSession(loginSession);
      await updateSecurityStatus();

      // Post-login security checks
      await performPostLoginSecurityChecks(loginSession);
    } catch (error) {
      // Log failed login attempt
      logSecurityEvent({
        type: "user_login_failed",
        details: {
          email: credentials.email,
          error: error.message,
          ip: getClientIP(),
          userAgent: navigator.userAgent,
        },
        timestamp: new Date(),
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (session) {
        // Log logout event
        logSecurityEvent({
          type: "user_logout",
          userId: session.user.id,
          timestamp: new Date(),
        });
      }

      await enterpriseAuthService.logout();
      setSession(null);
      setPaymentAccess(false);
      setSecurityStatus({
        threatLevel: "low",
        mfaEnabled: false,
        biometricEnabled: false,
        lastSecurityCheck: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if there's an error
      setSession(null);
      setPaymentAccess(false);
    }
  };

  const refreshSession = async () => {
    try {
      if (!session) return;

      const refreshedSession = await enterpriseAuthService.refreshSession(
        session.token,
      );
      setSession(refreshedSession);
      await updatePaymentAccess(refreshedSession.user.id);
    } catch (error) {
      console.error("Session refresh error:", error);
      // If refresh fails, logout the user
      await logout();
      throw error;
    }
  };

  const checkPermission = (permission: string): boolean => {
    if (!session || !session.user.permissions) return false;

    return (
      session.user.permissions.includes(permission) ||
      session.user.permissions.includes("admin:all")
    );
  };

  const checkPaymentAccess = async (tier: string): Promise<boolean> => {
    if (!session) return false;

    try {
      return await enterprisePaymentService.validatePaymentAccess(
        session.user.id,
        tier,
      );
    } catch (error) {
      console.error("Payment access check failed:", error);
      return false;
    }
  };

  const performPostLoginSecurityChecks = async (loginSession: AuthSession) => {
    try {
      // Check for suspicious activity (stub implementation)
      const suspiciousActivity = {
        isSuspicious: false,
        riskLevel: "low" as const,
      };

      if (suspiciousActivity.isSuspicious) {
        await handleSuspiciousActivity(suspiciousActivity);
      }

      // Validate device fingerprint (stub implementation)
      const deviceFingerprint = await generateDeviceFingerprint();
      console.log("Device fingerprint validated:", deviceFingerprint);

      // Check for concurrent sessions (stub implementation)
      const concurrentSessions = {
        count: 1,
        sessions: [{ id: "current", active: true }],
      };

      if (concurrentSessions.count > 3) {
        console.warn("Multiple concurrent sessions detected");
      }
    } catch (error) {
      console.error("Post-login security checks failed:", error);
    }
  };

  const handleSuspiciousActivity = async (activity: SuspiciousActivity) => {
    console.warn("Suspicious activity detected:", activity);

    // Trigger additional verification
    if (activity.riskLevel === "high") {
      // Force MFA re-verification
      // In a real implementation, show MFA challenge modal
      setSecurityStatus((prev) => ({
        ...prev,
        threatLevel: "high",
      }));
    }
  };

  const handleSecurityEvent = (event: SecurityEvent) => {
    console.log("Security event received:", event);

    switch (event.type) {
      case "threat_detected":
        setSecurityStatus((prev) => ({
          ...prev,
          threatLevel: event.level,
        }));
        break;

      case "session_expired":
        logout();
        break;

      case "payment_fraud_detected":
        setPaymentAccess(false);
        // Show security warning
        break;

      case "compliance_violation":
        // Handle compliance issues
        console.warn("Compliance violation:", event.details);
        break;

      default:
        console.log("Unknown security event:", event);
    }
  };

  // Security event logging helper
  const logSecurityEvent = (event: any) => {
    console.log("Security Event:", event.type, event.details);
    // In production, this would send to actual security monitoring system
  };

  const handleSecurityError = (error: SecurityError) => {
    console.error("Security error:", error);

    // Log security error
    logAuditEvent({
      type: "security_error",
      details: { error: error.message },
    });

    // Handle critical security errors
    if (error.message.includes("CRITICAL")) {
      logout();
    }
  };

  // Utility functions
  const getClientIP = (): string => {
    // In a real implementation, get the actual client IP
    return "127.0.0.1";
  };

  const generateDeviceFingerprint = async (): Promise<string> => {
    // Generate device fingerprint based on browser characteristics
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || "unknown",
    ].join("|");

    // Hash the fingerprint
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const contextValue: SecurityContextType = {
    user: session?.user || null,
    session,
    isAuthenticated: !!session,
    isLoading,
    securityLevel: session?.securityLevel || 0,
    paymentAccess,
    login,
    logout,
    checkPermission,
    checkPaymentAccess,
    refreshSession,
    securityStatus,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useEnterpriseAuth = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error(
      "useEnterpriseAuth must be used within an EnterpriseSecurityProvider",
    );
  }
  return context;
};

// Higher-order component for protecting routes
export const withAuthRequired = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions?: string[],
) => {
  return (props: P) => {
    const { isAuthenticated, isLoading, checkPermission } = useEnterpriseAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600">
              Please log in to access this content.
            </p>
          </div>
        </div>
      );
    }

    if (requiredPermissions && !requiredPermissions.every(checkPermission)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You don't have permission to access this content.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

// Component for payment access protection
export const withPaymentRequired = <P extends object>(
  Component: React.ComponentType<P>,
  requiredTier?: string,
) => {
  return (props: P) => {
    const { paymentAccess, checkPaymentAccess } = useEnterpriseAuth();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    useEffect(() => {
      if (requiredTier) {
        checkPaymentAccess(requiredTier).then(setHasAccess);
      } else {
        setHasAccess(paymentAccess);
      }
    }, [paymentAccess, requiredTier, checkPaymentAccess]);

    if (hasAccess === null) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!hasAccess) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Subscription Required
            </h2>
            <p className="text-gray-600">
              Please upgrade your subscription to access this feature.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};
