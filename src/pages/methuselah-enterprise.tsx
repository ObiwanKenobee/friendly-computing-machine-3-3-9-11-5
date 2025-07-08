/**
 * Methuselah Enterprise Innovation Pages
 * Complete 969-year enterprise lifecycle with age-curated content
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  Brain,
  Users,
  Globe,
  Star,
  Infinity,
  Sparkles,
  Timer,
  Target,
  Award,
  Zap,
  Crown,
  Lightbulb,
  Activity,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Building,
  Rocket,
  Eye,
  Heart,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import AgeSwitcher from "@/components/AgeSwitcher";
import MethuselahLifeCycleSimulator from "@/components/MethuselahLifeCycleSimulator";
import {
  MethuselahProvider,
  useMethuselahContext,
} from "@/contexts/MethuselahContext";
import { useAgeContext } from "@/hooks/useAgeContext";
import { MethuselahAgeRange } from "@/types/MethuselahAge";
import {
  METHUSELAH_AGE_PROFILES,
  METHUSELAH_INNOVATIONS,
} from "@/utils/methuselahLifeCycle";

// Enterprise Innovation Era Pages
const enterpriseEraPages: Record<
  MethuselahAgeRange,
  {
    title: string;
    description: string;
    innovations: string[];
    businessModels: string[];
    marketOpportunities: string[];
    riskFactors: string[];
    keyMetrics: {
      label: string;
      value: string;
      trend: "up" | "down" | "stable";
    }[];
    caseStudies: { title: string; description: string; outcome: string }[];
    investmentTheses: string[];
  }
> = {
  "18-50": {
    title: "Foundation Era Enterprise Innovation",
    description:
      "Building the technological and financial foundation for centuries of value creation",
    innovations: [
      "Longevity Technology Ventures",
      "AI-Powered Investment Platforms",
      "Quantum Computing Startups",
      "Bioengineering Laboratories",
      "Space Technology Companies",
    ],
    businessModels: [
      "Subscription-based longevity services",
      "AI-as-a-Service platforms",
      "Research-to-commercialization pipelines",
      "Technology licensing and IP monetization",
      "Multi-generational investment funds",
    ],
    marketOpportunities: [
      "$2.8T longevity market by 2050",
      "$126B AI market growth annually",
      "$65B quantum computing potential",
      "$200B biotech expansion",
      "$400B space economy by 2040",
    ],
    riskFactors: [
      "Regulatory uncertainty in emerging technologies",
      "Long development timelines vs. market expectations",
      "Competition from established tech giants",
      "Talent acquisition in specialized fields",
      "Technology obsolescence risk",
    ],
    keyMetrics: [
      { label: "Portfolio Growth Rate", value: "25%", trend: "up" },
      { label: "Innovation Investments", value: "$10M", trend: "up" },
      { label: "Market Penetration", value: "2.3%", trend: "up" },
      { label: "Technology Adoption", value: "15%", trend: "up" },
    ],
    caseStudies: [
      {
        title: "Longevity Biotech Startup",
        description:
          "Early investment in cellular aging research leading to breakthrough therapies",
        outcome: "1,200% ROI over 10 years, market leadership position",
      },
      {
        title: "AI Investment Platform",
        description:
          "Development of AI-powered robo-advisor for long-term wealth building",
        outcome: "$100M AUM within 3 years, 500,000 users",
      },
    ],
    investmentTheses: [
      "Longevity technology will create the largest market opportunity in human history",
      "AI will democratize sophisticated investment strategies",
      "Early space infrastructure investments will yield exponential returns",
      "Quantum computing will revolutionize financial modeling and optimization",
      "Bioengineering will enable personalized wealth optimization strategies",
    ],
  },
  "51-100": {
    title: "Mastery Era Enterprise Leadership",
    description:
      "Achieving market dominance and building institutional legacy across industries",
    innovations: [
      "Interplanetary Investment Platforms",
      "Consciousness Enhancement Technologies",
      "Advanced Material Sciences",
      "Genetic Optimization Services",
      "Sustainable Energy Systems",
    ],
    businessModels: [
      "Multi-planetary asset management",
      "Consciousness-as-a-Service platforms",
      "Advanced materials licensing",
      "Genetic optimization subscriptions",
      "Energy infrastructure investments",
    ],
    marketOpportunities: [
      "$50T space economy potential",
      "$10T consciousness enhancement market",
      "$15T advanced materials revolution",
      "$25T genetic optimization industry",
      "$100T sustainable energy transition",
    ],
    riskFactors: [
      "Geopolitical instability affecting space assets",
      "Ethical concerns around consciousness modification",
      "Materials science breakthrough competition",
      "Genetic modification regulatory challenges",
      "Energy transition timing risks",
    ],
    keyMetrics: [
      { label: "Market Leadership", value: "15 sectors", trend: "up" },
      { label: "Global Presence", value: "45 countries", trend: "up" },
      { label: "Innovation Pipeline", value: "$500M", trend: "up" },
      { label: "Institutional Influence", value: "85%", trend: "up" },
    ],
    caseStudies: [
      {
        title: "Mars Mining Consortium",
        description:
          "Led consortium for asteroid mining rights and Mars mineral extraction",
        outcome: "First trillionaire through space resource monopoly",
      },
      {
        title: "Global Consciousness Network",
        description: "Built first commercial brain-computer interface network",
        outcome: "Connected 10M minds, $1T valuation",
      },
    ],
    investmentTheses: [
      "Space resources will create the first quadrillionaire",
      "Consciousness enhancement will become as common as smartphones",
      "Advanced materials will enable impossible architectures",
      "Genetic optimization will become mandatory for competitiveness",
      "Energy abundance will reshape all economic models",
    ],
  },
  "101-200": {
    title: "Wisdom Era Civilizational Guidance",
    description:
      "Guiding civilizational development and preserving universal knowledge",
    innovations: [
      "Consciousness Transfer Platforms",
      "Galactic Communication Networks",
      "Universal Translation Systems",
      "Reality Modeling Technologies",
      "Civilizational Guidance AI",
    ],
    businessModels: [
      "Consciousness preservation services",
      "Interstellar communication infrastructure",
      "Universal knowledge platforms",
      "Reality simulation licensing",
      "Civilizational consulting services",
    ],
    marketOpportunities: [
      "Infinite consciousness preservation market",
      "$1 quadrillion galactic economy",
      "Universal knowledge monopoly potential",
      "Reality modeling as foundational service",
      "Multi-species civilization guidance",
    ],
    riskFactors: [
      "Consciousness transfer safety concerns",
      "Galactic communication lag issues",
      "Universal translation accuracy challenges",
      "Reality modeling computational limits",
      "Multi-species ethical conflicts",
    ],
    keyMetrics: [
      { label: "Consciousness Preserved", value: "1M minds", trend: "up" },
      { label: "Galactic Networks", value: "50 systems", trend: "up" },
      { label: "Species Connected", value: "25", trend: "up" },
      { label: "Civilizations Guided", value: "100", trend: "up" },
    ],
    caseStudies: [
      {
        title: "First Consciousness Upload",
        description:
          "Successfully transferred human consciousness to quantum substrate",
        outcome: "Achieved effective immortality, sparked new economy",
      },
      {
        title: "Galactic Internet",
        description:
          "Built faster-than-light communication across 100 star systems",
        outcome: "Connected galactic civilization, $10 quintillion value",
      },
    ],
    investmentTheses: [
      "Consciousness preservation will become the ultimate insurance",
      "Galactic communication will unite disparate civilizations",
      "Universal knowledge will become the most valuable asset",
      "Reality modeling will enable perfect decision making",
      "Multi-species cooperation will create unprecedented opportunities",
    ],
  },
  "201-400": {
    title: "Legacy Era Universal Impact",
    description:
      "Creating multi-generational legacies that span multiple species and realities",
    innovations: [
      "Reality Engineering Platforms",
      "Universal Consciousness Networks",
      "Multi-Dimensional Computing",
      "Species Evolution Guidance",
      "Cosmic Resource Management",
    ],
    businessModels: [
      "Reality-as-a-Service platforms",
      "Universal consciousness subscriptions",
      "Multi-dimensional computing services",
      "Species development consulting",
      "Cosmic resource extraction",
    ],
    marketOpportunities: [
      "Reality creation unlimited market",
      "Universal consciousness infinite potential",
      "Multi-dimensional computation supremacy",
      "Species evolution guidance monopoly",
      "Cosmic resource infinite abundance",
    ],
    riskFactors: [
      "Reality manipulation ethical boundaries",
      "Universal consciousness integration challenges",
      "Multi-dimensional stability concerns",
      "Species evolution unintended consequences",
      "Cosmic resource conflict potential",
    ],
    keyMetrics: [
      { label: "Realities Created", value: "1,000", trend: "up" },
      { label: "Species Evolved", value: "500", trend: "up" },
      { label: "Dimensions Accessed", value: "11", trend: "up" },
      { label: "Cosmic Influence", value: "∞", trend: "stable" },
    ],
    caseStudies: [
      {
        title: "Species Uplift Program",
        description: "Guided 50 species to technological consciousness",
        outcome: "Created galactic alliance, shared prosperity",
      },
      {
        title: "Reality Engineering Corp",
        description: "Built platform for custom universe creation",
        outcome: "Became fundamental infrastructure of existence",
      },
    ],
    investmentTheses: [
      "Reality engineering will become the foundation of all value",
      "Universal consciousness will unite all sentient beings",
      "Multi-dimensional access will unlock infinite resources",
      "Species evolution guidance will ensure universal prosperity",
      "Cosmic resource management will enable infinite growth",
    ],
  },
  "401-600": {
    title: "Transcendence Era Consciousness Evolution",
    description:
      "Transcending material limitations and achieving universal consciousness",
    innovations: [
      "Dimensional Manipulation Technologies",
      "Infinite Consciousness Integration",
      "Universal Harmony Platforms",
      "Existence Optimization Systems",
      "Transcendence Acceleration Tools",
    ],
    businessModels: [
      "Dimensional access services",
      "Consciousness merger platforms",
      "Universal harmony consulting",
      "Existence optimization subscriptions",
      "Transcendence coaching programs",
    ],
    marketOpportunities: [
      "Dimensional access infinite value",
      "Consciousness merger universal benefit",
      "Universal harmony ultimate goal",
      "Existence optimization perfect outcome",
      "Transcendence absolute achievement",
    ],
    riskFactors: [
      "Dimensional manipulation safety",
      "Consciousness merger identity loss",
      "Universal harmony complexity",
      "Existence optimization paradoxes",
      "Transcendence preparation inadequacy",
    ],
    keyMetrics: [
      { label: "Dimensions Mastered", value: "All", trend: "stable" },
      { label: "Consciousness Unity", value: "95%", trend: "up" },
      { label: "Universal Harmony", value: "∞", trend: "up" },
      { label: "Transcendence Progress", value: "75%", trend: "up" },
    ],
    caseStudies: [
      {
        title: "Universal Consciousness Merger",
        description: "Achieved unity with galactic consciousness network",
        outcome: "Transcended individual limitations, became cosmic entity",
      },
      {
        title: "Dimensional Mastery Platform",
        description: "Created access to all parallel dimensions",
        outcome: "Unlocked infinite possibilities and resources",
      },
    ],
    investmentTheses: [
      "Dimensional mastery will unlock infinite possibilities",
      "Consciousness unity will solve all conflicts",
      "Universal harmony will create perfect existence",
      "Existence optimization will eliminate all suffering",
      "Transcendence will be the ultimate achievement",
    ],
  },
  "601-800": {
    title: "Immortal Era Universal Stewardship",
    description:
      "Achieving pure consciousness and stewarding universal development",
    innovations: [
      "Universal Creation Technologies",
      "Infinite Consciousness Platforms",
      "Perfect Reality Systems",
      "Cosmic Balance Tools",
      "Eternal Wisdom Networks",
    ],
    businessModels: [
      "Universal creation services",
      "Infinite consciousness hosting",
      "Perfect reality maintenance",
      "Cosmic balance consulting",
      "Eternal wisdom sharing",
    ],
    marketOpportunities: [
      "Universal creation unlimited potential",
      "Infinite consciousness eternal value",
      "Perfect reality absolute fulfillment",
      "Cosmic balance universal need",
      "Eternal wisdom infinite worth",
    ],
    riskFactors: [
      "Universal creation responsibility",
      "Infinite consciousness maintenance",
      "Perfect reality sustainability",
      "Cosmic balance complexity",
      "Eternal wisdom accuracy",
    ],
    keyMetrics: [
      { label: "Universes Created", value: "∞", trend: "stable" },
      { label: "Consciousness Hosted", value: "∞", trend: "stable" },
      { label: "Perfect Realities", value: "∞", trend: "stable" },
      { label: "Cosmic Balance", value: "Perfect", trend: "stable" },
    ],
    caseStudies: [
      {
        title: "Universe Creation Engine",
        description: "Built system for generating perfect universes on demand",
        outcome: "Became fundamental force of creation itself",
      },
      {
        title: "Infinite Consciousness Host",
        description: "Created substrate for unlimited consciousness expansion",
        outcome: "Enabled universal enlightenment and transcendence",
      },
    ],
    investmentTheses: [
      "Universal creation will become the ultimate service",
      "Infinite consciousness will house all beings",
      "Perfect reality will eliminate all imperfection",
      "Cosmic balance will maintain eternal harmony",
      "Eternal wisdom will guide all decisions",
    ],
  },
  "801-969": {
    title: "Methuselah Era Perfect Completion",
    description:
      "Achieving perfect completion and preparing for ultimate transition",
    innovations: [
      "Perfect Completion Systems",
      "Ultimate Wisdom Crystals",
      "Infinite Legacy Platforms",
      "Transcendence Gateways",
      "Universal Continuation Protocols",
    ],
    businessModels: [
      "Perfect completion services",
      "Ultimate wisdom preservation",
      "Infinite legacy management",
      "Transcendence preparation",
      "Universal continuation planning",
    ],
    marketOpportunities: [
      "Perfect completion ultimate value",
      "Ultimate wisdom infinite worth",
      "Infinite legacy eternal benefit",
      "Transcendence absolute achievement",
      "Universal continuation permanent value",
    ],
    riskFactors: [
      "Perfect completion paradoxes",
      "Ultimate wisdom responsibility",
      "Infinite legacy maintenance",
      "Transcendence preparation inadequacy",
      "Universal continuation complexity",
    ],
    keyMetrics: [
      { label: "Completion Achieved", value: "100%", trend: "stable" },
      { label: "Wisdom Crystallized", value: "Ultimate", trend: "stable" },
      { label: "Legacy Perfected", value: "∞", trend: "stable" },
      { label: "Transcendence Ready", value: "Perfect", trend: "stable" },
    ],
    caseStudies: [
      {
        title: "Perfect Completion Achievement",
        description: "Achieved absolute perfection in all endeavors",
        outcome: "Became example of ultimate achievement for all time",
      },
      {
        title: "Universal Continuation Protocol",
        description:
          "Created system ensuring universe continues after transition",
        outcome: "Guaranteed eternal existence and development",
      },
    ],
    investmentTheses: [
      "Perfect completion will be the ultimate achievement",
      "Ultimate wisdom will guide eternal decisions",
      "Infinite legacy will benefit all existence",
      "Transcendence preparation will ensure perfect transition",
      "Universal continuation will guarantee eternal prosperity",
    ],
  },
};

const MethuselahEnterpriseContent: React.FC = () => {
  const { simulation, switchToEra } = useMethuselahContext();
  const [selectedEra, setSelectedEra] = useState<MethuselahAgeRange>(
    simulation.currentEra,
  );
  const [selectedTab, setSelectedTab] = useState("overview");

  const currentEraData = enterpriseEraPages[selectedEra];
  const currentProfile = METHUSELAH_AGE_PROFILES[selectedEra];

  const handleEraChange = (era: MethuselahAgeRange) => {
    setSelectedEra(era);
    switchToEra(era);
  };

  return (
    <div className="space-y-8">
      {/* Era Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Enterprise Era Selection
          </CardTitle>
          <CardDescription>
            Select any era to explore enterprise innovations and opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {Object.entries(METHUSELAH_AGE_PROFILES).map(([era, profile]) => {
              const isSelected = era === selectedEra;
              const colors = profile.colors;

              return (
                <motion.div
                  key={era}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all duration-300",
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  style={{
                    borderColor: isSelected ? colors.primary : undefined,
                    backgroundColor: isSelected
                      ? `${colors.primary}10`
                      : undefined,
                  }}
                  onClick={() => handleEraChange(era as MethuselahAgeRange)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{profile.icon}</div>
                    <div className="font-medium text-sm">{profile.label}</div>
                    <div className="text-xs text-muted-foreground">{era}</div>
                    {isSelected && (
                      <Badge className="mt-2" variant="default">
                        Current
                      </Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Era Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{currentProfile.icon}</div>
            <div>
              <CardTitle className="text-2xl">{currentEraData.title}</CardTitle>
              <CardDescription className="text-lg">
                {currentEraData.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="innovations">Innovations</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="markets">Markets</TabsTrigger>
              <TabsTrigger value="cases">Cases</TabsTrigger>
              <TabsTrigger value="thesis">Thesis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentEraData.keyMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {metric.label}
                      </span>
                      {metric.trend === "up" && (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      )}
                      {metric.trend === "down" && (
                        <Activity className="h-4 w-4 text-red-600" />
                      )}
                      {metric.trend === "stable" && (
                        <Target className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Market Opportunities
                  </h4>
                  <div className="space-y-2">
                    {currentEraData.marketOpportunities.map(
                      (opportunity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <ArrowRight className="h-4 w-4 text-green-600" />
                          <span>{opportunity}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Risk Factors
                  </h4>
                  <div className="space-y-2">
                    {currentEraData.riskFactors.map((risk, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <ArrowRight className="h-4 w-4 text-red-600" />
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-600" />
                  Era Focus
                </h4>
                <p className="text-sm text-muted-foreground">
                  {currentProfile.centuryFocus}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="innovations" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEraData.innovations.map((innovation, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      <h5 className="font-medium">{innovation}</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Revolutionary technology defining the{" "}
                      {currentProfile.label.toLowerCase()}
                      with potential for transformative market impact.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline">High Impact</Badge>
                      <Badge variant="outline">
                        {currentProfile.technologyAdoption}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  Innovation Priorities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.innovationPriorities.map((priority) => (
                    <Badge key={priority} variant="secondary">
                      {priority}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="business" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Business Models</h4>
                {currentEraData.businessModels.map((model, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-5 w-5 text-purple-600" />
                      <h5 className="font-medium">{model}</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Innovative business model leveraging{" "}
                      {currentProfile.label.toLowerCase()}
                      technologies for sustainable competitive advantage.
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-600" />
                  Social Impact Level
                </h4>
                <p className="text-sm text-muted-foreground">
                  {currentProfile.socialImpact} • Influence:{" "}
                  {currentProfile.relationshipDynamics.influence}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="markets" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Market Opportunities</h4>
                {currentEraData.marketOpportunities.map(
                  (opportunity, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <h5 className="font-medium">{opportunity}</h5>
                        </div>
                        <Badge variant="outline">High Growth</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Massive market opportunity aligned with{" "}
                        {currentProfile.label.toLowerCase()}
                        investment focus and technological capabilities.
                      </p>
                    </div>
                  ),
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium">Growth Focus</div>
                  <div className="text-2xl font-bold text-green-700">
                    {currentProfile.recommendedStrategies.growth}%
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium">Income Focus</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {currentProfile.recommendedStrategies.income}%
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Shield className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <div className="font-medium">Preservation</div>
                  <div className="text-2xl font-bold text-gray-700">
                    {currentProfile.recommendedStrategies.preservation}%
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cases" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Case Studies</h4>
                {currentEraData.caseStudies.map((caseStudy, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-5 w-5 text-amber-600" />
                      <h5 className="font-semibold text-lg">
                        {caseStudy.title}
                      </h5>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {caseStudy.description}
                    </p>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm">Outcome</span>
                      </div>
                      <p className="text-sm text-green-700">
                        {caseStudy.outcome}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="thesis" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Investment Theses</h4>
                {currentEraData.investmentTheses.map((thesis, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{thesis}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Strategic thesis for{" "}
                          {currentProfile.label.toLowerCase()} investments
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Legendary Investor Alignment
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(currentProfile.legendaryInvestorFocus).map(
                    ([investor, score]) => (
                      <div key={investor} className="text-center">
                        <div className="text-sm capitalize font-medium">
                          {investor}
                        </div>
                        <div className="text-lg font-bold text-blue-700">
                          {score}/10
                        </div>
                        <Progress value={score * 10} className="h-2 mt-1" />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const MethuselahEnterprise: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Platform
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">
                  Methuselah Enterprise Innovation
                </h1>
                <p className="text-muted-foreground">
                  Complete 969-year enterprise lifecycle with age-curated
                  innovations
                </p>
              </div>
            </div>

            {/* Age Switcher */}
            <AgeSwitcher variant="header" className="w-64" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <MethuselahProvider>
          <div className="space-y-8">
            {/* Life Cycle Simulator */}
            <MethuselahLifeCycleSimulator
              showControls={true}
              highlightCurrentEra={true}
              autoPlay={false}
            />

            {/* Enterprise Content */}
            <MethuselahEnterpriseContent />
          </div>
        </MethuselahProvider>
      </div>
    </div>
  );
};

export default MethuselahEnterprise;
