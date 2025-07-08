/**
 * Neonatal Care Protocol
 * Dedicated interface for the decentralized neonatal care investment case study
 * Demonstrates the complete Agent → Memory Graph → On-Chain → AI Fabric flow
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
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Heart,
  MapPin,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Baby,
  Activity,
  Target,
  Coins,
  Database,
  Brain,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Monitor,
  Stethoscope,
  Building,
  Truck,
  GraduationCap,
} from "lucide-react";

import { agentSwarmService } from "../services/agentSwarmService";
import { intentStreamService } from "../services/intentStreamService";
import { onChainLogicService } from "../services/onChainLogicService";
import { aiFabricService } from "../services/aiFabricService";

interface NICUFacility {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  currentCapacity: number;
  targetCapacity: number;
  equipmentNeeded: string[];
  fundingRequired: number;
  fundingReceived: number;
  impactMetrics: {
    infantsSaved: number;
    familiesSupported: number;
    mortalityReduction: number;
  };
  status: "assessment" | "planning" | "funding" | "deployment" | "operational";
  timeline: string;
  communityPartners: string[];
}

interface FundingStream {
  id: string;
  source: string;
  amount: number;
  currency: string;
  recipient: string;
  purpose: string;
  status: "pending" | "streaming" | "completed";
  flowRate: number; // per second
  startTime: Date;
  endTime?: Date;
  impactTracking: boolean;
}

interface ImpactMetric {
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  icon: React.ReactNode;
  color: string;
}

const NeonatalCareProtocol: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [intentInput, setIntentInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");

  const [facilities] = useState<NICUFacility[]>([
    {
      id: "nicu_kisumu_01",
      name: "Kisumu County Hospital NICU",
      location: "Kisumu, Kenya",
      coordinates: { lat: -0.1022, lng: 34.7617 },
      currentCapacity: 12,
      targetCapacity: 24,
      equipmentNeeded: [
        "Incubators",
        "Ventilators",
        "Monitoring Systems",
        "Phototherapy Units",
      ],
      fundingRequired: 45000,
      fundingReceived: 32500,
      impactMetrics: {
        infantsSaved: 89,
        familiesSupported: 156,
        mortalityReduction: 34,
      },
      status: "funding",
      timeline: "3-6 months",
      communityPartners: [
        "Ministry of Health Kenya",
        "Kisumu Medical Training College",
        "Local Women Groups",
      ],
    },
    {
      id: "nicu_kakamega_01",
      name: "Kakamega General Hospital NICU",
      location: "Kakamega, Kenya",
      coordinates: { lat: 0.2827, lng: 34.7519 },
      currentCapacity: 8,
      targetCapacity: 16,
      equipmentNeeded: [
        "Advanced Monitors",
        "Respiratory Support",
        "Warming Systems",
      ],
      fundingRequired: 35000,
      fundingReceived: 8750,
      impactMetrics: {
        infantsSaved: 0,
        familiesSupported: 0,
        mortalityReduction: 0,
      },
      status: "planning",
      timeline: "6-9 months",
      communityPartners: [
        "Kakamega University",
        "Community Health Workers",
        "Faith-Based Organizations",
      ],
    },
    {
      id: "nicu_mombasa_01",
      name: "Coast General Hospital NICU",
      location: "Mombasa, Kenya",
      coordinates: { lat: -4.0435, lng: 39.6682 },
      currentCapacity: 18,
      targetCapacity: 30,
      equipmentNeeded: ["CPAP Machines", "Pulse Oximeters", "Feeding Pumps"],
      fundingRequired: 55000,
      fundingReceived: 55000,
      impactMetrics: {
        infantsSaved: 127,
        familiesSupported: 203,
        mortalityReduction: 42,
      },
      status: "operational",
      timeline: "Completed",
      communityPartners: [
        "Coast Medical Foundation",
        "Aga Khan Hospital",
        "Mombasa Women Network",
      ],
    },
  ]);

  const [fundingStreams, setFundingStreams] = useState<FundingStream[]>([
    {
      id: "stream_001",
      source: "Global Impact Investors",
      amount: 25000,
      currency: "USDT",
      recipient: "Kisumu County Hospital",
      purpose: "NICU Equipment Purchase",
      status: "streaming",
      flowRate: 0.289, // ~$25 per day
      startTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      impactTracking: true,
    },
    {
      id: "stream_002",
      source: "Diaspora Community Pool",
      amount: 7500,
      currency: "USDT",
      recipient: "Kisumu Training Program",
      purpose: "Staff Training & Certification",
      status: "pending",
      flowRate: 0.087, // ~$7.5 per day
      startTime: new Date(),
      impactTracking: true,
    },
  ]);

  const [impactMetrics] = useState<ImpactMetric[]>([
    {
      name: "Infants Saved",
      current: 216,
      target: 500,
      unit: "lives",
      trend: "up",
      icon: <Baby className="h-5 w-5" />,
      color: "text-pink-600",
    },
    {
      name: "Families Supported",
      current: 359,
      target: 800,
      unit: "families",
      trend: "up",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      name: "Mortality Reduction",
      current: 38,
      target: 50,
      unit: "%",
      trend: "up",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      name: "NICU Capacity",
      current: 38,
      target: 70,
      unit: "beds",
      trend: "up",
      icon: <Monitor className="h-5 w-5" />,
      color: "text-purple-600",
    },
    {
      name: "Staff Trained",
      current: 47,
      target: 100,
      unit: "professionals",
      trend: "up",
      icon: <GraduationCap className="h-5 w-5" />,
      color: "text-orange-600",
    },
    {
      name: "Equipment Deployed",
      current: 67,
      target: 120,
      unit: "units",
      trend: "up",
      icon: <Stethoscope className="h-5 w-5" />,
      color: "text-teal-600",
    },
  ]);

  const [agentActivity, setAgentActivity] = useState([
    {
      agent: "ImpactMappingAgent",
      action: "Identified 3 new NICU opportunities in rural areas",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      confidence: 0.91,
    },
    {
      agent: "YieldAgent",
      action: "Optimized funding allocation for maximum infant survival impact",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      confidence: 0.87,
    },
    {
      agent: "CulturalInterpreterNode",
      action: "Adapted community engagement for traditional birth practices",
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      confidence: 0.84,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setFundingStreams((prev) =>
        prev.map((stream) => {
          if (stream.status === "streaming") {
            const elapsed = Date.now() - stream.startTime.getTime();
            const streamed = (elapsed / 1000) * stream.flowRate;
            const remaining = stream.amount - streamed;

            if (remaining <= 0) {
              return {
                ...stream,
                status: "completed" as const,
                endTime: new Date(),
              };
            }
          }
          return stream;
        }),
      );

      // Simulate new agent activity
      if (Math.random() < 0.1) {
        // 10% chance
        const newActivity = {
          agent: [
            "EthicalValidatorNode",
            "DAOAgent",
            "SmartContractDeployerAgent",
          ][Math.floor(Math.random() * 3)],
          action: [
            "Validated ethical compliance for vulnerable population care",
            "Created governance proposal for equipment procurement",
            "Deployed CareToken smart contract for impact tracking",
          ][Math.floor(Math.random() * 3)],
          timestamp: new Date(),
          confidence: 0.8 + Math.random() * 0.15,
        };

        setAgentActivity((prev) => [newActivity, ...prev.slice(0, 4)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const processNeonatalIntent = async () => {
    if (!intentInput.trim()) return;

    setIsProcessing(true);
    setProcessingStep("Parsing intent...");

    try {
      // Step 1: Intent Parsing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProcessingStep("Mapping impact opportunities...");

      // Step 2: Impact Mapping
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProcessingStep("Validating ethical compliance...");

      // Step 3: Ethical Validation
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProcessingStep("Creating DAO proposal...");

      // Step 4: DAO Proposal
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setProcessingStep("Deploying smart contract...");

      // Step 5: Smart Contract Deployment
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProcessingStep("Initiating fund stream...");

      // Step 6: Fund Streaming
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProcessingStep("Complete!");

      // Add new funding stream
      const amount = parseInt(intentInput.match(/\$?(\d+)/)?.[1] || "500");
      const newStream: FundingStream = {
        id: `stream_${Date.now()}`,
        source: "Intent Processing",
        amount,
        currency: "USDT",
        recipient: "Neonatal Care Network",
        purpose: "Equipment & Training",
        status: "streaming",
        flowRate: amount / (30 * 24 * 60 * 60), // Stream over 30 days
        startTime: new Date(),
        impactTracking: true,
      };

      setFundingStreams((prev) => [newStream, ...prev]);

      setTimeout(() => {
        setProcessingStep("");
        setIsProcessing(false);
        setIntentInput("");
      }, 2000);
    } catch (error) {
      console.error("Intent processing failed:", error);
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  const getTotalFunding = () => {
    return facilities.reduce((sum, f) => sum + f.fundingReceived, 0);
  };

  const getTotalTarget = () => {
    return facilities.reduce((sum, f) => sum + f.fundingRequired, 0);
  };

  const getFundingProgress = () => {
    return (getTotalFunding() / getTotalTarget()) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Decentralized Neonatal Care Investment Protocol
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            "I want to fund 3 neonatal units in East Africa with $500 USDT" →
            Autonomous execution through AI agents and smart contracts
          </p>

          {/* Live Metrics Bar */}
          <div className="flex justify-center items-center space-x-8 mt-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-pink-500" />
              <span className="font-semibold">
                {impactMetrics[0].current} Lives Saved
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-green-500" />
              <span className="font-semibold">
                ${getTotalFunding().toLocaleString()} Deployed
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">
                {facilities.filter((f) => f.status === "operational").length}{" "}
                Active Units
              </span>
            </div>
          </div>
        </div>

        {/* Intent Processing Interface */}
        <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
              Natural Language to Autonomous Action
            </CardTitle>
            <CardDescription>
              Express your neonatal care investment intent in natural language.
              Watch as AI agents coordinate autonomous execution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="e.g., 'Fund $1000 to expand NICU capacity in rural Kenya with focus on premature birth support'"
                  value={intentInput}
                  onChange={(e) => setIntentInput(e.target.value)}
                  className="flex-1"
                  disabled={isProcessing}
                />
                <Button
                  onClick={processNeonatalIntent}
                  disabled={isProcessing || !intentInput.trim()}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Execute
                    </div>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-1" />
                      Execute Intent
                    </>
                  )}
                </Button>
              </div>

              {/* Processing Steps */}
              {isProcessing && (
                <Card className="bg-white border-blue-200">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          Autonomous Execution Pipeline
                        </span>
                        <Badge className="bg-blue-100 text-blue-800">
                          Processing
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm">{processingStep}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-xs">
                          <div className="bg-green-100 p-2 rounded">
                            <Brain className="h-3 w-3 mb-1" />
                            Intent Parser
                          </div>
                          <div className="bg-yellow-100 p-2 rounded">
                            <Target className="h-3 w-3 mb-1" />
                            Impact Mapper
                          </div>
                          <div className="bg-purple-100 p-2 rounded">
                            <Shield className="h-3 w-3 mb-1" />
                            Ethical Validator
                          </div>
                          <div className="bg-blue-100 p-2 rounded">
                            <Users className="h-3 w-3 mb-1" />
                            DAO Agent
                          </div>
                          <div className="bg-orange-100 p-2 rounded">
                            <Zap className="h-3 w-3 mb-1" />
                            Contract Deployer
                          </div>
                          <div className="bg-green-100 p-2 rounded">
                            <TrendingUp className="h-3 w-3 mb-1" />
                            Fund Streamer
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <Activity className="h-4 w-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="facilities">
              <Building className="h-4 w-4 mr-1" />
              NICU Facilities
            </TabsTrigger>
            <TabsTrigger value="funding">
              <TrendingUp className="h-4 w-4 mr-1" />
              Fund Streams
            </TabsTrigger>
            <TabsTrigger value="impact">
              <Heart className="h-4 w-4 mr-1" />
              Impact Metrics
            </TabsTrigger>
            <TabsTrigger value="agents">
              <Brain className="h-4 w-4 mr-1" />
              AI Agents
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Global Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  East Africa Neonatal Care Initiative
                </CardTitle>
                <CardDescription>
                  Autonomous investment protocol improving neonatal care across
                  Kenya, Uganda, and Tanzania
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        Global Funding Progress
                      </span>
                      <span className="text-sm text-gray-600">
                        ${getTotalFunding().toLocaleString()} / $
                        {getTotalTarget().toLocaleString()}
                      </span>
                    </div>
                    <Progress value={getFundingProgress()} className="h-3" />
                    <p className="text-sm text-gray-600">
                      {getFundingProgress().toFixed(1)}% funded across all
                      facilities
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-pink-50 rounded p-3">
                      <Baby className="h-5 w-5 text-pink-600 mb-1" />
                      <p className="text-2xl font-bold text-pink-700">216</p>
                      <p className="text-xs text-pink-600">Infants Saved</p>
                    </div>
                    <div className="bg-blue-50 rounded p-3">
                      <Users className="h-5 w-5 text-blue-600 mb-1" />
                      <p className="text-2xl font-bold text-blue-700">359</p>
                      <p className="text-xs text-blue-600">Families Helped</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Active Streams</h4>
                    {fundingStreams
                      .filter((s) => s.status === "streaming")
                      .map((stream) => (
                        <div
                          key={stream.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{stream.recipient}</span>
                          <Badge className="bg-green-100 text-green-800">
                            ${stream.amount.toLocaleString()}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {impactMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={metric.color}>{metric.icon}</div>
                      <Badge variant="outline" className="text-xs">
                        {metric.trend === "up"
                          ? "↗"
                          : metric.trend === "down"
                            ? "↘"
                            : "→"}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold">{metric.current}</p>
                    <p className="text-xs text-gray-600 mb-1">{metric.name}</p>
                    <Progress
                      value={(metric.current / metric.target) * 100}
                      className="h-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Target: {metric.target} {metric.unit}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Agent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Recent Autonomous Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
                          {(activity.confidence * 100).toFixed(0)}%
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
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {facilities.map((facility) => (
                <Card key={facility.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {facility.name}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {facility.location}
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          facility.status === "operational"
                            ? "bg-green-100 text-green-800"
                            : facility.status === "funding"
                              ? "bg-blue-100 text-blue-800"
                              : facility.status === "deployment"
                                ? "bg-purple-100 text-purple-800"
                                : facility.status === "planning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                        }
                      >
                        {facility.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Capacity Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded p-3">
                        <Monitor className="h-4 w-4 text-blue-600 mb-1" />
                        <p className="text-lg font-bold text-blue-700">
                          {facility.currentCapacity}
                        </p>
                        <p className="text-xs text-blue-600">Current Beds</p>
                      </div>
                      <div className="bg-green-50 rounded p-3">
                        <Target className="h-4 w-4 text-green-600 mb-1" />
                        <p className="text-lg font-bold text-green-700">
                          {facility.targetCapacity}
                        </p>
                        <p className="text-xs text-green-600">Target Beds</p>
                      </div>
                    </div>

                    {/* Funding Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Funding Progress</span>
                        <span className="font-medium">
                          ${facility.fundingReceived.toLocaleString()} / $
                          {facility.fundingRequired.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (facility.fundingReceived /
                            facility.fundingRequired) *
                          100
                        }
                        className="h-2"
                      />
                    </div>

                    {/* Impact Metrics */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-pink-600">
                          {facility.impactMetrics.infantsSaved}
                        </p>
                        <p className="text-xs text-gray-600">Infants Saved</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">
                          {facility.impactMetrics.familiesSupported}
                        </p>
                        <p className="text-xs text-gray-600">Families</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">
                          {facility.impactMetrics.mortalityReduction}%
                        </p>
                        <p className="text-xs text-gray-600">Mortality ↓</p>
                      </div>
                    </div>

                    {/* Equipment Needed */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Equipment Needed:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {facility.equipmentNeeded.map((equipment, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {equipment}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        <span>Timeline: {facility.timeline}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full"
                      variant={
                        facility.status === "operational"
                          ? "outline"
                          : "default"
                      }
                    >
                      {facility.status === "operational" ? (
                        <>
                          <Activity className="h-4 w-4 mr-2" />
                          View Live Metrics
                        </>
                      ) : facility.status === "funding" ? (
                        <>
                          <Heart className="h-4 w-4 mr-2" />
                          Support Funding
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Join Planning
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Funding Tab */}
          <TabsContent value="funding" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Streams */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Real-time Fund Streams
                  </CardTitle>
                  <CardDescription>
                    Autonomous financial flows via smart contracts and
                    Superfluid protocol
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fundingStreams.map((stream) => (
                      <div
                        key={stream.id}
                        className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <ArrowRight className="h-4 w-4 text-green-600 mr-2" />
                            <span className="font-medium text-sm">
                              {stream.source}
                            </span>
                          </div>
                          <Badge
                            className={
                              stream.status === "streaming"
                                ? "bg-green-100 text-green-800"
                                : stream.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {stream.status}
                          </Badge>
                        </div>

                        <div className="flex items-center mb-2">
                          <ArrowRight className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {stream.recipient}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-lg text-green-600">
                            {stream.amount.toLocaleString()} {stream.currency}
                          </span>
                          <span className="text-xs text-gray-500">
                            ${(stream.flowRate * 86400).toFixed(2)}/day
                          </span>
                        </div>

                        <div className="text-xs text-gray-600">
                          Purpose: {stream.purpose}
                        </div>

                        {stream.impactTracking && (
                          <div className="flex items-center mt-2 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Real-time impact tracking enabled
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stream Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Stream Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Total Impact</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded p-3">
                          <p className="text-2xl font-bold text-green-700">
                            $
                            {fundingStreams
                              .reduce((sum, s) => sum + s.amount, 0)
                              .toLocaleString()}
                          </p>
                          <p className="text-xs text-green-600">
                            Total Committed
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded p-3">
                          <p className="text-2xl font-bold text-blue-700">
                            {
                              fundingStreams.filter(
                                (s) => s.status === "streaming",
                              ).length
                            }
                          </p>
                          <p className="text-xs text-blue-600">
                            Active Streams
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Stream Performance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Execution Rate</span>
                          <span className="font-medium">99.2%</span>
                        </div>
                        <Progress value={99.2} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Gas Efficiency</span>
                          <span className="font-medium">94.7%</span>
                        </div>
                        <Progress value={94.7} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Impact Tracking</span>
                          <span className="font-medium">100%</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Funding Sources</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Impact Investors</span>
                          <span className="font-medium">65%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Diaspora Communities</span>
                          <span className="font-medium">25%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Institutional Donors</span>
                          <span className="font-medium">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {impactMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className={metric.color}>{metric.icon}</div>
                      <span className="ml-2">{metric.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-gray-900">
                          {metric.current}
                        </p>
                        <p className="text-sm text-gray-600">{metric.unit}</p>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress to Target</span>
                          <span>
                            {((metric.current / metric.target) * 100).toFixed(
                              1,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={(metric.current / metric.target) * 100}
                          className="h-3"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Target: {metric.target} {metric.unit}
                        </p>
                      </div>

                      <div className="flex items-center justify-center">
                        <Badge
                          className={
                            metric.trend === "up"
                              ? "bg-green-100 text-green-800"
                              : metric.trend === "down"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {metric.trend === "up"
                            ? "↗ Improving"
                            : metric.trend === "down"
                              ? "↘ Declining"
                              : "→ Stable"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <Brain className="h-5 w-5 mr-2" />
                    AIIntentParserAgent
                  </CardTitle>
                  <CardDescription>
                    Natural language to structured investment intent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">
                        Neonatal Intents Processed:
                      </span>
                      <span className="text-sm font-medium">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Accuracy:</span>
                      <span className="text-sm font-medium">96%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cultural Adaptation:</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                    <p className="text-xs text-gray-600">
                      Specialized in healthcare investment intents with East
                      African cultural context.
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
                  <CardDescription>
                    Identifies optimal neonatal care opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Opportunities Mapped:</span>
                      <span className="text-sm font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Success Rate:</span>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Impact Confidence:</span>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                    <p className="text-xs text-gray-600">
                      AI-powered discovery of high-impact NICU investment
                      opportunities in rural areas.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-700">
                    <Shield className="h-5 w-5 mr-2" />
                    EthicalValidatorNode
                  </CardTitle>
                  <CardDescription>
                    Ensures ethical compliance for vulnerable populations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Validations Completed:</span>
                      <span className="text-sm font-medium">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Ethical Score:</span>
                      <span className="text-sm font-medium">98%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cultural Sensitivity:</span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                    <p className="text-xs text-gray-600">
                      Specialized ethical framework for neonatal care
                      investments involving vulnerable populations.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-700">
                    <Zap className="h-5 w-5 mr-2" />
                    SmartContractDeployerAgent
                  </CardTitle>
                  <CardDescription>
                    Deploys CareToken contracts for impact tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Contracts Deployed:</span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Security Score:</span>
                      <span className="text-sm font-medium">99%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Gas Optimization:</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <Progress value={99} className="h-2" />
                    <p className="text-xs text-gray-600">
                      Specialized in healthcare tokenization with automated
                      impact tracking and fund streaming.
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
                  <CardDescription>
                    Community governance for healthcare investments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Proposals Created:</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Approval Rate:</span>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Community Engagement:</span>
                      <span className="text-sm font-medium">76%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                    <p className="text-xs text-gray-600">
                      Creates community proposals for neonatal care investments
                      with cultural awareness.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-teal-700">
                    <Globe className="h-5 w-5 mr-2" />
                    CulturalInterpreterNode
                  </CardTitle>
                  <CardDescription>
                    Cultural adaptation for East African contexts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Cultural Adaptations:</span>
                      <span className="text-sm font-medium">34</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sensitivity Score:</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Community Acceptance:</span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    <p className="text-xs text-gray-600">
                      Ensures cultural sensitivity in neonatal care approaches
                      across diverse communities.
                    </p>
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

export default NeonatalCareProtocol;
