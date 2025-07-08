import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { globalLanguageService } from "../services/globalLanguageService";
import { regionalSovereigntyService } from "../services/regionalSovereigntyService";
import {
  InnovationCycle,
  RegionalInnovationMetrics,
  LanguageSovereignty,
} from "../types/GlobalLanguage";
import {
  Calendar,
  Users,
  Heart,
  Target,
  Zap,
  TreePine,
  Globe2,
  Crown,
  ArrowRight,
  Clock,
  Star,
  Sparkles,
  TrendingUp,
  BarChart3,
  Activity,
  Award,
  Leaf,
} from "lucide-react";

interface RegionalInnovationCycleProps {
  showMetrics?: boolean;
  showLanguageContext?: boolean;
  interactive?: boolean;
  compact?: boolean;
}

const RegionalInnovationCycle: React.FC<RegionalInnovationCycleProps> = ({
  showMetrics = true,
  showLanguageContext = true,
  interactive = true,
  compact = false,
}) => {
  const [currentCycle, setCurrentCycle] = useState<InnovationCycle | null>(
    null,
  );
  const [currentLanguage, setCurrentLanguage] =
    useState<LanguageSovereignty | null>(null);
  const [regionalMetrics, setRegionalMetrics] =
    useState<RegionalInnovationMetrics | null>(null);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleStartTime] = useState(new Date());

  useEffect(() => {
    initializeData();
    const interval = setInterval(updateProgress, 1000);

    // Listen for language changes
    const handleLanguageChange = () => {
      initializeData();
    };

    window.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  const initializeData = () => {
    const language = globalLanguageService.getCurrentLanguage();
    const cycle = globalLanguageService.getCurrentInnovationCycle();

    setCurrentLanguage(language);
    setCurrentCycle(cycle);

    if (cycle) {
      const metrics = regionalSovereigntyService.getRegionalMetrics(
        cycle.regionId,
      );
      setRegionalMetrics(metrics);
    }
  };

  const updateProgress = () => {
    if (!currentCycle) return;

    const currentPhaseIndex = currentCycle.phases.indexOf(
      currentCycle.currentPhase,
    );
    const baseProgress = (currentPhaseIndex / currentCycle.phases.length) * 100;

    // Add animated progress within current phase
    const timeInPhase = (Date.now() - cycleStartTime.getTime()) % 10000; // 10 second cycles for demo
    const phaseProgress =
      (timeInPhase / 10000) * (100 / currentCycle.phases.length);

    setPhaseProgress(baseProgress + phaseProgress);
  };

  const getPhaseIcon = (phase: string) => {
    const phaseIcons: Record<string, React.ComponentType> = {
      "community-consultation": Users,
      "grassroots-ideation": Sparkles,
      "collaborative-development": TreePine,
      "community-validation": Award,
      "harambee-gathering": Users,
      "resource-pooling": Target,
      "collective-action": Activity,
      "shared-benefits": Heart,
      "ancestral-consultation": Crown,
      "modern-research": Globe2,
      "synthesis-development": Zap,
      "elder-validation": Star,
      "prayer-ceremony": Heart,
      "council-deliberation": Users,
      "sustainable-action": Leaf,
      "seven-generations-review": TreePine,
      "long-term-planning": Calendar,
      "coordinated-implementation": Target,
      "progress-monitoring": BarChart3,
      "adaptive-refinement": TrendingUp,
      default: Activity,
    };

    const IconComponent = phaseIcons[phase] || phaseIcons["default"];
    return IconComponent;
  };

  const getCycleColor = (cycleName: string) => {
    const colorMap: Record<string, string> = {
      "Community-Driven Innovation": "from-green-500 to-emerald-500",
      "Harambee Collective Innovation": "from-orange-500 to-red-500",
      "Wisdom-Innovation Synthesis": "from-purple-500 to-pink-500",
      "Seven Generations Innovation": "from-blue-500 to-cyan-500",
      "Harmonious Development Cycle": "from-red-500 to-orange-500",
      "Jugaad-System Innovation": "from-yellow-500 to-orange-500",
      "Kaizen Consensus Innovation": "from-indigo-500 to-purple-500",
      "Universal Innovation Cycle": "from-gray-500 to-slate-500",
    };

    return colorMap[cycleName] || colorMap["Universal Innovation Cycle"];
  };

  const getMetricColor = (
    value: number,
    type: "percentage" | "count" = "percentage",
  ) => {
    if (type === "percentage") {
      if (value >= 0.9) return "text-green-400";
      if (value >= 0.7) return "text-yellow-400";
      if (value >= 0.5) return "text-orange-400";
      return "text-red-400";
    } else {
      if (value >= 20) return "text-green-400";
      if (value >= 10) return "text-yellow-400";
      if (value >= 5) return "text-orange-400";
      return "text-red-400";
    }
  };

  if (!currentCycle) {
    return (
      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-6 text-center">
          <Globe2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400">
            Select a language to view regional innovation cycle
          </p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
        <div
          className={`p-2 rounded-lg bg-gradient-to-r ${getCycleColor(currentCycle.name)}`}
        >
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm">
            {currentCycle.name}
          </h3>
          <p className="text-xs text-gray-400">{currentCycle.currentPhase}</p>
        </div>
        <div className="text-right">
          <Badge className="bg-blue-600 text-xs">
            {Math.round(phaseProgress)}%
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center">
          <div
            className={`p-2 rounded-lg bg-gradient-to-r ${getCycleColor(currentCycle.name)} mr-3`}
          >
            <Calendar className="h-6 w-6 text-white" />
          </div>
          {currentCycle.name}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {showLanguageContext && currentLanguage && (
            <>
              Regional innovation cycle for {currentLanguage.nativeName}{" "}
              speaking territories
            </>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Phase Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-400" />
              Current Phase
            </h3>
            <Badge className="bg-blue-600">
              {Math.round(phaseProgress)}% Complete
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">
                {currentCycle.currentPhase}
              </span>
              <span className="text-xs text-gray-400">
                Phase{" "}
                {currentCycle.phases.indexOf(currentCycle.currentPhase) + 1} of{" "}
                {currentCycle.phases.length}
              </span>
            </div>
            <Progress value={phaseProgress} className="h-2" />
          </div>
        </div>

        {/* Innovation Phases */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white flex items-center">
            <Zap className="h-5 w-5 mr-2 text-purple-400" />
            Innovation Phases
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentCycle.phases.map((phase, index) => {
              const Icon = getPhaseIcon(phase);
              const isActive = phase === currentCycle.currentPhase;
              const isCompleted =
                currentCycle.phases.indexOf(currentCycle.currentPhase) > index;

              return (
                <div
                  key={phase}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    isActive
                      ? "border-blue-500 bg-blue-500/20 shadow-lg"
                      : isCompleted
                        ? "border-green-500 bg-green-500/10"
                        : "border-slate-600 bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded ${
                        isActive
                          ? "bg-blue-500"
                          : isCompleted
                            ? "bg-green-500"
                            : "bg-slate-600"
                      }`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          isActive
                            ? "text-blue-300"
                            : isCompleted
                              ? "text-green-300"
                              : "text-gray-300"
                        }`}
                      >
                        {index + 1}.{" "}
                        {phase
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                    </div>
                    {isActive && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      </div>
                    )}
                    {isCompleted && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cultural Values */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-400" />
            Cultural Values
          </h3>

          <div className="flex flex-wrap gap-2">
            {currentCycle.culturalValues.map((value) => (
              <Badge
                key={value}
                variant="outline"
                className="text-yellow-400 border-yellow-400 bg-yellow-400/10"
              >
                {value
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Badge>
            ))}
          </div>
        </div>

        {/* Regional Metrics */}
        {showMetrics && regionalMetrics && (
          <div className="space-y-3">
            <h3 className="font-semibold text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-400" />
              Regional Impact Metrics
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                <div
                  className={`text-2xl font-bold ${getMetricColor(regionalMetrics.activeProjects, "count")}`}
                >
                  {regionalMetrics.activeProjects}
                </div>
                <div className="text-xs text-gray-400">Active Projects</div>
              </div>

              <div className="text-center p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                <div
                  className={`text-2xl font-bold ${getMetricColor(regionalMetrics.communityEngagement)}`}
                >
                  {Math.round(regionalMetrics.communityEngagement * 100)}%
                </div>
                <div className="text-xs text-gray-400">
                  Community Engagement
                </div>
              </div>

              <div className="text-center p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                <div
                  className={`text-2xl font-bold ${getMetricColor(regionalMetrics.culturalAlignment)}`}
                >
                  {Math.round(regionalMetrics.culturalAlignment * 100)}%
                </div>
                <div className="text-xs text-gray-400">Cultural Alignment</div>
              </div>

              <div className="text-center p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                <div
                  className={`text-2xl font-bold ${getMetricColor(regionalMetrics.sovereigntyRespect)}`}
                >
                  {Math.round(regionalMetrics.sovereigntyRespect * 100)}%
                </div>
                <div className="text-xs text-gray-400">Sovereignty Respect</div>
              </div>

              <div className="text-center p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                <div
                  className={`text-2xl font-bold ${getMetricColor(regionalMetrics.languageDiversity, "count")}`}
                >
                  {regionalMetrics.languageDiversity}
                </div>
                <div className="text-xs text-gray-400">Language Diversity</div>
              </div>

              <div className="text-center p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                <div
                  className={`text-2xl font-bold ${getMetricColor(regionalMetrics.participatingTerritories, "count")}`}
                >
                  {regionalMetrics.participatingTerritories}
                </div>
                <div className="text-xs text-gray-400">Territories</div>
              </div>
            </div>
          </div>
        )}

        {/* Cycle Information */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-400" />
            Cycle Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="text-sm text-gray-400 mb-1">Duration</div>
              <div className="text-white font-semibold">
                {currentCycle.duration
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="text-sm text-gray-400 mb-1">Started</div>
              <div className="text-white font-semibold">
                {currentCycle.startDate.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Actions */}
        {interactive && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-600">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-gray-300">
                Innovation cycle respects{" "}
                {currentLanguage?.sovereignTerritories.length || 0} sovereign
                territories
              </span>
            </div>

            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <Star className="h-4 w-4 mr-2" />
              Participate in Cycle
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegionalInnovationCycle;
