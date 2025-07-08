/**
 * Enterprise-Grade Page Loading Fallback
 * Advanced loading states with timeout detection, health monitoring, and user experience optimization
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import {
  Loader2,
  AlertTriangle,
  RefreshCw,
  Activity,
  Clock,
  Wifi,
  AlertCircle,
  Shield,
  Database,
  Zap,
  TrendingUp,
  CheckCircle,
  XCircle,
  Bug,
} from "lucide-react";
import { appHealthMonitor } from "../utils/appHealthMonitor";

interface PageLoadingFallbackProps {
  pageName?: string;
  timeout?: number; // in milliseconds
  showProgressBar?: boolean;
  onTimeout?: () => void;
  children?: React.ReactNode;
  enableAdvancedMonitoring?: boolean;
  showNetworkDiagnostics?: boolean;
  enableRetryStrategies?: boolean;
}

interface NetworkDiagnostics {
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface LoadingPhase {
  name: string;
  description: string;
  duration: number;
  icon: React.ReactNode;
}

const PageLoadingFallback: React.FC<PageLoadingFallbackProps> = ({
  pageName = "Page",
  timeout = 120000, // 2 minutes default - much more reasonable for enterprise apps
  showProgressBar = true,
  onTimeout,
  children,
  enableAdvancedMonitoring = false, // Disable by default to reduce noise
  showNetworkDiagnostics = false,
  enableRetryStrategies = true,
}) => {
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [healthStatus, setHealthStatus] = useState<string>("checking");
  const [currentPhase, setCurrentPhase] = useState<LoadingPhase | null>(null);
  const [networkDiagnostics, setNetworkDiagnostics] =
    useState<NetworkDiagnostics | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [loadingMetrics, setLoadingMetrics] = useState({
    startTime: Date.now(),
    estimatedCompletion: Date.now() + timeout,
    averageLoadTime: 5000,
    slowConnectionDetected: false,
  });

  const startTimeRef = useRef(Date.now());
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const phaseIntervalRef = useRef<NodeJS.Timeout>();
  const timeoutTimerRef = useRef<NodeJS.Timeout>();

  // Enterprise loading phases with intelligent progression
  const loadingPhases: LoadingPhase[] = [
    {
      name: "Initializing Security",
      description: "Establishing secure connection and authentication",
      duration: 2000,
      icon: <Shield className="h-4 w-4" />,
    },
    {
      name: "Loading Core Systems",
      description: "Initializing platform components and services",
      duration: 3000,
      icon: <Database className="h-4 w-4" />,
    },
    {
      name: "Fetching Real-time Data",
      description: "Retrieving latest market data and analytics",
      duration: 2500,
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      name: "Optimizing Performance",
      description: "Configuring adaptive performance settings",
      duration: 2000,
      icon: <Zap className="h-4 w-4" />,
    },
    {
      name: "Finalizing Interface",
      description: "Rendering user interface and applying preferences",
      duration: 1500,
      icon: <CheckCircle className="h-4 w-4" />,
    },
  ];

  useEffect(() => {
    // Initialize loading metrics
    const startTime = Date.now();
    setLoadingMetrics((prev) => ({
      ...prev,
      startTime,
      estimatedCompletion: startTime + timeout,
    }));

    // Network diagnostics (if supported)
    if (enableAdvancedMonitoring && "connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        setNetworkDiagnostics({
          connectionType: connection.type || "unknown",
          effectiveType: connection.effectiveType || "unknown",
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false,
        });

        // Detect slow connection
        if (
          connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g"
        ) {
          setLoadingMetrics((prev) => ({
            ...prev,
            slowConnectionDetected: true,
          }));
        }
      }
    }

    // Intelligent progress simulation based on network conditions
    if (showProgressBar) {
      let progressIncrement = 1;
      if (networkDiagnostics?.effectiveType === "slow-2g")
        progressIncrement = 0.5;
      if (networkDiagnostics?.effectiveType === "4g") progressIncrement = 2;

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const elapsed = Date.now() - startTime;
          const expectedProgress = (elapsed / timeout) * 100;

          // Adaptive progress based on actual loading
          const newProgress = Math.min(
            prev + progressIncrement + Math.random() * 2,
            expectedProgress + 10, // Don't get too far ahead
            95, // Never complete until actually loaded
          );

          return Math.min(newProgress, 95);
        });
      }, 150);
    }

    // Intelligent phase progression
    let currentPhaseIndex = 0;
    setCurrentPhase(loadingPhases[0]);

    phaseIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const phaseProgress = elapsed / timeout;

      const newPhaseIndex = Math.min(
        Math.floor(phaseProgress * loadingPhases.length),
        loadingPhases.length - 1,
      );

      if (
        newPhaseIndex !== currentPhaseIndex &&
        newPhaseIndex < loadingPhases.length
      ) {
        currentPhaseIndex = newPhaseIndex;
        setCurrentPhase(loadingPhases[newPhaseIndex]);
      }
    }, 500);

    // Health monitoring
    const checkHealth = async () => {
      try {
        const health = await appHealthMonitor.checkHealth();
        setHealthStatus(health.overall);
      } catch (error) {
        setHealthStatus("degraded");
      }
    };

    checkHealth();
    const healthInterval = setInterval(checkHealth, 5000);

    // Enhanced timeout handler with retry logic
    timeoutTimerRef.current = setTimeout(() => {
      setIsTimedOut(true);
      setProgress(100);
      setCurrentPhase({
        name: "Timeout Detected",
        description: "Loading is taking longer than expected",
        duration: 0,
        icon: <XCircle className="h-4 w-4" />,
      });

      if (onTimeout) {
        onTimeout();
      }

      // Auto-retry for certain conditions
      if (
        enableRetryStrategies &&
        retryAttempts < 2 &&
        healthStatus === "healthy"
      ) {
        setTimeout(() => {
          setRetryAttempts((prev) => prev + 1);
          window.location.reload();
        }, 3000);
      }
    }, timeout);

    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
      clearInterval(healthInterval);
    };
  }, [
    timeout,
    onTimeout,
    showProgressBar,
    enableAdvancedMonitoring,
    enableRetryStrategies,
    retryAttempts,
    healthStatus,
  ]);

  const handleRetry = () => {
    setRetryAttempts((prev) => prev + 1);
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleForceReload = () => {
    window.location.href = window.location.href + "?force=" + Date.now();
  };

  const getRemainingTime = () => {
    const elapsed = Date.now() - loadingMetrics.startTime;
    const remaining = Math.max(0, (timeout - elapsed) / 1000);
    return Math.round(remaining);
  };

  const getHealthStatusColor = () => {
    switch (healthStatus) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "degraded":
        return "bg-yellow-100 text-yellow-800";
      case "unhealthy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isTimedOut) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Extended Loading - {pageName}
            </CardTitle>
            <CardDescription className="text-lg">
              This enterprise page requires additional time to load (
              {Math.round(timeout / 1000)} seconds allocated)
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>
                  Extended loading detected after {Math.round(timeout / 1000)}{" "}
                  seconds.
                </strong>{" "}
                This enterprise application may need additional time due to:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    Slow network connection (
                    {networkDiagnostics?.effectiveType || "unknown"})
                  </li>
                  <li>Server response delays</li>
                  <li>Large resource files or complex calculations</li>
                  <li>JavaScript bundle loading issues</li>
                  {retryAttempts > 0 && (
                    <li>Previous retry attempts: {retryAttempts}</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>

            {/* System Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">System Health</span>
                </div>
                <Badge className={getHealthStatusColor()}>{healthStatus}</Badge>
              </div>

              {networkDiagnostics && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Connection</span>
                  </div>
                  <Badge variant="outline">
                    {networkDiagnostics.effectiveType}
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Load Time</span>
                </div>
                <Badge variant="outline">
                  {Math.round((Date.now() - loadingMetrics.startTime) / 1000)}s
                </Badge>
              </div>
            </div>

            {/* Network Diagnostics */}
            {networkDiagnostics && showNetworkDiagnostics && (
              <div className="space-y-3">
                <h3 className="font-semibold">Network Diagnostics</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    Connection Type:{" "}
                    <span className="font-mono">
                      {networkDiagnostics.connectionType}
                    </span>
                  </div>
                  <div>
                    Effective Type:{" "}
                    <span className="font-mono">
                      {networkDiagnostics.effectiveType}
                    </span>
                  </div>
                  <div>
                    Downlink:{" "}
                    <span className="font-mono">
                      {networkDiagnostics.downlink} Mbps
                    </span>
                  </div>
                  <div>
                    RTT:{" "}
                    <span className="font-mono">
                      {networkDiagnostics.rtt}ms
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Troubleshooting Steps */}
            <div className="space-y-3">
              <h3 className="font-semibold">Recommended Actions:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-semibold">
                    1
                  </div>
                  <div>Check your internet connection stability</div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-semibold">
                    2
                  </div>
                  <div>
                    Try refreshing the page (retry #{retryAttempts + 1})
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-semibold">
                    3
                  </div>
                  <div>Clear browser cache and reload</div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-semibold">
                    4
                  </div>
                  <div>Try accessing from a different network</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleRetry} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Loading (Attempt #{retryAttempts + 1})
              </Button>

              <Button
                onClick={handleForceReload}
                variant="outline"
                className="flex-1"
              >
                <Zap className="h-4 w-4 mr-2" />
                Force Reload
              </Button>

              <Button
                onClick={handleGoHome}
                variant="outline"
                className="flex-1"
              >
                <Activity className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Wifi className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Auto-Recovery:</strong>{" "}
                {enableRetryStrategies
                  ? `Intelligent retry enabled. ${retryAttempts < 2 ? "Will auto-retry if system is healthy." : "Max retries reached."}`
                  : "Manual retry required."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Loading {pageName}
          </CardTitle>
          <CardDescription className="flex items-center justify-center space-x-2">
            {currentPhase?.icon}
            <span>{currentPhase?.name}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Enhanced Progress Bar */}
          {showProgressBar && (
            <div className="space-y-3">
              <Progress value={progress} className="w-full h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{Math.round(progress)}% complete</span>
                <span>{getRemainingTime()}s remaining</span>
              </div>
              {currentPhase && (
                <div className="text-center text-xs text-gray-600 italic">
                  {currentPhase.description}
                </div>
              )}
            </div>
          )}

          {/* System Status */}
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span>System: </span>
              <Badge className={getHealthStatusColor()} variant="outline">
                {healthStatus}
              </Badge>
            </div>

            {networkDiagnostics && (
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-green-600" />
                <Badge variant="outline">
                  {networkDiagnostics.effectiveType}
                </Badge>
              </div>
            )}
          </div>

          {/* Connection Warning */}
          {loadingMetrics.slowConnectionDetected && (
            <Alert>
              <Wifi className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Slow connection detected. Loading may take longer than usual.
              </AlertDescription>
            </Alert>
          )}

          {/* Load Patience Indicator - Only show if really taking a long time */}
          {progress > 90 && !isTimedOut && (
            <Alert className="border-blue-500 bg-blue-50">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Almost Ready:</strong> Finalizing the loading process...
                <div className="mt-1 text-xs text-blue-600">
                  Enterprise applications may take a moment to fully initialize
                  all security layers.
                </div>
              </AlertDescription>
            </Alert>
          )}

          {children && (
            <div className="text-center text-sm text-gray-500 border-t pt-4">
              {children}
            </div>
          )}

          {/* Advanced Monitoring Info */}
          {enableAdvancedMonitoring && progress > 80 && !isTimedOut && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Almost there! Finalizing secure connections and optimizing
                performance...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PageLoadingFallback;
