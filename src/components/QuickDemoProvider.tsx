/**
 * Quick Start Demo Provider
 * Lightweight demo access provider for immediate app startup
 */

import React, { createContext, useContext, ReactNode } from "react";

interface QuickDemoAccess {
  canAccess: boolean;
  timeRemaining: number;
  accessLevel: string;
  featuresAvailable: string[];
  restrictedFeatures: string[];
  upgradePrompt?: string;
}

interface QuickDemoContextType {
  checkAccess: (route: string) => QuickDemoAccess;
  extendDemo: (minutes: number) => void;
  upgradeAccess: (level: string) => void;
  trackUsage: (feature: string, page: string) => void;
  isLoading: boolean;
  hasAccess: boolean;
  tier: string;
}

const QuickDemoContext = createContext<QuickDemoContextType | undefined>(
  undefined,
);

export const QuickDemoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const checkAccess = (route: string): QuickDemoAccess => ({
    canAccess: true,
    timeRemaining: 3600,
    accessLevel: "free",
    featuresAvailable: [
      "basic_dashboard",
      "age_switcher",
      "platform_navigation",
    ],
    restrictedFeatures: [],
  });

  const extendDemo = (minutes: number) => {
    console.log(`Demo extended by ${minutes} minutes`);
  };

  const upgradeAccess = (level: string) => {
    console.log(`Access upgraded to ${level}`);
  };

  const trackUsage = (feature: string, page: string) => {
    console.log(`Usage tracked: ${feature} on ${page}`);
  };

  const contextValue: QuickDemoContextType = {
    checkAccess,
    extendDemo,
    upgradeAccess,
    trackUsage,
    isLoading: false,
    hasAccess: true,
    tier: "free",
  };

  return (
    <QuickDemoContext.Provider value={contextValue}>
      {children}
    </QuickDemoContext.Provider>
  );
};

export const useQuickDemo = (): QuickDemoContextType => {
  const context = useContext(QuickDemoContext);
  if (!context) {
    // Return safe defaults instead of throwing
    return {
      checkAccess: () => ({
        canAccess: true,
        timeRemaining: 3600,
        accessLevel: "free",
        featuresAvailable: [],
        restrictedFeatures: [],
      }),
      extendDemo: () => {},
      upgradeAccess: () => {},
      trackUsage: () => {},
      isLoading: false,
      hasAccess: true,
      tier: "free",
    };
  }
  return context;
};

// Legacy export for compatibility
export const useDemoAccess = useQuickDemo;
export const DemoAccessGuard: React.FC<{ children: ReactNode }> = ({
  children,
}) => <>{children}</>;

export default QuickDemoProvider;
