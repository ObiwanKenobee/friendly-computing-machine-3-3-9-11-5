import { singletonPattern } from "../utils/singletonPattern";

export interface PushNotification {
  id: string;
  userId: string;
  type:
    | "vault_update"
    | "price_alert"
    | "yield_milestone"
    | "ecosystem_alert"
    | "governance_vote"
    | "security_alert"
    | "educational"
    | "promotional";
  title: string;
  body: string;
  data: Record<string, any>;
  priority: "low" | "normal" | "high" | "urgent";
  category: string;
  badge?: number;
  sound?: string;
  image?: string;
  actions?: NotificationAction[];
  scheduledFor?: Date;
  expiresAt?: Date;
  status: "pending" | "sent" | "delivered" | "opened" | "failed" | "expired";
  createdAt: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  deviceTokens: string[];
  channels: NotificationChannel[];
  personalization: PersonalizationData;
}

export interface NotificationAction {
  id: string;
  title: string;
  type: "foreground" | "background" | "destructive";
  icon?: string;
  input?: boolean;
  inputPlaceholder?: string;
}

export interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  importance: "min" | "low" | "default" | "high" | "max";
  enableVibration: boolean;
  enableLights: boolean;
  lightColor?: string;
  soundUri?: string;
  groupId?: string;
}

export interface PersonalizationData {
  userPreferences: UserNotificationPreferences;
  timeZone: string;
  language: string;
  personalizedContent: Record<string, any>;
  behaviorBasedTiming: boolean;
  optimalDeliveryTime?: Date;
}

export interface UserNotificationPreferences {
  userId: string;
  enabledTypes: string[];
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
  frequency: {
    [key: string]: "immediate" | "hourly" | "daily" | "weekly" | "never";
  };
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  customization: {
    sound: string;
    vibration: boolean;
    lights: boolean;
    badge: boolean;
  };
  geofencing: {
    enabled: boolean;
    regions: GeofenceRegion[];
  };
}

export interface GeofenceRegion {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // meters
  triggers: "enter" | "exit" | "both";
  notificationType: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, any>;
  variables: string[];
  localization: Record<
    string,
    {
      title: string;
      body: string;
    }
  >;
  conditions: TemplateCondition[];
  active: boolean;
}

export interface TemplateCondition {
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "greater_than"
    | "less_than"
    | "contains"
    | "in_range";
  value: any;
}

export interface NotificationSchedule {
  id: string;
  userId?: string; // If null, applies to all users
  templateId: string;
  trigger: ScheduleTrigger;
  frequency: "once" | "daily" | "weekly" | "monthly" | "custom";
  customCron?: string;
  startDate: Date;
  endDate?: Date;
  maxOccurrences?: number;
  currentOccurrences: number;
  active: boolean;
  lastExecuted?: Date;
  nextExecution: Date;
}

export interface ScheduleTrigger {
  type: "time_based" | "event_based" | "threshold_based" | "behavioral";
  conditions: Record<string, any>;
  data: Record<string, any>;
}

export interface DeliveryReport {
  notificationId: string;
  deviceToken: string;
  platform: "ios" | "android" | "web" | "desktop";
  status: "sent" | "delivered" | "failed" | "bounced";
  timestamp: Date;
  error?: string;
  responseTime: number; // ms
  retryCount: number;
}

export interface NotificationAnalytics {
  timeRange: { start: Date; end: Date };
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalFailed: number;
  deliveryRate: number; // percentage
  openRate: number; // percentage
  clickThroughRate: number; // percentage
  byType: Record<
    string,
    {
      sent: number;
      delivered: number;
      opened: number;
      conversionRate: number;
    }
  >;
  byPlatform: Record<
    string,
    {
      sent: number;
      delivered: number;
      failed: number;
    }
  >;
  byTimeOfDay: Record<string, number>;
  engagementScore: number;
  userRetention: number;
}

export interface NotificationCampaign {
  id: string;
  name: string;
  description: string;
  templateId: string;
  targetAudience: AudienceSegment;
  timing: CampaignTiming;
  budget?: CampaignBudget;
  status:
    | "draft"
    | "scheduled"
    | "running"
    | "paused"
    | "completed"
    | "cancelled";
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  metrics: CampaignMetrics;
}

export interface AudienceSegment {
  id: string;
  name: string;
  criteria: SegmentCriteria[];
  estimatedSize: number;
  actualSize?: number;
  userIds?: string[];
}

export interface SegmentCriteria {
  field: string;
  operator: string;
  value: any;
  logicalOperator?: "AND" | "OR";
}

export interface CampaignTiming {
  type: "immediate" | "scheduled" | "optimal" | "recurring";
  scheduledDate?: Date;
  timezone?: string;
  recurringPattern?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    daysOfWeek?: number[];
    time: string;
  };
}

export interface CampaignBudget {
  maxNotifications: number;
  maxCostPerNotification: number;
  totalBudget: number;
  spentSoFar: number;
}

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  unsubscribed: number;
  cost: number;
  revenue: number;
  roi: number;
}

class PushNotificationService {
  private notifications: Map<string, PushNotification> = new Map();
  private userPreferences: Map<string, UserNotificationPreferences> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();
  private schedules: Map<string, NotificationSchedule> = new Map();
  private channels: Map<string, NotificationChannel> = new Map();
  private deliveryReports: Map<string, DeliveryReport[]> = new Map();
  private campaigns: Map<string, NotificationCampaign> = new Map();
  private audienceSegments: Map<string, AudienceSegment> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await this.setupNotificationChannels();
    await this.createDefaultTemplates();
    await this.initializeUserPreferences();
    await this.setupDefaultSchedules();
    await this.createAudienceSegments();

    this.startNotificationProcessor();
    this.startScheduleProcessor();
    this.startAnalyticsProcessor();
    this.startDeliveryTracking();

    this.isInitialized = true;
    console.log(
      "Push Notification Service initialized with real-time user engagement",
    );
  }

  private async setupNotificationChannels(): Promise<void> {
    const channels: NotificationChannel[] = [
      {
        id: "vault_updates",
        name: "Vault Updates",
        description: "Notifications about vault performance and changes",
        importance: "high",
        enableVibration: true,
        enableLights: true,
        lightColor: "#00FF00",
        soundUri: "vault_update.mp3",
      },
      {
        id: "price_alerts",
        name: "Price Alerts",
        description: "Notifications about significant price movements",
        importance: "high",
        enableVibration: true,
        enableLights: true,
        lightColor: "#FFD700",
        soundUri: "price_alert.mp3",
      },
      {
        id: "ecosystem_alerts",
        name: "Ecosystem Alerts",
        description: "Critical ecosystem health and conservation alerts",
        importance: "max",
        enableVibration: true,
        enableLights: true,
        lightColor: "#FF0000",
        soundUri: "ecosystem_alert.mp3",
      },
      {
        id: "governance",
        name: "Governance",
        description: "DAO voting and governance notifications",
        importance: "default",
        enableVibration: false,
        enableLights: true,
        lightColor: "#0080FF",
        soundUri: "governance.mp3",
      },
      {
        id: "educational",
        name: "Educational",
        description: "Tips, insights, and educational content",
        importance: "low",
        enableVibration: false,
        enableLights: false,
        soundUri: "default.mp3",
      },
      {
        id: "security",
        name: "Security Alerts",
        description: "Account security and fraud prevention alerts",
        importance: "max",
        enableVibration: true,
        enableLights: true,
        lightColor: "#FF0000",
        soundUri: "security_alert.mp3",
      },
    ];

    for (const channel of channels) {
      this.channels.set(channel.id, channel);
    }
  }

  private async createDefaultTemplates(): Promise<void> {
    const templates: NotificationTemplate[] = [
      {
        id: "vault_yield_milestone",
        name: "Vault Yield Milestone",
        type: "vault_update",
        title: "Milestone Reached!",
        body: "Your {{vaultName}} has reached {{percentage}}% of your yield target! Current yield: {{currentYield}}%",
        data: {
          action: "open_vault",
          vaultId: "{{vaultId}}",
        },
        variables: ["vaultName", "percentage", "currentYield", "vaultId"],
        localization: {
          es: {
            title: "¡Hito Alcanzado!",
            body: "Tu {{vaultName}} ha alcanzado el {{percentage}}% de tu objetivo de rendimiento! Rendimiento actual: {{currentYield}}%",
          },
          pt: {
            title: "Marco Alcançado!",
            body: "Seu {{vaultName}} atingiu {{percentage}}% da sua meta de rendimento! Rendimento atual: {{currentYield}}%",
          },
        },
        conditions: [
          {
            field: "yieldPercentage",
            operator: "greater_than",
            value: 75,
          },
        ],
        active: true,
      },
      {
        id: "ecosystem_threat",
        name: "Ecosystem Threat Alert",
        type: "ecosystem_alert",
        title: "Ecosystem Alert: {{threatType}}",
        body: "Critical threat detected in {{ecosystemName}}: {{description}}. Immediate action may be required.",
        data: {
          action: "view_ecosystem_details",
          ecosystemId: "{{ecosystemId}}",
          threatLevel: "{{threatLevel}}",
        },
        variables: [
          "threatType",
          "ecosystemName",
          "description",
          "ecosystemId",
          "threatLevel",
        ],
        localization: {
          es: {
            title: "Alerta del Ecosistema: {{threatType}}",
            body: "Amenaza crítica detectada en {{ecosystemName}}: {{description}}. Puede requerirse acción inmediata.",
          },
        },
        conditions: [
          {
            field: "threatLevel",
            operator: "equals",
            value: "critical",
          },
        ],
        active: true,
      },
      {
        id: "governance_vote_reminder",
        name: "Governance Vote Reminder",
        type: "governance_vote",
        title: "Vote Reminder: {{proposalTitle}}",
        body: 'Don\'t forget to vote on "{{proposalTitle}}". Voting ends in {{timeRemaining}}.',
        data: {
          action: "open_governance",
          proposalId: "{{proposalId}}",
        },
        variables: ["proposalTitle", "timeRemaining", "proposalId"],
        localization: {
          es: {
            title: "Recordatorio de Voto: {{proposalTitle}}",
            body: 'No olvides votar en "{{proposalTitle}}". La votación termina en {{timeRemaining}}.',
          },
        },
        conditions: [],
        active: true,
      },
      {
        id: "educational_tip",
        name: "Daily Educational Tip",
        type: "educational",
        title: "Conservation Tip of the Day",
        body: "{{tipContent}}",
        data: {
          action: "open_education",
          tipId: "{{tipId}}",
        },
        variables: ["tipContent", "tipId"],
        localization: {
          es: {
            title: "Consejo de Conservación del Día",
            body: "{{tipContent}}",
          },
        },
        conditions: [],
        active: true,
      },
    ];

    for (const template of templates) {
      this.templates.set(template.id, template);
    }
  }

  private async initializeUserPreferences(): Promise<void> {
    // Sample user preferences
    const samplePreferences: UserNotificationPreferences = {
      userId: "user-sample",
      enabledTypes: [
        "vault_update",
        "price_alert",
        "ecosystem_alert",
        "governance_vote",
      ],
      quietHours: {
        enabled: true,
        start: "22:00",
        end: "07:00",
      },
      frequency: {
        vault_update: "immediate",
        price_alert: "immediate",
        ecosystem_alert: "immediate",
        governance_vote: "daily",
        educational: "weekly",
      },
      channels: {
        push: true,
        email: true,
        sms: false,
        inApp: true,
      },
      customization: {
        sound: "default",
        vibration: true,
        lights: true,
        badge: true,
      },
      geofencing: {
        enabled: false,
        regions: [],
      },
    };

    this.userPreferences.set("user-sample", samplePreferences);
  }

  private async setupDefaultSchedules(): Promise<void> {
    const schedules: NotificationSchedule[] = [
      {
        id: "daily_educational_tip",
        templateId: "educational_tip",
        trigger: {
          type: "time_based",
          conditions: { time: "09:00" },
          data: {},
        },
        frequency: "daily",
        startDate: new Date(),
        maxOccurrences: 365,
        currentOccurrences: 0,
        active: true,
        nextExecution: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        id: "weekly_portfolio_summary",
        templateId: "portfolio_summary",
        trigger: {
          type: "time_based",
          conditions: { dayOfWeek: 1, time: "10:00" }, // Monday at 10 AM
          data: {},
        },
        frequency: "weekly",
        startDate: new Date(),
        currentOccurrences: 0,
        active: true,
        nextExecution: this.getNextWeekday(1, 10, 0), // Next Monday at 10:00
      },
    ];

    for (const schedule of schedules) {
      this.schedules.set(schedule.id, schedule);
    }
  }

  private async createAudienceSegments(): Promise<void> {
    const segments: AudienceSegment[] = [
      {
        id: "high_value_investors",
        name: "High Value Investors",
        criteria: [
          {
            field: "totalInvestment",
            operator: "greater_than",
            value: 50000,
          },
          {
            field: "accountAge",
            operator: "greater_than",
            value: 90,
            logicalOperator: "AND",
          },
        ],
        estimatedSize: 1250,
      },
      {
        id: "ecosystem_enthusiasts",
        name: "Ecosystem Enthusiasts",
        criteria: [
          {
            field: "ecosystemVaultCount",
            operator: "greater_than",
            value: 3,
          },
          {
            field: "conservationScore",
            operator: "greater_than",
            value: 80,
            logicalOperator: "AND",
          },
        ],
        estimatedSize: 3400,
      },
      {
        id: "new_users",
        name: "New Users",
        criteria: [
          {
            field: "accountAge",
            operator: "less_than",
            value: 7,
          },
        ],
        estimatedSize: 850,
      },
      {
        id: "inactive_users",
        name: "Inactive Users",
        criteria: [
          {
            field: "lastActivity",
            operator: "less_than",
            value: 30,
          },
        ],
        estimatedSize: 2100,
      },
    ];

    for (const segment of segments) {
      this.audienceSegments.set(segment.id, segment);
    }
  }

  // Background processors
  private startNotificationProcessor(): void {
    setInterval(() => {
      this.processNotificationQueue();
    }, 10000); // Every 10 seconds
  }

  private startScheduleProcessor(): void {
    setInterval(() => {
      this.processScheduledNotifications();
    }, 60000); // Every minute
  }

  private startAnalyticsProcessor(): void {
    setInterval(() => {
      this.updateAnalytics();
    }, 300000); // Every 5 minutes
  }

  private startDeliveryTracking(): void {
    setInterval(() => {
      this.trackDeliveryStatus();
    }, 30000); // Every 30 seconds
  }

  private async processNotificationQueue(): Promise<void> {
    const pendingNotifications = Array.from(this.notifications.values()).filter(
      (notification) => notification.status === "pending",
    );

    for (const notification of pendingNotifications) {
      await this.sendNotification(notification);
    }
  }

  private async sendNotification(
    notification: PushNotification,
  ): Promise<void> {
    // Check user preferences
    const userPrefs = this.userPreferences.get(notification.userId);
    if (!userPrefs || !this.shouldSendNotification(notification, userPrefs)) {
      notification.status = "failed";
      return;
    }

    // Check quiet hours
    if (this.isInQuietHours(userPrefs)) {
      // Reschedule for later
      notification.scheduledFor = this.getNextActiveTime(userPrefs);
      return;
    }

    // Apply personalization
    const personalizedNotification = await this.personalizeNotification(
      notification,
      userPrefs,
    );

    // Send to each device
    for (const deviceToken of personalizedNotification.deviceTokens) {
      await this.sendToDevice(personalizedNotification, deviceToken);
    }

    notification.status = "sent";
    notification.sentAt = new Date();
  }

  private shouldSendNotification(
    notification: PushNotification,
    userPrefs: UserNotificationPreferences,
  ): boolean {
    // Check if notification type is enabled
    if (!userPrefs.enabledTypes.includes(notification.type)) {
      return false;
    }

    // Check frequency settings
    const frequency = userPrefs.frequency[notification.type];
    if (frequency === "never") {
      return false;
    }

    // Check channels
    if (!userPrefs.channels.push) {
      return false;
    }

    return true;
  }

  private isInQuietHours(userPrefs: UserNotificationPreferences): boolean {
    if (!userPrefs.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const startTime = this.parseTime(userPrefs.quietHours.start);
    const endTime = this.parseTime(userPrefs.quietHours.end);

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  private getNextActiveTime(userPrefs: UserNotificationPreferences): Date {
    const now = new Date();
    const endTime = this.parseTime(userPrefs.quietHours.end);
    const nextActive = new Date(now);

    nextActive.setHours(Math.floor(endTime / 60), endTime % 60, 0, 0);

    if (nextActive <= now) {
      nextActive.setDate(nextActive.getDate() + 1);
    }

    return nextActive;
  }

  private async personalizeNotification(
    notification: PushNotification,
    userPrefs: UserNotificationPreferences,
  ): Promise<PushNotification> {
    const personalized = { ...notification };

    // Apply user's sound preference
    if (userPrefs.customization.sound !== "default") {
      personalized.sound = userPrefs.customization.sound;
    }

    // Apply language localization
    const template = this.templates.get(notification.type);
    if (template && template.localization[userPrefs.language || "en"]) {
      const localized = template.localization[userPrefs.language || "en"];
      personalized.title = this.interpolateTemplate(
        localized.title,
        notification.data,
      );
      personalized.body = this.interpolateTemplate(
        localized.body,
        notification.data,
      );
    }

    // Optimal timing based on user behavior
    if (
      notification.personalization.behaviorBasedTiming &&
      notification.personalization.optimalDeliveryTime
    ) {
      personalized.scheduledFor =
        notification.personalization.optimalDeliveryTime;
    }

    return personalized;
  }

  private interpolateTemplate(
    template: string,
    data: Record<string, any>,
  ): string {
    return template.replace(
      /\{\{(\w+)\}\}/g,
      (match, key) => data[key] || match,
    );
  }

  private async sendToDevice(
    notification: PushNotification,
    deviceToken: string,
  ): Promise<void> {
    const deliveryReport: DeliveryReport = {
      notificationId: notification.id,
      deviceToken,
      platform: this.detectPlatform(deviceToken),
      status: "sent",
      timestamp: new Date(),
      responseTime: 0,
      retryCount: 0,
    };

    const startTime = Date.now();

    try {
      // Simulate sending notification
      await this.simulateNotificationDelivery(deviceToken);

      deliveryReport.status = "delivered";
      deliveryReport.responseTime = Date.now() - startTime;

      // Simulate delivery confirmation
      setTimeout(
        () => {
          notification.status = "delivered";
          notification.deliveredAt = new Date();
        },
        1000 + Math.random() * 2000,
      );
    } catch (error) {
      deliveryReport.status = "failed";
      deliveryReport.error =
        error instanceof Error ? error.message : "Unknown error";
      deliveryReport.responseTime = Date.now() - startTime;
    }

    // Store delivery report
    const reports = this.deliveryReports.get(notification.id) || [];
    reports.push(deliveryReport);
    this.deliveryReports.set(notification.id, reports);
  }

  private detectPlatform(
    deviceToken: string,
  ): "ios" | "android" | "web" | "desktop" {
    // Simplified platform detection based on token format
    if (deviceToken.startsWith("ios-")) return "ios";
    if (deviceToken.startsWith("android-")) return "android";
    if (deviceToken.startsWith("web-")) return "web";
    return "desktop";
  }

  private async simulateNotificationDelivery(
    deviceToken: string,
  ): Promise<void> {
    // Simulate network delay and potential failures
    const delay = 500 + Math.random() * 2000; // 0.5-2.5 seconds
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Simulate 95% success rate
    if (Math.random() < 0.05) {
      throw new Error("Delivery failed");
    }
  }

  private async processScheduledNotifications(): Promise<void> {
    const now = new Date();

    for (const schedule of this.schedules.values()) {
      if (schedule.active && now >= schedule.nextExecution) {
        await this.executeSchedule(schedule);
      }
    }
  }

  private async executeSchedule(schedule: NotificationSchedule): Promise<void> {
    const template = this.templates.get(schedule.templateId);
    if (!template) return;

    // Determine target users
    const targetUsers = schedule.userId
      ? [schedule.userId]
      : this.getAllActiveUsers();

    for (const userId of targetUsers) {
      const notification = await this.createNotificationFromTemplate(
        template,
        userId,
        schedule.trigger.data,
      );
      if (notification) {
        this.notifications.set(notification.id, notification);
      }
    }

    // Update schedule
    schedule.currentOccurrences++;
    schedule.lastExecuted = new Date();
    schedule.nextExecution = this.calculateNextExecution(schedule);

    // Check if schedule should be deactivated
    if (
      schedule.maxOccurrences &&
      schedule.currentOccurrences >= schedule.maxOccurrences
    ) {
      schedule.active = false;
    }
    if (schedule.endDate && new Date() > schedule.endDate) {
      schedule.active = false;
    }
  }

  private getAllActiveUsers(): string[] {
    // Return all users with push notifications enabled
    return Array.from(this.userPreferences.keys()).filter((userId) => {
      const prefs = this.userPreferences.get(userId);
      return prefs?.channels.push;
    });
  }

  private async createNotificationFromTemplate(
    template: NotificationTemplate,
    userId: string,
    data: Record<string, any>,
  ): Promise<PushNotification | null> {
    const userPrefs = this.userPreferences.get(userId);
    if (!userPrefs) return null;

    // Check template conditions
    if (!this.evaluateTemplateConditions(template, data)) {
      return null;
    }

    const notification: PushNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: template.type as any,
      title: this.interpolateTemplate(template.title, data),
      body: this.interpolateTemplate(template.body, data),
      data: { ...template.data, ...data },
      priority: "normal",
      category: template.type,
      status: "pending",
      createdAt: new Date(),
      deviceTokens: this.getUserDeviceTokens(userId),
      channels: [this.channels.get(template.type)].filter(
        Boolean,
      ) as NotificationChannel[],
      personalization: {
        userPreferences: userPrefs,
        timeZone: "UTC",
        language: "en",
        personalizedContent: data,
        behaviorBasedTiming: true,
        optimalDeliveryTime: this.calculateOptimalDeliveryTime(userId),
      },
    };

    return notification;
  }

  private evaluateTemplateConditions(
    template: NotificationTemplate,
    data: Record<string, any>,
  ): boolean {
    for (const condition of template.conditions) {
      const fieldValue = data[condition.field];
      const conditionValue = condition.value;

      switch (condition.operator) {
        case "equals":
          if (fieldValue !== conditionValue) return false;
          break;
        case "not_equals":
          if (fieldValue === conditionValue) return false;
          break;
        case "greater_than":
          if (!(fieldValue > conditionValue)) return false;
          break;
        case "less_than":
          if (!(fieldValue < conditionValue)) return false;
          break;
        case "contains":
          if (!String(fieldValue).includes(String(conditionValue)))
            return false;
          break;
      }
    }
    return true;
  }

  private getUserDeviceTokens(userId: string): string[] {
    // Simulate device tokens for user
    return [`ios-${userId}-device1`, `android-${userId}-device2`];
  }

  private calculateOptimalDeliveryTime(userId: string): Date {
    // Simulate AI-based optimal timing
    const userPrefs = this.userPreferences.get(userId);
    if (!userPrefs) return new Date();

    // Simple heuristic: avoid quiet hours and optimize for engagement
    const now = new Date();
    const optimal = new Date(now);

    // Set to 10 AM if currently in quiet hours
    if (this.isInQuietHours(userPrefs)) {
      optimal.setHours(10, 0, 0, 0);
      if (optimal <= now) {
        optimal.setDate(optimal.getDate() + 1);
      }
    }

    return optimal;
  }

  private calculateNextExecution(schedule: NotificationSchedule): Date {
    const now = new Date();
    const next = new Date(now);

    switch (schedule.frequency) {
      case "daily":
        next.setDate(next.getDate() + 1);
        break;
      case "weekly":
        next.setDate(next.getDate() + 7);
        break;
      case "monthly":
        next.setMonth(next.getMonth() + 1);
        break;
      case "custom":
        if (schedule.customCron) {
          // Simplified cron parsing
          next.setHours(next.getHours() + 1);
        }
        break;
    }

    return next;
  }

  private getNextWeekday(
    dayOfWeek: number,
    hour: number,
    minute: number,
  ): Date {
    const now = new Date();
    const next = new Date(now);

    const daysUntilTarget = (dayOfWeek - now.getDay() + 7) % 7;
    next.setDate(now.getDate() + (daysUntilTarget || 7));
    next.setHours(hour, minute, 0, 0);

    return next;
  }

  private async updateAnalytics(): Promise<void> {
    // Update notification analytics
    // This would typically aggregate data for reporting
  }

  private async trackDeliveryStatus(): Promise<void> {
    // Track and update delivery status of sent notifications
    const sentNotifications = Array.from(this.notifications.values()).filter(
      (notification) =>
        notification.status === "sent" || notification.status === "delivered",
    );

    for (const notification of sentNotifications) {
      // Simulate status updates
      if (notification.status === "sent" && Math.random() < 0.8) {
        notification.status = "delivered";
        notification.deliveredAt = new Date();
      }

      if (notification.status === "delivered" && Math.random() < 0.3) {
        notification.status = "opened";
        notification.openedAt = new Date();
      }
    }
  }

  // Public interface methods
  async sendNotificationToUser(
    userId: string,
    type: PushNotification["type"],
    title: string,
    body: string,
    data: Record<string, any> = {},
    priority: PushNotification["priority"] = "normal",
  ): Promise<string> {
    const notification: PushNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      body,
      data,
      priority,
      category: type,
      status: "pending",
      createdAt: new Date(),
      deviceTokens: this.getUserDeviceTokens(userId),
      channels: [this.channels.get(type)].filter(
        Boolean,
      ) as NotificationChannel[],
      personalization: {
        userPreferences: this.userPreferences.get(userId)!,
        timeZone: "UTC",
        language: "en",
        personalizedContent: data,
        behaviorBasedTiming: false,
      },
    };

    this.notifications.set(notification.id, notification);
    return notification.id;
  }

  async sendBulkNotification(
    userIds: string[],
    templateId: string,
    data: Record<string, any> = {},
  ): Promise<string[]> {
    const notificationIds: string[] = [];
    const template = this.templates.get(templateId);

    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    for (const userId of userIds) {
      const notification = await this.createNotificationFromTemplate(
        template,
        userId,
        data,
      );
      if (notification) {
        this.notifications.set(notification.id, notification);
        notificationIds.push(notification.id);
      }
    }

    return notificationIds;
  }

  async scheduleNotification(
    userId: string,
    templateId: string,
    scheduledFor: Date,
    data: Record<string, any> = {},
  ): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const notification = await this.createNotificationFromTemplate(
      template,
      userId,
      data,
    );
    if (!notification) {
      throw new Error("Failed to create notification");
    }

    notification.scheduledFor = scheduledFor;
    this.notifications.set(notification.id, notification);

    return notification.id;
  }

  async getUserPreferences(
    userId: string,
  ): Promise<UserNotificationPreferences | null> {
    return this.userPreferences.get(userId) || null;
  }

  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserNotificationPreferences>,
  ): Promise<boolean> {
    const current = this.userPreferences.get(userId);
    if (!current) return false;

    const updated = { ...current, ...preferences };
    this.userPreferences.set(userId, updated);
    return true;
  }

  async getNotifications(
    userId?: string,
    status?: PushNotification["status"],
    limit: number = 50,
  ): Promise<PushNotification[]> {
    let notifications = Array.from(this.notifications.values());

    if (userId) {
      notifications = notifications.filter((n) => n.userId === userId);
    }

    if (status) {
      notifications = notifications.filter((n) => n.status === status);
    }

    return notifications
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getNotificationAnalytics(timeRange: {
    start: Date;
    end: Date;
  }): Promise<NotificationAnalytics> {
    const notifications = Array.from(this.notifications.values()).filter(
      (n) => n.createdAt >= timeRange.start && n.createdAt <= timeRange.end,
    );

    const totalSent = notifications.filter(
      (n) => n.status !== "pending",
    ).length;
    const totalDelivered = notifications.filter(
      (n) => n.status === "delivered" || n.status === "opened",
    ).length;
    const totalOpened = notifications.filter(
      (n) => n.status === "opened",
    ).length;
    const totalFailed = notifications.filter(
      (n) => n.status === "failed",
    ).length;

    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const openRate =
      totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;

    return {
      timeRange,
      totalSent,
      totalDelivered,
      totalOpened,
      totalFailed,
      deliveryRate,
      openRate,
      clickThroughRate: openRate * 0.3, // Estimated
      byType: {}, // Would be populated with actual data
      byPlatform: {}, // Would be populated with actual data
      byTimeOfDay: {}, // Would be populated with actual data
      engagementScore: (openRate + deliveryRate) / 2,
      userRetention: 85 + Math.random() * 10, // Simulated
    };
  }

  async createNotificationTemplate(
    template: Omit<NotificationTemplate, "id">,
  ): Promise<string> {
    const id = `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullTemplate: NotificationTemplate = { ...template, id };

    this.templates.set(id, fullTemplate);
    return id;
  }

  async createNotificationCampaign(
    campaign: Omit<NotificationCampaign, "id" | "metrics" | "createdAt">,
  ): Promise<string> {
    const id = `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const fullCampaign: NotificationCampaign = {
      ...campaign,
      id,
      createdAt: new Date(),
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        unsubscribed: 0,
        cost: 0,
        revenue: 0,
        roi: 0,
      },
    };

    this.campaigns.set(id, fullCampaign);
    return id;
  }

  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    return Array.from(this.templates.values());
  }

  async getNotificationChannels(): Promise<NotificationChannel[]> {
    return Array.from(this.channels.values());
  }

  async markNotificationAsOpened(notificationId: string): Promise<boolean> {
    const notification = this.notifications.get(notificationId);
    if (!notification) return false;

    notification.status = "opened";
    notification.openedAt = new Date();
    return true;
  }

  async cancelNotification(notificationId: string): Promise<boolean> {
    const notification = this.notifications.get(notificationId);
    if (
      !notification ||
      notification.status === "sent" ||
      notification.status === "delivered"
    ) {
      return false;
    }

    this.notifications.delete(notificationId);
    return true;
  }
}

export const pushNotificationService = singletonPattern(
  () => new PushNotificationService(),
);
