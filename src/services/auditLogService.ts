import { singletonPattern } from "../utils/singletonPattern";

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint?: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  outcome: "success" | "failure" | "blocked" | "warning";
  severity: "low" | "medium" | "high" | "critical";
  category:
    | "authentication"
    | "authorization"
    | "data_access"
    | "configuration"
    | "security"
    | "system";
  tags: string[];
  metadata: {
    geolocation?: string;
    deviceType?: string;
    referrer?: string;
    duration?: number;
    dataChanged?: Record<string, { from: any; to: any }>;
  };
}

class AuditLogService {
  private logs: AuditLogEntry[] = [];
  private maxLogEntries = 50000;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Start log rotation
    this.startLogRotation();

    this.isInitialized = true;
    console.log("Audit Log Service initialized");
  }

  async log(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...entry,
    };

    this.logs.unshift(auditEntry);

    // Trim logs if exceeding limit
    if (this.logs.length > this.maxLogEntries) {
      this.logs = this.logs.slice(0, this.maxLogEntries);
    }

    // Alert on critical entries
    if (entry.severity === "critical") {
      console.error("Critical audit event:", auditEntry);
    }
  }

  async getLogs(filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    severity?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AuditLogEntry[]; total: number }> {
    let filteredLogs = [...this.logs];

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(
        (log) => log.userId === filters.userId,
      );
    }

    if (filters?.action) {
      filteredLogs = filteredLogs.filter((log) =>
        log.action.toLowerCase().includes(filters.action!.toLowerCase()),
      );
    }

    if (filters?.resource) {
      filteredLogs = filteredLogs.filter((log) =>
        log.resource.toLowerCase().includes(filters.resource!.toLowerCase()),
      );
    }

    if (filters?.severity) {
      filteredLogs = filteredLogs.filter(
        (log) => log.severity === filters.severity,
      );
    }

    if (filters?.category) {
      filteredLogs = filteredLogs.filter(
        (log) => log.category === filters.category,
      );
    }

    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter(
        (log) => log.timestamp >= filters.startDate!,
      );
    }

    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter(
        (log) => log.timestamp <= filters.endDate!,
      );
    }

    const total = filteredLogs.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 100;

    const paginatedLogs = filteredLogs.slice(offset, offset + limit);

    return { logs: paginatedLogs, total };
  }

  private startLogRotation(): void {
    setInterval(() => {
      // Archive old logs (in production, this would go to long-term storage)
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const oldLogs = this.logs.filter((log) => log.timestamp < oneMonthAgo);
      if (oldLogs.length > 0) {
        console.log(`Archiving ${oldLogs.length} old audit logs`);
        this.logs = this.logs.filter((log) => log.timestamp >= oneMonthAgo);
      }
    }, 86400000); // Daily
  }
}

export const auditLogService = singletonPattern(() => new AuditLogService());
