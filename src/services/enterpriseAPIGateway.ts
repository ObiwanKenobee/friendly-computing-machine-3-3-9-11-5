import { enterpriseAuthService } from "./enterpriseAuthService";
import { enterprisePaymentService } from "./enterprisePaymentService";
import { concurrentDataProcessor } from "./concurrentDataProcessor";
import { ciscoXDRService } from "./ciscoXDRService";

export interface APIEndpoint {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  handler: (request: APIRequest) => Promise<APIResponse>;
  auth: boolean;
  permissions?: string[];
  rateLimit?: {
    requests: number;
    period: number; // in seconds
  };
  cache?: {
    enabled: boolean;
    ttl: number; // in seconds
  };
}

export interface APIRequest {
  path: string;
  method: string;
  headers: Record<string, string>;
  query: Record<string, any>;
  body: any;
  user?: any;
  ip: string;
  userAgent: string;
}

export interface APIResponse {
  status: number;
  data?: any;
  error?: string;
  headers?: Record<string, string>;
}

export interface LoadBalancerNode {
  id: string;
  url: string;
  weight: number;
  isHealthy: boolean;
  activeConnections: number;
  maxConnections: number;
  responseTime: number;
  lastHealthCheck: Date;
}

export interface CacheEntry {
  key: string;
  data: any;
  createdAt: Date;
  ttl: number;
  hits: number;
}

export interface RateLimitEntry {
  key: string;
  requests: number;
  resetTime: Date;
}

export interface APIMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  errorRate: number;
  cacheHitRate: number;
  rateLimitViolations: number;
  topEndpoints: Array<{
    path: string;
    requests: number;
    avgResponseTime: number;
  }>;
}

class EnterpriseAPIGateway {
  private endpoints: Map<string, APIEndpoint> = new Map();
  private loadBalancerNodes: LoadBalancerNode[] = [];
  private cache: Map<string, CacheEntry> = new Map();
  private rateLimits: Map<string, RateLimitEntry> = new Map();
  private metrics: APIMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    errorRate: 0,
    cacheHitRate: 0,
    rateLimitViolations: 0,
    topEndpoints: [],
  };
  private requestTimes: number[] = [];
  private isHealthCheckRunning = false;

  constructor() {
    this.initializeEndpoints();
    this.initializeLoadBalancer();
    this.startHealthChecks();
    this.startCacheCleanup();
  }

  // API Request Handling
  async handleRequest(request: APIRequest): Promise<APIResponse> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    try {
      // Security validation
      await this.validateSecurity(request);

      // Rate limiting
      if (!(await this.checkRateLimit(request))) {
        this.metrics.rateLimitViolations++;
        return {
          status: 429,
          error: "Rate limit exceeded",
        };
      }

      // Authentication
      const endpoint = this.findEndpoint(request.path, request.method);
      if (!endpoint) {
        return {
          status: 404,
          error: "Endpoint not found",
        };
      }

      if (endpoint.auth) {
        const authResult = await this.authenticateRequest(request);
        if (!authResult.success) {
          return {
            status: 401,
            error: authResult.error || "Authentication failed",
          };
        }
        request.user = authResult.user;
      }

      // Authorization
      if (endpoint.permissions && request.user) {
        if (
          !(await this.authorizeRequest(request.user, endpoint.permissions))
        ) {
          return {
            status: 403,
            error: "Insufficient permissions",
          };
        }
      }

      // Cache check
      const cacheKey = this.generateCacheKey(request);
      if (endpoint.cache?.enabled) {
        const cachedResponse = this.getFromCache(cacheKey);
        if (cachedResponse) {
          this.updateMetrics(startTime, true, true);
          return cachedResponse;
        }
      }

      // Load balancing for external services
      const node = this.selectLoadBalancerNode();
      if (node) {
        node.activeConnections++;
      }

      try {
        // Execute endpoint handler
        const response = await endpoint.handler(request);

        // Cache response if enabled
        if (endpoint.cache?.enabled && response.status === 200) {
          this.setCache(cacheKey, response, endpoint.cache.ttl);
        }

        this.updateMetrics(startTime, true, false);
        this.metrics.successfulRequests++;

        return response;
      } finally {
        if (node) {
          node.activeConnections--;
        }
      }
    } catch (error) {
      console.error("API Gateway error:", error);
      this.updateMetrics(startTime, false, false);
      this.metrics.failedRequests++;

      return {
        status: 500,
        error: "Internal server error",
      };
    }
  }

  // Endpoint Registration
  registerEndpoint(endpoint: APIEndpoint): void {
    const key = `${endpoint.method}:${endpoint.path}`;
    this.endpoints.set(key, endpoint);
    console.log(`Registered endpoint: ${key}`);
  }

  private initializeEndpoints(): void {
    // Authentication endpoints
    this.registerEndpoint({
      path: "/api/auth/login",
      method: "POST",
      handler: this.handleLogin.bind(this),
      auth: false,
    });

    this.registerEndpoint({
      path: "/api/auth/logout",
      method: "POST",
      handler: this.handleLogout.bind(this),
      auth: true,
    });

    this.registerEndpoint({
      path: "/api/auth/session",
      method: "GET",
      handler: this.handleGetSession.bind(this),
      auth: true,
      cache: { enabled: true, ttl: 300 },
    });

    // Payment endpoints
    this.registerEndpoint({
      path: "/api/payments/tiers",
      method: "GET",
      handler: this.handleGetPricingTiers.bind(this),
      auth: false,
      cache: { enabled: true, ttl: 3600 },
    });

    this.registerEndpoint({
      path: "/api/payments/process",
      method: "POST",
      handler: this.handleProcessPayment.bind(this),
      auth: true,
      permissions: ["payment:create"],
    });

    this.registerEndpoint({
      path: "/api/payments/subscription",
      method: "GET",
      handler: this.handleGetSubscription.bind(this),
      auth: true,
      cache: { enabled: true, ttl: 300 },
    });

    // Analytics endpoints
    this.registerEndpoint({
      path: "/api/analytics/dashboard",
      method: "GET",
      handler: this.handleGetDashboard.bind(this),
      auth: true,
      permissions: ["analytics:read"],
      rateLimit: { requests: 60, period: 60 },
    });

    this.registerEndpoint({
      path: "/api/analytics/metrics",
      method: "GET",
      handler: this.handleGetMetrics.bind(this),
      auth: true,
      permissions: ["analytics:read"],
    });

    // Processing endpoints
    this.registerEndpoint({
      path: "/api/processing/task",
      method: "POST",
      handler: this.handleCreateTask.bind(this),
      auth: true,
      permissions: ["processing:create"],
    });

    this.registerEndpoint({
      path: "/api/processing/status",
      method: "GET",
      handler: this.handleGetProcessingStatus.bind(this),
      auth: true,
      permissions: ["processing:read"],
    });

    // Security endpoints
    this.registerEndpoint({
      path: "/api/security/metrics",
      method: "GET",
      handler: this.handleGetSecurityMetrics.bind(this),
      auth: true,
      permissions: ["security:read"],
    });

    // Global/Language endpoints
    this.registerEndpoint({
      path: "/api/global/languages",
      method: "GET",
      handler: this.handleGetLanguages.bind(this),
      auth: false,
      cache: { enabled: true, ttl: 3600 },
    });
  }

  // Load Balancer
  private initializeLoadBalancer(): void {
    this.loadBalancerNodes = [
      {
        id: "primary",
        url: "https://api-primary.quantumvest.com",
        weight: 3,
        isHealthy: true,
        activeConnections: 0,
        maxConnections: 100,
        responseTime: 0,
        lastHealthCheck: new Date(),
      },
      {
        id: "secondary",
        url: "https://api-secondary.quantumvest.com",
        weight: 2,
        isHealthy: true,
        activeConnections: 0,
        maxConnections: 50,
        responseTime: 0,
        lastHealthCheck: new Date(),
      },
      {
        id: "backup",
        url: "https://api-backup.quantumvest.com",
        weight: 1,
        isHealthy: true,
        activeConnections: 0,
        maxConnections: 25,
        responseTime: 0,
        lastHealthCheck: new Date(),
      },
    ];
  }

  private selectLoadBalancerNode(): LoadBalancerNode | null {
    const healthyNodes = this.loadBalancerNodes.filter(
      (node) => node.isHealthy && node.activeConnections < node.maxConnections,
    );

    if (healthyNodes.length === 0) return null;

    // Weighted round-robin selection
    const totalWeight = healthyNodes.reduce(
      (sum, node) => sum + node.weight,
      0,
    );
    let random = Math.random() * totalWeight;

    for (const node of healthyNodes) {
      random -= node.weight;
      if (random <= 0) {
        return node;
      }
    }

    return healthyNodes[0]; // Fallback
  }

  // Health Checks
  private startHealthChecks(): void {
    if (this.isHealthCheckRunning) return;

    this.isHealthCheckRunning = true;
    setInterval(async () => {
      await this.performHealthChecks();
    }, 30000); // Every 30 seconds
  }

  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = this.loadBalancerNodes.map(async (node) => {
      try {
        const startTime = Date.now();

        // Simulate health check request
        const response = await fetch(`${node.url}/health`, {
          method: "GET",
          timeout: 5000,
        }).catch(() => null);

        const responseTime = Date.now() - startTime;
        node.responseTime = responseTime;
        node.lastHealthCheck = new Date();
        node.isHealthy = response ? response.ok : false;

        if (!node.isHealthy) {
          console.warn(`Node ${node.id} is unhealthy`);
        }
      } catch (error) {
        console.error(`Health check failed for node ${node.id}:`, error);
        node.isHealthy = false;
        node.lastHealthCheck = new Date();
      }
    });

    await Promise.allSettled(healthCheckPromises);
  }

  // Caching
  private generateCacheKey(request: APIRequest): string {
    const keyParts = [
      request.method,
      request.path,
      JSON.stringify(request.query),
      request.user?.id || "anonymous",
    ];
    return btoa(keyParts.join("|"));
  }

  private getFromCache(key: string): APIResponse | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = new Date();
    const expiresAt = new Date(entry.createdAt.getTime() + entry.ttl * 1000);

    if (now > expiresAt) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    return entry.data;
  }

  private setCache(key: string, data: APIResponse, ttl: number): void {
    this.cache.set(key, {
      key,
      data,
      createdAt: new Date(),
      ttl,
      hits: 0,
    });
  }

  private startCacheCleanup(): void {
    setInterval(() => {
      const now = new Date();

      for (const [key, entry] of this.cache.entries()) {
        const expiresAt = new Date(
          entry.createdAt.getTime() + entry.ttl * 1000,
        );
        if (now > expiresAt) {
          this.cache.delete(key);
        }
      }
    }, 300000); // Every 5 minutes
  }

  // Rate Limiting
  private async checkRateLimit(request: APIRequest): Promise<boolean> {
    const endpoint = this.findEndpoint(request.path, request.method);
    if (!endpoint?.rateLimit) return true;

    const key = `${request.ip}:${request.path}`;
    const now = new Date();
    const entry = this.rateLimits.get(key);

    if (!entry) {
      this.rateLimits.set(key, {
        key,
        requests: 1,
        resetTime: new Date(now.getTime() + endpoint.rateLimit.period * 1000),
      });
      return true;
    }

    if (now > entry.resetTime) {
      entry.requests = 1;
      entry.resetTime = new Date(
        now.getTime() + endpoint.rateLimit.period * 1000,
      );
      return true;
    }

    if (entry.requests >= endpoint.rateLimit.requests) {
      return false;
    }

    entry.requests++;
    return true;
  }

  // Security & Authentication
  private async validateSecurity(request: APIRequest): Promise<void> {
    // Log request for security monitoring
    await ciscoXDRService.logSecurityEvent({
      type: "api_request",
      details: {
        path: request.path,
        method: request.method,
        ip: request.ip,
        userAgent: request.userAgent,
      },
      timestamp: new Date(),
    });

    // Check for malicious patterns
    const maliciousPatterns = [
      /\<script\>/i,
      /javascript:/i,
      /\bunion\s+select\b/i,
      /\bselect\s+.*\bfrom\b/i,
    ];

    const requestString = JSON.stringify(request.body) + request.path;

    for (const pattern of maliciousPatterns) {
      if (pattern.test(requestString)) {
        throw new Error("Malicious request detected");
      }
    }
  }

  private async authenticateRequest(
    request: APIRequest,
  ): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
          success: false,
          error: "Missing or invalid authorization header",
        };
      }

      const token = authHeader.substring(7);
      const session = await enterpriseAuthService.validateSession(token);

      if (!session) {
        return { success: false, error: "Invalid or expired token" };
      }

      return { success: true, user: session.user };
    } catch (error) {
      return { success: false, error: "Authentication failed" };
    }
  }

  private async authorizeRequest(
    user: any,
    requiredPermissions: string[],
  ): Promise<boolean> {
    if (!user.permissions) return false;

    return requiredPermissions.every(
      (permission) =>
        user.permissions.includes(permission) ||
        user.permissions.includes("admin:all"),
    );
  }

  // Endpoint Handlers
  private async handleLogin(request: APIRequest): Promise<APIResponse> {
    try {
      const { email, password, mfaCode, biometricData } = request.body;

      const session = await enterpriseAuthService.login({
        email,
        password,
        mfaCode,
        biometricData,
      });

      return {
        status: 200,
        data: {
          token: session.token,
          user: session.user,
          expiresAt: session.expiresAt,
        },
      };
    } catch (error) {
      return {
        status: 401,
        error: error.message,
      };
    }
  }

  private async handleLogout(request: APIRequest): Promise<APIResponse> {
    await enterpriseAuthService.logout();
    return { status: 200, data: { message: "Logged out successfully" } };
  }

  private async handleGetSession(request: APIRequest): Promise<APIResponse> {
    return {
      status: 200,
      data: { user: request.user },
    };
  }

  private async handleGetPricingTiers(
    request: APIRequest,
  ): Promise<APIResponse> {
    const tiers = enterprisePaymentService.getPricingTiers();
    return { status: 200, data: tiers };
  }

  private async handleProcessPayment(
    request: APIRequest,
  ): Promise<APIResponse> {
    try {
      const { plan, paymentMethod, paymentData } = request.body;

      const result = await enterprisePaymentService.processPayment(
        request.user.id,
        plan,
        paymentMethod,
        paymentData,
      );

      return { status: 200, data: result };
    } catch (error) {
      return { status: 400, error: error.message };
    }
  }

  private async handleGetSubscription(
    request: APIRequest,
  ): Promise<APIResponse> {
    try {
      const subscription = await enterprisePaymentService.getSubscriptionStatus(
        request.user.id,
      );
      return { status: 200, data: subscription };
    } catch (error) {
      return { status: 500, error: error.message };
    }
  }

  private async handleGetDashboard(request: APIRequest): Promise<APIResponse> {
    // Return mock dashboard data - integrate with actual services
    return {
      status: 200,
      data: {
        security: await ciscoXDRService.getSecurityMetrics(),
        payments: await enterprisePaymentService.getEnterpriseAnalytics(),
        processing: concurrentDataProcessor.getProcessingStats(),
      },
    };
  }

  private async handleGetMetrics(request: APIRequest): Promise<APIResponse> {
    return { status: 200, data: this.metrics };
  }

  private async handleCreateTask(request: APIRequest): Promise<APIResponse> {
    try {
      const { type, data, priority } = request.body;

      const taskId = await concurrentDataProcessor.addTask({
        type,
        data,
        priority: priority || "medium",
      });

      return { status: 201, data: { taskId } };
    } catch (error) {
      return { status: 400, error: error.message };
    }
  }

  private async handleGetProcessingStatus(
    request: APIRequest,
  ): Promise<APIResponse> {
    const stats = concurrentDataProcessor.getProcessingStats();
    const queueStatus = concurrentDataProcessor.getQueueStatus();

    return {
      status: 200,
      data: { stats, queueStatus },
    };
  }

  private async handleGetSecurityMetrics(
    request: APIRequest,
  ): Promise<APIResponse> {
    try {
      const metrics = await ciscoXDRService.getSecurityMetrics();
      return { status: 200, data: metrics };
    } catch (error) {
      return { status: 500, error: error.message };
    }
  }

  private async handleGetLanguages(request: APIRequest): Promise<APIResponse> {
    // Mock language data - integrate with globalLanguageService
    return {
      status: 200,
      data: {
        supportedLanguages: 7000,
        activeLanguages: 342,
        topLanguages: ["en", "es", "fr", "de", "zh", "ja", "ko"],
      },
    };
  }

  // Utility Methods
  private findEndpoint(path: string, method: string): APIEndpoint | undefined {
    const key = `${method}:${path}`;
    return this.endpoints.get(key);
  }

  private updateMetrics(
    startTime: number,
    success: boolean,
    fromCache: boolean,
  ): void {
    const responseTime = Date.now() - startTime;
    this.requestTimes.push(responseTime);

    // Keep only last 1000 response times for rolling average
    if (this.requestTimes.length > 1000) {
      this.requestTimes = this.requestTimes.slice(-1000);
    }

    this.metrics.avgResponseTime =
      this.requestTimes.reduce((a, b) => a + b, 0) / this.requestTimes.length;
    this.metrics.errorRate =
      this.metrics.failedRequests / this.metrics.totalRequests;

    // Update cache hit rate
    if (fromCache) {
      const totalCacheableRequests =
        this.metrics.successfulRequests + (success ? 1 : 0);
      const cacheHits = Array.from(this.cache.values()).reduce(
        (sum, entry) => sum + entry.hits,
        0,
      );
      this.metrics.cacheHitRate =
        totalCacheableRequests > 0 ? cacheHits / totalCacheableRequests : 0;
    }
  }

  // Public API
  getMetrics(): APIMetrics {
    return { ...this.metrics };
  }

  getLoadBalancerStatus(): LoadBalancerNode[] {
    return [...this.loadBalancerNodes];
  }

  getCacheStats(): { size: number; hitRate: number; totalHits: number } {
    const entries = Array.from(this.cache.values());
    const totalHits = entries.reduce((sum, entry) => sum + entry.hits, 0);

    return {
      size: this.cache.size,
      hitRate: this.metrics.cacheHitRate,
      totalHits,
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgResponseTime: 0,
      errorRate: 0,
      cacheHitRate: 0,
      rateLimitViolations: 0,
      topEndpoints: [],
    };
    this.requestTimes = [];
  }
}

export const enterpriseAPIGateway = new EnterpriseAPIGateway();
