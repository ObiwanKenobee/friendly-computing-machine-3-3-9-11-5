/**
 * Load Failure Diagnostics Component
 * Real-time monitoring and analysis of load failures
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Activity,
  Clock,
  TrendingUp,
  Shield,
  Bug,
  Zap,
} from "lucide-react";
import LoadFailureMonitoringService, {
  LoadFailureEvent,
  LoadFailureMetrics,
} from "../services/loadFailureMonitoringService";

export const LoadFailureDiagnostics: React.FC = () => {
  const [metrics, setMetrics] = useState<LoadFailureMetrics | null>(null);
  const [failures, setFailures] = useState<LoadFailureEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadFailureMonitor = LoadFailureMonitoringService.getInstance();

  useEffect(() => {
    const updateDiagnostics = () => {
      const currentMetrics = loadFailureMonitor.getMetrics();
      const currentFailures = loadFailureMonitor.getFailureHistory();

      setMetrics(currentMetrics);
      setFailures(currentFailures.slice(-20)); // Show last 20 failures
    };

    updateDiagnostics();

    let interval: NodeJS.Timeout | undefined;
    if (autoRefresh) {
      interval = setInterval(updateDiagnostics, 2000); // Update every 2 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, loadFailureMonitor]);

  const getStatusColor = () => {
    if (!metrics) return "gray";
    if (metrics.cascadingFailureDetected) return "red";
    if (metrics.failuresInLast5Minutes > 0) return "yellow";
    return "green";
  };

  const getStatusText = () => {
    if (!metrics) return "Loading...";
    if (metrics.cascadingFailureDetected) return "CASCADING FAILURE";
    if (metrics.failuresInLast5Minutes > 0) return "DEGRADED";
    return "HEALTHY";
  };

  const handleClearHistory = () => {
    loadFailureMonitor.clearFailureHistory();
    setFailures([]);
    setMetrics({
      totalFailures: 0,
      failuresInLast5Minutes: 0,
      failuresInLastMinute: 0,
      uniqueErrorTypes: new Set(),
      cascadingFailureDetected: false,
      lastCascadingFailureTime: 0,
    });
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getFailureTypeIcon = (type: string) => {
    switch (type) {
      case "component":
        return <Bug className="h-4 w-4" />;
      case "route":
        return <Activity className="h-4 w-4" />;
      case "service":
        return <Zap className="h-4 w-4" />;
      case "asset":
        return <Shield className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getFailureTypeColor = (type: string) => {
    switch (type) {
      case "component":
        return "bg-red-100 text-red-800";
      case "route":
        return "bg-orange-100 text-orange-800";
      case "service":
        return "bg-yellow-100 text-yellow-800";
      case "asset":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Load Failure Diagnostics
            </h1>
            <p className="text-gray-600">
              Real-time monitoring of system load failures
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              size="sm"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`}
              />
              Auto Refresh
            </Button>
            <Button onClick={handleClearHistory} variant="outline" size="sm">
              Clear History
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    System Status
                  </p>
                  <p className="text-2xl font-bold">
                    <Badge
                      className={`${
                        getStatusColor() === "green"
                          ? "bg-green-100 text-green-800"
                          : getStatusColor() === "yellow"
                            ? "bg-yellow-100 text-yellow-800"
                            : getStatusColor() === "red"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {getStatusText()}
                    </Badge>
                  </p>
                </div>
                {getStatusColor() === "green" ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : getStatusColor() === "yellow" ? (
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Failures
                  </p>
                  <p className="text-2xl font-bold">
                    {metrics?.totalFailures || 0}
                  </p>
                </div>
                <Bug className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Last 5 Minutes
                  </p>
                  <p className="text-2xl font-bold">
                    {metrics?.failuresInLast5Minutes || 0}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Last Minute
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {metrics?.failuresInLastMinute || 0}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Mode Alert */}
        {loadFailureMonitor.isInEmergencyMode() && (
          <Alert className="border-red-500 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Emergency Mode Active:</strong> The system has detected
              cascading failures and is in emergency stabilization mode. Some
              features may be temporarily disabled to prevent system-wide
              failures.
            </AlertDescription>
          </Alert>
        )}

        {/* Recent Failures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bug className="h-5 w-5" />
              <span>Recent Load Failures</span>
              <Badge variant="outline">{failures.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {failures.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No load failures detected</p>
                <p className="text-sm">System is operating normally</p>
              </div>
            ) : (
              <div className="space-y-4">
                {failures
                  .slice()
                  .reverse()
                  .map((failure) => (
                    <div
                      key={failure.id}
                      className="border rounded-lg p-4 bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getFailureTypeIcon(failure.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge
                                className={getFailureTypeColor(failure.type)}
                              >
                                {failure.type}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {formatTimestamp(failure.timestamp)}
                              </span>
                            </div>
                            <p className="font-medium text-gray-900">
                              {failure.source}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {failure.error}
                            </p>
                            {failure.stackTrace && (
                              <details className="mt-2">
                                <summary className="text-xs text-blue-600 cursor-pointer">
                                  Stack Trace
                                </summary>
                                <pre className="text-xs text-gray-500 mt-1 p-2 bg-gray-50 rounded overflow-x-auto">
                                  {failure.stackTrace.slice(0, 500)}...
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Type Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Error Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["component", "route", "service", "asset"].map((type) => {
                const count = failures.filter((f) => f.type === type).length;
                return (
                  <div
                    key={type}
                    className="text-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-center mb-2">
                      {getFailureTypeIcon(type)}
                    </div>
                    <p className="font-medium capitalize">{type}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoadFailureDiagnostics;
