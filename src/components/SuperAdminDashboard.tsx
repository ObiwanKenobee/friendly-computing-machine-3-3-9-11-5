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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Shield,
  Users,
  Database,
  Activity,
  Settings,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  UserPlus,
  RotateCcw,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Monitor,
} from "lucide-react";
import {
  superAdminAuthService,
  SuperAdminUser,
  SuperAdminSession,
} from "../services/superAdminAuthService";
import { systemArchitectureService } from "../services/systemArchitectureService";
import { appHealthMonitor } from "../utils/appHealthMonitor";

interface SuperAdminDashboardProps {
  onLogout: () => void;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  systemUptime: number;
  databaseHealth: string;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  networkStatus: string;
}

interface UserManagementData {
  totalUsers: number;
  activeUsers: number;
  lockedUsers: number;
  recentLogins: Array<{
    id: string;
    username: string;
    lastLogin: string;
    ipAddress: string;
    status: "success" | "failed";
  }>;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [session, setSession] = useState<SuperAdminSession | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [userManagement, setUserManagement] =
    useState<UserManagementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Get current session
      const currentSession = superAdminAuthService.getCurrentSession();
      setSession(currentSession);

      // Load system statistics
      const [healthData, systemHealth] = await Promise.all([
        appHealthMonitor.checkHealth(),
        systemArchitectureService.getSystemHealth(),
      ]);

      setSystemStats({
        totalUsers: 1247,
        activeUsers: 892,
        systemUptime: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days
        databaseHealth: healthData.database.status,
        memoryUsage: healthData.memory.usage,
        cpuUsage: healthData.performance.cpuUsage,
        diskUsage: healthData.storage.usage,
        networkStatus: healthData.network.status,
      });

      // Load user management data
      setUserManagement({
        totalUsers: 1247,
        activeUsers: 892,
        lockedUsers: 15,
        recentLogins: [
          {
            id: "1",
            username: "john.doe@quantumvest.com",
            lastLogin: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            ipAddress: "192.168.1.100",
            status: "success",
          },
          {
            id: "2",
            username: "admin@quantumvest.com",
            lastLogin: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            ipAddress: "10.0.0.50",
            status: "failed",
          },
          {
            id: "3",
            username: "sarah.smith@quantumvest.com",
            lastLogin: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            ipAddress: "192.168.1.105",
            status: "success",
          },
        ],
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    try {
      const success = await superAdminAuthService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );

      if (success) {
        setPasswordSuccess(true);
        setPasswordError("");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setShowChangePassword(false), 2000);
      } else {
        setPasswordError("Current password is incorrect");
      }
    } catch (error) {
      setPasswordError("Failed to change password");
    }
  };

  const seedDefaultAdmin = async () => {
    try {
      const success = await superAdminAuthService.seedDefaultSuperAdmin();
      if (success) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error("Failed to seed admin:", error);
    }
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    return `${days}d ${hours}h`;
  };

  const getHealthBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "online":
      case "operational":
        return "bg-green-500";
      case "warning":
      case "degraded":
        return "bg-yellow-500";
      case "critical":
      case "offline":
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Super Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  QuantumVest Enterprise Control Panel
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {session?.user.fullName}
              </p>
              <p className="text-xs text-gray-500">Super Administrator</p>
            </div>

            <Dialog
              open={showChangePassword}
              onOpenChange={setShowChangePassword}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Update your super admin password. Use a strong password with
                    at least 8 characters.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {passwordError && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}

                  {passwordSuccess && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Password changed successfully!
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowChangePassword(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleChangePassword}>
                      Change Password
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStats?.totalUsers.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {systemStats?.activeUsers} active now
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    System Uptime
                  </CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStats
                      ? formatUptime(Date.now() - systemStats.systemUptime)
                      : "0d 0h"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-1 ${getHealthBadgeColor(systemStats?.databaseHealth || "unknown")}`}
                    ></span>
                    {systemStats?.databaseHealth || "Unknown"} status
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    CPU Usage
                  </CardTitle>
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStats?.cpuUsage.toFixed(1)}%
                  </div>
                  <Progress
                    value={systemStats?.cpuUsage || 0}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Memory Usage
                  </CardTitle>
                  <MemoryStick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStats?.memoryUsage.toFixed(1)}%
                  </div>
                  <Progress
                    value={systemStats?.memoryUsage || 0}
                    className="mt-2"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={seedDefaultAdmin}
                    variant="outline"
                    className="justify-start"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Seed Default Admin
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export System Logs
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh All Services
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Users:</span>
                    <span className="font-semibold">
                      {userManagement?.totalUsers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-semibold text-green-600">
                      {userManagement?.activeUsers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Locked Users:</span>
                    <span className="font-semibold text-red-600">
                      {userManagement?.lockedUsers}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Login Activity</CardTitle>
                  <CardDescription>
                    Latest user authentication attempts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {userManagement?.recentLogins.map((login) => (
                        <div
                          key={login.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            {login.status === "success" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <div>
                              <p className="font-medium">{login.username}</p>
                              <p className="text-sm text-gray-500">
                                {login.ipAddress}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                login.status === "success"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {login.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(login.lastLogin).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>CPU Usage</span>
                      <span>{systemStats?.cpuUsage.toFixed(1)}%</span>
                    </div>
                    <Progress value={systemStats?.cpuUsage || 0} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Memory Usage</span>
                      <span>{systemStats?.memoryUsage.toFixed(1)}%</span>
                    </div>
                    <Progress value={systemStats?.memoryUsage || 0} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Disk Usage</span>
                      <span>{systemStats?.diskUsage.toFixed(1)}%</span>
                    </div>
                    <Progress value={systemStats?.diskUsage || 0} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Database</span>
                    <Badge
                      className={getHealthBadgeColor(
                        systemStats?.databaseHealth || "unknown",
                      )}
                    >
                      {systemStats?.databaseHealth || "Unknown"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Network</span>
                    <Badge
                      className={getHealthBadgeColor(
                        systemStats?.networkStatus || "unknown",
                      )}
                    >
                      {systemStats?.networkStatus || "Unknown"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Gateway</span>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Services</span>
                    <Badge className="bg-green-500">Operational</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Alerts</CardTitle>
                  <CardDescription>
                    Recent security events and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">
                          Multiple Failed Login Attempts
                        </p>
                        <p className="text-sm text-gray-500">
                          From IP: 192.168.1.100
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Security Scan Completed</p>
                        <p className="text-sm text-gray-500">
                          No vulnerabilities found
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                  <CardDescription>
                    Manage user permissions and access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Lock className="h-4 w-4 mr-2" />
                      Manage User Permissions
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Security Audit Log
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Key className="h-4 w-4 mr-2" />
                      API Key Management
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Database Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge
                      className={getHealthBadgeColor(
                        systemStats?.databaseHealth || "unknown",
                      )}
                    >
                      {systemStats?.databaseHealth || "Unknown"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Connections:</span>
                    <span>245/1000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Query Time:</span>
                    <span>12ms avg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Used:</span>
                    <span>2.4 GB</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Run Maintenance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Backup
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={seedDefaultAdmin}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Seed Super Admin
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
