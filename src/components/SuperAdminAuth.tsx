/**
 * SuperAdmin Authentication Provider
 * Handles login and access control for admin dashboard
 */

import React, { useState, createContext, useContext, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Zap,
  Crown,
} from "lucide-react";

interface SuperAdminContextType {
  isAuthenticated: boolean;
  user: SuperAdminUser | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

interface SuperAdminUser {
  id: string;
  username: string;
  role: string;
  permissions: string[];
  lastLogin: string;
}

interface LoginCredentials {
  username: string;
  password: string;
  mfaCode?: string;
}

const SuperAdminContext = createContext<SuperAdminContextType | null>(null);

// Seed admin credentials (in production, these would be in a secure database)
const ADMIN_CREDENTIALS = {
  username: "quantumadmin",
  password: "QV2024!SuperSecure#Admin",
  mfaSecret: "789123", // Simplified MFA for demo
};

export const SuperAdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SuperAdminUser | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedAuth = localStorage.getItem("quantumvest_admin_auth");
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.expires > Date.now()) {
          setIsAuthenticated(true);
          setUser(authData.user);
        } else {
          localStorage.removeItem("quantumvest_admin_auth");
        }
      } catch (error) {
        localStorage.removeItem("quantumvest_admin_auth");
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password &&
      credentials.mfaCode === ADMIN_CREDENTIALS.mfaSecret
    ) {
      const adminUser: SuperAdminUser = {
        id: "admin-001",
        username: "quantumadmin",
        role: "Super Administrator",
        permissions: [
          "vault_management",
          "user_management",
          "ritual_oversight",
          "ai_agent_control",
          "system_configuration",
          "data_export",
        ],
        lastLogin: new Date().toISOString(),
      };

      setUser(adminUser);
      setIsAuthenticated(true);

      // Store session (expires in 8 hours)
      const authData = {
        user: adminUser,
        expires: Date.now() + 8 * 60 * 60 * 1000,
      };
      localStorage.setItem("quantumvest_admin_auth", JSON.stringify(authData));

      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("quantumvest_admin_auth");
  };

  return (
    <SuperAdminContext.Provider
      value={{ isAuthenticated, user, login, logout }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdmin = (): SuperAdminContextType => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error("useSuperAdmin must be used within SuperAdminProvider");
  }
  return context;
};

export const SuperAdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    mfaCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);

  const { login } = useSuperAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(credentials);
      if (!success) {
        setError(
          "Invalid credentials. Please check your username, password, and MFA code.",
        );
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            QuantumVest SuperAdmin
          </h1>
          <p className="text-blue-200">
            Secure access to platform administration
          </p>
        </div>

        {/* Demo Credentials Card */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">Demo Access</h3>
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
              Use these credentials to access the SuperAdmin dashboard:
            </p>
            {showCredentials ? (
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="text-gray-600">Username:</span>
                  <Badge variant="outline">quantumadmin</Badge>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="text-gray-600">Password:</span>
                  <Badge variant="outline">QV2024!SuperSecure#Admin</Badge>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="text-gray-600">MFA Code:</span>
                  <Badge variant="outline">789123</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-yellow-600 italic">
                Click the eye icon to reveal credentials
              </p>
            )}
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Secure Login
            </h2>
            <p className="text-sm text-gray-600">
              Enter your administrator credentials
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  type="text"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  placeholder="Enter admin username"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
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
                    placeholder="Enter admin password"
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

              <div className="space-y-2">
                <label className="text-sm font-medium">MFA Code</label>
                <Input
                  type="text"
                  value={credentials.mfaCode}
                  onChange={(e) =>
                    setCredentials({ ...credentials, mfaCode: e.target.value })
                  }
                  placeholder="Enter 6-digit MFA code"
                  maxLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Access SuperAdmin
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Secure Access Protected
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Your session is encrypted and will expire automatically for
                  security.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const SuperAdminGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useSuperAdmin();

  if (!isAuthenticated) {
    return <SuperAdminLogin />;
  }

  return <>{children}</>;
};
