import React, { useState, useEffect, useRef } from "react";
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
import { Slider } from "@/components/ui/slider";

interface TimelineEvent {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  impact: number;
  category: "market" | "economic" | "political" | "technological";
  marketEffect: number;
  confidence: number;
}

interface MarketState {
  timestamp: number;
  sp500: number;
  nasdaq: number;
  dow: number;
  vix: number;
  bonds: number;
  commodities: number;
  crypto: number;
  sentiment: number;
}

interface TemporalDimension {
  name: string;
  timeframe: string;
  accuracy: number;
  complexity: number;
  marketStates: MarketState[];
}

export function TemporalMarketAnalysis() {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "1H" | "1D" | "1W" | "1M" | "1Y"
  >("1D");
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [temporalDimensions, setTemporalDimensions] = useState<
    TemporalDimension[]
  >([]);
  const [isTimeTravel, setIsTimeTravel] = useState(false);
  const [targetTime, setTargetTime] = useState([0]);
  const [marketStates, setMarketStates] = useState<MarketState[]>([]);
  const [selectedDimension, setSelectedDimension] = useState(0);
  const [temporalAccuracy, setTemporalAccuracy] = useState(87.3);
  const timelineRef = useRef<HTMLDivElement>(null);

  const generateTimelineEvents = (): TimelineEvent[] => {
    const categories: TimelineEvent["category"][] = [
      "market",
      "economic",
      "political",
      "technological",
    ];
    const events = [
      "Fed Rate Decision",
      "Earnings Report",
      "GDP Release",
      "Election Results",
      "Tech Innovation",
      "Geopolitical Event",
      "Corporate Merger",
      "Commodity Shock",
      "Currency Devaluation",
      "Market Crash",
      "Bull Run Begin",
      "Regulation Change",
      "IPO Launch",
      "Dividend Announcement",
      "Credit Rating Change",
      "Trade War",
    ];

    const baseTime = Date.now();
    return Array.from({ length: 50 }, (_, index) => ({
      id: `event-${index}`,
      timestamp:
        baseTime -
        Math.random() * 365 * 24 * 60 * 60 * 1000 +
        index * 7 * 24 * 60 * 60 * 1000,
      title: events[Math.floor(Math.random() * events.length)],
      description: `Market-moving event with significant temporal implications for ${categories[Math.floor(Math.random() * categories.length)]} sector`,
      impact: (Math.random() - 0.5) * 20,
      category: categories[Math.floor(Math.random() * categories.length)],
      marketEffect: (Math.random() - 0.5) * 15,
      confidence: Math.random() * 40 + 60,
    }));
  };

  const generateMarketStates = (count: number): MarketState[] => {
    const baseTime = Date.now();
    return Array.from({ length: count }, (_, index) => {
      const time = baseTime - (count - index) * 24 * 60 * 60 * 1000;
      const volatility = Math.sin(index / 10) * 0.1 + Math.random() * 0.05;

      return {
        timestamp: time,
        sp500: 4200 + Math.sin(index / 20) * 200 + (Math.random() - 0.5) * 100,
        nasdaq:
          14000 + Math.sin(index / 15) * 800 + (Math.random() - 0.5) * 400,
        dow: 34000 + Math.sin(index / 25) * 1000 + (Math.random() - 0.5) * 500,
        vix:
          20 + Math.abs(Math.sin(index / 8)) * 30 + (Math.random() - 0.5) * 10,
        bonds: 4.5 + Math.sin(index / 30) * 1.5 + (Math.random() - 0.5) * 0.5,
        commodities:
          100 + Math.sin(index / 12) * 20 + (Math.random() - 0.5) * 10,
        crypto:
          45000 + Math.sin(index / 7) * 15000 + (Math.random() - 0.5) * 5000,
        sentiment: 50 + Math.sin(index / 18) * 30 + (Math.random() - 0.5) * 20,
      };
    });
  };

  const generateTemporalDimensions = (): TemporalDimension[] => {
    return [
      {
        name: "Past Analysis",
        timeframe: "Historical Data",
        accuracy: 94.2,
        complexity: 3,
        marketStates: generateMarketStates(365),
      },
      {
        name: "Present State",
        timeframe: "Real-time",
        accuracy: 99.1,
        complexity: 5,
        marketStates: generateMarketStates(1),
      },
      {
        name: "Near Future",
        timeframe: "1-30 Days",
        accuracy: 78.5,
        complexity: 7,
        marketStates: generateMarketStates(30),
      },
      {
        name: "Medium Future",
        timeframe: "1-12 Months",
        accuracy: 65.3,
        complexity: 8,
        marketStates: generateMarketStates(365),
      },
      {
        name: "Far Future",
        timeframe: "1-10 Years",
        accuracy: 42.7,
        complexity: 10,
        marketStates: generateMarketStates(3650),
      },
    ];
  };

  useEffect(() => {
    setTimelineEvents(generateTimelineEvents());
    setTemporalDimensions(generateTemporalDimensions());
    setMarketStates(generateMarketStates(100));

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
      setTemporalAccuracy((prev) =>
        Math.max(70, Math.min(95, prev + (Math.random() - 0.5) * 3)),
      );

      // Update market states
      setMarketStates((prev) =>
        prev.map((state) => ({
          ...state,
          sp500: state.sp500 + (Math.random() - 0.5) * 10,
          vix: Math.max(
            10,
            Math.min(80, state.vix + (Math.random() - 0.5) * 2),
          ),
          sentiment: Math.max(
            0,
            Math.min(100, state.sentiment + (Math.random() - 0.5) * 5),
          ),
        })),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const startTimeTravel = () => {
    setIsTimeTravel(true);
    setTimeout(() => setIsTimeTravel(false), 5000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "market":
        return "#10B981";
      case "economic":
        return "#F59E0B";
      case "political":
        return "#EF4444";
      case "technological":
        return "#8B5CF6";
      default:
        return "#6B7280";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "market":
        return "📊";
      case "economic":
        return "🏦";
      case "political":
        return "🏛️";
      case "technological":
        return "⚡";
      default:
        return "📈";
    }
  };

  const formatTimeDistance = (timestamp: number) => {
    const diff = Math.abs(Date.now() - timestamp);
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

    if (days > 365) return `${Math.floor(days / 365)}y ago`;
    if (days > 30) return `${Math.floor(days / 30)}mo ago`;
    if (days > 0) return `${days}d ago`;
    return `${hours}h ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Temporal Market Analysis
          </h1>
          <p className="text-xl text-gray-300">
            Time-travel through market data with multi-dimensional temporal
            analysis
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Badge className="bg-blue-600 text-white">
              Temporal Accuracy: {temporalAccuracy.toFixed(1)}%
            </Badge>
            <Badge className="bg-purple-600 text-white">
              Active Dimensions: {temporalDimensions.length}
            </Badge>
            <Badge className="bg-cyan-600 text-white">
              Timeline Events: {timelineEvents.length}
            </Badge>
          </div>
        </motion.div>

        {/* Temporal Controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                <label className="text-sm text-gray-300">Time Navigation</label>
                <Slider
                  value={targetTime}
                  onValueChange={setTargetTime}
                  max={100}
                  min={-100}
                  step={1}
                  className="w-full"
                />
                <div className="text-center text-white font-medium text-xs">
                  {targetTime[0] > 0 ? `+${targetTime[0]}` : targetTime[0]} days
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                <label className="text-sm text-gray-300">Dimension</label>
                <Slider
                  value={[selectedDimension]}
                  onValueChange={(value) => setSelectedDimension(value[0])}
                  max={temporalDimensions.length - 1}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="text-center text-white font-medium text-xs">
                  {temporalDimensions[selectedDimension]?.name || "Unknown"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                <label className="text-sm text-gray-300">Timeframe</label>
                <div className="grid grid-cols-5 gap-1">
                  {(["1H", "1D", "1W", "1M", "1Y"] as const).map((tf) => (
                    <Button
                      key={tf}
                      variant={selectedTimeframe === tf ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTimeframe(tf)}
                      className="text-xs"
                    >
                      {tf}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <Button
                onClick={startTimeTravel}
                disabled={isTimeTravel}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isTimeTravel ? "Time Traveling..." : "Activate Time Travel"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Temporal Dimensions Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          {temporalDimensions.map((dimension, index) => (
            <Card
              key={dimension.name}
              className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all ${
                selectedDimension === index ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() => setSelectedDimension(index)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white">
                      {dimension.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {dimension.timeframe}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Accuracy</span>
                      <span className="text-white">
                        {dimension.accuracy.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={dimension.accuracy} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Complexity</span>
                      <div className="flex space-x-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-3 rounded-full ${
                              i < dimension.complexity
                                ? "bg-purple-400"
                                : "bg-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Interface */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">
                  Temporal Analysis Interface
                </CardTitle>
                <CardDescription>
                  Navigate through time and analyze market behavior across
                  dimensions
                </CardDescription>
              </div>
              <div className="text-sm text-purple-300">
                Current Time: {new Date(currentTime).toLocaleString()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timeline" className="space-y-4">
              <TabsList className="bg-slate-700">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="markets">Market States</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="space-y-4">
                <div className="relative h-96 bg-slate-900/50 rounded-lg overflow-hidden">
                  <div
                    ref={timelineRef}
                    className="absolute inset-0 p-4 overflow-y-auto"
                  >
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-purple-500/30" />

                      {/* Timeline events */}
                      <div className="space-y-6">
                        {timelineEvents
                          .sort((a, b) => b.timestamp - a.timestamp)
                          .slice(0, 20)
                          .map((event, index) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative flex items-start space-x-4"
                            >
                              {/* Timeline node */}
                              <motion.div
                                className="relative z-10 w-3 h-3 rounded-full border-2 border-white"
                                style={{
                                  backgroundColor: getCategoryColor(
                                    event.category,
                                  ),
                                }}
                                whileHover={{ scale: 1.2 }}
                              />

                              {/* Event content */}
                              <div className="flex-1 bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span>
                                      {getCategoryIcon(event.category)}
                                    </span>
                                    <h3 className="text-white font-medium">
                                      {event.title}
                                    </h3>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      style={{
                                        backgroundColor: getCategoryColor(
                                          event.category,
                                        ),
                                      }}
                                    >
                                      {event.category}
                                    </Badge>
                                    <span className="text-xs text-gray-400">
                                      {formatTimeDistance(event.timestamp)}
                                    </span>
                                  </div>
                                </div>

                                <p className="text-sm text-gray-300 mb-3">
                                  {event.description}
                                </p>

                                <div className="grid grid-cols-3 gap-4 text-xs">
                                  <div>
                                    <span className="text-gray-400">
                                      Impact
                                    </span>
                                    <div
                                      className={`font-medium ${event.impact >= 0 ? "text-green-400" : "text-red-400"}`}
                                    >
                                      {event.impact >= 0 ? "+" : ""}
                                      {event.impact.toFixed(1)}%
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">
                                      Market Effect
                                    </span>
                                    <div
                                      className={`font-medium ${event.marketEffect >= 0 ? "text-green-400" : "text-red-400"}`}
                                    >
                                      {event.marketEffect >= 0 ? "+" : ""}
                                      {event.marketEffect.toFixed(1)}%
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">
                                      Confidence
                                    </span>
                                    <div className="text-white font-medium">
                                      {event.confidence.toFixed(1)}%
                                    </div>
                                  </div>
                                </div>

                                <Progress
                                  value={event.confidence}
                                  className="h-1 mt-2"
                                />
                              </div>
                            </motion.div>
                          ))}
                      </div>

                      {/* Time travel effect */}
                      <AnimatePresence>
                        {isTimeTravel && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            exit={{ x: "200%" }}
                            transition={{ duration: 1, repeat: 4 }}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="markets" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {marketStates.slice(-8).map((state, index) => (
                    <motion.div
                      key={state.timestamp}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="text-center">
                              <div className="text-xs text-gray-400">
                                {new Date(state.timestamp).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">S&P 500</span>
                                <span className="text-white">
                                  {state.sp500.toFixed(0)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">NASDAQ</span>
                                <span className="text-white">
                                  {state.nasdaq.toFixed(0)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">VIX</span>
                                <span className="text-white">
                                  {state.vix.toFixed(1)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Sentiment</span>
                                <span
                                  className={`${state.sentiment >= 50 ? "text-green-400" : "text-red-400"}`}
                                >
                                  {state.sentiment.toFixed(0)}%
                                </span>
                              </div>
                            </div>

                            <Progress value={state.sentiment} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="predictions" className="space-y-4">
                <div className="text-center space-y-4">
                  <motion.div
                    className="text-2xl font-bold text-purple-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Temporal Prediction Engine
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {temporalDimensions.slice(2, 5).map((dimension, index) => (
                      <Card
                        key={dimension.name}
                        className="bg-slate-700/50 border-slate-600"
                      >
                        <CardContent className="p-4">
                          <h3 className="text-white font-medium mb-3">
                            {dimension.name}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">
                                Prediction Accuracy
                              </span>
                              <span className="text-white">
                                {dimension.accuracy.toFixed(1)}%
                              </span>
                            </div>
                            <Progress
                              value={dimension.accuracy}
                              className="h-2"
                            />
                            <div className="text-xs text-gray-400">
                              {dimension.timeframe} forecast
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dimensions" className="space-y-4">
                <div className="h-64 bg-slate-900/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-4">
                    Dimensional Analysis Matrix
                  </h3>
                  <div className="grid grid-cols-5 gap-2 h-48">
                    {temporalDimensions.map((dimension, dimIndex) => (
                      <div key={dimension.name} className="space-y-2">
                        <div className="text-xs text-gray-400 text-center">
                          {dimension.name}
                        </div>
                        <div className="space-y-1">
                          {Array.from({ length: 10 }).map((_, cellIndex) => (
                            <motion.div
                              key={cellIndex}
                              className="h-4 rounded"
                              style={{
                                backgroundColor: `rgba(139, 92, 246, ${
                                  (dimension.accuracy / 100) *
                                  (1 - cellIndex / 10)
                                })`,
                              }}
                              animate={{
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: dimIndex * 0.2 + cellIndex * 0.1,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
