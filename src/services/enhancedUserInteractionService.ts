/**
 * Enhanced User Interaction Analytics Service
 * Provides deep insights into user behavior and platform skeleton interactions
 */

import { UserProfile, AnalyticsEvent, ErrorContext } from "../types/common";
import { globalErrorHandler } from "../utils/errorHandling";
import { appHealthMonitor } from "../utils/appHealthMonitor";

export interface UserInteractionInsight {
  id: string;
  type: "behavioral" | "technical" | "engagement" | "performance" | "error";
  category: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  data: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  recommendations: string[];
  impact: {
    userExperience: number; // 0-100
    businessValue: number; // 0-100
    technicalComplexity: number; // 0-100
  };
}

export interface UserJourneyStep {
  id: string;
  step: string;
  page: string;
  action: string;
  timestamp: Date;
  duration: number;
  success: boolean;
  errors: string[];
  metadata: Record<string, unknown>;
}

export interface UserEngagementMetrics {
  sessionDuration: number;
  pageViews: number;
  interactions: number;
  errorRate: number;
  completionRate: number;
  satisfactionScore: number;
  retentionProbability: number;
}

export interface PlatformSkeletonInsight {
  component: string;
  loadTime: number;
  renderTime: number;
  interactionDelay: number;
  errorCount: number;
  userFeedback: number;
  usageFrequency: number;
  performanceScore: number;
}

class EnhancedUserInteractionService {
  private static instance: EnhancedUserInteractionService;
  private insights: UserInteractionInsight[] = [];
  private userJourneys: Map<string, UserJourneyStep[]> = new Map();
  private engagementMetrics: Map<string, UserEngagementMetrics> = new Map();
  private skeletonInsights: Map<string, PlatformSkeletonInsight> = new Map();
  private isInitialized: boolean = false;

  static getInstance(): EnhancedUserInteractionService {
    try {
      if (!EnhancedUserInteractionService.instance) {
        EnhancedUserInteractionService.instance =
          new EnhancedUserInteractionService();
      }
      return EnhancedUserInteractionService.instance;
    } catch (error) {
      console.warn(
        "Failed to initialize EnhancedUserInteractionService:",
        error,
      );
      // Return a mock instance with safe no-op methods
      return {
        trackInteraction: () => {},
        getInsights: () => [],
        getUserJourney: () => [],
        getEngagementMetrics: () => ({
          sessionDuration: 0,
          pageViews: 0,
          interactions: 0,
          errorRate: 0,
          completionRate: 0,
          satisfactionScore: 0,
          retentionProbability: 0,
        }),
        clearData: () => {},
        exportData: () => Promise.resolve({}),
      } as any;
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      this.isInitialized = true;
      try {
        this.initializeService();
      } catch (error) {
        console.warn("Service initialization failed:", error);
        // Continue with partial functionality
      }
    }
  }

  private initializeService(): void {
    try {
      this.sessionId = this.generateSessionId();
      this.startInsightGeneration();

      // Initialize error tracking
      this.setupErrorTracking();
    } catch (error) {
      console.warn("Failed to fully initialize service:", error);
      // Set fallback session ID
      this.sessionId = `fallback-${Date.now()}`;
    }
  }

  /**
   * Setup comprehensive interaction listeners
   */
  private setupInteractionListeners(): void {
    if (typeof window === "undefined") return;

    // Page lifecycle events
    window.addEventListener("beforeunload", () => {
      this.trackPageExit();
    });

    // Performance observations
    if ("PerformanceObserver" in window) {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.analyzePerformanceEntry(entry);
        }
      });

      perfObserver.observe({
        entryTypes: [
          "paint",
          "largest-contentful-paint",
          "first-input",
          "layout-shift",
        ],
      });
    }

    // Error tracking
    window.addEventListener("error", (event) => {
      this.trackRuntimeError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.trackRuntimeError(event.reason, {
        type: "unhandled_promise_rejection",
      });
    });
  }

  /**
   * Track detailed user interaction with insights
   */
  async trackInteraction(data: {
    type: string;
    element: string;
    page?: string;
    position?: { x: number; y: number };
    duration?: number;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    try {
      this.ensureInitialized();

      const sessionId = this.getSessionId();
      const timestamp = new Date();

      // Track the interaction
      const interaction: AnalyticsEvent = {
        id: this.generateId(),
        userId: this.getCurrentUserId(),
        sessionId,
        eventType: `interaction_${data.type}`,
        eventData: {
          element: data.element,
          page: data.page || window.location.pathname,
          duration: data.duration || 0,
          timestamp: timestamp.toISOString(),
          ...data.metadata,
        },
        timestamp,
        source: "enhanced_user_interaction",
        userAgent: navigator.userAgent,
        ipAddress: "127.0.0.1", // Would be set server-side
      };

      // Generate insights from this interaction
      await this.generateInteractionInsights(interaction);

      // Update user journey
      this.updateUserJourney(sessionId, {
        id: interaction.id,
        step: data.type,
        page: data.page || window.location.pathname,
        action: data.element,
        timestamp,
        duration: data.duration || 0,
        success: true,
        errors: [],
        metadata: data.metadata || {},
      });

      // Update engagement metrics
      this.updateEngagementMetrics(sessionId, interaction);
    } catch (error) {
      globalErrorHandler.handle(error, {
        component: "EnhancedUserInteractionService",
        action: "trackInteraction",
      });
    }
  }

  /**
   * Generate insights from user interactions
   */
  private async generateInteractionInsights(
    interaction: AnalyticsEvent,
  ): Promise<void> {
    const insights: UserInteractionInsight[] = [];

    // Behavioral insights
    if (interaction.eventType === "interaction_click") {
      const clickInsights = this.analyzeClickBehavior(interaction);
      insights.push(...clickInsights);
    }

    // Performance insights
    if (
      interaction.eventData.duration &&
      typeof interaction.eventData.duration === "number"
    ) {
      const perfInsights = this.analyzePerformanceBehavior(interaction);
      insights.push(...perfInsights);
    }

    // Error insights
    const errorInsights = await this.analyzeErrorProne(interaction);
    insights.push(...errorInsights);

    // Engagement insights
    const engagementInsights = this.analyzeEngagementPatterns(interaction);
    insights.push(...engagementInsights);

    // Add insights to collection
    this.insights.push(...insights);

    // Limit insights collection size
    if (this.insights.length > 1000) {
      this.insights = this.insights.slice(-500);
    }
  }

  /**
   * Analyze click behavior patterns
   */
  private analyzeClickBehavior(
    interaction: AnalyticsEvent,
  ): UserInteractionInsight[] {
    const insights: UserInteractionInsight[] = [];
    const element = interaction.eventData.element as string;

    // Dead click detection
    if (element.includes("button") || element.includes("link")) {
      const recentClicks = this.insights
        .filter(
          (i) => i.type === "behavioral" && i.category === "click_pattern",
        )
        .slice(-10);

      const rapidClicks = recentClicks.filter(
        (i) => Date.now() - i.timestamp.getTime() < 5000,
      ).length;

      if (rapidClicks > 3) {
        insights.push({
          id: this.generateId(),
          type: "behavioral",
          category: "click_pattern",
          title: "Rapid Click Pattern Detected",
          description:
            "User is clicking rapidly, possibly indicating UI responsiveness issues",
          severity: "medium",
          data: { rapidClicks, element },
          timestamp: new Date(),
          sessionId: interaction.sessionId,
          recommendations: [
            "Check button responsiveness",
            "Add visual feedback for clicks",
            "Consider debouncing click handlers",
          ],
          impact: {
            userExperience: 70,
            businessValue: 40,
            technicalComplexity: 30,
          },
        });
      }
    }

    // Navigation pattern analysis
    if (element.includes("nav") || element.includes("menu")) {
      insights.push({
        id: this.generateId(),
        type: "behavioral",
        category: "navigation",
        title: "Navigation Usage Pattern",
        description: `User interacted with navigation element: ${element}`,
        severity: "low",
        data: { element, page: interaction.eventData.page },
        timestamp: new Date(),
        sessionId: interaction.sessionId,
        recommendations: [
          "Monitor navigation effectiveness",
          "Consider A/B testing navigation layouts",
          "Track conversion from navigation clicks",
        ],
        impact: {
          userExperience: 60,
          businessValue: 80,
          technicalComplexity: 20,
        },
      });
    }

    return insights;
  }

  /**
   * Analyze performance-related behavior
   */
  private analyzePerformanceBehavior(
    interaction: AnalyticsEvent,
  ): UserInteractionInsight[] {
    const insights: UserInteractionInsight[] = [];
    const duration = interaction.eventData.duration as number;

    if (duration > 1000) {
      // Slow interaction
      insights.push({
        id: this.generateId(),
        type: "performance",
        category: "slow_interaction",
        title: "Slow Interaction Detected",
        description: `Interaction took ${duration}ms to complete`,
        severity: duration > 3000 ? "high" : "medium",
        data: { duration, element: interaction.eventData.element },
        timestamp: new Date(),
        sessionId: interaction.sessionId,
        recommendations: [
          "Optimize component rendering",
          "Consider lazy loading",
          "Add loading states",
          "Profile JavaScript execution",
        ],
        impact: {
          userExperience: 80,
          businessValue: 60,
          technicalComplexity: 70,
        },
      });
    }

    return insights;
  }

  /**
   * Analyze error-prone interactions
   */
  private async analyzeErrorProne(
    interaction: AnalyticsEvent,
  ): Promise<UserInteractionInsight[]> {
    const insights: UserInteractionInsight[] = [];

    try {
      // Check system health during interaction
      const health = await appHealthMonitor.checkHealth();

      if (health.overall !== "healthy") {
        insights.push({
          id: this.generateId(),
          type: "technical",
          category: "system_health",
          title: "System Health Issue During Interaction",
          description: `System health is ${health.overall} during user interaction`,
          severity: health.overall === "failing" ? "critical" : "medium",
          data: {
            systemHealth: health.overall,
            interaction: interaction.eventData.element,
            failingServices: health.services.filter(
              (s) => s.status === "failing",
            ).length,
          },
          timestamp: new Date(),
          sessionId: interaction.sessionId,
          recommendations: [
            "Check failing services",
            "Monitor system resources",
            "Consider graceful degradation",
            "Add health status indicators",
          ],
          impact: {
            userExperience: 90,
            businessValue: 85,
            technicalComplexity: 60,
          },
        });
      }
    } catch (error) {
      // Health check failed
      insights.push({
        id: this.generateId(),
        type: "error",
        category: "health_check_failure",
        title: "Health Check Failed During Interaction",
        description:
          "Unable to determine system health during user interaction",
        severity: "high",
        data: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        timestamp: new Date(),
        sessionId: interaction.sessionId,
        recommendations: [
          "Debug health monitoring system",
          "Add fallback health indicators",
          "Implement health check redundancy",
        ],
        impact: {
          userExperience: 75,
          businessValue: 50,
          technicalComplexity: 80,
        },
      });
    }

    return insights;
  }

  /**
   * Analyze engagement patterns
   */
  private analyzeEngagementPatterns(
    interaction: AnalyticsEvent,
  ): UserInteractionInsight[] {
    const insights: UserInteractionInsight[] = [];
    const sessionId = interaction.sessionId;

    // Get current engagement metrics
    const engagement = this.engagementMetrics.get(sessionId);
    if (!engagement) return insights;

    // Low engagement detection
    if (engagement.interactions < 5 && engagement.sessionDuration > 30000) {
      insights.push({
        id: this.generateId(),
        type: "engagement",
        category: "low_engagement",
        title: "Low User Engagement Detected",
        description:
          "User has low interaction rate relative to session duration",
        severity: "medium",
        data: {
          interactions: engagement.interactions,
          sessionDuration: engagement.sessionDuration,
          interactionRate:
            engagement.interactions / (engagement.sessionDuration / 1000),
        },
        timestamp: new Date(),
        sessionId,
        recommendations: [
          "Review page content relevance",
          "Add interactive elements",
          "Improve call-to-action visibility",
          "Consider onboarding improvements",
        ],
        impact: {
          userExperience: 60,
          businessValue: 70,
          technicalComplexity: 40,
        },
      });
    }

    // High engagement detection
    if (engagement.interactions > 20 && engagement.sessionDuration < 60000) {
      insights.push({
        id: this.generateId(),
        type: "engagement",
        category: "high_engagement",
        title: "High User Engagement Detected",
        description: "User shows high interaction rate - potential power user",
        severity: "low",
        data: {
          interactions: engagement.interactions,
          sessionDuration: engagement.sessionDuration,
          interactionRate:
            engagement.interactions / (engagement.sessionDuration / 1000),
        },
        timestamp: new Date(),
        sessionId,
        recommendations: [
          "Offer advanced features",
          "Consider upgrade prompts",
          "Track for user feedback",
          "Provide shortcuts and efficiency tools",
        ],
        impact: {
          userExperience: 80,
          businessValue: 90,
          technicalComplexity: 30,
        },
      });
    }

    return insights;
  }

  /**
   * Track runtime errors with context
   */
  private trackRuntimeError(
    error: Error,
    context: Record<string, unknown>,
  ): void {
    this.ensureInitialized();

    const insight: UserInteractionInsight = {
      id: this.generateId(),
      type: "error",
      category: "runtime_error",
      title: "Runtime Error Occurred",
      description: error.message,
      severity: "high",
      data: {
        error: error.message,
        stack: error.stack,
        context,
      },
      timestamp: new Date(),
      sessionId: this.getSessionId(),
      recommendations: [
        "Debug error source",
        "Add error boundary",
        "Implement graceful fallback",
        "Monitor error frequency",
      ],
      impact: {
        userExperience: 90,
        businessValue: 70,
        technicalComplexity: 80,
      },
    };

    this.insights.push(insight);
  }

  /**
   * Initialize platform skeleton monitoring
   */
  private initializeSkeletonMonitoring(): void {
    if (typeof window === "undefined") return;

    // Monitor component loading times
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.analyzeSkeletonComponent(node as Element);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Analyze skeleton component performance
   */
  private analyzeSkeletonComponent(element: Element): void {
    const componentName = this.identifyComponent(element);
    if (!componentName) return;

    const loadTime = performance.now();

    // Track render time
    requestAnimationFrame(() => {
      const renderTime = performance.now() - loadTime;

      const existing = this.skeletonInsights.get(componentName);
      const insight: PlatformSkeletonInsight = {
        component: componentName,
        loadTime: existing ? (existing.loadTime + loadTime) / 2 : loadTime,
        renderTime: existing
          ? (existing.renderTime + renderTime) / 2
          : renderTime,
        interactionDelay: existing?.interactionDelay || 0,
        errorCount: existing?.errorCount || 0,
        userFeedback: existing?.userFeedback || 0,
        usageFrequency: (existing?.usageFrequency || 0) + 1,
        performanceScore: this.calculatePerformanceScore(
          renderTime,
          existing?.errorCount || 0,
        ),
      };

      this.skeletonInsights.set(componentName, insight);
    });
  }

  /**
   * Identify component from element
   */
  private identifyComponent(element: Element): string | null {
    // Check for React component names in data attributes
    const reactComponent = element.getAttribute("data-component");
    if (reactComponent) return reactComponent;

    // Check class names for component patterns
    const classList = Array.from(element.classList);
    const componentClass = classList.find(
      (cls) =>
        cls.includes("Component") ||
        cls.includes("Card") ||
        cls.includes("Modal") ||
        cls.includes("Dashboard") ||
        cls.includes("Button"),
    );

    if (componentClass) return componentClass;

    // Check for common patterns
    if (element.tagName === "BUTTON") return "Button";
    if (element.getAttribute("role") === "dialog") return "Modal";
    if (classList.some((cls) => cls.includes("nav"))) return "Navigation";

    return null;
  }

  /**
   * Calculate performance score for component
   */
  private calculatePerformanceScore(
    renderTime: number,
    errorCount: number,
  ): number {
    let score = 100;

    // Penalize slow render times
    if (renderTime > 100) score -= Math.min(50, (renderTime - 100) / 10);

    // Penalize errors
    score -= errorCount * 10;

    return Math.max(0, score);
  }

  /**
   * Get insights for dashboard
   */
  getInsights(filter?: {
    type?: UserInteractionInsight["type"];
    severity?: UserInteractionInsight["severity"];
    timeRange?: { start: Date; end: Date };
    limit?: number;
  }): UserInteractionInsight[] {
    this.ensureInitialized();

    let filtered = [...this.insights];

    if (filter?.type) {
      filtered = filtered.filter((i) => i.type === filter.type);
    }

    if (filter?.severity) {
      filtered = filtered.filter((i) => i.severity === filter.severity);
    }

    if (filter?.timeRange) {
      filtered = filtered.filter(
        (i) =>
          i.timestamp >= filter.timeRange!.start &&
          i.timestamp <= filter.timeRange!.end,
      );
    }

    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filter?.limit) {
      filtered = filtered.slice(0, filter.limit);
    }

    return filtered;
  }

  /**
   * Get platform skeleton insights
   */
  getSkeletonInsights(): PlatformSkeletonInsight[] {
    this.ensureInitialized();
    return Array.from(this.skeletonInsights.values()).sort(
      (a, b) => b.usageFrequency - a.usageFrequency,
    );
  }

  /**
   * Get user engagement summary
   */
  getEngagementSummary(): {
    totalSessions: number;
    averageSessionDuration: number;
    averageInteractions: number;
    overallSatisfaction: number;
    topInsights: UserInteractionInsight[];
  } {
    this.ensureInitialized();

    const sessions = Array.from(this.engagementMetrics.values());
    const totalSessions = sessions.length;

    if (totalSessions === 0) {
      return {
        totalSessions: 0,
        averageSessionDuration: 0,
        averageInteractions: 0,
        overallSatisfaction: 0,
        topInsights: [],
      };
    }

    const averageSessionDuration =
      sessions.reduce((sum, s) => sum + s.sessionDuration, 0) / totalSessions;
    const averageInteractions =
      sessions.reduce((sum, s) => sum + s.interactions, 0) / totalSessions;
    const overallSatisfaction =
      sessions.reduce((sum, s) => sum + s.satisfactionScore, 0) / totalSessions;

    const topInsights = this.getInsights({
      severity: "high",
      limit: 5,
    });

    return {
      totalSessions,
      averageSessionDuration,
      averageInteractions,
      overallSatisfaction,
      topInsights,
    };
  }

  // Utility methods
  private getSessionId(): string {
    if (typeof window === "undefined") return "ssr_session";

    let sessionId = sessionStorage.getItem("user_session_id");
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem("user_session_id", sessionId);
    }
    return sessionId;
  }

  private getCurrentUserId(): string | undefined {
    // Would integrate with auth system
    return localStorage.getItem("user_id") || undefined;
  }

  private generateId(): string {
    return `insight_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private updateUserJourney(sessionId: string, step: UserJourneyStep): void {
    const journey = this.userJourneys.get(sessionId) || [];
    journey.push(step);
    this.userJourneys.set(sessionId, journey);

    // Limit journey size
    if (journey.length > 100) {
      this.userJourneys.set(sessionId, journey.slice(-50));
    }
  }

  private updateEngagementMetrics(
    sessionId: string,
    interaction: AnalyticsEvent,
  ): void {
    const existing = this.engagementMetrics.get(sessionId) || {
      sessionDuration: 0,
      pageViews: 0,
      interactions: 0,
      errorRate: 0,
      completionRate: 0,
      satisfactionScore: 75, // Default neutral score
      retentionProbability: 50,
    };

    existing.interactions += 1;
    existing.sessionDuration =
      Date.now() - (interaction.timestamp.getTime() - existing.sessionDuration);

    this.engagementMetrics.set(sessionId, existing);
  }

  private trackPageExit(): void {
    const sessionId = this.getSessionId();
    const engagement = this.engagementMetrics.get(sessionId);

    if (engagement) {
      // Calculate final metrics
      engagement.retentionProbability =
        this.calculateRetentionProbability(engagement);
      this.engagementMetrics.set(sessionId, engagement);
    }
  }

  private calculateRetentionProbability(
    metrics: UserEngagementMetrics,
  ): number {
    let score = 50; // Base 50%

    // Session duration factor
    if (metrics.sessionDuration > 60000) score += 20; // 1+ minute
    if (metrics.sessionDuration > 300000) score += 10; // 5+ minutes

    // Interaction factor
    if (metrics.interactions > 5) score += 15;
    if (metrics.interactions > 20) score += 10;

    // Error rate factor
    score -= metrics.errorRate * 30;

    return Math.max(0, Math.min(100, score));
  }

  private analyzePerformanceEntry(entry: PerformanceEntry): void {
    if (entry.entryType === "largest-contentful-paint") {
      const lcp = entry as PerformanceEventTiming;
      if (lcp.startTime > 2500) {
        // Poor LCP
        this.insights.push({
          id: this.generateId(),
          type: "performance",
          category: "core_web_vitals",
          title: "Poor Largest Contentful Paint",
          description: `LCP is ${lcp.startTime.toFixed(0)}ms (should be < 2500ms)`,
          severity: "high",
          data: { lcp: lcp.startTime, threshold: 2500 },
          timestamp: new Date(),
          sessionId: this.getSessionId(),
          recommendations: [
            "Optimize image loading",
            "Reduce server response times",
            "Eliminate render-blocking resources",
            "Use CDN for static assets",
          ],
          impact: {
            userExperience: 85,
            businessValue: 70,
            technicalComplexity: 60,
          },
        });
      }
    }
  }

  private startInsightGeneration(): void {
    // Generate periodic insights
    setInterval(() => {
      this.generatePeriodicInsights();
    }, 60000); // Every minute
  }

  private generatePeriodicInsights(): void {
    // Generate insights about overall patterns
    const recentInsights = this.insights.filter(
      (i) => Date.now() - i.timestamp.getTime() < 300000, // Last 5 minutes
    );

    if (recentInsights.length > 10) {
      this.insights.push({
        id: this.generateId(),
        type: "behavioral",
        category: "activity_burst",
        title: "High Activity Period Detected",
        description: `${recentInsights.length} insights generated in the last 5 minutes`,
        severity: "low",
        data: { insightCount: recentInsights.length, period: "5min" },
        timestamp: new Date(),
        sessionId: this.getSessionId(),
        recommendations: [
          "Monitor system resources",
          "Check for performance impacts",
          "Consider load balancing",
        ],
        impact: {
          userExperience: 40,
          businessValue: 30,
          technicalComplexity: 50,
        },
      });
    }
  }
}

// Export singleton instance
export default EnhancedUserInteractionService;
