import React, { createContext, useContext, useState, useEffect } from "react";

interface DemoAccess {
  canAccess: boolean;
  timeRemaining: number;
  accessLevel: string;
  featuresAvailable: string[];
  restrictedFeatures: string[];
  upgradePrompt?: string;
}

interface DemoAccessContextType {
  checkAccess: (route: string) => DemoAccess;
  extendDemo: (minutes: number) => void;
  upgradeAccess: (level: string) => void;
  trackUsage: (feature: string, page: string) => void;
  isLoading: boolean;
}

const DemoAccessContext = createContext<DemoAccessContextType | undefined>(
  undefined,
);

export const useDemoAccess = () => {
  const context = useContext(DemoAccessContext);
  if (!context) {
    // Return default values instead of throwing error
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
    };
  }
  return context;
};

export const SimpleDemoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessLevel, setAccessLevel] = useState("free");
  const [timeRemaining, setTimeRemaining] = useState(3600);

  const checkAccess = (route: string): DemoAccess => {
    return {
      canAccess: true, // Allow all access for now
      timeRemaining,
      accessLevel,
      featuresAvailable: ["basic_access"],
      restrictedFeatures: [],
    };
  };

  const extendDemo = (minutes: number) => {
    setTimeRemaining((prev) => prev + minutes * 60);
  };

  const upgradeAccess = (level: string) => {
    setAccessLevel(level);
  };

  const trackUsage = (feature: string, page: string) => {
    // Simple tracking
    console.log(`Usage tracked: ${feature} on ${page}`);
  };

  const value = {
    checkAccess,
    extendDemo,
    upgradeAccess,
    trackUsage,
    isLoading: false,
  };

  return (
    <DemoAccessContext.Provider value={value}>
      {children}
    </DemoAccessContext.Provider>
  );
};

// Simple demo guard that doesn't block access
export const DemoAccessGuard: React.FC<{
  route: string;
  children: React.ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};
