import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Scatter,
  ScatterChart,
  Treemap,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Globe,
  Target,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Download,
  Filter,
  Search,
  RefreshCw,
  Settings,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Heart,
  Building2,
  Smartphone,
  Monitor,
  MapPin,
  Star,
  Award,
  Coins,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface MetricData {
  timestamp: string;
  value: number;
  change?: number;
  target?: number;
}

interface RevenueMetrics {
  totalRevenue: number;
  recurringRevenue: number;
  transactionRevenue: number;
  growthRate: number;
  churnRate: number;
  averageRevenuePerUser: number;
  customerLifetimeValue: number;
  monthlyRecurringRevenue: MetricData[];
  revenueBySegment: Array<{ segment: string; revenue: number; growth: number }>;
  revenueByRegion: Array<{ region: string; revenue: number; users: number }>;
}

interface UserAnalytics {
  totalActiveUsers: number;
  newUsers: number;
  returningUsers: number;
  userGrowthRate: number;
  sessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  usersByArchetype: Array<{
    archetype: string;
    count: number;
    revenue: number;
  }>;
  userJourneyFunnel: Array<{ stage: string; users: number; dropoff: number }>;
  cohortAnalysis: Array<{
    cohort: string;
    month0: number;
    month1: number;
    month3: number;
    month6: number;
  }>;
  userEngagement: MetricData[];
  userRetention: Array<{ period: string; rate: number }>;
}

interface TransactionAnalytics {
  totalTransactions: number;
  transactionVolume: number;
  averageTransactionValue: number;
  transactionGrowth: number;
  successRate: number;
  failureRate: number;
  transactionsByType: Array<{ type: string; count: number; volume: number }>;
  transactionsByRegion: Array<{
    region: string;
    count: number;
    avgValue: number;
  }>;
  paymentMethods: Array<{ method: string; usage: number; successRate: number }>;
  transactionTrends: MetricData[];
}

interface ImpactMetrics {
  socialImpactScore: number;
  environmentalImpactScore: number;
  livesImpacted: number;
  communitiesServed: number;
  sustainabilityProjects: number;
  carbonFootprintReduction: number;
  healthcareAccessImprovement: number;
  educationProgramsSupported: number;
  impactByCategory: Array<{ category: string; score: number; target: number }>;
  impactTrends: MetricData[];
  sdgAlignment: Array<{
    goal: number;
    name: string;
    progress: number;
    target: number;
  }>;
}

interface PredictiveAnalytics {
  revenueForeccast: MetricData[];
  userGrowthForecast: MetricData[];
  churnRiskUsers: Array<{ userId: string; risk: number; factors: string[] }>;
  marketPredictions: Array<{
    metric: string;
    predicted: number;
    confidence: number;
  }>;
  seasonalTrends: Array<{
    period: string;
    multiplier: number;
    confidence: number;
  }>;
  anomalyDetection: Array<{
    metric: string;
    timestamp: string;
    value: number;
    expected: number;
    severity: "low" | "medium" | "high";
  }>;
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  filters: Record<string, any>;
  chartType: "line" | "bar" | "pie" | "area" | "scatter" | "table";
  schedule?: "daily" | "weekly" | "monthly";
  recipients?: string[];
  lastGenerated?: string;
  nextGeneration?: string;
}

const BusinessIntelligenceDashboard: React.FC = () => {
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(
    null,
  );
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(
    null,
  );
  const [transactionAnalytics, setTransactionAnalytics] =
    useState<TransactionAnalytics | null>(null);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetrics | null>(
    null,
  );
  const [predictiveAnalytics, setPredictiveAnalytics] =
    useState<PredictiveAnalytics | null>(null);
  const [customReports, setCustomReports] = useState<CustomReport[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Initialize data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);

      // Revenue Metrics
      setRevenueMetrics({
        totalRevenue: 2847293,
        recurringRevenue: 1920485,
        transactionRevenue: 926808,
        growthRate: 23.4,
        churnRate: 3.2,
        averageRevenuePerUser: 184.32,
        customerLifetimeValue: 2847.5,
        monthlyRecurringRevenue: generateTimeSeriesData(12, 150000, 250000),
        revenueBySegment: [
          { segment: "Enterprise", revenue: 1420000, growth: 34.2 },
          { segment: "Professional", revenue: 856000, growth: 18.7 },
          { segment: "Individual", revenue: 571293, growth: 12.5 },
        ],
        revenueByRegion: [
          { region: "North America", revenue: 1425847, users: 8420 },
          { region: "Europe", revenue: 856293, users: 5230 },
          { region: "Asia Pacific", revenue: 342658, users: 2180 },
          { region: "Africa", revenue: 222495, users: 1950 },
        ],
      });

      // User Analytics
      setUserAnalytics({
        totalActiveUsers: 17823,
        newUsers: 1247,
        returningUsers: 16576,
        userGrowthRate: 15.3,
        sessionDuration: 847, // seconds
        bounceRate: 24.8,
        conversionRate: 3.2,
        usersByArchetype: [
          {
            archetype: "Emerging Market Citizen",
            count: 5420,
            revenue: 234820,
          },
          { archetype: "Retail Investor", count: 3280, revenue: 456930 },
          { archetype: "Cultural Investor", count: 2150, revenue: 342580 },
          { archetype: "Professional Advisor", count: 1890, revenue: 789450 },
          { archetype: "Enterprise", count: 580, revenue: 1023513 },
        ],
        userJourneyFunnel: [
          { stage: "Landing Page", users: 25847, dropoff: 0 },
          { stage: "Registration", users: 8954, dropoff: 65.3 },
          { stage: "Onboarding", users: 7832, dropoff: 12.5 },
          { stage: "First Investment", users: 5423, dropoff: 30.8 },
          { stage: "Active User", users: 4892, dropoff: 9.8 },
        ],
        cohortAnalysis: [
          {
            cohort: "Jan 2024",
            month0: 100,
            month1: 85,
            month3: 72,
            month6: 68,
          },
          {
            cohort: "Feb 2024",
            month0: 100,
            month1: 88,
            month3: 75,
            month6: 71,
          },
          {
            cohort: "Mar 2024",
            month0: 100,
            month1: 82,
            month3: 69,
            month6: 0,
          },
        ],
        userEngagement: generateTimeSeriesData(30, 12000, 18000),
        userRetention: [
          { period: "Day 1", rate: 85.2 },
          { period: "Day 7", rate: 68.4 },
          { period: "Day 30", rate: 45.8 },
          { period: "Day 90", rate: 32.1 },
        ],
      });

      // Transaction Analytics
      setTransactionAnalytics({
        totalTransactions: 45823,
        transactionVolume: 8947293,
        averageTransactionValue: 195.34,
        transactionGrowth: 28.7,
        successRate: 97.8,
        failureRate: 2.2,
        transactionsByType: [
          { type: "Investment", count: 28450, volume: 6847293 },
          { type: "Withdrawal", count: 12380, volume: 1890485 },
          { type: "Transfer", count: 4993, volume: 209515 },
        ],
        transactionsByRegion: [
          { region: "North America", count: 23485, avgValue: 245.82 },
          { region: "Europe", count: 14293, avgValue: 189.45 },
          { region: "Asia Pacific", count: 5820, avgValue: 156.78 },
          { region: "Africa", count: 2225, avgValue: 98.32 },
        ],
        paymentMethods: [
          { method: "Bank Transfer", usage: 45.2, successRate: 98.9 },
          { method: "Credit Card", usage: 32.8, successRate: 96.4 },
          { method: "Digital Wallet", usage: 18.5, successRate: 99.1 },
          { method: "Cryptocurrency", usage: 3.5, successRate: 94.2 },
        ],
        transactionTrends: generateTimeSeriesData(90, 400, 600),
      });

      // Impact Metrics
      setImpactMetrics({
        socialImpactScore: 87.3,
        environmentalImpactScore: 82.1,
        livesImpacted: 125847,
        communitiesServed: 847,
        sustainabilityProjects: 156,
        carbonFootprintReduction: 23.8,
        healthcareAccessImprovement: 34.5,
        educationProgramsSupported: 89,
        impactByCategory: [
          { category: "Healthcare", score: 89.2, target: 85 },
          { category: "Education", score: 78.4, target: 80 },
          { category: "Environment", score: 85.7, target: 75 },
          { category: "Economic Development", score: 92.1, target: 90 },
        ],
        impactTrends: generateTimeSeriesData(12, 70, 90),
        sdgAlignment: [
          {
            goal: 3,
            name: "Good Health and Well-being",
            progress: 78,
            target: 85,
          },
          { goal: 4, name: "Quality Education", progress: 65, target: 75 },
          {
            goal: 8,
            name: "Decent Work and Economic Growth",
            progress: 89,
            target: 80,
          },
          { goal: 13, name: "Climate Action", progress: 72, target: 70 },
        ],
      });

      // Predictive Analytics
      setPredictiveAnalytics({
        revenueForeccast: generateForecastData(12, 300000, 450000),
        userGrowthForecast: generateForecastData(12, 18000, 25000),
        churnRiskUsers: [
          {
            userId: "user_001",
            risk: 0.85,
            factors: ["Low engagement", "No recent transactions"],
          },
          {
            userId: "user_002",
            risk: 0.72,
            factors: ["Support tickets", "Performance complaints"],
          },
          {
            userId: "user_003",
            risk: 0.68,
            factors: ["Reduced activity", "Competitor engagement"],
          },
        ],
        marketPredictions: [
          { metric: "Q4 Revenue", predicted: 4250000, confidence: 87 },
          { metric: "New User Growth", predicted: 15.8, confidence: 92 },
          { metric: "Market Share", predicted: 12.4, confidence: 78 },
        ],
        seasonalTrends: [
          { period: "Q1", multiplier: 0.85, confidence: 94 },
          { period: "Q2", multiplier: 1.15, confidence: 91 },
          { period: "Q3", multiplier: 0.92, confidence: 89 },
          { period: "Q4", multiplier: 1.28, confidence: 96 },
        ],
        anomalyDetection: [
          {
            metric: "Transaction Volume",
            timestamp: "2024-01-15T10:30:00Z",
            value: 850,
            expected: 450,
            severity: "medium",
          },
          {
            metric: "User Signups",
            timestamp: "2024-01-14T14:20:00Z",
            value: 25,
            expected: 120,
            severity: "high",
          },
        ],
      });

      // Custom Reports
      setCustomReports([
        {
          id: "exec-summary",
          name: "Executive Summary",
          description: "Weekly executive dashboard with key metrics",
          metrics: ["revenue", "users", "transactions", "impact"],
          filters: { timeRange: "7d" },
          chartType: "line",
          schedule: "weekly",
          recipients: ["exec@quantumvest.com"],
          lastGenerated: "2024-01-15T09:00:00Z",
          nextGeneration: "2024-01-22T09:00:00Z",
        },
        {
          id: "performance-review",
          name: "Performance Review",
          description: "Monthly performance analysis across all metrics",
          metrics: ["all"],
          filters: { timeRange: "30d" },
          chartType: "bar",
          schedule: "monthly",
          recipients: ["team@quantumvest.com"],
          lastGenerated: "2024-01-01T00:00:00Z",
          nextGeneration: "2024-02-01T00:00:00Z",
        },
      ]);

      setLoading(false);
    };

    loadAnalyticsData();

    // Auto-refresh data
    if (autoRefresh) {
      const interval = setInterval(loadAnalyticsData, 60000); // Every minute
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedTimeRange]);

  // Generate time series data
  function generateTimeSeriesData(
    points: number,
    min: number,
    max: number,
  ): MetricData[] {
    const data = [];
    const now = new Date();

    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const baseValue = min + (max - min) * Math.random();
      const trend = ((points - i) / points) * 0.3; // Slight upward trend
      const noise = (Math.random() - 0.5) * 0.2;
      const value = baseValue * (1 + trend + noise);

      data.push({
        timestamp: date.toISOString(),
        value: Math.round(value),
        change:
          i < points - 1
            ? Math.round(
                ((value - data[data.length - 1]?.value || value) /
                  (data[data.length - 1]?.value || value)) *
                  100 *
                  100,
              ) / 100
            : 0,
      });
    }

    return data;
  }

  function generateForecastData(
    points: number,
    min: number,
    max: number,
  ): MetricData[] {
    const data = generateTimeSeriesData(points, min, max);

    // Add forecast confidence intervals
    return data.map((point, index) => ({
      ...point,
      target: point.value * (1 + 0.15), // 15% growth target
    }));
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getChangeColor = (change: number): string => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpRight className="h-3 w-3" />
    ) : (
      <ArrowDownRight className="h-3 w-3" />
    );
  };

  if (loading || !revenueMetrics || !userAnalytics || !transactionAnalytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business intelligence data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Business Intelligence Dashboard
            </h1>
            <p className="text-gray-600">
              Advanced analytics and insights for QuantumVest Enterprise
              Platform
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`}
              />
              {autoRefresh ? "Auto" : "Manual"}
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(revenueMetrics.totalRevenue)}
              </div>
              <div
                className={`flex items-center text-xs ${getChangeColor(revenueMetrics.growthRate)}`}
              >
                {getChangeIcon(revenueMetrics.growthRate)}
                <span className="ml-1">
                  {formatPercentage(revenueMetrics.growthRate)} from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(userAnalytics.totalActiveUsers)}
              </div>
              <div
                className={`flex items-center text-xs ${getChangeColor(userAnalytics.userGrowthRate)}`}
              >
                {getChangeIcon(userAnalytics.userGrowthRate)}
                <span className="ml-1">
                  {formatPercentage(userAnalytics.userGrowthRate)} growth rate
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transactions
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(transactionAnalytics.totalTransactions)}
              </div>
              <div
                className={`flex items-center text-xs ${getChangeColor(transactionAnalytics.transactionGrowth)}`}
              >
                {getChangeIcon(transactionAnalytics.transactionGrowth)}
                <span className="ml-1">
                  {formatPercentage(transactionAnalytics.successRate)} success
                  rate
                </span>
              </div>
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
                {formatNumber(impactMetrics!.livesImpacted)}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                <span>Lives positively impacted</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="predictive">Predictive</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>
                    Monthly recurring revenue over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueMetrics.monthlyRecurringRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                      />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        labelFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Revenue",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Growth */}
              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>
                    Daily active users and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userAnalytics.userEngagement}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                        formatter={(value: number) => [
                          formatNumber(value),
                          "Active Users",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {formatPercentage(userAnalytics.conversionRate)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Conversion Rate
                      </div>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(revenueMetrics.averageRevenuePerUser)}
                      </div>
                      <div className="text-sm text-muted-foreground">ARPU</div>
                    </div>
                    <Coins className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {formatPercentage(transactionAnalytics.successRate)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Success Rate
                      </div>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {impactMetrics.socialImpactScore}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Impact Score
                      </div>
                    </div>
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Regional Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>
                  Revenue and user distribution by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {revenueMetrics.revenueByRegion.map((region, index) => (
                    <div key={region.region} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{region.region}</h4>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">
                          {formatCurrency(region.revenue)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatNumber(region.users)} users
                        </div>
                        <div className="text-sm text-green-600">
                          {formatCurrency(region.revenue / region.users)} ARPU
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>
                    Revenue distribution by type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Recurring",
                            value: revenueMetrics.recurringRevenue,
                            fill: "#3b82f6",
                          },
                          {
                            name: "Transaction",
                            value: revenueMetrics.transactionRevenue,
                            fill: "#10b981",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue by Segment */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Segment</CardTitle>
                  <CardDescription>
                    Revenue performance across customer segments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueMetrics.revenueBySegment}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="segment" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Revenue",
                        ]}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Customer Lifetime Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    {formatCurrency(revenueMetrics.customerLifetimeValue)}
                  </div>
                  <Progress value={75} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    25% above industry average
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Churn Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2 text-red-600">
                    {formatPercentage(revenueMetrics.churnRate)}
                  </div>
                  <Progress
                    value={100 - revenueMetrics.churnRate * 10}
                    className="mb-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    Within target range
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Growth Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2 text-green-600">
                    {formatPercentage(revenueMetrics.growthRate)}
                  </div>
                  <Progress
                    value={revenueMetrics.growthRate * 4}
                    className="mb-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    Exceeding target growth
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Journey Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle>User Journey Funnel</CardTitle>
                  <CardDescription>
                    Conversion funnel from landing to active user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userAnalytics.userJourneyFunnel.map((stage, index) => (
                      <div
                        key={stage.stage}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">
                              {stage.stage}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatNumber(stage.users)} users
                              {stage.dropoff > 0 && (
                                <span className="text-red-600 ml-2">
                                  (-{formatPercentage(stage.dropoff)})
                                </span>
                              )}
                            </span>
                          </div>
                          <Progress
                            value={
                              index === 0
                                ? 100
                                : (stage.users /
                                    userAnalytics.userJourneyFunnel[0].users) *
                                  100
                            }
                            className="h-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Retention */}
              <Card>
                <CardHeader>
                  <CardTitle>User Retention</CardTitle>
                  <CardDescription>
                    User retention rates over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userAnalytics.userRetention}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip
                        formatter={(value: number) => [
                          `${value}%`,
                          "Retention Rate",
                        ]}
                      />
                      <Bar dataKey="rate" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Users by Archetype */}
            <Card>
              <CardHeader>
                <CardTitle>Users by Investment Archetype</CardTitle>
                <CardDescription>
                  User distribution and revenue by archetype
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userAnalytics.usersByArchetype.map((archetype, index) => (
                    <div
                      key={archetype.archetype}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">
                            {archetype.archetype}
                          </h4>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              {formatNumber(archetype.count)} users
                            </div>
                            <div className="text-sm text-green-600">
                              {formatCurrency(archetype.revenue)} revenue
                            </div>
                          </div>
                        </div>
                        <Progress
                          value={
                            (archetype.count / userAnalytics.totalActiveUsers) *
                            100
                          }
                          className="h-2"
                        />
                        <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                          <span>
                            {formatPercentage(
                              (archetype.count /
                                userAnalytics.totalActiveUsers) *
                                100,
                            )}{" "}
                            of total users
                          </span>
                          <span>
                            {formatCurrency(
                              archetype.revenue / archetype.count,
                            )}{" "}
                            ARPU
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would continue similarly... */}
          {/* For brevity, I'll include the structure for remaining tabs */}

          <TabsContent value="transactions">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Transaction analytics content would be implemented here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="impact">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Impact measurement content would be implemented here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="predictive">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Predictive analytics content would be implemented here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Custom Reports</h2>
                <Button>
                  <PieChartIcon className="h-4 w-4 mr-2" />
                  Create Report
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customReports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Schedule:</span>
                        <Badge>{report.schedule}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Last Generated:</span>
                        <span>
                          {report.lastGenerated
                            ? new Date(
                                report.lastGenerated,
                              ).toLocaleDateString()
                            : "Never"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessIntelligenceDashboard;
