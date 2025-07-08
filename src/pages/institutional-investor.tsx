import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Progress } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Shield,
  Users,
  DollarSign,
  Globe,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Settings,
  FileText,
  Database,
  Zap,
  Activity,
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Bar,
} from "recharts";

const InstitutionalInvestor: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("1Y");
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>(null);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPortfolioData({
        totalAUM: 125800000,
        performance: {
          ytd: 8.2,
          oneYear: 12.4,
          threeYear: 15.7,
          fiveYear: 11.9,
        },
        portfolios: [
          {
            id: "core-equity",
            name: "Core Equity Fund",
            aum: 45200000,
            performance: 12.8,
            risk: "Medium",
            benchmark: "S&P 500",
            benchmarkPerformance: 10.2,
          },
          {
            id: "fixed-income",
            name: "Fixed Income Portfolio",
            aum: 32100000,
            performance: 6.4,
            risk: "Low",
            benchmark: "Bloomberg Agg",
            benchmarkPerformance: 5.8,
          },
          {
            id: "alternatives",
            name: "Alternative Investments",
            aum: 28400000,
            performance: 18.9,
            risk: "High",
            benchmark: "HFRI Index",
            benchmarkPerformance: 14.2,
          },
          {
            id: "emerging-markets",
            name: "Emerging Markets",
            aum: 20100000,
            performance: 15.3,
            risk: "High",
            benchmark: "MSCI EM",
            benchmarkPerformance: 13.7,
          },
        ],
        riskMetrics: {
          portfolioVaR: 2.8,
          sharpeRatio: 1.42,
          maxDrawdown: 8.7,
          beta: 0.95,
          alpha: 1.8,
          trackingError: 3.2,
        },
        compliance: {
          regulatoryReports: 23,
          pendingReviews: 3,
          lastAudit: "2024-01-15",
          complianceScore: 98.5,
        },
      });
      setLoading(false);
    }, 1000);
  };

  const performanceData = [
    { month: "Jan", portfolio: 8.2, benchmark: 7.1, alpha: 1.1 },
    { month: "Feb", portfolio: 8.7, benchmark: 7.8, alpha: 0.9 },
    { month: "Mar", portfolio: 9.1, benchmark: 8.2, alpha: 0.9 },
    { month: "Apr", portfolio: 9.8, benchmark: 8.9, alpha: 0.9 },
    { month: "May", portfolio: 10.2, benchmark: 9.4, alpha: 0.8 },
    { month: "Jun", portfolio: 10.9, benchmark: 9.8, alpha: 1.1 },
    { month: "Jul", portfolio: 11.4, benchmark: 10.1, alpha: 1.3 },
    { month: "Aug", portfolio: 11.8, benchmark: 10.6, alpha: 1.2 },
    { month: "Sep", portfolio: 12.1, benchmark: 10.9, alpha: 1.2 },
    { month: "Oct", portfolio: 12.0, benchmark: 10.8, alpha: 1.2 },
    { month: "Nov", portfolio: 12.3, benchmark: 11.2, alpha: 1.1 },
    { month: "Dec", portfolio: 12.4, benchmark: 11.5, alpha: 0.9 },
  ];

  const allocationData = [
    { name: "Equities", value: 45, target: 50, variance: -5 },
    { name: "Fixed Income", value: 32, target: 30, variance: 2 },
    { name: "Alternatives", value: 15, target: 15, variance: 0 },
    { name: "Cash & Equivalents", value: 8, target: 5, variance: 3 },
  ];

  const riskData = [
    { date: "2024-01", var95: 2.1, var99: 3.2, realized: 1.8 },
    { date: "2024-02", var95: 2.3, var99: 3.4, realized: 2.1 },
    { date: "2024-03", var95: 2.8, var99: 4.1, realized: 2.6 },
    { date: "2024-04", var95: 2.5, var99: 3.8, realized: 2.2 },
    { date: "2024-05", var95: 2.2, var99: 3.3, realized: 1.9 },
    { date: "2024-06", var95: 2.4, var99: 3.6, realized: 2.3 },
  ];

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getPerformanceColor = (value: number): string => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getPerformanceIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            Loading institutional dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                Institutional Investment Management
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Enterprise-grade portfolio management and analytics
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(portfolioData?.totalAUM || 0)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Assets Under Management
                </div>
              </div>
              <Button>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                YTD Performance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {portfolioData?.performance?.ytd}%
              </div>
              <p className="text-xs text-muted-foreground">
                vs. benchmark: +
                {(portfolioData?.performance?.ytd - 7.1).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sharpe Ratio
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {portfolioData?.riskMetrics?.sharpeRatio}
              </div>
              <p className="text-xs text-muted-foreground">
                Risk-adjusted returns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Portfolio VaR (95%)
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {portfolioData?.riskMetrics?.portfolioVaR}%
              </div>
              <p className="text-xs text-muted-foreground">
                1-day Value at Risk
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Alpha Generation
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +{portfolioData?.riskMetrics?.alpha}%
              </div>
              <p className="text-xs text-muted-foreground">
                Annualized excess return
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
              <TabsTrigger value="risk">Risk</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Performance vs. Benchmark</CardTitle>
                  <CardDescription>
                    YTD performance comparison and alpha generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: any) => [`${value}%`, ""]}
                        />
                        <Area
                          type="monotone"
                          dataKey="portfolio"
                          stroke="#2563eb"
                          fill="#3b82f6"
                          fillOpacity={0.1}
                          name="Portfolio"
                        />
                        <Line
                          type="monotone"
                          dataKey="benchmark"
                          stroke="#64748b"
                          strokeDasharray="5 5"
                          name="Benchmark"
                        />
                        <Bar dataKey="alpha" fill="#10b981" name="Alpha" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Asset Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle>Strategic Asset Allocation</CardTitle>
                  <CardDescription>
                    Current vs. target allocation with variance analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allocationData.map((asset, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{asset.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{asset.value}%</span>
                            <Badge
                              variant={
                                asset.variance >= 0 ? "default" : "destructive"
                              }
                            >
                              {asset.variance >= 0 ? "+" : ""}
                              {asset.variance}%
                            </Badge>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={asset.value} className="h-2" />
                          <div
                            className="absolute top-0 h-2 w-1 bg-orange-500 rounded"
                            style={{ left: `${asset.target}%` }}
                            title={`Target: ${asset.target}%`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {portfolioData?.portfolios?.map(
                (portfolio: any, index: number) => (
                  <Card key={portfolio.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {portfolio.name}
                      </CardTitle>
                      <CardDescription>
                        {formatCurrency(portfolio.aum)} AUM
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Performance:</span>
                          <span
                            className={`font-medium ${getPerformanceColor(portfolio.performance)}`}
                          >
                            {portfolio.performance >= 0 ? "+" : ""}
                            {portfolio.performance}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">
                            vs. {portfolio.benchmark}:
                          </span>
                          <span
                            className={`font-medium ${getPerformanceColor(portfolio.performance - portfolio.benchmarkPerformance)}`}
                          >
                            {portfolio.performance -
                              portfolio.benchmarkPerformance >=
                            0
                              ? "+"
                              : ""}
                            {(
                              portfolio.performance -
                              portfolio.benchmarkPerformance
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Risk Level:</span>
                          <Badge
                            variant={
                              portfolio.risk === "Low"
                                ? "default"
                                : portfolio.risk === "Medium"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {portfolio.risk}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </TabsContent>

          {/* Portfolios Tab */}
          <TabsContent value="portfolios" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Portfolio Management</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {portfolioData?.portfolios?.map((portfolio: any) => (
                  <Card key={portfolio.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{portfolio.name}</CardTitle>
                        <Button variant="outline" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        {formatCurrency(portfolio.aum)} • {portfolio.benchmark}{" "}
                        Benchmark
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-2xl font-bold">
                            {portfolio.performance}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            YTD Return
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {portfolio.benchmarkPerformance}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Benchmark
                          </div>
                        </div>
                        <div>
                          <div
                            className={`text-2xl font-bold ${getPerformanceColor(portfolio.performance - portfolio.benchmarkPerformance)}`}
                          >
                            {portfolio.performance -
                              portfolio.benchmarkPerformance >=
                            0
                              ? "+"
                              : ""}
                            {(
                              portfolio.performance -
                              portfolio.benchmarkPerformance
                            ).toFixed(1)}
                            %
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Alpha
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Rebalance Portfolios
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Portfolio Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alerts & Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Fixed Income allocation 2% above target
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Core Equity outperforming benchmark by 2.6%
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Risk Tab */}
          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Value at Risk Analysis</CardTitle>
                  <CardDescription>
                    VaR 95% and 99% confidence intervals vs. realized volatility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={riskData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: any) => [`${value}%`, ""]}
                        />
                        <Line
                          type="monotone"
                          dataKey="var95"
                          stroke="#f59e0b"
                          name="VaR 95%"
                        />
                        <Line
                          type="monotone"
                          dataKey="var99"
                          stroke="#ef4444"
                          name="VaR 99%"
                        />
                        <Line
                          type="monotone"
                          dataKey="realized"
                          stroke="#10b981"
                          name="Realized"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                  <CardDescription>
                    Key risk indicators and portfolio statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Portfolio Beta",
                        value: portfolioData?.riskMetrics?.beta,
                        format: "decimal",
                      },
                      {
                        label: "Sharpe Ratio",
                        value: portfolioData?.riskMetrics?.sharpeRatio,
                        format: "decimal",
                      },
                      {
                        label: "Maximum Drawdown",
                        value: portfolioData?.riskMetrics?.maxDrawdown,
                        format: "percent",
                      },
                      {
                        label: "Tracking Error",
                        value: portfolioData?.riskMetrics?.trackingError,
                        format: "percent",
                      },
                      {
                        label: "Alpha (Annualized)",
                        value: portfolioData?.riskMetrics?.alpha,
                        format: "percent",
                      },
                    ].map((metric, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <span className="font-medium">{metric.label}</span>
                        <span className="text-lg font-bold">
                          {metric.format === "percent"
                            ? `${metric.value}%`
                            : metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Risk Monitoring Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">
                      Normal
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Risk Level
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">15.2%</div>
                    <div className="text-sm text-muted-foreground">
                      Portfolio Volatility
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">0.95</div>
                    <div className="text-sm text-muted-foreground">
                      Correlation to Market
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Overview</CardTitle>
                  <CardDescription>
                    Regulatory compliance status and recent activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Compliance Score</span>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={portfolioData?.compliance?.complianceScore}
                          className="w-24"
                        />
                        <span className="font-bold">
                          {portfolioData?.compliance?.complianceScore}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {portfolioData?.compliance?.regulatoryReports}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Reports Filed
                        </div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {portfolioData?.compliance?.pendingReviews}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Pending Reviews
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Last Audit</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(
                          portfolioData?.compliance?.lastAudit || "",
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Compliance Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: "Report",
                        description: "Form ADV filed with SEC",
                        date: "2 days ago",
                        status: "completed",
                      },
                      {
                        type: "Review",
                        description: "Portfolio compliance check",
                        date: "1 week ago",
                        status: "completed",
                      },
                      {
                        type: "Audit",
                        description: "Annual regulatory audit",
                        date: "2 weeks ago",
                        status: "pending",
                      },
                      {
                        type: "Filing",
                        description: "Quarterly holdings report",
                        date: "3 weeks ago",
                        status: "completed",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{activity.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.description}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              activity.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {activity.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {activity.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Regulatory Requirements</CardTitle>
                <CardDescription>
                  Upcoming deadlines and requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      requirement: "Form 13F Filing",
                      deadline: "2024-02-15",
                      status: "upcoming",
                    },
                    {
                      requirement: "Annual Compliance Review",
                      deadline: "2024-03-01",
                      status: "scheduled",
                    },
                    {
                      requirement: "Client Reporting",
                      deadline: "2024-01-31",
                      status: "overdue",
                    },
                  ].map((req, index) => (
                    <Alert
                      key={index}
                      className={
                        req.status === "overdue"
                          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                          : req.status === "upcoming"
                            ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
                            : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
                      }
                    >
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-center">
                          <span>
                            <strong>{req.requirement}</strong> - Due:{" "}
                            {req.deadline}
                          </span>
                          <Badge
                            variant={
                              req.status === "overdue"
                                ? "destructive"
                                : req.status === "upcoming"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {req.status}
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InstitutionalInvestor;
