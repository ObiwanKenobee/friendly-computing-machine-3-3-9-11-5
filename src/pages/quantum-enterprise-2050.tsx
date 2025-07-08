/**
 * Quantum Enterprise 2050 Page
 * Next-generation investment platform with quantum computing
 */

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { SEOHead } from "../components/SEOHead";
import { ProtectedFeature } from "../components/SubscriptionGating";
import {
  Atom,
  Brain,
  Zap,
  Rocket,
  Eye,
  Target,
  BarChart3,
  Globe,
  Cpu,
  Database,
  Network,
  Shield,
  TrendingUp,
  Lightbulb,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";

const QuantumEnterprise2050: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState("quantum-computing");
  const [quantumMetrics, setQuantumMetrics] = useState({
    processingSpeed: 98.7,
    algorithmAccuracy: 94.2,
    predictionConfidence: 91.8,
    riskCalculation: 96.4,
  });

  const quantumModules = [
    {
      id: "quantum-computing",
      name: "Quantum Computing Core",
      description:
        "Leverage quantum algorithms for portfolio optimization and risk calculation",
      icon: <Atom className="h-8 w-8 text-purple-600" />,
      capabilities: [
        "Quantum Portfolio Optimization",
        "Complex Risk Modeling",
        "Real-time Market Simulation",
        "Parallel Universe Scenarios",
      ],
      performance: "10,000x faster than classical",
      status: "Active",
      complexity: "Advanced",
    },
    {
      id: "future-tech-analysis",
      name: "Future Tech Analysis",
      description:
        "AI-powered analysis of emerging technologies and their investment potential",
      icon: <Rocket className="h-8 w-8 text-blue-600" />,
      capabilities: [
        "Technology Trend Prediction",
        "Innovation Impact Assessment",
        "Startup Evaluation Engine",
        "Patent Analysis System",
      ],
      performance: "15-year forecast accuracy",
      status: "Beta",
      complexity: "Intermediate",
    },
    {
      id: "scenario-modeling",
      name: "Scenario Modeling Engine",
      description:
        "Model infinite market scenarios and their probability distributions",
      icon: <Eye className="h-8 w-8 text-green-600" />,
      capabilities: [
        "Monte Carlo Quantum Simulation",
        "Black Swan Event Prediction",
        "Multi-dimensional Analysis",
        "Probability Distribution Mapping",
      ],
      performance: "1M+ scenarios per second",
      status: "Active",
      complexity: "Expert",
    },
    {
      id: "neural-networks",
      name: "Quantum Neural Networks",
      description:
        "Next-generation AI that learns from quantum superposition states",
      icon: <Brain className="h-8 w-8 text-orange-600" />,
      capabilities: [
        "Quantum Machine Learning",
        "Superposition Pattern Recognition",
        "Entanglement-based Predictions",
        "Quantum Error Correction",
      ],
      performance: "Near-perfect accuracy",
      status: "Research",
      complexity: "Experimental",
    },
  ];

  const futureInvestments = [
    {
      sector: "Quantum Computing",
      companies: 23,
      totalValue: "$2.4B",
      growth: "+847%",
      timeline: "2025-2030",
      confidence: 92,
    },
    {
      sector: "Space Technology",
      companies: 18,
      totalValue: "$1.8B",
      growth: "+623%",
      timeline: "2026-2035",
      confidence: 87,
    },
    {
      sector: "Biotech & Longevity",
      companies: 31,
      totalValue: "$3.1B",
      growth: "+1,234%",
      timeline: "2027-2040",
      confidence: 89,
    },
    {
      sector: "Fusion Energy",
      companies: 12,
      totalValue: "$950M",
      growth: "+456%",
      timeline: "2030-2050",
      confidence: 78,
    },
    {
      sector: "Brain-Computer Interface",
      companies: 8,
      totalValue: "$680M",
      growth: "+789%",
      timeline: "2028-2045",
      confidence: 83,
    },
    {
      sector: "Nanotechnology",
      companies: 15,
      totalValue: "$1.2B",
      growth: "+567%",
      timeline: "2025-2035",
      confidence: 85,
    },
  ];

  const currentModule = quantumModules.find((m) => m.id === selectedModule);

  const enterpriseCapabilities = [
    {
      title: "Quantum Portfolio Optimization",
      description:
        "Use quantum algorithms to find optimal portfolio allocations across infinite possibilities",
      icon: <Target className="h-6 w-6" />,
      improvement: "10,000x faster calculations",
    },
    {
      title: "Future Market Simulation",
      description:
        "Simulate market conditions decades into the future with quantum precision",
      icon: <Globe className="h-6 w-6" />,
      improvement: "99.7% prediction accuracy",
    },
    {
      title: "Risk Quantum Modeling",
      description:
        "Model complex risk scenarios using quantum superposition principles",
      icon: <Shield className="h-6 w-6" />,
      improvement: "1M+ risk scenarios",
    },
    {
      title: "Technology Trend Prediction",
      description:
        "AI-powered analysis of emerging technologies and breakthrough timelines",
      icon: <Lightbulb className="h-6 w-6" />,
      improvement: "15-year forecast horizon",
    },
  ];

  return (
    <>
      <SEOHead
        title="Quantum Enterprise 2050 | QuantumVest"
        description="Next-generation investment platform with quantum computing, future tech analysis, and scenario modeling for enterprise clients."
        keywords={[
          "quantum computing",
          "future technology investing",
          "quantum portfolio optimization",
          "scenario modeling",
          "enterprise quantum finance",
          "future tech analysis",
          "quantum machine learning",
          "next-generation investment",
        ]}
        canonicalUrl="/quantum-enterprise-2050"
      />

      <ProtectedFeature
        requiredTier="enterprise"
        featureName="Quantum Enterprise 2050"
        description="Next-generation investment platform powered by quantum computing and future technology analysis."
        benefits={[
          "Quantum computing portfolio optimization",
          "Future technology trend analysis and prediction",
          "Advanced scenario modeling with quantum algorithms",
          "Quantum neural networks for pattern recognition",
          "Multi-dimensional risk analysis",
          "Technology breakthrough timeline forecasting",
          "Quantum machine learning capabilities",
          "Enterprise-grade quantum infrastructure",
        ]}
      >
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full mr-4">
                  <Atom className="h-8 w-8 text-purple-700" />
                </div>
                <div className="flex space-x-2">
                  <Badge className="bg-purple-100 text-purple-800">
                    Enterprise
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">New</Badge>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Quantum Enterprise 2050
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Next-generation investment platform powered by quantum
                computing, future tech analysis, and scenario modeling
              </p>
            </div>

            {/* Quantum Metrics Dashboard */}
            <Card className="mb-8 bg-gradient-to-r from-purple-100 to-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-6 w-6 text-purple-600" />
                  <span>Quantum System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Object.entries(quantumMetrics).map(([metric, value]) => (
                    <div key={metric} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium capitalize">
                          {metric.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="text-sm font-bold">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quantum Modules */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Quantum Investment Modules
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {quantumModules.map((module) => (
                  <Card
                    key={module.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedModule === module.id
                        ? "ring-2 ring-purple-500 shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedModule(module.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        {module.icon}
                        <div>
                          <CardTitle className="text-lg">
                            {module.name}
                          </CardTitle>
                          <div className="flex space-x-1 mt-1">
                            <Badge
                              className={
                                module.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : module.status === "Beta"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {module.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-2">
                        {module.description}
                      </p>
                      <p className="text-xs text-gray-600">
                        Performance: {module.performance}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Module Details */}
              {currentModule && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {currentModule.icon}
                        <div>
                          <CardTitle className="text-2xl">
                            {currentModule.name}
                          </CardTitle>
                          <p className="text-gray-600">
                            {currentModule.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            currentModule.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : currentModule.status === "Beta"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {currentModule.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {currentModule.complexity}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Capabilities
                        </h3>
                        <ul className="space-y-2">
                          {currentModule.capabilities.map((capability, idx) => (
                            <li
                              key={idx}
                              className="flex items-start space-x-2"
                            >
                              <Zap className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">
                                {capability}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Performance
                          </h3>
                          <p className="text-lg font-bold text-purple-600">
                            {currentModule.performance}
                          </p>
                        </div>
                        <Button
                          className="w-full"
                          disabled={currentModule.status === "Research"}
                        >
                          {currentModule.status === "Research"
                            ? "Coming Soon"
                            : "Launch Module"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Future Technology Investments */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Future Technology Investment Pipeline
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {futureInvestments.map((investment, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {investment.sector}
                        </CardTitle>
                        <Badge className="bg-blue-100 text-blue-800">
                          {investment.confidence}% confidence
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Companies</p>
                          <p className="text-xl font-bold">
                            {investment.companies}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Value</p>
                          <p className="text-xl font-bold">
                            {investment.totalValue}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Projected Growth:
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            {investment.growth}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Timeline:
                          </span>
                          <span className="text-sm font-medium">
                            {investment.timeline}
                          </span>
                        </div>
                      </div>
                      <Progress value={investment.confidence} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Enterprise Capabilities */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Enterprise Quantum Capabilities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enterpriseCapabilities.map((capability, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          {capability.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {capability.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {capability.description}
                          </p>
                          <Badge className="bg-green-100 text-green-800">
                            {capability.improvement}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Future Timeline */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <span>Technology Breakthrough Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">
                      2025: Quantum Advantage in Finance
                    </span>
                    <Badge className="bg-blue-100 text-blue-800">
                      95% probability
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">
                      2027: AI-Quantum Hybrid Systems
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      87% probability
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">
                      2030: Universal Quantum Computing
                    </span>
                    <Badge className="bg-purple-100 text-purple-800">
                      73% probability
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">
                      2035: Quantum Internet Infrastructure
                    </span>
                    <Badge className="bg-orange-100 text-orange-800">
                      68% probability
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Center */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group">
                  Launch Quantum Dashboard
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg">
                  Schedule Quantum Demo
                </Button>
                <Button variant="outline" size="lg">
                  Download Whitepaper
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Estimated setup time: ~10 minutes | Target: Future-tech
                enterprises
              </p>
            </div>
          </div>
        </div>
      </ProtectedFeature>
    </>
  );
};

export default QuantumEnterprise2050;
