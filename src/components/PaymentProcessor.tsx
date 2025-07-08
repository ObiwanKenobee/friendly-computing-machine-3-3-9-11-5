import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import PaymentProcessingService, {
  PaymentRequest,
  PaymentResponse,
} from "../services/paymentProcessingService";
import {
  PaymentError,
  ValidationError,
  globalErrorHandler,
} from "../utils/errorHandling";
import {
  CreditCard,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Globe,
  Clock,
  Receipt,
  RefreshCw,
  Eye,
  User,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

interface PaymentProcessorProps {
  amount?: number;
  currency?: string;
  description?: string;
  onPaymentSuccess?: (response: PaymentResponse) => void;
  onPaymentError?: (error: string) => void;
  showAdvancedOptions?: boolean;
}

interface ProviderInfo {
  provider: string;
  status: "available" | "unavailable" | "maintenance";
  processingTime: string;
  fees: string;
  limits: {
    min: number;
    max: number;
  };
  features: string[];
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  amount: initialAmount = 100,
  currency: initialCurrency = "USD",
  description: initialDescription = "QuantumVest Payment",
  onPaymentSuccess,
  onPaymentError,
  showAdvancedOptions = false,
}) => {
  const [selectedTab, setSelectedTab] = useState("payment");
  const [paymentMethod, setPaymentMethod] = useState<
    "paypal" | "paystack" | "auto"
  >("auto");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(
    null,
  );
  const [error, setError] = useState<string>("");

  // Form state
  const [amount, setAmount] = useState(initialAmount);
  const [currency, setCurrency] = useState(initialCurrency);
  const [description, setDescription] = useState(initialDescription);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [saveCustomer, setSaveCustomer] = useState(false);

  // Provider availability
  const [availableProviders, setAvailableProviders] = useState({
    paypal: false,
    paystack: false,
  });
  const [providerInfo, setProviderInfo] = useState<ProviderInfo[]>([]);

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
    { code: "GHS", name: "Ghana Cedi", symbol: "₵" },
    { code: "ZAR", name: "South African Rand", symbol: "R" },
    { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  ];

  useEffect(() => {
    loadProviderInfo();
    checkPaymentMethods();
  }, [currency]);

  const loadProviderInfo = () => {
    const providers = PaymentProcessingService.getInstance().getProviders();
    setProviderInfo(providers);
  };

  const checkPaymentMethods = async () => {
    try {
      await PaymentProcessingService.getInstance().getPaymentMethods(currency);
      setAvailableProviders(methods);
    } catch (error) {
      console.error("Error checking payment methods:", error);
    }
  };

  const handlePayment = async () => {
    if (!customerEmail) {
      setError("Customer email is required");
      return;
    }

    if (amount <= 0) {
      setError("Payment amount must be greater than 0");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const paymentRequest: PaymentRequest = {
        amount,
        currency,
        description,
        customerEmail,
        customerName,
        customerPhone,
        metadata: {
          saveCustomer,
          source: "quantumvest-platform",
          timestamp: new Date().toISOString(),
        },
        returnUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      };

      await PaymentProcessingService.getInstance().processPayment(
        paymentRequest,
      );
      if (response.success) {
        setPaymentResult(response);

        // Redirect to payment URL if provided
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl;
        } else if (response.authorizationUrl) {
          window.location.href = response.authorizationUrl;
        }

        if (onPaymentSuccess) {
          onPaymentSuccess(response);
        }
      } else {
        throw new Error(response.error || "Payment failed");
      }
    } catch (error: unknown) {
      setIsProcessing(false);
      const appError = globalErrorHandler.handle(error, {
        component: "PaymentProcessor",
        action: "processPayment",
      });
      const errorMsg = appError.message || "Payment processing failed";
      setError(errorMsg);
      onPaymentError?.(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyPayment = async (
    transactionId: string,
    provider: "paypal" | "paystack",
  ) => {
    setIsProcessing(true);
    try {
      const response =
        await PaymentProcessingService.getInstance().verifyPayment(
          transactionId,
          provider,
        );
      setPaymentResult(response);
    } catch (error: unknown) {
      const appError = globalErrorHandler.handle(error, {
        component: "PaymentProcessor",
        action: "verifyPayment",
      });
      setError(`Verification failed: ${appError.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number, currencyCode: string): string => {
    const currencyInfo = currencies.find((c) => c.code === currencyCode);
    return `${currencyInfo?.symbol || "$"}${amount.toFixed(2)}`;
  };

  const getProviderBadge = (provider: "paypal" | "paystack") => {
    const colors = {
      paypal: "bg-blue-600",
      paystack: "bg-green-600",
    };

    return (
      <Badge className={colors[provider]}>
        {provider === "paypal" ? "PayPal" : "Paystack"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center">
            <CreditCard className="h-8 w-8 mr-3 text-blue-400" />
            Secure Payment Processing
          </CardTitle>
          <CardDescription className="text-gray-300">
            Enterprise-grade payment processing with PayPal and Paystack
            integration
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3 bg-slate-700 mb-6">
              <TabsTrigger
                value="payment"
                className="data-[state=active]:bg-blue-600"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Payment
              </TabsTrigger>
              <TabsTrigger
                value="verify"
                className="data-[state=active]:bg-green-600"
              >
                <Eye className="h-4 w-4 mr-2" />
                Verify
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-purple-600"
              >
                <Receipt className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="payment" className="space-y-6">
              {/* Payment Amount & Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">
                    Amount
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) =>
                        setAmount(parseFloat(e.target.value) || 0)
                      }
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-white">
                    Currency
                  </Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {currencies.map((curr) => (
                        <SelectItem
                          key={curr.code}
                          value={curr.code}
                          className="text-white"
                        >
                          {curr.symbol} {curr.name} ({curr.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Payment Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                    placeholder="Payment description"
                  />
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      placeholder="customer@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">
                    Phone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4">
                <Label className="text-white">Payment Method</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card
                    className={`cursor-pointer border-2 transition-colors ${
                      paymentMethod === "auto"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-600 bg-slate-700/50"
                    }`}
                    onClick={() => setPaymentMethod("auto")}
                  >
                    <CardContent className="p-4 text-center">
                      <Globe className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                      <h3 className="font-semibold text-white">Auto Select</h3>
                      <p className="text-xs text-gray-400">
                        Best method for your region
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border-2 transition-colors ${
                      paymentMethod === "paypal"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-600 bg-slate-700/50"
                    } ${!availableProviders.paypal ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() =>
                      availableProviders.paypal && setPaymentMethod("paypal")
                    }
                  >
                    <CardContent className="p-4 text-center">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                      <h3 className="font-semibold text-white">PayPal</h3>
                      <p className="text-xs text-gray-400">Global payments</p>
                      {!availableProviders.paypal && (
                        <Badge
                          variant="outline"
                          className="mt-2 text-red-400 border-red-400"
                        >
                          Not Available
                        </Badge>
                      )}
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border-2 transition-colors ${
                      paymentMethod === "paystack"
                        ? "border-green-500 bg-green-500/10"
                        : "border-slate-600 bg-slate-700/50"
                    } ${!availableProviders.paystack ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() =>
                      availableProviders.paystack &&
                      setPaymentMethod("paystack")
                    }
                  >
                    <CardContent className="p-4 text-center">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-green-400" />
                      <h3 className="font-semibold text-white">Paystack</h3>
                      <p className="text-xs text-gray-400">African payments</p>
                      {!availableProviders.paystack && (
                        <Badge
                          variant="outline"
                          className="mt-2 text-red-400 border-red-400"
                        >
                          Not Available
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Advanced Options */}
              {showAdvancedOptions && (
                <div className="space-y-4">
                  <Label className="text-white">Advanced Options</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="save-customer"
                      checked={saveCustomer}
                      onCheckedChange={(checked) =>
                        setSaveCustomer(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="save-customer"
                      className="text-sm text-gray-300"
                    >
                      Save customer information for future payments
                    </Label>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-semibold">
                      {formatCurrency(amount, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Currency:</span>
                    <span className="text-white">{currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Description:</span>
                    <span className="text-white">{description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Method:</span>
                    <span className="text-white capitalize">
                      {paymentMethod}
                    </span>
                  </div>
                  <div className="border-t border-slate-600 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-white">Total:</span>
                      <span className="text-blue-400">
                        {formatCurrency(amount, currency)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Error Display */}
              {error && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Payment Result */}
              {paymentResult && (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">
                    Payment initiated successfully! Transaction ID:{" "}
                    {paymentResult.transactionId}
                  </AlertDescription>
                </Alert>
              )}

              {/* Pay Button */}
              <Button
                onClick={handlePayment}
                disabled={isProcessing || !customerEmail || amount <= 0}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-3 text-lg font-semibold"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Pay {formatCurrency(amount, currency)}
                  </>
                )}
              </Button>

              {/* Security Notice */}
              <div className="text-center">
                <p className="text-xs text-gray-400 flex items-center justify-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Secured by 256-bit SSL encryption and PCI DSS compliance
                </p>
              </div>
            </TabsContent>

            <TabsContent value="verify" className="space-y-6">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">Verify Payment</CardTitle>
                  <CardDescription className="text-gray-300">
                    Enter transaction details to verify payment status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transaction-id" className="text-white">
                      Transaction ID
                    </Label>
                    <Input
                      id="transaction-id"
                      placeholder="txn_..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider" className="text-white">
                      Provider
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="paypal" className="text-white">
                          PayPal
                        </SelectItem>
                        <SelectItem value="paystack" className="text-white">
                          Paystack
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Verify Payment
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">
                    Transaction History
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Recent payment transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {PaymentProcessingService.getInstance()
                      .getTransactionHistory(5)
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-600"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">
                                {transaction.transactionId}
                              </span>
                              {getProviderBadge(transaction.provider)}
                            </div>
                            <p className="text-sm text-gray-400">
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
                          <Badge
                            variant="outline"
                            className={
                              transaction.status === "completed"
                                ? "text-green-400 border-green-400"
                                : transaction.status === "pending"
                                  ? "text-yellow-400 border-yellow-400"
                                  : transaction.status === "failed"
                                    ? "text-red-400 border-red-400"
                                    : "text-gray-400 border-gray-400"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentProcessor;
