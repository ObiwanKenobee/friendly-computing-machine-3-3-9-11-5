/**
 * Age Switcher Demo Page for QuantumVest Enterprise
 * Demonstrates age-based investment personalization and strategies
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
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
  TrendingUp,
  Shield,
  Target,
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  Info,
  CheckCircle,
  Sparkles,
  Timer,
  Brain,
  LineChart,
  PieChart,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import AgeSwitcher from "@/components/AgeSwitcher";
import {
  useAgeContext,
  useAgeInvestmentStrategies,
  useAgeBasedUI,
  useAgeCompliance,
} from "@/hooks/useAgeContext";
import { AgeRange } from "@/types/Age";

const AgeSwitcherDemo: React.FC = () => {
  const { currentAge, profile, strategies } = useAgeContext();
  const {
    getTopStrategy,
    getLegendaryInvestorRecommendation,
    getOptimalAllocation,
    getRiskScore,
  } = useAgeInvestmentStrategies();
  const { getColorScheme, getMotivationalMessage, ageIcon } = useAgeBasedUI();
  const { checkProductEligibility, getRequiredDisclosures } =
    useAgeCompliance();

  const [selectedTab, setSelectedTab] = useState("overview");
  const [simulationAge, setSimulationAge] = useState<AgeRange | null>(null);

  const colorScheme = getColorScheme();
  const topStrategy = getTopStrategy();
  const legendaryRecommendation = getLegendaryInvestorRecommendation();
  const optimalAllocation = getOptimalAllocation();
  const riskScore = getRiskScore();
  const requiredDisclosures = getRequiredDisclosures();

  // Sample products for compliance demonstration
  const sampleProducts = [
    {
      id: "etf_basic",
      name: "Basic ETF Portfolio",
      complexity: "simple" as const,
      riskLevel: 3,
    },
    {
      id: "crypto_complex",
      name: "Advanced Crypto Trading",
      complexity: "complex" as const,
      riskLevel: 9,
    },
    {
      id: "leveraged_etfs",
      name: "Leveraged ETFs",
      complexity: "moderate" as const,
      riskLevel: 8,
    },
    {
      id: "dividend_stocks",
      name: "Dividend Aristocrats",
      complexity: "simple" as const,
      riskLevel: 4,
    },
    {
      id: "private_equity",
      name: "Private Equity Fund",
      complexity: "complex" as const,
      riskLevel: 7,
    },
    {
      id: "retirement_annuities",
      name: "Retirement Annuities",
      complexity: "moderate" as const,
      riskLevel: 2,
    },
  ];

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
                <h1 className="text-2xl font-bold">Age Switcher Demo</h1>
                <p className="text-muted-foreground">
                  Experience age-based investment personalization
                </p>
              </div>
            </div>

            {/* Header Age Switcher */}
            <AgeSwitcher variant="header" className="w-64" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            {currentAge && profile ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{ageIcon}</div>
                  <div>
                    <h2 className="text-2xl font-bold">{profile.label}</h2>
                    <p className="text-blue-100 text-lg">
                      {getMotivationalMessage()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Get Started
                  </CardTitle>
                  <CardDescription>
                    Select your age range above to see personalized investment
                    strategies
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* Onboarding Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Try the Onboarding Experience</CardTitle>
                <CardDescription>
                  See how new users would select their age range during
                  registration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AgeSwitcher
                  variant="onboarding"
                  onAgeSelected={(age) => {
                    setSimulationAge(age);
                    setSelectedTab("strategies");
                  }}
                />
              </CardContent>
            </Card>

            {/* Detailed Analysis Tabs */}
            {currentAge && (
              <Card>
                <CardHeader>
                  <CardTitle>Age-Based Investment Analysis</CardTitle>
                  <CardDescription>
                    Comprehensive breakdown of recommendations for{" "}
                    {profile?.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="strategies">Strategies</TabsTrigger>
                      <TabsTrigger value="allocation">Allocation</TabsTrigger>
                      <TabsTrigger value="compliance">Compliance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-5 w-5 text-green-600" />
                            <span className="font-medium">Risk Tolerance</span>
                          </div>
                          <div className="text-2xl font-bold text-green-700 mb-1">
                            {profile?.characteristics.riskTolerance}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Risk Score: {riskScore}/10
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Timer className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">Time Horizon</span>
                          </div>
                          <div className="text-2xl font-bold text-blue-700 mb-1">
                            {profile?.characteristics.investmentHorizon} years
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Long-term focus
                          </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-5 w-5 text-purple-600" />
                            <span className="font-medium">Liquidity Needs</span>
                          </div>
                          <div className="text-2xl font-bold text-purple-700 mb-1">
                            {profile?.characteristics.liquidityNeeds}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Cash accessibility
                          </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                            <span className="font-medium">Income Stage</span>
                          </div>
                          <div className="text-2xl font-bold text-orange-700 mb-1">
                            {profile?.characteristics.incomeStability}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Career trajectory
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-3">
                          Primary Investment Goals
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile?.characteristics.primaryGoals.map((goal) => (
                            <Badge key={goal} variant="outline">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="strategies" className="space-y-4">
                      {legendaryRecommendation && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Brain className="h-6 w-6 text-yellow-600" />
                            <div>
                              <h4 className="font-semibold">
                                Legendary Investor Focus
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Based on your age profile
                              </p>
                            </div>
                          </div>
                          <div className="bg-white rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                {legendaryRecommendation.investor}
                              </span>
                              <Badge variant="outline">
                                {legendaryRecommendation.relevance}/10 relevance
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {legendaryRecommendation.strategy}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <h4 className="font-medium">
                          Recommended Investment Strategies
                        </h4>
                        {strategies.slice(0, 3).map((strategy, index) => (
                          <div
                            key={strategy.name}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{strategy.name}</h5>
                              {index === 0 && (
                                <Badge variant="default">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Top Pick
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {strategy.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span>{strategy.expectedReturn}% return</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Shield className="h-4 w-4 text-blue-600" />
                                <span>Risk: {strategy.riskLevel}/10</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Timer className="h-4 w-4 text-purple-600" />
                                <span>{strategy.timeframe}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="allocation" className="space-y-4">
                      {optimalAllocation && (
                        <div className="space-y-4">
                          <h4 className="font-medium">
                            Recommended Portfolio Allocation
                          </h4>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="bg-green-100 p-4 rounded-lg mb-2">
                                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-green-700">
                                  {optimalAllocation.stocks}%
                                </div>
                              </div>
                              <div className="text-sm font-medium">Stocks</div>
                            </div>

                            <div className="text-center">
                              <div className="bg-blue-100 p-4 rounded-lg mb-2">
                                <LineChart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-blue-700">
                                  {optimalAllocation.bonds}%
                                </div>
                              </div>
                              <div className="text-sm font-medium">Bonds</div>
                            </div>

                            <div className="text-center">
                              <div className="bg-purple-100 p-4 rounded-lg mb-2">
                                <PieChart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-purple-700">
                                  {optimalAllocation.alternatives}%
                                </div>
                              </div>
                              <div className="text-sm font-medium">
                                Alternatives
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="bg-gray-100 p-4 rounded-lg mb-2">
                                <DollarSign className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-700">
                                  {optimalAllocation.cash}%
                                </div>
                              </div>
                              <div className="text-sm font-medium">Cash</div>
                            </div>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h5 className="font-medium mb-2">
                              Age-Based Allocation Strategy
                            </h5>
                            <p className="text-sm text-muted-foreground">
                              This allocation is optimized for your age group (
                              {currentAge}) and balances growth potential with
                              risk management. As you age, the system will
                              automatically suggest more conservative
                              allocations.
                            </p>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="compliance" className="space-y-4">
                      <div className="space-y-4">
                        <h4 className="font-medium">
                          Product Eligibility Analysis
                        </h4>

                        <div className="space-y-3">
                          {sampleProducts.map((product) => {
                            const eligibility = checkProductEligibility(
                              product.id,
                              product.name,
                            );
                            return (
                              <div
                                key={product.id}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium">
                                    {product.name}
                                  </h5>
                                  {eligibility.eligible ? (
                                    <Badge
                                      variant="outline"
                                      className="text-green-700 border-green-300"
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Eligible
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="text-red-700 border-red-300"
                                    >
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Restricted
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                  <span>Risk: {product.riskLevel}/10</span>
                                  <span>Complexity: {product.complexity}</span>
                                </div>
                                {!eligibility.eligible &&
                                  eligibility.reason && (
                                    <div className="bg-red-50 p-3 rounded text-sm">
                                      <p className="text-red-700 mb-1">
                                        {eligibility.reason}
                                      </p>
                                      {eligibility.alternativeRecommendation && (
                                        <p className="text-red-600">
                                          <strong>Alternative:</strong>{" "}
                                          {
                                            eligibility.alternativeRecommendation
                                          }
                                        </p>
                                      )}
                                    </div>
                                  )}
                              </div>
                            );
                          })}
                        </div>

                        {requiredDisclosures.length > 0 && (
                          <div className="space-y-3">
                            <h5 className="font-medium">
                              Required Disclosures
                            </h5>
                            {requiredDisclosures.map((disclosure) => (
                              <div
                                key={disclosure.id}
                                className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Info className="h-4 w-4 text-yellow-600" />
                                  <span className="font-medium">
                                    {disclosure.title}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {disclosure.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Standalone Age Switcher */}
            <AgeSwitcher
              variant="standalone"
              showRecommendations={true}
              showStrategies={true}
            />

            {/* Compact Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compact Mode</CardTitle>
                <CardDescription>
                  Space-efficient variant for navigation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AgeSwitcher variant="compact" />
              </CardContent>
            </Card>

            {/* Feature Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">
                      Personalized Strategies
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Age-appropriate investment recommendations
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">
                      Legendary Investor Wisdom
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Strategies adapted from Warren Buffett, Charlie Munger,
                      and others
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Risk Management</div>
                    <div className="text-xs text-muted-foreground">
                      Age-based risk tolerance and product restrictions
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">
                      Regulatory Compliance
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Automatic eligibility checks and disclosures
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Implementation Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Implementation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Context:</strong> React Context API
                </div>
                <div>
                  <strong>Storage:</strong> LocalStorage persistence
                </div>
                <div>
                  <strong>Animations:</strong> Framer Motion
                </div>
                <div>
                  <strong>UI:</strong> Radix UI + Tailwind CSS
                </div>
                <div>
                  <strong>Variants:</strong> Header, Standalone, Compact,
                  Onboarding
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeSwitcherDemo;
