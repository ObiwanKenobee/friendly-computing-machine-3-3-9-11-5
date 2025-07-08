import React, { useState, useEffect } from "react";
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
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { multiRegionService } from "../services/multiRegionService";
import { localizationService } from "../services/localizationService";
import { regionalComplianceService } from "../services/regionalComplianceService";
import { multiCurrencyService } from "../services/multiCurrencyService";
import { culturalAdaptationService } from "../services/culturalAdaptationService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import {
  Globe,
  DollarSign,
  Users,
  TrendingUp,
  Shield,
  Languages,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Heart,
  Star,
} from "lucide-react";

interface RegionData {
  id: string;
  name: string;
  status: "active" | "expanding" | "planning" | "launched";
  users: number;
  revenue: number;
  growth: number;
  compliance: number;
  localization: number;
  currencies: string[];
  languages: string[];
  launchDate: Date;
}

interface LocalizationProgress {
  language: string;
  region: string;
  progress: number;
  totalStrings: number;
  translatedStrings: number;
  reviewedStrings: number;
  status: "pending" | "in_progress" | "review" | "completed";
}

export default function GlobalExpansionDashboard() {
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [localizationProgress, setLocalizationProgress] = useState<
    LocalizationProgress[]
  >([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadGlobalExpansionData();
  }, []);

  const loadGlobalExpansionData = async () => {
    setLoading(true);
    try {
      // Load multi-region data
      const regionsData = await multiRegionService.getRegions();
      setRegions(regionsData);

      // Load localization progress
      const localization = await localizationService.getLocalizationProgress();
      setLocalizationProgress(localization);

      if (regionsData.length > 0) {
        setSelectedRegion(regionsData[0].id);
      }
    } catch (error) {
      console.error("Failed to load global expansion data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRegionStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "expanding":
        return "text-blue-600";
      case "planning":
        return "text-yellow-600";
      case "launched":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getRegionStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "expanding":
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case "planning":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "launched":
        return <Star className="h-4 w-4 text-purple-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  const globalMetrics = {
    totalRegions: regions.length,
    activeRegions: regions.filter((r) => r.status === "active").length,
    totalUsers: regions.reduce((sum, r) => sum + r.users, 0),
    totalRevenue: regions.reduce((sum, r) => sum + r.revenue, 0),
    averageGrowth:
      regions.reduce((sum, r) => sum + r.growth, 0) / regions.length || 0,
    averageCompliance:
      regions.reduce((sum, r) => sum + r.compliance, 0) / regions.length || 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading global expansion data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Global Expansion Dashboard
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Monitor and manage global expansion across regions with real-time
            metrics, localization progress, and compliance tracking.
          </p>
        </div>

        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Regions
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {globalMetrics.totalRegions}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <Badge variant="outline">
                  {globalMetrics.activeRegions} Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Global Users
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {(globalMetrics.totalUsers / 1000).toFixed(1)}K
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">
                  +{globalMetrics.averageGrowth.toFixed(1)}% growth
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Global Revenue
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${(globalMetrics.totalRevenue / 1000000).toFixed(1)}M
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-2">
                <Progress value={75} className="w-full h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Compliance Score
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {globalMetrics.averageCompliance.toFixed(0)}%
                  </p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-2">
                {globalMetrics.averageCompliance >= 90 ? (
                  <Badge className="bg-green-100 text-green-800">
                    Excellent
                  </Badge>
                ) : globalMetrics.averageCompliance >= 70 ? (
                  <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">
                    Needs Attention
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Regional Overview</TabsTrigger>
            <TabsTrigger value="localization">Localization</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="currencies">Multi-Currency</TabsTrigger>
            <TabsTrigger value="cultural">Cultural Adaptation</TabsTrigger>
          </TabsList>

          {/* Regional Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Regional Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart className="h-5 w-5" />
                    <span>Regional Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={regions}>
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
                        dataKey="users"
                        fill="#3B82F6"
                        name="Users (K)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="growth"
                        stroke="#10B981"
                        name="Growth %"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={regions}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) =>
                          `${name}: $${(value / 1000000).toFixed(1)}M`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {regions.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [
                          `$${(value / 1000000).toFixed(1)}M`,
                          "Revenue",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Regional Details Table */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regions.map((region) => (
                    <div
                      key={region.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getRegionStatusIcon(region.status)}
                            <h3 className="font-semibold">{region.name}</h3>
                          </div>
                          <Badge
                            variant="outline"
                            className={getRegionStatusColor(region.status)}
                          >
                            {region.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div>
                            <span className="text-gray-600">Users: </span>
                            <span className="font-medium">
                              {region.users.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Revenue: </span>
                            <span className="font-medium">
                              ${(region.revenue / 1000000).toFixed(1)}M
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Growth: </span>
                            <span className="font-medium text-green-600">
                              +{region.growth}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            Compliance Score
                          </p>
                          <Progress
                            value={region.compliance}
                            className="mt-1"
                          />
                          <span className="text-xs text-gray-500">
                            {region.compliance}%
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Localization</p>
                          <Progress
                            value={region.localization}
                            className="mt-1"
                          />
                          <span className="text-xs text-gray-500">
                            {region.localization}%
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Supported</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              {region.currencies.length} currencies
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {region.languages.length} languages
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Localization Tab */}
          <TabsContent value="localization" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Languages className="h-5 w-5" />
                    <span>Localization Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {localizationProgress.map((item, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{item.language}</span>
                            <Badge variant="outline">{item.region}</Badge>
                          </div>
                          <Badge
                            variant={
                              item.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <Progress value={item.progress} className="mb-2" />
                        <div className="text-sm text-gray-600">
                          {item.translatedStrings} / {item.totalStrings} strings
                          translated ({item.progress.toFixed(1)}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Translation Velocity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={[
                        {
                          month: "Jan",
                          completed: 1200,
                          inProgress: 800,
                          pending: 400,
                        },
                        {
                          month: "Feb",
                          completed: 1800,
                          inProgress: 900,
                          pending: 300,
                        },
                        {
                          month: "Mar",
                          completed: 2400,
                          inProgress: 700,
                          pending: 200,
                        },
                        {
                          month: "Apr",
                          completed: 3100,
                          inProgress: 600,
                          pending: 150,
                        },
                        {
                          month: "May",
                          completed: 3800,
                          inProgress: 500,
                          pending: 100,
                        },
                        {
                          month: "Jun",
                          completed: 4500,
                          inProgress: 400,
                          pending: 80,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stackId="1"
                        stroke="#10B981"
                        fill="#10B981"
                      />
                      <Area
                        type="monotone"
                        dataKey="inProgress"
                        stackId="1"
                        stroke="#F59E0B"
                        fill="#F59E0B"
                      />
                      <Area
                        type="monotone"
                        dataKey="pending"
                        stackId="1"
                        stroke="#EF4444"
                        fill="#EF4444"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Language Support Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Language Support Matrix</CardTitle>
                <CardDescription>
                  Track language coverage across different regions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Language</th>
                        <th className="text-left p-2">Region</th>
                        <th className="text-left p-2">Progress</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Est. Completion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localizationProgress.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{item.language}</td>
                          <td className="p-2">{item.region}</td>
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={item.progress}
                                className="w-24"
                              />
                              <span>{item.progress.toFixed(0)}%</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge
                              variant={
                                item.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-gray-600">
                            {item.status === "completed"
                              ? "Completed"
                              : "2-3 weeks"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Regional Compliance Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={regions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="compliance" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>GDPR Update Required:</strong> EU region needs
                        privacy policy updates for new AI features.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>SOX Compliance:</strong> All US financial
                        reporting requirements are met.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        <strong>LGPD Brazil:</strong> Data retention policies
                        under review, completion expected in 2 weeks.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Timeline</CardTitle>
                <CardDescription>
                  Track regulatory compliance milestones across regions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { month: "Jan", GDPR: 95, SOX: 98, LGPD: 75, PDPA: 82 },
                      { month: "Feb", GDPR: 97, SOX: 99, LGPD: 78, PDPA: 85 },
                      { month: "Mar", GDPR: 96, SOX: 97, LGPD: 82, PDPA: 88 },
                      { month: "Apr", GDPR: 98, SOX: 99, LGPD: 85, PDPA: 90 },
                      { month: "May", GDPR: 99, SOX: 98, LGPD: 89, PDPA: 92 },
                      { month: "Jun", GDPR: 98, SOX: 99, LGPD: 92, PDPA: 94 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[70, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="GDPR"
                      stroke="#3B82F6"
                      name="GDPR (EU)"
                    />
                    <Line
                      type="monotone"
                      dataKey="SOX"
                      stroke="#10B981"
                      name="SOX (US)"
                    />
                    <Line
                      type="monotone"
                      dataKey="LGPD"
                      stroke="#F59E0B"
                      name="LGPD (Brazil)"
                    />
                    <Line
                      type="monotone"
                      dataKey="PDPA"
                      stroke="#EF4444"
                      name="PDPA (Singapore)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Multi-Currency Tab */}
          <TabsContent value="currencies" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Currency Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        currency: "USD",
                        amount: 2800000,
                        change: 2.3,
                        transactions: 15420,
                      },
                      {
                        currency: "EUR",
                        amount: 1950000,
                        change: -1.2,
                        transactions: 8760,
                      },
                      {
                        currency: "GBP",
                        amount: 890000,
                        change: 0.8,
                        transactions: 4230,
                      },
                      {
                        currency: "NGN",
                        amount: 650000,
                        change: 15.2,
                        transactions: 12890,
                      },
                      {
                        currency: "ZAR",
                        amount: 420000,
                        change: 8.7,
                        transactions: 5670,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">
                              {item.currency}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              ${item.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.transactions.toLocaleString()} transactions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {item.change >= 0 ? "+" : ""}
                            {item.change}%
                          </p>
                          <p className="text-sm text-gray-600">24h change</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exchange Rate Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={[
                        {
                          day: "Mon",
                          USD: 1.0,
                          EUR: 0.85,
                          GBP: 0.73,
                          NGN: 0.0024,
                          ZAR: 0.055,
                        },
                        {
                          day: "Tue",
                          USD: 1.0,
                          EUR: 0.84,
                          GBP: 0.74,
                          NGN: 0.0025,
                          ZAR: 0.056,
                        },
                        {
                          day: "Wed",
                          USD: 1.0,
                          EUR: 0.86,
                          GBP: 0.73,
                          NGN: 0.0024,
                          ZAR: 0.054,
                        },
                        {
                          day: "Thu",
                          USD: 1.0,
                          EUR: 0.85,
                          GBP: 0.75,
                          NGN: 0.0025,
                          ZAR: 0.057,
                        },
                        {
                          day: "Fri",
                          USD: 1.0,
                          EUR: 0.87,
                          GBP: 0.74,
                          NGN: 0.0026,
                          ZAR: 0.058,
                        },
                        {
                          day: "Sat",
                          USD: 1.0,
                          EUR: 0.86,
                          GBP: 0.73,
                          NGN: 0.0025,
                          ZAR: 0.056,
                        },
                        {
                          day: "Sun",
                          USD: 1.0,
                          EUR: 0.85,
                          GBP: 0.74,
                          NGN: 0.0024,
                          ZAR: 0.057,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="EUR"
                        stroke="#3B82F6"
                        name="EUR/USD"
                      />
                      <Line
                        type="monotone"
                        dataKey="GBP"
                        stroke="#10B981"
                        name="GBP/USD"
                      />
                      <Line
                        type="monotone"
                        dataKey="NGN"
                        stroke="#F59E0B"
                        name="NGN/USD"
                      />
                      <Line
                        type="monotone"
                        dataKey="ZAR"
                        stroke="#EF4444"
                        name="ZAR/USD"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cultural Adaptation Tab */}
          <TabsContent value="cultural" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Cultural Adaptation Engine</span>
                </CardTitle>
                <CardDescription>
                  AI-powered cultural customization for different markets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      region: "Nigeria",
                      culture: "West African",
                      score: 92,
                      features: [
                        "Islamic Banking",
                        "Community Investing",
                        "Mobile Money",
                      ],
                    },
                    {
                      region: "South Africa",
                      culture: "Southern African",
                      score: 88,
                      features: [
                        "Multi-cultural UI",
                        "Ubuntu Philosophy",
                        "Local Exchanges",
                      ],
                    },
                    {
                      region: "Kenya",
                      culture: "East African",
                      score: 85,
                      features: [
                        "M-Pesa Integration",
                        "Tribal Funds",
                        "Agricultural Investing",
                      ],
                    },
                    {
                      region: "Morocco",
                      culture: "North African",
                      score: 79,
                      features: [
                        "Arabic Support",
                        "Halal Investing",
                        "French Integration",
                      ],
                    },
                    {
                      region: "Ghana",
                      culture: "West African",
                      score: 91,
                      features: [
                        "Akan Traditions",
                        "Gold Investment",
                        "Diaspora Focus",
                      ],
                    },
                    {
                      region: "Egypt",
                      culture: "North African",
                      score: 83,
                      features: [
                        "Islamic Finance",
                        "Pharaonic Themes",
                        "Suez Canal Trade",
                      ],
                    },
                  ].map((item, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{item.region}</h3>
                          <Badge variant="outline">{item.score}%</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {item.culture}
                        </p>
                        <div className="space-y-1">
                          {item.features.map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-center space-x-2"
                            >
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="text-xs">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Progress value={item.score} className="mt-3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
