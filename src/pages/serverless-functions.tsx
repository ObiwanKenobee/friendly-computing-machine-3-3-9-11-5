/**
 * Serverless Functions Demo Page
 * Showcases operational serverless infrastructure capabilities
 */

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { SEOHead } from "../components/SEOHead";
import ServerlessInfrastructurePanel from "../components/ServerlessInfrastructurePanel";
import { serverlessFunctions } from "../services/serverlessFunctionsService";
import {
  Server,
  Zap,
  Globe,
  BarChart3,
  Activity,
  Code,
  Database,
  CloudLightning,
  ArrowRight,
  CheckCircle,
  Play,
  Layers,
  Cpu,
  Network,
} from "lucide-react";

const ServerlessFunctionsPage: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<"loading" | "online" | "offline">(
    "loading",
  );
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [performanceSummary, setPerformanceSummary] = useState<any>(null);

  useEffect(() => {
    checkAPIStatus();
    loadPerformanceData();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const status = await serverlessFunctions.getInfrastructureStatus();
      setApiStatus(status ? "online" : "offline");
    } catch (error) {
      setApiStatus("offline");
    }
  };

  const loadPerformanceData = async () => {
    try {
      const [optimization, summary] = await Promise.all([
        serverlessFunctions.getOptimization(),
        serverlessFunctions.getPerformanceSummary(),
      ]);

      setOptimizationResult(optimization);
      setPerformanceSummary(summary);
    } catch (error) {
      console.error("Failed to load performance data:", error);
    }
  };

  const testServerlessFunction = async (functionName: string) => {
    try {
      switch (functionName) {
        case "status":
          const status = await serverlessFunctions.getInfrastructureStatus();
          alert(
            `Status API Response:\n${JSON.stringify(status?.metrics, null, 2)}`,
          );
          break;
        case "optimize":
          const result = await serverlessFunctions.optimizeAllEngines();
          alert(`Optimization Result:\n${result.message}`);
          break;
        case "analytics":
          const analytics = await serverlessFunctions.getAnalytics("1h");
          alert(
            `Analytics API Response:\n${JSON.stringify(analytics?.summary, null, 2)}`,
          );
          break;
        case "route":
          const route = await serverlessFunctions.getOptimalRoute();
          alert(
            `Route Optimization:\n${JSON.stringify(route?.recommendations?.primary, null, 2)}`,
          );
          break;
      }
    } catch (error) {
      alert(`API Error: ${error}`);
    }
  };

  const serverlessFunctionsList = [
    {
      name: "Infrastructure Status",
      endpoint: "/api/infrastructure/status",
      description: "Real-time infrastructure health and performance metrics",
      method: "GET",
      features: [
        "Region monitoring",
        "Engine status",
        "Performance metrics",
        "System alerts",
      ],
      testFunction: "status",
    },
    {
      name: "Engine Control",
      endpoint: "/api/infrastructure/control",
      description: "Control and optimize infrastructure engines",
      method: "POST",
      features: [
        "Start/stop engines",
        "Target regions",
        "Configure settings",
        "Batch operations",
      ],
      testFunction: "optimize",
    },
    {
      name: "Performance Analytics",
      endpoint: "/api/infrastructure/analytics",
      description: "Detailed analytics and optimization insights",
      method: "GET",
      features: [
        "Time-based metrics",
        "Engine performance",
        "Trend analysis",
        "Improvement tracking",
      ],
      testFunction: "analytics",
    },
    {
      name: "Route Optimization",
      endpoint: "/api/infrastructure/optimize",
      description: "Intelligent routing recommendations",
      method: "POST",
      features: [
        "Geographic routing",
        "Performance optimization",
        "Cache strategies",
        "Cost analysis",
      ],
      testFunction: "route",
    },
  ];

  const architectureFeatures = [
    {
      title: "Real-time Monitoring",
      description: "Live infrastructure status with 30-second intervals",
      icon: <Activity className="h-6 w-6" />,
      benefits: ["Instant alerts", "Performance tracking", "Health monitoring"],
    },
    {
      title: "Intelligent Optimization",
      description: "AI-powered infrastructure optimization algorithms",
      icon: <Zap className="h-6 w-6" />,
      benefits: ["Auto-optimization", "Performance gains", "Cost reduction"],
    },
    {
      title: "Geographic Routing",
      description: "Location-based request routing and optimization",
      icon: <Globe className="h-6 w-6" />,
      benefits: ["Reduced latency", "Better UX", "Global reach"],
    },
    {
      title: "Scalable Architecture",
      description: "Serverless functions that scale automatically",
      icon: <Layers className="h-6 w-6" />,
      benefits: ["Auto-scaling", "Cost efficiency", "High availability"],
    },
  ];

  return (
    <>
      <SEOHead
        title="Serverless Functions - Infrastructure APIs | QuantumVest"
        description="Operational serverless functions for intelligent infrastructure management. Real-time monitoring, optimization, and control APIs."
        keywords={[
          "serverless functions",
          "infrastructure apis",
          "real-time monitoring",
          "serverless optimization",
          "infrastructure control",
          "performance analytics",
          "vercel functions",
          "operational apis",
        ]}
        canonicalUrl="/serverless-functions"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <CloudLightning className="h-8 w-8 text-blue-700" />
              </div>
              <div className="flex space-x-2">
                <Badge className="bg-blue-100 text-blue-800">Serverless</Badge>
                <Badge
                  className={`${apiStatus === "online" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {apiStatus === "loading"
                    ? "Checking..."
                    : apiStatus.toUpperCase()}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  Operational
                </Badge>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Serverless Infrastructure Functions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Operational serverless APIs powering intelligent infrastructure
              management with real-time monitoring, optimization, and control
              capabilities.
            </p>
          </div>

          {/* Performance Summary */}
          {performanceSummary && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>Live Performance Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {performanceSummary.totalOptimizations}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Optimizations
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {performanceSummary.averageImprovement.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Avg Improvement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {performanceSummary.systemHealth.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">System Health</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {performanceSummary.activeEngines}
                    </div>
                    <div className="text-sm text-gray-600">Active Engines</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="functions">Functions</TabsTrigger>
              <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {architectureFeatures.map((feature, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {feature.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {feature.description}
                      </p>
                      <ul className="space-y-1">
                        {feature.benefits.map((benefit, idx) => (
                          <li
                            key={idx}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {optimizationResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Network className="h-5 w-5 text-blue-600" />
                      <span>Current Route Optimization</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">
                          Recommended Route
                        </h4>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="font-medium">
                            {
                              optimizationResult.recommendations?.primary
                                ?.region
                            }
                          </div>
                          <div className="text-sm text-gray-600">
                            Latency:{" "}
                            {
                              optimizationResult.recommendations?.primary
                                ?.estimatedLatency
                            }
                            ms
                          </div>
                          <div className="text-sm text-green-600 mt-1">
                            {
                              optimizationResult.recommendations?.primary
                                ?.reason
                            }
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">
                          Optimization Impact
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Expected Improvement:</span>
                            <span className="font-medium text-green-600">
                              {
                                optimizationResult.analytics
                                  ?.expectedImprovement
                              }
                              %
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Reliability Score:</span>
                            <span className="font-medium">
                              {optimizationResult.analytics?.reliabilityScore}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cost Impact:</span>
                            <span className="font-medium">
                              {optimizationResult.analytics?.costImpact}x
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Functions Tab */}
            <TabsContent value="functions" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Serverless API Functions
                </h2>
                <p className="text-gray-600">
                  Production-ready serverless functions for infrastructure
                  management
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serverlessFunctionsList.map((func, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{func.name}</CardTitle>
                        <Badge variant="outline" className="font-mono text-xs">
                          {func.method}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-600 text-sm">
                          {func.description}
                        </p>

                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            Endpoint:
                          </div>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {func.endpoint}
                          </code>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            Features:
                          </div>
                          <ul className="space-y-1">
                            {func.features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-center space-x-2 text-sm"
                              >
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() =>
                            testServerlessFunction(func.testFunction)
                          }
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Test Function
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Live Monitoring Tab */}
            <TabsContent value="monitoring" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Live Infrastructure Monitoring
                </h2>
                <p className="text-gray-600">
                  Real-time serverless infrastructure monitoring and control
                </p>
              </div>

              <ServerlessInfrastructurePanel />
            </TabsContent>

            {/* Architecture Tab */}
            <TabsContent value="architecture" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Server className="h-5 w-5" />
                    <span>Serverless Architecture</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                          <Code className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold mb-2">
                          Serverless Functions
                        </h3>
                        <p className="text-sm text-gray-600">
                          Vercel Edge Functions providing instant response and
                          global distribution
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                          <Database className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Real-time Data</h3>
                        <p className="text-sm text-gray-600">
                          Live infrastructure metrics with intelligent caching
                          and optimization
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                          <Cpu className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Smart Processing</h3>
                        <p className="text-sm text-gray-600">
                          AI-powered optimization algorithms running on
                          serverless infrastructure
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-3">Technical Benefits</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ul className="space-y-2">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              Zero server management
                            </span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Automatic scaling</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              Global edge distribution
                            </span>
                          </li>
                        </ul>
                        <ul className="space-y-2">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              Pay-per-execution model
                            </span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Instant cold starts</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Built-in monitoring</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Center */}
          <div className="text-center mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() =>
                  window.open("/infrastructure-navigator", "_blank")
                }
              >
                View Snake Infrastructure
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => testServerlessFunction("status")}
              >
                Test Live APIs
              </Button>
              <Button variant="outline" size="lg" onClick={loadPerformanceData}>
                Refresh Data
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Experience real-time serverless infrastructure management
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServerlessFunctionsPage;
