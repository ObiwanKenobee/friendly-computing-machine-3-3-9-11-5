/**
 * Comprehensive Error Tracking and Alerting System
 * Sentry-like implementation for production error monitoring
 */

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp: string;
  environment: string;
  release?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface ErrorDetails {
  id: string;
  message: string;
  stack?: string;
  type:
    | "javascript"
    | "network"
    | "performance"
    | "security"
    | "business"
    | "api";
  severity: "low" | "medium" | "high" | "critical";
  fingerprint: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  resolved: boolean;
  context: ErrorContext;
  breadcrumbs: ErrorBreadcrumb[];
  tags: Record<string, string>;
  extra: Record<string, any>;
}

export interface ErrorBreadcrumb {
  timestamp: string;
  message: string;
  category: "navigation" | "user" | "http" | "console" | "error" | "info";
  level: "info" | "warning" | "error" | "debug";
  data?: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: AlertCondition;
  actions: AlertAction[];
  enabled: boolean;
  environment?: string;
  project?: string;
}

export interface AlertCondition {
  type: "threshold" | "spike" | "anomaly" | "absence";
  metric: "error_count" | "error_rate" | "performance" | "custom";
  operator: "gt" | "lt" | "eq" | "gte" | "lte";
  value: number;
  timeWindow: number; // minutes
  filters?: Record<string, any>;
}

export interface AlertAction {
  type: "email" | "slack" | "webhook" | "sms" | "ticket";
  config: Record<string, any>;
  enabled: boolean;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  timestamp: string;
  tags: Record<string, string>;
  type: "timing" | "counter" | "gauge" | "histogram";
}

export interface SecurityEvent {
  id: string;
  type:
    | "authentication"
    | "authorization"
    | "injection"
    | "xss"
    | "csrf"
    | "suspicious";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  sourceIp?: string;
  userAgent?: string;
  userId?: string;
  timestamp: string;
  blocked: boolean;
  metadata?: Record<string, any>;
}

class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private errors: Map<string, ErrorDetails> = new Map();
  private breadcrumbs: ErrorBreadcrumb[] = [];
  private alertRules: AlertRule[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private securityEvents: SecurityEvent[] = [];
  private eventListeners: Map<string, Function[]> = new Map();
  private maxBreadcrumbs = 100;
  private enabled = true;
  private sampleRate = 1.0;
  private release?: string;
  private environment: string;
  private apiEndpoint?: string;
  private apiKey?: string;

  private constructor() {
    this.environment = import.meta.env.VITE_NODE_ENV || "development";
    this.release = import.meta.env.VITE_APP_VERSION;
    this.apiEndpoint = import.meta.env.VITE_ERROR_TRACKING_ENDPOINT;
    this.apiKey = import.meta.env.VITE_ERROR_TRACKING_API_KEY;

    this.initializeGlobalHandlers();
    this.initializeDefaultAlertRules();
  }

  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  private initializeGlobalHandlers(): void {
    if (typeof window === "undefined") return;

    // JavaScript errors
    window.addEventListener("error", (event) => {
      this.captureError(event.error || new Error(event.message), {
        component: "global",
        action: "window_error",
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.captureError(new Error(event.reason), {
        component: "global",
        action: "unhandled_promise",
        metadata: {
          reason: event.reason,
        },
      });
    });

    // Network errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = typeof args[0] === "string" ? args[0] : args[0].url;

      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;

        this.addBreadcrumb({
          category: "http",
          message: `${args[1]?.method || "GET"} ${url}`,
          level: response.ok ? "info" : "error",
          data: {
            url,
            status: response.status,
            duration,
          },
        });

        if (!response.ok) {
          this.captureError(
            new Error(`HTTP ${response.status}: ${response.statusText}`),
            {
              component: "network",
              action: "fetch_error",
              metadata: {
                url,
                status: response.status,
                statusText: response.statusText,
                duration,
              },
            },
          );
        }

        this.capturePerformance({
          name: "http_request_duration",
          value: duration,
          type: "timing",
          tags: {
            url,
            method: args[1]?.method || "GET",
            status: response.status.toString(),
          },
        });

        return response;
      } catch (error) {
        const duration = performance.now() - startTime;

        this.addBreadcrumb({
          category: "http",
          message: `${args[1]?.method || "GET"} ${url} failed`,
          level: "error",
          data: { url, error: error.message, duration },
        });

        this.captureError(error as Error, {
          component: "network",
          action: "fetch_exception",
          metadata: { url, duration },
        });

        throw error;
      }
    };

    // Performance monitoring
    if ("PerformanceObserver" in window) {
      this.setupPerformanceMonitoring();
    }

    // User interaction tracking
    this.setupUserInteractionTracking();
  }

  private setupPerformanceMonitoring(): void {
    try {
      // Monitor LCP, FID, CLS
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "navigation") {
            const nav = entry as PerformanceNavigationTiming;

            this.capturePerformance({
              name: "page_load_time",
              value: nav.loadEventEnd - nav.loadEventStart,
              type: "timing",
              tags: { type: "navigation" },
            });

            this.capturePerformance({
              name: "dom_content_loaded",
              value:
                nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
              type: "timing",
              tags: { type: "dom" },
            });

            this.capturePerformance({
              name: "first_byte",
              value: nav.responseStart - nav.requestStart,
              type: "timing",
              tags: { type: "ttfb" },
            });
          }

          if (entry.entryType === "paint") {
            this.capturePerformance({
              name: entry.name.replace("-", "_"),
              value: entry.startTime,
              type: "timing",
              tags: { type: "paint" },
            });
          }

          if (entry.entryType === "largest-contentful-paint") {
            this.capturePerformance({
              name: "largest_contentful_paint",
              value: entry.startTime,
              type: "timing",
              tags: { type: "lcp" },
            });

            if (entry.startTime > 2500) {
              this.captureError(new Error("Poor LCP performance"), {
                component: "performance",
                action: "lcp_threshold",
                metadata: { lcp: entry.startTime },
              });
            }
          }

          if (entry.entryType === "first-input") {
            const fid = (entry as any).processingStart - entry.startTime;

            this.capturePerformance({
              name: "first_input_delay",
              value: fid,
              type: "timing",
              tags: { type: "fid" },
            });

            if (fid > 100) {
              this.captureError(new Error("Poor FID performance"), {
                component: "performance",
                action: "fid_threshold",
                metadata: { fid },
              });
            }
          }
        }
      });

      observer.observe({
        entryTypes: [
          "navigation",
          "paint",
          "largest-contentful-paint",
          "first-input",
        ],
      });
    } catch (error) {
      console.warn("Performance monitoring setup failed:", error);
    }
  }

  private setupUserInteractionTracking(): void {
    const trackInteraction = (type: string, target: EventTarget | null) => {
      this.addBreadcrumb({
        category: "user",
        message: `User ${type}`,
        level: "info",
        data: {
          type,
          target:
            target instanceof Element
              ? target.tagName.toLowerCase()
              : "unknown",
          className: target instanceof Element ? target.className : "",
        },
      });
    };

    document.addEventListener("click", (e) =>
      trackInteraction("click", e.target),
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === "Escape") {
        trackInteraction("keydown", e.target);
      }
    });

    // Track route changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      errorTrackingService.addBreadcrumb({
        category: "navigation",
        message: `Navigation to ${location.pathname}`,
        level: "info",
        data: { url: location.href },
      });
      return result;
    };

    history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args);
      errorTrackingService.addBreadcrumb({
        category: "navigation",
        message: `Navigation replaced to ${location.pathname}`,
        level: "info",
        data: { url: location.href },
      });
      return result;
    };

    window.addEventListener("popstate", () => {
      this.addBreadcrumb({
        category: "navigation",
        message: `Back/forward navigation to ${location.pathname}`,
        level: "info",
        data: { url: location.href },
      });
    });
  }

  private initializeDefaultAlertRules(): void {
    this.alertRules = [
      {
        id: "high-error-rate",
        name: "High Error Rate",
        condition: {
          type: "threshold",
          metric: "error_rate",
          operator: "gt",
          value: 5, // 5%
          timeWindow: 5,
        },
        actions: [
          {
            type: "email",
            config: { to: "alerts@quantumvest.com" },
            enabled: true,
          },
          {
            type: "slack",
            config: { channel: "#alerts" },
            enabled: true,
          },
        ],
        enabled: true,
        environment: "production",
      },
      {
        id: "critical-errors",
        name: "Critical Error Spike",
        condition: {
          type: "spike",
          metric: "error_count",
          operator: "gt",
          value: 10,
          timeWindow: 1,
          filters: { severity: "critical" },
        },
        actions: [
          {
            type: "email",
            config: { to: "oncall@quantumvest.com", priority: "high" },
            enabled: true,
          },
          {
            type: "sms",
            config: { to: "+1234567890" },
            enabled: true,
          },
        ],
        enabled: true,
      },
      {
        id: "performance-degradation",
        name: "Performance Degradation",
        condition: {
          type: "threshold",
          metric: "performance",
          operator: "gt",
          value: 2000, // 2 seconds
          timeWindow: 10,
        },
        actions: [
          {
            type: "slack",
            config: { channel: "#performance" },
            enabled: true,
          },
        ],
        enabled: true,
      },
      {
        id: "security-incident",
        name: "Security Incident",
        condition: {
          type: "threshold",
          metric: "custom",
          operator: "gte",
          value: 1,
          timeWindow: 1,
          filters: { type: "security", severity: ["high", "critical"] },
        },
        actions: [
          {
            type: "email",
            config: { to: "security@quantumvest.com", priority: "urgent" },
            enabled: true,
          },
          {
            type: "ticket",
            config: { system: "jira", project: "SEC" },
            enabled: true,
          },
        ],
        enabled: true,
      },
    ];
  }

  public captureError(error: Error, context: Partial<ErrorContext> = {}): void {
    if (!this.enabled || Math.random() > this.sampleRate) return;

    const fingerprint = this.generateFingerprint(error);
    const errorId = fingerprint;
    const timestamp = new Date().toISOString();

    const fullContext: ErrorContext = {
      userId: context.userId,
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp,
      environment: this.environment,
      release: this.release,
      component: context.component,
      action: context.action,
      metadata: context.metadata,
    };

    const existingError = this.errors.get(errorId);

    if (existingError) {
      // Update existing error
      existingError.count++;
      existingError.lastSeen = timestamp;
      existingError.context = fullContext;
      existingError.breadcrumbs = [...this.breadcrumbs];
    } else {
      // Create new error
      const errorDetails: ErrorDetails = {
        id: errorId,
        message: error.message,
        stack: error.stack,
        type: this.categorizeError(error, context),
        severity: this.calculateSeverity(error, context),
        fingerprint,
        count: 1,
        firstSeen: timestamp,
        lastSeen: timestamp,
        resolved: false,
        context: fullContext,
        breadcrumbs: [...this.breadcrumbs],
        tags: this.extractTags(error, context),
        extra: {
          errorName: error.name,
          cause: error.cause,
          ...context.metadata,
        },
      };

      this.errors.set(errorId, errorDetails);
    }

    // Add error breadcrumb
    this.addBreadcrumb({
      category: "error",
      message: error.message,
      level: "error",
      data: {
        type: error.name,
        stack: error.stack?.split("\n").slice(0, 3),
      },
    });

    // Send to external service
    this.sendToExternalService(this.errors.get(errorId)!);

    // Check alert rules
    this.checkAlertRules();

    // Emit event for real-time monitoring
    this.emit("error", this.errors.get(errorId)!);
  }

  public captureMessage(
    message: string,
    level: "info" | "warning" | "error" = "info",
  ): void {
    this.addBreadcrumb({
      category: "console",
      message,
      level,
    });

    if (level === "error") {
      this.captureError(new Error(message), {
        component: "manual",
        action: "capture_message",
      });
    }
  }

  public captureSecurityEvent(
    event: Omit<SecurityEvent, "id" | "timestamp">,
  ): void {
    const securityEvent: SecurityEvent = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...event,
    };

    this.securityEvents.push(securityEvent);

    // Add security breadcrumb
    this.addBreadcrumb({
      category: "error",
      message: `Security event: ${event.type}`,
      level:
        event.severity === "critical" || event.severity === "high"
          ? "error"
          : "warning",
      data: {
        type: event.type,
        severity: event.severity,
        blocked: event.blocked,
      },
    });

    // Check security alert rules
    this.checkAlertRules();

    // Emit event
    this.emit("security_event", securityEvent);
  }

  public capturePerformance(
    metric: Omit<PerformanceMetric, "id" | "timestamp">,
  ): void {
    const performanceMetric: PerformanceMetric = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...metric,
    };

    this.performanceMetrics.push(performanceMetric);

    // Keep only recent metrics (last 1000)
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
    }

    // Check performance thresholds
    if (metric.name.includes("time") && metric.value > 2000) {
      this.captureError(new Error(`Slow ${metric.name}: ${metric.value}ms`), {
        component: "performance",
        action: "slow_operation",
        metadata: { metric: metric.name, value: metric.value },
      });
    }

    this.emit("performance_metric", performanceMetric);
  }

  public addBreadcrumb(breadcrumb: Omit<ErrorBreadcrumb, "timestamp">): void {
    const fullBreadcrumb: ErrorBreadcrumb = {
      timestamp: new Date().toISOString(),
      ...breadcrumb,
    };

    this.breadcrumbs.push(fullBreadcrumb);

    // Keep only recent breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs);
    }
  }

  private generateFingerprint(error: Error): string {
    // Create a unique fingerprint based on error type, message, and first few stack frames
    const stackLines = error.stack?.split("\n").slice(0, 3) || [];
    const fingerprint = `${error.name}:${error.message}:${stackLines.join(":")}`;

    return btoa(fingerprint).slice(0, 16);
  }

  private categorizeError(
    error: Error,
    context: Partial<ErrorContext>,
  ): ErrorDetails["type"] {
    if (context.component === "network" || error.message.includes("fetch")) {
      return "network";
    }
    if (
      context.component === "performance" ||
      error.message.includes("performance")
    ) {
      return "performance";
    }
    if (
      context.component === "security" ||
      error.message.includes("security")
    ) {
      return "security";
    }
    if (context.component === "api" || error.message.includes("API")) {
      return "api";
    }
    if (
      error.message.includes("business logic") ||
      context.component?.includes("business")
    ) {
      return "business";
    }
    return "javascript";
  }

  private calculateSeverity(
    error: Error,
    context: Partial<ErrorContext>,
  ): ErrorDetails["severity"] {
    // Security errors are always high/critical
    if (context.component === "security") {
      return "critical";
    }

    // Performance errors
    if (context.component === "performance") {
      const value = context.metadata?.value || 0;
      if (value > 5000) return "critical";
      if (value > 2000) return "high";
      return "medium";
    }

    // Network errors
    if (context.component === "network") {
      const status = context.metadata?.status || 0;
      if (status >= 500) return "high";
      if (status >= 400) return "medium";
      return "low";
    }

    // JavaScript errors
    if (error.name === "TypeError" || error.name === "ReferenceError") {
      return "high";
    }

    if (error.name === "SyntaxError") {
      return "critical";
    }

    return "medium";
  }

  private extractTags(
    error: Error,
    context: Partial<ErrorContext>,
  ): Record<string, string> {
    return {
      error_type: error.name,
      environment: this.environment,
      component: context.component || "unknown",
      action: context.action || "unknown",
      user_agent: navigator.userAgent.split(" ")[0],
      url: window.location.pathname,
    };
  }

  private async sendToExternalService(error: ErrorDetails): Promise<void> {
    if (!this.apiEndpoint || !this.apiKey) return;

    try {
      await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          error,
          project: "quantumvest",
          environment: this.environment,
          release: this.release,
        }),
      });
    } catch (err) {
      console.error("Failed to send error to external service:", err);
    }
  }

  private checkAlertRules(): void {
    const now = Date.now();

    for (const rule of this.alertRules) {
      if (!rule.enabled) continue;
      if (rule.environment && rule.environment !== this.environment) continue;

      const windowStart = now - rule.condition.timeWindow * 60 * 1000;

      let shouldAlert = false;

      switch (rule.condition.metric) {
        case "error_count":
          const errorCount = this.getErrorCountInWindow(
            windowStart,
            rule.condition.filters,
          );
          shouldAlert = this.evaluateCondition(errorCount, rule.condition);
          break;

        case "error_rate":
          const errorRate = this.getErrorRateInWindow(windowStart);
          shouldAlert = this.evaluateCondition(errorRate, rule.condition);
          break;

        case "performance":
          const avgPerformance =
            this.getAveragePerformanceInWindow(windowStart);
          shouldAlert = this.evaluateCondition(avgPerformance, rule.condition);
          break;

        case "custom":
          // Handle custom metrics based on filters
          if (rule.condition.filters?.type === "security") {
            const securityEventCount = this.getSecurityEventCountInWindow(
              windowStart,
              rule.condition.filters,
            );
            shouldAlert = this.evaluateCondition(
              securityEventCount,
              rule.condition,
            );
          }
          break;
      }

      if (shouldAlert) {
        this.triggerAlert(rule);
      }
    }
  }

  private evaluateCondition(value: number, condition: AlertCondition): boolean {
    switch (condition.operator) {
      case "gt":
        return value > condition.value;
      case "gte":
        return value >= condition.value;
      case "lt":
        return value < condition.value;
      case "lte":
        return value <= condition.value;
      case "eq":
        return value === condition.value;
      default:
        return false;
    }
  }

  private getErrorCountInWindow(
    windowStart: number,
    filters?: Record<string, any>,
  ): number {
    return Array.from(this.errors.values())
      .filter((error) => {
        const errorTime = new Date(error.lastSeen).getTime();
        if (errorTime < windowStart) return false;

        if (filters) {
          if (filters.severity && error.severity !== filters.severity)
            return false;
          if (filters.type && error.type !== filters.type) return false;
        }

        return true;
      })
      .reduce((sum, error) => sum + error.count, 0);
  }

  private getErrorRateInWindow(windowStart: number): number {
    const errors = this.getErrorCountInWindow(windowStart);
    const totalRequests = this.getTotalRequestsInWindow(windowStart);

    return totalRequests > 0 ? (errors / totalRequests) * 100 : 0;
  }

  private getTotalRequestsInWindow(windowStart: number): number {
    return this.performanceMetrics.filter((metric) => {
      return (
        metric.name === "http_request_duration" &&
        new Date(metric.timestamp).getTime() >= windowStart
      );
    }).length;
  }

  private getAveragePerformanceInWindow(windowStart: number): number {
    const performanceMetrics = this.performanceMetrics.filter((metric) => {
      return (
        metric.name.includes("time") &&
        new Date(metric.timestamp).getTime() >= windowStart
      );
    });

    if (performanceMetrics.length === 0) return 0;

    const sum = performanceMetrics.reduce(
      (total, metric) => total + metric.value,
      0,
    );
    return sum / performanceMetrics.length;
  }

  private getSecurityEventCountInWindow(
    windowStart: number,
    filters?: Record<string, any>,
  ): number {
    return this.securityEvents.filter((event) => {
      const eventTime = new Date(event.timestamp).getTime();
      if (eventTime < windowStart) return false;

      if (filters?.severity) {
        const severities = Array.isArray(filters.severity)
          ? filters.severity
          : [filters.severity];
        if (!severities.includes(event.severity)) return false;
      }

      return true;
    }).length;
  }

  private async triggerAlert(rule: AlertRule): Promise<void> {
    console.log(`Alert triggered: ${rule.name}`);

    for (const action of rule.actions) {
      if (!action.enabled) continue;

      try {
        await this.executeAlertAction(action, rule);
      } catch (error) {
        console.error(`Failed to execute alert action ${action.type}:`, error);
      }
    }

    this.emit("alert_triggered", { rule, timestamp: new Date().toISOString() });
  }

  private async executeAlertAction(
    action: AlertAction,
    rule: AlertRule,
  ): Promise<void> {
    switch (action.type) {
      case "email":
        await this.sendEmailAlert(action.config, rule);
        break;
      case "slack":
        await this.sendSlackAlert(action.config, rule);
        break;
      case "webhook":
        await this.sendWebhookAlert(action.config, rule);
        break;
      case "sms":
        await this.sendSMSAlert(action.config, rule);
        break;
      case "ticket":
        await this.createTicket(action.config, rule);
        break;
    }
  }

  private async sendEmailAlert(config: any, rule: AlertRule): Promise<void> {
    // Implementation would integrate with email service
    console.log(`Email alert sent to ${config.to} for rule ${rule.name}`);
  }

  private async sendSlackAlert(config: any, rule: AlertRule): Promise<void> {
    // Implementation would integrate with Slack webhook
    console.log(`Slack alert sent to ${config.channel} for rule ${rule.name}`);
  }

  private async sendWebhookAlert(config: any, rule: AlertRule): Promise<void> {
    await fetch(config.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rule: rule.name,
        timestamp: new Date().toISOString(),
        environment: this.environment,
      }),
    });
  }

  private async sendSMSAlert(config: any, rule: AlertRule): Promise<void> {
    // Implementation would integrate with SMS service
    console.log(`SMS alert sent to ${config.to} for rule ${rule.name}`);
  }

  private async createTicket(config: any, rule: AlertRule): Promise<void> {
    // Implementation would integrate with ticketing system
    console.log(`Ticket created in ${config.system} for rule ${rule.name}`);
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem("error_tracking_session_id");
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem("error_tracking_session_id", sessionId);
    }
    return sessionId;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

  // Public API methods
  public getErrors(filters?: {
    resolved?: boolean;
    severity?: ErrorDetails["severity"];
    type?: ErrorDetails["type"];
    limit?: number;
  }): ErrorDetails[] {
    let errors = Array.from(this.errors.values());

    if (filters?.resolved !== undefined) {
      errors = errors.filter((error) => error.resolved === filters.resolved);
    }

    if (filters?.severity) {
      errors = errors.filter((error) => error.severity === filters.severity);
    }

    if (filters?.type) {
      errors = errors.filter((error) => error.type === filters.type);
    }

    // Sort by last seen
    errors.sort(
      (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime(),
    );

    if (filters?.limit) {
      errors = errors.slice(0, filters.limit);
    }

    return errors;
  }

  public getSecurityEvents(limit?: number): SecurityEvent[] {
    const events = [...this.securityEvents].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return limit ? events.slice(0, limit) : events;
  }

  public getPerformanceMetrics(
    metricName?: string,
    limit?: number,
  ): PerformanceMetric[] {
    let metrics = this.performanceMetrics;

    if (metricName) {
      metrics = metrics.filter((metric) => metric.name === metricName);
    }

    metrics.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return limit ? metrics.slice(0, limit) : metrics;
  }

  public resolveError(errorId: string): void {
    const error = this.errors.get(errorId);
    if (error) {
      error.resolved = true;
      this.emit("error_resolved", error);
    }
  }

  public clearErrors(): void {
    this.errors.clear();
    this.emit("errors_cleared");
  }

  public getStats(): {
    totalErrors: number;
    resolvedErrors: number;
    criticalErrors: number;
    errorRate: number;
    averageResponseTime: number;
  } {
    const errors = Array.from(this.errors.values());
    const totalErrors = errors.reduce((sum, error) => sum + error.count, 0);
    const resolvedErrors = errors.filter((error) => error.resolved).length;
    const criticalErrors = errors.filter(
      (error) => error.severity === "critical",
    ).length;

    const recentRequests = this.getTotalRequestsInWindow(
      Date.now() - 24 * 60 * 60 * 1000,
    );
    const errorRate =
      recentRequests > 0 ? (totalErrors / recentRequests) * 100 : 0;

    const averageResponseTime = this.getAveragePerformanceInWindow(
      Date.now() - 60 * 60 * 1000,
    );

    return {
      totalErrors,
      resolvedErrors,
      criticalErrors,
      errorRate,
      averageResponseTime,
    };
  }

  public configure(config: {
    enabled?: boolean;
    sampleRate?: number;
    maxBreadcrumbs?: number;
    apiEndpoint?: string;
    apiKey?: string;
  }): void {
    if (config.enabled !== undefined) this.enabled = config.enabled;
    if (config.sampleRate !== undefined) this.sampleRate = config.sampleRate;
    if (config.maxBreadcrumbs !== undefined)
      this.maxBreadcrumbs = config.maxBreadcrumbs;
    if (config.apiEndpoint !== undefined) this.apiEndpoint = config.apiEndpoint;
    if (config.apiKey !== undefined) this.apiKey = config.apiKey;
  }
}

// Export singleton instance
export const errorTrackingService = ErrorTrackingService.getInstance();

// Global error tracking functions for easy use
export const captureError = (error: Error, context?: Partial<ErrorContext>) =>
  errorTrackingService.captureError(error, context);

export const captureMessage = (
  message: string,
  level?: "info" | "warning" | "error",
) => errorTrackingService.captureMessage(message, level);

export const captureSecurityEvent = (
  event: Omit<SecurityEvent, "id" | "timestamp">,
) => errorTrackingService.captureSecurityEvent(event);

export const addBreadcrumb = (breadcrumb: Omit<ErrorBreadcrumb, "timestamp">) =>
  errorTrackingService.addBreadcrumb(breadcrumb);
