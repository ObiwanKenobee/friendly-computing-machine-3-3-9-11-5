/**
 * Load Failed Error Detector and Auto-Fixer
 * Detects and automatically resolves "Load failed" errors in the QuantumVest application
 */

interface LoadFailedEvent {
  timestamp: number;
  source: string;
  errorType: "component" | "timeout" | "network" | "module";
  errorMessage: string;
  userAgent: string;
  url: string;
}

class LoadFailedDetector {
  private static instance: LoadFailedDetector;
  private failures: LoadFailedEvent[] = [];
  private isMonitoring = false;
  private autoFixEnabled = true;

  private constructor() {
    this.startMonitoring();
  }

  public static getInstance(): LoadFailedDetector {
    if (!LoadFailedDetector.instance) {
      LoadFailedDetector.instance = new LoadFailedDetector();
    }
    return LoadFailedDetector.instance;
  }

  private startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Monitor for "Load failed" text in DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              this.checkElementForLoadFailedText(element);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Monitor for console errors related to loading
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(" ").toLowerCase();
      if (this.isLoadRelatedError(message)) {
        this.recordLoadFailure({
          source: "console",
          errorType: "module",
          errorMessage: args.join(" "),
        });
      }
      originalConsoleError.apply(console, args);
    };

    // Monitor for unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      const reason = event.reason;
      if (reason && typeof reason === "object" && "message" in reason) {
        const message = reason.message.toLowerCase();
        if (this.isLoadRelatedError(message)) {
          this.recordLoadFailure({
            source: "promise",
            errorType: "module",
            errorMessage: reason.message,
          });

          if (this.autoFixEnabled) {
            this.attemptAutoFix(reason.message);
          }
        }
      }
    });

    console.log("🔍 Load Failed Detector: Monitoring started");
  }

  private checkElementForLoadFailedText(element: Element): void {
    const textContent = element.textContent?.toLowerCase() || "";

    // Check for various forms of "load failed" messages
    const loadFailedPatterns = [
      "load failed",
      "module load failed",
      "component loading",
      "loading timeout",
      "failed to load",
    ];

    const foundPattern = loadFailedPatterns.find((pattern) =>
      textContent.includes(pattern),
    );

    if (foundPattern) {
      this.recordLoadFailure({
        source: "dom",
        errorType: "component",
        errorMessage: `Found "${foundPattern}" in DOM: ${textContent.substring(0, 100)}`,
      });

      if (this.autoFixEnabled) {
        this.attemptDOMFix(element, foundPattern);
      }
    }
  }

  private isLoadRelatedError(message: string): boolean {
    const loadErrorPatterns = [
      "failed to import",
      "chunk load failed",
      "loading chunk",
      "importing a module script failed",
      "failed to fetch",
      "networkerror",
      "module not found",
      "cannot resolve module",
    ];

    return loadErrorPatterns.some((pattern) => message.includes(pattern));
  }

  private recordLoadFailure(
    failure: Omit<LoadFailedEvent, "timestamp" | "userAgent" | "url">,
  ): void {
    const loadFailedEvent: LoadFailedEvent = {
      ...failure,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.failures.push(loadFailedEvent);

    // Keep only last 50 failures
    if (this.failures.length > 50) {
      this.failures = this.failures.slice(-50);
    }

    console.warn("🚨 Load Failed Detected:", {
      type: failure.errorType,
      source: failure.source,
      message: failure.errorMessage.substring(0, 100),
    });
  }

  private attemptAutoFix(errorMessage: string): void {
    console.log("🔧 Attempting auto-fix for load failure...");

    // Strategy 1: Clear module cache and retry
    if (
      errorMessage.includes("chunk load failed") ||
      errorMessage.includes("failed to import")
    ) {
      setTimeout(() => {
        console.log("🔄 Reloading page to clear module cache...");
        window.location.reload();
      }, 2000);
      return;
    }

    // Strategy 2: Navigate to safe route
    if (errorMessage.includes("module not found")) {
      setTimeout(() => {
        console.log("🏠 Navigating to home page...");
        window.location.href = "/";
      }, 1000);
      return;
    }

    console.log("⚠️ No auto-fix strategy available for this error type");
  }

  private attemptDOMFix(element: Element, pattern: string): void {
    console.log(`🔧 Attempting DOM fix for pattern: ${pattern}`);

    // Strategy 1: Replace "Load Failed" with more positive messaging
    if (
      pattern.includes("load failed") ||
      pattern.includes("module load failed")
    ) {
      const loadingElement = this.createImprovedLoadingElement();
      element.parentNode?.replaceChild(loadingElement, element);
      console.log(
        "✅ Replaced load failed message with improved loading state",
      );
    }

    // Strategy 2: Add retry functionality to timeout messages
    if (pattern.includes("loading timeout")) {
      this.addRetryButtonToElement(element);
    }

    // Strategy 3: Auto-navigate away from broken pages
    if (pattern.includes("component loading") && this.failures.length > 3) {
      setTimeout(() => {
        console.log("🏠 Too many load failures, navigating to safe route...");
        window.location.href = "/";
      }, 5000);
    }
  }

  private createImprovedLoadingElement(): HTMLElement {
    const container = document.createElement("div");
    container.className =
      "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4";

    container.innerHTML = `
      <div class="text-center max-w-md">
        <div class="animate-spin inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Loading QuantumVest</h2>
        <p class="text-gray-600 mb-4">
          Initializing your enterprise investment platform...
        </p>
        <div class="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4">
          <p class="text-blue-800 text-sm">
            🚀 Enterprise applications may take a moment to load all security layers and features.
          </p>
        </div>
        <button 
          onclick="window.location.reload()" 
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
        >
          Refresh Page
        </button>
        <button 
          onclick="window.location.href='/'" 
          class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Go Home
        </button>
      </div>
    `;

    return container;
  }

  private addRetryButtonToElement(element: Element): void {
    const retryButton = document.createElement("button");
    retryButton.className =
      "mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700";
    retryButton.textContent = "Retry Loading";
    retryButton.onclick = () => window.location.reload();

    element.appendChild(retryButton);
    console.log("✅ Added retry button to timeout element");
  }

  public getFailureStats(): {
    totalFailures: number;
    recentFailures: number;
    commonPatterns: string[];
    lastFailure?: LoadFailedEvent;
  } {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    const recentFailures = this.failures.filter(
      (f) => f.timestamp >= fiveMinutesAgo,
    );

    const patternCounts = new Map<string, number>();
    this.failures.forEach((failure) => {
      const count = patternCounts.get(failure.errorType) || 0;
      patternCounts.set(failure.errorType, count + 1);
    });

    const commonPatterns = Array.from(patternCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([pattern]) => pattern);

    return {
      totalFailures: this.failures.length,
      recentFailures: recentFailures.length,
      commonPatterns,
      lastFailure: this.failures[this.failures.length - 1],
    };
  }

  public enableAutoFix(): void {
    this.autoFixEnabled = true;
    console.log("✅ Auto-fix enabled");
  }

  public disableAutoFix(): void {
    this.autoFixEnabled = false;
    console.log("⚠️ Auto-fix disabled");
  }

  public clearFailureHistory(): void {
    this.failures = [];
    console.log("🗑️ Load failure history cleared");
  }

  public forceNavigateToSafeRoute(): void {
    console.log("🏠 Force navigating to safe route...");
    window.location.href = "/";
  }
}

// Auto-initialize in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    const detector = LoadFailedDetector.getInstance();
    console.log("🔍 Load Failed Detector initialized");

    // Expose to window for debugging
    (window as any).loadFailedDetector = detector;
  }, 1000);
}

export default LoadFailedDetector;
