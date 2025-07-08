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

interface DataSource {
  id: string;
  name: string;
  type:
    | "market"
    | "news"
    | "social"
    | "blockchain"
    | "economic"
    | "alternative";
  status: "active" | "syncing" | "error" | "offline";
  latency: number;
  reliability: number;
  coverage: string[];
  dataPoints: number;
  lastUpdate: number;
  apiCalls: number;
  cost: number;
}

interface IntelligenceSignal {
  id: string;
  source: string;
  type: "bullish" | "bearish" | "neutral" | "alert";
  strength: number;
  confidence: number;
  title: string;
  description: string;
  timestamp: number;
  impact: number;
  category: string;
}

interface MetaAnalysis {
  sentiment: number;
  momentum: number;
  volatility: number;
  volume: number;
  correlation: number;
  anomaly: number;
  prediction: number;
  confidence: number;
}

interface PlatformIntegration {
  name: string;
  connected: boolean;
  status: "synced" | "syncing" | "error" | "pending";
  lastSync: number;
  dataFlow: number;
  features: string[];
}

export function MetaFinancialHub() {
  const [activeTab, setActiveTab] = useState<
    "sources" | "signals" | "analysis" | "integrations"
  >("sources");
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [intelligenceSignals, setIntelligenceSignals] = useState<
    IntelligenceSignal[]
  >([]);
  const [metaAnalysis, setMetaAnalysis] = useState<MetaAnalysis | null>(null);
  const [platformIntegrations, setPlatformIntegrations] = useState<
    PlatformIntegration[]
  >([]);
  const [isAggregating, setIsAggregating] = useState(false);
  const [totalDataPoints, setTotalDataPoints] = useState(0);
  const [aggregationProgress, setAggregationProgress] = useState(0);

  const generateDataSources = (): DataSource[] => {
    const sources = [
      {
        name: "Bloomberg Terminal",
        type: "market" as const,
        reliability: 98.5,
        cost: 2500,
      },
      {
        name: "Reuters Eikon",
        type: "market" as const,
        reliability: 97.2,
        cost: 2200,
      },
      {
        name: "Alpha Vantage",
        type: "market" as const,
        reliability: 89.3,
        cost: 200,
      },
      {
        name: "Polygon.io",
        type: "market" as const,
        reliability: 92.1,
        cost: 299,
      },
      {
        name: "Twitter API",
        type: "social" as const,
        reliability: 75.4,
        cost: 500,
      },
      {
        name: "Reddit Finance",
        type: "social" as const,
        reliability: 68.7,
        cost: 150,
      },
      {
        name: "Financial Times",
        type: "news" as const,
        reliability: 94.8,
        cost: 400,
      },
      {
        name: "MarketWatch",
        type: "news" as const,
        reliability: 87.3,
        cost: 250,
      },
      {
        name: "Ethereum Node",
        type: "blockchain" as const,
        reliability: 99.1,
        cost: 800,
      },
      {
        name: "Chainlink Oracles",
        type: "blockchain" as const,
        reliability: 96.7,
        cost: 600,
      },
      {
        name: "Federal Reserve",
        type: "economic" as const,
        reliability: 99.9,
        cost: 0,
      },
      {
        name: "World Bank Data",
        type: "economic" as const,
        reliability: 98.2,
        cost: 0,
      },
      {
        name: "Satellite Imagery",
        type: "alternative" as const,
        reliability: 85.9,
        cost: 1200,
      },
      {
        name: "Corporate Filings",
        type: "alternative" as const,
        reliability: 91.4,
        cost: 350,
      },
    ];

    const statuses: DataSource["status"][] = [
      "active",
      "syncing",
      "error",
      "offline",
    ];
    const coverageOptions = [
      ["US Markets", "EU Markets"],
      ["Global Equities", "Bonds"],
      ["Crypto", "DeFi"],
      ["Commodities", "Forex"],
      ["Real Estate", "Private Equity"],
      ["ESG Data", "Sentiment"],
    ];

    return sources.map((source, index) => ({
      id: `source-${index}`,
      ...source,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      latency: Math.random() * 500 + 50,
      coverage:
        coverageOptions[Math.floor(Math.random() * coverageOptions.length)],
      dataPoints: Math.floor(Math.random() * 1000000) + 100000,
      lastUpdate: Date.now() - Math.random() * 3600000,
      apiCalls: Math.floor(Math.random() * 10000) + 1000,
    }));
  };

  const generateIntelligenceSignals = (): IntelligenceSignal[] => {
    const types: IntelligenceSignal["type"][] = [
      "bullish",
      "bearish",
      "neutral",
      "alert",
    ];
    const categories = [
      "Market Sentiment",
      "Technical Analysis",
      "Fundamental Analysis",
      "Social Media Buzz",
      "Insider Trading",
      "Options Flow",
      "Institutional Money",
      "Retail Activity",
      "Global Events",
      "Economic Indicators",
    ];

    const titles = [
      "Unusual Options Activity Detected",
      "Institutional Accumulation Pattern",
      "Breakout Signal Confirmed",
      "Sentiment Shift in Social Media",
      "Earnings Whisper Numbers",
      "Fed Policy Change Indication",
      "Technical Support Level Breach",
      "Volume Anomaly Alert",
      "Correlation Breakdown Signal",
      "Volatility Expansion Warning",
    ];

    return Array.from({ length: 25 }, (_, index) => ({
      id: `signal-${index}`,
      source:
        dataSources[Math.floor(Math.random() * dataSources.length)]?.name ||
        "Unknown",
      type: types[Math.floor(Math.random() * types.length)],
      strength: Math.random() * 100,
      confidence: Math.random() * 40 + 60,
      title: titles[Math.floor(Math.random() * titles.length)],
      description: `Advanced meta-analysis has identified this signal through cross-platform data aggregation and AI processing across multiple financial intelligence sources.`,
      timestamp: Date.now() - Math.random() * 24 * 60 * 60 * 1000,
      impact: (Math.random() - 0.5) * 20,
      category: categories[Math.floor(Math.random() * categories.length)],
    }));
  };

  const generateMetaAnalysis = (): MetaAnalysis => {
    return {
      sentiment: Math.random() * 100,
      momentum: Math.random() * 100,
      volatility: Math.random() * 100,
      volume: Math.random() * 100,
      correlation: Math.random() * 100,
      anomaly: Math.random() * 100,
      prediction: Math.random() * 100,
      confidence: Math.random() * 40 + 60,
    };
  };

  const generatePlatformIntegrations = (): PlatformIntegration[] => {
    const platforms = [
      {
        name: "Interactive Brokers",
        features: ["Order Execution", "Portfolio Sync", "Real-time Data"],
      },
      {
        name: "TD Ameritrade",
        features: ["Account Balance", "Trade History", "Options Chain"],
      },
      {
        name: "Robinhood",
        features: ["Mobile Trading", "Instant Deposits", "Crypto Trading"],
      },
      {
        name: "E*TRADE",
        features: ["Research Tools", "Portfolio Analysis", "Tax Documents"],
      },
      {
        name: "Coinbase Pro",
        features: ["Crypto Portfolio", "DeFi Integrations", "Staking Rewards"],
      },
      {
        name: "MetaMask",
        features: ["Wallet Balance", "DeFi Positions", "NFT Holdings"],
      },
      {
        name: "Binance",
        features: ["Spot Trading", "Futures", "Staking Positions"],
      },
      {
        name: "TradingView",
        features: ["Charts", "Indicators", "Social Trading"],
      },
    ];

    const statuses: PlatformIntegration["status"][] = [
      "synced",
      "syncing",
      "error",
      "pending",
    ];

    return platforms.map((platform, index) => ({
      ...platform,
      connected: Math.random() > 0.2,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastSync: Date.now() - Math.random() * 3600000,
      dataFlow: Math.random() * 1000 + 100,
    }));
  };

  useEffect(() => {
    const sources = generateDataSources();
    setDataSources(sources);
    setIntelligenceSignals(generateIntelligenceSignals());
    setMetaAnalysis(generateMetaAnalysis());
    setPlatformIntegrations(generatePlatformIntegrations());
    setTotalDataPoints(
      sources.reduce((sum, source) => sum + source.dataPoints, 0),
    );

    const interval = setInterval(() => {
      setDataSources((prev) =>
        prev.map((source) => ({
          ...source,
          latency: Math.max(10, source.latency + (Math.random() - 0.5) * 50),
          apiCalls: source.apiCalls + Math.floor(Math.random() * 100),
          lastUpdate: Math.random() > 0.8 ? Date.now() : source.lastUpdate,
        })),
      );

      setMetaAnalysis(generateMetaAnalysis());

      setTotalDataPoints((prev) => prev + Math.floor(Math.random() * 10000));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const startAggregation = () => {
    setIsAggregating(true);
    setAggregationProgress(0);

    const interval = setInterval(() => {
      setAggregationProgress((prev) => {
        if (prev >= 100) {
          setIsAggregating(false);
          clearInterval(interval);
          setIntelligenceSignals(generateIntelligenceSignals());
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const getSourceStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600";
      case "syncing":
        return "bg-blue-600";
      case "error":
        return "bg-red-600";
      case "offline":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case "market":
        return "📈";
      case "news":
        return "📰";
      case "social":
        return "💬";
      case "blockchain":
        return "⛓️";
      case "economic":
        return "🏦";
      case "alternative":
        return "🛰️";
      default:
        return "📊";
    }
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case "bullish":
        return "text-green-400";
      case "bearish":
        return "text-red-400";
      case "neutral":
        return "text-yellow-400";
      case "alert":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case "bullish":
        return "↗️";
      case "bearish":
        return "↘️";
      case "neutral":
        return "→";
      case "alert":
        return "⚠️";
      default:
        return "📊";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Meta-Financial Intelligence Hub
          </h1>
          <p className="text-xl text-gray-300">
            Cross-platform financial data aggregation and intelligence synthesis
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Badge className="bg-blue-600 text-white">
              Data Sources:{" "}
              {dataSources.filter((s) => s.status === "active").length}/
              {dataSources.length}
            </Badge>
            <Badge className="bg-green-600 text-white">
              Data Points: {totalDataPoints.toLocaleString()}
            </Badge>
            <Badge className="bg-purple-600 text-white">
              Signals: {intelligenceSignals.length}
            </Badge>
          </div>
        </motion.div>

        {/* Meta Analysis Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {metaAnalysis &&
            Object.entries(metaAnalysis).map(([key, value], index) => (
              <Card key={key} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className="text-xl font-bold text-white">
                      {value.toFixed(1)}
                      {key === "confidence" ||
                      key === "sentiment" ||
                      key === "momentum" ||
                      key === "volatility" ||
                      key === "volume" ||
                      key === "correlation" ||
                      key === "anomaly" ||
                      key === "prediction"
                        ? "%"
                        : ""}
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center space-x-4"
        >
          <Button
            onClick={startAggregation}
            disabled={isAggregating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isAggregating
              ? `Aggregating... ${aggregationProgress.toFixed(0)}%`
              : "Start Meta-Aggregation"}
          </Button>
          {isAggregating && (
            <div className="w-64">
              <Progress value={aggregationProgress} className="h-2" />
            </div>
          )}
        </motion.div>

        {/* Main Interface */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">
                  Financial Intelligence Dashboard
                </CardTitle>
                <CardDescription>
                  Real-time data aggregation from multiple financial platforms
                </CardDescription>
              </div>
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as any)}
              >
                <TabsList className="bg-slate-700">
                  <TabsTrigger value="sources">Data Sources</TabsTrigger>
                  <TabsTrigger value="signals">Intelligence</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="integrations">Platforms</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="sources" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {dataSources.map((source, index) => (
                  <motion.div
                    key={source.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {getSourceTypeIcon(source.type)}
                              </span>
                              <h3 className="text-white font-medium">
                                {source.name}
                              </h3>
                            </div>
                            <Badge
                              className={getSourceStatusColor(source.status)}
                            >
                              {source.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Reliability</span>
                              <div className="text-white font-medium">
                                {source.reliability.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Latency</span>
                              <div className="text-white font-medium">
                                {source.latency.toFixed(0)}ms
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Data Points</span>
                              <div className="text-white font-medium">
                                {source.dataPoints.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">API Calls</span>
                              <div className="text-white font-medium">
                                {source.apiCalls.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-400 text-sm">
                              Coverage
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {source.coverage.map((item) => (
                                <Badge
                                  key={item}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              Cost: ${source.cost}/month
                            </span>
                            <span className="text-gray-400">
                              Updated:{" "}
                              {new Date(source.lastUpdate).toLocaleTimeString()}
                            </span>
                          </div>

                          <Progress
                            value={source.reliability}
                            className="h-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="signals" className="mt-0">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {intelligenceSignals.map((signal, index) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span>{getSignalIcon(signal.type)}</span>
                              <h3 className="text-white font-medium">
                                {signal.title}
                              </h3>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={getSignalColor(signal.type)
                                  .replace("text-", "bg-")
                                  .replace("400", "600")}
                              >
                                {signal.type}
                              </Badge>
                              <Badge variant="outline">{signal.category}</Badge>
                            </div>
                          </div>

                          <p className="text-sm text-gray-300">
                            {signal.description}
                          </p>

                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Strength</span>
                              <div className="text-white font-medium">
                                {signal.strength.toFixed(1)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Confidence</span>
                              <div className="text-white font-medium">
                                {signal.confidence.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Impact</span>
                              <div
                                className={`font-medium ${signal.impact >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {signal.impact >= 0 ? "+" : ""}
                                {signal.impact.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Source</span>
                              <div className="text-white font-medium text-xs">
                                {signal.source}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <Progress
                              value={signal.confidence}
                              className="h-2 flex-1 mr-4"
                            />
                            <span className="text-xs text-gray-400">
                              {new Date(signal.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="mt-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <h3 className="text-white font-medium mb-4">
                        Correlation Matrix
                      </h3>
                      <div className="grid grid-cols-6 gap-1">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-8 h-8 rounded-sm"
                            style={{
                              backgroundColor: `rgba(139, 92, 246, ${Math.random() * 0.8 + 0.2})`,
                            }}
                            animate={{
                              opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <h3 className="text-white font-medium mb-4">
                        Real-time Metrics
                      </h3>
                      <div className="space-y-3">
                        {metaAnalysis &&
                          Object.entries(metaAnalysis)
                            .slice(0, 5)
                            .map(([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between"
                              >
                                <span className="text-gray-400 capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <Progress
                                    value={value}
                                    className="w-20 h-2"
                                  />
                                  <span className="text-white text-sm">
                                    {value.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-48 bg-slate-900/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-4">
                    Data Flow Visualization
                  </h3>
                  <div className="relative h-32">
                    <svg className="w-full h-full">
                      {dataSources.slice(0, 8).map((source, i) => (
                        <g key={source.id}>
                          <circle
                            cx={`${15 + i * 10}%`}
                            cy="50%"
                            r="4"
                            fill={
                              source.status === "active" ? "#10B981" : "#6B7280"
                            }
                          />
                          <motion.line
                            x1={`${15 + i * 10}%`}
                            y1="50%"
                            x2="90%"
                            y2="50%"
                            stroke="rgba(139, 92, 246, 0.3)"
                            strokeWidth="1"
                            initial={{ pathLength: 0 }}
                            animate={{
                              pathLength: source.status === "active" ? 1 : 0,
                            }}
                            transition={{ duration: 2, delay: i * 0.2 }}
                          />
                        </g>
                      ))}
                      <circle cx="90%" cy="50%" r="8" fill="#8B5CF6" />
                    </svg>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {platformIntegrations.map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-white font-medium">
                              {platform.name}
                            </h3>
                            <Badge
                              className={
                                platform.connected
                                  ? "bg-green-600"
                                  : "bg-gray-600"
                              }
                            >
                              {platform.connected
                                ? "Connected"
                                : "Disconnected"}
                            </Badge>
                          </div>

                          {platform.connected && (
                            <>
                              <div className="text-sm">
                                <div className="flex justify-between mb-1">
                                  <span className="text-gray-400">Status</span>
                                  <span className="text-white">
                                    {platform.status}
                                  </span>
                                </div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-gray-400">
                                    Data Flow
                                  </span>
                                  <span className="text-white">
                                    {platform.dataFlow.toFixed(0)} KB/s
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">
                                    Last Sync
                                  </span>
                                  <span className="text-white text-xs">
                                    {new Date(
                                      platform.lastSync,
                                    ).toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <span className="text-gray-400 text-xs">
                                  Features
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {platform.features.map((feature) => (
                                    <Badge
                                      key={feature}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          <Button
                            size="sm"
                            className={
                              platform.connected
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            }
                          >
                            {platform.connected ? "Disconnect" : "Connect"}
                          </Button>
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
