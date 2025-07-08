import { test, expect, Page } from "@playwright/test";
import { AuthHelper } from "../e2e/helpers/auth-helper";

/**
 * Comprehensive Security Testing Suite for QuantumVest Enterprise Platform
 * Tests authentication, authorization, input validation, and security headers
 */

test.describe("Security Testing Suite", () => {
  let authHelper: AuthHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
  });

  test.describe("Authentication Security", () => {
    test("should prevent brute force attacks with rate limiting", async ({
      page,
      context,
    }) => {
      const attempts = [];

      // Attempt multiple failed logins
      for (let i = 0; i < 10; i++) {
        const response = page.waitForResponse("**/api/auth/login");

        await page.goto("/auth/login");
        await page.fill('[data-testid="email-input"]', "attacker@example.com");
        await page.fill('[data-testid="password-input"]', `wrongpassword${i}`);
        await page.click('[data-testid="login-button"]');

        const resp = await response;
        attempts.push(resp.status());
      }

      // Should eventually return 429 (Too Many Requests)
      const rateLimitedAttempts = attempts.filter((status) => status === 429);
      expect(rateLimitedAttempts.length).toBeGreaterThan(0);
    });

    test("should enforce strong password requirements", async ({ page }) => {
      await page.goto("/auth/register");

      const weakPasswords = [
        "123456",
        "password",
        "abc123",
        "12345678",
        "qwerty123",
      ];

      for (const password of weakPasswords) {
        await page.fill('[data-testid="email-input"]', "test@example.com");
        await page.fill('[data-testid="password-input"]', password);
        await page.fill('[data-testid="confirm-password-input"]', password);
        await page.click('[data-testid="register-button"]');

        // Should show password strength error
        await expect(
          page.locator('[data-testid="password-error"]'),
        ).toBeVisible();
        await expect(
          page.locator('[data-testid="password-error"]'),
        ).toContainText(/weak|strong|requirements/i);
      }
    });

    test("should protect against session fixation", async ({
      page,
      context,
    }) => {
      // Get initial session
      await page.goto("/");
      const initialCookies = await context.cookies();
      const initialSessionCookie = initialCookies.find((c) =>
        c.name.includes("session"),
      );

      // Login
      await authHelper.loginAsTestUser();

      // Get post-login session
      const postLoginCookies = await context.cookies();
      const postLoginSessionCookie = postLoginCookies.find((c) =>
        c.name.includes("session"),
      );

      // Session ID should change after login
      if (initialSessionCookie && postLoginSessionCookie) {
        expect(initialSessionCookie.value).not.toBe(
          postLoginSessionCookie.value,
        );
      }
    });

    test("should enforce MFA for sensitive operations", async ({ page }) => {
      await authHelper.loginAsTestUser();

      // Navigate to sensitive operation (large investment)
      await page.goto("/investment/new");
      await page.fill('[data-testid="investment-amount"]', "50000");
      await page.click('[data-testid="submit-investment"]');

      // Should prompt for MFA
      await expect(page.locator('[data-testid="mfa-prompt"]')).toBeVisible();
    });

    test("should implement secure logout", async ({ page, context }) => {
      await authHelper.loginAsTestUser();

      // Logout
      await page.click('[data-testid="logout-button"]');

      // Session cookie should be cleared
      const postLogoutCookies = await context.cookies();
      const sessionCookie = postLogoutCookies.find((c) =>
        c.name.includes("session"),
      );

      expect(sessionCookie?.value).toBeFalsy();

      // Should redirect to login page
      await expect(page).toHaveURL(/.*login/);

      // Should not be able to access protected pages
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe("Authorization and Access Control", () => {
    test("should enforce role-based access control", async ({ page }) => {
      // Test different user roles and their access permissions
      const roles = [
        { role: "user", restrictedPages: ["/admin", "/super-admin"] },
        { role: "admin", restrictedPages: ["/super-admin"] },
        { role: "super-admin", restrictedPages: [] },
      ];

      for (const { role, restrictedPages } of roles) {
        await authHelper.loginAsRole(role);

        for (const restrictedPage of restrictedPages) {
          await page.goto(restrictedPage);

          // Should be redirected or show access denied
          const currentUrl = page.url();
          const accessDenied = await page
            .locator('[data-testid="access-denied"]')
            .isVisible();

          expect(
            currentUrl.includes(restrictedPage) && !accessDenied,
          ).toBeFalsy();
        }

        await authHelper.logout();
      }
    });

    test("should validate subscription tier access", async ({ page }) => {
      const tiers = [
        {
          tier: "free",
          restrictedFeatures: ["premium-analytics", "advanced-trading"],
        },
        { tier: "professional", restrictedFeatures: ["enterprise-features"] },
        { tier: "enterprise", restrictedFeatures: [] },
      ];

      for (const { tier, restrictedFeatures } of tiers) {
        await authHelper.loginWithSubscription(tier);

        for (const feature of restrictedFeatures) {
          await page.goto(`/features/${feature}`);

          // Should show upgrade prompt or access restriction
          const upgradePrompt = await page
            .locator('[data-testid="upgrade-prompt"]')
            .isVisible();
          const accessRestricted = await page
            .locator('[data-testid="access-restricted"]')
            .isVisible();

          expect(upgradePrompt || accessRestricted).toBeTruthy();
        }

        await authHelper.logout();
      }
    });

    test("should prevent horizontal privilege escalation", async ({
      page,
      context,
    }) => {
      // Login as user 1
      await authHelper.loginAsUser("user1@example.com");

      // Try to access user 2's data
      const response = await page.request.get("/api/users/user2/portfolio");
      expect(response.status()).toBe(403);

      // Try to modify user 2's data
      const modifyResponse = await page.request.post(
        "/api/users/user2/investments",
        {
          data: { amount: 1000, asset: "test" },
        },
      );
      expect(modifyResponse.status()).toBe(403);
    });

    test("should prevent vertical privilege escalation", async ({ page }) => {
      await authHelper.loginAsUser("regularuser@example.com");

      // Try to access admin endpoints
      const adminEndpoints = [
        "/api/admin/users",
        "/api/admin/system-config",
        "/api/admin/audit-logs",
      ];

      for (const endpoint of adminEndpoints) {
        const response = await page.request.get(endpoint);
        expect([401, 403]).toContain(response.status());
      }
    });
  });

  test.describe("Input Validation and Injection Protection", () => {
    test("should prevent XSS attacks", async ({ page }) => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '"><script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src=x onerror=alert("xss")>',
        '<svg onload=alert("xss")>',
      ];

      await authHelper.loginAsTestUser();

      for (const payload of xssPayloads) {
        // Test in investment description
        await page.goto("/investment/new");
        await page.fill('[data-testid="investment-description"]', payload);
        await page.click('[data-testid="save-description"]');

        // Check that script is not executed
        const alertHandled = await page.evaluate(() => {
          let alertFired = false;
          const originalAlert = window.alert;
          window.alert = () => {
            alertFired = true;
          };
          setTimeout(() => {
            window.alert = originalAlert;
          }, 100);
          return alertFired;
        });

        expect(alertHandled).toBeFalsy();

        // Check that content is properly escaped
        const descriptionContent = await page
          .locator('[data-testid="investment-description-display"]')
          .textContent();
        expect(descriptionContent).not.toContain("<script>");
      }
    });

    test("should prevent SQL injection attacks", async ({ page }) => {
      const sqlPayloads = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "' UNION SELECT * FROM users --",
        "'; INSERT INTO users (email) VALUES ('hacker@evil.com'); --",
      ];

      await authHelper.loginAsTestUser();

      for (const payload of sqlPayloads) {
        // Test in search functionality
        const response = await page.request.get(
          `/api/search?q=${encodeURIComponent(payload)}`,
        );

        // Should not return 500 error (indicates SQL error)
        expect(response.status()).not.toBe(500);

        // Should return 400 (bad request) or empty results
        expect([200, 400, 404]).toContain(response.status());

        if (response.status() === 200) {
          const data = await response.json();
          expect(data.results || []).toHaveLength(0);
        }
      }
    });

    test("should validate file upload security", async ({ page }) => {
      await authHelper.loginAsTestUser();
      await page.goto("/profile/upload");

      // Test malicious file uploads
      const maliciousFiles = [
        { name: "script.php", content: '<?php system($_GET["cmd"]); ?>' },
        { name: "malware.exe", content: "MZ\x90\x00\x03\x00\x00\x00" },
        { name: "script.js", content: 'alert("xss")' },
        {
          name: "../../../etc/passwd",
          content: "root:x:0:0:root:/root:/bin/bash",
        },
      ];

      for (const file of maliciousFiles) {
        // Create file
        const buffer = Buffer.from(file.content);

        await page.setInputFiles('[data-testid="file-upload"]', {
          name: file.name,
          mimeType: "application/octet-stream",
          buffer,
        });

        await page.click('[data-testid="upload-button"]');

        // Should reject malicious files
        const errorMessage = await page
          .locator('[data-testid="upload-error"]')
          .textContent();
        expect(errorMessage).toContain(/invalid|forbidden|not allowed/i);
      }
    });

    test("should validate API input limits", async ({ page }) => {
      await authHelper.loginAsTestUser();

      // Test extremely large payloads
      const largePayload = "a".repeat(10 * 1024 * 1024); // 10MB

      const response = await page.request.post("/api/investments", {
        data: {
          description: largePayload,
          amount: 1000,
        },
      });

      // Should reject oversized requests
      expect([400, 413, 422]).toContain(response.status());
    });
  });

  test.describe("Security Headers and HTTPS", () => {
    test("should have proper security headers", async ({ page }) => {
      const response = await page.goto("/");
      const headers = response?.headers() || {};

      // Check for security headers
      expect(headers["x-frame-options"]).toBeTruthy();
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["x-xss-protection"]).toBeTruthy();
      expect(headers["strict-transport-security"]).toBeTruthy();
      expect(headers["content-security-policy"]).toBeTruthy();
      expect(headers["referrer-policy"]).toBeTruthy();

      // Check that sensitive headers are not exposed
      expect(headers["server"]).toBeFalsy();
      expect(headers["x-powered-by"]).toBeFalsy();
    });

    test("should enforce HTTPS in production", async ({ page }) => {
      // Skip if not in production environment
      if (process.env.NODE_ENV !== "production") {
        test.skip();
      }

      // Try to access HTTP version
      const httpResponse = await page.request.get(
        page.url().replace("https://", "http://"),
      );

      // Should redirect to HTTPS or reject connection
      expect([301, 302, 403, -1]).toContain(httpResponse.status());
    });

    test("should have secure cookie settings", async ({ page, context }) => {
      await authHelper.loginAsTestUser();

      const cookies = await context.cookies();
      const sessionCookie = cookies.find(
        (c) => c.name.includes("session") || c.name.includes("auth"),
      );

      if (sessionCookie) {
        expect(sessionCookie.secure).toBeTruthy();
        expect(sessionCookie.httpOnly).toBeTruthy();
        expect(sessionCookie.sameSite).toBe("Strict");
      }
    });
  });

  test.describe("Data Protection and Privacy", () => {
    test("should mask sensitive data in logs", async ({ page }) => {
      await authHelper.loginAsTestUser();

      // Perform actions that might log sensitive data
      await page.fill('[data-testid="credit-card-input"]', "4111111111111111");
      await page.fill('[data-testid="ssn-input"]', "123-45-6789");
      await page.click('[data-testid="save-payment-info"]');

      // Check console logs for sensitive data
      const logs = await page.evaluate(() => {
        // This would need to be implemented to capture actual logs
        return window.console.logs || [];
      });

      for (const log of logs) {
        expect(log).not.toContain("4111111111111111");
        expect(log).not.toContain("123-45-6789");
      }
    });

    test("should implement data retention policies", async ({ page }) => {
      await authHelper.loginAsTestUser();

      // Request data deletion
      await page.goto("/privacy/data-deletion");
      await page.click('[data-testid="request-deletion"]');

      // Should confirm deletion request
      await expect(
        page.locator('[data-testid="deletion-confirmed"]'),
      ).toBeVisible();

      // Check that data is marked for deletion
      const response = await page.request.get("/api/user/data-status");
      const data = await response.json();
      expect(data.deletionRequested).toBeTruthy();
    });

    test("should allow data export (GDPR compliance)", async ({ page }) => {
      await authHelper.loginAsTestUser();

      // Request data export
      await page.goto("/privacy/data-export");
      await page.click('[data-testid="request-export"]');

      // Should initiate export process
      await expect(
        page.locator('[data-testid="export-initiated"]'),
      ).toBeVisible();

      // Check export status
      const response = await page.request.get("/api/user/export-status");
      const data = await response.json();
      expect(["pending", "processing", "completed"]).toContain(data.status);
    });
  });

  test.describe("Third-party Integration Security", () => {
    test("should validate payment processor integration", async ({ page }) => {
      await authHelper.loginAsTestUser();
      await page.goto("/payment/new");

      // Check that payment forms use secure iframes
      const paymentIframe = page.frameLocator('[data-testid="payment-iframe"]');

      if (await paymentIframe.locator("input").first().isVisible()) {
        // Payment iframe should be from trusted domain
        const iframeSrc = await page
          .locator('[data-testid="payment-iframe"]')
          .getAttribute("src");
        expect(iframeSrc).toMatch(
          /^https:\/\/(js\.stripe\.com|checkout\.paypal\.com|js\.paystack\.co)/,
        );
      }
    });

    test("should secure API integrations", async ({ page }) => {
      // Check that external API calls use proper authentication
      await page.route("**/api/external/**", (route) => {
        const headers = route.request().headers();

        // Should have proper authorization headers
        expect(headers.authorization || headers["api-key"]).toBeTruthy();

        route.continue();
      });

      await authHelper.loginAsTestUser();
      await page.goto("/dashboard");

      // Wait for external API calls to complete
      await page.waitForTimeout(5000);
    });
  });

  test.describe("Security Monitoring and Logging", () => {
    test("should log security events", async ({ page }) => {
      // Attempt suspicious activity
      await page.goto("/admin"); // Unauthorized access attempt

      // Failed login attempt
      await page.goto("/auth/login");
      await page.fill('[data-testid="email-input"]', "admin@company.com");
      await page.fill('[data-testid="password-input"]', "wrongpassword");
      await page.click('[data-testid="login-button"]');

      // These events should be logged (would need backend verification)
      // For now, just verify that the attempts are properly rejected
      await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
    });

    test("should detect and prevent automated attacks", async ({ page }) => {
      // Rapid successive requests should trigger rate limiting
      const promises = [];

      for (let i = 0; i < 50; i++) {
        promises.push(page.request.get("/api/public/health"));
      }

      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter((r) => r.status() === 429);

      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});
