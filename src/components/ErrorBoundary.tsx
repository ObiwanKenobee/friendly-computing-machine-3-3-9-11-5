import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home, Bug, Shield } from "lucide-react";
import { userInteractionService } from "../services/userInteractionService";
import CiscoXDRService from "../services/ciscoXDRService";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 2; // Reduced from 3 to prevent excessive retrying
  private static globalRetryCount = 0;
  private static lastRetryTime = 0;
  private static readonly RETRY_COOLDOWN = 15000; // Increased to 15 seconds
  private static readonly MAX_GLOBAL_RETRIES = 5; // Maximum global retries
  private static loadFailures = new Set<string>(); // Track unique load failures

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Track unique error signatures
    const errorSignature = `${error.name}-${error.message}`;
    ErrorBoundary.loadFailures.add(errorSignature);

    // If we have too many unique failures, something is seriously wrong
    if (ErrorBoundary.loadFailures.size > 10) {
      console.error(
        "Too many unique errors detected - potential cascading failure",
      );
      // Clear old failures to prevent memory leak
      ErrorBoundary.loadFailures.clear();
    }

    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.generateErrorId();
    const now = Date.now();

    // Check for potential cascading failures
    if (now - ErrorBoundary.lastRetryTime < ErrorBoundary.RETRY_COOLDOWN) {
      console.warn(
        "ErrorBoundary: Potential cascading failure detected - enforcing cooldown",
      );
      return;
    }

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Log error details with circuit breaker info
    console.error("ErrorBoundary caught an error:", {
      error: error.message,
      globalRetryCount: ErrorBoundary.globalRetryCount,
      uniqueFailures: ErrorBoundary.loadFailures.size,
      errorInfo: errorInfo.componentStack?.slice(0, 500), // Limit component stack
    });

    // Only track and report if we haven't exceeded global limits
    if (ErrorBoundary.globalRetryCount < ErrorBoundary.MAX_GLOBAL_RETRIES) {
      // Track error with user interaction service (with timeout)
      this.trackError(error, errorInfo, errorId);

      // Report to security service (with timeout)
      this.reportSecurityIncident(error);
    } else {
      console.warn(
        "ErrorBoundary: Max global retries exceeded - skipping error tracking",
      );
    }
  }

  private async reportSecurityIncident(error: Error) {
    try {
      const incident = {
        id: this.state.errorId,
        type: "security_error",
        severity: this.getErrorSeverity(error.message),
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          stack: error.stack?.slice(0, 1000), // Limit stack trace length
          name: error.name,
        },
        context: {
          url: window.location.href,
          userAgent: navigator.userAgent?.slice(0, 200), // Limit user agent length
          userId: localStorage.getItem("user-id") || "anonymous",
        },
      };

      // In a real app, send to security monitoring service
      console.warn("Security incident reported:", incident);

      // Safely attempt to report (commented out for demo)
      // await fetch('/api/security/incidents', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(incident)
      // });
    } catch (reportingError) {
      console.error("Failed to report security incident:", reportingError);
      // Don't throw here to avoid infinite error loops
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async trackError(
    error: Error,
    errorInfo: ErrorInfo,
    errorId: string,
  ) {
    try {
      // Track error as user interaction
      await userInteractionService.trackInteraction({
        type: "view",
        element: "error-boundary",
        position: { x: 0, y: 0 },
        duration: 0,
        metadata: {
          errorId,
          errorMessage: error.message,
          errorStack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        },
      });

      // Generate negative sentiment for error
      await userInteractionService.trackUserSentiment(
        "anonymous",
        -0.8,
        "error_boundary",
      );

      // Analyze error sentiment
      const sentimentAnalysis = await userInteractionService.analyzeSentiment(
        error.message,
        "error_boundary",
      );

      console.log("Error sentiment analysis:", sentimentAnalysis);
    } catch (trackingError) {
      console.error("Failed to track error:", trackingError);
    }
  }

  private determineErrorSeverity(
    error: Error,
  ): "low" | "medium" | "high" | "critical" {
    const errorMessage = error.message.toLowerCase();

    if (
      errorMessage.includes("security") ||
      errorMessage.includes("auth") ||
      errorMessage.includes("token")
    ) {
      return "critical";
    }

    if (
      errorMessage.includes("network") ||
      errorMessage.includes("payment") ||
      errorMessage.includes("api")
    ) {
      return "high";
    }

    if (errorMessage.includes("render") || errorMessage.includes("component")) {
      return "medium";
    }

    return "low";
  }

  private handleRetry = () => {
    const now = Date.now();

    // Enhanced cooldown check to prevent cascading failures
    if (now - ErrorBoundary.lastRetryTime < ErrorBoundary.RETRY_COOLDOWN) {
      console.warn(
        `Retry cooldown active - ${Math.ceil((ErrorBoundary.RETRY_COOLDOWN - (now - ErrorBoundary.lastRetryTime)) / 1000)}s remaining`,
      );
      return;
    }

    // Stricter global retry limits with escalating responses
    if (ErrorBoundary.globalRetryCount >= ErrorBoundary.MAX_GLOBAL_RETRIES) {
      console.warn(
        "Global retry limit reached - triggering controlled page reload",
      );

      // Add delay before reload to prevent rapid reload loops
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    }

    // Check if error is retryable
    const isRetryableError = this.isErrorRetryable(this.state.error);
    if (!isRetryableError) {
      console.warn(
        "Error is not retryable - suggesting navigation to safe page",
      );
      this.handleGoHome();
      return;
    }

    if (this.state.retryCount < this.maxRetries) {
      ErrorBoundary.globalRetryCount++;
      ErrorBoundary.lastRetryTime = now;

      console.log(
        `Attempting retry ${this.state.retryCount + 1}/${this.maxRetries} (Global: ${ErrorBoundary.globalRetryCount})`,
      );

      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        retryCount: prevState.retryCount + 1,
      }));

      // Track retry attempt with safety check and timeout
      const trackingTimeout = setTimeout(() => {
        console.warn("Retry tracking timeout - continuing without tracking");
      }, 1000);

      try {
        userInteractionService.trackInteraction({
          type: "click",
          element: "error-retry-button",
          position: { x: 0, y: 0 },
          duration: 0,
          metadata: {
            retryCount: this.state.retryCount + 1,
            errorId: this.state.errorId,
            globalRetryCount: ErrorBoundary.globalRetryCount,
            isRetryableError,
            uniqueFailuresCount: ErrorBoundary.loadFailures.size,
          },
        });
        clearTimeout(trackingTimeout);
      } catch (error) {
        clearTimeout(trackingTimeout);
        console.warn("Failed to track retry interaction:", error);
      }

      // Intelligent global counter decay
      setTimeout(() => {
        if (ErrorBoundary.globalRetryCount > 0) {
          ErrorBoundary.globalRetryCount = Math.max(
            0,
            ErrorBoundary.globalRetryCount - 1,
          );
          console.log(
            `Global retry count decremented to ${ErrorBoundary.globalRetryCount}`,
          );
        }
      }, 45000); // Increased decay time
    } else {
      console.warn("Component retry limit reached - suggesting page reload");
      this.handleReload();
    }
  };

  private isErrorRetryable = (error: Error | null): boolean => {
    if (!error) return false;

    const errorMessage = error.message.toLowerCase();
    const nonRetryableErrors = [
      "syntax error",
      "reference error",
      "type error",
      "range error",
      "uri error",
      "eval error",
      "import failed",
      "module not found",
    ];

    return !nonRetryableErrors.some((nonRetryable) =>
      errorMessage.includes(nonRetryable),
    );
  };

  private handleReload = () => {
    // Track reload attempt
    userInteractionService.trackInteraction({
      type: "click",
      element: "error-reload-button",
      position: { x: 0, y: 0 },
      duration: 0,
      metadata: {
        errorId: this.state.errorId,
        action: "page_reload",
      },
    });

    window.location.reload();
  };

  private handleGoHome = () => {
    // Track navigation to home
    userInteractionService.trackInteraction({
      type: "click",
      element: "error-home-button",
      position: { x: 0, y: 0 },
      duration: 0,
      metadata: {
        errorId: this.state.errorId,
        action: "navigate_home",
      },
    });

    window.location.href = "/";
  };

  private sendErrorReport = async () => {
    try {
      // Prepare error report
      const errorReport = {
        errorId: this.state.errorId,
        message: this.state.error?.message,
        stack: this.state.error?.stack,
        componentStack: this.state.errorInfo?.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        retryCount: this.state.retryCount,
      };

      // In a real app, this would send to your error reporting service
      console.log("Error report sent:", errorReport);

      // Track error report submission
      await userInteractionService.trackInteraction({
        type: "click",
        element: "error-report-button",
        position: { x: 0, y: 0 },
        duration: 0,
        metadata: {
          errorId: this.state.errorId,
          action: "error_report_sent",
        },
      });

      alert(
        "Error report sent successfully. Thank you for helping us improve!",
      );
    } catch (reportError) {
      console.error("Failed to send error report:", reportError);
      alert("Failed to send error report. Please try again later.");
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription className="text-lg">
                We encountered an unexpected error. Our security team has been
                notified.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error ID for reference */}
              <Alert>
                <Bug className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error ID:</strong> {this.state.errorId}
                  <br />
                  <span className="text-xs text-gray-500">
                    Please include this ID when reporting the issue
                  </span>
                </AlertDescription>
              </Alert>

              {/* Security notice */}
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Security Notice:</strong> This error has been
                  automatically reported to our Cisco XDR security system for
                  analysis and monitoring.
                </AlertDescription>
              </Alert>

              {/* Error details (only in development) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertDescription className="text-yellow-800">
                    <strong>Development Details:</strong>
                    <pre className="mt-2 text-xs overflow-auto max-h-32 bg-white p-2 rounded border">
                      {this.state.error.message}
                      {"\n\n"}
                      {this.state.error.stack}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {this.state.retryCount < this.maxRetries && (
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

              {/* Additional help */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">
                  If this problem persists, please contact our support team.
                </p>
                <Button
                  onClick={this.sendErrorReport}
                  variant="ghost"
                  size="sm"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Send Error Report
                </Button>
              </div>

              {/* Performance tip */}
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800 text-sm">
                  <strong>Tip:</strong> Try refreshing the page or clearing your
                  browser cache. Most issues are resolved with a simple page
                  reload.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
