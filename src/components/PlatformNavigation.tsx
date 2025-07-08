import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  Star,
  Crown,
  Zap,
  Users,
  Globe,
  Target,
  Shield,
  Brain,
  TrendingUp,
  Sparkles,
  Activity,
  BarChart3,
  DollarSign,
  Clock,
  ArrowRight,
  Play,
  Eye,
  Lock,
  Unlock,
  Filter,
  Grid3X3,
  List,
  BookOpen,
  CreditCard,
  Settings,
  HelpCircle,
  ExternalLink,
  TreePine,
  Heart,
  Infinity,
} from "lucide-react";

import { useDemoAccess, DemoAccessGuard } from "@/components/QuickDemoProvider";

interface RouteInfo {
  path: string;
  name: string;
  description: string;
  category: "free" | "starter" | "professional" | "enterprise";
  tier: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  targetAudience: string;
  estimatedTime: number; // minutes
  popularity: number; // 1-5
  isNew?: boolean;
  isPopular?: boolean;
  isComingSoon?: boolean;
}

const PLATFORM_ROUTES: RouteInfo[] = [
  // Free Tier Routes
  {
    path: "/dashboard",
    name: "Investment Dashboard",
    description:
      "Your personal investment command center with portfolio overview",
    category: "free",
    tier: "Free",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "text-blue-600 bg-blue-100",
    features: ["Portfolio tracking", "Basic analytics", "Market overview"],
    targetAudience: "All investors",
    estimatedTime: 10,
    popularity: 5,
    isPopular: true,
  },
  {
    path: "/pricing",
    name: "Subscription Plans",
    description: "Choose the perfect plan for your investment journey",
    category: "free",
    tier: "Free",
    icon: <CreditCard className="w-6 h-6" />,
    color: "text-green-600 bg-green-100",
    features: ["Plan comparison", "Feature breakdown", "Pricing calculator"],
    targetAudience: "All users",
    estimatedTime: 5,
    popularity: 4,
  },
  {
    path: "/billing",
    name: "Billing & Payments",
    description: "Manage your subscription and payment methods",
    category: "free",
    tier: "Free",
    icon: <DollarSign className="w-6 h-6" />,
    color: "text-purple-600 bg-purple-100",
    features: ["Invoice management", "Payment history", "Usage tracking"],
    targetAudience: "Subscribers",
    estimatedTime: 8,
    popularity: 3,
  },
  {
    path: "/age-switcher-demo",
    name: "Age Switcher Demo",
    description:
      "Experience age-based investment personalization and strategies",
    category: "free",
    tier: "Free",
    icon: <Users className="w-6 h-6" />,
    color: "text-indigo-600 bg-indigo-100",
    features: [
      "Age-based strategies",
      "Risk personalization",
      "Legendary investor wisdom",
    ],
    targetAudience: "All investors",
    estimatedTime: 12,
    popularity: 4,
    isNew: true,
  },
  {
    path: "/game-layout-demo",
    name: "Game Layout Demo",
    description:
      "Explore game-inspired responsive layouts for investment interfaces",
    category: "free",
    tier: "Free",
    icon: <Grid3X3 className="w-6 h-6" />,
    color: "text-emerald-600 bg-emerald-100",
    features: ["Mahjong layout", "Solitaire view", "Interactive design"],
    targetAudience: "UI/UX enthusiasts",
    estimatedTime: 15,
    popularity: 3,
  },
  {
    path: "/methuselah-enterprise",
    name: "Methuselah Enterprise",
    description:
      "Complete 969-year enterprise lifecycle with age-curated innovations",
    category: "enterprise",
    tier: "Enterprise",
    icon: <Infinity className="w-6 h-6" />,
    color: "text-violet-600 bg-violet-100",
    features: [
      "Life cycle simulation",
      "Age-curated content",
      "Innovation roadmaps",
    ],
    targetAudience: "Visionary enterprises",
    estimatedTime: 45,
    popularity: 5,
    isNew: true,
  },
  {
    path: "/geographical-consciousness",
    name: "Geographical Consciousness",
    description:
      "Spatial intelligence integrated with age-based investment consciousness",
    category: "professional",
    tier: "Professional",
    icon: <Globe className="w-6 h-6" />,
    color: "text-emerald-600 bg-emerald-100",
    features: [
      "Google Maps integration",
      "Spatial opportunities",
      "Risk mapping",
    ],
    targetAudience: "Global investors",
    estimatedTime: 30,
    popularity: 4,
    isNew: true,
  },
  {
    path: "/archetypes",
    name: "Investor Archetypes",
    description: "Discover your investment personality and optimal strategies",
    category: "free",
    tier: "Free",
    icon: <Target className="w-6 h-6" />,
    color: "text-indigo-600 bg-indigo-100",
    features: [
      "Personality assessment",
      "Strategy matching",
      "Recommendations",
    ],
    targetAudience: "New investors",
    estimatedTime: 15,
    popularity: 5,
  },
  {
    path: "/enterprise-subscriptions",
    name: "Enterprise Overview",
    description: "Complete overview of all subscription tiers and workflows",
    category: "free",
    tier: "Free",
    icon: <Grid3X3 className="w-6 h-6" />,
    color: "text-gray-600 bg-gray-100",
    features: ["Tier comparison", "Workflow guides", "Feature overview"],
    targetAudience: "All users",
    estimatedTime: 10,
    popularity: 4,
    isNew: true,
  },

  // Starter Tier Routes
  {
    path: "/retail-investor",
    name: "Retail Investor",
    description: "Simplified investment platform for individual investors",
    category: "starter",
    tier: "Starter",
    icon: <Users className="w-6 h-6" />,
    color: "text-blue-600 bg-blue-100",
    features: [
      "User-friendly interface",
      "Educational resources",
      "Basic analytics",
    ],
    targetAudience: "Individual investors",
    estimatedTime: 30,
    popularity: 5,
    isPopular: true,
  },
  {
    path: "/emerging-market-citizen",
    name: "Emerging Market Citizen",
    description: "Localized investment solutions for developing economies",
    category: "starter",
    tier: "Starter",
    icon: <Globe className="w-6 h-6" />,
    color: "text-emerald-600 bg-emerald-100",
    features: [
      "Local currency support",
      "Micro-investments",
      "Regional opportunities",
    ],
    targetAudience: "Emerging market investors",
    estimatedTime: 25,
    popularity: 4,
  },
  {
    path: "/student-early-career",
    name: "Student & Early Career",
    description: "Educational investment platform for young professionals",
    category: "starter",
    tier: "Starter",
    icon: <BookOpen className="w-6 h-6" />,
    color: "text-teal-600 bg-teal-100",
    features: ["Educational content", "Small minimums", "Career guidance"],
    targetAudience: "Students and young professionals",
    estimatedTime: 20,
    popularity: 4,
  },

  // Professional Tier Routes
  {
    path: "/financial-advisor",
    name: "Financial Advisor",
    description: "Professional tools for wealth managers and advisors",
    category: "professional",
    tier: "Professional",
    icon: <Crown className="w-6 h-6" />,
    color: "text-purple-600 bg-purple-100",
    features: ["Client management", "Portfolio modeling", "Compliance tools"],
    targetAudience: "Financial professionals",
    estimatedTime: 15,
    popularity: 4,
  },
  {
    path: "/developer-integrator",
    name: "Developer Platform",
    description: "API access and development tools for fintech builders",
    category: "professional",
    tier: "Professional",
    icon: <Settings className="w-6 h-6" />,
    color: "text-gray-600 bg-gray-100",
    features: ["Full API access", "SDK libraries", "Documentation"],
    targetAudience: "Developers and integrators",
    estimatedTime: 15,
    popularity: 3,
  },
  {
    path: "/cultural-investor",
    name: "Cultural Investor",
    description: "Values-aligned investing based on cultural principles",
    category: "professional",
    tier: "Professional",
    icon: <Heart className="w-6 h-6" />,
    color: "text-pink-600 bg-pink-100",
    features: ["ESG screening", "Cultural alignment", "Impact measurement"],
    targetAudience: "Values-driven investors",
    estimatedTime: 15,
    popularity: 4,
  },
  {
    path: "/diaspora-investor",
    name: "Diaspora Investor",
    description: "Cross-border investment solutions for diaspora communities",
    category: "professional",
    tier: "Professional",
    icon: <Globe className="w-6 h-6" />,
    color: "text-cyan-600 bg-cyan-100",
    features: [
      "Cross-border transfers",
      "Home market access",
      "Currency hedging",
    ],
    targetAudience: "Diaspora communities",
    estimatedTime: 15,
    popularity: 3,
  },
  {
    path: "/quant-data-driven-investor",
    name: "Quantitative Investor",
    description: "Advanced analytics and algorithmic trading",
    category: "professional",
    tier: "Professional",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "text-orange-600 bg-orange-100",
    features: ["Advanced analytics", "Backtesting", "Algorithm trading"],
    targetAudience: "Quantitative analysts",
    estimatedTime: 15,
    popularity: 4,
  },
  {
    path: "/public-sector-ngo",
    name: "Public Sector & NGO",
    description: "Investment solutions for public institutions",
    category: "professional",
    tier: "Professional",
    icon: <Shield className="w-6 h-6" />,
    color: "text-slate-600 bg-slate-100",
    features: ["Compliance tracking", "Impact reporting", "Transparency"],
    targetAudience: "Government and NGOs",
    estimatedTime: 15,
    popularity: 3,
  },

  // Enterprise Tier Routes
  {
    path: "/tortoise-protocol",
    name: "🐢 Tortoise Protocol",
    description:
      "Ethical wealth creation through contemplative, rhythmic investment",
    category: "enterprise",
    tier: "Enterprise",
    icon: <TreePine className="w-6 h-6" />,
    color: "text-green-600 bg-green-100",
    features: [
      "Mythic insight design",
      "Philosophical vaults",
      "Rhythmic yield activation",
    ],
    targetAudience: "Contemplative investors, Cultural stewards",
    estimatedTime: 30,
    popularity: 4,
  },
  {
    path: "/legendary-investors-enterprise",
    name: "Legendary Investor Strategies",
    description: "Complete suite of legendary investment philosophies",
    category: "enterprise",
    tier: "Enterprise",
    icon: <Crown className="w-6 h-6" />,
    color: "text-yellow-600 bg-yellow-100",
    features: ["Munger Models", "Buffett Moats", "Dalio Balance"],
    targetAudience: "Elite investors",
    estimatedTime: 10,
    popularity: 5,
    isNew: true,
    isPopular: true,
  },
  {
    path: "/institutional-investor",
    name: "Institutional Investor",
    description: "Advanced portfolio management for institutions",
    category: "enterprise",
    tier: "Enterprise",
    icon: <Shield className="w-6 h-6" />,
    color: "text-red-600 bg-red-100",
    features: [
      "Bulk processing",
      "Advanced risk analytics",
      "Custom reporting",
    ],
    targetAudience: "Institutional investors",
    estimatedTime: 10,
    popularity: 4,
  },
  {
    path: "/african-market-enterprise",
    name: "African Market Enterprise",
    description: "Enterprise solutions for African businesses",
    category: "enterprise",
    tier: "Enterprise",
    icon: <Globe className="w-6 h-6" />,
    color: "text-amber-600 bg-amber-100",
    features: [
      "Multi-country compliance",
      "Regional insights",
      "Local payments",
    ],
    targetAudience: "African enterprises",
    estimatedTime: 10,
    popularity: 3,
  },
  {
    path: "/wildlife-conservation-enterprise",
    name: "Wildlife Conservation",
    description: "Conservation-focused investment platform",
    category: "enterprise",
    tier: "Enterprise",
    icon: <TreePine className="w-6 h-6" />,
    color: "text-lime-600 bg-lime-100",
    features: ["Conservation metrics", "Biodiversity tracking", "Impact bonds"],
    targetAudience: "Conservation organizations",
    estimatedTime: 10,
    popularity: 3,
  },
  {
    path: "/quantum-enterprise-2050",
    name: "Quantum Enterprise 2050",
    description: "Next-generation investment platform",
    category: "enterprise",
    tier: "Enterprise",
    icon: <Zap className="w-6 h-6" />,
    color: "text-violet-600 bg-violet-100",
    features: [
      "Quantum computing",
      "Future tech analysis",
      "Scenario modeling",
    ],
    targetAudience: "Future-tech enterprises",
    estimatedTime: 10,
    popularity: 4,
    isNew: true,
  },
];

const PlatformNavigation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popularity");
  const [showInstructions, setShowInstructions] = useState(false);
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(
    new Set(),
  );

  const { hasAccess, tier } = useDemoAccess();

  // Route filtering and sorting logic
  const filteredRoutes = useMemo(() => {
    let routes = PLATFORM_ROUTES.filter((route) => {
      const matchesSearch =
        searchTerm === "" ||
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.features.some((feature) =>
          feature.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "all" || route.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort routes
    routes.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity - a.popularity;
        case "name":
          return a.name.localeCompare(b.name);
        case "tier":
          const tierOrder = {
            free: 1,
            starter: 2,
            professional: 3,
            enterprise: 4,
          };
          return tierOrder[a.category] - tierOrder[b.category];
        case "time":
          return a.estimatedTime - b.estimatedTime;
        default:
          return 0;
      }
    });

    return routes;
  }, [searchTerm, selectedCategory, sortBy]);

  // Access control
  const checkAccess = useCallback(
    (routePath: string) => {
      const route = PLATFORM_ROUTES.find((r) => r.path === routePath);
      if (!route) return { canAccess: false, upgradePrompt: "Route not found" };

      if (hasAccess) return { canAccess: true };

      switch (route.category) {
        case "free":
          return { canAccess: true };
        case "starter":
          return {
            canAccess: ["starter", "professional", "enterprise"].includes(tier),
            upgradePrompt: "Upgrade to Starter tier to access this feature",
          };
        case "professional":
          return {
            canAccess: ["professional", "enterprise"].includes(tier),
            upgradePrompt:
              "Upgrade to Professional tier to access this feature",
          };
        case "enterprise":
          return {
            canAccess: tier === "enterprise",
            upgradePrompt: "Upgrade to Enterprise tier to access this feature",
          };
        default:
          return { canAccess: false, upgradePrompt: "Unknown tier" };
      }
    },
    [hasAccess, tier],
  );

  // Route navigation
  const handleRouteAccess = useCallback(
    (route: RouteInfo) => {
      const access = checkAccess(route.path);
      if (access.canAccess) {
        window.open(route.path, "_blank");
      } else {
        setShowInstructions(true);
      }
    },
    [checkAccess],
  );

  // Statistics
  const tierStats = useMemo(() => {
    const stats = { free: 0, starter: 0, professional: 0, enterprise: 0 };
    PLATFORM_ROUTES.forEach((route) => {
      stats[route.category]++;
    });
    return stats;
  }, []);

  const toggleExpand = (platformPath: string) => {
    const newExpanded = new Set(expandedPlatforms);
    if (newExpanded.has(platformPath)) {
      newExpanded.delete(platformPath);
    } else {
      newExpanded.add(platformPath);
    }
    setExpandedPlatforms(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            QuantumVest Investment Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive investment ecosystem with legendary strategies,
            AI-powered insights, and enterprise-grade tools
          </p>
        </div>

        {/* Demo Status */}
        <DemoAccessGuard>
          <div className="max-w-md mx-auto">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Demo Session Active
                  </span>
                  <Badge className="bg-blue-100 text-blue-800">
                    Free Access
                  </Badge>
                </div>
                <div className="text-xs text-blue-600">
                  Explore all features • Full platform access for demo
                </div>
              </CardContent>
            </Card>
          </div>
        </DemoAccessGuard>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search investment platforms and features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg py-3"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
                size="sm"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                size="sm"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Filter by tier:</span>
            </div>
            {[
              {
                value: "all",
                label: "All Platforms",
                count: filteredRoutes.length,
              },
              { value: "free", label: "Free", count: tierStats.free },
              { value: "starter", label: "Starter", count: tierStats.starter },
              {
                value: "professional",
                label: "Professional",
                count: tierStats.professional,
              },
              {
                value: "enterprise",
                label: "Enterprise",
                count: tierStats.enterprise,
              },
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={
                  selectedCategory === filter.value ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(filter.value)}
                size="sm"
                className="text-xs"
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="platforms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="platforms">Investment Platforms</TabsTrigger>
            <TabsTrigger value="features">Enterprise Features</TabsTrigger>
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          </TabsList>

          <TabsContent value="platforms" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {tierStats.free}
                  </div>
                  <div className="text-sm text-gray-600">Free Platforms</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {tierStats.starter}
                  </div>
                  <div className="text-sm text-gray-600">Starter Platforms</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {tierStats.professional}
                  </div>
                  <div className="text-sm text-gray-600">Professional</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {tierStats.enterprise}
                  </div>
                  <div className="text-sm text-gray-600">Enterprise</div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Grid */}
            <div
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredRoutes.map((route) => {
                const access = checkAccess(route.path);

                return (
                  <Card
                    key={route.path}
                    className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                      !access.canAccess ? "opacity-60" : ""
                    } ${route.isPopular ? "ring-2 ring-blue-200" : ""}`}
                    onClick={() => handleRouteAccess(route)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-12 h-12 rounded-lg ${route.color} flex items-center justify-center`}
                        >
                          {route.icon}
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="text-xs">
                            {route.tier}
                          </Badge>
                          {route.isNew && (
                            <Badge className="text-xs bg-green-600">New</Badge>
                          )}
                          {route.isPopular && (
                            <Badge className="text-xs bg-blue-600">
                              Popular
                            </Badge>
                          )}
                          {!access.canAccess && (
                            <Badge className="text-xs bg-red-100 text-red-800">
                              <Lock className="w-3 h-3 mr-1" />
                              Locked
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <CardTitle className="text-lg mb-2">
                          {route.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {route.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">
                          Key Features:
                        </h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {route.features.slice(0, 3).map((feature, index) => (
                            <li
                              key={`${route.path}-feature-${index}`}
                              className="flex items-center gap-2"
                            >
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {route.targetAudience}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />~{route.estimatedTime}min
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={`${route.path}-star-${i}`}
                              className={`w-3 h-3 ${i < route.popularity ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>

                        <Button
                          size="sm"
                          disabled={!access.canAccess}
                          className="flex items-center gap-1 text-xs"
                        >
                          {access.canAccess ? (
                            <>
                              <Play className="w-3 h-3" />
                              Explore
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3" />
                              Upgrade
                            </>
                          )}
                        </Button>
                      </div>

                      {!access.canAccess && access.upgradePrompt && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          {access.upgradePrompt}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Enterprise Features
              </h2>
              <p className="text-gray-600">
                Advanced capabilities for professional investors and
                institutions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Legendary Investor Strategies",
                  description:
                    "Access proven methodologies from Munger, Buffett, Dalio, and Lynch",
                  icon: <Crown className="w-8 h-8 text-yellow-600" />,
                  tier: "Enterprise",
                },
                {
                  title: "Tortoise Protocol",
                  description:
                    "Ethical wealth creation through contemplative investment",
                  icon: <TreePine className="w-8 h-8 text-green-600" />,
                  tier: "Enterprise",
                },
                {
                  title: "Quantum Computing",
                  description:
                    "Next-generation portfolio optimization with quantum algorithms",
                  icon: <Zap className="w-8 h-8 text-purple-600" />,
                  tier: "Enterprise",
                },
                {
                  title: "Wildlife Conservation",
                  description:
                    "Impact investing for biodiversity and conservation",
                  icon: <TreePine className="w-8 h-8 text-emerald-600" />,
                  tier: "Enterprise",
                },
                {
                  title: "AI Explainability",
                  description:
                    "Transparent AI decision-making for professional use",
                  icon: <Brain className="w-8 h-8 text-blue-600" />,
                  tier: "Professional",
                },
                {
                  title: "API Integration",
                  description: "Full API access for custom integrations",
                  icon: <Settings className="w-8 h-8 text-gray-600" />,
                  tier: "Professional",
                },
              ].map((feature, index) => (
                <Card
                  key={`feature-${index}`}
                  className="hover:shadow-lg transition-all"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {feature.icon}
                        <div>
                          <CardTitle className="text-lg">
                            {feature.title}
                          </CardTitle>
                          <Badge className="mt-1">{feature.tier}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="getting-started" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Getting Started
              </h2>
              <p className="text-gray-600">
                Quick start guide to maximize your QuantumVest experience
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {[
                {
                  step: "1",
                  title: "Discover Your Archetype",
                  description:
                    "Take our personality assessment to understand your investment style",
                  action: "Start Assessment",
                  path: "/archetypes",
                  time: "15 minutes",
                },
                {
                  step: "2",
                  title: "Choose Your Plan",
                  description:
                    "Select the subscription tier that matches your investment needs",
                  action: "View Plans",
                  path: "/pricing",
                  time: "5 minutes",
                },
                {
                  step: "3",
                  title: "Explore Your Dashboard",
                  description:
                    "Get familiar with your personal investment command center",
                  action: "Open Dashboard",
                  path: "/dashboard",
                  time: "10 minutes",
                },
                {
                  step: "4",
                  title: "Access Premium Features",
                  description:
                    "Unlock legendary strategies and enterprise tools",
                  action: "Explore Features",
                  path: "/enterprise-subscriptions",
                  time: "30 minutes",
                },
              ].map((item, index) => (
                <Card
                  key={`step-${index}`}
                  className="hover:shadow-lg transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">
                          {item.step}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {item.time}
                          </span>
                          <Button
                            onClick={() => window.open(item.path, "_blank")}
                          >
                            {item.action}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlatformNavigation;
