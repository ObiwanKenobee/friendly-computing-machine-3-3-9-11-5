/**
 * Game Layout Demo Component
 * Demonstrates the game-inspired layout with sample data
 */

import React, { useState } from "react";
import GameInspiredLayout from "./GameInspiredLayout";
import {
  Crown,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Brain,
  Activity,
  Star,
  Users,
  Globe,
  Heart,
  Layers,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  Briefcase,
  BookOpen,
  Award,
  Rocket,
  Lightbulb,
  Settings,
  Lock,
} from "lucide-react";

const GameLayoutDemo: React.FC = () => {
  const [currentViewMode, setCurrentViewMode] = useState<
    "mahjong" | "solitaire" | "grid" | "cascade"
  >("mahjong");

  // Sample tile data inspired by QuantumVest features
  const sampleTiles = [
    // Free Tier - Level 0 (Base layer in Mahjong)
    {
      id: "dashboard",
      title: "Investment Dashboard",
      description: "Your personalized investment overview and analytics center",
      tier: "free" as const,
      category: "analytics" as const,
      icon: <BarChart3 className="h-5 w-5" />,
      level: 0,
      position: { x: 2, y: 1 },
      isActive: true,
      isLocked: false,
      connections: ["analytics", "portfolio"],
      route: "/dashboard",
      estimatedTime: "5 min",
      popularity: 95,
    },
    {
      id: "archetypes",
      title: "Investor Archetypes",
      description:
        "Discover your investment personality and strategy alignment",
      tier: "free" as const,
      category: "tools" as const,
      icon: <Users className="h-5 w-5" />,
      level: 0,
      position: { x: 4, y: 1 },
      isActive: true,
      isLocked: false,
      connections: ["strategy", "tools"],
      route: "/archetypes",
      estimatedTime: "10 min",
      popularity: 88,
    },
    {
      id: "pricing",
      title: "Subscription Plans",
      description: "Explore our tiered investment platform offerings",
      tier: "free" as const,
      category: "features" as const,
      icon: <DollarSign className="h-5 w-5" />,
      level: 0,
      position: { x: 6, y: 1 },
      isActive: true,
      isLocked: false,
      connections: ["upgrade", "features"],
      route: "/pricing",
      estimatedTime: "3 min",
      popularity: 76,
    },

    // Starter Tier - Level 1
    {
      id: "retail-investor",
      title: "Retail Investor",
      description: "Individual investment strategies and portfolio management",
      tier: "starter" as const,
      category: "investment" as const,
      icon: <Target className="h-5 w-5" />,
      level: 1,
      position: { x: 1, y: 2 },
      isActive: true,
      isLocked: false,
      connections: ["portfolio", "strategy"],
      route: "/retail-investor",
      estimatedTime: "15 min",
      popularity: 82,
    },
    {
      id: "emerging-market",
      title: "Emerging Markets",
      description: "Global emerging market investment opportunities",
      tier: "starter" as const,
      category: "investment" as const,
      icon: <Globe className="h-5 w-5" />,
      level: 1,
      position: { x: 3, y: 2 },
      isActive: true,
      isLocked: false,
      connections: ["global", "markets"],
      route: "/emerging-market-citizen",
      estimatedTime: "20 min",
      popularity: 74,
    },
    {
      id: "student-career",
      title: "Student & Early Career",
      description: "Investment education and long-term wealth building",
      tier: "starter" as const,
      category: "investment" as const,
      icon: <BookOpen className="h-5 w-5" />,
      level: 1,
      position: { x: 5, y: 2 },
      isActive: true,
      isLocked: false,
      connections: ["education", "longterm"],
      route: "/student-early-career",
      estimatedTime: "25 min",
      popularity: 68,
    },

    // Professional Tier - Level 2
    {
      id: "financial-advisor",
      title: "Financial Advisor",
      description: "Professional client management and advisory tools",
      tier: "professional" as const,
      category: "tools" as const,
      icon: <Briefcase className="h-5 w-5" />,
      level: 2,
      position: { x: 2, y: 3 },
      isActive: true,
      isLocked: false,
      connections: ["advisory", "professional"],
      route: "/financial-advisor",
      estimatedTime: "30 min",
      popularity: 85,
    },
    {
      id: "developer-platform",
      title: "Developer Platform",
      description: "API access and integration tools for developers",
      tier: "professional" as const,
      category: "tools" as const,
      icon: <Settings className="h-5 w-5" />,
      level: 2,
      position: { x: 4, y: 3 },
      isActive: true,
      isLocked: false,
      connections: ["api", "integration"],
      route: "/developer-integrator",
      estimatedTime: "45 min",
      popularity: 72,
    },
    {
      id: "cultural-investor",
      title: "Cultural Investor",
      description: "Values-aligned and ESG-focused investment strategies",
      tier: "professional" as const,
      category: "investment" as const,
      icon: <Heart className="h-5 w-5" />,
      level: 2,
      position: { x: 6, y: 3 },
      isActive: true,
      isLocked: false,
      connections: ["esg", "values"],
      route: "/cultural-investor",
      estimatedTime: "35 min",
      popularity: 79,
    },

    // Enterprise Tier - Level 3 (Top layer)
    {
      id: "legendary-investors",
      title: "Legendary Strategies",
      description: "Buffett, Munger, Dalio & Lynch investment philosophies",
      tier: "enterprise" as const,
      category: "investment" as const,
      icon: <Crown className="h-5 w-5" />,
      level: 3,
      position: { x: 2, y: 4 },
      isActive: true,
      isLocked: false,
      connections: ["legendary", "strategy"],
      route: "/legendary-investors-enterprise",
      estimatedTime: "60 min",
      popularity: 96,
    },
    {
      id: "tortoise-protocol",
      title: "Tortoise Protocol",
      description: "Advanced AI-powered investment optimization engine",
      tier: "enterprise" as const,
      category: "analytics" as const,
      icon: <Brain className="h-5 w-5" />,
      level: 3,
      position: { x: 4, y: 4 },
      isActive: true,
      isLocked: false,
      connections: ["ai", "optimization"],
      route: "/tortoise-protocol",
      estimatedTime: "90 min",
      popularity: 91,
    },
    {
      id: "quantum-enterprise",
      title: "Quantum Enterprise 2050",
      description: "Next-generation quantum computing investment platform",
      tier: "enterprise" as const,
      category: "features" as const,
      icon: <Rocket className="h-5 w-5" />,
      level: 3,
      position: { x: 6, y: 4 },
      isActive: true,
      isLocked: false,
      connections: ["quantum", "future"],
      route: "/quantum-enterprise-2050",
      estimatedTime: "120 min",
      popularity: 87,
    },

    // Additional tiles for better layout demonstration
    {
      id: "wildlife-conservation",
      title: "Conservation Investing",
      description: "Environmental impact investment strategies",
      tier: "enterprise" as const,
      category: "investment" as const,
      icon: <Layers className="h-5 w-5" />,
      level: 2,
      position: { x: 0, y: 3 },
      isActive: true,
      isLocked: false,
      connections: ["environment", "impact"],
      route: "/wildlife-conservation-enterprise",
      estimatedTime: "40 min",
      popularity: 73,
    },
    {
      id: "analytics-advanced",
      title: "Advanced Analytics",
      description: "Deep market analysis and predictive modeling",
      tier: "professional" as const,
      category: "analytics" as const,
      icon: <TrendingUp className="h-5 w-5" />,
      level: 1,
      position: { x: 7, y: 2 },
      isActive: true,
      isLocked: false,
      connections: ["analytics", "prediction"],
      route: "/analytics",
      estimatedTime: "50 min",
      popularity: 81,
    },
    {
      id: "security-shield",
      title: "Security Suite",
      description: "Enterprise-grade security and compliance tools",
      tier: "enterprise" as const,
      category: "features" as const,
      icon: <Shield className="h-5 w-5" />,
      level: 1,
      position: { x: 0, y: 1 },
      isActive: true,
      isLocked: false,
      connections: ["security", "compliance"],
      route: "/security",
      estimatedTime: "25 min",
      popularity: 89,
    },
  ];

  const handleTileSelect = (tile: any) => {
    console.log("Selected tile:", tile);
    // In a real implementation, this would navigate to the tile's route
    window.location.href = tile.route;
  };

  const handleLayoutChange = (layout: string) => {
    setCurrentViewMode(layout as "mahjong" | "solitaire" | "grid" | "cascade");
  };

  return (
    <div className="min-h-screen">
      <GameInspiredLayout
        tiles={sampleTiles}
        viewMode={currentViewMode}
        onTileSelect={handleTileSelect}
        onLayoutChange={handleLayoutChange}
      />

      {/* Additional game-inspired CSS animations */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px) rotateY(-10deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateY(0deg);
          }
        }

        @keyframes cascade {
          from {
            opacity: 0;
            transform: translateX(-50px) rotateX(10deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotateX(0deg);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
        }

        .animate-cascade {
          animation: cascade 0.5s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        /* Mahjong-style 3D effects */
        .mahjong-tile {
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
        }

        .mahjong-tile:hover {
          transform: rotateX(5deg) rotateY(5deg) translateZ(10px);
        }

        /* Solitaire-style stacking */
        .solitaire-stack {
          position: relative;
        }

        .solitaire-stack::before {
          content: "";
          position: absolute;
          top: 2px;
          left: 2px;
          right: -2px;
          bottom: -2px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: inherit;
          z-index: -1;
        }

        /* Game-style hover effects */
        .game-tile {
          position: relative;
          overflow: hidden;
        }

        .game-tile::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.5s ease;
        }

        .game-tile:hover::before {
          left: 100%;
        }

        /* Responsive breakpoints for game layouts */
        @media (max-width: 768px) {
          .mahjong-layout {
            transform: scale(0.8);
            transform-origin: top left;
          }

          .solitaire-columns {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .mahjong-layout {
            transform: scale(0.6);
          }

          .solitaire-columns {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default GameLayoutDemo;
