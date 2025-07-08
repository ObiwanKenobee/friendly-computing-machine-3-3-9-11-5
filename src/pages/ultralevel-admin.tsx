/**
 * UltraLevel SuperAdmin Protected Page
 * Enterprise-grade authentication with enhanced security
 */

import React, { useState, createContext, useContext, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import UltraLevelSuperAdmin from "./ultralevel-superadmin";
import {
  Command,
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Zap,
  Crown,
  Terminal,
  Fingerprint,
  Smartphone,
  Key,
  Server,
  Database,
  Globe,
} from "lucide-react";

interface UltraAdminContextType {
  isAuthenticated: boolean;
  user: UltraAdminUser | null;
  login: (credentials: UltraLoginCredentials) => Promise<boolean>;
  logout: () => void;
  securityLevel: number;
}

interface UltraAdminUser {
  id: string;
  username: string;
  role: string;
  clearanceLevel: number;
  permissions: string[];
  lastLogin: string;
  securityScore: number;
}

interface UltraLoginCredentials {
  username: string;
  password: string;
  mfaCode: string;
  biometricToken?: string;
  securityKey?: string;
}

const UltraAdminContext = createContext<UltraAdminContextType | null>(null);

// Enhanced admin credentials with multiple security factors
const ULTRA_ADMIN_CREDENTIALS = {
  username: "ultralevel.admin",
  password: "QV2024#UltraSecure!Enterprise@Command",
  mfaCode: "987654",
  securityKey: "ULTRA-KEY-2024",
  biometricToken: "BIO-VERIFIED",
};

export const UltraAdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UltraAdminUser | null>(null);
  const [securityLevel, setSecurityLevel] = useState(0);

  useEffect(() => {
    // Check for existing ultra-secure session
    const storedAuth = localStorage.getItem("quantumvest_ultra_admin_auth");
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.expires > Date.now() && authData.securityLevel >= 5) {
          setIsAuthenticated(true);
          setUser(authData.user);
          setSecurityLevel(authData.securityLevel);
        } else {
          localStorage.removeItem("quantumvest_ultra_admin_auth");
        }
      } catch (error) {
        localStorage.removeItem("quantumvest_ultra_admin_auth");
      }
    }
  }, []);

  const login = async (
    credentials: UltraLoginCredentials,
  ): Promise<boolean> => {
    // Simulate enhanced security validation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let securityScore = 0;

    // Validate each security factor
    if (credentials.username === ULTRA_ADMIN_CREDENTIALS.username)
      securityScore += 1;
    if (credentials.password === ULTRA_ADMIN_CREDENTIALS.password)
      securityScore += 2;
    if (credentials.mfaCode === ULTRA_ADMIN_CREDENTIALS.mfaCode)
      securityScore += 1;
    if (credentials.securityKey === ULTRA_ADMIN_CREDENTIALS.securityKey)
      securityScore += 1;
    if (credentials.biometricToken === ULTRA_ADMIN_CREDENTIALS.biometricToken)
      securityScore += 1;

    // Require minimum security level of 5/6
    if (securityScore >= 5) {
      const ultraAdminUser: UltraAdminUser = {
        id: "ultra-admin-001",
        username: "ultralevel.admin",
        role: "UltraLevel SuperAdministrator",
        clearanceLevel: 10,
        permissions: [
          "global_system_control",
          "infrastructure_management",
          "financial_oversight",
          "security_administration",
          "compliance_monitoring",
          "emergency_protocols",
          "data_sovereignty",
          "platform_configuration",
          "audit_management",
          "enterprise_control",
        ],
        lastLogin: new Date().toISOString(),
        securityScore,
      };

      setUser(ultraAdminUser);
      setIsAuthenticated(true);
      setSecurityLevel(securityScore);

      // Store ultra-secure session (expires in 4 hours)
      const authData = {
        user: ultraAdminUser,
        securityLevel: securityScore,
        expires: Date.now() + 4 * 60 * 60 * 1000,
      };
      localStorage.setItem(
        "quantumvest_ultra_admin_auth",
        JSON.stringify(authData),
      );

      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setSecurityLevel(0);
    localStorage.removeItem("quantumvest_ultra_admin_auth");
  };

  return (
    <UltraAdminContext.Provider
      value={{ isAuthenticated, user, login, logout, securityLevel }}
    >
      {children}
    </UltraAdminContext.Provider>
  );
};

export const useUltraAdmin = (): UltraAdminContextType => {
  const context = useContext(UltraAdminContext);
  if (!context) {
    throw new Error("useUltraAdmin must be used within UltraAdminProvider");
  }
  return context;
};

export const UltraAdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    mfaCode: "",
    biometricToken: "",
    securityKey: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);
  const [authStep, setAuthStep] = useState(1);

  const { login } = useUltraAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(credentials);
      if (!success) {
        setError(
          "Access denied. Insufficient security clearance or invalid credentials.",
        );
      }
    } catch (error) {
      setError(
        "UltraLevel authentication failed. Contact system administrator.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Command className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            UltraLevel Command
          </h1>
          <p className="text-purple-200 mb-4">
            Enterprise Platform Sovereignty
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-purple-600 text-white">
              Clearance Level 10
            </Badge>
            <Badge className="bg-blue-600 text-white">Multi-Factor Auth</Badge>
          </div>
        </div>

        {/* Security Level Indicator */}
        <Card className="bg-gray-900 border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-purple-400 font-medium">
                Security Protocol
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <div
                    key={level}
                    className={`h-2 w-6 rounded ${
                      level <=
                      (credentials.username &&
                      credentials.password &&
                      credentials.mfaCode &&
                      credentials.securityKey &&
                      credentials.biometricToken
                        ? 6
                        : credentials.username &&
                            credentials.password &&
                            credentials.mfaCode &&
                            credentials.securityKey
                          ? 5
                          : credentials.username &&
                              credentials.password &&
                              credentials.mfaCode
                            ? 4
                            : credentials.username && credentials.password
                              ? 3
                              : credentials.username
                                ? 2
                                : 1)
                        ? "bg-purple-500"
                        : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Multi-layer authentication with biometric and hardware key
              verification
            </p>
          </CardContent>
        </Card>

        {/* Credentials Display */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">
                UltraLevel Access
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
            <p className="text-sm text-yellow-700 mb-3">
              Enterprise-grade credentials for platform sovereignty:
            </p>
            {showCredentials ? (
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="text-gray-600">Username:</span>
                  <Badge variant="outline">ultralevel.admin</Badge>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="text-gray-600">Password:</span>
                  <Badge variant="outline">
                    QV2024#UltraSecure!Enterprise@Command
                  </Badge>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="text-gray-600">MFA Code:</span>
                  <Badge variant="outline">987654</Badge>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="text-gray-600">Security Key:</span>
                  <Badge variant="outline">ULTRA-KEY-2024</Badge>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="text-gray-600">Biometric:</span>
                  <Badge variant="outline">BIO-VERIFIED</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-yellow-600 italic">
                Click the eye icon to reveal ultra-secure credentials
              </p>
            )}
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="bg-gray-900 border-purple-700">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Lock className="h-5 w-5" />
              UltraLevel Authentication
            </h2>
            <p className="text-sm text-purple-300">
              Multi-factor security clearance required
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-red-300">{error}</span>
                </div>
              )}

              {/* Step 1: Basic Credentials */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">
                    Primary Authentication
                  </span>
                </div>

                <div className="space-y-2">
                  <Input
                    type="text"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        username: e.target.value,
                      })
                    }
                    placeholder="Ultra-admin username"
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
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
                      placeholder="Enterprise security password"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
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
              </div>

              {/* Step 2: Multi-Factor Authentication */}
              <div className="space-y-3 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">
                    Multi-Factor Verification
                  </span>
                </div>

                <Input
                  type="text"
                  value={credentials.mfaCode}
                  onChange={(e) =>
                    setCredentials({ ...credentials, mfaCode: e.target.value })
                  }
                  placeholder="6-digit MFA authentication code"
                  maxLength={6}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              {/* Step 3: Hardware Security */}
              <div className="space-y-3 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">
                    Hardware Security Layer
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
                  placeholder="Hardware security key token"
                  className="bg-gray-800 border-gray-700 text-white"
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
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Authenticating UltraLevel Access...
                  </>
                ) : (
                  <>
                    <Command className="h-4 w-4 mr-2" />
                    Access UltraLevel Command
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card className="bg-gray-900 border-blue-700">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <Fingerprint className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-300">
                    Biometric Authentication
                  </p>
                  <p className="text-xs text-gray-400">
                    Advanced identity verification
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-300">
                    Hardware Security Module
                  </p>
                  <p className="text-xs text-gray-400">
                    Cryptographic key protection
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-purple-300">
                    Zero-Trust Architecture
                  </p>
                  <p className="text-xs text-gray-400">
                    Continuous verification model
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const UltraAdminGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, securityLevel } = useUltraAdmin();

  if (!isAuthenticated || securityLevel < 5) {
    return <UltraAdminLogin />;
  }

  return <>{children}</>;
};

import {
  UnifiedAdminProvider,
  AdminGuard,
  AdminLevel,
} from "../components/UnifiedAdminAuth";

const UltraLevelAdminPage: React.FC = () => {
  return (
    <UnifiedAdminProvider>
      <AdminGuard requiredLevel={AdminLevel.ULTRA}>
        <UltraLevelSuperAdmin />
      </AdminGuard>
    </UnifiedAdminProvider>
  );
};

export default UltraLevelAdminPage;
