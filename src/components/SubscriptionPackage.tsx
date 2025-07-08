/**
 * Subscription Package Component
 * Reusable component for displaying subscription plans with payment integration
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  CheckCircle,
  XCircle,
  Star,
  Zap,
  Crown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { SubscriptionPlan } from "../types/Payment";

interface SubscriptionPackageProps {
  plans: SubscriptionPlan[];
  onPlanSelect: (plan: SubscriptionPlan) => void;
  billingCycle?: "monthly" | "annual";
  popularPlanId?: string;
  className?: string;
  showFeatureComparison?: boolean;
}

export const SubscriptionPackage: React.FC<SubscriptionPackageProps> = ({
  plans,
  onPlanSelect,
  billingCycle = "monthly",
  popularPlanId,
  className = "",
  showFeatureComparison = true,
}) => {
  const filteredPlans = plans.filter(
    (plan) => plan.billing_cycle === billingCycle,
  );

  const getPlanIcon = (planId: string) => {
    if (planId.includes("starter"))
      return <Star className="h-6 w-6 text-blue-600" />;
    if (planId.includes("professional"))
      return <Zap className="h-6 w-6 text-purple-600" />;
    if (planId.includes("enterprise"))
      return <Crown className="h-6 w-6 text-yellow-600" />;
    return <Star className="h-6 w-6 text-blue-600" />;
  };

  const getPlanColor = (planId: string) => {
    if (planId.includes("starter")) return "border-blue-200 bg-blue-50/50";
    if (planId.includes("professional"))
      return "border-purple-200 bg-purple-50/50";
    if (planId.includes("enterprise"))
      return "border-yellow-200 bg-yellow-50/50";
    return "border-gray-200 bg-gray-50/50";
  };

  const getPlanButtonColor = (planId: string) => {
    if (planId.includes("starter")) return "bg-blue-600 hover:bg-blue-700";
    if (planId.includes("professional"))
      return "bg-purple-600 hover:bg-purple-700";
    if (planId.includes("enterprise"))
      return "bg-yellow-600 hover:bg-yellow-700";
    return "bg-blue-600 hover:bg-blue-700";
  };

  const getAnnualSavings = (plan: SubscriptionPlan) => {
    const monthlyEquivalent = plans.find(
      (p) =>
        p.billing_cycle === "monthly" &&
        p.name.split(" ")[0] === plan.name.split(" ")[0],
    );

    if (!monthlyEquivalent) return 0;

    const monthlyTotal = monthlyEquivalent.price * 12;
    const savings = monthlyTotal - plan.price;
    return Math.round((savings / monthlyTotal) * 100);
  };

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => {
          const isPopular = plan.id === popularPlanId;
          const annualSavings =
            billingCycle === "annual" ? getAnnualSavings(plan) : 0;

          return (
            <Card
              key={plan.id}
              className={`relative transition-all duration-300 hover:shadow-lg hover:scale-105 ${getPlanColor(plan.id)} ${
                isPopular ? "ring-2 ring-purple-500 shadow-lg" : ""
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-3 py-1 text-sm font-semibold">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {annualSavings > 0 && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-600 text-white px-2 py-1 text-xs">
                    Save {annualSavings}%
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  {getPlanIcon(plan.id)}
                </div>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <p className="text-gray-600 text-sm mt-2">{plan.description}</p>

                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.currency}${plan.price}
                    </span>
                    <span className="text-gray-500 ml-1">
                      /{plan.billing_cycle}
                    </span>
                  </div>

                  {billingCycle === "annual" && (
                    <p className="text-sm text-gray-500 mt-1">
                      ${(plan.price / 12).toFixed(2)}/month billed annually
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features List */}
                {showFeatureComparison && (
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        {feature.included ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p
                            className={`text-sm ${feature.included ? "text-gray-900" : "text-gray-500"}`}
                          >
                            {feature.name}
                          </p>
                          {feature.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Plan Limits */}
                {plan.limits && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Plan Limits:
                    </p>
                    <div className="space-y-1 text-xs text-gray-600">
                      {plan.limits.api_calls && (
                        <p>
                          • {plan.limits.api_calls.toLocaleString()} API
                          calls/month
                        </p>
                      )}
                      {plan.limits.storage_gb && (
                        <p>• {plan.limits.storage_gb}GB storage</p>
                      )}
                      {plan.limits.concurrent_sessions && (
                        <p>
                          • {plan.limits.concurrent_sessions} concurrent
                          session(s)
                        </p>
                      )}
                      {plan.limits.support_level && (
                        <p>• {plan.limits.support_level} support</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Archetype Access */}
                {plan.archetype_access && plan.archetype_access.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Archetype Access:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {plan.archetype_access.map((archetype, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {archetype.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Select Plan Button */}
                <Button
                  onClick={() => onPlanSelect(plan)}
                  className={`w-full mt-6 font-semibold transition-all duration-200 ${getPlanButtonColor(plan.id)}`}
                  size="lg"
                >
                  Choose {plan.name}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                {/* Additional Info */}
                <p className="text-xs text-gray-500 text-center mt-3">
                  {billingCycle === "monthly"
                    ? "Cancel anytime"
                    : "Best value - save up to 20%"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison Note */}
      {showFeatureComparison && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            All plans include 14-day free trial • Cancel anytime • 24/7 support
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPackage;
