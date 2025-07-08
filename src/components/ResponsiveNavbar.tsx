/**
 * ResponsiveNavbar - Comprehensive responsive navigation for all screen sizes
 * Includes all menu items: Advisor offline, Platform, Dashboard, Infrastructure,
 * Serverless APIs, Enterprise, SuperAdmin, UltraLevel, Components, country flag, Get Started, QV
 */

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  BarChart3,
  Cpu,
  Cloud,
  Building,
  Shield,
  Zap,
  Component,
  Circle,
  Settings,
  User,
  LogOut,
  Bot,
  Activity,
  Users,
  Briefcase,
  Server,
  Database,
  Code,
  Crown,
  Star,
  Home,
} from "lucide-react";

interface ResponsiveNavbarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  badge?: string;
  status?: "online" | "offline" | "processing";
}

export const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({
  className = "",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [advisorStatus, setAdvisorStatus] = useState<
    "online" | "offline" | "processing"
  >("offline");

  // Toggle advisor status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ["online", "offline", "processing"] as const;
      setAdvisorStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const mainNavItems: NavItem[] = [
    {
      title: "Platform",
      href: "/platform-navigation",
      icon: <Globe className="h-4 w-4" />,
      description: "Core platform features",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Analytics & insights",
    },
    {
      title: "Infrastructure",
      href: "/infrastructure",
      icon: <Server className="h-4 w-4" />,
      description: "System architecture",
    },
    {
      title: "Serverless APIs",
      href: "/serverless-apis",
      icon: <Cloud className="h-4 w-4" />,
      description: "API management",
    },
  ];

  const enterpriseNavItems: NavItem[] = [
    {
      title: "Enterprise",
      href: "/enterprise-innovations",
      icon: <Building className="h-4 w-4" />,
      description: "Enterprise solutions",
    },
    {
      title: "SuperAdmin",
      href: "/super-admin",
      icon: <Shield className="h-4 w-4" />,
      description: "Admin dashboard",
    },
    {
      title: "UltraLevel",
      href: "/ultra-level",
      icon: <Crown className="h-4 w-4" />,
      description: "Premium features",
    },
    {
      title: "Components",
      href: "/components",
      icon: <Component className="h-4 w-4" />,
      description: "UI components",
      badge: "3",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-500";
      case "offline":
        return "text-red-500";
      case "processing":
        return "text-yellow-500 animate-pulse";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      case "processing":
        return "Processing";
      default:
        return "Unknown";
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">QV</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">QuantumVest</h1>
                <p className="text-xs text-gray-500">Enterprise Platform</p>
              </div>
            </div>

            {/* Advisor Status - Always visible */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-full border">
              <Bot className="h-3 w-3 text-gray-600" />
              <Circle
                className={`h-2 w-2 fill-current ${getStatusColor(advisorStatus)}`}
              />
              <span className="text-xs font-medium text-gray-600">
                Advisor {getStatusText(advisorStatus)}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Main Platform Items */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3">
                    Platform
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-2 p-4 w-[400px] grid-cols-2">
                      {mainNavItems.map((item) => (
                        <NavigationMenuLink
                          key={item.href}
                          href={item.href}
                          className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="mt-1">{item.icon}</div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3">
                    Enterprise
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-2 p-4 w-[400px] grid-cols-2">
                      {enterpriseNavItems.map((item) => (
                        <NavigationMenuLink
                          key={item.href}
                          href={item.href}
                          className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="mt-1">{item.icon}</div>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">
                                {item.title}
                              </p>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Direct Links */}
            <Button variant="ghost" size="sm" asChild>
              <a href="/dashboard" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </a>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <a href="/infrastructure" className="flex items-center space-x-2">
                <Cpu className="h-4 w-4" />
                <span>Infrastructure</span>
              </a>
            </Button>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Country Flag */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  🇺🇸
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center space-x-2">
                  <span>🇺🇸</span>
                  <span>United States</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2">
                  <span>🇬🇧</span>
                  <span>United Kingdom</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2">
                  <span>🇩🇪</span>
                  <span>Germany</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2">
                  <span>🇫🇷</span>
                  <span>France</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Get Started Button */}
            <Button className="hidden md:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Get Started
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="QV" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                      QV
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">QuantumVest User</p>
                    <p className="w-[200px] truncate text-sm text-gray-600">
                      user@quantumvest.com
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/dashboard" className="flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {/* Mobile Header */}
                  <div className="flex items-center space-x-2 border-b pb-4">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">QV</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">QuantumVest</h2>
                      <p className="text-sm text-gray-600">
                        Enterprise Platform
                      </p>
                    </div>
                  </div>

                  {/* Advisor Status Mobile */}
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                    <Bot className="h-4 w-4 text-gray-600" />
                    <Circle
                      className={`h-2 w-2 fill-current ${getStatusColor(advisorStatus)}`}
                    />
                    <span className="text-sm font-medium text-gray-600">
                      Advisor {getStatusText(advisorStatus)}
                    </span>
                  </div>

                  {/* Mobile Navigation Items */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900 px-2">
                      Platform
                    </div>
                    {mainNavItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <div>
                          <div className="text-sm font-medium">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-600">
                            {item.description}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900 px-2">
                      Enterprise
                    </div>
                    {enterpriseNavItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">
                              {item.title}
                            </div>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-600">
                            {item.description}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Mobile CTA */}
                  <div className="pt-4 border-t">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Get Started
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Secondary Navigation Bar - Tablet/Desktop Only */}
        <div className="hidden md:flex items-center justify-between py-2 px-1 text-xs text-gray-600 border-t bg-gray-50/50">
          <div className="flex items-center space-x-6">
            <a
              href="/serverless-apis"
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <Cloud className="h-3 w-3" />
              <span>Serverless APIs</span>
            </a>
            <a
              href="/super-admin"
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <Shield className="h-3 w-3" />
              <span>SuperAdmin</span>
            </a>
            <a
              href="/ultra-level"
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <Crown className="h-3 w-3" />
              <span>UltraLevel</span>
            </a>
            <a
              href="/components"
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <Component className="h-3 w-3" />
              <span>Components</span>
              <Badge variant="secondary" className="text-xs">
                3
              </Badge>
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              🇺🇸 EN
            </Badge>
            <Badge variant="outline" className="text-xs">
              Enterprise
            </Badge>
            <Badge variant="outline" className="text-xs">
              v2.1.0
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ResponsiveNavbar;
