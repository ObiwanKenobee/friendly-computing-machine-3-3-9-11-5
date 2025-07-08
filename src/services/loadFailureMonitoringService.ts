/**
 * Load Failure Monitoring and Prevention Service
 * Detects, tracks, and prevents cascading load failures in the QuantumVest platform
 */

interface LoadFailureEvent {
  id: string;
  timestamp: number;
  type: "component" | "route" | "service" | "asset";
  source: string;
  error: string;
  stackTrace?: string;
  userAgent: string;
  url: string;
}

interface LoadFailureMetrics {
  totalFailures: number;
  failuresInLast5Minutes: number;
  failuresInLastMinute: number;
  uniqueErrorTypes: Set<string>;
  cascadingFailureDetected: boolean;
  lastCascadingFailureTime: number;
}

class LoadFailureMonitoringService {
  private static instance: LoadFailureMonitoringService;
  private failures: LoadFailureEvent[] = [];
  private readonly maxFailureHistory = 1000;
  private readonly cascadingFailureThreshold = 10; // failures per minute - increased threshold
  private readonly monitoringInterval = 60000; // 60 seconds - less frequent monitoring
  private monitoringTimer: NodeJS.Timeout | null = null;
  private isEmergencyMode = false;

  private constructor() {
    this.startMonitoring();
    this.setupGlobalErrorHandlers();
  }

  public static getInstance(): LoadFailureMonitoringService {
    if (!LoadFailureMonitoringService.instance) {
      LoadFailureMonitoringService.instance =
        new LoadFailureMonitoringService();
    }
    return LoadFailureMonitoringService.instance;
  }

  private setupGlobalErrorHandlers(): void {
    // Capture script loading errors
    window.addEventListener(
      "error",
      (event) => {
        if (event.target && event.target !== window) {
          const target = event.target as HTMLElement;
          if (target.tagName === "SCRIPT" || target.tagName === "LINK") {
            this.recordLoadFailure({
              type: "asset",
              source:
                (target as HTMLScriptElement | HTMLLinkElement).src ||
                "unknown",
              error: `Failed to load ${target.tagName.toLowerCase()}: ${event.message}`,
              stackTrace: event.error?.stack,
            });
          }
        }

        // Also capture general JavaScript errors that might be module-related
        if (event.error && event.message) {
          const message = event.message.toLowerCase();
          if (
            message.includes("importing a module script failed") ||
            message.includes("failed to resolve module") ||
            message.includes("unexpected token") ||
            message.includes("syntax error")
          ) {
            this.recordLoadFailure({
              type: "component",
              source: event.filename || "unknown-module",
              error: `Module script error: ${event.message}`,
              stackTrace: event.error?.stack,
            });
          }
        }
      },
      true,
    );

    // Enhanced module loading error capture
    window.addEventListener("unhandledrejection", (event) => {
      const reason = event.reason;
      if (reason && typeof reason === "object" && "message" in reason) {
        const message = reason.message as string;
        const lowerMessage = message.toLowerCase();

        // Detect critical module loading failure patterns only
        if (
          lowerMessage.includes("failed to import") ||
          lowerMessage.includes("importing a module script failed") ||
          lowerMessage.includes("chunk load failed") ||
          lowerMessage.includes(
            "networkerror when attempting to fetch resource",
          )
        ) {
          this.recordLoadFailure({
            type: "service",
            source: this.extractModuleNameFromError(message),
            error: message,
            stackTrace: reason.stack,
          });
        }
      }
    });
  }

  private extractModuleNameFromError(errorMessage: string): string {
    // Try to extract module name from error message
    const patterns = [
      /Failed to import[:\s]+['"`]?([^'"`\s]+)/i,
      /Loading[:\s]+['"`]?([^'"`\s]+)/i,
      /Module[:\s]+['"`]?([^'"`\s]+)/i,
      /from[:\s]+['"`]?([^'"`\s]+)/i,
    ];

    for (const pattern of patterns) {
      const match = errorMessage.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return "unknown-module";
  }

  public recordLoadFailure(
    failure: Omit<LoadFailureEvent, "id" | "timestamp" | "userAgent" | "url">,
  ): void {
    const failureEvent: LoadFailureEvent = {
      ...failure,
      id: this.generateFailureId(),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.failures.push(failureEvent);

    // Maintain failure history size
    if (this.failures.length > this.maxFailureHistory) {
      this.failures = this.failures.slice(-this.maxFailureHistory);
    }

    console.warn("Load failure recorded:", {
      id: failureEvent.id,
      type: failureEvent.type,
      source: failureEvent.source,
      error: failureEvent.error,
    });

    // Check for cascading failures
    this.checkForCascadingFailures();
  }

  private checkForCascadingFailures(): void {
    const metrics = this.getMetrics();

    if (metrics.failuresInLastMinute >= this.cascadingFailureThreshold) {
      if (!metrics.cascadingFailureDetected) {
        console.error(
          "🚨 CASCADING FAILURE DETECTED - Activating emergency mode",
        );
        this.activateEmergencyMode();
      }
    }
  }

  private activateEmergencyMode(): void {
    this.isEmergencyMode = true;

    // Clear potential problematic intervals
    const highestId = setInterval(() => {}, 1);
    for (let i = 1; i < highestId; i++) {
      clearInterval(i);
    }

    // Clear potential problematic timeouts
    const highestTimeoutId = setTimeout(() => {}, 1);
    for (let i = 1; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }

    // Display emergency message
    this.displayEmergencyMessage();

    // Auto-recovery after 60 seconds
    setTimeout(() => {
      this.deactivateEmergencyMode();
    }, 60000);
  }

  private displayEmergencyMessage(): void {
    const existingMessage = document.getElementById("emergency-mode-banner");
    if (existingMessage) return;

    const banner = document.createElement("div");
    banner.id = "emergency-mode-banner";
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(90deg, #ff4444, #cc0000);
      color: white;
      padding: 12px 20px;
      text-align: center;
      font-family: Arial, sans-serif;
      font-weight: bold;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    banner.innerHTML = `
      🚨 Emergency Mode: System Stabilizing - Preventing Cascading Failures
      <button onclick="window.location.reload()" style="margin-left: 20px; padding: 4px 12px; background: white; color: #cc0000; border: none; border-radius: 4px; cursor: pointer;">
        Reload Page
      </button>
    `;

    document.body.insertBefore(banner, document.body.firstChild);
  }

  private deactivateEmergencyMode(): void {
    this.isEmergencyMode = false;
    const banner = document.getElementById("emergency-mode-banner");
    if (banner) {
      banner.remove();
    }
    console.log("Emergency mode deactivated - System stabilized");
  }

  public getMetrics(): LoadFailureMetrics {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    const oneMinuteAgo = now - 60 * 1000;

    const failuresInLast5Minutes = this.failures.filter(
      (f) => f.timestamp >= fiveMinutesAgo,
    ).length;
    const failuresInLastMinute = this.failures.filter(
      (f) => f.timestamp >= oneMinuteAgo,
    ).length;

    const uniqueErrorTypes = new Set(this.failures.map((f) => f.type));

    return {
      totalFailures: this.failures.length,
      failuresInLast5Minutes,
      failuresInLastMinute,
      uniqueErrorTypes,
      cascadingFailureDetected:
        failuresInLastMinute >= this.cascadingFailureThreshold,
      lastCascadingFailureTime: this.getLastCascadingFailureTime(),
    };
  }

  private getLastCascadingFailureTime(): number {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const recentFailures = this.failures.filter(
      (f) => f.timestamp >= oneMinuteAgo,
    );

    if (recentFailures.length >= this.cascadingFailureThreshold) {
      return Math.max(...recentFailures.map((f) => f.timestamp));
    }

    return 0;
  }

  private startMonitoring(): void {
    this.monitoringTimer = setInterval(() => {
      const metrics = this.getMetrics();

      if (metrics.cascadingFailureDetected && !this.isEmergencyMode) {
        this.activateEmergencyMode();
      }

      // Clean up old failures (older than 1 hour)
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      this.failures = this.failures.filter((f) => f.timestamp >= oneHourAgo);
    }, this.monitoringInterval);
  }

  private generateFailureId(): string {
    return `failure_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public isInEmergencyMode(): boolean {
    return this.isEmergencyMode;
  }

  public getFailureHistory(): LoadFailureEvent[] {
    return [...this.failures]; // Return copy to prevent mutation
  }

  public clearFailureHistory(): void {
    this.failures = [];
    console.log("Load failure history cleared");
  }

  public destroy(): void {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = null;
    }
    this.deactivateEmergencyMode();
  }
}

export default LoadFailureMonitoringService;
export { LoadFailureEvent, LoadFailureMetrics };
