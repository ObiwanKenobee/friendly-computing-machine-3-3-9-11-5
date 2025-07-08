import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import {
  Globe,
  TrendingUp,
  DollarSign,
  Users,
  MapPin,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Calculator,
  AlertTriangle,
  Zap,
  Crown,
} from "lucide-react";
import { marketAnalyticsService } from "../services/marketAnalyticsService";
import type {
  AfricanMarketData,
  GlobalMarketComparison,
  PricingStrategy,
  RevOpsMetrics,
  MarketOpportunity,
} from "../types/MarketAnalytics";

const AfricanMarketEnterprise: React.FC = () => {
  const [africanData, setAfricanData] = useState<AfricanMarketData | null>(
    null,
  );
  const [globalComparison, setGlobalComparison] =
    useState<GlobalMarketComparison | null>(null);
  const [pricingStrategy, setPricingStrategy] =
    useState<PricingStrategy | null>(null);
  const [revOpsMetrics, setRevOpsMetrics] = useState<RevOpsMetrics | null>(
    null,
  );
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [african, global, pricing, revops, opps] = await Promise.all([
          marketAnalyticsService.getAfricanMarketData(),
          marketAnalyticsService.getGlobalMarketComparison(),
          marketAnalyticsService.getPricingStrategy(),
          marketAnalyticsService.getRevOpsMetrics(),
          marketAnalyticsService.getMarketOpportunities(),
        ]);

        setAfricanData(african);
        setGlobalComparison(global);
        setPricingStrategy(pricing);
        setRevOpsMetrics(revops);
        setOpportunities(opps);
      } catch (error) {
        console.error("Failed to load market data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (
    loading ||
    !africanData ||
    !globalComparison ||
    !pricingStrategy ||
    !revOpsMetrics
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700">
            Loading Market Intelligence...
          </h2>
          <p className="text-gray-500 mt-2">
            Analyzing global markets and revenue operations
          </p>
        </div>
      </div>
    );
  }

  const COLORS = [
    "#FF6B35",
    "#F7941D",
    "#FFC107",
    "#4CAF50",
    "#2196F3",
    "#9C27B0",
  ];

  const formatCurrency = (value: number) =>
    marketAnalyticsService.formatCurrency(value);
  const formatLargeNumber = (value: number) =>
    marketAnalyticsService.formatLargeNumber(value);
  const formatPercentage = (value: number) =>
    marketAnalyticsService.formatPercentage(value);

  const regionColors = {
    "North Africa": "#FF6B35",
    "West Africa": "#F7941D",
    "East Africa": "#FFC107",
    "Central Africa": "#4CAF50",
    "Southern Africa": "#2196F3",
  };

  const regionData = Object.values(africanData.regions).map((region) => ({
    name: region.name,
    population: region.population / 1000000, // Convert to millions
    gdp: region.gdp / 1000000000, // Convert to billions
    arpu: region.averageARPU,
    maturity: region.marketMaturity,
    potential: region.marketPotential,
    color: regionColors[region.name as keyof typeof regionColors],
  }));

  const globalComparisonData = globalComparison.regions.map((region) => ({
    name: region.name,
    marketSize: region.totalMarketSize / 1000000000,
    arpu: region.averageARPU,
    growth: region.growthRate,
    penetration: region.penetrationRate,
    opportunity: region.opportunityScore,
  }));

  const revenueProjectionData = [
    {
      year: "Year 1",
      africa: pricingStrategy.revenueProjections.year1.africa / 1000000,
      global: pricingStrategy.revenueProjections.year1.global / 1000000,
    },
    {
      year: "Year 2",
      africa: pricingStrategy.revenueProjections.year2.africa / 1000000,
      global: pricingStrategy.revenueProjections.year2.global / 1000000,
    },
    {
      year: "Year 3",
      africa: pricingStrategy.revenueProjections.year3.africa / 1000000,
      global: pricingStrategy.revenueProjections.year3.global / 1000000,
    },
    {
      year: "Year 5",
      africa: pricingStrategy.revenueProjections.year5.africa / 1000000,
      global: pricingStrategy.revenueProjections.year5.global / 1000000,
    },
  ];

  const revOpsRegionalData = Object.entries(
    revOpsMetrics.regionalBreakdown,
  ).map(([region, data]) => ({
    region: region.charAt(0).toUpperCase() + region.slice(1),
    revenue: data.revenue / 1000000,
    customers: data.customers / 1000,
    arpu: data.arpu,
    growth: data.growthRate,
    churn: data.churnRate,
    ltv: data.ltv,
    marketShare: data.marketShare,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  African Market & Global Enterprise Intelligence
                </h1>
                <p className="text-lg text-gray-600">
                  Continental breakdown, pricing strategy, and revenue
                  operations analytics
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-600 px-4 py-2 text-lg"
            >
              Live Analytics
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Market Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="african-breakdown"
              className="flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span>African Breakdown</span>
            </TabsTrigger>
            <TabsTrigger
              value="global-comparison"
              className="flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span>Global Comparison</span>
            </TabsTrigger>
            <TabsTrigger
              value="pricing-strategy"
              className="flex items-center space-x-2"
            >
              <Calculator className="h-4 w-4" />
              <span>Pricing Strategy</span>
            </TabsTrigger>
            <TabsTrigger value="revops" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>RevOps Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Market Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total African Market
                  </CardTitle>
                  <TrendingUp className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(africanData.overview.gdpTotal)}
                  </div>
                  <p className="text-xs opacity-90">GDP across 54 countries</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Population
                  </CardTitle>
                  <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatLargeNumber(africanData.overview.totalPopulation)}
                  </div>
                  <p className="text-xs opacity-90">1.4B+ potential users</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mobile Penetration
                  </CardTitle>
                  <Zap className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPercentage(africanData.overview.mobilePenetration)}
                  </div>
                  <p className="text-xs opacity-90">Growing rapidly</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Revenue Growth
                  </CardTitle>
                  <Crown className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPercentage(revOpsMetrics.overview.growthRate)}
                  </div>
                  <p className="text-xs opacity-90">Year over year</p>
                </CardContent>
              </Card>
            </div>

            {/* Market Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  <span>Strategic Market Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {opportunities.map((opportunity) => (
                    <Card
                      key={opportunity.id}
                      className="border-l-4 border-orange-500"
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {opportunity.title}
                          </h4>
                          <Badge
                            variant={
                              opportunity.riskLevel === "Low"
                                ? "default"
                                : opportunity.riskLevel === "Medium"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {opportunity.riskLevel} Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {opportunity.description}
                        </p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Market Size:</span>
                            <span className="font-medium">
                              {formatCurrency(opportunity.marketSize)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Projected Revenue:</span>
                            <span className="font-medium">
                              {formatCurrency(opportunity.projectedRevenue)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Success Probability:</span>
                            <span className="font-medium">
                              {formatPercentage(opportunity.successProbability)}
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={opportunity.successProbability}
                          className="mt-2"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* African Breakdown Tab */}
          <TabsContent value="african-breakdown" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Regional Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Regional Market Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) =>
                          `${name}: ${formatLargeNumber(value * 1000000)}`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="population"
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          formatLargeNumber(value * 1000000),
                          "Population",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Regional GDP vs ARPU */}
              <Card>
                <CardHeader>
                  <CardTitle>GDP vs Average Revenue Per User</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={regionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="gdp"
                        fill="#FF6B35"
                        name="GDP (Billions)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="arpu"
                        stroke="#2196F3"
                        name="ARPU ($)"
                        strokeWidth={3}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Countries Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top African Markets Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Country</th>
                        <th className="text-right p-2">Population</th>
                        <th className="text-right p-2">GDP</th>
                        <th className="text-right p-2">GDP/Capita</th>
                        <th className="text-right p-2">Penetration</th>
                        <th className="text-center p-2">Opportunity</th>
                        <th className="text-center p-2">Competition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {africanData.topCountries.map((country) => (
                        <tr
                          key={country.code}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {country.name}
                              </span>
                              <Badge variant="outline">{country.code}</Badge>
                            </div>
                          </td>
                          <td className="text-right p-2">
                            {formatLargeNumber(country.population)}
                          </td>
                          <td className="text-right p-2">
                            {formatCurrency(country.gdp)}
                          </td>
                          <td className="text-right p-2">
                            {formatCurrency(country.gdpPerCapita)}
                          </td>
                          <td className="text-right p-2">
                            {formatPercentage(country.penetrationRate)}
                          </td>
                          <td className="text-center p-2">
                            <div className="flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {country.opportunityScore.toFixed(1)}
                              </span>
                              <div className="w-12 ml-2">
                                <Progress
                                  value={country.opportunityScore * 10}
                                  className="h-2"
                                />
                              </div>
                            </div>
                          </td>
                          <td className="text-center p-2">
                            <Badge
                              variant={
                                country.competitionLevel === "Low"
                                  ? "default"
                                  : country.competitionLevel === "Medium"
                                    ? "secondary"
                                    : country.competitionLevel === "High"
                                      ? "outline"
                                      : "destructive"
                              }
                            >
                              {country.competitionLevel}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Global Comparison Tab */}
          <TabsContent value="global-comparison" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Size Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Global Market Size Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={globalComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [
                          `$${value.toFixed(1)}B`,
                          "Market Size",
                        ]}
                      />
                      <Bar dataKey="marketSize" fill="#FF6B35" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Growth Rate vs ARPU */}
              <Card>
                <CardHeader>
                  <CardTitle>Growth Rate vs ARPU by Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={globalComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="right"
                        dataKey="arpu"
                        fill="#4CAF50"
                        name="ARPU ($)"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="growth"
                        stroke="#FF6B35"
                        name="Growth Rate (%)"
                        strokeWidth={3}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Market Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Africa vs Global Market Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart
                    data={[
                      ...globalComparison.marketSizeTrends.historical,
                      ...globalComparison.marketSizeTrends.projected,
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`$${value}B`, ""]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="africa"
                      stackId="1"
                      stroke="#FF6B35"
                      fill="#FF6B35"
                      fillOpacity={0.6}
                      name="Africa Market Size"
                    />
                    <Area
                      type="monotone"
                      dataKey="global"
                      stackId="2"
                      stroke="#2196F3"
                      fill="#2196F3"
                      fillOpacity={0.3}
                      name="Global Market Size"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Competitive Positioning */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Market Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatPercentage(
                      globalComparison.competitivePositioning.marketShare
                        .africa,
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Africa focus advantage
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Growth Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatPercentage(
                      globalComparison.competitivePositioning.growthRate.africa,
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    vs{" "}
                    {formatPercentage(
                      globalComparison.competitivePositioning.growthRate
                        .competitors,
                    )}{" "}
                    competitors
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Customer Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      globalComparison.competitivePositioning
                        .customerSatisfaction.africa
                    }
                  </div>
                  <p className="text-xs text-gray-500">
                    vs{" "}
                    {
                      globalComparison.competitivePositioning
                        .customerSatisfaction.competitors
                    }{" "}
                    avg
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Innovation Index</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      globalComparison.competitivePositioning.innovationIndex
                        .africa
                    }
                  </div>
                  <p className="text-xs text-gray-500">Quantum advantage</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing Strategy Tab */}
          <TabsContent value="pricing-strategy" className="space-y-6">
            {/* Pricing Philosophy */}
            <Card>
              <CardHeader>
                <CardTitle>Global Pricing Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Strategy Principles</h4>
                    <ul className="space-y-2">
                      {pricingStrategy.globalStrategy.principles.map(
                        (principle, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm">{principle}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Key Factors</h4>
                    <ul className="space-y-2">
                      {pricingStrategy.globalStrategy.factors.map(
                        (factor, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">{factor}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Pricing Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">
                    African Market Pricing
                  </CardTitle>
                  <Badge variant="outline">
                    {pricingStrategy.regionalPricing.africa.strategy}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Base Price:{" "}
                        <span className="font-semibold">
                          {formatCurrency(
                            pricingStrategy.regionalPricing.africa.basePrice,
                          )}
                          /month
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Freemium Available:{" "}
                        <span className="font-semibold">
                          {pricingStrategy.regionalPricing.africa.freemiumTier
                            ? "Yes"
                            : "No"}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      {pricingStrategy.regionalPricing.africa.pricingTiers.map(
                        (tier, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-semibold">{tier.name}</h5>
                              <span className="text-lg font-bold text-orange-600">
                                {formatCurrency(tier.price)}
                              </span>
                            </div>
                            <ul className="text-xs space-y-1">
                              {tier.features.map((feature, fIndex) => (
                                <li
                                  key={fIndex}
                                  className="flex items-center space-x-1"
                                >
                                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ),
                      )}
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2">Payment Methods</h5>
                      <div className="flex flex-wrap gap-2">
                        {pricingStrategy.regionalPricing.africa.paymentMethods.map(
                          (method, index) => (
                            <Badge key={index} variant="secondary">
                              {method}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">
                    Global Market Pricing
                  </CardTitle>
                  <Badge variant="outline">
                    {pricingStrategy.regionalPricing.global.strategy}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Base Price:{" "}
                        <span className="font-semibold">
                          {formatCurrency(
                            pricingStrategy.regionalPricing.global.basePrice,
                          )}
                          /month
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Freemium Available:{" "}
                        <span className="font-semibold">
                          {pricingStrategy.regionalPricing.global.freemiumTier
                            ? "Yes"
                            : "No"}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      {pricingStrategy.regionalPricing.global.pricingTiers.map(
                        (tier, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-semibold">{tier.name}</h5>
                              <span className="text-lg font-bold text-blue-600">
                                {formatCurrency(tier.price)}
                              </span>
                            </div>
                            <ul className="text-xs space-y-1">
                              {tier.features.map((feature, fIndex) => (
                                <li
                                  key={fIndex}
                                  className="flex items-center space-x-1"
                                >
                                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ),
                      )}
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2">Payment Methods</h5>
                      <div className="flex flex-wrap gap-2">
                        {pricingStrategy.regionalPricing.global.paymentMethods.map(
                          (method, index) => (
                            <Badge key={index} variant="secondary">
                              {method}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Projections */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={revenueProjectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [
                        `$${value.toFixed(1)}M`,
                        "",
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="africa"
                      stackId="1"
                      stroke="#FF6B35"
                      fill="#FF6B35"
                      fillOpacity={0.6}
                      name="Africa Revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="global"
                      stackId="1"
                      stroke="#2196F3"
                      fill="#2196F3"
                      fillOpacity={0.6}
                      name="Global Revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RevOps Tab */}
          <TabsContent value="revops" className="space-y-6">
            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(revOpsMetrics.overview.totalRevenue)}
                  </div>
                  <p className="text-xs text-green-600">
                    +{formatPercentage(revOpsMetrics.overview.growthRate)} YoY
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Customer Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatLargeNumber(revOpsMetrics.overview.customerCount)}
                  </div>
                  <p className="text-xs text-gray-500">
                    ARPU: {formatCurrency(revOpsMetrics.overview.averageARPU)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">LTV:CAC Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {revOpsMetrics.overview.ltvCacRatio.toFixed(1)}:1
                  </div>
                  <p className="text-xs text-gray-500">
                    LTV: {formatCurrency(revOpsMetrics.overview.ltv)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Gross Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPercentage(revOpsMetrics.overview.grossMargin)}
                  </div>
                  <p className="text-xs text-gray-500">
                    Churn: {formatPercentage(revOpsMetrics.overview.churnRate)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Regional Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Revenue Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={revOpsRegionalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="revenue"
                      fill="#FF6B35"
                      name="Revenue ($M)"
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="customers"
                      fill="#4CAF50"
                      name="Customers (K)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="growth"
                      stroke="#2196F3"
                      name="Growth Rate (%)"
                      strokeWidth={3}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pipeline Value</span>
                    <span className="font-semibold">
                      {formatCurrency(revOpsMetrics.salesMetrics.pipelineValue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-semibold">
                      {formatPercentage(
                        revOpsMetrics.salesMetrics.conversionRate,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Deal Size</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        revOpsMetrics.salesMetrics.averageDealSize,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sales Cycle</span>
                    <span className="font-semibold">
                      {revOpsMetrics.salesMetrics.salesCycleLength} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quota Attainment</span>
                    <span className="font-semibold text-green-600">
                      {formatPercentage(
                        revOpsMetrics.salesMetrics.quotaAttainment,
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">New MRR</span>
                      <span className="text-green-600">
                        {formatCurrency(revOpsMetrics.salesMetrics.newMRR)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Expansion MRR</span>
                      <span className="text-blue-600">
                        {formatCurrency(
                          revOpsMetrics.salesMetrics.expansionMRR,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Churn MRR</span>
                      <span className="text-red-600">
                        -{formatCurrency(revOpsMetrics.salesMetrics.churnMRR)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-sm">Net MRR</span>
                      <span className="text-green-600">
                        {formatCurrency(revOpsMetrics.salesMetrics.netMRR)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Success Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Success</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Net Promoter Score</span>
                    <span className="font-semibold text-green-600">
                      {revOpsMetrics.customerSuccess.nps}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-semibold">
                      {revOpsMetrics.customerSuccess.csat}/10
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time to First Value</span>
                    <span className="font-semibold">
                      {revOpsMetrics.customerSuccess.firstValueTime} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Activation Rate</span>
                    <span className="font-semibold">
                      {formatPercentage(
                        revOpsMetrics.customerSuccess.activationRate,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Feature Adoption</span>
                    <span className="font-semibold">
                      {formatPercentage(
                        revOpsMetrics.customerSuccess.featureAdoption,
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Support Tickets</span>
                      <span>
                        {revOpsMetrics.customerSuccess.supportTickets}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Resolution Time</span>
                      <span>
                        {revOpsMetrics.customerSuccess.resolutionTime}h avg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Escalation Rate</span>
                      <span>
                        {formatPercentage(
                          revOpsMetrics.customerSuccess.escalationRate,
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Forecasting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Revenue Forecasting</span>
                  <Badge variant="outline">
                    {formatPercentage(
                      revOpsMetrics.forecasting.confidenceLevel,
                    )}{" "}
                    Confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">
                      Next Quarter Forecast
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-semibold">
                          {formatCurrency(
                            revOpsMetrics.forecasting.nextQuarter.revenue,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customers:</span>
                        <span className="font-semibold">
                          {formatLargeNumber(
                            revOpsMetrics.forecasting.nextQuarter.customers,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Growth:</span>
                        <span className="font-semibold text-green-600">
                          {formatPercentage(
                            revOpsMetrics.forecasting.nextQuarter.growthRate,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Next Year Forecast</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-semibold">
                          {formatCurrency(
                            revOpsMetrics.forecasting.nextYear.revenue,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customers:</span>
                        <span className="font-semibold">
                          {formatLargeNumber(
                            revOpsMetrics.forecasting.nextYear.customers,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Growth:</span>
                        <span className="font-semibold text-green-600">
                          {formatPercentage(
                            revOpsMetrics.forecasting.nextYear.growthRate,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span>Risk Factors</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {revOpsMetrics.forecasting.riskFactors.map(
                      (risk, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">{risk}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AfricanMarketEnterprise;
