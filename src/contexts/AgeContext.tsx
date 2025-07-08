/**
 * Age Context Provider for QuantumVest Enterprise
 * Manages age-based state, preferences, and investment strategies
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  AgeContextType,
  AgeRange,
  AgeProfile,
  AgeInvestmentStrategy,
} from "../types/Age";
import {
  getAgeProfile,
  getStrategiesForAge,
  AGE_INVESTMENT_STRATEGIES,
} from "../utils/ageInvestmentStrategies";

const AgeContext = createContext<AgeContextType | undefined>(undefined);

interface AgeProviderProps {
  children: ReactNode;
}

const AGE_STORAGE_KEY = "quantumvest_age_context";

export const AgeProvider: React.FC<AgeProviderProps> = ({ children }) => {
  const [currentAge, setCurrentAge] = useState<AgeRange | null>(null);
  const [profile, setProfile] = useState<AgeProfile | null>(null);
  const [preferences, setPreferences] = useState({
    showAgeBasedContent: true,
    autoUpdateStrategies: true,
    hideInappropriateProducts: true,
  });

  // Load saved age context from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AGE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentAge) {
          setCurrentAge(parsed.currentAge);
          setProfile(getAgeProfile(parsed.currentAge));
        }
        if (parsed.preferences) {
          setPreferences((prev) => ({ ...prev, ...parsed.preferences }));
        }
      }
    } catch (error) {
      console.error("Failed to load age context from storage:", error);
    }
  }, []);

  // Save age context to localStorage when it changes
  useEffect(() => {
    if (currentAge) {
      try {
        const dataToSave = {
          currentAge,
          preferences,
          timestamp: Date.now(),
        };
        localStorage.setItem(AGE_STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Failed to save age context to storage:", error);
      }
    }
  }, [currentAge, preferences]);

  const setAge = (age: AgeRange) => {
    setCurrentAge(age);
    setProfile(getAgeProfile(age));

    // Analytics tracking (optional)
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "age_selection", {
        event_category: "user_personalization",
        event_label: age,
        value: parseInt(age.split("-")[0]),
      });
    }
  };

  const updatePreferences = (newPreferences: Partial<typeof preferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  const getRecommendedStrategies = (): AgeInvestmentStrategy[] => {
    if (!currentAge) return [];
    return getStrategiesForAge(currentAge);
  };

  const validateProductAccess = (productId: string): boolean => {
    if (!currentAge || !preferences.hideInappropriateProducts) return true;

    // Define age-restricted products
    const restrictedProducts: Record<
      string,
      { minAge: number; maxAge?: number }
    > = {
      high_risk_derivatives: { minAge: 25 },
      crypto_complex: { minAge: 21 },
      leveraged_etfs: { minAge: 25 },
      private_equity: { minAge: 30 },
      hedge_funds: { minAge: 35 },
      structured_products: { minAge: 30 },
      commodity_futures: { minAge: 25 },
      fx_trading: { minAge: 23 },
      options_complex: { minAge: 25 },
      retirement_annuities: { minAge: 45 },
    };

    const restriction = restrictedProducts[productId];
    if (!restriction) return true;

    const currentAgeNumber = parseInt(currentAge.split("-")[0]);

    if (currentAgeNumber < restriction.minAge) return false;
    if (restriction.maxAge && currentAgeNumber > restriction.maxAge)
      return false;

    return true;
  };

  const resetAgeData = () => {
    setCurrentAge(null);
    setProfile(null);
    setPreferences({
      showAgeBasedContent: true,
      autoUpdateStrategies: true,
      hideInappropriateProducts: true,
    });
    localStorage.removeItem(AGE_STORAGE_KEY);
  };

  const contextValue: AgeContextType = {
    currentAge,
    profile,
    strategies: getRecommendedStrategies(),
    compliance: {
      isVerified: currentAge !== null,
      restrictedProducts: currentAge
        ? []
        : ["high_risk_derivatives", "crypto_complex"],
      requiredDisclosures: currentAge
        ? parseInt(currentAge.split("-")[0]) < 25
          ? ["Risk_Disclosure_Young_Investor", "Educational_Content_Required"]
          : ["Standard_Risk_Disclosure"]
        : [],
    },
    preferences,
    setAge,
    updatePreferences,
    getRecommendedStrategies,
    validateProductAccess,
    resetAgeData,
  };

  return (
    <AgeContext.Provider value={contextValue}>{children}</AgeContext.Provider>
  );
};

export const useAgeContext = (): AgeContextType => {
  const context = useContext(AgeContext);
  if (!context) {
    throw new Error("useAgeContext must be used within an AgeProvider");
  }
  return context;
};

// Custom hook for age-based component rendering
export const useAgeBasedContent = () => {
  const { currentAge, profile, preferences } = useAgeContext();

  const shouldShowContent = (
    requiredAge?: AgeRange | AgeRange[],
    contentType: "investment" | "educational" | "product" = "investment",
  ): boolean => {
    if (!preferences.showAgeBasedContent) return true;
    if (!currentAge || !requiredAge) return true;

    const requiredAges = Array.isArray(requiredAge)
      ? requiredAge
      : [requiredAge];
    return requiredAges.includes(currentAge);
  };

  const getAgeBasedMessage = (
    messageType: "welcome" | "strategy" | "warning",
  ): string => {
    if (!profile) return "";

    const messages = {
      welcome: `Welcome, ${profile.label}! ${profile.description}`,
      strategy: `Based on your age group, we recommend focusing on ${profile.recommendedStrategies.growth}% growth investments.`,
      warning:
        profile.characteristics.riskTolerance === "aggressive"
          ? "Remember: High growth potential comes with increased volatility."
          : "Your strategy emphasizes stability and preservation.",
    };

    return messages[messageType];
  };

  return {
    shouldShowContent,
    getAgeBasedMessage,
    ageProfile: profile,
    currentAge,
  };
};

export default AgeProvider;
