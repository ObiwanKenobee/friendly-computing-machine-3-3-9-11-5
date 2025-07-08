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
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
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
} from "recharts";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  Server,
  Shield,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  Bell,
  Download,
  RefreshCw,
  Settings,
  Eye,
  AlertCircle,
  Info,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
} from "lucide-react";

interface MetricData {
  timestamp: string;
  value: number;
  label?: string;
}

interface SystemHealth {
  status: "healthy" | "warning" | "critical";
  uptime: number;
  lastCheck: string;
  issues: string[];
}

interface PerformanceMetrics {
  responseTime: MetricData[];
  throughput: MetricData[];
  errorRate: MetricData[];
  cpuUsage: MetricData[];
  memoryUsage: MetricData[];
  diskUsage: MetricData[];
}

interface BusinessMetrics {
  activeUsers: number;
  totalTransactions: number;
  revenue: number;
  conversionRate: number;
  userGrowth: MetricData[];
  revenueGrowth: MetricData[];
}

interface SecurityMetrics {
  threats: number;
  vulnerabilities: number;
  securityScore: number;
  recentAlerts: Array<{
    id: string;
    severity: "low" | "medium" | "high" | "critical";
    message: string;
    timestamp: string;
  }>;
}

const MonitoringDashboard: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: "healthy",
    uptime: 99.99,
    lastCheck: new Date().toISOString(),
    issues: [],
  });

  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics>({
      responseTime: [],
      throughput: [],
      errorRate: [],
      cpuUsage: [],
      memoryUsage: [],
      diskUsage: [],
    });

  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics>({
    activeUsers: 15420,
    totalTransactions: 2847,
    revenue: 1250000,
    conversionRate: 3.2,
    userGrowth: [],
    revenueGrowth: [],
  });

  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    threats: 12,
    vulnerabilities: 3,
    securityScore: 96,
    recentAlerts: [],
  });

  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");

  // Generate mock data for demonstration
  useEffect(() => {
    const generateMockData = () => {
      const now = new Date();
      const hours = 24;
      const interval = 60; // minutes

      const responseTime: MetricData[] = [];
      const throughput: MetricData[] = [];
      const errorRate: MetricData[] = [];
      const cpuUsage: MetricData[] = [];
      const memoryUsage: MetricData[] = [];
      const diskUsage: MetricData[] = [];
      const userGrowth: MetricData[] = [];
      const revenueGrowth: MetricData[] = [];

      for (let i = hours * 60; i >= 0; i -= interval) {
        const timestamp = new Date(now.getTime() - i * 60 * 1000);
        const timeStr = timestamp.toISOString();

        responseTime.push({
          timestamp: timeStr,
          value: 120 + Math.random() * 80 + Math.sin(i / 100) * 20,
        });

        throughput.push({
          timestamp: timeStr,
          value: 850 + Math.random() * 200 + Math.cos(i / 80) * 100,
        });

        errorRate.push({
          timestamp: timeStr,
          value: Math.random() * 2.5,
        });

        cpuUsage.push({
          timestamp: timeStr,
          value: 45 + Math.random() * 30 + Math.sin(i / 150) * 15,
        });

        memoryUsage.push({
          timestamp: timeStr,
          value: 65 + Math.random() * 20 + Math.cos(i / 120) * 10,
        });

        diskUsage.push({
          timestamp: timeStr,
          value: 72 + Math.random() * 5,
        });

        if (i % (6 * 60) === 0) {
          // Every 6 hours
          userGrowth.push({
            timestamp: timeStr,
            value: 15000 + Math.random() * 1000 + (hours * 60 - i) * 0.5,
          });

          revenueGrowth.push({
            timestamp: timeStr,
            value: 1200000 + Math.random() * 100000 + (hours * 60 - i) * 10,
          });
        }
      }

      setPerformanceMetrics({
        responseTime,
        throughput,
        errorRate,
        cpuUsage,
        memoryUsage,
        diskUsage,
      });

      setBusinessMetrics((prev) => ({
        ...prev,
        userGrowth,
        revenueGrowth,
      }));

      // Generate security alerts
      const alerts = [
        {
          id: "1",
          severity: "medium" as const,
          message: "Unusual login pattern detected from IP 192.168.1.100",
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          severity: "low" as const,
          message: "SSL certificate expires in 30 days",
          timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          severity: "high" as const,
          message: "Failed login attempts exceeded threshold",
          timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setSecurityMetrics((prev) => ({
        ...prev,
        recentAlerts: alerts,
      }));
    };

    generateMockData();

    // Auto-refresh every 30 seconds
    if (autoRefresh) {
      const interval = setInterval(generateMockData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedTimeRange]);

  const formatMetric = (
    value: number,
    type: "time" | "bytes" | "percentage" | "currency" | "number",
  ) => {
    switch (type) {
      case "time":
        return `${value.toFixed(0)}ms`;
      case "bytes":
        if (value > 1024 * 1024 * 1024)
          return `${(value / (1024 * 1024 * 1024)).toFixed(1)}GB`;
        if (value > 1024 * 1024)
          return `${(value / (1024 * 1024)).toFixed(1)}MB`;
        if (value > 1024) return `${(value / 1024).toFixed(1)}KB`;
        return `${value.toFixed(0)}B`;
      case "percentage":
        return `${value.toFixed(1)}%`;
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      case "number":
        return new Intl.NumberFormat("en-US").format(Math.round(value));
      default:
        return value.toString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "critical":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "border-blue-200 bg-blue-50 text-blue-800";
      case "medium":
        return "border-yellow-200 bg-yellow-50 text-yellow-800";
      case "high":
        return "border-orange-200 bg-orange-50 text-orange-800";
      case "critical":
        return "border-red-200 bg-red-50 text-red-800";
      default:
        return "border-gray-200 bg-gray-50 text-gray-800";
    }
  };

  const currentResponseTime = useMemo(() => {
    return performanceMetrics.responseTime.length > 0
      ? performanceMetrics.responseTime[
          performanceMetrics.responseTime.length - 1
        ].value
      : 0;
  }, [performanceMetrics.responseTime]);

  const currentThroughput = useMemo(() => {
    return performanceMetrics.throughput.length > 0
      ? performanceMetrics.throughput[performanceMetrics.throughput.length - 1]
          .value
      : 0;
  }, [performanceMetrics.throughput]);

  const currentErrorRate = useMemo(() => {
    return performanceMetrics.errorRate.length > 0
      ? performanceMetrics.errorRate[performanceMetrics.errorRate.length - 1]
          .value
      : 0;
  }, [performanceMetrics.errorRate]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              System Monitoring Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time insights into QuantumVest Enterprise Platform
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(systemHealth.status)}>
                {systemHealth.status === "healthy" && (
                  <CheckCircle className="h-3 w-3 mr-1" />
                )}
                {systemHealth.status === "warning" && (
                  <AlertTriangle className="h-3 w-3 mr-1" />
                )}
                {systemHealth.status === "critical" && (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                {systemHealth.status.toUpperCase()}
              </Badge>
              <span className="text-sm text-gray-600">
                Last updated:{" "}
                {new Date(systemHealth.lastCheck).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
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

              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Status
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                Operational
              </div>
              <p className="text-xs text-muted-foreground">
                {formatMetric(systemHealth.uptime, "percentage")} uptime
              </p>
              <Progress value={systemHealth.uptime} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Response Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatMetric(currentResponseTime, "time")}
              </div>
              <p className="text-xs text-muted-foreground">
                Average response time
              </p>
              <div className="flex items-center mt-2">
                {currentResponseTime < 200 ? (
                  <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span
                  className={`text-xs ${currentResponseTime < 200 ? "text-green-600" : "text-red-600"}`}
                >
                  {currentResponseTime < 200 ? "Excellent" : "Needs attention"}
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
                {formatMetric(businessMetrics.activeUsers, "number")}
              </div>
              <p className="text-xs text-muted-foreground">Currently online</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">
                  +12% from yesterday
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Security Score
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {securityMetrics.securityScore}/100
              </div>
              <p className="text-xs text-muted-foreground">Security posture</p>
              <Progress
                value={securityMetrics.securityScore}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="business">Business Metrics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Time</CardTitle>
                  <CardDescription>
                    Average response time over the last 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceMetrics.responseTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleTimeString()
                        }
                      />
                      <YAxis tickFormatter={(value) => `${value}ms`} />
                      <Tooltip
                        labelFormatter={(value) =>
                          new Date(value).toLocaleString()
                        }
                        formatter={(value: number) => [
                          `${value.toFixed(0)}ms`,
                          "Response Time",
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

              <Card>
                <CardHeader>
                  <CardTitle>Throughput</CardTitle>
                  <CardDescription>Requests per minute</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceMetrics.throughput}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleTimeString()
                        }
                      />
                      <YAxis tickFormatter={(value) => `${value}/min`} />
                      <Tooltip
                        labelFormatter={(value) =>
                          new Date(value).toLocaleString()
                        }
                        formatter={(value: number) => [
                          `${value.toFixed(0)}/min`,
                          "Throughput",
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

              <Card>
                <CardHeader>
                  <CardTitle>Error Rate</CardTitle>
                  <CardDescription>
                    Percentage of failed requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceMetrics.errorRate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleTimeString()
                        }
                      />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip
                        labelFormatter={(value) =>
                          new Date(value).toLocaleString()
                        }
                        formatter={(value: number) => [
                          `${value.toFixed(2)}%`,
                          "Error Rate",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Current performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Average Response Time
                    </span>
                    <span className="text-sm">
                      {formatMetric(currentResponseTime, "time")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Throughput</span>
                    <span className="text-sm">
                      {formatMetric(currentThroughput, "number")}/min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Error Rate</span>
                    <span className="text-sm">
                      {formatMetric(currentErrorRate, "percentage")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Apdex Score</span>
                    <span className="text-sm text-green-600">0.97</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Infrastructure Tab */}
          <TabsContent value="infrastructure" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    CPU Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={performanceMetrics.cpuUsage.slice(-20)}>
                      <XAxis dataKey="timestamp" hide />
                      <YAxis hide />
                      <Tooltip
                        formatter={(value: number) => [
                          `${value.toFixed(1)}%`,
                          "CPU",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <div className="text-2xl font-bold">
                      {formatMetric(
                        performanceMetrics.cpuUsage.length > 0
                          ? performanceMetrics.cpuUsage[
                              performanceMetrics.cpuUsage.length - 1
                            ].value
                          : 0,
                        "percentage",
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Current CPU usage
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MemoryStick className="h-5 w-5" />
                    Memory Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={performanceMetrics.memoryUsage.slice(-20)}>
                      <XAxis dataKey="timestamp" hide />
                      <YAxis hide />
                      <Tooltip
                        formatter={(value: number) => [
                          `${value.toFixed(1)}%`,
                          "Memory",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <div className="text-2xl font-bold">
                      {formatMetric(
                        performanceMetrics.memoryUsage.length > 0
                          ? performanceMetrics.memoryUsage[
                              performanceMetrics.memoryUsage.length - 1
                            ].value
                          : 0,
                        "percentage",
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Current memory usage
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Disk Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={performanceMetrics.diskUsage.slice(-20)}>
                      <XAxis dataKey="timestamp" hide />
                      <YAxis hide />
                      <Tooltip
                        formatter={(value: number) => [
                          `${value.toFixed(1)}%`,
                          "Disk",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <div className="text-2xl font-bold">
                      {formatMetric(
                        performanceMetrics.diskUsage.length > 0
                          ? performanceMetrics.diskUsage[
                              performanceMetrics.diskUsage.length - 1
                            ].value
                          : 0,
                        "percentage",
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Current disk usage
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Infrastructure Services Status */}
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Services</CardTitle>
                <CardDescription>
                  Status of critical infrastructure components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: "Load Balancer", status: "healthy", icon: Network },
                    { name: "Database", status: "healthy", icon: Database },
                    { name: "Redis Cache", status: "healthy", icon: Zap },
                    { name: "CDN", status: "healthy", icon: Globe },
                    { name: "API Gateway", status: "warning", icon: Server },
                    {
                      name: "Message Queue",
                      status: "healthy",
                      icon: Activity,
                    },
                    {
                      name: "File Storage",
                      status: "healthy",
                      icon: HardDrive,
                    },
                    { name: "Monitoring", status: "healthy", icon: Eye },
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <service.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {service.name}
                        </span>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Metrics Tab */}
          <TabsContent value="business" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Active users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={businessMetrics.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                      />
                      <YAxis
                        tickFormatter={(value) =>
                          `${Math.round(value / 1000)}K`
                        }
                      />
                      <Tooltip
                        labelFormatter={(value) =>
                          new Date(value).toLocaleString()
                        }
                        formatter={(value: number) => [
                          formatMetric(value, "number"),
                          "Users",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Growth</CardTitle>
                  <CardDescription>Revenue trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={businessMetrics.revenueGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                      />
                      <YAxis
                        tickFormatter={(value) =>
                          `$${Math.round(value / 1000)}K`
                        }
                      />
                      <Tooltip
                        labelFormatter={(value) =>
                          new Date(value).toLocaleString()
                        }
                        formatter={(value: number) => [
                          formatMetric(value, "currency"),
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
            </div>

            {/* Business KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatMetric(businessMetrics.revenue, "currency")}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Revenue
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {formatMetric(
                        businessMetrics.totalTransactions,
                        "number",
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Transactions
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {formatMetric(
                        businessMetrics.conversionRate,
                        "percentage",
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Conversion Rate
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {formatMetric(businessMetrics.activeUsers, "number")}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Active Users
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {securityMetrics.securityScore}/100
                  </div>
                  <Progress
                    value={securityMetrics.securityScore}
                    className="mb-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    Excellent security posture
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Threats Blocked
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    {securityMetrics.threats}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    In the last 24 hours
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Vulnerabilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">
                    {securityMetrics.vulnerabilities}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Requiring attention
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Security Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Alerts</CardTitle>
                <CardDescription>
                  Latest security events and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityMetrics.recentAlerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      className={getSeverityColor(alert.severity)}
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-start">
                          <div>
                            <strong>{alert.severity.toUpperCase()}:</strong>{" "}
                            {alert.message}
                          </div>
                          <span className="text-xs">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alert Management
                </CardTitle>
                <CardDescription>
                  Configure and manage system alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      All systems are currently operational. No active alerts.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Alert Channels</h4>
                      <div className="space-y-2">
                        {[
                          { name: "Email Notifications", enabled: true },
                          { name: "Slack Integration", enabled: true },
                          { name: "SMS Alerts", enabled: false },
                          { name: "Webhook Notifications", enabled: true },
                        ].map((channel, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 border rounded"
                          >
                            <span className="text-sm">{channel.name}</span>
                            <Badge
                              variant={
                                channel.enabled ? "default" : "secondary"
                              }
                            >
                              {channel.enabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Alert Thresholds</h4>
                      <div className="space-y-2">
                        {[
                          {
                            metric: "Response Time",
                            threshold: "> 500ms",
                            severity: "Warning",
                          },
                          {
                            metric: "Error Rate",
                            threshold: "> 5%",
                            severity: "Critical",
                          },
                          {
                            metric: "CPU Usage",
                            threshold: "> 80%",
                            severity: "Warning",
                          },
                          {
                            metric: "Memory Usage",
                            threshold: "> 90%",
                            severity: "Critical",
                          },
                        ].map((threshold, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 border rounded text-sm"
                          >
                            <span>{threshold.metric}</span>
                            <span>{threshold.threshold}</span>
                            <Badge
                              variant={
                                threshold.severity === "Critical"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {threshold.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
