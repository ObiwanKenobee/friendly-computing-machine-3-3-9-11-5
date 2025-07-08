import { useEffect, useRef } from "react";
import { useNotifications } from "./useNotifications";

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiResponseTimes: number[];
  memoryUsage?: number;
  networkSpeed?: number;
}

export const usePerformanceMonitoring = () => {
  const { warning } = useNotifications();
  const metricsRef = useRef<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    apiResponseTimes: [],
  });

  useEffect(() => {
    // Monitor page load performance
    const measurePageLoad = () => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        metricsRef.current.loadTime = loadTime;

        if (loadTime > 3000) {
          warning(
            "Slow Page Load",
            `Page took ${Math.round(loadTime)}ms to load`,
          );
        }
      }
    };

    // Monitor memory usage (if available)
    const measureMemory = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        metricsRef.current.memoryUsage = memory.usedJSHeapSize;

        // Warn if memory usage is high (>50MB)
        if (memory.usedJSHeapSize > 50 * 1024 * 1024) {
          warning(
            "High Memory Usage",
            "Application is using significant memory",
          );
        }
      }
    };

    // Monitor network connectivity
    const measureNetwork = () => {
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        const effectiveType = connection.effectiveType;

        if (effectiveType === "slow-2g" || effectiveType === "2g") {
          warning(
            "Slow Network",
            "You may experience slower performance due to network conditions",
          );
        }
      }
    };

    measurePageLoad();
    measureMemory();
    measureNetwork();

    // Set up periodic monitoring
    const interval = setInterval(() => {
      measureMemory();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [warning]);

  const trackApiCall = (url: string, responseTime: number) => {
    metricsRef.current.apiResponseTimes.push(responseTime);

    // Keep only last 10 API calls
    if (metricsRef.current.apiResponseTimes.length > 10) {
      metricsRef.current.apiResponseTimes.shift();
    }

    // Warn on slow API calls
    if (responseTime > 5000) {
      warning(
        "Slow API Response",
        `${url} took ${Math.round(responseTime)}ms to respond`,
      );
    }
  };

  const trackPageView = (path: string) => {
    // Track page view for analytics
    try {
      if (typeof window !== "undefined" && "gtag" in window) {
        (window as any).gtag("config", "GA_MEASUREMENT_ID", {
          page_path: path,
        });
      }
    } catch (error) {
      console.warn("Analytics tracking failed:", error);
    }
  };

  const getMetrics = (): PerformanceMetrics => {
    return { ...metricsRef.current };
  };

  return {
    trackApiCall,
    trackPageView,
    getMetrics,
  };
};
