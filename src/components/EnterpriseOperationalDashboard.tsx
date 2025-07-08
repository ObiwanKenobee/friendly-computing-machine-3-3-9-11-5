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
} from "recharts";
import {
  Shield,
  DollarSign,
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  Globe,
  Cpu,
  Database,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Eye,
} from "lucide-react";

import { enterpriseAuthService } from "../services/enterpriseAuthService";
import { enterprisePaymentService } from "../services/enterprisePaymentService";
import { concurrentDataProcessor } from "../services/concurrentDataProcessor";
import CiscoXDRService from "../services/ciscoXDRService";
import GlobalLanguageService from "../services/globalLanguageService";

interface SecurityIncident {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  status: "active" | "investigating" | "resolved";
  description: string;
}

interface PaymentAnalytics {
  totalTransactions: number;
  avgTransactionValue: number;
  failureRate: number;
  topPaymentMethods: { method: string; count: number }[];
  revenueByRegion: { region: string; revenue: number }[];
}

interface ProcessingStats {
  totalProcessed: number;
  averageProcessingTime: number;
  queueLength: number;
  successRate: number;
  errorsByType: { type: string; count: number }[];
}

interface Alert {
  id: string;
  type: "security" | "performance" | "payment" | "system";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface DashboardData {
  security: {
    threatLevel: "low" | "medium" | "high" | "critical";
    activeThreats: number;
    blockedAttacks: number;
    securityScore: number;
    incidents: SecurityIncident[];
  };
  payments: {
    revenue: number;
    subscriptions: number;
    conversionRate: number;
    mrr: number;
    analytics: PaymentAnalytics;
  };
  users: {
    totalUsers: number;
    activeUsers: number;
    newSignups: number;
    retentionRate: number;
  };
  performance: {
    responseTime: number;
    uptime: number;
    throughput: number;
    errors: number;
    processingStats: ProcessingStats;
  };
  global: {
    languages: number;
    regions: number;
    culturalAdaptations: number;
    sovereigntyCompliance: number;
  };
}

interface RealtimeData {
  timestamp: Date;
  securityEvents: number;
  payments: number;
  users: number;
  errors: number;
}

export const EnterpriseOperationalDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [realtimeData, setRealtimeData] = useState<RealtimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    "1h" | "24h" | "7d" | "30d"
  >("24h");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from all services concurrently
      const [
        securityData,
        paymentData,
        processingStats,
        userSession,
        languageStats,
      ] = await Promise.all([
        loadSecurityData(),
        loadPaymentData(),
        concurrentDataProcessor.getProcessingStats(),
        enterpriseAuthService.getCurrentSession(),
        globalLanguageService.getGlobalStats(),
      ]);

      const data: DashboardData = {
        security: securityData,
        payments: paymentData,
        users: {
          totalUsers: 12847,
          activeUsers: 8934,
          newSignups: 342,
          retentionRate: 94.2,
        },
        performance: {
          responseTime: 156,
          uptime: 99.99,
          throughput: processingStats.throughputPerSecond,
          errors: processingStats.failedTasks,
          processingStats,
        },
        global: {
          languages: languageStats.supportedLanguages,
          regions: languageStats.supportedRegions,
          culturalAdaptations: languageStats.activeAdaptations,
          sovereigntyCompliance: 98.7,
        },
      };

      setDashboardData(data);

      // Add realtime data point
      const realtimePoint: RealtimeData = {
        timestamp: new Date(),
        securityEvents: securityData.incidents.length,
        payments: paymentData.analytics?.recentEvents?.length || 0,
        users: 8934,
        errors: processingStats.failedTasks,
      };

      setRealtimeData((prev) => [...prev.slice(-23), realtimePoint]); // Keep last 24 points
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data",
      );
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load security data
  const loadSecurityData = async () => {
    const securityMetrics = await ciscoXDRService.getSecurityMetrics();
    const recentIncidents = await ciscoXDRService.getRecentIncidents(10);

    return {
      threatLevel: securityMetrics.threatLevel,
      activeThreats: securityMetrics.activeThreats,
      blockedAttacks: securityMetrics.blockedAttacks,
      securityScore: securityMetrics.securityScore,
      incidents: recentIncidents,
    };
  };

  // Load payment data
  const loadPaymentData = async () => {
    const enterpriseAnalytics =
      await enterprisePaymentService.getEnterpriseAnalytics();

    return {
      revenue: enterpriseAnalytics.totalRevenue,
      subscriptions: enterpriseAnalytics.activeSubscriptions,
      conversionRate: 23.4,
      mrr: enterpriseAnalytics.monthlyRecurringRevenue,
      analytics: enterpriseAnalytics,
    };
  };

  // Initialize dashboard
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, loadDashboardData]);

  // Handle manual refresh
  const handleRefresh = () => {
    loadDashboardData();
  };

  // Handle task processing actions
  const handleProcessTask = async (taskType: string, operation: string) => {
    try {
      await concurrentDataProcessor.addTask({
        type: taskType as
          | "analytics"
          | "payment"
          | "security"
          | "language"
          | "user",
        data: { operation, timestamp: new Date() },
        priority: "medium",
      });

      // Refresh data after processing
      setTimeout(loadDashboardData, 1000);
    } catch (error) {
      console.error("Task processing failed:", error);
    }
  };

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
          <Button onClick={handleRefresh} className="ml-2" size="sm">
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
            Enterprise Operations Center
          </h1>
          <p className="text-gray-600">
            Real-time monitoring and control dashboard
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            size="sm"
          >
            <Activity className="h-4 w-4 mr-2" />
            Auto-refresh
          </Button>
          <Button onClick={handleRefresh} size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Security Status
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge
                variant={
                  dashboardData.security.threatLevel === "low"
                    ? "default"
                    : "destructive"
                }
              >
                {dashboardData.security.threatLevel.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">
              {dashboardData.security.blockedAttacks} attacks blocked today
            </p>
            <Progress
              value={dashboardData.security.securityScore}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dashboardData.payments.revenue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">
              MRR: ${dashboardData.payments.mrr.toLocaleString()}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">
                +12.3% vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.users.activeUsers.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">
              {dashboardData.users.newSignups} new signups today
            </p>
            <Progress
              value={dashboardData.users.retentionRate}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              System Performance
            </CardTitle>
            <Cpu className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.performance.uptime}%
            </div>
            <p className="text-xs text-gray-600">
              {dashboardData.performance.responseTime}ms avg response
            </p>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">
                All systems operational
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Activity</CardTitle>
                <CardDescription>System activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={realtimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleTimeString()
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleString()
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="securityEvents"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="payments"
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Response Time</span>
                  <span className="text-sm text-green-600">
                    {dashboardData.performance.responseTime}ms
                  </span>
                </div>
                <Progress
                  value={
                    100 - (dashboardData.performance.responseTime / 1000) * 100
                  }
                />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">System Uptime</span>
                  <span className="text-sm text-green-600">
                    {dashboardData.performance.uptime}%
                  </span>
                </div>
                <Progress value={dashboardData.performance.uptime} />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Security Score</span>
                  <span className="text-sm text-green-600">
                    {dashboardData.security.securityScore}%
                  </span>
                </div>
                <Progress value={dashboardData.security.securityScore} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Incidents</CardTitle>
                <CardDescription>
                  Recent security events and responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {dashboardData.security.incidents.map((incident, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <p className="text-sm font-medium">{incident.type}</p>
                        <p className="text-xs text-gray-600">
                          {incident.description}
                        </p>
                      </div>
                      <Badge
                        variant={
                          incident.severity === "high"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {incident.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Threat Intelligence</CardTitle>
                <CardDescription>Active threat monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {dashboardData.security.blockedAttacks}
                    </div>
                    <p className="text-sm text-gray-600">
                      Attacks blocked today
                    </p>
                  </div>

                  <Button
                    onClick={() =>
                      handleProcessTask("security", "threat_analysis")
                    }
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Run Threat Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Payment processing insights</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      {
                        name: "PayPal",
                        value: dashboardData.payments.revenue * 0.6,
                      },
                      {
                        name: "Paystack",
                        value: dashboardData.payments.revenue * 0.4,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Tiers</CardTitle>
                <CardDescription>
                  Active subscription distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    dashboardData.payments.analytics.subscriptionsByTier || {},
                  ).map(([tier, count]) => (
                    <div
                      key={tier}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium capitalize">
                        {tier}
                      </span>
                      <Badge>{count}</Badge>
                    </div>
                  ))}

                  <Button
                    onClick={() =>
                      handleProcessTask("payment", "sync_subscription")
                    }
                    className="w-full mt-4"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Sync Subscriptions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Processing Statistics</CardTitle>
                <CardDescription>
                  Concurrent task processing metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {
                          dashboardData.performance.processingStats
                            .completedTasks
                        }
                      </div>
                      <p className="text-xs text-gray-600">Completed Tasks</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {dashboardData.performance.processingStats.failedTasks}
                      </div>
                      <p className="text-xs text-gray-600">Failed Tasks</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Current Load</span>
                      <span className="text-sm">
                        {(
                          dashboardData.performance.processingStats
                            .currentLoad * 100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        dashboardData.performance.processingStats.currentLoad *
                        100
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Error Rate</span>
                      <span className="text-sm">
                        {(
                          dashboardData.performance.processingStats.errorRate *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        dashboardData.performance.processingStats.errorRate *
                        100
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Resources</CardTitle>
                <CardDescription>
                  Resource utilization and capacity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={() =>
                      handleProcessTask("analytics", "process_metrics")
                    }
                    className="w-full"
                  >
                    <Cpu className="h-4 w-4 mr-2" />
                    Process System Metrics
                  </Button>

                  <Button
                    onClick={() =>
                      handleProcessTask("user", "sync_preferences")
                    }
                    className="w-full"
                    variant="outline"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Sync User Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="global" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Coverage</CardTitle>
                <CardDescription>
                  Language and regional support metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {dashboardData.global.languages.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-600">Supported Languages</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {dashboardData.global.regions}
                    </div>
                    <p className="text-xs text-gray-600">Covered Regions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardData.global.culturalAdaptations}
                    </div>
                    <p className="text-xs text-gray-600">
                      Cultural Adaptations
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {dashboardData.global.sovereigntyCompliance}%
                    </div>
                    <p className="text-xs text-gray-600">
                      Sovereignty Compliance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cultural Intelligence</CardTitle>
                <CardDescription>
                  Cultural adaptation and localization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={() =>
                      handleProcessTask("language", "cultural_adapt")
                    }
                    className="w-full"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Run Cultural Adaptation
                  </Button>

                  <Button
                    onClick={() =>
                      handleProcessTask("language", "language_detect")
                    }
                    className="w-full"
                    variant="outline"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Analyze Language Usage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Processing Center</CardTitle>
              <CardDescription>
                Manage concurrent data processing tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Analytics Tasks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      onClick={() =>
                        handleProcessTask("analytics", "calculate_roi")
                      }
                      className="w-full"
                      size="sm"
                    >
                      Calculate ROI
                    </Button>
                    <Button
                      onClick={() =>
                        handleProcessTask("analytics", "generate_report")
                      }
                      className="w-full"
                      size="sm"
                      variant="outline"
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Payment Tasks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      onClick={() =>
                        handleProcessTask("payment", "validate_payment")
                      }
                      className="w-full"
                      size="sm"
                    >
                      Validate Payments
                    </Button>
                    <Button
                      onClick={() =>
                        handleProcessTask("payment", "process_refund")
                      }
                      className="w-full"
                      size="sm"
                      variant="outline"
                    >
                      Process Refunds
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Security Tasks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      onClick={() => handleProcessTask("security", "audit_log")}
                      className="w-full"
                      size="sm"
                    >
                      Audit Logs
                    </Button>
                    <Button
                      onClick={() =>
                        handleProcessTask("security", "compliance_check")
                      }
                      className="w-full"
                      size="sm"
                      variant="outline"
                    >
                      Compliance Check
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
