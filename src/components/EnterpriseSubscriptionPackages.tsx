/**
 * Enterprise Subscription Packages
 * Complete subscription tier display with operational workflows
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Crown,
  Star,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  TreePine,
  Brain,
  Target,
  Globe,
  Smartphone,
  Code,
  BarChart3,
  Briefcase,
  GraduationCap,
  Banknote,
  Heart,
  Building,
  Leaf,
  Atom,
} from "lucide-react";
import { usePaymentBanner } from "../hooks/usePaymentBanner";

interface SubscriptionFeature {
  id: string;
  title: string;
  description: string;
  features: string[];
  targetUsers: string;
  estimatedTime: string;
  tier: "free" | "starter" | "professional" | "enterprise";
  isNew?: boolean;
  isPopular?: boolean;
  icon: React.ReactNode;
  route: string;
}

const subscriptionFeatures: SubscriptionFeature[] = [
  // Free Tier
  {
    id: "investment-dashboard",
    title: "Investment Dashboard",
    description:
      "Your personal investment command center with portfolio overview",
    features: ["Portfolio tracking", "Basic analytics", "Market overview"],
    targetUsers: "All investors",
    estimatedTime: "~10min",
    tier: "free",
    isPopular: true,
    icon: <BarChart3 className="h-6 w-6" />,
    route: "/dashboard",
  },
  {
    id: "subscription-plans",
    title: "Subscription Plans",
    description: "Choose the perfect plan for your investment journey",
    features: ["Plan comparison", "Feature breakdown", "Pricing calculator"],
    targetUsers: "All users",
    estimatedTime: "~5min",
    tier: "free",
    icon: <Crown className="h-6 w-6" />,
    route: "/pricing",
  },
  {
    id: "investor-archetypes",
    title: "Investor Archetypes",
    description: "Discover your investment personality and optimal strategies",
    features: [
      "Personality assessment",
      "Strategy matching",
      "Recommendations",
    ],
    targetUsers: "New investors",
    estimatedTime: "~15min",
    tier: "free",
    icon: <Target className="h-6 w-6" />,
    route: "/archetypes",
  },
  {
    id: "billing-payments",
    title: "Billing & Payments",
    description: "Manage your subscription and payment methods",
    features: ["Invoice management", "Payment history", "Usage tracking"],
    targetUsers: "Subscribers",
    estimatedTime: "~8min",
    tier: "free",
    icon: <Banknote className="h-6 w-6" />,
    route: "/billing",
  },

  // Starter Tier
  {
    id: "retail-investor",
    title: "Retail Investor",
    description: "Simplified investment platform for individual investors",
    features: [
      "User-friendly interface",
      "Educational resources",
      "Basic analytics",
    ],
    targetUsers: "Individual investors",
    estimatedTime: "~30min",
    tier: "starter",
    isPopular: true,
    icon: <Users className="h-6 w-6" />,
    route: "/retail-investor",
  },
  {
    id: "emerging-market-citizen",
    title: "Emerging Market Citizen",
    description: "Localized investment solutions for developing economies",
    features: [
      "Local currency support",
      "Micro-investments",
      "Regional opportunities",
    ],
    targetUsers: "Emerging market investors",
    estimatedTime: "~25min",
    tier: "starter",
    icon: <Globe className="h-6 w-6" />,
    route: "/emerging-market-citizen",
  },
  {
    id: "student-early-career",
    title: "Student & Early Career",
    description: "Educational investment platform for young professionals",
    features: ["Educational content", "Small minimums", "Career guidance"],
    targetUsers: "Students and young professionals",
    estimatedTime: "~20min",
    tier: "starter",
    icon: <GraduationCap className="h-6 w-6" />,
    route: "/student-early-career",
  },

  // Professional Tier
  {
    id: "financial-advisor",
    title: "Financial Advisor",
    description: "Professional tools for wealth managers and advisors",
    features: ["Client management", "Portfolio modeling", "Compliance tools"],
    targetUsers: "Financial professionals",
    estimatedTime: "~15min",
    tier: "professional",
    icon: <Briefcase className="h-6 w-6" />,
    route: "/financial-advisor",
  },
  {
    id: "developer-platform",
    title: "Developer Platform",
    description: "API access and development tools for fintech builders",
    features: ["Full API access", "SDK libraries", "Documentation"],
    targetUsers: "Developers and integrators",
    estimatedTime: "~15min",
    tier: "professional",
    icon: <Code className="h-6 w-6" />,
    route: "/developer-integrator",
  },
  {
    id: "quantitative-investor",
    title: "Quantitative Investor",
    description: "Advanced analytics and algorithmic trading",
    features: ["Advanced analytics", "Backtesting", "Algorithm trading"],
    targetUsers: "Quantitative analysts",
    estimatedTime: "~15min",
    tier: "professional",
    icon: <TrendingUp className="h-6 w-6" />,
    route: "/quant-data-driven-investor",
  },
  {
    id: "ai-explainability",
    title: "AI Explainability",
    description: "Transparent AI decision-making dashboard",
    features: ["Model transparency", "Decision explanations", "Bias detection"],
    targetUsers: "AI practitioners",
    estimatedTime: "~10min",
    tier: "professional",
    isNew: true,
    icon: <Brain className="h-6 w-6" />,
    route: "/ai-explainability",
  },
  {
    id: "cultural-investor",
    title: "Cultural Investor",
    description: "Values-aligned investing based on cultural principles",
    features: ["ESG screening", "Cultural alignment", "Impact measurement"],
    targetUsers: "Values-driven investors",
    estimatedTime: "~15min",
    tier: "professional",
    icon: <Heart className="h-6 w-6" />,
    route: "/cultural-investor",
  },
  {
    id: "diaspora-investor",
    title: "Diaspora Investor",
    description: "Cross-border investment solutions for diaspora communities",
    features: [
      "Cross-border transfers",
      "Home market access",
      "Currency hedging",
    ],
    targetUsers: "Diaspora communities",
    estimatedTime: "~15min",
    tier: "professional",
    icon: <Globe className="h-6 w-6" />,
    route: "/diaspora-investor",
  },
  {
    id: "public-sector-ngo",
    title: "Public Sector & NGO",
    description: "Investment solutions for public institutions",
    features: ["Compliance tracking", "Impact reporting", "Transparency"],
    targetUsers: "Government and NGOs",
    estimatedTime: "~15min",
    tier: "professional",
    icon: <Building className="h-6 w-6" />,
    route: "/public-sector-ngo",
  },
  {
    id: "mobile-edge-computing",
    title: "Mobile & Edge Computing",
    description: "Enterprise mobile security and device management",
    features: ["Device management", "Security policies", "Edge computing"],
    targetUsers: "Enterprise IT teams",
    estimatedTime: "~10min",
    tier: "professional",
    icon: <Smartphone className="h-6 w-6" />,
    route: "/mobile-management",
  },

  // Enterprise Tier
  {
    id: "tortoise-protocol",
    title: "🐢 Tortoise Protocol",
    description:
      "Ethical wealth creation through contemplative, rhythmic investment",
    features: [
      "Mythic insight design",
      "Philosophical vaults",
      "Rhythmic yield activation",
    ],
    targetUsers:
      "Contemplative investors, Cultural stewards, Regenerative finance advocates",
    estimatedTime: "~30min",
    tier: "enterprise",
    icon: <TreePine className="h-6 w-6" />,
    route: "/tortoise-protocol",
  },
  {
    id: "legendary-investor-strategies",
    title: "Legendary Investor Strategies",
    description: "Complete suite of legendary investment philosophies",
    features: ["Munger Models", "Buffett Moats", "Dalio Balance"],
    targetUsers: "Elite investors",
    estimatedTime: "~10min",
    tier: "enterprise",
    isNew: true,
    isPopular: true,
    icon: <Crown className="h-6 w-6" />,
    route: "/legendary-investors-enterprise",
  },
  {
    id: "institutional-investor",
    title: "Institutional Investor",
    description: "Advanced portfolio management for institutions",
    features: [
      "Bulk processing",
      "Advanced risk analytics",
      "Custom reporting",
    ],
    targetUsers: "Institutional investors",
    estimatedTime: "~10min",
    tier: "enterprise",
    icon: <Shield className="h-6 w-6" />,
    route: "/institutional-investor",
  },
  {
    id: "african-market-enterprise",
    title: "African Market Enterprise",
    description: "Enterprise solutions for African businesses",
    features: [
      "Multi-country compliance",
      "Regional insights",
      "Local payments",
    ],
    targetUsers: "African enterprises",
    estimatedTime: "~10min",
    tier: "enterprise",
    icon: <Globe className="h-6 w-6" />,
    route: "/african-market-enterprise",
  },
  {
    id: "wildlife-conservation",
    title: "Wildlife Conservation",
    description: "Conservation-focused investment platform",
    features: ["Conservation metrics", "Biodiversity tracking", "Impact bonds"],
    targetUsers: "Conservation organizations",
    estimatedTime: "~10min",
    tier: "enterprise",
    icon: <Leaf className="h-6 w-6" />,
    route: "/wildlife-conservation-enterprise",
  },
  {
    id: "quantum-enterprise-2050",
    title: "Quantum Enterprise 2050",
    description: "Next-generation investment platform",
    features: [
      "Quantum computing",
      "Future tech analysis",
      "Scenario modeling",
    ],
    targetUsers: "Future-tech enterprises",
    estimatedTime: "~10min",
    tier: "enterprise",
    isNew: true,
    icon: <Atom className="h-6 w-6" />,
    route: "/quantum-enterprise-2050",
  },
];

const tierColors = {
  free: "bg-gray-100 text-gray-800",
  starter: "bg-blue-100 text-blue-800",
  professional: "bg-purple-100 text-purple-800",
  enterprise: "bg-orange-100 text-orange-800",
};

const tierLabels = {
  free: "Free",
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
};

interface EnterpriseSubscriptionPackagesProps {
  className?: string;
  filterTier?: "free" | "starter" | "professional" | "enterprise";
  showWorkflows?: boolean;
}

export const EnterpriseSubscriptionPackages: React.FC<
  EnterpriseSubscriptionPackagesProps
> = ({ className = "", filterTier, showWorkflows = true }) => {
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const { openPaymentBanner } = usePaymentBanner();

  const filteredFeatures = filterTier
    ? subscriptionFeatures.filter((f) => f.tier === filterTier)
    : selectedTier === "all"
      ? subscriptionFeatures
      : subscriptionFeatures.filter((f) => f.tier === selectedTier);

  const handleExplore = (feature: SubscriptionFeature) => {
    if (feature.tier !== "free") {
      openPaymentBanner({
        selectedPlan: {
          id: feature.tier,
          name: tierLabels[feature.tier],
          price:
            feature.tier === "starter"
              ? 29
              : feature.tier === "professional"
                ? 99
                : 299,
          interval: "month" as const,
          features: [feature.title, ...feature.features],
        },
        redirectPath: feature.route,
      });
    } else {
      window.location.href = feature.route;
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Enterprise Investment Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Complete operational workflows for every investment tier and archetype
        </p>
      </div>

      {/* Tier Filter */}
      {!filterTier && (
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedTier === "all" ? "default" : "outline"}
            onClick={() => setSelectedTier("all")}
            size="sm"
          >
            All Features
          </Button>
          {Object.entries(tierLabels).map(([tier, label]) => (
            <Button
              key={tier}
              variant={selectedTier === tier ? "default" : "outline"}
              onClick={() => setSelectedTier(tier)}
              size="sm"
              className={
                selectedTier === tier
                  ? tierColors[tier as keyof typeof tierColors]
                  : ""
              }
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => (
          <Card
            key={feature.id}
            className="relative hover:shadow-lg transition-all duration-200"
          >
            {/* Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-1">
              <Badge className={tierColors[feature.tier]}>
                {tierLabels[feature.tier]}
              </Badge>
              {feature.isNew && (
                <Badge className="bg-green-100 text-green-800">New</Badge>
              )}
              {feature.isPopular && (
                <Badge className="bg-yellow-100 text-yellow-800">Popular</Badge>
              )}
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">{feature.icon}</div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold mb-2 pr-20">
                    {feature.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Features */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Key Features:
                </h4>
                <ul className="space-y-1">
                  {feature.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-2 text-sm text-gray-600"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Target Users & Time */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{feature.targetUsers}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{feature.estimatedTime}</span>
                </div>
              </div>

              {/* Explore Button */}
              <Button
                onClick={() => handleExplore(feature)}
                className="w-full group"
                variant={feature.tier === "free" ? "outline" : "default"}
              >
                Explore
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Navigation */}
      {showWorkflows && (
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🔄 Operational Workflows
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">New User Journey:</h4>
              <p className="text-sm text-gray-600">
                Archetypes → Dashboard → Subscription → Feature Access
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">
                Enterprise Workflow:
              </h4>
              <p className="text-sm text-gray-600">
                Institutional → Legendary Strategies → Tortoise Protocol →
                Advanced Analytics
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseSubscriptionPackages;
