/**
 * QuantumVest Enterprise API Client
 * Advanced HTTP client with error handling, retries, caching, and monitoring
 */

import type {
  User,
  Organization,
  Payment,
  Subscription,
  UserInteraction,
  SecurityEvent,
} from "../database/schema";

export interface APIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
  timestamp: Date;
  requestId: string;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTimeout?: number;
  headers?: Record<string, string>;
  auth?: boolean;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  filters?: Record<string, any>;
}

class APIClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private cache: Map<string, { data: any; expires: number }>;
  private retryDelays: number[] = [1000, 2000, 4000]; // Exponential backoff
  private requestInterceptors: Array<(config: RequestInit) => RequestInit> = [];
  private responseInterceptors: Array<
    (response: Response) => Response | Promise<Response>
  > = [];

  constructor(baseURL: string = "/api") {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "X-Client-Version": "2.1.0",
      "X-Platform": "quantumvest-enterprise",
    };
    this.cache = new Map();

    // Set up auth token interceptor
    this.addRequestInterceptor((config) => {
      const token = this.getAuthToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    });

    // Set up response monitoring
    this.addResponseInterceptor(async (response) => {
      // Track API performance
      const timing = performance.now();
      this.trackAPICall(response.url, response.status, timing);

      // Handle global error responses
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      return response;
    });
  }

  // Auth methods
  private getAuthToken(): string | null {
    return (
      localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    );
  }

  private setAuthToken(token: string, persistent: boolean = false): void {
    if (persistent) {
      localStorage.setItem("auth_token", token);
    } else {
      sessionStorage.setItem("auth_token", token);
    }
  }

  private clearAuthToken(): void {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  }

  // Interceptor methods
  addRequestInterceptor(
    interceptor: (config: RequestInit) => RequestInit,
  ): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(
    interceptor: (response: Response) => Response | Promise<Response>,
  ): void {
    this.responseInterceptors.push(interceptor);
  }

  // Core request method
  private async request<T>(
    endpoint: string,
    options: RequestInit & RequestConfig = {},
  ): Promise<APIResponse<T>> {
    const {
      timeout = 30000,
      retries = 3,
      cache = false,
      cacheTimeout = 5 * 60 * 1000, // 5 minutes
      auth = true,
      onProgress,
      ...fetchOptions
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${options.method || "GET"}:${url}:${JSON.stringify(options.body)}`;

    // Check cache first
    if (cache && options.method === "GET") {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() < cached.expires) {
        return cached.data;
      }
    }

    // Prepare request config
    let config: RequestInit = {
      ...fetchOptions,
      headers: {
        ...this.defaultHeaders,
        ...fetchOptions.headers,
      },
    };

    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      config = interceptor(config);
    }

    let lastError: Error | null = null;

    // Retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        config.signal = options.signal || controller.signal;

        let response = await fetch(url, config);
        clearTimeout(timeoutId);

        // Apply response interceptors
        for (const interceptor of this.responseInterceptors) {
          response = await interceptor(response);
        }

        if (!response.ok) {
          throw new APIError({
            code: `HTTP_${response.status}`,
            message: response.statusText,
            statusCode: response.status,
            timestamp: new Date(),
            requestId: response.headers.get("x-request-id") || "unknown",
          });
        }

        const data = await response.json();

        // Cache successful GET requests
        if (cache && options.method === "GET") {
          this.cache.set(cacheKey, {
            data,
            expires: Date.now() + cacheTimeout,
          });
        }

        return data;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (
          error instanceof APIError &&
          [401, 403, 404].includes(error.statusCode)
        ) {
          throw error;
        }

        // Don't retry on abort
        if (error instanceof DOMException && error.name === "AbortError") {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < retries) {
          const delay = this.retryDelays[attempt] || 4000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  // HTTP method helpers
  async get<T>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET", cache: true });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  // Paginated requests
  async getPaginated<T>(
    endpoint: string,
    params: PaginationParams = {},
    config?: RequestConfig,
  ): Promise<APIResponse<T[]>> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const url = searchParams.toString()
      ? `${endpoint}?${searchParams}`
      : endpoint;
    return this.get<T[]>(url, config);
  }

  // File upload with progress
  async uploadFile(
    endpoint: string,
    file: File,
    config?: RequestConfig & { onProgress?: (progress: number) => void },
  ): Promise<APIResponse<any>> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      // Progress tracking
      if (config?.onProgress) {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            config.onProgress!(progress);
          }
        });
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch {
            resolve({ data: xhr.responseText, success: true });
          }
        } else {
          reject(
            new APIError({
              code: `HTTP_${xhr.status}`,
              message: xhr.statusText,
              statusCode: xhr.status,
              timestamp: new Date(),
              requestId: xhr.getResponseHeader("x-request-id") || "unknown",
            }),
          );
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error occurred"));
      });

      xhr.addEventListener("timeout", () => {
        reject(new Error("Request timeout"));
      });

      // Set timeout
      xhr.timeout = config?.timeout || 30000;

      // Set headers
      const token = this.getAuthToken();
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.open("POST", `${this.baseURL}${endpoint}`);
      xhr.send(formData);
    });
  }

  // Batch requests
  async batch<T>(
    requests: Array<{ endpoint: string; method?: string; data?: any }>,
  ): Promise<APIResponse<T[]>> {
    return this.post<T[]>("/batch", { requests });
  }

  // Real-time subscriptions (WebSocket)
  subscribe(endpoint: string, callback: (data: any) => void): () => void {
    const wsUrl = `${this.baseURL.replace("http", "ws")}${endpoint}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error("WebSocket message parse error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Return unsubscribe function
    return () => {
      ws.close();
    };
  }

  // Error handling
  private async handleErrorResponse(response: Response): Promise<void> {
    let errorData: any = {};

    try {
      errorData = await response.json();
    } catch {
      // Response body is not JSON
    }

    // Handle specific error cases
    switch (response.status) {
      case 401:
        this.clearAuthToken();
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        break;
      case 403:
        window.dispatchEvent(new CustomEvent("auth:forbidden"));
        break;
      case 429:
        // Rate limited - implement backoff
        const retryAfter = response.headers.get("retry-after");
        if (retryAfter) {
          await new Promise((resolve) =>
            setTimeout(resolve, parseInt(retryAfter) * 1000),
          );
        }
        break;
    }

    throw new APIError({
      code: errorData.code || `HTTP_${response.status}`,
      message: errorData.message || response.statusText,
      details: errorData.details,
      statusCode: response.status,
      timestamp: new Date(),
      requestId: response.headers.get("x-request-id") || "unknown",
    });
  }

  // Performance tracking
  private trackAPICall(url: string, status: number, duration: number): void {
    // Send to analytics service
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "api_call", {
        event_category: "API",
        event_label: url,
        value: Math.round(duration),
        custom_map: {
          status_code: status,
        },
      });
    }
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  // Authentication API methods
  async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<APIResponse<{ user: User; token: string }>> {
    const response = await this.post<{ user: User; token: string }>(
      "/auth/login",
      {
        email,
        password,
      },
      { auth: false },
    );

    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token, rememberMe);
    }

    return response;
  }

  async logout(): Promise<APIResponse<void>> {
    try {
      await this.post("/auth/logout");
    } finally {
      this.clearAuthToken();
    }
    return { success: true, data: undefined };
  }

  async refreshToken(): Promise<APIResponse<{ token: string }>> {
    const response = await this.post<{ token: string }>("/auth/refresh");

    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token, false);
    }

    return response;
  }

  // User API methods
  async getCurrentUser(): Promise<APIResponse<User>> {
    return this.get<User>("/users/me");
  }

  async updateProfile(data: Partial<User>): Promise<APIResponse<User>> {
    return this.patch<User>("/users/me", data);
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<APIResponse<void>> {
    return this.post("/users/me/change-password", {
      currentPassword,
      newPassword,
    });
  }

  // Organization API methods
  async getOrganization(id: string): Promise<APIResponse<Organization>> {
    return this.get<Organization>(`/organizations/${id}`);
  }

  async updateOrganization(
    id: string,
    data: Partial<Organization>,
  ): Promise<APIResponse<Organization>> {
    return this.patch<Organization>(`/organizations/${id}`, data);
  }

  // Payment API methods
  async getPayments(
    params?: PaginationParams,
  ): Promise<APIResponse<Payment[]>> {
    return this.getPaginated<Payment>("/payments", params);
  }

  async createPayment(data: Partial<Payment>): Promise<APIResponse<Payment>> {
    return this.post<Payment>("/payments", data);
  }

  // Subscription API methods
  async getSubscription(): Promise<APIResponse<Subscription>> {
    return this.get<Subscription>("/subscriptions/me");
  }

  async updateSubscription(
    data: Partial<Subscription>,
  ): Promise<APIResponse<Subscription>> {
    return this.patch<Subscription>("/subscriptions/me", data);
  }

  // Analytics API methods
  async getAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    metrics?: string[];
  }): Promise<APIResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            searchParams.append(key, value.join(","));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
    }

    const endpoint = searchParams.toString()
      ? `/analytics?${searchParams}`
      : "/analytics";
    return this.get(endpoint);
  }

  async trackInteraction(
    interaction: Partial<UserInteraction>,
  ): Promise<APIResponse<void>> {
    return this.post("/analytics/interactions", interaction);
  }

  // Security API methods
  async getSecurityEvents(
    params?: PaginationParams,
  ): Promise<APIResponse<SecurityEvent[]>> {
    return this.getPaginated<SecurityEvent>("/security/events", params);
  }

  async reportSecurityEvent(
    event: Partial<SecurityEvent>,
  ): Promise<APIResponse<SecurityEvent>> {
    return this.post<SecurityEvent>("/security/events", event);
  }
}

// Global API client instance
export const apiClient = new APIClient(import.meta.env.VITE_API_URL || "/api");

// Export custom error class
export class APIError extends Error {
  public code: string;
  public statusCode: number;
  public details?: Record<string, any>;
  public timestamp: Date;
  public requestId: string;

  constructor(config: {
    code: string;
    message: string;
    statusCode: number;
    details?: Record<string, any>;
    timestamp: Date;
    requestId: string;
  }) {
    super(config.message);
    this.name = "APIError";
    this.code = config.code;
    this.statusCode = config.statusCode;
    this.details = config.details;
    this.timestamp = config.timestamp;
    this.requestId = config.requestId;
  }
}

// Export types
export type { APIResponse, RequestConfig, PaginationParams };

// Export default
export default apiClient;
