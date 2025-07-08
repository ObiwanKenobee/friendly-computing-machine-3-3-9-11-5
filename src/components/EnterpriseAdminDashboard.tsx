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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { userManagementService } from "../services/userManagementService";
import { auditLogService } from "../services/auditLogService";
import { configurationManagementService } from "../services/configurationManagementService";
import { backupRecoveryService } from "../services/backupRecoveryService";
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
  Settings,
  Users,
  Shield,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Crown,
  Zap,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  systemHealth: number;
  securityAlerts: number;
  backupStatus: string;
  lastBackup: Date;
  storageUsage: number;
  apiCallsToday: number;
  errorRate: number;
}

interface SystemConfiguration {
  category: string;
  settings: Array<{
    key: string;
    value: any;
    type: "string" | "number" | "boolean" | "array" | "object";
    description: string;
    sensitive: boolean;
    lastModified: Date;
    modifiedBy: string;
  }>;
}

export default function EnterpriseAdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [configurations, setConfigurations] = useState<SystemConfiguration[]>(
    [],
  );
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSensitive, setShowSensitive] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Load system statistics
      const adminStats = await loadSystemStats();
      setStats(adminStats);

      // Load configurations
      const configs = await configurationManagementService.getConfigurations();
      setConfigurations(configs);

      if (configs.length > 0) {
        setSelectedConfig(configs[0].category);
      }
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSystemStats = async (): Promise<AdminStats> => {
    // Simulate loading comprehensive system statistics
    return {
      totalUsers: 48752,
      activeUsers: 12847,
      totalSessions: 3249,
      systemHealth: 97,
      securityAlerts: 3,
      backupStatus: "completed",
      lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      storageUsage: 78,
      apiCallsToday: 2847593,
      errorRate: 0.12,
    };
  };

  const handleConfigurationUpdate = async (
    category: string,
    key: string,
    newValue: any,
  ) => {
    try {
      await configurationManagementService.updateConfiguration(
        category,
        key,
        newValue,
      );
      await loadAdminData(); // Reload data
    } catch (error) {
      console.error("Failed to update configuration:", error);
    }
  };

  const handleBackupTrigger = async () => {
    try {
      await backupRecoveryService.createBackup("manual");
      await loadAdminData();
    } catch (error) {
      console.error("Failed to trigger backup:", error);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthIcon = (score: number) => {
    if (score >= 95) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 85)
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
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
            <p>Loading enterprise administration data...</p>
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
            <div className="p-3 bg-gradient-to-r from-purple-500 to-red-500 rounded-xl">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
              Enterprise Administration
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete system administration dashboard for enterprise-grade
            infrastructure management, user administration, and security
            oversight.
          </p>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    System Health
                  </p>
                  <p
                    className={`text-2xl font-bold ${getHealthColor(stats.systemHealth)}`}
                  >
                    {stats.systemHealth}%
                  </p>
                </div>
                {getHealthIcon(stats.systemHealth)}
              </div>
              <div className="mt-2">
                <Progress value={stats.systemHealth} className="w-full h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.activeUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  of {stats.totalUsers.toLocaleString()} total
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Security Alerts
                  </p>
                  <p
                    className={`text-2xl font-bold ${stats.securityAlerts > 5 ? "text-red-600" : "text-green-600"}`}
                  >
                    {stats.securityAlerts}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-2">
                {stats.securityAlerts === 0 ? (
                  <Badge className="bg-green-100 text-green-800">
                    All Clear
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">
                    Attention Required
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Storage Usage
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.storageUsage}%
                  </p>
                </div>
                <Database className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-2">
                <Progress value={stats.storageUsage} className="w-full h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Error Rate
                  </p>
                  <p
                    className={`text-2xl font-bold ${stats.errorRate > 0.5 ? "text-red-600" : "text-green-600"}`}
                  >
                    {stats.errorRate.toFixed(2)}%
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  {stats.apiCallsToday.toLocaleString()} API calls today
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Administration Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          {/* System Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>System Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={[
                        { time: "00:00", cpu: 45, memory: 60, network: 30 },
                        { time: "04:00", cpu: 35, memory: 55, network: 25 },
                        { time: "08:00", cpu: 75, memory: 70, network: 80 },
                        { time: "12:00", cpu: 85, memory: 75, network: 90 },
                        { time: "16:00", cpu: 90, memory: 80, network: 95 },
                        { time: "20:00", cpu: 65, memory: 65, network: 60 },
                        { time: "24:00", cpu: 50, memory: 58, network: 35 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="cpu"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                      />
                      <Area
                        type="monotone"
                        dataKey="memory"
                        stackId="1"
                        stroke="#10B981"
                        fill="#10B981"
                      />
                      <Area
                        type="monotone"
                        dataKey="network"
                        stackId="1"
                        stroke="#F59E0B"
                        fill="#F59E0B"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Active Trading",
                            value: 35,
                            fill: "#0088FE",
                          },
                          {
                            name: "Portfolio Review",
                            value: 28,
                            fill: "#00C49F",
                          },
                          { name: "Research", value: 20, fill: "#FFBB28" },
                          { name: "Settings", value: 12, fill: "#FF8042" },
                          { name: "Support", value: 5, fill: "#8884D8" },
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

            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Current System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>High Storage Usage:</strong> Database partition is
                      at 78% capacity. Consider cleanup or expansion.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Security Scan Complete:</strong> All systems
                      passed security vulnerability assessment.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Scheduled Maintenance:</strong> Planned system
                      maintenance window starts in 6 hours.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Registration Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={[
                        { month: "Jan", new: 1200, active: 8500 },
                        { month: "Feb", new: 1450, active: 9200 },
                        { month: "Mar", new: 1680, active: 10100 },
                        { month: "Apr", new: 1920, active: 11500 },
                        { month: "May", new: 2150, active: 12800 },
                        { month: "Jun", new: 2380, active: 14200 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="new"
                        stroke="#3B82F6"
                        name="New Users"
                      />
                      <Line
                        type="monotone"
                        dataKey="active"
                        stroke="#10B981"
                        name="Active Users"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Role Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        role: "Standard Users",
                        count: 42150,
                        percentage: 86.5,
                        color: "bg-blue-500",
                      },
                      {
                        role: "Premium Users",
                        count: 4320,
                        percentage: 8.9,
                        color: "bg-green-500",
                      },
                      {
                        role: "Enterprise Users",
                        count: 1890,
                        percentage: 3.9,
                        color: "bg-purple-500",
                      },
                      {
                        role: "Administrators",
                        count: 285,
                        percentage: 0.6,
                        color: "bg-red-500",
                      },
                      {
                        role: "System Admins",
                        count: 107,
                        percentage: 0.2,
                        color: "bg-orange-500",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${item.color}`}
                          ></div>
                          <span className="font-medium">{item.role}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {item.count.toLocaleString()}
                          </span>
                          <div className="w-24">
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                          <span className="text-sm font-medium">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Actions */}
            <Card>
              <CardHeader>
                <CardTitle>User Management Actions</CardTitle>
                <CardDescription>
                  Quick actions for user administration and management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col space-y-2"
                  >
                    <Users className="h-6 w-6" />
                    <span>Bulk User Operations</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col space-y-2"
                  >
                    <Lock className="h-6 w-6" />
                    <span>Security Management</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col space-y-2"
                  >
                    <Download className="h-6 w-6" />
                    <span>Export User Data</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Audit Events</CardTitle>
                <CardDescription>
                  System and user activity audit trail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      time: "2024-03-28 14:32:15",
                      user: "admin@quantumvest.io",
                      action: "Configuration Updated",
                      resource: "system.security.mfa_required",
                      status: "success",
                      ip: "192.168.1.100",
                    },
                    {
                      time: "2024-03-28 14:28:43",
                      user: "system",
                      action: "Backup Completed",
                      resource: "database.production",
                      status: "success",
                      ip: "localhost",
                    },
                    {
                      time: "2024-03-28 14:15:22",
                      user: "user@example.com",
                      action: "Failed Login Attempt",
                      resource: "auth.login",
                      status: "failed",
                      ip: "203.0.113.45",
                    },
                    {
                      time: "2024-03-28 13:58:17",
                      user: "moderator@quantumvest.io",
                      action: "User Account Suspended",
                      resource: "user.suspend",
                      status: "success",
                      ip: "192.168.1.105",
                    },
                  ].map((event, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant={
                              event.status === "success"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {event.status}
                          </Badge>
                          <span className="font-medium">{event.action}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {event.time}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <span>
                          <strong>User:</strong> {event.user}
                        </span>{" "}
                        |
                        <span>
                          <strong> Resource:</strong> {event.resource}
                        </span>{" "}
                        |
                        <span>
                          <strong> IP:</strong> {event.ip}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Management */}
          <TabsContent value="config" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">System Configuration</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSensitive(!showSensitive)}
                >
                  {showSensitive ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  {showSensitive ? "Hide" : "Show"} Sensitive
                </Button>
                <Select
                  value={selectedConfig}
                  onValueChange={setSelectedConfig}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select configuration category" />
                  </SelectTrigger>
                  <SelectContent>
                    {configurations.map((config) => (
                      <SelectItem key={config.category} value={config.category}>
                        {config.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {configurations
              .filter((config) => config.category === selectedConfig)
              .map((config) => (
                <Card key={config.category}>
                  <CardHeader>
                    <CardTitle>{config.category} Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {config.settings
                        .filter(
                          (setting) => showSensitive || !setting.sensitive,
                        )
                        .map((setting, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  {setting.key}
                                </span>
                                {setting.sensitive && (
                                  <Badge variant="outline" className="text-xs">
                                    Sensitive
                                  </Badge>
                                )}
                              </div>
                              <Button size="sm" variant="outline">
                                <Settings className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {setting.description}
                            </p>
                            <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                              {setting.sensitive && !showSensitive
                                ? "••••••••"
                                : JSON.stringify(setting.value)}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              Last modified by {setting.modifiedBy} on{" "}
                              {setting.lastModified.toLocaleString()}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          {/* Backup & Recovery */}
          <TabsContent value="backup" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Backup Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">
                          Last Backup
                        </p>
                        <p className="text-sm text-green-600">
                          {stats.lastBackup.toLocaleString()}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Database Backup</span>
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>File System Backup</span>
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Configuration Backup</span>
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>
                    </div>

                    <Button onClick={handleBackupTrigger} className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Trigger Manual Backup
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recovery Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download Backup Archive
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Restore from Backup
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      Point-in-Time Recovery
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Zap className="h-4 w-4 mr-2" />
                      Disaster Recovery
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Backup History */}
            <Card>
              <CardHeader>
                <CardTitle>Backup History</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { date: "Mar 22", size: 2.4, duration: 18 },
                      { date: "Mar 23", size: 2.6, duration: 22 },
                      { date: "Mar 24", size: 2.5, duration: 19 },
                      { date: "Mar 25", size: 2.8, duration: 25 },
                      { date: "Mar 26", size: 2.7, duration: 21 },
                      { date: "Mar 27", size: 2.9, duration: 27 },
                      { date: "Mar 28", size: 3.1, duration: 23 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="size"
                      fill="#3B82F6"
                      name="Size (GB)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="duration"
                      fill="#10B981"
                      name="Duration (min)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>CPU Usage</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <Progress value={67} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span>Memory Usage</span>
                      <span className="font-medium">54%</span>
                    </div>
                    <Progress value={54} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span>Disk I/O</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <Progress value={23} className="w-full" />

                    <div className="flex justify-between items-center">
                      <span>Network Usage</span>
                      <span className="font-medium">89%</span>
                    </div>
                    <Progress value={89} className="w-full" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        service: "Web Server",
                        status: "running",
                        uptime: "99.9%",
                      },
                      {
                        service: "Database",
                        status: "running",
                        uptime: "99.8%",
                      },
                      {
                        service: "Cache Server",
                        status: "running",
                        uptime: "99.7%",
                      },
                      {
                        service: "Message Queue",
                        status: "running",
                        uptime: "99.9%",
                      },
                      {
                        service: "Background Jobs",
                        status: "running",
                        uptime: "99.6%",
                      },
                      {
                        service: "Monitoring",
                        status: "running",
                        uptime: "100%",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">{item.service}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{item.uptime}</Badge>
                          <Badge className="bg-green-100 text-green-800">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
