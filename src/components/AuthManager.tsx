/**
 * Authentication Manager - Core authentication flow for QuantumVest platform
 * Handles login, registration, and session management
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Shield,
  User,
  Vault,
  Zap,
  Building,
  Users,
  Heart,
} from "lucide-react";

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  error: string | null;
}

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: "individual" | "institutional" | "community";
  region: string;
  acceptTerms: boolean;
}

const AuthManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  });

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "individual",
    region: "",
    acceptTerms: false,
  });

  const userTypes = [
    {
      id: "individual",
      name: "Individual Investor",
      description: "Personal wealth building and investment management",
      icon: <User className="h-5 w-5" />,
      features: ["Personal Vaults", "AI Advisor", "Mobile Management"],
    },
    {
      id: "institutional",
      name: "Institutional",
      description: "Enterprise-grade solutions for organizations",
      icon: <Building className="h-5 w-5" />,
      features: ["Enterprise Vaults", "Admin Dashboard", "Compliance Tools"],
    },
    {
      id: "community",
      name: "Community",
      description: "Collective investment and community finance",
      icon: <Users className="h-5 w-5" />,
      features: ["Diaspora Vaults", "Co-funding", "Cultural Investment"],
    },
  ];

  const regions = [
    { code: "na", name: "North America", flag: "🇺🇸" },
    { code: "eu", name: "Europe", flag: "🇪🇺" },
    { code: "af", name: "Africa", flag: "🌍" },
    { code: "as", name: "Asia", flag: "🌏" },
    { code: "la", name: "Latin America", flag: "🌎" },
    { code: "me", name: "Middle East", flag: "🕌" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful login
      const mockUser = {
        id: "1",
        name: "Eugene Ochako",
        email: loginForm.email,
        userType: "individual",
        region: "af",
        totalValue: "$2.34M",
        activeVaults: 12,
      };

      setAuthState({
        isAuthenticated: true,
        user: mockUser,
        loading: false,
        error: null,
      });

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Invalid credentials. Please try again.",
      }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    // Validation
    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Passwords do not match",
      }));
      return;
    }

    if (!registerForm.acceptTerms) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Please accept the terms and conditions",
      }));
      return;
    }

    try {
      // Simulate registration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful registration
      const mockUser = {
        id: "1",
        name: `${registerForm.firstName} ${registerForm.lastName}`,
        email: registerForm.email,
        userType: registerForm.userType,
        region: registerForm.region,
        totalValue: "$0",
        activeVaults: 0,
      };

      setAuthState({
        isAuthenticated: true,
        user: mockUser,
        loading: false,
        error: null,
      });

      // Redirect to onboarding
      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 1000);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Registration failed. Please try again.",
      }));
    }
  };

  const handleSocialAuth = (provider: string) => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    // Simulate social auth
    setTimeout(() => {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Social authentication not yet implemented",
      }));
    }, 1000);
  };

  if (authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to QuantumVest!
              </h2>
              <p className="text-gray-600 mb-4">
                Authentication successful. Redirecting to your dashboard...
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Name: {authState.user?.name}</p>
                <p>Email: {authState.user?.email}</p>
                <p>Type: {authState.user?.userType}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Vault className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">QuantumVest</h1>
          </div>
          <p className="text-xl text-gray-600">
            Join the sovereign finance revolution
          </p>
          <p className="text-gray-500">
            Access enterprise-grade investment tools and AI-powered portfolio
            optimization
          </p>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Badge className="bg-blue-50 text-blue-700">
                <Shield className="h-4 w-4 mr-1" />
                Enterprise Security
              </Badge>
              <Badge className="bg-green-50 text-green-700">
                <Globe className="h-4 w-4 mr-1" />
                195+ Countries
              </Badge>
              <Badge className="bg-purple-50 text-purple-700">
                <Zap className="h-4 w-4 mr-1" />
                AI-Powered
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Create Account</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={loginForm.rememberMe}
                        onChange={(e) =>
                          setLoginForm((prev) => ({
                            ...prev,
                            rememberMe: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <a
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {authState.error && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-700">
                        {authState.error}
                      </span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={authState.loading}
                  >
                    {authState.loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={registerForm.firstName}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={registerForm.lastName}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="registerEmail"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={registerForm.email}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {userTypes.map((type) => (
                        <label
                          key={type.id}
                          className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            registerForm.userType === type.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="userType"
                            value={type.id}
                            checked={registerForm.userType === type.id}
                            onChange={(e) =>
                              setRegisterForm((prev) => ({
                                ...prev,
                                userType: e.target.value as any,
                              }))
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {type.icon}
                              <span className="font-medium">{type.name}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {type.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {type.features.map((feature, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Primary Region</Label>
                    <select
                      id="region"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={registerForm.region}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          region: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Select your region</option>
                      {regions.map((region) => (
                        <option key={region.code} value={region.code}>
                          {region.flag} {region.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="registerPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create password"
                          className="pl-10 pr-10"
                          value={registerForm.password}
                          onChange={(e) =>
                            setRegisterForm((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          className="pl-10 pr-10"
                          value={registerForm.confirmPassword}
                          onChange={(e) =>
                            setRegisterForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={registerForm.acceptTerms}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          acceptTerms: e.target.checked,
                        }))
                      }
                      className="mt-1 rounded border-gray-300"
                      required
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="text-sm text-gray-600"
                    >
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  {authState.error && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-700">
                        {authState.error}
                      </span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={authState.loading}
                  >
                    {authState.loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Social Auth Options */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSocialAuth("google")}
                  disabled={authState.loading}
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialAuth("apple")}
                  disabled={authState.loading}
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Apple
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialAuth("microsoft")}
                  disabled={authState.loading}
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
                  </svg>
                  Microsoft
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Global Compliance</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>50,000+ Investors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthManager;
