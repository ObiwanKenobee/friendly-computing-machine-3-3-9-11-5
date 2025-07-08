/**
 * Adaptive API Client for Hobby/Pro/Enterprise Plans
 * Provides intelligent routing, caching, and fallback mechanisms
 * that work within hobby plan constraints
 */

import { supabase } from "@/integrations/supabase/client";
import { getCurrentConfig } from "@/config/deploymentConfig";
import type { EdgeFunctionConfig } from "@/config/deploymentConfig";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface RequestOptions extends RequestInit {
  priority?: "high" | "normal" | "low";
  cache?: boolean;
  fallback?: boolean;
  region?: string;
}

export class AdaptiveAPIClient {
  private config = getCurrentConfig();
  private cache = new Map<string, CacheEntry<any>>();
  private requestQueue: Array<{
    url: string;
    options: RequestOptions;
    resolve: Function;
    reject: Function;
  }> = [];
  private isProcessingQueue = false;
  private healthStatus = new Map<string, boolean>();

  constructor() {
    // Initialize health monitoring for hobby plan reliability
    if (this.config.deployment.plan === "hobby") {
      this.startHealthMonitoring();
    }
  }

  // Main request method with intelligent routing
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, options);

    // Check cache first (important for hobby plan to reduce function calls)
    if (options.cache !== false) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // For hobby plan, use single-region strategy
    if (this.config.deployment.plan === "hobby") {
      return this.makeSingleRegionRequest<T>(endpoint, options, cacheKey);
    }

    // For pro/enterprise, use multi-region strategy
    return this.makeMultiRegionRequest<T>(endpoint, options, cacheKey);
  }

  // Single-region request with enhanced reliability for hobby plan
  private async makeSingleRegionRequest<T>(
    endpoint: string,
    options: RequestOptions,
    cacheKey: string,
  ): Promise<T> {
    const primaryRegion = this.config.deployment.regions[0];

    try {
      // Check if this is an edge function call
      if (endpoint.includes("/functions/v1/")) {
        return await this.callSupabaseFunction<T>(endpoint, options, cacheKey);
      }

      // Regular API call with retry logic
      const response = await this.makeRequestWithRetry(endpoint, options);
      const data = await response.json();

      // Cache successful responses
      if (options.cache !== false) {
        this.setCache(cacheKey, data, this.config.caching.ttl.api);
      }

      return data;
    } catch (error) {
      // Implement graceful degradation for hobby plan
      return this.handleRequestError<T>(endpoint, options, error, cacheKey);
    }
  }

  // Multi-region request for pro/enterprise plans
  private async makeMultiRegionRequest<T>(
    endpoint: string,
    options: RequestOptions,
    cacheKey: string,
  ): Promise<T> {
    const availableRegions = this.config.deployment.regions.filter(
      (r) => this.healthStatus.get(r.id) !== false,
    );

    // Try regions in order of preference
    for (const region of availableRegions) {
      try {
        const response = await this.makeRegionalRequest(
          endpoint,
          options,
          region.id,
        );
        const data = await response.json();

        if (options.cache !== false) {
          this.setCache(cacheKey, data, this.config.caching.ttl.api);
        }

        return data;
      } catch (error) {
        console.warn(`Request failed in region ${region.id}:`, error);
        continue;
      }
    }

    // All regions failed, use fallback
    return this.handleRequestError<T>(
      endpoint,
      options,
      new Error("All regions failed"),
      cacheKey,
    );
  }

  // Enhanced Supabase edge function calls with hobby plan optimizations
  private async callSupabaseFunction<T>(
    endpoint: string,
    options: RequestOptions,
    cacheKey: string,
  ): Promise<T> {
    const functionName = endpoint.split("/").pop() || "";
    const functionConfig = this.config.edgeFunctions.find(
      (f) => f.name === functionName,
    );

    try {
      const response = await supabase.functions.invoke(functionName, {
        body: options.body ? JSON.parse(options.body as string) : undefined,
        headers: options.headers as Record<string, string>,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Cache edge function responses for hobby plan efficiency
      if (options.cache !== false && functionConfig?.caching) {
        this.setCache(cacheKey, response.data, this.config.caching.ttl.api);
      }

      return response.data;
    } catch (error) {
      // For hobby plan, try to serve from cache if available
      if (this.config.deployment.plan === "hobby") {
        const staleData = this.getFromCache<T>(cacheKey, true); // Allow stale data
        if (staleData) {
          console.warn("Serving stale data due to function error:", error);
          return staleData;
        }
      }

      throw error;
    }
  }

  // Request with retry logic
  private async makeRequestWithRetry(
    url: string,
    options: RequestOptions,
    maxRetries: number = 3,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      this.config.loadBalancing.timeout,
    );

    try {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          });

          if (!response.ok) {
            if (attempt === maxRetries) {
              throw new Error(
                `HTTP ${response.status}: ${response.statusText}`,
              );
            }
            // Wait before retry with exponential backoff
            await new Promise((resolve) =>
              setTimeout(resolve, Math.pow(2, attempt) * 1000),
            );
            continue;
          }

          return response;
        } catch (error) {
          if (attempt === maxRetries) throw error;
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000),
          );
        }
      }

      throw new Error("Max retries exceeded");
    } finally {
      clearTimeout(timeout);
    }
  }

  // Error handling with graceful degradation
  private async handleRequestError<T>(
    endpoint: string,
    options: RequestOptions,
    error: any,
    cacheKey: string,
  ): Promise<T> {
    console.error("Request failed:", error);

    // Try to serve from cache (even stale data)
    const cachedData = this.getFromCache<T>(cacheKey, true);
    if (cachedData) {
      console.warn("Serving cached data due to request failure");
      return cachedData;
    }

    // For hobby plan, implement request queuing
    if (
      this.config.deployment.plan === "hobby" &&
      this.config.loadBalancing.fallbackBehavior === "queue"
    ) {
      return this.queueRequest<T>(endpoint, options);
    }

    // Provide default/mock data for critical endpoints
    if (endpoint.includes("health") || endpoint.includes("status")) {
      return this.getDefaultHealthData() as T;
    }

    throw error;
  }

  // Request queuing for hobby plan
  private async queueRequest<T>(
    endpoint: string,
    options: RequestOptions,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ url: endpoint, options, resolve, reject });

      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  // Process queued requests
  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const { url, options, resolve, reject } = this.requestQueue.shift()!;

      try {
        const result = await this.makeSingleRegionRequest(
          url,
          options,
          this.getCacheKey(url, options),
        );
        resolve(result);
      } catch (error) {
        reject(error);
      }

      // Small delay to prevent overwhelming the API
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.isProcessingQueue = false;
  }

  // Cache management
  private getCacheKey(endpoint: string, options: RequestOptions): string {
    const method = options.method || "GET";
    const body = options.body || "";
    return `${method}:${endpoint}:${body}`;
  }

  private getFromCache<T>(key: string, allowStale = false): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl * 1000;
    if (isExpired && !allowStale) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    // Limit cache size for hobby plan
    if (this.cache.size > 100 && this.config.deployment.plan === "hobby") {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Health monitoring for reliability
  private startHealthMonitoring(): void {
    setInterval(() => {
      this.checkRegionHealth();
    }, 30000); // Check every 30 seconds
  }

  private async checkRegionHealth(): Promise<void> {
    for (const region of this.config.deployment.regions) {
      try {
        const response = await fetch("/api/health", {
          method: "GET",
          signal: AbortSignal.timeout(5000),
        });
        this.healthStatus.set(region.id, response.ok);
      } catch {
        this.healthStatus.set(region.id, false);
      }
    }
  }

  private makeRegionalRequest(
    endpoint: string,
    options: RequestOptions,
    region: string,
  ): Promise<Response> {
    const regionalUrl = this.getRegionalUrl(endpoint, region);
    return this.makeRequestWithRetry(regionalUrl, options);
  }

  private getRegionalUrl(endpoint: string, region: string): string {
    // For hobby plan, always use the primary URL
    if (this.config.deployment.plan === "hobby") {
      return endpoint;
    }

    // For pro/enterprise, use regional URLs
    const baseUrl = this.getRegionalBaseUrl(region);
    return `${baseUrl}${endpoint}`;
  }

  private getRegionalBaseUrl(region: string): string {
    const regionConfig = this.config.deployment.regions.find(
      (r) => r.id === region,
    );
    return regionConfig
      ? `https://${regionConfig.code}.quantumvest.app`
      : "https://quantumvest.app";
  }

  private getDefaultHealthData() {
    return {
      status: "degraded",
      message: "Operating in fallback mode",
      timestamp: new Date().toISOString(),
    };
  }

  // Public methods for backward compatibility
  async get<T>(
    endpoint: string,
    options: Omit<RequestOptions, "method"> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    options: Omit<RequestOptions, "method"> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  // Edge function wrapper
  async callEdgeFunction<T>(functionName: string, data?: any): Promise<T> {
    return this.request<T>(`/functions/v1/${functionName}`, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const adaptiveApiClient = new AdaptiveAPIClient();
