/**
 * QuantumVest Enterprise State Management
 * Advanced Zustand store with persistence, middleware, and type safety
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  User,
  Organization,
  Subscription,
  UserInteraction,
  SecurityEvent,
} from "../database/schema";

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastLoginTime: Date | null;
  sessionExpiresAt: Date | null;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    subscribeWithSelector(
      immer((set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        lastLoginTime: null,
        sessionExpiresAt: null,

        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
          }),

        setToken: (token) =>
          set((state) => {
            state.token = token;
            state.sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
          }),

        login: (user, token) =>
          set((state) => {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.lastLoginTime = new Date();
            state.sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
          }),

        logout: () =>
          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.lastLoginTime = null;
            state.sessionExpiresAt = null;
          }),

        updateUser: (updates) =>
          set((state) => {
            if (state.user) {
              Object.assign(state.user, updates);
            }
          }),

        refreshSession: async () => {
          set((state) => {
            state.isLoading = true;
          });
          try {
            // Implement session refresh logic
            const { apiClient } = await import("../api/client");
            const response = await apiClient.refreshToken();

            if (response.success) {
              set((state) => {
                state.token = response.data.token;
                state.sessionExpiresAt = new Date(
                  Date.now() + 24 * 60 * 60 * 1000,
                );
              });
            }
          } catch (error) {
            console.error("Session refresh failed:", error);
            get().logout();
          } finally {
            set((state) => {
              state.isLoading = false;
            });
          }
        },
      })),
    ),
    {
      name: "quantumvest-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        lastLoginTime: state.lastLoginTime,
        sessionExpiresAt: state.sessionExpiresAt,
      }),
    },
  ),
);

// App State Store
interface AppState {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  sidebarCollapsed: boolean;
  notifications: Notification[];
  isOnline: boolean;
  lastActivity: Date | null;

  // Actions
  setTheme: (theme: "light" | "dark" | "system") => void;
  setLanguage: (language: string) => void;
  setTimezone: (timezone: string) => void;
  toggleSidebar: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  updateActivity: () => void;
}

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export const useAppStore = create<AppState>()(
  persist(
    subscribeWithSelector(
      immer((set, get) => ({
        theme: "system",
        language: "en",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        sidebarCollapsed: false,
        notifications: [],
        isOnline: navigator.onLine,
        lastActivity: new Date(),

        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
          }),

        setLanguage: (language) =>
          set((state) => {
            state.language = language;
          }),

        setTimezone: (timezone) =>
          set((state) => {
            state.timezone = timezone;
          }),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          }),

        addNotification: (notification) =>
          set((state) => {
            state.notifications.unshift({
              ...notification,
              id: notification.id || `notif-${Date.now()}`,
              timestamp: new Date(),
              read: false,
            });

            // Keep only last 50 notifications
            if (state.notifications.length > 50) {
              state.notifications = state.notifications.slice(0, 50);
            }
          }),

        removeNotification: (id) =>
          set((state) => {
            state.notifications = state.notifications.filter(
              (n) => n.id !== id,
            );
          }),

        setOnlineStatus: (isOnline) =>
          set((state) => {
            state.isOnline = isOnline;
          }),

        updateActivity: () =>
          set((state) => {
            state.lastActivity = new Date();
          }),
      })),
    ),
    {
      name: "quantumvest-app",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        timezone: state.timezone,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

// Analytics Store
interface AnalyticsState {
  interactions: UserInteraction[];
  pageViews: Record<string, number>;
  sessionStartTime: Date | null;
  totalSessionTime: number;

  // Actions
  trackInteraction: (
    interaction: Omit<UserInteraction, "id" | "timestamp">,
  ) => void;
  trackPageView: (page: string) => void;
  startSession: () => void;
  endSession: () => void;
  getSessionDuration: () => number;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      interactions: [],
      pageViews: {},
      sessionStartTime: null,
      totalSessionTime: 0,

      trackInteraction: (interaction) =>
        set((state) => {
          const fullInteraction: UserInteraction = {
            ...interaction,
            id: `interaction-${Date.now()}-${Math.random()}`,
            timestamp: new Date(),
          };

          state.interactions.push(fullInteraction);

          // Keep only last 1000 interactions in memory
          if (state.interactions.length > 1000) {
            state.interactions = state.interactions.slice(-1000);
          }
        }),

      trackPageView: (page) =>
        set((state) => {
          state.pageViews[page] = (state.pageViews[page] || 0) + 1;
        }),

      startSession: () =>
        set((state) => {
          state.sessionStartTime = new Date();
        }),

      endSession: () =>
        set((state) => {
          if (state.sessionStartTime) {
            const sessionDuration =
              Date.now() - state.sessionStartTime.getTime();
            state.totalSessionTime += sessionDuration;
            state.sessionStartTime = null;
          }
        }),

      getSessionDuration: () => {
        const state = get();
        if (state.sessionStartTime) {
          return Date.now() - state.sessionStartTime.getTime();
        }
        return 0;
      },
    })),
  ),
);

// Security Store
interface SecurityState {
  events: SecurityEvent[];
  threatLevel: "low" | "medium" | "high" | "critical";
  activeThreats: number;
  lastSecurityCheck: Date | null;

  // Actions
  addSecurityEvent: (event: Omit<SecurityEvent, "id" | "timestamp">) => void;
  updateThreatLevel: (level: "low" | "medium" | "high" | "critical") => void;
  runSecurityCheck: () => Promise<void>;
}

export const useSecurityStore = create<SecurityState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      events: [],
      threatLevel: "low",
      activeThreats: 0,
      lastSecurityCheck: null,

      addSecurityEvent: (event) =>
        set((state) => {
          const fullEvent: SecurityEvent = {
            ...event,
            id: `security-${Date.now()}-${Math.random()}`,
            timestamp: new Date(),
          };

          state.events.unshift(fullEvent);

          // Update threat level based on event severity
          if (event.severity === "critical") {
            state.threatLevel = "critical";
            state.activeThreats += 1;
          } else if (
            event.severity === "high" &&
            state.threatLevel !== "critical"
          ) {
            state.threatLevel = "high";
            state.activeThreats += 1;
          }

          // Keep only last 500 events in memory
          if (state.events.length > 500) {
            state.events = state.events.slice(0, 500);
          }
        }),

      updateThreatLevel: (level) =>
        set((state) => {
          state.threatLevel = level;
        }),

      runSecurityCheck: async () => {
        set((state) => {
          state.lastSecurityCheck = new Date();
        });

        try {
          // Implement security check logic
          const { apiClient } = await import("../api/client");
          const response = await apiClient.get("/security/check");

          if (response.success) {
            set((state) => {
              state.threatLevel = response.data.threatLevel;
              state.activeThreats = response.data.activeThreats;
            });
          }
        } catch (error) {
          console.error("Security check failed:", error);
        }
      },
    })),
  ),
);

// Performance Store
interface PerformanceState {
  metrics: {
    pageLoadTime: number;
    apiResponseTimes: Record<string, number[]>;
    errorCount: number;
    memoryUsage: number;
  };

  // Actions
  recordPageLoad: (time: number) => void;
  recordAPICall: (endpoint: string, duration: number) => void;
  recordError: () => void;
  updateMemoryUsage: (usage: number) => void;
  getAverageAPITime: (endpoint: string) => number;
}

export const usePerformanceStore = create<PerformanceState>()(
  immer((set, get) => ({
    metrics: {
      pageLoadTime: 0,
      apiResponseTimes: {},
      errorCount: 0,
      memoryUsage: 0,
    },

    recordPageLoad: (time) =>
      set((state) => {
        state.metrics.pageLoadTime = time;
      }),

    recordAPICall: (endpoint, duration) =>
      set((state) => {
        if (!state.metrics.apiResponseTimes[endpoint]) {
          state.metrics.apiResponseTimes[endpoint] = [];
        }

        state.metrics.apiResponseTimes[endpoint].push(duration);

        // Keep only last 100 measurements per endpoint
        if (state.metrics.apiResponseTimes[endpoint].length > 100) {
          state.metrics.apiResponseTimes[endpoint] =
            state.metrics.apiResponseTimes[endpoint].slice(-100);
        }
      }),

    recordError: () =>
      set((state) => {
        state.metrics.errorCount += 1;
      }),

    updateMemoryUsage: (usage) =>
      set((state) => {
        state.metrics.memoryUsage = usage;
      }),

    getAverageAPITime: (endpoint) => {
      const state = get();
      const times = state.metrics.apiResponseTimes[endpoint];
      if (!times || times.length === 0) return 0;

      return times.reduce((sum, time) => sum + time, 0) / times.length;
    },
  })),
);

// Store subscriptions for automatic cleanup and side effects
export const setupStoreSubscriptions = () => {
  // Auth store subscriptions
  useAuthStore.subscribe(
    (state) => state.isAuthenticated,
    (isAuthenticated) => {
      if (isAuthenticated) {
        useAnalyticsStore.getState().startSession();
      } else {
        useAnalyticsStore.getState().endSession();
      }
    },
  );

  // Online/offline detection
  const handleOnline = () => useAppStore.getState().setOnlineStatus(true);
  const handleOffline = () => useAppStore.getState().setOnlineStatus(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Activity tracking
  const updateActivity = () => useAppStore.getState().updateActivity();

  ["mousedown", "mousemove", "keypress", "scroll", "touchstart"].forEach(
    (event) => {
      document.addEventListener(event, updateActivity, { passive: true });
    },
  );

  // Memory usage monitoring
  if ("memory" in performance) {
    setInterval(() => {
      const memory = (performance as any).memory;
      const usage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      usePerformanceStore.getState().updateMemoryUsage(usage);
    }, 30000); // Every 30 seconds
  }

  // Automatic session refresh
  setInterval(async () => {
    const authState = useAuthStore.getState();
    if (authState.isAuthenticated && authState.sessionExpiresAt) {
      const timeUntilExpiry = authState.sessionExpiresAt.getTime() - Date.now();

      // Refresh if expiring within 5 minutes
      if (timeUntilExpiry < 5 * 60 * 1000) {
        await authState.refreshSession();
      }
    }
  }, 60000); // Check every minute

  // Return cleanup function
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);

    ["mousedown", "mousemove", "keypress", "scroll", "touchstart"].forEach(
      (event) => {
        document.removeEventListener(event, updateActivity);
      },
    );
  };
};

// Store selectors for optimized re-renders
export const authSelectors = {
  user: (state: AuthState) => state.user,
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  isAdmin: (state: AuthState) =>
    state.user?.role === "admin" || state.user?.role === "super_admin",
  isEnterprise: (state: AuthState) =>
    ["enterprise", "ultra"].includes(state.user?.subscription_tier || ""),
  hasPermission: (permission: string) => (state: AuthState) => {
    if (!state.user) return false;
    // Implement permission checking logic
    return true; // Placeholder
  },
};

export const appSelectors = {
  unreadNotifications: (state: AppState) =>
    state.notifications.filter((n) => !n.read),
  isDarkMode: (state: AppState) => {
    if (state.theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return state.theme === "dark";
  },
};

// Export all stores
export {
  useAuthStore,
  useAppStore,
  useAnalyticsStore,
  useSecurityStore,
  usePerformanceStore,
};
