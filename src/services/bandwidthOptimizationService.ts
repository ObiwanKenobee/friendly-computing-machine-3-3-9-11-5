import { themeService } from "./themeService";
import { realTimeDataSyncSystem } from "./realTimeDataSyncSystem";

export interface BandwidthMetrics {
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface OptimizationSettings {
  imageQuality: "low" | "medium" | "high";
  enableAnimations: boolean;
  enableAutoplay: boolean;
  enablePrefetch: boolean;
  batchRequests: boolean;
  compressionLevel: number;
  maxImageSize: number;
  chartSimplification: boolean;
  offlineMode: boolean;
}

class BandwidthOptimizationService {
  private currentMetrics: BandwidthMetrics | null = null;
  private optimizationSettings: OptimizationSettings;
  private listeners: Set<(settings: OptimizationSettings) => void> = new Set();
  private speedTestResults: number[] = [];
  private readonly CONNECTION_MONITOR_INTERVAL = 30000; // 30 seconds
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.optimizationSettings = this.getDefaultSettings();
    this.initializeService();
  }

  private getDefaultSettings(): OptimizationSettings {
    return {
      imageQuality: "high",
      enableAnimations: true,
      enableAutoplay: true,
      enablePrefetch: true,
      batchRequests: false,
      compressionLevel: 1,
      maxImageSize: 1024 * 1024, // 1MB
      chartSimplification: false,
      offlineMode: false,
    };
  }

  private initializeService(): void {
    this.detectConnectionCapabilities();
    this.setupConnectionMonitoring();
    this.loadSavedSettings();

    // Listen for online/offline events
    window.addEventListener("online", this.handleOnlineEvent.bind(this));
    window.addEventListener("offline", this.handleOfflineEvent.bind(this));

    // Listen for visibility changes to optimize background operations
    document.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange.bind(this),
    );
  }

  private detectConnectionCapabilities(): void {
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      this.currentMetrics = {
        connectionType: connection.type || "unknown",
        effectiveType: connection.effectiveType || "unknown",
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false,
      };

      this.updateOptimizationSettings();

      // Listen for connection changes
      connection.addEventListener(
        "change",
        this.handleConnectionChange.bind(this),
      );
    } else {
      // Fallback: perform speed test
      this.performSpeedTest();
    }
  }

  private async performSpeedTest(): Promise<number> {
    try {
      const testFile = "/api/health.json"; // Small test file
      const startTime = performance.now();

      const response = await fetch(testFile, {
        cache: "no-cache",
        method: "GET",
      });

      const endTime = performance.now();
      const duration = endTime - startTime;
      const responseSize = parseInt(
        response.headers.get("content-length") || "1000",
        10,
      );

      // Calculate speed in kbps
      const speedKbps = (responseSize * 8) / (duration / 1000) / 1024;

      this.speedTestResults.push(speedKbps);

      // Keep only last 5 results
      if (this.speedTestResults.length > 5) {
        this.speedTestResults.shift();
      }

      // Update metrics based on speed test
      const avgSpeed =
        this.speedTestResults.reduce((a, b) => a + b, 0) /
        this.speedTestResults.length;

      this.currentMetrics = {
        connectionType: "unknown",
        effectiveType: this.getEffectiveTypeFromSpeed(avgSpeed),
        downlink: avgSpeed / 1024, // Convert to Mbps
        rtt: duration,
        saveData: false,
      };

      this.updateOptimizationSettings();

      return avgSpeed;
    } catch (error) {
      console.error("Speed test failed:", error);
      // Assume slow connection on error
      this.currentMetrics = {
        connectionType: "unknown",
        effectiveType: "slow-2g",
        downlink: 0.1,
        rtt: 2000,
        saveData: true,
      };
      this.updateOptimizationSettings();
      return 0.1;
    }
  }

  private getEffectiveTypeFromSpeed(speedKbps: number): string {
    if (speedKbps > 10000) return "4g";
    if (speedKbps > 1500) return "3g";
    if (speedKbps > 150) return "2g";
    return "slow-2g";
  }

  private handleConnectionChange(): void {
    this.detectConnectionCapabilities();
  }

  private handleOnlineEvent(): void {
    this.optimizationSettings.offlineMode = false;
    this.notifyListeners();
    this.detectConnectionCapabilities();
  }

  private handleOfflineEvent(): void {
    this.optimizationSettings.offlineMode = true;
    this.notifyListeners();
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      // Page is hidden, optimize for background
      this.optimizationSettings.enableAnimations = false;
      this.optimizationSettings.enableAutoplay = false;
    } else {
      // Page is visible, restore normal settings
      this.updateOptimizationSettings();
    }
    this.notifyListeners();
  }

  private updateOptimizationSettings(): void {
    if (!this.currentMetrics) return;

    const metrics = this.currentMetrics;
    const isSlowConnection =
      metrics.effectiveType === "slow-2g" || metrics.effectiveType === "2g";
    const isSaveDataEnabled = metrics.saveData;
    const hasHighLatency = metrics.rtt > 1000;

    // Update settings based on connection quality
    this.optimizationSettings = {
      imageQuality: isSlowConnection
        ? "low"
        : metrics.effectiveType === "3g"
          ? "medium"
          : "high",
      enableAnimations: !isSlowConnection && !isSaveDataEnabled,
      enableAutoplay: !isSlowConnection && !isSaveDataEnabled,
      enablePrefetch: !isSlowConnection && !isSaveDataEnabled,
      batchRequests: isSlowConnection || hasHighLatency,
      compressionLevel: isSlowConnection
        ? 0.5
        : metrics.effectiveType === "3g"
          ? 0.7
          : 1,
      maxImageSize: isSlowConnection
        ? 256 * 1024
        : metrics.effectiveType === "3g"
          ? 512 * 1024
          : 1024 * 1024,
      chartSimplification: isSlowConnection,
      offlineMode: !navigator.onLine,
    };

    // Update theme service with bandwidth mode
    const bandwidthMode = isSlowConnection
      ? "low"
      : metrics.effectiveType === "3g"
        ? "medium"
        : "high";
    themeService.updateConfig({
      bandwidthMode: bandwidthMode as any,
      reducedAnimations: !this.optimizationSettings.enableAnimations,
    });

    this.saveSettings();
    this.notifyListeners();
  }

  private setupConnectionMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      if (!document.hidden && navigator.onLine) {
        this.performSpeedTest();
      }
    }, this.CONNECTION_MONITOR_INTERVAL);
  }

  private loadSavedSettings(): void {
    try {
      const saved = localStorage.getItem("bandwidth-optimization-settings");
      if (saved) {
        const savedSettings = JSON.parse(saved);
        this.optimizationSettings = {
          ...this.optimizationSettings,
          ...savedSettings,
        };
      }
    } catch (error) {
      console.error("Failed to load bandwidth settings:", error);
    }
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(
        "bandwidth-optimization-settings",
        JSON.stringify(this.optimizationSettings),
      );
    } catch (error) {
      console.error("Failed to save bandwidth settings:", error);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.optimizationSettings));
  }

  public getOptimizationSettings(): OptimizationSettings {
    return { ...this.optimizationSettings };
  }

  public getCurrentMetrics(): BandwidthMetrics | null {
    return this.currentMetrics ? { ...this.currentMetrics } : null;
  }

  public addListener(
    listener: (settings: OptimizationSettings) => void,
  ): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public optimizeImageUrl(
    originalUrl: string,
    width?: number,
    height?: number,
  ): string {
    const settings = this.optimizationSettings;

    if (settings.offlineMode) {
      // Return placeholder for offline mode
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgdW5hdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPg==";
    }

    // Simple URL optimization (in production, this would integrate with an image CDN)
    const params = new URLSearchParams();

    if (width)
      params.set("w", Math.min(width, settings.maxImageSize / 1024).toString());
    if (height)
      params.set(
        "h",
        Math.min(height, settings.maxImageSize / 1024).toString(),
      );

    params.set(
      "q",
      settings.imageQuality === "low"
        ? "30"
        : settings.imageQuality === "medium"
          ? "60"
          : "90",
    );
    params.set("f", "webp"); // Use WebP for better compression

    // Add compression based on connection
    if (settings.compressionLevel < 1) {
      params.set("compress", settings.compressionLevel.toString());
    }

    return `${originalUrl}${originalUrl.includes("?") ? "&" : "?"}${params.toString()}`;
  }

  public shouldLoadResource(
    resourceType: "image" | "video" | "font" | "script",
    priority: "high" | "medium" | "low" = "medium",
  ): boolean {
    const settings = this.optimizationSettings;

    if (settings.offlineMode) {
      return false;
    }

    if (resourceType === "video" && !settings.enableAutoplay) {
      return false;
    }

    if (priority === "low" && !settings.enablePrefetch) {
      return false;
    }

    return true;
  }

  public getChartConfiguration(): {
    simplified: boolean;
    maxDataPoints: number;
    enableAnimations: boolean;
    enableTooltips: boolean;
  } {
    const settings = this.optimizationSettings;

    return {
      simplified: settings.chartSimplification,
      maxDataPoints: settings.chartSimplification ? 20 : 100,
      enableAnimations: settings.enableAnimations,
      enableTooltips: !settings.chartSimplification,
    };
  }

  public optimizeRequestStrategy(): {
    batchRequests: boolean;
    maxConcurrentRequests: number;
    requestTimeout: number;
    retryStrategy: "aggressive" | "conservative" | "minimal";
  } {
    const metrics = this.currentMetrics;
    const settings = this.optimizationSettings;

    if (!metrics) {
      return {
        batchRequests: false,
        maxConcurrentRequests: 4,
        requestTimeout: 30000,
        retryStrategy: "conservative",
      };
    }

    const isSlowConnection =
      metrics.effectiveType === "slow-2g" || metrics.effectiveType === "2g";
    const hasHighLatency = metrics.rtt > 1000;

    return {
      batchRequests: settings.batchRequests,
      maxConcurrentRequests: isSlowConnection ? 2 : hasHighLatency ? 3 : 6,
      requestTimeout: isSlowConnection ? 60000 : hasHighLatency ? 45000 : 30000,
      retryStrategy: isSlowConnection
        ? "minimal"
        : hasHighLatency
          ? "conservative"
          : "aggressive",
    };
  }

  public enableDataSaverMode(): void {
    this.optimizationSettings = {
      imageQuality: "low",
      enableAnimations: false,
      enableAutoplay: false,
      enablePrefetch: false,
      batchRequests: true,
      compressionLevel: 0.3,
      maxImageSize: 128 * 1024, // 128KB
      chartSimplification: true,
      offlineMode: false,
    };

    themeService.updateConfig({
      bandwidthMode: "low",
      reducedAnimations: true,
      compactMode: true,
    });

    this.saveSettings();
    this.notifyListeners();
  }

  public disableDataSaverMode(): void {
    this.updateOptimizationSettings();
  }

  public getConnectionQualityIndicator(): {
    quality: "excellent" | "good" | "fair" | "poor";
    color: string;
    icon: string;
    description: string;
  } {
    if (!this.currentMetrics) {
      return {
        quality: "poor",
        color: "#ef4444",
        icon: "📶",
        description: "Connection quality unknown",
      };
    }

    const metrics = this.currentMetrics;

    if (metrics.effectiveType === "4g" && metrics.downlink > 5) {
      return {
        quality: "excellent",
        color: "#10b981",
        icon: "📶",
        description: "Excellent connection quality",
      };
    }

    if (
      metrics.effectiveType === "4g" ||
      (metrics.effectiveType === "3g" && metrics.downlink > 2)
    ) {
      return {
        quality: "good",
        color: "#22c55e",
        icon: "📶",
        description: "Good connection quality",
      };
    }

    if (metrics.effectiveType === "3g") {
      return {
        quality: "fair",
        color: "#f59e0b",
        icon: "📶",
        description: "Fair connection quality",
      };
    }

    return {
      quality: "poor",
      color: "#ef4444",
      icon: "📶",
      description: "Poor connection quality",
    };
  }

  public destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    window.removeEventListener("online", this.handleOnlineEvent);
    window.removeEventListener("offline", this.handleOfflineEvent);
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    );

    this.listeners.clear();
  }
}

export const bandwidthOptimizationService = new BandwidthOptimizationService();
