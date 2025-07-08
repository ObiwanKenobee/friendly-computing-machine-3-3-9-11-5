import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import {
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Globe,
  Shield,
  Zap,
  Heart,
  Building2,
  GraduationCap,
  Target,
  Award,
  ArrowRight,
  Lock,
  Crown,
  CheckCircle,
  Star,
  Lightbulb,
  Smartphone,
  PieChart,
  LineChart,
  Activity,
  TrendingDown,
  Clock,
  AlertTriangle,
  Info,
} from "lucide-react";
import { paywallProtectionService } from "../services/paywallProtectionService";
import { themeService } from "../services/themeService";
import { bandwidthOptimizationService } from "../services/bandwidthOptimizationService";

interface DashboardConfig {
  archetypeId: string;
  title: string;
  description: string;
  heroMetric: {
    label: string;
    value: string;
    change: number;
    icon: React.ReactNode;
  };
  features: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    available: boolean;
    requiresTier?: "starter" | "professional" | "enterprise";
  }>;
  demoData: {
    portfolioValue: number;
    growth: number;
    assets: number;
    roi: number;
  };
  previewCharts: Array<{
    title: string;
    type: "line" | "bar" | "pie";
    data: any[];
  }>;
  userJourney: Array<{
    step: string;
    description: string;
    completed: boolean;
  }>;
}

interface EnterpriseDashboardProps {
  archetypeId: string;
  userId: string;
  hasAccess: boolean;
  onUpgrade: () => void;
}

export const EnterpriseDashboardFramework: React.FC<
  EnterpriseDashboardProps
> = ({ archetypeId, userId, hasAccess, onUpgrade }) => {
  const [dashboardConfig, setDashboardConfig] =
    useState<DashboardConfig | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [bandwidthSettings, setBandwidthSettings] = useState(
    bandwidthOptimizationService.getOptimizationSettings(),
  );

  useEffect(() => {
    loadDashboardConfig();

    // Listen for bandwidth changes
    const unsubscribe =
      bandwidthOptimizationService.addListener(setBandwidthSettings);
    return unsubscribe;
  }, [archetypeId]);

  const loadDashboardConfig = () => {
    setLoading(true);
    const config = getArchetypeConfig(archetypeId);
    setDashboardConfig(config);
    setLoading(false);
  };

  const getArchetypeConfig = (archetype: string): DashboardConfig => {
    const configs: Record<string, DashboardConfig> = {
      "emerging-market-citizen": {
        archetypeId: archetype,
        title: "Emerging Market Investment Platform",
        description:
          "AI-powered financial dashboard designed for first-time investors in emerging markets",
        heroMetric: {
          label: "Portfolio Growth",
          value: "$2,450",
          change: 12.4,
          icon: <TrendingUp className="h-6 w-6" />,
        },
        features: [
          {
            title: "Multilingual AI Advisor",
            description:
              "Get investment advice in your local language with cultural context",
            icon: <Globe className="h-5 w-5" />,
            available: true,
          },
          {
            title: "Healthcare Tokenization",
            description:
              "Invest in tokenized healthcare assets with real-time ROI tracking",
            icon: <Heart className="h-5 w-5" />,
            available: true,
          },
          {
            title: "Mobile-First Design",
            description:
              "Optimized for mobile devices with low-bandwidth support",
            icon: <Smartphone className="h-5 w-5" />,
            available: true,
          },
          {
            title: "Risk Management",
            description:
              "Beginner-friendly risk assessment and portfolio optimization",
            icon: <Shield className="h-5 w-5" />,
            available: true,
          },
        ],
        demoData: {
          portfolioValue: 2450,
          growth: 12.4,
          assets: 5,
          roi: 8.7,
        },
        previewCharts: [
          {
            title: "Portfolio Performance",
            type: "line",
            data: [
              { month: "Jan", value: 2000 },
              { month: "Feb", value: 2150 },
              { month: "Mar", value: 2300 },
              { month: "Apr", value: 2450 },
            ],
          },
        ],
        userJourney: [
          {
            step: "Risk Assessment",
            description: "Complete your investment risk profile",
            completed: true,
          },
          {
            step: "First Investment",
            description: "Make your first healthcare token investment",
            completed: true,
          },
          {
            step: "Portfolio Tracking",
            description: "Monitor your portfolio performance",
            completed: false,
          },
          {
            step: "Diversification",
            description: "Expand across multiple healthcare assets",
            completed: false,
          },
        ],
      },
      "institutional-investor": {
        archetypeId: archetype,
        title: "Institutional Investment Management",
        description:
          "Enterprise-grade portfolio management and analytics for institutional investors",
        heroMetric: {
          label: "Assets Under Management",
          value: "$125.8M",
          change: 8.2,
          icon: <Building2 className="h-6 w-6" />,
        },
        features: [
          {
            title: "Advanced Analytics",
            description:
              "Sophisticated risk models and performance attribution",
            icon: <BarChart3 className="h-5 w-5" />,
            available: false,
            requiresTier: "enterprise",
          },
          {
            title: "Compliance Monitoring",
            description: "Real-time regulatory compliance and reporting",
            icon: <Shield className="h-5 w-5" />,
            available: false,
            requiresTier: "enterprise",
          },
          {
            title: "Multi-Asset Trading",
            description: "Cross-asset portfolio management and execution",
            icon: <Target className="h-5 w-5" />,
            available: false,
            requiresTier: "enterprise",
          },
          {
            title: "Custom Reporting",
            description: "White-label reports and client presentations",
            icon: <Award className="h-5 w-5" />,
            available: false,
            requiresTier: "enterprise",
          },
        ],
        demoData: {
          portfolioValue: 125800000,
          growth: 8.2,
          assets: 150,
          roi: 12.8,
        },
        previewCharts: [
          {
            title: "Asset Allocation",
            type: "pie",
            data: [
              { name: "Equities", value: 45 },
              { name: "Fixed Income", value: 30 },
              { name: "Alternatives", value: 25 },
            ],
          },
        ],
        userJourney: [
          {
            step: "Due Diligence",
            description: "Complete institutional onboarding",
            completed: false,
          },
          {
            step: "Portfolio Setup",
            description: "Configure investment mandates",
            completed: false,
          },
          {
            step: "Risk Framework",
            description: "Implement risk management policies",
            completed: false,
          },
          {
            step: "Reporting",
            description: "Setup automated client reporting",
            completed: false,
          },
        ],
      },
      "retail-investor": {
        archetypeId: archetype,
        title: "Personal Investment Hub",
        description:
          "Comprehensive investment platform for individual retail investors",
        heroMetric: {
          label: "Total Portfolio",
          value: "$45,680",
          change: 15.2,
          icon: <PieChart className="h-6 w-6" />,
        },
        features: [
          {
            title: "Smart Portfolio",
            description: "AI-driven portfolio recommendations and rebalancing",
            icon: <Zap className="h-5 w-5" />,
            available: false,
            requiresTier: "starter",
          },
          {
            title: "Tax Optimization",
            description: "Tax-loss harvesting and optimization strategies",
            icon: <TrendingUp className="h-5 w-5" />,
            available: false,
            requiresTier: "professional",
          },
          {
            title: "Goal Planning",
            description: "Set and track financial goals with milestone alerts",
            icon: <Target className="h-5 w-5" />,
            available: false,
            requiresTier: "starter",
          },
          {
            title: "Market Research",
            description: "Access to premium research and analyst reports",
            icon: <BarChart3 className="h-5 w-5" />,
            available: false,
            requiresTier: "professional",
          },
        ],
        demoData: {
          portfolioValue: 45680,
          growth: 15.2,
          assets: 12,
          roi: 11.4,
        },
        previewCharts: [
          {
            title: "Monthly Returns",
            type: "bar",
            data: [
              { month: "Jan", value: 2.1 },
              { month: "Feb", value: -0.5 },
              { month: "Mar", value: 3.8 },
              { month: "Apr", value: 1.9 },
            ],
          },
        ],
        userJourney: [
          {
            step: "Account Setup",
            description: "Complete your investor profile",
            completed: true,
          },
          {
            step: "First Investment",
            description: "Make your initial investment",
            completed: false,
          },
          {
            step: "Goal Setting",
            description: "Define your investment objectives",
            completed: false,
          },
          {
            step: "Portfolio Growth",
            description: "Build a diversified portfolio",
            completed: false,
          },
        ],
      },
      // Add more archetypes...
      "financial-advisor": {
        archetypeId: archetype,
        title: "Advisory Practice Management",
        description:
          "Complete platform for financial advisors to manage client portfolios",
        heroMetric: {
          label: "Client AUM",
          value: "$8.2M",
          change: 22.1,
          icon: <Users className="h-6 w-6" />,
        },
        features: [
          {
            title: "Client Portal",
            description: "White-label client portal with real-time reporting",
            icon: <Award className="h-5 w-5" />,
            available: false,
            requiresTier: "professional",
          },
          {
            title: "Proposal Generation",
            description: "Automated proposal and presentation tools",
            icon: <Lightbulb className="h-5 w-5" />,
            available: false,
            requiresTier: "professional",
          },
          {
            title: "Compliance Tools",
            description: "Built-in compliance monitoring and documentation",
            icon: <Shield className="h-5 w-5" />,
            available: false,
            requiresTier: "professional",
          },
          {
            title: "Performance Analytics",
            description: "Advanced performance attribution and risk analysis",
            icon: <BarChart3 className="h-5 w-5" />,
            available: false,
            requiresTier: "professional",
          },
        ],
        demoData: {
          portfolioValue: 8200000,
          growth: 22.1,
          assets: 85,
          roi: 9.8,
        },
        previewCharts: [
          {
            title: "Client Growth",
            type: "line",
            data: [
              { month: "Q1", value: 45 },
              { month: "Q2", value: 52 },
              { month: "Q3", value: 61 },
              { month: "Q4", value: 68 },
            ],
          },
        ],
        userJourney: [
          {
            step: "Practice Setup",
            description: "Configure your advisory practice",
            completed: false,
          },
          {
            step: "Client Onboarding",
            description: "Add your first clients",
            completed: false,
          },
          {
            step: "Portfolio Management",
            description: "Start managing client portfolios",
            completed: false,
          },
          {
            step: "Growth",
            description: "Scale your practice",
            completed: false,
          },
        ],
      },
    };

    return configs[archetype] || configs["retail-investor"];
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getChangeColor = (change: number): string => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );
  };

  if (loading || !dashboardConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            Loading enterprise dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {dashboardConfig.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                {dashboardConfig.description}
              </p>
            </div>

            {/* Access Status */}
            <div className="flex items-center gap-4">
              {hasAccess ? (
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Full Access
                </Badge>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                  >
                    <Lock className="h-3 w-3 mr-1" />
                    Preview Mode
                  </Badge>
                  <Button onClick={onUpgrade} size="sm">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Primary Metric */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {dashboardConfig.heroMetric.label}
              </CardTitle>
              <div className="text-primary">
                {dashboardConfig.heroMetric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {dashboardConfig.heroMetric.value}
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${getChangeColor(dashboardConfig.heroMetric.change)}`}
              >
                {getChangeIcon(dashboardConfig.heroMetric.change)}
                {dashboardConfig.heroMetric.change >= 0 ? "+" : ""}
                {dashboardConfig.heroMetric.change}% from last month
              </div>
            </CardContent>
          </Card>

          {/* Secondary Metrics */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Assets
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardConfig.demoData.assets}
              </div>
              <p className="text-xs text-muted-foreground">
                Active investments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Annual ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardConfig.demoData.roi}%
              </div>
              <p className="text-xs text-muted-foreground">Year to date</p>
            </CardContent>
          </Card>
        </div>

        {/* Access Control Alert */}
        {!hasAccess && (
          <Alert className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 dark:from-blue-950 dark:to-purple-950 dark:border-blue-800">
            <Crown className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Preview Mode:</strong> You're viewing a limited demo.
                  Upgrade to access all features, real-time data, and advanced
                  analytics.
                </div>
                <Button variant="outline" size="sm" onClick={onUpgrade}>
                  <ArrowRight className="h-4 w-4 ml-2" />
                  Upgrade Now
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="journey">User Journey</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Portfolio Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Portfolio Overview</CardTitle>
                  <CardDescription>
                    {hasAccess
                      ? "Real-time portfolio performance"
                      : "Demo portfolio data"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Current Value</span>
                      <span className="text-lg font-bold">
                        {formatCurrency(
                          dashboardConfig.demoData.portfolioValue,
                        )}
                      </span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Invested</span>
                        <div className="font-medium">
                          {formatCurrency(
                            dashboardConfig.demoData.portfolioValue * 0.9,
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Gains</span>
                        <div className="font-medium text-green-600">
                          {formatCurrency(
                            dashboardConfig.demoData.portfolioValue * 0.1,
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!hasAccess && (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        Unlock real-time portfolio tracking with a paid plan
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hasAccess ? (
                    <>
                      <Button className="w-full">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Make Investment
                      </Button>
                      <Button variant="outline" className="w-full">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Risk Assessment
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={onUpgrade}
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Unlock Features
                      </Button>
                      <Button variant="ghost" className="w-full">
                        <Info className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  {hasAccess
                    ? "Your latest portfolio activities"
                    : "Sample activity feed"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Investment",
                      description: "Added $500 to Healthcare Fund",
                      time: "2 hours ago",
                      type: "positive",
                    },
                    {
                      action: "Rebalance",
                      description: "Portfolio automatically rebalanced",
                      time: "1 day ago",
                      type: "neutral",
                    },
                    {
                      action: "Dividend",
                      description: "Received $45 dividend payment",
                      time: "3 days ago",
                      type: "positive",
                    },
                    {
                      action: "Alert",
                      description: "Risk threshold exceeded",
                      time: "1 week ago",
                      type: "warning",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "positive"
                              ? "bg-green-500"
                              : activity.type === "warning"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{activity.action}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity.time}
                      </div>
                    </div>
                  ))}

                  {!hasAccess && (
                    <div className="text-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                      <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upgrade to see your real activity feed
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardConfig.features.map((feature, index) => (
                <Card
                  key={index}
                  className={`${!feature.available ? "opacity-75" : ""}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div
                        className={
                          feature.available
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }
                      >
                        {feature.icon}
                      </div>
                      {feature.title}
                      {!feature.available && (
                        <Badge variant="outline" className="ml-auto">
                          <Lock className="h-3 w-3 mr-1" />
                          {feature.requiresTier}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                    {!feature.available && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={onUpgrade}
                      >
                        Upgrade to {feature.requiresTier}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>
                    {hasAccess
                      ? "Real-time performance data"
                      : "Sample analytics preview"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                    {hasAccess ? (
                      <div className="text-center">
                        <LineChart className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <p className="text-sm text-muted-foreground">
                          Interactive chart would be here
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Upgrade to access advanced analytics
                        </p>
                        <Button size="sm" className="mt-2" onClick={onUpgrade}>
                          Unlock Analytics
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Portfolio Risk Score",
                        value: hasAccess ? "6.2/10" : "Hidden",
                        color: "text-yellow-600",
                      },
                      {
                        label: "Volatility",
                        value: hasAccess ? "12.4%" : "Hidden",
                        color: "text-blue-600",
                      },
                      {
                        label: "Sharpe Ratio",
                        value: hasAccess ? "1.85" : "Hidden",
                        color: "text-green-600",
                      },
                      {
                        label: "Max Drawdown",
                        value: hasAccess ? "-8.2%" : "Hidden",
                        color: "text-red-600",
                      },
                    ].map((metric, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-muted-foreground">
                          {metric.label}
                        </span>
                        <span
                          className={`font-medium ${hasAccess ? metric.color : "text-muted-foreground"}`}
                        >
                          {metric.value}
                        </span>
                      </div>
                    ))}

                    {!hasAccess && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                        onClick={onUpgrade}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Access Risk Analytics
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Journey Tab */}
          <TabsContent value="journey" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Investment Journey</CardTitle>
                <CardDescription>
                  Track your progress and next steps in your investment journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dashboardConfig.userJourney.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{step.step}</h4>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                        {!step.completed && !hasAccess && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={onUpgrade}
                          >
                            Unlock to Continue
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bandwidth Optimization Notice */}
        {bandwidthSettings.chartSimplification && (
          <Alert className="mt-6">
            <Activity className="h-4 w-4" />
            <AlertDescription>
              Charts and animations are simplified due to low bandwidth
              connection. Upgrade your connection for the full experience.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default EnterpriseDashboardFramework;
