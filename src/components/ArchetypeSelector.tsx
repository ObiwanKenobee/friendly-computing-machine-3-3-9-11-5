import React, { useState } from "react";
import { useQuantumAuth } from "../hooks/useQuantumAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Building2,
  User,
  Globe,
  Heart,
  BarChart3,
  Users,
  Building,
  GraduationCap,
  UserCheck,
  Code,
  Bot,
  TreePine,
  ChevronRight,
  Star,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";

interface ArchetypeData {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  investmentRange: string;
  complexity: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  color: string;
  examples: string[];
}

const archetypes: ArchetypeData[] = [
  {
    id: "institutional-investor",
    name: "Institutional Investor",
    description:
      "Pension funds, sovereign wealth funds, insurance companies, hedge funds",
    icon: Building2,
    features: [
      "Aladdin-style AI Risk Management",
      "Tokenized institutional assets",
      "Custom AI advisory",
      "Macroeconomic stress testing",
      "Advanced portfolio analytics",
    ],
    investmentRange: "$1M+",
    complexity: "Expert",
    color: "blue",
    examples: [
      "Pension funds",
      "Sovereign wealth funds",
      "Insurance companies",
      "Hedge funds",
    ],
  },
  {
    id: "retail-investor",
    name: "Retail Investor",
    description: "Working professionals, retirees, gig workers building wealth",
    icon: User,
    features: [
      "AI goal-based investing",
      "Perpetual & micro-funds from $10",
      "Financial literacy modules",
      "Simplified portfolio management",
      "Automated rebalancing",
    ],
    investmentRange: "$100+",
    complexity: "Beginner",
    color: "green",
    examples: [
      "Working professionals",
      "Retirees",
      "Gig workers",
      "First-time investors",
    ],
  },
  {
    id: "emerging-market-citizen",
    name: "Emerging Market Citizen",
    description: "Young professionals in Africa, Southeast Asia, Latin America",
    icon: Globe,
    features: [
      "Localized micro-investments",
      "Fiat-to-stablecoin rails",
      "Cultural investment pools",
      "Mobile payment integration",
      "Currency hedging",
    ],
    investmentRange: "$10+",
    complexity: "Beginner",
    color: "emerald",
    examples: [
      "African professionals",
      "Southeast Asian workers",
      "Latin American youth",
    ],
  },
  {
    id: "ethical-cultural-investor",
    name: "Ethical/Cultural Investor",
    description:
      "Islamic finance adherents, ESG-conscious individuals, religious foundations",
    icon: Heart,
    features: [
      "Sharia-compliant screening",
      "ESG investment filters",
      "Tokenized sukuks & green bonds",
      "Cultural AI portfolio screening",
      "Impact measurement",
    ],
    investmentRange: "$500+",
    complexity: "Intermediate",
    color: "purple",
    examples: [
      "Islamic finance adherents",
      "ESG investors",
      "Religious foundations",
    ],
  },
  {
    id: "quant-data-driven",
    name: "Quant/Data-Driven Investor",
    description: "Fintech traders, data scientists, robo-advisor builders",
    icon: BarChart3,
    features: [
      "GraphQL APIs with portfolio data",
      "Custom ML model plugins",
      "Real-time risk datasets",
      "Backtesting modules",
      "Algorithmic trading tools",
    ],
    investmentRange: "$10K+",
    complexity: "Expert",
    color: "cyan",
    examples: [
      "Fintech traders",
      "Data scientists",
      "Robo-advisor builders",
      "Quant analysts",
    ],
  },
  {
    id: "diaspora-investor",
    name: "Diaspora Investor",
    description:
      "Expats supporting home-country development and diversifying wealth",
    icon: Users,
    features: [
      "Cross-border wallet integration",
      "Home-region tokenized projects",
      "Diaspora crowdfunding",
      "Multi-currency support",
      "Remittance optimization",
    ],
    investmentRange: "$200+",
    complexity: "Intermediate",
    color: "orange",
    examples: [
      "Nigerian expats in US",
      "Indian diaspora in UK",
      "Filipino workers abroad",
    ],
  },
  {
    id: "public-sector-ngo",
    name: "Public Sector/NGO",
    description:
      "Government development funds, international NGOs, social impact investors",
    icon: Building,
    features: [
      "Participatory budgeting tools",
      "Blockchain transparency",
      "Social impact dashboards",
      "SDG tracking tokens",
      "Community voting systems",
    ],
    investmentRange: "$50K+",
    complexity: "Advanced",
    color: "indigo",
    examples: [
      "Government funds",
      "International NGOs",
      "Development banks",
      "Impact investors",
    ],
  },
  {
    id: "student-early-career",
    name: "Student/Early-Career Professional",
    description:
      "University students, first-time job entrants building financial habits",
    icon: GraduationCap,
    features: [
      "Gamified education platform",
      "Micro-investment milestones",
      "Peer learning insights",
      "Beginner-friendly AI advisor",
      "Goal-based savings",
    ],
    investmentRange: "$5+",
    complexity: "Beginner",
    color: "pink",
    examples: [
      "University students",
      "Recent graduates",
      "Entry-level professionals",
    ],
  },
  {
    id: "financial-advisor",
    name: "Financial Advisors / Portfolio Managers",
    description: "RIA firms, family offices, digital wealth managers",
    icon: UserCheck,
    features: [
      "White-label AI advisory",
      "Client risk visualization",
      "Real-time rebalancing alerts",
      "Regulatory compliance tools",
      "Multi-client management",
    ],
    investmentRange: "$25K+",
    complexity: "Advanced",
    color: "yellow",
    examples: [
      "RIA firms",
      "Family offices",
      "Digital wealth managers",
      "Independent advisors",
    ],
  },
  {
    id: "developer-integrator",
    name: "Developer / Integrator",
    description: "B2B fintechs, protocol engineers, DeFi builders",
    icon: Code,
    features: [
      "Open APIs & GraphQL endpoints",
      "Tokenization SDKs",
      "Smart contract templates",
      "Developer portal",
      "AI plugin extensions",
    ],
    investmentRange: "API-based",
    complexity: "Expert",
    color: "gray",
    examples: [
      "B2B fintechs",
      "Protocol engineers",
      "DeFi builders",
      "API integrators",
    ],
  },
  {
    id: "african-market-enterprise",
    name: "African Market Enterprise",
    description:
      "Continental market analysis, global breakdown, pricing strategy, and revenue operations intelligence",
    icon: Globe,
    features: [
      "African continent breakdown",
      "Global market comparison",
      "Pricing strategy analysis",
      "RevOps metrics dashboard",
      "Market opportunity identification",
      "Competitive intelligence",
    ],
    investmentRange: "Enterprise",
    complexity: "Expert",
    color: "orange",
    examples: [
      "Market analysts",
      "Enterprise executives",
      "Investment strategists",
      "Revenue operations teams",
    ],
  },
  {
    id: "quantum-enterprise-2050",
    name: "Quantum Enterprise 2050",
    description:
      "Ultra-tech company operations with quantum computing, AI consciousness, multi-planetary infrastructure, and advanced sustainability",
    icon: Bot,
    features: [
      "Quantum system monitoring",
      "AI consciousness management",
      "Multi-planetary operations",
      "Neural interface integration",
      "Sustainability optimization",
      "Innovation pipeline tracking",
      "Market intelligence & forecasting",
    ],
    investmentRange: "Ultra-Enterprise",
    complexity: "Expert",
    color: "purple",
    examples: [
      "Quantum tech companies",
      "Multi-planetary corporations",
      "AI consciousness enterprises",
      "Future-tech conglomerates",
    ],
  },
  {
    id: "wildlife-conservation-enterprise",
    name: "Wildlife Conservation Enterprise",
    description:
      "Global conservation technology, biodiversity protection, sustainable ecosystem management, and wildlife monitoring platforms",
    icon: TreePine,
    features: [
      "Wildlife monitoring systems",
      "AI-powered conservation analytics",
      "Biodiversity protection tracking",
      "Ecosystem health monitoring",
      "Sustainable financing solutions",
      "Threat assessment & mitigation",
      "Community engagement platforms",
    ],
    investmentRange: "Conservation-Impact",
    complexity: "Advanced",
    color: "emerald",
    examples: [
      "Conservation organizations",
      "Wildlife foundations",
      "Environmental enterprises",
      "Sustainable impact funds",
    ],
  },
];

const ArchetypeSelector = () => {
  const { initializeIdentity, isInitializing } = useQuantumAuth();
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(
    null,
  );

  const handleArchetypeSelect = async (archetypeId: string) => {
    try {
      setSelectedArchetype(archetypeId);

      // Initialize quantum identity with selected archetype
      await initializeIdentity(
        "user_" + Date.now(), // In real app, this would be actual user ID
        archetypeId,
        {
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          selection: archetypeId,
        },
      );

      // Navigate to appropriate dashboard
      window.location.href = `/${archetypeId}`;
    } catch (error) {
      console.error("Error initializing archetype:", error);
      setSelectedArchetype(null);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Beginner":
        return "text-green-400 border-green-400";
      case "Intermediate":
        return "text-yellow-400 border-yellow-400";
      case "Advanced":
        return "text-orange-400 border-orange-400";
      case "Expert":
        return "text-red-400 border-red-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "border-blue-500 hover:border-blue-400 hover:bg-blue-900/10",
      green: "border-green-500 hover:border-green-400 hover:bg-green-900/10",
      emerald:
        "border-emerald-500 hover:border-emerald-400 hover:bg-emerald-900/10",
      purple:
        "border-purple-500 hover:border-purple-400 hover:bg-purple-900/10",
      cyan: "border-cyan-500 hover:border-cyan-400 hover:bg-cyan-900/10",
      orange:
        "border-orange-500 hover:border-orange-400 hover:bg-orange-900/10",
      indigo:
        "border-indigo-500 hover:border-indigo-400 hover:bg-indigo-900/10",
      pink: "border-pink-500 hover:border-pink-400 hover:bg-pink-900/10",
      yellow:
        "border-yellow-500 hover:border-yellow-400 hover:bg-yellow-900/10",
      gray: "border-gray-500 hover:border-gray-400 hover:bg-gray-900/10",
    };
    return (
      colorMap[color] ||
      "border-gray-500 hover:border-gray-400 hover:bg-gray-900/10"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Choose Your Investment Journey
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select your investor archetype to unlock a personalized experience
            powered by AI, blockchain technology, and cultural intelligence.
          </p>
        </div>

        {/* Archetype Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archetypes.map((archetype) => {
            const IconComponent = archetype.icon;
            const isSelected = selectedArchetype === archetype.id;
            const isLoading = isInitializing && isSelected;

            return (
              <Card
                key={archetype.id}
                className={`bg-slate-800/50 border-2 transition-all duration-300 cursor-pointer group
                  ${isSelected ? `${getColorClasses(archetype.color)} scale-105` : "border-slate-600 hover:border-slate-500"}
                  ${isLoading ? "animate-pulse" : ""}
                `}
                onClick={() =>
                  !isLoading && handleArchetypeSelect(archetype.id)
                }
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${
                        archetype.color === "blue"
                          ? "from-blue-500/20 to-blue-600/20"
                          : archetype.color === "green"
                            ? "from-green-500/20 to-green-600/20"
                            : archetype.color === "emerald"
                              ? "from-emerald-500/20 to-emerald-600/20"
                              : archetype.color === "purple"
                                ? "from-purple-500/20 to-purple-600/20"
                                : archetype.color === "cyan"
                                  ? "from-cyan-500/20 to-cyan-600/20"
                                  : archetype.color === "orange"
                                    ? "from-orange-500/20 to-orange-600/20"
                                    : archetype.color === "indigo"
                                      ? "from-indigo-500/20 to-indigo-600/20"
                                      : archetype.color === "pink"
                                        ? "from-pink-500/20 to-pink-600/20"
                                        : archetype.color === "yellow"
                                          ? "from-yellow-500/20 to-yellow-600/20"
                                          : "from-gray-500/20 to-gray-600/20"
                      }`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getComplexityColor(archetype.complexity)}`}
                      >
                        {archetype.complexity}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs text-gray-300 border-gray-400"
                      >
                        {archetype.investmentRange}
                      </Badge>
                    </div>
                  </div>

                  <CardTitle className="text-xl text-white group-hover:text-blue-300 transition-colors">
                    {archetype.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400 leading-relaxed">
                    {archetype.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Key Features */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Key Features
                      </h4>
                      <ul className="space-y-1">
                        {archetype.features
                          .slice(0, 3)
                          .map((feature, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-300 flex items-center gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        {archetype.features.length > 3 && (
                          <li className="text-sm text-gray-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full flex-shrink-0" />
                            +{archetype.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Examples */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">
                        Examples
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {archetype.examples
                          .slice(0, 2)
                          .map((example, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs text-gray-300 border-gray-500"
                            >
                              {example}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className={`w-full mt-4 group-hover:scale-105 transition-transform ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Initializing...
                        </>
                      ) : (
                        <>
                          Get Started
                          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-blue-500/20 rounded-full mb-3">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-white font-medium mb-2">
                AI-Powered Intelligence
              </h3>
              <p className="text-gray-400 text-sm">
                Advanced AI recommendations tailored to your archetype and
                cultural preferences
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="p-3 bg-purple-500/20 rounded-full mb-3">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Quantum Security</h3>
              <p className="text-gray-400 text-sm">
                Revolutionary multi-modal authentication with biometric and
                behavioral analysis
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="p-3 bg-green-500/20 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Global Access</h3>
              <p className="text-gray-400 text-sm">
                Culturally intelligent investing across 20+ languages and 50+
                currencies
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-slate-800/30 rounded-xl border border-slate-600">
            <p className="text-gray-300 text-sm">
              <strong className="text-white">Note:</strong> You can switch
              between archetypes at any time. Your Quantum Identity will adapt
              to provide the most relevant experience for your current needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeSelector;
