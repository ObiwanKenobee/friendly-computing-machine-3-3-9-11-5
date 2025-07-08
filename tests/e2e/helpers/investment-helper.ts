import { Page, expect } from "@playwright/test";

export interface RiskAssessmentData {
  monthlyIncome: number;
  monthlyExpenses: number;
  riskTolerance: "conservative" | "moderate" | "aggressive";
  investmentGoals: string[];
  timeHorizon: "short" | "medium" | "long";
}

export interface InvestmentData {
  amount: number;
  assetType: "healthcare" | "cultural" | "technology" | "infrastructure";
  riskLevel: "low" | "medium" | "high";
}

export class InvestmentHelper {
  constructor(private page: Page) {}

  async selectArchetype(archetypeId: string): Promise<void> {
    // Click on the specific archetype card
    const archetypeCard = this.page.locator(
      `[data-testid="archetype-${archetypeId}"]`,
    );
    await expect(archetypeCard).toBeVisible();
    await archetypeCard.click();

    // Wait for navigation to complete
    await this.page.waitForURL(`**/${archetypeId}**`);
    await this.page.waitForLoadState("networkidle");
  }

  async completeRiskAssessment(data: RiskAssessmentData): Promise<void> {
    // Fill monthly income
    const incomeInput = this.page.locator('[data-testid="monthly-income"]');
    if (await incomeInput.isVisible()) {
      await incomeInput.fill(data.monthlyIncome.toString());
    }

    // Fill monthly expenses
    const expensesInput = this.page.locator('[data-testid="monthly-expenses"]');
    if (await expensesInput.isVisible()) {
      await expensesInput.fill(data.monthlyExpenses.toString());
    }

    // Select risk tolerance
    const riskSelect = this.page.locator('[data-testid="risk-tolerance"]');
    if (await riskSelect.isVisible()) {
      await riskSelect.selectOption(data.riskTolerance);
    }

    // Select investment goals
    for (const goal of data.investmentGoals) {
      const goalCheckbox = this.page.locator(`[data-testid="goal-${goal}"]`);
      if (await goalCheckbox.isVisible()) {
        await goalCheckbox.check();
      }
    }

    // Select time horizon
    const timeHorizonSelect = this.page.locator('[data-testid="time-horizon"]');
    if (await timeHorizonSelect.isVisible()) {
      await timeHorizonSelect.selectOption(data.timeHorizon);
    }

    // Submit assessment
    const submitButton = this.page.locator(
      '[data-testid="submit-risk-assessment"]',
    );
    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Wait for processing
      await this.page.waitForTimeout(2000);
    }
  }

  async makeInvestment(data: InvestmentData): Promise<void> {
    // Find investment opportunity matching criteria
    const investmentCards = this.page.locator(
      '[data-testid="investment-card"]',
    );
    const cardCount = await investmentCards.count();

    let selectedCard;

    // Find a suitable investment card
    for (let i = 0; i < cardCount; i++) {
      const card = investmentCards.nth(i);
      const riskBadge = card.locator('[data-testid="risk-level"]');

      if (await riskBadge.isVisible()) {
        const riskText = await riskBadge.textContent();
        if (riskText?.toLowerCase().includes(data.riskLevel)) {
          selectedCard = card;
          break;
        }
      }
    }

    // If no specific match, use first card
    if (!selectedCard) {
      selectedCard = investmentCards.first();
    }

    // Click invest button on selected card
    const investButton = selectedCard.locator('[data-testid="invest-button"]');
    await expect(investButton).toBeVisible();
    await investButton.click();

    // Fill investment amount
    const amountInput = this.page.locator('[data-testid="investment-amount"]');
    if (await amountInput.isVisible()) {
      await amountInput.fill(data.amount.toString());
    }

    // Confirm investment
    const confirmButton = this.page.locator(
      '[data-testid="confirm-investment"]',
    );
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    } else {
      // Alternative submit button
      const submitButton = this.page.locator(
        '[data-testid="submit-investment"]',
      );
      if (await submitButton.isVisible()) {
        await submitButton.click();
      }
    }

    // Wait for investment confirmation
    await this.page.waitForSelector(
      '[data-testid="investment-success"], [data-testid="investment-error"]',
      {
        timeout: 10000,
      },
    );
  }

  async getPortfolioValue(): Promise<number> {
    const portfolioValueElement = this.page.locator(
      '[data-testid="portfolio-value"]',
    );
    await expect(portfolioValueElement).toBeVisible();

    const valueText = await portfolioValueElement.textContent();
    if (!valueText) return 0;

    // Extract numeric value from text like "$1,234.56"
    const numericValue = valueText.replace(/[^0-9.]/g, "");
    return parseFloat(numericValue) || 0;
  }

  async getPortfolioGrowth(): Promise<number> {
    const growthElement = this.page.locator('[data-testid="portfolio-growth"]');
    await expect(growthElement).toBeVisible();

    const growthText = await growthElement.textContent();
    if (!growthText) return 0;

    // Extract percentage value from text like "+12.4%"
    const numericValue = growthText.replace(/[^0-9.-]/g, "");
    return parseFloat(numericValue) || 0;
  }

  async getRiskScore(): Promise<number> {
    const riskElement = this.page.locator('[data-testid="risk-score"]');
    await expect(riskElement).toBeVisible();

    const riskText = await riskElement.textContent();
    if (!riskText) return 0;

    // Extract numeric value from text like "7/10" or "7.5"
    const match = riskText.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async verifyInvestmentInPortfolio(investmentName: string): Promise<boolean> {
    // Navigate to portfolio tab
    await this.page.click('[data-testid="tab-portfolio"]');

    // Look for the investment in portfolio
    const portfolioItems = this.page.locator('[data-testid="portfolio-item"]');
    const itemCount = await portfolioItems.count();

    for (let i = 0; i < itemCount; i++) {
      const item = portfolioItems.nth(i);
      const nameElement = item.locator('[data-testid="holding-name"]');

      if (await nameElement.isVisible()) {
        const nameText = await nameElement.textContent();
        if (nameText?.includes(investmentName)) {
          return true;
        }
      }
    }

    return false;
  }

  async switchLanguage(languageCode: string): Promise<void> {
    const languageSelector = this.page.locator(
      '[data-testid="language-selector"]',
    );

    if (await languageSelector.isVisible()) {
      await languageSelector.click();

      const languageOption = this.page.locator(
        `[data-testid="language-${languageCode}"]`,
      );
      if (await languageOption.isVisible()) {
        await languageOption.click();

        // Wait for language change to take effect
        await this.page.waitForTimeout(2000);
      }
    }
  }

  async testAIExplanation(): Promise<boolean> {
    const aiWidget = this.page.locator('[data-testid="explainable-ai-widget"]');

    if (await aiWidget.isVisible()) {
      await aiWidget.click();

      // Check if explanation appears
      const explanation = this.page.locator('[data-testid="ai-explanation"]');
      if (await explanation.isVisible({ timeout: 5000 })) {
        const explanationText = await explanation.textContent();
        return explanationText !== null && explanationText.length > 0;
      }
    }

    return false;
  }

  async checkHealthcareImpactMetrics(): Promise<{
    patientsServed: number;
    facilitiesSupported: number;
    impactScore: number;
  }> {
    const metrics = {
      patientsServed: 0,
      facilitiesSupported: 0,
      impactScore: 0,
    };

    // Check patients served metric
    const patientsElement = this.page.locator(
      '[data-testid="patients-served"]',
    );
    if (await patientsElement.isVisible()) {
      const patientsText = await patientsElement.textContent();
      if (patientsText) {
        const match = patientsText.match(/(\d+(?:,\d+)*)/);
        if (match) {
          metrics.patientsServed = parseInt(match[1].replace(/,/g, ""));
        }
      }
    }

    // Check facilities supported
    const facilitiesElement = this.page.locator(
      '[data-testid="facilities-supported"]',
    );
    if (await facilitiesElement.isVisible()) {
      const facilitiesText = await facilitiesElement.textContent();
      if (facilitiesText) {
        const match = facilitiesText.match(/(\d+)/);
        if (match) {
          metrics.facilitiesSupported = parseInt(match[1]);
        }
      }
    }

    // Check impact score
    const impactElement = this.page.locator('[data-testid="impact-score"]');
    if (await impactElement.isVisible()) {
      const impactText = await impactElement.textContent();
      if (impactText) {
        const match = impactText.match(/(\d+\.?\d*)/);
        if (match) {
          metrics.impactScore = parseFloat(match[1]);
        }
      }
    }

    return metrics;
  }

  async simulateNetworkError(): Promise<void> {
    // Intercept API calls and simulate network errors
    await this.page.route("**/api/**", (route) => {
      route.abort("failed");
    });
  }

  async restoreNetwork(): Promise<void> {
    // Remove network error simulation
    await this.page.unroute("**/api/**");
  }

  async testOfflineCapabilities(): Promise<boolean> {
    // Set browser offline
    await this.page.context().setOffline(true);

    // Try to perform actions
    try {
      await this.page.reload();

      // Check for offline indicator
      const offlineIndicator = this.page.locator(
        '[data-testid="offline-indicator"]',
      );
      const hasOfflineIndicator = await offlineIndicator.isVisible({
        timeout: 5000,
      });

      // Check if cached content is available
      const cachedContent = this.page.locator('[data-testid="cached-content"]');
      const hasCachedContent = await cachedContent.isVisible({ timeout: 5000 });

      return hasOfflineIndicator || hasCachedContent;
    } finally {
      // Always restore network
      await this.page.context().setOffline(false);
    }
  }

  async verifyMobileResponsiveness(): Promise<boolean> {
    // Test different mobile viewport sizes
    const viewports = [
      { width: 375, height: 667 }, // iPhone SE
      { width: 414, height: 896 }, // iPhone 11 Pro Max
      { width: 360, height: 640 }, // Galaxy S5
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);

      // Check if mobile navigation is present
      const mobileNav = this.page.locator('[data-testid="mobile-nav"]');
      if (await mobileNav.isVisible()) {
        // Test mobile navigation
        const navToggle = this.page.locator(
          '[data-testid="mobile-nav-toggle"]',
        );
        if (await navToggle.isVisible()) {
          await navToggle.click();

          const navMenu = this.page.locator('[data-testid="mobile-nav-menu"]');
          if (!(await navMenu.isVisible({ timeout: 3000 }))) {
            return false;
          }
        }
      }

      // Check if content is properly responsive
      const mainContent = this.page.locator('[data-testid="main-content"]');
      if (await mainContent.isVisible()) {
        const boundingBox = await mainContent.boundingBox();
        if (boundingBox && boundingBox.width > viewport.width) {
          return false; // Content overflows viewport
        }
      }
    }

    return true;
  }

  async capturePerformanceMetrics(): Promise<{
    loadTime: number;
    interactiveTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
  }> {
    const performanceMetrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType("paint");

      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        interactiveTime: navigation.domInteractive - navigation.navigationStart,
        firstContentfulPaint:
          paint.find((p) => p.name === "first-contentful-paint")?.startTime ||
          0,
        largestContentfulPaint: 0, // Would need LCP observer
      };
    });

    return performanceMetrics;
  }
}
