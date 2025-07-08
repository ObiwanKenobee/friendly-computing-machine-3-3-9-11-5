/**
 * Real-time Architecture Monitor
 * Comprehensive dashboard showing how all architecture layers work together
 * Demonstrates the complete Agent → Memory Graph → On-Chain → AI Fabric ecosystem
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Activity,
  Brain,
  Database,
  Zap,
  Network,
  Users,
  TrendingUp,
  Shield,
  Globe,
  Cpu,
  Memory,
  HardDrive,
  Wifi,
  Battery,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowDown,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Settings,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Monitor,
  Server,
  Layers,
  GitBranch,
} from "lucide-react";

import { agentSwarmService } from "../services/agentSwarmService";
import { sharedMemoryGraphService } from "../services/sharedMemoryGraphService";
import { intentStreamService } from "../services/intentStreamService";
import { onChainLogicService } from "../services/onChainLogicService";
import { aiFabricService } from "../services/aiFabricService";

interface SystemHealth {
  overall: "healthy" | "degraded" | "critical";
  score: number;
  components: ComponentHealth[];
  bottlenecks: string[];
  recommendations: string[];
}

interface ComponentHealth {
  name: string;
  status: "healthy" | "warning" | "error";
  metrics: {
    performance: number;
    availability: number;
    errors: number;
    latency: number;
  };
  connections: Connection[];
}

interface Connection {
  target: string;
  strength: number;
  latency: number;
  throughput: number;
  status: "active" | "degraded" | "disconnected";
}

interface DataFlow {
  id: string;
  source: string;
  target: string;
  dataType: string;
  volume: number;
  latency: number;
  status: "flowing" | "congested" | "blocked";
  path: string[];
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  threshold: {
    warning: number;
    critical: number;
  };
  history: number[];
}

const ArchitectureMonitor: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: "healthy",
    score: 0.94,
    components: [],
    bottlenecks: [],
    recommendations: [],
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [dataFlows, setDataFlows] = useState<DataFlow[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<
    PerformanceMetric[]
  >([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null,
  );

  // Real-time metrics
  const [agentMetrics, setAgentMetrics] = useState({
    active: 6,
    processing: 23,
    collaboration: 0.92,
    avgLatency: 156,
    successRate: 0.96,
  });

  const [memoryGraphMetrics, setMemoryGraphMetrics] = useState({
    nodes: 1247,
    relationships: 3891,
    consensus: 0.94,
    syncLatency: 45,
    storageUsed: 2.3,
  });

  const [intentStreamMetrics, setIntentStreamMetrics] = useState({
    throughput: 47,
    backpressure: false,
    activeStreams: 3,
    queueDepth: 12,
    avgProcessingTime: 289,
  });

  const [onChainMetrics, setOnChainMetrics] = useState({
    contracts: 12,
    transactions: 89,
    gasOptimization: 0.78,
    deploymentSuccess: 0.98,
    avgBlockTime: 15,
  });

  const [aiFabricMetrics, setAiFabricMetrics] = useState({
    nodes: 10,
    accuracy: 0.89,
    learningVelocity: 0.76,
    federatedSessions: 2,
    crossSystemInsights: 8,
  });

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        updateSystemMetrics();
        updateDataFlows();
        updatePerformanceMetrics();
        checkSystemHealth();
      }, 2000); // Update every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const updateSystemMetrics = useCallback(() => {
    // Simulate real-time metric updates
    setAgentMetrics((prev) => ({
      active: Math.max(1, prev.active + Math.floor(Math.random() * 3) - 1),
      processing: Math.max(
        0,
        prev.processing + Math.floor(Math.random() * 5) - 2,
      ),
      collaboration: Math.min(
        1,
        Math.max(0.7, prev.collaboration + (Math.random() - 0.5) * 0.05),
      ),
      avgLatency: Math.max(
        50,
        prev.avgLatency + Math.floor(Math.random() * 20) - 10,
      ),
      successRate: Math.min(
        1,
        Math.max(0.85, prev.successRate + (Math.random() - 0.5) * 0.02),
      ),
    }));

    setMemoryGraphMetrics((prev) => ({
      nodes: prev.nodes + Math.floor(Math.random() * 3),
      relationships: prev.relationships + Math.floor(Math.random() * 8),
      consensus: Math.min(
        1,
        Math.max(0.85, prev.consensus + (Math.random() - 0.5) * 0.03),
      ),
      syncLatency: Math.max(
        20,
        prev.syncLatency + Math.floor(Math.random() * 10) - 5,
      ),
      storageUsed: Math.max(1, prev.storageUsed + (Math.random() - 0.5) * 0.1),
    }));

    setIntentStreamMetrics((prev) => ({
      throughput: Math.max(
        10,
        prev.throughput + Math.floor(Math.random() * 8) - 4,
      ),
      backpressure: Math.random() < 0.05,
      activeStreams: Math.max(
        1,
        prev.activeStreams +
          (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0),
      ),
      queueDepth: Math.max(
        0,
        prev.queueDepth + Math.floor(Math.random() * 4) - 2,
      ),
      avgProcessingTime: Math.max(
        100,
        prev.avgProcessingTime + Math.floor(Math.random() * 50) - 25,
      ),
    }));

    setOnChainMetrics((prev) => ({
      contracts: prev.contracts + (Math.random() > 0.95 ? 1 : 0),
      transactions: prev.transactions + Math.floor(Math.random() * 3),
      gasOptimization: Math.min(
        1,
        Math.max(0.6, prev.gasOptimization + (Math.random() - 0.5) * 0.05),
      ),
      deploymentSuccess: Math.min(
        1,
        Math.max(0.9, prev.deploymentSuccess + (Math.random() - 0.5) * 0.01),
      ),
      avgBlockTime: Math.max(
        10,
        prev.avgBlockTime + Math.floor(Math.random() * 4) - 2,
      ),
    }));

    setAiFabricMetrics((prev) => ({
      nodes: prev.nodes,
      accuracy: Math.min(
        1,
        Math.max(0.8, prev.accuracy + (Math.random() - 0.5) * 0.01),
      ),
      learningVelocity: Math.min(
        1,
        Math.max(0.5, prev.learningVelocity + (Math.random() - 0.5) * 0.03),
      ),
      federatedSessions: Math.max(
        0,
        prev.federatedSessions +
          (Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0),
      ),
      crossSystemInsights:
        prev.crossSystemInsights + (Math.random() > 0.8 ? 1 : 0),
    }));
  }, []);

  const updateDataFlows = useCallback(() => {
    const flows: DataFlow[] = [
      {
        id: "user_intent_flow",
        source: "User Interface",
        target: "Agent Swarm",
        dataType: "Intent",
        volume: Math.floor(Math.random() * 100) + 50,
        latency: Math.floor(Math.random() * 50) + 20,
        status: "flowing",
        path: ["User Interface", "Intent Stream", "Agent Swarm"],
      },
      {
        id: "agent_memory_flow",
        source: "Agent Swarm",
        target: "Memory Graph",
        dataType: "State Update",
        volume: Math.floor(Math.random() * 80) + 30,
        latency: Math.floor(Math.random() * 30) + 10,
        status: Math.random() > 0.9 ? "congested" : "flowing",
        path: ["Agent Swarm", "Shared Memory Graph"],
      },
      {
        id: "contract_deployment_flow",
        source: "Agent Swarm",
        target: "On-Chain Logic",
        dataType: "Contract",
        volume: Math.floor(Math.random() * 20) + 5,
        latency: Math.floor(Math.random() * 200) + 100,
        status: "flowing",
        path: ["Agent Swarm", "Smart Contract Deployer", "On-Chain Logic"],
      },
      {
        id: "ai_insight_flow",
        source: "AI Fabric",
        target: "Agent Swarm",
        dataType: "Insight",
        volume: Math.floor(Math.random() * 40) + 20,
        latency: Math.floor(Math.random() * 80) + 40,
        status: "flowing",
        path: ["AI Fabric", "Pattern Analysis", "Agent Swarm"],
      },
      {
        id: "cross_system_flow",
        source: "Memory Graph",
        target: "AI Fabric",
        dataType: "Learning Data",
        volume: Math.floor(Math.random() * 60) + 25,
        latency: Math.floor(Math.random() * 60) + 30,
        status: "flowing",
        path: ["Shared Memory Graph", "Knowledge Sync", "AI Fabric"],
      },
    ];

    setDataFlows(flows);
  }, []);

  const updatePerformanceMetrics = useCallback(() => {
    const metrics: PerformanceMetric[] = [
      {
        name: "System Throughput",
        value: agentMetrics.processing + intentStreamMetrics.throughput,
        unit: "ops/sec",
        trend: "up",
        threshold: { warning: 80, critical: 100 },
        history: Array(20)
          .fill(0)
          .map(() => Math.random() * 100),
      },
      {
        name: "Average Latency",
        value:
          (agentMetrics.avgLatency + intentStreamMetrics.avgProcessingTime) / 2,
        unit: "ms",
        trend: "stable",
        threshold: { warning: 300, critical: 500 },
        history: Array(20)
          .fill(0)
          .map(() => Math.random() * 400 + 100),
      },
      {
        name: "Success Rate",
        value: agentMetrics.successRate * 100,
        unit: "%",
        trend: "up",
        threshold: { warning: 95, critical: 90 },
        history: Array(20)
          .fill(0)
          .map(() => Math.random() * 10 + 90),
      },
      {
        name: "Consensus Rate",
        value: memoryGraphMetrics.consensus * 100,
        unit: "%",
        trend: "stable",
        threshold: { warning: 90, critical: 85 },
        history: Array(20)
          .fill(0)
          .map(() => Math.random() * 15 + 85),
      },
      {
        name: "AI Accuracy",
        value: aiFabricMetrics.accuracy * 100,
        unit: "%",
        trend: "up",
        threshold: { warning: 85, critical: 80 },
        history: Array(20)
          .fill(0)
          .map(() => Math.random() * 20 + 80),
      },
    ];

    setPerformanceMetrics(metrics);
  }, [agentMetrics, intentStreamMetrics, memoryGraphMetrics, aiFabricMetrics]);

  const checkSystemHealth = useCallback(() => {
    const components: ComponentHealth[] = [
      {
        name: "Agent Swarm",
        status:
          agentMetrics.successRate > 0.9
            ? "healthy"
            : agentMetrics.successRate > 0.8
              ? "warning"
              : "error",
        metrics: {
          performance: agentMetrics.collaboration * 100,
          availability:
            agentMetrics.active > 3 ? 100 : (agentMetrics.active / 6) * 100,
          errors: (1 - agentMetrics.successRate) * 100,
          latency: agentMetrics.avgLatency,
        },
        connections: [
          {
            target: "Memory Graph",
            strength: 0.9,
            latency: 45,
            throughput: 80,
            status: "active",
          },
          {
            target: "On-Chain Logic",
            strength: 0.8,
            latency: 120,
            throughput: 60,
            status: "active",
          },
          {
            target: "AI Fabric",
            strength: 0.85,
            latency: 70,
            throughput: 75,
            status: "active",
          },
        ],
      },
      {
        name: "Memory Graph",
        status:
          memoryGraphMetrics.consensus > 0.9
            ? "healthy"
            : memoryGraphMetrics.consensus > 0.85
              ? "warning"
              : "error",
        metrics: {
          performance: memoryGraphMetrics.consensus * 100,
          availability: 99.5,
          errors: 0.5,
          latency: memoryGraphMetrics.syncLatency,
        },
        connections: [
          {
            target: "Agent Swarm",
            strength: 0.9,
            latency: 45,
            throughput: 80,
            status: "active",
          },
          {
            target: "AI Fabric",
            strength: 0.88,
            latency: 35,
            throughput: 85,
            status: "active",
          },
        ],
      },
      {
        name: "Intent Streams",
        status:
          !intentStreamMetrics.backpressure &&
          intentStreamMetrics.queueDepth < 20
            ? "healthy"
            : "warning",
        metrics: {
          performance: intentStreamMetrics.throughput,
          availability: 98.8,
          errors: intentStreamMetrics.backpressure ? 5 : 0.2,
          latency: intentStreamMetrics.avgProcessingTime,
        },
        connections: [
          {
            target: "Agent Swarm",
            strength: 0.95,
            latency: 25,
            throughput: 90,
            status: "active",
          },
        ],
      },
      {
        name: "On-Chain Logic",
        status:
          onChainMetrics.deploymentSuccess > 0.95
            ? "healthy"
            : onChainMetrics.deploymentSuccess > 0.9
              ? "warning"
              : "error",
        metrics: {
          performance: onChainMetrics.gasOptimization * 100,
          availability: 99.9,
          errors: (1 - onChainMetrics.deploymentSuccess) * 100,
          latency: onChainMetrics.avgBlockTime * 1000,
        },
        connections: [
          {
            target: "Agent Swarm",
            strength: 0.8,
            latency: 120,
            throughput: 60,
            status: "active",
          },
        ],
      },
      {
        name: "AI Fabric",
        status:
          aiFabricMetrics.accuracy > 0.85
            ? "healthy"
            : aiFabricMetrics.accuracy > 0.8
              ? "warning"
              : "error",
        metrics: {
          performance: aiFabricMetrics.accuracy * 100,
          availability: 99.2,
          errors: 0.8,
          latency: 200,
        },
        connections: [
          {
            target: "Agent Swarm",
            strength: 0.85,
            latency: 70,
            throughput: 75,
            status: "active",
          },
          {
            target: "Memory Graph",
            strength: 0.88,
            latency: 35,
            throughput: 85,
            status: "active",
          },
        ],
      },
    ];

    const overallScore =
      components.reduce((sum, comp) => sum + comp.metrics.performance, 0) /
      components.length /
      100;
    const healthyComponents = components.filter(
      (c) => c.status === "healthy",
    ).length;

    setSystemHealth({
      overall:
        healthyComponents === components.length
          ? "healthy"
          : healthyComponents >= components.length * 0.8
            ? "degraded"
            : "critical",
      score: overallScore,
      components,
      bottlenecks: components
        .filter((c) => c.status !== "healthy")
        .map((c) => c.name),
      recommendations: [
        "Monitor agent collaboration scores",
        "Optimize memory graph sync latency",
        "Scale intent processing capacity",
      ],
    });
  }, [
    agentMetrics,
    memoryGraphMetrics,
    intentStreamMetrics,
    onChainMetrics,
    aiFabricMetrics,
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Architecture Monitor
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Real-time monitoring of the Agent → Memory Graph → On-Chain → AI
              Fabric ecosystem
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className={`${getStatusColor(systemHealth.overall)} border`}>
              {getStatusIcon(systemHealth.overall)}
              <span className="ml-1 capitalize">{systemHealth.overall}</span>
            </Badge>

            <Button
              onClick={() => setIsMonitoring(!isMonitoring)}
              variant={isMonitoring ? "destructive" : "default"}
              size="sm"
            >
              {isMonitoring ? (
                <>
                  <PauseCircle className="h-4 w-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-1" />
                  Resume
                </>
              )}
            </Button>
          </div>
        </div>

        {/* System Health Overview */}
        <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-6 w-6 mr-2 text-blue-600" />
              System Health Overview
            </CardTitle>
            <CardDescription>
              Real-time health monitoring across all architecture layers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {systemHealth.components.map((component) => (
                <Card
                  key={component.name}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedComponent === component.name
                      ? "ring-2 ring-blue-500"
                      : ""
                  } ${getStatusColor(component.status)} border`}
                  onClick={() => setSelectedComponent(component.name)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {component.name}
                      </span>
                      {getStatusIcon(component.status)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Performance:</span>
                        <span>{component.metrics.performance.toFixed(1)}%</span>
                      </div>
                      <Progress
                        value={component.metrics.performance}
                        className="h-1"
                      />

                      <div className="flex justify-between text-xs">
                        <span>Latency:</span>
                        <span>{component.metrics.latency.toFixed(0)}ms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Overall System Score */}
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Overall System Score</h4>
                <span className="text-2xl font-bold">
                  {(systemHealth.score * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={systemHealth.score * 100} className="h-3" />

              {systemHealth.bottlenecks.length > 0 && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Bottlenecks detected:</strong>{" "}
                    {systemHealth.bottlenecks.join(", ")}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Monitoring Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <Activity className="h-4 w-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="dataflows">
              <ArrowRight className="h-4 w-4 mr-1" />
              Data Flows
            </TabsTrigger>
            <TabsTrigger value="components">
              <Layers className="h-4 w-4 mr-1" />
              Components
            </TabsTrigger>
            <TabsTrigger value="performance">
              <BarChart3 className="h-4 w-4 mr-1" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Brain className="h-4 w-4 mr-1" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Agent Swarm Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <Users className="h-5 w-5 mr-2" />
                    Agent Swarm
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Agents:</span>
                    <span className="font-medium">{agentMetrics.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Processing:</span>
                    <span className="font-medium">
                      {agentMetrics.processing}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Collaboration:</span>
                    <span className="font-medium">
                      {(agentMetrics.collaboration * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={agentMetrics.collaboration * 100}
                    className="h-2"
                  />
                </CardContent>
              </Card>

              {/* Memory Graph Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-700">
                    <Database className="h-5 w-5 mr-2" />
                    Memory Graph
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Nodes:</span>
                    <span className="font-medium">
                      {memoryGraphMetrics.nodes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Relationships:</span>
                    <span className="font-medium">
                      {memoryGraphMetrics.relationships.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Consensus:</span>
                    <span className="font-medium">
                      {(memoryGraphMetrics.consensus * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={memoryGraphMetrics.consensus * 100}
                    className="h-2"
                  />
                </CardContent>
              </Card>

              {/* Intent Stream Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Intent Streams
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Throughput:</span>
                    <span className="font-medium">
                      {intentStreamMetrics.throughput}/sec
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Streams:</span>
                    <span className="font-medium">
                      {intentStreamMetrics.activeStreams}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Queue Depth:</span>
                    <span className="font-medium">
                      {intentStreamMetrics.queueDepth}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (intentStreamMetrics.throughput / 100) * 100,
                    )}
                    className="h-2"
                  />
                  {intentStreamMetrics.backpressure && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      Backpressure
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {/* AI Fabric Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-indigo-700">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Fabric
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">AI Nodes:</span>
                    <span className="font-medium">{aiFabricMetrics.nodes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Accuracy:</span>
                    <span className="font-medium">
                      {(aiFabricMetrics.accuracy * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Learning:</span>
                    <span className="font-medium">
                      {(aiFabricMetrics.learningVelocity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={aiFabricMetrics.accuracy * 100}
                    className="h-2"
                  />
                </CardContent>
              </Card>
            </div>

            {/* System Topology */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="h-5 w-5 mr-2" />
                  System Architecture Topology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Agent Layer */}
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-white mb-2">
                        <Users className="h-8 w-8" />
                      </div>
                      <h4 className="font-medium">Agent Layer</h4>
                      <p className="text-xs text-gray-600">Autonomous Agents</p>
                      <Badge className="mt-1 bg-green-100 text-green-800">
                        {agentMetrics.active} Active
                      </Badge>
                    </div>

                    {/* Memory Graph */}
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto bg-purple-500 rounded-full flex items-center justify-center text-white mb-2">
                        <Database className="h-8 w-8" />
                      </div>
                      <h4 className="font-medium">Memory Graph</h4>
                      <p className="text-xs text-gray-600">Shared State</p>
                      <Badge className="mt-1 bg-green-100 text-green-800">
                        {memoryGraphMetrics.nodes} Nodes
                      </Badge>
                    </div>

                    {/* On-Chain Logic */}
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto bg-orange-500 rounded-full flex items-center justify-center text-white mb-2">
                        <Zap className="h-8 w-8" />
                      </div>
                      <h4 className="font-medium">On-Chain Logic</h4>
                      <p className="text-xs text-gray-600">Smart Contracts</p>
                      <Badge className="mt-1 bg-green-100 text-green-800">
                        {onChainMetrics.contracts} Contracts
                      </Badge>
                    </div>

                    {/* AI Fabric */}
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto bg-indigo-500 rounded-full flex items-center justify-center text-white mb-2">
                        <Brain className="h-8 w-8" />
                      </div>
                      <h4 className="font-medium">AI Fabric</h4>
                      <p className="text-xs text-gray-600">
                        Intelligence Layer
                      </p>
                      <Badge className="mt-1 bg-green-100 text-green-800">
                        {aiFabricMetrics.nodes} AI Nodes
                      </Badge>
                    </div>
                  </div>

                  {/* Connection Lines */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center space-x-8">
                      <ArrowRight className="h-6 w-6 text-blue-400" />
                      <ArrowRight className="h-6 w-6 text-purple-400" />
                      <ArrowRight className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Flows Tab */}
          <TabsContent value="dataflows" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Data Flows */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Real-time Data Flows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dataFlows.map((flow) => (
                      <div
                        key={flow.id}
                        className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-green-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <ArrowRight className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="font-medium text-sm">
                              {flow.source}
                            </span>
                          </div>
                          <Badge
                            className={
                              flow.status === "flowing"
                                ? "bg-green-100 text-green-800"
                                : flow.status === "congested"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {flow.status}
                          </Badge>
                        </div>

                        <div className="flex items-center mb-2">
                          <ArrowDown className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {flow.target}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Volume:</span>
                            <p className="font-medium">{flow.volume} KB/s</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Latency:</span>
                            <p className="font-medium">{flow.latency}ms</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <p className="font-medium">{flow.dataType}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Flow Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Flow Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Total Throughput</h4>
                      <div className="bg-blue-50 rounded p-3">
                        <p className="text-2xl font-bold text-blue-700">
                          {dataFlows.reduce(
                            (sum, flow) => sum + flow.volume,
                            0,
                          )}{" "}
                          KB/s
                        </p>
                        <p className="text-xs text-blue-600">
                          Across all flows
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Flow Health</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Flowing:</span>
                          <span className="font-medium text-green-600">
                            {
                              dataFlows.filter((f) => f.status === "flowing")
                                .length
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Congested:</span>
                          <span className="font-medium text-yellow-600">
                            {
                              dataFlows.filter((f) => f.status === "congested")
                                .length
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Blocked:</span>
                          <span className="font-medium text-red-600">
                            {
                              dataFlows.filter((f) => f.status === "blocked")
                                .length
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Average Latency</h4>
                      <div className="space-y-2">
                        {dataFlows.map((flow) => (
                          <div
                            key={flow.id}
                            className="flex justify-between text-sm"
                          >
                            <span>{flow.dataType}:</span>
                            <span className="font-medium">
                              {flow.latency}ms
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            {selectedComponent ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    {selectedComponent} - Detailed View
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedComponent(null)}
                    >
                      <ArrowRight className="h-3 w-3 mr-1 rotate-180" />
                      Back to Overview
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const component = systemHealth.components.find(
                      (c) => c.name === selectedComponent,
                    );
                    if (!component) return null;

                    return (
                      <div className="space-y-6">
                        {/* Component Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-blue-50 rounded p-3">
                            <p className="text-sm text-blue-600">Performance</p>
                            <p className="text-2xl font-bold text-blue-700">
                              {component.metrics.performance.toFixed(1)}%
                            </p>
                          </div>
                          <div className="bg-green-50 rounded p-3">
                            <p className="text-sm text-green-600">
                              Availability
                            </p>
                            <p className="text-2xl font-bold text-green-700">
                              {component.metrics.availability.toFixed(1)}%
                            </p>
                          </div>
                          <div className="bg-yellow-50 rounded p-3">
                            <p className="text-sm text-yellow-600">
                              Error Rate
                            </p>
                            <p className="text-2xl font-bold text-yellow-700">
                              {component.metrics.errors.toFixed(1)}%
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded p-3">
                            <p className="text-sm text-purple-600">Latency</p>
                            <p className="text-2xl font-bold text-purple-700">
                              {component.metrics.latency.toFixed(0)}ms
                            </p>
                          </div>
                        </div>

                        {/* Connections */}
                        <div>
                          <h4 className="font-medium mb-3">
                            Component Connections
                          </h4>
                          <div className="space-y-2">
                            {component.connections.map((conn, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 border rounded"
                              >
                                <div className="flex items-center">
                                  <ArrowRight className="h-4 w-4 mr-2 text-gray-400" />
                                  <span>{conn.target}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                  <span>
                                    Strength: {(conn.strength * 100).toFixed(0)}
                                    %
                                  </span>
                                  <span>Latency: {conn.latency}ms</span>
                                  <Badge
                                    className={getStatusColor(conn.status)}
                                  >
                                    {conn.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemHealth.components.map((component) => (
                  <Card
                    key={component.name}
                    className={`cursor-pointer transition-all hover:shadow-lg ${getStatusColor(component.status)} border`}
                    onClick={() => setSelectedComponent(component.name)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{component.name}</span>
                        {getStatusIcon(component.status)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            Performance:{" "}
                            {component.metrics.performance.toFixed(1)}%
                          </div>
                          <div>
                            Availability:{" "}
                            {component.metrics.availability.toFixed(1)}%
                          </div>
                          <div>
                            Errors: {component.metrics.errors.toFixed(1)}%
                          </div>
                          <div>
                            Latency: {component.metrics.latency.toFixed(0)}ms
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-600 mb-1">
                            Connections:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {component.connections.map((conn, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {conn.target}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {performanceMetrics.map((metric) => (
                <Card key={metric.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{metric.name}</span>
                      <Badge
                        className={
                          metric.value < metric.threshold.critical
                            ? "bg-red-100 text-red-800"
                            : metric.value < metric.threshold.warning
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {metric.trend === "up"
                          ? "↗"
                          : metric.trend === "down"
                            ? "↘"
                            : "→"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold">
                          {metric.value.toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-600">{metric.unit}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Warning:</span>
                          <span>
                            {metric.threshold.warning} {metric.unit}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Critical:</span>
                          <span>
                            {metric.threshold.critical} {metric.unit}
                          </span>
                        </div>
                      </div>

                      <div className="h-16 bg-gray-50 rounded p-2">
                        <div className="h-full flex items-end space-x-1">
                          {metric.history.slice(-10).map((value, index) => (
                            <div
                              key={index}
                              className="bg-blue-500 rounded-sm flex-1"
                              style={{
                                height: `${(value / Math.max(...metric.history)) * 100}%`,
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    System Intelligence Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Pattern Detected:</strong> Agent collaboration
                        efficiency increases by 15% during neonatal care
                        processing workflows.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Optimization Opportunity:</strong> Memory graph
                        sync latency can be reduced by 23% through predictive
                        consensus.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <Brain className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Learning Progress:</strong> AI Fabric cultural
                        adaptation accuracy improved to 94.7% over last 24
                        hours.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <Zap className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Performance Insight:</strong> On-chain gas
                        optimization performing 12% above baseline through
                        ML-driven batching.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Fabric Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 rounded p-3">
                        <p className="text-sm text-purple-600">
                          Active AI Nodes
                        </p>
                        <p className="text-2xl font-bold text-purple-700">
                          {aiFabricMetrics.nodes}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded p-3">
                        <p className="text-sm text-green-600">
                          Federated Sessions
                        </p>
                        <p className="text-2xl font-bold text-green-700">
                          {aiFabricMetrics.federatedSessions}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Learning Progress</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Cultural Adaptation:</span>
                          <span className="font-medium">94.7%</span>
                        </div>
                        <Progress value={94.7} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Pattern Recognition:</span>
                          <span className="font-medium">91.3%</span>
                        </div>
                        <Progress value={91.3} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Predictive Accuracy:</span>
                          <span className="font-medium">
                            {(aiFabricMetrics.accuracy * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={aiFabricMetrics.accuracy * 100}
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">
                        Cross-System Insights
                      </h4>
                      <p className="text-2xl font-bold text-blue-700">
                        {aiFabricMetrics.crossSystemInsights}
                      </p>
                      <p className="text-sm text-gray-600">
                        Generated in last hour
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArchitectureMonitor;
