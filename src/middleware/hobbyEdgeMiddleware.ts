/**
 * Hobby Plan Edge Functions Middleware
 * Optimizes edge function calls for single-region constraints
 * while preparing for multi-region scaling
 */

import { getCurrentConfig } from "@/config/deploymentConfig";
import { adaptiveApiClient } from "@/services/adaptiveApiClient";

interface EdgeFunctionRequest {
  functionName: string;
  payload: any;
  priority: "high" | "normal" | "low";
  cacheEnabled?: boolean;
  retryCount?: number;
}

interface EdgeFunctionResponse<T = any> {
  data: T;
  cached: boolean;
  region: string;
  responseTime: number;
  retryCount: number;
}

class HobbyEdgeMiddleware {
  private config = getCurrentConfig();
  private requestQueue: EdgeFunctionRequest[] = [];
  private activeRequests = new Set<string>();
  private rateLimitCounter = new Map<string, number>();
  private lastResetTime = Date.now();

  // Rate limiting for hobby plan (prevent hitting limits)
  private readonly RATE_LIMITS = {
    hobby: { requests: 500, window: 3600000 }, // 500 requests per hour
    pro: { requests: 5000, window: 3600000 },
    enterprise: { requests: 50000, window: 3600000 },
  };

  constructor() {
    this.startRateLimitReset();
    this.startQueueProcessor();
  }

  // Main edge function caller with hobby optimizations
  async callEdgeFunction<T>(
    request: EdgeFunctionRequest,
  ): Promise<EdgeFunctionResponse<T>> {
    const startTime = Date.now();
    const requestKey = `${request.functionName}:${JSON.stringify(request.payload)}`;

    // Check rate limits
    if (!this.checkRateLimit(request.functionName)) {
      return this.handleRateLimitExceeded<T>(request);
    }

    // For hobby plan, implement intelligent queueing
    if (this.config.deployment.plan === "hobby") {
      return this.handleHobbyRequest<T>(request, requestKey, startTime);
    }

    // For pro/enterprise, use direct calling with fallbacks
    return this.handleAdvancedRequest<T>(request, requestKey, startTime);
  }

  // Hobby plan specific handling
  private async handleHobbyRequest<T>(
    request: EdgeFunctionRequest,
    requestKey: string,
    startTime: number,
  ): Promise<EdgeFunctionResponse<T>> {
    // Check if similar request is already in progress
    if (this.activeRequests.has(requestKey)) {
      return this.queueRequest<T>(request, startTime);
    }

    // Priority-based execution
    if (request.priority === "low" && this.getActiveRequestCount() > 2) {
      return this.queueRequest<T>(request, startTime);
    }

    return this.executeEdgeFunction<T>(request, requestKey, startTime);
  }

  // Advanced request handling for pro/enterprise
  private async handleAdvancedRequest<T>(
    request: EdgeFunctionRequest,
    requestKey: string,
    startTime: number,
  ): Promise<EdgeFunctionResponse<T>> {
    return this.executeEdgeFunction<T>(request, requestKey, startTime);
  }

  // Execute the actual edge function call
  private async executeEdgeFunction<T>(
    request: EdgeFunctionRequest,
    requestKey: string,
    startTime: number,
  ): Promise<EdgeFunctionResponse<T>> {
    this.activeRequests.add(requestKey);
    this.incrementRateLimit(request.functionName);

    try {
      // Get the optimal region for this function
      const region = this.getOptimalRegion(request.functionName);

      // Make the actual call through adaptive client
      const data = await adaptiveApiClient.callEdgeFunction<T>(
        request.functionName,
        request.payload,
      );

      const responseTime = Date.now() - startTime;

      return {
        data,
        cached: false,
        region,
        responseTime,
        retryCount: request.retryCount || 0,
      };
    } catch (error) {
      return this.handleEdgeFunctionError<T>(request, error, startTime);
    } finally {
      this.activeRequests.delete(requestKey);
    }
  }

  // Handle edge function errors with graceful degradation
  private async handleEdgeFunctionError<T>(
    request: EdgeFunctionRequest,
    error: any,
    startTime: number,
  ): Promise<EdgeFunctionResponse<T>> {
    const retryCount = (request.retryCount || 0) + 1;

    // For hobby plan, be more conservative with retries
    const maxRetries = this.config.deployment.plan === "hobby" ? 2 : 5;

    if (retryCount <= maxRetries) {
      // Exponential backoff for retries
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      await new Promise((resolve) => setTimeout(resolve, delay));

      return this.callEdgeFunction<T>({
        ...request,
        retryCount,
      });
    }

    // Return fallback data or throw error based on plan
    if (this.config.deployment.plan === "hobby") {
      return this.getFallbackResponse<T>(request, startTime);
    }

    throw error;
  }

  // Queue request for later processing (hobby plan)
  private async queueRequest<T>(
    request: EdgeFunctionRequest,
    startTime: number,
  ): Promise<EdgeFunctionResponse<T>> {
    return new Promise((resolve, reject) => {
      const queuedRequest = {
        ...request,
        resolve,
        reject,
        startTime,
      } as any;

      // Insert based on priority
      if (request.priority === "high") {
        this.requestQueue.unshift(queuedRequest);
      } else {
        this.requestQueue.push(queuedRequest);
      }

      // Set timeout for queued requests
      setTimeout(() => {
        const index = this.requestQueue.indexOf(queuedRequest);
        if (index > -1) {
          this.requestQueue.splice(index, 1);
          resolve(this.getFallbackResponse<T>(request, startTime));
        }
      }, 30000); // 30 second timeout
    });
  }

  // Process queued requests
  private startQueueProcessor(): void {
    setInterval(async () => {
      if (this.requestQueue.length === 0) return;

      // For hobby plan, process one request at a time
      const concurrency = this.config.deployment.plan === "hobby" ? 1 : 3;
      const toProcess = this.requestQueue.splice(0, concurrency);

      for (const queuedRequest of toProcess) {
        try {
          const result = await this.executeEdgeFunction(
            queuedRequest,
            `${queuedRequest.functionName}:${JSON.stringify(queuedRequest.payload)}`,
            queuedRequest.startTime,
          );
          queuedRequest.resolve(result);
        } catch (error) {
          queuedRequest.reject(error);
        }
      }
    }, 1000); // Process every second
  }

  // Rate limiting management
  private checkRateLimit(functionName: string): boolean {
    const limit = this.RATE_LIMITS[this.config.deployment.plan];
    const currentCount = this.rateLimitCounter.get(functionName) || 0;

    return currentCount < limit.requests;
  }

  private incrementRateLimit(functionName: string): void {
    const current = this.rateLimitCounter.get(functionName) || 0;
    this.rateLimitCounter.set(functionName, current + 1);
  }

  private startRateLimitReset(): void {
    setInterval(() => {
      this.rateLimitCounter.clear();
      this.lastResetTime = Date.now();
    }, this.RATE_LIMITS[this.config.deployment.plan].window);
  }

  // Utility methods
  private getOptimalRegion(functionName: string): string {
    const functionConfig = this.config.edgeFunctions.find(
      (f) => f.name === functionName,
    );
    return functionConfig?.region || "us-east-1";
  }

  private getActiveRequestCount(): number {
    return this.activeRequests.size;
  }

  private async handleRateLimitExceeded<T>(
    request: EdgeFunctionRequest,
  ): Promise<EdgeFunctionResponse<T>> {
    console.warn(`Rate limit exceeded for ${request.functionName}`);

    // For hobby plan, queue the request
    if (this.config.deployment.plan === "hobby") {
      return this.queueRequest<T>(request, Date.now());
    }

    // For pro/enterprise, return cached data or error
    throw new Error(`Rate limit exceeded for ${request.functionName}`);
  }

  private getFallbackResponse<T>(
    request: EdgeFunctionRequest,
    startTime: number,
  ): EdgeFunctionResponse<T> {
    // Return mock/default data based on function type
    const fallbackData = this.generateFallbackData<T>(request.functionName);

    return {
      data: fallbackData,
      cached: true,
      region: "fallback",
      responseTime: Date.now() - startTime,
      retryCount: request.retryCount || 0,
    };
  }

  private generateFallbackData<T>(functionName: string): T {
    const fallbackMap: Record<string, any> = {
      "interaction-analytics": {
        sessions: [],
        metrics: { totalSessions: 0, activeUsers: 0 },
        status: "fallback",
      },
      "knowledge-ai": {
        insights: [],
        connections: [],
        status: "fallback",
      },
      "innovation-orchestrator": {
        recommendations: [],
        metrics: { innovations: 0, collaborations: 0 },
        status: "fallback",
      },
    };

    return fallbackMap[functionName] || { status: "fallback", data: null };
  }

  // Public interface methods
  async callInteractionAnalytics<T>(
    payload: any,
    priority: "high" | "normal" | "low" = "normal",
  ): Promise<T> {
    const response = await this.callEdgeFunction<T>({
      functionName: "interaction-analytics",
      payload,
      priority,
      cacheEnabled: true,
    });
    return response.data;
  }

  async callKnowledgeAI<T>(
    payload: any,
    priority: "high" | "normal" | "low" = "normal",
  ): Promise<T> {
    const response = await this.callEdgeFunction<T>({
      functionName: "knowledge-ai",
      payload,
      priority,
      cacheEnabled: true,
    });
    return response.data;
  }

  async callInnovationOrchestrator<T>(
    payload: any,
    priority: "high" | "normal" | "low" = "normal",
  ): Promise<T> {
    const response = await this.callEdgeFunction<T>({
      functionName: "innovation-orchestrator",
      payload,
      priority,
      cacheEnabled: true,
    });
    return response.data;
  }

  // Health and monitoring
  getHealthStatus() {
    const limit = this.RATE_LIMITS[this.config.deployment.plan];
    const totalUsage = Array.from(this.rateLimitCounter.values()).reduce(
      (sum, count) => sum + count,
      0,
    );

    return {
      plan: this.config.deployment.plan,
      rateLimit: {
        used: totalUsage,
        limit: limit.requests,
        remaining: limit.requests - totalUsage,
        resetTime: new Date(this.lastResetTime + limit.window).toISOString(),
      },
      queue: {
        pending: this.requestQueue.length,
        active: this.activeRequests.size,
      },
      status:
        totalUsage < limit.requests * 0.9 ? "healthy" : "approaching_limit",
    };
  }
}

export const hobbyEdgeMiddleware = new HobbyEdgeMiddleware();

// Export convenience methods
export const callInteractionAnalytics =
  hobbyEdgeMiddleware.callInteractionAnalytics.bind(hobbyEdgeMiddleware);
export const callKnowledgeAI =
  hobbyEdgeMiddleware.callKnowledgeAI.bind(hobbyEdgeMiddleware);
export const callInnovationOrchestrator =
  hobbyEdgeMiddleware.callInnovationOrchestrator.bind(hobbyEdgeMiddleware);
export const getEdgeHealthStatus =
  hobbyEdgeMiddleware.getHealthStatus.bind(hobbyEdgeMiddleware);
