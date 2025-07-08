/**
 * QuantumVest Dashboard
 * Next-Generation Investment Interface
 * Demonstrates Agent Layer → Shared Memory Graph → On-Chain Logic → AI Fabric
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
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Brain,
  Network,
  Zap,
  Shield,
  TrendingUp,
  Globe,
  Heart,
  Users,
  Mic,
  Send,
  Activity,
  Target,
  Sparkles,
  GitBranch,
  Database,
  Cpu,
  Eye,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";

import { agentSwarmService } from "../services/agentSwarmService";
import { sharedMemoryGraphService } from "../services/sharedMemoryGraphService";
import { intentStreamService } from "../services/intentStreamService";
import { onChainLogicService } from "../services/onChainLogicService";
import { aiFabricService } from "../services/aiFabricService";

interface NeonatalCareProject {
  id: string;
  name: string;
  location: string;
  target: number;
  raised: number;
  beneficiaries: number;
  progress: number;
  impactScore: number;
  status: "planning" | "active" | "deployed" | "completed";
  smartContract?: string;
  daoProposal?: string;
}

interface AgentActivity {
  id: string;
  agent: string;
  action: string;
  status: "processing" | "completed" | "collaborating";
  confidence: number;
  timestamp: Date;
  result?: any;
}

interface ValueFlow {
  id: string;
  source: string;
  target: string;
  amount: number;
  currency: string;
  status: "streaming" | "completed" | "pending";
  impactTracking: boolean;
}

const QuantumVestDashboard: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState("intent");
  const [intentInput, setIntentInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([]);
  const [valueFlows, setValueFlows] = useState<ValueFlow[]>([]);
  const [neonatalProjects] = useState<NeonatalCareProject[]>([
    {
      id: "nicu_kenya_01",
      name: "Kenyan Rural NICU Initiative",
      location: "Kisumu, Kenya",
      target: 50000,
      raised: 34750,
      beneficiaries: 450,
      progress: 69.5,
      impactScore: 0.87,
      status: "active",
      smartContract: "0x742d35Cc6634C0532925a3b8D2aE5a3c5a2ff4e",
      daoProposal: "QmX4...neonatal_care_proposal",
    },
    {
      id: "nicu_nigeria_01",
      name: "Lagos Mobile NICU Units",
      location: "Lagos, Nigeria",
      target: 75000,
      raised: 18200,
      beneficiaries: 200,
      progress: 24.3,
      impactScore: 0.82,
      status: "planning",
      daoProposal: "QmY7...mobile_units_proposal",
    },
    {
      id: "nicu_ghana_01",
      name: "Accra Equipment Upgrade",
      location: "Accra, Ghana",
      target: 35000,
      raised: 35000,
      beneficiaries: 380,
      progress: 100,
      impactScore: 0.94,
      status: "completed",
      smartContract: "0x8e9a45Cf7592B8C4e3d1F2a6b8c4d9e7f3a2b1c0",
    },
  ]);

  // Real-time metrics
  const [systemMetrics, setSystemMetrics] = useState({
    agentSwarm: { active: 6, processing: 2, collaboration: 0.92 },
    memoryGraph: { nodes: 1247, relationships: 3891, consensus: 0.94 },
    intentStreams: { active: 3, throughput: 47, backpressure: false },
    onChainLogic: { contracts: 12, interactions: 89, gasOptimization: 0.78 },
    aiFabric: { nodes: 10, accuracy: 0.89, learningVelocity: 0.76 },
  });

  const [aiInsights, setAiInsights] = useState([
    {
      type: "pattern_discovery",
      message:
        "Cultural adaptation improves neonatal care investment success by 34%",
      confidence: 0.87,
      source: "CulturalInterpreterNode",
    },
    {
      type: "optimization",
      message:
        "Risk-impact optimization detected for African healthcare investments",
      confidence: 0.82,
      source: "YieldAgent",
    },
    {
      type: "ethical_validation",
      message:
        "All neonatal care proposals pass ethical evaluation with 96% score",
      confidence: 0.96,
      source: "EthicalValidatorNode",
    },
  ]);

  // Effects for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateSystemMetrics();
      simulateAgentActivity();
      updateValueFlows();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const updateSystemMetrics = useCallback(() => {
    setSystemMetrics((prev) => ({
      agentSwarm: {
        active:
          prev.agentSwarm.active +
          (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0),
        processing: Math.max(
          0,
          prev.agentSwarm.processing + Math.floor(Math.random() * 3) - 1,
        ),
        collaboration: Math.min(
          1,
          Math.max(
            0.8,
            prev.agentSwarm.collaboration + (Math.random() - 0.5) * 0.1,
          ),
        ),
      },
      memoryGraph: {
        nodes: prev.memoryGraph.nodes + Math.floor(Math.random() * 5),
        relationships:
          prev.memoryGraph.relationships + Math.floor(Math.random() * 10),
        consensus: Math.min(
          1,
          Math.max(
            0.85,
            prev.memoryGraph.consensus + (Math.random() - 0.5) * 0.05,
          ),
        ),
      },
      intentStreams: {
        active: prev.intentStreams.active,
        throughput: Math.max(
          20,
          prev.intentStreams.throughput + Math.floor(Math.random() * 10) - 5,
        ),
        backpressure: Math.random() < 0.05,
      },
      onChainLogic: {
        contracts: prev.onChainLogic.contracts + (Math.random() > 0.9 ? 1 : 0),
        interactions:
          prev.onChainLogic.interactions + Math.floor(Math.random() * 5),
        gasOptimization: Math.min(
          1,
          Math.max(
            0.6,
            prev.onChainLogic.gasOptimization + (Math.random() - 0.5) * 0.1,
          ),
        ),
      },
      aiFabric: {
        nodes: prev.aiFabric.nodes,
        accuracy: Math.min(
          0.99,
          Math.max(0.8, prev.aiFabric.accuracy + (Math.random() - 0.5) * 0.02),
        ),
        learningVelocity: Math.min(
          1,
          Math.max(
            0.5,
            prev.aiFabric.learningVelocity + (Math.random() - 0.5) * 0.05,
          ),
        ),
      },
    }));
  }, []);

  const simulateAgentActivity = useCallback(() => {
    if (Math.random() < 0.3) {
      // 30% chance of new activity
      const agents = [
        "AIIntentParserAgent",
        "ImpactMappingAgent",
        "YieldAgent",
        "DAOAgent",
        "ContractDeployerAgent",
      ];
      const actions = [
        "Processing intent",
        "Mapping opportunities",
        "Optimizing yield",
        "Creating proposal",
        "Deploying contract",
      ];

      const newActivity: AgentActivity = {
        id: `activity_${Date.now()}`,
        agent: agents[Math.floor(Math.random() * agents.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        status: "processing",
        confidence: 0.7 + Math.random() * 0.25,
        timestamp: new Date(),
      };

      setAgentActivities((prev) => {
        const updated = [newActivity, ...prev.slice(0, 9)]; // Keep last 10

        // Simulate completion of processing activities
        return updated.map((activity) => {
          if (activity.status === "processing" && Math.random() < 0.4) {
            return {
              ...activity,
              status: "completed",
              result: "Task completed successfully",
            };
          }
          return activity;
        });
      });
    }
  }, []);

  const updateValueFlows = useCallback(() => {
    if (Math.random() < 0.2) {
      // 20% chance of new flow
      const newFlow: ValueFlow = {
        id: `flow_${Date.now()}`,
        source: "User Investment",
        target: "Neonatal Care Provider",
        amount: Math.floor(Math.random() * 5000) + 500,
        currency: "USDT",
        status: "streaming",
        impactTracking: true,
      };

      setValueFlows((prev) => [newFlow, ...prev.slice(0, 4)]); // Keep last 5
    }
  }, []);

  const processIntent = async () => {
    if (!intentInput.trim()) return;

    setIsProcessing(true);

    try {
      // Simulate the new architecture in action
      const results = await intentStreamService.streamIntent(
        intentInput,
        "demo_user",
      );

      // Add agent activities
      const newActivities = [
        {
          id: `intent_${Date.now()}_1`,
          agent: "AIIntentParserAgent",
          action: `Parsing: "${intentInput.substring(0, 30)}..."`,
          status: "completed" as const,
          confidence: 0.94,
          timestamp: new Date(),
          result: "Intent successfully parsed and validated",
        },
        {
          id: `intent_${Date.now()}_2`,
          agent: "ImpactMappingAgent",
          action: "Finding optimal neonatal care opportunities",
          status: "completed" as const,
          confidence: 0.89,
          timestamp: new Date(),
          result: "Identified 3 high-impact opportunities in East Africa",
        },
        {
          id: `intent_${Date.now()}_3`,
          agent: "EthicalValidatorNode",
          action: "Validating ethical compliance",
          status: "completed" as const,
          confidence: 0.96,
          timestamp: new Date(),
          result: "Ethical validation passed with high confidence",
        },
      ];

      setAgentActivities((prev) => [...newActivities, ...prev.slice(0, 7)]);

      // Simulate value flow creation
      if (
        intentInput.toLowerCase().includes("fund") ||
        intentInput.toLowerCase().includes("invest")
      ) {
        const newFlow: ValueFlow = {
          id: `flow_${Date.now()}`,
          source: "Intent Processing",
          target: "Smart Contract Deployment",
          amount: 500, // Extract from intent
          currency: "USDT",
          status: "pending",
          impactTracking: true,
        };

        setValueFlows((prev) => [newFlow, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error("Intent processing failed:", error);
    } finally {
      setIsProcessing(false);
      setIntentInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      processIntent();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            QuantumVest: Post-API Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Beyond Frontend → API → Backend: Experience Agent Layer → Shared
            Memory Graph → On-Chain Logic → AI Fabric
          </p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <Activity className="h-3 w-3 mr-1" />
              Live System
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              <Zap className="h-3 w-3 mr-1" />
              Real-time Processing
            </Badge>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              <Brain className="h-3 w-3 mr-1" />
              AI-Driven
            </Badge>
          </div>
        </div>

        {/* Architecture Overview */}
        <Card className="mb-6 border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="h-6 w-6 mr-2 text-blue-600" />
              Next-Generation Architecture
            </CardTitle>
            <CardDescription>
              Revolutionary approach replacing traditional REST APIs with
              intelligent, autonomous systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-2">
                  <Brain className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-semibold">Agent Layer</span>
                </div>
                <p className="text-sm text-gray-600">
                  Autonomous agents replace backend logic
                </p>
                <div className="mt-2 flex items-center text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  {systemMetrics.agentSwarm.active} Active
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center mb-2">
                  <Database className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="font-semibold">Memory Graph</span>
                </div>
                <p className="text-sm text-gray-600">
                  Decentralized state fabric
                </p>
                <div className="mt-2 flex items-center text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  {systemMetrics.memoryGraph.nodes} Nodes
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center mb-2">
                  <Zap className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="font-semibold">On-Chain Logic</span>
                </div>
                <p className="text-sm text-gray-600">
                  Smart contract automation
                </p>
                <div className="mt-2 flex items-center text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  {systemMetrics.onChainLogic.contracts} Contracts
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-semibold">AI Fabric</span>
                </div>
                <p className="text-sm text-gray-600">
                  Coordinated intelligence
                </p>
                <div className="mt-2 flex items-center text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  {(systemMetrics.aiFabric.accuracy * 100).toFixed(0)}% Accuracy
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="intent">
              <MessageSquare className="h-4 w-4 mr-1" />
              Intent Stream
            </TabsTrigger>
            <TabsTrigger value="agents">
              <Users className="h-4 w-4 mr-1" />
              Agent Swarm
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Heart className="h-4 w-4 mr-1" />
              Neonatal Care
            </TabsTrigger>
            <TabsTrigger value="flows">
              <TrendingUp className="h-4 w-4 mr-1" />
              Value Flows
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Eye className="h-4 w-4 mr-1" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          {/* Intent Stream Tab */}
          <TabsContent value="intent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Natural Language Intent Processing
                </CardTitle>
                <CardDescription>
                  Express your investment intentions in natural language. The AI
                  fabric will parse, validate, and execute through autonomous
                  agents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="e.g., 'I want to fund 3 neonatal units in East Africa with $500 USDT'"
                      value={intentInput}
                      onChange={(e) => setIntentInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                      disabled={isProcessing}
                    />
                    <Button
                      onClick={processIntent}
                      disabled={isProcessing || !intentInput.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing
                        </div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-1" />
                          Process
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Example Intents:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• "Fund neonatal care in rural Kenya"</li>
                        <li>• "Invest $1000 in healthcare equipment"</li>
                        <li>• "Support community health initiatives"</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Processing Pipeline:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Intent parsing & validation</li>
                        <li>• Impact opportunity mapping</li>
                        <li>• Smart contract deployment</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Real-time Outputs:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Autonomous agent coordination</li>
                        <li>• Decentralized state updates</li>
                        <li>• Blockchain execution</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Agent Activities */}
            {agentActivities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Real-time Agent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agentActivities.slice(0, 5).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              activity.status === "completed"
                                ? "bg-green-500"
                                : activity.status === "processing"
                                  ? "bg-blue-500 animate-pulse"
                                  : "bg-yellow-500"
                            }`}
                          ></div>
                          <div>
                            <span className="font-medium text-sm">
                              {activity.agent}
                            </span>
                            <p className="text-sm text-gray-600">
                              {activity.action}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            {(activity.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Agent Swarm Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <Brain className="h-5 w-5 mr-2" />
                    AIIntentParserAgent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Accuracy:</span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tasks Today:</span>
                      <span className="text-sm font-medium">127</span>
                    </div>
                    <Progress value={94} className="h-2" />
                    <p className="text-xs text-gray-600">
                      Parsing natural language investment intents with cultural
                      context adaptation.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700">
                    <Target className="h-5 w-5 mr-2" />
                    ImpactMappingAgent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Success Rate:</span>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Opportunities Found:</span>
                      <span className="text-sm font-medium">23</span>
                    </div>
                    <Progress value={89} className="h-2" />
                    <p className="text-xs text-gray-600">
                      Identifying high-impact neonatal care opportunities in
                      rural areas.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-700">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    YieldAgent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        Optimizing
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">ROI Forecast:</span>
                      <span className="text-sm font-medium">12.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Risk Score:</span>
                      <span className="text-sm font-medium">Low (0.3)</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    <p className="text-xs text-gray-600">
                      Optimizing risk-adjusted returns while maximizing social
                      impact.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-indigo-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-indigo-700">
                    <Users className="h-5 w-5 mr-2" />
                    DAOAgent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Proposals Created:</span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Approval Rate:</span>
                      <span className="text-sm font-medium">84%</span>
                    </div>
                    <Progress value={84} className="h-2" />
                    <p className="text-xs text-gray-600">
                      Creating and managing governance proposals for community
                      investment decisions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-700">
                    <Zap className="h-5 w-5 mr-2" />
                    ContractDeployerAgent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge className="bg-green-100 text-green-800">
                        Ready
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Contracts Deployed:</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Security Score:</span>
                      <span className="text-sm font-medium">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                    <p className="text-xs text-gray-600">
                      Dynamically deploying and auditing smart contracts for
                      healthcare funding.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-700">
                    <Shield className="h-5 w-5 mr-2" />
                    EthicalValidatorNode
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge className="bg-green-100 text-green-800">
                        Monitoring
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Validation Rate:</span>
                      <span className="text-sm font-medium">96%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Ethical Score:</span>
                      <span className="text-sm font-medium">Excellent</span>
                    </div>
                    <Progress value={96} className="h-2" />
                    <p className="text-xs text-gray-600">
                      Ensuring all investment activities meet ethical standards
                      and cultural sensitivity.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Neonatal Care Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {neonatalProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Globe className="h-4 w-4 mr-1" />
                          {project.location}
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          project.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : project.status === "active"
                              ? "bg-blue-100 text-blue-800"
                              : project.status === "deployed"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Funding Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Funding Progress</span>
                        <span className="font-medium">
                          ${project.raised.toLocaleString()} / $
                          {project.target.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      <p className="text-xs text-gray-600 mt-1">
                        {project.progress.toFixed(1)}% funded
                      </p>
                    </div>

                    {/* Impact Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded p-3">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 text-blue-600 mr-1" />
                          <span className="text-xs font-medium">
                            Beneficiaries
                          </span>
                        </div>
                        <p className="text-lg font-bold text-blue-700">
                          {project.beneficiaries}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded p-3">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-xs font-medium">
                            Impact Score
                          </span>
                        </div>
                        <p className="text-lg font-bold text-green-700">
                          {(project.impactScore * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    {/* Smart Contract Info */}
                    {project.smartContract && (
                      <div className="bg-gray-50 rounded p-3">
                        <div className="flex items-center mb-1">
                          <Zap className="h-4 w-4 text-gray-600 mr-1" />
                          <span className="text-xs font-medium">
                            Smart Contract
                          </span>
                        </div>
                        <p className="text-xs font-mono text-gray-700">
                          {project.smartContract}
                        </p>
                        <div className="flex items-center mt-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-green-600">
                            Verified & Active
                          </span>
                        </div>
                      </div>
                    )}

                    {/* DAO Proposal */}
                    {project.daoProposal && (
                      <div className="bg-purple-50 rounded p-3">
                        <div className="flex items-center mb-1">
                          <Users className="h-4 w-4 text-purple-600 mr-1" />
                          <span className="text-xs font-medium">
                            DAO Proposal
                          </span>
                        </div>
                        <p className="text-xs font-mono text-purple-700">
                          {project.daoProposal}
                        </p>
                        <div className="flex items-center mt-2 text-xs">
                          <Activity className="h-3 w-3 text-purple-500 mr-1" />
                          <span className="text-purple-600">
                            Community Voting Active
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      className="w-full"
                      variant={
                        project.status === "completed" ? "outline" : "default"
                      }
                    >
                      {project.status === "completed" ? (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          View Impact Report
                        </>
                      ) : project.status === "active" ? (
                        <>
                          <Heart className="h-4 w-4 mr-2" />
                          Support Project
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Join DAO Vote
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Value Flows Tab */}
          <TabsContent value="flows" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Value Flows */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Real-time Value Flows
                  </CardTitle>
                  <CardDescription>
                    Autonomous financial streams powered by smart contracts and
                    AI optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {valueFlows.map((flow) => (
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
                              flow.status === "streaming"
                                ? "bg-green-100 text-green-800"
                                : flow.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {flow.status}
                          </Badge>
                        </div>

                        <div className="flex items-center mb-2">
                          <ArrowRight className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {flow.target}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg text-green-600">
                            {flow.amount} {flow.currency}
                          </span>
                          {flow.impactTracking && (
                            <div className="flex items-center text-xs text-green-600">
                              <Eye className="h-3 w-3 mr-1" />
                              Impact Tracked
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {valueFlows.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No active value flows</p>
                        <p className="text-sm">
                          Process an intent to see value flows in action
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Flow Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Flow Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Today's Impact</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded p-3">
                          <p className="text-2xl font-bold text-blue-700">
                            $47,250
                          </p>
                          <p className="text-xs text-blue-600">
                            Total Streamed
                          </p>
                        </div>
                        <div className="bg-green-50 rounded p-3">
                          <p className="text-2xl font-bold text-green-700">
                            1,240
                          </p>
                          <p className="text-xs text-green-600">
                            Lives Impacted
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Stream Performance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Success Rate</span>
                          <span className="font-medium">98.7%</span>
                        </div>
                        <Progress value={98.7} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average Latency</span>
                          <span className="font-medium">1.2s</span>
                        </div>
                        <Progress value={85} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Gas Optimization</span>
                          <span className="font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Top Destinations</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Neonatal Care Providers</span>
                          <span className="font-medium">67%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Equipment Suppliers</span>
                          <span className="font-medium">23%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Training Programs</span>
                          <span className="font-medium">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Fabric Insights
                  </CardTitle>
                  <CardDescription>
                    Cross-system intelligence and pattern recognition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiInsights.map((insight, index) => (
                      <Alert
                        key={index}
                        className={
                          insight.type === "ethical_validation"
                            ? "border-green-200 bg-green-50"
                            : insight.type === "optimization"
                              ? "border-blue-200 bg-blue-50"
                              : "border-purple-200 bg-purple-50"
                        }
                      >
                        <div className="flex items-start">
                          {insight.type === "ethical_validation" ? (
                            <Shield className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                          ) : insight.type === "optimization" ? (
                            <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
                          ) : (
                            <Eye className="h-4 w-4 text-purple-600 mt-0.5 mr-2" />
                          )}
                          <div className="flex-1">
                            <AlertDescription className="text-sm">
                              {insight.message}
                            </AlertDescription>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-600">
                                Source: {insight.source}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {(insight.confidence * 100).toFixed(0)}%
                                confidence
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Agent Swarm</span>
                        <span className="text-sm">
                          {systemMetrics.agentSwarm.active} active
                        </span>
                      </div>
                      <Progress
                        value={systemMetrics.agentSwarm.collaboration * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Collaboration Score:{" "}
                        {(systemMetrics.agentSwarm.collaboration * 100).toFixed(
                          0,
                        )}
                        %
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Memory Graph
                        </span>
                        <span className="text-sm">
                          {systemMetrics.memoryGraph.nodes} nodes
                        </span>
                      </div>
                      <Progress
                        value={systemMetrics.memoryGraph.consensus * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Consensus Rate:{" "}
                        {(systemMetrics.memoryGraph.consensus * 100).toFixed(0)}
                        %
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Intent Streams
                        </span>
                        <span className="text-sm">
                          {systemMetrics.intentStreams.throughput}/sec
                        </span>
                      </div>
                      <Progress
                        value={
                          systemMetrics.intentStreams.backpressure ? 60 : 95
                        }
                        className="h-2"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {systemMetrics.intentStreams.backpressure
                          ? "Backpressure detected"
                          : "Optimal throughput"}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          On-Chain Logic
                        </span>
                        <span className="text-sm">
                          {systemMetrics.onChainLogic.contracts} contracts
                        </span>
                      </div>
                      <Progress
                        value={systemMetrics.onChainLogic.gasOptimization * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Gas Optimization:{" "}
                        {(
                          systemMetrics.onChainLogic.gasOptimization * 100
                        ).toFixed(0)}
                        %
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">AI Fabric</span>
                        <span className="text-sm">
                          {systemMetrics.aiFabric.nodes} nodes
                        </span>
                      </div>
                      <Progress
                        value={systemMetrics.aiFabric.accuracy * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Accuracy:{" "}
                        {(systemMetrics.aiFabric.accuracy * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">
                Welcome to the Post-API Future
              </h3>
              <p className="text-blue-100 mb-4">
                Experience autonomous financial infrastructure where intent
                becomes action through intelligent coordination
              </p>
              <div className="flex justify-center space-x-6 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>No Traditional APIs</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Autonomous Agents</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Decentralized State</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Smart Contract Automation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuantumVestDashboard;
