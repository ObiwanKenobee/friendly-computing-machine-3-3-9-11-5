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
import { edgeComputingService } from "../services/edgeComputingService";
import { offlineSyncService } from "../services/offlineSyncService";
import { pushNotificationService } from "../services/pushNotificationService";
import { mobileDeviceManagementService } from "../services/mobileDeviceManagementService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
  Smartphone,
  Wifi,
  WifiOff,
  Bell,
  Shield,
  Globe,
  Activity,
  Users,
  Database,
  Cloud,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
} from "lucide-react";

interface MobileStats {
  totalDevices: number;
  activeDevices: number;
  offlineDevices: number;
  syncPending: number;
  notificationsSent: number;
  edgeNodes: number;
  dataTransferred: number;
  batteryOptimization: number;
}

export default function MobileManagementDashboard() {
  const [stats, setStats] = useState<MobileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadMobileData();
  }, []);

  const loadMobileData = async () => {
    setLoading(true);
    try {
      // Simulate loading mobile management data
      const mobileStats: MobileStats = {
        totalDevices: 45782,
        activeDevices: 38924,
        offlineDevices: 6858,
        syncPending: 1247,
        notificationsSent: 89324,
        edgeNodes: 128,
        dataTransferred: 2.8, // TB
        batteryOptimization: 87,
      };

      setStats(mobileStats);
    } catch (error) {
      console.error("Failed to load mobile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading mobile management data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mobile & Edge Computing
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive mobile device management with edge computing
            infrastructure, offline synchronization, and push notification
            systems.
          </p>
        </div>

        {/* Mobile Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Devices
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.totalDevices.toLocaleString()}
                  </p>
                </div>
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">
                  {stats.activeDevices.toLocaleString()} active
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Edge Nodes
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.edgeNodes}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <Badge className="bg-green-100 text-green-800">
                  All Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Sync Pending
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.syncPending.toLocaleString()}
                  </p>
                </div>
                <Database className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-2">
                <Progress
                  value={(stats.syncPending / stats.totalDevices) * 100}
                  className="w-full h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Battery Optimization
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.batteryOptimization}%
                  </p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-2">
                <Badge className="bg-green-100 text-green-800">Optimal</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="devices">Device Management</TabsTrigger>
            <TabsTrigger value="edge">Edge Computing</TabsTrigger>
            <TabsTrigger value="sync">Offline Sync</TabsTrigger>
            <TabsTrigger value="notifications">Push Notifications</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Online",
                            value: stats.activeDevices,
                            fill: "#10B981",
                          },
                          {
                            name: "Offline",
                            value: stats.offlineDevices,
                            fill: "#EF4444",
                          },
                          {
                            name: "Syncing",
                            value: stats.syncPending,
                            fill: "#F59E0B",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(1)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      ></Pie>
                      <Tooltip
                        formatter={(value: any) => [
                          value.toLocaleString(),
                          "Devices",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Data Transfer Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Transfer Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={[
                        {
                          hour: "00:00",
                          upload: 120,
                          download: 480,
                          edge: 150,
                        },
                        { hour: "04:00", upload: 80, download: 320, edge: 95 },
                        {
                          hour: "08:00",
                          upload: 280,
                          download: 920,
                          edge: 340,
                        },
                        {
                          hour: "12:00",
                          upload: 350,
                          download: 1100,
                          edge: 420,
                        },
                        {
                          hour: "16:00",
                          upload: 420,
                          download: 1350,
                          edge: 510,
                        },
                        {
                          hour: "20:00",
                          upload: 310,
                          download: 980,
                          edge: 380,
                        },
                        {
                          hour: "24:00",
                          upload: 150,
                          download: 580,
                          edge: 185,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="download"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                      />
                      <Area
                        type="monotone"
                        dataKey="upload"
                        stackId="1"
                        stroke="#10B981"
                        fill="#10B981"
                      />
                      <Area
                        type="monotone"
                        dataKey="edge"
                        stackId="1"
                        stroke="#F59E0B"
                        fill="#F59E0B"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* System Health Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Edge Network Status:</strong> All 128 edge nodes
                      operational with 99.8% uptime
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Sync Queue:</strong> 1,247 devices pending
                      synchronization - within normal range
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Battery Optimization:</strong> 87% of devices
                      running optimized battery profiles
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Device Management */}
          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: "Android",
                        count: 28450,
                        percentage: 62.1,
                        color: "bg-green-500",
                      },
                      {
                        type: "iOS",
                        count: 15230,
                        percentage: 33.3,
                        color: "bg-blue-500",
                      },
                      {
                        type: "Progressive Web App",
                        count: 2102,
                        percentage: 4.6,
                        color: "bg-purple-500",
                      },
                    ].map((device, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${device.color}`}
                          ></div>
                          <span className="font-medium">{device.type}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {device.count.toLocaleString()}
                          </span>
                          <div className="w-24">
                            <Progress
                              value={device.percentage}
                              className="h-2"
                            />
                          </div>
                          <span className="text-sm font-medium w-12">
                            {device.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* App Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>App Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>App Load Time</span>
                      <span className="font-medium">1.2s avg</span>
                    </div>
                    <Progress value={85} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span>Crash Rate</span>
                      <span className="font-medium text-green-600">0.08%</span>
                    </div>
                    <Progress value={99.2} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span>User Retention (7-day)</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span>Battery Efficiency</span>
                      <span className="font-medium">
                        {stats.batteryOptimization}%
                      </span>
                    </div>
                    <Progress
                      value={stats.batteryOptimization}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Device Management Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Device Management Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col space-y-2"
                  >
                    <Shield className="h-6 w-6" />
                    <span>Security Policies</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col space-y-2"
                  >
                    <Download className="h-6 w-6" />
                    <span>App Distribution</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col space-y-2"
                  >
                    <Activity className="h-6 w-6" />
                    <span>Performance Monitoring</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Edge Computing */}
          <TabsContent value="edge" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Edge Node Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Edge Node Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        {
                          region: "North America",
                          nodes: 42,
                          load: 67,
                          latency: 15,
                        },
                        { region: "Europe", nodes: 38, load: 72, latency: 18 },
                        {
                          region: "Asia Pacific",
                          nodes: 28,
                          load: 81,
                          latency: 22,
                        },
                        { region: "Africa", nodes: 20, load: 59, latency: 28 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="nodes"
                        fill="#3B82F6"
                        name="Node Count"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="load"
                        fill="#10B981"
                        name="Load %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Edge Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Edge Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Latency</span>
                      <span className="font-medium">21ms</span>
                    </div>
                    <Progress value={85} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span>Cache Hit Rate</span>
                      <span className="font-medium text-green-600">94%</span>
                    </div>
                    <Progress value={94} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span>Data Reduction</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <Progress value={67} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span>Node Availability</span>
                      <span className="font-medium">99.8%</span>
                    </div>
                    <Progress value={99.8} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Edge Computing Features */}
            <Card>
              <CardHeader>
                <CardTitle>Edge Computing Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Cloud className="h-5 w-5 mr-2 text-blue-600" />
                      Content Delivery
                    </h4>
                    <p className="text-sm text-gray-600">
                      Global edge network delivering investment data with
                      ultra-low latency
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Database className="h-5 w-5 mr-2 text-green-600" />
                      Edge Analytics
                    </h4>
                    <p className="text-sm text-gray-600">
                      Real-time data processing and analytics at the network
                      edge
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-purple-600" />
                      Edge Security
                    </h4>
                    <p className="text-sm text-gray-600">
                      Distributed security processing and threat detection
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offline Sync */}
          <TabsContent value="sync" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sync Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Synchronization Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        status: "Synced",
                        count: 37240,
                        color: "text-green-600",
                        icon: <CheckCircle className="h-4 w-4" />,
                      },
                      {
                        status: "Pending",
                        count: 1247,
                        color: "text-yellow-600",
                        icon: <Clock className="h-4 w-4" />,
                      },
                      {
                        status: "Failed",
                        count: 87,
                        color: "text-red-600",
                        icon: <AlertTriangle className="h-4 w-4" />,
                      },
                      {
                        status: "Offline",
                        count: 6858,
                        color: "text-gray-600",
                        icon: <WifiOff className="h-4 w-4" />,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={item.color}>{item.icon}</div>
                          <span className="font-medium">{item.status}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {item.count.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">devices</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sync Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Sync Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={[
                        { time: "00:00", success: 95, failed: 2, pending: 3 },
                        { time: "04:00", success: 97, failed: 1, pending: 2 },
                        { time: "08:00", success: 92, failed: 3, pending: 5 },
                        { time: "12:00", success: 89, failed: 4, pending: 7 },
                        { time: "16:00", success: 94, failed: 2, pending: 4 },
                        { time: "20:00", success: 96, failed: 1, pending: 3 },
                        { time: "24:00", success: 95, failed: 2, pending: 3 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="success"
                        stroke="#10B981"
                        name="Success %"
                      />
                      <Line
                        type="monotone"
                        dataKey="failed"
                        stroke="#EF4444"
                        name="Failed %"
                      />
                      <Line
                        type="monotone"
                        dataKey="pending"
                        stroke="#F59E0B"
                        name="Pending %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Offline Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle>Offline Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-medium mb-2">Portfolio Viewing</h4>
                    <p className="text-sm text-gray-600">
                      View portfolio data and performance metrics offline
                    </p>
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      Available
                    </Badge>
                  </div>

                  <div className="p-4 border rounded-lg bg-green-50">
                    <h4 className="font-medium mb-2">Investment Research</h4>
                    <p className="text-sm text-gray-600">
                      Access cached research and analysis data
                    </p>
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      Available
                    </Badge>
                  </div>

                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <h4 className="font-medium mb-2">Order Placement</h4>
                    <p className="text-sm text-gray-600">
                      Queue orders for execution when online
                    </p>
                    <Badge className="mt-2 bg-yellow-100 text-yellow-800">
                      Queue Mode
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Push Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notification Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Sent Today</span>
                      <span className="font-bold text-blue-600">
                        {stats.notificationsSent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Delivery Rate</span>
                      <span className="font-medium text-green-600">94.7%</span>
                    </div>
                    <Progress value={94.7} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span>Open Rate</span>
                      <span className="font-medium">23.4%</span>
                    </div>
                    <Progress value={23.4} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span>Conversion Rate</span>
                      <span className="font-medium">5.8%</span>
                    </div>
                    <Progress value={5.8} className="w-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Price Alerts", value: 35, fill: "#3B82F6" },
                          { name: "Market News", value: 28, fill: "#10B981" },
                          {
                            name: "Portfolio Updates",
                            value: 22,
                            fill: "#F59E0B",
                          },
                          {
                            name: "Security Alerts",
                            value: 10,
                            fill: "#EF4444",
                          },
                          { name: "System Updates", value: 5, fill: "#8B5CF6" },
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
                      ></Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Notification Management */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col space-y-2"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="text-sm">Send Campaign</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col space-y-2"
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-sm">Audience Segments</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col space-y-2"
                  >
                    <Activity className="h-5 w-5" />
                    <span className="text-sm">Analytics</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col space-y-2"
                  >
                    <Shield className="h-5 w-5" />
                    <span className="text-sm">Compliance</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
