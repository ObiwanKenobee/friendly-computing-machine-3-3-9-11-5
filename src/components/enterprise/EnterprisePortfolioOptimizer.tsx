import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  TrendingUp,
  Shield,
  Target,
  BarChart3,
  PieChart,
  DollarSign,
  Brain,
  Zap,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers,
  Network,
  Cpu,
  Database,
  MonitorSpeaker,
} from "lucide-react";

// Import optimization service
import { adaptiveYieldOptimizationService } from "@/services/adaptiveYieldOptimizationService";
import { legendaryInvestorIntegrationService } from "@/services/legendaryInvestorIntegrationService";

interface OptimizationResult {
  portfolioId: string;
  timestamp: Date;
  originalAllocation: { [key: string]: number };
  optimizedAllocation: { [key: string]: number };
  expectedReturn: number;
  riskScore: number;
  confidence: number;
  philosophyBreakdown: {
    munger: number;
    buffett: number;
    dalio: number;
    lynch: number;
  };
  recommendations: OptimizationRecommendation[];
}

interface OptimizationRecommendation {
  id: string;
  type: "rebalance" | "add" | "remove" | "hold";
  asset: string;
  currentWeight: number;
  targetWeight: number;
  reasoning: string;
  confidence: number;
  philosophy: string;
  impact: "high" | "medium" | "low";
  timeframe: string;
}

interface AssetMetrics {
  symbol: string;
  name: string;
  currentPrice: number;
  weight: number;
  value: number;
  dayChange: number;
  weekChange: number;
  monthChange: number;
  yearChange: number;
  volatility: number;
  sharpeRatio: number;
  moatScore: number;
  mungerScore: number;
  lynchInsightScore: number;
  dalioRiskScore: number;
}

interface OptimizationParams {
  riskTolerance: number;
  timeHorizon: number;
  minDiversification: number;
  maxSinglePosition: number;
  philosophyWeights: {
    munger: number;
    buffett: number;
    dalio: number;
    lynch: number;
  };
  constraints: {
    excludeSectors: string[];
    includeOnly: string[];
    maxTurnover: number;
    minLiquidity: number;
  };
}

export const EnterprisePortfolioOptimizer: React.FC = () => {
  const [optimizationResult, setOptimizationResult] =
    useState<OptimizationResult | null>(null);
  const [currentAssets, setCurrentAssets] = useState<AssetMetrics[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [optimizationParams, setOptimizationParams] =
    useState<OptimizationParams>({
      riskTolerance: 50,
      timeHorizon: 60,
      minDiversification: 80,
      maxSinglePosition: 25,
      philosophyWeights: {
        munger: 25,
        buffett: 30,
        dalio: 25,
        lynch: 20,
      },
      constraints: {
        excludeSectors: [],
        includeOnly: [],
        maxTurnover: 20,
        minLiquidity: 1000000,
      },
    });
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("6M");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [autoOptimization, setAutoOptimization] = useState(false);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const [assetsData] = await Promise.all([
        legendaryInvestorIntegrationService.getCurrentPortfolioAssets(),
      ]);
      setCurrentAssets(assetsData);
    } catch (error) {
      console.error("Failed to load portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };

  const runOptimization = async () => {
    try {
      setOptimizing(true);
      const result = await adaptiveYieldOptimizationService.optimizePortfolio({
        assets: currentAssets,
        params: optimizationParams,
        philosophyWeights: optimizationParams.philosophyWeights,
      });
      setOptimizationResult(result);
    } catch (error) {
      console.error("Optimization failed:", error);
    } finally {
      setOptimizing(false);
    }
  };

  const runMonteCarloSimulation = async () => {
    try {
      setSimulationRunning(true);
      await adaptiveYieldOptimizationService.runMonteCarloSimulation({
        portfolioId: "current",
        iterations: 10000,
        timeHorizon: optimizationParams.timeHorizon,
        confidenceLevel: 0.95,
      });
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setSimulationRunning(false);
    }
  };

  const applyOptimization = async () => {
    if (!optimizationResult) return;

    try {
      await legendaryInvestorIntegrationService.applyPortfolioOptimization({
        optimizationId: optimizationResult.portfolioId,
        targetAllocation: optimizationResult.optimizedAllocation,
      });
      await loadPortfolioData();
    } catch (error) {
      console.error("Failed to apply optimization:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getPerformanceColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskBadgeColor = (riskScore: number) => {
    if (riskScore <= 30) return "bg-green-100 text-green-800";
    if (riskScore <= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Portfolio Optimizer
          </h2>
          <p className="text-muted-foreground">
            AI-powered optimization using legendary investor strategies
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={autoOptimization ? "default" : "secondary"}>
            {autoOptimization ? "Auto-Optimization ON" : "Manual Mode"}
          </Badge>
          <Button
            variant="outline"
            onClick={() => setAutoOptimization(!autoOptimization)}
          >
            {autoOptimization ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={runOptimization}
            disabled={optimizing}
            className="flex items-center gap-2"
          >
            {optimizing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Optimize Portfolio
          </Button>
        </div>
      </div>

      {/* Optimization Parameters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Optimization Parameters</CardTitle>
              <CardDescription>
                Configure your investment strategy and constraints
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            >
              {showAdvancedSettings ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showAdvancedSettings ? "Hide" : "Show"} Advanced
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Risk Tolerance</label>
              <Slider
                value={[optimizationParams.riskTolerance]}
                onValueChange={(value) =>
                  setOptimizationParams((prev) => ({
                    ...prev,
                    riskTolerance: value[0],
                  }))
                }
                max={100}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground text-center">
                {optimizationParams.riskTolerance}% Risk Tolerance
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Time Horizon (Months)
              </label>
              <Input
                type="number"
                value={optimizationParams.timeHorizon}
                onChange={(e) =>
                  setOptimizationParams((prev) => ({
                    ...prev,
                    timeHorizon: parseInt(e.target.value) || 60,
                  }))
                }
                min={1}
                max={360}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Min Diversification</label>
              <Slider
                value={[optimizationParams.minDiversification]}
                onValueChange={(value) =>
                  setOptimizationParams((prev) => ({
                    ...prev,
                    minDiversification: value[0],
                  }))
                }
                max={100}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground text-center">
                {optimizationParams.minDiversification}% Min Diversification
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Single Position</label>
              <Slider
                value={[optimizationParams.maxSinglePosition]}
                onValueChange={(value) =>
                  setOptimizationParams((prev) => ({
                    ...prev,
                    maxSinglePosition: value[0],
                  }))
                }
                max={50}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground text-center">
                {optimizationParams.maxSinglePosition}% Max Position
              </div>
            </div>
          </div>

          {/* Philosophy Weights */}
          <div className="space-y-4">
            <h4 className="font-semibold">Investment Philosophy Weights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">
                    Munger Mental Models
                  </span>
                </div>
                <Slider
                  value={[optimizationParams.philosophyWeights.munger]}
                  onValueChange={(value) =>
                    setOptimizationParams((prev) => ({
                      ...prev,
                      philosophyWeights: {
                        ...prev.philosophyWeights,
                        munger: value[0],
                      },
                    }))
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">
                  {optimizationParams.philosophyWeights.munger}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Buffett Moats</span>
                </div>
                <Slider
                  value={[optimizationParams.philosophyWeights.buffett]}
                  onValueChange={(value) =>
                    setOptimizationParams((prev) => ({
                      ...prev,
                      philosophyWeights: {
                        ...prev.philosophyWeights,
                        buffett: value[0],
                      },
                    }))
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">
                  {optimizationParams.philosophyWeights.buffett}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Dalio Balance</span>
                </div>
                <Slider
                  value={[optimizationParams.philosophyWeights.dalio]}
                  onValueChange={(value) =>
                    setOptimizationParams((prev) => ({
                      ...prev,
                      philosophyWeights: {
                        ...prev.philosophyWeights,
                        dalio: value[0],
                      },
                    }))
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">
                  {optimizationParams.philosophyWeights.dalio}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Lynch Insights</span>
                </div>
                <Slider
                  value={[optimizationParams.philosophyWeights.lynch]}
                  onValueChange={(value) =>
                    setOptimizationParams((prev) => ({
                      ...prev,
                      philosophyWeights: {
                        ...prev.philosophyWeights,
                        lynch: value[0],
                      },
                    }))
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">
                  {optimizationParams.philosophyWeights.lynch}%
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          {showAdvancedSettings && (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold">Advanced Constraints</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Max Portfolio Turnover (%)
                  </label>
                  <Input
                    type="number"
                    value={optimizationParams.constraints.maxTurnover}
                    onChange={(e) =>
                      setOptimizationParams((prev) => ({
                        ...prev,
                        constraints: {
                          ...prev.constraints,
                          maxTurnover: parseFloat(e.target.value) || 20,
                        },
                      }))
                    }
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Min Daily Liquidity ($)
                  </label>
                  <Input
                    type="number"
                    value={optimizationParams.constraints.minLiquidity}
                    onChange={(e) =>
                      setOptimizationParams((prev) => ({
                        ...prev,
                        constraints: {
                          ...prev.constraints,
                          minLiquidity: parseFloat(e.target.value) || 1000000,
                        },
                      }))
                    }
                    min={0}
                    step={100000}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Portfolio vs Optimized */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current Portfolio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Current Portfolio
            </CardTitle>
            <CardDescription>
              Your current asset allocation and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentAssets.slice(0, 8).map((asset) => (
                <div
                  key={asset.symbol}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{asset.symbol}</span>
                      <Badge variant="outline" className="text-xs">
                        {asset.weight.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {asset.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(asset.value)}
                    </div>
                    <div
                      className={`text-sm ${getPerformanceColor(asset.dayChange)}`}
                    >
                      {formatPercent(asset.dayChange)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimized Portfolio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Optimized Portfolio
              {optimizationResult && (
                <Badge className="ml-2">
                  {optimizationResult.confidence}% Confidence
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              AI-recommended allocation for maximum risk-adjusted returns
            </CardDescription>
          </CardHeader>
          <CardContent>
            {optimizationResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatPercent(optimizationResult.expectedReturn)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Expected Return
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${getScoreColor(100 - optimizationResult.riskScore)}`}
                    >
                      {optimizationResult.riskScore}/100
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Risk Score
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {optimizationResult.confidence}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      AI Confidence
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(optimizationResult.optimizedAllocation)
                    .slice(0, 8)
                    .map(([symbol, weight]) => {
                      const currentAsset = currentAssets.find(
                        (a) => a.symbol === symbol,
                      );
                      const currentWeight = currentAsset?.weight || 0;
                      const change = weight - currentWeight;

                      return (
                        <div
                          key={symbol}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{symbol}</span>
                              <Badge variant="outline" className="text-xs">
                                {weight.toFixed(1)}%
                              </Badge>
                              {Math.abs(change) > 0.5 && (
                                <Badge
                                  variant={
                                    change > 0 ? "default" : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  {change > 0 ? (
                                    <ArrowUpRight className="w-3 h-3" />
                                  ) : (
                                    <ArrowDownRight className="w-3 h-3" />
                                  )}
                                  {Math.abs(change).toFixed(1)}%
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {currentAsset?.name || symbol}
                            </div>
                          </div>
                          <div className="w-24">
                            <Progress value={weight} className="h-2" />
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={applyOptimization} className="flex-1">
                    Apply Optimization
                  </Button>
                  <Button
                    variant="outline"
                    onClick={runMonteCarloSimulation}
                    disabled={simulationRunning}
                  >
                    {simulationRunning ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <Activity className="w-4 h-4" />
                    )}
                    Simulate
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Run optimization to see AI-recommended portfolio allocation
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Optimization Recommendations */}
      {optimizationResult && optimizationResult.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Detailed reasoning behind optimization suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimizationResult.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            rec.type === "add"
                              ? "default"
                              : rec.type === "remove"
                                ? "destructive"
                                : rec.type === "rebalance"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {rec.type.toUpperCase()}
                        </Badge>
                        <span className="font-semibold">{rec.asset}</span>
                        <Badge variant="outline" className="text-xs">
                          {rec.philosophy}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.reasoning}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {rec.currentWeight.toFixed(1)}% →{" "}
                        {rec.targetWeight.toFixed(1)}%
                      </div>
                      <Badge
                        variant={
                          rec.impact === "high"
                            ? "default"
                            : rec.impact === "medium"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {rec.impact} impact
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Confidence: {rec.confidence}%</span>
                    <span>Timeframe: {rec.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
