/**
 * Comprehensive Pricing Page
 * Subscription plans with archetype access and payment integration
 */

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Check,
  X,
  Star,
  Crown,
  Zap,
  Shield,
  Globe,
  Users,
  TrendingUp,
  Target,
  Brain,
  Sparkles,
  CreditCard,
  DollarSign,
  Euro,
  Info,
} from "lucide-react";

import {
  enhancedPaymentService,
  SubscriptionPlan,
  PaymentRequest,
} from "../services/enhancedPaymentService";
import { quantumTechArchitecture } from "../services/quantumTechArchitecture";
import PaymentBanner from "../components/PaymentBanner";
import SubscriptionPackage from "../components/SubscriptionPackage";
import { usePaymentBanner } from "../hooks/usePaymentBanner";

interface ArchetypeInfo {
  id: string;
  name: string;
  description: string;
  target_audience: string;
  key_features: string[];
  investment_focus: string[];
  route: string;
  icon: React.ReactNode;
  color: string;
}

const PricingPage: React.FC = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("professional");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // Payment banner hook
  const {
    bannerState,
    openPaymentBanner,
    closePaymentBanner,
    handlePaymentSuccess,
    handlePaymentError,
  } = usePaymentBanner();

  const archetypes: ArchetypeInfo[] = [
    {
      id: "institutional_investor",
      name: "Institutional Investor",
      description:
        "Advanced portfolio management for institutional-grade investments",
      target_audience: "Pension funds, endowments, family offices",
      key_features: [
        "Bulk transaction processing",
        "Advanced risk analytics",
        "Custom reporting",
      ],
      investment_focus: [
        "Large-cap equity",
        "Fixed income",
        "Alternative investments",
      ],
      route: "/institutional-investor",
      icon: <Crown className="h-6 w-6" />,
      color: "text-purple-600",
    },
    {
      id: "retail_investor",
      name: "Retail Investor",
      description: "Simplified investment platform for individual investors",
      target_audience: "Individual investors, first-time traders",
      key_features: [
        "User-friendly interface",
        "Educational resources",
        "Basic analytics",
      ],
      investment_focus: ["ETFs", "Individual stocks", "Mutual funds"],
      route: "/retail-investor",
      icon: <Users className="h-6 w-6" />,
      color: "text-blue-600",
    },
    {
      id: "emerging_market_citizen",
      name: "Emerging Market Citizen",
      description: "Localized investment solutions for emerging markets",
      target_audience: "Citizens of developing economies",
      key_features: [
        "Local currency support",
        "Micro-investment options",
        "Regional opportunities",
      ],
      investment_focus: [
        "Local markets",
        "Commodity investments",
        "Infrastructure bonds",
      ],
      route: "/emerging-market-citizen",
      icon: <Globe className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      id: "cultural_investor",
      name: "Cultural Investor",
      description: "Values-aligned investing based on cultural principles",
      target_audience: "Culturally conscious investors",
      key_features: [
        "ESG screening",
        "Cultural alignment filters",
        "Impact measurement",
      ],
      investment_focus: [
        "Sustainable investments",
        "Community development",
        "Cultural preservation",
      ],
      route: "/cultural-investor",
      icon: <Sparkles className="h-6 w-6" />,
      color: "text-yellow-600",
    },
    {
      id: "developer_integrator",
      name: "Developer Integrator",
      description: "API access and development tools for fintech builders",
      target_audience: "Developers, fintech companies, system integrators",
      key_features: [
        "Full API access",
        "SDK libraries",
        "Technical documentation",
      ],
      investment_focus: [
        "Technology integration",
        "Custom solutions",
        "White-label platforms",
      ],
      route: "/developer-integrator",
      icon: <Zap className="h-6 w-6" />,
      color: "text-orange-600",
    },
    {
      id: "african_market_enterprise",
      name: "African Market Enterprise",
      description: "Enterprise solutions for African businesses and investors",
      target_audience: "African businesses, continental investors",
      key_features: [
        "Multi-country compliance",
        "Local payment methods",
        "Regional insights",
      ],
      investment_focus: [
        "African equities",
        "Infrastructure projects",
        "Agricultural investments",
      ],
      route: "/african-market-enterprise",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-red-600",
    },
    {
      id: "diaspora_investor",
      name: "Diaspora Investor",
      description: "Cross-border investment solutions for diaspora communities",
      target_audience: "Diaspora communities, international workers",
      key_features: [
        "Cross-border transfers",
        "Home country investments",
        "Currency hedging",
      ],
      investment_focus: [
        "Home market access",
        "Remittance optimization",
        "Dual-country portfolios",
      ],
      route: "/diaspora-investor",
      icon: <Globe className="h-6 w-6" />,
      color: "text-indigo-600",
    },
    {
      id: "financial_advisor",
      name: "Financial Advisor",
      description:
        "Professional tools for financial advisors and wealth managers",
      target_audience: "RIAs, wealth managers, financial planners",
      key_features: [
        "Client management",
        "Portfolio modeling",
        "Regulatory compliance",
      ],
      investment_focus: [
        "Client portfolios",
        "Risk management",
        "Fee optimization",
      ],
      route: "/financial-advisor",
      icon: <Target className="h-6 w-6" />,
      color: "text-cyan-600",
    },
    {
      id: "public_sector_ngo",
      name: "Public Sector & NGO",
      description: "Investment solutions for public institutions and NGOs",
      target_audience: "Government entities, NGOs, foundations",
      key_features: [
        "Compliance tracking",
        "Impact reporting",
        "Transparency tools",
      ],
      investment_focus: [
        "Social impact bonds",
        "Infrastructure",
        "Sustainable development",
      ],
      route: "/public-sector-ngo",
      icon: <Shield className="h-6 w-6" />,
      color: "text-teal-600",
    },
    {
      id: "quant_data_driven_investor",
      name: "Quantitative Investor",
      description: "Advanced analytics and algorithmic trading for quants",
      target_audience: "Quantitative analysts, algorithmic traders",
      key_features: ["Advanced analytics", "Backtesting tools", "API trading"],
      investment_focus: [
        "Algorithmic strategies",
        "Factor investing",
        "Risk parity",
      ],
      route: "/quant-data-driven-investor",
      icon: <Brain className="h-6 w-6" />,
      color: "text-purple-600",
    },
    {
      id: "student_early_career",
      name: "Student & Early Career",
      description: "Educational investment platform for young professionals",
      target_audience: "Students, young professionals, career starters",
      key_features: [
        "Educational content",
        "Small investment minimums",
        "Career-based advice",
      ],
      investment_focus: [
        "Index funds",
        "Target-date funds",
        "Educational savings",
      ],
      route: "/student-early-career",
      icon: <Star className="h-6 w-6" />,
      color: "text-pink-600",
    },
    {
      id: "wildlife_conservation_enterprise",
      name: "Wildlife Conservation",
      description:
        "Investment platform focused on conservation and environmental impact",
      target_audience: "Conservation organizations, eco-investors",
      key_features: [
        "Impact measurement",
        "Conservation metrics",
        "Biodiversity tracking",
      ],
      investment_focus: [
        "Conservation bonds",
        "Green infrastructure",
        "Biodiversity credits",
      ],
      route: "/wildlife-conservation-enterprise",
      icon: <Sparkles className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      id: "quantum_enterprise_2050",
      name: "Quantum Enterprise 2050",
      description:
        "Next-generation investment platform for future technologies",
      target_audience: "Tech enterprises, future-focused investors",
      key_features: [
        "Quantum computing integration",
        "Future tech analysis",
        "Scenario modeling",
      ],
      investment_focus: [
        "Quantum technologies",
        "Space economy",
        "Biotech innovations",
      ],
      route: "/quantum-enterprise-2050",
      icon: <Zap className="h-6 w-6" />,
      color: "text-violet-600",
    },
  ];

  useEffect(() => {
    loadSubscriptionPlans();
  }, []);

  const loadSubscriptionPlans = () => {
    const plans = enhancedPaymentService.getSubscriptionPlans();
    setSubscriptionPlans(plans);
  };

  const getDisplayPlans = () => {
    return subscriptionPlans.filter(
      (plan) => plan.billing_cycle === billingCycle,
    );
  };

  const getArchetypesByPlan = (planId: string): ArchetypeInfo[] => {
    const plan = subscriptionPlans.find((p) => p.id === planId);
    if (!plan) return [];

    return archetypes.filter((archetype) =>
      plan.archetype_access.includes(archetype.id),
    );
  };

  const handleSubscribe = (planId: string) => {
    const plan = subscriptionPlans.find((p) => p.id === planId);
    if (!plan) return;

    // Open payment banner with selected plan
    openPaymentBanner(plan, "general-subscription");
  };

  const getPlanIcon = (planId: string) => {
    if (planId.includes("starter")) return <Star className="h-6 w-6" />;
    if (planId.includes("professional")) return <Zap className="h-6 w-6" />;
    if (planId.includes("enterprise")) return <Crown className="h-6 w-6" />;
    return <Star className="h-6 w-6" />;
  };

  const getPlanColor = (planId: string) => {
    if (planId.includes("starter")) return "border-blue-200 bg-blue-50";
    if (planId.includes("professional"))
      return "border-purple-200 bg-purple-50";
    if (planId.includes("enterprise")) return "border-yellow-200 bg-yellow-50";
    return "border-gray-200 bg-gray-50";
  };

  const getAnnualSavings = (monthlyPrice: number) => {
    const monthlyTotal = monthlyPrice * 12;
    const annualPlan = subscriptionPlans.find(
      (p) =>
        p.billing_cycle === "annual" &&
        p.name.includes(
          subscriptionPlans
            .find((mp) => mp.price === monthlyPrice)
            ?.name.split(" ")[0] || "",
        ),
    );

    if (!annualPlan) return 0;

    const savings = monthlyTotal - annualPlan.price;
    return Math.round((savings / monthlyTotal) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Investment Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access multiple investment archetypes with our comprehensive
            platform. From retail investing to enterprise solutions, find the
            perfect fit for your needs.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === "monthly"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 rounded-md transition-all relative ${
                billingCycle === "annual"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save up to 30%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {getDisplayPlans().map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${getPlanColor(plan.id)} ${
                plan.popular ? "ring-2 ring-purple-500 shadow-lg" : ""
              } ${plan.enterprise ? "ring-2 ring-yellow-500 shadow-lg" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}

              {plan.enterprise && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-600 text-white">Enterprise</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div
                    className={`p-3 rounded-full ${
                      plan.id.includes("starter")
                        ? "bg-blue-100 text-blue-600"
                        : plan.id.includes("professional")
                          ? "bg-purple-100 text-purple-600"
                          : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {getPlanIcon(plan.id)}
                  </div>
                </div>

                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>

                <CardDescription className="text-gray-600 mt-2">
                  {plan.description}
                </CardDescription>

                <div className="mt-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price.toFixed(2)}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{plan.billing_cycle === "monthly" ? "month" : "year"}
                    </span>
                  </div>

                  {billingCycle === "annual" &&
                    plan.billing_cycle === "annual" && (
                      <p className="text-green-600 text-sm mt-2">
                        Save{" "}
                        {getAnnualSavings(
                          plan.price /
                            (plan.billing_cycle === "annual" ? 10 : 1),
                        )}
                        % vs monthly
                      </p>
                    )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div>
                  <h4 className="font-semibold mb-3">Features Included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <span
                            className={
                              feature.included
                                ? "text-gray-900"
                                : "text-gray-400"
                            }
                          >
                            {feature.name}
                          </span>
                          {feature.limit && (
                            <span className="text-sm text-gray-500 ml-1">
                              (up to {feature.limit})
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Archetype Access */}
                <div>
                  <h4 className="font-semibold mb-3">
                    Archetype Access ({plan.archetype_access.length}):
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {getArchetypesByPlan(plan.id).map((archetype) => (
                      <div key={archetype.id} className="flex items-center">
                        <div className={`mr-2 ${archetype.color}`}>
                          {archetype.icon}
                        </div>
                        <span className="text-sm text-gray-700">
                          {archetype.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Limits */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">Plan Limits:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      API Calls: {plan.limits.api_calls.toLocaleString()}
                    </div>
                    <div>Storage: {plan.limits.storage_gb}GB</div>
                    <div>Sessions: {plan.limits.concurrent_sessions}</div>
                    <div>Support: {plan.limits.support_level}</div>
                  </div>
                </div>

                {/* Subscribe Button */}
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing}
                  className={`w-full ${
                    plan.popular
                      ? "bg-purple-600 hover:bg-purple-700"
                      : plan.enterprise
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Subscribe to {plan.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-12">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Secure Payment Methods
          </h3>
          <div className="flex justify-center items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">PayPal</span>
              </div>
              <span className="text-sm text-gray-600">PayPal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">PS</span>
              </div>
              <span className="text-sm text-gray-600">Paystack</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span className="text-sm text-gray-600">
                256-bit SSL Encryption
              </span>
            </div>
          </div>
        </div>

        {/* Archetype Details */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Investment Archetypes
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Explore our comprehensive range of investment archetypes, each
            designed for specific investor needs and markets.
          </p>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Archetypes</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archetypes.map((archetype) => (
                  <Card
                    key={archetype.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={archetype.color}>{archetype.icon}</div>
                        <CardTitle className="text-lg">
                          {archetype.name}
                        </CardTitle>
                      </div>
                      <CardDescription>{archetype.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-sm text-gray-900">
                            Target Audience:
                          </h5>
                          <p className="text-sm text-gray-600">
                            {archetype.target_audience}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm text-gray-900">
                            Key Features:
                          </h5>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {archetype.key_features
                              .slice(0, 2)
                              .map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                          </ul>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            (window.location.href = archetype.route)
                          }
                          className="w-full"
                        >
                          Explore {archetype.name}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="individual">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archetypes
                  .filter((a) =>
                    [
                      "retail_investor",
                      "emerging_market_citizen",
                      "student_early_career",
                      "diaspora_investor",
                    ].includes(a.id),
                  )
                  .map((archetype) => (
                    <Card
                      key={archetype.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className={archetype.color}>
                            {archetype.icon}
                          </div>
                          <CardTitle className="text-lg">
                            {archetype.name}
                          </CardTitle>
                        </div>
                        <CardDescription>
                          {archetype.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            (window.location.href = archetype.route)
                          }
                          className="w-full"
                        >
                          Explore {archetype.name}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="professional">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archetypes
                  .filter((a) =>
                    [
                      "financial_advisor",
                      "quant_data_driven_investor",
                      "cultural_investor",
                      "developer_integrator",
                    ].includes(a.id),
                  )
                  .map((archetype) => (
                    <Card
                      key={archetype.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className={archetype.color}>
                            {archetype.icon}
                          </div>
                          <CardTitle className="text-lg">
                            {archetype.name}
                          </CardTitle>
                        </div>
                        <CardDescription>
                          {archetype.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            (window.location.href = archetype.route)
                          }
                          className="w-full"
                        >
                          Explore {archetype.name}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="enterprise">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archetypes
                  .filter((a) =>
                    [
                      "institutional_investor",
                      "african_market_enterprise",
                      "public_sector_ngo",
                      "wildlife_conservation_enterprise",
                      "quantum_enterprise_2050",
                    ].includes(a.id),
                  )
                  .map((archetype) => (
                    <Card
                      key={archetype.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className={archetype.color}>
                            {archetype.icon}
                          </div>
                          <CardTitle className="text-lg">
                            {archetype.name}
                          </CardTitle>
                        </div>
                        <CardDescription>
                          {archetype.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            (window.location.href = archetype.route)
                          }
                          className="w-full"
                        >
                          Explore {archetype.name}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">
                Can I switch plans anytime?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately, and we'll prorate the billing
                accordingly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 text-sm">
                We accept PayPal and Paystack for secure payments. All
                transactions are encrypted and processed securely.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Do you offer enterprise discounts?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, we offer volume discounts for enterprise clients and custom
                pricing for large organizations. Contact our sales team for
                details.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Is there a free trial available?
              </h3>
              <p className="text-gray-600 text-sm">
                We offer a 14-day free trial for the Professional plan, giving
                you full access to evaluate our platform before committing.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Status Alerts */}
        {paymentStatus === "error" && (
          <Alert className="mt-6 border-red-200 bg-red-50">
            <X className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Payment processing failed. Please try again or contact support if
              the issue persists.
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Banner */}
        <PaymentBanner
          isOpen={bannerState.isOpen}
          onClose={closePaymentBanner}
          selectedPlan={bannerState.selectedPlan}
          archetypeId={bannerState.archetypeId}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      </div>
    </div>
  );
};

export default PricingPage;
