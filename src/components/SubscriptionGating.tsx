/**
 * Subscription Gating Component
 * Controls access to features based on subscription tier
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Lock,
  Crown,
  Star,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { usePaymentBanner } from "../hooks/usePaymentBanner";

interface SubscriptionGateProps {
  requiredTier: "starter" | "professional" | "enterprise";
  currentTier?: "free" | "starter" | "professional" | "enterprise";
  featureName: string;
  description: string;
  benefits: string[];
  children?: React.ReactNode;
  className?: string;
}

const tierDetails = {
  starter: {
    name: "Starter",
    price: 29,
    color: "bg-blue-100 text-blue-800",
    icon: <Star className="h-5 w-5" />,
    features: [
      "Basic Analytics",
      "Educational Resources",
      "Personal Portfolio",
    ],
  },
  professional: {
    name: "Professional",
    price: 99,
    color: "bg-purple-100 text-purple-800",
    icon: <Crown className="h-5 w-5" />,
    features: [
      "Advanced Analytics",
      "API Access",
      "Client Management",
      "Compliance Tools",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 299,
    color: "bg-orange-100 text-orange-800",
    icon: <Shield className="h-5 w-5" />,
    features: [
      "Institutional Tools",
      "Custom Reporting",
      "Legendary Strategies",
      "White-label Solutions",
    ],
  },
};

const tierHierarchy = ["free", "starter", "professional", "enterprise"];

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  requiredTier,
  currentTier = "free",
  featureName,
  description,
  benefits,
  children,
  className = "",
}) => {
  const { openPaymentBanner } = usePaymentBanner();

  const hasAccess =
    tierHierarchy.indexOf(currentTier) >= tierHierarchy.indexOf(requiredTier);
  const tierInfo = tierDetails[requiredTier];

  const handleUpgrade = () => {
    openPaymentBanner({
      selectedPlan: {
        id: requiredTier,
        name: tierInfo.name,
        price: tierInfo.price,
        interval: "month" as const,
        features: tierInfo.features,
      },
      prefilledData: {
        featureAccess: featureName,
      },
    });
  };

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${className}`}
    >
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Lock className="h-8 w-8 text-gray-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {featureName} - Premium Feature
          </CardTitle>
          <p className="text-gray-600">{description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Required Tier Info */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {tierInfo.icon}
              <Badge className={tierInfo.color}>{tierInfo.name} Required</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${tierInfo.price}
              <span className="text-lg font-normal text-gray-600">/month</span>
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              What you'll get:
            </h3>
            <div className="space-y-2">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tier Features */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              {tierInfo.name} Tier Includes:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {tierInfo.features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Tier Alert */}
          <Alert>
            <AlertDescription>
              You're currently on the{" "}
              <strong>
                {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
              </strong>{" "}
              tier. Upgrade to <strong>{tierInfo.name}</strong> to access this
              feature and many more.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleUpgrade} className="flex-1 group">
              Upgrade to {tierInfo.name}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/pricing")}
              className="flex-1"
            >
              View All Plans
            </Button>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-gray-600"
            >
              ← Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component for wrapping protected content
export const ProtectedFeature: React.FC<SubscriptionGateProps> = (props) => {
  return <SubscriptionGate {...props} />;
};

export default SubscriptionGate;
