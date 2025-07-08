import React, { useState, useEffect, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Globe,
  Heart,
  Wallet,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Info,
  Sun,
  Moon,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  healthcareTokenizationService,
  type HealthcareAsset,
  type PortfolioHealthcareAsset,
} from "../services/healthcareTokenizationService";
import {
  riskAdvisorService,
  type RiskAssessment,
  type RiskProfile,
} from "../services/riskAdvisorService";
import { conversationalIntelligenceService } from "../services/conversationalIntelligenceService";
import { themeService, type ThemeConfig } from "../services/themeService";
import { ExplainableAIWidget } from "./ExplainableAIWidget";
import { HealthcareAssetTracker } from "./HealthcareAssetTracker";
import { MobileOptimizedLayout } from "./MobileOptimizedLayout";

interface EmergingMarketDashboardProps {
  userId: string;
  language?: string;
  initialRiskProfile?: Partial<RiskProfile>;
}

export const EmergingMarketDashboard: React.FC<
  EmergingMarketDashboardProps
> = ({ userId, language = "en", initialRiskProfile }) => {
  // State management
  const [portfolio, setPortfolio] = useState<PortfolioHealthcareAsset[]>([]);
  const [availableAssets, setAvailableAssets] = useState<HealthcareAsset[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(
    themeService.getConfig(),
  );
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>("");

  // Initialize dashboard
  useEffect(() => {
    initializeDashboard();

    // Theme service listener
    const unsubscribe = themeService.addListener(setThemeConfig);

    // Real-time updates
    const interval = setInterval(() => {
      updatePortfolioData();
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [userId]);

  const initializeDashboard = async () => {
    try {
      setLoading(true);

      // Load available assets
      const assets = healthcareTokenizationService.getAllAssets();
      setAvailableAssets(assets);

      // Load user portfolio
      const userPortfolio = healthcareTokenizationService.getUserPortfolio();
      setPortfolio(userPortfolio);

      // Initialize risk profile if new user
      if (initialRiskProfile && userPortfolio.length === 0) {
        const defaultProfile: RiskProfile = {
          riskTolerance: "conservative",
          investmentHorizon: "medium",
          monthlyIncome: 1000,
          monthlyExpenses: 700,
          emergencyFund: 2100,
          age: 28,
          dependents: 0,
          financialKnowledge: "beginner",
          primaryGoals: ["wealth_building", "social_impact"],
          ...initialRiskProfile,
        };

        await riskAdvisorService.createRiskProfile(userId, defaultProfile);
        setShowOnboarding(true);
      }

      // Load risk assessment
      try {
        const assessment = await riskAdvisorService.assessPortfolioRisk(userId);
        setRiskAssessment(assessment);
      } catch (error) {
        console.error("Risk assessment not available:", error);
      }

      // Generate AI insight
      await generateWelcomeInsight();
    } catch (error) {
      console.error("Failed to initialize dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolioData = () => {
    const updatedPortfolio = healthcareTokenizationService.getUserPortfolio();
    setPortfolio(updatedPortfolio);

    if (updatedPortfolio.length > 0) {
      riskAdvisorService
        .assessPortfolioRisk(userId)
        .then(setRiskAssessment)
        .catch(console.error);
    }
  };

  const generateWelcomeInsight = async () => {
    try {
      const insight = await conversationalIntelligenceService.generateResponse(
        "Welcome a first-time investor to healthcare tokenization. Explain the opportunity in simple terms.",
        language,
        {
          context: "first_time_investor_welcome",
          userType: "emerging_market_citizen",
        },
      );
      setAiInsight(insight);
    } catch (error) {
      setAiInsight(
        "Welcome! Healthcare tokenization allows you to invest in healthcare projects that improve lives while potentially earning returns.",
      );
    }
  };

  // Portfolio summary calculations
  const portfolioSummary = useMemo(() => {
    if (portfolio.length === 0) {
      return {
        totalValue: 0,
        totalRoi: 0,
        unrealizedGains: 0,
        topPerformer: null,
        worstPerformer: null,
      };
    }

    const summary = healthcareTokenizationService.getPortfolioSummary();
    const sortedByRoi = [...portfolio].sort((a, b) => b.roi24h - a.roi24h);

    return {
      totalValue: summary.totalValue,
      totalRoi: summary.totalRoi,
      unrealizedGains: summary.totalUnrealizedGains,
      topPerformer: sortedByRoi[0],
      worstPerformer: sortedByRoi[sortedByRoi.length - 1],
    };
  }, [portfolio]);

  // Risk level styling
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "high":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 3) return "text-green-600";
    if (score <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <MobileOptimizedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">
              Loading your healthcare investment dashboard...
            </p>
          </div>
        </div>
      </MobileOptimizedLayout>
    );
  }

  return (
    <MobileOptimizedLayout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header with theme controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Healthcare Investment Dashboard
            </h1>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Your gateway to tokenized healthcare investments"
                : "Votre passerelle vers les investissements de santé tokenisés"}
            </p>
          </div>

          {/* Theme and accessibility controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                themeService.updateConfig({
                  mode: themeConfig.mode === "dark" ? "light" : "dark",
                })
              }
            >
              {themeConfig.mode === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Badge
              variant={
                themeConfig.bandwidthMode === "low"
                  ? "destructive"
                  : "secondary"
              }
            >
              {themeConfig.bandwidthMode === "low" ? (
                <WifiOff className="h-3 w-3 mr-1" />
              ) : (
                <Wifi className="h-3 w-3 mr-1" />
              )}
              {themeConfig.bandwidthMode} bandwidth
            </Badge>
          </div>
        </div>

        {/* AI Welcome Insight */}
        {aiInsight && (
          <ExplainableAIWidget
            title="Welcome to Healthcare Investing"
            explanation={aiInsight}
            confidence={0.95}
            language={language}
            showDetails={showOnboarding}
          />
        )}

        {/* Risk Alerts */}
        {riskAssessment?.alerts?.map((alert, index) => (
          <Alert
            key={index}
            className={
              alert.level === "critical"
                ? "border-red-500 bg-red-50"
                : alert.level === "warning"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-blue-500 bg-blue-50"
            }
          >
            {alert.level === "critical" ? (
              <AlertTriangle className="h-4 w-4" />
            ) : alert.level === "warning" ? (
              <Info className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              <strong>{alert.title}</strong>:{" "}
              {alert.localizedMessage || alert.message}
            </AlertDescription>
          </Alert>
        ))}

        {/* Main Dashboard Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="learn">Learn</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Portfolio Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Portfolio Value
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${portfolioSummary.totalValue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {portfolioSummary.totalRoi >= 0 ? "+" : ""}
                    {portfolioSummary.totalRoi.toFixed(2)}% total return
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Risk Score
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${getRiskScoreColor(riskAssessment?.overallRiskScore || 0)}`}
                  >
                    {riskAssessment?.overallRiskScore || "N/A"}/10
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {riskAssessment
                      ? riskAdvisorService.getSimplifiedRiskExplanation(
                          userId,
                          language,
                        )
                      : "Build portfolio for assessment"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Diversification
                  </CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {riskAssessment?.diversificationScore?.toFixed(0) || 0}%
                  </div>
                  <Progress
                    value={riskAssessment?.diversificationScore || 0}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Social Impact
                  </CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      healthcareTokenizationService.getPortfolioSummary()
                        .impactSummary.totalPatientsServed / 1000,
                    )}
                    K
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Patients served through your investments
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            {portfolio.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>
                    Your healthcare investment performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthcareAssetTracker
                    assets={portfolio}
                    showDetails={!themeService.shouldUseSimplifiedCharts()}
                    language={language}
                  />
                </CardContent>
              </Card>
            )}

            {/* Top & Worst Performers */}
            {portfolioSummary.topPerformer && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Top Performer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-semibold">
                      {portfolioSummary.topPerformer.name}
                    </div>
                    <div className="text-green-600 font-bold">
                      +{portfolioSummary.topPerformer.roi24h.toFixed(2)}% (24h)
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {portfolioSummary.topPerformer.description}
                    </p>
                  </CardContent>
                </Card>

                {portfolioSummary.worstPerformer &&
                  portfolioSummary.worstPerformer.id !==
                    portfolioSummary.topPerformer.id && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="text-red-800 flex items-center gap-2">
                          <TrendingDown className="h-4 w-4" />
                          Needs Attention
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="font-semibold">
                          {portfolioSummary.worstPerformer.name}
                        </div>
                        <div className="text-red-600 font-bold">
                          {portfolioSummary.worstPerformer.roi24h.toFixed(2)}%
                          (24h)
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {
                            portfolioSummary.worstPerformer.aiInsights
                              .localizedExplanation
                          }
                        </p>
                      </CardContent>
                    </Card>
                  )}
              </div>
            )}

            {/* Recommendations */}
            {riskAssessment?.recommendations &&
              riskAssessment.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Personalized Recommendations</CardTitle>
                    <CardDescription>
                      AI-powered suggestions to improve your portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {riskAssessment.recommendations
                      .slice(0, 3)
                      .map((rec, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{rec.title}</h4>
                            <Badge
                              variant={
                                rec.priority === "high"
                                  ? "destructive"
                                  : rec.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {rec.localizedExplanation}
                          </p>
                          {rec.actionRequired && (
                            <Button size="sm" className="mt-2">
                              Take Action
                            </Button>
                          )}
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Healthcare Investments</CardTitle>
                <CardDescription>
                  Detailed view of your tokenized healthcare portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                {portfolio.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Start Your Healthcare Investment Journey
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Discover tokenized healthcare opportunities that create
                      social impact while building wealth.
                    </p>
                    <Button onClick={() => setActiveTab("market")}>
                      Explore Healthcare Investments
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {portfolio.map((asset) => (
                      <div key={asset.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{asset.name}</h4>
                              <Badge
                                className={getRiskLevelColor(asset.riskLevel)}
                              >
                                {asset.riskLevel} risk
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {asset.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span>
                                Holdings: {asset.holdingAmount.toFixed(2)}{" "}
                                {asset.tokenSymbol}
                              </span>
                              <span>
                                Value: $
                                {(
                                  asset.holdingAmount * asset.currentPrice
                                ).toFixed(2)}
                              </span>
                              <span
                                className={
                                  asset.unrealizedGains >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {asset.unrealizedGains >= 0 ? "+" : ""}$
                                {asset.unrealizedGains.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              ${asset.currentPrice.toFixed(2)}
                            </div>
                            <div
                              className={`text-sm font-medium ${asset.roi24h >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {asset.roi24h >= 0 ? "+" : ""}
                              {asset.roi24h.toFixed(2)}% (24h)
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {asset.percentageOfPortfolio.toFixed(1)}% of
                              portfolio
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Tab */}
          <TabsContent value="market" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Healthcare Investments</CardTitle>
                <CardDescription>
                  Discover tokenized healthcare opportunities in emerging
                  markets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableAssets.map((asset) => (
                    <Card
                      key={asset.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {asset.name}
                          </CardTitle>
                          <Badge className={getRiskLevelColor(asset.riskLevel)}>
                            {asset.riskLevel}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">
                          {asset.geography} • {asset.sector}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold">
                            ${asset.currentPrice.toFixed(2)}
                          </span>
                          <span
                            className={`font-medium ${asset.roi24h >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {asset.roi24h >= 0 ? "+" : ""}
                            {asset.roi24h.toFixed(2)}%
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {asset.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">
                              Patients Served:
                            </span>
                            <div className="font-semibold">
                              {asset.impactMetrics.patientsServed.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Market Cap:
                            </span>
                            <div className="font-semibold">
                              ${(asset.marketCap / 1000000).toFixed(1)}M
                            </div>
                          </div>
                        </div>

                        <ExplainableAIWidget
                          title="AI Investment Insight"
                          explanation={asset.aiInsights.localizedExplanation}
                          confidence={asset.aiInsights.confidence}
                          language={language}
                          compact={true}
                        />

                        <Button
                          className="w-full"
                          size="sm"
                          onClick={() => {
                            // Simple investment simulation - in production, this would open a proper investment flow
                            const amount = 100; // Default $100 investment
                            const tokens = amount / asset.currentPrice;
                            if (
                              healthcareTokenizationService.addToPortfolio(
                                asset.id,
                                tokens,
                              )
                            ) {
                              setPortfolio(
                                healthcareTokenizationService.getUserPortfolio(),
                              );
                              setActiveTab("portfolio");
                            }
                          }}
                        >
                          Invest $100
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Healthcare Investment Education
                </CardTitle>
                <CardDescription>
                  Learn the basics of tokenized healthcare investing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Getting Started</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        What is healthcare tokenization?
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Understanding risk levels
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Diversification basics
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Measuring social impact
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Advanced Topics</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        Portfolio rebalancing strategies
                      </li>
                      <li className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        Geographic diversification
                      </li>
                      <li className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        Exit strategies and liquidity
                      </li>
                      <li className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        Tax implications for emerging markets
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Interactive Learning</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                    >
                      <BookOpen className="h-6 w-6" />
                      <span>Investment Basics Course</span>
                      <span className="text-xs text-muted-foreground">
                        15 min
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                    >
                      <Shield className="h-6 w-6" />
                      <span>Risk Assessment Quiz</span>
                      <span className="text-xs text-muted-foreground">
                        5 min
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                    >
                      <Heart className="h-6 w-6" />
                      <span>Impact Measurement</span>
                      <span className="text-xs text-muted-foreground">
                        10 min
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileOptimizedLayout>
  );
};
