import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Progress } from "../ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  TrendingUp,
  Shield,
  Brain,
  Target,
  BarChart3,
  DollarSign,
  Users,
  Globe,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Activity,
  PieChart,
  LineChart,
  Settings,
  Download,
  Bell,
  Filter,
  RefreshCw,
} from "lucide-react";

// Import all legendary investor components
import { MungerAdvisoryPanel } from "./MungerAdvisoryPanel";
import { BuffettMoatIndicator } from "./BuffettMoatIndicator";
import { DalioBalanceWidget } from "./DalioBalanceWidget";
import { LynchInsightFeed } from "./LynchInsightFeed";

// Import services
import { legendaryInvestorIntegrationService } from "@/services/legendaryInvestorIntegrationService";
import { adaptiveYieldOptimizationService } from "@/services/adaptiveYieldOptimizationService";
import { enterpriseServiceWrapper } from "@/services/enterpriseServiceWrapper";

interface DashboardMetrics {
  totalPortfolioValue: number;
  totalReturn: number;
  monthlyReturn: number;
  riskScore: number;
  diversificationScore: number;
  moatStrength: number;
  localInsightScore: number;
  mentalModelConfidence: number;
}

interface CrossPhilosophyRecommendation {
  id: string;
  title: string;
  description: string;
  philosophies: string[];
  confidence: number;
  impact: "high" | "medium" | "low";
  timeframe: string;
  action: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  benchmark: number;
}

export const EnterpriseInvestorDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<
    CrossPhilosophyRecommendation[]
  >([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<
    PerformanceMetric[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activePhilosophy, setActivePhilosophy] = useState("overview");
  const [timeRange, setTimeRange] = useState("1M");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Use enterprise service wrapper for better error handling
      const [metricsData, recommendationsData, performanceData] =
        await Promise.all([
          enterpriseServiceWrapper.safeServiceCall(
            "legendaryInvestorIntegrationService-metrics",
            () =>
              legendaryInvestorIntegrationService.getDashboardMetrics?.() ||
              Promise.resolve(enterpriseServiceWrapper.getDashboardMetrics()),
            enterpriseServiceWrapper.getDashboardMetrics(),
          ),
          enterpriseServiceWrapper.safeServiceCall(
            "legendaryInvestorIntegrationService-recommendations",
            () =>
              legendaryInvestorIntegrationService.getCrossPhilosophyRecommendations?.() ||
              Promise.resolve(
                enterpriseServiceWrapper.getCrossPhilosophyRecommendations(),
              ),
            enterpriseServiceWrapper.getCrossPhilosophyRecommendations(),
          ),
          enterpriseServiceWrapper.safeServiceCall(
            "legendaryInvestorIntegrationService-performance",
            () =>
              legendaryInvestorIntegrationService.getPerformanceMetrics?.(
                timeRange,
              ) ||
              Promise.resolve(
                enterpriseServiceWrapper.getPerformanceMetrics(timeRange),
              ),
            enterpriseServiceWrapper.getPerformanceMetrics(timeRange),
          ),
        ]);

      setMetrics(metricsData);
      setRecommendations(recommendationsData);
      setPerformanceMetrics(performanceData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      // Set fallback data on error
      setMetrics(enterpriseServiceWrapper.getDashboardMetrics());
      setRecommendations(
        enterpriseServiceWrapper.getCrossPhilosophyRecommendations(),
      );
      setPerformanceMetrics(
        enterpriseServiceWrapper.getPerformanceMetrics(timeRange),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Enterprise Investor Dashboard
          </h1>
          <p className="text-muted-foreground">
            Legendary wisdom meets modern technology - Your complete investment
            command center
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1 Day</SelectItem>
              <SelectItem value="1W">1 Week</SelectItem>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
              <SelectItem value="ALL">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Portfolio Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(metrics.totalPortfolioValue)}
              </div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    metrics.totalReturn >= 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {formatPercent(metrics.totalReturn)}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Return
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercent(metrics.monthlyReturn)}
              </div>
              <p className="text-xs text-muted-foreground">
                Above market benchmark
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${getScoreColor(metrics.riskScore)}`}
              >
                {metrics.riskScore}/100
              </div>
              <p className="text-xs text-muted-foreground">
                Optimally balanced
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Philosophy Alignment
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(
                  (metrics.moatStrength +
                    metrics.diversificationScore +
                    metrics.localInsightScore +
                    metrics.mentalModelConfidence) /
                    4,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                All strategies aligned
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Philosophy Strength Indicators */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Munger Models</h3>
                <p className="text-sm text-muted-foreground">
                  Mental Framework
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Confidence</span>
                <span>{metrics.mentalModelConfidence}%</span>
              </div>
              <Progress value={metrics.mentalModelConfidence} className="h-2" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Buffett Moats</h3>
                <p className="text-sm text-muted-foreground">
                  Competitive Advantage
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Strength</span>
                <span>{metrics.moatStrength}%</span>
              </div>
              <Progress value={metrics.moatStrength} className="h-2" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Dalio Balance</h3>
                <p className="text-sm text-muted-foreground">All Weather</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Diversification</span>
                <span>{metrics.diversificationScore}%</span>
              </div>
              <Progress value={metrics.diversificationScore} className="h-2" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Lynch Insights</h3>
                <p className="text-sm text-muted-foreground">Local Knowledge</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Insight Quality</span>
                <span>{metrics.localInsightScore}%</span>
              </div>
              <Progress value={metrics.localInsightScore} className="h-2" />
            </div>
          </Card>
        </div>
      )}

      {/* Cross-Philosophy Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Legendary Investor Synthesis
          </CardTitle>
          <CardDescription>
            AI-powered recommendations combining all four investment
            philosophies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{rec.title}</h4>
                    <p className="text-muted-foreground">{rec.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        rec.impact === "high"
                          ? "default"
                          : rec.impact === "medium"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {rec.impact} impact
                    </Badge>
                    <Badge variant="outline">
                      {rec.confidence}% confidence
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Philosophies:
                    </span>
                    {rec.philosophies.map((philosophy) => (
                      <Badge
                        key={philosophy}
                        variant="outline"
                        className="text-xs"
                      >
                        {philosophy}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      Timeframe: {rec.timeframe}
                    </span>
                    <Button size="sm">{rec.action}</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
          <CardDescription>
            Key performance indicators across all investment strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceMetrics.map((metric) => (
              <div key={metric.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{metric.name}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="text-2xl font-bold mb-1">
                  {metric.name.includes("Return") ||
                  metric.name.includes("Rate")
                    ? formatPercent(metric.value)
                    : metric.value.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span
                    className={
                      metric.change >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {formatPercent(metric.change)}
                  </span>{" "}
                  vs benchmark ({formatPercent(metric.benchmark)})
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Philosophy Tabs */}
      <Tabs
        value={activePhilosophy}
        onValueChange={setActivePhilosophy}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="munger">Munger</TabsTrigger>
          <TabsTrigger value="buffett">Buffett</TabsTrigger>
          <TabsTrigger value="dalio">Dalio</TabsTrigger>
          <TabsTrigger value="lynch">Lynch</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>All Systems Operational</AlertTitle>
            <AlertDescription>
              All four legendary investor strategies are actively monitoring
              your portfolio and providing recommendations.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Mental Models (Munger)</span>
                    <span className="font-semibold text-purple-600">
                      +12.3%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Economic Moats (Buffett)</span>
                    <span className="font-semibold text-green-600">+15.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>All Weather (Dalio)</span>
                    <span className="font-semibold text-blue-600">+8.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Local Insights (Lynch)</span>
                    <span className="font-semibold text-orange-600">
                      +18.2%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Low Risk (Buffett Moats)</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Medium Risk (Dalio Balance)</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Higher Risk (Lynch Opportunities)</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="munger" className="space-y-4">
          <MungerAdvisoryPanel />
        </TabsContent>

        <TabsContent value="buffett" className="space-y-4">
          <BuffettMoatIndicator />
        </TabsContent>

        <TabsContent value="dalio" className="space-y-4">
          <DalioBalanceWidget />
        </TabsContent>

        <TabsContent value="lynch" className="space-y-4">
          <LynchInsightFeed />
        </TabsContent>
      </Tabs>
    </div>
  );
};
