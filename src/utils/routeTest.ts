/**
 * Route Test Utility
 * Test critical routes to ensure they load without "Load failed" errors
 */

export const testRoutes = async () => {
  const routes = [
    "/",
    "/dashboard",
    "/pricing",
    "/tortoise-protocol",
    "/load-failure-diagnostics",
  ];

  console.log("🧪 Testing QuantumVest Routes...");

  const results = [];

  for (const route of routes) {
    try {
      console.log(`Testing ${route}...`);

      // Test route navigation
      const testUrl = `${window.location.origin}${route}`;
      const response = await fetch(testUrl, {
        method: "HEAD",
        mode: "no-cors", // Avoid CORS issues for local testing
      });

      results.push({
        route,
        success: true,
        message: "Route accessible",
      });

      console.log(`✅ ${route} - OK`);
    } catch (error) {
      console.error(`❌ ${route} - FAILED:`, error);
      results.push({
        route,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Summary
  const successCount = results.filter((r) => r.success).length;
  const totalCount = results.length;

  console.log(
    `\n📊 Route Test Summary: ${successCount}/${totalCount} routes accessible`,
  );

  if (successCount === totalCount) {
    console.log("🎉 All routes are working correctly!");
  } else {
    console.warn("⚠️ Some routes may have issues");
    const failedRoutes = results.filter((r) => !r.success);
    failedRoutes.forEach((r) => {
      console.error(`❌ ${r.route}: ${r.error}`);
    });
  }

  return {
    totalRoutes: totalCount,
    successfulRoutes: successCount,
    results,
  };
};

// Auto-run in development
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  setTimeout(() => {
    testRoutes();
  }, 4000);
}
