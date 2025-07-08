/**
 * Basic Admin Dashboard
 * Entry-level administrative interface
 */

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import {
  UnifiedAdminProvider,
  AdminGuard,
  AdminLevel,
  useUnifiedAuth,
} from "../components/UnifiedAdminAuth";
import {
  Settings,
  Users,
  BarChart3,
  Shield,
  Activity,
  Eye,
  Edit,
  Plus,
  Download,
  RefreshCw,
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  DollarSign,
  UserCheck,
  Globe,
} from "lucide-react";

const BasicAdminDashboard: React.FC = () => {
  const { user, logout } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for basic admin view
  const dashboardStats = {
    totalUsers: 2847,
    activeUsers: 1923,
    newRegistrations: 89,
    totalRevenue: "$47,329",
    monthlyGrowth: "+12.4%",
    supportTickets: 23,
  };

  const recentActivity = [
    {
      id: 1,
      type: "user_registration",
      description: "New user registered: john.doe@example.com",
      timestamp: "2024-01-05 16:30:00",
      status: "success",
    },
    {
      id: 2,
      type: "payment_processed",
      description: "Payment processed for subscription renewal",
      timestamp: "2024-01-05 16:15:00",
      status: "success",
    },
    {
      id: 3,
      type: "support_ticket",
      description: "New support ticket #1234 - Password reset issue",
      timestamp: "2024-01-05 16:00:00",
      status: "pending",
    },
    {
      id: 4,
      type: "system_update",
      description: "System maintenance completed successfully",
      timestamp: "2024-01-05 15:45:00",
      status: "success",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registration":
        return <UserCheck className="h-4 w-4 text-green-600" />;
      case "payment_processed":
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      case "support_ticket":
        return <Bell className="h-4 w-4 text-yellow-600" />;
      case "system_update":
        return <Settings className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <>
      <SEOHead
        title="Basic Admin Dashboard | QuantumVest"
        description="Entry-level administrative interface for basic platform management"
        keywords={["basic admin", "dashboard", "management", "quantumvest"]}
        canonicalUrl="/basic-admin"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Settings className="h-8 w-8 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    Basic Admin Dashboard
                  </h1>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  Level {user?.clearanceLevel}
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.username}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold">
                      {dashboardStats.totalUsers.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600">
                      +{dashboardStats.newRegistrations} this week
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
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
                    <p className="text-2xl font-bold text-green-600">
                      {dashboardStats.activeUsers.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600">
                      {Math.round(
                        (dashboardStats.activeUsers /
                          dashboardStats.totalUsers) *
                          100,
                      )}
                      % active
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold">
                      {dashboardStats.totalRevenue}
                    </p>
                    <p className="text-xs text-green-600">
                      {dashboardStats.monthlyGrowth} this month
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-4 w-full lg:w-auto">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold">Recent Activity</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.slice(0, 4).map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.timestamp}
                            </p>
                          </div>
                          {getStatusBadge(activity.status)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold">Quick Actions</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Eye className="h-4 w-4 mr-2" />
                        View Reports
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">User Management</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">
                          Total Registered
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {dashboardStats.totalUsers.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-800">
                          Currently Active
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {dashboardStats.activeUsers.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm font-medium text-purple-800">
                          New This Week
                        </p>
                        <p className="text-2xl font-bold text-purple-600">
                          {dashboardStats.newRegistrations}
                        </p>
                      </div>
                    </div>

                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>
                        User management interface available in higher access
                        levels
                      </p>
                      <p className="text-sm">
                        Contact administrator to upgrade access
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold">System Activity Log</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            {activity.timestamp}
                          </p>
                        </div>
                        {getStatusBadge(activity.status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold">Basic Settings</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Account Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Username:</span>
                            <span className="font-medium">
                              {user?.username}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Role:</span>
                            <span className="font-medium">{user?.role}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Clearance Level:</span>
                            <span className="font-medium">
                              {user?.clearanceLevel}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Login:</span>
                            <span className="font-medium">
                              {user?.lastLogin
                                ? new Date(user.lastLogin).toLocaleString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Permissions</h4>
                        <div className="space-y-2">
                          {user?.permissions.map((permission) => (
                            <div
                              key={permission}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">
                                {permission.replace("_", " ")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            Access Level Upgrade
                          </h4>
                          <p className="text-sm text-gray-600">
                            Upgrade to SuperAdmin or UltraLevel for advanced
                            features
                          </p>
                        </div>
                        <Button variant="outline">Request Upgrade</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

const BasicAdminPage: React.FC = () => {
  return (
    <UnifiedAdminProvider>
      <AdminGuard requiredLevel={AdminLevel.BASIC}>
        <BasicAdminDashboard />
      </AdminGuard>
    </UnifiedAdminProvider>
  );
};

export default BasicAdminPage;
