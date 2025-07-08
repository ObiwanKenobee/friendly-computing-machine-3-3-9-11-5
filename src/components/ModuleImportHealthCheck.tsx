/**
 * Module Import Health Check Component
 * Tests and reports on the health of all lazy-loaded modules
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Play,
  Pause,
} from "lucide-react";
import ModulePreloader from "../utils/modulePreloader";

interface ModuleTest {
  name: string;
  importPath: string;
  status: "pending" | "success" | "error" | "testing";
  error?: string;
  loadTime?: number;
}

export const ModuleImportHealthCheck: React.FC = () => {
  const [moduleTests, setModuleTests] = useState<ModuleTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const modulePreloader = ModulePreloader.getInstance();

  // Define all modules to test
  const modulesToTest: Omit<ModuleTest, "status">[] = [
    { name: "Index", importPath: "../pages/Index" },
    {
      name: "PlatformNavigation",
      importPath: "../components/PlatformNavigation",
    },
    { name: "PricingPage", importPath: "../pages/pricing" },
    { name: "BillingPage", importPath: "../pages/billing" },
    { name: "ExecutivePage", importPath: "../pages/executive" },
    { name: "DeveloperPage", importPath: "../pages/developer" },
    { name: "AnalyticsPage", importPath: "../pages/analytics" },
    {
      name: "LoadingDiagnostics",
      importPath: "../components/LoadingDiagnostics",
    },
    {
      name: "LoadFailureDiagnostics",
      importPath: "../components/LoadFailureDiagnostics",
    },
    { name: "ErrorBoundary", importPath: "../components/ErrorBoundary" },
    {
      name: "QuantumArchitectureVisualization",
      importPath: "../components/QuantumArchitectureVisualization",
    },
    {
      name: "LegendaryInvestorDashboard",
      importPath: "../components/LegendaryInvestorDashboard",
    },
    {
      name: "GlobalExpansionDashboard",
      importPath: "../components/GlobalExpansionDashboard",
    },
    { name: "NotFound", importPath: "../pages/NotFound" },
  ];

  useEffect(() => {
    // Initialize tests
    setModuleTests(
      modulesToTest.map((module) => ({
        ...module,
        status: "pending" as const,
      })),
    );

    // Get current stats
    updateStats();
  }, []);

  const updateStats = () => {
    const stats = modulePreloader.getStats();
    setStats(stats);
  };

  const testModule = async (moduleTest: ModuleTest): Promise<ModuleTest> => {
    const startTime = Date.now();

    try {
      // Update status to testing
      setModuleTests((prev) =>
        prev.map((test) =>
          test.name === moduleTest.name ? { ...test, status: "testing" } : test,
        ),
      );

      // Attempt to import the module
      const module = await import(moduleTest.importPath);
      const loadTime = Date.now() - startTime;

      // Check if module has a default export
      if (!module.default) {
        throw new Error("Module does not have a default export");
      }

      return {
        ...moduleTest,
        status: "success",
        loadTime,
      };
    } catch (error) {
      const loadTime = Date.now() - startTime;
      return {
        ...moduleTest,
        status: "error",
        error: (error as Error).message,
        loadTime,
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);

    try {
      // Test modules one by one to avoid overwhelming the system
      for (const moduleTest of modulesToTest) {
        const result = await testModule(moduleTest);

        setModuleTests((prev) =>
          prev.map((test) => (test.name === result.name ? result : test)),
        );

        // Small delay between tests
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } finally {
      setIsRunning(false);
      updateStats();
    }
  };

  const clearFailedModules = () => {
    modulePreloader.clearFailedModules();
    updateStats();
  };

  const getStatusIcon = (status: ModuleTest["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "testing":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: ModuleTest["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case "testing":
        return <Badge className="bg-blue-100 text-blue-800">Testing</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };

  const successCount = moduleTests.filter(
    (test) => test.status === "success",
  ).length;
  const errorCount = moduleTests.filter(
    (test) => test.status === "error",
  ).length;
  const averageLoadTime =
    moduleTests
      .filter((test) => test.loadTime)
      .reduce((sum, test) => sum + (test.loadTime || 0), 0) /
    moduleTests.filter((test) => test.loadTime).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Module Import Health Check
            </h1>
            <p className="text-gray-600">
              Test and monitor the health of all lazy-loaded modules
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex items-center space-x-2"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Run Tests</span>
                </>
              )}
            </Button>
            <Button onClick={clearFailedModules} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Failed
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Modules
                  </p>
                  <p className="text-2xl font-bold">{moduleTests.length}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">
                    {moduleTests.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Successful
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {successCount}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">
                    {errorCount}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Load Time
                  </p>
                  <p className="text-2xl font-bold">
                    {isNaN(averageLoadTime)
                      ? "-"
                      : `${Math.round(averageLoadTime)}ms`}
                  </p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xs font-bold">ms</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Preloader Stats */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Module Preloader Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.preloadedModules}
                  </p>
                  <p className="text-sm text-gray-600">Preloaded Modules</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {stats.failedModules}
                  </p>
                  <p className="text-sm text-gray-600">Failed Modules</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.totalRetryAttempts}
                  </p>
                  <p className="text-sm text-gray-600">Total Retry Attempts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Module Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Module Import Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleTests.map((test) => (
                <div
                  key={test.name}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <p className="font-medium">{test.name}</p>
                      <p className="text-sm text-gray-500">{test.importPath}</p>
                      {test.error && (
                        <p className="text-xs text-red-600 mt-1">
                          {test.error}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {test.loadTime && (
                      <span className="text-sm text-gray-500">
                        {test.loadTime}ms
                      </span>
                    )}
                    {getStatusBadge(test.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {errorCount > 0 && (
          <Alert className="border-orange-500 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Module Import Issues Detected:</strong> {errorCount}{" "}
              module(s) failed to load. This could indicate network issues,
              missing dependencies, or code errors in those modules. Check the
              browser console for more detailed error messages.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ModuleImportHealthCheck;
