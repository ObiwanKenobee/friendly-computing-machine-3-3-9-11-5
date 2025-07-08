import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Target,
  BarChart3,
  TrendingUp,
  Shield,
  Globe,
  Zap,
  Users,
  AlertTriangle,
} from "lucide-react";
import { dalioSystemsService } from "../../services/dalioSystemsService";
import type {
  AllWorldEcosystemKit,
  SwarmAgent,
  SwarmAgentRecommendation,
  PrinciplesLayer,
  RadicalTransparencyDashboard,
} from "../../services/dalioSystemsService";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface DalioBalanceWidgetProps {
  userId?: string;
  className?: string;
}

export const DalioBalanceWidget: React.FC<DalioBalanceWidgetProps> = ({
  userId,
  className,
}) => {
  const [ecosystemKits, setEcosystemKits] = useState<AllWorldEcosystemKit[]>(
    [],
  );
  const [swarmAgents, setSwarmAgents] = useState<SwarmAgent[]>([]);
  const [recommendations, setRecommendations] = useState<
    SwarmAgentRecommendation[]
  >([]);
  const [principles, setPrinciples] = useState<PrinciplesLayer[]>([]);
  const [transparencyDashboard, setTransparencyDashboard] =
    useState<RadicalTransparencyDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all-weather");

  useEffect(() => {
    loadDalioData();
  }, [userId]);

  const loadDalioData = async () => {
    setLoading(true);
    try {
      const [kits, agents, agentRecs, principlesData, transparency] =
        await Promise.all([
          dalioSystemsService.getAllWorldEcosystemKits(),
          dalioSystemsService.getSwarmAgents(),
          dalioSystemsService.getSwarmAgentRecommendations(),
          dalioSystemsService.getPrinciplesLayer(),
          userId
            ? dalioSystemsService.getTransparencyDashboard(userId)
            : Promise.resolve(null),
        ]);

      setEcosystemKits(kits);
      setSwarmAgents(agents);
      setRecommendations(agentRecs);
      setPrinciples(principlesData);
      setTransparencyDashboard(transparency);
    } catch (error) {
      console.error("Failed to load Dalio data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRecommendation = async (recommendationId: string) => {
    try {
      await dalioSystemsService.approveRecommendation(recommendationId);
      await loadDalioData();
    } catch (error) {
      console.error("Failed to approve recommendation:", error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
      case "diversification":
        return <BarChart3 className="h-4 w-4" />;
      case "risk_management":
        return <Shield className="h-4 w-4" />;
      case "correlation_analysis":
        return <TrendingUp className="h-4 w-4" />;
      case "rebalancing":
        return <Target className="h-4 w-4" />;
      case "scenario_planning":
        return <Globe className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getPrincipleCategoryColor = (category: string) => {
    switch (category) {
      case "portfolio_construction":
        return "bg-blue-100 text-blue-800";
      case "risk_management":
        return "bg-red-100 text-red-800";
      case "governance":
        return "bg-green-100 text-green-800";
      case "transparency":
        return "bg-purple-100 text-purple-800";
      case "decision_making":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3">Loading Dalio balance analysis...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Target className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <CardTitle>Ray Dalio Balance Widget</CardTitle>
            <CardDescription>
              Systematic Diversification & Radical Transparency for All-Weather
              Performance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all-weather">All-Weather</TabsTrigger>
            <TabsTrigger value="swarm-agents">AI Swarm</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="principles">Principles</TabsTrigger>
            <TabsTrigger value="transparency">Transparency</TabsTrigger>
          </TabsList>

          {/* All-Weather Portfolio Tab */}
          <TabsContent value="all-weather" className="space-y-4">
            {ecosystemKits.map((kit) => (
              <Card key={kit.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{kit.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {kit.assets.length} Assets
                      </Badge>
                      <Badge variant="outline">
                        Sharpe: {kit.sharpeRatio.toFixed(2)}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {kit.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Portfolio Allocation Chart */}
                    <div>
                      <h4 className="font-medium mb-3">Asset Allocation</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={kit.assets.map((asset, index) => ({
                              name: asset.name.split(" ").slice(0, 2).join(" "),
                              value: asset.allocation,
                              fill: COLORS[index % COLORS.length],
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            dataKey="value"
                          ></Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Performance Metrics */}
                    <div>
                      <h4 className="font-medium mb-3">Performance Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Expected Return:</span>
                          <span className="font-medium text-green-600">
                            {(kit.expectedReturn * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Expected Volatility:</span>
                          <span className="font-medium text-orange-600">
                            {(kit.expectedVolatility * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Max Drawdown:</span>
                          <span className="font-medium text-red-600">
                            {(kit.maxDrawdown * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            Diversification Score:
                          </span>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={kit.diversificationScore}
                              className="w-16 h-2"
                            />
                            <span className="font-medium">
                              {kit.diversificationScore}/100
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Environmental Scenarios */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">
                      Environmental Scenario Analysis
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {kit.environmentalScenarios.map((scenario, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              {scenario.scenario}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {(scenario.probability * 100).toFixed(0)}%
                            </Badge>
                          </div>
                          <div className="text-lg font-bold text-purple-600">
                            +{(scenario.expectedPerformance * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rebalancing Status */}
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-purple-800">
                          Rebalancing Schedule
                        </h5>
                        <p className="text-sm text-purple-600">
                          Frequency: {kit.rebalancingFrequency} | Last:{" "}
                          {kit.lastRebalance.toLocaleDateString()} | Next:{" "}
                          {kit.nextRebalance.toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Target className="h-4 w-4 mr-2" />
                        Rebalance Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* AI Swarm Agents Tab */}
          <TabsContent value="swarm-agents" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {swarmAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getSpecialtyIcon(agent.specialty)}
                        <h4 className="font-semibold text-sm">{agent.name}</h4>
                      </div>
                      <Badge variant={agent.active ? "default" : "secondary"}>
                        {agent.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">
                          Confidence
                        </span>
                        <span className="text-xs font-medium">
                          {agent.confidence}%
                        </span>
                      </div>
                      <Progress value={agent.confidence} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-green-600">
                          {agent.performance.accuracy}%
                        </div>
                        <div className="text-gray-500">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-600">
                          {(agent.performance.profitability * 100).toFixed(1)}%
                        </div>
                        <div className="text-gray-500">Profitability</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-purple-600">
                          {agent.performance.riskAdjustment.toFixed(2)}
                        </div>
                        <div className="text-gray-500">Risk Adj</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-orange-600">
                          {agent.performance.diversificationImprovement}%
                        </div>
                        <div className="text-gray-500">Div. Improve</div>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                      <strong>Specialty:</strong>{" "}
                      {agent.specialty.replace("_", " ")}
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      <strong>Last Action:</strong>{" "}
                      {agent.lastAction.toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {swarmAgents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No AI swarm agents active</p>
                <p className="text-sm">
                  Agents will be deployed automatically based on market
                  conditions
                </p>
              </div>
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
                className={`border-l-4 ${getUrgencyColor(rec.urgency)}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">
                      {rec.type.replace("_", " ").toUpperCase()}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Badge className={getUrgencyColor(rec.urgency)}>
                        {rec.urgency}
                      </Badge>
                      <Badge variant="outline">
                        {rec.confidence}% confidence
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{rec.reasoning}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        Current Allocation
                      </h5>
                      <div className="text-lg font-bold text-gray-600">
                        {rec.currentAllocation}%
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        Recommended Allocation
                      </h5>
                      <div className="text-lg font-bold text-green-600">
                        {rec.recommendedAllocation}%
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        Expected Impact
                      </h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Return:</span>
                          <span className="text-green-600">
                            +
                            {(
                              rec.expectedImpact.returnImprovement * 100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Risk:</span>
                          <span className="text-blue-600">
                            {(rec.expectedImpact.riskReduction * 100).toFixed(
                              1,
                            )}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Diversification:</span>
                          <span className="text-purple-600">
                            +{rec.expectedImpact.diversificationBenefit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-sm text-gray-600">
                      <strong>Valid until:</strong>{" "}
                      {rec.validUntil.toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Reject recommendation logic
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproveRecommendation(rec.id)}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {recommendations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active recommendations</p>
                <p className="text-sm">
                  AI agents will generate recommendations based on market
                  analysis
                </p>
              </div>
            )}
          </TabsContent>

          {/* Principles Tab */}
          <TabsContent value="principles" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {principles.map((principle) => (
                <Card
                  key={principle.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{principle.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={getPrincipleCategoryColor(
                            principle.category,
                          )}
                        >
                          {principle.category.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline">
                          Priority: {principle.priority}
                        </Badge>
                        <Badge variant="outline">
                          {principle.effectiveness}% effective
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-sm mb-2">Rule</h5>
                      <p className="text-sm text-gray-700">{principle.rule}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Details</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Version:</span>
                            <span className="font-medium">
                              {principle.version}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Applicability:</span>
                            <span className="font-medium capitalize">
                              {principle.applicability.replace("_", " ")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Updated:</span>
                            <span className="font-medium">
                              {principle.lastUpdated.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Updated By:</span>
                            <span className="font-medium">
                              {principle.updatedBy}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">
                          Effectiveness Metrics
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Effectiveness:</span>
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={principle.effectiveness}
                                className="w-16 h-2"
                              />
                              <span className="text-sm font-medium">
                                {principle.effectiveness}%
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Changes:</span>
                            <span className="font-medium">
                              {principle.changeLog.length}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Votes:</span>
                            <span className="font-medium">
                              {principle.votingRecord.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {principle.conditions &&
                      principle.conditions.length > 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                          <h5 className="font-medium text-sm text-yellow-800 mb-2">
                            Conditions
                          </h5>
                          <ul className="space-y-1">
                            {principle.conditions.map((condition, index) => (
                              <li
                                key={index}
                                className="text-sm text-yellow-700"
                              >
                                • {condition}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {principles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No principles defined</p>
                <p className="text-sm">
                  Principles guide systematic decision-making
                </p>
              </div>
            )}
          </TabsContent>

          {/* Radical Transparency Tab */}
          <TabsContent value="transparency" className="space-y-4">
            {transparencyDashboard ? (
              <>
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Radical Transparency Dashboard
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Transparency Level</h4>
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant="outline"
                            className="text-lg py-2 px-4 capitalize"
                          >
                            {transparencyDashboard.transparencyLevel}
                          </Badge>
                          <div className="flex-1">
                            <Progress
                              value={
                                transparencyDashboard.transparencyLevel ===
                                "radical"
                                  ? 100
                                  : transparencyDashboard.transparencyLevel ===
                                      "advanced"
                                    ? 75
                                    : transparencyDashboard.transparencyLevel ===
                                        "intermediate"
                                      ? 50
                                      : 25
                              }
                              className="h-3"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">
                          Public Sharing Settings
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Performance:</span>
                            <Badge
                              variant={
                                transparencyDashboard.publicSharingSettings
                                  .sharePerformance
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {transparencyDashboard.publicSharingSettings
                                .sharePerformance
                                ? "Public"
                                : "Private"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Decisions:</span>
                            <Badge
                              variant={
                                transparencyDashboard.publicSharingSettings
                                  .shareDecisions
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {transparencyDashboard.publicSharingSettings
                                .shareDecisions
                                ? "Public"
                                : "Private"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Impact:</span>
                            <Badge
                              variant={
                                transparencyDashboard.publicSharingSettings
                                  .shareImpact
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {transparencyDashboard.publicSharingSettings
                                .shareImpact
                                ? "Public"
                                : "Private"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Failures:</span>
                            <Badge
                              variant={
                                transparencyDashboard.publicSharingSettings
                                  .shareFailures
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {transparencyDashboard.publicSharingSettings
                                .shareFailures
                                ? "Public"
                                : "Private"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Visible Metrics</h4>
                      <div className="flex flex-wrap gap-2">
                        {transparencyDashboard.visibleMetrics.map(
                          (metric, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {metric.replace("_", " ")}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Stakeholder Access</h4>
                      <div className="space-y-2">
                        {Object.entries(
                          transparencyDashboard.stakeholderAccess,
                        ).map(([stakeholder, access]) => (
                          <div
                            key={stakeholder}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm font-medium capitalize">
                              {stakeholder.replace("_", " ")}
                            </span>
                            <div className="flex space-x-1">
                              {access.map((item, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {item.replace("_", " ")}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Recent Audit Trail</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {transparencyDashboard.auditTrail
                          .slice(-5)
                          .map((entry) => (
                            <div
                              key={entry.id}
                              className="p-2 bg-gray-50 rounded text-sm"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">
                                  {entry.action.replace("_", " ")}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {entry.timestamp.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                User: {entry.userId} | Purpose: {entry.purpose}
                              </div>
                              <div className="text-xs text-gray-500">
                                Data: {entry.dataAccessed.join(", ")}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      <strong>Last Updated:</strong>{" "}
                      {transparencyDashboard.lastUpdated.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      Ray Dalio's Radical Transparency
                    </h4>
                    <p className="text-sm text-purple-700 italic">
                      "Radical transparency and algorithmic decision-making are
                      the core principles that enable us to make better
                      decisions by reducing ego and emotional barriers. The best
                      decisions come from thoughtful disagreement and
                      stress-testing ideas."
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transparency dashboard available</p>
                <p className="text-sm">
                  Sign in to access your radical transparency dashboard
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
