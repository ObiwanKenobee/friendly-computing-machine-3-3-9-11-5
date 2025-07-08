import { enhancedPaymentService } from "./enhancedPaymentService";
import { userMemoryService } from "./userMemoryService";

export type SubscriptionTier =
  | "free"
  | "starter"
  | "professional"
  | "enterprise";

export interface SubscriptionFeatures {
  maxArchetypes: number;
  allowedArchetypes: string[];
  aiInsightsLimit: number;
  realTimeData: boolean;
  advancedAnalytics: boolean;
  multiCurrency: boolean;
  prioritySupport: boolean;
  customReports: boolean;
  apiAccess: boolean;
  whiteLabeling: boolean;
}

export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  features: SubscriptionFeatures;
  paymentStatus: "paid" | "pending" | "failed" | "cancelled";
  trialDaysRemaining?: number;
}

class PaywallProtectionService {
  private subscriptions: Map<string, UserSubscription> = new Map();
  private readonly SUBSCRIPTION_FEATURES: Record<
    SubscriptionTier,
    SubscriptionFeatures
  > = {
    free: {
      maxArchetypes: 1,
      allowedArchetypes: ["emerging-market-citizen"], // Only free access to the case study
      aiInsightsLimit: 5,
      realTimeData: false,
      advancedAnalytics: false,
      multiCurrency: false,
      prioritySupport: false,
      customReports: false,
      apiAccess: false,
      whiteLabeling: false,
    },
    starter: {
      maxArchetypes: 3,
      allowedArchetypes: [
        "emerging-market-citizen",
        "retail-investor",
        "student-early-career",
      ],
      aiInsightsLimit: 50,
      realTimeData: true,
      advancedAnalytics: false,
      multiCurrency: true,
      prioritySupport: false,
      customReports: false,
      apiAccess: false,
      whiteLabeling: false,
    },
    professional: {
      maxArchetypes: 8,
      allowedArchetypes: [
        "emerging-market-citizen",
        "retail-investor",
        "student-early-career",
        "cultural-investor",
        "diaspora-investor",
        "financial-advisor",
        "developer-integrator",
        "public-sector-ngo",
      ],
      aiInsightsLimit: 200,
      realTimeData: true,
      advancedAnalytics: true,
      multiCurrency: true,
      prioritySupport: true,
      customReports: true,
      apiAccess: true,
      whiteLabeling: false,
    },
    enterprise: {
      maxArchetypes: 13, // All archetypes
      allowedArchetypes: [
        "emerging-market-citizen",
        "retail-investor",
        "student-early-career",
        "cultural-investor",
        "diaspora-investor",
        "financial-advisor",
        "developer-integrator",
        "public-sector-ngo",
        "institutional-investor",
        "african-market-enterprise",
        "quant-data-driven-investor",
        "wildlife-conservation-enterprise",
        "quantum-enterprise-2050",
      ],
      aiInsightsLimit: -1, // Unlimited
      realTimeData: true,
      advancedAnalytics: true,
      multiCurrency: true,
      prioritySupport: true,
      customReports: true,
      apiAccess: true,
      whiteLabeling: true,
    },
  };

  constructor() {
    this.initializeService();
  }

  private initializeService(): void {
    // Load saved subscriptions from localStorage
    try {
      const saved = localStorage.getItem("user-subscriptions");
      if (saved) {
        const data = JSON.parse(saved);
        Object.entries(data).forEach(([userId, subscription]) => {
          this.subscriptions.set(userId, {
            ...(subscription as UserSubscription),
            startDate: new Date((subscription as any).startDate),
            endDate: new Date((subscription as any).endDate),
          });
        });
      }
    } catch (error) {
      console.error("Failed to load subscriptions:", error);
    }
  }

  private saveSubscriptions(): void {
    try {
      const data = Object.fromEntries(this.subscriptions);
      localStorage.setItem("user-subscriptions", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save subscriptions:", error);
    }
  }

  public getUserSubscription(userId: string): UserSubscription {
    const subscription = this.subscriptions.get(userId);

    if (!subscription) {
      // Create default free subscription for new users
      const defaultSubscription: UserSubscription = {
        userId,
        tier: "free",
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 day trial
        isActive: true,
        features: this.SUBSCRIPTION_FEATURES.free,
        paymentStatus: "paid",
        trialDaysRemaining: 7,
      };

      this.subscriptions.set(userId, defaultSubscription);
      this.saveSubscriptions();
      return defaultSubscription;
    }

    // Check if subscription is still active
    if (subscription.endDate < new Date()) {
      subscription.isActive = false;
      subscription.tier = "free";
      subscription.features = this.SUBSCRIPTION_FEATURES.free;
    }

    return subscription;
  }

  public hasAccessToArchetype(userId: string, archetypeId: string): boolean {
    const subscription = this.getUserSubscription(userId);

    if (!subscription.isActive) {
      return this.SUBSCRIPTION_FEATURES.free.allowedArchetypes.includes(
        archetypeId,
      );
    }

    return subscription.features.allowedArchetypes.includes(archetypeId);
  }

  public getArchetypeAccessStatus(userId: string): {
    archetype: string;
    hasAccess: boolean;
    requiresUpgrade: SubscriptionTier | null;
  }[] {
    const subscription = this.getUserSubscription(userId);
    const allArchetypes =
      this.SUBSCRIPTION_FEATURES.enterprise.allowedArchetypes;

    return allArchetypes.map((archetype) => {
      const hasAccess =
        subscription.features.allowedArchetypes.includes(archetype);
      let requiresUpgrade: SubscriptionTier | null = null;

      if (!hasAccess) {
        // Find minimum tier that provides access
        for (const [tier, features] of Object.entries(
          this.SUBSCRIPTION_FEATURES,
        )) {
          if (features.allowedArchetypes.includes(archetype)) {
            requiresUpgrade = tier as SubscriptionTier;
            break;
          }
        }
      }

      return {
        archetype,
        hasAccess,
        requiresUpgrade,
      };
    });
  }

  public async upgradeSubscription(
    userId: string,
    newTier: SubscriptionTier,
    paymentMethod: "paypal" | "paystack" = "paypal",
  ): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    try {
      const subscription = this.getUserSubscription(userId);
      const pricing = this.getTierPricing(newTier);

      // Process payment
      const paymentResult = await enhancedPaymentService.processPayment(
        {
          amount: pricing.monthlyPrice,
          currency: pricing.currency,
          description: `Upgrade to ${newTier} plan`,
          userId,
          metadata: {
            subscriptionTier: newTier,
            upgradeFrom: subscription.tier,
          },
        },
        paymentMethod,
      );

      if (paymentResult.success) {
        // Update subscription
        const updatedSubscription: UserSubscription = {
          ...subscription,
          tier: newTier,
          features: this.SUBSCRIPTION_FEATURES[newTier],
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          isActive: true,
          paymentStatus: "paid",
          trialDaysRemaining: undefined,
        };

        this.subscriptions.set(userId, updatedSubscription);
        this.saveSubscriptions();

        // Track upgrade in user memory
        userMemoryService.recordDecision(userId, "subscription_upgrade", {
          fromTier: subscription.tier,
          toTier: newTier,
          amount: pricing.monthlyPrice,
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
          subscriptionId: paymentResult.transactionId,
        };
      } else {
        // Handle payment error properly - paymentResult.error is an object
        let errorMessage = "Payment failed";
        if (paymentResult.error) {
          if (typeof paymentResult.error === "string") {
            errorMessage = paymentResult.error;
          } else if (paymentResult.error.message) {
            errorMessage = paymentResult.error.message;
          } else if (paymentResult.error.code) {
            errorMessage = `Payment error: ${paymentResult.error.code}`;
          } else {
            errorMessage = "Payment processing failed";
          }
        }

        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      console.error("Subscription upgrade failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public getTierPricing(tier: SubscriptionTier): {
    monthlyPrice: number;
    yearlyPrice: number;
    currency: string;
    savings: number;
  } {
    const pricing = {
      free: { monthlyPrice: 0, yearlyPrice: 0, currency: "USD", savings: 0 },
      starter: {
        monthlyPrice: 29.99,
        yearlyPrice: 299.99,
        currency: "USD",
        savings: 60,
      },
      professional: {
        monthlyPrice: 99.99,
        yearlyPrice: 999.99,
        currency: "USD",
        savings: 200,
      },
      enterprise: {
        monthlyPrice: 499.99,
        yearlyPrice: 4999.99,
        currency: "USD",
        savings: 1000,
      },
    };

    return pricing[tier];
  }

  public canUseFeature(
    userId: string,
    feature: keyof SubscriptionFeatures,
  ): boolean {
    const subscription = this.getUserSubscription(userId);
    return subscription.features[feature] as boolean;
  }

  public getFeatureLimit(
    userId: string,
    feature: keyof SubscriptionFeatures,
  ): number {
    const subscription = this.getUserSubscription(userId);
    return subscription.features[feature] as number;
  }

  public getRemainingAIInsights(userId: string): number {
    const subscription = this.getUserSubscription(userId);
    const limit = subscription.features.aiInsightsLimit;

    if (limit === -1) return -1; // Unlimited

    // Get usage from user memory (simplified)
    const used = this.getAIInsightsUsedThisMonth(userId);
    return Math.max(0, limit - used);
  }

  private getAIInsightsUsedThisMonth(userId: string): number {
    // This would typically query actual usage data
    // For demo purposes, return a random number
    return Math.floor(Math.random() * 20);
  }

  public getUpgradeRecommendation(
    userId: string,
    requestedFeature: string,
  ): {
    shouldUpgrade: boolean;
    recommendedTier: SubscriptionTier | null;
    reason: string;
    pricing?: any;
  } {
    const subscription = this.getUserSubscription(userId);

    // Check what tier would provide the requested feature
    for (const [tier, features] of Object.entries(this.SUBSCRIPTION_FEATURES)) {
      if (tier === subscription.tier) continue;

      // Check if this tier provides the requested feature
      const tierKey = tier as SubscriptionTier;
      if (this.tierProvidesFeature(tierKey, requestedFeature)) {
        return {
          shouldUpgrade: true,
          recommendedTier: tierKey,
          reason: `Upgrade to ${tier} to access ${requestedFeature}`,
          pricing: this.getTierPricing(tierKey),
        };
      }
    }

    return {
      shouldUpgrade: false,
      recommendedTier: null,
      reason: "Feature is available in your current plan",
    };
  }

  private tierProvidesFeature(
    tier: SubscriptionTier,
    feature: string,
  ): boolean {
    const features = this.SUBSCRIPTION_FEATURES[tier];

    // Map feature strings to actual features
    const featureMap: Record<string, boolean> = {
      "real-time-data": features.realTimeData,
      "advanced-analytics": features.advancedAnalytics,
      "multi-currency": features.multiCurrency,
      "priority-support": features.prioritySupport,
      "custom-reports": features.customReports,
      "api-access": features.apiAccess,
      "white-labeling": features.whiteLabeling,
    };

    return featureMap[feature] || false;
  }

  public getTrialStatus(userId: string): {
    isInTrial: boolean;
    daysRemaining: number;
    canExtendTrial: boolean;
  } {
    const subscription = this.getUserSubscription(userId);

    return {
      isInTrial:
        subscription.trialDaysRemaining !== undefined &&
        subscription.trialDaysRemaining > 0,
      daysRemaining: subscription.trialDaysRemaining || 0,
      canExtendTrial:
        subscription.tier === "free" &&
        (subscription.trialDaysRemaining || 0) <= 2,
    };
  }

  public extendTrial(userId: string, additionalDays: number = 7): boolean {
    const subscription = this.getUserSubscription(userId);
    const trialStatus = this.getTrialStatus(userId);

    if (trialStatus.canExtendTrial) {
      subscription.trialDaysRemaining =
        (subscription.trialDaysRemaining || 0) + additionalDays;
      subscription.endDate = new Date(
        Date.now() + subscription.trialDaysRemaining * 24 * 60 * 60 * 1000,
      );

      this.subscriptions.set(userId, subscription);
      this.saveSubscriptions();

      return true;
    }

    return false;
  }

  public generatePaywallMessage(
    userId: string,
    blockedFeature: string,
  ): {
    title: string;
    message: string;
    ctaText: string;
    recommendedTier: SubscriptionTier;
    pricing: any;
  } {
    const recommendation = this.getUpgradeRecommendation(
      userId,
      blockedFeature,
    );
    const subscription = this.getUserSubscription(userId);

    const messages = {
      "emerging-market-citizen": {
        title: "Unlock Healthcare Investment Dashboard",
        message:
          "Get full access to our AI-powered multilingual investment platform designed for emerging markets.",
        ctaText: "Start Free Trial",
      },
      "institutional-investor": {
        title: "Enterprise Features Required",
        message:
          "Access advanced institutional-grade analytics and portfolio management tools.",
        ctaText: "Upgrade to Professional",
      },
      default: {
        title: "Premium Feature",
        message:
          "This feature requires a premium subscription to access advanced capabilities.",
        ctaText: "Upgrade Now",
      },
    };

    const messageKey = blockedFeature as keyof typeof messages;
    const message = messages[messageKey] || messages.default;

    return {
      ...message,
      recommendedTier: recommendation.recommendedTier || "starter",
      pricing: recommendation.pricing || this.getTierPricing("starter"),
    };
  }
}

export const paywallProtectionService = new PaywallProtectionService();
