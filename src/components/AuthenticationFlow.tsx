/**
 * Authentication Flow Component
 * Handles authentication and onboarding after payment
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import {
  CheckCircle,
  ArrowRight,
  User,
  Shield,
  Sparkles,
  Crown,
  Loader2,
} from "lucide-react";
import { useQuantumAuth } from "../hooks/useQuantumAuth";
import type { SubscriptionPlan } from "../types/Payment";

interface AuthenticationFlowProps {
  onComplete: (userData: any) => void;
}

interface PendingPayment {
  plan: SubscriptionPlan;
  archetype: string;
  userDetails: any;
  provider: "paypal" | "paystack";
  transactionId: string;
}

export const AuthenticationFlow: React.FC<AuthenticationFlowProps> = ({
  onComplete,
}) => {
  const { quantumIdentity, authenticate, initializeIdentity, isAuthenticated } =
    useQuantumAuth();
  const [step, setStep] = useState<"auth" | "onboarding" | "complete">("auth");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [onboardingData, setOnboardingData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    investmentExperience: "",
    riskTolerance: "",
    investmentGoals: [],
  });

  useEffect(() => {
    // Load pending payment data from localStorage
    const pendingPaymentData = localStorage.getItem("pendingPayment");
    if (pendingPaymentData) {
      const payment = JSON.parse(pendingPaymentData);
      setPendingPayment(payment);

      // Pre-fill email if available
      if (payment.userDetails?.email) {
        setAuthData((prev) => ({ ...prev, email: payment.userDetails.email }));
      }
    }

    // Check if user is already authenticated
    if (isAuthenticated) {
      setStep("onboarding");
    }
  }, [isAuthenticated]);

  const handleAuthentication = async () => {
    if (!authData.email || !authData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (
      authMode === "signup" &&
      authData.password !== authData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use the authenticate method instead of signIn/signUp
      const authResult = await authenticate({
        email: authData.email,
        password: authData.password,
        isSignUp: authMode === "signup",
      });

      if (authResult.success) {
        // Initialize identity if signing up
        if (authMode === "signup") {
          await initializeIdentity(
            authResult.userId || `user-${Date.now()}`,
            "retail_investor", // Default archetype
            { email: authData.email },
          );
        }
        setStep("onboarding");
      } else {
        throw new Error(authResult.error || "Authentication failed");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboarding = async () => {
    if (!onboardingData.firstName || !onboardingData.lastName) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Complete onboarding process
      const userData = {
        ...onboardingData,
        subscription: pendingPayment?.plan,
        archetype: pendingPayment?.archetype,
        paymentProvider: pendingPayment?.provider,
        transactionId: pendingPayment?.transactionId,
      };

      // Simulate onboarding API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStep("complete");

      // Navigate to enterprise page after completion
      setTimeout(() => {
        navigateToEnterprisePage();
      }, 3000);

      onComplete(userData);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToEnterprisePage = () => {
    if (!pendingPayment) return;

    const enterpriseRoutes: Record<string, string> = {
      "emerging-market-citizen": "/emerging-market-citizen",
      "retail-investor": "/retail-investor",
      "cultural-investor": "/cultural-investor",
      "diaspora-investor": "/diaspora-investor",
      "financial-advisor": "/financial-advisor",
      "developer-integrator": "/developer-integrator",
      "institutional-investor": "/institutional-investor",
      "african-market-enterprise": "/african-market-enterprise",
    };

    const route = enterpriseRoutes[pendingPayment.archetype] || "/dashboard";

    // Clear pending payment data
    localStorage.removeItem("pendingPayment");
    localStorage.setItem("subscriptionActive", "true");
    localStorage.setItem(
      "userSubscription",
      JSON.stringify(pendingPayment.plan),
    );

    window.location.href = route;
  };

  const getStepProgress = () => {
    switch (step) {
      case "auth":
        return 33;
      case "onboarding":
        return 66;
      case "complete":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Setup
          </h1>
          <p className="text-gray-600">
            {pendingPayment
              ? `${pendingPayment.plan.name} • ${pendingPayment.archetype}`
              : "QuantumVest Platform"}
          </p>

          <div className="mt-4">
            <Progress value={getStepProgress()} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span
                className={
                  step === "auth" ? "font-semibold text-purple-600" : ""
                }
              >
                Authentication
              </span>
              <span
                className={
                  step === "onboarding" ? "font-semibold text-purple-600" : ""
                }
              >
                Profile Setup
              </span>
              <span
                className={
                  step === "complete" ? "font-semibold text-purple-600" : ""
                }
              >
                Complete
              </span>
            </div>
          </div>
        </div>

        {/* Authentication Step */}
        {step === "auth" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Create Your Account</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Auth Mode Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setAuthMode("signup")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    authMode === "signup"
                      ? "bg-white text-gray-900 shadow"
                      : "text-gray-600"
                  }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setAuthMode("signin")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    authMode === "signin"
                      ? "bg-white text-gray-900 shadow"
                      : "text-gray-600"
                  }`}
                >
                  Sign In
                </button>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={authData.email}
                  onChange={(e) =>
                    setAuthData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={authData.password}
                  onChange={(e) =>
                    setAuthData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  disabled={loading}
                />
              </div>

              {authMode === "signup" && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={authData.confirmPassword}
                    onChange={(e) =>
                      setAuthData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              )}

              {error && (
                <Alert className="border-red-500 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleAuthentication}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {authMode === "signup"
                      ? "Creating Account..."
                      : "Signing In..."}
                  </>
                ) : (
                  <>
                    {authMode === "signup" ? "Create Account" : "Sign In"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Onboarding Step */}
        {step === "onboarding" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Complete Your Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={onboardingData.firstName}
                    onChange={(e) =>
                      setOnboardingData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={onboardingData.lastName}
                    onChange={(e) =>
                      setOnboardingData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={onboardingData.phone}
                  onChange={(e) =>
                    setOnboardingData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="experience">Investment Experience</Label>
                <select
                  id="experience"
                  value={onboardingData.investmentExperience}
                  onChange={(e) =>
                    setOnboardingData((prev) => ({
                      ...prev,
                      investmentExperience: e.target.value,
                    }))
                  }
                  disabled={loading}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (2-5 years)</option>
                  <option value="advanced">Advanced (5+ years)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="risk">Risk Tolerance</Label>
                <select
                  id="risk"
                  value={onboardingData.riskTolerance}
                  onChange={(e) =>
                    setOnboardingData((prev) => ({
                      ...prev,
                      riskTolerance: e.target.value,
                    }))
                  }
                  disabled={loading}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select risk tolerance</option>
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>

              {error && (
                <Alert className="border-red-500 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleOnboarding}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Setting Up Your Account...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Complete Step */}
        {step === "complete" && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Welcome to QuantumVest!
              </h3>

              <p className="text-gray-600 mb-4">
                Your account has been successfully created and your subscription
                is now active.
              </p>

              {pendingPayment && (
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-purple-800">
                    <strong>{pendingPayment.plan.name}</strong> subscription
                    activated
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    Redirecting to your {pendingPayment.archetype} dashboard...
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Secure authentication powered by QuantumVest
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationFlow;
