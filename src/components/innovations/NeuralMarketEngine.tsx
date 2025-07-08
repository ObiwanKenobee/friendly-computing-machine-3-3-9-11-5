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

interface Neuron {
  id: string;
  x: number;
  y: number;
  activation: number;
  layer: number;
  type: "input" | "hidden" | "output";
  connections: string[];
}

interface MarketPrediction {
  symbol: string;
  current: number;
  predicted: number;
  confidence: number;
  trend: "bullish" | "bearish" | "neutral";
  timeframe: string;
  factors: string[];
}

interface NeuralLayer {
  name: string;
  neurons: number;
  activation: number;
  type: "input" | "hidden" | "output";
}

export function NeuralMarketEngine() {
  const [activeTab, setActiveTab] = useState<
    "network" | "predictions" | "training"
  >("network");
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [predictions, setPredictions] = useState<MarketPrediction[]>([]);
  const [neuralLayers, setNeuralLayers] = useState<NeuralLayer[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [networkAccuracy, setNetworkAccuracy] = useState(94.7);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateNeuralNetwork = (): Neuron[] => {
    const layers = [
      { name: "Input", count: 12, type: "input" as const },
      { name: "Hidden 1", count: 24, type: "hidden" as const },
      { name: "Hidden 2", count: 18, type: "hidden" as const },
      { name: "Hidden 3", count: 12, type: "hidden" as const },
      { name: "Output", count: 6, type: "output" as const },
    ];

    const neurons: Neuron[] = [];
    let neuronId = 0;

    layers.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.count; i++) {
        neurons.push({
          id: `neuron-${neuronId++}`,
          x: layerIndex * 150 + 50,
          y: (i - layer.count / 2) * 30 + 200,
          activation: Math.random(),
          layer: layerIndex,
          type: layer.type,
          connections: [],
        });
      }
    });

    // Create connections between layers
    neurons.forEach((neuron, index) => {
      if (neuron.layer < layers.length - 1) {
        const nextLayerNeurons = neurons.filter(
          (n) => n.layer === neuron.layer + 1,
        );
        neuron.connections = nextLayerNeurons.map((n) => n.id);
      }
    });

    return neurons;
  };

  const generatePredictions = (): MarketPrediction[] => {
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
    const trends = ["bullish", "bearish", "neutral"] as const;

    return symbols.map((symbol) => ({
      symbol,
      current: Math.random() * 1000 + 100,
      predicted: Math.random() * 1000 + 100,
      confidence: Math.random() * 40 + 60,
      trend: trends[Math.floor(Math.random() * trends.length)],
      timeframe: ["1H", "4H", "1D", "1W"][Math.floor(Math.random() * 4)],
      factors: [
        "Technical Indicators",
        "Market Sentiment",
        "Volume Analysis",
        "News Sentiment",
        "Options Flow",
        "Macro Economic Data",
      ].slice(0, Math.floor(Math.random() * 4) + 2),
    }));
  };

  const generateNeuralLayers = (): NeuralLayer[] => {
    return [
      { name: "Market Data Input", neurons: 12, activation: 85, type: "input" },
      {
        name: "Feature Extraction",
        neurons: 24,
        activation: 78,
        type: "hidden",
      },
      {
        name: "Pattern Recognition",
        neurons: 18,
        activation: 92,
        type: "hidden",
      },
      { name: "Prediction Layer", neurons: 12, activation: 88, type: "hidden" },
      {
        name: "Output Predictions",
        neurons: 6,
        activation: 94,
        type: "output",
      },
    ];
  };

  useEffect(() => {
    setNeurons(generateNeuralNetwork());
    setPredictions(generatePredictions());
    setNeuralLayers(generateNeuralLayers());

    const interval = setInterval(() => {
      setNeurons((prev) =>
        prev.map((neuron) => ({
          ...neuron,
          activation: Math.max(
            0,
            Math.min(1, neuron.activation + (Math.random() - 0.5) * 0.3),
          ),
        })),
      );
      setPredictions(generatePredictions());
      setNetworkAccuracy(Math.random() * 5 + 92);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);

    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          setIsTraining(false);
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const drawNeuralConnections = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    neurons.forEach((neuron) => {
      neuron.connections.forEach((connectionId) => {
        const targetNeuron = neurons.find((n) => n.id === connectionId);
        if (!targetNeuron) return;

        ctx.beginPath();
        ctx.moveTo(neuron.x, neuron.y);
        ctx.lineTo(targetNeuron.x, targetNeuron.y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${neuron.activation * 0.5})`;
        ctx.lineWidth = neuron.activation * 2;
        ctx.stroke();
      });
    });
  };

  useEffect(() => {
    drawNeuralConnections();
  }, [neurons]);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "bullish":
        return "text-green-400";
      case "bearish":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "bullish":
        return "↗";
      case "bearish":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Neural Market Prediction Engine
          </h1>
          <p className="text-xl text-gray-300">
            AI-powered market forecasting with deep neural network visualization
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Badge className="bg-green-600 text-white">
              Accuracy: {networkAccuracy.toFixed(1)}%
            </Badge>
            <Badge className="bg-blue-600 text-white">
              Processing: {neurons.length} Neurons
            </Badge>
            <Badge className="bg-purple-600 text-white">
              Predictions: {predictions.length} Assets
            </Badge>
          </div>
        </motion.div>

        {/* Neural Network Layers Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          {neuralLayers.map((layer, index) => (
            <Card key={layer.name} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white">
                      {layer.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {layer.neurons} neurons
                    </p>
                  </div>
                  <div className="relative">
                    <Progress value={layer.activation} className="h-3" />
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                      {layer.activation}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            layer.activation > (i + 1) * 10
                              ? "#8B5CF6"
                              : "#374151",
                        }}
                        animate={{
                          scale:
                            layer.activation > (i + 1) * 10 ? [1, 1.2, 1] : 1,
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
                  Neural Network Interface
                </CardTitle>
                <CardDescription>
                  Real-time market analysis and prediction engine
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={startTraining}
                  disabled={isTraining}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isTraining
                    ? `Training... ${trainingProgress}%`
                    : "Start Training"}
                </Button>
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as any)}
                >
                  <TabsList className="bg-slate-700">
                    <TabsTrigger value="network">Neural Network</TabsTrigger>
                    <TabsTrigger value="predictions">Predictions</TabsTrigger>
                    <TabsTrigger value="training">Training</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="network" className="mt-0">
              <div className="relative h-96 bg-slate-900/50 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={400}
                  className="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0">
                  {neurons.map((neuron, index) => (
                    <motion.div
                      key={neuron.id}
                      className="absolute rounded-full border-2 border-white/20"
                      style={{
                        left: neuron.x,
                        top: neuron.y,
                        width: 12 + neuron.activation * 8,
                        height: 12 + neuron.activation * 8,
                        backgroundColor: `rgba(139, 92, 246, ${neuron.activation})`,
                        boxShadow: `0 0 ${neuron.activation * 20}px rgba(139, 92, 246, 0.5)`,
                      }}
                      initial={{ scale: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 0.7 + neuron.activation * 0.3,
                      }}
                      transition={{ delay: index * 0.01 }}
                    />
                  ))}
                </div>

                {/* Training Progress Overlay */}
                <AnimatePresence>
                  {isTraining && (
                    <motion.div
                      className="absolute inset-0 bg-purple-500/20 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="text-center space-y-4">
                        <div className="text-2xl font-bold text-white">
                          Training Neural Network
                        </div>
                        <Progress value={trainingProgress} className="w-64" />
                        <div className="text-lg text-purple-300">
                          {trainingProgress.toFixed(0)}% Complete
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {predictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">
                              {prediction.symbol}
                            </h3>
                            <Badge className={getTrendColor(prediction.trend)}>
                              {getTrendIcon(prediction.trend)}{" "}
                              {prediction.trend}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-400">Current</span>
                              <div className="text-white font-medium">
                                ${prediction.current.toFixed(2)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Predicted</span>
                              <div className="text-white font-medium">
                                ${prediction.predicted.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Confidence</span>
                              <span className="text-white">
                                {prediction.confidence.toFixed(1)}%
                              </span>
                            </div>
                            <Progress
                              value={prediction.confidence}
                              className="h-2 mt-1"
                            />
                          </div>

                          <div>
                            <span className="text-xs text-gray-400">
                              Key Factors:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {prediction.factors.slice(0, 3).map((factor) => (
                                <Badge
                                  key={factor}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {factor}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="text-xs text-gray-400 text-center">
                            {prediction.timeframe} forecast
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="training" className="mt-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <h3 className="text-white font-medium mb-3">
                        Training Progress
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Epoch</span>
                          <span className="text-white">247/1000</span>
                        </div>
                        <Progress value={24.7} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Loss</span>
                          <span className="text-white">0.0234</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <h3 className="text-white font-medium mb-3">
                        Performance Metrics
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Accuracy</span>
                          <span className="text-white">
                            {networkAccuracy.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={networkAccuracy} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Precision</span>
                          <span className="text-white">91.2%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <h3 className="text-white font-medium mb-3">
                        Data Processing
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Samples/sec</span>
                          <span className="text-white">15,420</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Samples</span>
                          <span className="text-white">2.1M</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Training Visualization */}
                <div className="h-64 bg-slate-900/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-4">
                    Real-time Training Metrics
                  </h3>
                  <div className="h-48 relative">
                    <svg className="w-full h-full">
                      {/* Grid lines */}
                      {Array.from({ length: 10 }).map((_, i) => (
                        <line
                          key={i}
                          x1={`${i * 10}%`}
                          y1="0"
                          x2={`${i * 10}%`}
                          y2="100%"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="1"
                        />
                      ))}
                      {Array.from({ length: 6 }).map((_, i) => (
                        <line
                          key={i}
                          x1="0"
                          y1={`${i * 20}%`}
                          x2="100%"
                          y2={`${i * 20}%`}
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Training curve */}
                      <motion.path
                        d="M 0 80 Q 20 60 40 50 Q 60 40 80 35 Q 90 30 100 25"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </svg>

                    <div className="absolute top-2 right-2 text-xs text-gray-400">
                      Loss over time
                    </div>
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
