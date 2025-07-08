/**
 * Unified Admin Authentication System
 * Comprehensive authentication gate for all admin access levels
 */

import React, { useState, createContext, useContext, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Zap,
  Crown,
  Command,
  Key,
  Fingerprint,
  Smartphone,
  Server,
  Globe,
  Terminal,
  Database,
  Activity,
  Users,
  Settings,
  Bell,
  Star,
  Award,
} from "lucide-react";

// Authentication levels and corresponding requirements
export enum AdminLevel {
  BASIC = "basic",
  SUPER = "super",
  ULTRA = "ultra",
}

interface AuthUser {
  id: string;
  username: string;
  role: string;
  level: AdminLevel;
  permissions: string[];
  lastLogin: string;
  securityScore: number;
  clearanceLevel: number;
}

interface AuthCredentials {
  username: string;
  password: string;
  mfaCode?: string;
  securityKey?: string;
  biometricToken?: string;
}

interface UnifiedAuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  adminLevel: AdminLevel | null;
  login: (
    credentials: AuthCredentials,
    targetLevel: AdminLevel,
  ) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  canAccessLevel: (level: AdminLevel) => boolean;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | null>(null);

// Multi-level admin credentials
const ADMIN_CREDENTIALS = {
  [AdminLevel.BASIC]: {
    username: "admin",
    password: "QV2024!Admin",
    mfaCode: "123456",
    permissions: ["dashboard_view", "user_management", "basic_analytics"],
    clearanceLevel: 3,
  },
  [AdminLevel.SUPER]: {
    username: "quantumadmin",
    password: "QV2024!SuperSecure#Admin",
    mfaCode: "789123",
    permissions: [
      "vault_management",
      "user_management",
      "ritual_oversight",
      "ai_agent_control",
      "system_configuration",
      "data_export",
    ],
    clearanceLevel: 7,
  },
  [AdminLevel.ULTRA]: {
    username: "ultralevel.admin",
    password: "QV2024#UltraSecure!Enterprise@Command",
    mfaCode: "987654",
    securityKey: "ULTRA-KEY-2024",
    biometricToken: "BIO-VERIFIED",
    permissions: [
      "global_system_control",
      "infrastructure_management",
      "financial_oversight",
      "security_administration",
      "compliance_monitoring",
      "emergency_protocols",
      "data_sovereignty",
      "platform_configuration",
    ],
    clearanceLevel: 10,
  },
};

export const UnifiedAdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [adminLevel, setAdminLevel] = useState<AdminLevel | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedAuth = localStorage.getItem("quantumvest_unified_admin_auth");
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.expires > Date.now()) {
          setIsAuthenticated(true);
          setUser(authData.user);
          setAdminLevel(authData.level);
        } else {
          localStorage.removeItem("quantumvest_unified_admin_auth");
        }
      } catch (error) {
        localStorage.removeItem("quantumvest_unified_admin_auth");
      }
    }
  }, []);

  const login = async (
    credentials: AuthCredentials,
    targetLevel: AdminLevel,
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const levelConfig = ADMIN_CREDENTIALS[targetLevel];
    let isValid = false;

    // Validate credentials based on admin level
    switch (targetLevel) {
      case AdminLevel.BASIC:
        isValid =
          credentials.username === levelConfig.username &&
          credentials.password === levelConfig.password &&
          credentials.mfaCode === levelConfig.mfaCode;
        break;

      case AdminLevel.SUPER:
        isValid =
          credentials.username === levelConfig.username &&
          credentials.password === levelConfig.password &&
          credentials.mfaCode === levelConfig.mfaCode;
        break;

      case AdminLevel.ULTRA:
        isValid =
          credentials.username === levelConfig.username &&
          credentials.password === levelConfig.password &&
          credentials.mfaCode === levelConfig.mfaCode &&
          credentials.securityKey === (levelConfig as any).securityKey &&
          credentials.biometricToken === (levelConfig as any).biometricToken;
        break;
    }

    if (isValid) {
      const adminUser: AuthUser = {
        id: `admin-${targetLevel}-001`,
        username: levelConfig.username,
        role: `${targetLevel.charAt(0).toUpperCase() + targetLevel.slice(1)} Administrator`,
        level: targetLevel,
        permissions: levelConfig.permissions,
        lastLogin: new Date().toISOString(),
        securityScore:
          targetLevel === AdminLevel.ULTRA
            ? 6
            : targetLevel === AdminLevel.SUPER
              ? 4
              : 3,
        clearanceLevel: levelConfig.clearanceLevel,
      };

      setUser(adminUser);
      setIsAuthenticated(true);
      setAdminLevel(targetLevel);

      // Store session with appropriate expiration
      const sessionDuration = {
        [AdminLevel.BASIC]: 8 * 60 * 60 * 1000, // 8 hours
        [AdminLevel.SUPER]: 8 * 60 * 60 * 1000, // 8 hours
        [AdminLevel.ULTRA]: 4 * 60 * 60 * 1000, // 4 hours
      };

      const authData = {
        user: adminUser,
        level: targetLevel,
        expires: Date.now() + sessionDuration[targetLevel],
      };
      localStorage.setItem(
        "quantumvest_unified_admin_auth",
        JSON.stringify(authData),
      );

      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAdminLevel(null);
    localStorage.removeItem("quantumvest_unified_admin_auth");
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const canAccessLevel = (level: AdminLevel): boolean => {
    if (!user || !adminLevel) return false;

    const levelHierarchy = {
      [AdminLevel.BASIC]: 1,
      [AdminLevel.SUPER]: 2,
      [AdminLevel.ULTRA]: 3,
    };

    return levelHierarchy[adminLevel] >= levelHierarchy[level];
  };

  return (
    <UnifiedAuthContext.Provider
      value={{
        isAuthenticated,
        user,
        adminLevel,
        login,
        logout,
        hasPermission,
        canAccessLevel,
      }}
    >
      {children}
    </UnifiedAuthContext.Provider>
  );
};

export const useUnifiedAuth = (): UnifiedAuthContextType => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error("useUnifiedAuth must be used within UnifiedAdminProvider");
  }
  return context;
};

export const UnifiedAdminLogin: React.FC<{
  targetLevel: AdminLevel;
  onSuccess?: () => void;
}> = ({ targetLevel, onSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    mfaCode: "",
    securityKey: "",
    biometricToken: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);

  const { login } = useUnifiedAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(credentials, targetLevel);
      if (success) {
        onSuccess?.();
      } else {
        setError("Invalid credentials for the requested access level.");
      }
    } catch (error) {
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelConfig = () => {
    const configs = {
      [AdminLevel.BASIC]: {
        title: "Basic Admin Access",
        description: "Standard administrative functions",
        icon: <Settings className="h-8 w-8" />,
        color: "blue",
        requirements: ["Username & Password", "MFA Code"],
      },
      [AdminLevel.SUPER]: {
        title: "SuperAdmin Access",
        description: "Comprehensive platform management",
        icon: <Shield className="h-8 w-8" />,
        color: "purple",
        requirements: ["Username & Password", "MFA Code"],
      },
      [AdminLevel.ULTRA]: {
        title: "UltraLevel Command",
        description: "Enterprise platform sovereignty",
        icon: <Command className="h-8 w-8" />,
        color: "gradient",
        requirements: [
          "Username & Password",
          "MFA Code",
          "Security Key",
          "Biometric Token",
        ],
      },
    };
    return configs[targetLevel];
  };

  const config = getLevelConfig();
  const levelCredentials = ADMIN_CREDENTIALS[targetLevel];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div
              className={`p-4 rounded-full ${
                config.color === "gradient"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600"
                  : `bg-${config.color}-600`
              }`}
            >
              {config.icon}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{config.title}</h1>
          <p className="text-gray-300 mb-4">{config.description}</p>
          <div className="flex items-center justify-center gap-2">
            <Badge
              className={`${
                config.color === "gradient"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600"
                  : `bg-${config.color}-600`
              } text-white`}
            >
              Clearance Level {levelCredentials.clearanceLevel}
            </Badge>
            <Badge className="bg-gray-700 text-white">
              {config.requirements.length} Factors
            </Badge>
          </div>
        </div>

        {/* Demo Credentials */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">
                Demo Credentials
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCredentials(!showCredentials)}
                className="ml-auto text-yellow-600 hover:text-yellow-800"
              >
                {showCredentials ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {showCredentials ? (
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="text-gray-600">Username:</span>
                  <Badge variant="outline">{levelCredentials.username}</Badge>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="text-gray-600">Password:</span>
                  <Badge variant="outline">{levelCredentials.password}</Badge>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="text-gray-600">MFA Code:</span>
                  <Badge variant="outline">{levelCredentials.mfaCode}</Badge>
                </div>
                {targetLevel === AdminLevel.ULTRA && (
                  <>
                    <div className="flex justify-between items-center bg-white p-2 rounded">
                      <span className="text-gray-600">Security Key:</span>
                      <Badge variant="outline">
                        {(levelCredentials as any).securityKey}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded">
                      <span className="text-gray-600">Biometric:</span>
                      <Badge variant="outline">
                        {(levelCredentials as any).biometricToken}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-yellow-600 italic">
                Click the eye icon to reveal {targetLevel} credentials
              </p>
            )}
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Secure Authentication
            </h2>
            <p className="text-sm text-gray-600">
              {config.requirements.join(" • ")}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Basic Auth */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">
                    Primary Authentication
                  </span>
                </div>

                <Input
                  type="text"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  placeholder="Administrator username"
                  required
                />

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    placeholder="Secure password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* MFA */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">
                    Multi-Factor Authentication
                  </span>
                </div>

                <Input
                  type="text"
                  value={credentials.mfaCode}
                  onChange={(e) =>
                    setCredentials({ ...credentials, mfaCode: e.target.value })
                  }
                  placeholder="6-digit MFA code"
                  maxLength={6}
                  required
                />
              </div>

              {/* Ultra Level Additional Auth */}
              {targetLevel === AdminLevel.ULTRA && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">
                      Enhanced Security
                    </span>
                  </div>

                  <Input
                    type="text"
                    value={credentials.securityKey}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        securityKey: e.target.value,
                      })
                    }
                    placeholder="Hardware security key"
                    required
                  />

                  <Input
                    type="text"
                    value={credentials.biometricToken}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        biometricToken: e.target.value,
                      })
                    }
                    placeholder="Biometric verification token"
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Access {config.title}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4">
              {config.requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{req}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const AdminGuard: React.FC<{
  children: React.ReactNode;
  requiredLevel: AdminLevel;
  fallbackComponent?: React.ComponentType<any>;
}> = ({ children, requiredLevel, fallbackComponent: FallbackComponent }) => {
  const { isAuthenticated, canAccessLevel } = useUnifiedAuth();

  if (!isAuthenticated || !canAccessLevel(requiredLevel)) {
    if (FallbackComponent) {
      return <FallbackComponent targetLevel={requiredLevel} />;
    }
    return <UnifiedAdminLogin targetLevel={requiredLevel} />;
  }

  return <>{children}</>;
};
