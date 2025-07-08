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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Calendar,
  Download,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  Settings,
  Bell,
  Info,
  ExternalLink,
  FileText,
  Receipt,
  Wallet,
  BarChart3,
  Globe,
  XCircle,
} from "lucide-react";

import { enhancedPaymentService } from "@/services/enhancedPaymentService";

interface Subscription {
  id: string;
  planName: string;
  planId: string;
  status: "active" | "canceled" | "past_due" | "trialing" | "unpaid";
  amount: number;
  currency: string;
  billingCycle: "monthly" | "annual";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  nextBillingDate: Date;
  features: string[];
  usage: {
    apiCalls: { used: number; limit: number };
    storage: { used: number; limit: number };
    users: { used: number; limit: number };
  };
}

interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "draft";
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  description: string;
  downloadUrl: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "bank_transfer";
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string;
  bankName?: string;
  isDefault: boolean;
  createdAt: Date;
}

interface BillingHistory {
  id: string;
  type: "payment" | "refund" | "failed_payment" | "subscription_change";
  amount: number;
  currency: string;
  status: "success" | "failed" | "pending";
  description: string;
  date: Date;
  invoiceId?: string;
  paymentMethodId?: string;
}

interface UsageMetrics {
  period: "current" | "previous";
  apiCalls: { used: number; limit: number; percentage: number };
  storage: { used: number; limit: number; percentage: number; unit: "GB" };
  users: { used: number; limit: number; percentage: number };
  bandwidth: { used: number; limit: number; percentage: number; unit: "GB" };
  features: { [key: string]: boolean };
}

export const BillingPage: React.FC = () => {
  const [activeSubscription, setActiveSubscription] =
    useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setLoading(true);

      // Simulate loading billing data
      const mockSubscription: Subscription = {
        id: "sub_1234567890",
        planName: "Professional",
        planId: "professional_monthly",
        status: "active",
        amount: 149.0,
        currency: "USD",
        billingCycle: "monthly",
        currentPeriodStart: new Date("2024-01-01"),
        currentPeriodEnd: new Date("2024-02-01"),
        cancelAtPeriodEnd: false,
        nextBillingDate: new Date("2024-02-01"),
        features: [
          "Complete legendary investor suite",
          "Advanced MCTS optimization",
          "Real-time market alerts",
          "Unlimited portfolio tracking",
          "API access",
          "Priority support",
        ],
        usage: {
          apiCalls: { used: 47250, limit: 100000 },
          storage: { used: 2.3, limit: 10 },
          users: { used: 3, limit: 10 },
        },
      };

      const mockInvoices: Invoice[] = [
        {
          id: "inv_001",
          number: "INV-2024-001",
          amount: 149.0,
          currency: "USD",
          status: "paid",
          issueDate: new Date("2024-01-01"),
          dueDate: new Date("2024-01-15"),
          paidDate: new Date("2024-01-02"),
          description: "Professional Plan - January 2024",
          downloadUrl: "/api/invoices/inv_001/download",
          items: [
            {
              id: "item_001",
              description: "Professional Plan Subscription",
              quantity: 1,
              unitPrice: 149.0,
              amount: 149.0,
            },
          ],
        },
        {
          id: "inv_002",
          number: "INV-2024-002",
          amount: 149.0,
          currency: "USD",
          status: "pending",
          issueDate: new Date("2024-02-01"),
          dueDate: new Date("2024-02-15"),
          description: "Professional Plan - February 2024",
          downloadUrl: "/api/invoices/inv_002/download",
          items: [
            {
              id: "item_002",
              description: "Professional Plan Subscription",
              quantity: 1,
              unitPrice: 149.0,
              amount: 149.0,
            },
          ],
        },
      ];

      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: "pm_001",
          type: "card",
          last4: "4242",
          brand: "Visa",
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true,
          createdAt: new Date("2023-12-01"),
        },
        {
          id: "pm_002",
          type: "paypal",
          email: "user@example.com",
          isDefault: false,
          createdAt: new Date("2023-11-15"),
        },
      ];

      const mockBillingHistory: BillingHistory[] = [
        {
          id: "hist_001",
          type: "payment",
          amount: 149.0,
          currency: "USD",
          status: "success",
          description: "Monthly subscription payment",
          date: new Date("2024-01-02"),
          invoiceId: "inv_001",
          paymentMethodId: "pm_001",
        },
        {
          id: "hist_002",
          type: "subscription_change",
          amount: 0,
          currency: "USD",
          status: "success",
          description: "Upgraded from Starter to Professional",
          date: new Date("2023-12-15"),
        },
      ];

      const mockUsageMetrics: UsageMetrics = {
        period: "current",
        apiCalls: { used: 47250, limit: 100000, percentage: 47.25 },
        storage: { used: 2.3, limit: 10, percentage: 23, unit: "GB" },
        users: { used: 3, limit: 10, percentage: 30 },
        bandwidth: { used: 15.7, limit: 100, percentage: 15.7, unit: "GB" },
        features: {
          "Real-time alerts": true,
          "API access": true,
          "Advanced analytics": true,
          "Priority support": true,
          "White-label": false,
          "Custom integrations": false,
        },
      };

      setActiveSubscription(mockSubscription);
      setInvoices(mockInvoices);
      setPaymentMethods(mockPaymentMethods);
      setBillingHistory(mockBillingHistory);
      setUsageMetrics(mockUsageMetrics);
    } catch (error) {
      console.error("Failed to load billing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!activeSubscription) return;

    try {
      setProcessingPayment(true);
      // Simulate cancellation
      setActiveSubscription((prev) =>
        prev ? { ...prev, cancelAtPeriodEnd: true } : null,
      );
      setShowCancelDialog(false);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!activeSubscription) return;

    try {
      setProcessingPayment(true);
      setActiveSubscription((prev) =>
        prev ? { ...prev, cancelAtPeriodEnd: false } : null,
      );
    } catch (error) {
      console.error("Failed to reactivate subscription:", error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      const invoice = invoices.find((inv) => inv.id === invoiceId);
      if (invoice) {
        // Simulate download
        window.open(invoice.downloadUrl, "_blank");
      }
    } catch (error) {
      console.error("Failed to download invoice:", error);
    }
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      setPaymentMethods((prev) =>
        (prev || []).map((pm) => ({
          ...pm,
          isDefault: pm.id === paymentMethodId,
        })),
      );
    } catch (error) {
      console.error("Failed to set default payment method:", error);
    }
  };

  const deletePaymentMethod = async (paymentMethodId: string) => {
    try {
      setPaymentMethods((prev) =>
        (prev || []).filter((pm) => pm.id !== paymentMethodId),
      );
    } catch (error) {
      console.error("Failed to delete payment method:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "paid":
      case "success":
        return "text-green-600 bg-green-100";
      case "pending":
      case "trialing":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
      case "past_due":
      case "canceled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Billing & Subscription
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Manage your subscription, payment methods, and billing history
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/pricing")}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
            <Button onClick={loadBillingData} disabled={loading}>
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Current Subscription Overview */}
        {activeSubscription && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    Current Subscription
                  </CardTitle>
                  <CardDescription>
                    Your active {activeSubscription.planName} plan
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(activeSubscription.status)}>
                  {activeSubscription.status.charAt(0).toUpperCase() +
                    activeSubscription.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Plan Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Plan Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Plan:</span>
                        <span className="font-medium">
                          {activeSubscription.planName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-medium">
                          {formatCurrency(activeSubscription.amount)} /{" "}
                          {activeSubscription.billingCycle}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next billing:</span>
                        <span className="font-medium">
                          {activeSubscription.nextBillingDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Auto-renewal:</span>
                        <span
                          className={`font-medium ${activeSubscription.cancelAtPeriodEnd ? "text-red-600" : "text-green-600"}`}
                        >
                          {activeSubscription.cancelAtPeriodEnd
                            ? "Disabled"
                            : "Enabled"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Overview */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Usage This Month</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>API Calls</span>
                        <span>
                          {activeSubscription.usage.apiCalls.used.toLocaleString()}{" "}
                          /{" "}
                          {activeSubscription.usage.apiCalls.limit.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (activeSubscription.usage.apiCalls.used /
                            activeSubscription.usage.apiCalls.limit) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Storage</span>
                        <span>
                          {activeSubscription.usage.storage.used}GB /{" "}
                          {activeSubscription.usage.storage.limit}GB
                        </span>
                      </div>
                      <Progress
                        value={
                          (activeSubscription.usage.storage.used /
                            activeSubscription.usage.storage.limit) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Team Members</span>
                        <span>
                          {activeSubscription.usage.users.used} /{" "}
                          {activeSubscription.usage.users.limit}
                        </span>
                      </div>
                      <Progress
                        value={
                          (activeSubscription.usage.users.used /
                            activeSubscription.usage.users.limit) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Quick Actions</h4>
                  <div className="space-y-2">
                    {activeSubscription.cancelAtPeriodEnd ? (
                      <Button
                        onClick={handleReactivateSubscription}
                        disabled={processingPayment}
                        className="w-full"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Reactivate Subscription
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelDialog(true)}
                        className="w-full"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Cancel Subscription
                      </Button>
                    )}
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Update Billing Info
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Customer Portal
                    </Button>
                  </div>
                </div>
              </div>

              {activeSubscription.cancelAtPeriodEnd && (
                <Alert className="mt-6 border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">
                    Subscription Ending
                  </AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    Your subscription will end on{" "}
                    {activeSubscription.currentPeriodEnd.toLocaleDateString()}.
                    You'll lose access to all premium features after this date.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
            <TabsTrigger value="history">Billing History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Monthly Spend
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activeSubscription
                      ? formatCurrency(activeSubscription.amount)
                      : "$0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Next billing in{" "}
                    {activeSubscription
                      ? Math.ceil(
                          (activeSubscription.nextBillingDate.getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24),
                        )
                      : 0}{" "}
                    days
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    API Usage
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {usageMetrics
                      ? usageMetrics.apiCalls.percentage.toFixed(1)
                      : 0}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {usageMetrics
                      ? usageMetrics.apiCalls.used.toLocaleString()
                      : 0}{" "}
                    of{" "}
                    {usageMetrics
                      ? usageMetrics.apiCalls.limit.toLocaleString()
                      : 0}{" "}
                    calls
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Storage Used
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {usageMetrics ? usageMetrics.storage.percentage : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {usageMetrics ? usageMetrics.storage.used : 0}GB of{" "}
                    {usageMetrics ? usageMetrics.storage.limit : 0}GB
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Team Members
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activeSubscription
                      ? activeSubscription.usage.users.used
                      : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of{" "}
                    {activeSubscription
                      ? activeSubscription.usage.users.limit
                      : 0}{" "}
                    members
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest billing and subscription activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingHistory &&
                    billingHistory.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(item.status)}`}
                          >
                            {item.type === "payment" ? (
                              <CreditCard className="w-5 h-5" />
                            ) : item.type === "refund" ? (
                              <RefreshCw className="w-5 h-5" />
                            ) : item.type === "failed_payment" ? (
                              <AlertCircle className="w-5 h-5" />
                            ) : (
                              <Settings className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {item.description}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.date.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {item.amount > 0
                              ? formatCurrency(item.amount)
                              : "—"}
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>
                  Download and manage your billing invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices &&
                    invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(invoice.status)}`}
                          >
                            <Receipt className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium">{invoice.number}</div>
                            <div className="text-sm text-muted-foreground">
                              {invoice.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Issued: {invoice.issueDate.toLocaleDateString()} •
                              Due: {invoice.dueDate.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">
                              {formatCurrency(invoice.amount)}
                            </div>
                            <Badge className={getStatusColor(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadInvoice(invoice.id)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment-methods" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Payment Methods</h3>
                <p className="text-muted-foreground">
                  Manage your payment methods and billing preferences
                </p>
              </div>
              <Button onClick={() => setShowAddPaymentMethod(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>

            <div className="grid gap-4">
              {paymentMethods &&
                paymentMethods.map((method) => (
                  <Card
                    key={method.id}
                    className={method.isDefault ? "ring-2 ring-blue-500" : ""}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {method.type === "card" ? (
                                <>
                                  {method.brand} ending in {method.last4}
                                  <span className="text-sm text-muted-foreground ml-2">
                                    Expires {method.expiryMonth}/
                                    {method.expiryYear}
                                  </span>
                                </>
                              ) : method.type === "paypal" ? (
                                <>PayPal ({method.email})</>
                              ) : (
                                <>Bank Transfer ({method.bankName})</>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Added on {method.createdAt.toLocaleDateString()}
                              {method.isDefault && (
                                <Badge className="ml-2 bg-blue-100 text-blue-800">
                                  Default
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDefaultPaymentMethod(method.id)}
                            >
                              Set as Default
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePaymentMethod(method.id)}
                            disabled={method.isDefault}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            {usageMetrics && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Current Usage</CardTitle>
                    <CardDescription>
                      Your usage for the current billing period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">API Calls</span>
                            <span
                              className={getUsageColor(
                                usageMetrics.apiCalls.percentage,
                              )}
                            >
                              {usageMetrics.apiCalls.used.toLocaleString()} /{" "}
                              {usageMetrics.apiCalls.limit.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={usageMetrics.apiCalls.percentage}
                            className="h-3"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {usageMetrics.apiCalls.percentage.toFixed(1)}% of
                            monthly limit
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Storage</span>
                            <span
                              className={getUsageColor(
                                usageMetrics.storage.percentage,
                              )}
                            >
                              {usageMetrics.storage.used}GB /{" "}
                              {usageMetrics.storage.limit}GB
                            </span>
                          </div>
                          <Progress
                            value={usageMetrics.storage.percentage}
                            className="h-3"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {usageMetrics.storage.percentage}% of storage limit
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Team Members</span>
                            <span
                              className={getUsageColor(
                                usageMetrics.users.percentage,
                              )}
                            >
                              {usageMetrics.users.used} /{" "}
                              {usageMetrics.users.limit}
                            </span>
                          </div>
                          <Progress
                            value={usageMetrics.users.percentage}
                            className="h-3"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {usageMetrics.users.percentage}% of user limit
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Bandwidth</span>
                            <span
                              className={getUsageColor(
                                usageMetrics.bandwidth.percentage,
                              )}
                            >
                              {usageMetrics.bandwidth.used}GB /{" "}
                              {usageMetrics.bandwidth.limit}GB
                            </span>
                          </div>
                          <Progress
                            value={usageMetrics.bandwidth.percentage}
                            className="h-3"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {usageMetrics.bandwidth.percentage.toFixed(1)}% of
                            bandwidth limit
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feature Access</CardTitle>
                    <CardDescription>
                      Available features in your current plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {usageMetrics &&
                        usageMetrics.features &&
                        Object.entries(usageMetrics.features).map(
                          ([feature, enabled]) => (
                            <div
                              key={feature}
                              className="flex items-center gap-3"
                            >
                              {enabled ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-gray-400" />
                              )}
                              <span
                                className={
                                  enabled ? "text-gray-900" : "text-gray-400"
                                }
                              >
                                {feature}
                              </span>
                            </div>
                          ),
                        )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  Complete history of payments and billing activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingHistory &&
                    billingHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(item.status)}`}
                          >
                            {item.type === "payment" ? (
                              <CreditCard className="w-5 h-5" />
                            ) : item.type === "refund" ? (
                              <RefreshCw className="w-5 h-5" />
                            ) : item.type === "failed_payment" ? (
                              <AlertCircle className="w-5 h-5" />
                            ) : (
                              <Settings className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {item.description}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.date.toLocaleDateString()} •
                              {item.type.replace("_", " ").toUpperCase()}
                            </div>
                            {item.invoiceId && (
                              <div className="text-xs text-muted-foreground">
                                Invoice: {item.invoiceId}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {item.amount > 0
                              ? formatCurrency(item.amount)
                              : "—"}
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cancel Subscription Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Cancel Subscription</CardTitle>
                <CardDescription>
                  Are you sure you want to cancel your subscription? You'll lose
                  access to all premium features at the end of your current
                  billing period.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    Your subscription will remain active until{" "}
                    {activeSubscription?.currentPeriodEnd.toLocaleDateString()}.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog(false)}
                    className="flex-1"
                  >
                    Keep Subscription
                  </Button>
                  <Button
                    onClick={handleCancelSubscription}
                    disabled={processingPayment}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {processingPayment
                      ? "Processing..."
                      : "Cancel Subscription"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
