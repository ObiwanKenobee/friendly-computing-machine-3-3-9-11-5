/**
 * LandingPage Component
 * Main landing page for the QuantumVest platform
 */

import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SEOHead } from "./SEOHead";
import SuperTechLayout from "./SuperTechLayout";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Users,
  CheckCircle,
  Star,
  Sparkles,
  Activity,
  Vault,
  Brain,
  Heart,
  Target,
} from "lucide-react";

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "Enterprise Security",
      description:
        "Military-grade security with Cisco XDR protection and real-time threat monitoring.",
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      title: "AI-Powered Insights",
      description:
        "Advanced AI advisor providing personalized investment strategies and market analysis.",
    },
    {
      icon: <Globe className="h-6 w-6 text-green-600" />,
      title: "Global Platform",
      description:
        "Multi-language support across 195+ regions with localized investment opportunities.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
      title: "Portfolio Optimization",
      description:
        "Quantum-level portfolio optimization with legendary investor strategies.",
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      title: "Community Driven",
      description:
        "Join thousands of investors building sustainable wealth through collaborative vaults.",
    },
    {
      icon: <Zap className="h-6 w-6 text-cyan-600" />,
      title: "Real-time Analytics",
      description:
        "Live market data, performance tracking, and instant portfolio adjustments.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Portfolio Manager",
      quote:
        "QuantumVest transformed our investment strategy with AI-powered insights that consistently outperform the market.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Financial Advisor",
      quote:
        "The enterprise security and global reach make this platform perfect for institutional investors.",
      rating: 5,
    },
    {
      name: "Dr. Amara Okafor",
      role: "Investment Analyst",
      quote:
        "The legendary investor strategies feature helped us implement proven methodologies at scale.",
      rating: 5,
    },
  ];

  const stats = [
    {
      label: "Total Value Locked",
      value: "$2.3B",
      icon: <Vault className="h-5 w-5" />,
    },
    {
      label: "Active Investors",
      value: "50K+",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Countries Served",
      value: "195+",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      label: "Average Returns",
      value: "23.7%",
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  return (
    <>
      <SEOHead
        title="QuantumVest - Enterprise Investment Platform"
        description="Transform your investment strategy with AI-powered insights, legendary investor methodologies, and enterprise-grade security. Join thousands building sustainable wealth."
        keywords={[
          "investment platform",
          "ai investing",
          "portfolio optimization",
          "enterprise finance",
          "quantumvest",
          "wealth management",
          "financial technology",
        ]}
        canonicalUrl="/"
      />

      <SuperTechLayout>
        <div className="w-full overflow-x-hidden">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-6">
                  🚀 Welcome to the Future of Investing
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Transform Your
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                    Investment Strategy
                  </span>
                </h1>

                <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
                  Join thousands of investors using AI-powered insights,
                  legendary strategies, and enterprise-grade security to build
                  sustainable wealth across global markets.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Start Investing Today
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-4 text-lg border-2"
                    onClick={() => (window.location.href = "/pricing")}
                  >
                    <Activity className="h-5 w-5 mr-2" />
                    View Pricing Plans
                  </Button>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center mb-2 text-blue-600">
                        {stat.icon}
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Why Choose QuantumVest?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Experience the next generation of investment technology with
                  features designed for both individual investors and enterprise
                  institutions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-all duration-300 border-0 shadow-md"
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
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Trusted by Investment Professionals
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  See what leading investors and financial professionals say
                  about QuantumVest.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-white border-0 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <blockquote className="text-gray-700 mb-4 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.role}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Transform Your Investment Future?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of successful investors who trust QuantumVest for
                their portfolio management and wealth building strategies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
                  onClick={() =>
                    (window.location.href = "/platform-navigation")
                  }
                >
                  <Target className="h-5 w-5 mr-2" />
                  Explore Platform
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
                  onClick={() =>
                    (window.location.href = "/enterprise-subscriptions")
                  }
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Enterprise Solutions
                </Button>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-6 text-sm opacity-80">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>No Setup Fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Enterprise Security</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </SuperTechLayout>
    </>
  );
};

export default LandingPage;
