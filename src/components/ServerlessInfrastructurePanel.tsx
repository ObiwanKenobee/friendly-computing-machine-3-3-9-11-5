/**
 * Serverless Infrastructure Panel
 * Real-time monitoring and control panel for serverless functions
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Activity,
  Zap,
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Target,
  TrendingUp,
  Globe,
  Server,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Database,
} from "lucide-react";
import {
  serverlessFunctions,
  type InfrastructureStatus,
} from "../services/serverlessFunctionsService";

interface ServerlessInfrastructurePanelProps {
  className?: string;
}

export const ServerlessInfrastructurePanel: React.FC<
  ServerlessInfrastructurePanelProps
> = ({ className = "" }) => {
  const [status, setStatus] = useState<InfrastructureStatus | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [controllingEngine, setControllingEngine] = useState<string | null>(
    null,
  );
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    loadInitialData();

    // Start real-time monitoring
    const stopMonitoring = serverlessFunctions.startRealTimeMonitoring(
      (newStatus) => {
        setStatus(newStatus);
      },
      30000,
    ); // Update every 30 seconds

    return stopMonitoring;
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [statusData, analyticsData, healthData] = await Promise.all([
        serverlessFunctions.getInfrastructureStatus(),
        serverlessFunctions.getAnalytics("24h"),
        serverlessFunctions.getSystemHealth(),
      ]);

      setStatus(statusData);
      setAnalytics(analyticsData);
      setSystemHealth(healthData);
    } catch (error) {
      console.error("Failed to load infrastructure data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEngineControl = async (action: string, engineId?: string) => {
    if (engineId) setControllingEngine(engineId);

    try {
      let result;
      switch (action) {
        case "start-all":
          result = await serverlessFunctions.startAllEngines();
          break;
        case "stop-all":
          result = await serverlessFunctions.stopAllEngines();
          break;
        case "optimize-all":
          setOptimizing(true);
          result = await serverlessFunctions.optimizeAllEngines();
          break;
        case "optimize":
          if (engineId) {
            result = await serverlessFunctions.optimizeEngine(engineId);
          }
          break;
        default:
          console.warn("Unknown action:", action);
          return;
      }

      if (result?.success) {
        // Refresh data after successful action
        loadInitialData();
      }
    } catch (error) {
      console.error("Engine control failed:", error);
    } finally {
      setControllingEngine(null);
      setOptimizing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "degraded":
      case "optimizing":
        return <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case "offline":
      case "idle":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEngineIcon = (type: string) => {
    switch (type) {
      case "routing":
        return <Globe className="h-4 w-4" />;
      case "processing":
        return <Cpu className="h-4 w-4" />;
      case "storage":
        return <Database className="h-4 w-4" />;
      case "analytics":
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Activity className="h-6 w-6 animate-spin" />
            <span>Loading serverless infrastructure...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-blue-600" />
              <span>Serverless Infrastructure Status</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => handleEngineControl("optimize-all")}
                disabled={optimizing}
              >
                {optimizing ? (
                  <Activity className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Zap className="h-4 w-4 mr-1" />
                )}
                Optimize All
              </Button>
              <Button size="sm" variant="outline" onClick={loadInitialData}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {systemHealth && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {systemHealth.overall}%
                </div>
                <div className="text-sm text-gray-600">Overall Health</div>
                <Progress value={systemHealth.overall} className="mt-2 h-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {systemHealth.engines}%
                </div>
                <div className="text-sm text-gray-600">Engine Health</div>
                <Progress value={systemHealth.engines} className="mt-2 h-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {systemHealth.regions}%
                </div>
                <div className="text-sm text-gray-600">Region Health</div>
                <Progress value={systemHealth.regions} className="mt-2 h-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {systemHealth.performance}%
                </div>
                <div className="text-sm text-gray-600">Performance</div>
                <Progress
                  value={systemHealth.performance}
                  className="mt-2 h-2"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="engines" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engines">Engines</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Engines Tab */}
        <TabsContent value="engines">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Infrastructure Engines</h3>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleEngineControl("start-all")}
                  disabled={!!controllingEngine}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Start All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEngineControl("stop-all")}
                  disabled={!!controllingEngine}
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Stop All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {status?.engines.map((engine) => (
                <Card key={engine.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getEngineIcon(engine.type)}
                        <CardTitle className="text-lg capitalize">
                          {engine.type} Engine
                        </CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(engine.status)}
                        <Badge
                          variant={
                            engine.status === "active" ? "default" : "secondary"
                          }
                        >
                          {engine.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Score:</span>
                        <span className="font-medium">{engine.score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Efficiency:
                        </span>
                        <span className="font-medium">
                          {engine.efficiency.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Target:</span>
                        <span className="font-medium">
                          {engine.target || "None"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Position:</span>
                        <span className="font-medium">
                          ({engine.position.x}, {engine.position.y})
                        </span>
                      </div>
                      <Progress value={engine.efficiency} className="h-2" />
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          handleEngineControl("optimize", engine.id)
                        }
                        disabled={controllingEngine === engine.id}
                      >
                        {controllingEngine === engine.id ? (
                          <Activity className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Target className="h-4 w-4 mr-1" />
                        )}
                        Optimize
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Regions Tab */}
        <TabsContent value="regions">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Infrastructure Regions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {status?.regions.map((region) => (
                <Card key={region.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{region.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(region.status)}
                        <Badge
                          variant={
                            region.status === "healthy"
                              ? "default"
                              : "destructive"
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
                        <span className="font-medium">
                          {Math.round(region.latency)}ms
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Load:</span>
                          <span className="font-medium">
                            {Math.round(region.load)}%
                          </span>
                        </div>
                        <Progress value={region.load} className="h-2" />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Connections:
                        </span>
                        <span className="font-medium">
                          {region.connections}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Last Optimized:
                        </span>
                        <span className="font-medium">
                          {new Date(region.lastOptimized).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Performance Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.summary?.totalOptimizations || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Optimizations
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(analytics.summary?.successRate || 0)}%
                      </div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(analytics.summary?.averageImprovement || 0)}
                        %
                      </div>
                      <div className="text-sm text-gray-600">
                        Avg Improvement
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {analytics.summary?.regionsOptimized || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Regions Optimized
                      </div>
                    </div>
                  </div>

                  {analytics.enginePerformance && (
                    <div>
                      <h4 className="font-semibold mb-3">Engine Performance</h4>
                      <div className="space-y-2">
                        {analytics.enginePerformance.map((engine: any) => (
                          <div
                            key={engine.engineId}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              {getEngineIcon(engine.engineType)}
                              <span className="font-medium capitalize">
                                {engine.engineType}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {engine.optimizations} optimizations
                              </div>
                              <div className="text-sm text-gray-600">
                                {Math.round(engine.averageImprovement)}% avg
                                improvement
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  No analytics data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>System Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {status?.alerts && status.alerts.length > 0 ? (
                <div className="space-y-3">
                  {status.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.type === "error"
                          ? "bg-red-50 border-red-500"
                          : alert.type === "warning"
                            ? "bg-yellow-50 border-yellow-500"
                            : "bg-blue-50 border-blue-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {alert.type === "error" ? (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          ) : alert.type === "warning" ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                          <span className="font-medium">{alert.message}</span>
                        </div>
                        <Badge
                          variant={alert.resolved ? "default" : "destructive"}
                        >
                          {alert.resolved ? "Resolved" : "Active"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  No active alerts
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServerlessInfrastructurePanel;
