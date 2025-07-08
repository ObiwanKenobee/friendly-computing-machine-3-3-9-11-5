/**
 * QuantumVest Enterprise Performance Monitor
 * Advanced performance tracking, optimization, and real-time monitoring
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: "timing" | "memory" | "network" | "user" | "custom";
  tags?: Record<string, string>;
}

interface TimingMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface NetworkMetric {
  url: string;
  method: string;
  status: number;
  duration: number;
  size: number;
  timestamp: number;
  cached?: boolean;
}

interface MemoryMetric {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  timestamp: number;
}

interface UserMetric {
  type: "click" | "scroll" | "input" | "navigation" | "interaction";
  element?: string;
  timestamp: number;
  duration?: number;
  value?: number;
}

interface PerformanceBudget {
  metric: string;
  threshold: number;
  severity: "warning" | "error";
  message: string;
}

interface PerformanceReport {
  summary: {
    score: number;
    metrics: Record<string, number>;
    violations: Array<{
      metric: string;
      value: number;
      threshold: number;
      severity: string;
    }>;
  };
  timing: TimingMetric[];
  network: NetworkMetric[];
  memory: MemoryMetric[];
  user: UserMetric[];
  webVitals: {
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timings: Map<string, TimingMetric> = new Map();
  private networkObserver: PerformanceObserver | null = null;
  private navigationObserver: PerformanceObserver | null = null;
  private resourceObserver: PerformanceObserver | null = null;
  private memoryInterval: NodeJS.Timeout | null = null;
  private budgets: PerformanceBudget[] = [];
  private listeners: Map<string, Set<(metric: PerformanceMetric) => void>> =
    new Map();
  private isEnabled = true;
  private samplingRate = 1.0; // 100% sampling by default

  constructor() {
    this.setupWebVitalsTracking();
    this.setupResourceTracking();
    this.setupMemoryTracking();
    this.setupDefaultBudgets();
  }

  // Core metric tracking
  recordMetric(metric: Omit<PerformanceMetric, "timestamp">): void {
    if (!this.isEnabled || Math.random() > this.samplingRate) return;

    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: performance.now(),
    };

    this.metrics.push(fullMetric);
    this.checkBudgets(fullMetric);
    this.emit("metric", fullMetric);

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  // Timing utilities
  startTiming(name: string, metadata?: Record<string, any>): void {
    const timing: TimingMetric = {
      name,
      startTime: performance.now(),
      metadata,
    };

    this.timings.set(name, timing);
  }

  endTiming(name: string): number | null {
    const timing = this.timings.get(name);
    if (!timing) return null;

    timing.endTime = performance.now();
    timing.duration = timing.endTime - timing.startTime;

    this.recordMetric({
      name: `timing.${name}`,
      value: timing.duration,
      category: "timing",
      tags: timing.metadata,
    });

    this.timings.delete(name);
    return timing.duration;
  }

  // High-level timing decorator
  time<T>(name: string, fn: () => T): T;
  time<T>(name: string, fn: () => Promise<T>): Promise<T>;
  time<T>(name: string, fn: () => T | Promise<T>): T | Promise<T> {
    this.startTiming(name);

    try {
      const result = fn();

      if (result instanceof Promise) {
        return result.finally(() => this.endTiming(name));
      } else {
        this.endTiming(name);
        return result;
      }
    } catch (error) {
      this.endTiming(name);
      throw error;
    }
  }

  // Network monitoring
  trackNetworkRequest(url: string, init: RequestInit = {}): void {
    const startTime = performance.now();
    const method = init.method || "GET";

    // Monkey patch fetch to track requests
    const originalFetch = window.fetch;
    window.fetch = async (
      input: RequestInfo | URL,
      requestInit?: RequestInit,
    ) => {
      const response = await originalFetch(input, requestInit);

      if (input.toString() === url) {
        const endTime = performance.now();
        const duration = endTime - startTime;

        this.recordNetworkMetric({
          url,
          method,
          status: response.status,
          duration,
          size: parseInt(response.headers.get("content-length") || "0", 10),
          timestamp: endTime,
          cached: response.headers.get("cache-control") !== null,
        });
      }

      return response;
    };
  }

  private recordNetworkMetric(metric: NetworkMetric): void {
    this.recordMetric({
      name: "network.request",
      value: metric.duration,
      category: "network",
      tags: {
        url: metric.url,
        method: metric.method,
        status: metric.status.toString(),
        cached: metric.cached?.toString() || "false",
      },
    });
  }

  // Memory monitoring
  recordMemoryUsage(): void {
    if (!("memory" in performance)) return;

    const memory = (performance as any).memory;
    const memoryMetric: MemoryMetric = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      timestamp: performance.now(),
    };

    this.recordMetric({
      name: "memory.used",
      value: memory.usedJSHeapSize,
      category: "memory",
    });

    this.recordMetric({
      name: "memory.percentage",
      value: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      category: "memory",
    });
  }

  // User interaction tracking
  trackUserInteraction(
    type: UserMetric["type"],
    element?: string,
    value?: number,
  ): void {
    const metric: UserMetric = {
      type,
      element,
      timestamp: performance.now(),
      value,
    };

    this.recordMetric({
      name: `user.${type}`,
      value: value || 1,
      category: "user",
      tags: {
        element: element || "unknown",
      },
    });
  }

  // Web Vitals tracking
  private setupWebVitalsTracking(): void {
    // First Contentful Paint (FCP)
    this.observeEntry("paint", (entry) => {
      if (entry.name === "first-contentful-paint") {
        this.recordMetric({
          name: "webvitals.fcp",
          value: entry.startTime,
          category: "timing",
        });
      }
    });

    // Largest Contentful Paint (LCP)
    this.observeEntry("largest-contentful-paint", (entry) => {
      this.recordMetric({
        name: "webvitals.lcp",
        value: entry.startTime,
        category: "timing",
      });
    });

    // First Input Delay (FID)
    this.observeEntry("first-input", (entry) => {
      this.recordMetric({
        name: "webvitals.fid",
        value: (entry as any).processingStart - entry.startTime,
        category: "timing",
      });
    });

    // Cumulative Layout Shift (CLS)
    this.observeEntry("layout-shift", (entry) => {
      if (!(entry as any).hadRecentInput) {
        this.recordMetric({
          name: "webvitals.cls",
          value: (entry as any).value,
          category: "timing",
        });
      }
    });

    // Time to First Byte (TTFB)
    this.observeEntry("navigation", (entry) => {
      const navigationEntry = entry as PerformanceNavigationTiming;
      this.recordMetric({
        name: "webvitals.ttfb",
        value: navigationEntry.responseStart - navigationEntry.requestStart,
        category: "timing",
      });
    });
  }

  private setupResourceTracking(): void {
    this.observeEntry("resource", (entry) => {
      const resourceEntry = entry as PerformanceResourceTiming;

      this.recordMetric({
        name: "resource.load",
        value: resourceEntry.duration,
        category: "network",
        tags: {
          type: resourceEntry.initiatorType,
          url: resourceEntry.name,
          size: resourceEntry.transferSize?.toString() || "0",
        },
      });
    });
  }

  private setupMemoryTracking(): void {
    // Track memory usage every 30 seconds
    this.memoryInterval = setInterval(() => {
      this.recordMemoryUsage();
    }, 30000);
  }

  private observeEntry(
    type: string,
    callback: (entry: PerformanceEntry) => void,
  ): void {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });

      observer.observe({ type, buffered: true });
    } catch (error) {
      console.warn(`Failed to observe ${type} entries:`, error);
    }
  }

  // Performance budgets
  addBudget(budget: PerformanceBudget): void {
    this.budgets.push(budget);
  }

  private setupDefaultBudgets(): void {
    const defaultBudgets: PerformanceBudget[] = [
      {
        metric: "webvitals.fcp",
        threshold: 1800,
        severity: "warning",
        message: "First Contentful Paint should be under 1.8s",
      },
      {
        metric: "webvitals.lcp",
        threshold: 2500,
        severity: "error",
        message: "Largest Contentful Paint should be under 2.5s",
      },
      {
        metric: "webvitals.fid",
        threshold: 100,
        severity: "warning",
        message: "First Input Delay should be under 100ms",
      },
      {
        metric: "webvitals.cls",
        threshold: 0.1,
        severity: "warning",
        message: "Cumulative Layout Shift should be under 0.1",
      },
      {
        metric: "memory.percentage",
        threshold: 80,
        severity: "warning",
        message: "Memory usage should be under 80%",
      },
    ];

    defaultBudgets.forEach((budget) => this.addBudget(budget));
  }

  private checkBudgets(metric: PerformanceMetric): void {
    const relevantBudgets = this.budgets.filter(
      (budget) => budget.metric === metric.name,
    );

    relevantBudgets.forEach((budget) => {
      if (metric.value > budget.threshold) {
        this.emit("budget_violation", {
          metric: metric.name,
          value: metric.value,
          threshold: budget.threshold,
          severity: budget.severity,
          message: budget.message,
        });
      }
    });
  }

  // Event system
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in performance monitor listener:`, error);
      }
    });
  }

  // Reporting
  generateReport(): PerformanceReport {
    const now = performance.now();
    const recentMetrics = this.metrics.filter((m) => now - m.timestamp < 60000); // Last minute

    // Calculate performance score (0-100)
    const score = this.calculatePerformanceScore(recentMetrics);

    // Extract metric values
    const metricValues: Record<string, number> = {};
    recentMetrics.forEach((metric) => {
      if (!metricValues[metric.name]) {
        metricValues[metric.name] = metric.value;
      }
    });

    // Find budget violations
    const violations = this.budgets
      .map((budget) => {
        const value = metricValues[budget.metric];
        if (value !== undefined && value > budget.threshold) {
          return {
            metric: budget.metric,
            value,
            threshold: budget.threshold,
            severity: budget.severity,
          };
        }
        return null;
      })
      .filter(Boolean) as any[];

    // Extract Web Vitals
    const webVitals = {
      fcp: metricValues["webvitals.fcp"],
      lcp: metricValues["webvitals.lcp"],
      fid: metricValues["webvitals.fid"],
      cls: metricValues["webvitals.cls"],
      ttfb: metricValues["webvitals.ttfb"],
    };

    return {
      summary: {
        score,
        metrics: metricValues,
        violations,
      },
      timing: Array.from(this.timings.values()),
      network: [], // Would be populated from stored network metrics
      memory: [], // Would be populated from stored memory metrics
      user: [], // Would be populated from stored user metrics
      webVitals,
    };
  }

  private calculatePerformanceScore(metrics: PerformanceMetric[]): number {
    const weights = {
      "webvitals.fcp": 0.2,
      "webvitals.lcp": 0.25,
      "webvitals.fid": 0.2,
      "webvitals.cls": 0.15,
      "webvitals.ttfb": 0.1,
      "memory.percentage": 0.1,
    };

    let totalWeight = 0;
    let weightedScore = 0;

    Object.entries(weights).forEach(([metricName, weight]) => {
      const metric = metrics.find((m) => m.name === metricName);
      if (metric) {
        const score = this.getMetricScore(metricName, metric.value);
        weightedScore += score * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 100;
  }

  private getMetricScore(metricName: string, value: number): number {
    // Scoring thresholds based on Web Vitals and common performance metrics
    const thresholds: Record<string, { good: number; poor: number }> = {
      "webvitals.fcp": { good: 1800, poor: 3000 },
      "webvitals.lcp": { good: 2500, poor: 4000 },
      "webvitals.fid": { good: 100, poor: 300 },
      "webvitals.cls": { good: 0.1, poor: 0.25 },
      "webvitals.ttfb": { good: 800, poor: 1800 },
      "memory.percentage": { good: 50, poor: 80 },
    };

    const threshold = thresholds[metricName];
    if (!threshold) return 100;

    if (value <= threshold.good) return 100;
    if (value >= threshold.poor) return 0;

    // Linear interpolation between good and poor thresholds
    const ratio = (value - threshold.good) / (threshold.poor - threshold.good);
    return Math.round(100 * (1 - ratio));
  }

  // Configuration
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  setSamplingRate(rate: number): void {
    this.samplingRate = Math.max(0, Math.min(1, rate));
  }

  // Cleanup
  destroy(): void {
    if (this.networkObserver) {
      this.networkObserver.disconnect();
    }

    if (this.navigationObserver) {
      this.navigationObserver.disconnect();
    }

    if (this.resourceObserver) {
      this.resourceObserver.disconnect();
    }

    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
    }

    this.listeners.clear();
    this.metrics.length = 0;
    this.timings.clear();
  }
}

// React hooks for performance monitoring
export const usePerformanceMonitor = () => {
  const [monitor] = React.useState(() => new PerformanceMonitor());
  const [report, setReport] = React.useState<PerformanceReport | null>(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setReport(monitor.generateReport());
    }, 5000); // Update report every 5 seconds

    return () => {
      clearInterval(interval);
      monitor.destroy();
    };
  }, [monitor]);

  return {
    monitor,
    report,
    startTiming: monitor.startTiming.bind(monitor),
    endTiming: monitor.endTiming.bind(monitor),
    time: monitor.time.bind(monitor),
    recordMetric: monitor.recordMetric.bind(monitor),
    trackUserInteraction: monitor.trackUserInteraction.bind(monitor),
  };
};

export const usePerformanceTiming = (name: string) => {
  const monitor = React.useRef(new PerformanceMonitor());

  const startTiming = React.useCallback(() => {
    monitor.current.startTiming(name);
  }, [name]);

  const endTiming = React.useCallback(() => {
    return monitor.current.endTiming(name);
  }, [name]);

  React.useEffect(() => {
    return () => {
      monitor.current.destroy();
    };
  }, []);

  return { startTiming, endTiming };
};

// Performance optimization utilities
export const optimizeImages = {
  lazy: (selector: string) => {
    const images = document.querySelectorAll(selector);

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || img.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    }
  },

  preload: (urls: string[]) => {
    urls.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);
    });
  },
};

export const optimizeScripts = {
  defer: (scripts: string[]) => {
    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      document.head.appendChild(script);
    });
  },

  loadAsync: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },
};

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Export types and main class
export { PerformanceMonitor };
export type {
  PerformanceMetric,
  TimingMetric,
  NetworkMetric,
  MemoryMetric,
  UserMetric,
  PerformanceBudget,
  PerformanceReport,
};
