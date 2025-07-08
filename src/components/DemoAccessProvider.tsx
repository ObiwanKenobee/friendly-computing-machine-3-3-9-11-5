import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  Clock,
  Star,
  Zap,
  Crown,
  Users,
  Shield,
  CheckCircle,
  ArrowRight,
  Play,
  Lock,
  Timer,
  Plus,
  CreditCard,
  AlertCircle,
} from "lucide-react";

interface DemoSession {
  sessionId: string;
  userId: string;
  startTime: Date;
  expiryTime: Date;
  accessLevel: "free" | "starter" | "professional" | "enterprise";
  remainingTime: number;
  featuresUsed: string[];
  pagesVisited: string[];
  isActive: boolean;
}

interface DemoAccess {
  canAccess: boolean;
  timeRemaining: number;
  accessLevel: string;
  featuresAvailable: string[];
  restrictedFeatures: string[];
  upgradePrompt?: string;
}

interface DemoAccessContextType {
  demoSession: DemoSession | null;
  checkAccess: (route: string, feature?: string) => DemoAccess;
  extendDemo: (additionalMinutes: number) => void;
  upgradeAccess: (newLevel: "starter" | "professional" | "enterprise") => void;
  trackUsage: (feature: string, page: string) => void;
  isLoading: boolean;
}

const DemoAccessContext = createContext<DemoAccessContextType | undefined>(
  undefined,
);

export const useDemoAccess = () => {
  const context = useContext(DemoAccessContext);
  if (!context) {
    throw new Error("useDemoAccess must be used within a DemoAccessProvider");
  }
  return context;
};

interface RouteConfig {
  route: string;
  requiredLevel: "free" | "starter" | "professional" | "enterprise";
  features: string[];
  timeLimit?: number; // minutes
  description: string;
}

const ROUTE_CONFIGS: RouteConfig[] = [
  // Free Access Routes
  {
    route: "/",
    requiredLevel: "free",
    features: ["basic_navigation"],
    description: "Platform overview and navigation",
  },
  {
    route: "/dashboard",
    requiredLevel: "free",
    features: ["basic_dashboard"],
    description: "Basic investment dashboard",
  },
  {
    route: "/pricing",
    requiredLevel: "free",
    features: ["pricing_info"],
    description: "Subscription plans and pricing",
  },
  {
    route: "/billing",
    requiredLevel: "free",
    features: ["billing_demo"],
    description: "Billing and subscription management",
  },
  {
    route: "/archetypes",
    requiredLevel: "free",
    features: ["archetype_selector"],
    description: "Investment archetype selection",
  },

  // Starter Access Routes
  {
    route: "/retail-investor",
    requiredLevel: "starter",
    features: ["basic_investing", "portfolio_tracking"],
    timeLimit: 30,
    description: "Individual investor platform",
  },
  {
    route: "/emerging-market-citizen",
    requiredLevel: "starter",
    features: ["local_markets", "micro_investing"],
    timeLimit: 30,
    description: "Emerging market investment solutions",
  },
  {
    route: "/student-early-career",
    requiredLevel: "starter",
    features: ["educational_content", "small_investments"],
    timeLimit: 30,
    description: "Educational investment platform",
  },

  // Professional Access Routes
  {
    route: "/financial-advisor",
    requiredLevel: "professional",
    features: ["client_management", "portfolio_modeling"],
    timeLimit: 15,
    description: "Professional wealth management tools",
  },
  {
    route: "/cultural-investor",
    requiredLevel: "professional",
    features: ["esg_screening", "impact_measurement"],
    timeLimit: 15,
    description: "Values-aligned investing platform",
  },
  {
    route: "/diaspora-investor",
    requiredLevel: "professional",
    features: ["cross_border", "currency_hedging"],
    timeLimit: 15,
    description: "Cross-border investment solutions",
  },
  {
    route: "/developer-integrator",
    requiredLevel: "professional",
    features: ["api_access", "sdk_tools"],
    timeLimit: 15,
    description: "API access and development tools",
  },
  {
    route: "/public-sector-ngo",
    requiredLevel: "professional",
    features: ["compliance_tracking", "impact_reporting"],
    timeLimit: 15,
    description: "Public sector investment solutions",
  },
  {
    route: "/quant-data-driven-investor",
    requiredLevel: "professional",
    features: ["advanced_analytics", "backtesting"],
    timeLimit: 15,
    description: "Quantitative investment platform",
  },

  // Enterprise Access Routes
  {
    route: "/institutional-investor",
    requiredLevel: "enterprise",
    features: ["bulk_processing", "advanced_risk"],
    timeLimit: 10,
    description: "Institutional investment management",
  },
  {
    route: "/african-market-enterprise",
    requiredLevel: "enterprise",
    features: ["multi_country", "regional_insights"],
    timeLimit: 10,
    description: "African market enterprise solutions",
  },
  {
    route: "/wildlife-conservation-enterprise",
    requiredLevel: "enterprise",
    features: ["conservation_metrics", "biodiversity_tracking"],
    timeLimit: 10,
    description: "Conservation investment platform",
  },
  {
    route: "/quantum-enterprise-2050",
    requiredLevel: "enterprise",
    features: ["quantum_computing", "future_tech"],
    timeLimit: 10,
    description: "Next-generation investment platform",
  },

  // Premium Enterprise Features
  {
    route: "/legendary-investors-enterprise",
    requiredLevel: "enterprise",
    features: ["full_legendary_suite"],
    timeLimit: 10,
    description: "Complete legendary investor platform",
  },
  {
    route: "/mobile-management",
    requiredLevel: "professional",
    features: ["mobile_security", "device_management"],
    timeLimit: 10,
    description: "Mobile device management",
  },
  {
    route: "/ai-explainability",
    requiredLevel: "professional",
    features: ["ai_insights", "model_transparency"],
    timeLimit: 10,
    description: "AI explainability dashboard",
  },
];

interface DemoAccessProviderProps {
  children: React.ReactNode;
}

export const DemoAccessProvider: React.FC<DemoAccessProviderProps> = ({
  children,
}) => {
  const [demoSession, setDemoSession] = useState<DemoSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const initializeDemoSession = useCallback(() => {
    try {
      const existingSession = localStorage.getItem("demo_session");

      if (existingSession) {
        const session: DemoSession = JSON.parse(existingSession);
        const now = new Date();

        if (new Date(session.expiryTime) > now) {
          // Session is still valid
          session.remainingTime = Math.floor(
            (new Date(session.expiryTime).getTime() - now.getTime()) / 1000,
          );
          setDemoSession(session);
          return;
        }
      }

      // Create new demo session
      const now = new Date();
      const newSession: DemoSession = {
        sessionId: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: `demo_user_${Date.now()}`,
        startTime: now,
        expiryTime: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour
        accessLevel: "free",
        remainingTime: 3600, // 1 hour in seconds
        featuresUsed: [],
        pagesVisited: ["/"],
        isActive: true,
      };

      setDemoSession(newSession);
      localStorage.setItem("demo_session", JSON.stringify(newSession));
    } catch (error) {
      console.error("Failed to initialize demo session:", error);
      // Fallback to basic session
      const fallbackSession: DemoSession = {
        sessionId: `fallback_${Date.now()}`,
        userId: `fallback_user_${Date.now()}`,
        startTime: new Date(),
        expiryTime: new Date(Date.now() + 60 * 60 * 1000),
        accessLevel: "free",
        remainingTime: 3600,
        featuresUsed: [],
        pagesVisited: ["/"],
        isActive: true,
      };
      setDemoSession(fallbackSession);
    }
  }, []);

  const updateSessionTimer = useCallback(() => {
    setDemoSession((prev) => {
      if (!prev || !prev.isActive) return prev;

      try {
        const now = new Date();
        const remainingTime = Math.floor(
          (new Date(prev.expiryTime).getTime() - now.getTime()) / 1000,
        );

        if (remainingTime <= 0) {
          // Session expired
          const expiredSession = { ...prev, remainingTime: 0, isActive: false };
          localStorage.setItem("demo_session", JSON.stringify(expiredSession));
          return expiredSession;
        }

        const updatedSession = { ...prev, remainingTime };
        localStorage.setItem("demo_session", JSON.stringify(updatedSession));
        return updatedSession;
      } catch (error) {
        console.error("Failed to update session timer:", error);
        return prev;
      }
    });
  }, []);

  useEffect(() => {
    initializeDemoSession();
  }, [initializeDemoSession]);

  useEffect(() => {
    const interval = setInterval(updateSessionTimer, 1000);
    return () => clearInterval(interval);
  }, [updateSessionTimer]);

  const checkAccess = useCallback(
    (route: string, feature?: string): DemoAccess => {
      if (!demoSession) {
        return {
          canAccess: false,
          timeRemaining: 0,
          accessLevel: "none",
          featuresAvailable: [],
          restrictedFeatures: [],
          upgradePrompt: "Please start a demo session to access this content.",
        };
      }

      if (!demoSession.isActive || demoSession.remainingTime <= 0) {
        return {
          canAccess: false,
          timeRemaining: 0,
          accessLevel: demoSession.accessLevel,
          featuresAvailable: [],
          restrictedFeatures: [],
          upgradePrompt:
            "Your demo session has expired. Please upgrade to continue.",
        };
      }

      const routeConfig = ROUTE_CONFIGS.find(
        (config) => config.route === route,
      );

      if (!routeConfig) {
        // Route not configured, allow access
        return {
          canAccess: true,
          timeRemaining: demoSession.remainingTime,
          accessLevel: demoSession.accessLevel,
          featuresAvailable: ["basic_access"],
          restrictedFeatures: [],
        };
      }

      const accessLevels = ["free", "starter", "professional", "enterprise"];
      const userLevel = accessLevels.indexOf(demoSession.accessLevel);
      const requiredLevel = accessLevels.indexOf(routeConfig.requiredLevel);

      if (userLevel >= requiredLevel) {
        // Check time limits for specific routes
        if (routeConfig.timeLimit) {
          const timeSpentOnRoute = demoSession.pagesVisited.filter(
            (page) => page === route,
          ).length;
          if (timeSpentOnRoute * 60 > routeConfig.timeLimit * 60) {
            // Convert to seconds
            return {
              canAccess: false,
              timeRemaining: demoSession.remainingTime,
              accessLevel: demoSession.accessLevel,
              featuresAvailable: [],
              restrictedFeatures: routeConfig.features,
              upgradePrompt: `Time limit exceeded for this demo. Upgrade to ${accessLevels[requiredLevel + 1] || "enterprise"} for unlimited access.`,
            };
          }
        }

        return {
          canAccess: true,
          timeRemaining: demoSession.remainingTime,
          accessLevel: demoSession.accessLevel,
          featuresAvailable: routeConfig.features,
          restrictedFeatures: [],
        };
      }

      return {
        canAccess: false,
        timeRemaining: demoSession.remainingTime,
        accessLevel: demoSession.accessLevel,
        featuresAvailable: [],
        restrictedFeatures: routeConfig.features,
        upgradePrompt: `This feature requires ${routeConfig.requiredLevel} access or higher. Upgrade your demo to continue.`,
      };
    },
    [demoSession],
  );

  const extendDemo = useCallback(
    (additionalMinutes: number) => {
      if (!demoSession) return;

      try {
        const newExpiryTime = new Date(
          demoSession.expiryTime.getTime() + additionalMinutes * 60 * 1000,
        );
        const updatedSession = {
          ...demoSession,
          expiryTime: newExpiryTime,
          remainingTime: demoSession.remainingTime + additionalMinutes * 60,
        };

        setDemoSession(updatedSession);
        localStorage.setItem("demo_session", JSON.stringify(updatedSession));
      } catch (error) {
        console.error("Failed to extend demo:", error);
      }
    },
    [demoSession],
  );

  const upgradeAccess = useCallback(
    (newLevel: "starter" | "professional" | "enterprise") => {
      if (!demoSession) return;

      try {
        const updatedSession = {
          ...demoSession,
          accessLevel: newLevel as
            | "free"
            | "starter"
            | "professional"
            | "enterprise",
        };

        setDemoSession(updatedSession);
        localStorage.setItem("demo_session", JSON.stringify(updatedSession));
      } catch (error) {
        console.error("Failed to upgrade access:", error);
      }
    },
    [demoSession],
  );

  const trackUsage = useCallback(
    (feature: string, page: string) => {
      if (!demoSession) return;

      try {
        const updatedSession = {
          ...demoSession,
          featuresUsed: [...new Set([...demoSession.featuresUsed, feature])],
          pagesVisited: [...demoSession.pagesVisited, page],
        };

        setDemoSession(updatedSession);
        localStorage.setItem("demo_session", JSON.stringify(updatedSession));
      } catch (error) {
        console.error("Failed to track usage:", error);
      }
    },
    [demoSession],
  );

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }, []);

  const getAccessLevelIcon = useCallback((level: string) => {
    switch (level) {
      case "enterprise":
        return <Crown className="w-4 h-4" />;
      case "professional":
        return <Zap className="w-4 h-4" />;
      case "starter":
        return <Star className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  }, []);

  const getAccessLevelColor = useCallback((level: string) => {
    switch (level) {
      case "enterprise":
        return "bg-yellow-100 text-yellow-800";
      case "professional":
        return "bg-purple-100 text-purple-800";
      case "starter":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  const contextValue: DemoAccessContextType = {
    demoSession,
    checkAccess,
    extendDemo,
    upgradeAccess,
    trackUsage,
    isLoading,
  };

  return (
    <DemoAccessContext.Provider value={contextValue}>
      {children}

      {/* Demo Session Timer - Fixed position */}
      {demoSession && (
        <div className="fixed top-4 right-4 z-50">
          <Card
            className={`w-80 shadow-lg border-2 ${
              demoSession.remainingTime < 300
                ? "border-red-500 bg-red-50"
                : demoSession.remainingTime < 900
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-blue-500 bg-blue-50"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  <CardTitle className="text-sm">Demo Session</CardTitle>
                </div>
                <Badge className={getAccessLevelColor(demoSession.accessLevel)}>
                  {getAccessLevelIcon(demoSession.accessLevel)}
                  {demoSession.accessLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Time Remaining</span>
                  <span
                    className={`font-mono ${
                      demoSession.remainingTime < 300
                        ? "text-red-600"
                        : demoSession.remainingTime < 900
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {formatTime(demoSession.remainingTime)}
                  </span>
                </div>
                <Progress
                  value={(demoSession.remainingTime / 3600) * 100}
                  className="h-2"
                />
              </div>

              <div className="text-xs text-muted-foreground">
                Features used: {demoSession.featuresUsed.length} • Pages
                visited: {demoSession.pagesVisited.length}
              </div>

              {demoSession.remainingTime < 300 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 text-xs">
                    Demo expires soon! Upgrade to continue using all features.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                {demoSession.accessLevel !== "enterprise" && (
                  <Button
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setShowDemoModal(true)}
                  >
                    <ArrowRight className="w-3 h-3 mr-1" />
                    Upgrade Demo
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => extendDemo(15)}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  +15 min
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Demo Upgrade Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Upgrade Your Demo Experience
              </CardTitle>
              <CardDescription>
                Get access to more features and extended time limits with higher
                demo tiers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {[
                  {
                    level: "starter",
                    name: "Starter Demo",
                    features: [
                      "Basic investing tools",
                      "Portfolio tracking",
                      "30min per route",
                    ],
                    icon: <Star className="w-5 h-5" />,
                  },
                  {
                    level: "professional",
                    name: "Professional Demo",
                    features: [
                      "Advanced analytics",
                      "API access",
                      "All professional routes",
                      "15min per route",
                    ],
                    icon: <Zap className="w-5 h-5" />,
                  },
                  {
                    level: "enterprise",
                    name: "Enterprise Demo",
                    features: [
                      "Complete legendary investor suite",
                      "All enterprise features",
                      "10min per route",
                    ],
                    icon: <Crown className="w-5 h-5" />,
                  },
                ].map((tier) => (
                  <Card
                    key={tier.level}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      demoSession?.accessLevel === tier.level
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => {
                      upgradeAccess(
                        tier.level as "starter" | "professional" | "enterprise",
                      );
                      setShowDemoModal(false);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={getAccessLevelColor(tier.level)}>
                            {tier.icon}
                          </div>
                          <h4 className="font-semibold">{tier.name}</h4>
                        </div>
                        {demoSession?.accessLevel === tier.level && (
                          <Badge className="bg-green-100 text-green-800">
                            Current
                          </Badge>
                        )}
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowDemoModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => (window.location.href = "/pricing")}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Get Full Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DemoAccessContext.Provider>
  );
};

// Demo Access Guard Component
export const DemoAccessGuard: React.FC<{
  route: string;
  feature?: string;
  children: React.ReactNode;
}> = ({ route, feature, children }) => {
  const { checkAccess } = useDemoAccess();
  const access = checkAccess(route, feature);

  if (!access.canAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>{access.upgradePrompt}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {access.restrictedFeatures.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">
                  Features requiring upgrade:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {access.restrictedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Shield className="w-3 h-3" />
                      {feature.replace("_", " ").toUpperCase()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="flex-1"
              >
                Go Back
              </Button>
              <Button
                onClick={() => (window.location.href = "/pricing")}
                className="flex-1"
              >
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
