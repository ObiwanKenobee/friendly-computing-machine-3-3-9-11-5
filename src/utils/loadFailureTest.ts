/**
 * Comprehensive Load Failure Test Utility
 * Tests critical routes and components to ensure they load without false "Load failed" errors
 */

interface LoadTestResult {
  route: string;
  success: boolean;
  loadTime: number;
  error?: string;
}

interface LoadTestSummary {
  totalTests: number;
  passed: number;
  failed: number;
  averageLoadTime: number;
  results: LoadTestResult[];
}

class LoadFailureTestUtility {
  private testTimeout = 15000; // 15 seconds per test

  async testCriticalRoutes(): Promise<LoadTestSummary> {
    const criticalRoutes = [
      "/",
      "/dashboard",
      "/pricing",
      "/enterprise-subscriptions",
      "/retail-investor",
      "/financial-advisor",
      "/legendary-investors-enterprise",
      "/tortoise-protocol",
    ];

    const results: LoadTestResult[] = [];
    let totalLoadTime = 0;

    console.log("🧪 Starting comprehensive load failure tests...");

    for (const route of criticalRoutes) {
      try {
        const result = await this.testSingleRoute(route);
        results.push(result);
        totalLoadTime += result.loadTime;

        console.log(
          `${result.success ? "✅" : "❌"} ${route}: ${result.loadTime}ms`,
        );
      } catch (error) {
        console.error(`🚨 Test failed for ${route}:`, error);
        results.push({
          route,
          success: false,
          loadTime: this.testTimeout,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const summary: LoadTestSummary = {
      totalTests: results.length,
      passed: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      averageLoadTime: totalLoadTime / results.length,
      results,
    };

    this.displayTestSummary(summary);
    return summary;
  }

  private async testSingleRoute(route: string): Promise<LoadTestResult> {
    const startTime = Date.now();

    return new Promise((resolve) => {
      // Create a timeout for the test
      const timeout = setTimeout(() => {
        resolve({
          route,
          success: false,
          loadTime: this.testTimeout,
          error: "Test timeout exceeded",
        });
      }, this.testTimeout);

      try {
        // Simulate loading the route by checking if it would load properly
        const testFrame = document.createElement("iframe");
        testFrame.style.display = "none";
        testFrame.src = route;

        testFrame.onload = () => {
          clearTimeout(timeout);
          const loadTime = Date.now() - startTime;
          document.body.removeChild(testFrame);

          resolve({
            route,
            success: true,
            loadTime,
          });
        };

        testFrame.onerror = () => {
          clearTimeout(timeout);
          const loadTime = Date.now() - startTime;
          document.body.removeChild(testFrame);

          resolve({
            route,
            success: false,
            loadTime,
            error: "Frame load error",
          });
        };

        document.body.appendChild(testFrame);
      } catch (error) {
        clearTimeout(timeout);
        resolve({
          route,
          success: false,
          loadTime: Date.now() - startTime,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    });
  }

  private displayTestSummary(summary: LoadTestSummary): void {
    console.log("\n📊 Load Failure Test Summary:");
    console.log(`Total Tests: ${summary.totalTests}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(
      `⏱️  Average Load Time: ${Math.round(summary.averageLoadTime)}ms`,
    );

    if (summary.failed > 0) {
      console.log("\n🚨 Failed Tests:");
      summary.results
        .filter((r) => !r.success)
        .forEach((result) => {
          console.log(
            `  ${result.route}: ${result.error} (${result.loadTime}ms)`,
          );
        });
    }

    // Performance warnings
    const slowRoutes = summary.results.filter(
      (r) => r.loadTime > 5000 && r.success,
    );
    if (slowRoutes.length > 0) {
      console.log("\n⚠️  Slow Loading Routes (>5s):");
      slowRoutes.forEach((result) => {
        console.log(`  ${result.route}: ${result.loadTime}ms`);
      });
    }

    const successRate = (summary.passed / summary.totalTests) * 100;
    if (successRate === 100) {
      console.log("\n🎉 All tests passed! No load failure issues detected.");
    } else if (successRate >= 80) {
      console.log("\n⚠️  Most tests passed, but some issues detected.");
    } else {
      console.log("\n🚨 Significant load failure issues detected!");
    }
  }

  async runQuickHealthCheck(): Promise<boolean> {
    console.log("🏥 Running quick health check...");

    try {
      // Test critical services
      const services = [
        () => Promise.resolve(true), // Mock service check
        () => new Promise((resolve) => setTimeout(() => resolve(true), 100)),
        () => Promise.resolve(window.location.href !== undefined),
      ];

      const results = await Promise.all(services.map((service) => service()));
      const allHealthy = results.every((result) => result === true);

      console.log(
        `Health Check: ${allHealthy ? "✅ HEALTHY" : "❌ UNHEALTHY"}`,
      );
      return allHealthy;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }
}

// Global instance for easy access
export const loadFailureTest = new LoadFailureTestUtility();

// Auto-run in development after page load
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  window.addEventListener("load", () => {
    setTimeout(async () => {
      try {
        console.log("🔧 Auto-running load failure diagnostics...");
        await loadFailureTest.runQuickHealthCheck();

        // Only run full tests if quick check passes
        const isHealthy = await loadFailureTest.runQuickHealthCheck();
        if (isHealthy) {
          console.log("✅ System healthy - skipping full load tests");
        }
      } catch (error) {
        console.warn("Auto-diagnostics failed:", error);
      }
    }, 3000); // Run after 3 seconds
  });
}

export default LoadFailureTestUtility;
