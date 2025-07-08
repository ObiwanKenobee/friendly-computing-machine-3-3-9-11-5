/**
 * Comprehensive Route Verification System
 * Tests all QuantumVest Enterprise routes to ensure no "Load failed" errors
 */

interface RouteTest {
  path: string;
  name: string;
  tier: "free" | "starter" | "professional" | "enterprise";
  critical: boolean;
  timeout: number;
}

interface RouteTestResult {
  path: string;
  success: boolean;
  loadTime: number;
  error?: string;
  status: "pass" | "fail" | "timeout" | "skip";
}

class RouteVerificationSystem {
  private static instance: RouteVerificationSystem;
  private testResults: RouteTestResult[] = [];

  private routes: RouteTest[] = [
    // Core platform routes (Critical)
    {
      path: "/",
      name: "Platform Navigation",
      tier: "free",
      critical: true,
      timeout: 10000,
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      tier: "free",
      critical: true,
      timeout: 15000,
    },
    {
      path: "/pricing",
      name: "Pricing",
      tier: "free",
      critical: true,
      timeout: 10000,
    },
    {
      path: "/billing",
      name: "Billing",
      tier: "free",
      critical: true,
      timeout: 10000,
    },
    {
      path: "/archetypes",
      name: "Investor Archetypes",
      tier: "free",
      critical: true,
      timeout: 10000,
    },

    // Enterprise subscription overview
    {
      path: "/enterprise-subscriptions",
      name: "Enterprise Subscriptions",
      tier: "free",
      critical: true,
      timeout: 15000,
    },

    // Starter tier routes
    {
      path: "/retail-investor",
      name: "Retail Investor",
      tier: "starter",
      critical: true,
      timeout: 15000,
    },
    {
      path: "/emerging-market-citizen",
      name: "Emerging Market Citizen",
      tier: "starter",
      critical: false,
      timeout: 20000,
    },
    {
      path: "/student-early-career",
      name: "Student Early Career",
      tier: "starter",
      critical: false,
      timeout: 15000,
    },

    // Professional tier routes
    {
      path: "/financial-advisor",
      name: "Financial Advisor",
      tier: "professional",
      critical: true,
      timeout: 15000,
    },
    {
      path: "/developer-integrator",
      name: "Developer Platform",
      tier: "professional",
      critical: false,
      timeout: 15000,
    },
    {
      path: "/cultural-investor",
      name: "Cultural Investor",
      tier: "professional",
      critical: false,
      timeout: 20000,
    },
    {
      path: "/diaspora-investor",
      name: "Diaspora Investor",
      tier: "professional",
      critical: false,
      timeout: 15000,
    },
    {
      path: "/public-sector-ngo",
      name: "Public Sector NGO",
      tier: "professional",
      critical: false,
      timeout: 15000,
    },
    {
      path: "/quant-data-driven-investor",
      name: "Quantitative Investor",
      tier: "professional",
      critical: false,
      timeout: 15000,
    },

    // Enterprise tier routes (Most important)
    {
      path: "/tortoise-protocol",
      name: "Tortoise Protocol",
      tier: "enterprise",
      critical: true,
      timeout: 20000,
    },
    {
      path: "/legendary-investors-enterprise",
      name: "Legendary Investor Strategies",
      tier: "enterprise",
      critical: true,
      timeout: 20000,
    },
    {
      path: "/institutional-investor",
      name: "Institutional Investor",
      tier: "enterprise",
      critical: true,
      timeout: 15000,
    },
    {
      path: "/african-market-enterprise",
      name: "African Market Enterprise",
      tier: "enterprise",
      critical: false,
      timeout: 20000,
    },
    {
      path: "/wildlife-conservation-enterprise",
      name: "Wildlife Conservation",
      tier: "enterprise",
      critical: false,
      timeout: 20000,
    },
    {
      path: "/quantum-enterprise-2050",
      name: "Quantum Enterprise 2050",
      tier: "enterprise",
      critical: false,
      timeout: 20000,
    },

    // Debug and utility routes
    {
      path: "/load-failure-diagnostics",
      name: "Load Failure Diagnostics",
      tier: "free",
      critical: false,
      timeout: 10000,
    },
  ];

  private constructor() {}

  public static getInstance(): RouteVerificationSystem {
    if (!RouteVerificationSystem.instance) {
      RouteVerificationSystem.instance = new RouteVerificationSystem();
    }
    return RouteVerificationSystem.instance;
  }

  public async verifyAllRoutes(
    options: {
      criticalOnly?: boolean;
      tier?: "free" | "starter" | "professional" | "enterprise";
      parallel?: boolean;
    } = {},
  ): Promise<RouteTestResult[]> {
    console.log("🧪 Starting comprehensive route verification...");

    let routesToTest = this.routes;

    // Filter by tier if specified
    if (options.tier) {
      routesToTest = routesToTest.filter(
        (route) => route.tier === options.tier,
      );
    }

    // Filter to critical only if specified
    if (options.criticalOnly) {
      routesToTest = routesToTest.filter((route) => route.critical);
    }

    console.log(`📊 Testing ${routesToTest.length} routes...`);

    if (options.parallel) {
      // Test routes in parallel (faster but more resource intensive)
      const promises = routesToTest.map((route) => this.testRoute(route));
      this.testResults = await Promise.all(promises);
    } else {
      // Test routes sequentially (safer)
      this.testResults = [];
      for (const route of routesToTest) {
        const result = await this.testRoute(route);
        this.testResults.push(result);

        // Small delay between tests to avoid overwhelming the system
        await this.delay(500);
      }
    }

    this.displayResults();
    return this.testResults;
  }

  private async testRoute(route: RouteTest): Promise<RouteTestResult> {
    const startTime = Date.now();

    try {
      console.log(`🔍 Testing ${route.name} (${route.path})...`);

      // Create a test mechanism that doesn't interfere with current page
      const testResult = await this.performRouteTest(route);

      const loadTime = Date.now() - startTime;

      const result: RouteTestResult = {
        path: route.path,
        success: testResult.success,
        loadTime,
        status: testResult.success ? "pass" : "fail",
        error: testResult.error,
      };

      if (result.success) {
        console.log(`✅ ${route.name}: ${loadTime}ms`);
      } else {
        console.log(`❌ ${route.name}: ${result.error} (${loadTime}ms)`);
      }

      return result;
    } catch (error) {
      const loadTime = Date.now() - startTime;
      console.log(`🚨 ${route.name}: Exception - ${error}`);

      return {
        path: route.path,
        success: false,
        loadTime,
        status: "fail",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private async performRouteTest(
    route: RouteTest,
  ): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      // Create a hidden iframe to test the route
      const testFrame = document.createElement("iframe");
      testFrame.style.display = "none";
      testFrame.style.position = "absolute";
      testFrame.style.left = "-9999px";
      testFrame.style.width = "1px";
      testFrame.style.height = "1px";

      let timeout: NodeJS.Timeout;
      let resolved = false;

      const cleanup = () => {
        if (timeout) clearTimeout(timeout);
        if (testFrame.parentNode) {
          document.body.removeChild(testFrame);
        }
      };

      const resolveOnce = (result: { success: boolean; error?: string }) => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(result);
        }
      };

      // Set up timeout
      timeout = setTimeout(() => {
        resolveOnce({
          success: false,
          error: `Timeout after ${route.timeout}ms`,
        });
      }, route.timeout);

      // Set up success handler
      testFrame.onload = () => {
        // Check if the frame loaded successfully and doesn't contain error content
        try {
          const frameDocument = testFrame.contentDocument;
          if (frameDocument) {
            const bodyText =
              frameDocument.body?.textContent?.toLowerCase() || "";

            // Check for error indicators
            if (
              bodyText.includes("load failed") ||
              bodyText.includes("module load failed") ||
              bodyText.includes("error") ||
              bodyText.includes("404") ||
              bodyText.includes("not found")
            ) {
              resolveOnce({
                success: false,
                error: "Page contains error content",
              });
            } else {
              resolveOnce({ success: true });
            }
          } else {
            resolveOnce({ success: true }); // Cross-origin, assume success if loaded
          }
        } catch (error) {
          // Cross-origin restrictions, but frame loaded, so assume success
          resolveOnce({ success: true });
        }
      };

      // Set up error handler
      testFrame.onerror = () => {
        resolveOnce({
          success: false,
          error: "Frame load error",
        });
      };

      // Start the test
      testFrame.src = route.path;
      document.body.appendChild(testFrame);
    });
  }

  private displayResults(): void {
    const passed = this.testResults.filter((r) => r.success).length;
    const failed = this.testResults.filter((r) => !r.success).length;
    const total = this.testResults.length;
    const averageLoadTime =
      this.testResults.reduce((sum, r) => sum + r.loadTime, 0) / total;

    console.log("\n📊 Route Verification Results:");
    console.log("=====================================");
    console.log(`Total Routes Tested: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / total) * 100)}%`);
    console.log(`⏱️ Average Load Time: ${Math.round(averageLoadTime)}ms`);

    if (failed > 0) {
      console.log("\n🚨 Failed Routes:");
      this.testResults
        .filter((r) => !r.success)
        .forEach((result) => {
          console.log(
            `  ${result.path}: ${result.error} (${result.loadTime}ms)`,
          );
        });
    }

    // Performance warnings
    const slowRoutes = this.testResults.filter(
      (r) => r.success && r.loadTime > 10000,
    );
    if (slowRoutes.length > 0) {
      console.log("\n⚠️ Slow Routes (>10s):");
      slowRoutes.forEach((result) => {
        console.log(`  ${result.path}: ${result.loadTime}ms`);
      });
    }

    // Overall assessment
    const successRate = (passed / total) * 100;
    if (successRate === 100) {
      console.log('\n🎉 All routes passed! No "Load failed" errors detected.');
    } else if (successRate >= 90) {
      console.log("\n✅ Most routes passed. Minor issues detected.");
    } else if (successRate >= 75) {
      console.log("\n⚠️ Some routes have issues. Review failed tests.");
    } else {
      console.log(
        "\n🚨 Significant route failures detected! Immediate attention required.",
      );
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public getResults(): RouteTestResult[] {
    return [...this.testResults];
  }

  public async verifyCriticalRoutes(): Promise<boolean> {
    await this.verifyAllRoutes({ criticalOnly: true });
    const criticalResults = this.testResults.filter(
      (r) => this.routes.find((route) => route.path === r.path)?.critical,
    );
    return criticalResults.every((r) => r.success);
  }

  public async quickHealthCheck(): Promise<boolean> {
    console.log("🏥 Running quick health check on core routes...");

    const coreRoutes = ["/", "/dashboard", "/pricing"];
    const results = await Promise.all(
      coreRoutes.map((path) => {
        const route = this.routes.find((r) => r.path === path)!;
        return this.testRoute(route);
      }),
    );

    const allPassed = results.every((r) => r.success);
    console.log(
      `Health Check: ${allPassed ? "✅ HEALTHY" : "❌ ISSUES DETECTED"}`,
    );

    return allPassed;
  }
}

// Auto-initialize in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  setTimeout(async () => {
    const verifier = RouteVerificationSystem.getInstance();
    console.log("🔍 Route Verification System initialized");

    // Expose to window for manual testing
    (window as any).routeVerifier = verifier;

    // Run quick health check automatically
    try {
      await verifier.quickHealthCheck();
    } catch (error) {
      console.warn("Route health check failed:", error);
    }
  }, 3000);
}

export default RouteVerificationSystem;
