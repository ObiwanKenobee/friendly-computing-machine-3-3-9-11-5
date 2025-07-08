/**
 * SuperTech Header - QuantumVest Navigation
 * Enterprise-Grade + Mythic Inspired Navigation
 */

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
// Temporarily comment out dropdown imports to fix loading issue
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "./ui/dropdown-menu";
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
} from "lucide-react";

interface SuperTechHeaderProps {
  className?: string;
}

export const SuperTechHeader: React.FC<SuperTechHeaderProps> = ({
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
      title: "Vaults",
      icon: <Vault className="h-4 w-4" />,
      href: "/vaults",
      description: "Dynamic DAO-based investment vaults",
    },
    {
      title: "AI Advisor",
      icon: <Bot className="h-4 w-4" />,
      href: "/ai-advisor",
      description: "Mythic GPT-powered guidance",
    },
    {
      title: "Ritual Yield",
      icon: <Leaf className="h-4 w-4" />,
      href: "/ritual-yield",
      description: "Yield unlocked through verified care",
    },
    {
      title: "Planetary Dashboard",
      icon: <Activity className="h-4 w-4" />,
      href: "/planetary-dashboard",
      description: "Global impact + ecological trust map",
    },
    {
      title: "GeoDAOs",
      icon: <Users className="h-4 w-4" />,
      href: "/geodaos",
      description: "Regional governance nodes",
    },
    {
      title: "Wallet",
      icon: <Wallet className="h-4 w-4" />,
      href: "/wallet",
      description: "Cross-chain + Trust badge system",
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
      className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {/* Animated Spiral Logo */}
              <div className="relative">
                <div
                  className="text-2xl animate-spin"
                  style={{ animationDuration: "8s" }}
                >
                  🌀
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QuantumVest
              </h1>
            </div>

            {/* AI Status Indicator */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-full">
              <Circle
                className={`h-2 w-2 fill-current ${getAiStatusColor()}`}
              />
              <span className="text-xs font-medium text-gray-600">
                {getAiStatusText()}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors group"
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Ritual Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="h-5 w-5" />
              {ritualNotifications > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {ritualNotifications}
                </div>
              )}
            </button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Globe className="h-5 w-5" />
                  <span className="hidden sm:block text-sm">
                    {languages.find((l) => l.code === selectedLanguage)?.flag}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={
                      selectedLanguage === lang.code ? "bg-blue-50" : ""
                    }
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Call to Action Button */}
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Zap className="h-4 w-4 mr-2" />
              Join a Vault
            </Button>

            {/* User Avatar Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      QV
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-3 border-b">
                  <div className="font-medium">Quantum Investor</div>
                  <div className="text-sm text-gray-600">
                    Level 3 Vault Member
                  </div>
                </div>
                <DropdownMenuItem>
                  <Users className="h-4 w-4 mr-2" />
                  My Vaults
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Activity className="h-4 w-4 mr-2" />
                  Ritual History
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Wallet className="h-4 w-4 mr-2" />
                  Trust Badges
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* AI Status for Mobile */}
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
                <Circle
                  className={`h-2 w-2 fill-current ${getAiStatusColor()}`}
                />
                <span className="text-sm font-medium text-gray-600">
                  {getAiStatusText()}
                </span>
              </div>

              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  {item.icon}
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-600">
                      {item.description}
                    </div>
                  </div>
                </a>
              ))}

              {/* Mobile CTA */}
              <div className="px-4 pt-4 border-t border-gray-200">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Zap className="h-4 w-4 mr-2" />
                  Join a Vault
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default SuperTechHeader;
