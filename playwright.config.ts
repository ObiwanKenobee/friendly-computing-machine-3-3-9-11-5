import { defineConfig, devices } from "@playwright/test";

/**
 * Comprehensive E2E Testing Configuration for QuantumVest Enterprise Platform
 * Supports multiple browsers, environments, and testing scenarios
 */

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/results.xml" }],
    ["github"],
    ["list"],
  ],

  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    // Setup project for authentication
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
      teardown: "teardown",
    },

    // Teardown project
    {
      name: "teardown",
      testMatch: /.*\.teardown\.ts/,
    },

    // Desktop browsers
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
      dependencies: ["setup"],
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1920, height: 1080 },
      },
      dependencies: ["setup"],
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1920, height: 1080 },
      },
      dependencies: ["setup"],
    },

    // Mobile browsers
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
      dependencies: ["setup"],
    },

    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
      dependencies: ["setup"],
    },

    // Tablet browsers
    {
      name: "iPad",
      use: { ...devices["iPad Pro"] },
      dependencies: ["setup"],
    },

    // Edge browser
    {
      name: "Microsoft Edge",
      use: {
        ...devices["Desktop Edge"],
        channel: "msedge",
      },
      dependencies: ["setup"],
    },

    // Branded tests - testing specific user flows
    {
      name: "branded",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: "**/branded/**/*.spec.ts",
      dependencies: ["setup"],
    },

    // API testing
    {
      name: "api",
      use: {
        baseURL: process.env.API_BASE_URL || "http://localhost:3000/api",
      },
      testMatch: "**/api/**/*.spec.ts",
    },

    // Performance testing
    {
      name: "performance",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: "**/performance/**/*.spec.ts",
      dependencies: ["setup"],
    },

    // Accessibility testing
    {
      name: "accessibility",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: "**/accessibility/**/*.spec.ts",
      dependencies: ["setup"],
    },

    // Security testing
    {
      name: "security",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: "**/security/**/*.spec.ts",
      dependencies: ["setup"],
    },
  ],

  // Global setup and teardown
  globalSetup: require.resolve("./tests/global-setup.ts"),
  globalTeardown: require.resolve("./tests/global-teardown.ts"),

  // Output directories
  outputDir: "test-results",

  // Web server configuration for local testing
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Expect configuration
  expect: {
    timeout: 5000,
    toHaveScreenshot: { threshold: 0.2 },
    toMatchSnapshot: { threshold: 0.2 },
  },

  // Test timeout
  timeout: 30000,
});
