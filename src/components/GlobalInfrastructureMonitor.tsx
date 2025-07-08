import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Zap,
  Database,
  Network,
  Shield,
  Users,
  TrendingUp,
  Activity,
  MapPin,
  Wifi,
  Server,
  Cloud,
  HardDrive,
  Cpu,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Layers,
  GitBranch,
  Settings,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  Radar,
  Target,
  Compass,
  Satellite,
  Radio,
  Bluetooth,
  Router,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
} from "lucide-react";

interface DataCenter {
  id: string;
  name: string;
  location: string;
  country: string;
  coordinates: [number, number];
  status: "online" | "maintenance" | "offline";
  load: number;
  capacity: number;
  latency: number;
  uptime: number;
  connections: number;
  region: string;
}

interface GlobalMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  status: "good" | "warning" | "critical";
}

const GlobalInfrastructureMonitor: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState("global");
  const [timeframe, setTimeframe] = useState("24h");
  const [viewMode, setViewMode] = useState("overview");

  const [dataCenters, setDataCenters] = useState<DataCenter[]>([
    {
      id: "us-east-1",
      name: "Virginia Prime",
      location: "Virginia, USA",
      country: "US",
      coordinates: [-77.4, 39.0],
      status: "online",
      load: 67,
      capacity: 100,
      latency: 12,
      uptime: 99.98,
      connections: 23847,
      region: "North America",
    },
    {
      id: "us-west-1",
      name: "California Hub",
      location: "California, USA",
      country: "US",
      coordinates: [-121.9, 37.4],
      status: "online",
      load: 82,
      capacity: 100,
      latency: 8,
      uptime: 99.95,
      connections: 18923,
      region: "North America",
    },
    {
      id: "eu-west-1",
      name: "Ireland Core",
      location: "Dublin, Ireland",
      country: "IE",
      coordinates: [-6.3, 53.3],
      status: "online",
      load: 74,
      capacity: 100,
      latency: 15,
      uptime: 99.97,
      connections: 15632,
      region: "Europe",
    },
    {
      id: "eu-central-1",
      name: "Frankfurt Center",
      location: "Frankfurt, Germany",
      country: "DE",
      coordinates: [8.7, 50.1],
      status: "online",
      load: 91,
      capacity: 100,
      latency: 11,
      uptime: 99.96,
      connections: 21456,
      region: "Europe",
    },
    {
      id: "ap-southeast-1",
      name: "Singapore Node",
      location: "Singapore",
      country: "SG",
      coordinates: [103.8, 1.3],
      status: "online",
      load: 56,
      capacity: 100,
      latency: 22,
      uptime: 99.94,
      connections: 19847,
      region: "Asia Pacific",
    },
    {
      id: "ap-northeast-1",
      name: "Tokyo Station",
      location: "Tokyo, Japan",
      country: "JP",
      coordinates: [139.7, 35.7],
      status: "online",
      load: 78,
      capacity: 100,
      latency: 9,
      uptime: 99.99,
      connections: 17234,
      region: "Asia Pacific",
    },
    {
      id: "ap-south-1",
      name: "Mumbai Gateway",
      location: "Mumbai, India",
      country: "IN",
      coordinates: [72.8, 19.1],
      status: "online",
      load: 69,
      capacity: 100,
      latency: 28,
      uptime: 99.92,
      connections: 14567,
      region: "Asia Pacific",
    },
    {
      id: "sa-east-1",
      name: "São Paulo Base",
      location: "São Paulo, Brazil",
      country: "BR",
      coordinates: [-46.6, -23.5],
      status: "maintenance",
      load: 0,
      capacity: 100,
      latency: 0,
      uptime: 99.89,
      connections: 0,
      region: "South America",
    },
    {
      id: "af-south-1",
      name: "Cape Town Link",
      location: "Cape Town, South Africa",
      country: "ZA",
      coordinates: [18.4, -33.9],
      status: "online",
      load: 45,
      capacity: 100,
      latency: 34,
      uptime: 99.91,
      connections: 8934,
      region: "Africa",
    },
    {
      id: "me-south-1",
      name: "Bahrain Hub",
      location: "Manama, Bahrain",
      country: "BH",
      coordinates: [50.6, 26.2],
      status: "online",
      load: 63,
      capacity: 100,
      latency: 19,
      uptime: 99.93,
      connections: 12345,
      region: "Middle East",
    },
  ]);

  const [globalMetrics, setGlobalMetrics] = useState<GlobalMetric[]>([
    {
      id: "total-requests",
      name: "Total Requests/min",
      value: 2847293,
      unit: "",
      change: +12.4,
      status: "good",
    },
    {
      id: "avg-latency",
      name: "Global Avg Latency",
      value: 23.7,
      unit: "ms",
      change: -2.1,
      status: "good",
    },
    {
      id: "data-transfer",
      name: "Data Transfer",
      value: 847.2,
      unit: "GB/min",
      change: +8.9,
      status: "good",
    },
    {
      id: "active-connections",
      name: "Active Connections",
      value: 156742,
      unit: "",
      change: +15.2,
      status: "good",
    },
    {
      id: "error-rate",
      name: "Error Rate",
      value: 0.023,
      unit: "%",
      change: -0.8,
      status: "good",
    },
    {
      id: "uptime",
      name: "Global Uptime",
      value: 99.97,
      unit: "%",
      change: +0.01,
      status: "good",
    },
  ]);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDataCenters((prev) =>
        prev.map((dc) => ({
          ...dc,
          load:
            dc.status === "online"
              ? Math.max(10, Math.min(95, dc.load + (Math.random() - 0.5) * 10))
              : 0,
          latency:
            dc.status === "online"
              ? Math.max(5, dc.latency + (Math.random() - 0.5) * 5)
              : 0,
          connections:
            dc.status === "online"
              ? Math.max(
                  1000,
                  dc.connections + Math.floor((Math.random() - 0.5) * 2000),
                )
              : 0,
        })),
      );

      setGlobalMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Math.max(
            0,
            metric.value + metric.value * (Math.random() - 0.5) * 0.05,
          ),
          change: (Math.random() - 0.5) * 20,
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const regions = [
    { id: "global", name: "Global Overview", count: dataCenters.length },
    {
      id: "north-america",
      name: "North America",
      count: dataCenters.filter((dc) => dc.region === "North America").length,
    },
    {
      id: "europe",
      name: "Europe",
      count: dataCenters.filter((dc) => dc.region === "Europe").length,
    },
    {
      id: "asia-pacific",
      name: "Asia Pacific",
      count: dataCenters.filter((dc) => dc.region === "Asia Pacific").length,
    },
    {
      id: "south-america",
      name: "South America",
      count: dataCenters.filter((dc) => dc.region === "South America").length,
    },
    {
      id: "africa",
      name: "Africa",
      count: dataCenters.filter((dc) => dc.region === "Africa").length,
    },
    {
      id: "middle-east",
      name: "Middle East",
      count: dataCenters.filter((dc) => dc.region === "Middle East").length,
    },
  ];

  const filteredDataCenters = useMemo(() => {
    if (selectedRegion === "global") return dataCenters;
    const regionName = regions.find((r) => r.id === selectedRegion)?.name;
    return dataCenters.filter((dc) => dc.region === regionName);
  }, [selectedRegion, dataCenters]);

  const globalStats = useMemo(() => {
    const online = dataCenters.filter((dc) => dc.status === "online").length;
    const totalLoad = dataCenters.reduce((sum, dc) => sum + dc.load, 0);
    const avgLoad = totalLoad / dataCenters.length;
    const totalConnections = dataCenters.reduce(
      (sum, dc) => sum + dc.connections,
      0,
    );
    const avgLatency =
      dataCenters
        .filter((dc) => dc.status === "online")
        .reduce((sum, dc) => sum + dc.latency, 0) / online;

    return {
      online,
      total: dataCenters.length,
      avgLoad,
      totalConnections,
      avgLatency,
      health: (online / dataCenters.length) * 100,
    };
  }, [dataCenters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "maintenance":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "offline":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4" />;
      case "maintenance":
        return <AlertTriangle className="w-4 h-4" />;
      case "offline":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Global Infrastructure Monitor
                </h1>
                <p className="text-blue-200">
                  Real-time worldwide infrastructure monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                className={`${
                  globalStats.health > 95
                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                    : globalStats.health > 90
                      ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                      : "bg-red-500/20 text-red-300 border-red-500/30"
                }`}
              >
                Global Health: {globalStats.health.toFixed(1)}%
              </Badge>
              <div className="text-right">
                <p className="text-sm text-blue-200">Data Centers Online</p>
                <p className="text-xl font-bold text-white">
                  {globalStats.online}/{globalStats.total}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs
          value={viewMode}
          onValueChange={setViewMode}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-4 bg-black/20 border border-white/10">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-600"
            >
              Global Overview
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-green-600"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="network"
              className="data-[state=active]:bg-purple-600"
            >
              Network Topology
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-orange-600"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Global Metrics */}
            <div className="grid lg:grid-cols-6 gap-4">
              {globalMetrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-black/40 border-white/10">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <p className="text-blue-200 text-sm">{metric.name}</p>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-white">
                            {metric.value.toLocaleString(undefined, {
                              maximumFractionDigits:
                                metric.unit === "ms" || metric.unit === "%"
                                  ? 1
                                  : 0,
                            })}
                          </span>
                          <span className="text-sm text-blue-300">
                            {metric.unit}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span
                            className={`text-xs font-medium ${
                              metric.change > 0
                                ? "text-green-400"
                                : metric.change < 0
                                  ? "text-red-400"
                                  : "text-gray-400"
                            }`}
                          >
                            {metric.change > 0 ? "+" : ""}
                            {metric.change.toFixed(1)}%
                          </span>
                          <span className="text-xs text-gray-400">
                            vs {timeframe}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Region Filter */}
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <Button
                  key={region.id}
                  variant={selectedRegion === region.id ? "default" : "outline"}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`${
                    selectedRegion === region.id
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-white/20 bg-black/20 hover:bg-white/10"
                  }`}
                >
                  {region.name} ({region.count})
                </Button>
              ))}
            </div>

            {/* Data Centers Grid */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDataCenters.map((dataCenter, index) => (
                <motion.div
                  key={dataCenter.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-black/40 border-white/10 hover:bg-black/60 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white text-lg">
                            {dataCenter.name}
                          </CardTitle>
                          <p className="text-blue-200 text-sm">
                            {dataCenter.location}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(dataCenter.status)}>
                            {getStatusIcon(dataCenter.status)}
                            <span className="ml-1 capitalize">
                              {dataCenter.status}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Load Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-200">Server Load</span>
                          <span className="text-white font-medium">
                            {dataCenter.load}%
                          </span>
                        </div>
                        <Progress value={dataCenter.load} className="h-2" />
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                          <p className="text-blue-200">Latency</p>
                          <p className="text-white font-bold">
                            {dataCenter.latency}ms
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-blue-200">Uptime</p>
                          <p className="text-white font-bold">
                            {dataCenter.uptime}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-blue-200">Connections</p>
                          <p className="text-white font-bold">
                            {dataCenter.connections.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Region Badge */}
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {dataCenter.region}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-blue-200">
                          <MapPin className="w-3 h-3" />
                          <span>{dataCenter.country}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Latency Chart */}
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Global Latency Heatmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 relative">
                    {/* Simulated heatmap */}
                    <div className="grid grid-cols-10 gap-1 h-full">
                      {Array.from({ length: 100 }).map((_, index) => {
                        const latency = Math.random() * 100;
                        return (
                          <div
                            key={index}
                            className={`rounded ${
                              latency < 20
                                ? "bg-green-500"
                                : latency < 50
                                  ? "bg-yellow-500"
                                  : latency < 80
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                            }`}
                            title={`${latency.toFixed(1)}ms`}
                          />
                        );
                      })}
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center space-x-4 text-xs text-white">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>&lt;20ms</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span>20-50ms</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span>50-80ms</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>&gt;80ms</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Throughput Chart */}
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Data Center Throughput
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-around space-x-2">
                    {filteredDataCenters.slice(0, 8).map((dc, index) => (
                      <div
                        key={dc.id}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className={`w-full rounded-t transition-all duration-1000 ${
                            dc.status === "online"
                              ? dc.load > 80
                                ? "bg-gradient-to-t from-red-500 to-red-400"
                                : dc.load > 60
                                  ? "bg-gradient-to-t from-yellow-500 to-yellow-400"
                                  : "bg-gradient-to-t from-green-500 to-green-400"
                              : "bg-gradient-to-t from-gray-500 to-gray-400"
                          }`}
                          style={{ height: `${Math.max(5, dc.load)}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                            <span className="text-white font-bold text-xs">
                              {dc.load}%
                            </span>
                          </div>
                        </div>
                        <div className="text-center mt-2">
                          <p className="text-white text-xs font-medium">
                            {dc.name.split(" ")[0]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics Table */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Metrics by Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-blue-200 font-medium py-2">
                          Region
                        </th>
                        <th className="text-left text-blue-200 font-medium py-2">
                          Data Centers
                        </th>
                        <th className="text-left text-blue-200 font-medium py-2">
                          Avg Load
                        </th>
                        <th className="text-left text-blue-200 font-medium py-2">
                          Avg Latency
                        </th>
                        <th className="text-left text-blue-200 font-medium py-2">
                          Total Connections
                        </th>
                        <th className="text-left text-blue-200 font-medium py-2">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {regions.slice(1).map((region) => {
                        const regionDCs = dataCenters.filter(
                          (dc) => dc.region === region.name,
                        );
                        const avgLoad =
                          regionDCs.reduce((sum, dc) => sum + dc.load, 0) /
                          regionDCs.length;
                        const avgLatency =
                          regionDCs
                            .filter((dc) => dc.status === "online")
                            .reduce((sum, dc) => sum + dc.latency, 0) /
                          regionDCs.filter((dc) => dc.status === "online")
                            .length;
                        const totalConnections = regionDCs.reduce(
                          (sum, dc) => sum + dc.connections,
                          0,
                        );
                        const onlineCount = regionDCs.filter(
                          (dc) => dc.status === "online",
                        ).length;

                        return (
                          <tr
                            key={region.id}
                            className="border-b border-white/5"
                          >
                            <td className="text-white py-3">{region.name}</td>
                            <td className="text-white py-3">
                              {onlineCount}/{regionDCs.length}
                            </td>
                            <td className="text-white py-3">
                              {avgLoad.toFixed(1)}%
                            </td>
                            <td className="text-white py-3">
                              {avgLatency.toFixed(1)}ms
                            </td>
                            <td className="text-white py-3">
                              {totalConnections.toLocaleString()}
                            </td>
                            <td className="py-3">
                              <Badge
                                className={
                                  onlineCount === regionDCs.length
                                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                                    : onlineCount > 0
                                      ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                      : "bg-red-500/20 text-red-300 border-red-500/30"
                                }
                              >
                                {onlineCount === regionDCs.length
                                  ? "Healthy"
                                  : onlineCount > 0
                                    ? "Degraded"
                                    : "Offline"}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Network Topology Tab */}
          <TabsContent value="network" className="space-y-8">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Global Network Topology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 relative bg-black/20 rounded-lg overflow-hidden">
                  {/* Simulated network topology */}
                  <div className="absolute inset-4">
                    {/* Central hub */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Regional nodes */}
                    {dataCenters.slice(0, 6).map((dc, index) => {
                      const angle = index * 60 * (Math.PI / 180);
                      const radius = 120;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;

                      return (
                        <div key={dc.id}>
                          {/* Connection line */}
                          <div
                            className="absolute border-t border-blue-400/30"
                            style={{
                              width: `${radius}px`,
                              left: `50%`,
                              top: `50%`,
                              transformOrigin: "0 0",
                              transform: `rotate(${angle}rad)`,
                            }}
                          />

                          {/* Data center node */}
                          <div
                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                              left: `calc(50% + ${x}px)`,
                              top: `calc(50% + ${y}px)`,
                            }}
                          >
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                dc.status === "online"
                                  ? "bg-green-500"
                                  : dc.status === "maintenance"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            >
                              <Server className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-center mt-2">
                              <p className="text-white text-xs font-medium">
                                {dc.name.split(" ")[0]}
                              </p>
                              <p className="text-blue-200 text-xs">
                                {dc.latency}ms
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Traffic indicators */}
                    {Array.from({ length: 12 }).map((_, index) => (
                      <motion.div
                        key={index}
                        className="absolute w-2 h-2 bg-blue-400 rounded-full"
                        initial={{
                          left: "50%",
                          top: "50%",
                          opacity: 0,
                        }}
                        animate={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.25,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-blue-200">Total Bandwidth</p>
                    <p className="text-white font-bold">847 Gbps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-200">Network Hops</p>
                    <p className="text-white font-bold">3.2 avg</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-200">Packet Loss</p>
                    <p className="text-white font-bold">0.001%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-200">CDN Nodes</p>
                    <p className="text-white font-bold">247 active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Traffic Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regions.slice(1).map((region, index) => {
                      const percentage = Math.random() * 30 + 10;
                      return (
                        <div key={region.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-white">{region.name}</span>
                            <span className="text-blue-200">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Historical Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-around space-x-1">
                    {Array.from({ length: 24 }).map((_, index) => {
                      const height = Math.random() * 80 + 20;
                      return (
                        <div
                          key={index}
                          className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                          style={{ height: `${height}%` }}
                          title={`Hour ${index}: ${height.toFixed(1)}%`}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-blue-200">
                    <span>24h ago</span>
                    <span>12h ago</span>
                    <span>Now</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GlobalInfrastructureMonitor;
