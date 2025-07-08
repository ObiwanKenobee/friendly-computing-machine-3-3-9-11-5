/**
 * Workflow Navigation Component
 * Smart navigation that guides users through operational workflows
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Star,
  Crown,
  Shield,
  Target,
  Lightbulb,
  TrendingUp,
  MapPin,
} from "lucide-react";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  route: string;
  estimatedTime: string;
  tier: "free" | "starter" | "professional" | "enterprise";
  completed?: boolean;
  current?: boolean;
}

interface WorkflowNavigationProps {
  userTier?: "free" | "starter" | "professional" | "enterprise";
  currentPath?: string;
  className?: string;
}

const workflowPaths = {
  newUser: [
    {
      id: "archetypes",
      title: "Discover Your Archetype",
      description: "Complete personality assessment and strategy matching",
      route: "/archetypes",
      estimatedTime: "15min",
      tier: "free" as const,
    },
    {
      id: "dashboard",
      title: "Explore Investment Dashboard",
      description: "Get familiar with portfolio tracking and analytics",
      route: "/dashboard",
      estimatedTime: "10min",
      tier: "free" as const,
    },
    {
      id: "pricing",
      title: "Choose Your Plan",
      description: "Select the subscription tier that fits your needs",
      route: "/pricing",
      estimatedTime: "5min",
      tier: "free" as const,
    },
    {
      id: "feature-access",
      title: "Access Premium Features",
      description: "Unlock advanced tools based on your subscription",
      route: "/enterprise-subscriptions",
      estimatedTime: "30min",
      tier: "starter" as const,
    },
  ],
  retailInvestor: [
    {
      id: "retail-platform",
      title: "Retail Investment Platform",
      description: "User-friendly interface with educational resources",
      route: "/retail-investor",
      estimatedTime: "30min",
      tier: "starter" as const,
    },
    {
      id: "education",
      title: "Investment Education",
      description: "Learn fundamental investment concepts",
      route: "/student-early-career",
      estimatedTime: "20min",
      tier: "starter" as const,
    },
    {
      id: "emerging-markets",
      title: "Emerging Market Opportunities",
      description: "Explore localized investment solutions",
      route: "/emerging-market-citizen",
      estimatedTime: "25min",
      tier: "starter" as const,
    },
  ],
  professionalAdvisor: [
    {
      id: "advisor-tools",
      title: "Financial Advisor Platform",
      description: "Client management and portfolio modeling tools",
      route: "/financial-advisor",
      estimatedTime: "15min",
      tier: "professional" as const,
    },
    {
      id: "developer-integration",
      title: "API Integration",
      description: "Connect with existing systems via API",
      route: "/developer-integrator",
      estimatedTime: "15min",
      tier: "professional" as const,
    },
    {
      id: "cultural-alignment",
      title: "Cultural Investment Options",
      description: "Values-aligned and ESG investing tools",
      route: "/cultural-investor",
      estimatedTime: "15min",
      tier: "professional" as const,
    },
    {
      id: "advanced-analytics",
      title: "Quantitative Analytics",
      description: "Advanced algorithmic trading and backtesting",
      route: "/quant-data-driven-investor",
      estimatedTime: "15min",
      tier: "professional" as const,
    },
  ],
  enterpriseClient: [
    {
      id: "legendary-strategies",
      title: "Legendary Investor Strategies",
      description: "Access Munger, Buffett, Dalio, and Lynch methodologies",
      route: "/legendary-investors-enterprise",
      estimatedTime: "10min",
      tier: "enterprise" as const,
    },
    {
      id: "tortoise-protocol",
      title: "Tortoise Protocol Setup",
      description: "Ethical wealth creation through contemplative investing",
      route: "/tortoise-protocol",
      estimatedTime: "30min",
      tier: "enterprise" as const,
    },
    {
      id: "institutional-tools",
      title: "Institutional Portfolio Management",
      description: "Advanced tools for institutional-scale investing",
      route: "/institutional-investor",
      estimatedTime: "10min",
      tier: "enterprise" as const,
    },
    {
      id: "specialized-platforms",
      title: "Specialized Investment Platforms",
      description: "Access conservation, quantum, and regional platforms",
      route: "/wildlife-conservation-enterprise",
      estimatedTime: "10min",
      tier: "enterprise" as const,
    },
  ],
};

const tierColors = {
  free: "bg-gray-100 text-gray-800",
  starter: "bg-blue-100 text-blue-800",
  professional: "bg-purple-100 text-purple-800",
  enterprise: "bg-orange-100 text-orange-800",
};

const tierIcons = {
  free: <Users className="h-4 w-4" />,
  starter: <Star className="h-4 w-4" />,
  professional: <Crown className="h-4 w-4" />,
  enterprise: <Shield className="h-4 w-4" />,
};

export const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  userTier = "free",
  currentPath = "/",
  className = "",
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState("newUser");

  const getCurrentWorkflow = () => {
    return (
      workflowPaths[selectedWorkflow as keyof typeof workflowPaths] ||
      workflowPaths.newUser
    );
  };

  const calculateProgress = (steps: WorkflowStep[]) => {
    const currentStepIndex = steps.findIndex(
      (step) => step.route === currentPath,
    );
    return currentStepIndex >= 0
      ? ((currentStepIndex + 1) / steps.length) * 100
      : 0;
  };

  const getRecommendedWorkflow = () => {
    switch (userTier) {
      case "enterprise":
        return "enterpriseClient";
      case "professional":
        return "professionalAdvisor";
      case "starter":
        return "retailInvestor";
      default:
        return "newUser";
    }
  };

  const recommendedWorkflow = getRecommendedWorkflow();
  const currentWorkflow = getCurrentWorkflow();
  const progress = calculateProgress(currentWorkflow);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Workflow Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Choose Your Journey</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(workflowPaths).map(([key, steps]) => (
              <Button
                key={key}
                variant={selectedWorkflow === key ? "default" : "outline"}
                onClick={() => setSelectedWorkflow(key)}
                className="h-auto p-3 flex flex-col items-start"
              >
                <div className="flex items-center space-x-2 mb-1">
                  {key === "newUser" && <Target className="h-4 w-4" />}
                  {key === "retailInvestor" && <Users className="h-4 w-4" />}
                  {key === "professionalAdvisor" && (
                    <Crown className="h-4 w-4" />
                  )}
                  {key === "enterpriseClient" && <Shield className="h-4 w-4" />}
                  <span className="font-medium">
                    {key === "newUser" && "New User"}
                    {key === "retailInvestor" && "Retail Investor"}
                    {key === "professionalAdvisor" && "Professional"}
                    {key === "enterpriseClient" && "Enterprise"}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {steps.length} steps
                </span>
              </Button>
            ))}
          </div>
          {recommendedWorkflow !== selectedWorkflow && (
            <div className="mt-3 p-2 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-700">
                💡 Recommended for you:{" "}
                <button
                  onClick={() => setSelectedWorkflow(recommendedWorkflow)}
                  className="font-medium underline"
                >
                  {recommendedWorkflow === "enterpriseClient" &&
                    "Enterprise Client"}
                  {recommendedWorkflow === "professionalAdvisor" &&
                    "Professional Advisor"}
                  {recommendedWorkflow === "retailInvestor" &&
                    "Retail Investor"}
                  {recommendedWorkflow === "newUser" && "New User"}
                </button>{" "}
                workflow
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Workflow Progress</CardTitle>
            <Badge className={tierColors[userTier]}>
              {tierIcons[userTier]}
              <span className="ml-1 capitalize">{userTier}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedWorkflow === "newUser" && "New User Onboarding"}
            {selectedWorkflow === "retailInvestor" && "Retail Investor Journey"}
            {selectedWorkflow === "professionalAdvisor" &&
              "Professional Advisor Setup"}
            {selectedWorkflow === "enterpriseClient" &&
              "Enterprise Client Workflow"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentWorkflow.map((step, index) => {
              const isCompleted = step.route === currentPath;
              const isAccessible =
                userTier === "enterprise" ||
                (userTier === "professional" &&
                  ["free", "starter", "professional"].includes(step.tier)) ||
                (userTier === "starter" &&
                  ["free", "starter"].includes(step.tier)) ||
                (userTier === "free" && step.tier === "free");

              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-4 p-3 rounded-lg border transition-all ${
                    isCompleted
                      ? "bg-blue-50 border-blue-200"
                      : isAccessible
                        ? "bg-white border-gray-200 hover:bg-gray-50"
                        : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted
                        ? "bg-blue-600 text-white"
                        : isAccessible
                          ? "bg-gray-200 text-gray-700"
                          : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">
                        {step.title}
                      </h4>
                      <Badge className={tierColors[step.tier]}>
                        {step.tier.charAt(0).toUpperCase() + step.tier.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{step.estimatedTime}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isAccessible ? (
                      <Button
                        size="sm"
                        onClick={() => (window.location.href = step.route)}
                        variant={isCompleted ? "default" : "outline"}
                      >
                        {isCompleted ? "Current" : "Go"}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Upgrade Required
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Ready to Continue?
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() =>
                  (window.location.href = "/enterprise-subscriptions")
                }
              >
                View All Features
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/pricing")}
              >
                Upgrade Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowNavigation;
