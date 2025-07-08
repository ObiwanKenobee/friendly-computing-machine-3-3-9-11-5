import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import {
  Lock,
  Crown,
  CheckCircle,
  X,
  CreditCard,
  Star,
  Zap,
  Shield,
  Globe,
  Smartphone,
  TrendingUp,
  Users,
  BarChart3,
  MessageCircle,
  Clock,
} from "lucide-react";
import {
  paywallProtectionService,
  type SubscriptionTier,
} from "../services/paywallProtectionService";
import { enhancedPaymentService } from "../services/enhancedPaymentService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  archetypeId: string;
  userId: string;
  fallbackComponent?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  archetypeId,
  userId,
  fallbackComponent,
}) => {
  // Validate required props
  if (!archetypeId || !userId) {
    console.error("ProtectedRoute: Missing required props", {
      archetypeId,
      userId,
    });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Invalid route configuration. Please contact support.</p>
        </div>
      </div>
    );
  }

  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
  }, [archetypeId, userId]);

  const checkAccess = () => {
    setLoading(true);
    const access = paywallProtectionService.hasAccessToArchetype(
      userId,
      archetypeId,
    );
    setHasAccess(access);
    setShowPaywall(!access);
    setLoading(false);
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (!tier || !userId) {
      console.warn("Missing required parameters for upgrade:", {
        tier,
        userId,
      });
      return;
    }

    setUpgrading(true);
    setUpgradeError(null);
    setUpgradeSuccess(false);

    try {
      // Validate input parameters
      if (!["free", "starter", "professional", "enterprise"].includes(tier)) {
        throw new Error(`Invalid subscription tier: ${tier}`);
      }

      const result = await paywallProtectionService.upgradeSubscription(
        userId,
        tier,
      );

      if (result && result.success) {
        setUpgradeSuccess(true);
        setHasAccess(true);
        setShowPaywall(false);

        // Wait a moment to show success message, then redirect
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // Handle upgrade failure with proper error message extraction
        let errorMessage = "Unknown upgrade error";
        if (result?.error) {
          if (typeof result.error === "string") {
            errorMessage = result.error;
          } else if (result.error.message) {
            errorMessage = result.error.message;
          } else if (result.error.code) {
            errorMessage = `Upgrade error: ${result.error.code}`;
          }
        }

        console.error("Upgrade failed:", errorMessage, result);
        setUpgradeError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Upgrade error:", errorMessage, error);
      setUpgradeError(`Upgrade error: ${errorMessage}`);
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            Checking access permissions...
          </p>
        </div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  return (
    <PaywallComponent
      archetypeId={archetypeId}
      userId={userId}
      onUpgrade={handleUpgrade}
      upgrading={upgrading}
      onClose={() => navigate("/pricing")}
      upgradeError={upgradeError}
      upgradeSuccess={upgradeSuccess}
      onClearError={() => setUpgradeError(null)}
    />
  );
};

interface PaywallComponentProps {
  archetypeId: string;
  userId: string;
  onUpgrade: (tier: SubscriptionTier) => void;
  upgrading: boolean;
  onClose: () => void;
  upgradeError?: string | null;
  upgradeSuccess?: boolean;
  onClearError?: () => void;
}

const PaywallComponent: React.FC<PaywallComponentProps> = ({
  archetypeId,
  userId,
  onUpgrade,
  upgrading,
  onClose,
  upgradeError,
  upgradeSuccess,
  onClearError,
}) => {
  const subscription = paywallProtectionService.getUserSubscription(userId);
  const paywallMessage = paywallProtectionService.generatePaywallMessage(
    userId,
    archetypeId,
  );
  const trialStatus = paywallProtectionService.getTrialStatus(userId);
  const accessStatus =
    paywallProtectionService.getArchetypeAccessStatus(userId);

  const archetypeNames: Record<string, string> = {
    "emerging-market-citizen": "Emerging Market Citizen",
    "retail-investor": "Retail Investor",
    "institutional-investor": "Institutional Investor",
    "cultural-investor": "Cultural Investor",
    "developer-integrator": "Developer Integrator",
    "african-market-enterprise": "African Market Enterprise",
    "diaspora-investor": "Diaspora Investor",
    "financial-advisor": "Financial Advisor",
    "public-sector-ngo": "Public Sector & NGO",
    "quant-data-driven-investor": "Quantitative Investor",
    "student-early-career": "Student & Early Career",
    "wildlife-conservation-enterprise": "Wildlife Conservation",
    "quantum-enterprise-2050": "Quantum Enterprise 2050",
  };

  const tierFeatures = {
    starter: [
      {
        icon: <Smartphone className="h-4 w-4" />,
        text: "Mobile-optimized dashboard",
      },
      { icon: <Globe className="h-4 w-4" />, text: "Multi-currency support" },
      {
        icon: <TrendingUp className="h-4 w-4" />,
        text: "Real-time data feeds",
      },
      {
        icon: <CheckCircle className="h-4 w-4" />,
        text: "3 investment archetypes",
      },
    ],
    professional: [
      { icon: <BarChart3 className="h-4 w-4" />, text: "Advanced analytics" },
      { icon: <MessageCircle className="h-4 w-4" />, text: "Priority support" },
      { icon: <Shield className="h-4 w-4" />, text: "Custom reports" },
      { icon: <Zap className="h-4 w-4" />, text: "API access" },
      { icon: <Users className="h-4 w-4" />, text: "8 investment archetypes" },
    ],
    enterprise: [
      { icon: <Crown className="h-4 w-4" />, text: "All 13 archetypes" },
      { icon: <Star className="h-4 w-4" />, text: "White-label options" },
      { icon: <Shield className="h-4 w-4" />, text: "Enterprise security" },
      { icon: <Users className="h-4 w-4" />, text: "Dedicated support" },
      {
        icon: <BarChart3 className="h-4 w-4" />,
        text: "Unlimited AI insights",
      },
    ],
  };

  const currentArchetypeName = archetypeNames[archetypeId] || archetypeId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Premium Feature</h1>
          </div>
          <p className="text-slate-300 text-lg">
            Unlock {currentArchetypeName} to access advanced investment insights
          </p>

          {/* Success Message */}
          {upgradeSuccess && (
            <Alert className="mt-4 bg-green-900/50 border-green-400 max-w-md mx-auto">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-100">
                <strong>Upgrade Successful!</strong> Redirecting to your new
                features...
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {upgradeError && (
            <Alert className="mt-4 bg-red-900/50 border-red-400 max-w-md mx-auto">
              <X className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Upgrade Failed:</strong> {upgradeError}
                  </div>
                  {onClearError && (
                    <button
                      onClick={onClearError}
                      className="ml-2 text-red-300 hover:text-red-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {trialStatus.isInTrial && (
            <Alert className="mt-4 bg-blue-900/50 border-blue-400">
              <Clock className="h-4 w-4" />
              <AlertDescription className="text-blue-100">
                You have {trialStatus.daysRemaining} days remaining in your free
                trial
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Current Access Overview */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Plan:{" "}
              {subscription.tier.charAt(0).toUpperCase() +
                subscription.tier.slice(1)}
            </CardTitle>
            <CardDescription>
              You have access to {subscription.features.maxArchetypes} of 13
              investment archetypes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {accessStatus.map(({ archetype, hasAccess }, index) => (
                <div
                  key={archetype}
                  className={`p-3 rounded-lg border ${
                    hasAccess
                      ? "bg-green-900/20 border-green-400 text-green-300"
                      : "bg-slate-700/50 border-slate-600 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{archetypeNames[archetype]}</span>
                    {hasAccess ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Lock className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Access Progress</span>
                <span className="text-white">
                  {subscription.features.maxArchetypes} / 13 archetypes
                </span>
              </div>
              <Progress
                value={(subscription.features.maxArchetypes / 13) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {(["starter", "professional", "enterprise"] as const).map((tier) => {
            const pricing = paywallProtectionService.getTierPricing(tier);
            const isRecommended = tier === paywallMessage.recommendedTier;
            const features = tierFeatures[tier];

            return (
              <Card
                key={tier}
                className={`relative bg-slate-800/50 border-slate-700 ${
                  isRecommended ? "ring-2 ring-purple-400 bg-purple-900/20" : ""
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-white capitalize flex items-center justify-between">
                    {tier}
                    {tier === "enterprise" && (
                      <Crown className="h-5 w-5 text-yellow-400" />
                    )}
                  </CardTitle>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-white">
                      ${pricing.monthlyPrice}
                      <span className="text-sm text-slate-400 font-normal">
                        /month
                      </span>
                    </div>
                    {pricing.savings > 0 && (
                      <div className="text-sm text-green-400">
                        Save ${pricing.savings} with annual billing
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="text-green-400">{feature.icon}</div>
                        <span className="text-slate-300">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    variant={isRecommended ? "default" : "outline"}
                    onClick={() => {
                      try {
                        onUpgrade(tier);
                      } catch (error) {
                        console.error("Error in onUpgrade handler:", error);
                      }
                    }}
                    disabled={upgrading}
                  >
                    {upgrading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Upgrade to {tier}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Preview for Healthcare Dashboard */}
        {archetypeId === "emerging-market-citizen" && (
          <Card className="mb-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-400">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Healthcare Investment Dashboard Preview
              </CardTitle>
              <CardDescription className="text-blue-100">
                Experience our multilingual, AI-powered platform designed for
                emerging markets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">
                    🌍 Multilingual Support
                  </h4>
                  <p className="text-sm text-blue-100">
                    AI explanations in your local language with cultural
                    adaptation
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">
                    📱 Mobile-First Design
                  </h4>
                  <p className="text-sm text-blue-100">
                    Optimized for mobile devices with low-bandwidth fallback
                    modes
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">
                    🏥 Healthcare Tokenization
                  </h4>
                  <p className="text-sm text-blue-100">
                    Real-time ROI tracking on tokenized healthcare assets
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">
                    🤖 Explainable AI
                  </h4>
                  <p className="text-sm text-blue-100">
                    Every recommendation explained in simple terms
                  </p>
                </div>
              </div>

              <Alert className="bg-green-900/20 border-green-400">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-100">
                  <strong>Special Offer:</strong> Get immediate access to the
                  Healthcare Dashboard with any paid plan. Perfect for
                  first-time investors in emerging markets!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-slate-800/30 rounded-lg">
            <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white">Secure Payments</h3>
            <p className="text-sm text-slate-300">
              PayPal & Paystack integration
            </p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-lg">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white">10,000+ Users</h3>
            <p className="text-sm text-slate-300">
              Trusted by investors worldwide
            </p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-lg">
            <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white">Cancel Anytime</h3>
            <p className="text-sm text-slate-300">No long-term commitments</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => {
              try {
                onClose();
              } catch (error) {
                console.error("Error in onClose handler:", error);
              }
            }}
            className="border-slate-600 text-slate-300"
          >
            View All Plans
          </Button>
          <Button
            onClick={() => {
              try {
                navigate("/");
              } catch (error) {
                console.error("Navigation error:", error);
                // Fallback navigation
                window.location.href = "/";
              }
            }}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Back to Platform
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
