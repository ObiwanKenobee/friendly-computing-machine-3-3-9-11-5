import React, { useState, useEffect } from "react";
import { useQuantumAuth } from "../hooks/useQuantumAuth";
import { culturalService } from "../services/culturalService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts";
import {
  Heart,
  Leaf,
  Users,
  Scale,
  Globe2,
  Award,
  CheckCircle,
  AlertCircle,
  Star,
  Building2,
  Church,
  Flower,
  TreePine,
  Waves,
  Sun,
  Recycle,
  Building,
  TrendingUp,
} from "lucide-react";

const CulturalInvestorDashboard = () => {
  const {
    quantumIdentity,
    isAuthenticated,
    getQuantumScore,
    getCulturalAlignment,
  } = useQuantumAuth();

  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [culturalFramework, setCulturalFramework] = useState("islamic");
  const [complianceData, setComplianceData] = useState<any>(null);
  const [impactMetrics, setImpactMetrics] = useState<any>(null);
  const [ethicalInvestments, setEthicalInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && quantumIdentity) {
      setCulturalFramework(quantumIdentity.culturalIdentity.primaryCulture);
      loadDashboardData();
    }
  }, [isAuthenticated, quantumIdentity]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load portfolio data
      const portfolio = await loadPortfolioData();
      setPortfolioData(portfolio);

      // Load cultural compliance data
      const compliance = await loadComplianceData();
      setComplianceData(compliance);

      // Load impact metrics
      const impact = await loadImpactMetrics();
      setImpactMetrics(impact);

      // Load ethical investment opportunities
      const investments = await loadEthicalInvestments();
      setEthicalInvestments(investments);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolioData = async () => {
    return {
      totalValue: 150000,
      culturallyCompliantValue: 142500,
      complianceRatio: 0.95,
      holdings: [
        {
          name: "Sukuk Bonds Portfolio",
          value: 45000,
          allocation: 30,
          complianceScore: 100,
          category: "Fixed Income",
          impactArea: "Infrastructure",
        },
        {
          name: "ESG Global Equity Fund",
          value: 37500,
          allocation: 25,
          complianceScore: 95,
          category: "Equity",
          impactArea: "Environmental",
        },
        {
          name: "Islamic Technology ETF",
          value: 30000,
          allocation: 20,
          complianceScore: 98,
          category: "Technology",
          impactArea: "Innovation",
        },
        {
          name: "Clean Energy Infrastructure",
          value: 22500,
          allocation: 15,
          complianceScore: 92,
          category: "Infrastructure",
          impactArea: "Renewable Energy",
        },
        {
          name: "Microfinance Institutions",
          value: 15000,
          allocation: 10,
          complianceScore: 97,
          category: "Financial Services",
          impactArea: "Financial Inclusion",
        },
      ],
      performance: generatePerformanceData(),
    };
  };

  const loadComplianceData = async () => {
    return {
      overallScore: 96,
      breakdown: {
        sharia: 98,
        esg: 94,
        social: 95,
        governance: 97,
      },
      violations: [],
      certifications: [
        {
          authority: "AAOIFI",
          type: "Sharia Compliance",
          valid: true,
          expires: "2024-12-31",
        },
        { authority: "MSCI", type: "ESG Rating", rating: "AA", valid: true },
        {
          authority: "Islamic Society",
          type: "Community Verification",
          valid: true,
        },
      ],
      screening: {
        alcohol: 0,
        gambling: 0,
        tobacco: 0,
        weapons: 0,
        interest: 2.1, // Below 5% threshold
        debt: 12.5, // Below 33% threshold
      },
    };
  };

  const loadImpactMetrics = async () => {
    return {
      socialImpact: {
        jobsCreated: 2847,
        livesImproved: 15420,
        communitiesServed: 89,
        educationSupported: 1250,
      },
      environmentalImpact: {
        co2Reduced: 1234, // tons
        renewableEnergyGenerated: 567, // MWh
        wasteReduced: 89, // tons
        waterSaved: 456, // liters
      },
      sdgAlignment: [
        { goal: 1, name: "No Poverty", progress: 78 },
        { goal: 3, name: "Good Health", progress: 65 },
        { goal: 4, name: "Quality Education", progress: 82 },
        { goal: 7, name: "Clean Energy", progress: 91 },
        { goal: 8, name: "Decent Work", progress: 73 },
        { goal: 13, name: "Climate Action", progress: 87 },
      ],
    };
  };

  const loadEthicalInvestments = async () => {
    return [
      {
        id: "1",
        name: "Islamic Green Sukuk",
        type: "Sukuk",
        return: 6.8,
        risk: "Low",
        complianceScore: 100,
        minInvestment: 5000,
        category: "Environmental",
        description:
          "Sharia-compliant green bonds funding renewable energy projects",
      },
      {
        id: "2",
        name: "Social Impact Fund",
        type: "Equity Fund",
        return: 9.2,
        risk: "Medium",
        complianceScore: 94,
        minInvestment: 1000,
        category: "Social",
        description: "Investing in companies with positive social impact",
      },
      {
        id: "3",
        name: "Halal Technology Innovation",
        type: "Private Equity",
        return: 15.5,
        risk: "High",
        complianceScore: 97,
        minInvestment: 25000,
        category: "Technology",
        description: "Early-stage halal technology companies",
      },
      {
        id: "4",
        name: "Community Development REIT",
        type: "Real Estate",
        return: 7.5,
        risk: "Medium",
        complianceScore: 96,
        minInvestment: 10000,
        category: "Real Estate",
        description: "Affordable housing and community infrastructure",
      },
    ];
  };

  const generatePerformanceData = () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date();
      month.setMonth(month.getMonth() - 11 + i);
      data.push({
        month: month.toLocaleDateString("en-US", { month: "short" }),
        portfolio: 100 + i * 2.5 + (Math.random() - 0.5) * 3,
        benchmark: 100 + i * 2.2 + (Math.random() - 0.5) * 4,
        compliance: Math.min(100, 92 + i * 0.3),
      });
    }
    return data;
  };

  const getFrameworkIcon = (framework: string) => {
    const icons = {
      islamic: Mosque,
      christian: Church,
      buddhist: Flower2,
      esg: Leaf,
      indigenous: TreePine,
    };
    return icons[framework as keyof typeof icons] || Scale;
  };

  const getFrameworkColor = (framework: string) => {
    const colors = {
      islamic: "emerald",
      christian: "blue",
      buddhist: "purple",
      esg: "green",
      indigenous: "orange",
    };
    return colors[framework as keyof typeof colors] || "blue";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  const FrameworkIcon = getFrameworkIcon(culturalFramework);
  const frameworkColor = getFrameworkColor(culturalFramework);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <FrameworkIcon className="h-8 w-8" />
                Values-Based Investing
              </h1>
              <p className="text-emerald-200">
                Investments aligned with your {culturalFramework} values and
                principles
              </p>
            </div>
            <div className="flex gap-4">
              <Badge
                variant="outline"
                className="bg-emerald-900/20 border-emerald-400 text-emerald-300"
              >
                Cultural Score: {getCulturalAlignment()}/100
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-900/20 border-green-400 text-green-300"
              >
                Compliance: {complianceData?.overallScore}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${portfolioData?.totalValue.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-green-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                {(
                  (portfolioData?.culturallyCompliantValue /
                    portfolioData?.totalValue) *
                  100
                ).toFixed(1)}
                % Compliant
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Compliance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {complianceData?.overallScore}/100
              </div>
              <div className="text-sm text-emerald-400">Excellent standing</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Social Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {impactMetrics?.socialImpact.livesImproved.toLocaleString()}
              </div>
              <div className="text-sm text-blue-400">Lives improved</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {impactMetrics?.environmentalImpact.co2Reduced}
              </div>
              <div className="text-sm text-green-400">Tons CO₂ reduced</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger
              value="portfolio"
              className="data-[state=active]:bg-slate-700"
            >
              Portfolio
            </TabsTrigger>
            <TabsTrigger
              value="compliance"
              className="data-[state=active]:bg-slate-700"
            >
              Compliance
            </TabsTrigger>
            <TabsTrigger
              value="impact"
              className="data-[state=active]:bg-slate-700"
            >
              Impact Metrics
            </TabsTrigger>
            <TabsTrigger
              value="opportunities"
              className="data-[state=active]:bg-slate-700"
            >
              Opportunities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Portfolio Performance
                  </CardTitle>
                  <CardDescription>
                    Ethical investments vs benchmark
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={portfolioData?.performance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                        }}
                        labelStyle={{ color: "#F3F4F6" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="portfolio"
                        stroke="#10B981"
                        fill="url(#portfolioGradient)"
                        strokeWidth={2}
                        name="Ethical Portfolio"
                      />
                      <Area
                        type="monotone"
                        dataKey="benchmark"
                        stroke="#6B7280"
                        fill="none"
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        name="Market Benchmark"
                      />
                      <defs>
                        <linearGradient
                          id="portfolioGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Holdings Compliance */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Holdings Compliance
                  </CardTitle>
                  <CardDescription>Compliance scores by asset</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolioData?.holdings.map(
                      (holding: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-white font-medium">
                                {holding.name}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {holding.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {holding.impactArea}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-mono">
                                ${(holding.value / 1000).toFixed(0)}K
                              </div>
                              <div
                                className={`text-sm ${
                                  holding.complianceScore >= 95
                                    ? "text-green-400"
                                    : holding.complianceScore >= 90
                                      ? "text-yellow-400"
                                      : "text-red-400"
                                }`}
                              >
                                {holding.complianceScore}% compliant
                              </div>
                            </div>
                          </div>
                          <Progress
                            value={holding.complianceScore}
                            className="h-2"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Breakdown */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Compliance Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(complianceData?.breakdown || {}).map(
                      ([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400 capitalize">
                              {key} Compliance
                            </span>
                            <span className="text-white font-mono">
                              {value}%
                            </span>
                          </div>
                          <Progress value={value as number} className="h-2" />
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Screening Results */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Screening Results
                  </CardTitle>
                  <CardDescription>
                    Prohibited activities exposure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(complianceData?.screening || {}).map(
                      ([activity, percentage]) => (
                        <div
                          key={activity}
                          className="p-3 bg-slate-700/30 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white capitalize">
                              {activity}
                            </span>
                            {percentage === 0 ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-400" />
                            )}
                          </div>
                          <div className="text-sm">
                            <span
                              className={`font-mono ${percentage === 0 ? "text-green-400" : "text-yellow-400"}`}
                            >
                              {percentage}%
                            </span>
                            <span className="text-slate-400 ml-1">
                              exposure
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certifications */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications & Validations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {complianceData?.certifications.map(
                    (cert: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-700/30 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-5 w-5 text-yellow-400" />
                          <span className="text-white font-medium">
                            {cert.authority}
                          </span>
                        </div>
                        <div className="text-sm text-slate-300 mb-2">
                          {cert.type}
                        </div>
                        {cert.rating && (
                          <div className="text-lg font-mono text-yellow-400 mb-2">
                            {cert.rating}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-green-400 text-sm">Valid</span>
                          {cert.expires && (
                            <span className="text-slate-400 text-sm">
                              until {cert.expires}
                            </span>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Social Impact */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <HandHeart className="h-5 w-5" />
                    Social Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {impactMetrics?.socialImpact.jobsCreated.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-400">Jobs Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {impactMetrics?.socialImpact.livesImproved.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-400">
                        Lives Improved
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {impactMetrics?.socialImpact.communitiesServed}
                      </div>
                      <div className="text-sm text-slate-400">Communities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {impactMetrics?.socialImpact.educationSupported.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-400">
                        Students Supported
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Environmental Impact */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Environmental Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Recycle className="h-4 w-4 text-green-400" />
                        <span className="text-slate-300">CO₂ Reduced</span>
                      </div>
                      <span className="text-white font-mono">
                        {impactMetrics?.environmentalImpact.co2Reduced} tons
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-400" />
                        <span className="text-slate-300">Clean Energy</span>
                      </div>
                      <span className="text-white font-mono">
                        {
                          impactMetrics?.environmentalImpact
                            .renewableEnergyGenerated
                        }{" "}
                        MWh
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Waves className="h-4 w-4 text-blue-400" />
                        <span className="text-slate-300">Water Saved</span>
                      </div>
                      <span className="text-white font-mono">
                        {impactMetrics?.environmentalImpact.waterSaved} L
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Recycle className="h-4 w-4 text-purple-400" />
                        <span className="text-slate-300">Waste Reduced</span>
                      </div>
                      <span className="text-white font-mono">
                        {impactMetrics?.environmentalImpact.wasteReduced} tons
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SDG Alignment */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe2 className="h-5 w-5" />
                  UN Sustainable Development Goals Alignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {impactMetrics?.sdgAlignment.map(
                    (sdg: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-700/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">
                            SDG {sdg.goal}
                          </span>
                          <span className="text-sm text-slate-400">
                            {sdg.progress}%
                          </span>
                        </div>
                        <div className="text-sm text-slate-300 mb-2">
                          {sdg.name}
                        </div>
                        <Progress value={sdg.progress} className="h-2" />
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ethicalInvestments.map((investment, index) => (
                <Card
                  key={investment.id}
                  className="bg-slate-800/50 border-slate-700"
                >
                  <CardHeader>
                    <CardTitle className="text-white">
                      {investment.name}
                    </CardTitle>
                    <CardDescription>
                      <Badge variant="outline">{investment.type}</Badge>
                      <Badge variant="outline" className="ml-2">
                        {investment.category}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-slate-300 text-sm">
                        {investment.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400 text-sm block">
                            Expected Return
                          </span>
                          <span className="text-green-400 font-mono text-lg">
                            {investment.return}%
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm block">
                            Risk Level
                          </span>
                          <Badge
                            variant="outline"
                            className={`${
                              investment.risk === "Low"
                                ? "border-green-400 text-green-300"
                                : investment.risk === "Medium"
                                  ? "border-yellow-400 text-yellow-300"
                                  : "border-red-400 text-red-300"
                            }`}
                          >
                            {investment.risk}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400 text-sm block">
                            Min Investment
                          </span>
                          <span className="text-white font-mono">
                            ${investment.minInvestment.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm block">
                            Compliance Score
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-mono">
                              {investment.complianceScore}%
                            </span>
                            {investment.complianceScore >= 95 && (
                              <Star className="h-4 w-4 text-yellow-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      <Button className="w-full">Invest Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CulturalInvestorDashboard;
