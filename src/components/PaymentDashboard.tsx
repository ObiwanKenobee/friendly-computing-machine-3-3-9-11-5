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
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription } from "./ui/alert";
import PaymentProcessingService from "../services/paymentProcessingService";
import PaymentProcessor from "./PaymentProcessor";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  Shield,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Users,
  Receipt,
  Download,
  Filter,
  Calendar,
  Search,
  Bell,
  Lock,
} from "lucide-react";

interface PaymentDashboardProps {
  showFullDashboard?: boolean;
  showPaymentForm?: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "processing";
  method: string;
  timestamp: string;
  description: string;
}

interface PaymentProvider {
  id: string;
  name: string;
  status: "active" | "inactive" | "maintenance";
  successRate: number;
  volume: number;
  fees: number;
}

interface RecentActivity {
  id: string;
  type: "payment" | "refund" | "chargeback" | "subscription";
  description: string;
  amount?: number;
  timestamp: string;
  status: "success" | "warning" | "error" | "info";
}

interface Alert {
  id: string;
  type: "security" | "performance" | "compliance" | "system";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface DashboardData {
  revenue: number;
  transactions: number;
  successRate: number;
  growth: number;
  recentActivity: RecentActivity[];
  alerts: Alert[];
  currencyBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
  providerPerformance: Record<
    string,
    {
      volume: number;
      successRate: number;
      avgProcessingTime: number;
    }
  >;
}

const PaymentDashboard: React.FC<PaymentDashboardProps> = ({
  showFullDashboard = true,
  showPaymentForm = false,
}) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [timeRange, setTimeRange] = useState("24h");

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load payment providers
      const providerData =
        PaymentProcessingService.getInstance().getProviders();
      setProviders(providerData);

      // Load recent transactions
      PaymentProcessingService.getInstance().getTransactionHistory(50);
      setTransactions(transactionData);

      // Generate mock analytics data
      const analytics = generateMockAnalytics();
      setDashboardData(analytics);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAnalytics = () => {
    const now = new Date();
    const timeRanges = {
      "1h": 1,
      "24h": 24,
      "7d": 7 * 24,
      "30d": 30 * 24,
      "90d": 90 * 24,
    };

    const hours = timeRanges[timeRange as keyof typeof timeRanges] || 24;
    const baseTransactions = Math.floor(Math.random() * 1000) + 500;

    return {
      summary: {
        totalTransactions: baseTransactions,
        totalAmount: Math.random() * 500000 + 100000,
        successRate: 0.94 + Math.random() * 0.05,
        averageAmount: Math.random() * 500 + 100,
        currency: "USD",
      },
      trends: {
        transactions: Math.random() > 0.5 ? "up" : "down",
        amount: Math.random() > 0.5 ? "up" : "down",
        successRate: Math.random() > 0.7 ? "up" : "down",
      },
      breakdown: {
        byProvider: {
          paypal: {
            count: Math.floor(baseTransactions * 0.6),
            amount: Math.random() * 300000,
          },
          paystack: {
            count: Math.floor(baseTransactions * 0.4),
            amount: Math.random() * 200000,
          },
        },
        byStatus: {
          completed: Math.floor(baseTransactions * 0.85),
          pending: Math.floor(baseTransactions * 0.1),
          failed: Math.floor(baseTransactions * 0.05),
        },
        byCurrency: {
          USD: Math.floor(baseTransactions * 0.5),
          NGN: Math.floor(baseTransactions * 0.3),
          EUR: Math.floor(baseTransactions * 0.2),
        },
      },
      recentActivity: generateRecentActivity(),
      alerts: generateSecurityAlerts(),
    };
  };

  const generateRecentActivity = () => {
    const activities = [
      "Large payment of $5,000 processed via PayPal",
      "New customer registered from Nigeria",
      "Refund processed for transaction #12345",
      "Payment verification completed",
      "Webhook delivery failed - retrying",
      "Monthly settlement report generated",
    ];

    return activities.slice(0, 5).map((activity, index) => ({
      id: index,
      message: activity,
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      type: ["payment", "customer", "refund", "verification", "system"][
        Math.floor(Math.random() * 5)
      ],
    }));
  };

  const generateSecurityAlerts = () => {
    const alerts = [
      {
        type: "info",
        message: "All payment providers are operational",
        severity: "low",
      },
      {
        type: "warning",
        message: "3 failed payment attempts from same IP",
        severity: "medium",
      },
      {
        type: "success",
        message: "Security scan completed - no issues found",
        severity: "low",
      },
    ];

    return alerts.filter(() => Math.random() > 0.5);
  };

  const formatCurrency = (amount: number, currency: string = "USD"): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: "text-green-400 bg-green-400/10 border-green-400/20",
      pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
      failed: "text-red-400 bg-red-400/10 border-red-400/20",
      cancelled: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getProviderBadge = (provider: string) => {
    const colors = {
      paypal: "bg-blue-600",
      paystack: "bg-green-600",
    };

    return (
      <Badge
        className={colors[provider as keyof typeof colors] || "bg-gray-600"}
      >
        {provider === "paypal" ? "PayPal" : "Paystack"}
      </Badge>
    );
  };

  if (!dashboardData && !isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400">Loading payment dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Payment Dashboard</h2>
          <p className="text-gray-400">
            Monitor and manage your payment operations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
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

      {/* Quick Stats */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-blue-400">
                    {formatCurrency(dashboardData.summary.totalAmount)}
                  </p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {dashboardData.trends.amount === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={
                    dashboardData.trends.amount === "up"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {Math.random() * 10 + 2}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Transactions
                  </p>
                  <p className="text-3xl font-bold text-green-400">
                    {formatNumber(dashboardData.summary.totalTransactions)}
                  </p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-full">
                  <Receipt className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {dashboardData.trends.transactions === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={
                    dashboardData.trends.transactions === "up"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {Math.random() * 15 + 5}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Success Rate
                  </p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {(dashboardData.summary.successRate * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-yellow-500/20 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {dashboardData.trends.successRate === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={
                    dashboardData.trends.successRate === "up"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {Math.random() * 3 + 1}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Avg Amount
                  </p>
                  <p className="text-3xl font-bold text-purple-400">
                    {formatCurrency(dashboardData.summary.averageAmount)}
                  </p>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Activity className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-blue-500">Stable trend</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Dashboard Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-5 bg-slate-700 mb-6">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-600"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-green-600"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-purple-600"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="data-[state=active]:bg-orange-600"
          >
            New Payment
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-red-600"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Provider Status */}
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Payment Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providers.map((provider) => (
                    <div
                      key={provider.name}
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${provider.isActive ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <div>
                          <p className="font-semibold text-white capitalize">
                            {provider.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {provider.supportedCurrencies.length} currencies •{" "}
                            {provider.supportedCountries.length} countries
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            provider.isActive ? "bg-green-600" : "bg-red-600"
                          }
                        >
                          {provider.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">
                          {provider.fees.percentage}% +{" "}
                          {formatCurrency(provider.fees.fixed)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {dashboardData?.recentActivity.map(
                      (activity: RecentActivity) => (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-3 p-2"
                        >
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-white">
                              {activity.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {activity.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Security Alerts */}
          {dashboardData?.alerts.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-400" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.alerts.map((alert: Alert, index: number) => (
                    <Alert
                      key={index}
                      className={`border-${alert.type === "warning" ? "yellow" : alert.type === "success" ? "green" : "blue"}-500/50`}
                    >
                      {alert.type === "warning" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : alert.type === "success" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Bell className="h-4 w-4" />
                      )}
                      <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Transaction History</CardTitle>
              <CardDescription className="text-gray-300">
                Recent payment transactions across all providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {transactions.slice(0, 20).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <code className="text-sm font-mono text-blue-400">
                              {transaction.transactionId}
                            </code>
                            {getProviderBadge(transaction.provider)}
                          </div>
                          <p className="text-sm text-gray-300">
                            {formatCurrency(
                              transaction.amount,
                              transaction.currency,
                            )}{" "}
                            • {transaction.customerEmail}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {dashboardData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Breakdown */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">
                    Payment Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">
                      By Provider
                    </h4>
                    {Object.entries(
                      dashboardData?.providerPerformance || {},
                    ).map(
                      ([provider, data]: [
                        string,
                        {
                          volume: number;
                          successRate: number;
                          avgProcessingTime: number;
                        },
                      ]) => (
                        <div
                          key={provider}
                          className="flex items-center justify-between mb-2"
                        >
                          <div className="flex items-center space-x-2">
                            {getProviderBadge(provider)}
                            <span className="text-sm text-gray-300">
                              {data.count} transactions
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-white">
                            {formatCurrency(data.amount)}
                          </span>
                        </div>
                      ),
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">
                      By Status
                    </h4>
                    {Object.entries(dashboardData?.statusBreakdown || {}).map(
                      ([status, count]: [string, number]) => (
                        <div
                          key={status}
                          className="flex items-center justify-between mb-2"
                        >
                          <Badge className={getStatusColor(status)}>
                            {status}
                          </Badge>
                          <span className="text-sm text-white">
                            {count} transactions
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Currency Distribution */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">
                    Currency Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(dashboardData?.currencyBreakdown || {}).map(
                    ([currency, count]: [string, number]) => {
                      const percentage =
                        (count / dashboardData.summary.totalTransactions) * 100;
                      return (
                        <div key={currency} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">
                              {currency}
                            </span>
                            <span className="text-sm text-gray-400">
                              {count} transactions ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    },
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          {showPaymentForm && <PaymentProcessor showAdvancedOptions={true} />}
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-red-400" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">SSL/TLS Encryption</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">PCI DSS Compliance</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Fraud Detection</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Webhook Verification</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">3D Secure</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Security Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      Fraud Detection Rate
                    </span>
                    <span className="text-sm font-semibold text-white">
                      99.2%
                    </span>
                  </div>
                  <Progress value={99.2} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      Chargeback Rate
                    </span>
                    <span className="text-sm font-semibold text-white">
                      0.3%
                    </span>
                  </div>
                  <Progress value={0.3} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Risk Score</span>
                    <span className="text-sm font-semibold text-green-400">
                      Low
                    </span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentDashboard;
