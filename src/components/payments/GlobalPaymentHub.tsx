import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentProvider {
  id: string;
  name: string;
  type: "traditional" | "mobile" | "bank" | "crypto" | "digital_wallet";
  region: "africa" | "europe" | "asia" | "global" | "web3";
  logo: string;
  supported_currencies: string[];
  fees: number;
  processing_time: string;
  security_rating: number;
  popularity: number;
  status: "active" | "maintenance" | "offline";
  features: string[];
  integration_complexity: number;
}

interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  provider: string;
  status: "pending" | "processing" | "completed" | "failed";
  timestamp: number;
  destination: string;
  fees: number;
  type: "deposit" | "withdrawal" | "transfer" | "payment";
}

interface CryptoWallet {
  address: string;
  network: string;
  balance: number;
  currency: string;
  connected: boolean;
  provider: string;
}

export function GlobalPaymentHub() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "regional" | "crypto" | "transactions"
  >("overview");
  const [selectedRegion, setSelectedRegion] = useState<
    "all" | "africa" | "europe" | "asia" | "web3"
  >("all");
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>(
    [],
  );
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(
    {},
  );

  const initializePaymentProviders = (): PaymentProvider[] => {
    return [
      // African Fintech
      {
        id: "mpesa",
        name: "M-Pesa",
        type: "mobile",
        region: "africa",
        logo: "📱",
        supported_currencies: ["KES", "TZS", "UGX", "GHS"],
        fees: 1.5,
        processing_time: "Instant",
        security_rating: 95,
        popularity: 98,
        status: "active",
        features: [
          "Mobile Money",
          "P2P Transfers",
          "Bill Payments",
          "Merchant Payments",
        ],
        integration_complexity: 3,
      },
      {
        id: "flutterwave",
        name: "Flutterwave",
        type: "digital_wallet",
        region: "africa",
        logo: "🌊",
        supported_currencies: ["NGN", "USD", "EUR", "GBP", "KES", "GHS", "ZAR"],
        fees: 1.4,
        processing_time: "2-5 minutes",
        security_rating: 92,
        popularity: 89,
        status: "active",
        features: [
          "Multi-currency",
          "Card Processing",
          "Bank Transfers",
          "Mobile Money",
        ],
        integration_complexity: 4,
      },
      {
        id: "paystack",
        name: "Paystack",
        type: "digital_wallet",
        region: "africa",
        logo: "💳",
        supported_currencies: ["NGN", "USD", "ZAR", "GHS"],
        fees: 1.5,
        processing_time: "Instant",
        security_rating: 94,
        popularity: 92,
        status: "active",
        features: ["Online Payments", "Subscriptions", "Invoicing", "POS"],
        integration_complexity: 3,
      },
      {
        id: "chipper_cash",
        name: "Chipper Cash",
        type: "mobile",
        region: "africa",
        logo: "🐿️",
        supported_currencies: ["NGN", "GHS", "UGX", "RWF", "KES", "ZAR"],
        fees: 0,
        processing_time: "Instant",
        security_rating: 88,
        popularity: 85,
        status: "active",
        features: [
          "Free Transfers",
          "Multi-country",
          "Crypto Trading",
          "Savings",
        ],
        integration_complexity: 4,
      },

      // European Fintech
      {
        id: "klarna",
        name: "Klarna",
        type: "digital_wallet",
        region: "europe",
        logo: "🎀",
        supported_currencies: ["EUR", "USD", "GBP", "SEK", "NOK", "DKK"],
        fees: 2.9,
        processing_time: "Instant",
        security_rating: 96,
        popularity: 94,
        status: "active",
        features: [
          "Buy Now Pay Later",
          "Installments",
          "One-time Cards",
          "Shopping",
        ],
        integration_complexity: 5,
      },
      {
        id: "adyen",
        name: "Adyen",
        type: "traditional",
        region: "europe",
        logo: "🔷",
        supported_currencies: ["EUR", "USD", "GBP", "JPY", "AUD", "CAD", "CHF"],
        fees: 2.2,
        processing_time: "1-2 days",
        security_rating: 98,
        popularity: 91,
        status: "active",
        features: [
          "Global Processing",
          "Risk Management",
          "Data Analytics",
          "Unified Commerce",
        ],
        integration_complexity: 7,
      },
      {
        id: "mollie",
        name: "Mollie",
        type: "digital_wallet",
        region: "europe",
        logo: "🧡",
        supported_currencies: ["EUR", "USD", "GBP"],
        fees: 1.8,
        processing_time: "1 day",
        security_rating: 93,
        popularity: 87,
        status: "active",
        features: [
          "Easy Integration",
          "Multiple Methods",
          "Subscription Billing",
          "Marketplace",
        ],
        integration_complexity: 4,
      },
      {
        id: "revolut",
        name: "Revolut",
        type: "digital_wallet",
        region: "europe",
        logo: "🚀",
        supported_currencies: ["EUR", "USD", "GBP", "CHF", "PLN", "RON", "BGN"],
        fees: 0.5,
        processing_time: "Instant",
        security_rating: 91,
        popularity: 96,
        status: "active",
        features: [
          "Multi-currency",
          "Crypto Trading",
          "Stock Trading",
          "Business Accounts",
        ],
        integration_complexity: 6,
      },

      // Asian Fintech
      {
        id: "alipay",
        name: "Alipay",
        type: "digital_wallet",
        region: "asia",
        logo: "🅰️",
        supported_currencies: ["CNY", "USD", "EUR", "HKD", "JPY"],
        fees: 1.2,
        processing_time: "Instant",
        security_rating: 97,
        popularity: 99,
        status: "active",
        features: [
          "QR Payments",
          "Mini Programs",
          "Wealth Management",
          "Lifestyle Services",
        ],
        integration_complexity: 8,
      },
      {
        id: "wechat_pay",
        name: "WeChat Pay",
        type: "digital_wallet",
        region: "asia",
        logo: "💬",
        supported_currencies: ["CNY", "USD", "EUR", "HKD"],
        fees: 1.0,
        processing_time: "Instant",
        security_rating: 96,
        popularity: 98,
        status: "active",
        features: [
          "Social Payments",
          "QR Codes",
          "Red Packets",
          "Mini Programs",
        ],
        integration_complexity: 9,
      },
      {
        id: "grabpay",
        name: "GrabPay",
        type: "mobile",
        region: "asia",
        logo: "🚗",
        supported_currencies: ["SGD", "MYR", "THB", "PHP", "IDR", "VND"],
        fees: 2.0,
        processing_time: "Instant",
        security_rating: 89,
        popularity: 93,
        status: "active",
        features: [
          "Super App",
          "Transport",
          "Food Delivery",
          "Financial Services",
        ],
        integration_complexity: 6,
      },
      {
        id: "paytm",
        name: "Paytm",
        type: "digital_wallet",
        region: "asia",
        logo: "💰",
        supported_currencies: ["INR", "USD"],
        fees: 1.8,
        processing_time: "Instant",
        security_rating: 87,
        popularity: 95,
        status: "active",
        features: ["UPI Payments", "Bill Payments", "Investment", "Insurance"],
        integration_complexity: 5,
      },

      // Web3 & Crypto
      {
        id: "metamask",
        name: "MetaMask",
        type: "crypto",
        region: "web3",
        logo: "🦊",
        supported_currencies: ["ETH", "BTC", "USDC", "USDT", "DAI"],
        fees: 0.1,
        processing_time: "1-15 minutes",
        security_rating: 92,
        popularity: 97,
        status: "active",
        features: [
          "Browser Extension",
          "DeFi Integration",
          "NFT Support",
          "Multi-chain",
        ],
        integration_complexity: 7,
      },
      {
        id: "walletconnect",
        name: "WalletConnect",
        type: "crypto",
        region: "web3",
        logo: "🔗",
        supported_currencies: ["ETH", "BTC", "BNB", "MATIC", "AVAX"],
        fees: 0,
        processing_time: "1-10 minutes",
        security_rating: 94,
        popularity: 89,
        status: "active",
        features: [
          "Protocol Standard",
          "Multi-wallet",
          "dApp Integration",
          "Cross-chain",
        ],
        integration_complexity: 8,
      },
      {
        id: "coinbase_wallet",
        name: "Coinbase Wallet",
        type: "crypto",
        region: "web3",
        logo: "🔵",
        supported_currencies: ["BTC", "ETH", "USDC", "USDT", "ADA", "DOT"],
        fees: 0.5,
        processing_time: "5-30 minutes",
        security_rating: 96,
        popularity: 92,
        status: "active",
        features: [
          "Self-custody",
          "DeFi Access",
          "NFT Storage",
          "dApp Browser",
        ],
        integration_complexity: 6,
      },
      {
        id: "phantom",
        name: "Phantom",
        type: "crypto",
        region: "web3",
        logo: "👻",
        supported_currencies: ["SOL", "USDC", "USDT", "SRM", "RAY"],
        fees: 0.1,
        processing_time: "1-5 seconds",
        security_rating: 91,
        popularity: 85,
        status: "active",
        features: [
          "Solana Focused",
          "NFT Gallery",
          "Staking",
          "DeFi Integration",
        ],
        integration_complexity: 5,
      },
    ];
  };

  const generateTransactions = (): PaymentTransaction[] => {
    const providers = ["mpesa", "flutterwave", "klarna", "alipay", "metamask"];
    const currencies = ["USD", "EUR", "NGN", "KES", "CNY", "ETH"];
    const statuses: PaymentTransaction["status"][] = [
      "pending",
      "processing",
      "completed",
      "failed",
    ];
    const types: PaymentTransaction["type"][] = [
      "deposit",
      "withdrawal",
      "transfer",
      "payment",
    ];

    return Array.from({ length: 15 }, (_, index) => ({
      id: `txn-${index + 1}`,
      amount: Math.random() * 10000 + 100,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      provider: providers[Math.floor(Math.random() * providers.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      destination: `****${Math.floor(Math.random() * 9999)}`,
      fees: Math.random() * 50 + 1,
      type: types[Math.floor(Math.random() * types.length)],
    }));
  };

  const generateCryptoWallets = (): CryptoWallet[] => {
    return [
      {
        address: "0x742d35Cc6E2d34b80A00aC8a9E9D9FE2E5B96A1A",
        network: "Ethereum",
        balance: 2.5,
        currency: "ETH",
        connected: true,
        provider: "MetaMask",
      },
      {
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        network: "Bitcoin",
        balance: 0.15,
        currency: "BTC",
        connected: true,
        provider: "Coinbase Wallet",
      },
      {
        address: "7d1X2a9P4j8K5m6N3q7R8s2T4u9V1w3X5y7Z8a2B4c",
        network: "Solana",
        balance: 125.8,
        currency: "SOL",
        connected: false,
        provider: "Phantom",
      },
    ];
  };

  useEffect(() => {
    setPaymentProviders(initializePaymentProviders());
    setTransactions(generateTransactions());
    setCryptoWallets(generateCryptoWallets());

    // Mock exchange rates
    setExchangeRates({
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      NGN: 411.5,
      KES: 110.2,
      CNY: 6.45,
      ETH: 0.0005,
      BTC: 0.000023,
    });

    const interval = setInterval(() => {
      setTransactions((prev) =>
        prev.map((txn) =>
          txn.status === "pending" && Math.random() > 0.7
            ? { ...txn, status: "completed" }
            : txn,
        ),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredProviders =
    selectedRegion === "all"
      ? paymentProviders
      : paymentProviders.filter(
          (provider) => provider.region === selectedRegion,
        );

  const processPayment = async () => {
    if (!paymentAmount || !selectedProvider) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const newTransaction: PaymentTransaction = {
        id: `txn-${Date.now()}`,
        amount: parseFloat(paymentAmount),
        currency: "USD",
        provider: selectedProvider,
        status: "completed",
        timestamp: Date.now(),
        destination: "QuantumVest Account",
        fees: parseFloat(paymentAmount) * 0.025,
        type: "deposit",
      };

      setTransactions((prev) => [newTransaction, ...prev]);
      setPaymentAmount("");
      setSelectedProvider("");
      setIsProcessing(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600";
      case "maintenance":
        return "bg-yellow-600";
      case "offline":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "processing":
        return "text-blue-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getRegionFlag = (region: string) => {
    switch (region) {
      case "africa":
        return "🌍";
      case "europe":
        return "🇪🇺";
      case "asia":
        return "🌏";
      case "web3":
        return "🌐";
      default:
        return "🌎";
    }
  };

  const regions = [
    { id: "all", name: "All Regions", flag: "🌍" },
    { id: "africa", name: "Africa", flag: "🌍" },
    { id: "europe", name: "Europe", flag: "🇪🇺" },
    { id: "asia", name: "Asia", flag: "🌏" },
    { id: "web3", name: "Web3", flag: "🌐" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Global Payment Processing Hub
          </h1>
          <p className="text-xl text-gray-300">
            Unified payment gateway supporting African, European, Asian fintech
            and Web3 solutions
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Badge className="bg-green-600 text-white">
              {paymentProviders.filter((p) => p.status === "active").length}{" "}
              Active Providers
            </Badge>
            <Badge className="bg-blue-600 text-white">
              {paymentProviders.length} Total Integrations
            </Badge>
            <Badge className="bg-purple-600 text-white">
              {transactions.filter((t) => t.status === "completed").length}{" "}
              Completed Transactions
            </Badge>
          </div>
        </motion.div>

        {/* Quick Payment Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Payment</CardTitle>
              <CardDescription>
                Make a payment using any of our supported providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="amount" className="text-gray-300">
                    Amount (USD)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="provider" className="text-gray-300">
                    Payment Provider
                  </Label>
                  <select
                    id="provider"
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  >
                    <option value="">Select Provider</option>
                    {paymentProviders
                      .filter((p) => p.status === "active")
                      .map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.logo} {provider.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={processPayment}
                    disabled={
                      !paymentAmount || !selectedProvider || isProcessing
                    }
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? "Processing..." : "Pay Now"}
                  </Button>
                </div>
              </div>
              {isProcessing && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    Processing payment...
                  </div>
                  <Progress value={66} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Region Filter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center space-x-4"
        >
          {regions.map((region) => (
            <Button
              key={region.id}
              variant={selectedRegion === region.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRegion(region.id as any)}
              className="flex items-center space-x-2"
            >
              <span>{region.flag}</span>
              <span>{region.name}</span>
            </Button>
          ))}
        </motion.div>

        {/* Main Interface */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">
                  Payment Management Center
                </CardTitle>
                <CardDescription>
                  Manage global payment providers and transactions
                </CardDescription>
              </div>
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as any)}
              >
                <TabsList className="bg-slate-700">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="regional">Regional</TabsTrigger>
                  <TabsTrigger value="crypto">Web3</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProviders.slice(0, 9).map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-700/50 border-slate-600 hover:border-slate-500 transition-colors">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{provider.logo}</span>
                              <div>
                                <h3 className="text-white font-medium">
                                  {provider.name}
                                </h3>
                                <p className="text-xs text-gray-400 flex items-center">
                                  {getRegionFlag(provider.region)}{" "}
                                  {provider.region}
                                </p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(provider.status)}>
                              {provider.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-400">Fees</span>
                              <div className="text-white font-medium">
                                {provider.fees}%
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Security</span>
                              <div className="text-white font-medium">
                                {provider.security_rating}%
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Speed</span>
                              <div className="text-white font-medium">
                                {provider.processing_time}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Popularity</span>
                              <div className="text-white font-medium">
                                {provider.popularity}%
                              </div>
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400 text-xs">
                              Currencies
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {provider.supported_currencies
                                .slice(0, 4)
                                .map((currency) => (
                                  <Badge
                                    key={currency}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {currency}
                                  </Badge>
                                ))}
                              {provider.supported_currencies.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{provider.supported_currencies.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400 text-xs">
                              Features
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {provider.features.slice(0, 2).map((feature) => (
                                <Badge
                                  key={feature}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-400">
                              Complexity: {provider.integration_complexity}/10
                            </div>
                            <Progress
                              value={provider.integration_complexity * 10}
                              className="w-16 h-1"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="regional" className="mt-0">
              <div className="space-y-6">
                {["africa", "europe", "asia"].map((region, regionIndex) => (
                  <div key={region}>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                      <span>{getRegionFlag(region)}</span>
                      <span className="capitalize">
                        {region} Fintech Solutions
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {paymentProviders
                        .filter((p) => p.region === region)
                        .map((provider, index) => (
                          <motion.div
                            key={provider.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: regionIndex * 0.2 + index * 0.1,
                            }}
                          >
                            <Card className="bg-slate-700/50 border-slate-600">
                              <CardContent className="p-3">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xl">
                                      {provider.logo}
                                    </span>
                                    <span className="text-white font-medium text-sm">
                                      {provider.name}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {provider.type} • {provider.fees}% fees
                                  </div>
                                  <Progress
                                    value={provider.popularity}
                                    className="h-1"
                                  />
                                  <div className="text-xs text-gray-400">
                                    {provider.popularity}% adoption rate
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="crypto" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Web3 & Crypto Wallets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cryptoWallets.map((wallet, index) => (
                      <motion.div
                        key={wallet.address}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-slate-700/50 border-slate-600">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-white font-medium">
                                  {wallet.provider}
                                </h4>
                                <Badge
                                  className={
                                    wallet.connected
                                      ? "bg-green-600"
                                      : "bg-gray-600"
                                  }
                                >
                                  {wallet.connected
                                    ? "Connected"
                                    : "Disconnected"}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-gray-400 text-sm">
                                    Network
                                  </span>
                                  <div className="text-white">
                                    {wallet.network}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-400 text-sm">
                                    Balance
                                  </span>
                                  <div className="text-white font-mono">
                                    {wallet.balance} {wallet.currency}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-400 text-sm">
                                    Address
                                  </span>
                                  <div className="text-white font-mono text-xs">
                                    {wallet.address.slice(0, 20)}...
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className={
                                  wallet.connected
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-green-600 hover:bg-green-700"
                                }
                              >
                                {wallet.connected ? "Disconnect" : "Connect"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Crypto Payment Providers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paymentProviders
                      .filter((p) => p.region === "web3")
                      .map((provider, index) => (
                        <motion.div
                          key={provider.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="bg-slate-700/50 border-slate-600">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">
                                    {provider.logo}
                                  </span>
                                  <div>
                                    <h4 className="text-white font-medium">
                                      {provider.name}
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                      {provider.type}
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">
                                      Security
                                    </span>
                                    <span className="text-white">
                                      {provider.security_rating}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Fees</span>
                                    <span className="text-white">
                                      {provider.fees}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {provider.supported_currencies
                                    .slice(0, 3)
                                    .map((currency) => (
                                      <Badge
                                        key={currency}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {currency}
                                      </Badge>
                                    ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="mt-0">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">
                                {transaction.id}
                              </span>
                              <Badge
                                className={
                                  transaction.type === "deposit"
                                    ? "bg-green-600"
                                    : "bg-blue-600"
                                }
                              >
                                {transaction.type}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-400">
                              {paymentProviders.find(
                                (p) => p.id === transaction.provider,
                              )?.name || transaction.provider}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-medium">
                              {transaction.amount.toFixed(2)}{" "}
                              {transaction.currency}
                            </div>
                            <div
                              className={`text-sm ${getTransactionStatusColor(transaction.status)}`}
                            >
                              {transaction.status}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-4 text-xs text-gray-400">
                          <div>
                            <span>Destination</span>
                            <div className="text-white">
                              {transaction.destination}
                            </div>
                          </div>
                          <div>
                            <span>Fees</span>
                            <div className="text-white">
                              ${transaction.fees.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <span>Time</span>
                            <div className="text-white">
                              {new Date(
                                transaction.timestamp,
                              ).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
