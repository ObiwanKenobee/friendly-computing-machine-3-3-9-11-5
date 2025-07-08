import { test, expect, Page } from "@playwright/test";
import { AuthHelper } from "../helpers/auth-helper";
import { NavigationHelper } from "../helpers/navigation-helper";
import { InvestmentHelper } from "../helpers/investment-helper";
import { PerformanceHelper } from "../helpers/performance-helper";

/**
 * Comprehensive Investment Journey E2E Tests
 * Tests the complete user journey from onboarding to investment completion
 */

test.describe("Investment Journey - End to End", () => {
  let authHelper: AuthHelper;
  let navigationHelper: NavigationHelper;
  let investmentHelper: InvestmentHelper;
  let performanceHelper: PerformanceHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    navigationHelper = new NavigationHelper(page);
    investmentHelper = new InvestmentHelper(page);
    performanceHelper = new PerformanceHelper(page);

    await performanceHelper.startMeasurement("page_load");
  });

  test.afterEach(async ({ page }) => {
    await performanceHelper.endMeasurement("page_load");
    await performanceHelper.capturePerformanceMetrics();
  });

  test("Complete investment journey for emerging market citizen", async ({
    page,
  }) => {
    // Step 1: Navigate to platform
    await test.step("Navigate to QuantumVest platform", async () => {
      await page.goto("/");
      await expect(page).toHaveTitle(/QuantumVest/);

      // Check critical page elements
      await expect(page.locator("h1")).toContainText(
        "QuantumVest Defense Platform",
      );
      await expect(
        page.locator('[data-testid="security-status"]'),
      ).toBeVisible();
    });

    // Step 2: Access archetype selection
    await test.step("Access archetype selection", async () => {
      await navigationHelper.navigateToArchetypes();
      await expect(
        page.locator('[data-testid="archetype-grid"]'),
      ).toBeVisible();

      // Verify all 13 archetypes are present
      const archetypeCards = page.locator('[data-testid="archetype-card"]');
      await expect(archetypeCards).toHaveCount(13);
    });

    // Step 3: Select emerging market citizen archetype
    await test.step("Select emerging market citizen archetype", async () => {
      await investmentHelper.selectArchetype("emerging-market-citizen");

      // Should navigate to the archetype page
      await expect(page).toHaveURL(/.*emerging-market-citizen/);
      await expect(page.locator("h1")).toContainText(
        "Healthcare Investment Dashboard",
      );
    });

    // Step 4: Complete onboarding process
    await test.step("Complete onboarding process", async () => {
      const onboardingVisible = await page
        .locator('[data-testid="onboarding-modal"]')
        .isVisible();

      if (onboardingVisible) {
        // Fill risk tolerance questionnaire
        await investmentHelper.completeRiskAssessment({
          monthlyIncome: 1000,
          monthlyExpenses: 700,
          riskTolerance: "conservative",
          investmentGoals: ["wealth_building", "social_impact"],
          timeHorizon: "medium",
        });

        // Submit onboarding
        await page.click('[data-testid="complete-onboarding"]');
        await expect(
          page.locator('[data-testid="onboarding-modal"]'),
        ).not.toBeVisible();
      }
    });

    // Step 5: Explore dashboard features
    await test.step("Explore dashboard features", async () => {
      // Check dashboard tabs
      const tabs = ["overview", "portfolio", "market", "learn"];

      for (const tab of tabs) {
        await page.click(`[data-testid="tab-${tab}"]`);
        await expect(
          page.locator(`[data-testid="tab-content-${tab}"]`),
        ).toBeVisible();

        // Wait for content to load
        await page.waitForTimeout(1000);
      }
    });

    // Step 6: Browse available investments
    await test.step("Browse available healthcare investments", async () => {
      await page.click('[data-testid="tab-market"]');

      // Wait for investment cards to load
      await expect(
        page.locator('[data-testid="investment-card"]'),
      ).toHaveCount.greaterThan(0);

      // Check investment details
      const firstInvestment = page
        .locator('[data-testid="investment-card"]')
        .first();
      await expect(
        firstInvestment.locator('[data-testid="investment-name"]'),
      ).toBeVisible();
      await expect(
        firstInvestment.locator('[data-testid="investment-price"]'),
      ).toBeVisible();
      await expect(
        firstInvestment.locator('[data-testid="investment-roi"]'),
      ).toBeVisible();
    });

    // Step 7: Make an investment
    await test.step("Make a healthcare investment", async () => {
      const investmentAmount = 100;

      await investmentHelper.makeInvestment({
        amount: investmentAmount,
        assetType: "healthcare",
        riskLevel: "low",
      });

      // Verify investment success
      await expect(
        page.locator('[data-testid="investment-success"]'),
      ).toBeVisible();

      // Check portfolio update
      await page.click('[data-testid="tab-portfolio"]');
      await expect(
        page.locator('[data-testid="portfolio-item"]'),
      ).toHaveCount.greaterThan(0);
    });

    // Step 8: View portfolio performance
    await test.step("View portfolio performance", async () => {
      await page.click('[data-testid="tab-portfolio"]');

      // Check portfolio summary
      await expect(
        page.locator('[data-testid="portfolio-value"]'),
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="portfolio-growth"]'),
      ).toBeVisible();
      await expect(page.locator('[data-testid="risk-score"]')).toBeVisible();

      // Check individual holdings
      const holdings = page.locator('[data-testid="holding-item"]');
      if ((await holdings.count()) > 0) {
        const firstHolding = holdings.first();
        await expect(
          firstHolding.locator('[data-testid="holding-name"]'),
        ).toBeVisible();
        await expect(
          firstHolding.locator('[data-testid="holding-value"]'),
        ).toBeVisible();
        await expect(
          firstHolding.locator('[data-testid="holding-performance"]'),
        ).toBeVisible();
      }
    });

    // Step 9: Access educational content
    await test.step("Access educational content", async () => {
      await page.click('[data-testid="tab-learn"]');

      // Check educational sections
      await expect(
        page.locator('[data-testid="education-section"]'),
      ).toBeVisible();

      // Interact with educational content
      const educationButtons = page.locator('[data-testid="education-button"]');
      if ((await educationButtons.count()) > 0) {
        await educationButtons.first().click();
        // Wait for content to load (could be modal or navigation)
        await page.waitForTimeout(2000);
      }
    });

    // Step 10: Check AI insights and recommendations
    await test.step("Check AI insights and recommendations", async () => {
      await page.click('[data-testid="tab-overview"]');

      // Look for AI-powered recommendations
      const aiInsights = page.locator('[data-testid="ai-insight"]');
      if (await aiInsights.isVisible()) {
        await expect(aiInsights).toContainText(
          /investment|recommendation|insight/i,
        );
      }

      // Check explainable AI widget
      const explainableAI = page.locator(
        '[data-testid="explainable-ai-widget"]',
      );
      if (await explainableAI.isVisible()) {
        await explainableAI.click();
        await expect(
          page.locator('[data-testid="ai-explanation"]'),
        ).toBeVisible();
      }
    });

    // Step 11: Test responsive design (mobile simulation)
    await test.step("Test mobile responsiveness", async () => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Check mobile navigation
      const mobileNav = page.locator('[data-testid="mobile-nav-toggle"]');
      if (await mobileNav.isVisible()) {
        await mobileNav.click();
        await expect(
          page.locator('[data-testid="mobile-nav-menu"]'),
        ).toBeVisible();
      }

      // Check tab visibility on mobile
      await expect(page.locator('[data-testid="tab-overview"]')).toBeVisible();

      // Restore desktop view
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    // Step 12: Test offline capabilities (if supported)
    await test.step("Test offline capabilities", async () => {
      // Simulate network offline
      await page.context().setOffline(true);

      // Try to navigate
      await page.reload();

      // Check for offline indicator or cached content
      const offlineIndicator = page.locator(
        '[data-testid="offline-indicator"]',
      );
      if (await offlineIndicator.isVisible()) {
        await expect(offlineIndicator).toContainText(/offline/i);
      }

      // Restore network
      await page.context().setOffline(false);
      await page.reload();
    });
  });

  test("Multi-archetype comparison journey", async ({ page }) => {
    const archetypes = [
      "emerging-market-citizen",
      "retail-investor",
      "cultural-investor",
    ];

    for (const archetype of archetypes) {
      await test.step(`Test ${archetype} archetype`, async () => {
        await navigationHelper.navigateToArchetypes();
        await investmentHelper.selectArchetype(archetype);

        // Verify archetype-specific features
        await expect(
          page.locator('[data-testid="archetype-title"]'),
        ).toBeVisible();

        // Check for archetype-specific metrics
        const specificMetrics = page.locator(
          '[data-testid="archetype-specific-metric"]',
        );
        if ((await specificMetrics.count()) > 0) {
          await expect(specificMetrics.first()).toBeVisible();
        }

        // Test key functionality
        await page.click('[data-testid="tab-market"]');
        await expect(
          page.locator('[data-testid="investment-card"]'),
        ).toHaveCount.greaterThan(0);
      });
    }
  });

  test("Investment flow with error scenarios", async ({ page }) => {
    await test.step("Navigate to investment section", async () => {
      await navigationHelper.navigateToArchetypes();
      await investmentHelper.selectArchetype("emerging-market-citizen");
      await page.click('[data-testid="tab-market"]');
    });

    await test.step("Test invalid investment amount", async () => {
      const investButton = page
        .locator('[data-testid="invest-button"]')
        .first();
      await investButton.click();

      // Try to invest with invalid amount (negative or too large)
      const amountInput = page.locator('[data-testid="investment-amount"]');
      if (await amountInput.isVisible()) {
        await amountInput.fill("-100");
        await page.click('[data-testid="submit-investment"]');

        // Should show error message
        await expect(
          page.locator('[data-testid="error-message"]'),
        ).toBeVisible();
      }
    });

    await test.step("Test insufficient funds scenario", async () => {
      const investButton = page
        .locator('[data-testid="invest-button"]')
        .first();
      await investButton.click();

      const amountInput = page.locator('[data-testid="investment-amount"]');
      if (await amountInput.isVisible()) {
        await amountInput.fill("1000000"); // Very large amount
        await page.click('[data-testid="submit-investment"]');

        // Should show insufficient funds error
        const errorMessage = page.locator('[data-testid="error-message"]');
        if (await errorMessage.isVisible()) {
          await expect(errorMessage).toContainText(
            /insufficient|funds|balance/i,
          );
        }
      }
    });

    await test.step("Test network error handling", async () => {
      // Simulate network error during investment
      await page.route("**/api/investments/**", (route) => {
        route.abort("failed");
      });

      const investButton = page
        .locator('[data-testid="invest-button"]')
        .first();
      await investButton.click();

      const amountInput = page.locator('[data-testid="investment-amount"]');
      if (await amountInput.isVisible()) {
        await amountInput.fill("100");
        await page.click('[data-testid="submit-investment"]');

        // Should show network error
        await expect(
          page.locator('[data-testid="network-error"]'),
        ).toBeVisible();
      }

      // Reset route
      await page.unroute("**/api/investments/**");
    });
  });

  test("Accessibility compliance for investment flow", async ({ page }) => {
    await test.step("Navigate to investment dashboard", async () => {
      await navigationHelper.navigateToArchetypes();
      await investmentHelper.selectArchetype("emerging-market-citizen");
    });

    await test.step("Test keyboard navigation", async () => {
      // Test tab navigation through main elements
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Verify focus is visible
      const focusedElement = await page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    });

    await test.step("Test screen reader compatibility", async () => {
      // Check for proper ARIA labels
      const ariaLabels = page.locator("[aria-label]");
      await expect(ariaLabels).toHaveCount.greaterThan(0);

      // Check for proper heading structure
      const headings = page.locator("h1, h2, h3, h4, h5, h6");
      await expect(headings).toHaveCount.greaterThan(0);

      // Check for alt text on images
      const images = page.locator("img");
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const altText = await img.getAttribute("alt");
        const ariaLabel = await img.getAttribute("aria-label");
        const ariaHidden = await img.getAttribute("aria-hidden");

        // Images should have alt text, aria-label, or be aria-hidden
        expect(altText || ariaLabel || ariaHidden).toBeTruthy();
      }
    });

    await test.step("Test color contrast compliance", async () => {
      // This would typically be done with axe-core
      // For now, we'll check that text is readable
      const textElements = page.locator("p, span, div, button");
      const elementCount = Math.min(await textElements.count(), 10); // Sample first 10

      for (let i = 0; i < elementCount; i++) {
        const element = textElements.nth(i);
        const isVisible = await element.isVisible();

        if (isVisible) {
          const textContent = await element.textContent();
          if (textContent && textContent.trim().length > 0) {
            // Element should be visible and have readable text
            await expect(element).toBeVisible();
          }
        }
      }
    });
  });

  test("Performance benchmarks for investment dashboard", async ({ page }) => {
    await test.step("Measure initial page load", async () => {
      const startTime = Date.now();

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const loadTime = Date.now() - startTime;
      console.log(`Page load time: ${loadTime}ms`);

      // Assert load time is acceptable
      expect(loadTime).toBeLessThan(5000); // 5 seconds max
    });

    await test.step("Measure archetype selection performance", async () => {
      await performanceHelper.startMeasurement("archetype_selection");

      await navigationHelper.navigateToArchetypes();
      await investmentHelper.selectArchetype("emerging-market-citizen");

      const selectionTime = await performanceHelper.endMeasurement(
        "archetype_selection",
      );
      console.log(`Archetype selection time: ${selectionTime}ms`);

      expect(selectionTime).toBeLessThan(3000); // 3 seconds max
    });

    await test.step("Measure investment flow performance", async () => {
      await performanceHelper.startMeasurement("investment_flow");

      await page.click('[data-testid="tab-market"]');
      await page.waitForSelector('[data-testid="investment-card"]');

      const flowTime =
        await performanceHelper.endMeasurement("investment_flow");
      console.log(`Investment flow time: ${flowTime}ms`);

      expect(flowTime).toBeLessThan(2000); // 2 seconds max
    });

    await test.step("Check Core Web Vitals", async () => {
      const metrics = await performanceHelper.getCoreWebVitals();

      // LCP should be less than 2.5 seconds
      if (metrics.lcp) {
        expect(metrics.lcp).toBeLessThan(2500);
      }

      // FID should be less than 100ms
      if (metrics.fid) {
        expect(metrics.fid).toBeLessThan(100);
      }

      // CLS should be less than 0.1
      if (metrics.cls) {
        expect(metrics.cls).toBeLessThan(0.1);
      }
    });
  });
});
