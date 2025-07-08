/**
 * Enterprise Header Component
 * Advanced navigation with contextual awareness, trust indicators, and AI integration
 */

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Brain,
  Shield,
  TrendingUp,
  Globe,
  Users,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  ArrowLeft,
  Sparkles,
  Eye,
  MessageSquare,
  DollarSign,
  BarChart3,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Home,
  ChevronDown,
} from "lucide-react";

interface TrustScore {
  overall: number;
  transparency: number;
  ethics: number;
  performance: number;
  security: number;
}

interface UserContext {
  archetype: string;
  region: string;
  culturalProfile: string;
  investmentSize: "micro" | "small" | "medium" | "large" | "institutional";
  riskTolerance: "conservative" | "moderate" | "aggressive";
  behaviorPattern: string[];
  trustLevel: number;
  lastAction: string;
  predictedNextAction: string;
}

interface AIInsight {
  type: "suggestion" | "warning" | "opportunity" | "education";
  message: string;
  confidence: number;
  action?: string;
  reasoning: string[];
}

const EnterpriseHeader: React.FC = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [trustScore, setTrustScore] = useState<TrustScore>({
    overall: 94,
    transparency: 96,
    ethics: 98,
    performance: 89,
    security: 95,
  });
  const [userContext, setUserContext] = useState<UserContext>({
    archetype: "Professional Investor",
    region: "North America",
    culturalProfile: "Western Progressive",
    investmentSize: "medium",
    riskTolerance: "moderate",
    behaviorPattern: ["research_heavy", "esg_focused", "tech_savvy"],
    trustLevel: 87,
    lastAction: "Reviewed ESG portfolio allocation",
    predictedNextAction: "Compare renewable energy investments",
  });
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      type: "opportunity",
      message: "New carbon credit opportunities match your ESG preferences",
      confidence: 89,
      action: "View Carbon Credits",
      reasoning: [
        "Previous ESG investments",
        "Recent sustainability research",
        "Portfolio gap analysis",
      ],
    },
    {
      type: "suggestion",
      message: "Consider rebalancing: Tech allocation at 45% (target: 35%)",
      confidence: 76,
      action: "Rebalance Portfolio",
      reasoning: [
        "Portfolio drift detected",
        "Risk tolerance analysis",
        "Market conditions",
      ],
    },
  ]);
  const [notifications, setNotifications] = useState(3);
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    // Detect current page from URL
    const path = window.location.pathname;
    const pageMap: Record<string, string> = {
      "/": "Platform Overview",
      "/pricing": "Pricing & Plans",
      "/architecture": "System Architecture",
      "/enterprise-innovations": "Enterprise Innovations",
      "/super-admin": "Super Admin",
      "/retail-investor": "Retail Investor",
      "/institutional-investor": "Institutional Investor",
      "/developer-integrator": "Developer Hub",
    };
    setCurrentPage(pageMap[path] || path.split("/").pop() || "QuantumVest");
  }, []);

  const getTrustColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "suggestion":
        return <Sparkles className="h-4 w-4 text-blue-600" />;
      case "education":
        return <Brain className="h-4 w-4 text-purple-600" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const handleCommand = (command: string) => {
    console.log("Executing command:", command);
    setIsCommandOpen(false);

    // AI Command Processing
    const commandMap: Record<string, string> = {
      "show portfolio": "/portfolio",
      "find esg investments": "/investments?filter=esg",
      "check performance": "/analytics",
      "view carbon credits": "/carbon-credits",
      "rebalance portfolio": "/rebalance",
      "back to enterprise": "/enterprise-innovations",
      "go home": "/",
      pricing: "/pricing",
      architecture: "/architecture",
    };

    const route = commandMap[command.toLowerCase()];
    if (route) {
      window.location.href = route;
    }
  };

  const handleBackToEnterprise = () => {
    window.location.href = "/enterprise-innovations";
  };

  const archetypePages = [
    {
      name: "Retail Investor",
      path: "/retail-investor",
      icon: <Users className="h-4 w-4" />,
    },
    {
      name: "Institutional Investor",
      path: "/institutional-investor",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      name: "Developer Hub",
      path: "/developer-integrator",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      name: "Financial Advisor",
      path: "/financial-advisor",
      icon: <Brain className="h-4 w-4" />,
    },
    {
      name: "Cultural Investor",
      path: "/cultural-investor",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      name: "African Enterprise",
      path: "/african-market-enterprise",
      icon: <Globe className="h-4 w-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="max-w-full mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo and Navigation */}
          <div className="flex items-center space-x-6">
            {/* Back to Enterprise Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToEnterprise}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:block">Enterprise</span>
            </Button>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-gray-900">QuantumVest</h1>
                <p className="text-xs text-gray-500">{currentPage}</p>
              </div>
            </div>

            {/* Main Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    Investment Archetypes
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] grid-cols-2">
                      {archetypePages.map((archetype) => (
                        <NavigationMenuLink
                          key={archetype.path}
                          href={archetype.path}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {archetype.icon}
                          <span className="text-sm font-medium">
                            {archetype.name}
                          </span>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/pricing"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/architecture"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Architecture
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Center: AI Command Bar */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setIsCommandOpen(true)}
                className="w-full justify-start text-gray-500 font-normal h-9"
              >
                <Search className="h-4 w-4 mr-2" />
                <span>Type what you want to do...</span>
                <Badge variant="secondary" className="ml-auto">
                  ⌘K
                </Badge>
              </Button>

              {isCommandOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50">
                  <Command className="rounded-lg border shadow-md bg-white">
                    <CommandInput placeholder="Ask anything or describe what you want to do..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Suggested Actions">
                        <CommandItem
                          onSelect={() => handleCommand("show portfolio")}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          <span>Show my portfolio performance</span>
                        </CommandItem>
                        <CommandItem
                          onSelect={() => handleCommand("find esg investments")}
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          <span>Find ESG investment opportunities</span>
                        </CommandItem>
                        <CommandItem
                          onSelect={() => handleCommand("rebalance portfolio")}
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          <span>Rebalance my portfolio</span>
                        </CommandItem>
                        <CommandItem
                          onSelect={() => handleCommand("back to enterprise")}
                        >
                          <Home className="mr-2 h-4 w-4" />
                          <span>Back to Enterprise Dashboard</span>
                        </CommandItem>
                      </CommandGroup>
                      <CommandGroup heading="Based on Your Profile">
                        <CommandItem
                          onSelect={() => handleCommand("view carbon credits")}
                        >
                          <Globe className="mr-2 h-4 w-4" />
                          <span>Explore carbon credit investments</span>
                          <Badge variant="outline" className="ml-auto">
                            89% match
                          </Badge>
                        </CommandItem>
                        <CommandItem
                          onSelect={() => handleCommand("check performance")}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          <span>Review Q4 performance analytics</span>
                          <Badge variant="outline" className="ml-auto">
                            76% match
                          </Badge>
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
          </div>

          {/* Right: Trust Indicators, AI Insights, User Menu */}
          <div className="flex items-center space-x-4">
            {/* Trust Score Indicator */}
            <div className="hidden lg:flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <Badge className={getTrustColor(trustScore.overall)}>
                Trust {trustScore.overall}%
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                AEGIS ✓
              </Badge>
            </div>

            {/* AI Insights */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Brain className="h-4 w-4" />
                  {aiInsights.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-blue-600">
                      {aiInsights.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b">
                  <h4 className="font-medium">AI Insights</h4>
                  <p className="text-sm text-gray-600">
                    Personalized for {userContext.archetype}
                  </p>
                </div>
                {aiInsights.map((insight, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="p-4 flex-col items-start"
                  >
                    <div className="flex items-center space-x-2 w-full">
                      {getInsightIcon(insight.type)}
                      <span className="font-medium text-sm">
                        {insight.message}
                      </span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {insight.confidence}%
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Why: {insight.reasoning.join(", ")}
                    </div>
                    {insight.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-7 text-xs"
                        onClick={() => handleCommand(insight.action!)}
                      >
                        {insight.action}
                      </Button>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-600">
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <div className="p-3 border-b">
                  <h4 className="font-medium">Notifications</h4>
                </div>
                <DropdownMenuItem className="p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        ESG Fund Allocation Complete
                      </p>
                      <p className="text-xs text-gray-600">
                        $50,000 allocated to renewable energy portfolio
                      </p>
                      <p className="text-xs text-gray-400">2 minutes ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-4">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        Portfolio Rebalancing Suggested
                      </p>
                      <p className="text-xs text-gray-600">
                        AI detected drift from target allocation
                      </p>
                      <p className="text-xs text-gray-400">1 hour ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">John Doe</p>
                    <p className="w-[200px] truncate text-sm text-gray-600">
                      john@example.com
                    </p>
                    <Badge variant="outline" className="w-fit text-xs">
                      {userContext.archetype}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>My Journey</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Context Bar - Shows user's current context and predicted next action */}
        <div className="hidden md:flex items-center justify-between py-2 px-1 text-xs text-gray-600 border-t bg-gray-50/50">
          <div className="flex items-center space-x-4">
            <span>Last: {userContext.lastAction}</span>
            <span>•</span>
            <span className="flex items-center">
              <Brain className="h-3 w-3 mr-1" />
              Predicted: {userContext.predictedNextAction}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {userContext.region}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {userContext.culturalProfile}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Trust {userContext.trustLevel}%
            </Badge>
          </div>
        </div>
      </div>

      {/* Command Modal Overlay */}
      {isCommandOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsCommandOpen(false)}
        />
      )}
    </header>
  );
};

export { EnterpriseHeader };
