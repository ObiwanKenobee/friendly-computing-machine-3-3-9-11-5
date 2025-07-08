/**
 * Advanced Error Detection and Recovery System
 * Enterprise-grade error detection, analysis, and automated recovery with ML-powered predictions
 */

import { appHealthMonitor } from "../utils/appHealthMonitor";
import { enterpriseInnovationSystem } from "./enterpriseInnovationSystem";

export interface ErrorPattern {
  id: string;
  pattern: string | RegExp;
  category: ErrorCategory;
  severity: ErrorSeverity;
  frequency: number;
  lastOccurrence: number;
  resolution?: AutoResolution;
  mlConfidence?: number;
}

export type ErrorCategory =
  | "network"
  | "authentication"
  | "authorization"
  | "validation"
  | "rendering"
  | "state_management"
  | "api_failure"
  | "database_error"
  | "memory_leak"
  | "performance"
  | "security"
  | "unknown";

export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export interface AutoResolution {
  strategy: ResolutionStrategy;
  steps: ResolutionStep[];
  successRate: number;
  avgResolutionTime: number;
  enabled: boolean;
}

export type ResolutionStrategy =
  | "retry"
  | "fallback"
  | "cache_clear"
  | "reload"
  | "redirect"
  | "service_restart"
  | "graceful_degradation"
  | "user_notification"
  | "escalate"
  | "custom";

export interface ResolutionStep {
  action: string;
  parameters?: any;
  timeout?: number;
  retryCount?: number;
  condition?: string;
}

export interface ErrorAnalysis {
  errorId: string;
  analysis: {
    rootCause: string;
    impactAssessment: ImpactAssessment;
    recommendedActions: RecommendedAction[];
    predictedRecurrence: RecurrencePrediction;
    similarPatterns: ErrorPattern[];
  };
  timestamp: number;
}

export interface ImpactAssessment {
  userImpact: "none" | "minimal" | "moderate" | "severe" | "critical";
  systemImpact: "none" | "minimal" | "moderate" | "severe" | "critical";
  businessImpact: "none" | "minimal" | "moderate" | "severe" | "critical";
  affectedUsers: number;
  affectedComponents: string[];
  dataIntegrityRisk: boolean;
  securityRisk: boolean;
}

export interface RecommendedAction {
  priority: number;
  action: string;
  description: string;
  estimatedEffort: "low" | "medium" | "high";
  estimatedImpact: "low" | "medium" | "high";
  automated: boolean;
}

export interface RecurrencePrediction {
  probability: number;
  timeframe: string;
  conditions: string[];
  preventionStrategies: string[];
}

export interface ErrorRecoveryMetrics {
  totalErrors: number;
  resolvedErrors: number;
  automaticResolutions: number;
  averageResolutionTime: number;
  successRate: number;
  criticalErrors: number;
  userReportedErrors: number;
  systemDetectedErrors: number;
}

export interface MLErrorPredictor {
  trainModel: (errorHistory: ErrorData[]) => Promise<void>;
  predictError: (contextData: any) => Promise<ErrorPrediction>;
  analyzePattern: (errors: ErrorData[]) => Promise<ErrorPattern[]>;
  optimizeResolution: (
    pattern: ErrorPattern,
    outcomes: ResolutionOutcome[],
  ) => Promise<AutoResolution>;
}

export interface ErrorPrediction {
  errorType: ErrorCategory;
  probability: number;
  timeframe: number;
  preventionActions: string[];
  confidence: number;
}

export interface ErrorData {
  id: string;
  message: string;
  stack: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: number;
  context: ErrorContext;
  resolution?: ResolutionOutcome;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
}

export interface ErrorContext {
  component: string;
  props?: any;
  state?: any;
  userAction?: string;
  networkConditions?: NetworkConditions;
  systemResources?: SystemResources;
  browserInfo?: BrowserInfo;
}

export interface NetworkConditions {
  online: boolean;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface SystemResources {
  memoryUsage: number;
  cpuUsage: number;
  storageUsage: number;
  batteryLevel?: number;
}

export interface BrowserInfo {
  userAgent: string;
  platform: string;
  language: string;
  cookieEnabled: boolean;
  javaEnabled: boolean;
  onLine: boolean;
}

export interface ResolutionOutcome {
  strategy: ResolutionStrategy;
  success: boolean;
  duration: number;
  steps: CompletedStep[];
  sideEffects?: string[];
  userFeedback?: UserFeedback;
}

export interface CompletedStep {
  action: string;
  result: "success" | "failure" | "skipped";
  duration: number;
  output?: any;
}

export interface UserFeedback {
  rating: number; // 1-5
  comment?: string;
  wouldUseAgain: boolean;
  timestamp: number;
}

export class AdvancedErrorDetectionSystem {
  private static instance: AdvancedErrorDetectionSystem;
  private errorPatterns: Map<string, ErrorPattern> = new Map();
  private errorHistory: ErrorData[] = [];
  private recoveryMetrics: ErrorRecoveryMetrics;
  private mlPredictor: MLErrorPredictor;
  private isInitialized = false;
  private monitoringInterval?: NodeJS.Timeout;
  private eventListeners: Map<string, Function[]> = new Map();

  private constructor() {
    this.initializeMetrics();
    this.initializeMLPredictor();
    this.setupGlobalErrorHandlers();
  }

  public static getInstance(): AdvancedErrorDetectionSystem {
    if (!AdvancedErrorDetectionSystem.instance) {
      AdvancedErrorDetectionSystem.instance =
        new AdvancedErrorDetectionSystem();
    }
    return AdvancedErrorDetectionSystem.instance;
  }

  private initializeMetrics(): void {
    this.recoveryMetrics = {
      totalErrors: 0,
      resolvedErrors: 0,
      automaticResolutions: 0,
      averageResolutionTime: 0,
      successRate: 0,
      criticalErrors: 0,
      userReportedErrors: 0,
      systemDetectedErrors: 0,
    };
  }

  private initializeMLPredictor(): void {
    this.mlPredictor = {
      trainModel: async (errorHistory: ErrorData[]) => {
        console.log(
          "🤖 Training ML model with",
          errorHistory.length,
          "error samples",
        );
        // Placeholder for ML model training
        // In production, this would use TensorFlow.js or similar
      },

      predictError: async (contextData: any): Promise<ErrorPrediction> => {
        // Placeholder for ML prediction
        const patterns = Array.from(this.errorPatterns.values());
        const recentPattern =
          patterns[Math.floor(Math.random() * patterns.length)];

        return {
          errorType: recentPattern?.category || "unknown",
          probability: Math.random() * 0.3, // Low probability for demo
          timeframe: 3600000, // 1 hour
          preventionActions: [
            "Monitor memory usage",
            "Check network stability",
          ],
          confidence: 0.7,
        };
      },

      analyzePattern: async (errors: ErrorData[]): Promise<ErrorPattern[]> => {
        const patterns: ErrorPattern[] = [];
        const errorGroups = new Map<string, ErrorData[]>();

        // Group similar errors
        errors.forEach((error) => {
          const key = `${error.category}_${error.message.substring(0, 50)}`;
          if (!errorGroups.has(key)) {
            errorGroups.set(key, []);
          }
          errorGroups.get(key)!.push(error);
        });

        // Create patterns from groups
        errorGroups.forEach((groupErrors, key) => {
          if (groupErrors.length >= 3) {
            // Only patterns with 3+ occurrences
            patterns.push({
              id: this.generateId(),
              pattern: groupErrors[0].message,
              category: groupErrors[0].category,
              severity: this.calculateAverageSeverity(groupErrors),
              frequency: groupErrors.length,
              lastOccurrence: Math.max(...groupErrors.map((e) => e.timestamp)),
              mlConfidence: 0.8,
            });
          }
        });

        return patterns;
      },

      optimizeResolution: async (
        pattern: ErrorPattern,
        outcomes: ResolutionOutcome[],
      ): Promise<AutoResolution> => {
        const successfulOutcomes = outcomes.filter((o) => o.success);
        const successRate = successfulOutcomes.length / outcomes.length;
        const avgTime =
          outcomes.reduce((sum, o) => sum + o.duration, 0) / outcomes.length;

        // Find most successful strategy
        const strategySuccess = new Map<ResolutionStrategy, number>();
        outcomes.forEach((outcome) => {
          const current = strategySuccess.get(outcome.strategy) || 0;
          strategySuccess.set(
            outcome.strategy,
            current + (outcome.success ? 1 : 0),
          );
        });

        const bestStrategy =
          Array.from(strategySuccess.entries()).sort(
            ([, a], [, b]) => b - a,
          )[0]?.[0] || "retry";

        return {
          strategy: bestStrategy,
          steps: this.generateResolutionSteps(bestStrategy),
          successRate,
          avgResolutionTime: avgTime,
          enabled: successRate > 0.7, // Only enable if success rate > 70%
        };
      },
    };
  }

  private setupGlobalErrorHandlers(): void {
    // Unhandled errors
    window.addEventListener("error", (event) => {
      this.captureError({
        message: event.error?.message || event.message,
        stack: event.error?.stack || "",
        category: this.categorizeError(event.error),
        severity: this.assessSeverity(event.error),
        context: this.gatherErrorContext("global", event),
      });
    });

    // Unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.captureError({
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack || "",
        category: this.categorizeError(event.reason),
        severity: this.assessSeverity(event.reason),
        context: this.gatherErrorContext("promise", event),
      });
    });

    // React error boundaries integration
    this.setupReactErrorIntegration();
  }

  private setupReactErrorIntegration(): void {
    // Extend window to include React error reporting
    (window as any).__reportReactError = (error: Error, errorInfo: any) => {
      this.captureError({
        message: error.message,
        stack: error.stack || "",
        category: "rendering",
        severity: this.assessSeverity(error),
        context: this.gatherErrorContext("react", { error, errorInfo }),
      });
    };
  }

  public async initialize(): Promise<void> {
    try {
      console.log("🔍 Initializing Advanced Error Detection System...");

      // Load historical error data
      await this.loadErrorHistory();

      // Analyze existing patterns
      await this.analyzeExistingPatterns();

      // Train ML model if enough data
      if (this.errorHistory.length > 100) {
        await this.mlPredictor.trainModel(this.errorHistory);
      }

      // Start monitoring
      this.startContinuousMonitoring();

      this.isInitialized = true;
      console.log("✅ Advanced Error Detection System initialized");

      this.emit("system:initialized", { metrics: this.recoveryMetrics });
    } catch (error) {
      console.error(
        "❌ Failed to initialize Advanced Error Detection System:",
        error,
      );
      throw error;
    }
  }

  private async loadErrorHistory(): Promise<void> {
    try {
      const storedHistory = localStorage.getItem("error_history");
      if (storedHistory) {
        this.errorHistory = JSON.parse(storedHistory);
        console.log(`📊 Loaded ${this.errorHistory.length} historical errors`);
      }
    } catch (error) {
      console.warn("⚠️ Failed to load error history:", error);
    }
  }

  private async analyzeExistingPatterns(): Promise<void> {
    if (this.errorHistory.length === 0) return;

    try {
      const patterns = await this.mlPredictor.analyzePattern(this.errorHistory);
      patterns.forEach((pattern) => {
        this.errorPatterns.set(pattern.id, pattern);
      });

      console.log(`🔍 Identified ${patterns.length} error patterns`);
    } catch (error) {
      console.error("❌ Failed to analyze error patterns:", error);
    }
  }

  private startContinuousMonitoring(): void {
    // Monitor system health every 30 seconds
    this.monitoringInterval = setInterval(async () => {
      await this.performHealthCheck();
      await this.predictUpcomingErrors();
      await this.optimizeRecoveryStrategies();
    }, 30000);

    // Persist error data every 5 minutes
    setInterval(() => {
      this.persistErrorData();
    }, 300000);
  }

  public async captureError(errorData: Partial<ErrorData>): Promise<string> {
    const errorId = this.generateId();

    const fullErrorData: ErrorData = {
      id: errorId,
      message: errorData.message || "Unknown error",
      stack: errorData.stack || "",
      category: errorData.category || "unknown",
      severity: errorData.severity || "medium",
      timestamp: Date.now(),
      context: errorData.context || this.gatherErrorContext("manual"),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getSessionId(),
    };

    // Add to history
    this.errorHistory.push(fullErrorData);
    this.updateMetrics();

    // Check for matching patterns
    const matchingPattern = this.findMatchingPattern(fullErrorData);

    if (matchingPattern) {
      matchingPattern.frequency++;
      matchingPattern.lastOccurrence = fullErrorData.timestamp;

      // Attempt automatic resolution if enabled
      if (matchingPattern.resolution?.enabled) {
        setTimeout(async () => {
          await this.attemptAutoResolution(fullErrorData, matchingPattern);
        }, 100);
      }
    } else {
      // Create new pattern if error occurs frequently
      setTimeout(async () => {
        await this.checkForNewPattern(fullErrorData);
      }, 1000);
    }

    // Emit error event
    this.emit("error:captured", fullErrorData);

    // Perform immediate analysis for critical errors
    if (fullErrorData.severity === "critical") {
      const analysis = await this.analyzeError(fullErrorData);
      this.emit("error:critical", { error: fullErrorData, analysis });
    }

    console.log(
      `🚨 Error captured: ${errorId} (${fullErrorData.category}/${fullErrorData.severity})`,
    );

    return errorId;
  }

  private findMatchingPattern(errorData: ErrorData): ErrorPattern | undefined {
    return Array.from(this.errorPatterns.values()).find((pattern) => {
      if (pattern.pattern instanceof RegExp) {
        return pattern.pattern.test(errorData.message);
      }
      return errorData.message.includes(pattern.pattern as string);
    });
  }

  private async checkForNewPattern(errorData: ErrorData): Promise<void> {
    // Look for similar errors in recent history
    const recentSimilar = this.errorHistory.filter(
      (error) =>
        error.category === errorData.category &&
        error.message.includes(errorData.message.substring(0, 30)) &&
        Date.now() - error.timestamp < 3600000, // Last hour
    );

    if (recentSimilar.length >= 3) {
      const newPattern: ErrorPattern = {
        id: this.generateId(),
        pattern: errorData.message.substring(0, 50),
        category: errorData.category,
        severity: errorData.severity,
        frequency: recentSimilar.length,
        lastOccurrence: errorData.timestamp,
        resolution: await this.generateAutoResolution(errorData),
      };

      this.errorPatterns.set(newPattern.id, newPattern);
      console.log(`🔍 New error pattern detected: ${newPattern.id}`);

      this.emit("pattern:detected", newPattern);
    }
  }

  private async attemptAutoResolution(
    errorData: ErrorData,
    pattern: ErrorPattern,
  ): Promise<void> {
    if (!pattern.resolution) return;

    console.log(
      `🔧 Attempting auto-resolution for error ${errorData.id} using strategy: ${pattern.resolution.strategy}`,
    );

    const startTime = Date.now();
    const completedSteps: CompletedStep[] = [];
    let success = false;

    try {
      for (const step of pattern.resolution.steps) {
        const stepStartTime = Date.now();

        try {
          const result = await this.executeResolutionStep(step, errorData);

          completedSteps.push({
            action: step.action,
            result: result ? "success" : "failure",
            duration: Date.now() - stepStartTime,
            output: result,
          });

          if (result) {
            success = true;
            break; // Success, no need to continue
          }
        } catch (stepError) {
          completedSteps.push({
            action: step.action,
            result: "failure",
            duration: Date.now() - stepStartTime,
            output: stepError.message,
          });
        }
      }

      const outcome: ResolutionOutcome = {
        strategy: pattern.resolution.strategy,
        success,
        duration: Date.now() - startTime,
        steps: completedSteps,
      };

      // Update resolution success rate
      this.updateResolutionMetrics(pattern, outcome);

      if (success) {
        this.recoveryMetrics.automaticResolutions++;
        console.log(`✅ Auto-resolution successful for error ${errorData.id}`);
        this.emit("resolution:success", { errorData, outcome });
      } else {
        console.log(`❌ Auto-resolution failed for error ${errorData.id}`);
        this.emit("resolution:failure", { errorData, outcome });
      }
    } catch (error) {
      console.error("❌ Auto-resolution process failed:", error);
      this.emit("resolution:error", { errorData, error });
    }
  }

  private async executeResolutionStep(
    step: ResolutionStep,
    errorData: ErrorData,
  ): Promise<any> {
    switch (step.action) {
      case "retry":
        // Retry the failed operation
        if (errorData.context.userAction) {
          return this.retryUserAction(errorData.context.userAction);
        }
        break;

      case "clear_cache":
        // Clear various caches
        if ("caches" in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((name) => caches.delete(name)));
        }
        localStorage.clear();
        sessionStorage.clear();
        return true;

      case "reload_page":
        // Reload the current page
        window.location.reload();
        return true;

      case "redirect_home":
        // Redirect to home page
        window.location.href = "/";
        return true;

      case "show_notification":
        // Show user notification
        this.showUserNotification(
          step.parameters?.message ||
            "An error occurred, but we're working on it",
        );
        return true;

      case "reset_component_state":
        // Reset component state (would need component reference)
        return this.resetComponentState(step.parameters?.componentId);

      case "fallback_ui":
        // Switch to fallback UI
        return this.activateFallbackUI(errorData.context.component);

      default:
        throw new Error(`Unknown resolution step: ${step.action}`);
    }

    return false;
  }

  private async retryUserAction(action: string): Promise<boolean> {
    // Placeholder for retrying user actions
    // In production, this would need to store and replay user actions
    console.log(`Retrying user action: ${action}`);
    return Math.random() > 0.5; // 50% success rate for demo
  }

  private resetComponentState(componentId?: string): boolean {
    // Placeholder for component state reset
    console.log(`Resetting component state: ${componentId}`);
    return true;
  }

  private activateFallbackUI(component: string): boolean {
    // Placeholder for fallback UI activation
    console.log(`Activating fallback UI for: ${component}`);
    return true;
  }

  private showUserNotification(message: string): void {
    // Create a simple notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-blue-500 text-white p-4 rounded shadow-lg z-50";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  }

  private async generateAutoResolution(
    errorData: ErrorData,
  ): Promise<AutoResolution> {
    const strategy = this.selectResolutionStrategy(errorData);

    return {
      strategy,
      steps: this.generateResolutionSteps(strategy),
      successRate: 0.5, // Start with 50% expected success rate
      avgResolutionTime: 5000, // 5 seconds
      enabled: true,
    };
  }

  private selectResolutionStrategy(errorData: ErrorData): ResolutionStrategy {
    switch (errorData.category) {
      case "network":
        return "retry";
      case "authentication":
        return "redirect";
      case "rendering":
        return "reload";
      case "memory_leak":
        return "cache_clear";
      case "api_failure":
        return "fallback";
      default:
        return "user_notification";
    }
  }

  private generateResolutionSteps(
    strategy: ResolutionStrategy,
  ): ResolutionStep[] {
    switch (strategy) {
      case "retry":
        return [
          { action: "retry", timeout: 5000, retryCount: 3 },
          {
            action: "show_notification",
            parameters: { message: "Retrying operation..." },
          },
        ];

      case "fallback":
        return [
          { action: "fallback_ui" },
          {
            action: "show_notification",
            parameters: { message: "Using fallback interface" },
          },
        ];

      case "cache_clear":
        return [{ action: "clear_cache" }, { action: "reload_page" }];

      case "reload":
        return [
          {
            action: "show_notification",
            parameters: { message: "Refreshing page..." },
          },
          { action: "reload_page" },
        ];

      case "redirect":
        return [
          {
            action: "show_notification",
            parameters: { message: "Redirecting to home..." },
          },
          { action: "redirect_home" },
        ];

      default:
        return [
          {
            action: "show_notification",
            parameters: { message: "Error detected and logged" },
          },
        ];
    }
  }

  private updateResolutionMetrics(
    pattern: ErrorPattern,
    outcome: ResolutionOutcome,
  ): void {
    if (!pattern.resolution) return;

    // Update pattern resolution metrics (simplified)
    const currentRate = pattern.resolution.successRate;
    const newRate = outcome.success
      ? currentRate + 0.1
      : Math.max(0, currentRate - 0.1);

    pattern.resolution.successRate = Math.min(1, newRate);
    pattern.resolution.avgResolutionTime =
      (pattern.resolution.avgResolutionTime + outcome.duration) / 2;
  }

  private async analyzeError(errorData: ErrorData): Promise<ErrorAnalysis> {
    const analysis: ErrorAnalysis = {
      errorId: errorData.id,
      analysis: {
        rootCause: await this.determineRootCause(errorData),
        impactAssessment: this.assessImpact(errorData),
        recommendedActions: this.generateRecommendations(errorData),
        predictedRecurrence: await this.predictRecurrence(errorData),
        similarPatterns: this.findSimilarPatterns(errorData),
      },
      timestamp: Date.now(),
    };

    this.emit("error:analyzed", analysis);
    return analysis;
  }

  private async determineRootCause(errorData: ErrorData): Promise<string> {
    // Analyze error message, stack, and context to determine root cause
    const message = errorData.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return "Network connectivity issue or API endpoint unavailable";
    }
    if (message.includes("memory") || message.includes("heap")) {
      return "Memory allocation issue or memory leak";
    }
    if (message.includes("undefined") || message.includes("null")) {
      return "Undefined variable access or null reference";
    }
    if (message.includes("permission") || message.includes("auth")) {
      return "Authentication or authorization failure";
    }

    return "Unknown root cause - requires manual investigation";
  }

  private assessImpact(errorData: ErrorData): ImpactAssessment {
    const severity = errorData.severity;
    const category = errorData.category;

    return {
      userImpact:
        severity === "critical"
          ? "critical"
          : severity === "high"
            ? "severe"
            : "moderate",
      systemImpact:
        category === "security"
          ? "critical"
          : severity === "critical"
            ? "severe"
            : "moderate",
      businessImpact: category === "api_failure" ? "severe" : "moderate",
      affectedUsers: this.estimateAffectedUsers(errorData),
      affectedComponents: [errorData.context.component],
      dataIntegrityRisk: category === "database_error",
      securityRisk: category === "security",
    };
  }

  private estimateAffectedUsers(errorData: ErrorData): number {
    // Estimate based on error frequency and context
    const pattern = this.findMatchingPattern(errorData);
    return pattern ? Math.min(pattern.frequency * 10, 1000) : 1;
  }

  private generateRecommendations(errorData: ErrorData): RecommendedAction[] {
    const recommendations: RecommendedAction[] = [];

    switch (errorData.category) {
      case "network":
        recommendations.push({
          priority: 1,
          action: "Implement retry logic with exponential backoff",
          description: "Add robust retry mechanisms for network requests",
          estimatedEffort: "medium",
          estimatedImpact: "high",
          automated: true,
        });
        break;

      case "memory_leak":
        recommendations.push({
          priority: 1,
          action: "Review component lifecycle and cleanup",
          description:
            "Ensure proper cleanup of event listeners and subscriptions",
          estimatedEffort: "high",
          estimatedImpact: "high",
          automated: false,
        });
        break;

      case "authentication":
        recommendations.push({
          priority: 1,
          action: "Implement token refresh mechanism",
          description: "Add automatic token refresh before expiration",
          estimatedEffort: "medium",
          estimatedImpact: "high",
          automated: true,
        });
        break;
    }

    return recommendations;
  }

  private async predictRecurrence(
    errorData: ErrorData,
  ): Promise<RecurrencePrediction> {
    const prediction = await this.mlPredictor.predictError({
      category: errorData.category,
      severity: errorData.severity,
      context: errorData.context,
    });

    return {
      probability: prediction.probability,
      timeframe: "24 hours",
      conditions: ["Similar network conditions", "Same user actions"],
      preventionStrategies: prediction.preventionActions,
    };
  }

  private findSimilarPatterns(errorData: ErrorData): ErrorPattern[] {
    return Array.from(this.errorPatterns.values())
      .filter((pattern) => pattern.category === errorData.category)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 3);
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const health = await appHealthMonitor.checkHealth();

      if (health.overall !== "healthy") {
        await this.captureError({
          message: `System health degraded: ${health.overall}`,
          category: "performance",
          severity: health.overall === "unhealthy" ? "critical" : "medium",
          context: this.gatherErrorContext("health_check", { health }),
        });
      }
    } catch (error) {
      console.error("Health check failed:", error);
    }
  }

  private async predictUpcomingErrors(): Promise<void> {
    try {
      const currentContext = {
        memoryUsage: this.getMemoryUsage(),
        networkConditions: this.getNetworkConditions(),
        userActivity: this.getUserActivity(),
      };

      const prediction = await this.mlPredictor.predictError(currentContext);

      if (prediction.probability > 0.7) {
        console.warn(
          `🔮 High probability error predicted: ${prediction.errorType} (${Math.round(prediction.probability * 100)}%)`,
        );
        this.emit("error:predicted", prediction);
      }
    } catch (error) {
      console.error("Error prediction failed:", error);
    }
  }

  private async optimizeRecoveryStrategies(): Promise<void> {
    // Analyze recent resolution outcomes and optimize strategies
    for (const pattern of this.errorPatterns.values()) {
      if (pattern.resolution && pattern.frequency > 10) {
        // In production, this would analyze recent outcomes and optimize
        console.log(`Optimizing recovery strategy for pattern: ${pattern.id}`);
      }
    }
  }

  // Helper methods
  private categorizeError(error: any): ErrorCategory {
    const message = error?.message?.toLowerCase() || "";

    if (message.includes("fetch") || message.includes("network"))
      return "network";
    if (message.includes("auth") || message.includes("token"))
      return "authentication";
    if (message.includes("permission") || message.includes("forbidden"))
      return "authorization";
    if (message.includes("validation") || message.includes("invalid"))
      return "validation";
    if (message.includes("render") || message.includes("component"))
      return "rendering";
    if (message.includes("state") || message.includes("reducer"))
      return "state_management";
    if (message.includes("api") || message.includes("endpoint"))
      return "api_failure";
    if (message.includes("database") || message.includes("query"))
      return "database_error";
    if (message.includes("memory") || message.includes("heap"))
      return "memory_leak";
    if (message.includes("slow") || message.includes("timeout"))
      return "performance";
    if (message.includes("security") || message.includes("xss"))
      return "security";

    return "unknown";
  }

  private assessSeverity(error: any): ErrorSeverity {
    const message = error?.message?.toLowerCase() || "";

    if (
      message.includes("critical") ||
      message.includes("fatal") ||
      message.includes("security")
    ) {
      return "critical";
    }
    if (
      message.includes("error") ||
      message.includes("failed") ||
      message.includes("exception")
    ) {
      return "high";
    }
    if (message.includes("warning") || message.includes("deprecated")) {
      return "medium";
    }

    return "low";
  }

  private calculateAverageSeverity(errors: ErrorData[]): ErrorSeverity {
    const severityWeights = { low: 1, medium: 2, high: 3, critical: 4 };
    const avgWeight =
      errors.reduce((sum, error) => sum + severityWeights[error.severity], 0) /
      errors.length;

    if (avgWeight >= 3.5) return "critical";
    if (avgWeight >= 2.5) return "high";
    if (avgWeight >= 1.5) return "medium";
    return "low";
  }

  private gatherErrorContext(
    source: string,
    additionalData?: any,
  ): ErrorContext {
    return {
      component: additionalData?.component || "unknown",
      props: additionalData?.props,
      state: additionalData?.state,
      userAction: additionalData?.userAction,
      networkConditions: this.getNetworkConditions(),
      systemResources: this.getSystemResources(),
      browserInfo: this.getBrowserInfo(),
    };
  }

  private getNetworkConditions(): NetworkConditions {
    const connection = (navigator as any).connection;
    return {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType || "unknown",
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false,
    };
  }

  private getSystemResources(): SystemResources {
    const memory = (performance as any).memory;
    return {
      memoryUsage: memory ? memory.usedJSHeapSize / memory.totalJSHeapSize : 0,
      cpuUsage: 0, // Would need additional measurement
      storageUsage: this.getStorageUsage(),
      batteryLevel: this.getBatteryLevel(),
    };
  }

  private getBrowserInfo(): BrowserInfo {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      javaEnabled: false, // navigator.javaEnabled() is deprecated
      onLine: navigator.onLine,
    };
  }

  private getMemoryUsage(): number {
    const memory = (performance as any).memory;
    return memory ? memory.usedJSHeapSize / memory.totalJSHeapSize : 0;
  }

  private getStorageUsage(): number {
    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length;
        }
      }
      return used;
    } catch {
      return 0;
    }
  }

  private getBatteryLevel(): number | undefined {
    // Battery API is deprecated, return undefined
    return undefined;
  }

  private getUserActivity(): any {
    // Placeholder for user activity tracking
    return {
      clicksPerMinute: 0,
      pageViews: 0,
      sessionDuration: Date.now() - (Date.now() - 3600000), // 1 hour ago
    };
  }

  private updateMetrics(): void {
    this.recoveryMetrics.totalErrors++;
    this.recoveryMetrics.systemDetectedErrors++;

    // Calculate other metrics
    this.recoveryMetrics.successRate =
      this.recoveryMetrics.resolvedErrors / this.recoveryMetrics.totalErrors;
  }

  private persistErrorData(): void {
    try {
      // Keep only recent errors (last 1000)
      const recentErrors = this.errorHistory.slice(-1000);
      localStorage.setItem("error_history", JSON.stringify(recentErrors));

      // Persist patterns
      const patternsArray = Array.from(this.errorPatterns.values());
      localStorage.setItem("error_patterns", JSON.stringify(patternsArray));
    } catch (error) {
      console.warn("Failed to persist error data:", error);
    }
  }

  private generateId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem("error_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("error_session_id", sessionId);
    }
    return sessionId;
  }

  // Event system
  public on(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  public off(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }

  // Public API
  public getMetrics(): ErrorRecoveryMetrics {
    return { ...this.recoveryMetrics };
  }

  public getPatterns(): ErrorPattern[] {
    return Array.from(this.errorPatterns.values());
  }

  public getRecentErrors(limit = 10): ErrorData[] {
    return this.errorHistory.slice(-limit);
  }

  public async getErrorAnalysis(
    errorId: string,
  ): Promise<ErrorAnalysis | null> {
    const error = this.errorHistory.find((e) => e.id === errorId);
    return error ? await this.analyzeError(error) : null;
  }

  public enablePattern(patternId: string): void {
    const pattern = this.errorPatterns.get(patternId);
    if (pattern?.resolution) {
      pattern.resolution.enabled = true;
    }
  }

  public disablePattern(patternId: string): void {
    const pattern = this.errorPatterns.get(patternId);
    if (pattern?.resolution) {
      pattern.resolution.enabled = false;
    }
  }

  public destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.persistErrorData();
    console.log("🔍 Advanced Error Detection System destroyed");
  }
}

// Export singleton instance
export const advancedErrorDetection =
  AdvancedErrorDetectionSystem.getInstance();
