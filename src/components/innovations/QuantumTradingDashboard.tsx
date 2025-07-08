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

interface QuantumAlgorithm {
  id: string;
  name: string;
  type:
    | "momentum"
    | "mean-reversion"
    | "arbitrage"
    | "ml-prediction"
    | "quantum-optimization";
  status: "active" | "paused" | "optimizing" | "error";
  performance: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  winRate: number;
  pnl: number;
  quantumCoherence: number;
  entanglementScore: number;
  superpositionStates: number;
}

interface QuantumParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  algorithm: string;
}

interface MarketOrder {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  algorithm: string;
  timestamp: number;
  status: "pending" | "filled" | "cancelled";
}

export function QuantumTradingDashboard() {
  const [activeTab, setActiveTab] = useState<
    "algorithms" | "particles" | "orders" | "quantum"
  >("algorithms");
  const [algorithms, setAlgorithms] = useState<QuantumAlgorithm[]>([]);
  const [particles, setParticles] = useState<QuantumParticle[]>([]);
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(
    null,
  );
  const [quantumField, setQuantumField] = useState(false);
  const [marketVolatility, setMarketVolatility] = useState(15.5);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const generateAlgorithms = (): QuantumAlgorithm[] => {
    const algorithmNames = [
      "Quantum Momentum Alpha",
      "Entangled Mean Reversion",
      "Superposition Arbitrage",
      "Neural Quantum ML",
      "Coherence Optimization",
      "Quantum Grid Strategy",
      "Decoherence Protection",
      "Tunneling Effect Capture",
    ];

    const types: QuantumAlgorithm["type"][] = [
      "momentum",
      "mean-reversion",
      "arbitrage",
      "ml-prediction",
      "quantum-optimization",
    ];

    const statuses: QuantumAlgorithm["status"][] = [
      "active",
      "paused",
      "optimizing",
      "error",
    ];

    return algorithmNames.map((name, index) => ({
      id: `algo-${index}`,
      name,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      performance: (Math.random() - 0.3) * 50,
      sharpeRatio: Math.random() * 3 + 0.5,
      maxDrawdown: Math.random() * 25 + 5,
      totalTrades: Math.floor(Math.random() * 10000) + 1000,
      winRate: Math.random() * 40 + 50,
      pnl: (Math.random() - 0.3) * 1000000,
      quantumCoherence: Math.random() * 100,
      entanglementScore: Math.random() * 10,
      superpositionStates: Math.floor(Math.random() * 16) + 2,
    }));
  };

  const generateParticles = (count: number): QuantumParticle[] => {
    const colors = [
      "#8B5CF6",
      "#06B6D4",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#EC4899",
    ];
    const newParticles: QuantumParticle[] = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x: Math.random() * 800,
        y: Math.random() * 400,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 255,
        maxLife: 255,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 3 + 1,
        algorithm:
          algorithms[Math.floor(Math.random() * algorithms.length)]?.id ||
          "unknown",
      });
    }

    return newParticles;
  };

  const generateOrders = (): MarketOrder[] => {
    const symbols = [
      "AAPL",
      "TSLA",
      "AMZN",
      "GOOGL",
      "MSFT",
      "NVDA",
      "META",
      "NFLX",
    ];
    const sides = ["buy", "sell"] as const;
    const statuses = ["pending", "filled", "cancelled"] as const;

    return Array.from({ length: 20 }, (_, index) => ({
      id: `order-${index}`,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      side: sides[Math.floor(Math.random() * sides.length)],
      quantity: Math.floor(Math.random() * 1000) + 100,
      price: Math.random() * 500 + 50,
      algorithm:
        algorithms[Math.floor(Math.random() * algorithms.length)]?.id ||
        "unknown",
      timestamp: Date.now() - Math.random() * 3600000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    }));
  };

  useEffect(() => {
    const newAlgorithms = generateAlgorithms();
    setAlgorithms(newAlgorithms);
    setParticles(generateParticles(100));
    setOrders(generateOrders());

    const interval = setInterval(() => {
      setAlgorithms((prev) =>
        prev.map((algo) => ({
          ...algo,
          performance: algo.performance + (Math.random() - 0.5) * 2,
          pnl: algo.pnl + (Math.random() - 0.5) * 10000,
          quantumCoherence: Math.max(
            0,
            Math.min(100, algo.quantumCoherence + (Math.random() - 0.5) * 5),
          ),
          entanglementScore: Math.max(
            0,
            Math.min(10, algo.entanglementScore + (Math.random() - 0.5) * 0.5),
          ),
        })),
      );

      setMarketVolatility((prev) =>
        Math.max(5, Math.min(50, prev + (Math.random() - 0.5) * 3)),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const animateParticles = () => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw quantum field background
    if (quantumField) {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        200,
      );
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.1)");
      gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Update and draw particles
    setParticles((prev) => {
      const updatedParticles = prev
        .map((particle) => {
          const newParticle = { ...particle };

          // Update position
          newParticle.x += newParticle.vx;
          newParticle.y += newParticle.vy;

          // Bounce off walls
          if (newParticle.x <= 0 || newParticle.x >= canvas.width) {
            newParticle.vx *= -1;
          }
          if (newParticle.y <= 0 || newParticle.y >= canvas.height) {
            newParticle.vy *= -1;
          }

          // Update life
          newParticle.life -= 1;

          // Draw particle
          const alpha = newParticle.life / newParticle.maxLife;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = newParticle.color;
          ctx.beginPath();
          ctx.arc(
            newParticle.x,
            newParticle.y,
            newParticle.size,
            0,
            Math.PI * 2,
          );
          ctx.fill();

          // Draw quantum trails
          if (quantumField) {
            ctx.strokeStyle = newParticle.color;
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = alpha * 0.3;
            ctx.beginPath();
            ctx.moveTo(newParticle.x, newParticle.y);
            ctx.lineTo(
              newParticle.x - newParticle.vx * 5,
              newParticle.y - newParticle.vy * 5,
            );
            ctx.stroke();
          }

          return newParticle;
        })
        .filter((particle) => particle.life > 0);

      // Add new particles
      if (updatedParticles.length < 100) {
        updatedParticles.push(...generateParticles(10));
      }

      return updatedParticles;
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animateParticles);
  };

  useEffect(() => {
    animateParticles();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [quantumField]);

  const getAlgorithmStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600";
      case "paused":
        return "bg-yellow-600";
      case "optimizing":
        return "bg-blue-600";
      case "error":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getAlgorithmTypeIcon = (type: string) => {
    switch (type) {
      case "momentum":
        return "📈";
      case "mean-reversion":
        return "🔄";
      case "arbitrage":
        return "⚖️";
      case "ml-prediction":
        return "🧠";
      case "quantum-optimization":
        return "⚛️";
      default:
        return "🔹";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Quantum Trading Algorithms
          </h1>
          <p className="text-xl text-gray-300">
            Advanced algorithmic trading powered by quantum computing principles
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Badge className="bg-blue-600 text-white">
              Market Volatility: {marketVolatility.toFixed(1)}%
            </Badge>
            <Badge className="bg-green-600 text-white">
              Active Algorithms:{" "}
              {algorithms.filter((a) => a.status === "active").length}
            </Badge>
            <Badge className="bg-purple-600 text-white">
              Quantum Particles: {particles.length}
            </Badge>
          </div>
        </motion.div>

        {/* Quantum Controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center space-x-4"
        >
          <Button
            onClick={() => setQuantumField(!quantumField)}
            className={`${quantumField ? "bg-purple-600" : "bg-slate-600"} hover:bg-purple-700`}
          >
            {quantumField ? "Disable" : "Enable"} Quantum Field
          </Button>
          <Button
            onClick={() => setParticles(generateParticles(200))}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            Regenerate Particles
          </Button>
        </motion.div>

        {/* Algorithm Performance Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(
                    algorithms.reduce((sum, algo) => sum + algo.pnl, 0),
                  )}
                </div>
                <div className="text-sm text-gray-400">Total PnL</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-400">
                  {(
                    algorithms.reduce(
                      (sum, algo) => sum + algo.sharpeRatio,
                      0,
                    ) / algorithms.length
                  ).toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">Avg Sharpe Ratio</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-purple-400">
                  {algorithms
                    .reduce((sum, algo) => sum + algo.totalTrades, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Trades</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-cyan-400">
                  {(
                    algorithms.reduce(
                      (sum, algo) => sum + algo.quantumCoherence,
                      0,
                    ) / algorithms.length
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-sm text-gray-400">Quantum Coherence</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Interface */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">
                  Quantum Trading Interface
                </CardTitle>
                <CardDescription>
                  Real-time algorithm monitoring and particle visualization
                </CardDescription>
              </div>
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as any)}
              >
                <TabsList className="bg-slate-700">
                  <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
                  <TabsTrigger value="particles">Particles</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="quantum">Quantum</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="algorithms" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {algorithms.map((algorithm, index) => (
                  <motion.div
                    key={algorithm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedAlgorithm(algorithm.id)}
                    className={`cursor-pointer ${selectedAlgorithm === algorithm.id ? "ring-2 ring-purple-500" : ""}`}
                  >
                    <Card className="bg-slate-700/50 border-slate-600 hover:border-slate-500 transition-colors">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {getAlgorithmTypeIcon(algorithm.type)}
                              </span>
                              <h3 className="text-white font-medium">
                                {algorithm.name}
                              </h3>
                            </div>
                            <Badge
                              className={getAlgorithmStatusColor(
                                algorithm.status,
                              )}
                            >
                              {algorithm.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-gray-400">Performance</span>
                              <div
                                className={`font-medium ${algorithm.performance >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {algorithm.performance >= 0 ? "+" : ""}
                                {algorithm.performance.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Sharpe</span>
                              <div className="text-white font-medium">
                                {algorithm.sharpeRatio.toFixed(2)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Win Rate</span>
                              <div className="text-white font-medium">
                                {algorithm.winRate.toFixed(1)}%
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-400">PnL</span>
                              <div
                                className={`font-medium ${algorithm.pnl >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {formatCurrency(algorithm.pnl)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Trades</span>
                              <div className="text-white font-medium">
                                {algorithm.totalTrades.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">
                                Quantum Coherence
                              </span>
                              <span className="text-purple-400">
                                {algorithm.quantumCoherence.toFixed(1)}%
                              </span>
                            </div>
                            <Progress
                              value={algorithm.quantumCoherence}
                              className="h-2"
                            />
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              Entanglement:{" "}
                              {algorithm.entanglementScore.toFixed(1)}
                            </span>
                            <span className="text-gray-400">
                              States: {algorithm.superpositionStates}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="particles" className="mt-0">
              <div className="relative h-96 bg-slate-900/50 rounded-lg overflow-hidden">
                <canvas
                  ref={particleCanvasRef}
                  width={800}
                  height={400}
                  className="w-full h-full"
                />
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="text-purple-300 text-sm">
                    Quantum Particle Simulation
                  </div>
                  <div className="text-gray-400 text-xs">
                    Particles: {particles.length} | Field:{" "}
                    {quantumField ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.slice(0, 12).map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">
                                {order.symbol}
                              </span>
                              <Badge
                                variant={
                                  order.side === "buy"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {order.side.toUpperCase()}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-400">Qty</span>
                                <div className="text-white">
                                  {order.quantity.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Price</span>
                                <div className="text-white">
                                  ${order.price.toFixed(2)}
                                </div>
                              </div>
                            </div>

                            <div className="text-xs text-gray-400">
                              {new Date(order.timestamp).toLocaleTimeString()}
                            </div>

                            <Badge
                              className={
                                order.status === "filled"
                                  ? "bg-green-600"
                                  : order.status === "pending"
                                    ? "bg-yellow-600"
                                    : "bg-red-600"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quantum" className="mt-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <h3 className="text-white font-medium mb-3">
                        Quantum Coherence Matrix
                      </h3>
                      <div className="grid grid-cols-4 gap-1">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-6 h-6 rounded-sm"
                            style={{
                              backgroundColor: `rgba(139, 92, 246, ${algorithms[i % algorithms.length]?.quantumCoherence / 100 || 0.3})`,
                            }}
                            animate={{
                              opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                              duration: 2,
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
                      <h3 className="text-white font-medium mb-3">
                        Entanglement Network
                      </h3>
                      <div className="relative h-32">
                        <svg className="w-full h-full">
                          {algorithms
                            .slice(0, 6)
                            .map((algo, i) =>
                              algorithms
                                .slice(i + 1, 6)
                                .map((targetAlgo, j) => (
                                  <motion.line
                                    key={`${algo.id}-${targetAlgo.id}`}
                                    x1={`${20 + i * 15}%`}
                                    y1={`${20 + i * 15}%`}
                                    x2={`${20 + (i + j + 1) * 15}%`}
                                    y2={`${20 + (i + j + 1) * 15}%`}
                                    stroke="rgba(139, 92, 246, 0.5)"
                                    strokeWidth="1"
                                    initial={{ pathLength: 0 }}
                                    animate={{
                                      pathLength: algo.entanglementScore / 10,
                                    }}
                                    transition={{ duration: 2 }}
                                  />
                                )),
                            )}

                          {algorithms.slice(0, 6).map((algo, i) => (
                            <circle
                              key={algo.id}
                              cx={`${20 + i * 15}%`}
                              cy={`${20 + i * 15}%`}
                              r="3"
                              fill="#8B5CF6"
                            />
                          ))}
                        </svg>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <h3 className="text-white font-medium mb-3">
                        Superposition States
                      </h3>
                      <div className="space-y-2">
                        {algorithms.slice(0, 5).map((algo) => (
                          <div
                            key={algo.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-400">
                              {algo.name.split(" ")[0]}
                            </span>
                            <div className="flex space-x-1">
                              {Array.from({
                                length: algo.superpositionStates,
                              }).map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 h-2 bg-purple-400 rounded-full"
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5],
                                  }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quantum Field Visualization */}
                <div className="h-48 bg-slate-900/50 rounded-lg p-4 relative overflow-hidden">
                  <h3 className="text-white font-medium mb-4">
                    Quantum Field Dynamics
                  </h3>
                  <div className="absolute inset-4">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-purple-400 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          x: [0, Math.random() * 100 - 50, 0],
                          y: [0, Math.random() * 100 - 50, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
