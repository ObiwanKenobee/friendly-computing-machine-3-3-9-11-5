import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Crown,
  Shield,
  TrendingUp,
  Lock,
  Timer,
  DollarSign,
  Target,
  Zap,
} from "lucide-react";
import { buffettMoatService } from "../../services/buffettMoatService";
import type {
  MoatAnalysis,
  TimeLockedVault,
  CompoundingSimulation,
  AIAgentDividendManager,
} from "../../services/buffettMoatService";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

interface BuffettMoatIndicatorProps {
  vaultId?: string;
  userId?: string;
  className?: string;
}

export const BuffettMoatIndicator: React.FC<BuffettMoatIndicatorProps> = ({
  vaultId,
  userId,
  className,
}) => {
  const [moatAnalysis, setMoatAnalysis] = useState<MoatAnalysis | null>(null);
  const [timeLockedVaults, setTimeLockedVaults] = useState<TimeLockedVault[]>(
    [],
  );
  const [compoundingSimulation, setCompoundingSimulation] =
    useState<CompoundingSimulation | null>(null);
  const [aiManagers, setAiManagers] = useState<AIAgentDividendManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("moat-analysis");

  useEffect(() => {
    loadBuffettData();
  }, [vaultId, userId]);

  const loadBuffettData = async () => {
    setLoading(true);
    try {
      const [analysis, lockedVaults, simulation, managers] = await Promise.all([
        vaultId
          ? buffettMoatService.getMoatAnalysis(vaultId)
          : Promise.resolve(null),
        userId
          ? buffettMoatService.getTimeLockedVaults(userId)
          : Promise.resolve([]),
        vaultId
          ? buffettMoatService.getCompoundingSimulation(vaultId)
          : Promise.resolve(null),
        userId
          ? buffettMoatService.getAIDividendManagers(userId)
          : Promise.resolve([]),
      ]);

      setMoatAnalysis(analysis);
      setTimeLockedVaults(lockedVaults);
      setCompoundingSimulation(simulation);
      setAiManagers(managers);
    } catch (error) {
      console.error("Failed to load Buffett data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTimeLock = async (amount: number, days: number) => {
    if (!vaultId || !userId) return;

    try {
      await buffettMoatService.createTimeLockedVault(
        vaultId,
        userId,
        amount,
        days,
        "ai_managed",
      );
      await loadBuffettData();
    } catch (error) {
      console.error("Failed to create time lock:", error);
    }
  };

  const handleExtendLock = async (lockId: string, additionalDays: number) => {
    try {
      await buffettMoatService.extendLockPeriod(lockId, additionalDays);
      await loadBuffettData();
    } catch (error) {
      console.error("Failed to extend lock:", error);
    }
  };

  const getMoatColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 80) return "text-blue-600 bg-blue-50";
    if (score >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getMoatIcon = (type: string) => {
    switch (type) {
      case "network_effect":
        return <Target className="h-4 w-4" />;
      case "switching_cost":
        return <Lock className="h-4 w-4" />;
      case "cost_advantage":
        return <TrendingUp className="h-4 w-4" />;
      case "intangible_asset":
        return <Crown className="h-4 w-4" />;
      case "regulatory_protection":
        return <Shield className="h-4 w-4" />;
      case "geographic_isolation":
        return <Zap className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3">Loading Buffett moat analysis...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Crown className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <CardTitle>Warren Buffett Moat Indicator</CardTitle>
            <CardDescription>
              Economic Moats & Long-Term Compounding for Durable Competitive
              Advantages
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="moat-analysis">Moat Analysis</TabsTrigger>
            <TabsTrigger value="time-locks">Time Locks</TabsTrigger>
            <TabsTrigger value="compounding">Compounding</TabsTrigger>
            <TabsTrigger value="ai-management">AI Management</TabsTrigger>
          </TabsList>

          {/* Moat Analysis Tab */}
          <TabsContent value="moat-analysis" className="space-y-4">
            {moatAnalysis ? (
              <>
                {/* Overall Moat Score */}
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Overall Moat Score
                      </h3>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`px-3 py-1 rounded-full ${getMoatColor(moatAnalysis.overallMoatScore)}`}
                        >
                          <span className="font-bold text-lg">
                            {moatAnalysis.overallMoatScore}/100
                          </span>
                        </div>
                        <Badge
                          variant={
                            moatAnalysis.buffattRating === "strong_buy"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {moatAnalysis.buffattRating.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <Progress
                      value={moatAnalysis.overallMoatScore}
                      className="h-3 mb-3"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Moat Trends</h4>
                        <Badge
                          variant={
                            moatAnalysis.moatTrends === "strengthening"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {moatAnalysis.moatTrends}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Rating Reasons</h4>
                        <div className="space-y-1">
                          {moatAnalysis.reasonsForRating
                            .slice(0, 2)
                            .map((reason, index) => (
                              <p key={index} className="text-sm text-gray-600">
                                • {reason}
                              </p>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Primary Moats */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Primary Moats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moatAnalysis.primaryMoats.map((moat) => (
                      <Card
                        key={moat.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {getMoatIcon(moat.type)}
                              <h4 className="font-semibold text-sm">
                                {moat.name}
                              </h4>
                            </div>
                            <Badge
                              variant={moat.deepening ? "default" : "secondary"}
                            >
                              {moat.deepening ? "Deepening" : "Stable"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="text-center">
                              <div className="font-medium text-green-600">
                                {moat.strength}
                              </div>
                              <div className="text-xs text-gray-500">
                                Strength
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-blue-600">
                                {moat.durability}
                              </div>
                              <div className="text-xs text-gray-500">
                                Durability
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-purple-600">
                                {moat.width}
                              </div>
                              <div className="text-xs text-gray-500">Width</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Defensibility:</span>
                              <Badge variant="outline">
                                {moat.defensibility}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Time Horizon:</span>
                              <Badge variant="outline">
                                {moat.timeHorizon}
                              </Badge>
                            </div>
                          </div>

                          {moat.vulnerabilities.length > 0 && (
                            <div className="mt-3 p-2 bg-yellow-50 rounded">
                              <h5 className="font-medium text-yellow-800 text-xs mb-1">
                                Vulnerabilities
                              </h5>
                              <div className="text-xs text-yellow-700">
                                {moat.vulnerabilities.slice(0, 2).join(", ")}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Competitive Threats & Long-term Outlook */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">
                        Competitive Threats
                      </h4>
                      <ul className="space-y-2">
                        {moatAnalysis.competitiveThreats.map(
                          (threat, index) => (
                            <li
                              key={index}
                              className="text-sm flex items-start"
                            >
                              <Shield className="h-3 w-3 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                              {threat}
                            </li>
                          ),
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">
                        Moat Reinvestment Needs
                      </h4>
                      <ul className="space-y-2">
                        {moatAnalysis.moatReinvestmentNeeds.map(
                          (need, index) => (
                            <li
                              key={index}
                              className="text-sm flex items-start"
                            >
                              <TrendingUp className="h-3 w-3 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                              {need}
                            </li>
                          ),
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Long-term Outlook */}
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Long-term Buffett Outlook
                    </h4>
                    <p className="text-sm text-green-700">
                      {moatAnalysis.longTermOutlook}
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a vault to analyze moat strength</p>
                <p className="text-sm">
                  Buffett-style moat analysis requires specific investment
                  context
                </p>
              </div>
            )}
          </TabsContent>

          {/* Time Locks Tab */}
          <TabsContent value="time-locks" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Time-Locked Positions</h3>
              <Button
                size="sm"
                onClick={() => {
                  const amount = prompt("Investment amount ($):");
                  const days = prompt("Lock period (days):");
                  if (amount && days) {
                    handleCreateTimeLock(parseInt(amount), parseInt(days));
                  }
                }}
              >
                <Lock className="h-4 w-4 mr-2" />
                Create Lock
              </Button>
            </div>

            {timeLockedVaults.map((lock) => (
              <Card key={lock.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">
                      ${lock.amount.toLocaleString()} Position
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          lock.status === "active" ? "default" : "secondary"
                        }
                      >
                        {lock.status}
                      </Badge>
                      <Badge variant="outline">
                        {(lock.totalYield * 100).toFixed(1)}% Yield
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="font-medium text-blue-600">
                        {lock.lockPeriod} days
                      </div>
                      <div className="text-xs text-gray-500">Lock Period</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-green-600">
                        {lock.lockMultiplier.toFixed(1)}x
                      </div>
                      <div className="text-xs text-gray-500">Multiplier</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-purple-600">
                        +{(lock.buffattBonus * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">Buffett Bonus</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-orange-600">
                        {lock.compoundingFrequency}
                      </div>
                      <div className="text-xs text-gray-500">Compounding</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Lock Details</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Start Date:</span>
                          <span>{lock.lockStartDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Unlock Date:</span>
                          <span>{lock.unlockDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reinvestment:</span>
                          <span className="capitalize">
                            {lock.reinvestmentPlan.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        Yield Breakdown
                      </h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Base Yield:</span>
                          <span>{(lock.baseYield * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lock Bonus:</span>
                          <span>
                            +
                            {(
                              (lock.lockMultiplier - 1) *
                              lock.baseYield *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Buffett Bonus:</span>
                          <span>+{(lock.buffattBonus * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-1">
                          <span>Total Yield:</span>
                          <span className="text-green-600">
                            {(lock.totalYield * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {lock.status === "active" && (
                    <div className="mt-4 flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const days = prompt("Additional lock days:");
                          if (days) {
                            handleExtendLock(lock.id, parseInt(days));
                          }
                        }}
                      >
                        <Timer className="h-4 w-4 mr-2" />
                        Extend Lock
                      </Button>
                      <Button size="sm" variant="outline">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Early Withdrawal
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {timeLockedVaults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No time-locked positions</p>
                <p className="text-sm">
                  Create long-term positions for higher yields and Buffett
                  bonuses
                </p>
              </div>
            )}
          </TabsContent>

          {/* Compounding Simulation Tab */}
          <TabsContent value="compounding" className="space-y-4">
            {compoundingSimulation ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>30-Year Compounding Projection</CardTitle>
                    <CardDescription>
                      See how $
                      {compoundingSimulation.initialInvestment.toLocaleString()}{" "}
                      grows over time with{" "}
                      {compoundingSimulation.reinvestmentRate * 100}%
                      reinvestment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={compoundingSimulation.baseCase.yearlyValues}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: any) => [
                            `$${(value / 1000).toFixed(0)}K`,
                            "Value",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="cumulativeValue"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Worst Case",
                      scenario: compoundingSimulation.worstCase,
                      color: "red",
                    },
                    {
                      name: "Base Case",
                      scenario: compoundingSimulation.baseCase,
                      color: "blue",
                    },
                    {
                      name: "Best Case",
                      scenario: compoundingSimulation.bestCase,
                      color: "green",
                    },
                  ].map(({ name, scenario, color }) => (
                    <Card
                      key={name}
                      className={`border-l-4 border-l-${color}-500`}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">{name}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Final Value:</span>
                            <span className="font-medium">
                              ${(scenario.finalValue / 1000).toFixed(0)}K
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Total Return:</span>
                            <span className="font-medium">
                              {(scenario.totalReturn * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Annual Return:</span>
                            <span className="font-medium">
                              {(scenario.annualizedReturn * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Probability:</span>
                            <span className="font-medium">
                              {(scenario.probability * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Warren Buffett Wisdom
                    </h4>
                    <p className="text-sm text-blue-700 italic">
                      "My wealth has come from a combination of living in
                      America, some lucky genes, and compound interest. Time is
                      the friend of the wonderful business, the enemy of the
                      mediocre."
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No compounding simulation available</p>
                <p className="text-sm">
                  Select a vault to see long-term compounding projections
                </p>
              </div>
            )}
          </TabsContent>

          {/* AI Management Tab */}
          <TabsContent value="ai-management" className="space-y-4">
            {aiManagers.map((manager) => (
              <Card key={manager.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">AI Dividend Manager</h4>
                    <Badge
                      variant={
                        manager.status === "active" ? "default" : "secondary"
                      }
                    >
                      {manager.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="font-medium text-green-600">
                        $
                        {(
                          manager.performanceMetrics.totalManaged / 1000
                        ).toFixed(0)}
                        K
                      </div>
                      <div className="text-xs text-gray-500">Total Managed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-blue-600">
                        $
                        {(
                          manager.performanceMetrics.totalReinvested / 1000
                        ).toFixed(0)}
                        K
                      </div>
                      <div className="text-xs text-gray-500">Reinvested</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-purple-600">
                        {manager.performanceMetrics.yieldOptimization.toFixed(
                          1,
                        )}
                        %
                      </div>
                      <div className="text-xs text-gray-500">
                        Yield Optimization
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-orange-600">
                        {manager.performanceMetrics.riskAdjustedReturn.toFixed(
                          1,
                        )}
                        %
                      </div>
                      <div className="text-xs text-gray-500">
                        Risk-Adj Return
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        Management Style
                      </h5>
                      <Badge variant="outline" className="capitalize">
                        {manager.managementStyle.replace("_", " ")}
                      </Badge>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        Reinvestment Rules
                      </h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Health Threshold:</span>
                          <span>
                            {manager.reinvestmentRules.ecosystemHealthThreshold}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Reinvestment:</span>
                          <span>
                            {
                              manager.reinvestmentRules
                                .maxReinvestmentPercentage
                            }
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Yield Threshold:</span>
                          <span>
                            {(
                              manager.reinvestmentRules.yieldThreshold * 100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-purple-50 rounded">
                    <h5 className="font-medium text-purple-800 mb-2">
                      Diversification Limits
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(
                        manager.reinvestmentRules.diversificationLimits,
                      ).map(([type, limit]) => (
                        <div key={type} className="flex justify-between">
                          <span className="capitalize">
                            {type.replace("_", " ")}:
                          </span>
                          <span>{limit}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <strong>Last Action:</strong>{" "}
                    {manager.lastAction.toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}

            {aiManagers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No AI dividend managers active</p>
                <p className="text-sm">
                  Create time-locked positions with AI management for automated
                  reinvestment
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
