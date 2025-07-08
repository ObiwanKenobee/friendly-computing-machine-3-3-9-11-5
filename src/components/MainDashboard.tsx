/**
 * Main Dashboard Hub - Central operational interface for QuantumVest platform
 * Core dashboard that brings together all essential platform functionality
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Activity,
  BarChart3,
  Bell,
  Briefcase,
  Building,
  DollarSign,
  Globe,
  PieChart,
  Settings,
  TrendingUp,
  Users,
  Vault,
  Wallet,
  Shield,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface DashboardStats {
  totalValue: string;
  activeVaults: number;
  monthlyReturn: string;
  riskScore: number;
  portfolioGrowth: string;
  activeUsers: string;
}

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error";
  message: string;
  time: string;
}

interface VaultSummary {
  id: string;
  name: string;
  value: string;
  performance: string;
  risk: "Low" | "Medium" | "High";
  status: "Active" | "Paused" | "Optimizing";
}

const MainDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalValue: "$2.34M",
    activeVaults: 12,
    monthlyReturn: "+23.7%",
    riskScore: 7.2,
    portfolioGrowth: "+$47K",
    activeUsers: "1,247",
  });

  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      message: "AssetVault™ optimization completed",
      time: "2m ago",
    },
    {
      id: "2",
      type: "info",
      message: "New AI insights available for review",
      time: "15m ago",
    },
    {
      id: "3",
      type: "warning",
      message: "Market volatility detected in EMEA region",
      time: "1h ago",
    },
  ]);

  const [vaults] = useState<VaultSummary[]>([
    {
      id: "1",
      name: "Global Real Estate Vault",
      value: "$450K",
      performance: "+18.2%",
      risk: "Low",
      status: "Active",
    },
    {
      id: "2",
      name: "Carbon Credits Portfolio",
      value: "$320K",
      performance: "+34.5%",
      risk: "Medium",
      status: "Active",
    },
    {
      id: "3",
      name: "Diaspora Investment Fund",
      value: "$280K",
      performance: "+12.8%",
      risk: "Low",
      status: "Optimizing",
    },
    {
      id: "4",
      name: "Cultural Heritage Bonds",
      value: "$190K",
      performance: "+8.7%",
      risk: "Low",
      status: "Active",
    },
  ]);

  const quickActions = [
    {
      icon: <Vault className="h-5 w-5" />,
      label: "Create Vault",
      href: "/vault-builder",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: "Portfolio Analysis",
      href: "/analytics",
    },
    {
      icon: <Wallet className="h-5 w-5" />,
      label: "Wallet Manager",
      href: "/wallet",
    },
    {
      icon: <Brain className="h-5 w-5" />,
      label: "AI Advisor",
      href: "/ai-advisor",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      label: "Global Markets",
      href: "/markets",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/settings",
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600 bg-green-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "High":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-50";
      case "Paused":
        return "text-gray-600 bg-gray-50";
      case "Optimizing":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Portfolio Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back to your QuantumVest portfolio
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Vault className="h-4 w-4 mr-2" />
              New Vault
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalValue}
              </div>
              <div className="flex items-center mt-1">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  {stats.portfolioGrowth} this month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Vaults
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.activeVaults}
              </div>
              <div className="text-sm text-gray-500">Across 4 regions</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Monthly Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.monthlyReturn}
              </div>
              <div className="text-sm text-gray-500">Above benchmark</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.riskScore}/10
              </div>
              <div className="text-sm text-gray-500">Moderate risk</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Global Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.activeUsers}
              </div>
              <div className="text-sm text-gray-500">Active today</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vaults">Vaults</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                        onClick={() => (window.location.href = action.href)}
                      >
                        {action.icon}
                        <span className="text-xs text-center">
                          {action.label}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Market Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <span>Market Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Global Markets
                      </span>
                      <Badge className="bg-green-50 text-green-700">
                        Bullish
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ESG Bonds</span>
                      <Badge className="bg-blue-50 text-blue-700">Stable</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Real Estate</span>
                      <Badge className="bg-green-50 text-green-700">
                        Growing
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Carbon Credits
                      </span>
                      <Badge className="bg-yellow-50 text-yellow-700">
                        Volatile
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vaults" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {vaults.map((vault) => (
                <Card
                  key={vault.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{vault.name}</CardTitle>
                      <Badge className={getRiskColor(vault.risk)}>
                        {vault.risk} Risk
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Value
                        </span>
                        <span className="text-lg font-semibold">
                          {vault.value}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Performance
                        </span>
                        <span className="text-lg font-semibold text-green-600">
                          {vault.performance}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status</span>
                        <Badge className={getStatusColor(vault.status)}>
                          {vault.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Manage
                        </Button>
                        <Button size="sm" className="flex-1">
                          Optimize
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Advanced Analytics
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Detailed portfolio analysis and performance metrics
                  </p>
                  <Button onClick={() => (window.location.href = "/analytics")}>
                    View Full Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-insights">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span>AI-Powered Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Portfolio Optimization Suggestion
                    </h4>
                    <p className="text-blue-800 text-sm">
                      Based on current market conditions, consider increasing
                      exposure to ESG bonds by 15% for optimal risk-adjusted
                      returns.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      Market Opportunity
                    </h4>
                    <p className="text-green-800 text-sm">
                      Carbon credit prices are experiencing seasonal low.
                      Consider adding to your carbon vault position in the next
                      7 days.
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => (window.location.href = "/ai-advisor")}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Open AI Advisor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Security Settings</h4>
                      <p className="text-sm text-gray-600">
                        Manage authentication and security preferences
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Notification Preferences</h4>
                      <p className="text-sm text-gray-600">
                        Control how you receive alerts and updates
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Regional Settings</h4>
                      <p className="text-sm text-gray-600">
                        Language, currency, and localization options
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
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

export default MainDashboard;
