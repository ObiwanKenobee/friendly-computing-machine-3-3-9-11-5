/**
 * QuantumVest Enterprise Landing Page
 * Complete landing page with enterprise header and footer architecture
 */

import React from "react";
import EnterpriseHeader from "./EnterpriseHeader";
import EnterpriseFooter from "./EnterpriseFooter";
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
  CheckCircle,
  Star,
  Sparkles,
  Activity,
  Vault,
  Brain,
  Heart,
  Target,
  Building,
  Leaf,
  BarChart3,
  Code,
} from "lucide-react";

const QuantumVestEnterpriseLanding: React.FC = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Enterprise Security",
      description:
        "Military-grade security with Cisco XDR protection and real-time threat monitoring across all vault operations.",
      category: "Security",
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "AI-Powered Insights",
      description:
        "Advanced AI advisor providing personalized investment strategies, ritual-aware agents, and quantum risk analysis.",
      category: "AI Technology",
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      title: "Global Sovereign Finance",
      description:
        "Multi-language platform across 195+ regions with cultural sovereignty and localized investment opportunities.",
      category: "Global Reach",
    },
    {
      icon: <Vault className="h-8 w-8 text-orange-600" />,
      title: "AssetVaults™ Technology",
      description:
        "Revolutionary tokenization of real estate, carbon bonds, cultural assets, and perpetual funding mechanisms.",
      category: "Innovation",
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Community-Driven Finance",
      description:
        "Diaspora vaults, village funds, co-funding projects, and tribal finance solutions for collective wealth building.",
      category: "Social Impact",
    },
    {
      icon: <Code className="h-8 w-8 text-cyan-600" />,
      title: "Developer Ecosystem",
      description:
        "Comprehensive SDK, VaultDNA generator, public APIs, and webhooks for seamless financial integration.",
      category: "Technology",
    },
  ];

  const stats = [
    {
      label: "Total Value Locked",
      value: "$2.3B",
      icon: <Vault className="h-6 w-6" />,
      color: "text-blue-600",
    },
    {
      label: "Active Global Vaults",
      value: "247",
      icon: <Building className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      label: "Countries Served",
      value: "195+",
      icon: <Globe className="h-6 w-6" />,
      color: "text-purple-600",
    },
    {
      label: "Carbon Offset",
      value: "1.2M tons",
      icon: <Leaf className="h-6 w-6" />,
      color: "text-emerald-600",
    },
    {
      label: "Active Investors",
      value: "50K+",
      icon: <Users className="h-6 w-6" />,
      color: "text-orange-600",
    },
    {
      label: "Average Returns",
      value: "23.7%",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-rose-600",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Amara Okafor",
      role: "Chief Investment Officer, African Development Bank",
      company: "AfDB",
      quote:
        "QuantumVest's cultural sovereignty approach and diaspora vault technology revolutionized our cross-border investment strategy. The AI-powered insights consistently outperform traditional models.",
      rating: 5,
      avatar: "AO",
    },
    {
      name: "Sarah Chen",
      role: "Managing Partner",
      company: "Singapore Sovereign Wealth Fund",
      quote:
        "The enterprise security and quantum-level portfolio optimization make this platform perfect for institutional-scale investments. Their ritual-aware agents provide unprecedented market intelligence.",
      rating: 5,
      avatar: "SC",
    },
    {
      name: "Carlos Rodriguez",
      role: "Director of Innovation",
      company: "Inter-American Development Bank",
      quote:
        "The village vault technology and micro-crowdfunding capabilities enabled us to reach previously underserved communities while maintaining institutional-grade security and compliance.",
      rating: 5,
      avatar: "CR",
    },
  ];

  const solutions = [
    {
      title: "Tokenization Layer",
      description:
        "AssetVaults™, Real Estate, Carbon Bonds, Cultural Heritage",
      icon: <Vault className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "DeFi Infrastructure",
      description: "Micro-crowdfunding, Perpetual Funds, Yield Optimization",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "AI Financial Engine",
      description: "Risk Analysis, Portfolio Optimization, Ritual Intelligence",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Social Finance",
      description: "Diaspora Vaults, Community Funding, Cultural Investment",
      icon: <Users className="h-6 w-6" />,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <EnterpriseHeader />

      {/* Mobile padding for bottom nav */}
      <div className="pb-16 lg:pb-0">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-6 text-lg px-6 py-2">
                🌍 Sovereign Finance Protocol
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
                Re-encoding Wealth
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent block">
                  For a Living World
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
                The world's first quantum-native financial protocol combining
                AI-powered vault technology, cultural sovereignty, and
                sustainable wealth creation across 195+ countries and 7,000+
                languages.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-xl"
                  onClick={() => (window.location.href = "/invest")}
                >
                  <Sparkles className="h-6 w-6 mr-3" />
                  Start Your Vault Journey
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 py-4 text-xl border-2 border-gray-300 hover:border-blue-600"
                  onClick={() => (window.location.href = "/demo")}
                >
                  <Activity className="h-6 w-6 mr-3" />
                  Request Enterprise Demo
                </Button>
              </div>

              {/* Real-time Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-20">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center group hover:scale-105 transition-transform duration-300"
                  >
                    <div
                      className={`flex items-center justify-center mb-3 ${stat.color}`}
                    >
                      {stat.icon}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Quantum Finance Protocol Stack
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A comprehensive suite of financial technologies designed for the
                post-scarcity economy, combining traditional wisdom with
                quantum-native innovation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {solutions.map((solution, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden group"
                >
                  <CardHeader className="text-center pb-2">
                    <div
                      className={`w-16 h-16 ${solution.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {solution.icon}
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {solution.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      {solution.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Why Choose QuantumVest?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the next generation of financial technology with
                features designed for both individual wealth builders and
                institutional-scale operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full"
                >
                  <CardHeader>
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        {feature.icon}
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {feature.category}
                        </Badge>
                        <CardTitle className="text-xl">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Trusted by Global Institutions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Leading development banks, sovereign wealth funds, and
                institutional investors rely on QuantumVest for their most
                critical financial operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="bg-white border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                >
                  <CardContent className="pt-8">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.role}
                        </div>
                        <div className="text-sm text-blue-600 font-medium">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
          <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl lg:text-6xl font-bold mb-8">
              Ready to Transform Global Finance?
            </h2>
            <p className="text-xl sm:text-2xl mb-12 opacity-90 leading-relaxed">
              Join the sovereign finance revolution. Build sustainable wealth
              that honors cultural wisdom while leveraging quantum-native
              technology for exponential impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-xl font-semibold"
                onClick={() => (window.location.href = "/enterprise-demo")}
              >
                <Target className="h-6 w-6 mr-3" />
                Get Enterprise Demo
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-xl font-semibold"
                onClick={() => (window.location.href = "/vault-builder")}
              >
                <Heart className="h-6 w-6 mr-3" />
                Build Your First Vault
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>24/7 Global Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Cultural Sovereignty</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Quantum-Native Technology</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <EnterpriseFooter />
    </div>
  );
};

export default QuantumVestEnterpriseLanding;
