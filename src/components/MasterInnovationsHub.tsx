import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Innovation {
  id: string;
  name: string;
  description: string;
  category:
    | "risk"
    | "prediction"
    | "optimization"
    | "trading"
    | "temporal"
    | "intelligence";
  status: "operational" | "experimental" | "development" | "maintenance";
  capabilities: string[];
  route: string;
  performance: number;
  complexity: number;
  lastUpdate: number;
  icon: string;
  color: string;
}

interface SystemMetric {
  name: string;
  value: number;
  status: "optimal" | "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
}

export function MasterInnovationsHub() {
  const [innovations, setInnovations] = useState<Innovation[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isSystemCheck, setIsSystemCheck] = useState(false);
  const [systemHealth, setSystemHealth] = useState(94.7);

  const initializeInnovations = (): Innovation[] => {
    return [
      {
        id: "quantum-risk-matrix",
        name: "Quantum Risk Assessment Matrix",
        description:
          "Multi-dimensional risk analysis powered by quantum computing algorithms with real-time 3D visualization",
        category: "risk",
        status: "operational",
        capabilities: [
          "3D Risk Visualization",
          "Real-time Scanning",
          "Multi-dimensional Analysis",
          "Risk Correlation Mapping",
        ],
        route: "/quantum-risk-matrix",
        performance: 97.3,
        complexity: 9,
        lastUpdate: Date.now() - 1800000,
        icon: "⚛️",
        color: "from-blue-400 to-purple-400",
      },
      {
        id: "neural-market-engine",
        name: "Neural Market Prediction Engine",
        description:
          "AI-powered market forecasting with deep neural network visualization and real-time training capabilities",
        category: "prediction",
        status: "operational",
        capabilities: [
          "Neural Network Visualization",
          "Market Predictions",
          "Real-time Training",
          "Pattern Recognition",
        ],
        route: "/neural-market-engine",
        performance: 94.8,
        complexity: 10,
        lastUpdate: Date.now() - 900000,
        icon: "🧠",
        color: "from-purple-400 to-pink-400",
      },
      {
        id: "hyper-dimensional-optimizer",
        name: "Hyper-Dimensional Portfolio Optimizer",
        description:
          "Multi-dimensional portfolio optimization across infinite parameter spaces with 4D visualization",
        category: "optimization",
        status: "experimental",
        capabilities: [
          "4D Visualization",
          "Portfolio Optimization",
          "Multi-dimensional Analysis",
          "Real-time Allocation",
        ],
        route: "/hyper-dimensional-optimizer",
        performance: 91.5,
        complexity: 10,
        lastUpdate: Date.now() - 600000,
        icon: "🌌",
        color: "from-cyan-400 to-purple-400",
      },
      {
        id: "quantum-trading-dashboard",
        name: "Quantum Trading Algorithms",
        description:
          "Advanced algorithmic trading powered by quantum computing principles with particle visualization",
        category: "trading",
        status: "operational",
        capabilities: [
          "Quantum Algorithms",
          "Particle Effects",
          "Real-time Trading",
          "Performance Metrics",
        ],
        route: "/quantum-trading-dashboard",
        performance: 96.1,
        complexity: 8,
        lastUpdate: Date.now() - 1200000,
        icon: "⚡",
        color: "from-blue-400 to-cyan-400",
      },
      {
        id: "temporal-market-analysis",
        name: "Temporal Market Analysis",
        description:
          "Time-travel through market data with multi-dimensional temporal analysis and prediction",
        category: "temporal",
        status: "development",
        capabilities: [
          "Time Navigation",
          "Temporal Predictions",
          "Historical Analysis",
          "Future Modeling",
        ],
        route: "/temporal-market-analysis",
        performance: 87.3,
        complexity: 9,
        lastUpdate: Date.now() - 300000,
        icon: "⏰",
        color: "from-indigo-400 to-blue-400",
      },
      {
        id: "meta-financial-hub",
        name: "Meta-Financial Intelligence Hub",
        description:
          "Cross-platform financial data aggregation and intelligence synthesis from multiple sources",
        category: "intelligence",
        status: "operational",
        capabilities: [
          "Data Aggregation",
          "Intelligence Synthesis",
          "Platform Integration",
          "Signal Processing",
        ],
        route: "/meta-financial-hub",
        performance: 93.7,
        complexity: 7,
        lastUpdate: Date.now() - 450000,
        icon: "🌐",
        color: "from-purple-400 to-cyan-400",
      },
    ];
  };

  const generateSystemMetrics = (): SystemMetric[] => {
    return [
      {
        name: "Quantum Coherence",
        value: 97.2,
        status: "optimal",
        trend: "up",
      },
      {
        name: "Neural Processing",
        value: 94.8,
        status: "optimal",
        trend: "stable",
      },
      { name: "Data Throughput", value: 89.3, status: "good", trend: "up" },
      {
        name: "Algorithm Efficiency",
        value: 92.6,
        status: "optimal",
        trend: "up",
      },
      {
        name: "System Stability",
        value: 96.1,
        status: "optimal",
        trend: "stable",
      },
      {
        name: "Prediction Accuracy",
        value: 87.4,
        status: "good",
        trend: "down",
      },
      { name: "Resource Usage", value: 73.8, status: "warning", trend: "up" },
      {
        name: "Network Latency",
        value: 95.3,
        status: "optimal",
        trend: "stable",
      },
    ];
  };

  useEffect(() => {
    setInnovations(initializeInnovations());
    setSystemMetrics(generateSystemMetrics());

    const interval = setInterval(() => {
      setSystemHealth((prev) =>
        Math.max(85, Math.min(99, prev + (Math.random() - 0.5) * 2)),
      );

      setSystemMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Math.max(
            60,
            Math.min(100, metric.value + (Math.random() - 0.5) * 3),
          ),
          trend:
            Math.random() > 0.7
              ? Math.random() > 0.5
                ? "up"
                : "down"
              : "stable",
        })),
      );

      setInnovations((prev) =>
        prev.map((innovation) => ({
          ...innovation,
          performance: Math.max(
            80,
            Math.min(100, innovation.performance + (Math.random() - 0.5) * 2),
          ),
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const runSystemCheck = () => {
    setIsSystemCheck(true);
    setTimeout(() => setIsSystemCheck(false), 3000);
  };

  const filteredInnovations =
    selectedCategory === "all"
      ? innovations
      : innovations.filter((inn) => inn.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-600";
      case "experimental":
        return "bg-blue-600";
      case "development":
        return "bg-yellow-600";
      case "maintenance":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "text-green-400";
      case "good":
        return "text-blue-400";
      case "warning":
        return "text-yellow-400";
      case "critical":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      case "stable":
        return "→";
      default:
        return "→";
    }
  };

  const categories = [
    { id: "all", name: "All Innovations", icon: "🚀" },
    { id: "risk", name: "Risk Management", icon: "⚛️" },
    { id: "prediction", name: "AI Prediction", icon: "🧠" },
    { id: "optimization", name: "Optimization", icon: "🌌" },
    { id: "trading", name: "Trading", icon: "⚡" },
    { id: "temporal", name: "Temporal Analysis", icon: "⏰" },
    { id: "intelligence", name: "Intelligence", icon: "🌐" },
  ];

  const navigateToInnovation = (route: string) => {
    window.location.href = route;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Master Innovations Hub
          </h1>
          <p className="text-xl text-gray-300">
            Central command center for all QuantumVest financial innovations
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Badge className="bg-green-600 text-white text-lg px-4 py-2">
              System Health: {systemHealth.toFixed(1)}%
            </Badge>
            <Badge className="bg-blue-600 text-white text-lg px-4 py-2">
              Active Innovations:{" "}
              {innovations.filter((i) => i.status === "operational").length}
            </Badge>
            <Badge className="bg-purple-600 text-white text-lg px-4 py-2">
              Total Capabilities:{" "}
              {innovations.reduce(
                (sum, inn) => sum + inn.capabilities.length,
                0,
              )}
            </Badge>
          </div>
        </motion.div>

        {/* System Health Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {systemMetrics.map((metric, index) => (
            <Card
              key={metric.name}
              className="bg-slate-800/50 border-slate-700"
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">{metric.name}</span>
                    <span className="text-xs">
                      {getTrendIcon(metric.trend)}
                    </span>
                  </div>
                  <div
                    className={`text-lg font-bold ${getMetricStatusColor(metric.status)}`}
                  >
                    {metric.value.toFixed(1)}%
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>

          <Button
            onClick={runSystemCheck}
            disabled={isSystemCheck}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSystemCheck ? "Running System Check..." : "Run System Check"}
          </Button>
        </motion.div>

        {/* Innovations Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredInnovations.map((innovation, index) => (
              <motion.div
                key={innovation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <Card
                  className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 cursor-pointer h-full"
                  onClick={() => navigateToInnovation(innovation.route)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{innovation.icon}</div>
                        <div>
                          <CardTitle
                            className={`text-white bg-gradient-to-r ${innovation.color} bg-clip-text text-transparent`}
                          >
                            {innovation.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge
                              className={getStatusColor(innovation.status)}
                            >
                              {innovation.status}
                            </Badge>
                            <Badge variant="outline">
                              {innovation.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-gray-300">
                      {innovation.description}
                    </CardDescription>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Performance</span>
                        <div className="text-white font-medium">
                          {innovation.performance.toFixed(1)}%
                        </div>
                        <Progress
                          value={innovation.performance}
                          className="h-2 mt-1"
                        />
                      </div>
                      <div>
                        <span className="text-gray-400">Complexity</span>
                        <div className="flex items-center space-x-1 mt-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-4 rounded-sm ${
                                i < innovation.complexity
                                  ? "bg-purple-400"
                                  : "bg-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm">
                        Core Capabilities
                      </span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {innovation.capabilities.map((capability) => (
                          <Badge
                            key={capability}
                            variant="secondary"
                            className="text-xs"
                          >
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>
                        Last Update:{" "}
                        {new Date(innovation.lastUpdate).toLocaleTimeString()}
                      </span>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Launch →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                System Status & Performance
              </CardTitle>
              <CardDescription>
                Real-time monitoring of all innovation components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">
                    Overall System Health
                  </span>
                  <div className="flex items-center space-x-4">
                    <Progress value={systemHealth} className="w-64" />
                    <span className="text-white font-bold">
                      {systemHealth.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {innovations.map((innovation) => (
                    <div
                      key={innovation.id}
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{innovation.icon}</span>
                        <span className="text-white text-sm">
                          {innovation.name.split(" ")[0]}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={innovation.performance}
                          className="w-16 h-2"
                        />
                        <span className="text-xs text-gray-300">
                          {innovation.performance.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Check Effect */}
        <AnimatePresence>
          {isSystemCheck && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-purple-500/10 flex items-center justify-center z-50"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="text-4xl font-bold text-purple-400"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 5 }}
                >
                  System Check in Progress
                </motion.div>
                <motion.div
                  className="text-lg text-white"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Verifying all innovation components...
                </motion.div>
                <Progress value={66} className="w-64 mx-auto" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
