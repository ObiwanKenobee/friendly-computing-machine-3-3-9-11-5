import React, { useState, useEffect } from "react";
import ResponsiveNavbar from "../components/ResponsiveNavbar";
import SecurityDashboard from "../components/SecurityDashboard";
import ProductionGuide from "../components/ProductionGuide";
import PaymentProcessor from "../components/PaymentProcessor";
import PaymentDashboard from "../components/PaymentDashboard";
import { EnterpriseOperationalDashboard } from "../components/EnterpriseOperationalDashboard";
import { UserInteractionDashboard } from "../components/UserInteractionDashboard";
import { SEOHead, pageSEOConfigs } from "../components/SEOHead";
import { useEnterpriseAuth } from "../components/QuickEnterpriseSecurityProvider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Shield,
  Zap,
  Users,
  Globe,
  TrendingUp,
  Star,
  CheckCircle,
  Crown,
  Activity,
  Database,
  Lock,
  Eye,
  AlertTriangle,
  Brain,
  Target,
  MousePointer,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";
import LoginModal from "../components/auth/LoginModal";

// Import services for tracking
import { userInteractionService } from "../services/userInteractionService";
import { seoTrafficService } from "../services/seoTrafficService";

const Index = () => {
  const { isAuthenticated, user, securityStatus, paymentAccess, logout } =
    useEnterpriseAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pageLoadTime, setPageLoadTime] = useState<number>(0);
  const [userInteractions, setUserInteractions] = useState<number>(0);

  // Performance and SEO tracking
  useEffect(() => {
    // Track page load performance
    const startTime = performance.now();

    const handleLoad = async () => {
      try {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        setPageLoadTime(loadTime);

        // Track page view safely
        if (
          seoTrafficService &&
          typeof seoTrafficService.trackUserJourney === "function"
        ) {
          await seoTrafficService.trackUserJourney(user?.id || "anonymous", [
            "/",
          ]);
        }

        // Optimize page load safely
        if (
          seoTrafficService &&
          typeof seoTrafficService.optimizePageLoad === "function"
        ) {
          await seoTrafficService.optimizePageLoad("/");
        }
      } catch (error) {
        console.error("Failed to track page performance:", error);
      }
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [user]);

  // User interaction tracking
  useEffect(() => {
    const trackInteraction = async (event: Event) => {
      try {
        const target = event.target as HTMLElement;
        const interactionType = event.type as "click" | "scroll" | "mouseover";

        if (
          userInteractionService &&
          typeof userInteractionService.trackInteraction === "function"
        ) {
          await userInteractionService.trackInteraction({
            type: interactionType,
            element:
              target.tagName.toLowerCase() +
              (target.className ? `.${target.className.split(" ")[0]}` : ""),
            position: {
              x: "clientX" in event ? (event as MouseEvent).clientX : 0,
              y: "clientY" in event ? (event as MouseEvent).clientY : 0,
            },
            duration: 0,
            metadata: {
              page: "/",
              authenticated: isAuthenticated,
              userAgent: navigator.userAgent,
            },
          });
        }

        setUserInteractions((prev) => prev + 1);
      } catch (error) {
        console.error("Failed to track user interaction:", error);
      }
    };

    // Add event listeners for tracking
    document.addEventListener("click", trackInteraction);
    document.addEventListener("scroll", trackInteraction);
    document.addEventListener("mouseover", trackInteraction);

    return () => {
      document.removeEventListener("click", trackInteraction);
      document.removeEventListener("scroll", trackInteraction);
      document.removeEventListener("mouseover", trackInteraction);
    };
  }, [isAuthenticated]);

  // Track user journey
  useEffect(() => {
    const trackJourney = async () => {
      try {
        if (
          user &&
          userInteractionService &&
          typeof userInteractionService.trackUserJourney === "function"
        ) {
          await userInteractionService.trackUserJourney(user.id, {
            channel: "direct",
            action: "page_view",
            outcome: "positive",
            value: 1,
            context: { page: "/", loadTime: pageLoadTime },
          });
        }
      } catch (error) {
        console.error("Failed to track user journey:", error);
      }
    };

    trackJourney();
  }, [user, pageLoadTime]);

  // Handle login action
  const handleLoginClick = async () => {
    try {
      if (
        userInteractionService &&
        typeof userInteractionService.trackInteraction === "function"
      ) {
        await userInteractionService.trackInteraction({
          type: "click",
          element: "login-button",
          position: { x: 0, y: 0 },
          duration: 0,
          metadata: { action: "login_initiated" },
        });
      }
    } catch (error) {
      console.error("Failed to track login click:", error);
    }
    setShowLoginModal(true);
  };

  const handleLoginSuccess = async () => {
    try {
      if (
        userInteractionService &&
        typeof userInteractionService.trackInteraction === "function"
      ) {
        await userInteractionService.trackInteraction({
          type: "click",
          element: "login-success",
          position: { x: 0, y: 0 },
          duration: 0,
          metadata: { action: "login_completed" },
        });
      }
    } catch (error) {
      console.error("Failed to track login success:", error);
    }
    setShowLoginModal(false);
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "QuantumVest",
    url: "https://quantumvest.com",
    description:
      "Enterprise-grade financial innovation platform with military-grade security",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://quantumvest.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "QuantumVest",
      logo: "https://quantumvest.com/logo.png",
    },
  };

  return (
    <>
      <SEOHead {...pageSEOConfigs.home} structuredData={structuredData} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <ResponsiveNavbar />

        {!isAuthenticated ? (
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 mb-6">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  QuantumVest Defense Platform
                </h1>
                <div className="flex items-center space-x-2">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Eye
                  className="h-6 w-6 text-blue-600 animate-pulse"
                  style={{ transform: "translateY(-8px)" }}
                />
                <p className="text-xl text-gray-600 max-w-3xl">
                  Military-grade Cisco XDR security meets global financial
                  innovation. Enterprise-grade platform supporting 7,000+
                  languages with quantum-level protection.
                </p>
              </div>

              {/* Real-time Performance Metrics */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-8 max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-blue-600">
                      {pageLoadTime.toFixed(0)}ms
                    </div>
                    <div className="text-gray-600">Page Load</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-600">
                      {userInteractions}
                    </div>
                    <div className="text-gray-600">Interactions</div>
                  </div>
                </div>
              </div>

              {/* Authentication Section */}
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Enterprise Access
                </h2>
                <p className="text-gray-600 mb-6">
                  Secure login with multi-factor authentication and payment
                  verification
                </p>
                <Button
                  onClick={handleLoginClick}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Lock className="h-5 w-5 mr-2" />
                  Enterprise Login
                </Button>
              </div>

              {/* Real-time Status Indicators */}
              <div className="flex justify-center space-x-8 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Security: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    Payments: Operational
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    Global: 195 Regions
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Feature Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <Card className="border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <span>Cisco XDR Security</span>
                  </CardTitle>
                  <CardDescription>
                    Military-grade threat detection and response with AI-powered
                    analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Threats Blocked</span>
                      <Badge>12,847</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Uptime</span>
                      <Badge variant="outline">99.99%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Response Time</span>
                      <Badge variant="secondary">&lt;100ms</Badge>
                    </div>
                    <Progress value={99.99} className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="h-6 w-6 text-green-600" />
                    <span>Payment Processing</span>
                  </CardTitle>
                  <CardDescription>
                    PayPal & Paystack integration with advanced fraud detection
                    and PCI compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Processing Rate</span>
                      <Badge>99.8%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Fraud Prevention</span>
                      <Badge variant="outline">AI-Powered</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Currencies</span>
                      <Badge variant="secondary">10+</Badge>
                    </div>
                    <Progress value={99.8} className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-6 w-6 text-purple-600" />
                    <span>Global Languages</span>
                  </CardTitle>
                  <CardDescription>
                    7,000+ languages with cultural sovereignty and regional
                    adaptation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Languages</span>
                      <Badge>7,000+</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Regions</span>
                      <Badge variant="outline">195</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cultural Adaptations</span>
                      <Badge variant="secondary">50+</Badge>
                    </div>
                    <Progress value={95} className="mt-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Analytics Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-6 w-6 text-orange-600" />
                    <span>AI-Powered Insights</span>
                  </CardTitle>
                  <CardDescription>
                    Advanced behavioral analytics and predictive intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        87.3%
                      </div>
                      <p className="text-sm text-gray-600">
                        Prediction Accuracy
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        2.4M
                      </div>
                      <p className="text-sm text-gray-600">Data Points</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Alert>
                      <MousePointer className="h-4 w-4" />
                      <AlertDescription>
                        Real-time user interaction tracking and sentiment
                        analysis active
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-indigo-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-6 w-6 text-indigo-600" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                  <CardDescription>
                    Real-time system performance and optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">
                        156ms
                      </div>
                      <p className="text-sm text-gray-600">Avg Response</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        99.99%
                      </div>
                      <p className="text-sm text-gray-600">Uptime</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>23%</span>
                    </div>
                    <Progress value={23} />
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demo Tabs for Non-Authenticated Users */}
            <Tabs defaultValue="security" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="production">Production</TabsTrigger>
              </TabsList>
              <TabsContent value="security">
                <SecurityDashboard />
              </TabsContent>
              <TabsContent value="payments">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PaymentProcessor />
                  <PaymentDashboard />
                </div>
              </TabsContent>
              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Enterprise Analytics Preview</CardTitle>
                    <CardDescription>
                      Advanced analytics and reporting capabilities with
                      real-time insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          2.4M
                        </div>
                        <p className="text-sm text-gray-600">
                          Data Points Processed
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          97.3%
                        </div>
                        <p className="text-sm text-gray-600">
                          Processing Accuracy
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                          156ms
                        </div>
                        <p className="text-sm text-gray-600">
                          Average Response Time
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">
                          {userInteractions}
                        </div>
                        <p className="text-sm text-gray-600">
                          Live Interactions
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Alert>
                        <Activity className="h-4 w-4" />
                        <AlertDescription>
                          Login to access full analytics dashboard with
                          real-time monitoring, behavioral insights, and
                          predictive analytics.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="production">
                <ProductionGuide />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            {/* Welcome Header for Authenticated Users */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back,{" "}
                    {user?.role === "admin" ? "Administrator" : user?.email}
                  </h1>
                  <p className="text-gray-600">
                    Security Level: {securityStatus.threatLevel.toUpperCase()} |
                    Payment: {paymentAccess ? "Active" : "Inactive"} | Tier:{" "}
                    {user?.subscriptionTier} | Load Time:{" "}
                    {pageLoadTime.toFixed(0)}ms
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {securityStatus.threatLevel === "high" && (
                    <Alert className="border-red-200">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        High threat level detected
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="text-sm text-gray-600">
                    {userInteractions} interactions tracked
                  </div>
                  <Button onClick={logout} variant="outline">
                    Logout
                  </Button>
                </div>
              </div>
            </div>

            {/* Enterprise Dashboard Tabs */}
            <Tabs defaultValue="operations" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="operations">Operations Center</TabsTrigger>
                <TabsTrigger value="interactions">User Analytics</TabsTrigger>
                <TabsTrigger value="insights">Advanced Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="operations">
                <EnterpriseOperationalDashboard />
              </TabsContent>

              <TabsContent value="interactions">
                <UserInteractionDashboard />
              </TabsContent>

              <TabsContent value="insights">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Behavioral Intelligence</CardTitle>
                      <CardDescription>
                        Advanced user behavior patterns and predictions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Engagement Score</span>
                          <span className="font-bold text-green-600">
                            87.3%
                          </span>
                        </div>
                        <Progress value={87.3} />

                        <div className="flex justify-between items-center">
                          <span>Conversion Probability</span>
                          <span className="font-bold text-blue-600">73.2%</span>
                        </div>
                        <Progress value={73.2} />

                        <div className="flex justify-between items-center">
                          <span>Sentiment Score</span>
                          <span className="font-bold text-purple-600">
                            +0.34
                          </span>
                        </div>
                        <Progress value={67} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Intelligence</CardTitle>
                      <CardDescription>
                        System optimization and traffic insights
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600">
                            {pageLoadTime.toFixed(0)}
                          </div>
                          <p className="text-sm text-gray-600">
                            Page Load Time (ms)
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              45.2K
                            </div>
                            <p className="text-xs text-gray-600">
                              Organic Traffic
                            </p>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-orange-600">
                              99.8%
                            </div>
                            <p className="text-xs text-gray-600">
                              Core Web Vitals
                            </p>
                          </div>
                        </div>

                        <Alert>
                          <Zap className="h-4 w-4" />
                          <AlertDescription>
                            All performance metrics are optimal. SEO score:
                            98/100
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      </div>
    </>
  );
};

export default Index;
