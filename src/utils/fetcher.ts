/**
 * Unified API fetcher utilities for REST and GraphQL requests
 * Handles authentication, retries, caching, and error handling
 */

export interface FetcherConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  cache?: boolean;
  cacheTTL?: number;
}

export interface GraphQLQuery {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

export interface FetcherResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
  cached?: boolean;
}

export interface FetcherError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Default configuration
const defaultConfig: FetcherConfig = {
  baseURL: "",
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  headers: {
    "Content-Type": "application/json",
  },
  cache: true,
  cacheTTL: 300000, // 5 minutes
};

/**
 * Create a configured fetcher instance
 */
export const createFetcher = (config: FetcherConfig = {}) => {
  const mergedConfig = { ...defaultConfig, ...config };

  return {
    get: <T = any>(url: string, options?: RequestInit) =>
      fetchWithRetry<T>("GET", url, undefined, { ...mergedConfig, ...options }),

    post: <T = any>(url: string, data?: any, options?: RequestInit) =>
      fetchWithRetry<T>("POST", url, data, { ...mergedConfig, ...options }),

    put: <T = any>(url: string, data?: any, options?: RequestInit) =>
      fetchWithRetry<T>("PUT", url, data, { ...mergedConfig, ...options }),

    patch: <T = any>(url: string, data?: any, options?: RequestInit) =>
      fetchWithRetry<T>("PATCH", url, data, { ...mergedConfig, ...options }),

    delete: <T = any>(url: string, options?: RequestInit) =>
      fetchWithRetry<T>("DELETE", url, undefined, {
        ...mergedConfig,
        ...options,
      }),

    graphql: <T = any>(query: GraphQLQuery, options?: RequestInit) =>
      fetchGraphQL<T>(query, { ...mergedConfig, ...options }),
  };
};

/**
 * Default fetcher instance
 */
export const fetcher = createFetcher();

/**
 * Fetch with retry logic and error handling
 */
async function fetchWithRetry<T>(
  method: string,
  url: string,
  data?: any,
  config: FetcherConfig & RequestInit = {},
): Promise<FetcherResponse<T>> {
  const {
    baseURL = "",
    timeout = 30000,
    retries = 3,
    retryDelay = 1000,
    headers: configHeaders = {},
    cache: useCache = true,
    cacheTTL = 300000,
    ...fetchOptions
  } = config;

  const fullURL = url.startsWith("http") ? url : `${baseURL}${url}`;
  const cacheKey = `${method}:${fullURL}${data ? ":" + JSON.stringify(data) : ""}`;

  // Check cache for GET requests
  if (method === "GET" && useCache) {
    const cached = getCached(cacheKey);
    if (cached) {
      return {
        data: cached,
        status: 200,
        headers: new Headers(),
        cached: true,
      };
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const headers = new Headers({
    ...configHeaders,
    ...fetchOptions.headers,
  });

  // Add authentication if available
  const authToken = getAuthToken();
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const requestOptions: RequestInit = {
    method,
    headers,
    signal: controller.signal,
    ...fetchOptions,
  };

  if (data && method !== "GET") {
    if (data instanceof FormData) {
      requestOptions.body = data;
      headers.delete("Content-Type"); // Let browser set it
    } else {
      requestOptions.body = JSON.stringify(data);
    }
  }

  let lastError: FetcherError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(fullURL, requestOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await safeParseJSON(response);
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const responseData = await safeParseJSON(response);

      // Cache successful GET requests
      if (method === "GET" && useCache && response.status === 200) {
        setCache(cacheKey, responseData, cacheTTL);
      }

      return {
        data: responseData,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      lastError = {
        message: error instanceof Error ? error.message : "Unknown error",
        status: error instanceof Response ? error.status : undefined,
      };

      // Don't retry on certain errors
      if (
        lastError.status &&
        [400, 401, 403, 404, 422].includes(lastError.status)
      ) {
        break;
      }

      // Don't retry on last attempt
      if (attempt === retries) {
        break;
      }

      // Wait before retrying
      await sleep(retryDelay * Math.pow(2, attempt)); // Exponential backoff
    }
  }

  clearTimeout(timeoutId);
  throw lastError!;
}

/**
 * GraphQL specific fetcher
 */
async function fetchGraphQL<T>(
  { query, variables, operationName }: GraphQLQuery,
  config: FetcherConfig & RequestInit = {},
): Promise<FetcherResponse<T>> {
  const {
    baseURL = "/graphql",
    headers: configHeaders = {},
    ...restConfig
  } = config;

  const body = {
    query,
    variables,
    operationName,
  };

  const headers = {
    "Content-Type": "application/json",
    ...configHeaders,
  };

  try {
    const response = await fetchWithRetry<{ data: T; errors?: any[] }>(
      "POST",
      baseURL,
      body,
      { headers, ...restConfig },
    );

    if (response.data.errors && response.data.errors.length > 0) {
      throw new Error(response.data.errors[0].message);
    }

    return {
      data: response.data.data,
      status: response.status,
      headers: response.headers,
      cached: response.cached,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Safely parse JSON response
 */
async function safeParseJSON(response: Response): Promise<any> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Get authentication token
 */
function getAuthToken(): string | null {
  // Try multiple storage methods
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token") ||
      null
    );
  }
  return null;
}

/**
 * Set authentication token
 */
export function setAuthToken(token: string, persistent: boolean = true): void {
  if (typeof window !== "undefined") {
    if (persistent) {
      localStorage.setItem("auth_token", token);
    } else {
      sessionStorage.setItem("auth_token", token);
    }
  }
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  }
}

/**
 * Cache utilities
 */
function getCached(key: string): any | null {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() > item.timestamp + item.ttl) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

function setCache(key: string, data: any, ttl: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });

  // Clean up old entries periodically
  if (cache.size > 1000) {
    cleanupCache();
  }
}

function cleanupCache(): void {
  const now = Date.now();
  for (const [key, item] of cache.entries()) {
    if (now > item.timestamp + item.ttl) {
      cache.delete(key);
    }
  }
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Upload file with progress tracking
 */
export async function uploadFile(
  url: string,
  file: File,
  options: {
    onProgress?: (progress: number) => void;
    additionalData?: Record<string, any>;
    config?: FetcherConfig;
  } = {},
): Promise<FetcherResponse> {
  const { onProgress, additionalData = {}, config = {} } = options;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", file);
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            data,
            status: xhr.status,
            headers: new Headers(), // XMLHttpRequest doesn't provide easy access to headers
          });
        } catch {
          resolve({
            data: xhr.responseText,
            status: xhr.status,
            headers: new Headers(),
          });
        }
      } else {
        reject({
          message: `Upload failed: ${xhr.statusText}`,
          status: xhr.status,
        });
      }
    });

    xhr.addEventListener("error", () => {
      reject({
        message: "Upload failed due to network error",
      });
    });

    xhr.addEventListener("timeout", () => {
      reject({
        message: "Upload timed out",
      });
    });

    // Set auth header if available
    const authToken = getAuthToken();
    if (authToken) {
      xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
    }

    // Set timeout
    xhr.timeout = config.timeout || 60000; // 60 seconds for uploads

    xhr.open("POST", url);
    xhr.send(formData);
  });
}

/**
 * Download file
 */
export async function downloadFile(
  url: string,
  filename?: string,
  config: FetcherConfig = {},
): Promise<void> {
  try {
    const response = await fetchWithRetry("GET", url, undefined, {
      ...config,
      headers: {
        ...config.headers,
      },
    });

    // Create blob from response data
    const blob = new Blob([response.data]);

    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || "download";

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    throw error;
  }
}

/**
 * Batch multiple requests
 */
export async function batchRequests<T>(
  requests: Array<() => Promise<T>>,
  options: {
    concurrency?: number;
    failFast?: boolean;
  } = {},
): Promise<Array<T | Error>> {
  const { concurrency = 5, failFast = false } = options;
  const results: Array<T | Error> = [];

  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency);

    const batchPromises = batch.map(async (request, index) => {
      try {
        const result = await request();
        return { index: i + index, result };
      } catch (error) {
        if (failFast) throw error;
        return { index: i + index, result: error as Error };
      }
    });

    const batchResults = await Promise.all(batchPromises);

    batchResults.forEach(({ index, result }) => {
      results[index] = result;
    });
  }

  return results;
}

/**
 * Create a request queue for rate limiting
 */
export function createRequestQueue(requestsPerSecond: number = 10) {
  const queue: Array<() => void> = [];
  const interval = 1000 / requestsPerSecond;
  let processing = false;

  const processQueue = () => {
    if (queue.length === 0) {
      processing = false;
      return;
    }

    const next = queue.shift();
    if (next) {
      next();
      setTimeout(processQueue, interval);
    }
  };

  return {
    add<T>(request: () => Promise<T>): Promise<T> {
      return new Promise((resolve, reject) => {
        queue.push(async () => {
          try {
            const result = await request();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });

        if (!processing) {
          processing = true;
          processQueue();
        }
      });
    },

    size: () => queue.length,
    clear: () => queue.splice(0),
  };
}

// Export commonly used methods
export default fetcher;
export { FetcherError, FetcherResponse, GraphQLQuery };
