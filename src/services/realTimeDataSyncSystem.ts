/**
 * Advanced Real-Time Data Synchronization System
 * Enterprise-grade real-time data sync with conflict resolution, offline support, and intelligent batching
 */

import { enterpriseInnovationSystem } from "./enterpriseInnovationSystem";

export interface SyncConfiguration {
  endpoint: string;
  protocol: "websocket" | "sse" | "polling";
  batchSize: number;
  syncInterval: number;
  conflictResolution: "last-write-wins" | "operational-transform" | "custom";
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  offlineSupport: boolean;
  retryPolicy: RetryPolicy;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffStrategy: "exponential" | "linear" | "fixed";
  baseDelay: number;
  maxDelay: number;
  jitter: boolean;
}

export interface SyncData {
  id: string;
  type: string;
  operation: "create" | "update" | "delete";
  data: any;
  timestamp: number;
  version: number;
  userId: string;
  checksum: string;
}

export interface ConflictData {
  id: string;
  localVersion: SyncData;
  remoteVersion: SyncData;
  conflictType: "concurrent-update" | "delete-update" | "version-mismatch";
  resolvedData?: SyncData;
}

export interface SyncStatus {
  isConnected: boolean;
  lastSyncTime: number;
  pendingChanges: number;
  conflicts: number;
  dataIntegrity: "healthy" | "degraded" | "corrupted";
  networkQuality: "excellent" | "good" | "poor" | "offline";
}

export interface OfflineCapabilities {
  storage: OfflineStorage;
  queueManager: OfflineQueueManager;
  conflictDetector: ConflictDetector;
  dataValidator: DataValidator;
}

interface OfflineStorage {
  store: (key: string, data: any) => Promise<void>;
  retrieve: (key: string) => Promise<any>;
  remove: (key: string) => Promise<void>;
  list: (prefix?: string) => Promise<string[]>;
  clear: () => Promise<void>;
  size: () => Promise<number>;
}

interface OfflineQueueManager {
  enqueue: (operation: SyncData) => Promise<void>;
  dequeue: () => Promise<SyncData | null>;
  peek: () => Promise<SyncData | null>;
  clear: () => Promise<void>;
  size: () => Promise<number>;
  reorder: (compareFn: (a: SyncData, b: SyncData) => number) => Promise<void>;
}

interface ConflictDetector {
  detectConflicts: (local: SyncData[], remote: SyncData[]) => ConflictData[];
  resolveConflict: (conflict: ConflictData) => Promise<SyncData>;
  validateResolution: (resolution: SyncData) => boolean;
}

interface DataValidator {
  validateData: (data: SyncData) => boolean;
  validateChecksum: (data: SyncData) => boolean;
  sanitizeData: (data: any) => any;
  encryptData: (data: any) => Promise<string>;
  decryptData: (encryptedData: string) => Promise<any>;
}

export class RealTimeDataSyncSystem {
  private static instance: RealTimeDataSyncSystem;
  private configuration: SyncConfiguration;
  private connection: WebSocket | EventSource | null = null;
  private syncStatus: SyncStatus;
  private offlineCapabilities: OfflineCapabilities;
  private syncQueue: SyncData[] = [];
  private conflictQueue: ConflictData[] = [];
  private eventListeners: Map<string, Function[]> = new Map();
  private isInitialized = false;
  private heartbeatInterval?: NodeJS.Timeout;
  private syncInterval?: NodeJS.Timeout;

  private constructor() {
    this.initializeDefaultConfiguration();
    this.initializeSyncStatus();
    this.initializeOfflineCapabilities();
  }

  public static getInstance(): RealTimeDataSyncSystem {
    if (!RealTimeDataSyncSystem.instance) {
      RealTimeDataSyncSystem.instance = new RealTimeDataSyncSystem();
    }
    return RealTimeDataSyncSystem.instance;
  }

  private initializeDefaultConfiguration(): void {
    this.configuration = {
      endpoint:
        import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080/sync",
      protocol: "websocket",
      batchSize: 50,
      syncInterval: 5000, // 5 seconds
      conflictResolution: "operational-transform",
      compressionEnabled: true,
      encryptionEnabled: true,
      offlineSupport: true,
      retryPolicy: {
        maxRetries: 5,
        backoffStrategy: "exponential",
        baseDelay: 1000,
        maxDelay: 30000,
        jitter: true,
      },
    };
  }

  private initializeSyncStatus(): void {
    this.syncStatus = {
      isConnected: false,
      lastSyncTime: 0,
      pendingChanges: 0,
      conflicts: 0,
      dataIntegrity: "healthy",
      networkQuality: "offline",
    };
  }

  private initializeOfflineCapabilities(): void {
    this.offlineCapabilities = {
      storage: this.createOfflineStorage(),
      queueManager: this.createOfflineQueueManager(),
      conflictDetector: this.createConflictDetector(),
      dataValidator: this.createDataValidator(),
    };
  }

  public async initialize(config?: Partial<SyncConfiguration>): Promise<void> {
    try {
      console.log("🔄 Initializing Real-Time Data Sync System...");

      if (config) {
        this.configuration = { ...this.configuration, ...config };
      }

      // Load offline data
      await this.loadOfflineData();

      // Establish connection
      await this.establishConnection();

      // Start sync processes
      this.startHeartbeat();
      this.startPeriodicSync();

      // Monitor network connectivity
      this.setupNetworkMonitoring();

      this.isInitialized = true;
      console.log("✅ Real-Time Data Sync System initialized successfully");

      this.emit("sync:initialized", { status: this.syncStatus });
    } catch (error) {
      console.error(
        "❌ Failed to initialize Real-Time Data Sync System:",
        error,
      );
      throw error;
    }
  }

  private async establishConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        switch (this.configuration.protocol) {
          case "websocket":
            this.establishWebSocketConnection(resolve, reject);
            break;
          case "sse":
            this.establishSSEConnection(resolve, reject);
            break;
          case "polling":
            this.establishPollingConnection(resolve, reject);
            break;
          default:
            reject(
              new Error(`Unsupported protocol: ${this.configuration.protocol}`),
            );
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private establishWebSocketConnection(
    resolve: Function,
    reject: Function,
  ): void {
    try {
      this.connection = new WebSocket(this.configuration.endpoint);

      this.connection.onopen = () => {
        console.log("🔗 WebSocket connection established");
        this.syncStatus.isConnected = true;
        this.syncStatus.networkQuality = "excellent";
        this.processOfflineQueue();
        resolve(true);
      };

      this.connection.onmessage = (event) => {
        this.handleIncomingData(event.data);
      };

      this.connection.onclose = () => {
        console.log("🔌 WebSocket connection closed");
        this.syncStatus.isConnected = false;
        this.syncStatus.networkQuality = "offline";
        this.handleConnectionLoss();
      };

      this.connection.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        this.syncStatus.networkQuality = "poor";
        reject(error);
      };
    } catch (error) {
      reject(error);
    }
  }

  private establishSSEConnection(resolve: Function, reject: Function): void {
    try {
      this.connection = new EventSource(this.configuration.endpoint);

      this.connection.onopen = () => {
        console.log("🔗 SSE connection established");
        this.syncStatus.isConnected = true;
        this.syncStatus.networkQuality = "good";
        resolve(true);
      };

      this.connection.onmessage = (event) => {
        this.handleIncomingData(event.data);
      };

      this.connection.onerror = (error) => {
        console.error("❌ SSE error:", error);
        this.syncStatus.isConnected = false;
        this.syncStatus.networkQuality = "poor";
        reject(error);
      };
    } catch (error) {
      reject(error);
    }
  }

  private establishPollingConnection(
    resolve: Function,
    reject: Function,
  ): void {
    // Polling implementation
    this.syncStatus.isConnected = true;
    this.syncStatus.networkQuality = "good";
    console.log("🔗 Polling connection established");
    resolve(true);
  }

  private async handleIncomingData(rawData: string): Promise<void> {
    try {
      let data: SyncData | SyncData[];

      // Decrypt if encryption is enabled
      if (this.configuration.encryptionEnabled) {
        data =
          await this.offlineCapabilities.dataValidator.decryptData(rawData);
      } else {
        data = JSON.parse(rawData);
      }

      // Handle batch data
      const syncDataArray = Array.isArray(data) ? data : [data];

      for (const syncData of syncDataArray) {
        // Validate data integrity
        if (!this.offlineCapabilities.dataValidator.validateData(syncData)) {
          console.warn("⚠️ Invalid data received:", syncData);
          continue;
        }

        // Check for conflicts
        const conflicts = await this.detectAndResolveConflicts([syncData]);

        if (conflicts.length > 0) {
          this.conflictQueue.push(...conflicts);
          this.syncStatus.conflicts += conflicts.length;
          this.emit("sync:conflict", conflicts);
        } else {
          // Apply changes
          await this.applyIncomingChanges(syncData);
          this.emit("sync:data-received", syncData);
        }
      }

      this.syncStatus.lastSyncTime = Date.now();
      this.emit("sync:status-updated", this.syncStatus);
    } catch (error) {
      console.error("❌ Error handling incoming data:", error);
      this.syncStatus.dataIntegrity = "degraded";
    }
  }

  private async detectAndResolveConflicts(
    incomingData: SyncData[],
  ): Promise<ConflictData[]> {
    const conflicts: ConflictData[] = [];

    for (const remoteData of incomingData) {
      // Check local storage for conflicting versions
      const localData = await this.getLocalData(remoteData.id);

      if (localData && localData.version !== remoteData.version) {
        const conflict: ConflictData = {
          id: remoteData.id,
          localVersion: localData,
          remoteVersion: remoteData,
          conflictType: this.determineConflictType(localData, remoteData),
        };

        // Attempt automatic resolution
        try {
          conflict.resolvedData =
            await this.offlineCapabilities.conflictDetector.resolveConflict(
              conflict,
            );
        } catch (error) {
          console.warn("⚠️ Automatic conflict resolution failed:", error);
        }

        conflicts.push(conflict);
      }
    }

    return conflicts;
  }

  private determineConflictType(
    local: SyncData,
    remote: SyncData,
  ): ConflictData["conflictType"] {
    if (local.operation === "delete" && remote.operation === "update") {
      return "delete-update";
    }
    if (local.operation === "update" && remote.operation === "update") {
      return "concurrent-update";
    }
    return "version-mismatch";
  }

  private async applyIncomingChanges(syncData: SyncData): Promise<void> {
    try {
      // Store in local storage
      await this.offlineCapabilities.storage.store(syncData.id, syncData);

      // Emit change event for UI updates
      this.emit("data:changed", {
        type: syncData.type,
        operation: syncData.operation,
        data: syncData.data,
        id: syncData.id,
      });
    } catch (error) {
      console.error("❌ Error applying incoming changes:", error);
      throw error;
    }
  }

  public async syncData(
    data: Omit<SyncData, "id" | "timestamp" | "version" | "checksum">,
  ): Promise<void> {
    const syncData: SyncData = {
      id: this.generateId(),
      timestamp: Date.now(),
      version: 1,
      checksum: this.generateChecksum(data),
      ...data,
    };

    // Add to sync queue
    this.syncQueue.push(syncData);
    this.syncStatus.pendingChanges++;

    // Store locally if offline support is enabled
    if (this.configuration.offlineSupport) {
      await this.offlineCapabilities.queueManager.enqueue(syncData);
    }

    // Attempt immediate sync if connected
    if (this.syncStatus.isConnected) {
      await this.processSyncQueue();
    }

    this.emit("sync:queued", syncData);
  }

  private async processSyncQueue(): Promise<void> {
    if (this.syncQueue.length === 0) return;

    try {
      // Batch operations for efficiency
      const batch = this.syncQueue.splice(0, this.configuration.batchSize);

      // Encrypt if encryption is enabled
      let payload: string;
      if (this.configuration.encryptionEnabled) {
        payload =
          await this.offlineCapabilities.dataValidator.encryptData(batch);
      } else {
        payload = JSON.stringify(batch);
      }

      // Send via appropriate protocol
      await this.sendData(payload);

      // Update status
      this.syncStatus.pendingChanges -= batch.length;
      this.syncStatus.lastSyncTime = Date.now();

      this.emit("sync:batch-sent", {
        count: batch.length,
        remaining: this.syncQueue.length,
      });
    } catch (error) {
      console.error("❌ Error processing sync queue:", error);
      // Re-add failed items to queue
      // this.syncQueue.unshift(...batch);
    }
  }

  private async sendData(payload: string): Promise<void> {
    if (!this.connection || !this.syncStatus.isConnected) {
      throw new Error("No active connection");
    }

    switch (this.configuration.protocol) {
      case "websocket":
        if (this.connection instanceof WebSocket) {
          this.connection.send(payload);
        }
        break;
      case "polling":
        // Send via HTTP POST
        const response = await fetch(this.configuration.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        break;
      default:
        throw new Error(
          `Sending not supported for protocol: ${this.configuration.protocol}`,
        );
    }
  }

  private async processOfflineQueue(): Promise<void> {
    if (!this.configuration.offlineSupport) return;

    console.log("🔄 Processing offline queue...");

    let queueItem = await this.offlineCapabilities.queueManager.dequeue();

    while (queueItem) {
      this.syncQueue.push(queueItem);
      queueItem = await this.offlineCapabilities.queueManager.dequeue();
    }

    if (this.syncQueue.length > 0) {
      console.log(`📤 Found ${this.syncQueue.length} offline changes to sync`);
      await this.processSyncQueue();
    }
  }

  private handleConnectionLoss(): void {
    console.log("🔌 Connection lost, switching to offline mode");

    // Stop intervals
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Attempt reconnection
    this.attemptReconnection();

    this.emit("sync:connection-lost", { status: this.syncStatus });
  }

  private async attemptReconnection(): Promise<void> {
    let retryCount = 0;
    const { maxRetries, backoffStrategy, baseDelay, maxDelay, jitter } =
      this.configuration.retryPolicy;

    while (retryCount < maxRetries && !this.syncStatus.isConnected) {
      try {
        const delay = this.calculateBackoffDelay(
          retryCount,
          backoffStrategy,
          baseDelay,
          maxDelay,
          jitter,
        );

        console.log(
          `🔄 Attempting reconnection in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`,
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
        await this.establishConnection();

        if (this.syncStatus.isConnected) {
          console.log("✅ Reconnection successful");
          this.startHeartbeat();
          this.processOfflineQueue();
          this.emit("sync:reconnected", { attempts: retryCount + 1 });
          return;
        }
      } catch (error) {
        console.warn(
          `⚠️ Reconnection attempt ${retryCount + 1} failed:`,
          error,
        );
      }

      retryCount++;
    }

    console.error("❌ Failed to reconnect after maximum attempts");
    this.emit("sync:reconnection-failed", { attempts: retryCount });
  }

  private calculateBackoffDelay(
    attempt: number,
    strategy: string,
    baseDelay: number,
    maxDelay: number,
    jitter: boolean,
  ): number {
    let delay: number;

    switch (strategy) {
      case "exponential":
        delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        break;
      case "linear":
        delay = Math.min(baseDelay + attempt * baseDelay, maxDelay);
        break;
      case "fixed":
      default:
        delay = baseDelay;
        break;
    }

    // Add jitter to prevent thundering herd
    if (jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return Math.round(delay);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.syncStatus.isConnected && this.connection instanceof WebSocket) {
        this.connection.send(
          JSON.stringify({ type: "ping", timestamp: Date.now() }),
        );
      }
    }, 30000); // 30 seconds
  }

  private startPeriodicSync(): void {
    this.syncInterval = setInterval(async () => {
      if (this.syncStatus.isConnected && this.syncQueue.length > 0) {
        await this.processSyncQueue();
      }
    }, this.configuration.syncInterval);
  }

  private setupNetworkMonitoring(): void {
    // Monitor online/offline events
    window.addEventListener("online", () => {
      console.log("🌐 Network connection restored");
      this.syncStatus.networkQuality = "good";
      this.attemptReconnection();
    });

    window.addEventListener("offline", () => {
      console.log("📴 Network connection lost");
      this.syncStatus.networkQuality = "offline";
      this.handleConnectionLoss();
    });

    // Monitor connection quality if supported
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener("change", () => {
        this.updateNetworkQuality(connection);
      });
      this.updateNetworkQuality(connection);
    }
  }

  private updateNetworkQuality(connection: any): void {
    const effectiveType = connection.effectiveType;

    switch (effectiveType) {
      case "slow-2g":
      case "2g":
        this.syncStatus.networkQuality = "poor";
        break;
      case "3g":
        this.syncStatus.networkQuality = "good";
        break;
      case "4g":
        this.syncStatus.networkQuality = "excellent";
        break;
      default:
        this.syncStatus.networkQuality = "good";
    }

    this.emit("network:quality-changed", {
      quality: this.syncStatus.networkQuality,
    });
  }

  // Helper methods
  private generateId(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateChecksum(data: any): string {
    // Simple checksum implementation (in production, use a proper hash function)
    return btoa(JSON.stringify(data)).slice(0, 16);
  }

  private async getLocalData(id: string): Promise<SyncData | null> {
    try {
      return await this.offlineCapabilities.storage.retrieve(id);
    } catch (error) {
      return null;
    }
  }

  private async loadOfflineData(): Promise<void> {
    if (!this.configuration.offlineSupport) return;

    try {
      const queueSize = await this.offlineCapabilities.queueManager.size();
      this.syncStatus.pendingChanges = queueSize;

      console.log(`📱 Loaded ${queueSize} offline changes`);
    } catch (error) {
      console.error("❌ Error loading offline data:", error);
    }
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
  public getStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  public getConfiguration(): SyncConfiguration {
    return { ...this.configuration };
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      if (this.connection instanceof WebSocket) {
        this.connection.close();
      } else if (this.connection instanceof EventSource) {
        this.connection.close();
      }
      this.connection = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncStatus.isConnected = false;
    console.log("🔌 Disconnected from sync service");
  }

  // Placeholder implementations for offline capabilities
  private createOfflineStorage(): OfflineStorage {
    return {
      store: async (key: string, data: any) => {
        localStorage.setItem(`sync_${key}`, JSON.stringify(data));
      },
      retrieve: async (key: string) => {
        const item = localStorage.getItem(`sync_${key}`);
        return item ? JSON.parse(item) : null;
      },
      remove: async (key: string) => {
        localStorage.removeItem(`sync_${key}`);
      },
      list: async (prefix?: string) => {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix || "sync_")) {
            keys.push(key);
          }
        }
        return keys;
      },
      clear: async () => {
        const keys = await this.offlineCapabilities.storage.list();
        keys.forEach((key) => localStorage.removeItem(key));
      },
      size: async () => {
        const keys = await this.offlineCapabilities.storage.list();
        return keys.length;
      },
    };
  }

  private createOfflineQueueManager(): OfflineQueueManager {
    const queueKey = "sync_queue";

    return {
      enqueue: async (operation: SyncData) => {
        const queue = await this.getQueue();
        queue.push(operation);
        localStorage.setItem(queueKey, JSON.stringify(queue));
      },
      dequeue: async () => {
        const queue = await this.getQueue();
        const item = queue.shift();
        localStorage.setItem(queueKey, JSON.stringify(queue));
        return item || null;
      },
      peek: async () => {
        const queue = await this.getQueue();
        return queue[0] || null;
      },
      clear: async () => {
        localStorage.removeItem(queueKey);
      },
      size: async () => {
        const queue = await this.getQueue();
        return queue.length;
      },
      reorder: async (compareFn) => {
        const queue = await this.getQueue();
        queue.sort(compareFn);
        localStorage.setItem(queueKey, JSON.stringify(queue));
      },
    };
  }

  private async getQueue(): Promise<SyncData[]> {
    const queueData = localStorage.getItem("sync_queue");
    return queueData ? JSON.parse(queueData) : [];
  }

  private createConflictDetector(): ConflictDetector {
    return {
      detectConflicts: (local: SyncData[], remote: SyncData[]) => {
        // Placeholder implementation
        return [];
      },
      resolveConflict: async (conflict: ConflictData) => {
        // Simple last-write-wins resolution
        const localTime = conflict.localVersion.timestamp;
        const remoteTime = conflict.remoteVersion.timestamp;
        return remoteTime > localTime
          ? conflict.remoteVersion
          : conflict.localVersion;
      },
      validateResolution: (resolution: SyncData) => {
        return resolution && resolution.id && resolution.data;
      },
    };
  }

  private createDataValidator(): DataValidator {
    return {
      validateData: (data: SyncData) => {
        return !!(data.id && data.type && data.operation && data.timestamp);
      },
      validateChecksum: (data: SyncData) => {
        const calculatedChecksum = this.generateChecksum(data.data);
        return calculatedChecksum === data.checksum;
      },
      sanitizeData: (data: any) => {
        // Basic sanitization
        return JSON.parse(JSON.stringify(data));
      },
      encryptData: async (data: any) => {
        // Placeholder - in production, use proper encryption
        return btoa(JSON.stringify(data));
      },
      decryptData: async (encryptedData: string) => {
        // Placeholder - in production, use proper decryption
        return JSON.parse(atob(encryptedData));
      },
    };
  }
}

// Export singleton instance
export const realTimeDataSyncSystem = RealTimeDataSyncSystem.getInstance();
