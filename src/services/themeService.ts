import { realTimeDataSyncSystem } from "./realTimeDataSyncSystem";

export type ThemeMode = "light" | "dark" | "auto";
export type BandwidthMode = "high" | "medium" | "low" | "auto";

export interface ThemeConfig {
  mode: ThemeMode;
  bandwidthMode: BandwidthMode;
  reducedAnimations: boolean;
  highContrast: boolean;
  fontSize: "small" | "medium" | "large";
  compactMode: boolean;
  primaryColor: string;
  accentColor: string;
}

export interface ThemeTokens {
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    border: string;
    input: string;
    ring: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface BandwidthOptimizations {
  imageQuality: "high" | "medium" | "low";
  useWebP: boolean;
  lazyLoadImages: boolean;
  compressAssets: boolean;
  reducedAnimations: boolean;
  simplifiedCharts: boolean;
  batchRequests: boolean;
  cacheStrategy: "aggressive" | "moderate" | "minimal";
}

class ThemeService {
  private currentConfig: ThemeConfig;
  private themeTokens: Map<string, ThemeTokens> = new Map();
  private bandwidthOptimizations: BandwidthOptimizations;
  private mediaQuery: MediaQueryList;
  private connectionMonitor: NetworkInformation | null = null;
  private listeners: Set<(config: ThemeConfig) => void> = new Set();

  constructor() {
    this.currentConfig = this.getDefaultConfig();
    this.bandwidthOptimizations = this.getDefaultBandwidthOptimizations();
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.connectionMonitor = (navigator as any).connection || null;

    this.initializeThemeTokens();
    this.setupMediaQueryListener();
    this.setupConnectionMonitoring();
    this.loadSavedConfig();
    this.applyTheme();
  }

  private getDefaultConfig(): ThemeConfig {
    return {
      mode: "auto",
      bandwidthMode: "auto",
      reducedAnimations: false,
      highContrast: false,
      fontSize: "medium",
      compactMode: false,
      primaryColor: "#0066cc",
      accentColor: "#00cc66",
    };
  }

  private getDefaultBandwidthOptimizations(): BandwidthOptimizations {
    return {
      imageQuality: "high",
      useWebP: true,
      lazyLoadImages: true,
      compressAssets: false,
      reducedAnimations: false,
      simplifiedCharts: false,
      batchRequests: false,
      cacheStrategy: "moderate",
    };
  }

  private initializeThemeTokens(): void {
    // Light theme tokens
    this.themeTokens.set("light", {
      colors: {
        primary: "#0066cc",
        primaryForeground: "#ffffff",
        secondary: "#f1f5f9",
        secondaryForeground: "#0f172a",
        background: "#ffffff",
        foreground: "#0f172a",
        card: "#ffffff",
        cardForeground: "#0f172a",
        border: "#e2e8f0",
        input: "#ffffff",
        ring: "#0066cc",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
        muted: "#f8fafc",
        mutedForeground: "#64748b",
        accent: "#00cc66",
        accentForeground: "#ffffff",
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
      },
      typography: {
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: {
          xs: "0.75rem",
          sm: "0.875rem",
          base: "1rem",
          lg: "1.125rem",
          xl: "1.25rem",
          xxl: "1.5rem",
        },
        lineHeight: {
          tight: "1.25",
          normal: "1.5",
          relaxed: "1.75",
        },
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
      },
      shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      },
    });

    // Dark theme tokens
    this.themeTokens.set("dark", {
      colors: {
        primary: "#3b82f6",
        primaryForeground: "#ffffff",
        secondary: "#1e293b",
        secondaryForeground: "#f8fafc",
        background: "#0f172a",
        foreground: "#f8fafc",
        card: "#1e293b",
        cardForeground: "#f8fafc",
        border: "#334155",
        input: "#1e293b",
        ring: "#3b82f6",
        success: "#22c55e",
        warning: "#eab308",
        error: "#f87171",
        info: "#60a5fa",
        muted: "#1e293b",
        mutedForeground: "#94a3b8",
        accent: "#22c55e",
        accentForeground: "#ffffff",
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
      },
      typography: {
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        fontSize: {
          xs: "0.75rem",
          sm: "0.875rem",
          base: "1rem",
          lg: "1.125rem",
          xl: "1.25rem",
          xxl: "1.5rem",
        },
        lineHeight: {
          tight: "1.25",
          normal: "1.5",
          relaxed: "1.75",
        },
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
      },
      shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.2)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.2)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.2)",
      },
    });

    // High contrast light theme
    this.themeTokens.set("light-high-contrast", {
      ...this.themeTokens.get("light")!,
      colors: {
        ...this.themeTokens.get("light")!.colors,
        primary: "#000000",
        background: "#ffffff",
        foreground: "#000000",
        border: "#000000",
        muted: "#f0f0f0",
        mutedForeground: "#000000",
      },
    });

    // High contrast dark theme
    this.themeTokens.set("dark-high-contrast", {
      ...this.themeTokens.get("dark")!,
      colors: {
        ...this.themeTokens.get("dark")!.colors,
        primary: "#ffffff",
        background: "#000000",
        foreground: "#ffffff",
        border: "#ffffff",
        muted: "#1a1a1a",
        mutedForeground: "#ffffff",
      },
    });
  }

  private setupMediaQueryListener(): void {
    this.mediaQuery.addEventListener("change", () => {
      if (this.currentConfig.mode === "auto") {
        this.applyTheme();
        this.notifyListeners();
      }
    });
  }

  private setupConnectionMonitoring(): void {
    if (this.connectionMonitor) {
      const updateBandwidth = () => {
        if (this.currentConfig.bandwidthMode === "auto") {
          this.updateBandwidthOptimizations();
        }
      };

      this.connectionMonitor.addEventListener("change", updateBandwidth);
      updateBandwidth(); // Initial check
    }
  }

  private loadSavedConfig(): void {
    try {
      const saved = localStorage.getItem("theme-config");
      if (saved) {
        this.currentConfig = { ...this.currentConfig, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error("Failed to load saved theme config:", error);
    }
  }

  private saveConfig(): void {
    try {
      localStorage.setItem("theme-config", JSON.stringify(this.currentConfig));
      realTimeDataSyncSystem.syncData("user-theme-config", this.currentConfig);
    } catch (error) {
      console.error("Failed to save theme config:", error);
    }
  }

  public updateConfig(config: Partial<ThemeConfig>): void {
    this.currentConfig = { ...this.currentConfig, ...config };
    this.saveConfig();
    this.applyTheme();
    this.updateBandwidthOptimizations();
    this.notifyListeners();
  }

  public getConfig(): ThemeConfig {
    return { ...this.currentConfig };
  }

  public getThemeTokens(): ThemeTokens {
    const resolvedMode = this.resolveThemeMode();
    const themeKey = this.currentConfig.highContrast
      ? `${resolvedMode}-high-contrast`
      : resolvedMode;

    return this.themeTokens.get(themeKey) || this.themeTokens.get("light")!;
  }

  public getBandwidthOptimizations(): BandwidthOptimizations {
    return { ...this.bandwidthOptimizations };
  }

  private resolveThemeMode(): "light" | "dark" {
    if (this.currentConfig.mode === "auto") {
      return this.mediaQuery.matches ? "dark" : "light";
    }
    return this.currentConfig.mode as "light" | "dark";
  }

  private applyTheme(): void {
    const tokens = this.getThemeTokens();
    const root = document.documentElement;

    // Apply CSS custom properties
    Object.entries(tokens.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    Object.entries(tokens.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });

    Object.entries(tokens.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value);
    });

    Object.entries(tokens.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Apply font size scaling
    const fontSizeScale = {
      small: "0.875",
      medium: "1",
      large: "1.125",
    };
    root.style.setProperty(
      "--font-size-scale",
      fontSizeScale[this.currentConfig.fontSize],
    );

    // Apply theme class to body
    const resolvedMode = this.resolveThemeMode();
    document.body.className = document.body.className
      .replace(/theme-\w+/g, "")
      .replace(/\s+/g, " ")
      .trim();

    document.body.classList.add(`theme-${resolvedMode}`);

    if (this.currentConfig.highContrast) {
      document.body.classList.add("theme-high-contrast");
    }

    if (this.currentConfig.compactMode) {
      document.body.classList.add("theme-compact");
    }

    if (
      this.currentConfig.reducedAnimations ||
      this.bandwidthOptimizations.reducedAnimations
    ) {
      document.body.classList.add("theme-reduced-motion");
    }
  }

  private updateBandwidthOptimizations(): void {
    if (this.currentConfig.bandwidthMode === "auto") {
      this.detectAndSetBandwidthMode();
    } else {
      this.setBandwidthOptimizations(this.currentConfig.bandwidthMode);
    }
  }

  private detectAndSetBandwidthMode(): void {
    if (this.connectionMonitor) {
      const connection = this.connectionMonitor;
      const effectiveType = connection.effectiveType;

      let detectedMode: BandwidthMode = "medium";

      if (effectiveType === "4g" || connection.downlink > 5) {
        detectedMode = "high";
      } else if (effectiveType === "3g" || connection.downlink > 1) {
        detectedMode = "medium";
      } else {
        detectedMode = "low";
      }

      this.setBandwidthOptimizations(detectedMode);
    } else {
      // Fallback: performance timing-based detection
      this.performSpeedTest().then((speed) => {
        if (speed > 5) {
          this.setBandwidthOptimizations("high");
        } else if (speed > 1) {
          this.setBandwidthOptimizations("medium");
        } else {
          this.setBandwidthOptimizations("low");
        }
      });
    }
  }

  private async performSpeedTest(): Promise<number> {
    try {
      const start = performance.now();
      const response = await fetch("/api/health.json", { cache: "no-cache" });
      await response.json();
      const duration = performance.now() - start;

      // Rough estimation: smaller file, faster connection
      const estimatedSpeed = 1000 / duration; // Simplified calculation
      return estimatedSpeed;
    } catch (error) {
      return 1; // Default to medium-low speed on error
    }
  }

  private setBandwidthOptimizations(mode: BandwidthMode): void {
    switch (mode) {
      case "high":
        this.bandwidthOptimizations = {
          imageQuality: "high",
          useWebP: true,
          lazyLoadImages: true,
          compressAssets: false,
          reducedAnimations: false,
          simplifiedCharts: false,
          batchRequests: false,
          cacheStrategy: "moderate",
        };
        break;

      case "medium":
        this.bandwidthOptimizations = {
          imageQuality: "medium",
          useWebP: true,
          lazyLoadImages: true,
          compressAssets: true,
          reducedAnimations: false,
          simplifiedCharts: false,
          batchRequests: true,
          cacheStrategy: "aggressive",
        };
        break;

      case "low":
        this.bandwidthOptimizations = {
          imageQuality: "low",
          useWebP: false, // Better compatibility
          lazyLoadImages: true,
          compressAssets: true,
          reducedAnimations: true,
          simplifiedCharts: true,
          batchRequests: true,
          cacheStrategy: "aggressive",
        };
        break;
    }

    // Re-apply theme to update animations
    this.applyTheme();
  }

  public addListener(listener: (config: ThemeConfig) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentConfig));
  }

  public getOptimizedImageUrl(
    originalUrl: string,
    width?: number,
    height?: number,
  ): string {
    const opts = this.bandwidthOptimizations;

    // Simple optimization logic - in production, this would integrate with an image service
    let optimizedUrl = originalUrl;

    if (opts.compressAssets) {
      const params = new URLSearchParams();

      if (width) params.set("w", width.toString());
      if (height) params.set("h", height.toString());

      params.set(
        "q",
        opts.imageQuality === "high"
          ? "90"
          : opts.imageQuality === "medium"
            ? "70"
            : "50",
      );

      if (opts.useWebP) {
        params.set("format", "webp");
      }

      optimizedUrl = `${originalUrl}?${params.toString()}`;
    }

    return optimizedUrl;
  }

  public shouldShowAnimation(): boolean {
    return (
      !this.currentConfig.reducedAnimations &&
      !this.bandwidthOptimizations.reducedAnimations
    );
  }

  public shouldUseSimplifiedCharts(): boolean {
    return this.bandwidthOptimizations.simplifiedCharts;
  }

  public getCacheStrategy(): string {
    return this.bandwidthOptimizations.cacheStrategy;
  }

  public getAccessibilitySettings(): {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: string;
  } {
    return {
      reducedMotion:
        this.currentConfig.reducedAnimations ||
        this.bandwidthOptimizations.reducedAnimations,
      highContrast: this.currentConfig.highContrast,
      fontSize: this.currentConfig.fontSize,
    };
  }
}

export const themeService = new ThemeService();
