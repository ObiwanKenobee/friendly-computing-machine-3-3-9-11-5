import PaymentProcessingService from "./paymentProcessingService";
import CiscoXDRService from "./ciscoXDRService";

export interface PricingTier {
  id: string;
  name: string;
  price: {
    monthly: number;
    annual: number;
  };
  currency: string;
  features: string[];
  limits: {
    users: number;
    apiCalls: number;
    storage: string;
    support: string;
  };
  popular?: boolean;
  enterprise?: boolean;
}

export interface PaymentPlan {
  tierId: string;
  billingCycle: "monthly" | "annual";
  amount: number;
  currency: string;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
}

export interface SubscriptionStatus {
  isActive: boolean;
  tier: string;
  nextBillingDate: Date;
  paymentMethod: "paypal" | "paystack";
  status: "active" | "pending" | "cancelled" | "past_due";
  usage: {
    users: number;
    apiCalls: number;
    storageUsed: string;
  };
}

export interface PaymentEvent {
  id: string;
  type:
    | "subscription_created"
    | "payment_successful"
    | "payment_failed"
    | "subscription_cancelled";
  userId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  metadata: any;
}

class EnterprisePaymentService {
  private pricingTiers: PricingTier[] = [
    {
      id: "basic",
      name: "Basic",
      price: { monthly: 29, annual: 290 },
      currency: "USD",
      features: [
        "Core Analytics Dashboard",
        "Basic Security Monitoring",
        "10 Language Support",
        "Email Support",
      ],
      limits: {
        users: 5,
        apiCalls: 1000,
        storage: "1GB",
        support: "Email",
      },
    },
    {
      id: "professional",
      name: "Professional",
      price: { monthly: 99, annual: 990 },
      currency: "USD",
      features: [
        "Advanced Analytics & AI",
        "Enhanced Security Suite",
        "100+ Languages Support",
        "Cultural Investment Tools",
        "Priority Support",
      ],
      limits: {
        users: 25,
        apiCalls: 10000,
        storage: "10GB",
        support: "Priority Email + Chat",
      },
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: { monthly: 299, annual: 2990 },
      currency: "USD",
      features: [
        "Full Platform Access",
        "Cisco XDR Security",
        "7000+ Languages Support",
        "Regional Sovereignty Tools",
        "Custom Integrations",
        "24/7 Phone Support",
      ],
      limits: {
        users: 100,
        apiCalls: 100000,
        storage: "100GB",
        support: "24/7 Phone + Dedicated Manager",
      },
      enterprise: true,
    },
    {
      id: "quantum",
      name: "Quantum",
      price: { monthly: 999, annual: 9990 },
      currency: "USD",
      features: [
        "Everything in Enterprise",
        "Quantum Computing Access",
        "Global Innovation Cycles",
        "White-label Solutions",
        "Custom Development",
        "Dedicated Infrastructure",
      ],
      limits: {
        users: -1, // Unlimited
        apiCalls: -1, // Unlimited
        storage: "Unlimited",
        support: "Dedicated Team",
      },
      enterprise: true,
    },
  ];

  private paymentEvents: PaymentEvent[] = [];
  private subscriptions: Map<string, SubscriptionStatus> = new Map();

  // Pricing Methods
  getPricingTiers(): PricingTier[] {
    return this.pricingTiers;
  }

  getTierById(tierId: string): PricingTier | undefined {
    return this.pricingTiers.find((tier) => tier.id === tierId);
  }

  calculatePlan(
    tierId: string,
    billingCycle: "monthly" | "annual",
    currency: string = "USD",
  ): PaymentPlan {
    const tier = this.getTierById(tierId);
    if (!tier) {
      throw new Error("Invalid pricing tier");
    }

    const baseAmount = tier.price[billingCycle];
    const discountAmount = billingCycle === "annual" ? baseAmount * 0.1 : 0; // 10% annual discount
    const taxAmount = this.calculateTax(baseAmount, currency);
    const totalAmount = baseAmount - discountAmount + taxAmount;

    return {
      tierId,
      billingCycle,
      amount: baseAmount,
      currency,
      taxAmount,
      discountAmount,
      totalAmount,
    };
  }

  // Payment Processing
  async processPayment(
    userId: string,
    plan: PaymentPlan,
    paymentMethod: "paypal" | "paystack",
    paymentData: any,
  ): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    try {
      // Security validation
      await this.validatePaymentSecurity(userId, paymentData);

      let result;
      if (paymentMethod === "paypal") {
        result = await this.processPayPalPayment(userId, plan, paymentData);
      } else if (paymentMethod === "paystack") {
        result = await this.processPaystackPayment(userId, plan, paymentData);
      } else {
        throw new Error("Invalid payment method");
      }

      if (result.success) {
        // Create subscription
        await this.createSubscription(
          userId,
          plan,
          paymentMethod,
          result.subscriptionId,
        );

        // Log payment event
        await this.logPaymentEvent({
          type: "payment_successful",
          userId,
          amount: plan.totalAmount,
          currency: plan.currency,
          metadata: {
            plan,
            paymentMethod,
            subscriptionId: result.subscriptionId,
          },
        });

        // Update user access
        await this.updateUserAccess(userId, plan.tierId);
      }

      return result;
    } catch (error) {
      console.error("Payment processing failed:", error);

      await this.logPaymentEvent({
        type: "payment_failed",
        userId,
        amount: plan.totalAmount,
        currency: plan.currency,
        metadata: { plan, paymentMethod, error: error.message },
      });

      return { success: false, error: error.message };
    }
  }

  private async processPayPalPayment(
    userId: string,
    plan: PaymentPlan,
    paymentData: any,
  ): Promise<{ success: boolean; subscriptionId?: string }> {
    try {
      await PaymentProcessingService.getInstance().createPayPalSubscription({
        planId: plan.tierId,
        amount: plan.totalAmount,
        currency: plan.currency,
        billingCycle: plan.billingCycle,
        userId,
        customData: paymentData,
      });

      return {
        success: true,
        subscriptionId: subscriptionResult.subscriptionId,
      };
    } catch (error) {
      console.error("PayPal payment failed:", error);
      throw error;
    }
  }

  private async processPaystackPayment(
    userId: string,
    plan: PaymentPlan,
    paymentData: any,
  ): Promise<{ success: boolean; subscriptionId?: string }> {
    try {
      await PaymentProcessingService.getInstance().createPaystackSubscription({
        planId: plan.tierId,
        amount: plan.totalAmount * 100, // Paystack uses kobo
        currency: plan.currency,
        billingCycle: plan.billingCycle,
        userId,
        customData: paymentData,
      });

      return {
        success: true,
        subscriptionId: subscriptionResult.subscriptionId,
      };
    } catch (error) {
      console.error("Paystack payment failed:", error);
      throw error;
    }
  }

  // Subscription Management
  private async createSubscription(
    userId: string,
    plan: PaymentPlan,
    paymentMethod: "paypal" | "paystack",
    subscriptionId: string,
  ): Promise<void> {
    const nextBillingDate = this.calculateNextBillingDate(plan.billingCycle);

    const subscription: SubscriptionStatus = {
      isActive: true,
      tier: plan.tierId,
      nextBillingDate,
      paymentMethod,
      status: "active",
      usage: {
        users: 0,
        apiCalls: 0,
        storageUsed: "0MB",
      },
    };

    this.subscriptions.set(userId, subscription);

    // Save to database
    await this.saveSubscriptionToDatabase(userId, subscription, subscriptionId);
  }

  async getSubscriptionStatus(
    userId: string,
  ): Promise<SubscriptionStatus | null> {
    let subscription = this.subscriptions.get(userId);

    if (!subscription) {
      // Try to load from database
      subscription = await this.loadSubscriptionFromDatabase(userId);
      if (subscription) {
        this.subscriptions.set(userId, subscription);
      }
    }

    // Validate with payment provider
    if (subscription) {
      await this.validateSubscriptionWithProvider(userId, subscription);
    }

    return subscription;
  }

  async updateSubscription(
    userId: string,
    newTierId: string,
    billingCycle: "monthly" | "annual",
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const currentSubscription = await this.getSubscriptionStatus(userId);
      if (!currentSubscription) {
        throw new Error("No active subscription found");
      }

      const newPlan = this.calculatePlan(newTierId, billingCycle);

      // Update with payment provider
      if (currentSubscription.paymentMethod === "paypal") {
        await PaymentProcessingService.getInstance().updatePayPalSubscription(
          userId,
          newPlan,
        );
      } else {
        await PaymentProcessingService.getInstance().updatePaystackSubscription(
          userId,
          newPlan,
        );
      }

      // Update local subscription
      currentSubscription.tier = newTierId;
      this.subscriptions.set(userId, currentSubscription);

      await this.updateUserAccess(userId, newTierId);

      return { success: true };
    } catch (error) {
      console.error("Subscription update failed:", error);
      return { success: false, error: error.message };
    }
  }

  async cancelSubscription(
    userId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const subscription = await this.getSubscriptionStatus(userId);
      if (!subscription) {
        throw new Error("No active subscription found");
      }

      // Cancel with payment provider
      if (subscription.paymentMethod === "paypal") {
        await PaymentProcessingService.getInstance().cancelPayPalSubscription(
          userId,
        );
      } else {
        await PaymentProcessingService.getInstance().cancelPaystackSubscription(
          userId,
        );
      }

      // Update subscription status
      subscription.status = "cancelled";
      subscription.isActive = false;
      this.subscriptions.set(userId, subscription);

      await this.logPaymentEvent({
        type: "subscription_cancelled",
        userId,
        amount: 0,
        currency: "USD",
        metadata: { tier: subscription.tier },
      });

      return { success: true };
    } catch (error) {
      console.error("Subscription cancellation failed:", error);
      return { success: false, error: error.message };
    }
  }

  // Usage Tracking
  async trackUsage(
    userId: string,
    type: "users" | "apiCalls" | "storage",
    amount: number,
  ): Promise<void> {
    const subscription = await this.getSubscriptionStatus(userId);
    if (!subscription) return;

    switch (type) {
      case "users":
        subscription.usage.users = Math.max(subscription.usage.users, amount);
        break;
      case "apiCalls":
        subscription.usage.apiCalls += amount;
        break;
      case "storage":
        subscription.usage.storageUsed = `${amount}MB`;
        break;
    }

    this.subscriptions.set(userId, subscription);

    // Check limits
    await this.checkUsageLimits(userId, subscription);
  }

  private async checkUsageLimits(
    userId: string,
    subscription: SubscriptionStatus,
  ): Promise<void> {
    const tier = this.getTierById(subscription.tier);
    if (!tier) return;

    const warnings: string[] = [];

    // Check user limit
    if (
      tier.limits.users !== -1 &&
      subscription.usage.users >= tier.limits.users * 0.9
    ) {
      warnings.push(
        `Approaching user limit: ${subscription.usage.users}/${tier.limits.users}`,
      );
    }

    // Check API limit
    if (
      tier.limits.apiCalls !== -1 &&
      subscription.usage.apiCalls >= tier.limits.apiCalls * 0.9
    ) {
      warnings.push(
        `Approaching API limit: ${subscription.usage.apiCalls}/${tier.limits.apiCalls}`,
      );
    }

    if (warnings.length > 0) {
      await this.sendUsageWarning(userId, warnings);
    }
  }

  // Analytics & Reporting
  async getPaymentAnalytics(userId: string): Promise<any> {
    const events = this.paymentEvents.filter((e) => e.userId === userId);
    const subscription = await this.getSubscriptionStatus(userId);

    return {
      totalPayments: events.filter((e) => e.type === "payment_successful")
        .length,
      totalSpent: events
        .filter((e) => e.type === "payment_successful")
        .reduce((sum, e) => sum + e.amount, 0),
      currentTier: subscription?.tier || "none",
      nextBilling: subscription?.nextBillingDate,
      usage: subscription?.usage,
      recentEvents: events.slice(-10),
    };
  }

  async getEnterpriseAnalytics(): Promise<any> {
    const totalRevenue = this.paymentEvents
      .filter((e) => e.type === "payment_successful")
      .reduce((sum, e) => sum + e.amount, 0);

    const subscriptionsByTier = Array.from(this.subscriptions.values()).reduce(
      (acc, sub) => {
        acc[sub.tier] = (acc[sub.tier] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalRevenue,
      activeSubscriptions: this.subscriptions.size,
      subscriptionsByTier,
      paymentMethods: this.getPaymentMethodDistribution(),
      monthlyRecurringRevenue: this.calculateMRR(),
      churnRate: this.calculateChurnRate(),
    };
  }

  // Utility Methods
  private calculateTax(amount: number, currency: string): number {
    // Simplified tax calculation - implement proper tax logic
    return currency === "USD" ? amount * 0.08 : 0;
  }

  private calculateNextBillingDate(billingCycle: "monthly" | "annual"): Date {
    const now = new Date();
    return billingCycle === "monthly"
      ? new Date(now.setMonth(now.getMonth() + 1))
      : new Date(now.setFullYear(now.getFullYear() + 1));
  }

  private async validatePaymentSecurity(
    userId: string,
    paymentData: any,
  ): Promise<void> {
    // Implement fraud detection
    const riskScore = await this.calculateRiskScore(userId, paymentData);
    if (riskScore > 0.8) {
      throw new Error("Payment flagged for security review");
    }

    // Log security event
    await CiscoXDRService.getInstance().logSecurityEvent({
      type: "payment_attempt",
      userId,
      timestamp: new Date(),
      details: {
        riskScore,
        paymentData: { ...paymentData, sensitive: "[REDACTED]" },
      },
    });
  }

  private async calculateRiskScore(
    userId: string,
    paymentData: any,
  ): Promise<number> {
    // Implement risk scoring algorithm
    let score = 0;

    // Check for unusual patterns
    if (paymentData.amount > 1000) score += 0.2;
    if (paymentData.country !== "US") score += 0.1;

    return Math.min(score, 1);
  }

  private async updateUserAccess(
    userId: string,
    tierId: string,
  ): Promise<void> {
    // Update user permissions based on tier
    console.log(`Updating user ${userId} access for tier ${tierId}`);
  }

  private async logPaymentEvent(
    event: Omit<PaymentEvent, "id" | "timestamp">,
  ): Promise<void> {
    const paymentEvent: PaymentEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...event,
    };

    this.paymentEvents.push(paymentEvent);

    // Save to database
    await this.savePaymentEventToDatabase(paymentEvent);
  }

  private getPaymentMethodDistribution(): Record<string, number> {
    return Array.from(this.subscriptions.values()).reduce(
      (acc, sub) => {
        acc[sub.paymentMethod] = (acc[sub.paymentMethod] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private calculateMRR(): number {
    return Array.from(this.subscriptions.values())
      .filter((sub) => sub.isActive)
      .reduce((sum, sub) => {
        const tier = this.getTierById(sub.tier);
        return sum + (tier?.price.monthly || 0);
      }, 0);
  }

  private calculateChurnRate(): number {
    const cancelled = this.paymentEvents.filter(
      (e) => e.type === "subscription_cancelled",
    ).length;
    const total = this.subscriptions.size + cancelled;
    return total > 0 ? cancelled / total : 0;
  }

  private async sendUsageWarning(
    userId: string,
    warnings: string[],
  ): Promise<void> {
    console.log(`Usage warning for user ${userId}:`, warnings);
    // Implement notification system
  }

  private async validateSubscriptionWithProvider(
    userId: string,
    subscription: SubscriptionStatus,
  ): Promise<void> {
    try {
      if (subscription.paymentMethod === "paypal") {
        await PaymentProcessingService.getInstance().getPayPalSubscriptionStatus(
          userId,
        );
        subscription.status = status.status;
        subscription.isActive = status.isActive;
      } else {
        await PaymentProcessingService.getInstance().getPaystackSubscriptionStatus(
          userId,
        );
        subscription.status = status.status;
        subscription.isActive = status.isActive;
      }
    } catch (error) {
      console.error("Failed to validate subscription with provider:", error);
    }
  }

  // Database Methods (implement with your database)
  private async saveSubscriptionToDatabase(
    userId: string,
    subscription: SubscriptionStatus,
    subscriptionId: string,
  ): Promise<void> {
    console.log(`Saving subscription for user ${userId}:`, subscription);
  }

  private async loadSubscriptionFromDatabase(
    userId: string,
  ): Promise<SubscriptionStatus | null> {
    // Implement database load
    return null;
  }

  private async savePaymentEventToDatabase(event: PaymentEvent): Promise<void> {
    console.log("Saving payment event:", event);
  }
}

export const enterprisePaymentService = new EnterprisePaymentService();
