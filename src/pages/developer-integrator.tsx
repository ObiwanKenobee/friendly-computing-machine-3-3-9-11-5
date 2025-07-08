import React, { useState, useEffect } from "react";
import { useQuantumAuth } from "../hooks/useQuantumAuth";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import {
  Code,
  Terminal,
  Cpu,
  Database,
  Globe,
  Zap,
  Shield,
  Key,
  GitBranch,
  Activity,
  TrendingUp,
  Clock,
  Users,
  Package,
  Download,
  Book,
  Play,
  Settings,
  Monitor,
  Server,
  Webhook,
} from "lucide-react";

const DeveloperIntegratorDashboard = () => {
  const {
    quantumIdentity,
    isAuthenticated,
    getQuantumScore,
    canAccessFeature,
  } = useQuantumAuth();

  const [apiMetrics, setApiMetrics] = useState<any>(null);
  const [sdkData, setSdkData] = useState<any>(null);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && quantumIdentity) {
      loadDashboardData();
    }
  }, [isAuthenticated, quantumIdentity]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load API metrics
      const metrics = await loadApiMetrics();
      setApiMetrics(metrics);

      // Load SDK data
      const sdk = await loadSDKData();
      setSdkData(sdk);

      // Load integrations
      const integrationData = await loadIntegrations();
      setIntegrations(integrationData);

      // Load API keys
      const keys = await loadApiKeys();
      setApiKeys(keys);

      // Load webhooks
      const webhookData = await loadWebhooks();
      setWebhooks(webhookData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadApiMetrics = async () => {
    return {
      totalRequests: 1247892,
      successRate: 99.87,
      avgResponseTime: 145,
      rateLimitUsage: 78,
      dailyStats: generateDailyStats(),
      endpointStats: [
        {
          endpoint: "/api/v1/portfolio",
          requests: 45832,
          avgTime: 120,
          success: 99.9,
        },
        {
          endpoint: "/api/v1/risk-analysis",
          requests: 32145,
          avgTime: 450,
          success: 99.2,
        },
        {
          endpoint: "/api/v1/ai-recommendations",
          requests: 28934,
          avgTime: 890,
          success: 98.8,
        },
        {
          endpoint: "/api/v1/tokenized-assets",
          requests: 18267,
          avgTime: 234,
          success: 99.5,
        },
        {
          endpoint: "/api/v1/cultural-screening",
          requests: 12834,
          avgTime: 167,
          success: 99.3,
        },
      ],
    };
  };

  const loadSDKData = async () => {
    return {
      downloads: {
        total: 15678,
        thisMonth: 1234,
        languages: [
          { name: "JavaScript/TypeScript", downloads: 8234, growth: 15.2 },
          { name: "Python", downloads: 4567, growth: 23.1 },
          { name: "Go", downloads: 1890, growth: 18.7 },
          { name: "Java", downloads: 987, growth: 12.3 },
        ],
      },
      documentation: {
        views: 45632,
        searchQueries: 8934,
        topPages: [
          "Getting Started",
          "API Reference",
          "Authentication",
          "Webhooks",
          "Rate Limits",
        ],
      },
    };
  };

  const loadIntegrations = async () => {
    return [
      {
        id: "1",
        name: "Trading Bot Platform",
        type: "Application",
        status: "Active",
        lastUsed: "2 hours ago",
        requestsToday: 15432,
        errorRate: 0.12,
      },
      {
        id: "2",
        name: "Portfolio Analytics Dashboard",
        type: "Dashboard",
        status: "Active",
        lastUsed: "5 minutes ago",
        requestsToday: 8934,
        errorRate: 0.05,
      },
      {
        id: "3",
        name: "Risk Monitoring Service",
        type: "Service",
        status: "Active",
        lastUsed: "1 hour ago",
        requestsToday: 5647,
        errorRate: 0.08,
      },
      {
        id: "4",
        name: "White-label Robo Advisor",
        type: "Platform",
        status: "Testing",
        lastUsed: "3 hours ago",
        requestsToday: 2134,
        errorRate: 0.23,
      },
    ];
  };

  const loadApiKeys = async () => {
    return [
      {
        id: "1",
        name: "Production Key",
        environment: "production",
        created: "2023-08-15",
        lastUsed: "2024-01-15 14:30:25",
        permissions: ["read", "write"],
        rateLimit: "10000/hour",
        status: "active",
      },
      {
        id: "2",
        name: "Staging Key",
        environment: "staging",
        created: "2023-09-01",
        lastUsed: "2024-01-15 10:15:10",
        permissions: ["read", "write", "admin"],
        rateLimit: "5000/hour",
        status: "active",
      },
      {
        id: "3",
        name: "Development Key",
        environment: "development",
        created: "2023-10-10",
        lastUsed: "2024-01-14 16:45:33",
        permissions: ["read", "write", "admin"],
        rateLimit: "1000/hour",
        status: "active",
      },
    ];
  };

  const loadWebhooks = async () => {
    return [
      {
        id: "1",
        url: "https://api.myapp.com/webhooks/portfolio",
        events: ["portfolio.updated", "risk.alert"],
        status: "active",
        lastDelivery: "2024-01-15 14:28:15",
        successRate: 99.2,
        failures: 3,
      },
      {
        id: "2",
        url: "https://bot.trading.com/webhooks/signals",
        events: ["ai.recommendation", "market.alert"],
        status: "active",
        lastDelivery: "2024-01-15 14:30:02",
        successRate: 98.7,
        failures: 8,
      },
    ];
  };

  const generateDailyStats = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        requests: Math.floor(30000 + Math.random() * 20000),
        errors: Math.floor(Math.random() * 100),
        responseTime: Math.floor(120 + Math.random() * 50),
      });
    }
    return data;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Code className="h-8 w-8 text-cyan-400" />
                Developer Console
              </h1>
              <p className="text-gray-300">
                API management, SDKs, and integration tools for the QuantumVest
                platform
              </p>
            </div>
            <div className="flex gap-4">
              <Badge
                variant="outline"
                className="bg-cyan-900/20 border-cyan-400 text-cyan-300"
              >
                Quantum Score: {getQuantumScore()}/100
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-900/20 border-green-400 text-green-300"
              >
                API Status: Online
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                API Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {apiMetrics?.totalRequests.toLocaleString()}
              </div>
              <div className="text-sm text-green-400">+12.5% this month</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {apiMetrics?.successRate}%
              </div>
              <div className="text-sm text-green-400">Excellent uptime</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Avg Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {apiMetrics?.avgResponseTime}ms
              </div>
              <div className="text-sm text-cyan-400">Fast & reliable</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Download className="h-4 w-4" />
                SDK Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {sdkData?.downloads.total.toLocaleString()}
              </div>
              <div className="text-sm text-blue-400">
                +{sdkData?.downloads.thisMonth} this month
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-slate-700"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="apis"
              className="data-[state=active]:bg-slate-700"
            >
              APIs & Keys
            </TabsTrigger>
            <TabsTrigger
              value="sdks"
              className="data-[state=active]:bg-slate-700"
            >
              SDKs & Tools
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="data-[state=active]:bg-slate-700"
            >
              Integrations
            </TabsTrigger>
            <TabsTrigger
              value="webhooks"
              className="data-[state=active]:bg-slate-700"
            >
              Webhooks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* API Usage Chart */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">API Usage Trends</CardTitle>
                  <CardDescription>
                    Daily request volume over the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={apiMetrics?.dailyStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                        }}
                        labelStyle={{ color: "#F3F4F6" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="requests"
                        stroke="#06B6D4"
                        fill="url(#requestsGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient
                          id="requestsGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#06B6D4"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#06B6D4"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Error Rate Chart */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Response Time & Errors
                  </CardTitle>
                  <CardDescription>
                    Performance metrics overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={apiMetrics?.dailyStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis yAxisId="left" stroke="#9CA3AF" />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#9CA3AF"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                        }}
                        labelStyle={{ color: "#F3F4F6" }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="responseTime"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Response Time (ms)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="errors"
                        stroke="#EF4444"
                        strokeWidth={2}
                        name="Errors"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Endpoint Performance */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Endpoint Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-3 text-slate-300">
                          Endpoint
                        </th>
                        <th className="text-right py-3 text-slate-300">
                          Requests
                        </th>
                        <th className="text-right py-3 text-slate-300">
                          Avg Time
                        </th>
                        <th className="text-right py-3 text-slate-300">
                          Success Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiMetrics?.endpointStats.map(
                        (endpoint: any, index: number) => (
                          <tr
                            key={index}
                            className="border-b border-slate-700/50"
                          >
                            <td className="py-3">
                              <code className="text-cyan-400 bg-slate-900/50 px-2 py-1 rounded text-sm">
                                {endpoint.endpoint}
                              </code>
                            </td>
                            <td className="text-right py-3 text-white font-mono">
                              {endpoint.requests.toLocaleString()}
                            </td>
                            <td className="text-right py-3 text-white font-mono">
                              {endpoint.avgTime}ms
                            </td>
                            <td className="text-right py-3">
                              <span
                                className={`font-mono ${
                                  endpoint.success >= 99.5
                                    ? "text-green-400"
                                    : endpoint.success >= 99
                                      ? "text-yellow-400"
                                      : "text-red-400"
                                }`}
                              >
                                {endpoint.success}%
                              </span>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apis" className="space-y-6">
            {/* API Keys Management */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </CardTitle>
                <CardDescription>
                  Manage your API keys and access permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((key, index) => (
                    <div
                      key={key.id}
                      className="p-4 bg-slate-700/30 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-medium">{key.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                key.environment === "production"
                                  ? "border-red-400 text-red-300"
                                  : key.environment === "staging"
                                    ? "border-yellow-400 text-yellow-300"
                                    : "border-blue-400 text-blue-300"
                              }`}
                            >
                              {key.environment}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs border-green-400 text-green-300"
                            >
                              {key.status}
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400 block">Created</span>
                          <span className="text-white">{key.created}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">
                            Last Used
                          </span>
                          <span className="text-white">{key.lastUsed}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">
                            Rate Limit
                          </span>
                          <span className="text-white">{key.rateLimit}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">
                            Permissions
                          </span>
                          <div className="flex gap-1">
                            {key.permissions.map((perm: string) => (
                              <Badge
                                key={perm}
                                variant="outline"
                                className="text-xs"
                              >
                                {perm}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button className="w-full" variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    Generate New API Key
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rate Limits */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Rate Limit Usage</CardTitle>
                <CardDescription>
                  Current usage across all endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Hourly Limit Usage</span>
                    <span className="text-white font-mono">
                      {apiMetrics?.rateLimitUsage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${apiMetrics?.rateLimitUsage}%` }}
                    />
                  </div>
                  <div className="text-sm text-slate-400">
                    7,834 / 10,000 requests used this hour
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sdks" className="space-y-6">
            {/* SDK Downloads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    SDK Downloads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sdkData?.downloads.languages.map(
                      (lang: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg"
                        >
                          <div>
                            <div className="text-white font-medium">
                              {lang.name}
                            </div>
                            <div className="text-sm text-green-400">
                              +{lang.growth}% growth
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-mono">
                              {lang.downloads.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-400">
                              downloads
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-white">
                          {sdkData?.documentation.views.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-400">Page views</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">
                          {sdkData?.documentation.searchQueries.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-400">Searches</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Top Pages</h4>
                      <div className="space-y-1">
                        {sdkData?.documentation.topPages.map(
                          (page: string, index: number) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-slate-300">{page}</span>
                              <span className="text-cyan-400">View</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Start Guide */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Quick Start Guide
                </CardTitle>
                <CardDescription>
                  Get started with the QuantumVest API in minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <h4 className="text-white font-medium mb-2">
                      1. Install SDK
                    </h4>
                    <code className="text-cyan-400 text-sm bg-black/50 p-2 rounded block">
                      npm install @quantumvest/sdk
                    </code>
                  </div>

                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <h4 className="text-white font-medium mb-2">
                      2. Initialize Client
                    </h4>
                    <code className="text-cyan-400 text-sm bg-black/50 p-2 rounded block">
                      {`import { QuantumVest } from '@quantumvest/sdk';
const client = new QuantumVest({ apiKey: 'your-api-key' });`}
                    </code>
                  </div>

                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <h4 className="text-white font-medium mb-2">
                      3. Make API Call
                    </h4>
                    <code className="text-cyan-400 text-sm bg-black/50 p-2 rounded block">
                      {`const portfolio = await client.portfolio.get();
const recommendations = await client.ai.getRecommendations();`}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((integration, index) => (
                <Card
                  key={integration.id}
                  className="bg-slate-800/50 border-slate-700"
                >
                  <CardHeader>
                    <CardTitle className="text-white">
                      {integration.name}
                    </CardTitle>
                    <CardDescription>
                      <Badge variant="outline">{integration.type}</Badge>
                      <Badge
                        variant="outline"
                        className={`ml-2 ${
                          integration.status === "Active"
                            ? "border-green-400 text-green-300"
                            : "border-yellow-400 text-yellow-300"
                        }`}
                      >
                        {integration.status}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-400 block">
                            Last Used
                          </span>
                          <span className="text-white">
                            {integration.lastUsed}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">
                            Requests Today
                          </span>
                          <span className="text-white font-mono">
                            {integration.requestsToday.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Error Rate</span>
                          <span
                            className={`font-mono ${
                              integration.errorRate < 0.1
                                ? "text-green-400"
                                : integration.errorRate < 0.5
                                  ? "text-yellow-400"
                                  : "text-red-400"
                            }`}
                          >
                            {integration.errorRate}%
                          </span>
                        </div>
                      </div>

                      <Button size="sm" className="w-full" variant="outline">
                        <Monitor className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Webhook Endpoints
                </CardTitle>
                <CardDescription>
                  Configure webhooks to receive real-time notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhooks.map((webhook, index) => (
                    <div
                      key={webhook.id}
                      className="p-4 bg-slate-700/30 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <code className="text-cyan-400 text-sm bg-black/50 px-2 py-1 rounded">
                            {webhook.url}
                          </code>
                          <div className="flex gap-1 mt-2">
                            {webhook.events.map((event: string) => (
                              <Badge
                                key={event}
                                variant="outline"
                                className="text-xs"
                              >
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-green-400 text-green-300"
                        >
                          {webhook.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400 block">
                            Last Delivery
                          </span>
                          <span className="text-white">
                            {webhook.lastDelivery}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">
                            Success Rate
                          </span>
                          <span className="text-green-400 font-mono">
                            {webhook.successRate}%
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Failures</span>
                          <span className="text-red-400 font-mono">
                            {webhook.failures}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button className="w-full" variant="outline">
                    <Webhook className="h-4 w-4 mr-2" />
                    Add New Webhook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeveloperIntegratorDashboard;
