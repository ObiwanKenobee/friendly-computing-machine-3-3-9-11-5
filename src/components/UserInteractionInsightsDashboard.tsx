/**
 * User Interaction Insights Dashboard
 * Comprehensive visualization of user behavior and platform skeleton insights
 */

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
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Activity,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Zap,
  Brain,
  Target,
  Lightbulb,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  MousePointer,
  Eye,
  Heart,
  Gauge,
} from "lucide-react";
import EnhancedUserInteractionService, {
  UserInteractionInsight,
  PlatformSkeletonInsight,
} from "../services/enhancedUserInteractionService";
import { appHealthMonitor, SystemHealth } from "../utils/appHealthMonitor";

interface DashboardProps {
  className?: string;
}

const UserInteractionInsightsDashboard: React.FC<DashboardProps> = ({
  className = "",
}) => {
  const [insights, setInsights] = useState<UserInteractionInsight[]>([]);
  const [skeletonInsights, setSkeletonInsights] = useState<
    PlatformSkeletonInsight[]
  >([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [engagementSummary, setEngagementSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("1h");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const interactionService = EnhancedUserInteractionService.getInstance();

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedTimeRange, selectedType, selectedSeverity]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Calculate time range
      const now = new Date();
      const timeRanges: Record<string, number> = {
        "1h": 60 * 60 * 1000,
        "6h": 6 * 60 * 60 * 1000,
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
      };

      const startTime = new Date(now.getTime() - timeRanges[selectedTimeRange]);

      // Get insights with filters
      const insightFilters = {
        timeRange: { start: startTime, end: now },
        type: selectedType !== "all" ? (selectedType as any) : undefined,
        severity:
          selectedSeverity !== "all" ? (selectedSeverity as any) : undefined,
        limit: 100,
      };

      const [insightsData, skeletonData, healthData, engagementData] =
        await Promise.all([
          Promise.resolve(interactionService.getInsights(insightFilters)),
          Promise.resolve(interactionService.getSkeletonInsights()),
          appHealthMonitor.checkHealth(),
          Promise.resolve(interactionService.getEngagementSummary()),
        ]);

      setInsights(insightsData);
      setSkeletonInsights(skeletonData);
      setSystemHealth(healthData);
      setEngagementSummary(engagementData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "behavioral":
        return <Users className="h-4 w-4" />;
      case "technical":
        return <Zap className="h-4 w-4" />;
      case "engagement":
        return <Heart className="h-4 w-4" />;
      case "performance":
        return <Gauge className="h-4 w-4" />;
      case "error":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{insights.length}</div>
          <p className="text-xs text-muted-foreground">
            Generated in {selectedTimeRange}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {engagementSummary?.totalSessions || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Avg duration:{" "}
            {Math.round(
              (engagementSummary?.averageSessionDuration || 0) / 1000,
            )}
            s
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              {systemHealth?.overall === "healthy" ? "✓" : "!"}
            </div>
            <Badge
              variant={
                systemHealth?.overall === "healthy" ? "default" : "destructive"
              }
            >
              {systemHealth?.overall || "Unknown"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {systemHealth?.services.filter((s) => s.status === "healthy")
              .length || 0}{" "}
            of {systemHealth?.services.length || 0} services healthy
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Satisfaction Score
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(engagementSummary?.overallSatisfaction || 0)}%
          </div>
          <Progress
            value={engagementSummary?.overallSatisfaction || 0}
            className="mt-2"
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderInsightsList = () => (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card key={insight.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {getTypeIcon(insight.type)}
                <h3 className="font-semibold">{insight.title}</h3>
                <Badge className={getSeverityColor(insight.severity)}>
                  {insight.severity}
                </Badge>
                <Badge variant="outline">{insight.category}</Badge>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {insight.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-xs">
                <div>
                  <span className="font-medium">UX Impact:</span>{" "}
                  {insight.impact.userExperience}%
                </div>
                <div>
                  <span className="font-medium">Business Value:</span>{" "}
                  {insight.impact.businessValue}%
                </div>
                <div>
                  <span className="font-medium">Complexity:</span>{" "}
                  {insight.impact.technicalComplexity}%
                </div>
              </div>

              {insight.recommendations.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-1">Recommendations:</h4>
                  <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                    {insight.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="text-right text-xs text-gray-500 ml-4">
              <div>{insight.timestamp.toLocaleTimeString()}</div>
              <div>{insight.timestamp.toLocaleDateString()}</div>
            </div>
          </div>
        </Card>
      ))}

      {insights.length === 0 && (
        <Card className="p-8 text-center">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Insights Available</h3>
          <p className="text-gray-600">
            No insights found for the selected time range and filters. Try
            adjusting your filters or check back later.
          </p>
        </Card>
      )}
    </div>
  );

  const renderSkeletonInsights = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skeletonInsights.map((insight) => (
          <Card key={insight.component} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{insight.component}</h3>
              <Badge
                variant={
                  insight.performanceScore > 80 ? "default" : "destructive"
                }
              >
                {Math.round(insight.performanceScore)}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Load Time:</span>
                <span>{insight.loadTime.toFixed(1)}ms</span>
              </div>
              <div className="flex justify-between">
                <span>Render Time:</span>
                <span>{insight.renderTime.toFixed(1)}ms</span>
              </div>
              <div className="flex justify-between">
                <span>Usage:</span>
                <span>{insight.usageFrequency}x</span>
              </div>
              <div className="flex justify-between">
                <span>Errors:</span>
                <span
                  className={
                    insight.errorCount > 0 ? "text-red-600" : "text-green-600"
                  }
                >
                  {insight.errorCount}
                </span>
              </div>
            </div>

            <Progress value={insight.performanceScore} className="mt-3" />
          </Card>
        ))}
      </div>

      {skeletonInsights.length === 0 && (
        <Card className="p-8 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Component Data</h3>
          <p className="text-gray-600">
            Component performance data will appear here as users interact with
            the platform.
          </p>
        </Card>
      )}
    </div>
  );

  const renderSystemHealth = () => (
    <div className="space-y-4">
      {systemHealth && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Overall Status</h3>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    systemHealth.overall === "healthy"
                      ? "default"
                      : "destructive"
                  }
                  className="text-lg px-3 py-1"
                >
                  {systemHealth.overall}
                </Badge>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Performance</h3>
              <div className="space-y-1 text-sm">
                <div>
                  Render: {systemHealth.performance.renderTime.toFixed(1)}ms
                </div>
                <div>
                  Network: {systemHealth.performance.networkLatency.toFixed(1)}
                  ms
                </div>
                <div>
                  Memory: {systemHealth.performance.memoryUsage.toFixed(1)}%
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Features</h3>
              <div className="flex flex-wrap gap-1">
                {Object.entries(systemHealth.features).map(
                  ([feature, supported]) => (
                    <Badge
                      key={feature}
                      variant={supported ? "default" : "outline"}
                      className="text-xs"
                    >
                      {feature}
                    </Badge>
                  ),
                )}
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Service Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {systemHealth.services.map((service) => (
                <div
                  key={service.service}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    {service.status === "healthy" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">{service.service}</span>
                  </div>
                  <div className="text-right text-sm">
                    <div>{service.latency.toFixed(0)}ms</div>
                    {service.error && (
                      <div
                        className="text-red-600 text-xs truncate max-w-24"
                        title={service.error}
                      >
                        {service.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">User Interaction Insights</h1>
          <p className="text-gray-600">
            Real-time analytics and platform skeleton monitoring
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={loadDashboardData}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>

          <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      {renderOverviewCards()}

      {/* Main Content */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="skeleton">Components</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedSeverity}
              onValueChange={setSelectedSeverity}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderInsightsList()}
        </TabsContent>

        <TabsContent value="skeleton">{renderSkeletonInsights()}</TabsContent>

        <TabsContent value="health">{renderSystemHealth()}</TabsContent>

        <TabsContent value="engagement">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Average Session Duration</span>
                    <span>
                      {Math.round(
                        (engagementSummary?.averageSessionDuration || 0) / 1000,
                      )}
                      s
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (engagementSummary?.averageSessionDuration || 0) / 6000,
                    )}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Average Interactions</span>
                    <span>
                      {Math.round(engagementSummary?.averageInteractions || 0)}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (engagementSummary?.averageInteractions || 0) * 5,
                    )}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Satisfaction Score</span>
                    <span>
                      {Math.round(engagementSummary?.overallSatisfaction || 0)}%
                    </span>
                  </div>
                  <Progress
                    value={engagementSummary?.overallSatisfaction || 0}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Insights</h3>
              <div className="space-y-3">
                {(engagementSummary?.topInsights || [])
                  .slice(0, 5)
                  .map((insight: UserInteractionInsight) => (
                    <div
                      key={insight.id}
                      className="flex items-center space-x-3 p-2 bg-gray-50 rounded"
                    >
                      {getTypeIcon(insight.type)}
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {insight.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {insight.category}
                        </div>
                      </div>
                      <Badge className={getSeverityColor(insight.severity)}>
                        {insight.severity}
                      </Badge>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserInteractionInsightsDashboard;
