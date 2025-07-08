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

interface Asset {
  symbol: string;
  allocation: number;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  correlation: number;
  x: number;
  y: number;
  z: number;
  w: number; // 4th dimension
}

interface OptimizationMetric {
  name: string;
  value: number;
  target: number;
  weight: number;
  dimension: number;
}

interface PortfolioSlice {
  id: string;
  assets: Asset[];
  return: number;
  risk: number;
  sharpe: number;
  dimension: string;
}

export function HyperDimensionalOptimizer() {
  const [activeView, setActiveView] = useState<
    "4d" | "slices" | "metrics" | "optimization"
  >("4d");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [optimizationMetrics, setOptimizationMetrics] = useState<
    OptimizationMetric[]
  >([]);
  const [portfolioSlices, setPortfolioSlices] = useState<PortfolioSlice[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [selectedDimension, setSelectedDimension] = useState(0);
  const [rotationAngles, setRotationAngles] = useState({ x: 0, y: 0, z: 0 });
  const [targetReturn, setTargetReturn] = useState([12]);
  const [riskTolerance, setRiskTolerance] = useState([15]);
  const visualizationRef = useRef<HTMLDivElement>(null);

  const generateAssets = (): Asset[] => {
    const symbols = [
      "AAPL",
      "MSFT",
      "AMZN",
      "GOOGL",
      "TSLA",
      "NVDA",
      "META",
      "BRK.A",
      "JPM",
      "JNJ",
      "V",
      "PG",
      "UNH",
      "HD",
      "MA",
      "BAC",
      "DIS",
      "ADBE",
      "CRM",
      "NFLX",
      "KO",
      "VZ",
      "PFE",
      "INTC",
    ];

    return symbols.map((symbol, index) => ({
      symbol,
      allocation: Math.random() * 10,
      expectedReturn: Math.random() * 20 + 5,
      volatility: Math.random() * 30 + 10,
      sharpeRatio: Math.random() * 2 + 0.5,
      correlation: Math.random() * 0.8 - 0.4,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 300,
      z: (Math.random() - 0.5) * 200,
      w: (Math.random() - 0.5) * 100,
    }));
  };

  const generateOptimizationMetrics = (): OptimizationMetric[] => {
    return [
      {
        name: "Expected Return",
        value: 14.2,
        target: targetReturn[0],
        weight: 0.3,
        dimension: 1,
      },
      {
        name: "Risk (Volatility)",
        value: 18.5,
        target: riskTolerance[0],
        weight: 0.25,
        dimension: 2,
      },
      {
        name: "Sharpe Ratio",
        value: 1.42,
        target: 1.5,
        weight: 0.2,
        dimension: 3,
      },
      {
        name: "Max Drawdown",
        value: 12.8,
        target: 10,
        weight: 0.15,
        dimension: 4,
      },
      {
        name: "Correlation",
        value: 0.65,
        target: 0.5,
        weight: 0.1,
        dimension: 1,
      },
      {
        name: "Liquidity Score",
        value: 8.7,
        target: 9,
        weight: 0.1,
        dimension: 2,
      },
    ];
  };

  const generatePortfolioSlices = (): PortfolioSlice[] => {
    const dimensions = [
      "Return-Risk",
      "Time-Sector",
      "Geographic-Currency",
      "ESG-Growth",
    ];

    return dimensions.map((dimension, index) => ({
      id: `slice-${index}`,
      assets: assets.slice(index * 6, (index + 1) * 6),
      return: Math.random() * 20 + 8,
      risk: Math.random() * 25 + 10,
      sharpe: Math.random() * 1.5 + 0.5,
      dimension,
    }));
  };

  useEffect(() => {
    const newAssets = generateAssets();
    setAssets(newAssets);
    setOptimizationMetrics(generateOptimizationMetrics());

    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((asset) => ({
          ...asset,
          allocation: Math.max(
            0,
            Math.min(15, asset.allocation + (Math.random() - 0.5) * 2),
          ),
          expectedReturn: Math.max(
            0,
            asset.expectedReturn + (Math.random() - 0.5) * 1,
          ),
          volatility: Math.max(5, asset.volatility + (Math.random() - 0.5) * 2),
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPortfolioSlices(generatePortfolioSlices());
  }, [assets]);

  useEffect(() => {
    setOptimizationMetrics(generateOptimizationMetrics());
  }, [targetReturn, riskTolerance]);

  const startOptimization = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    const interval = setInterval(() => {
      setOptimizationProgress((prev) => {
        if (prev >= 100) {
          setIsOptimizing(false);
          clearInterval(interval);
          // Redistribute allocations
          setAssets((prev) => {
            const total = prev.reduce(
              (sum, asset) => sum + asset.allocation,
              0,
            );
            return prev.map((asset) => ({
              ...asset,
              allocation: (asset.allocation / total) * 100,
            }));
          });
          return 100;
        }
        return prev + 1.5;
      });
    }, 50);
  };

  const getAssetColor = (asset: Asset) => {
    const efficiency = asset.sharpeRatio;
    if (efficiency > 1.5) return "#10B981"; // Green
    if (efficiency > 1) return "#F59E0B"; // Yellow
    if (efficiency > 0.5) return "#F97316"; // Orange
    return "#EF4444"; // Red
  };

  const getMetricStatus = (metric: OptimizationMetric) => {
    const diff = Math.abs(metric.value - metric.target);
    const threshold = metric.target * 0.1;
    if (diff <= threshold) return "optimal";
    if (diff <= threshold * 2) return "good";
    return "needs-improvement";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-600";
      case "good":
        return "bg-yellow-600";
      default:
        return "bg-red-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Hyper-Dimensional Portfolio Optimizer
          </h1>
          <p className="text-xl text-gray-300">
            Multi-dimensional portfolio optimization across infinite parameter
            spaces
          </p>
        </motion.div>

        {/* Optimization Controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                <label className="text-sm text-gray-300">
                  Target Return (%)
                </label>
                <Slider
                  value={targetReturn}
                  onValueChange={setTargetReturn}
                  max={25}
                  min={5}
                  step={0.5}
                  className="w-full"
                />
                <div className="text-center text-white font-medium">
                  {targetReturn[0]}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                <label className="text-sm text-gray-300">
                  Risk Tolerance (%)
                </label>
                <Slider
                  value={riskTolerance}
                  onValueChange={setRiskTolerance}
                  max={30}
                  min={5}
                  step={0.5}
                  className="w-full"
                />
                <div className="text-center text-white font-medium">
                  {riskTolerance[0]}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                <label className="text-sm text-gray-300">View Dimension</label>
                <Slider
                  value={[selectedDimension]}
                  onValueChange={(value) => setSelectedDimension(value[0])}
                  max={3}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="text-center text-white font-medium text-xs">
                  {["X-Y", "Y-Z", "Z-W", "X-W"][selectedDimension]}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <Button
                onClick={startOptimization}
                disabled={isOptimizing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isOptimizing
                  ? `Optimizing... ${optimizationProgress.toFixed(0)}%`
                  : "Optimize Portfolio"}
              </Button>
              {isOptimizing && (
                <Progress value={optimizationProgress} className="h-2 mt-2" />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Optimization Metrics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {optimizationMetrics.map((metric, index) => (
            <Card
              key={metric.name}
              className="bg-slate-800/50 border-slate-700"
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{metric.name}</span>
                    <Badge className={getStatusColor(getMetricStatus(metric))}>
                      D{metric.dimension}
                    </Badge>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {metric.value.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400">
                    Target: {metric.target.toFixed(1)}
                  </div>
                  <Progress
                    value={(metric.value / metric.target) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Visualization */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">
                  Hyper-Dimensional Visualization
                </CardTitle>
                <CardDescription>
                  Portfolio optimization across 4D parameter space
                </CardDescription>
              </div>
              <Tabs
                value={activeView}
                onValueChange={(value) => setActiveView(value as any)}
              >
                <TabsList className="bg-slate-700">
                  <TabsTrigger value="4d">4D Space</TabsTrigger>
                  <TabsTrigger value="slices">Slices</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="optimization">Optimization</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-slate-900/50 rounded-lg overflow-hidden">
              <div
                ref={visualizationRef}
                className="relative w-full h-full"
                style={{ perspective: "1000px" }}
              >
                {activeView === "4d" && (
                  <motion.div
                    className="relative w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{
                      rotateX: rotationAngles.x,
                      rotateY: rotationAngles.y + (isOptimizing ? 360 : 0),
                      rotateZ: rotationAngles.z,
                    }}
                    transition={{
                      duration: isOptimizing ? 10 : 0,
                      ease: "linear",
                    }}
                  >
                    {/* 4D Grid */}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={`grid-x-${i}`}
                        className="absolute border-purple-500/20"
                        style={{
                          left: `${i * 10}%`,
                          top: 0,
                          width: "1px",
                          height: "100%",
                          borderLeft: "1px solid",
                          transform: `rotateY(${i * 36}deg) translateZ(${i * 20}px)`,
                        }}
                      />
                    ))}

                    {/* Assets in 4D space */}
                    {assets.map((asset, index) => {
                      const getDimensionPosition = (dim: number) => {
                        switch (dim) {
                          case 0:
                            return { x: asset.x, y: asset.y };
                          case 1:
                            return { x: asset.y, y: asset.z };
                          case 2:
                            return { x: asset.z, y: asset.w };
                          case 3:
                            return { x: asset.x, y: asset.w };
                          default:
                            return { x: asset.x, y: asset.y };
                        }
                      };

                      const pos = getDimensionPosition(selectedDimension);

                      return (
                        <motion.div
                          key={asset.symbol}
                          className="absolute rounded-full cursor-pointer"
                          style={{
                            left: `${50 + pos.x / 8}%`,
                            top: `${50 + pos.y / 6}%`,
                            width: 8 + asset.allocation * 2,
                            height: 8 + asset.allocation * 2,
                            backgroundColor: getAssetColor(asset),
                            transform: `translateZ(${asset.z / 2}px) rotateY(${asset.w}deg)`,
                            boxShadow: `0 0 ${asset.allocation}px ${getAssetColor(asset)}`,
                          }}
                          initial={{ scale: 0 }}
                          animate={{
                            scale: 1,
                            opacity: 0.7 + asset.allocation / 20,
                          }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.5, zIndex: 10 }}
                          title={`${asset.symbol}: ${asset.allocation.toFixed(1)}%`}
                        />
                      );
                    })}

                    {/* Dimensional axes labels */}
                    <div className="absolute top-4 left-4 text-purple-300 text-sm">
                      Dimension:{" "}
                      {
                        [
                          "X-Y (Return-Risk)",
                          "Y-Z (Risk-Time)",
                          "Z-W (Time-Sector)",
                          "X-W (Return-Sector)",
                        ][selectedDimension]
                      }
                    </div>
                  </motion.div>
                )}

                {activeView === "slices" && (
                  <div className="grid grid-cols-2 gap-4 p-4 h-full">
                    {portfolioSlices.map((slice, index) => (
                      <motion.div
                        key={slice.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800/50 rounded-lg p-4 space-y-3"
                      >
                        <h3 className="text-white font-medium">
                          {slice.dimension}
                        </h3>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Return</span>
                            <div className="text-green-400 font-medium">
                              {slice.return.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Risk</span>
                            <div className="text-red-400 font-medium">
                              {slice.risk.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Sharpe</span>
                            <div className="text-blue-400 font-medium">
                              {slice.sharpe.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {slice.assets.map((asset) => (
                            <div
                              key={asset.symbol}
                              className="px-2 py-1 text-xs rounded"
                              style={{ backgroundColor: getAssetColor(asset) }}
                            >
                              {asset.symbol}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeView === "metrics" && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {optimizationMetrics.map((metric, index) => (
                        <motion.div
                          key={metric.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-slate-800/50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">
                              {metric.name}
                            </span>
                            <Badge>Dimension {metric.dimension}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Current</span>
                              <span className="text-white">
                                {metric.value.toFixed(1)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Target</span>
                              <span className="text-white">
                                {metric.target.toFixed(1)}
                              </span>
                            </div>
                            <Progress
                              value={(metric.value / metric.target) * 100}
                              className="h-2"
                            />
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Weight</span>
                              <span className="text-white">
                                {(metric.weight * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeView === "optimization" && (
                  <div className="p-4 space-y-4">
                    <div className="text-center space-y-4">
                      <h3 className="text-2xl font-bold text-white">
                        Portfolio Optimization Status
                      </h3>

                      {isOptimizing ? (
                        <motion.div
                          className="space-y-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="text-purple-400 text-lg">
                            Optimizing across {assets.length} assets in 4D
                            space...
                          </div>
                          <Progress
                            value={optimizationProgress}
                            className="w-64 mx-auto"
                          />
                          <div className="text-sm text-gray-400">
                            {optimizationProgress.toFixed(1)}% Complete
                          </div>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-green-400 text-lg">
                            Portfolio optimized successfully!
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-slate-700/50 border-slate-600">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-400">
                                  {optimizationMetrics[0]?.value.toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-400">
                                  Expected Return
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-slate-700/50 border-slate-600">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-400">
                                  {optimizationMetrics[1]?.value.toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-400">
                                  Portfolio Risk
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-slate-700/50 border-slate-600">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-400">
                                  {optimizationMetrics[2]?.value.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-400">
                                  Sharpe Ratio
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Holdings */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Optimized Portfolio Allocations
            </CardTitle>
            <CardDescription>
              Top holdings after hyper-dimensional optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {assets
                .sort((a, b) => b.allocation - a.allocation)
                .slice(0, 8)
                .map((asset, index) => (
                  <motion.div
                    key={asset.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-700/50 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        {asset.symbol}
                      </span>
                      <Badge style={{ backgroundColor: getAssetColor(asset) }}>
                        {asset.allocation.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Return</span>
                        <span className="text-white">
                          {asset.expectedReturn.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk</span>
                        <span className="text-white">
                          {asset.volatility.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sharpe</span>
                        <span className="text-white">
                          {asset.sharpeRatio.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={asset.allocation * 10}
                      className="h-2 mt-2"
                    />
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
