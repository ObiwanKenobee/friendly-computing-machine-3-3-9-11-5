/**
 * Simple Landing Page - Fallback for loading issues
 */

import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Users,
  Vault,
  Brain,
  Code,
  Activity,
} from "lucide-react";

const SimpleLanding: React.FC = () => {
  const quickActions = [
    {
      icon: <Vault className="h-5 w-5" />,
      label: "Main Dashboard",
      href: "/dashboard",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      label: "Authentication",
      href: "/auth",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      label: "Platform Router",
      href: "/router",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      label: "Quantum Infrastructure",
      href: "/quantum-infrastructure",
    },
    {
      icon: <Code className="h-5 w-5" />,
      label: "Circuit Builder",
      href: "/circuit-builder",
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: "Platform Navigation",
      href: "/platform-navigation",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Vault className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">QuantumVest</h1>
            </div>
            <Badge className="bg-green-50 text-green-700">System Online</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-6 text-lg px-6 py-2">
            🌍 Quantum-Native Financial Platform
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Welcome to
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent block">
              QuantumVest Platform
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Production-ready quantum computing infrastructure with
            enterprise-grade cloud resilience, circuit optimization, and
            real-time monitoring.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              onClick={() => (window.location.href = "/dashboard")}
            >
              <Activity className="h-5 w-5 mr-2" />
              Open Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-2"
              onClick={() => (window.location.href = "/quantum-infrastructure")}
            >
              <Zap className="h-5 w-5 mr-2" />
              Quantum Infrastructure
            </Button>
          </div>
        </div>

        {/* Platform Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => (window.location.href = action.href)}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg">{action.icon}</div>
                  <span>{action.label}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Access Platform</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Quantum Security</h3>
              <p className="text-gray-600 text-sm">
                Post-quantum encryption with ZK-proof verification
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">AI Optimization</h3>
              <p className="text-gray-600 text-sm">
                RL-based circuit optimization and error correction
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Cloud Resilience</h3>
              <p className="text-gray-600 text-sm">
                Multi-region failover with quantum load balancing
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                Real-time Monitoring
              </h3>
              <p className="text-gray-600 text-sm">
                QPU status, circuit performance, and system health
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-medium">
                All Quantum Systems Operational
              </span>
              <Badge className="bg-green-600 text-white">99.97% Uptime</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleLanding;
