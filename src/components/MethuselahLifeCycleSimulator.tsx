/**
 * Methuselah Life Cycle Simulator Component
 * Interactive 969-year investment and innovation lifecycle simulation
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Clock,
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
  PieChart,
  BarChart3,
  LineChart,
  Activity,
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMethuselahContext } from "../contexts/MethuselahContext";
import { MethuselahAgeRange } from "../types/MethuselahAge";
import { METHUSELAH_AGE_PROFILES } from "../utils/methuselahLifeCycle";

interface MethuselahLifeCycleSimulatorProps {
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  highlightCurrentEra?: boolean;
}

const MethuselahLifeCycleSimulator: React.FC<
  MethuselahLifeCycleSimulatorProps
> = ({
  className,
  autoPlay = false,
  showControls = true,
  highlightCurrentEra = true,
}) => {
  const {
    simulation,
    lifeStages,
    innovations,
    completionMetrics,
    currentRecommendations,
    nextEraPreparation,
    simulateAgeProgression,
    switchToEra,
    addInnovationInvestment,
    generateEraRecommendations,
    getInnovationOpportunities,
    simulateGenerationalTransition,
    resetSimulation,
  } = useMethuselahContext();

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [highlightedEra, setHighlightedEra] =
    useState<MethuselahAgeRange | null>(null);

  // Auto-play simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && simulation.currentAge < 969) {
      interval = setInterval(() => {
        simulateAgeProgression(simulation.currentAge + playbackSpeed);
      }, 100);
    } else if (simulation.currentAge >= 969) {
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, simulation.currentAge, simulateAgeProgression]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (newSpeed: number[]) => {
    setPlaybackSpeed(newSpeed[0]);
  };

  const handleAgeSliderChange = (newAge: number[]) => {
    simulateAgeProgression(newAge[0]);
  };

  const handleEraClick = (era: MethuselahAgeRange) => {
    switchToEra(era);
    setHighlightedEra(era);
    setTimeout(() => setHighlightedEra(null), 2000);
  };

  const formatNumber = (num: number): string => {
    if (num >= Number.MAX_SAFE_INTEGER / 1000000) return "∞";
    if (num >= 1e15) return `${(num / 1e15).toFixed(1)}Q`;
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getEraIcon = (era: MethuselahAgeRange): React.ReactNode => {
    const profile = METHUSELAH_AGE_PROFILES[era];
    return <span className="text-2xl">{profile.icon}</span>;
  };

  const getEraColors = (era: MethuselahAgeRange) => {
    return METHUSELAH_AGE_PROFILES[era].colors;
  };

  const currentProfile = METHUSELAH_AGE_PROFILES[simulation.currentEra];
  const currentColors = getEraColors(simulation.currentEra);

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header with Current Status */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{currentProfile.icon}</div>
            <div>
              <h2 className="text-2xl font-bold">{currentProfile.label}</h2>
              <p className="text-blue-100">
                Age {simulation.currentAge} •{" "}
                {simulation.lifeProgress.toFixed(1)}% Complete
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {formatNumber(simulation.totalNetWorth)}
            </div>
            <div className="text-blue-100">Total Net Worth</div>
          </div>
        </div>

        <Progress
          value={simulation.lifeProgress}
          className="h-3 bg-blue-700"
          style={{
            backgroundColor: `${currentColors.primary}20`,
          }}
        />

        <div className="flex items-center justify-between mt-4 text-sm">
          <span>Birth (Year 0)</span>
          <span className="font-medium">Methuselah's Journey (969 Years)</span>
          <span>Transition (Year 969)</span>
        </div>
      </div>

      {/* Simulation Controls */}
      {showControls && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Life Simulation Controls
            </CardTitle>
            <CardDescription>
              Control the pace of Methuselah's 969-year journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePlayPause}
                variant={isPlaying ? "destructive" : "default"}
                size="sm"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isPlaying ? "Pause" : "Play"}
              </Button>

              <Button onClick={resetSimulation} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>

              <Button
                onClick={() =>
                  simulateAgeProgression(
                    Math.min(969, simulation.currentAge + 50),
                  )
                }
                variant="outline"
                size="sm"
              >
                <FastForward className="h-4 w-4 mr-2" />
                +50 Years
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Age: {simulation.currentAge}
              </label>
              <Slider
                value={[simulation.currentAge]}
                onValueChange={handleAgeSliderChange}
                max={969}
                min={18}
                step={1}
                className="w-full"
              />
            </div>

            {isPlaying && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Speed: {playbackSpeed}x
                </label>
                <Slider
                  value={[playbackSpeed]}
                  onValueChange={handleSpeedChange}
                  max={10}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Era Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Life Era Timeline
          </CardTitle>
          <CardDescription>
            Click on any era to jump to that life stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {Object.entries(METHUSELAH_AGE_PROFILES).map(([era, profile]) => {
              const isActive = era === simulation.currentEra;
              const isHighlighted = era === highlightedEra;
              const colors = getEraColors(era as MethuselahAgeRange);

              return (
                <motion.div
                  key={era}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isHighlighted ? { scale: [1, 1.1, 1] } : {}}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all duration-300",
                    isActive
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  style={{
                    borderColor: isActive ? colors.primary : undefined,
                    backgroundColor: isActive
                      ? `${colors.primary}10`
                      : undefined,
                  }}
                  onClick={() => handleEraClick(era as MethuselahAgeRange)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{profile.icon}</div>
                    <div className="font-medium text-sm">{profile.label}</div>
                    <div className="text-xs text-muted-foreground">{era}</div>
                    {isActive && (
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

      {/* Detailed Analysis Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Life Cycle Analysis</CardTitle>
          <CardDescription>
            Comprehensive breakdown of Methuselah's current life stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="innovations">Innovations</TabsTrigger>
              <TabsTrigger value="legacy">Legacy</TabsTrigger>
              <TabsTrigger value="completion">Completion</TabsTrigger>
              <TabsTrigger value="recommendations">Guidance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Current Age</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {simulation.currentAge}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentProfile.description}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Net Worth</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatNumber(simulation.totalNetWorth)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Wealth accumulated
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Generations</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {simulation.generationsWitnessed}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Generations witnessed
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Innovations</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-700">
                    {simulation.innovationsSponsored}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Innovations sponsored
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Current Era Focus</h4>
                <p className="text-sm text-muted-foreground">
                  {currentProfile.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.innovationPriorities.map((priority) => (
                    <Badge key={priority} variant="outline">
                      {priority}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Recent Achievements</h4>
                <div className="space-y-2">
                  {simulation.historicalAchievements
                    .slice(-3)
                    .map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Current Challenges</h4>
                <div className="space-y-2">
                  {simulation.currentChallenges.map((challenge, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Target className="h-4 w-4 text-orange-600" />
                      <span>{challenge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-lg mb-2">
                    <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-700">
                      {simulation.portfolio.allocation.stocks}%
                    </div>
                  </div>
                  <div className="text-sm font-medium">Traditional Stocks</div>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-lg mb-2">
                    <LineChart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-700">
                      {simulation.portfolio.allocation.longevityTech}%
                    </div>
                  </div>
                  <div className="text-sm font-medium">Longevity Tech</div>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 p-4 rounded-lg mb-2">
                    <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-700">
                      {simulation.portfolio.allocation.spaceInfrastructure}%
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    Space Infrastructure
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-indigo-100 p-4 rounded-lg mb-2">
                    <Brain className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-indigo-700">
                      {simulation.portfolio.allocation.consciousnesstech}%
                    </div>
                  </div>
                  <div className="text-sm font-medium">Consciousness Tech</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Advanced Allocations</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span>Quantum Computing:</span>
                    <span className="font-medium">
                      {simulation.portfolio.allocation.quantumComputing}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bioengineering:</span>
                    <span className="font-medium">
                      {simulation.portfolio.allocation.bioengineering}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interstellar Claims:</span>
                    <span className="font-medium">
                      {simulation.portfolio.allocation.interstellarClaims}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Manipulation:</span>
                    <span className="font-medium">
                      {simulation.portfolio.allocation.timeManipulation}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Universal Knowledge:</span>
                    <span className="font-medium">
                      {simulation.portfolio.allocation.universalKnowledge}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reality Shaping:</span>
                    <span className="font-medium">
                      {simulation.portfolio.allocation.realityShaping}%
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Liquidity Planning</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Next Decade:</span>
                    <span className="font-medium">
                      {formatNumber(
                        simulation.portfolio.liquidityNeeds.immediate,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Century:</span>
                    <span className="font-medium">
                      {formatNumber(
                        simulation.portfolio.liquidityNeeds.century,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Millennium:</span>
                    <span className="font-medium">
                      {formatNumber(
                        simulation.portfolio.liquidityNeeds.millennium,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="innovations" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Current Era Innovations</h4>
                {getInnovationOpportunities()
                  .slice(0, 5)
                  .map((innovation) => (
                    <div key={innovation.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{innovation.name}</h5>
                        <Badge variant="outline">{innovation.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {innovation.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span>Risk: {innovation.riskLevel}/10</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="h-4 w-4 text-green-600" />
                          <span>{innovation.timeHorizon} years</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          <span>
                            {innovation.expectedReturn >= 10000
                              ? "Infinite return"
                              : `${innovation.expectedReturn}% return`}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="mt-3"
                        size="sm"
                        onClick={() =>
                          addInnovationInvestment(innovation.id, 1000000)
                        }
                      >
                        Invest $1M
                      </Button>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="legacy" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Family Legacy</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Living Descendants:</span>
                      <span className="font-medium">
                        {simulation.relationshipNetwork.livingDescendants}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Institutional Legacies:</span>
                      <span className="font-medium">
                        {simulation.relationshipNetwork.institutionalLegacies}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Global Impact</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Civilizations Influenced:</span>
                      <span className="font-medium">
                        {simulation.civilizationsInfluenced}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Universal Impact Level:</span>
                      <span className="font-medium">
                        {simulation.relationshipNetwork.universalImpact}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Wisdom Accumulated</h4>
                <div className="space-y-2">
                  {simulation.wisdomAccumulated.map((wisdom, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="italic">"{wisdom}"</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Next Milestones</h4>
                <div className="space-y-2">
                  {simulation.nextMilestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                      <span>{milestone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="completion" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Life Completion Metrics</h4>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Knowledge Accumulation</span>
                      <span className="text-sm font-medium">
                        {completionMetrics.knowledgeAccumulation.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={completionMetrics.knowledgeAccumulation}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Wealth Distribution</span>
                      <span className="text-sm font-medium">
                        {completionMetrics.wealthDistribution.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={completionMetrics.wealthDistribution}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Legacy Establishment</span>
                      <span className="text-sm font-medium">
                        {completionMetrics.legacyEstablishment.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={completionMetrics.legacyEstablishment}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Wisdom Transfer</span>
                      <span className="text-sm font-medium">
                        {completionMetrics.wisdomTransfer.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={completionMetrics.wisdomTransfer}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Universal Contribution</span>
                      <span className="text-sm font-medium">
                        {completionMetrics.universalContribution.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={completionMetrics.universalContribution}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Transcendence Preparation</span>
                      <span className="text-sm font-medium">
                        {completionMetrics.transcendencePreparation.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={completionMetrics.transcendencePreparation}
                      className="h-2"
                    />
                  </div>
                </div>

                <Separator />

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Overall Life Completion</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-700 mb-2">
                    {completionMetrics.overallCompletion.toFixed(1)}%
                  </div>
                  <Progress
                    value={completionMetrics.overallCompletion}
                    className="h-3"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">
                    Current Era Recommendations
                  </h4>
                  <div className="space-y-2">
                    {currentRecommendations.map((recommendation, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <ArrowUp className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Next Era Preparation</h4>
                  <div className="space-y-2">
                    {nextEraPreparation.map((preparation, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
                        <span>{preparation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-amber-600" />
                    <span className="font-medium">
                      Legendary Investor Wisdom
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    At this stage of life, focus on{" "}
                    {currentProfile.centuryFocus.toLowerCase()}. The most
                    relevant legendary investor principles are those of{" "}
                    {Object.entries(currentProfile.legendaryInvestorFocus)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 2)
                      .map(([investor]) => investor)
                      .join(" and ")}
                    .
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={simulateGenerationalTransition}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Simulate Generational Transition
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MethuselahLifeCycleSimulator;
