/**
 * Serverless Functions Integration Service
 * Client-side service to interact with serverless infrastructure APIs
 */

interface ServerlessAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
  requestId?: string;
}

interface InfrastructureStatus {
  timestamp: number;
  regions: Array<{
    id: string;
    name: string;
    status: "healthy" | "degraded" | "offline";
    latency: number;
    load: number;
    connections: number;
    lastOptimized: number;
  }>;
  engines: Array<{
    id: string;
    type: "routing" | "processing" | "storage" | "analytics";
    status: "active" | "idle" | "optimizing";
    score: number;
    position: { x: number; y: number };
    target: string | null;
    efficiency: number;
  }>;
  metrics: {
    totalOptimizations: number;
    averageLatency: number;
    averageLoad: number;
    uptime: number;
    performanceScore: number;
  };
  alerts: Array<{
    id: string;
    type: "warning" | "error" | "info";
    message: string;
    timestamp: number;
    resolved: boolean;
  }>;
}

interface EngineControlRequest {
  action: "start" | "stop" | "restart" | "optimize" | "target" | "configure";
  engineId?: string;
  targetRegion?: string;
  configuration?: {
    speed?: number;
    aggressiveness?: number;
    strategy?: "balanced" | "performance" | "efficiency";
  };
}

interface OptimizationRequest {
  userLocation?: {
    lat: number;
    lng: number;
  };
  contentType?: "api" | "static" | "dynamic" | "enterprise";
  currentPerformance?: {
    latency: number;
    load: number;
  };
  preferences?: {
    prioritizeCost: boolean;
    prioritizeSpeed: boolean;
    prioritizeReliability: boolean;
  };
}

export class ServerlessFunctionsService {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl =
      baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
    this.apiKey = apiKey;
  }

  /**
   * Get real-time infrastructure status
   */
  async getInfrastructureStatus(): Promise<InfrastructureStatus | null> {
    try {
      const response = await this.makeRequest<InfrastructureStatus>(
        "/api/infrastructure/status",
      );
      return response.data || null;
    } catch (error) {
      console.error("Failed to get infrastructure status:", error);
      return null;
    }
  }

  /**
   * Control infrastructure engines
   */
  async controlEngine(request: EngineControlRequest): Promise<any> {
    try {
      const response = await this.makeRequest("/api/infrastructure/control", {
        method: "POST",
        body: JSON.stringify(request),
      });
      return response;
    } catch (error) {
      console.error("Failed to control engine:", error);
      return { success: false, error: "Failed to control engine" };
    }
  }

  /**
   * Get performance analytics
   */
  async getAnalytics(
    timeRange: "1h" | "24h" | "7d" | "30d" = "24h",
    detailed = false,
  ): Promise<any> {
    try {
      const params = new URLSearchParams({
        timeRange,
        detailed: detailed.toString(),
      });

      const response = await this.makeRequest(
        `/api/infrastructure/analytics?${params}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get analytics:", error);
      return null;
    }
  }

  /**
   * Get route optimization recommendations
   */
  async getOptimization(request: OptimizationRequest = {}): Promise<any> {
    try {
      const response = await this.makeRequest("/api/infrastructure/optimize", {
        method: "POST",
        body: JSON.stringify(request),
      });
      return response;
    } catch (error) {
      console.error("Failed to get optimization:", error);
      return null;
    }
  }

  /**
   * Start all engines
   */
  async startAllEngines(): Promise<any> {
    return this.controlEngine({ action: "start" });
  }

  /**
   * Stop all engines
   */
  async stopAllEngines(): Promise<any> {
    return this.controlEngine({ action: "stop" });
  }

  /**
   * Optimize specific engine
   */
  async optimizeEngine(engineId: string): Promise<any> {
    return this.controlEngine({ action: "optimize", engineId });
  }

  /**
   * Target specific region with engine
   */
  async targetRegion(engineId: string, targetRegion: string): Promise<any> {
    return this.controlEngine({ action: "target", engineId, targetRegion });
  }

  /**
   * Configure engine settings
   */
  async configureEngine(
    engineId: string,
    configuration: {
      speed?: number;
      aggressiveness?: number;
      strategy?: "balanced" | "performance" | "efficiency";
    },
  ): Promise<any> {
    return this.controlEngine({ action: "configure", engineId, configuration });
  }

  /**
   * Get user's optimal route based on location
   */
  async getOptimalRoute(userLocation?: {
    lat: number;
    lng: number;
  }): Promise<any> {
    return this.getOptimization({
      userLocation,
      contentType: "dynamic",
      preferences: {
        prioritizeSpeed: true,
        prioritizeReliability: true,
        prioritizeCost: false,
      },
    });
  }

  /**
   * Get performance metrics summary
   */
  async getPerformanceSummary(): Promise<{
    totalOptimizations: number;
    averageImprovement: number;
    systemHealth: number;
    activeEngines: number;
  } | null> {
    try {
      const [status, analytics] = await Promise.all([
        this.getInfrastructureStatus(),
        this.getAnalytics("24h"),
      ]);

      if (!status || !analytics) return null;

      return {
        totalOptimizations: analytics.summary?.totalOptimizations || 0,
        averageImprovement: analytics.summary?.averageImprovement || 0,
        systemHealth: status.metrics?.performanceScore || 0,
        activeEngines:
          status.engines?.filter((e: any) => e.status === "active").length || 0,
      };
    } catch (error) {
      console.error("Failed to get performance summary:", error);
      return null;
    }
  }

  /**
   * Monitor infrastructure in real-time
   */
  startRealTimeMonitoring(
    callback: (status: InfrastructureStatus) => void,
    interval = 30000, // 30 seconds
  ): () => void {
    const intervalId = setInterval(async () => {
      const status = await this.getInfrastructureStatus();
      if (status) {
        callback(status);
      }
    }, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }

  /**
   * Batch optimize all engines
   */
  async optimizeAllEngines(): Promise<any> {
    return this.controlEngine({ action: "optimize" });
  }

  /**
   * Get system health score
   */
  async getSystemHealth(): Promise<{
    overall: number;
    engines: number;
    regions: number;
    performance: number;
  } | null> {
    try {
      const status = await this.getInfrastructureStatus();
      if (!status) return null;

      const healthyRegions = status.regions.filter(
        (r) => r.status === "healthy",
      ).length;
      const activeEngines = status.engines.filter(
        (e) => e.status === "active",
      ).length;

      const regionHealth = (healthyRegions / status.regions.length) * 100;
      const engineHealth = (activeEngines / status.engines.length) * 100;
      const performanceHealth = status.metrics.performanceScore;

      const overall = (regionHealth + engineHealth + performanceHealth) / 3;

      return {
        overall: Math.round(overall),
        engines: Math.round(engineHealth),
        regions: Math.round(regionHealth),
        performance: Math.round(performanceHealth),
      };
    } catch (error) {
      console.error("Failed to get system health:", error);
      return null;
    }
  }

  /**
   * Get optimization recommendations for current session
   */
  async getSessionOptimizations(): Promise<string[]> {
    try {
      const optimization = await this.getOptimization();
      if (!optimization?.success) return [];

      const recommendations = [];

      if (optimization.analytics?.expectedImprovement > 20) {
        recommendations.push(
          `Switch to ${optimization.recommendations.primary.region} for ${optimization.analytics.expectedImprovement}% improvement`,
        );
      }

      if (optimization.recommendations.primary.estimatedLatency < 50) {
        recommendations.push(
          "Excellent performance expected with current routing",
        );
      }

      if (optimization.optimization?.cacheStrategy === "immutable") {
        recommendations.push("Static assets are optimally cached");
      }

      return recommendations;
    } catch (error) {
      console.error("Failed to get session optimizations:", error);
      return [];
    }
  }

  /**
   * Private method to make API requests
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ServerlessAPIResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

// Singleton instance
export const serverlessFunctions = new ServerlessFunctionsService();

// Export types for external use
export type {
  InfrastructureStatus,
  EngineControlRequest,
  OptimizationRequest,
  ServerlessAPIResponse,
};
