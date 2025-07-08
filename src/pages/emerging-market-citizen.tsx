import React, { useState, useEffect } from "react";
import { useQuantumAuth } from "../hooks/useQuantumAuth";
import { localizationService } from "../services/localizationService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Smartphone,
  Globe,
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Banknote,
  Coins,
  ArrowUpDown,
  Wifi,
  MapPin,
  Clock,
  Heart,
  Building2,
  GraduationCap,
  ArrowLeft,
  Info,
  Lightbulb,
  Crown,
} from "lucide-react";
import { EmergingMarketDashboard } from "../components/EmergingMarketDashboard";
import PaymentBanner from "../components/PaymentBanner";
import SubscriptionPackage from "../components/SubscriptionPackage";
import { usePaymentBanner } from "../hooks/usePaymentBanner";
import { enhancedPaymentService } from "../services/enhancedPaymentService";
import type { RiskProfile } from "../services/riskAdvisorService";
import type { SubscriptionPlan } from "../types/Payment";

const EmergingMarketCitizenDashboard = () => {
  const { quantumIdentity, isAuthenticated, getQuantumScore } =
    useQuantumAuth();

  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [localCurrency, setLocalCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [microInvestments, setMicroInvestments] = useState<any[]>([]);
  const [communityPools, setCommunityPools] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHealthcareDashboard, setShowHealthcareDashboard] = useState(false);
  const [userLanguage, setUserLanguage] = useState("en");
  const [riskProfile, setRiskProfile] = useState<Partial<RiskProfile> | null>(
    null,
  );
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );

  // Payment banner hook
  const {
    bannerState,
    openPaymentBanner,
    closePaymentBanner,
    handlePaymentSuccess,
    handlePaymentError,
  } = usePaymentBanner();

  useEffect(() => {
    if (isAuthenticated && quantumIdentity) {
      detectLocation();
      loadDashboardData();
    }

    // Load subscription plans
    loadSubscriptionPlans();

    // Detect user language from browser
    const browserLang = navigator.language.slice(0, 2);
    setUserLanguage(browserLang);
  }, [isAuthenticated, quantumIdentity]);

  const loadSubscriptionPlans = () => {
    const plans = enhancedPaymentService.getSubscriptionPlans();
    setSubscriptionPlans(plans);
  };

  const detectLocation = async () => {
    // Detect user location and set appropriate currency
    // This would typically use IP geolocation or user preferences
    const region = "NG"; // Example: Nigeria
    const currency = "NGN";
    setLocalCurrency(currency);

    // Get exchange rate
    try {
      const rate = await localizationService.convertCurrency(
        1,
        "USD",
        currency,
      );
      setExchangeRate(rate.convertedAmount);
    } catch (error) {
      console.error("Failed to get exchange rate:", error);
      setExchangeRate(750); // Fallback rate for NGN
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load portfolio data
      const portfolio = await loadPortfolioData();
      setPortfolioData(portfolio);

      // Load micro-investment opportunities
      const microInvest = await loadMicroInvestments();
      setMicroInvestments(microInvest);

      // Load community investment pools
      const pools = await loadCommunityPools();
      setCommunityPools(pools);

      // Load payment methods
      const payments = await loadPaymentMethods();
      setPaymentMethods(payments);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolioData = async () => {
    return {
      totalValue: 2500, // In local currency
      stablecoinBalance: 850,
      localInvestments: 1200,
      internationalExposure: 450,
      monthlyContribution: 150,
      performance: generatePerformanceData(),
      breakdown: [
        {
          name: "Stablecoins (USDC)",
          value: 850,
          percentage: 34,
          stability: "High",
        },
        {
          name: "Local Real Estate Token",
          value: 600,
          percentage: 24,
          stability: "Medium",
        },
        {
          name: "Emerging Market ETF",
          value: 400,
          percentage: 16,
          stability: "Medium",
        },
        {
          name: "Community Agriculture Pool",
          value: 350,
          percentage: 14,
          stability: "Medium",
        },
        {
          name: "Education Savings",
          value: 300,
          percentage: 12,
          stability: "High",
        },
      ],
    };
  };

  const loadMicroInvestments = async () => {
    return [
      {
        id: "1",
        name: "Solar Power Micro-Grid",
        location: "Lagos, Nigeria",
        minimumInvestment: 50,
        expectedReturn: 15.2,
        duration: "12 months",
        investors: 342,
        funded: 78,
        category: "Energy",
        impact: "Provides electricity to 500 households",
      },
      {
        id: "2",
        name: "Small Farmer Collective",
        location: "Kenya",
        minimumInvestment: 25,
        expectedReturn: 12.8,
        duration: "18 months",
        investors: 567,
        funded: 92,
        category: "Agriculture",
        impact: "Supports 50 small-scale farmers",
      },
      {
        id: "3",
        name: "Mobile Money Expansion",
        location: "Ghana",
        minimumInvestment: 100,
        expectedReturn: 18.5,
        duration: "24 months",
        investors: 234,
        funded: 45,
        category: "Fintech",
        impact: "Expands financial services to rural areas",
      },
    ];
  };

  const loadCommunityPools = async () => {
    return [
      {
        id: "1",
        name: "Digital ROSCA Pool #47",
        participants: 24,
        monthlyContribution: 200,
        currentRound: 8,
        nextPayout: "2024-02-15",
        totalPool: 4800,
        yourPosition: 3,
      },
      {
        id: "2",
        name: "Education Savings Group",
        participants: 18,
        monthlyContribution: 150,
        currentRound: 12,
        nextPayout: "2024-02-28",
        totalPool: 3600,
        yourPosition: 7,
      },
    ];
  };

  const loadPaymentMethods = async () => {
    return [
      {
        name: "M-Pesa",
        type: "Mobile Money",
        balance: 1200,
        fee: "1%",
        instant: true,
      },
      {
        name: "Bank Transfer",
        type: "Traditional",
        balance: 800,
        fee: "2%",
        instant: false,
      },
      {
        name: "USDC Wallet",
        type: "Crypto",
        balance: 450,
        fee: "0.1%",
        instant: true,
      },
      {
        name: "Paystack",
        type: "Digital",
        balance: 300,
        fee: "1.5%",
        instant: true,
      },
    ];
  };

  const generatePerformanceData = () => {
    const data = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    let value = 1800;
    for (let i = 0; i < 6; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      value += (Math.random() - 0.3) * 200 + 120; // Growth trend
      data.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        value: Math.round(value),
        usdValue: Math.round(value / exchangeRate),
      });
    }
    return data;
  };

  const formatCurrency = (amount: number, inUSD: boolean = false) => {
    if (inUSD) {
      return `$${(amount / exchangeRate).toFixed(2)}`;
    }
    const symbol = localCurrency === "NGN" ? "₦" : "$";
    return `${symbol}${amount.toLocaleString()}`;
  };

  const handleGetStartedWithHealthcare = (investmentType: string) => {
    // Set appropriate risk profile based on user selection
    const profileDefaults: Partial<RiskProfile> = {
      riskTolerance:
        investmentType === "healthcare" ? "conservative" : "moderate",
      investmentHorizon: "medium",
      monthlyIncome: 800, // Emerging market average
      monthlyExpenses: 600,
      emergencyFund: 1200,
      age: 32,
      dependents: 2,
      financialKnowledge: "beginner",
      primaryGoals: ["wealth_building", "social_impact"],
    };

    setRiskProfile(profileDefaults);
    setShowHealthcareDashboard(true);
  };

  const startInvestment = async (amount: number) => {
    try {
      console.log(`Starting investment of ${formatCurrency(amount)}`);
      // This would integrate with actual payment processing
    } catch (error) {
      console.error("Investment failed:", error);
    }
  };

  if (showHealthcareDashboard) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setShowHealthcareDashboard(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Button>
            <h1 className="text-2xl font-bold">
              Healthcare Investment Dashboard
            </h1>
          </div>

          <EmergingMarketDashboard
            userId="emerging-market-demo-user"
            language={userLanguage}
            initialRiskProfile={riskProfile || undefined}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Your Investment Journey
              </h1>
              <p className="text-emerald-200 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Building wealth in emerging markets
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Badge
                variant="outline"
                className="bg-emerald-900/20 border-emerald-400 text-emerald-300"
              >
                Quantum Score: {getQuantumScore()}/100
              </Badge>
              <div className="flex items-center gap-2 text-sm text-emerald-200">
                <ArrowUpDown className="h-4 w-4" />1 USD ={" "}
                {localCurrency === "NGN" ? "₦" : "$"}
                {exchangeRate}
              </div>
            </div>
          </div>
        </div>

        {/* Healthcare Dashboard Announcement */}
        <Alert className="mb-6 bg-blue-900/50 border-blue-400">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription className="text-blue-100">
            <strong>New!</strong> Try our AI-powered Healthcare Investment
            Dashboard - designed specifically for first-time investors in
            emerging markets with multilingual support and mobile optimization.
            <Button
              variant="link"
              className="ml-2 text-blue-200 hover:text-blue-100 p-0 h-auto"
              onClick={() => handleGetStartedWithHealthcare("healthcare")}
            >
              Launch Healthcare Dashboard →
            </Button>
          </AlertDescription>
        </Alert>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-slate-300 flex items-center gap-1">
                <Coins className="h-4 w-4" />
                Total Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-white">
                {formatCurrency(portfolioData?.totalValue)}
              </div>
              <div className="text-xs text-slate-400">
                {formatCurrency(portfolioData?.totalValue, true)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-slate-300 flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Stable Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-white">
                {formatCurrency(portfolioData?.stablecoinBalance)}
              </div>
              <div className="text-xs text-green-400">
                Protected from inflation
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-slate-300 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Monthly Saving
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-white">
                {formatCurrency(portfolioData?.monthlyContribution)}
              </div>
              <div className="text-xs text-emerald-400">
                6% increase this month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-slate-300 flex items-center gap-1">
                <Wifi className="h-4 w-4" />
                Mobile Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-emerald-400">
                24/7
              </div>
              <div className="text-xs text-slate-400">Always connected</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700 w-full grid grid-cols-5 md:w-auto md:flex">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-slate-700 text-xs md:text-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="micro"
              className="data-[state=active]:bg-slate-700 text-xs md:text-sm"
            >
              Micro Invest
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="data-[state=active]:bg-slate-700 text-xs md:text-sm"
            >
              Community
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="data-[state=active]:bg-slate-700 text-xs md:text-sm"
            >
              Payments
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="data-[state=active]:bg-slate-700 text-xs md:text-sm"
            >
              <Crown className="h-4 w-4 mr-1" />
              Upgrade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Growth */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Portfolio Growth</CardTitle>
                  <CardDescription>
                    6-month performance in local currency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={portfolioData?.performance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                        }}
                        labelStyle={{ color: "#F3F4F6" }}
                        formatter={(value: any, name: string) => [
                          name === "value"
                            ? formatCurrency(value)
                            : formatCurrency(value, true),
                          name === "value" ? "Local Value" : "USD Value",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10B981"
                        fill="url(#portfolioGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient
                          id="portfolioGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Asset Breakdown */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Investment Mix</CardTitle>
                  <CardDescription>
                    Diversified across local and global markets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolioData?.breakdown.map(
                      (asset: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white text-sm">
                              {asset.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-mono">
                                {formatCurrency(asset.value)}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  asset.stability === "High"
                                    ? "border-green-400 text-green-300"
                                    : "border-yellow-400 text-yellow-300"
                                }`}
                              >
                                {asset.stability}
                              </Badge>
                            </div>
                          </div>
                          <Progress value={asset.percentage} className="h-2" />
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile-First Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    className="h-16 flex flex-col gap-1"
                    variant="outline"
                    onClick={() => handleGetStartedWithHealthcare("healthcare")}
                  >
                    <Heart className="h-5 w-5" />
                    <span className="text-xs">Healthcare Invest</span>
                  </Button>
                  <Button
                    className="h-16 flex flex-col gap-1"
                    variant="outline"
                    onClick={() => startInvestment(100)}
                  >
                    <DollarSign className="h-5 w-5" />
                    <span className="text-xs">Add Money</span>
                  </Button>
                  <Button
                    className="h-16 flex flex-col gap-1"
                    variant="outline"
                  >
                    <ArrowUpDown className="h-5 w-5" />
                    <span className="text-xs">Exchange</span>
                  </Button>
                  <Button
                    className="h-16 flex flex-col gap-1"
                    variant="outline"
                  >
                    <Banknote className="h-5 w-5" />
                    <span className="text-xs">Withdraw</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="micro" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {microInvestments.map((investment, index) => (
                <Card
                  key={investment.id}
                  className="bg-slate-800/50 border-slate-700"
                >
                  <CardHeader>
                    <CardTitle className="text-white text-lg">
                      {investment.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {investment.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-400 block">
                            Min Investment
                          </span>
                          <span className="text-white font-mono">
                            {formatCurrency(
                              investment.minimumInvestment * exchangeRate,
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">
                            Expected Return
                          </span>
                          <span className="text-green-400 font-mono">
                            {investment.expectedReturn}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">
                            Funding Progress
                          </span>
                          <span className="text-white">
                            {investment.funded}%
                          </span>
                        </div>
                        <Progress value={investment.funded} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <Badge variant="outline" className="text-xs">
                          {investment.category}
                        </Badge>
                        <p className="text-slate-300 text-xs">
                          {investment.impact}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {investment.investors} investors
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {investment.duration}
                        </div>
                      </div>

                      <Button className="w-full" size="sm">
                        Invest{" "}
                        {formatCurrency(
                          investment.minimumInvestment * exchangeRate,
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            {/* Community Pools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communityPools.map((pool, index) => (
                <Card
                  key={pool.id}
                  className="bg-slate-800/50 border-slate-700"
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {pool.name}
                    </CardTitle>
                    <CardDescription>
                      Digital savings group with {pool.participants} members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400 text-sm block">
                            Monthly Contribution
                          </span>
                          <span className="text-white font-mono text-lg">
                            {formatCurrency(pool.monthlyContribution)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm block">
                            Your Position
                          </span>
                          <span className="text-emerald-400 font-mono text-lg">
                            #{pool.yourPosition}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400 text-sm block">
                            Current Round
                          </span>
                          <span className="text-white font-mono">
                            {pool.currentRound}/{pool.participants}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm block">
                            Pool Total
                          </span>
                          <span className="text-white font-mono">
                            {formatCurrency(pool.totalPool)}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">
                            Next Payout
                          </span>
                        </div>
                        <p className="text-white text-sm">{pool.nextPayout}</p>
                      </div>

                      <Button className="w-full" variant="outline">
                        View Pool Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Community Impact */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Community Impact
                </CardTitle>
                <CardDescription>
                  Your investments are making a difference in your community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building2 className="h-8 w-8 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">127</div>
                    <div className="text-sm text-slate-400">Jobs Created</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="h-8 w-8 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">89</div>
                    <div className="text-sm text-slate-400">
                      Students Supported
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Globe className="h-8 w-8 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(45000)}
                    </div>
                    <div className="text-sm text-slate-400">
                      Community Invested
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {/* Payment Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentMethods.map((method, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>{method.name}</span>
                      {method.instant && (
                        <Badge
                          variant="outline"
                          className="border-green-400 text-green-300"
                        >
                          Instant
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{method.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Available Balance
                        </span>
                        <span className="text-white font-mono">
                          {formatCurrency(method.balance)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transaction Fee</span>
                        <span className="text-emerald-400">{method.fee}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Add Money
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Transactions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      type: "Investment",
                      amount: 500,
                      method: "M-Pesa",
                      time: "2 hours ago",
                      status: "Completed",
                    },
                    {
                      type: "ROSCA Contribution",
                      amount: 200,
                      method: "Bank Transfer",
                      time: "1 day ago",
                      status: "Completed",
                    },
                    {
                      type: "Stablecoin Purchase",
                      amount: 1000,
                      method: "USDC Wallet",
                      time: "3 days ago",
                      status: "Completed",
                    },
                    {
                      type: "Micro Investment",
                      amount: 150,
                      method: "Paystack",
                      time: "1 week ago",
                      status: "Completed",
                    },
                  ].map((tx, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                    >
                      <div>
                        <div className="text-white font-medium">{tx.type}</div>
                        <div className="text-slate-400 text-sm">
                          {tx.method} • {tx.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-mono">
                          {formatCurrency(tx.amount)}
                        </div>
                        <div className="text-green-400 text-sm">
                          {tx.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Plans Tab */}
          <TabsContent value="subscription" className="space-y-6">
            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-slate-800/50 p-1 rounded-lg border border-slate-700">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-2 rounded-md transition-all ${
                    billingCycle === "monthly"
                      ? "bg-emerald-600 text-white shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`px-6 py-2 rounded-md transition-all ${
                    billingCycle === "annual"
                      ? "bg-emerald-600 text-white shadow"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Annual
                  <Badge className="ml-2 bg-green-600 text-white text-xs">
                    Save 20%
                  </Badge>
                </button>
              </div>
            </div>

            {/* Subscription Plans */}
            <SubscriptionPackage
              plans={subscriptionPlans}
              onPlanSelect={(plan) =>
                openPaymentBanner(plan, "emerging-market-citizen")
              }
              billingCycle={billingCycle}
              popularPlanId="professional"
              className="mb-8"
            />

            {/* Benefits for Emerging Market Citizens */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Why Upgrade Your Emerging Market Investment Experience?
                </CardTitle>
                <CardDescription>
                  Specialized features designed for emerging market investors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mt-1">
                        <Globe className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          Multi-Currency Support
                        </h4>
                        <p className="text-slate-400 text-sm">
                          Seamless investments in local currency with real-time
                          exchange rates
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mt-1">
                        <Smartphone className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          Mobile-First Experience
                        </h4>
                        <p className="text-slate-400 text-sm">
                          Optimized for mobile banking and M-Pesa integrations
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mt-1">
                        <Users className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          Community Investment Pools
                        </h4>
                        <p className="text-slate-400 text-sm">
                          Join ROSCA-style investment groups and community funds
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mt-1">
                        <Shield className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          Risk Management Tools
                        </h4>
                        <p className="text-slate-400 text-sm">
                          Specialized risk assessment for emerging market
                          volatility
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          Local Market Insights
                        </h4>
                        <p className="text-slate-400 text-sm">
                          AI-powered insights for local and regional investment
                          opportunities
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mt-1">
                        <Heart className="h-4 w-4 text-red-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          Impact Investing
                        </h4>
                        <p className="text-slate-400 text-sm">
                          Track the social and economic impact of your
                          investments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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

export default EmergingMarketCitizenDashboard;
