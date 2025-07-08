
import { API_CONFIG } from '@/config/api';

// Request interceptor for rate limiting and authentication
export const requestInterceptor = (request: Request): Request => {
  // Add request ID for tracking
  const requestId = crypto.randomUUID();
  request.headers.set('X-Request-ID', requestId);
  
  // Add timestamp
  request.headers.set('X-Request-Timestamp', new Date().toISOString());
  
  // Log request for production monitoring
  console.log(`[API Request] ${request.method} ${request.url}`, {
    requestId,
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(request.headers.entries())
  });
  
  return request;
};

// Response interceptor for error handling and logging
export const responseInterceptor = (response: Response): Response => {
  const requestId = response.headers.get('X-Request-ID');
  
  // Log response for production monitoring
  console.log(`[API Response] ${response.status} ${response.url}`, {
    requestId,
    status: response.status,
    statusText: response.statusText,
    timestamp: new Date().toISOString()
  });
  
  // Handle common error scenarios
  if (!response.ok) {
    switch (response.status) {
      case 401:
        // Redirect to login or refresh token
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        break;
      case 403:
        // Handle insufficient permissions
        window.dispatchEvent(new CustomEvent('auth:forbidden'));
        break;
      case 429:
        // Handle rate limiting
        window.dispatchEvent(new CustomEvent('api:rate-limited'));
        break;
      case 500:
        // Handle server errors
        window.dispatchEvent(new CustomEvent('api:server-error'));
        break;
    }
  }
  
  return response;
};

// Rate limiting utility
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  isAllowed(userId: string, endpoint: string): boolean {
    const key = `${userId}:${endpoint}`;
    const now = Date.now();
    const window = API_CONFIG.RATE_LIMITS.STANDARD.window;
    const limit = API_CONFIG.RATE_LIMITS.STANDARD.requests;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const userRequests = this.requests.get(key)!;
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => now - timestamp < window);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }
  
  getRemainingRequests(userId: string, endpoint: string): number {
    const key = `${userId}:${endpoint}`;
    const now = Date.now();
    const window = API_CONFIG.RATE_LIMITS.STANDARD.window;
    const limit = API_CONFIG.RATE_LIMITS.STANDARD.requests;
    
    if (!this.requests.has(key)) {
      return limit;
    }
    
    const userRequests = this.requests.get(key)!;
    const validRequests = userRequests.filter(timestamp => now - timestamp < window);
    
    return Math.max(0, limit - validRequests.length);
  }
}

export const rateLimiter = new RateLimiter();

// Feature flag checker
export const isFeatureEnabled = (feature: keyof typeof API_CONFIG.FEATURE_FLAGS): boolean => {
  return API_CONFIG.FEATURE_FLAGS[feature];
};

// Performance monitoring
export const performanceMonitor = {
  startTimer: (operation: string): (() => void) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`[Performance] ${operation} took ${duration.toFixed(2)}ms`);
      
      // Report to analytics service if needed
      if (duration > 5000) { // Log slow operations (>5s)
        console.warn(`[Performance Warning] Slow operation detected: ${operation} (${duration.toFixed(2)}ms)`);
      }
    };
  }
};

// Error boundary for API calls
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string,
    public requestId?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      endpoint: this.endpoint,
      requestId: this.requestId,
      timestamp: new Date().toISOString()
    };
  }
}

// Retry mechanism for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
};
