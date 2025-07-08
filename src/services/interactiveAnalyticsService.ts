import { concurrentDataProcessor } from "./concurrentDataProcessor";
import { enterprisePaymentService } from "./enterprisePaymentService";
import { ciscoXDRService } from "./ciscoXDRService";

export interface AnalyticsQuery {
  id: string;
  type: "revenue" | "users" | "security" | "performance" | "global" | "custom";
  filters: {
    dateRange: {
      start: Date;
      end: Date;
    };
    metrics: string[];
    groupBy?: string[];
    segments?: Record<string, any>;
  };
  aggregation: "sum" | "avg" | "count" | "max" | "min" | "median";
  realTime: boolean;
  refreshInterval?: number; // in seconds
}

export interface AnalyticsResult {
  queryId: string;
  data: any[];
  metadata: {
    totalRecords: number;
    processingTime: number;
    dataQuality: number;
    lastUpdated: Date;
  };
  chartConfig: {
    type: "line" | "bar" | "pie" | "area" | "scatter";
    xAxis: string;
    yAxis: string[];
    colors: string[];
  };
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: "metric" | "chart" | "table" | "kpi" | "alert";
  query: AnalyticsQuery;
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: any;
}

export interface InteractiveDashboard {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  filters: Record<string, any>;
  autoRefresh: boolean;
  refreshInterval: number;
  permissions: string[];
}

export interface RealTimeStream {
  id: string;
  source: string;
  eventType: string;
  data: any;
  timestamp: Date;
  processed: boolean;
}

class InteractiveAnalyticsService {
  private activeQueries: Map<string, AnalyticsQuery> = new Map();
  private queryResults: Map<string, AnalyticsResult> = new Map();
  private dashboards: Map<string, InteractiveDashboard> = new Map();
  private realTimeStreams: RealTimeStream[] = [];
  private subscriptions: Map<string, Function[]> = new Map();
  private isProcessingRealTime = false;

  constructor() {
    this.initializeRealTimeProcessing();
    this.setupDefaultDashboards();
  }

  // Query Management
  async executeQuery(query: AnalyticsQuery): Promise<AnalyticsResult> {
    try {
      const startTime = Date.now();

      // Store query for tracking
      this.activeQueries.set(query.id, query);

      // Process query based on type
      let data: any[] = [];

      switch (query.type) {
        case "revenue":
          data = await this.processRevenueQuery(query);
          break;
        case "users":
          data = await this.processUsersQuery(query);
          break;
        case "security":
          data = await this.processSecurityQuery(query);
          break;
        case "performance":
          data = await this.processPerformanceQuery(query);
          break;
        case "global":
          data = await this.processGlobalQuery(query);
          break;
        case "custom":
          data = await this.processCustomQuery(query);
          break;
        default:
          throw new Error(`Unknown query type: ${query.type}`);
      }

      // Apply aggregation
      const aggregatedData = this.applyAggregation(
        data,
        query.aggregation,
        query.filters.groupBy,
      );

      // Generate chart configuration
      const chartConfig = this.generateChartConfig(query, aggregatedData);

      const result: AnalyticsResult = {
        queryId: query.id,
        data: aggregatedData,
        metadata: {
          totalRecords: data.length,
          processingTime: Date.now() - startTime,
          dataQuality: this.calculateDataQuality(data),
          lastUpdated: new Date(),
        },
        chartConfig,
      };

      // Cache result
      this.queryResults.set(query.id, result);

      // Setup real-time updates if requested
      if (query.realTime && query.refreshInterval) {
        this.setupRealTimeQuery(query);
      }

      return result;
    } catch (error) {
      console.error("Query execution failed:", error);
      throw error;
    }
  }

  async getQueryResult(queryId: string): Promise<AnalyticsResult | null> {
    return this.queryResults.get(queryId) || null;
  }

  async cancelQuery(queryId: string): Promise<void> {
    this.activeQueries.delete(queryId);
    this.queryResults.delete(queryId);

    // Cancel real-time updates
    const subscriptions = this.subscriptions.get(queryId) || [];
    subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions.delete(queryId);
  }

  // Dashboard Management
  async createDashboard(
    dashboard: Omit<InteractiveDashboard, "id">,
  ): Promise<string> {
    const id = this.generateId();
    const fullDashboard: InteractiveDashboard = {
      id,
      ...dashboard,
    };

    this.dashboards.set(id, fullDashboard);

    // Execute initial queries for all widgets
    for (const widget of dashboard.widgets) {
      await this.executeQuery(widget.query);
    }

    return id;
  }

  async getDashboard(
    dashboardId: string,
  ): Promise<InteractiveDashboard | null> {
    return this.dashboards.get(dashboardId) || null;
  }

  async updateDashboard(
    dashboardId: string,
    updates: Partial<InteractiveDashboard>,
  ): Promise<void> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    const updatedDashboard = { ...dashboard, ...updates };
    this.dashboards.set(dashboardId, updatedDashboard);

    // Re-execute queries if widgets changed
    if (updates.widgets) {
      for (const widget of updates.widgets) {
        await this.executeQuery(widget.query);
      }
    }
  }

  async deleteDashboard(dashboardId: string): Promise<void> {
    const dashboard = this.dashboards.get(dashboardId);
    if (dashboard) {
      // Cancel all widget queries
      for (const widget of dashboard.widgets) {
        await this.cancelQuery(widget.query.id);
      }
    }

    this.dashboards.delete(dashboardId);
  }

  // Real-time Processing
  private initializeRealTimeProcessing(): void {
    if (this.isProcessingRealTime) return;

    this.isProcessingRealTime = true;
    setInterval(() => {
      this.processRealTimeStreams();
    }, 1000); // Process every second
  }

  private async processRealTimeStreams(): Promise<void> {
    const unprocessedStreams = this.realTimeStreams.filter(
      (stream) => !stream.processed,
    );

    if (unprocessedStreams.length === 0) return;

    // Process streams concurrently
    const processingTasks = unprocessedStreams.map((stream) =>
      concurrentDataProcessor.addTask({
        type: "analytics",
        data: {
          operation: "process_real_time_stream",
          stream,
        },
        priority: "high",
      }),
    );

    await Promise.allSettled(processingTasks);

    // Mark streams as processed
    unprocessedStreams.forEach((stream) => {
      stream.processed = true;
    });

    // Clean up old streams (keep last hour)
    const oneHourAgo = new Date(Date.now() - 3600000);
    this.realTimeStreams = this.realTimeStreams.filter(
      (stream) => stream.timestamp > oneHourAgo,
    );

    // Update real-time queries
    await this.updateRealTimeQueries();
  }

  private async updateRealTimeQueries(): Promise<void> {
    for (const [queryId, query] of this.activeQueries.entries()) {
      if (query.realTime) {
        try {
          const updatedResult = await this.executeQuery(query);

          // Notify subscribers
          const subscribers = this.subscriptions.get(queryId) || [];
          subscribers.forEach((callback) => callback(updatedResult));
        } catch (error) {
          console.error(`Failed to update real-time query ${queryId}:`, error);
        }
      }
    }
  }

  private setupRealTimeQuery(query: AnalyticsQuery): void {
    const interval = setInterval(
      async () => {
        try {
          const updatedResult = await this.executeQuery(query);

          // Notify subscribers
          const subscribers = this.subscriptions.get(query.id) || [];
          subscribers.forEach((callback) => callback(updatedResult));
        } catch (error) {
          console.error(
            `Real-time query update failed for ${query.id}:`,
            error,
          );
        }
      },
      (query.refreshInterval || 30) * 1000,
    );

    // Store cleanup function
    const currentSubscriptions = this.subscriptions.get(query.id) || [];
    currentSubscriptions.push(() => clearInterval(interval));
    this.subscriptions.set(query.id, currentSubscriptions);
  }

  // Data Processing Methods
  private async processRevenueQuery(query: AnalyticsQuery): Promise<any[]> {
    const analytics = await enterprisePaymentService.getEnterpriseAnalytics();

    // Simulate time-series revenue data
    const data = [];
    const { start, end } = query.filters.dateRange;
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );

    for (let i = 0; i < days; i++) {
      const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split("T")[0],
        revenue: Math.random() * 10000 + 5000,
        subscriptions: Math.floor(Math.random() * 50) + 10,
        churn: Math.random() * 0.1,
        newCustomers: Math.floor(Math.random() * 20) + 5,
      });
    }

    return data;
  }

  private async processUsersQuery(query: AnalyticsQuery): Promise<any[]> {
    // Simulate user analytics data
    const data = [];
    const { start, end } = query.filters.dateRange;
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );

    for (let i = 0; i < days; i++) {
      const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split("T")[0],
        activeUsers: Math.floor(Math.random() * 1000) + 500,
        newUsers: Math.floor(Math.random() * 100) + 20,
        sessions: Math.floor(Math.random() * 2000) + 1000,
        bounceRate: Math.random() * 0.5 + 0.2,
        avgSessionDuration: Math.random() * 300 + 120,
      });
    }

    return data;
  }

  private async processSecurityQuery(query: AnalyticsQuery): Promise<any[]> {
    const securityMetrics = await ciscoXDRService.getSecurityMetrics();

    // Simulate security analytics data
    const data = [];
    const { start, end } = query.filters.dateRange;
    const hours = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60),
    );

    for (let i = 0; i < hours; i++) {
      const timestamp = new Date(start.getTime() + i * 60 * 60 * 1000);
      data.push({
        timestamp: timestamp.toISOString(),
        threatsDetected: Math.floor(Math.random() * 20),
        threatsBlocked: Math.floor(Math.random() * 15),
        securityScore: Math.random() * 20 + 80,
        vulnerabilities: Math.floor(Math.random() * 5),
        complianceScore: Math.random() * 10 + 90,
      });
    }

    return data;
  }

  private async processPerformanceQuery(query: AnalyticsQuery): Promise<any[]> {
    const processingStats = concurrentDataProcessor.getProcessingStats();

    // Simulate performance analytics data
    const data = [];
    const { start, end } = query.filters.dateRange;
    const minutes = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60));

    for (let i = 0; i < minutes; i++) {
      const timestamp = new Date(start.getTime() + i * 60 * 1000);
      data.push({
        timestamp: timestamp.toISOString(),
        responseTime: Math.random() * 100 + 50,
        throughput: Math.random() * 1000 + 500,
        errorRate: Math.random() * 0.05,
        cpuUsage: Math.random() * 30 + 20,
        memoryUsage: Math.random() * 40 + 30,
        uptime: 99.99,
      });
    }

    return data;
  }

  private async processGlobalQuery(query: AnalyticsQuery): Promise<any[]> {
    // Simulate global analytics data
    const regions = [
      "North America",
      "Europe",
      "Asia Pacific",
      "Africa",
      "South America",
    ];
    const data = [];

    regions.forEach((region) => {
      data.push({
        region,
        users: Math.floor(Math.random() * 10000) + 1000,
        revenue: Math.random() * 100000 + 10000,
        languages: Math.floor(Math.random() * 500) + 100,
        culturalAdaptations: Math.floor(Math.random() * 50) + 10,
        sovereigntyCompliance: Math.random() * 10 + 90,
      });
    });

    return data;
  }

  private async processCustomQuery(query: AnalyticsQuery): Promise<any[]> {
    // Process custom queries with flexible data sources
    await concurrentDataProcessor.addTask({
      type: "analytics",
      data: {
        operation: "execute_custom_query",
        query,
      },
      priority: "medium",
    });

    // Return mock data for now
    return [
      { metric: "custom_metric_1", value: Math.random() * 1000 },
      { metric: "custom_metric_2", value: Math.random() * 1000 },
      { metric: "custom_metric_3", value: Math.random() * 1000 },
    ];
  }

  // Utility Methods
  private applyAggregation(
    data: any[],
    aggregation: string,
    groupBy?: string[],
  ): any[] {
    if (!groupBy || groupBy.length === 0) {
      return data;
    }

    const grouped = data.reduce(
      (acc, item) => {
        const key = groupBy.map((field) => item[field]).join("|");
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    return Object.entries(grouped).map(([key, items]) => {
      const result: any = {};

      // Add group fields
      groupBy.forEach((field, index) => {
        result[field] = key.split("|")[index];
      });

      // Apply aggregation to numeric fields
      const numericFields = this.getNumericFields(items[0]);
      numericFields.forEach((field) => {
        const values = items
          .map((item) => item[field])
          .filter((v) => typeof v === "number");

        switch (aggregation) {
          case "sum":
            result[field] = values.reduce((sum, val) => sum + val, 0);
            break;
          case "avg":
            result[field] =
              values.reduce((sum, val) => sum + val, 0) / values.length;
            break;
          case "count":
            result[field] = values.length;
            break;
          case "max":
            result[field] = Math.max(...values);
            break;
          case "min":
            result[field] = Math.min(...values);
            break;
          case "median":
            const sorted = values.sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            result[field] =
              sorted.length % 2 === 0
                ? (sorted[mid - 1] + sorted[mid]) / 2
                : sorted[mid];
            break;
        }
      });

      return result;
    });
  }

  private getNumericFields(item: any): string[] {
    return Object.keys(item).filter((key) => typeof item[key] === "number");
  }

  private generateChartConfig(query: AnalyticsQuery, data: any[]): any {
    if (data.length === 0) {
      return {
        type: "bar",
        xAxis: "category",
        yAxis: ["value"],
        colors: ["#3b82f6"],
      };
    }

    const fields = Object.keys(data[0]);
    const numericFields = this.getNumericFields(data[0]);
    const dateFields = fields.filter(
      (field) => field.includes("date") || field.includes("timestamp"),
    );

    // Determine appropriate chart type
    let chartType: "line" | "bar" | "pie" | "area" | "scatter" = "bar";

    if (dateFields.length > 0) {
      chartType = query.type === "performance" ? "line" : "area";
    } else if (numericFields.length === 1) {
      chartType = "pie";
    } else if (numericFields.length > 2) {
      chartType = "scatter";
    }

    return {
      type: chartType,
      xAxis: dateFields[0] || fields[0],
      yAxis: numericFields.slice(0, 3), // Limit to 3 y-axes
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
    };
  }

  private calculateDataQuality(data: any[]): number {
    if (data.length === 0) return 0;

    let quality = 100;
    const sample = data[0];
    const totalFields = Object.keys(sample).length;

    // Check for missing values
    data.forEach((item) => {
      const missingFields = Object.values(item).filter(
        (value) => value === null || value === undefined || value === "",
      ).length;

      quality -= (missingFields / totalFields) * 10;
    });

    return Math.max(0, Math.min(100, quality));
  }

  // Event Streaming
  addRealTimeEvent(source: string, eventType: string, data: any): void {
    this.realTimeStreams.push({
      id: this.generateId(),
      source,
      eventType,
      data,
      timestamp: new Date(),
      processed: false,
    });
  }

  subscribeToQuery(
    queryId: string,
    callback: (result: AnalyticsResult) => void,
  ): () => void {
    const currentSubscriptions = this.subscriptions.get(queryId) || [];
    currentSubscriptions.push(callback);
    this.subscriptions.set(queryId, currentSubscriptions);

    // Return unsubscribe function
    return () => {
      const subscriptions = this.subscriptions.get(queryId) || [];
      const index = subscriptions.indexOf(callback);
      if (index > -1) {
        subscriptions.splice(index, 1);
        this.subscriptions.set(queryId, subscriptions);
      }
    };
  }

  // Default Dashboards
  private setupDefaultDashboards(): void {
    // Executive Dashboard
    this.createDashboard({
      name: "Executive Overview",
      autoRefresh: true,
      refreshInterval: 60,
      permissions: ["executive:read", "admin:all"],
      filters: {},
      widgets: [
        {
          id: "revenue-kpi",
          title: "Total Revenue",
          type: "kpi",
          query: {
            id: "exec-revenue",
            type: "revenue",
            filters: {
              dateRange: {
                start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                end: new Date(),
              },
              metrics: ["revenue"],
            },
            aggregation: "sum",
            realTime: true,
            refreshInterval: 60,
          },
          layout: { x: 0, y: 0, width: 3, height: 2 },
          config: { format: "currency" },
        },
      ],
    });

    // Security Dashboard
    this.createDashboard({
      name: "Security Monitoring",
      autoRefresh: true,
      refreshInterval: 30,
      permissions: ["security:read", "admin:all"],
      filters: {},
      widgets: [
        {
          id: "threat-chart",
          title: "Threat Detection",
          type: "chart",
          query: {
            id: "security-threats",
            type: "security",
            filters: {
              dateRange: {
                start: new Date(Date.now() - 24 * 60 * 60 * 1000),
                end: new Date(),
              },
              metrics: ["threatsDetected", "threatsBlocked"],
            },
            aggregation: "sum",
            realTime: true,
            refreshInterval: 30,
          },
          layout: { x: 0, y: 0, width: 6, height: 4 },
          config: { chartType: "line" },
        },
      ],
    });
  }

  private generateId(): string {
    return `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public API
  getActiveDashboards(): InteractiveDashboard[] {
    return Array.from(this.dashboards.values());
  }

  getQueryMetrics(): any {
    return {
      activeQueries: this.activeQueries.size,
      cachedResults: this.queryResults.size,
      realTimeStreams: this.realTimeStreams.length,
      totalSubscriptions: Array.from(this.subscriptions.values()).reduce(
        (sum, subs) => sum + subs.length,
        0,
      ),
    };
  }

  clearCache(): void {
    this.queryResults.clear();
    this.realTimeStreams = [];
  }
}

export const interactiveAnalyticsService = new InteractiveAnalyticsService();
