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
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  BarChart3,
  Activity,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Settings,
  Bell,
  RefreshCw,
  Download,
  Filter,
  Search,
  Zap,
  Lock,
  Unlock,
  Users,
  Globe,
  Calendar,
  Database,
  MonitorSpeaker,
  Gauge,
  ThermometerSun,
  CloudDrizzle,
  Wind,
  Snowflake,
} from "lucide-react";

// Import risk management services
import { mungerMentalModelsService } from "@/services/mungerMentalModelsService";
import { buffettMoatService } from "@/services/buffettMoatService";
import { dalioSystemsService } from "@/services/dalioSystemsService";
import { lynchLocalInsightService } from "@/services/lynchLocalInsightService";

interface RiskAlert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type:
    | "market"
    | "liquidity"
    | "concentration"
    | "correlation"
    | "volatility"
    | "credit"
    | "operational";
  title: string;
  description: string;
  asset?: string;
  impact: number;
  probability: number;
  timeframe: string;
  recommendation: string;
  philosophy: "munger" | "buffett" | "dalio" | "lynch" | "system";
  createdAt: Date;
  acknowledged: boolean;
}

interface RiskMetric {
  name: string;
  value: number;
  threshold: number;
  status: "healthy" | "warning" | "critical";
  change24h: number;
  historical: number[];
  benchmark: number;
}

interface StressTestResult {
  scenario: string;
  portfolioLoss: number;
  worstAsset: string;
  worstAssetLoss: number;
  correlationBreakdown: number;
  liquidityImpact: number;
  timeToRecover: number;
  mitigationSuggestions: string[];
}

interface VaRAnalysis {
  timeframe: "1D" | "1W" | "1M";
  confidenceLevel: number;
  valueAtRisk: number;
  expectedShortfall: number;
  maxDrawdown: number;
  stressTestResults: StressTestResult[];
}

export const EnterpriseRiskManagement: React.FC = () => {
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([]);
  const [varAnalysis, setVarAnalysis] = useState<VaRAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "1D" | "1W" | "1M"
  >("1W");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [showAcknowledged, setShowAcknowledged] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    loadRiskData();
  }, [selectedTimeframe]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadRiskData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const loadRiskData = async () => {
    try {
      setLoading(true);

      // Simulate loading risk data from all philosophy services
      const [mungerRisks, buffettRisks, dalioRisks, lynchRisks] =
        await Promise.all([
          mungerMentalModelsService.assessPortfolioRisks(),
          buffettMoatService.evaluateRiskFactors(),
          dalioSystemsService.analyzeRiskParity(),
          lynchLocalInsightService.evaluateLocalRisks(),
        ]);

      // Combine risk alerts from all sources
      const combinedAlerts: RiskAlert[] = [
        ...mungerRisks.map((risk: any) => ({
          ...risk,
          philosophy: "munger" as const,
        })),
        ...buffettRisks.map((risk: any) => ({
          ...risk,
          philosophy: "buffett" as const,
        })),
        ...dalioRisks.map((risk: any) => ({
          ...risk,
          philosophy: "dalio" as const,
        })),
        ...lynchRisks.map((risk: any) => ({
          ...risk,
          philosophy: "lynch" as const,
        })),
      ];

      setRiskAlerts(combinedAlerts);

      // Load risk metrics
      const metrics: RiskMetric[] = [
        {
          name: "Portfolio VaR (95%)",
          value: 4.2,
          threshold: 5.0,
          status: "healthy",
          change24h: -0.3,
          historical: [4.1, 4.3, 4.5, 4.2, 4.0, 4.2],
          benchmark: 4.5,
        },
        {
          name: "Maximum Drawdown",
          value: 12.7,
          threshold: 15.0,
          status: "warning",
          change24h: 1.2,
          historical: [11.5, 12.1, 12.7, 12.3, 12.0, 12.7],
          benchmark: 13.2,
        },
        {
          name: "Correlation Risk",
          value: 0.73,
          threshold: 0.8,
          status: "warning",
          change24h: 0.05,
          historical: [0.68, 0.71, 0.73, 0.7, 0.69, 0.73],
          benchmark: 0.65,
        },
        {
          name: "Liquidity Risk",
          value: 2.1,
          threshold: 3.0,
          status: "healthy",
          change24h: -0.1,
          historical: [2.3, 2.2, 2.1, 2.0, 2.1, 2.1],
          benchmark: 2.5,
        },
        {
          name: "Concentration Risk",
          value: 8.9,
          threshold: 10.0,
          status: "warning",
          change24h: 0.4,
          historical: [8.5, 8.7, 8.9, 8.6, 8.4, 8.9],
          benchmark: 7.5,
        },
        {
          name: "Volatility Clustering",
          value: 1.34,
          threshold: 1.5,
          status: "healthy",
          change24h: -0.02,
          historical: [1.36, 1.35, 1.34, 1.32, 1.33, 1.34],
          benchmark: 1.25,
        },
      ];

      setRiskMetrics(metrics);

      // Load VaR analysis
      const varData: VaRAnalysis = {
        timeframe: selectedTimeframe,
        confidenceLevel: 0.95,
        valueAtRisk: 4.2,
        expectedShortfall: 6.8,
        maxDrawdown: 12.7,
        stressTestResults: [
          {
            scenario: "2008 Financial Crisis",
            portfolioLoss: -23.4,
            worstAsset: "Banking Sector ETF",
            worstAssetLoss: -45.2,
            correlationBreakdown: 0.85,
            liquidityImpact: -15.3,
            timeToRecover: 18,
            mitigationSuggestions: [
              "Reduce financial sector exposure",
              "Increase cash allocation",
              "Add defensive assets",
            ],
          },
          {
            scenario: "COVID-19 Market Crash",
            portfolioLoss: -18.7,
            worstAsset: "Travel & Leisure",
            worstAssetLoss: -52.1,
            correlationBreakdown: 0.92,
            liquidityImpact: -22.8,
            timeToRecover: 12,
            mitigationSuggestions: [
              "Diversify across sectors",
              "Add healthcare allocation",
              "Consider ESG factors",
            ],
          },
          {
            scenario: "Interest Rate Shock",
            portfolioLoss: -11.2,
            worstAsset: "Long-term Bonds",
            worstAssetLoss: -28.9,
            correlationBreakdown: 0.67,
            liquidityImpact: -8.4,
            timeToRecover: 8,
            mitigationSuggestions: [
              "Reduce duration risk",
              "Add inflation protection",
              "Consider floating rate instruments",
            ],
          },
        ],
      };

      setVarAnalysis(varData);
    } catch (error) {
      console.error("Failed to load risk data:", error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    setRiskAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert,
      ),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100";
      case "warning":
        return "bg-yellow-100";
      case "critical":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "medium":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPhilosophyColor = (philosophy: string) => {
    switch (philosophy) {
      case "munger":
        return "bg-purple-100 text-purple-800";
      case "buffett":
        return "bg-green-100 text-green-800";
      case "dalio":
        return "bg-blue-100 text-blue-800";
      case "lynch":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAlerts = riskAlerts.filter((alert) => {
    const severityFilter =
      selectedSeverity === "all" || alert.severity === selectedSeverity;
    const acknowledgedFilter = showAcknowledged || !alert.acknowledged;
    return severityFilter && acknowledgedFilter;
  });

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
          <h2 className="text-3xl font-bold tracking-tight">Risk Management</h2>
          <p className="text-muted-foreground">
            Comprehensive risk monitoring across all investment philosophies
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={autoRefresh ? "default" : "secondary"}>
            {autoRefresh
              ? `Auto-refresh ${refreshInterval}s`
              : "Manual refresh"}
          </Badge>
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={loadRiskData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Alerts
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredAlerts.filter((a) => a.severity === "critical").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High Risk Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredAlerts.filter((a) => a.severity === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">Monitor closely</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio VaR</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {varAnalysis?.valueAtRisk.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              95% confidence, {selectedTimeframe}
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {varAnalysis?.maxDrawdown.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Historical maximum</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Risk Alerts</TabsTrigger>
          <TabsTrigger value="metrics">Risk Metrics</TabsTrigger>
          <TabsTrigger value="stress-test">Stress Testing</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
        </TabsList>

        {/* Risk Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="flex items-center gap-4">
            <Select
              value={selectedSeverity}
              onValueChange={setSelectedSeverity}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowAcknowledged(!showAcknowledged)}
            >
              {showAcknowledged ? (
                <EyeOff className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {showAcknowledged ? "Hide" : "Show"} Acknowledged
            </Button>
          </div>

          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`border-l-4 ${
                  alert.severity === "critical"
                    ? "border-l-red-500"
                    : alert.severity === "high"
                      ? "border-l-orange-500"
                      : alert.severity === "medium"
                        ? "border-l-yellow-500"
                        : "border-l-blue-500"
                } ${alert.acknowledged ? "opacity-60" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(alert.severity)}
                      <div>
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getPhilosophyColor(alert.philosophy)}
                          >
                            {alert.philosophy}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {alert.type}
                          </Badge>
                          {alert.asset && (
                            <Badge variant="secondary" className="text-xs">
                              {alert.asset}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {alert.createdAt.toLocaleDateString()}
                      </div>
                      {alert.acknowledged && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Acknowledged
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{alert.description}</p>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {alert.impact}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Potential Impact
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {alert.probability}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Probability
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {alert.timeframe}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Timeframe
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Recommendation:
                    </h4>
                    <p className="text-blue-700">{alert.recommendation}</p>
                  </div>

                  {!alert.acknowledged && (
                    <Button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="w-full"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Acknowledge Alert
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Risk Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {riskMetrics.map((metric) => (
              <Card key={metric.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusBgColor(metric.status)}`}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${getStatusColor(metric.status)}`}
                    >
                      {metric.value.toFixed(2)}
                      {metric.name.includes("%") || metric.name.includes("VaR")
                        ? "%"
                        : ""}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Threshold: {metric.threshold}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current vs Threshold</span>
                      <span>
                        {((metric.value / metric.threshold) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(metric.value / metric.threshold) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>24h Change:</span>
                    <span
                      className={
                        metric.change24h >= 0
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {metric.change24h >= 0 ? "+" : ""}
                      {metric.change24h.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Benchmark:</span>
                    <span
                      className={
                        metric.value <= metric.benchmark
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {metric.benchmark.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Stress Testing Tab */}
        <TabsContent value="stress-test" className="space-y-4">
          {varAnalysis && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="w-5 h-5" />
                    Value at Risk Analysis
                  </CardTitle>
                  <CardDescription>
                    Risk assessment at {varAnalysis.confidenceLevel * 100}%
                    confidence level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {varAnalysis.valueAtRisk.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Value at Risk
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {varAnalysis.expectedShortfall.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expected Shortfall
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {varAnalysis.maxDrawdown.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Max Drawdown
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Stress Test Scenarios</h3>
                {varAnalysis.stressTestResults.map((result, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ThermometerSun className="w-5 h-5" />
                        {result.scenario}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {result.portfolioLoss.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Portfolio Loss
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {result.worstAssetLoss.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Worst Asset
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {result.correlationBreakdown.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Correlation
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {result.timeToRecover}m
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Recovery Time
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          Mitigation Strategies:
                        </h4>
                        <ul className="space-y-1">
                          {result.mitigationSuggestions.map(
                            (suggestion, idx) => (
                              <li
                                key={idx}
                                className="text-blue-700 flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                {suggestion}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Live Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <Alert>
            <MonitorSpeaker className="h-4 w-4" />
            <AlertTitle>Real-Time Risk Monitoring</AlertTitle>
            <AlertDescription>
              Live monitoring of risk factors across all investment positions
              and market conditions.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Factor Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Market Risk", level: 65, color: "bg-yellow-500" },
                    { name: "Credit Risk", level: 30, color: "bg-green-500" },
                    {
                      name: "Liquidity Risk",
                      level: 45,
                      color: "bg-green-500",
                    },
                    {
                      name: "Operational Risk",
                      level: 20,
                      color: "bg-green-500",
                    },
                    {
                      name: "Currency Risk",
                      level: 55,
                      color: "bg-yellow-500",
                    },
                    {
                      name: "Interest Rate Risk",
                      level: 75,
                      color: "bg-red-500",
                    },
                  ].map((risk) => (
                    <div key={risk.name} className="flex items-center gap-4">
                      <div className="w-32 text-sm">{risk.name}</div>
                      <div className="flex-1">
                        <Progress value={risk.level} className="h-3" />
                      </div>
                      <div className="text-sm font-medium w-12">
                        {risk.level}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Volatility Index (VIX)</span>
                    <Badge variant="secondary">18.5 (+2.1)</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Market Sentiment</span>
                    <Badge variant="outline">Neutral</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Correlation Regime</span>
                    <Badge variant="destructive">High</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Liquidity Conditions</span>
                    <Badge variant="default">Normal</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
