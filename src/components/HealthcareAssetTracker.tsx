import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Heart,
  Globe,
  Users,
  Building,
  Activity,
  DollarSign,
  Percent,
  Calendar,
} from "lucide-react";
import { type PortfolioHealthcareAsset } from "../services/healthcareTokenizationService";
import { themeService } from "../services/themeService";

interface HealthcareAssetTrackerProps {
  assets: PortfolioHealthcareAsset[];
  showDetails?: boolean;
  language?: string;
  compact?: boolean;
}

export const HealthcareAssetTracker: React.FC<HealthcareAssetTrackerProps> = ({
  assets,
  showDetails = true,
  language = "en",
  compact = false,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "24h" | "7d" | "30d"
  >("7d");
  const [activeTab, setActiveTab] = useState("performance");

  const shouldUseSimplifiedCharts = themeService.shouldUseSimplifiedCharts();
  const themeTokens = themeService.getThemeTokens();

  // Chart data processing
  const chartData = useMemo(() => {
    if (assets.length === 0) return [];

    // Generate mock historical data for demonstration
    const timeframes = {
      "24h": 24,
      "7d": 7,
      "30d": 30,
    };

    const hours = timeframes[selectedTimeframe];
    const data = [];

    for (let i = hours; i >= 0; i--) {
      const timestamp =
        Date.now() -
        i *
          (selectedTimeframe === "24h" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000);
      const dataPoint: any = {
        timestamp,
        date: new Date(timestamp).toLocaleDateString("en", {
          month: "short",
          day: "numeric",
          ...(selectedTimeframe === "24h" ? { hour: "2-digit" } : {}),
        }),
      };

      // Add each asset's value over time
      assets.forEach((asset) => {
        const baseValue = asset.holdingAmount * asset.entryPrice;
        const volatility =
          asset.riskLevel === "high"
            ? 0.1
            : asset.riskLevel === "medium"
              ? 0.05
              : 0.02;
        const randomChange = (Math.random() - 0.5) * volatility;
        dataPoint[asset.tokenSymbol] =
          baseValue * (1 + randomChange + asset.roi30d / 100);
      });

      data.push(dataPoint);
    }

    return data;
  }, [assets, selectedTimeframe]);

  // Portfolio composition data
  const compositionData = useMemo(() => {
    return assets.map((asset) => ({
      name: asset.tokenSymbol,
      value: asset.percentageOfPortfolio,
      color:
        asset.riskLevel === "high"
          ? "#ef4444"
          : asset.riskLevel === "medium"
            ? "#f59e0b"
            : "#10b981",
    }));
  }, [assets]);

  // Geographic distribution
  const geographicData = useMemo(() => {
    const geoMap = new Map<string, number>();
    assets.forEach((asset) => {
      const current = geoMap.get(asset.geography) || 0;
      geoMap.set(asset.geography, current + asset.percentageOfPortfolio);
    });

    return Array.from(geoMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [assets]);

  // Impact metrics aggregation
  const impactMetrics = useMemo(() => {
    return assets.reduce(
      (acc, asset) => {
        const weight = asset.percentageOfPortfolio / 100;
        return {
          totalPatientsServed:
            acc.totalPatientsServed +
            asset.impactMetrics.patientsServed * weight,
          totalFacilitiesSupported:
            acc.totalFacilitiesSupported +
            asset.impactMetrics.facilitiesSupported * weight,
          totalTreatmentsProvided:
            acc.totalTreatmentsProvided +
            asset.impactMetrics.treatmentsProvided * weight,
          averageAccessibilityImprovement:
            acc.averageAccessibilityImprovement +
            asset.impactMetrics.accessibilityImprovement * weight,
        };
      },
      {
        totalPatientsServed: 0,
        totalFacilitiesSupported: 0,
        totalTreatmentsProvided: 0,
        averageAccessibilityImprovement: 0,
      },
    );
  }, [assets]);

  // Performance summary
  const performanceSummary = useMemo(() => {
    const totalValue = assets.reduce(
      (sum, asset) => sum + asset.holdingAmount * asset.currentPrice,
      0,
    );
    const totalInvestment = assets.reduce(
      (sum, asset) => sum + asset.investmentValue,
      0,
    );
    const totalUnrealizedGains = totalValue - totalInvestment;
    const totalROI =
      totalInvestment > 0 ? (totalUnrealizedGains / totalInvestment) * 100 : 0;

    const bestPerformer = assets.reduce(
      (best, asset) =>
        asset.roi30d > (best?.roi30d || -Infinity) ? asset : best,
      null,
    );

    const worstPerformer = assets.reduce(
      (worst, asset) =>
        asset.roi30d < (worst?.roi30d || Infinity) ? asset : worst,
      null,
    );

    return {
      totalValue,
      totalInvestment,
      totalUnrealizedGains,
      totalROI,
      bestPerformer,
      worstPerformer,
    };
  }, [assets]);

  if (assets.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          No Healthcare Investments Yet
        </h3>
        <p className="text-muted-foreground">
          Start investing in tokenized healthcare assets to see your portfolio
          performance here.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Simple Performance Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.slice(-7)}>
              <Line
                type="monotone"
                dataKey={assets[0]?.tokenSymbol}
                stroke={themeTokens.colors.primary}
                strokeWidth={2}
                dot={false}
              />
              <Tooltip
                formatter={(value: any) => [`$${value?.toFixed(2)}`, "Value"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Value:</span>
            <div className="font-semibold">
              ${performanceSummary.totalValue.toFixed(2)}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Total ROI:</span>
            <div
              className={`font-semibold ${performanceSummary.totalROI >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {performanceSummary.totalROI >= 0 ? "+" : ""}
              {performanceSummary.totalROI.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">
                  ${performanceSummary.totalValue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total ROI</p>
                <p
                  className={`text-2xl font-bold ${performanceSummary.totalROI >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {performanceSummary.totalROI >= 0 ? "+" : ""}
                  {performanceSummary.totalROI.toFixed(2)}%
                </p>
              </div>
              {performanceSummary.totalROI >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Patients Served</p>
                <p className="text-2xl font-bold">
                  {Math.round(impactMetrics.totalPatientsServed / 1000)}K
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Facilities</p>
                <p className="text-2xl font-bold">
                  {Math.round(impactMetrics.totalFacilitiesSupported)}
                </p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="composition">Composition</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
          </TabsList>

          {activeTab === "performance" && (
            <div className="flex gap-2">
              {(["24h", "7d", "30d"] as const).map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={
                    selectedTimeframe === timeframe ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance Over Time</CardTitle>
              <CardDescription>
                Track your healthcare investment performance across different
                timeframes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {shouldUseSimplifiedCharts ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any, name: string) => [
                          `$${value?.toFixed(2)}`,
                          name,
                        ]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      {assets.slice(0, 3).map((asset, index) => (
                        <Line
                          key={asset.id}
                          type="monotone"
                          dataKey={asset.tokenSymbol}
                          stroke={`hsl(${index * 120}, 60%, 50%)`}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  ) : (
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any, name: string) => [
                          `$${value?.toFixed(2)}`,
                          name,
                        ]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      {assets.map((asset, index) => (
                        <Area
                          key={asset.id}
                          type="monotone"
                          dataKey={asset.tokenSymbol}
                          stackId="1"
                          stroke={`hsl(${index * 60}, 60%, 50%)`}
                          fill={`hsl(${index * 60}, 60%, 50%)`}
                          fillOpacity={0.3}
                        />
                      ))}
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="composition">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Allocation</CardTitle>
                <CardDescription>
                  Distribution of your healthcare investments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={compositionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) =>
                          `${name} ${value.toFixed(1)}%`
                        }
                      >
                        {compositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [
                          `${value.toFixed(1)}%`,
                          "Allocation",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Individual Asset Performance</CardTitle>
                <CardDescription>30-day ROI by asset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${
                            asset.riskLevel === "high"
                              ? "bg-red-100 text-red-800"
                              : asset.riskLevel === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {asset.tokenSymbol}
                        </Badge>
                        <span className="text-sm font-medium">
                          {asset.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-semibold ${asset.roi30d >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {asset.roi30d >= 0 ? "+" : ""}
                          {asset.roi30d.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          $
                          {(asset.holdingAmount * asset.currentPrice).toFixed(
                            2,
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="impact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Social Impact Metrics
                </CardTitle>
                <CardDescription>
                  The real-world impact of your healthcare investments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {Math.round(
                        impactMetrics.totalPatientsServed,
                      ).toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Patients Served
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.round(impactMetrics.totalFacilitiesSupported)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Facilities Supported
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {Math.round(
                        impactMetrics.totalTreatmentsProvided,
                      ).toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Treatments Provided
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {Math.round(
                        impactMetrics.averageAccessibilityImprovement,
                      )}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Access Improvement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact by Asset</CardTitle>
                <CardDescription>
                  Patient reach by healthcare investment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={assets.map((asset) => ({
                        name: asset.tokenSymbol,
                        patients:
                          asset.impactMetrics.patientsServed *
                          (asset.percentageOfPortfolio / 100),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => [
                          Math.round(value),
                          "Patients",
                        ]}
                      />
                      <Bar
                        dataKey="patients"
                        fill={themeTokens.colors.primary}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                Geographic Distribution
              </CardTitle>
              <CardDescription>
                Your healthcare investment distribution across regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={geographicData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) =>
                          `${name} ${value.toFixed(1)}%`
                        }
                      >
                        {geographicData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(${index * 100}, 60%, 50%)`}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [
                          `${value.toFixed(1)}%`,
                          "Allocation",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Regional Breakdown</h4>
                  {geographicData.map((region, index) => (
                    <div
                      key={region.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: `hsl(${index * 100}, 60%, 50%)`,
                          }}
                        />
                        <span className="font-medium">{region.name}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {region.value.toFixed(1)}%
                      </span>
                    </div>
                  ))}

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-2">
                      Geographic Diversification Benefits
                    </h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Reduced regional healthcare policy risk</li>
                      <li>• Exposure to different market growth rates</li>
                      <li>• Currency diversification effects</li>
                      <li>• Broader social impact reach</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
