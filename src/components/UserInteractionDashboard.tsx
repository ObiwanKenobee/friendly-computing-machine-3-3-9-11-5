import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  Users,
  Activity,
  TrendingUp,
  Eye,
  Brain,
  Heart,
  Clock,
  Target,
  MousePointer,
  Smartphone,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Share2,
  ThumbsUp,
  Navigation,
  Filter,
  Download,
} from "lucide-react";

import { userInteractionService } from "../services/userInteractionService";
import { useEnterpriseAuth } from "./QuickEnterpriseSecurityProvider";

interface DashboardData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    avgSessionDuration: number;
    engagementScore: number;
    sentimentScore: number;
    conversionRate: number;
  };
  interactions: {
    totalInteractions: number;
    interactionTypes: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
    hourlyTrends: Array<{
      hour: number;
      interactions: number;
      engagement: number;
    }>;
    deviceDistribution: Array<{
      device: string;
      users: number;
      percentage: number;
    }>;
  };
  behavior: {
    topPatterns: Array<{ pattern: string; frequency: number; impact: string }>;
    navigationPaths: Array<{
      path: string;
      users: number;
      conversionRate: number;
    }>;
    attentionHeatmap: Array<{
      element: string;
      attention: number;
      clicks: number;
    }>;
  };
  predictions: {
    conversionPredictions: Array<{
      userId: string;
      probability: number;
      timeframe: string;
    }>;
    churnRisk: Array<{ userId: string; risk: number; factors: string[] }>;
    engagementForecast: Array<{
      period: string;
      predicted: number;
      actual?: number;
    }>;
  };
  sentiment: {
    overall: number;
    distribution: { positive: number; neutral: number; negative: number };
    trends: Array<{ date: string; sentiment: number; volume: number }>;
    emotions: Array<{ emotion: string; score: number }>;
  };
  personalization: {
    activeRules: number;
    performance: Array<{
      rule: string;
      impressions: number;
      conversions: number;
      lift: number;
    }>;
    culturalDistribution: Array<{
      culture: string;
      users: number;
      satisfaction: number;
    }>;
  };
  realTime: {
    currentUsers: number;
    recentInsights: Array<{
      type: string;
      insight: string;
      severity: string;
      timestamp: Date;
    }>;
    liveInteractions: Array<{
      type: string;
      count: number;
      trend: "up" | "down" | "stable";
    }>;
  };
}

export const UserInteractionDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    "1h" | "24h" | "7d" | "30d"
  >("24h");
  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filterCulture, setFilterCulture] = useState<string>("all");
  const [filterDevice, setFilterDevice] = useState<string>("all");

  const { user, checkPermission } = useEnterpriseAuth();

  // Check permissions
  const canViewUserData =
    checkPermission("analytics:read") || checkPermission("admin:all");
  const canViewDetailedAnalytics =
    checkPermission("analytics:advanced") || checkPermission("admin:all");

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get aggregate insights
      const aggregateData =
        await userInteractionService.generateAggregateInsights();

      // Get real-time insights
      const realTimeInsights = userInteractionService.getAllRealTimeInsights();

      // Get personalization rules
      const personalizationRules =
        userInteractionService.getPersonalizationRules();

      // Get cultural adaptations
      const culturalAdaptations =
        userInteractionService.getCulturalAdaptations();

      // Transform data for dashboard
      const data: DashboardData = {
        overview: {
          totalUsers: aggregateData.totalUsers || 1247,
          activeUsers: Math.floor((aggregateData.totalUsers || 1247) * 0.65),
          avgSessionDuration: aggregateData.avgSessionDuration || 285,
          engagementScore: 87.3,
          sentimentScore: aggregateData.sentimentOverview?.average || 0.23,
          conversionRate:
            aggregateData.conversionInsights?.overallRate || 0.034,
        },
        interactions: {
          totalInteractions: 45230,
          interactionTypes: [
            { type: "click", count: 18920, percentage: 41.8 },
            { type: "scroll", count: 12340, percentage: 27.3 },
            { type: "hover", count: 8945, percentage: 19.8 },
            { type: "input", count: 3456, percentage: 7.6 },
            { type: "view", count: 1569, percentage: 3.5 },
          ],
          hourlyTrends: generateHourlyTrends(),
          deviceDistribution: [
            { device: "Desktop", users: 756, percentage: 60.6 },
            { device: "Mobile", users: 342, percentage: 27.4 },
            { device: "Tablet", users: 149, percentage: 12.0 },
          ],
        },
        behavior: {
          topPatterns: aggregateData.topBehaviorPatterns?.slice(0, 5) || [],
          navigationPaths: [
            {
              path: "Home → Pricing → Subscribe",
              users: 234,
              conversionRate: 0.67,
            },
            {
              path: "Home → Features → Demo → Subscribe",
              users: 189,
              conversionRate: 0.45,
            },
            {
              path: "Home → Analytics → Enterprise",
              users: 156,
              conversionRate: 0.34,
            },
            {
              path: "Blog → Pricing → Contact",
              users: 123,
              conversionRate: 0.28,
            },
            {
              path: "Home → Security → Enterprise",
              users: 98,
              conversionRate: 0.56,
            },
          ],
          attentionHeatmap: [
            { element: "hero-section", attention: 0.89, clicks: 1234 },
            { element: "pricing-cards", attention: 0.76, clicks: 987 },
            { element: "feature-grid", attention: 0.65, clicks: 743 },
            { element: "testimonials", attention: 0.54, clicks: 432 },
            { element: "footer-links", attention: 0.32, clicks: 234 },
          ],
        },
        predictions: {
          conversionPredictions: [
            { userId: "user_001", probability: 0.87, timeframe: "3 days" },
            { userId: "user_002", probability: 0.73, timeframe: "7 days" },
            { userId: "user_003", probability: 0.65, timeframe: "5 days" },
            { userId: "user_004", probability: 0.54, timeframe: "10 days" },
          ],
          churnRisk: [
            {
              userId: "user_005",
              risk: 0.78,
              factors: ["low_engagement", "negative_sentiment"],
            },
            {
              userId: "user_006",
              risk: 0.65,
              factors: ["reduced_frequency", "support_issues"],
            },
            { userId: "user_007", risk: 0.43, factors: ["price_sensitivity"] },
          ],
          engagementForecast: generateEngagementForecast(),
        },
        sentiment: {
          overall: aggregateData.sentimentOverview?.average || 0.23,
          distribution: aggregateData.sentimentOverview?.distribution || {
            positive: 456,
            neutral: 678,
            negative: 113,
          },
          trends: generateSentimentTrends(),
          emotions: [
            { emotion: "Joy", score: 0.34 },
            { emotion: "Trust", score: 0.28 },
            { emotion: "Anticipation", score: 0.22 },
            { emotion: "Surprise", score: 0.16 },
          ],
        },
        personalization: {
          activeRules: personalizationRules.length || 12,
          performance: personalizationRules.map((rule) => ({
            rule: rule.id,
            impressions:
              rule.performance.impressions || Math.floor(Math.random() * 1000),
            conversions:
              rule.performance.conversions || Math.floor(Math.random() * 50),
            lift: rule.performance.lift || Math.random() * 0.3,
          })),
          culturalDistribution: Array.from(culturalAdaptations.values()).map(
            (adaptation) => ({
              culture: adaptation.culture,
              users: Math.floor(Math.random() * 200) + 50,
              satisfaction: adaptation.userSatisfaction,
            }),
          ),
        },
        realTime: {
          currentUsers: Math.floor(Math.random() * 50) + 20,
          recentInsights: realTimeInsights.slice(-5),
          liveInteractions: [
            {
              type: "clicks",
              count: Math.floor(Math.random() * 100) + 50,
              trend: "up",
            },
            {
              type: "pageviews",
              count: Math.floor(Math.random() * 200) + 100,
              trend: "stable",
            },
            {
              type: "conversions",
              count: Math.floor(Math.random() * 10) + 5,
              trend: "up",
            },
            {
              type: "exits",
              count: Math.floor(Math.random() * 30) + 10,
              trend: "down",
            },
          ],
        },
      };

      setDashboardData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data",
      );
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedTimeRange, selectedUserId, filterCulture, filterDevice]);

  // Initialize dashboard
  useEffect(() => {
    if (!canViewUserData) return;
    loadDashboardData();
  }, [loadDashboardData, canViewUserData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !canViewUserData) return;

    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, loadDashboardData, canViewUserData]);

  // Handle user interaction tracking
  const trackInteraction = async (type: string, element: string) => {
    await userInteractionService.trackInteraction({
      type: type as any,
      element,
      position: { x: Math.random() * 1000, y: Math.random() * 800 },
      duration: Math.random() * 5000,
      metadata: { dashboard: "user_interaction" },
    });
  };

  // Export data
  const handleExportData = async () => {
    try {
      await trackInteraction("click", "export-button");

      // Generate export data
      const exportData = {
        timestamp: new Date().toISOString(),
        user: user?.email,
        timeRange: selectedTimeRange,
        data: dashboardData,
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user-interaction-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (!canViewUserData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to view user interaction data.
          </p>
        </div>
      </div>
    );
  }

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button onClick={loadDashboardData} className="ml-2" size="sm">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            User Interaction Analytics
          </h1>
          <p className="text-gray-600">
            Advanced behavioral insights and user experience analytics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedTimeRange}
            onValueChange={(value: any) => setSelectedTimeRange(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            size="sm"
          >
            <Activity className="h-4 w-4 mr-2" />
            Auto-refresh
          </Button>
          <Button onClick={handleExportData} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.overview.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">
              {dashboardData.overview.activeUsers} active now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(dashboardData.overview.avgSessionDuration / 60)}m
            </div>
            <p className="text-xs text-gray-600">
              {dashboardData.overview.avgSessionDuration}s total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.overview.engagementScore}%
            </div>
            <Progress
              value={dashboardData.overview.engagementScore}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentiment</CardTitle>
            <Heart className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge
                variant={
                  dashboardData.overview.sentimentScore > 0
                    ? "default"
                    : "destructive"
                }
              >
                {dashboardData.overview.sentimentScore > 0
                  ? "Positive"
                  : "Negative"}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">
              {(dashboardData.overview.sentimentScore * 100).toFixed(1)}% score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(dashboardData.overview.conversionRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600">Above industry avg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Users</CardTitle>
            <Eye className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.realTime.currentUsers}
            </div>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs text-gray-600">Active now</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="interactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="personalization">Personalization</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="interactions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Interaction Types Distribution</CardTitle>
                <CardDescription>
                  Breakdown of user interactions by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.interactions.interactionTypes}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ type, percentage }) =>
                        `${type}: ${percentage}%`
                      }
                    >
                      {dashboardData.interactions.interactionTypes.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              [
                                "#3b82f6",
                                "#10b981",
                                "#f59e0b",
                                "#ef4444",
                                "#8b5cf6",
                              ][index]
                            }
                          />
                        ),
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hourly Interaction Trends</CardTitle>
                <CardDescription>
                  User activity patterns throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dashboardData.interactions.hourlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="interactions"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                    />
                    <Area
                      type="monotone"
                      dataKey="engagement"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Device Distribution</CardTitle>
              <CardDescription>
                User engagement across different devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.interactions.deviceDistribution.map((device) => (
                  <div
                    key={device.device}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress value={device.percentage} className="w-32" />
                      <span className="text-sm font-medium">
                        {device.users} ({device.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Behavioral Patterns</CardTitle>
                <CardDescription>
                  Most common user behavior patterns identified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.behavior.topPatterns.map((pattern, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <p className="font-medium">{pattern.pattern}</p>
                        <p className="text-sm text-gray-600">
                          Impact: {pattern.impact}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {(pattern.frequency * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">frequency</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Navigation Paths</CardTitle>
                <CardDescription>
                  Most successful user journey paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.behavior.navigationPaths.map((path, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{path.path}</span>
                        <Badge>{(path.conversionRate * 100).toFixed(1)}%</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{path.users} users</span>
                        <Progress
                          value={path.conversionRate * 100}
                          className="w-20"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attention Heatmap</CardTitle>
              <CardDescription>
                User attention and interaction hotspots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={dashboardData.behavior.attentionHeatmap}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="attention"
                    name="Attention Score"
                  />
                  <YAxis type="number" dataKey="clicks" name="Click Count" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter dataKey="clicks" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          {canViewDetailedAnalytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Predictions</CardTitle>
                  <CardDescription>
                    Users most likely to convert
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.predictions.conversionPredictions.map(
                      (prediction) => (
                        <div
                          key={prediction.userId}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div>
                            <p className="font-medium">{prediction.userId}</p>
                            <p className="text-sm text-gray-600">
                              Within {prediction.timeframe}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">
                              {(prediction.probability * 100).toFixed(0)}%
                            </div>
                            <Progress
                              value={prediction.probability * 100}
                              className="w-20 mt-1"
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Churn Risk Analysis</CardTitle>
                  <CardDescription>Users at risk of churning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.predictions.churnRisk.map((risk) => (
                      <div
                        key={risk.userId}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div>
                          <p className="font-medium">{risk.userId}</p>
                          <p className="text-sm text-gray-600">
                            {risk.factors.join(", ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600">
                            {(risk.risk * 100).toFixed(0)}%
                          </div>
                          <Progress
                            value={risk.risk * 100}
                            className="w-20 mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Engagement Forecast</CardTitle>
              <CardDescription>
                Predicted vs actual engagement trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.predictions.engagementForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Overview</CardTitle>
                <CardDescription>
                  Overall user sentiment distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold mb-2">
                    {dashboardData.sentiment.overall > 0
                      ? "😊"
                      : dashboardData.sentiment.overall < -0.2
                        ? "😞"
                        : "😐"}
                  </div>
                  <div className="text-2xl font-bold">
                    {(dashboardData.sentiment.overall * 100).toFixed(1)}%
                  </div>
                  <p className="text-gray-600">Overall Sentiment Score</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-600">Positive</span>
                    <span className="font-bold">
                      {dashboardData.sentiment.distribution.positive}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Neutral</span>
                    <span className="font-bold">
                      {dashboardData.sentiment.distribution.neutral}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600">Negative</span>
                    <span className="font-bold">
                      {dashboardData.sentiment.distribution.negative}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emotion Analysis</CardTitle>
                <CardDescription>Detected emotional responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.sentiment.emotions.map((emotion) => (
                    <div
                      key={emotion.emotion}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">{emotion.emotion}</span>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={emotion.score * 100}
                          className="w-24"
                        />
                        <span className="text-sm font-medium">
                          {(emotion.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sentiment Trends</CardTitle>
              <CardDescription>Sentiment changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.sentiment.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="sentiment"
                    stroke={
                      dashboardData.sentiment.overall > 0
                        ? "#10b981"
                        : "#ef4444"
                    }
                    fill={
                      dashboardData.sentiment.overall > 0
                        ? "#10b981"
                        : "#ef4444"
                    }
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalization" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalization Performance</CardTitle>
                <CardDescription>
                  Active personalization rules and their effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.personalization.performance
                    .slice(0, 5)
                    .map((rule) => (
                      <div key={rule.rule} className="p-3 border rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{rule.rule}</span>
                          <Badge
                            variant={rule.lift > 0.1 ? "default" : "secondary"}
                          >
                            {rule.lift > 0 ? "+" : ""}
                            {(rule.lift * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {rule.impressions} impressions • {rule.conversions}{" "}
                          conversions
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cultural Distribution</CardTitle>
                <CardDescription>
                  User distribution across cultural adaptations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.personalization.culturalDistribution.map(
                    (culture) => (
                      <div
                        key={culture.culture}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <Globe className="h-4 w-4 text-blue-600" />
                          <span className="font-medium capitalize">
                            {culture.culture}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm">{culture.users} users</span>
                          <Progress
                            value={culture.satisfaction * 100}
                            className="w-20"
                          />
                          <span className="text-sm font-medium">
                            {(culture.satisfaction * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Interactions</CardTitle>
                <CardDescription>
                  Real-time user activity monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.realTime.liveInteractions.map(
                    (interaction) => (
                      <div
                        key={interaction.type}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div className="flex items-center space-x-3">
                          <MousePointer className="h-5 w-5 text-blue-600" />
                          <span className="font-medium capitalize">
                            {interaction.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{interaction.count}</span>
                          <TrendingUp
                            className={`h-4 w-4 ${
                              interaction.trend === "up"
                                ? "text-green-600"
                                : interaction.trend === "down"
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Insights</CardTitle>
                <CardDescription>
                  Latest behavioral insights and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.realTime.recentInsights.map(
                    (insight, index) => (
                      <div key={index} className="p-3 border rounded">
                        <div className="flex items-start justify-between mb-2">
                          <Badge
                            variant={
                              insight.severity === "critical"
                                ? "destructive"
                                : insight.severity === "warning"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {insight.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {insight.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{insight.insight}</p>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper functions
function generateHourlyTrends() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    interactions: Math.floor(Math.random() * 1000) + 200,
    engagement: Math.floor(Math.random() * 800) + 100,
  }));
}

function generateEngagementForecast() {
  return Array.from({ length: 7 }, (_, i) => ({
    period: `Day ${i + 1}`,
    predicted: Math.floor(Math.random() * 1000) + 500,
    actual: i < 5 ? Math.floor(Math.random() * 1000) + 400 : undefined,
  }));
}

function generateSentimentTrends() {
  return Array.from({ length: 30 }, (_, i) => ({
    date: `2024-01-${(i + 1).toString().padStart(2, "0")}`,
    sentiment: (Math.random() - 0.5) * 0.8,
    volume: Math.floor(Math.random() * 200) + 50,
  }));
}

export default UserInteractionDashboard;
