/**
 * Enterprise Footer Component
 * Trust transparency, system status, and comprehensive navigation
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Shield,
  Activity,
  Globe,
  Users,
  TrendingUp,
  Eye,
  Lock,
  Zap,
  Heart,
  ArrowUp,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Sparkles,
  Brain,
} from "lucide-react";

interface SystemStatus {
  uptime: number;
  transactions: number;
  users: number;
  aum: number;
  trustScore: number;
  securityLevel: "green" | "yellow" | "red";
  lastUpdate: string;
}

interface TransparencyMetric {
  name: string;
  value: number;
  unit: string;
  description: string;
  trend: "up" | "down" | "stable";
}

const EnterpriseFooter: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    uptime: 99.98,
    transactions: 2547832,
    users: 125847,
    aum: 2500000000,
    trustScore: 94,
    securityLevel: "green",
    lastUpdate: new Date().toLocaleTimeString(),
  });

  const [transparencyMetrics, setTransparencyMetrics] = useState<
    TransparencyMetric[]
  >([
    {
      name: "Treasury Transparency",
      value: 100,
      unit: "%",
      description: "All treasury movements publicly auditable",
      trend: "stable",
    },
    {
      name: "AI Model Accuracy",
      value: 94.7,
      unit: "%",
      description: "Last 30-day prediction accuracy",
      trend: "up",
    },
    {
      name: "Fee Transparency",
      value: 0.15,
      unit: "%",
      description: "Average platform fee (industry: 1.2%)",
      trend: "down",
    },
    {
      name: "Carbon Offset",
      value: 150,
      unit: "%",
      description: "Carbon positive operations",
      trend: "up",
    },
  ]);

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Real-time updates
    const interval = setInterval(() => {
      setSystemStatus((prev) => ({
        ...prev,
        transactions: prev.transactions + Math.floor(Math.random() * 50),
        users: prev.users + Math.floor(Math.random() * 5),
        lastUpdate: new Date().toLocaleTimeString(),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getSecurityColor = (level: string) => {
    switch (level) {
      case "green":
        return "text-green-600 bg-green-100";
      case "yellow":
        return "text-yellow-600 bg-yellow-100";
      case "red":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default:
        return <Activity className="h-3 w-3 text-blue-600" />;
    }
  };

  const architectPages = [
    { name: "Retail Investor", path: "/retail-investor" },
    { name: "Institutional Investor", path: "/institutional-investor" },
    { name: "Emerging Market Citizen", path: "/emerging-market-citizen" },
    { name: "Cultural Investor", path: "/cultural-investor" },
    { name: "Developer Integrator", path: "/developer-integrator" },
    { name: "African Market Enterprise", path: "/african-market-enterprise" },
    { name: "Diaspora Investor", path: "/diaspora-investor" },
    { name: "Financial Advisor", path: "/financial-advisor" },
    { name: "Public Sector & NGO", path: "/public-sector-ngo" },
    { name: "Quantitative Investor", path: "/quant-data-driven-investor" },
    { name: "Student & Early Career", path: "/student-early-career" },
    {
      name: "Wildlife Conservation",
      path: "/wildlife-conservation-enterprise",
    },
    { name: "Quantum Enterprise 2050", path: "/quantum-enterprise-2050" },
  ];

  const platformPages = [
    { name: "Platform Overview", path: "/" },
    { name: "Pricing & Plans", path: "/pricing" },
    { name: "System Architecture", path: "/architecture" },
    { name: "Enterprise Innovations", path: "/enterprise-innovations" },
    { name: "Super Admin Portal", path: "/super-admin" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      {/* Trust & Transparency Dashboard */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Real-time System Status */}
            <Card className="bg-white/10 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Live System Status
                  </h3>
                  <Badge
                    className={getSecurityColor(systemStatus.securityLevel)}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Secure
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Uptime</span>
                    <span className="font-mono text-green-400">
                      {systemStatus.uptime}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Active Users</span>
                    <span className="font-mono text-blue-400">
                      {systemStatus.users.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Transactions</span>
                    <span className="font-mono text-purple-400">
                      {systemStatus.transactions.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">
                      Assets Under Management
                    </span>
                    <span className="font-mono text-green-400">
                      {formatNumber(systemStatus.aum)}
                    </span>
                  </div>

                  <div className="text-xs text-gray-400 mt-4">
                    Last updated: {systemStatus.lastUpdate}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transparency Metrics */}
            <Card className="bg-white/10 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Transparency Score
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-blue-400" />
                    <span className="text-2xl font-bold text-blue-400">
                      {systemStatus.trustScore}%
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {transparencyMetrics.map((metric, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{metric.name}</span>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(metric.trend)}
                          <span className="font-mono">
                            {metric.value}
                            {metric.unit}
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={
                          metric.name === "Fee Transparency"
                            ? 100 - metric.value * 10
                            : metric.value
                        }
                        className="h-2"
                      />
                      <p className="text-xs text-gray-400">
                        {metric.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AEGIS Protocol Status */}
            <Card className="bg-white/10 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    AEGIS Protocol
                  </h3>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-sm font-medium">Ethical Screening</p>
                      <p className="text-xs text-gray-400">
                        All investments pass ethical filters
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="text-sm font-medium">Cultural Alignment</p>
                      <p className="text-xs text-gray-400">
                        Values-based investment matching
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm font-medium">
                        Sustainability Impact
                      </p>
                      <p className="text-xs text-gray-400">
                        150% carbon positive operations
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium">Privacy Protection</p>
                      <p className="text-xs text-gray-400">
                        Zero-knowledge proof ready
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Q</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">QuantumVest</h2>
                <p className="text-sm text-gray-300">
                  Enterprise Financial Platform
                </p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              Democratizing access to alternative investments through
              quantum-powered technology, AI-driven insights, and ethical
              investment frameworks.
            </p>

            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                <Github className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Investment Archetypes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Investment Archetypes</h3>
            <ul className="space-y-2">
              {architectPages.slice(0, 8).map((page) => (
                <li key={page.path}>
                  <a
                    href={page.path}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {page.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/pricing"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                >
                  View All Archetypes →
                </a>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Platform</h3>
            <ul className="space-y-2">
              {platformPages.map((page) => (
                <li key={page.path}>
                  <a
                    href={page.path}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {page.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/architecture"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                >
                  System Architecture →
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">
                  enterprise@quantumvest.com
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">
                  +1 (555) 123-QUANTUM
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">Global Operations</span>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => (window.location.href = "/super-admin")}
                  variant="outline"
                  size="sm"
                  className="text-gray-300 border-gray-600 hover:bg-white/10"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Portal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>© 2024 QuantumVest. All rights reserved.</span>
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a
                href="/security"
                className="hover:text-white transition-colors"
              >
                Security
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="text-gray-300 border-gray-600"
              >
                <Activity className="h-3 w-3 mr-1" />
                All Systems Operational
              </Badge>

              <Badge
                variant="outline"
                className="text-gray-300 border-gray-600"
              >
                <Brain className="h-3 w-3 mr-1" />
                AI Models: v2.1.0
              </Badge>

              <Badge
                variant="outline"
                className="text-gray-300 border-gray-600"
              >
                <Zap className="h-3 w-3 mr-1" />
                Quantum Ready
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="sm"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </footer>
  );
};

export { EnterpriseFooter };
