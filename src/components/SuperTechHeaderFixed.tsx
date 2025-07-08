/**
 * SuperTech Header Fixed - QuantumVest Navigation
 * Enterprise-Grade + Mythic Inspired Navigation (Simplified)
 */

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Bell,
  ChevronDown,
  Globe,
  Zap,
  Vault,
  Bot,
  Leaf,
  Activity,
  Users,
  Wallet,
  Menu,
  X,
  Circle,
  Shield,
  Command,
} from "lucide-react";

interface SuperTechHeaderProps {
  className?: string;
}

export const SuperTechHeaderFixed: React.FC<SuperTechHeaderProps> = ({
  className = "",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aiAdvisorStatus, setAiAdvisorStatus] = useState<
    "online" | "processing" | "offline"
  >("online");
  const [ritualNotifications, setRitualNotifications] = useState(3);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Simulate AI advisor status changes
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: Array<"online" | "processing" | "offline"> = [
        "online",
        "processing",
        "offline",
      ];
      setAiAdvisorStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    {
      title: "Platform",
      icon: <Activity className="h-4 w-4" />,
      href: "/platform-navigation",
      description: "Full platform navigation & routes",
    },
    {
      title: "Dashboard",
      icon: <Vault className="h-4 w-4" />,
      href: "/dashboard",
      description: "Investment dashboard & analytics",
    },
    {
      title: "Infrastructure",
      icon: <Bot className="h-4 w-4" />,
      href: "/infrastructure-navigator",
      description: "Snake Xenzia navigation system",
    },
    {
      title: "Serverless APIs",
      icon: <Zap className="h-4 w-4" />,
      href: "/serverless-functions",
      description: "Serverless functions & infrastructure",
    },
    {
      title: "Enterprise",
      icon: <Users className="h-4 w-4" />,
      href: "/enterprise-subscriptions",
      description: "Enterprise subscription tiers",
    },
    {
      title: "SuperAdmin",
      icon: <Shield className="h-4 w-4" />,
      href: "/superadmin",
      description: "Platform administration console",
    },
    {
      title: "UltraLevel",
      icon: <Command className="h-4 w-4" />,
      href: "/ultralevel-admin",
      description: "Enterprise command center",
    },
    {
      title: "Components",
      icon: <Activity className="h-4 w-4" />,
      href: "/critical-components",
      description: "Platform completion status",
    },
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "sw", name: "Swahili", flag: "🇰🇪" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  ];

  const getAiStatusColor = () => {
    switch (aiAdvisorStatus) {
      case "online":
        return "text-green-500";
      case "processing":
        return "text-yellow-500 animate-pulse";
      case "offline":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getAiStatusText = () => {
    switch (aiAdvisorStatus) {
      case "online":
        return "Advisor online";
      case "processing":
        return "Processing...";
      case "offline":
        return "Advisor offline";
      default:
        return "Unknown";
    }
  };

  return (
    <header
      className={`bg-white border-b border-gray-200 sticky top-0 z-50 w-full ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <a
              href="/"
              className="flex items-center space-x-1 sm:space-x-2 hover:opacity-80 transition-opacity"
            >
              {/* Animated Spiral Logo */}
              <div className="relative">
                <div
                  className="text-lg sm:text-xl lg:text-2xl animate-spin"
                  style={{ animationDuration: "8s" }}
                >
                  🌀
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QuantumVest
              </h1>
            </a>

            {/* AI Status Indicator */}
            <div className="hidden md:flex items-center space-x-2 px-2 sm:px-3 py-1 bg-gray-50 rounded-full">
              <Circle
                className={`h-2 w-2 fill-current ${getAiStatusColor()}`}
              />
              <span className="text-xs font-medium text-gray-600">
                {getAiStatusText()}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-1 justify-center max-w-4xl">
            {navigationItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors group px-2 py-1 rounded-md hover:bg-gray-50"
                title={item.description}
              >
                {item.icon}
                <span className="font-medium text-sm xl:text-base whitespace-nowrap">
                  {item.title}
                </span>
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
            {/* Ritual Notification Bell */}
            <button className="relative p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {ritualNotifications > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
                  {ritualNotifications}
                </div>
              )}
            </button>

            {/* Language Selector */}
            <button className="hidden sm:flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-md hover:bg-gray-100">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm hidden md:inline">
                {languages.find((l) => l.code === selectedLanguage)?.flag}
              </span>
            </button>

            {/* Call to Action Button */}
            <Button
              className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-auto"
              onClick={() =>
                (window.location.href = "/enterprise-subscriptions")
              }
            >
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden lg:inline">Get Started</span>
              <span className="lg:hidden">Start</span>
            </Button>

            {/* User Avatar */}
            <Avatar className="h-6 w-6 sm:h-8 sm:w-8 cursor-pointer">
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                QV
              </AvatarFallback>
            </Avatar>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-3 sm:py-4 bg-white shadow-lg">
            <div className="space-y-1 sm:space-y-2 max-h-screen overflow-y-auto">
              {/* AI Status for Mobile */}
              <div className="flex items-center space-x-2 mx-3 sm:mx-4 mb-3 sm:mb-4 px-2 sm:px-3 py-2 bg-gray-50 rounded-lg">
                <Circle
                  className={`h-2 w-2 fill-current ${getAiStatusColor()}`}
                />
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  {getAiStatusText()}
                </span>
              </div>

              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-center space-x-3 mx-3 sm:mx-4 px-2 sm:px-3 py-2 sm:py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors rounded-lg active:bg-gray-100"
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    // Allow default navigation behavior
                  }}
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm sm:text-base">
                      {item.title}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 truncate">
                      {item.description}
                    </div>
                  </div>
                </a>
              ))}

              {/* Mobile Language Selector */}
              <div className="mx-3 sm:mx-4 px-2 sm:px-3 py-2 sm:py-3 border-t border-gray-200 mt-3 sm:mt-4 pt-3 sm:pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Language
                  </span>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">
                      {languages.find((l) => l.code === selectedLanguage)?.flag}{" "}
                      <span className="hidden sm:inline">
                        {
                          languages.find((l) => l.code === selectedLanguage)
                            ?.name
                        }
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="mx-3 sm:mx-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm sm:text-base py-2.5 sm:py-3"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.location.href = "/enterprise-subscriptions";
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default SuperTechHeaderFixed;
