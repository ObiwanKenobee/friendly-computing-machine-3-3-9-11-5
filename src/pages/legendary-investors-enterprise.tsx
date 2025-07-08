/**
 * Legendary Investor Strategies - Enterprise Page
 * Complete suite of legendary investment philosophies
 */

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { SEOHead } from "../components/SEOHead";
import { ProtectedFeature } from "../components/SubscriptionGating";
import {
  Crown,
  Brain,
  Shield,
  TrendingUp,
  Target,
  BarChart3,
  Zap,
  Star,
  Award,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Eye,
  Lightbulb,
  Clock,
} from "lucide-react";

const LegendaryInvestorsEnterprise: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState("munger");
  const [progress, setProgress] = useState({
    munger: 75,
    buffett: 82,
    dalio: 68,
    lynch: 90,
  });

  const strategies = [
    {
      id: "munger",
      name: "Charlie Munger Models",
      subtitle: "Mental Models & Lattice Framework",
      description:
        "Master the art of multidisciplinary thinking with Charlie Munger's mental models approach",
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      color: "purple",
      keyPrinciples: [
        "Inversion Thinking",
        "Circle of Competence",
        "Psychological Biases",
        "Multidisciplinary Analysis",
        "Checklist Methodology",
      ],
      tools: [
        "Mental Models Library",
        "Bias Detection Engine",
        "Inversion Calculator",
        "Competence Mapper",
      ],
      performance: "+24.3% Annual Returns",
      riskProfile: "Moderate",
      timeHorizon: "Long-term (10+ years)",
    },
    {
      id: "buffett",
      name: "Warren Buffett Moats",
      subtitle: "Economic Moats & Value Creation",
      description:
        "Identify and invest in companies with sustainable competitive advantages",
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      color: "blue",
      keyPrinciples: [
        "Economic Moats",
        "Intrinsic Value",
        "Management Quality",
        "Predictable Earnings",
        "Buy & Hold Forever",
      ],
      tools: [
        "Moat Analyzer",
        "Intrinsic Value Calculator",
        "Management Scorecard",
        "Earnings Predictor",
      ],
      performance: "+22.1% Annual Returns",
      riskProfile: "Low-Moderate",
      timeHorizon: "Very Long-term (20+ years)",
    },
    {
      id: "dalio",
      name: "Ray Dalio Balance",
      subtitle: "All-Weather & Systematic Diversification",
      description:
        "Build resilient portfolios that perform across all economic environments",
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      color: "green",
      keyPrinciples: [
        "All-Weather Strategy",
        "Risk Parity",
        "Economic Cycles",
        "Systematic Approach",
        "Radical Transparency",
      ],
      tools: [
        "Risk Parity Engine",
        "Economic Cycle Detector",
        "Correlation Matrix",
        "Stress Tester",
      ],
      performance: "+18.7% Annual Returns",
      riskProfile: "Low",
      timeHorizon: "Medium-Long term (5-15 years)",
    },
    {
      id: "lynch",
      name: "Peter Lynch Insights",
      subtitle: "Local Knowledge & Growth Investing",
      description:
        "Leverage local insights and personal knowledge for investment opportunities",
      icon: <Eye className="h-8 w-8 text-orange-600" />,
      color: "orange",
      keyPrinciples: [
        "Invest in What You Know",
        "Local Market Intelligence",
        "Growth at Reasonable Price",
        "Consumer Trends",
        "Management Visits",
      ],
      tools: [
        "Local Intel Scanner",
        "Trend Analyzer",
        "GARP Calculator",
        "Consumer Sentiment",
      ],
      performance: "+26.8% Annual Returns",
      riskProfile: "Moderate-High",
      timeHorizon: "Medium-term (3-7 years)",
    },
  ];

  const currentStrategy = strategies.find((s) => s.id === selectedStrategy);

  const enterpriseFeatures = [
    {
      title: "Multi-Strategy Portfolio Optimization",
      description:
        "Combine multiple legendary strategies for optimal risk-adjusted returns",
      icon: <Target className="h-6 w-6" />,
    },
    {
      title: "Real-time Strategy Performance",
      description:
        "Track and compare performance across all legendary investment approaches",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      title: "Institutional-Grade Analytics",
      description:
        "Advanced analytics and reporting for professional money management",
      icon: <BarChart3 className="h-6 w-6" />,
    },
    {
      title: "White-label Solutions",
      description:
        "Brand these strategies as your own for client presentations",
      icon: <Crown className="h-6 w-6" />,
    },
  ];

  return (
    <>
      <SEOHead
        title="Legendary Investor Strategies - Enterprise | QuantumVest"
        description="Master the investment philosophies of Munger, Buffett, Dalio, and Lynch with enterprise-grade tools and analytics."
        keywords={[
          "legendary investors",
          "charlie munger",
          "warren buffett",
          "ray dalio",
          "peter lynch",
          "investment strategies",
          "enterprise investing",
          "professional portfolio management",
        ]}
        canonicalUrl="/legendary-investors-enterprise"
      />

      <ProtectedFeature
        requiredTier="enterprise"
        featureName="Legendary Investor Strategies"
        description="Access the complete suite of legendary investment philosophies with enterprise-grade tools and analytics."
        benefits={[
          "Complete Munger mental models framework",
          "Buffett moat analysis and valuation tools",
          "Dalio all-weather portfolio construction",
          "Lynch local intelligence platform",
          "Multi-strategy optimization engine",
          "Real-time performance tracking",
          "Institutional-grade reporting",
          "White-label solutions",
        ]}
      >
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
          <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-orange-100 rounded-full mr-4">
                  <Crown className="h-8 w-8 text-orange-700" />
                </div>
                <Badge className="bg-orange-100 text-orange-800">
                  Enterprise
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Legendary Investor Strategies
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Master the investment philosophies of history's greatest
                investors with enterprise-grade tools and analytics
              </p>
            </div>

            {/* Strategy Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {strategies.map((strategy) => (
                <Card
                  key={strategy.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedStrategy === strategy.id
                      ? `ring-2 ring-${strategy.color}-500 shadow-lg`
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedStrategy(strategy.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      {strategy.icon}
                      <div>
                        <CardTitle className="text-lg">
                          {strategy.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {strategy.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {progress[strategy.id as keyof typeof progress]}%
                        </span>
                      </div>
                      <Progress
                        value={progress[strategy.id as keyof typeof progress]}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Strategy Details */}
            {currentStrategy && (
              <div className="mb-8">
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {currentStrategy.icon}
                        <div>
                          <CardTitle className="text-2xl">
                            {currentStrategy.name}
                          </CardTitle>
                          <p className="text-gray-600">
                            {currentStrategy.subtitle}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`bg-${currentStrategy.color}-100 text-${currentStrategy.color}-800`}
                      >
                        Active Strategy
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">
                      {currentStrategy.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Performance Metrics */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">
                          Performance
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm">
                              {currentStrategy.performance}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">
                              Risk: {currentStrategy.riskProfile}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">
                              {currentStrategy.timeHorizon}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Key Principles */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">
                          Key Principles
                        </h3>
                        <ul className="space-y-2">
                          {currentStrategy.keyPrinciples.map(
                            (principle, idx) => (
                              <li
                                key={idx}
                                className="flex items-start space-x-2"
                              >
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">
                                  {principle}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>

                      {/* Tools */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">
                          Enterprise Tools
                        </h3>
                        <ul className="space-y-2">
                          {currentStrategy.tools.map((tool, idx) => (
                            <li
                              key={idx}
                              className="flex items-start space-x-2"
                            >
                              <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">
                                {tool}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Enterprise Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Enterprise Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enterpriseFeatures.map((feature, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group">
                  Launch Strategy Dashboard
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg">
                  Download Strategy Guide
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Estimated setup time: ~10 minutes
              </p>
            </div>
          </div>
        </div>
      </ProtectedFeature>
    </>
  );
};

export default LegendaryInvestorsEnterprise;
