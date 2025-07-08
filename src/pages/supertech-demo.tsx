/**
 * SuperTech Demo Page
 * Showcases the new SuperTech Header and Footer
 */

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { SEOHead } from "../components/SEOHead";
import SuperTechLayout from "../components/SuperTechLayout";
import {
  Vault,
  Bot,
  Leaf,
  Activity,
  Users,
  Wallet,
  Zap,
  Globe,
  Heart,
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const SuperTechDemoPage: React.FC = () => {
  const features = [
    {
      icon: <Activity className="h-8 w-8 text-blue-600" />,
      title: "Platform Navigation",
      description:
        "Complete platform with investor archetypes, enterprise tiers, and comprehensive route system.",
      highlights: [
        "Multi-tier access",
        "Investor archetypes",
        "Enterprise features",
      ],
    },
    {
      icon: <Vault className="h-8 w-8 text-purple-600" />,
      title: "Investment Dashboard",
      description:
        "Advanced analytics dashboard with portfolio management and real-time market insights.",
      highlights: ["Portfolio analytics", "Real-time data", "Investment tools"],
    },
    {
      icon: <Bot className="h-8 w-8 text-green-600" />,
      title: "Infrastructure Navigator",
      description:
        "Snake Xenzia-inspired navigation system with multi-region optimization and enterprise controls.",
      highlights: ["Game-inspired UI", "Multi-region", "Real-time monitoring"],
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      title: "Serverless APIs",
      description:
        "Production-ready serverless functions for infrastructure monitoring, analytics, and optimization.",
      highlights: [
        "Serverless architecture",
        "Real-time APIs",
        "Performance analytics",
      ],
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Enterprise Subscriptions",
      description:
        "Scalable subscription tiers from retail investors to institutional enterprises with specialized features.",
      highlights: [
        "Multi-tier pricing",
        "Enterprise features",
        "Scalable access",
      ],
    },
    {
      icon: <Wallet className="h-8 w-8 text-cyan-600" />,
      title: "Pricing & Billing",
      description:
        "Transparent pricing structure with flexible billing options and enterprise customization.",
      highlights: [
        "Transparent pricing",
        "Flexible billing",
        "Enterprise support",
      ],
    },
  ];

  const uiEnhancements = [
    {
      icon: "🌌",
      title: "Animated Spiral Logo",
      description:
        "Rotating vault spiral with gradient overlay for visual appeal",
    },
    {
      icon: "��",
      title: "Ritual Notification System",
      description:
        "Smart notifications for active yield rituals and community events",
    },
    {
      icon: "🌍",
      title: "Multi-Language Support",
      description:
        "Native support for Swahili, Hindi, Arabic, Yoruba, and English",
    },
    {
      icon: "🧠",
      title: "AI Pulse Indicator",
      description: "Real-time AI advisor status with visual feedback system",
    },
  ];

  return (
    <>
      <SEOHead
        title="SuperTech Navigation Demo | QuantumVest"
        description="Experience the next-generation navigation system with mythic-inspired design and enterprise-grade functionality."
        keywords={[
          "supertech navigation",
          "quantumvest ui",
          "dao interface",
          "mythic design",
          "web3 navigation",
          "ritual yield",
          "planetary dashboard",
          "geodaos",
        ]}
        canonicalUrl="/supertech-demo"
      />

      <SuperTechLayout>
        <div className="w-full overflow-x-hidden">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-12 sm:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div
                    className="text-6xl animate-spin mr-4"
                    style={{ animationDuration: "8s" }}
                  >
                    🌀
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    SuperTech Navigation
                  </Badge>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Welcome to QuantumVest
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                    Enterprise Platform
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 px-4 sm:px-0">
                  Your gateway to the complete QuantumVest ecosystem. Navigate
                  between our enterprise features, serverless infrastructure,
                  investment dashboard, and advanced tools through our unified
                  SuperTech interface.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Go to Dashboard
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() =>
                      (window.location.href = "/platform-navigation")
                    }
                  >
                    <Globe className="h-5 w-5 mr-2" />
                    Explore Platform
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Platform Ecosystem
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Navigate between our comprehensive suite of enterprise
                  features, from investment dashboards to serverless
                  infrastructure and subscription management.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-xl">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        {feature.description}
                      </p>
                      <div className="space-y-2">
                        {feature.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-700">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* UX Enhancements Section */}
          <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Enhanced User Experience
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Thoughtfully designed interactions that make complex financial
                  operations intuitive and engaging.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {uiEnhancements.map((enhancement, index) => (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardContent className="pt-6">
                      <div className="text-4xl mb-4">{enhancement.icon}</div>
                      <h3 className="font-semibold text-lg mb-2">
                        {enhancement.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {enhancement.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Navigation Demo Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Platform Status & Metrics
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                  Real-time platform monitoring with live status indicators
                  across all systems, from serverless infrastructure to
                  enterprise subscriptions.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-medium text-green-800">
                        AI Advisor Online
                      </div>
                      <div className="text-sm text-green-600">
                        Processing 1,247 vault optimizations
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-medium text-blue-800">
                        Active Rituals
                      </div>
                      <div className="text-sm text-blue-600">
                        3 yield rituals generating sustainable returns
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="h-3 w-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-medium text-purple-800">
                        Global Network
                      </div>
                      <div className="text-sm text-purple-600">
                        247 active vaults across 52 countries
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl"></div>
                  <Card className="relative bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <span>Live Protocol Stats</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Total Value Locked
                          </span>
                          <span className="font-bold text-xl text-green-600">
                            $2.3B
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Active Vaults</span>
                          <span className="font-bold text-xl text-blue-600">
                            247
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">GeoDAOs</span>
                          <span className="font-bold text-xl text-purple-600">
                            12
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Carbon Offset</span>
                          <span className="font-bold text-xl text-green-600">
                            1.2M tons
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Experience the Future?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of planetary stewards building sustainable wealth
                through community-driven vaults and ritual yield practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() =>
                    (window.location.href = "/enterprise-subscriptions")
                  }
                >
                  <Heart className="h-5 w-5 mr-2" />
                  View Enterprise Plans
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={() => (window.location.href = "/pricing")}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  See Pricing
                </Button>
              </div>
            </div>
          </section>
        </div>
      </SuperTechLayout>
    </>
  );
};

export default SuperTechDemoPage;
