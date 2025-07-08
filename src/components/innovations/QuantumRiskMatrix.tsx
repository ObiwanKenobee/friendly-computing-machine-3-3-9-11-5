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

interface RiskNode {
  id: string;
  name: string;
  riskLevel: number;
  category: string;
  impact: number;
  probability: number;
  x: number;
  y: number;
  z: number;
  connections: string[];
}

interface QuantumMetric {
  name: string;
  value: number;
  change: number;
  risk: "low" | "medium" | "high" | "critical";
}

export function QuantumRiskMatrix() {
  const [activeView, setActiveView] = useState<"3d" | "network" | "temporal">(
    "3d",
  );
  const [selectedNode, setSelectedNode] = useState<RiskNode | null>(null);
  const [quantumMetrics, setQuantumMetrics] = useState<QuantumMetric[]>([]);
  const [riskNodes, setRiskNodes] = useState<RiskNode[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const matrixRef = useRef<HTMLDivElement>(null);

  const generateRiskNodes = (): RiskNode[] => {
    const categories = [
      "Market",
      "Credit",
      "Operational",
      "Liquidity",
      "Technology",
      "Regulatory",
    ];
    const nodes: RiskNode[] = [];

    for (let i = 0; i < 50; i++) {
      nodes.push({
        id: `node-${i}`,
        name: `Risk Factor ${i + 1}`,
        riskLevel: Math.random() * 100,
        category: categories[Math.floor(Math.random() * categories.length)],
        impact: Math.random() * 10,
        probability: Math.random() * 100,
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 400,
        connections: [],
      });
    }

    // Create connections
    nodes.forEach((node) => {
      const numConnections = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < numConnections; i++) {
        const targetIndex = Math.floor(Math.random() * nodes.length);
        if (targetIndex !== nodes.indexOf(node)) {
          node.connections.push(nodes[targetIndex].id);
        }
      }
    });

    return nodes;
  };

  const generateQuantumMetrics = (): QuantumMetric[] => {
    return [
      {
        name: "Quantum Coherence",
        value: Math.random() * 100,
        change: (Math.random() - 0.5) * 20,
        risk: "low",
      },
      {
        name: "Entanglement Stability",
        value: Math.random() * 100,
        change: (Math.random() - 0.5) * 20,
        risk: "medium",
      },
      {
        name: "Superposition Risk",
        value: Math.random() * 100,
        change: (Math.random() - 0.5) * 20,
        risk: "high",
      },
      {
        name: "Decoherence Rate",
        value: Math.random() * 100,
        change: (Math.random() - 0.5) * 20,
        risk: "critical",
      },
      {
        name: "Quantum Volume",
        value: Math.random() * 100,
        change: (Math.random() - 0.5) * 20,
        risk: "low",
      },
      {
        name: "Error Correction",
        value: Math.random() * 100,
        change: (Math.random() - 0.5) * 20,
        risk: "medium",
      },
    ];
  };

  useEffect(() => {
    setRiskNodes(generateRiskNodes());
    setQuantumMetrics(generateQuantumMetrics());

    const interval = setInterval(() => {
      setQuantumMetrics(generateQuantumMetrics());
      setRiskNodes((prev) =>
        prev.map((node) => ({
          ...node,
          riskLevel: Math.max(
            0,
            Math.min(100, node.riskLevel + (Math.random() - 0.5) * 10),
          ),
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const startQuantumScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 5000);
  };

  const getRiskColor = (level: number) => {
    if (level < 25) return "#10B981"; // Green
    if (level < 50) return "#F59E0B"; // Yellow
    if (level < 75) return "#F97316"; // Orange
    return "#EF4444"; // Red
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "low":
        return "secondary";
      case "medium":
        return "default";
      case "high":
        return "destructive";
      case "critical":
        return "destructive";
      default:
        return "default";
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Quantum Risk Assessment Matrix
          </h1>
          <p className="text-xl text-gray-300">
            Multi-dimensional risk analysis powered by quantum computing
            algorithms
          </p>
        </motion.div>

        {/* Quantum Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {quantumMetrics.map((metric, index) => (
            <Card
              key={metric.name}
              className="bg-slate-800/50 border-slate-700"
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{metric.name}</span>
                    <Badge variant={getRiskBadgeVariant(metric.risk)}>
                      {metric.risk}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {metric.value.toFixed(1)}%
                  </div>
                  <div
                    className={`text-sm ${metric.change >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {metric.change >= 0 ? "+" : ""}
                    {metric.change.toFixed(1)}%
                  </div>
                  <Progress value={metric.value} className="h-2" />
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
                  3D Risk Visualization Matrix
                </CardTitle>
                <CardDescription>
                  Real-time quantum risk assessment with dimensional analysis
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={startQuantumScan}
                  disabled={isScanning}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isScanning ? "Scanning..." : "Quantum Scan"}
                </Button>
                <Tabs
                  value={activeView}
                  onValueChange={(value) => setActiveView(value as any)}
                >
                  <TabsList className="bg-slate-700">
                    <TabsTrigger value="3d">3D Matrix</TabsTrigger>
                    <TabsTrigger value="network">Network</TabsTrigger>
                    <TabsTrigger value="temporal">Temporal</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 bg-slate-900/50 rounded-lg overflow-hidden">
              <div
                ref={matrixRef}
                className="absolute inset-0 perspective-1000"
                style={{ perspective: "1000px" }}
              >
                {activeView === "3d" && (
                  <motion.div
                    className="relative w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: isScanning ? 360 : 0 }}
                    transition={{
                      duration: isScanning ? 5 : 0,
                      ease: "linear",
                    }}
                  >
                    {riskNodes.map((node, index) => (
                      <motion.div
                        key={node.id}
                        className="absolute w-3 h-3 rounded-full cursor-pointer"
                        style={{
                          backgroundColor: getRiskColor(node.riskLevel),
                          left: `${50 + node.x / 16}%`,
                          top: `${50 + node.y / 12}%`,
                          transform: `translateZ(${node.z / 4}px)`,
                          boxShadow: `0 0 ${node.riskLevel / 10}px ${getRiskColor(node.riskLevel)}`,
                        }}
                        initial={{ scale: 0 }}
                        animate={{
                          scale: 1,
                          opacity: 0.7 + (node.riskLevel / 100) * 0.3,
                        }}
                        transition={{ delay: index * 0.02 }}
                        whileHover={{ scale: 1.5, opacity: 1 }}
                        onClick={() => setSelectedNode(node)}
                      />
                    ))}

                    {/* Grid Lines */}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={`grid-${i}`}
                        className="absolute border-slate-600/30"
                        style={{
                          left: `${i * 10}%`,
                          top: 0,
                          width: "1px",
                          height: "100%",
                          borderLeft: "1px solid",
                        }}
                      />
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={`grid-h-${i}`}
                        className="absolute border-slate-600/30"
                        style={{
                          top: `${i * 12.5}%`,
                          left: 0,
                          height: "1px",
                          width: "100%",
                          borderTop: "1px solid",
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {activeView === "network" && (
                  <div className="relative w-full h-full bg-slate-900/50">
                    <svg className="w-full h-full">
                      {riskNodes.map((node) =>
                        node.connections.map((connectionId) => {
                          const targetNode = riskNodes.find(
                            (n) => n.id === connectionId,
                          );
                          if (!targetNode) return null;

                          return (
                            <motion.line
                              key={`${node.id}-${connectionId}`}
                              x1={`${50 + node.x / 16}%`}
                              y1={`${50 + node.y / 12}%`}
                              x2={`${50 + targetNode.x / 16}%`}
                              y2={`${50 + targetNode.y / 12}%`}
                              stroke="rgba(139, 92, 246, 0.3)"
                              strokeWidth="1"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 2, delay: Math.random() }}
                            />
                          );
                        }),
                      )}
                    </svg>
                    {riskNodes.map((node, index) => (
                      <motion.div
                        key={node.id}
                        className="absolute w-4 h-4 rounded-full cursor-pointer border-2 border-white/20"
                        style={{
                          backgroundColor: getRiskColor(node.riskLevel),
                          left: `${50 + node.x / 16}%`,
                          top: `${50 + node.y / 12}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.5 }}
                        onClick={() => setSelectedNode(node)}
                      />
                    ))}
                  </div>
                )}

                {activeView === "temporal" && (
                  <div className="w-full h-full bg-slate-900/50 p-4">
                    <div className="grid grid-cols-6 gap-4 h-full">
                      {[
                        "Market",
                        "Credit",
                        "Operational",
                        "Liquidity",
                        "Technology",
                        "Regulatory",
                      ].map((category, index) => (
                        <div key={category} className="space-y-2">
                          <h4 className="text-sm font-medium text-white">
                            {category}
                          </h4>
                          <div className="space-y-1">
                            {riskNodes
                              .filter((node) => node.category === category)
                              .slice(0, 8)
                              .map((node, nodeIndex) => (
                                <motion.div
                                  key={node.id}
                                  className="h-6 rounded cursor-pointer"
                                  style={{
                                    backgroundColor: getRiskColor(
                                      node.riskLevel,
                                    ),
                                  }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${node.riskLevel}%` }}
                                  transition={{
                                    delay: index * 0.1 + nodeIndex * 0.05,
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  onClick={() => setSelectedNode(node)}
                                />
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scanning Effect */}
                <AnimatePresence>
                  {isScanning && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      exit={{ x: "200%" }}
                      transition={{ duration: 2, repeat: 2 }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Node Details */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-6 right-6 w-80"
            >
              <Card className="bg-slate-800/95 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">
                      {selectedNode.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedNode(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </Button>
                  </div>
                  <CardDescription>Risk Factor Analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-400">Category</span>
                      <div className="text-white font-medium">
                        {selectedNode.category}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Risk Level</span>
                      <div className="text-white font-medium">
                        {selectedNode.riskLevel.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Impact</span>
                      <div className="text-white font-medium">
                        {selectedNode.impact.toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Probability</span>
                      <div className="text-white font-medium">
                        {selectedNode.probability.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Connections</span>
                    <div className="text-white font-medium">
                      {selectedNode.connections.length} linked factors
                    </div>
                  </div>
                  <Progress value={selectedNode.riskLevel} className="h-2" />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
