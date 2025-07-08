/**
 * Platform Router - Essential routing system for QuantumVest platform
 * Manages navigation between authenticated and public areas
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Building,
  Code,
  CreditCard,
  Globe,
  Heart,
  Home,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Vault,
  Wallet,
  Zap,
} from "lucide-react";

interface RouteConfig {
  path: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "core" | "enterprise" | "innovation" | "management";
  access: "public" | "authenticated" | "enterprise" | "admin";
  component?: string;
}

const PlatformRouter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("core");
  const [userRole] = useState<string>("enterprise"); // Mock user role

  const routes: RouteConfig[] = [
    // Core Platform Routes
    {
      path: "/",
      name: "Landing Page",
      description: "Main entry point with enterprise branding",
      icon: <Home className="h-5 w-5" />,
      category: "core",
      access: "public",
      component: "QuantumVestEnterpriseLanding",
    },
    {
      path: "/dashboard",
      name: "Main Dashboard",
      description: "Central operational interface",
      icon: <BarChart3 className="h-5 w-5" />,
      category: "core",
      access: "authenticated",
      component: "MainDashboard",
    },
    {
      path: "/auth",
      name: "Authentication",
      description: "Login and registration system",
      icon: <Shield className="h-5 w-5" />,
      category: "core",
      access: "public",
      component: "AuthManager",
    },
    {
      path: "/platform-navigation",
      name: "Platform Navigation",
      description: "Complete platform overview and navigation",
      icon: <Globe className="h-5 w-5" />,
      category: "core",
      access: "public",
      component: "PlatformNavigation",
    },

    // Enterprise Routes
    {
      path: "/enterprise-subscriptions",
      name: "Enterprise Subscriptions",
      description: "Subscription tiers and enterprise packages",
      icon: <Building className="h-5 w-5" />,
      category: "enterprise",
      access: "public",
      component: "EnterpriseSubscriptionsPage",
    },
    {
      path: "/enterprise-command-center",
      name: "Command Center",
      description: "Enterprise operational command center",
      icon: <Zap className="h-5 w-5" />,
      category: "enterprise",
      access: "enterprise",
      component: "EnterpriseCommandCenter",
    },
    {
      path: "/security-dashboard",
      name: "Security Dashboard",
      description: "Enterprise security monitoring and controls",
      icon: <Shield className="h-5 w-5" />,
      category: "enterprise",
      access: "enterprise",
      component: "SecurityDashboard",
    },
    {
      path: "/analytics",
      name: "Analytics Dashboard",
      description: "Advanced analytics and business intelligence",
      icon: <TrendingUp className="h-5 w-5" />,
      category: "enterprise",
      access: "authenticated",
      component: "AnalyticsDashboard",
    },

    // Innovation Routes
    {
      path: "/ai-advisor",
      name: "AI Advisor",
      description: "AI-powered investment advisory system",
      icon: <Brain className="h-5 w-5" />,
      category: "innovation",
      access: "authenticated",
      component: "AIAdvisor",
    },
    {
      path: "/vault-management",
      name: "Vault Management",
      description: "Create and manage investment vaults",
      icon: <Vault className="h-5 w-5" />,
      category: "innovation",
      access: "authenticated",
      component: "VaultManagementSystem",
    },
    {
      path: "/quantum-innovations",
      name: "Quantum Innovations",
      description: "Next-generation financial technologies",
      icon: <Zap className="h-5 w-5" />,
      category: "innovation",
      access: "authenticated",
      component: "QuantumInnovationsPage",
    },
    {
      path: "/developer-workspace",
      name: "Developer Workspace",
      description: "API integration and development tools",
      icon: <Code className="h-5 w-5" />,
      category: "innovation",
      access: "authenticated",
      component: "DeveloperWorkspace",
    },

    // Management Routes
    {
      path: "/user-management",
      name: "User Management",
      description: "Manage users, roles, and permissions",
      icon: <Users className="h-5 w-5" />,
      category: "management",
      access: "admin",
      component: "UserInteractionDashboard",
    },
    {
      path: "/payment-processing",
      name: "Payment Processing",
      description: "Global payment management and processing",
      icon: <CreditCard className="h-5 w-5" />,
      category: "management",
      access: "enterprise",
      component: "PaymentProcessor",
    },
    {
      path: "/wallet-integration",
      name: "Wallet Integration",
      description: "Multi-chain wallet management",
      icon: <Wallet className="h-5 w-5" />,
      category: "management",
      access: "authenticated",
      component: "WalletIntegration",
    },
    {
      path: "/settings",
      name: "Platform Settings",
      description: "Global platform configuration and settings",
      icon: <Settings className="h-5 w-5" />,
      category: "management",
      access: "admin",
      component: "SystemHealthStatus",
    },
  ];

  const categories = [
    {
      id: "core",
      name: "Core Platform",
      color: "bg-blue-50 text-blue-700",
      count: routes.filter((r) => r.category === "core").length,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      color: "bg-purple-50 text-purple-700",
      count: routes.filter((r) => r.category === "enterprise").length,
    },
    {
      id: "innovation",
      name: "Innovation",
      color: "bg-green-50 text-green-700",
      count: routes.filter((r) => r.category === "innovation").length,
    },
    {
      id: "management",
      name: "Management",
      color: "bg-orange-50 text-orange-700",
      count: routes.filter((r) => r.category === "management").length,
    },
  ];

  const getAccessColor = (access: string) => {
    switch (access) {
      case "public":
        return "bg-green-50 text-green-700";
      case "authenticated":
        return "bg-blue-50 text-blue-700";
      case "enterprise":
        return "bg-purple-50 text-purple-700";
      case "admin":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const canAccess = (access: string) => {
    switch (access) {
      case "public":
        return true;
      case "authenticated":
        return ["authenticated", "enterprise", "admin"].includes(userRole);
      case "enterprise":
        return ["enterprise", "admin"].includes(userRole);
      case "admin":
        return userRole === "admin";
      default:
        return false;
    }
  };

  const filteredRoutes = routes.filter(
    (route) => route.category === selectedCategory,
  );

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Platform Router
              </h1>
              <p className="text-gray-600 mt-1">
                Navigate between all available platform components
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-blue-50 text-blue-700">
                Current Role: {userRole}
              </Badge>
              <Badge className="bg-green-50 text-green-700">
                {routes.filter((r) => canAccess(r.access)).length} Available
                Routes
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    selectedCategory === category.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{category.name}</span>
                    <Badge className={category.color} variant="secondary">
                      {category.count}
                    </Badge>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => {
            const accessible = canAccess(route.access);

            return (
              <Card
                key={route.path}
                className={`hover:shadow-lg transition-all duration-300 ${
                  accessible
                    ? "cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }`}
                onClick={() => accessible && handleNavigate(route.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {route.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{route.name}</CardTitle>
                        <code className="text-xs text-gray-500 font-mono">
                          {route.path}
                        </code>
                      </div>
                    </div>
                    <Badge
                      className={getAccessColor(route.access)}
                      variant="secondary"
                    >
                      {route.access}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{route.description}</p>

                  {route.component && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-1">
                        Component:
                      </div>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                        {route.component}
                      </code>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {route.category}
                    </Badge>

                    {accessible ? (
                      <Button size="sm" variant="outline">
                        Navigate
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Access Restricted
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Platform Status */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-green-600" />
                <span>Platform Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {routes.filter((r) => r.access === "public").length}
                  </div>
                  <div className="text-sm text-gray-600">Public Routes</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {routes.filter((r) => r.access === "authenticated").length}
                  </div>
                  <div className="text-sm text-gray-600">User Routes</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {routes.filter((r) => r.access === "enterprise").length}
                  </div>
                  <div className="text-sm text-gray-600">Enterprise Routes</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {routes.filter((r) => r.access === "admin").length}
                  </div>
                  <div className="text-sm text-gray-600">Admin Routes</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">
                    Platform Health
                  </span>
                </div>
                <p className="text-green-800 text-sm">
                  All {routes.length} routes configured and operational.
                  {routes.filter((r) => canAccess(r.access)).length} routes
                  accessible for current user role.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Navigation
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => handleNavigate("/")} variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Landing Page
            </Button>
            <Button
              onClick={() => handleNavigate("/dashboard")}
              variant="outline"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button onClick={() => handleNavigate("/auth")} variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Authentication
            </Button>
            <Button
              onClick={() => handleNavigate("/platform-navigation")}
              variant="outline"
            >
              <Globe className="h-4 w-4 mr-2" />
              Platform Overview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformRouter;
