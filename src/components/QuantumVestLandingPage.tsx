/**
 * QuantumVest Landing Page - Comprehensive Implementation
 * Re-encoding Wealth. For People. Planet. Future.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  ArrowRight,
  Play,
  Globe,
  Zap,
  Brain,
  Users,
  Code,
  Building,
  Leaf,
  Shield,
  TrendingUp,
  Heart,
  Eye,
  Star,
  CheckCircle,
  Bluetooth,
  Cpu,
  Network,
  Satellite,
  GitBranch,
  BookOpen,
  MessageCircle,
  Moon,
  Sun,
  ExternalLink,
  MapPin,
  BarChart3,
  Lightbulb,
  Target,
  User,
  Vault,
  Wallet,
  FileText,
  Home,
  Terminal,
} from "lucide-react";

interface LiveCounter {
  label: string;
  value: string;
  suffix: string;
  color: string;
}

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SolutionCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  location: string;
  avatar: string;
}

const QuantumVestLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [liveCounters, setLiveCounters] = useState<LiveCounter[]>([
    { label: "Tokenized", value: "$26", suffix: "B", color: "text-green-600" },
    { label: "Countries", value: "192", suffix: "", color: "text-blue-600" },
    {
      label: "Vault Agents",
      value: "4.6",
      suffix: "M",
      color: "text-purple-600",
    },
  ]);

  const features: FeatureCard[] = [
    {
      icon: <span className="text-2xl">🧬</span>,
      title: "VaultDNA",
      description: "Personal, regenerative, AI-aware capital encoding",
    },
    {
      icon: <Bluetooth className="h-6 w-6 text-blue-500" />,
      title: "Bluetooth Mesh Vaults",
      description: "Offline-first finance flows, even in remote zones",
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      title: "Ritual-Aware AI",
      description: "Ethical co-signers, not just black-box machines",
    },
    {
      icon: <Globe className="h-6 w-6 text-green-500" />,
      title: "Diaspora Access",
      description: "Micro + macro wealth tools from Nairobi to NY",
    },
    {
      icon: <Code className="h-6 w-6 text-orange-500" />,
      title: "Open API",
      description: "SDKs for builders, co-ops, NGOs, and DeFi layers",
    },
  ];

  const solutions: SolutionCard[] = [
    {
      icon: <Building className="h-8 w-8 text-blue-600" />,
      title: "Institutions",
      description: "Capital markets, ESG vaults, Sovereign tech",
      href: "/institutions",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Communities",
      description: "Diaspora co-funding, tribal economies, ROSCAs",
      href: "/communities",
    },
    {
      icon: <Code className="h-8 w-8 text-purple-600" />,
      title: "Developers",
      description: "Vault SDK, AI APIs, ZK Ritual Contracts",
      href: "/developers",
    },
    {
      icon: <Building className="h-8 w-8 text-orange-600" />,
      title: "Enterprise",
      description: "Custom fund protocols, treasury tech",
      href: "/enterprise",
    },
    {
      icon: <Leaf className="h-8 w-8 text-emerald-600" />,
      title: "Impact",
      description: "Nature vaults, green bonds, climate risk mesh",
      href: "/impact",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      quote:
        "QuantumVest has transformed how our community manages collective resources. The mesh networking works even when our internet is down.",
      author: "John Lemaiyan",
      role: "Community Elder",
      location: "Maasai Mara, Kenya",
      avatar: "JL",
    },
    {
      quote:
        "As a digital nomad, having access to sovereign financial tools anywhere in the world is revolutionary. The AI advisor understands my goals.",
      author: "Maria Santos",
      role: "Digital Entrepreneur",
      location: "Lisbon, Portugal",
      avatar: "MS",
    },
    {
      quote:
        "The transparency and ethical AI framework makes QuantumVest the only platform we trust for our sovereign wealth management.",
      author: "Dr. Sarah Chen",
      role: "Chief Investment Officer",
      location: "Singapore Sovereign Fund",
      avatar: "SC",
    },
  ];

  const clients = [
    "Central Banks",
    "Climate Orgs",
    "UNICEF",
    "Diaspora Networks",
    "DAOs",
    "Microfinance Hubs",
    "Stanford Research",
    "Nairobi AI Collective",
  ];

  useEffect(() => {
    // Animate live counters
    const interval = setInterval(() => {
      setLiveCounters((prev) =>
        prev.map((counter) => ({
          ...counter,
          value:
            counter.label === "Tokenized"
              ? `$${(parseFloat(counter.value.replace("$", "")) + Math.random() * 0.1).toFixed(1)}`
              : counter.label === "Vault Agents"
                ? `${(parseFloat(counter.value) + Math.random() * 0.01).toFixed(2)}`
                : counter.value,
        })),
      );
    }, 3000);

    // Rotate testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(testimonialInterval);
    };
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
      {/* Enterprise Header */}
      <header
        className={`sticky top-0 z-50 border-b transition-colors ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <a href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Vault className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">QuantumVest</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Re-encoding Wealth. For People. Planet. Future.
                  </p>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Solutions Mega Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2">
                  <span>Solutions</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Mega Menu Dropdown */}
                <div className="absolute top-full left-0 w-[800px] bg-white dark:bg-gray-800 border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-6">
                  <div className="grid grid-cols-5 gap-6">
                    {/* Tokenization */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Tokenization
                      </h3>
                      <ul className="space-y-2">
                        <li>
                          <Link
                            to="/asset-vaults"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            AssetVaults™
                          </Link>
                        </li>
                        <li>
                          <a
                            href="/real-estate"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            Real Estate
                          </a>
                        </li>
                        <li>
                          <a
                            href="/carbon-bonds"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            Carbon Bonds
                          </a>
                        </li>
                        <li>
                          <a
                            href="/cultural-bonds"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            Cultural Bonds
                          </a>
                        </li>
                        <li>
                          <a
                            href="/nfts"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            NFTs
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* DeFi Layer */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        DeFi Layer
                      </h3>
                      <ul className="space-y-2">
                        <li>
                          <a
                            href="/micro-crowdfunding"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            Micro-crowdfunding
                          </a>
                        </li>
                        <li>
                          <a
                            href="/perpetual-funds"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            Perpetual Funds
                          </a>
                        </li>
                        <li>
                          <a
                            href="/yield-pools"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            Yield Pools
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* AI Tools */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        AI Tools
                      </h3>
                      <ul className="space-y-2">
                        <li>
                          <a
                            href="/ai-risk-engine"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            AI Risk Engine
                          </a>
                        </li>
                        <li>
                          <a
                            href="/ai-portfolio"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            Custom AI Portfolio
                          </a>
                        </li>
                        <li>
                          <a
                            href="/ritual-agents"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            Ritual-Aware Agents
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Social Finance */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Social Finance
                      </h3>
                      <ul className="space-y-2">
                        <li>
                          <a
                            href="/diaspora-vaults"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            Diaspora Vaults
                          </a>
                        </li>
                        <li>
                          <a
                            href="/co-funding"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            Co-Funding Projects
                          </a>
                        </li>
                        <li>
                          <a
                            href="/cultural-investment"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            Cultural Investment
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Developer/API */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Developer/API
                      </h3>
                      <ul className="space-y-2">
                        <li>
                          <a
                            href="/sdk"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            QuantumVest SDK
                          </a>
                        </li>
                        <li>
                          <a
                            href="/vault-dna"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            VaultDNA Generator
                          </a>
                        </li>
                        <li>
                          <a
                            href="/api-docs"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            API Docs
                          </a>
                        </li>
                        <li>
                          <a
                            href="/webhooks"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            Webhooks
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sectors Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2">
                  <span>Sectors</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="absolute top-full left-0 w-80 bg-white dark:bg-gray-800 border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-4">
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="/healthcare"
                        className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        <strong>Healthcare Vaults</strong>
                        <br />
                        <span className="text-xs text-gray-500">
                          Neonatal, Pharma Equity
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/green-infrastructure"
                        className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        Green Infrastructure
                      </a>
                    </li>
                    <li>
                      <a
                        href="/climate-bonds"
                        className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        Climate / ESG Bonds
                      </a>
                    </li>
                    <li>
                      <a
                        href="/diaspora-capital"
                        className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        Diaspora Capital
                      </a>
                    </li>
                    <li>
                      <a
                        href="/education-finance"
                        className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        Education Finance
                      </a>
                    </li>
                    <li>
                      <a
                        href="/faith-finance"
                        className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        <strong>Faith-based Finance</strong>
                        <br />
                        <span className="text-xs text-gray-500">
                          Sukuk, Halal, ROSCAs
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/web3-finance"
                        className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        Web3 Financial Services
                      </a>
                    </li>
                    <li>
                      <a
                        href="/remittances"
                        className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        Cross-Border Remittances
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Research Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2">
                  <span>Research</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="absolute top-full left-0 w-64 bg-white dark:bg-gray-800 border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-4">
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="/blog"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Quantum Insights Blog</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/whitepapers"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Whitepapers & Protocols</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/ai-reports"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>AI Vault Reports</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/thought-leadership"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        <Brain className="h-4 w-4" />
                        <span>Thought Leadership</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/open-source"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        <GitBranch className="h-4 w-4" />
                        <span>Open Source Projects</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/vault-map"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                      >
                        <Globe className="h-4 w-4" />
                        <span>VaultMap™</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Invest CTA */}
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Target className="h-4 w-4 mr-2" />
                Invest
              </Button>
            </div>

            {/* Right Side Navigation */}
            <div className="flex items-center space-x-4">
              {/* AI Advisor */}
              <button className="hidden md:flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2">
                <Brain className="h-4 w-4" />
                <span className="hidden lg:inline">AI Advisor</span>
              </button>

              {/* Wallet */}
              <button className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600">
                <Wallet className="h-5 w-5" />
              </button>

              {/* Language Selector */}
              <div className="relative group hidden md:block">
                <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 px-2 py-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">EN</span>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="absolute top-full right-0 w-40 bg-white dark:bg-gray-800 border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
                  <ul className="space-y-1">
                    <li>
                      <a
                        href="?lang=en"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 p-2 rounded"
                      >
                        <span>🇺🇸</span>
                        <span>English</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="?lang=fr"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 p-2 rounded"
                      >
                        <span>🇫🇷</span>
                        <span>Français</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="?lang=sw"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 p-2 rounded"
                      >
                        <span>🇰🇪</span>
                        <span>Kiswahili</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="?lang=ar"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 p-2 rounded"
                      >
                        <span>🇸🇦</span>
                        <span>العربية</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="?lang=zh"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 p-2 rounded"
                      >
                        <span>🇨🇳</span>
                        <span>中文</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Login/Join */}
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/auth")}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  onClick={() => navigate("/auth")}
                >
                  Join
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation (visible on mobile only) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
          <div className="flex justify-around items-center py-2">
            <button className="flex flex-col items-center space-y-1 p-2">
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2">
              <Wallet className="h-5 w-5" />
              <span className="text-xs">Wallet</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2">
              <Brain className="h-5 w-5" />
              <span className="text-xs">AI</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2">
              <Vault className="h-5 w-5" />
              <span className="text-xs">Vaults</span>
            </button>
            <button className="flex flex-col items-center space-y-1 p-2">
              <User className="h-5 w-5" />
              <span className="text-xs">Account</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-150"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Finance That Breathes,
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Moves, and Learns.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            The world's first mesh-native, AI-coordinated capital platform
            connecting communities, institutions, and ecosystems through
            sovereign vaults.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              <Vault className="h-5 w-5 mr-2" />
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              <Brain className="h-5 w-5 mr-2" />
              AI Portfolio Demo
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              <Play className="h-5 w-5 mr-2" />
              Watch Protocol Video
            </Button>
          </div>

          {/* Live Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {liveCounters.map((counter, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border"
              >
                <div className={`text-3xl font-bold ${counter.color} mb-2`}>
                  {counter.value}
                  {counter.suffix}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {counter.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Is QuantumVest Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              What Is QuantumVest?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A sovereign financial operating system that understands culture,
              geography, and the rhythms of life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg dark:bg-gray-800"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Solutions Menu */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              From Central Banks to Villages
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Finance that connects. All powered by AI agents, BLE vault
              sharding, and human consent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg dark:bg-gray-700"
                onClick={() => (window.location.href = solution.href)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-4 bg-white dark:bg-gray-600 rounded-xl group-hover:scale-110 transition-transform">
                      {solution.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {solution.title}
                      </CardTitle>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {solution.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200 text-lg px-6 py-2">
              ✅ All powered by AI agents, BLE vault sharding, and human consent
            </Badge>
          </div>
        </div>
      </section>

      {/* Live Insights & Vault Maps */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Capital Transparency, In Real-Time
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Every action is recorded. Every vault is owned. Every yield is
              earned.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Live VaultFlow Map */}
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-6 w-6 text-blue-600" />
                  <span>Live VaultFlow Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-8 text-white text-center min-h-[300px] flex items-center justify-center">
                  <div>
                    <Globe
                      className="h-16 w-16 mx-auto mb-4 animate-spin"
                      style={{ animationDuration: "20s" }}
                    />
                    <h3 className="text-lg font-semibold mb-2">
                      Global Vault Network
                    </h3>
                    <p className="text-blue-200">
                      192 countries • 4.6M active vaults
                    </p>
                    <div className="mt-4 flex justify-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                        Active
                      </span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
                        Processing
                      </span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
                        Offline
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Sentiment Pulse */}
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  <span>AI Sentiment Pulse</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Risk Index</span>
                      <span className="text-green-600 font-bold">
                        Low (2.3)
                      </span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Sovereign Signal
                      </span>
                      <span className="text-blue-600 font-bold">
                        Strong (8.7)
                      </span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Ritual Health</span>
                      <span className="text-purple-600 font-bold">
                        Optimal (9.2)
                      </span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Recent Public Vaults</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Carbon Bonds (Kenya)</span>
                        <Badge variant="outline">+5.2%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Real Estate (Berlin)</span>
                        <Badge variant="outline">+3.8%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Diaspora Fund (Global)</span>
                        <Badge variant="outline">+7.1%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quantum-Powered Innovation */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Beyond DeFi. Beyond Blockchain. Beyond Borders.
          </h2>

          <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-12 leading-relaxed">
            "We've merged AI memory, BLE mesh networking, and ritual-based
            consensus to build a system that doesn't just move capital — it
            understands it."
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <Bluetooth className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">BLE Vault Mesh</h3>
              <p className="text-blue-100">
                Offline-first finance that works everywhere
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <Brain className="h-12 w-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                AI + Elder Council Verification
              </h3>
              <p className="text-purple-100">
                Cultural wisdom meets artificial intelligence
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <Satellite className="h-12 w-12 text-green-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Interplanetary Sync</h3>
              <p className="text-green-100">
                Mars-ready financial infrastructure
              </p>
            </div>
          </div>

          <Badge className="bg-green-500/20 text-green-200 text-lg px-6 py-2 border border-green-500/30">
            🌐 QuantumVest works even when satellites fail.
          </Badge>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Multinational by Design. Sovereign by Default.
            </h2>
          </div>

          {/* Client Logos Carousel */}
          <div className="mb-16">
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-400">
              {clients.map((client, index) => (
                <div
                  key={index}
                  className="text-lg font-medium hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {client}
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Carousel */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <blockquote className="text-xl italic text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>

                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {testimonials[currentTestimonial].author}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonials[currentTestimonial].role}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        {testimonials[currentTestimonial].location}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Protocol, Ethics, and Research */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Open Source. Ethically Verified. Cryptographically Governed.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-700">
              <CardContent className="p-6 text-center">
                <Cpu className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">VaultTap Protocol</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Technical overview & implementation
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Docs
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-700">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">AEGIS Manifesto</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  AI + Ethics + Governance framework
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read More
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-700">
              <CardContent className="p-6 text-center">
                <GitBranch className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Open Research</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Whitepapers, GitHub, SDG metrics
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-700">
              <CardContent className="p-6 text-center">
                <Lightbulb className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Research Labs</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Stanford, Nairobi AI Collective
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Users className="h-4 w-4 mr-2" />
                  Partners
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Join the Vault Revolution */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Join the Vault Revolution
          </h2>

          <p className="text-2xl mb-8 opacity-90">
            "You don't need a bank. You need a voice."
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Vault className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">🔒 Create a vault</h3>
              <p className="text-sm opacity-80">
                Your sovereign financial space
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Brain className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">🎓 Learn with our AI</h3>
              <p className="text-sm opacity-80">
                Personalized financial education
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Globe className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">
                💰 Access capital from anywhere
              </h3>
              <p className="text-sm opacity-80">Global financial inclusion</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <Vault className="h-5 w-5 mr-2" />
              Create My Vault
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
            >
              <Brain className="h-5 w-5 mr-2" />
              Try AI Advisor
            </Button>
          </div>
        </div>
      </section>

      {/* Enterprise Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Top Footer - Segmented Callouts */}
        <div className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Products */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-400">
                  Products
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/vault-tap"
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <Vault className="h-4 w-4" />
                      <span>VaultTap™</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/ritual-net"
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <Network className="h-4 w-4" />
                      <span>RitualNet™</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/ai-advisor"
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <Brain className="h-4 w-4" />
                      <span>AIAdvisor™</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/vaults"
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <Vault className="h-4 w-4" />
                      <span>QuantumVest Vaults</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Institutional */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-purple-400">
                  Institutional
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/sovereign-wealth"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Sovereign Wealth
                    </Link>
                  </li>
                  <li>
                    <a
                      href="/family-offices"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Family Offices
                    </a>
                  </li>
                  <li>
                    <a
                      href="/ngos"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      NGOs
                    </a>
                  </li>
                  <li>
                    <a
                      href="/development-banks"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Development Banks
                    </a>
                  </li>
                </ul>
              </div>

              {/* Community */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-400">
                  Community
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/diaspora"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Diaspora
                    </a>
                  </li>
                  <li>
                    <a
                      href="/tribal-finance"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Tribal Finance
                    </a>
                  </li>
                  <li>
                    <a
                      href="/village-vaults"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Village Vaults
                    </a>
                  </li>
                  <li>
                    <a
                      href="/local-orgs"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Local Orgs
                    </a>
                  </li>
                </ul>
              </div>

              {/* Developers */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-orange-400">
                  Developers
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/dev-console"
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <Code className="h-4 w-4" />
                      <span>Dev Console</span>
                    </Link>
                  </li>
                  <li>
                    <a
                      href="/sdks"
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <Code className="h-4 w-4" />
                      <span>SDKs</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/public-apis"
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <GitBranch className="h-4 w-4" />
                      <span>Public APIs</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/github"
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Careers */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">
                  Careers
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/careers"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Open Roles
                    </a>
                  </li>
                  <li>
                    <a
                      href="/work-here"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Work at QuantumVest
                    </a>
                  </li>
                  <li>
                    <a
                      href="/internships"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Internships
                    </a>
                  </li>
                  <li>
                    <a
                      href="/fellowships"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Fellowships
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Footer - Utilities */}
        <div className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              <a
                href="/terms"
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Terms & Conditions
              </a>
              <a
                href="/privacy"
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/transparency"
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Vault Transparency Report
              </a>
              <a
                href="/regulatory"
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Regulatory Disclosures
              </a>
              <a
                href="/ai-ethics"
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                AI + Ethics
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Brand & Tagline */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Vault className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">QuantumVest™</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                © 2025 QuantumVest Global Holdings. A Sovereign Finance
                Protocol.
              </p>
              <p className="text-blue-400 italic text-sm">
                "Re-encoding wealth, for a living world."
              </p>
            </div>

            {/* Global Offices */}
            <div className="text-center">
              <h4 className="text-sm font-medium mb-3 text-gray-300">
                Global Presence
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>Nairobi</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>Geneva</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>Dubai</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>Toronto</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>Lagos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>Singapore</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>Bogotá</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>Berlin</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="text-center lg:text-right">
              <h4 className="text-sm font-medium mb-3 text-gray-300">
                Connect
              </h4>
              <div className="flex justify-center lg:justify-end space-x-4">
                <a
                  href="/linkedin"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="/github"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="/youtube"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="/researchgate"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="ResearchGate"
                >
                  <BarChart3 className="h-5 w-5" />
                </a>
                <a
                  href="/twitter"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter/X"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <button className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50">
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default QuantumVestLandingPage;
