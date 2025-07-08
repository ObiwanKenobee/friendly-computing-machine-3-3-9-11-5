import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  superAdminAuthService,
  SuperAdminLoginRequest,
  DEFAULT_SUPER_ADMIN_CREDENTIALS,
} from "../services/superAdminAuthService";

interface SuperAdminLoginProps {
  onLoginSuccess: () => void;
}

const SuperAdminLogin: React.FC<SuperAdminLoginProps> = ({
  onLoginSuccess,
}) => {
  const [formData, setFormData] = useState<SuperAdminLoginRequest>({
    username: "",
    password: "",
    mfaCode: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);

  const handleInputChange = (
    field: keyof SuperAdminLoginRequest,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Username and password are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await superAdminAuthService.login(formData);

      if (response.success) {
        onLoginSuccess();
      } else if (response.requiresMFA) {
        setShowMFA(true);
        setError("Please enter your MFA code");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const seedAndLogin = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Seed the default super admin
      const seeded = await superAdminAuthService.seedDefaultSuperAdmin();

      if (seeded) {
        // Auto-fill the form with default credentials
        setFormData({
          username: DEFAULT_SUPER_ADMIN_CREDENTIALS.username,
          password: DEFAULT_SUPER_ADMIN_CREDENTIALS.password,
          mfaCode: "",
          rememberMe: false,
        });
        setShowCredentials(true);
      } else {
        setError("Super admin already exists or seeding failed");
      }
    } catch (error) {
      setError("Failed to seed super admin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Super Admin</h1>
          <p className="text-slate-400">QuantumVest Enterprise Control Panel</p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Administrator Access</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your super admin credentials to access the control panel
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username */}
              <div>
                <Label htmlFor="username" className="text-slate-200">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Enter your username"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Enter your password"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* MFA Code (if required) */}
              {showMFA && (
                <div>
                  <Label htmlFor="mfaCode" className="text-slate-200">
                    MFA Code
                  </Label>
                  <Input
                    id="mfaCode"
                    type="text"
                    value={formData.mfaCode}
                    onChange={(e) =>
                      handleInputChange("mfaCode", e.target.value)
                    }
                    placeholder="Enter 6-digit MFA code"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    For demo purposes, use:{" "}
                    <code className="bg-slate-700 px-1 rounded">123456</code>
                  </p>
                </div>
              )}

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    handleInputChange("rememberMe", checked as boolean)
                  }
                  className="border-slate-600"
                />
                <Label htmlFor="rememberMe" className="text-slate-200 text-sm">
                  Remember me for 30 days
                </Label>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="bg-red-900/50 border-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-200">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Alert for Seeded Credentials */}
              {showCredentials && (
                <Alert className="bg-green-900/50 border-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-200">
                    Super admin created! Credentials auto-filled above.
                    <br />
                    <strong>
                      Please change the password after first login.
                    </strong>
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In
                  </div>
                )}
              </Button>

              {/* Seed Default Admin Button */}
              <div className="pt-4 border-t border-slate-600">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={seedAndLogin}
                  disabled={isLoading}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Create Default Super Admin
                </Button>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  First time setup? Click above to create the default admin
                  account
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            🔒 This is a secure area. All access attempts are logged and
            monitored.
          </p>
        </div>

        {/* Development Info */}
        <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-2">
            Development Credentials:
          </h3>
          <div className="text-xs text-slate-300 space-y-1">
            <p>
              <strong>Username:</strong>{" "}
              <code className="bg-slate-700 px-1 rounded">superadmin</code>
            </p>
            <p>
              <strong>Password:</strong>{" "}
              <code className="bg-slate-700 px-1 rounded">
                QuantumVest@2024!
              </code>
            </p>
            <p>
              <strong>MFA Code:</strong>{" "}
              <code className="bg-slate-700 px-1 rounded">123456</code> (demo)
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            These are demo credentials. In production, ensure strong passwords
            and proper MFA.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
