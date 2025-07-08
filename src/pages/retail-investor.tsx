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
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Award,
  BookOpen,
  Lightbulb,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  BarChart3,
  LineChart,
  Activity,
  Wallet,
  Settings,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Calculator,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const RetailInvestor: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showBalance, setShowBalance] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<any>(null);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = () => {
    // Simulate portfolio data
    setPortfolioData({
      totalValue: 45680,
      totalInvested: 42000,
      totalGains: 3680,
      totalGainsPercent: 8.76,
      cashBalance: 2350,
      monthlyContribution: 500,
      portfolioAllocation: [
        { name: "Stocks", value: 22840, percent: 50, color: "#3b82f6" },
        { name: "Bonds", value: 13704, percent: 30, color: "#10b981" },
        { name: "ETFs", value: 6852, percent: 15, color: "#f59e0b" },
        { name: "Cash", value: 2284, percent: 5, color: "#6b7280" },
      ],
      goals: [
        {
          id: "retirement",
          name: "Retirement",
          target: 500000,
          current: 45680,
          monthlyContribution: 300,
          timeframe: "25 years",
          progress: 9.1,
          onTrack: true,
        },
        {
          id: "emergency",
          name: "Emergency Fund",
          target: 15000,
          current: 8500,
          monthlyContribution: 100,
          timeframe: "2 years",
          progress: 56.7,
          onTrack: true,
        },
        {
          id: "house",
          name: "House Down Payment",
          target: 60000,
          current: 12000,
          monthlyContribution: 800,
          timeframe: "5 years",
          progress: 20.0,
          onTrack: false,
        },
      ],
      recentTransactions: [
        {
          date: "2024-01-15",
          type: "Buy",
          symbol: "AAPL",
          shares: 5,
          price: 185.64,
          amount: -928.2,
        },
        {
          date: "2024-01-10",
          type: "Dividend",
          symbol: "VTI",
          shares: 0,
          price: 0,
          amount: 12.45,
        },
        {
          date: "2024-01-08",
          type: "Buy",
          symbol: "VTI",
          shares: 10,
          price: 245.3,
          amount: -2453.0,
        },
        {
          date: "2024-01-05",
          type: "Deposit",
          symbol: "",
          shares: 0,
          price: 0,
          amount: 500.0,
        },
      ],
      performance: [
        { month: "Jul", value: 38200 },
        { month: "Aug", value: 39800 },
        { month: "Sep", value: 41200 },
        { month: "Oct", value: 42800 },
        { month: "Nov", value: 44100 },
        { month: "Dec", value: 45680 },
      ],
      riskProfile: {
        level: "Moderate",
        score: 6.5,
        allocation: {
          conservative: 30,
          moderate: 50,
          aggressive: 20,
        },
      },
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getChangeColor = (value: number): string => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );
  };

  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            Loading your investment dashboard...
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
                <PieChart className="h-8 w-8 text-blue-600" />
                Personal Investment Hub
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Your comprehensive investment platform for building wealth
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {showBalance
                      ? formatCurrency(portfolioData.totalValue)
                      : "••••••"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                  >
                    {showBalance ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div
                  className={`text-sm ${getChangeColor(portfolioData.totalGainsPercent)} flex items-center gap-1`}
                >
                  {getChangeIcon(portfolioData.totalGainsPercent)}
                  {portfolioData.totalGainsPercent >= 0 ? "+" : ""}
                  {portfolioData.totalGainsPercent}% (
                  {formatCurrency(portfolioData.totalGains)})
                </div>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Invest
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Portfolio Value
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(portfolioData.totalValue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Invested: {formatCurrency(portfolioData.totalInvested)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gains</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${getChangeColor(portfolioData.totalGains)}`}
              >
                {formatCurrency(portfolioData.totalGains)}
              </div>
              <p className="text-xs text-muted-foreground">
                {portfolioData.totalGainsPercent >= 0 ? "+" : ""}
                {portfolioData.totalGainsPercent}% return
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Contribution
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(portfolioData.monthlyContribution)}
              </div>
              <p className="text-xs text-muted-foreground">
                Automatic investment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cash Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(portfolioData.cashBalance)}
              </div>
              <p className="text-xs text-muted-foreground">
                Available to invest
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
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="education">Learn</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>
                    6-month performance overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={portfolioData.performance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: any) => [
                            formatCurrency(value),
                            "Portfolio Value",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Asset Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                  <CardDescription>Your portfolio distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolioData.portfolioAllocation.map(
                      (asset: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: asset.color }}
                              />
                              <span className="font-medium">{asset.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">
                                {formatCurrency(asset.value)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {asset.percent}%
                              </div>
                            </div>
                          </div>
                          <Progress value={asset.percent} className="h-2" />
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Goal Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Goal Progress</CardTitle>
                <CardDescription>Track your financial goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {portfolioData.goals.map((goal: any) => (
                    <div
                      key={goal.id}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => setSelectedGoal(goal.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{goal.name}</h4>
                        <Badge
                          variant={goal.onTrack ? "default" : "destructive"}
                        >
                          {goal.onTrack ? "On Track" : "Behind"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{formatCurrency(goal.current)}</span>
                          <span>{formatCurrency(goal.target)}</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {goal.progress.toFixed(1)}% complete •{" "}
                          {goal.timeframe}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolioData.recentTransactions.map(
                    (transaction: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              transaction.type === "Buy"
                                ? "bg-blue-500"
                                : transaction.type === "Sell"
                                  ? "bg-red-500"
                                  : transaction.type === "Dividend"
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                            }`}
                          />
                          <div>
                            <div className="font-medium">
                              {transaction.type} {transaction.symbol}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {transaction.date}
                              {transaction.shares > 0 &&
                                ` • ${transaction.shares} shares`}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-bold ${getChangeColor(transaction.amount)}`}
                        >
                          {transaction.amount >= 0 ? "+" : ""}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Holdings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Holdings</CardTitle>
                    <CardDescription>
                      Detailed portfolio breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          symbol: "AAPL",
                          name: "Apple Inc.",
                          shares: 25,
                          price: 185.64,
                          change: 2.4,
                          value: 4641,
                        },
                        {
                          symbol: "VTI",
                          name: "Vanguard Total Stock Market ETF",
                          shares: 50,
                          price: 245.3,
                          change: 1.8,
                          value: 12265,
                        },
                        {
                          symbol: "BND",
                          name: "Vanguard Total Bond Market ETF",
                          shares: 100,
                          price: 78.45,
                          change: -0.3,
                          value: 7845,
                        },
                        {
                          symbol: "GOOGL",
                          name: "Alphabet Inc.",
                          shares: 10,
                          price: 142.56,
                          change: 3.2,
                          value: 1426,
                        },
                      ].map((holding, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-semibold">
                              {holding.symbol}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {holding.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {holding.shares} shares @ ${holding.price}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              {formatCurrency(holding.value)}
                            </div>
                            <div
                              className={`text-sm ${getChangeColor(holding.change)}`}
                            >
                              {holding.change >= 0 ? "+" : ""}
                              {holding.change}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analytics</CardTitle>
                    <CardDescription>Risk and return analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">8.76%</div>
                        <div className="text-sm text-muted-foreground">
                          Total Return
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">12.4%</div>
                        <div className="text-sm text-muted-foreground">
                          Annualized
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">6.5</div>
                        <div className="text-sm text-muted-foreground">
                          Risk Score
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">1.24</div>
                        <div className="text-sm text-muted-foreground">
                          Sharpe Ratio
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Buy Stock/ETF
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Minus className="h-4 w-4 mr-2" />
                      Sell Holdings
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Rebalance Portfolio
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Portfolio Settings
                    </Button>
                  </CardContent>
                </Card>

                {/* Risk Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Profile</CardTitle>
                    <CardDescription>
                      Your investment risk level
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {portfolioData.riskProfile.level}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Score: {portfolioData.riskProfile.score}/10
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Conservative</span>
                          <span>
                            {portfolioData.riskProfile.allocation.conservative}%
                          </span>
                        </div>
                        <Progress
                          value={
                            portfolioData.riskProfile.allocation.conservative
                          }
                          className="h-2"
                        />

                        <div className="flex justify-between text-sm">
                          <span>Moderate</span>
                          <span>
                            {portfolioData.riskProfile.allocation.moderate}%
                          </span>
                        </div>
                        <Progress
                          value={portfolioData.riskProfile.allocation.moderate}
                          className="h-2"
                        />

                        <div className="flex justify-between text-sm">
                          <span>Aggressive</span>
                          <span>
                            {portfolioData.riskProfile.allocation.aggressive}%
                          </span>
                        </div>
                        <Progress
                          value={
                            portfolioData.riskProfile.allocation.aggressive
                          }
                          className="h-2"
                        />
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        Retake Risk Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          Consider rebalancing - your stock allocation is 5%
                          above target.
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          You're on track to meet your retirement goal. Great
                          work!
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Financial Goals</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {portfolioData.goals.map((goal: any) => (
                <Card
                  key={goal.id}
                  className={
                    selectedGoal === goal.id ? "ring-2 ring-primary" : ""
                  }
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{goal.name}</CardTitle>
                      <Badge variant={goal.onTrack ? "default" : "destructive"}>
                        {goal.onTrack ? "On Track" : "Behind Schedule"}
                      </Badge>
                    </div>
                    <CardDescription>
                      Target: {formatCurrency(goal.target)} in {goal.timeframe}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>{formatCurrency(goal.current)}</span>
                        <span>{formatCurrency(goal.target)}</span>
                      </div>
                      <Progress value={goal.progress} className="h-3" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{goal.progress.toFixed(1)}% complete</span>
                        <span>
                          {formatCurrency(goal.target - goal.current)} remaining
                        </span>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between text-sm">
                          <span>Monthly Contribution:</span>
                          <span className="font-semibold">
                            {formatCurrency(goal.monthlyContribution)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Projected Completion:</span>
                          <span className="font-semibold">
                            {new Date(
                              Date.now() +
                                ((goal.target - goal.current) /
                                  goal.monthlyContribution) *
                                  30 *
                                  24 *
                                  60 *
                                  60 *
                                  1000,
                            ).getFullYear()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Plus className="h-4 w-4 mr-2" />
                          Contribute
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Goal Planning Tool */}
            <Card>
              <CardHeader>
                <CardTitle>Goal Planning Calculator</CardTitle>
                <CardDescription>
                  Plan your investment strategy for any financial goal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Goal Amount</label>
                    <input
                      type="number"
                      placeholder="$50,000"
                      className="w-full mt-1 p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Time Frame (years)
                    </label>
                    <input
                      type="number"
                      placeholder="5"
                      className="w-full mt-1 p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Expected Return (%)
                    </label>
                    <input
                      type="number"
                      placeholder="7"
                      className="w-full mt-1 p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Initial Amount
                    </label>
                    <input
                      type="number"
                      placeholder="$5,000"
                      className="w-full mt-1 p-2 border rounded"
                    />
                  </div>
                </div>
                <Button className="mt-4">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Monthly Payment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Research Tab */}
          <TabsContent value="research" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Research & Analysis</CardTitle>
                    <CardDescription>
                      Stay informed with market insights and analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Alert>
                        <BarChart3 className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Market Update:</strong> S&P 500 up 1.2% this
                          week driven by tech earnings.
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">
                            Trending Stocks
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>AAPL</span>
                              <span className="text-green-600">+2.4%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>MSFT</span>
                              <span className="text-green-600">+1.8%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>GOOGL</span>
                              <span className="text-green-600">+3.2%</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">
                            Recommended ETFs
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>VTI</span>
                              <span>Total Stock Market</span>
                            </div>
                            <div className="flex justify-between">
                              <span>BND</span>
                              <span>Total Bond Market</span>
                            </div>
                            <div className="flex justify-between">
                              <span>VXUS</span>
                              <span>International Stock</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Indices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>S&P 500</span>
                        <div className="text-right">
                          <div className="font-bold">4,567.89</div>
                          <div className="text-green-600 text-sm">+1.2%</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>NASDAQ</span>
                        <div className="text-right">
                          <div className="font-bold">14,234.56</div>
                          <div className="text-green-600 text-sm">+0.8%</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Dow Jones</span>
                        <div className="text-right">
                          <div className="font-bold">37,890.12</div>
                          <div className="text-red-600 text-sm">-0.3%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Investment Ideas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="font-semibold">Dividend Growth</div>
                        <div className="text-sm text-muted-foreground">
                          Focus on companies with consistent dividend growth
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-semibold">ESG Investing</div>
                        <div className="text-sm text-muted-foreground">
                          Sustainable and responsible investment options
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-semibold">
                          International Diversification
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Expand globally with international funds
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Investment Education
                  </CardTitle>
                  <CardDescription>
                    Build your investment knowledge
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Investing Basics</h4>
                      <div className="text-sm text-muted-foreground mb-3">
                        Learn the fundamentals of investing and building wealth
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge>Beginner</Badge>
                        <Button size="sm">Start Course</Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">
                        Portfolio Diversification
                      </h4>
                      <div className="text-sm text-muted-foreground mb-3">
                        Understand risk management through diversification
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">Intermediate</Badge>
                        <Button size="sm" variant="outline">
                          Start Course
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">
                        Tax-Efficient Investing
                      </h4>
                      <div className="text-sm text-muted-foreground mb-3">
                        Strategies to minimize taxes and maximize returns
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">Advanced</Badge>
                        <Button size="sm" variant="outline">
                          Start Course
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Learning Progress</CardTitle>
                  <CardDescription>
                    Track your educational journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Overall Progress</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Investing Basics</div>
                          <div className="text-sm text-muted-foreground">
                            Completed
                          </div>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Portfolio Building</div>
                          <div className="text-sm text-muted-foreground">
                            In Progress
                          </div>
                        </div>
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Advanced Strategies</div>
                          <div className="text-sm text-muted-foreground">
                            Locked
                          </div>
                        </div>
                        <Shield className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <Button className="w-full mt-4">Continue Learning</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Market News & Insights</CardTitle>
                <CardDescription>
                  Stay updated with the latest market developments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Weekly Market Recap</h4>
                    <p className="text-sm text-muted-foreground">
                      Markets showed resilience this week with tech stocks
                      leading gains...
                    </p>
                    <Button size="sm" variant="outline" className="mt-3">
                      Read More
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">
                      Fed Meeting Highlights
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The Federal Reserve maintained current interest rates
                      while signaling...
                    </p>
                    <Button size="sm" variant="outline" className="mt-3">
                      Read More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RetailInvestor;
