/**
 * Snake Xenzia Infrastructure Navigator
 * Game-inspired interface for managing QuantumVest infrastructure
 */

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Activity,
  Globe,
  Database,
  BarChart3,
  Settings,
  Target,
  Gamepad2,
  TrendingUp,
  MapPin,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { intelligentInfrastructure } from "../services/intelligentInfrastructureService";
import ServerlessInfrastructurePanel from "./ServerlessInfrastructurePanel";

interface SnakeInfrastructureNavigatorProps {
  className?: string;
}

export const SnakeInfrastructureNavigator: React.FC<
  SnakeInfrastructureNavigatorProps
> = ({ className = "" }) => {
  const [gameState, setGameState] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);
  const [optimizationEvents, setOptimizationEvents] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize and start the infrastructure service
    startInfrastructureNavigation();

    // Listen for optimization events
    const handleOptimization = (event: CustomEvent) => {
      setOptimizationEvents((prev) => [event.detail, ...prev.slice(0, 9)]);
    };

    window.addEventListener(
      "infrastructureOptimization",
      handleOptimization as EventListener,
    );

    return () => {
      stopInfrastructureNavigation();
      window.removeEventListener(
        "infrastructureOptimization",
        handleOptimization as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = window.setInterval(() => {
        updateGameState();
      }, 200);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (gameState && canvasRef.current) {
      drawInfrastructureGrid();
    }
  }, [gameState]);

  const startInfrastructureNavigation = () => {
    setIsPlaying(true);
    updateGameState();
  };

  const stopInfrastructureNavigation = () => {
    setIsPlaying(false);
    intelligentInfrastructure.stopNavigation();
  };

  const restartInfrastructureNavigation = () => {
    intelligentInfrastructure.restartNavigation();
    setOptimizationEvents([]);
    updateGameState();
    setIsPlaying(true);
  };

  const updateGameState = () => {
    const status = intelligentInfrastructure.getInfrastructureStatus();
    setGameState(status);
  };

  const drawInfrastructureGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = 20;
    canvas.width = gameState.gameGrid[0].length * cellSize;
    canvas.height = gameState.gameGrid.length * cellSize;

    // Clear canvas
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw regions (infrastructure nodes)
    gameState.regions.forEach((region: any) => {
      const x = region.location.x * cellSize;
      const y = region.location.y * cellSize;

      // Region status color
      ctx.fillStyle =
        region.status === "active"
          ? "#10b981"
          : region.status === "degraded"
            ? "#f59e0b"
            : "#ef4444";
      ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);

      // Region load indicator
      const loadHeight = (region.load / 100) * (cellSize - 4);
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(x + 2, y + cellSize - 2 - loadHeight, 4, loadHeight);

      // Region label
      ctx.fillStyle = "#ffffff";
      ctx.font = "8px monospace";
      ctx.fillText(region.id.slice(0, 3), x + 2, y + 10);
    });

    // Draw snake engines
    const engineColors = {
      "routing-engine": "#8b5cf6",
      "processing-engine": "#06b6d4",
      "storage-engine": "#84cc16",
      "analytics-engine": "#f97316",
    };

    gameState.engines.forEach((engine: any) => {
      const color =
        engineColors[engine.id as keyof typeof engineColors] || "#6b7280";

      engine.snake?.forEach((segment: any, index: number) => {
        if (!segment.position) return;

        const x = segment.position.x * cellSize;
        const y = segment.position.y * cellSize;

        // Draw snake segment
        ctx.fillStyle = index === 0 ? color : `${color}80`; // Head is brighter
        ctx.fillRect(x + 3, y + 3, cellSize - 6, cellSize - 6);

        // Draw head direction indicator
        if (index === 0) {
          ctx.fillStyle = "#ffffff";
          const centerX = x + cellSize / 2;
          const centerY = y + cellSize / 2;

          switch (engine.direction) {
            case "north":
              ctx.fillRect(centerX - 1, y + 3, 2, 4);
              break;
            case "south":
              ctx.fillRect(centerX - 1, y + cellSize - 7, 2, 4);
              break;
            case "east":
              ctx.fillRect(x + cellSize - 7, centerY - 1, 4, 2);
              break;
            case "west":
              ctx.fillRect(x + 3, centerY - 1, 4, 2);
              break;
          }
        }
      });
    });
  };

  const addOptimizationTarget = (
    type: "optimization" | "expansion" | "maintenance",
  ) => {
    const result = intelligentInfrastructure.addInfrastructureTarget(type);
    if (result.success) {
      setOptimizationEvents((prev) => [
        {
          engineId: "system",
          regionId: "new-target",
          points: 0,
          timestamp: Date.now(),
          type: `Target Added: ${type}`,
        },
        ...prev.slice(0, 9),
      ]);
    }
  };

  const getEngineTypeIcon = (type: string) => {
    switch (type) {
      case "routing":
        return <Globe className="h-4 w-4" />;
      case "processing":
        return <Zap className="h-4 w-4" />;
      case "storage":
        return <Database className="h-4 w-4" />;
      case "analytics":
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getOptimalRoute = () => {
    return intelligentInfrastructure.getOptimalRoute("web-request");
  };

  if (!gameState) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Activity className="h-6 w-6 animate-spin" />
            <span>Initializing Infrastructure Navigation...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const optimalRoute = getOptimalRoute();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-6 w-6 text-purple-600" />
              <CardTitle>Snake Xenzia Infrastructure Navigator</CardTitle>
              <Badge variant="outline" className="text-green-600">
                {isPlaying ? "Active" : "Paused"}
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={isPlaying ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isPlaying ? "Pause" : "Start"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={restartInfrastructureNavigation}
              >
                <RotateCcw className="h-4 w-4" />
                Restart
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {gameState.totalScore}
              </div>
              <div className="text-sm text-gray-600">Total Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {gameState.activeEngines}
              </div>
              <div className="text-sm text-gray-600">Active Engines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {gameState.healthyRegions}
              </div>
              <div className="text-sm text-gray-600">Healthy Regions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(gameState.averageLatency)}ms
              </div>
              <div className="text-sm text-gray-600">Avg Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">
                {Math.round(gameState.averageLoad)}%
              </div>
              <div className="text-sm text-gray-600">Avg Load</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="game-board" className="space-y-4">
        <TabsList>
          <TabsTrigger value="game-board">Game Board</TabsTrigger>
          <TabsTrigger value="engines">Engines</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="routing">Routing</TabsTrigger>
          <TabsTrigger value="serverless">Serverless APIs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        {/* Game Board Tab */}
        <TabsContent value="game-board">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Infrastructure Grid</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => addOptimizationTarget("optimization")}
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Optimize
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => addOptimizationTarget("expansion")}
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Expand
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => addOptimizationTarget("maintenance")}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Maintain
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center p-4 bg-black rounded-lg">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-700 rounded"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span>Routing Engine</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                  <span>Processing Engine</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-lime-500 rounded"></div>
                  <span>Storage Engine</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span>Analytics Engine</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engines Tab */}
        <TabsContent value="engines">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameState.engines.map((engine: any) => (
              <Card
                key={engine.id}
                className={`cursor-pointer transition-all ${
                  selectedEngine === engine.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() =>
                  setSelectedEngine(
                    selectedEngine === engine.id ? null : engine.id,
                  )
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getEngineTypeIcon(engine.type)}
                      <CardTitle className="text-lg capitalize">
                        {engine.type} Engine
                      </CardTitle>
                    </div>
                    <Badge variant="outline">{engine.score} pts</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Length:</span>
                      <span className="font-medium">
                        {engine.length} segments
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Direction:</span>
                      <span className="font-medium capitalize">
                        {engine.direction}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Target:</span>
                      <span className="font-medium">
                        {engine.target || "Searching..."}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Position:</span>
                      <span className="font-medium">
                        ({engine.position?.x || 0}, {engine.position?.y || 0})
                      </span>
                    </div>
                    <Progress
                      value={(engine.score % 1000) / 10}
                      className="h-2"
                    />
                    <div className="text-xs text-gray-500 text-center">
                      Next milestone: {1000 - (engine.score % 1000)} points
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Regions Tab */}
        <TabsContent value="regions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameState.regions.map((region: any) => (
              <Card key={region.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{region.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      {region.status === "active" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <Badge
                        variant={
                          region.status === "active" ? "default" : "destructive"
                        }
                      >
                        {region.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Latency:</span>
                      <span className="font-medium">{region.latency}ms</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Load:</span>
                        <span className="font-medium">{region.load}%</span>
                      </div>
                      <Progress value={region.load} className="h-2" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="font-medium">
                        ({region.location.x}, {region.location.y})
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Routing Tab */}
        <TabsContent value="routing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Optimal Routing</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {optimalRoute ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Primary Route</h3>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="font-medium">
                          {optimalRoute.primaryRegion?.name ||
                            "Auto-selecting..."}
                        </div>
                        <div className="text-sm text-gray-600">
                          Latency: {optimalRoute.estimatedLatency}ms
                        </div>
                        <div className="text-sm text-green-600">
                          {optimalRoute.recommendation}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Fallback Routes</h3>
                      <div className="space-y-2">
                        {optimalRoute.fallbackRegions?.map(
                          (region: any, index: number) => (
                            <div
                              key={index}
                              className="p-2 bg-blue-50 rounded text-sm"
                            >
                              <div className="font-medium">{region.name}</div>
                              <div className="text-gray-600">
                                Latency: {region.latency}ms
                              </div>
                            </div>
                          ),
                        ) || (
                          <div className="text-gray-500">
                            No fallbacks needed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="font-medium">
                      Routing Score: {optimalRoute.routingScore}
                    </div>
                    <div className="text-sm text-gray-600">
                      Higher scores indicate better optimization by the routing
                      engine
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Calculating optimal routes...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Serverless APIs Tab */}
        <TabsContent value="serverless">
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Serverless Infrastructure APIs
              </h2>
              <p className="text-gray-600">
                Real-time serverless functions powering the infrastructure
                optimization
              </p>
            </div>
            <ServerlessInfrastructurePanel />
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Optimization Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {optimizationEvents.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {optimizationEvents.map((event, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">
                          {event.type ||
                            `${event.engineId} optimized ${event.regionId}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      {event.points > 0 && (
                        <Badge variant="outline" className="text-green-600">
                          +{event.points} pts
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  No optimization events yet. Let the engines explore!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SnakeInfrastructureNavigator;
