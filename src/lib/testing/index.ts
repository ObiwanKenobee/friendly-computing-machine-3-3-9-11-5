/**
 * QuantumVest Enterprise Testing Utilities
 * Comprehensive testing setup with mocks, factories, and utilities
 */

import { vi, expect, type MockedFunction } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import type {
  User,
  Organization,
  Payment,
  Subscription,
  UserInteraction,
} from "../database/schema";

// Mock data factories
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: `user-${Math.random().toString(36).substr(2, 9)}`,
  email: `test-${Math.random().toString(36).substr(2, 9)}@example.com`,
  username: `testuser${Math.random().toString(36).substr(2, 9)}`,
  password_hash: "hashed_password",
  role: "user",
  subscription_tier: "free",
  security_level: "standard",

  first_name: "Test",
  last_name: "User",
  timezone: "UTC",
  language: "en",
  country: "US",

  mfa_enabled: false,
  login_attempts: 0,
  subscription_status: "active",
  billing_cycle: "monthly",

  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

export const createMockOrganization = (
  overrides: Partial<Organization> = {},
): Organization => ({
  id: `org-${Math.random().toString(36).substr(2, 9)}`,
  name: `Test Organization ${Math.random().toString(36).substr(2, 9)}`,
  domain: "test.com",
  industry: "Technology",
  size: "medium",

  subscription_tier: "enterprise",
  max_users: 100,
  features_enabled: ["analytics", "security", "payments"],
  security_policies: [],

  billing_email: "billing@test.com",
  billing_address: {
    street_line1: "123 Test St",
    city: "Test City",
    state: "TS",
    postal_code: "12345",
    country: "US",
  },

  created_at: new Date(),
  updated_at: new Date(),
  created_by: "user-123",
  ...overrides,
});

export const createMockPayment = (
  overrides: Partial<Payment> = {},
): Payment => ({
  id: `payment-${Math.random().toString(36).substr(2, 9)}`,
  user_id: "user-123",

  amount: 99.99,
  currency: "USD",
  status: "completed",
  payment_method: "stripe",

  description: "Test payment",
  metadata: {},
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

export const createMockSubscription = (
  overrides: Partial<Subscription> = {},
): Subscription => ({
  id: `sub-${Math.random().toString(36).substr(2, 9)}`,
  user_id: "user-123",

  tier: "professional",
  status: "active",
  billing_cycle: "monthly",

  current_period_start: new Date(),
  current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

  usage_limits: {
    api_calls_per_month: 10000,
    storage_gb: 100,
    users: 10,
    features: ["analytics", "payments"],
    support_level: "email",
  },

  current_usage: {
    api_calls_this_month: 1500,
    storage_used_gb: 15,
    active_users: 3,
    last_calculated: new Date(),
  },

  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

export const createMockInteraction = (
  overrides: Partial<UserInteraction> = {},
): UserInteraction => ({
  id: `interaction-${Math.random().toString(36).substr(2, 9)}`,
  session_id: "session-123",

  type: "click",
  element: "button.submit",
  page_url: "/test-page",
  page_title: "Test Page",

  position: { x: 100, y: 200 },
  viewport: { width: 1920, height: 1080 },
  device_type: "desktop",
  browser: "Chrome",
  os: "Windows",

  timestamp: new Date(),
  authenticated: true,
  user_agent: "Mozilla/5.0 (Test)",

  metadata: {},
  ...overrides,
});

// API Mocking utilities
export const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  getPaginated: vi.fn(),
  uploadFile: vi.fn(),
  batch: vi.fn(),
  subscribe: vi.fn(),

  // Auth methods
  login: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
  getCurrentUser: vi.fn(),
  updateProfile: vi.fn(),
  changePassword: vi.fn(),

  // Organization methods
  getOrganization: vi.fn(),
  updateOrganization: vi.fn(),

  // Payment methods
  getPayments: vi.fn(),
  createPayment: vi.fn(),

  // Subscription methods
  getSubscription: vi.fn(),
  updateSubscription: vi.fn(),

  // Analytics methods
  getAnalytics: vi.fn(),
  trackInteraction: vi.fn(),

  // Security methods
  getSecurityEvents: vi.fn(),
  reportSecurityEvent: vi.fn(),
};

// Store mocking utilities
export const createMockAuthStore = (overrides = {}) => ({
  user: createMockUser(),
  token: "mock-token",
  isAuthenticated: true,
  isLoading: false,
  lastLoginTime: new Date(),
  sessionExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),

  setUser: vi.fn(),
  setToken: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  updateUser: vi.fn(),
  refreshSession: vi.fn(),
  ...overrides,
});

export const createMockAppStore = (overrides = {}) => ({
  theme: "light" as const,
  language: "en",
  timezone: "UTC",
  sidebarCollapsed: false,
  notifications: [],
  isOnline: true,
  lastActivity: new Date(),

  setTheme: vi.fn(),
  setLanguage: vi.fn(),
  setTimezone: vi.fn(),
  toggleSidebar: vi.fn(),
  addNotification: vi.fn(),
  removeNotification: vi.fn(),
  setOnlineStatus: vi.fn(),
  updateActivity: vi.fn(),
  ...overrides,
});

// React Testing Library utilities
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = createTestQueryClient();

  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(BrowserRouter, null, children),
  );
};

export const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  return render(ui, {
    wrapper: TestWrapper,
    ...options,
  });
};

// Custom testing utilities
export const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
};

export const expectElementToBeVisible = (element: string | RegExp) => {
  expect(screen.getByText(element)).toBeInTheDocument();
};

export const expectElementNotToExist = (element: string | RegExp) => {
  expect(screen.queryByText(element)).not.toBeInTheDocument();
};

export const clickButton = async (buttonText: string | RegExp) => {
  const user = userEvent.setup();
  const button = screen.getByRole("button", { name: buttonText });
  await user.click(button);
};

export const fillForm = async (formData: Record<string, string>) => {
  const user = userEvent.setup();

  for (const [field, value] of Object.entries(formData)) {
    const input = screen.getByLabelText(new RegExp(field, "i"));
    await user.clear(input);
    await user.type(input, value);
  }
};

export const submitForm = async (formSelector = "form") => {
  const form = document.querySelector(formSelector);
  if (form) {
    fireEvent.submit(form);
  }
};

// Mock browser APIs
export const mockBrowserAPIs = () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });

  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, "sessionStorage", {
    value: sessionStorageMock,
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock fetch
  global.fetch = vi.fn();

  // Mock WebSocket
  global.WebSocket = vi.fn().mockImplementation(() => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    send: vi.fn(),
    close: vi.fn(),
    readyState: 1,
  }));

  // Mock geolocation
  global.navigator.geolocation = {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  };

  // Mock notifications
  global.Notification = {
    permission: "granted",
    requestPermission: vi.fn().mockResolvedValue("granted"),
  } as any;

  return {
    localStorage: localStorageMock,
    sessionStorage: sessionStorageMock,
  };
};

// Performance testing utilities
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  await waitFor(() => {
    // Wait for any async operations to complete
  });
  const end = performance.now();
  return end - start;
};

export const expectRenderToBeFast = async (
  renderFn: () => void,
  maxTime = 100,
) => {
  const renderTime = await measureRenderTime(renderFn);
  expect(renderTime).toBeLessThan(maxTime);
};

// Error boundary testing
export const expectErrorBoundary = (error: Error) => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() => {
    throw error;
  }).toThrow();

  spy.mockRestore();
};

// Accessibility testing utilities
export const checkAccessibility = async (container: HTMLElement) => {
  // Check for basic accessibility requirements
  const buttons = container.querySelectorAll("button");
  buttons.forEach((button) => {
    expect(button).toHaveAttribute("type");
  });

  const inputs = container.querySelectorAll("input");
  inputs.forEach((input) => {
    expect(input).toHaveAttribute("id");
    const label = container.querySelector(`label[for="${input.id}"]`);
    expect(label).toBeInTheDocument();
  });

  const images = container.querySelectorAll("img");
  images.forEach((img) => {
    expect(img).toHaveAttribute("alt");
  });
};

// Integration test utilities
export const setupIntegrationTest = () => {
  const mocks = mockBrowserAPIs();

  // Mock API client
  vi.mock("../api/client", () => ({
    apiClient: mockApiClient,
    default: mockApiClient,
  }));

  // Mock stores
  vi.mock("../store", () => ({
    useAuthStore: () => createMockAuthStore(),
    useAppStore: () => createMockAppStore(),
    useAnalyticsStore: () => ({}),
    useSecurityStore: () => ({}),
    usePerformanceStore: () => ({}),
  }));

  return mocks;
};

// Test data generators
export const generateTestData = {
  users: (count: number) =>
    Array.from({ length: count }, () => createMockUser()),
  organizations: (count: number) =>
    Array.from({ length: count }, () => createMockOrganization()),
  payments: (count: number) =>
    Array.from({ length: count }, () => createMockPayment()),
  subscriptions: (count: number) =>
    Array.from({ length: count }, () => createMockSubscription()),
  interactions: (count: number) =>
    Array.from({ length: count }, () => createMockInteraction()),
};

// Export all utilities
export { render, screen, fireEvent, waitFor, within, userEvent, vi, expect };

// Common test scenarios
export const commonScenarios = {
  authenticatedUser: () => ({
    authStore: createMockAuthStore({
      isAuthenticated: true,
      user: createMockUser({ role: "user", subscription_tier: "professional" }),
    }),
  }),

  adminUser: () => ({
    authStore: createMockAuthStore({
      isAuthenticated: true,
      user: createMockUser({ role: "admin", subscription_tier: "enterprise" }),
    }),
  }),

  unauthenticatedUser: () => ({
    authStore: createMockAuthStore({
      isAuthenticated: false,
      user: null,
      token: null,
    }),
  }),

  enterpriseUser: () => ({
    authStore: createMockAuthStore({
      isAuthenticated: true,
      user: createMockUser({
        role: "enterprise",
        subscription_tier: "enterprise",
        organization_id: "org-123",
      }),
    }),
  }),
};
