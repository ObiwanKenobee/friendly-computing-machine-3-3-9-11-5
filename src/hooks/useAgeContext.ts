/**
 * Age Context Hook for QuantumVest Enterprise
 * Provides convenient access to age-based functionality
 */

import { useContext } from "react";
import { AgeContextType, AgeRange, AgeInvestmentStrategy } from "../types/Age";
import { useAgeContext as useAgeContextCore } from "../contexts/AgeContext";
import {
  calculateAgeBasedAllocation,
  getAgeBasedRiskScore,
} from "../utils/ageInvestmentStrategies";

// Re-export the core hook
export const useAgeContext = (): AgeContextType => {
  return useAgeContextCore();
};

// Enhanced hook with additional utilities
export const useAgeInvestmentStrategies = () => {
  const { currentAge, strategies, profile } = useAgeContext();

  const getOptimalAllocation = (riskModifier: number = 1) => {
    if (!currentAge) return null;
    return calculateAgeBasedAllocation(currentAge, riskModifier);
  };

  const getRiskScore = () => {
    if (!currentAge) return 5; // default moderate risk
    return getAgeBasedRiskScore(currentAge);
  };

  const getTopStrategy = (): AgeInvestmentStrategy | null => {
    if (strategies.length === 0) return null;

    // Sort by expected return and risk level suitability
    const sorted = [...strategies].sort((a, b) => {
      const riskScore = getRiskScore();
      const aScore =
        a.expectedReturn * (1 - Math.abs(a.riskLevel - riskScore) * 0.1);
      const bScore =
        b.expectedReturn * (1 - Math.abs(b.riskLevel - riskScore) * 0.1);
      return bScore - aScore;
    });

    return sorted[0];
  };

  const getLegendaryInvestorRecommendation = (): {
    investor: string;
    relevance: number;
    strategy: string;
  } | null => {
    if (!profile) return null;

    const focus = profile.legendaryInvestorFocus;
    const maxScore = Math.max(
      focus.buffett,
      focus.munger,
      focus.dalio,
      focus.lynch,
    );

    if (focus.buffett === maxScore) {
      return {
        investor: "Warren Buffett",
        relevance: focus.buffett,
        strategy:
          "Focus on quality companies with economic moats and long-term competitive advantages.",
      };
    } else if (focus.munger === maxScore) {
      return {
        investor: "Charlie Munger",
        relevance: focus.munger,
        strategy:
          "Use mental models and rational thinking to make superior investment decisions.",
      };
    } else if (focus.dalio === maxScore) {
      return {
        investor: "Ray Dalio",
        relevance: focus.dalio,
        strategy:
          "Build an All-Weather portfolio that performs well in different economic environments.",
      };
    } else {
      return {
        investor: "Peter Lynch",
        relevance: focus.lynch,
        strategy:
          "Invest in what you know and understand, focusing on growth companies.",
      };
    }
  };

  return {
    strategies,
    getOptimalAllocation,
    getRiskScore,
    getTopStrategy,
    getLegendaryInvestorRecommendation,
    currentAge,
    profile,
  };
};

// Hook for age-based UI customization
export const useAgeBasedUI = () => {
  const { currentAge, profile } = useAgeContext();

  const getUIPreferences = () => {
    if (!currentAge) {
      return {
        fontSize: "medium" as const,
        complexity: "standard" as const,
        dashboardLayout: "comprehensive" as const,
      };
    }

    const ageNumber = parseInt(currentAge.split("-")[0]);

    return {
      fontSize:
        ageNumber >= 65
          ? ("large" as const)
          : ageNumber >= 50
            ? ("medium" as const)
            : ("medium" as const),
      complexity:
        ageNumber <= 25
          ? ("simplified" as const)
          : ageNumber >= 50
            ? ("standard" as const)
            : ("standard" as const),
      dashboardLayout:
        ageNumber <= 25
          ? ("minimal" as const)
          : ageNumber >= 65
            ? ("simplified" as const)
            : ("comprehensive" as const),
    };
  };

  const getColorScheme = () => {
    return (
      profile?.colors || {
        primary: "#3B82F6",
        secondary: "#60A5FA",
        accent: "#1D4ED8",
      }
    );
  };

  const getMotivationalMessage = (): string => {
    if (!profile) return "Start your investment journey today!";

    const messages: Record<AgeRange, string> = {
      "18-25": "🚀 Your biggest asset is time - start investing now!",
      "26-35": "⚡ Build your wealth foundation during peak earning years!",
      "36-50": "🎯 Balance growth and security for optimal outcomes!",
      "51-65": "🛡️ Protect your wealth while preparing for retirement!",
      "65+": "🌅 Enjoy the fruits of your investment journey!",
    };

    return messages[profile.range];
  };

  return {
    getUIPreferences,
    getColorScheme,
    getMotivationalMessage,
    ageIcon: profile?.icon || "💼",
    ageLabel: profile?.label || "Investor",
  };
};

// Hook for age-based compliance and restrictions
export const useAgeCompliance = () => {
  const { validateProductAccess, compliance, currentAge } = useAgeContext();

  const checkProductEligibility = (productId: string, productType: string) => {
    const isEligible = validateProductAccess(productId);

    if (!isEligible) {
      const ageNumber = currentAge ? parseInt(currentAge.split("-")[0]) : 0;
      const reason =
        ageNumber < 25
          ? "This product requires more investment experience."
          : "This product may not be suitable for your age group.";

      return {
        eligible: false,
        reason,
        alternativeRecommendation: getAlternativeProduct(productType),
      };
    }

    return { eligible: true };
  };

  const getAlternativeProduct = (productType: string): string => {
    const alternatives: Record<string, string> = {
      high_risk_derivatives: "Consider broad market ETFs or index funds",
      crypto_complex: "Start with small allocations to major cryptocurrencies",
      leveraged_etfs: "Try regular ETFs with natural diversification",
      private_equity: "Consider REITs or growth mutual funds",
      hedge_funds: "Look into actively managed mutual funds",
    };

    return (
      alternatives[productType] ||
      "Consider consulting with a financial advisor"
    );
  };

  const getRequiredDisclosures = () => {
    return compliance.requiredDisclosures.map((disclosure) => ({
      id: disclosure,
      title: disclosure.replace(/_/g, " "),
      required: true,
      content: getDisclosureContent(disclosure),
    }));
  };

  const getDisclosureContent = (disclosure: string): string => {
    const content: Record<string, string> = {
      Risk_Disclosure_Young_Investor:
        "As a young investor, you have time for long-term growth but should understand the risks of volatile investments.",
      Educational_Content_Required:
        "We recommend completing our investment education modules before proceeding with complex products.",
      Standard_Risk_Disclosure:
        "All investments carry risk. Past performance does not guarantee future results.",
    };

    return content[disclosure] || "Please read all risk disclosures carefully.";
  };

  return {
    checkProductEligibility,
    getRequiredDisclosures,
    isVerified: compliance.isVerified,
    restrictedProducts: compliance.restrictedProducts,
  };
};

export default useAgeContext;
