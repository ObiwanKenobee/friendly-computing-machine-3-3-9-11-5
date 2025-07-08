import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { legendaryInvestorStrategyService } from "../services/legendaryInvestorStrategyService";
import type {
  ValueVault,
  InvestorAgent,
  AgentRecommendation,
  ContrairianAlert,
} from "../services/legendaryInvestorStrategyService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  Shield,
  Target,
  Globe,
  Brain,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Timer,
  Star,
  Lightbulb,
  Crown,
  Zap,
} from "lucide-react";

interface DashboardData {
  vaults: ValueVault[];
  agents: InvestorAgent[];
  recommendations: AgentRecommendation[];
  contrairianAlerts: ContrairianAlert[];
  insights: any;
}

export default function LegendaryInvestorDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedVault, setSelectedVault] = useState<string>("");
  const [selectedPhilosophy, setSelectedPhilosophy] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [vaults, agents, recommendations, contrairianAlerts, insights] =
        await Promise.all([
          legendaryInvestorStrategyService.getValueVaults(),
          legendaryInvestorStrategyService.getInvestorAgents(),
          legendaryInvestorStrategyService.getAgentRecommendations(),
          legendaryInvestorStrategyService.getContrairianAlerts(),
          legendaryInvestorStrategyService.getInvestmentInsights(),
        ]);

      setData({ vaults, agents, recommendations, contrairianAlerts, insights });

      if (vaults.length > 0) {
        setSelectedVault(vaults[0].id);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLockPosition = async (
    vaultId: string,
    amount: number,
    days: number,
    philosophy: string,
  ) => {
    try {
      const position =
        await legendaryInvestorStrategyService.createLockPosition(
          vaultId,
          amount,
          days,
          philosophy as any,
        );
      console.log("Lock position created:", position);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error("Failed to create lock position:", error);
    }
  };

  const getPhilosophyIcon = (philosophy: string) => {
    switch (philosophy) {
      case "benjamin_graham":
        return <Shield className="h-5 w-5 text-blue-600" />;
      case "warren_buffett":
        return <Crown className="h-5 w-5 text-green-600" />;
      case "howard_marks":
        return <Target className="h-5 w-5 text-purple-600" />;
      case "john_templeton":
        return <Globe className="h-5 w-5 text-orange-600" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const getPhilosophyColor = (philosophy: string) => {
    switch (philosophy) {
      case "benjamin_graham":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "warren_buffett":
        return "bg-green-50 border-green-200 text-green-800";
      case "howard_marks":
        return "bg-purple-50 border-purple-200 text-purple-800";
      case "john_templeton":
        return "bg-orange-50 border-orange-200 text-orange-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getRecommendationBadge = (action: string) => {
    const badgeMap = {
      buy: {
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      },
      strong_buy: {
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      },
      sell: {
        variant: "destructive" as const,
        color: "bg-red-100 text-red-800",
      },
      hold: {
        variant: "secondary" as const,
        color: "bg-gray-100 text-gray-800",
      },
      lock: { variant: "outline" as const, color: "bg-blue-100 text-blue-800" },
    };
    return (
      badgeMap[action as keyof typeof badgeMap] || {
        variant: "outline" as const,
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading legendary investor intelligence...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-xl">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
              Legendary Investor Intelligence
            </h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Channel the wisdom of Benjamin Graham, Warren Buffett, Howard Marks,
            and Sir John Templeton through AI-powered investment strategies for
            ecosystem conservation.
          </p>
        </div>

        {/* Investment Philosophy Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.agents.map((agent) => (
            <Card
              key={agent.id}
              className={`border-2 ${getPhilosophyColor(agent.philosophy)}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getPhilosophyIcon(agent.philosophy)}
                    <span className="font-semibold text-sm">{agent.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {agent.confidence}% confidence
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Annual Return:</span>
                    <span className="font-bold text-green-600">
                      +{(agent.performance.annualizedReturn * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sharpe Ratio:</span>
                    <span className="font-medium">
                      {agent.performance.sharpeRatio.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Max Drawdown:</span>
                    <span className="font-medium text-red-600">
                      {(agent.performance.maxDrawdown * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={agent.performance.winRate * 100}
                  className="mt-3 h-2"
                />
                <span className="text-xs text-gray-600">
                  {(agent.performance.winRate * 100).toFixed(0)}% win rate
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Market Overview</TabsTrigger>
            <TabsTrigger value="vaults">ValueVaults™</TabsTrigger>
            <TabsTrigger value="recommendations">
              AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="contrarian">Contrarian Alerts</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Builder</TabsTrigger>
          </TabsList>

          {/* Market Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Sentiment & Cycle Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Market Cycle Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Howard Marks-style cycle positioning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart
                      data={[
                        { metric: "Safety Margin", Current: 85, Optimal: 75 },
                        { metric: "Moat Strength", Current: 78, Optimal: 80 },
                        { metric: "Cycle Timing", Current: 72, Optimal: 85 },
                        {
                          metric: "Contrarian Value",
                          Current: 91,
                          Optimal: 70,
                        },
                        {
                          metric: "Sentiment Extreme",
                          Current: 67,
                          Optimal: 50,
                        },
                      ]}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Current"
                        dataKey="Current"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.2}
                      />
                      <Radar
                        name="Optimal"
                        dataKey="Optimal"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.1}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Philosophy Performance Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Philosophy Performance</CardTitle>
                  <CardDescription>
                    Comparative returns by investment approach
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={data.agents.map((agent) => ({
                        name:
                          agent.philosophy.split("_")[1] || agent.philosophy,
                        return: agent.performance.annualizedReturn * 100,
                        sharpe: agent.performance.sharpeRatio,
                        winRate: agent.performance.winRate * 100,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="return"
                        fill="#3B82F6"
                        name="Annual Return %"
                      />
                      <Bar dataKey="winRate" fill="#10B981" name="Win Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Investment Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Market Intelligence</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">
                      Current Market Overview
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {data.insights.marketOverview}
                    </p>

                    <h4 className="font-semibold mb-3">Philosophy Focus</h4>
                    <p className="text-gray-600">
                      {data.insights.philosophyFocus}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Top Opportunities</h4>
                    <ul className="space-y-2 mb-4">
                      {data.insights.topOpportunities.map(
                        (opportunity: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span className="text-sm">{opportunity}</span>
                          </li>
                        ),
                      )}
                    </ul>

                    <h4 className="font-semibold mb-3">Risk Warnings</h4>
                    <ul className="space-y-2">
                      {data.insights.riskWarnings.map(
                        (warning: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <span className="text-sm">{warning}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ValueVaults */}
          <TabsContent value="vaults" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">ValueVaults™ Analysis</h3>
              <Select
                value={selectedPhilosophy}
                onValueChange={setSelectedPhilosophy}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by philosophy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Philosophies</SelectItem>
                  <SelectItem value="graham">Graham Safety</SelectItem>
                  <SelectItem value="buffett">Buffett Moats</SelectItem>
                  <SelectItem value="marks">Marks Cycles</SelectItem>
                  <SelectItem value="templeton">
                    Templeton Contrarian
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {data.vaults.map((vault) => (
                <Card
                  key={vault.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{vault.name}</CardTitle>
                      <Badge
                        variant={
                          vault.status === "active" ? "default" : "secondary"
                        }
                      >
                        {vault.status}
                      </Badge>
                    </div>
                    <CardDescription>{vault.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Four Philosophy Scores */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-medium">Graham</span>
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {vault.grahamScore}
                          </div>
                          <div className="text-xs text-gray-600">
                            {vault.safetyMargin}% margin
                          </div>
                        </div>

                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Crown className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium">Buffett</span>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {vault.buffettMoatScore}
                          </div>
                          <div className="text-xs text-gray-600">
                            Moat strength
                          </div>
                        </div>

                        <div className="text-center p-2 bg-purple-50 rounded">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Target className="h-4 w-4 text-purple-600" />
                            <span className="text-xs font-medium">Marks</span>
                          </div>
                          <div className="text-lg font-bold text-purple-600">
                            {vault.marksCyclePhase}
                          </div>
                          <div className="text-xs text-gray-600">
                            Cycle phase
                          </div>
                        </div>

                        <div className="text-center p-2 bg-orange-50 rounded">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Globe className="h-4 w-4 text-orange-600" />
                            <span className="text-xs font-medium">
                              Templeton
                            </span>
                          </div>
                          <div className="text-lg font-bold text-orange-600">
                            {vault.templetonContrarian}
                          </div>
                          <div className="text-xs text-gray-600">
                            Contrarian score
                          </div>
                        </div>
                      </div>

                      {/* Vault Metrics */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Current Price:</span>
                          <span className="font-medium">
                            ${(vault.currentPrice / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Intrinsic Value:</span>
                          <span className="font-medium">
                            ${(vault.intrinsicValue / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Base Yield:</span>
                          <span className="font-medium text-green-600">
                            {(vault.yieldRate * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lock Multiplier:</span>
                          <span className="font-medium">
                            Up to {vault.lockMultiplier}x
                          </span>
                        </div>
                      </div>

                      {/* Conservation Impact */}
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h5 className="text-sm font-medium text-green-800 mb-2">
                          Conservation Impact
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            Species:{" "}
                            {vault.conservationImpact.speciesProtected.toLocaleString()}
                          </div>
                          <div>
                            Jobs:{" "}
                            {vault.conservationImpact.communityJobs.toLocaleString()}
                          </div>
                          <div>
                            Carbon:{" "}
                            {(
                              vault.conservationImpact.carbonSequestered / 1000
                            ).toFixed(0)}
                            K tons
                          </div>
                          <div>
                            Habitat:{" "}
                            {(
                              vault.conservationImpact.habitatRestored / 1000
                            ).toFixed(0)}
                            K ha
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedVault(vault.id)}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Invest
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            handleCreateLockPosition(
                              vault.id,
                              10000,
                              730,
                              "buffett",
                            )
                          }
                        >
                          <Lock className="h-4 w-4 mr-1" />
                          Lock
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Recommendations */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Agent Recommendations</span>
                </CardTitle>
                <CardDescription>
                  Real-time investment recommendations from legendary investor
                  AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recommendations.map((rec) => {
                    const agent = data.agents.find((a) => a.id === rec.agentId);
                    const vault = data.vaults.find((v) => v.id === rec.vaultId);
                    const badge = getRecommendationBadge(rec.action);

                    return (
                      <div
                        key={rec.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getPhilosophyIcon(agent?.philosophy || "")}
                            <div>
                              <h4 className="font-medium">{vault?.name}</h4>
                              <p className="text-sm text-gray-600">
                                {agent?.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={badge.color}>
                              {rec.action.toUpperCase()}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                rec.urgency === "critical"
                                  ? "border-red-500 text-red-700"
                                  : rec.urgency === "high"
                                    ? "border-orange-500 text-orange-700"
                                    : rec.urgency === "medium"
                                      ? "border-yellow-500 text-yellow-700"
                                      : "border-gray-500 text-gray-700"
                              }
                            >
                              {rec.urgency}
                            </Badge>
                            <Badge variant="outline">
                              {rec.confidence}% confidence
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-3">
                          {rec.reasoning}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">
                              Target Allocation:
                            </span>
                            <div className="font-medium">
                              {rec.targetAllocation}%
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Expected Return:
                            </span>
                            <div className="font-medium text-green-600">
                              +{(rec.expectedReturn * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Graham Safety:
                            </span>
                            <div className="font-medium">
                              {rec.philosophyAlignment.graham_safety}/100
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Valid Until:</span>
                            <div className="font-medium">
                              {rec.validUntil.toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
                          <strong>Risk Assessment:</strong> {rec.riskAssessment}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contrarian Alerts */}
          <TabsContent value="contrarian" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  <span>Templeton Contrarian Alerts</span>
                </CardTitle>
                <CardDescription>
                  Sir John Templeton-style contrarian opportunities in unloved
                  ecosystems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.contrairianAlerts.map((alert) => {
                    const vault = data.vaults.find(
                      (v) => v.id === alert.vaultId,
                    );

                    return (
                      <Alert
                        key={alert.id}
                        className={`border-l-4 ${
                          alert.severity === "critical"
                            ? "border-l-red-500"
                            : alert.severity === "high"
                              ? "border-l-orange-500"
                              : alert.severity === "medium"
                                ? "border-l-yellow-500"
                                : "border-l-blue-500"
                        }`}
                      >
                        <Globe className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{alert.title}</h4>
                              <div className="flex space-x-2">
                                <Badge
                                  variant="outline"
                                  className={
                                    alert.severity === "critical"
                                      ? "border-red-500 text-red-700"
                                      : alert.severity === "high"
                                        ? "border-orange-500 text-orange-700"
                                        : "border-yellow-500 text-yellow-700"
                                  }
                                >
                                  {alert.severity}
                                </Badge>
                                <Badge variant="outline">
                                  {alert.templetonScore}/100 Contrarian Score
                                </Badge>
                              </div>
                            </div>

                            <p className="text-gray-700">{alert.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h5 className="font-medium text-sm mb-2">
                                  Market Sentiment
                                </h5>
                                <div className="flex items-center space-x-2">
                                  <Progress
                                    value={Math.max(
                                      0,
                                      100 + alert.marketSentiment,
                                    )}
                                    className="flex-1"
                                  />
                                  <span className="text-sm font-medium">
                                    {alert.marketSentiment > 0 ? "+" : ""}
                                    {alert.marketSentiment}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <h5 className="font-medium text-sm mb-2">
                                  Fundamental Health
                                </h5>
                                <div className="flex items-center space-x-2">
                                  <Progress
                                    value={alert.fundamentalHealth}
                                    className="flex-1"
                                  />
                                  <span className="text-sm font-medium">
                                    {alert.fundamentalHealth}%
                                  </span>
                                </div>
                              </div>

                              <div>
                                <h5 className="font-medium text-sm mb-2">
                                  Potential Return
                                </h5>
                                <div className="text-lg font-bold text-green-600">
                                  +{(alert.potentialReturn * 100).toFixed(0)}%
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-sm mb-2">
                                  Catalysts
                                </h5>
                                <ul className="text-sm space-y-1">
                                  {alert.catalysts.map((catalyst, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start space-x-2"
                                    >
                                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5" />
                                      <span>{catalyst}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h5 className="font-medium text-sm mb-2">
                                  Risk Factors
                                </h5>
                                <ul className="text-sm space-y-1">
                                  {alert.riskFactors.map((risk, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start space-x-2"
                                    >
                                      <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5" />
                                      <span>{risk}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="text-sm text-gray-600">
                                <strong>Optimal Window:</strong>{" "}
                                {alert.timeWindow}
                              </div>
                              <Button
                                size="sm"
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                <Globe className="h-4 w-4 mr-2" />
                                Investigate Opportunity
                              </Button>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Builder */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Composition */}
              <Card>
                <CardHeader>
                  <CardTitle>Legendary Investor Portfolio</CardTitle>
                  <CardDescription>
                    Build a portfolio combining all four investment philosophies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Graham Safety", value: 30, fill: "#3B82F6" },
                          { name: "Buffett Moats", value: 35, fill: "#10B981" },
                          { name: "Marks Cycles", value: 20, fill: "#8B5CF6" },
                          {
                            name: "Templeton Contrarian",
                            value: 15,
                            fill: "#F59E0B",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      ></Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Risk-Return Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk-Return Profile</CardTitle>
                  <CardDescription>
                    Expected performance across market cycles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart
                      data={[
                        {
                          cycle: "Bear Market",
                          graham: 15,
                          buffett: 8,
                          marks: 12,
                          templeton: 25,
                        },
                        {
                          cycle: "Recovery",
                          graham: 18,
                          buffett: 22,
                          marks: 28,
                          templeton: 35,
                        },
                        {
                          cycle: "Bull Market",
                          graham: 12,
                          buffett: 18,
                          marks: 15,
                          templeton: 8,
                        },
                        {
                          cycle: "Peak/Bubble",
                          graham: 8,
                          buffett: 12,
                          marks: 5,
                          templeton: -5,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cycle" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="graham"
                        stackId="a"
                        fill="#3B82F6"
                        name="Graham Safety"
                      />
                      <Bar
                        dataKey="buffett"
                        stackId="a"
                        fill="#10B981"
                        name="Buffett Moats"
                      />
                      <Bar
                        dataKey="marks"
                        stackId="a"
                        fill="#8B5CF6"
                        name="Marks Cycles"
                      />
                      <Bar
                        dataKey="templeton"
                        stackId="a"
                        fill="#F59E0B"
                        name="Templeton Contrarian"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Construction</CardTitle>
                <CardDescription>
                  Build your optimal allocation based on legendary investor
                  principles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button className="h-24 flex flex-col space-y-2 bg-blue-600 hover:bg-blue-700">
                    <Shield className="h-6 w-6" />
                    <span>Graham Safety Portfolio</span>
                    <span className="text-xs">30%+ Safety Margin</span>
                  </Button>

                  <Button className="h-24 flex flex-col space-y-2 bg-green-600 hover:bg-green-700">
                    <Crown className="h-6 w-6" />
                    <span>Buffett Moat Portfolio</span>
                    <span className="text-xs">High-Quality Ecosystems</span>
                  </Button>

                  <Button className="h-24 flex flex-col space-y-2 bg-purple-600 hover:bg-purple-700">
                    <Target className="h-6 w-6" />
                    <span>Marks Cycle Portfolio</span>
                    <span className="text-xs">Optimal Timing</span>
                  </Button>

                  <Button className="h-24 flex flex-col space-y-2 bg-orange-600 hover:bg-orange-700">
                    <Globe className="h-6 w-6" />
                    <span>Templeton Contrarian</span>
                    <span className="text-xs">Maximum Pessimism</span>
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Warren-Graham-Marks-Templeton Synthesis
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    The ultimate strategy combines Graham's safety, Buffett's
                    quality focus, Marks' cycle awareness, and Templeton's
                    contrarian courage for ecosystem conservation.
                  </p>
                  <Button className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Build Legendary Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
