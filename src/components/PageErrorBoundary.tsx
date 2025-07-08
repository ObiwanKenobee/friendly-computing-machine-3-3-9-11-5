/**
 * Page-Level Error Boundary with Comprehensive Diagnostics
 * Prevents blank pages and provides detailed error information
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug,
  Shield,
  Activity,
  Monitor,
  Wifi,
  Database,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { globalErrorHandler, AppErrorBase } from "../utils/errorHandling";
import { appHealthMonitor, SystemHealth } from "../utils/appHealthMonitor";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  pageName?: string;
  enableDiagnostics?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
  systemHealth: SystemHealth | null;
  isDiagnosticMode: boolean;
  isRecovering: boolean;
}

export class PageErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private recoveryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      systemHealth: null,
      isDiagnosticMode: false,
      isRecovering: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.generateErrorId();

    try {
      // Run health diagnostics
      const systemHealth = await appHealthMonitor.checkHealth();

      this.setState({
        error,
        errorInfo,
        errorId,
        systemHealth,
      });

      // Log comprehensive error information
      console.error("PageErrorBoundary caught an error:", {
        error,
        errorInfo,
        errorId,
        pageName: this.props.pageName,
        systemHealth,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });

      // Use global error handler
      const appError = globalErrorHandler.handle(error, {
        component: `PageErrorBoundary${this.props.pageName ? `_${this.props.pageName}` : ""}`,
        action: "render",
        componentStack: errorInfo.componentStack,
        errorId,
        systemHealth,
      });

      // Auto-recovery attempt for certain types of errors
      this.attemptAutoRecovery(error, systemHealth);
    } catch (diagnosticError) {
      console.error("Failed to run error diagnostics:", diagnosticError);
      this.setState({
        error,
        errorInfo,
        errorId,
        systemHealth: null,
      });
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async attemptAutoRecovery(
    error: Error,
    systemHealth: SystemHealth | null,
  ): Promise<void> {
    // Don't auto-recover if we've already tried too many times
    if (this.state.retryCount >= this.maxRetries) {
      return;
    }

    // Check if the error is recoverable
    const isRecoverable = this.isRecoverableError(error, systemHealth);

    if (isRecoverable) {
      this.setState({ isRecovering: true });

      // Wait a bit before attempting recovery
      this.recoveryTimeout = setTimeout(() => {
        this.handleRetry();
      }, 2000);
    }
  }

  private isRecoverableError(
    error: Error,
    systemHealth: SystemHealth | null,
  ): boolean {
    // Network errors are often recoverable
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return (
        systemHealth?.services.find((s) => s.service === "network")?.status !==
        "failing"
      );
    }

    // Temporary rendering issues might be recoverable
    if (
      error.message.includes("Cannot read property") &&
      systemHealth?.overall === "healthy"
    ) {
      return true;
    }

    // Chunk loading errors (common in SPAs)
    if (
      error.message.includes("Loading chunk") ||
      error.message.includes("ChunkLoadError")
    ) {
      return true;
    }

    return false;
  }

  private handleRetry = async () => {
    if (this.state.retryCount < this.maxRetries) {
      try {
        this.setState({ isRecovering: true });

        // Clear any timers
        if (this.recoveryTimeout) {
          clearTimeout(this.recoveryTimeout);
          this.recoveryTimeout = null;
        }

        // Run health check before retry
        const healthCheck = await appHealthMonitor.checkHealth();

        this.setState((prevState) => ({
          hasError: false,
          error: null,
          errorInfo: null,
          errorId: null,
          retryCount: prevState.retryCount + 1,
          systemHealth: healthCheck,
          isRecovering: false,
        }));
      } catch (retryError) {
        console.error("Retry failed:", retryError);
        this.setState({ isRecovering: false });
      }
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private toggleDiagnosticMode = () => {
    this.setState((prevState) => ({
      isDiagnosticMode: !prevState.isDiagnosticMode,
    }));
  };

  private getErrorSeverity(): "low" | "medium" | "high" | "critical" {
    if (!this.state.error) return "low";

    const errorMessage = this.state.error.message.toLowerCase();

    if (
      errorMessage.includes("security") ||
      errorMessage.includes("auth") ||
      errorMessage.includes("permission")
    ) {
      return "critical";
    }

    if (
      errorMessage.includes("network") ||
      errorMessage.includes("api") ||
      errorMessage.includes("fetch")
    ) {
      return "high";
    }

    if (
      errorMessage.includes("render") ||
      errorMessage.includes("component") ||
      errorMessage.includes("undefined")
    ) {
      return "medium";
    }

    return "low";
  }

  private getErrorTypeIcon() {
    const severity = this.getErrorSeverity();

    switch (severity) {
      case "critical":
        return <Shield className="h-8 w-8 text-red-600" />;
      case "high":
        return <Wifi className="h-8 w-8 text-orange-600" />;
      case "medium":
        return <Monitor className="h-8 w-8 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-blue-600" />;
    }
  }

  private renderSystemHealth(): ReactNode {
    if (!this.state.systemHealth) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>System diagnostics unavailable</AlertDescription>
        </Alert>
      );
    }

    const { systemHealth } = this.state;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">System Health Status</h3>
          <Badge
            variant={
              systemHealth.overall === "healthy" ? "default" : "destructive"
            }
            className="capitalize"
          >
            {systemHealth.overall}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemHealth.services.map((service) => (
            <div
              key={service.service}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                {service.status === "healthy" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : service.status === "degraded" ? (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium capitalize">
                  {service.service}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {service.latency.toFixed(0)}ms
                </div>
                {service.error && (
                  <div
                    className="text-xs text-red-600 truncate max-w-32"
                    title={service.error}
                  >
                    {service.error}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Performance Metrics</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Render Time</div>
              <div className="font-mono">
                {systemHealth.performance.renderTime.toFixed(2)}ms
              </div>
            </div>
            <div>
              <div className="text-gray-600">Network Latency</div>
              <div className="font-mono">
                {systemHealth.performance.networkLatency.toFixed(2)}ms
              </div>
            </div>
            <div>
              <div className="text-gray-600">Memory Usage</div>
              <div className="font-mono">
                {systemHealth.performance.memoryUsage.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Browser Features</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(systemHealth.features).map(
              ([feature, supported]) => (
                <Badge
                  key={feature}
                  variant={supported ? "default" : "outline"}
                  className="text-xs"
                >
                  {feature}
                </Badge>
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const severity = this.getErrorSeverity();
      const canRetry = this.state.retryCount < this.maxRetries;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  {this.getErrorTypeIcon()}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {this.props.pageName
                  ? `Error in ${this.props.pageName}`
                  : "Page Error"}
              </CardTitle>
              <CardDescription className="text-lg">
                {this.state.isRecovering
                  ? "Attempting automatic recovery..."
                  : "Something went wrong while loading this page"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {this.state.isRecovering && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Recovery in progress...
                  </div>
                  <Progress value={undefined} className="w-full" />
                </div>
              )}

              {/* Error ID and Severity */}
              <div className="flex justify-between items-center">
                <Alert>
                  <Bug className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Error ID:</strong> {this.state.errorId}
                    <br />
                    <strong>Severity:</strong>{" "}
                    <Badge
                      variant={
                        severity === "critical" ? "destructive" : "outline"
                      }
                    >
                      {severity}
                    </Badge>
                  </AlertDescription>
                </Alert>
              </div>

              {/* Diagnostic Information */}
              {this.props.enableDiagnostics !== false && (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="health">System Health</TabsTrigger>
                    <TabsTrigger value="technical">
                      Technical Details
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="text-sm text-gray-600">
                      <p>
                        An error occurred while rendering this page. Our system
                        has automatically:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Logged the error with ID: {this.state.errorId}</li>
                        <li>Performed system health diagnostics</li>
                        <li>Reported the issue to our monitoring system</li>
                        {this.state.isRecovering && (
                          <li>Initiated automatic recovery procedures</li>
                        )}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="health">
                    {this.renderSystemHealth()}
                  </TabsContent>

                  <TabsContent value="technical" className="space-y-4">
                    {process.env.NODE_ENV === "development" &&
                      this.state.error && (
                        <Alert className="border-yellow-200 bg-yellow-50">
                          <AlertDescription className="text-yellow-800">
                            <strong>Development Details:</strong>
                            <pre className="mt-2 text-xs overflow-auto max-h-48 bg-white p-3 rounded border">
                              {this.state.error.message}
                              {"\n\n"}
                              {this.state.error.stack}
                              {this.state.errorInfo?.componentStack &&
                                "\n\nComponent Stack:\n" +
                                  this.state.errorInfo.componentStack}
                            </pre>
                          </AlertDescription>
                        </Alert>
                      )}

                    <div className="text-sm space-y-2">
                      <div>
                        <strong>Page:</strong>{" "}
                        {this.props.pageName || "Unknown"}
                      </div>
                      <div>
                        <strong>URL:</strong> {window.location.href}
                      </div>
                      <div>
                        <strong>User Agent:</strong> {navigator.userAgent}
                      </div>
                      <div>
                        <strong>Timestamp:</strong> {new Date().toISOString()}
                      </div>
                      <div>
                        <strong>Retry Count:</strong> {this.state.retryCount}/
                        {this.maxRetries}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {canRetry && !this.state.isRecovering && (
                  <Button onClick={this.handleRetry} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again ({this.maxRetries - this.state.retryCount}{" "}
                    attempts left)
                  </Button>
                )}

                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Recovery tip */}
              <Alert className="border-green-200 bg-green-50">
                <Activity className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 text-sm">
                  <strong>Quick Fix:</strong> Most page errors are resolved by
                  refreshing the page or checking your internet connection. If
                  the problem persists, try clearing your browser cache.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }

  componentWillUnmount() {
    if (this.recoveryTimeout) {
      clearTimeout(this.recoveryTimeout);
    }
  }
}

export default PageErrorBoundary;
