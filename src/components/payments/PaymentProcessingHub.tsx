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

interface PaymentSolution {
  id: string;
  name: string;
  description: string;
  category: "global" | "regional" | "web3" | "enterprise";
  coverage: string[];
  supportedMethods: string[];
  totalProviders: number;
  processingVolume: number;
  averageFees: number;
  integrationComplexity: number;
  route: string;
  icon: string;
  color: string;
  features: string[];
  status: "live" | "beta" | "coming_soon";
}

interface GlobalMetric {
  name: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

export function PaymentProcessingHub() {
  const [paymentSolutions, setPaymentSolutions] = useState<PaymentSolution[]>(
    [],
  );
  const [globalMetrics, setGlobalMetrics] = useState<GlobalMetric[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isSystemCheck, setIsSystemCheck] = useState(false);

  const initializePaymentSolutions = (): PaymentSolution[] => {
    return [
      {
        id: "global-payments",
        name: "Global Payment Hub",
        description:
          "Unified payment gateway supporting African, European, Asian fintech and Web3 solutions",
        category: "global",
        coverage: ["Global", "Multi-region", "Cross-border"],
        supportedMethods: [
          "Traditional Cards",
          "Digital Wallets",
          "Mobile Money",
          "Bank Transfers",
          "Crypto",
        ],
        totalProviders: 18,
        processingVolume: 2.4e9,
        averageFees: 1.8,
        integrationComplexity: 6,
        route: "/global-payments",
        icon: "🌍",
        color: "from-blue-500 to-green-500",
        features: [
          "Multi-currency",
          "Real-time Processing",
          "Risk Management",
          "Compliance Suite",
        ],
        status: "live",
      },
      {
        id: "regional-specialists",
        name: "Regional Payment Specialists",
        description:
          "Deep dive into regional fintech ecosystems with specialized payment solutions",
        category: "regional",
        coverage: ["Africa", "Europe", "Asia", "Americas"],
        supportedMethods: ["M-Pesa", "Klarna", "Alipay", "UPI", "SEPA", "ACH"],
        totalProviders: 15,
        processingVolume: 1.8e9,
        averageFees: 1.2,
        integrationComplexity: 7,
        route: "/regional-payments",
        icon: "🏛️",
        color: "from-purple-500 to-pink-500",
        features: [
          "Local Expertise",
          "Regulatory Compliance",
          "Cultural Adaptation",
          "Market Intelligence",
        ],
        status: "live",
      },
      {
        id: "web3-crypto",
        name: "Web3 & Crypto Integration",
        description:
          "Complete blockchain payment solutions with DeFi protocol integrations",
        category: "web3",
        coverage: ["Ethereum", "Polygon", "BSC", "Solana", "Avalanche"],
        supportedMethods: [
          "MetaMask",
          "WalletConnect",
          "DeFi Protocols",
          "Cross-chain Bridges",
        ],
        totalProviders: 12,
        processingVolume: 850e6,
        averageFees: 0.3,
        integrationComplexity: 8,
        route: "/web3-crypto",
        icon: "🔗",
        color: "from-cyan-500 to-blue-500",
        features: [
          "Multi-chain Support",
          "DeFi Integration",
          "NFT Payments",
          "Staking Rewards",
        ],
        status: "live",
      },
      {
        id: "enterprise-solutions",
        name: "Enterprise Payment Solutions",
        description:
          "High-volume institutional payment processing with advanced features",
        category: "enterprise",
        coverage: ["B2B", "Institutional", "Corporate", "Government"],
        supportedMethods: [
          "Wire Transfers",
          "Corporate Cards",
          "Invoice Payments",
          "Bulk Transfers",
        ],
        totalProviders: 8,
        processingVolume: 12.5e9,
        averageFees: 0.8,
        integrationComplexity: 9,
        route: "/enterprise-payments",
        icon: "🏢",
        color: "from-gray-500 to-slate-500",
        features: [
          "High Volume",
          "SLA Guarantees",
          "White-label",
          "Custom Integration",
        ],
        status: "beta",
      },
    ];
  };

  const initializeGlobalMetrics = (): GlobalMetric[] => {
    return [
      {
        name: "Total Transaction Volume",
        value: "$18.2B",
        change: 23.5,
        icon: "💰",
        color: "text-green-400",
      },
      {
        name: "Active Payment Providers",
        value: "53",
        change: 12.3,
        icon: "🏪",
        color: "text-blue-400",
      },
      {
        name: "Supported Countries",
        value: "180+",
        change: 8.7,
        icon: "🌐",
        color: "text-purple-400",
      },
      {
        name: "Avg Processing Time",
        value: "2.3s",
        change: -15.2,
        icon: "⚡",
        color: "text-yellow-400",
      },
      {
        name: "Success Rate",
        value: "99.7%",
        change: 0.3,
        icon: "✅",
        color: "text-green-400",
      },
      {
        name: "Fraud Prevention",
        value: "99.9%",
        change: 0.8,
        icon: "🛡️",
        color: "text-red-400",
      },
      {
        name: "API Uptime",
        value: "99.99%",
        change: 0.1,
        icon: "🔧",
        color: "text-cyan-400",
      },
      {
        name: "Customer Satisfaction",
        value: "4.8/5",
        change: 2.1,
        icon: "⭐",
        color: "text-orange-400",
      },
    ];
  };

  useEffect(() => {
    setPaymentSolutions(initializePaymentSolutions());
    setGlobalMetrics(initializeGlobalMetrics());

    const interval = setInterval(() => {
      setGlobalMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          change: metric.change + (Math.random() - 0.5) * 2,
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredSolutions =
    selectedCategory === "all"
      ? paymentSolutions
      : paymentSolutions.filter(
          (solution) => solution.category === selectedCategory,
        );

  const runSystemCheck = () => {
    setIsSystemCheck(true);
    setTimeout(() => setIsSystemCheck(false), 3000);
  };

  const navigateToSolution = (route: string) => {
    window.location.href = route;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
    return `$${volume.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-600";
      case "beta":
        return "bg-blue-600";
      case "coming_soon":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  const categories = [
    { id: "all", name: "All Solutions", icon: "🚀" },
    { id: "global", name: "Global", icon: "🌍" },
    { id: "regional", name: "Regional", icon: "🏛️" },
    { id: "web3", name: "Web3", icon: "🔗" },
    { id: "enterprise", name: "Enterprise", icon: "🏢" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Payment Processing Command Center
          </h1>
          <p className="text-xl text-gray-300">
            Complete global payment infrastructure with regional expertise and
            Web3 integration
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Badge className="bg-green-600 text-white text-lg px-4 py-2">
              {paymentSolutions.filter((s) => s.status === "live").length} Live
              Solutions
            </Badge>
            <Badge className="bg-blue-600 text-white text-lg px-4 py-2">
              {paymentSolutions.reduce((sum, s) => sum + s.totalProviders, 0)}{" "}
              Payment Providers
            </Badge>
            <Badge className="bg-purple-600 text-white text-lg px-4 py-2">
              {formatVolume(
                paymentSolutions.reduce(
                  (sum, s) => sum + s.processingVolume,
                  0,
                ),
              )}{" "}
              Volume
            </Badge>
          </div>
        </motion.div>

        {/* Global Metrics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {globalMetrics.map((metric, index) => (
            <Card
              key={metric.name}
              className="bg-slate-800/50 border-slate-700"
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{metric.icon}</span>
                    <span
                      className={`text-xs ${metric.change >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {metric.change >= 0 ? "+" : ""}
                      {metric.change.toFixed(1)}%
                    </span>
                  </div>
                  <div className={`text-lg font-bold ${metric.color}`}>
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-400">{metric.name}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>

          <Button
            onClick={runSystemCheck}
            disabled={isSystemCheck}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSystemCheck ? "Running System Check..." : "System Health Check"}
          </Button>
        </motion.div>

        {/* Payment Solutions Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {filteredSolutions.map((solution, index) => (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <Card
                  className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 cursor-pointer h-full"
                  onClick={() => navigateToSolution(solution.route)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-4xl">{solution.icon}</div>
                        <div>
                          <CardTitle
                            className={`text-white bg-gradient-to-r ${solution.color} bg-clip-text text-transparent`}
                          >
                            {solution.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getStatusColor(solution.status)}>
                              {solution.status.replace("_", " ")}
                            </Badge>
                            <Badge variant="outline">{solution.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-gray-300 text-base">
                      {solution.description}
                    </CardDescription>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">Providers</span>
                        <div className="text-2xl font-bold text-white">
                          {solution.totalProviders}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Volume</span>
                        <div className="text-2xl font-bold text-green-400">
                          {formatVolume(solution.processingVolume)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Avg Fees</span>
                        <div className="text-2xl font-bold text-blue-400">
                          {solution.averageFees}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">
                          Complexity
                        </span>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={solution.integrationComplexity * 10}
                            className="flex-1 h-2"
                          />
                          <span className="text-white text-sm">
                            {solution.integrationComplexity}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm">Coverage</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {solution.coverage.map((region) => (
                          <Badge
                            key={region}
                            variant="secondary"
                            className="text-xs"
                          >
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm">
                        Payment Methods
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {solution.supportedMethods.slice(0, 4).map((method) => (
                          <Badge
                            key={method}
                            variant="outline"
                            className="text-xs"
                          >
                            {method}
                          </Badge>
                        ))}
                        {solution.supportedMethods.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{solution.supportedMethods.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm">
                        Key Features
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {solution.features.map((feature) => (
                          <Badge
                            key={feature}
                            className="bg-purple-600 text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-gray-400">
                        Integration Ready
                      </div>
                      <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                        Launch →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Integration Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Payment Integration Architecture
              </CardTitle>
              <CardDescription>
                Complete payment processing ecosystem overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl">🌍</div>
                    <h3 className="text-white font-medium">Global Reach</h3>
                    <p className="text-gray-400 text-sm">
                      Process payments in 180+ countries with local payment
                      methods
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl">🔒</div>
                    <h3 className="text-white font-medium">
                      Enterprise Security
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Bank-grade security with PCI DSS compliance and fraud
                      prevention
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl">⚡</div>
                    <h3 className="text-white font-medium">
                      Real-time Processing
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Instant settlement with 99.99% uptime and sub-second
                      response times
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-600 pt-4">
                  <h4 className="text-white font-medium mb-3">
                    Supported Regions & Specialties
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h5 className="text-green-400 font-medium">🌍 Africa</h5>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li>• M-Pesa & Mobile Money</li>
                        <li>• Agent Banking</li>
                        <li>• Cross-border Remittances</li>
                        <li>• Financial Inclusion</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-blue-400 font-medium">🇪🇺 Europe</h5>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li>• SEPA Instant Payments</li>
                        <li>• Open Banking (PSD2)</li>
                        <li>• Buy Now Pay Later</li>
                        <li>• Regulatory Compliance</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-red-400 font-medium">🌏 Asia</h5>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li>• QR Code Payments</li>
                        <li>• Super App Integration</li>
                        <li>• UPI & Digital Wallets</li>
                        <li>• E-commerce Solutions</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-purple-400 font-medium">🌐 Web3</h5>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li>• Multi-chain Support</li>
                        <li>• DeFi Protocol Integration</li>
                        <li>• NFT Marketplace Payments</li>
                        <li>• Staking & Yield Farming</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Check Effect */}
        <AnimatePresence>
          {isSystemCheck && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-green-500/10 flex items-center justify-center z-50"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="text-4xl font-bold text-green-400"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 5 }}
                >
                  Payment System Health Check
                </motion.div>
                <motion.div
                  className="text-lg text-white"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Verifying all payment providers and integrations...
                </motion.div>
                <Progress value={75} className="w-64 mx-auto" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
