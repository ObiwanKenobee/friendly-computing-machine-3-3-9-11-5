/**
 * QuantumVest Enterprise WebSocket Client
 * Advanced real-time communication with auto-reconnection, heartbeat, and message queuing
 */

export interface WebSocketMessage {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  userId?: string;
  organizationId?: string;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  heartbeatInterval?: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  timeout?: number;
  debug?: boolean;
}

export interface Subscription {
  id: string;
  channel: string;
  callback: (message: WebSocketMessage) => void;
  filter?: (message: WebSocketMessage) => boolean;
}

export interface WebSocketStats {
  connected: boolean;
  reconnectAttempts: number;
  messagesSent: number;
  messagesReceived: number;
  lastHeartbeat: Date | null;
  latency: number;
  uptime: number;
  connectionTime: Date | null;
}

class QuantumWebSocketClient {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private subscriptions: Map<string, Subscription> = new Map();
  private messageQueue: WebSocketMessage[] = [];
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private stats: WebSocketStats;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private isReconnecting = false;
  private connectionId: string | null = null;

  constructor(config: WebSocketConfig) {
    this.config = {
      protocols: [],
      heartbeatInterval: 30000, // 30 seconds
      reconnectInterval: 5000, // 5 seconds
      maxReconnectAttempts: 10,
      timeout: 10000, // 10 seconds
      debug: false,
      ...config,
    };

    this.stats = {
      connected: false,
      reconnectAttempts: 0,
      messagesSent: 0,
      messagesReceived: 0,
      lastHeartbeat: null,
      latency: 0,
      uptime: 0,
      connectionTime: null,
    };

    this.setupEventListeners();
  }

  // Connection management
  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.log("Already connected");
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        this.log("Connecting to WebSocket...");

        // Add auth token to URL if available
        const token = this.getAuthToken();
        const url = token
          ? `${this.config.url}?token=${encodeURIComponent(token)}`
          : this.config.url;

        this.ws = new WebSocket(url, this.config.protocols);

        const timeout = setTimeout(() => {
          this.ws?.close();
          reject(new Error("Connection timeout"));
        }, this.config.timeout);

        this.ws.onopen = () => {
          clearTimeout(timeout);
          this.handleOpen();
          resolve();
        };

        this.ws.onclose = (event) => {
          clearTimeout(timeout);
          this.handleClose(event);
        };

        this.ws.onerror = (error) => {
          clearTimeout(timeout);
          this.handleError(error);
          reject(error);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.log("Disconnecting from WebSocket...");

    this.isReconnecting = false;
    this.clearTimers();

    if (this.ws) {
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }

    this.updateStats({ connected: false, connectionTime: null });
    this.emit("disconnect", { reason: "client_disconnect" });
  }

  // Message handling
  send(
    type: string,
    data: any,
    priority: "low" | "normal" | "high" = "normal",
  ): string {
    const message: WebSocketMessage = {
      id: this.generateMessageId(),
      type,
      data,
      timestamp: Date.now(),
      userId: this.getCurrentUserId(),
      organizationId: this.getCurrentOrganizationId(),
    };

    if (this.isConnected()) {
      this.sendMessage(message);
    } else {
      // Queue message based on priority
      if (priority === "high") {
        this.messageQueue.unshift(message);
      } else {
        this.messageQueue.push(message);
      }

      this.log(`Message queued (${priority} priority): ${type}`);

      // Try to reconnect if not already trying
      if (!this.isReconnecting) {
        this.reconnect();
      }
    }

    return message.id;
  }

  private sendMessage(message: WebSocketMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }

    try {
      this.ws.send(JSON.stringify(message));
      this.updateStats({ messagesSent: this.stats.messagesSent + 1 });
      this.log(`Message sent: ${message.type}`, message);
    } catch (error) {
      this.log(`Failed to send message: ${error}`, "error");
      throw error;
    }
  }

  // Subscription management
  subscribe(
    channel: string,
    callback: (message: WebSocketMessage) => void,
    filter?: (message: WebSocketMessage) => boolean,
  ): string {
    const subscription: Subscription = {
      id: this.generateSubscriptionId(),
      channel,
      callback,
      filter,
    };

    this.subscriptions.set(subscription.id, subscription);

    // Send subscription message to server
    this.send("subscribe", { channel }, "high");

    this.log(`Subscribed to channel: ${channel}`);
    return subscription.id;
  }

  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return;

    this.subscriptions.delete(subscriptionId);

    // Check if this was the last subscription to this channel
    const hasOtherSubscriptions = Array.from(this.subscriptions.values()).some(
      (sub) => sub.channel === subscription.channel,
    );

    if (!hasOtherSubscriptions) {
      this.send("unsubscribe", { channel: subscription.channel }, "high");
    }

    this.log(`Unsubscribed from channel: ${subscription.channel}`);
  }

  // Event listeners
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        this.log(`Error in event listener for ${event}: ${error}`, "error");
      }
    });
  }

  // Connection state
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): string {
    if (!this.ws) return "disconnected";

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      case WebSocket.CLOSING:
        return "closing";
      case WebSocket.CLOSED:
        return "closed";
      default:
        return "unknown";
    }
  }

  getStats(): WebSocketStats {
    return {
      ...this.stats,
      uptime: this.stats.connectionTime
        ? Date.now() - this.stats.connectionTime.getTime()
        : 0,
    };
  }

  // Event handlers
  private handleOpen(): void {
    this.log("WebSocket connected");

    this.isReconnecting = false;
    this.connectionId = this.generateConnectionId();

    this.updateStats({
      connected: true,
      reconnectAttempts: 0,
      connectionTime: new Date(),
    });

    this.startHeartbeat();
    this.processMessageQueue();
    this.resubscribeChannels();

    this.emit("connect", { connectionId: this.connectionId });
  }

  private handleClose(event: CloseEvent): void {
    this.log(`WebSocket closed: ${event.code} - ${event.reason}`);

    this.clearTimers();
    this.updateStats({
      connected: false,
      lastHeartbeat: null,
      connectionTime: null,
    });

    this.emit("disconnect", {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
    });

    // Auto-reconnect unless it was a clean close
    if (!event.wasClean && event.code !== 1000) {
      this.reconnect();
    }
  }

  private handleError(error: Event): void {
    this.log(`WebSocket error: ${error}`, "error");
    this.emit("error", error);
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.updateStats({ messagesReceived: this.stats.messagesReceived + 1 });

      this.log(`Message received: ${message.type}`, message);

      // Handle system messages
      if (message.type === "pong") {
        this.handlePong(message);
        return;
      }

      // Route message to subscribers
      this.routeMessage(message);

      // Emit global message event
      this.emit("message", message);
    } catch (error) {
      this.log(`Failed to parse message: ${error}`, "error");
    }
  }

  private routeMessage(message: WebSocketMessage): void {
    this.subscriptions.forEach((subscription) => {
      // Check if message matches subscription filter
      if (subscription.filter && !subscription.filter(message)) {
        return;
      }

      try {
        subscription.callback(message);
      } catch (error) {
        this.log(`Error in subscription callback: ${error}`, "error");
      }
    });
  }

  // Heartbeat mechanism
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        const pingTime = Date.now();
        this.send("ping", { timestamp: pingTime }, "high");
      }
    }, this.config.heartbeatInterval);
  }

  private handlePong(message: WebSocketMessage): void {
    const now = Date.now();
    const pingTime = message.data?.timestamp || now;
    const latency = now - pingTime;

    this.updateStats({
      lastHeartbeat: new Date(),
      latency,
    });

    this.log(`Heartbeat: ${latency}ms latency`);
  }

  // Reconnection logic
  private async reconnect(): Promise<void> {
    if (
      this.isReconnecting ||
      this.stats.reconnectAttempts >= this.config.maxReconnectAttempts
    ) {
      return;
    }

    this.isReconnecting = true;
    this.updateStats({ reconnectAttempts: this.stats.reconnectAttempts + 1 });

    this.log(`Reconnecting... (attempt ${this.stats.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        this.log(`Reconnection failed: ${error}`, "error");

        if (this.stats.reconnectAttempts < this.config.maxReconnectAttempts) {
          this.reconnect();
        } else {
          this.log("Max reconnection attempts reached", "error");
          this.emit("maxReconnectAttemptsReached", {
            attempts: this.stats.reconnectAttempts,
          });
        }
      }
    }, this.config.reconnectInterval);
  }

  // Utility methods
  private processMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  private resubscribeChannels(): void {
    const channels = new Set(
      Array.from(this.subscriptions.values()).map((sub) => sub.channel),
    );

    channels.forEach((channel) => {
      this.send("subscribe", { channel }, "high");
    });
  }

  private clearTimers(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private updateStats(updates: Partial<WebSocketStats>): void {
    this.stats = { ...this.stats, ...updates };
    this.emit("statsUpdate", this.stats);
  }

  private log(
    message: string,
    level: "info" | "error" = "info",
    data?: any,
  ): void {
    if (!this.config.debug) return;

    const timestamp = new Date().toISOString();
    const logMessage = `[WebSocket ${timestamp}] ${message}`;

    if (level === "error") {
      console.error(logMessage, data);
    } else {
      console.log(logMessage, data);
    }
  }

  // Helper methods
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getAuthToken(): string | null {
    return (
      localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    );
  }

  private getCurrentUserId(): string | undefined {
    // Get from auth store or local storage
    try {
      const authData = localStorage.getItem("quantumvest-auth");
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.state?.user?.id;
      }
    } catch {
      // Ignore parsing errors
    }
    return undefined;
  }

  private getCurrentOrganizationId(): string | undefined {
    try {
      const authData = localStorage.getItem("quantumvest-auth");
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.state?.user?.organization_id;
      }
    } catch {
      // Ignore parsing errors
    }
    return undefined;
  }
}

// Channel-specific utilities
export class ChannelManager {
  private client: QuantumWebSocketClient;

  constructor(client: QuantumWebSocketClient) {
    this.client = client;
  }

  // Real-time notifications
  subscribeToNotifications(callback: (notification: any) => void): string {
    return this.client.subscribe(
      "notifications",
      callback,
      (message) => message.type === "notification",
    );
  }

  // User presence
  subscribeToPresence(callback: (presence: any) => void): string {
    return this.client.subscribe(
      "presence",
      callback,
      (message) => message.type === "presence_update",
    );
  }

  // Analytics events
  subscribeToAnalytics(callback: (event: any) => void): string {
    return this.client.subscribe(
      "analytics",
      callback,
      (message) => message.type === "analytics_event",
    );
  }

  // Security alerts
  subscribeToSecurityAlerts(callback: (alert: any) => void): string {
    return this.client.subscribe(
      "security",
      callback,
      (message) => message.type === "security_alert",
    );
  }

  // System status
  subscribeToSystemStatus(callback: (status: any) => void): string {
    return this.client.subscribe(
      "system",
      callback,
      (message) => message.type === "system_status",
    );
  }

  // Organization updates
  subscribeToOrganizationUpdates(
    organizationId: string,
    callback: (update: any) => void,
  ): string {
    return this.client.subscribe(
      `org:${organizationId}`,
      callback,
      (message) => message.type === "organization_update",
    );
  }

  // Chat/messaging
  subscribeToChat(roomId: string, callback: (message: any) => void): string {
    return this.client.subscribe(
      `chat:${roomId}`,
      callback,
      (message) => message.type === "chat_message",
    );
  }

  sendChatMessage(roomId: string, content: string, metadata?: any): void {
    this.client.send("chat_message", {
      roomId,
      content,
      metadata,
    });
  }

  // File sharing
  subscribeToFileUpdates(callback: (update: any) => void): string {
    return this.client.subscribe(
      "files",
      callback,
      (message) => message.type === "file_update",
    );
  }

  // Collaborative editing
  subscribeToDocumentUpdates(
    documentId: string,
    callback: (update: any) => void,
  ): string {
    return this.client.subscribe(
      `doc:${documentId}`,
      callback,
      (message) => message.type === "document_update",
    );
  }

  sendDocumentOperation(documentId: string, operation: any): void {
    this.client.send("document_operation", {
      documentId,
      operation,
    });
  }
}

// Global WebSocket instance
export const createWebSocketClient = (
  config: WebSocketConfig,
): QuantumWebSocketClient => {
  return new QuantumWebSocketClient(config);
};

// React hooks for WebSocket
export const useWebSocket = (
  url: string,
  options: Partial<WebSocketConfig> = {},
) => {
  const [client, setClient] = React.useState<QuantumWebSocketClient | null>(
    null,
  );
  const [isConnected, setIsConnected] = React.useState(false);
  const [stats, setStats] = React.useState<WebSocketStats | null>(null);

  React.useEffect(() => {
    const wsClient = new QuantumWebSocketClient({ url, ...options });

    const unsubscribeConnect = wsClient.on("connect", () =>
      setIsConnected(true),
    );
    const unsubscribeDisconnect = wsClient.on("disconnect", () =>
      setIsConnected(false),
    );
    const unsubscribeStats = wsClient.on("statsUpdate", setStats);

    wsClient.connect().catch(console.error);
    setClient(wsClient);

    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeStats();
      wsClient.disconnect();
    };
  }, [url]);

  return {
    client,
    isConnected,
    stats,
    subscribe: client?.subscribe.bind(client),
    send: client?.send.bind(client),
    on: client?.on.bind(client),
  };
};

export const useWebSocketSubscription = (
  client: QuantumWebSocketClient | null,
  channel: string,
  callback: (message: WebSocketMessage) => void,
  filter?: (message: WebSocketMessage) => boolean,
) => {
  React.useEffect(() => {
    if (!client) return;

    const subscriptionId = client.subscribe(channel, callback, filter);

    return () => {
      client.unsubscribe(subscriptionId);
    };
  }, [client, channel]);
};

// Export types and main class
export { QuantumWebSocketClient, ChannelManager };
export type { WebSocketMessage, WebSocketConfig, Subscription, WebSocketStats };
