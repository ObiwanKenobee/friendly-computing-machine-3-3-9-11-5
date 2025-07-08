import { singletonPattern } from "../utils/singletonPattern";

export interface OfflineData {
  id: string;
  type:
    | "vault_transaction"
    | "sensor_reading"
    | "user_action"
    | "ml_inference"
    | "alert"
    | "configuration";
  data: any;
  timestamp: Date;
  userId?: string;
  vaultId?: string;
  deviceId: string;
  priority: "low" | "medium" | "high" | "critical";
  retryCount: number;
  maxRetries: number;
  status: "pending" | "syncing" | "synced" | "failed" | "expired";
  syncAttempts: SyncAttempt[];
  expiresAt: Date;
  size: number; // bytes
}

export interface SyncAttempt {
  id: string;
  timestamp: Date;
  success: boolean;
  error?: string;
  duration: number; // ms
  networkCondition: NetworkCondition;
  dataIntegrity: boolean;
}

export interface NetworkCondition {
  online: boolean;
  connectionType: "wifi" | "cellular" | "satellite" | "ethernet" | "unknown";
  bandwidth: number; // Mbps
  latency: number; // ms
  reliability: number; // 0-100%
  signalStrength: number; // 0-100%
  estimatedCost: number; // per MB
}

export interface SyncQueue {
  id: string;
  name: string;
  priority: number;
  items: OfflineData[];
  status: "active" | "paused" | "throttled" | "error";
  syncStrategy: "immediate" | "batch" | "scheduled" | "adaptive";
  maxBatchSize: number;
  syncInterval: number; // ms
  lastSync: Date;
  nextSync: Date;
  bandwidthAllocation: number; // Mbps
}

export interface ConflictResolution {
  id: string;
  conflictType:
    | "data_version"
    | "timestamp"
    | "user_preference"
    | "business_logic";
  localData: any;
  serverData: any;
  resolution:
    | "local_wins"
    | "server_wins"
    | "merge"
    | "user_decides"
    | "custom_logic";
  resolvedData: any;
  timestamp: Date;
  resolvedBy: "system" | "user" | "ai_agent";
}

export interface DataIntegrityCheck {
  id: string;
  dataId: string;
  checksumType: "md5" | "sha256" | "crc32";
  originalChecksum: string;
  currentChecksum: string;
  isValid: boolean;
  corruptionLevel: number; // 0-100%
  repairAttempts: number;
  repairStrategy: "discard" | "retry" | "reconstruct" | "user_intervention";
  timestamp: Date;
}

export interface SyncPolicy {
  id: string;
  name: string;
  conditions: {
    networkType: string[];
    batteryLevel: number; // minimum %
    storageSpace: number; // minimum MB
    timeOfDay?: { start: string; end: string };
    userActivity: "active" | "idle" | "background";
  };
  actions: {
    syncPriority: "low" | "medium" | "high" | "critical";
    bandwidthLimit: number; // Mbps
    concurrentConnections: number;
    retryStrategy: "exponential" | "linear" | "immediate";
    dataCompression: boolean;
    encryptionLevel: "none" | "standard" | "enterprise";
  };
  active: boolean;
  effectiveUntil: Date;
}

export interface OfflineCapability {
  feature: string;
  availableOffline: boolean;
  dataRequirement: number; // MB
  functionalityLevel: "full" | "limited" | "read_only" | "none";
  cacheStrategy: "aggressive" | "conservative" | "smart" | "user_defined";
  maxOfflineDuration: number; // hours
  syncPriority: number; // 1-10
}

export interface BandwidthOptimization {
  id: string;
  technique:
    | "compression"
    | "deduplication"
    | "delta_sync"
    | "smart_caching"
    | "content_filtering";
  originalSize: number; // bytes
  optimizedSize: number; // bytes
  compressionRatio: number;
  processingTime: number; // ms
  effectivenessScore: number; // 0-100%
}

export interface SyncMetrics {
  timeRange: { start: Date; end: Date };
  totalDataSynced: number; // bytes
  syncSuccess: number;
  syncFailures: number;
  averageSyncTime: number; // ms
  bandwidthUsed: number; // MB
  conflictsResolved: number;
  dataIntegrityIssues: number;
  offlineTime: number; // ms
  syncEfficiency: number; // 0-100%
  userSatisfaction: number; // 0-100%
}

class OfflineSyncService {
  private offlineDataQueue: Map<string, OfflineData> = new Map();
  private syncQueues: Map<string, SyncQueue> = new Map();
  private conflictResolutions: Map<string, ConflictResolution> = new Map();
  private integrityChecks: Map<string, DataIntegrityCheck> = new Map();
  private syncPolicies: Map<string, SyncPolicy> = new Map();
  private offlineCapabilities: Map<string, OfflineCapability> = new Map();
  private bandwidthOptimizations: Map<string, BandwidthOptimization> =
    new Map();
  private currentNetworkCondition: NetworkCondition;
  private isInitialized = false;

  constructor() {
    this.currentNetworkCondition = {
      online: true,
      connectionType: "wifi",
      bandwidth: 50.0,
      latency: 25,
      reliability: 95,
      signalStrength: 85,
      estimatedCost: 0.001,
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await this.setupSyncQueues();
    await this.initializeSyncPolicies();
    await this.setupOfflineCapabilities();
    await this.restoreOfflineData();

    this.startNetworkMonitoring();
    this.startSyncProcessing();
    this.startDataIntegrityChecks();
    this.startBandwidthOptimization();

    this.isInitialized = true;
    console.log(
      "Offline Sync Service initialized with robust offline-online synchronization",
    );
  }

  private async setupSyncQueues(): Promise<void> {
    const queues: SyncQueue[] = [
      {
        id: "queue-critical",
        name: "Critical Data Queue",
        priority: 100,
        items: [],
        status: "active",
        syncStrategy: "immediate",
        maxBatchSize: 10,
        syncInterval: 5000, // 5 seconds
        lastSync: new Date(),
        nextSync: new Date(Date.now() + 5000),
        bandwidthAllocation: 10.0,
      },
      {
        id: "queue-high-priority",
        name: "High Priority Queue",
        priority: 80,
        items: [],
        status: "active",
        syncStrategy: "batch",
        maxBatchSize: 50,
        syncInterval: 30000, // 30 seconds
        lastSync: new Date(),
        nextSync: new Date(Date.now() + 30000),
        bandwidthAllocation: 20.0,
      },
      {
        id: "queue-medium-priority",
        name: "Medium Priority Queue",
        priority: 60,
        items: [],
        status: "active",
        syncStrategy: "scheduled",
        maxBatchSize: 100,
        syncInterval: 300000, // 5 minutes
        lastSync: new Date(),
        nextSync: new Date(Date.now() + 300000),
        bandwidthAllocation: 15.0,
      },
      {
        id: "queue-low-priority",
        name: "Low Priority Queue",
        priority: 40,
        items: [],
        status: "active",
        syncStrategy: "adaptive",
        maxBatchSize: 200,
        syncInterval: 1800000, // 30 minutes
        lastSync: new Date(),
        nextSync: new Date(Date.now() + 1800000),
        bandwidthAllocation: 5.0,
      },
    ];

    for (const queue of queues) {
      this.syncQueues.set(queue.id, queue);
    }
  }

  private async initializeSyncPolicies(): Promise<void> {
    const policies: SyncPolicy[] = [
      {
        id: "policy-wifi-optimal",
        name: "WiFi Optimal Sync",
        conditions: {
          networkType: ["wifi"],
          batteryLevel: 20,
          storageSpace: 100,
          userActivity: "idle",
        },
        actions: {
          syncPriority: "high",
          bandwidthLimit: 50,
          concurrentConnections: 5,
          retryStrategy: "exponential",
          dataCompression: true,
          encryptionLevel: "standard",
        },
        active: true,
        effectiveUntil: new Date("2025-12-31"),
      },
      {
        id: "policy-cellular-conservative",
        name: "Cellular Conservative Sync",
        conditions: {
          networkType: ["cellular"],
          batteryLevel: 30,
          storageSpace: 50,
          userActivity: "background",
        },
        actions: {
          syncPriority: "medium",
          bandwidthLimit: 5,
          concurrentConnections: 2,
          retryStrategy: "linear",
          dataCompression: true,
          encryptionLevel: "enterprise",
        },
        active: true,
        effectiveUntil: new Date("2025-12-31"),
      },
      {
        id: "policy-emergency",
        name: "Emergency Sync",
        conditions: {
          networkType: ["wifi", "cellular", "satellite"],
          batteryLevel: 5,
          storageSpace: 10,
          userActivity: "active",
        },
        actions: {
          syncPriority: "critical",
          bandwidthLimit: 1,
          concurrentConnections: 1,
          retryStrategy: "immediate",
          dataCompression: true,
          encryptionLevel: "standard",
        },
        active: true,
        effectiveUntil: new Date("2025-12-31"),
      },
    ];

    for (const policy of policies) {
      this.syncPolicies.set(policy.id, policy);
    }
  }

  private async setupOfflineCapabilities(): Promise<void> {
    const capabilities: OfflineCapability[] = [
      {
        feature: "vault_viewing",
        availableOffline: true,
        dataRequirement: 10,
        functionalityLevel: "full",
        cacheStrategy: "aggressive",
        maxOfflineDuration: 72,
        syncPriority: 8,
      },
      {
        feature: "vault_transactions",
        availableOffline: true,
        dataRequirement: 5,
        functionalityLevel: "limited",
        cacheStrategy: "smart",
        maxOfflineDuration: 24,
        syncPriority: 10,
      },
      {
        feature: "portfolio_analytics",
        availableOffline: true,
        dataRequirement: 25,
        functionalityLevel: "read_only",
        cacheStrategy: "conservative",
        maxOfflineDuration: 48,
        syncPriority: 6,
      },
      {
        feature: "ml_recommendations",
        availableOffline: true,
        dataRequirement: 50,
        functionalityLevel: "limited",
        cacheStrategy: "smart",
        maxOfflineDuration: 12,
        syncPriority: 7,
      },
      {
        feature: "real_time_alerts",
        availableOffline: false,
        dataRequirement: 1,
        functionalityLevel: "none",
        cacheStrategy: "user_defined",
        maxOfflineDuration: 0,
        syncPriority: 10,
      },
      {
        feature: "sensor_data_collection",
        availableOffline: true,
        dataRequirement: 100,
        functionalityLevel: "full",
        cacheStrategy: "aggressive",
        maxOfflineDuration: 168, // 1 week
        syncPriority: 9,
      },
    ];

    for (const capability of capabilities) {
      this.offlineCapabilities.set(capability.feature, capability);
    }
  }

  private async restoreOfflineData(): Promise<void> {
    // Simulate restoring offline data from local storage
    const sampleOfflineData: OfflineData[] = [
      {
        id: "offline-tx-001",
        type: "vault_transaction",
        data: {
          vaultId: "vault-amazon-rainforest",
          action: "stake",
          amount: 1000,
          userId: "user-123",
        },
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        userId: "user-123",
        vaultId: "vault-amazon-rainforest",
        deviceId: "device-mobile-001",
        priority: "high",
        retryCount: 0,
        maxRetries: 5,
        status: "pending",
        syncAttempts: [],
        expiresAt: new Date(Date.now() + 86400000), // 24 hours
        size: 512,
      },
      {
        id: "offline-sensor-001",
        type: "sensor_reading",
        data: {
          sensorId: "sensor-amazon-temp-001",
          value: 26.8,
          timestamp: new Date(),
          quality: 95,
        },
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        deviceId: "device-edge-001",
        priority: "medium",
        retryCount: 1,
        maxRetries: 3,
        status: "pending",
        syncAttempts: [
          {
            id: "attempt-001",
            timestamp: new Date(Date.now() - 300000),
            success: false,
            error: "Network timeout",
            duration: 5000,
            networkCondition: this.currentNetworkCondition,
            dataIntegrity: true,
          },
        ],
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
        size: 256,
      },
    ];

    for (const data of sampleOfflineData) {
      this.offlineDataQueue.set(data.id, data);
      this.addToSyncQueue(data);
    }
  }

  // Background processes
  private startNetworkMonitoring(): void {
    setInterval(() => {
      this.updateNetworkCondition();
    }, 5000); // Every 5 seconds
  }

  private startSyncProcessing(): void {
    setInterval(() => {
      this.processSyncQueues();
    }, 10000); // Every 10 seconds
  }

  private startDataIntegrityChecks(): void {
    setInterval(() => {
      this.performDataIntegrityChecks();
    }, 60000); // Every minute
  }

  private startBandwidthOptimization(): void {
    setInterval(() => {
      this.optimizeBandwidthUsage();
    }, 30000); // Every 30 seconds
  }

  private updateNetworkCondition(): void {
    // Simulate network condition changes
    this.currentNetworkCondition = {
      online: Math.random() > 0.1, // 90% uptime
      connectionType: this.currentNetworkCondition.connectionType,
      bandwidth: Math.max(
        1,
        this.currentNetworkCondition.bandwidth + (Math.random() - 0.5) * 10,
      ),
      latency: Math.max(
        10,
        this.currentNetworkCondition.latency + (Math.random() - 0.5) * 20,
      ),
      reliability: Math.max(
        50,
        Math.min(
          100,
          this.currentNetworkCondition.reliability + (Math.random() - 0.5) * 10,
        ),
      ),
      signalStrength: Math.max(
        30,
        Math.min(
          100,
          this.currentNetworkCondition.signalStrength +
            (Math.random() - 0.5) * 15,
        ),
      ),
      estimatedCost:
        this.currentNetworkCondition.connectionType === "cellular"
          ? 0.01
          : 0.001,
    };
  }

  private async processSyncQueues(): Promise<void> {
    if (!this.currentNetworkCondition.online) return;

    const activePolicy = this.getActiveSyncPolicy();
    if (!activePolicy) return;

    // Process queues by priority
    const sortedQueues = Array.from(this.syncQueues.values()).sort(
      (a, b) => b.priority - a.priority,
    );

    for (const queue of sortedQueues) {
      if (queue.status === "active" && queue.items.length > 0) {
        await this.processQueue(queue, activePolicy);
      }
    }
  }

  private async processQueue(
    queue: SyncQueue,
    policy: SyncPolicy,
  ): Promise<void> {
    const now = new Date();

    // Check if it's time to sync this queue
    if (now < queue.nextSync && queue.syncStrategy !== "immediate") {
      return;
    }

    const batchSize = Math.min(queue.maxBatchSize, queue.items.length);
    const batch = queue.items.splice(0, batchSize);

    for (const item of batch) {
      await this.syncItem(item, policy);
    }

    // Update queue timing
    queue.lastSync = now;
    queue.nextSync = new Date(now.getTime() + queue.syncInterval);
  }

  private async syncItem(item: OfflineData, policy: SyncPolicy): Promise<void> {
    const attempt: SyncAttempt = {
      id: `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      success: false,
      duration: 0,
      networkCondition: { ...this.currentNetworkCondition },
      dataIntegrity: true,
    };

    const startTime = Date.now();
    item.status = "syncing";

    try {
      // Perform data integrity check
      const integrityCheck = await this.checkDataIntegrity(item);
      attempt.dataIntegrity = integrityCheck.isValid;

      if (!integrityCheck.isValid) {
        throw new Error(
          `Data integrity check failed: ${integrityCheck.corruptionLevel}% corruption`,
        );
      }

      // Apply bandwidth optimization
      const optimizedData = await this.optimizeDataForSync(item, policy);

      // Simulate network sync
      const syncDuration = this.calculateSyncDuration(
        optimizedData.optimizedSize,
        this.currentNetworkCondition,
      );

      await new Promise((resolve) => setTimeout(resolve, syncDuration));

      // Simulate success/failure based on network reliability
      const successProbability = this.currentNetworkCondition.reliability / 100;
      const success = Math.random() < successProbability;

      if (success) {
        attempt.success = true;
        item.status = "synced";

        // Check for conflicts
        const hasConflict = Math.random() < 0.05; // 5% chance of conflict
        if (hasConflict) {
          await this.handleConflict(item);
        }
      } else {
        throw new Error("Network sync failed");
      }
    } catch (error) {
      attempt.error = error instanceof Error ? error.message : "Unknown error";
      item.retryCount++;

      if (item.retryCount >= item.maxRetries) {
        item.status = "failed";
      } else {
        item.status = "pending";
        // Re-add to appropriate queue based on retry strategy
        this.addToSyncQueue(item);
      }
    } finally {
      attempt.duration = Date.now() - startTime;
      item.syncAttempts.push(attempt);
    }
  }

  private async checkDataIntegrity(
    item: OfflineData,
  ): Promise<DataIntegrityCheck> {
    const dataString = JSON.stringify(item.data);
    const originalChecksum = this.calculateChecksum(dataString, "sha256");

    // Simulate potential data corruption
    const isCorrupted = Math.random() < 0.01; // 1% chance of corruption
    const currentChecksum = isCorrupted ? "corrupted" : originalChecksum;

    const check: DataIntegrityCheck = {
      id: `integrity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dataId: item.id,
      checksumType: "sha256",
      originalChecksum,
      currentChecksum,
      isValid: !isCorrupted,
      corruptionLevel: isCorrupted ? 10 + Math.random() * 20 : 0,
      repairAttempts: 0,
      repairStrategy: isCorrupted ? "retry" : "discard",
      timestamp: new Date(),
    };

    this.integrityChecks.set(check.id, check);
    return check;
  }

  private calculateChecksum(
    data: string,
    algorithm: "md5" | "sha256" | "crc32",
  ): string {
    // Simplified checksum calculation
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private async optimizeDataForSync(
    item: OfflineData,
    policy: SyncPolicy,
  ): Promise<BandwidthOptimization> {
    const optimization: BandwidthOptimization = {
      id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      technique: "compression",
      originalSize: item.size,
      optimizedSize: item.size,
      compressionRatio: 1.0,
      processingTime: 0,
      effectivenessScore: 0,
    };

    const startTime = Date.now();

    if (policy.actions.dataCompression) {
      // Simulate compression
      const compressionRatio = 0.3 + Math.random() * 0.4; // 30-70% compression
      optimization.optimizedSize = Math.floor(item.size * compressionRatio);
      optimization.compressionRatio = compressionRatio;
      optimization.technique = "compression";
    }

    // Additional optimization techniques
    if (this.currentNetworkCondition.bandwidth < 5) {
      // Apply delta sync for low bandwidth
      optimization.optimizedSize = Math.floor(optimization.optimizedSize * 0.5);
      optimization.technique = "delta_sync";
    }

    optimization.processingTime = Date.now() - startTime;
    optimization.effectivenessScore = (1 - optimization.compressionRatio) * 100;

    this.bandwidthOptimizations.set(optimization.id, optimization);
    return optimization;
  }

  private calculateSyncDuration(
    dataSize: number,
    networkCondition: NetworkCondition,
  ): number {
    const transferTime =
      ((dataSize * 8) / (networkCondition.bandwidth * 1024 * 1024)) * 1000; // Convert to ms
    const latencyPenalty = networkCondition.latency * 2; // Round trip
    const reliabilityFactor =
      ((100 - networkCondition.reliability) / 100) * 1000; // Additional delay for unreliable connections

    return Math.max(100, transferTime + latencyPenalty + reliabilityFactor);
  }

  private async handleConflict(item: OfflineData): Promise<void> {
    // Simulate server data for conflict
    const serverData = {
      ...item.data,
      serverModified: true,
      lastModified: new Date(Date.now() + 60000), // Server version is newer
    };

    const conflict: ConflictResolution = {
      id: `conflict-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      conflictType: "timestamp",
      localData: item.data,
      serverData,
      resolution: "server_wins", // Default resolution strategy
      resolvedData: serverData,
      timestamp: new Date(),
      resolvedBy: "system",
    };

    // Apply resolution logic based on conflict type
    switch (conflict.conflictType) {
      case "timestamp":
        // Server data is newer, use server version
        conflict.resolution = "server_wins";
        conflict.resolvedData = serverData;
        break;
      case "user_preference":
        // User data takes precedence
        conflict.resolution = "local_wins";
        conflict.resolvedData = item.data;
        break;
      case "data_version":
        // Merge compatible changes
        conflict.resolution = "merge";
        conflict.resolvedData = { ...item.data, ...serverData };
        break;
    }

    this.conflictResolutions.set(conflict.id, conflict);
  }

  private getActiveSyncPolicy(): SyncPolicy | null {
    for (const policy of this.syncPolicies.values()) {
      if (!policy.active || new Date() > policy.effectiveUntil) continue;

      // Check if current conditions match policy
      const matchesNetwork = policy.conditions.networkType.includes(
        this.currentNetworkCondition.connectionType,
      );
      // Additional condition checks would go here

      if (matchesNetwork) {
        return policy;
      }
    }

    return null;
  }

  private addToSyncQueue(item: OfflineData): void {
    let queueId: string;

    switch (item.priority) {
      case "critical":
        queueId = "queue-critical";
        break;
      case "high":
        queueId = "queue-high-priority";
        break;
      case "medium":
        queueId = "queue-medium-priority";
        break;
      case "low":
      default:
        queueId = "queue-low-priority";
        break;
    }

    const queue = this.syncQueues.get(queueId);
    if (queue) {
      queue.items.push(item);
    }
  }

  private async performDataIntegrityChecks(): Promise<void> {
    // Check for expired data
    const now = new Date();
    for (const [id, item] of this.offlineDataQueue.entries()) {
      if (now > item.expiresAt && item.status === "pending") {
        item.status = "expired";
        console.log(`Data item ${id} expired`);
      }
    }

    // Verify integrity of recent sync attempts
    const recentChecks = Array.from(this.integrityChecks.values()).filter(
      (check) => now.getTime() - check.timestamp.getTime() < 300000,
    ); // Last 5 minutes

    for (const check of recentChecks) {
      if (!check.isValid && check.repairAttempts < 3) {
        // Attempt repair
        check.repairAttempts++;
        console.log(`Attempting repair for corrupted data: ${check.dataId}`);
      }
    }
  }

  private async optimizeBandwidthUsage(): Promise<void> {
    // Monitor bandwidth usage and adjust strategies
    const recentOptimizations = Array.from(
      this.bandwidthOptimizations.values(),
    ).filter((opt) => Date.now() - opt.processingTime < 300000); // Last 5 minutes

    if (recentOptimizations.length > 0) {
      const avgEffectiveness =
        recentOptimizations.reduce(
          (sum, opt) => sum + opt.effectivenessScore,
          0,
        ) / recentOptimizations.length;

      // Adjust optimization strategies based on effectiveness
      if (avgEffectiveness < 50) {
        // Try different optimization techniques
        console.log("Adjusting bandwidth optimization strategy");
      }
    }
  }

  // Public interface methods
  async addOfflineData(
    data: Omit<
      OfflineData,
      "id" | "timestamp" | "retryCount" | "status" | "syncAttempts"
    >,
  ): Promise<string> {
    const id = `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const offlineData: OfflineData = {
      ...data,
      id,
      timestamp: new Date(),
      retryCount: 0,
      status: "pending",
      syncAttempts: [],
    };

    this.offlineDataQueue.set(id, offlineData);
    this.addToSyncQueue(offlineData);

    return id;
  }

  async getOfflineData(filters?: {
    type?: string;
    status?: string;
    userId?: string;
    vaultId?: string;
  }): Promise<OfflineData[]> {
    let data = Array.from(this.offlineDataQueue.values());

    if (filters) {
      if (filters.type)
        data = data.filter((item) => item.type === filters.type);
      if (filters.status)
        data = data.filter((item) => item.status === filters.status);
      if (filters.userId)
        data = data.filter((item) => item.userId === filters.userId);
      if (filters.vaultId)
        data = data.filter((item) => item.vaultId === filters.vaultId);
    }

    return data.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getSyncQueues(): Promise<SyncQueue[]> {
    return Array.from(this.syncQueues.values()).sort(
      (a, b) => b.priority - a.priority,
    );
  }

  async getNetworkCondition(): Promise<NetworkCondition> {
    return { ...this.currentNetworkCondition };
  }

  async getSyncPolicies(): Promise<SyncPolicy[]> {
    return Array.from(this.syncPolicies.values());
  }

  async getOfflineCapabilities(): Promise<OfflineCapability[]> {
    return Array.from(this.offlineCapabilities.values()).sort(
      (a, b) => b.syncPriority - a.syncPriority,
    );
  }

  async getConflictResolutions(
    limit: number = 50,
  ): Promise<ConflictResolution[]> {
    return Array.from(this.conflictResolutions.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getSyncMetrics(timeRange: {
    start: Date;
    end: Date;
  }): Promise<SyncMetrics> {
    const syncAttempts = Array.from(this.offlineDataQueue.values())
      .flatMap((item) => item.syncAttempts)
      .filter(
        (attempt) =>
          attempt.timestamp >= timeRange.start &&
          attempt.timestamp <= timeRange.end,
      );

    const totalAttempts = syncAttempts.length;
    const successfulAttempts = syncAttempts.filter(
      (attempt) => attempt.success,
    ).length;
    const totalDataSynced = Array.from(this.offlineDataQueue.values())
      .filter((item) => item.status === "synced")
      .reduce((sum, item) => sum + item.size, 0);

    return {
      timeRange,
      totalDataSynced,
      syncSuccess: successfulAttempts,
      syncFailures: totalAttempts - successfulAttempts,
      averageSyncTime:
        totalAttempts > 0
          ? syncAttempts.reduce((sum, attempt) => sum + attempt.duration, 0) /
            totalAttempts
          : 0,
      bandwidthUsed: totalDataSynced / (1024 * 1024), // Convert to MB
      conflictsResolved: this.conflictResolutions.size,
      dataIntegrityIssues: Array.from(this.integrityChecks.values()).filter(
        (check) => !check.isValid,
      ).length,
      offlineTime: this.currentNetworkCondition.online
        ? 0
        : Date.now() - timeRange.start.getTime(),
      syncEfficiency:
        totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0,
      userSatisfaction: 85 + Math.random() * 10, // Simulated user satisfaction
    };
  }

  async updateSyncPolicy(
    policyId: string,
    updates: Partial<SyncPolicy>,
  ): Promise<boolean> {
    const policy = this.syncPolicies.get(policyId);
    if (!policy) return false;

    Object.assign(policy, updates);
    return true;
  }

  async pauseQueue(queueId: string): Promise<boolean> {
    const queue = this.syncQueues.get(queueId);
    if (!queue) return false;

    queue.status = "paused";
    return true;
  }

  async resumeQueue(queueId: string): Promise<boolean> {
    const queue = this.syncQueues.get(queueId);
    if (!queue) return false;

    queue.status = "active";
    return true;
  }

  async forceSyncItem(itemId: string): Promise<boolean> {
    const item = this.offlineDataQueue.get(itemId);
    if (!item || item.status === "synced") return false;

    const policy = this.getActiveSyncPolicy();
    if (!policy) return false;

    await this.syncItem(item, policy);
    return item.status === "synced";
  }

  async clearSyncHistory(olderThan: Date): Promise<number> {
    let cleared = 0;

    // Clear old offline data
    for (const [id, item] of this.offlineDataQueue.entries()) {
      if (
        item.timestamp < olderThan &&
        (item.status === "synced" || item.status === "expired")
      ) {
        this.offlineDataQueue.delete(id);
        cleared++;
      }
    }

    // Clear old conflict resolutions
    for (const [id, conflict] of this.conflictResolutions.entries()) {
      if (conflict.timestamp < olderThan) {
        this.conflictResolutions.delete(id);
        cleared++;
      }
    }

    // Clear old integrity checks
    for (const [id, check] of this.integrityChecks.entries()) {
      if (check.timestamp < olderThan) {
        this.integrityChecks.delete(id);
        cleared++;
      }
    }

    return cleared;
  }

  async estimateOfflineCapacity(): Promise<{
    totalCapacity: number; // MB
    usedCapacity: number; // MB
    availableCapacity: number; // MB
    recommendedCacheSize: number; // MB
    criticalDataSize: number; // MB
  }> {
    const totalOfflineData = Array.from(this.offlineDataQueue.values()).reduce(
      (sum, item) => sum + item.size,
      0,
    );

    const criticalData = Array.from(this.offlineDataQueue.values())
      .filter((item) => item.priority === "critical")
      .reduce((sum, item) => sum + item.size, 0);

    const totalCapacityBytes = 500 * 1024 * 1024; // 500 MB default capacity

    return {
      totalCapacity: totalCapacityBytes / (1024 * 1024),
      usedCapacity: totalOfflineData / (1024 * 1024),
      availableCapacity:
        (totalCapacityBytes - totalOfflineData) / (1024 * 1024),
      recommendedCacheSize: 100, // MB
      criticalDataSize: criticalData / (1024 * 1024),
    };
  }
}

export const offlineSyncService = singletonPattern(
  () => new OfflineSyncService(),
);
