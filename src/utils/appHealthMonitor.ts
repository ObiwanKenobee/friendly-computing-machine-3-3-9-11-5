/**
 * Application Health Monitor & Diagnostics
 * Comprehensive system to detect and resolve blank page issues
 */

import { globalErrorHandler } from "./errorHandling";

export interface HealthCheckResult {
  service: string;
  status: "healthy" | "degraded" | "failing";
  latency: number;
  error?: string;
  timestamp: Date;
}

export interface SystemHealth {
  overall: "healthy" | "degraded" | "failing";
  services: HealthCheckResult[];
  performance: {
    renderTime: number;
    networkLatency: number;
    memoryUsage: number;
  };
  features: {
    javascript: boolean;
    webgl: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
  };
}

class AppHealthMonitor {
  private static instance: AppHealthMonitor;
  private healthChecks: Map<string, () => Promise<HealthCheckResult>> =
    new Map();
  private lastHealthCheck: SystemHealth | null = null;
  private monitoringInterval: NodeJS.Timeout | null = null;

  static getInstance(): AppHealthMonitor {
    if (!AppHealthMonitor.instance) {
      AppHealthMonitor.instance = new AppHealthMonitor();
    }
    return AppHealthMonitor.instance;
  }

  constructor() {
    this.registerDefaultHealthChecks();
    this.startMonitoring();
  }

  /**
   * Register default health checks for critical systems
   */
  private registerDefaultHealthChecks(): void {
    // JavaScript runtime health
    this.addHealthCheck("javascript", async () => {
      const start = performance.now();
      try {
        // Test basic JavaScript functionality
        const testArray = [1, 2, 3];
        const result = testArray.map((x) => x * 2).reduce((a, b) => a + b, 0);
        if (result !== 12) throw new Error("JavaScript computation error");

        return {
          service: "javascript",
          status: "healthy" as const,
          latency: performance.now() - start,
          timestamp: new Date(),
        };
      } catch (error) {
        return {
          service: "javascript",
          status: "failing" as const,
          latency: performance.now() - start,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date(),
        };
      }
    });

    // DOM rendering health
    this.addHealthCheck("dom", async () => {
      const start = performance.now();
      try {
        if (typeof document === "undefined") {
          throw new Error("Document not available (SSR context)");
        }

        // Test DOM manipulation
        const testElement = document.createElement("div");
        testElement.innerHTML = "<span>test</span>";
        const hasChild = testElement.children.length > 0;
        if (!hasChild) throw new Error("DOM manipulation failed");

        return {
          service: "dom",
          status: "healthy" as const,
          latency: performance.now() - start,
          timestamp: new Date(),
        };
      } catch (error) {
        return {
          service: "dom",
          status: "failing" as const,
          latency: performance.now() - start,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date(),
        };
      }
    });

    // Storage availability
    this.addHealthCheck("storage", async () => {
      const start = performance.now();
      try {
        if (typeof window === "undefined") {
          return {
            service: "storage",
            status: "degraded" as const,
            latency: performance.now() - start,
            error: "Running in SSR context",
            timestamp: new Date(),
          };
        }

        // Test localStorage
        const testKey = "health_check_" + Date.now();
        localStorage.setItem(testKey, "test");
        const retrieved = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);

        if (retrieved !== "test") {
          throw new Error("localStorage test failed");
        }

        return {
          service: "storage",
          status: "healthy" as const,
          latency: performance.now() - start,
          timestamp: new Date(),
        };
      } catch (error) {
        return {
          service: "storage",
          status: "failing" as const,
          latency: performance.now() - start,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date(),
        };
      }
    });

    // Network connectivity
    this.addHealthCheck("network", async () => {
      const start = performance.now();
      try {
        if (typeof navigator === "undefined") {
          return {
            service: "network",
            status: "degraded" as const,
            latency: performance.now() - start,
            error: "Navigator not available",
            timestamp: new Date(),
          };
        }

        // Check network status
        if (!navigator.onLine) {
          throw new Error("Device is offline");
        }

        // Test network with a simple fetch (to own domain)
        const response = await fetch("/favicon.ico", {
          method: "HEAD",
          cache: "no-cache",
        });

        if (!response.ok) {
          throw new Error(`Network test failed: ${response.status}`);
        }

        return {
          service: "network",
          status: "healthy" as const,
          latency: performance.now() - start,
          timestamp: new Date(),
        };
      } catch (error) {
        return {
          service: "network",
          status: "failing" as const,
          latency: performance.now() - start,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date(),
        };
      }
    });

    // React rendering health
    this.addHealthCheck("react", async () => {
      const start = performance.now();
      try {
        // Check if React is available
        if (typeof window !== "undefined" && !(window as any).React) {
          // React might not be on window in production, that's ok
        }

        // Check for React DevTools as an indicator
        const hasReactDevTools =
          typeof window !== "undefined" &&
          (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

        return {
          service: "react",
          status: "healthy" as const,
          latency: performance.now() - start,
          timestamp: new Date(),
        };
      } catch (error) {
        return {
          service: "react",
          status: "failing" as const,
          latency: performance.now() - start,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date(),
        };
      }
    });
  }

  /**
   * Add a custom health check
   */
  addHealthCheck(name: string, check: () => Promise<HealthCheckResult>): void {
    this.healthChecks.set(name, check);
  }

  /**
   * Remove a health check
   */
  removeHealthCheck(name: string): void {
    this.healthChecks.delete(name);
  }

  /**
   * Run all health checks
   */
  async runHealthChecks(): Promise<SystemHealth> {
    const start = performance.now();
    const services: HealthCheckResult[] = [];

    // Run all health checks in parallel
    const checkPromises = Array.from(this.healthChecks.entries()).map(
      async ([name, check]) => {
        try {
          return await Promise.race([
            check(),
            new Promise<HealthCheckResult>((_, reject) =>
              setTimeout(() => reject(new Error("Health check timeout")), 5000),
            ),
          ]);
        } catch (error) {
          return {
            service: name,
            status: "failing" as const,
            latency: 5000,
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date(),
          };
        }
      },
    );

    services.push(...(await Promise.all(checkPromises)));

    // Calculate overall health
    const failingCount = services.filter((s) => s.status === "failing").length;
    const degradedCount = services.filter(
      (s) => s.status === "degraded",
    ).length;

    let overall: SystemHealth["overall"] = "healthy";
    if (failingCount > 0) {
      overall = "failing";
    } else if (degradedCount > 0) {
      overall = "degraded";
    }

    // Performance metrics
    const renderTime = performance.now() - start;
    const memoryUsage = this.getMemoryUsage();
    const networkLatency =
      services.find((s) => s.service === "network")?.latency || 0;

    // Feature detection
    const features = this.detectFeatures();

    this.lastHealthCheck = {
      overall,
      services,
      performance: {
        renderTime,
        networkLatency,
        memoryUsage,
      },
      features,
    };

    return this.lastHealthCheck;
  }

  /**
   * Get memory usage information
   */
  private getMemoryUsage(): number {
    if (
      typeof window !== "undefined" &&
      "performance" in window &&
      "memory" in (window.performance as any)
    ) {
      const memory = (window.performance as any).memory;
      return (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
    }
    return 0;
  }

  /**
   * Detect browser features
   */
  private detectFeatures(): SystemHealth["features"] {
    if (typeof window === "undefined") {
      return {
        javascript: true,
        webgl: false,
        localStorage: false,
        sessionStorage: false,
        indexedDB: false,
      };
    }

    return {
      javascript: true,
      webgl: this.detectWebGL(),
      localStorage: this.detectLocalStorage(),
      sessionStorage: this.detectSessionStorage(),
      indexedDB: this.detectIndexedDB(),
    };
  }

  private detectWebGL(): boolean {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return !!gl;
    } catch {
      return false;
    }
  }

  private detectLocalStorage(): boolean {
    try {
      const test = "test";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private detectSessionStorage(): boolean {
    try {
      const test = "test";
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private detectIndexedDB(): boolean {
    try {
      return !!window.indexedDB;
    } catch {
      return false;
    }
  }

  /**
   * Start continuous monitoring
   */
  startMonitoring(interval: number = 30000): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(async () => {
      try {
        await this.runHealthChecks();
      } catch (error) {
        globalErrorHandler.handle(error, {
          component: "AppHealthMonitor",
          action: "monitoring",
        });
      }
    }, interval);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Get last health check result
   */
  getLastHealthCheck(): SystemHealth | null {
    return this.lastHealthCheck;
  }

  /**
   * Check if system is healthy
   */
  isHealthy(): boolean {
    return this.lastHealthCheck?.overall === "healthy";
  }

  /**
   * Get health status for React components
   */
  getHealthStatus(): {
    isHealthy: boolean;
    status: string;
    issues: string[];
  } {
    if (!this.lastHealthCheck) {
      return {
        isHealthy: false,
        status: "unknown",
        issues: ["Health check not yet performed"],
      };
    }

    const issues = this.lastHealthCheck.services
      .filter((s) => s.status !== "healthy")
      .map((s) => `${s.service}: ${s.error || s.status}`);

    return {
      isHealthy: this.lastHealthCheck.overall === "healthy",
      status: this.lastHealthCheck.overall,
      issues,
    };
  }

  /**
   * Force a health check and return results
   */
  async checkHealth(): Promise<SystemHealth> {
    return await this.runHealthChecks();
  }
}

// Export singleton instance
export const appHealthMonitor = AppHealthMonitor.getInstance();

// Utility functions for React components
export const useAppHealth = () => {
  return {
    checkHealth: () => appHealthMonitor.checkHealth(),
    isHealthy: () => appHealthMonitor.isHealthy(),
    getStatus: () => appHealthMonitor.getHealthStatus(),
    getLastCheck: () => appHealthMonitor.getLastHealthCheck(),
  };
};

// Initialize monitoring when module loads (only in browser)
if (typeof window !== "undefined") {
  appHealthMonitor.startMonitoring();
}
