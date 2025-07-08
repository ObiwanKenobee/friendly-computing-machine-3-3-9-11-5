import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Activity,
  Wifi,
  Server,
  Database,
} from "lucide-react";

interface DiagnosticCheck {
  name: string;
  status: "pending" | "success" | "warning" | "error";
  message: string;
  details?: string;
}

export const LoadingDiagnostics: React.FC = () => {
  const [checks, setChecks] = useState<DiagnosticCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<
    "unknown" | "healthy" | "issues" | "critical"
  >("unknown");

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnostics: DiagnosticCheck[] = [];

    try {
      // Check 1: Basic React rendering
      diagnostics.push({
        name: "React Component Rendering",
        status: "success",
        message: "React is rendering correctly",
        details: "LoadingDiagnostics component is functional",
      });

      // Check 2: Window object availability
      diagnostics.push({
        name: "Browser Environment",
        status: typeof window !== "undefined" ? "success" : "error",
        message:
          typeof window !== "undefined"
            ? "Browser environment available"
            : "Running in non-browser environment",
        details: `User Agent: ${typeof navigator !== "undefined" ? navigator.userAgent : "N/A"}`,
      });

      // Check 3: Network connectivity
      try {
        const response = await fetch("/api/health.json", {
          method: "GET",
          headers: { "Cache-Control": "no-cache" },
        });
        diagnostics.push({
          name: "Network Connectivity",
          status: response.ok ? "success" : "warning",
          message: response.ok
            ? "Network requests successful"
            : `HTTP ${response.status}`,
          details: `Response status: ${response.status} ${response.statusText}`,
        });
      } catch (error) {
        diagnostics.push({
          name: "Network Connectivity",
          status: "warning",
          message: "Health endpoint not available",
          details:
            error instanceof Error ? error.message : "Unknown network error",
        });
      }

      // Check 4: Local Storage
      try {
        const testKey = "diagnostic-test";
        localStorage.setItem(testKey, "test");
        const retrieved = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);

        diagnostics.push({
          name: "Local Storage",
          status: retrieved === "test" ? "success" : "warning",
          message:
            retrieved === "test"
              ? "Local storage functional"
              : "Local storage issues",
          details: "Browser storage for user preferences and cache",
        });
      } catch (error) {
        diagnostics.push({
          name: "Local Storage",
          status: "warning",
          message: "Local storage unavailable",
          details:
            error instanceof Error ? error.message : "Storage access denied",
        });
      }

      // Check 5: Memory usage
      try {
        if ("memory" in performance && (performance as any).memory) {
          const memory = (performance as any).memory;
          const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
          const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);

          diagnostics.push({
            name: "Memory Usage",
            status:
              usedMB < 100 ? "success" : usedMB < 200 ? "warning" : "error",
            message: `${usedMB}MB / ${totalMB}MB used`,
            details: `JavaScript heap: ${usedMB}MB used of ${totalMB}MB allocated`,
          });
        } else {
          diagnostics.push({
            name: "Memory Usage",
            status: "warning",
            message: "Memory info not available",
            details: "Browser does not support memory API",
          });
        }
      } catch (error) {
        diagnostics.push({
          name: "Memory Usage",
          status: "warning",
          message: "Cannot check memory usage",
          details: error instanceof Error ? error.message : "Memory API error",
        });
      }

      // Check 6: Console errors
      const originalError = console.error;
      let errorCount = 0;
      console.error = (...args) => {
        errorCount++;
        originalError(...args);
      };

      setTimeout(() => {
        console.error = originalError;
        diagnostics.push({
          name: "Console Errors",
          status:
            errorCount === 0 ? "success" : errorCount < 3 ? "warning" : "error",
          message:
            errorCount === 0
              ? "No recent errors"
              : `${errorCount} errors detected`,
          details: `Console error count in last second: ${errorCount}`,
        });
      }, 1000);

      // Check 7: JavaScript execution
      try {
        const testFunction = () => "test";
        const result = testFunction();
        diagnostics.push({
          name: "JavaScript Execution",
          status: result === "test" ? "success" : "error",
          message: "JavaScript execution normal",
          details: "Functions and variables working correctly",
        });
      } catch (error) {
        diagnostics.push({
          name: "JavaScript Execution",
          status: "error",
          message: "JavaScript execution error",
          details: error instanceof Error ? error.message : "Unknown JS error",
        });
      }

      setChecks(diagnostics);

      // Determine overall status
      const hasErrors = diagnostics.some((check) => check.status === "error");
      const hasWarnings = diagnostics.some(
        (check) => check.status === "warning",
      );

      if (hasErrors) {
        setOverallStatus("critical");
      } else if (hasWarnings) {
        setOverallStatus("issues");
      } else {
        setOverallStatus("healthy");
      }
    } catch (error) {
      diagnostics.push({
        name: "Diagnostic System",
        status: "error",
        message: "Diagnostic system failure",
        details:
          error instanceof Error ? error.message : "Unknown diagnostic error",
      });
      setChecks(diagnostics);
      setOverallStatus("critical");
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case "healthy":
        return "border-green-500 bg-green-50";
      case "issues":
        return "border-yellow-500 bg-yellow-50";
      case "critical":
        return "border-red-500 bg-red-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className={`${getOverallStatusColor()}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl">
                    Loading Diagnostics
                  </CardTitle>
                  <p className="text-gray-600">
                    System health and load failure analysis
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    overallStatus === "healthy" ? "default" : "destructive"
                  }
                >
                  {overallStatus.toUpperCase()}
                </Badge>
                <Button onClick={runDiagnostics} disabled={isRunning} size="sm">
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${isRunning ? "animate-spin" : ""}`}
                  />
                  {isRunning ? "Running..." : "Rerun"}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Overall Status Alert */}
        {overallStatus === "critical" && (
          <Alert className="border-red-500 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Critical Issues Detected:</strong> The application has
              encountered serious problems that may prevent normal operation.
            </AlertDescription>
          </Alert>
        )}

        {overallStatus === "issues" && (
          <Alert className="border-yellow-500 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Issues Detected:</strong> Some components are not
              functioning optimally but core functionality should work.
            </AlertDescription>
          </Alert>
        )}

        {overallStatus === "healthy" && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>System Healthy:</strong> All diagnostic checks passed. Any
              load failures are likely temporary or network-related.
            </AlertDescription>
          </Alert>
        )}

        {/* Diagnostic Results */}
        <div className="grid gap-4">
          {checks.map((check, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <h3 className="font-semibold">{check.name}</h3>
                      <p className="text-sm text-gray-600">{check.message}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {check.status}
                  </Badge>
                </div>
                {check.details && (
                  <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-700">
                    {check.details}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Go to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                className="flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Timestamp:</strong> {new Date().toISOString()}
              </div>
              <div>
                <strong>User Agent:</strong>{" "}
                {typeof navigator !== "undefined"
                  ? navigator.userAgent.substring(0, 50) + "..."
                  : "N/A"}
              </div>
              <div>
                <strong>Screen:</strong>{" "}
                {typeof window !== "undefined"
                  ? `${window.screen.width}x${window.screen.height}`
                  : "N/A"}
              </div>
              <div>
                <strong>Viewport:</strong>{" "}
                {typeof window !== "undefined"
                  ? `${window.innerWidth}x${window.innerHeight}`
                  : "N/A"}
              </div>
              <div>
                <strong>Connection:</strong>{" "}
                {typeof navigator !== "undefined" && "connection" in navigator
                  ? (navigator as any).connection?.effectiveType || "Unknown"
                  : "N/A"}
              </div>
              <div>
                <strong>Language:</strong>{" "}
                {typeof navigator !== "undefined" ? navigator.language : "N/A"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoadingDiagnostics;
