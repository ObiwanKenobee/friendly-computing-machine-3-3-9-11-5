/**
 * App Recovery System
 * Handles app crashes and provides recovery mechanisms
 */

import React, { Component, ReactNode } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Settings,
  Bug,
  CheckCircle,
  Zap,
} from "lucide-react";

interface AppRecoveryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  retryCount: number;
  isRecovering: boolean;
}

interface AppRecoveryProps {
  children: ReactNode;
  maxRetries?: number;
}

class AppRecoverySystem extends Component<AppRecoveryProps, AppRecoveryState> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: AppRecoveryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRecovering: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<AppRecoveryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("App Recovery System caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Automatic recovery attempt for certain types of errors
    if (this.shouldAttemptAutoRecovery(error)) {
      this.scheduleAutoRecovery();
    }

    // Report error to monitoring service
    this.reportError(error, errorInfo);
  }

  shouldAttemptAutoRecovery(error: Error): boolean {
    const recoverableErrors = [
      "ChunkLoadError",
      "Loading chunk",
      "Failed to fetch",
      "NetworkError",
      "timeout",
    ];

    return recoverableErrors.some(
      (errorType) =>
        error.message.includes(errorType) || error.name.includes(errorType),
    );
  }

  scheduleAutoRecovery = () => {
    if (this.state.retryCount < (this.props.maxRetries || 3)) {
      this.setState({ isRecovering: true });

      this.retryTimeout = setTimeout(
        () => {
          this.handleRecovery();
        },
        2000 + this.state.retryCount * 1000,
      ); // Exponential backoff
    }
  };

  handleRecovery = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1,
      isRecovering: false,
    });

    // Clear any stored error states
    if (typeof window !== "undefined") {
      localStorage.removeItem("app_error_state");

      // Force reload critical services
      try {
        import("../services/criticalServiceLoader").then((module) => {
          module.criticalServiceManager.initializeAllServices();
        });
      } catch (error) {
        console.warn("Could not reload critical services:", error);
      }
    }
  };

  handleManualRecovery = () => {
    // Clear all app state and reload
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  handleSafeMode = () => {
    // Navigate to safe mode with minimal features
    if (typeof window !== "undefined") {
      localStorage.setItem("app_safe_mode", "true");
      window.location.href = "/?safe_mode=true";
    }
  };

  reportError = (error: Error, errorInfo: any) => {
    // In production, this would send to error tracking service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount,
    };

    console.log("Error Report:", errorReport);

    // Store error for debugging
    try {
      localStorage.setItem("last_app_error", JSON.stringify(errorReport));
    } catch (e) {
      console.warn("Could not store error report:", e);
    }
  };

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      const { error, retryCount, isRecovering } = this.state;
      const maxRetries = this.props.maxRetries || 3;

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border-2 border-red-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-6 w-6" />
                Application Recovery
              </CardTitle>
              <CardDescription>
                The app encountered an issue and is attempting to recover.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error Information */}
              <Alert className="border-red-200 bg-red-50">
                <Bug className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong>{" "}
                  {error?.message || "Unknown error occurred"}
                </AlertDescription>
              </Alert>

              {/* Recovery Status */}
              {isRecovering ? (
                <Alert className="border-blue-200 bg-blue-50">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <AlertDescription>
                    Attempting automatic recovery... (Attempt {retryCount + 1}/
                    {maxRetries})
                  </AlertDescription>
                </Alert>
              ) : retryCount >= maxRetries ? (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Automatic recovery failed. Manual intervention required.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Recovery options available. You can try again or use safe
                    mode.
                  </AlertDescription>
                </Alert>
              )}

              {/* Recovery Actions */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    onClick={this.handleRecovery}
                    disabled={isRecovering}
                    className="w-full"
                  >
                    {isRecovering ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Try Again
                  </Button>

                  <Button
                    variant="outline"
                    onClick={this.handleSafeMode}
                    className="w-full"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Safe Mode
                  </Button>

                  <Button
                    variant="outline"
                    onClick={this.handleManualRecovery}
                    className="w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Full Reset
                  </Button>
                </div>
              </div>

              {/* Help Information */}
              <div className="text-xs text-gray-600 p-3 bg-gray-50 rounded">
                <strong>What happened?</strong>
                <br />
                The app encountered an unexpected error. This could be due to:
                <ul className="mt-1 ml-4 list-disc">
                  <li>Network connectivity issues</li>
                  <li>Browser compatibility problems</li>
                  <li>Temporary service interruptions</li>
                  <li>Memory or resource constraints</li>
                </ul>
                <br />
                <strong>Recovery Options:</strong>
                <br />• <strong>Try Again:</strong> Attempts to reload the
                failed component
                <br />• <strong>Safe Mode:</strong> Loads with minimal features
                <br />• <strong>Full Reset:</strong> Clears all data and starts
                fresh
              </div>

              {/* Error Details (Collapsible) */}
              {error && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                    Technical Details
                  </summary>
                  <div className="mt-2 p-2 bg-gray-100 rounded text-gray-700 font-mono">
                    <div>
                      <strong>Message:</strong> {error.message}
                    </div>
                    {error.stack && (
                      <div className="mt-1">
                        <strong>Stack:</strong>
                        <pre className="text-xs mt-1 overflow-auto max-h-32">
                          {error.stack.split("\n").slice(0, 5).join("\n")}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppRecoverySystem;
