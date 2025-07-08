/**
 * QuantumVest Enterprise Header & Navigation Architecture
 * Comprehensive header with mega menus, dropdowns, and responsive design
 */

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  Vault,
  TrendingUp,
  Brain,
  Users,
  Code,
  Building,
  Leaf,
  Heart,
  BookOpen,
  FileText,
  BarChart3,
  Map,
  Wallet,
  Globe,
  User,
  Menu,
  Home,
  ChevronDown,
} from "lucide-react";

const EnterpriseHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Solutions Mega Menu Data (5-column layout)
  const solutionsData = {
    tokenization: [
      {
        name: "AssetVaults™",
        href: "/asset-vaults",
        icon: <Vault className="h-4 w-4" />,
      },
      {
        name: "Real Estate",
        href: "/real-estate",
        icon: <Building className="h-4 w-4" />,
      },
      {
        name: "Carbon Bonds",
        href: "/carbon-bonds",
        icon: <Leaf className="h-4 w-4" />,
      },
      {
        name: "Cultural Bonds",
        href: "/cultural-bonds",
        icon: <Heart className="h-4 w-4" />,
      },
      { name: "NFTs", href: "/nfts", icon: <TrendingUp className="h-4 w-4" /> },
    ],
    defi: [
      {
        name: "Micro-crowdfunding",
        href: "/micro-crowdfunding",
        icon: <Users className="h-4 w-4" />,
      },
      {
        name: "Perpetual Funds",
        href: "/perpetual-funds",
        icon: <TrendingUp className="h-4 w-4" />,
      },
      {
        name: "Yield Pools",
        href: "/yield-pools",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
    ai: [
      {
        name: "AI Risk Engine",
        href: "/ai-risk-engine",
        icon: <Brain className="h-4 w-4" />,
      },
      {
        name: "Custom AI Portfolio",
        href: "/ai-portfolio",
        icon: <Brain className="h-4 w-4" />,
      },
      {
        name: "Ritual-Aware Agents",
        href: "/ritual-agents",
        icon: <Brain className="h-4 w-4" />,
      },
    ],
    social: [
      {
        name: "Diaspora Vaults",
        href: "/diaspora-vaults",
        icon: <Users className="h-4 w-4" />,
      },
      {
        name: "Co-Funding Projects",
        href: "/co-funding",
        icon: <Users className="h-4 w-4" />,
      },
      {
        name: "Cultural Investment Vehicles",
        href: "/cultural-investment",
        icon: <Heart className="h-4 w-4" />,
      },
    ],
    developer: [
      {
        name: "QuantumVest SDK",
        href: "/sdk",
        icon: <Code className="h-4 w-4" />,
      },
      {
        name: "VaultDNA Generator",
        href: "/vault-dna",
        icon: <Code className="h-4 w-4" />,
      },
      {
        name: "API Docs",
        href: "/api-docs",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        name: "Webhooks",
        href: "/webhooks",
        icon: <Code className="h-4 w-4" />,
      },
    ],
  };

  // Sectors Data
  const sectorsData = [
    {
      name: "Healthcare Vaults",
      href: "/healthcare",
      description: "Neonatal, Pharma Equity",
    },
    {
      name: "Green Infrastructure",
      href: "/green-infrastructure",
      description: "Sustainable development",
    },
    {
      name: "Climate / ESG Bonds",
      href: "/climate-bonds",
      description: "Environmental investments",
    },
    {
      name: "Diaspora Capital",
      href: "/diaspora-capital",
      description: "Cross-border investments",
    },
    {
      name: "Education Finance",
      href: "/education-finance",
      description: "Educational funding",
    },
    {
      name: "Faith-based Finance",
      href: "/faith-finance",
      description: "Sukuk, Halal, ROSCAs",
    },
    {
      name: "Web3 Financial Services",
      href: "/web3-finance",
      description: "Decentralized finance",
    },
    {
      name: "Cross-Border Remittances",
      href: "/remittances",
      description: "Global money transfer",
    },
  ];

  // Research Data
  const researchData = [
    {
      name: "Quantum Insights Blog",
      href: "/blog",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      name: "Whitepapers & Protocols",
      href: "/whitepapers",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      name: "AI Vault Reports",
      href: "/ai-reports",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      name: "Thought Leadership",
      href: "/thought-leadership",
      icon: <Brain className="h-4 w-4" />,
    },
    {
      name: "Open Source Projects",
      href: "/open-source",
      icon: <Code className="h-4 w-4" />,
    },
    {
      name: "VaultMap™",
      href: "/vault-map",
      icon: <Map className="h-4 w-4" />,
    },
  ];

  // Language options
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Vault className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                QuantumVest
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Solutions Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600">
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[800px] p-6">
                      <div className="grid grid-cols-5 gap-6">
                        {/* Tokenization */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Tokenization
                          </h3>
                          <div className="space-y-2">
                            {solutionsData.tokenization.map((item) => (
                              <NavigationMenuLink
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-50"
                              >
                                {item.icon}
                                <span>{item.name}</span>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>

                        {/* DeFi Layer */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">
                            DeFi Layer
                          </h3>
                          <div className="space-y-2">
                            {solutionsData.defi.map((item) => (
                              <NavigationMenuLink
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-50"
                              >
                                {item.icon}
                                <span>{item.name}</span>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>

                        {/* AI Tools */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">
                            AI Tools
                          </h3>
                          <div className="space-y-2">
                            {solutionsData.ai.map((item) => (
                              <NavigationMenuLink
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-50"
                              >
                                {item.icon}
                                <span>{item.name}</span>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>

                        {/* Social Finance */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Social Finance
                          </h3>
                          <div className="space-y-2">
                            {solutionsData.social.map((item) => (
                              <NavigationMenuLink
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-50"
                              >
                                {item.icon}
                                <span>{item.name}</span>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>

                        {/* Developer/API */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Developer/API
                          </h3>
                          <div className="space-y-2">
                            {solutionsData.developer.map((item) => (
                              <NavigationMenuLink
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-50"
                              >
                                {item.icon}
                                <span>{item.name}</span>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Sectors Dropdown */}
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2">
                      <span>Sectors</span>
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80">
                      {sectorsData.map((sector) => (
                        <DropdownMenuItem
                          key={sector.name}
                          className="flex flex-col items-start space-y-1 p-3"
                        >
                          <a
                            href={sector.href}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {sector.name}
                          </a>
                          <span className="text-sm text-gray-500">
                            {sector.description}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>

                {/* Research Dropdown */}
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2">
                      <span>Research</span>
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64">
                      {researchData.map((item) => (
                        <DropdownMenuItem key={item.name} className="p-3">
                          <a
                            href={item.href}
                            className="flex items-center space-x-2"
                          >
                            {item.icon}
                            <span>{item.name}</span>
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>

                {/* Invest CTA */}
                <NavigationMenuItem>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Invest
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* AI Advisor */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:text-blue-600"
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Advisor
            </Button>

            {/* Wallet */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:text-blue-600"
            >
              <Wallet className="h-4 w-4" />
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-blue-600"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  EN
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    className="flex items-center space-x-2"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Login/Join */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                Login
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Join
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="py-6">
                  <div className="space-y-6">
                    {/* Mobile Solutions */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Solutions
                      </h3>
                      <div className="space-y-2">
                        <div className="pl-4">
                          <h4 className="font-medium text-gray-700 mb-2">
                            Tokenization
                          </h4>
                          {solutionsData.tokenization.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className="block py-1 text-sm text-gray-600 hover:text-blue-600"
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Sectors */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Sectors
                      </h3>
                      <div className="space-y-2">
                        {sectorsData.slice(0, 4).map((sector) => (
                          <a
                            key={sector.name}
                            href={sector.href}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600"
                          >
                            {sector.name}
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Actions */}
                    <div className="space-y-3 pt-6 border-t">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        Start Investing
                      </Button>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center py-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1"
          >
            <Wallet className="h-5 w-5" />
            <span className="text-xs">Wallet</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1"
          >
            <Brain className="h-5 w-5" />
            <span className="text-xs">AI</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1"
          >
            <Vault className="h-5 w-5" />
            <span className="text-xs">Vaults</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1"
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Account</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default EnterpriseHeader;
