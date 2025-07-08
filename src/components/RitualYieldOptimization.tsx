/**
 * Ritual Yield Optimization System
 * Yield generation through verified care practices
 */

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  Leaf,
  Globe,
  Star,
  Zap,
  Activity,
  TrendingUp,
  Target,
  Clock,
  Users,
  Award,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Camera,
  Smartphone,
  Satellite,
  Shield,
  BarChart3,
  PieChart,
  LineChart,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search,
} from "lucide-react";

interface RitualType {
  id: string;
  name: string;
  category: "Environmental" | "Cultural" | "Social" | "Spiritual";
  baseYield: number;
  multiplier: number;
  requirements: string[];
  verification: string[];
  duration: number; // in hours
  participants: number;
  description: string;
}

interface ActiveRitual {
  id: string;
  typeId: string;
  participant: string;
  status: "active" | "pending" | "verified" | "rejected" | "expired";
  progress: number;
  startTime: string;
  location: {
    name: string;
    coordinates: [number, number];
    region: string;
  };
  evidence: {
    photos: number;
    videos: number;
    witnesses: number;
    sensors: number;
  };
  yieldPotential: number;
  actualYield: number;
  verificationScore: number;
}

interface YieldMetrics {
  totalGenerated: number;
  averageRitual: number;
  topPerformer: number;
  monthlyGrowth: number;
  verificationRate: number;
  participationRate: number;
}

const RitualYieldOptimization: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedRitual, setSelectedRitual] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState("7d");

  const [ritualTypes] = useState<RitualType[]>([
    {
      id: "tree-planting",
      name: "Sacred Tree Planting",
      category: "Environmental",
      baseYield: 0.15,
      multiplier: 1.8,
      requirements: [
        "Location verification",
        "Sapling quality",
        "Planting technique",
      ],
      verification: [
        "Satellite imagery",
        "Local witness",
        "Photo documentation",
      ],
      duration: 4,
      participants: 847,
      description:
        "Plant native trees in designated conservation areas with traditional ceremony",
    },
    {
      id: "story-recording",
      name: "Ancestral Story Recording",
      category: "Cultural",
      baseYield: 0.12,
      multiplier: 2.1,
      requirements: [
        "Elder participation",
        "Language authenticity",
        "Historical accuracy",
      ],
      verification: [
        "Community validation",
        "Elder approval",
        "Cultural expert review",
      ],
      duration: 2,
      participants: 234,
      description:
        "Record and preserve ancestral stories and cultural knowledge",
    },
    {
      id: "water-blessing",
      name: "Water Source Blessing",
      category: "Spiritual",
      baseYield: 0.18,
      multiplier: 1.6,
      requirements: [
        "Sacred location",
        "Community participation",
        "Traditional protocol",
      ],
      verification: [
        "Community witness",
        "Water quality test",
        "Ritual documentation",
      ],
      duration: 3,
      participants: 456,
      description:
        "Ceremonial blessing and purification of natural water sources",
    },
    {
      id: "solar-installation",
      name: "Community Solar Ritual",
      category: "Environmental",
      baseYield: 0.25,
      multiplier: 1.4,
      requirements: [
        "Technical expertise",
        "Community consent",
        "Energy efficiency",
      ],
      verification: [
        "Technical inspection",
        "Energy output",
        "Community approval",
      ],
      duration: 8,
      participants: 123,
      description: "Install solar panels with community ceremony and education",
    },
    {
      id: "healing-circle",
      name: "Community Healing Circle",
      category: "Social",
      baseYield: 0.1,
      multiplier: 2.3,
      requirements: [
        "Mental health support",
        "Safe space",
        "Trained facilitator",
      ],
      verification: [
        "Participant feedback",
        "Facilitator certification",
        "Outcome tracking",
      ],
      duration: 3,
      participants: 678,
      description:
        "Facilitate community healing through traditional circle practices",
    },
  ]);

  const [activeRituals] = useState<ActiveRitual[]>([
    {
      id: "active-001",
      typeId: "tree-planting",
      participant: "0x123...789",
      status: "active",
      progress: 75,
      startTime: "2024-01-05 10:00:00",
      location: {
        name: "Amazon Conservation Area",
        coordinates: [-3.4653, -62.2159],
        region: "Brazil",
      },
      evidence: {
        photos: 12,
        videos: 3,
        witnesses: 2,
        sensors: 1,
      },
      yieldPotential: 0.27,
      actualYield: 0,
      verificationScore: 87,
    },
    {
      id: "active-002",
      typeId: "story-recording",
      participant: "0x456...abc",
      status: "pending",
      progress: 100,
      startTime: "2024-01-05 08:30:00",
      location: {
        name: "Ashanti Cultural Center",
        coordinates: [6.6885, -1.6244],
        region: "Ghana",
      },
      evidence: {
        photos: 8,
        videos: 1,
        witnesses: 3,
        sensors: 0,
      },
      yieldPotential: 0.25,
      actualYield: 0,
      verificationScore: 92,
    },
    {
      id: "active-003",
      typeId: "water-blessing",
      participant: "0x789...def",
      status: "verified",
      progress: 100,
      startTime: "2024-01-04 15:45:00",
      location: {
        name: "Sacred Spring",
        coordinates: [35.6762, 139.6503],
        region: "Japan",
      },
      evidence: {
        photos: 15,
        videos: 2,
        witnesses: 5,
        sensors: 2,
      },
      yieldPotential: 0.29,
      actualYield: 0.31,
      verificationScore: 98,
    },
  ]);

  const [yieldMetrics] = useState<YieldMetrics>({
    totalGenerated: 47.8,
    averageRitual: 0.23,
    topPerformer: 0.45,
    monthlyGrowth: 18.4,
    verificationRate: 94.2,
    participationRate: 78.6,
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      Environmental: <Leaf className="h-4 w-4 text-green-600" />,
      Cultural: <Star className="h-4 w-4 text-purple-600" />,
      Social: <Users className="h-4 w-4 text-blue-600" />,
      Spiritual: <Heart className="h-4 w-4 text-pink-600" />,
    };
    return (
      icons[category as keyof typeof icons] || <Activity className="h-4 w-4" />
    );
  };

  const getVerificationIcon = (method: string) => {
    const icons = {
      "Satellite imagery": <Satellite className="h-4 w-4 text-blue-600" />,
      "Photo documentation": <Camera className="h-4 w-4 text-green-600" />,
      "Community validation": <Users className="h-4 w-4 text-purple-600" />,
      "Local witness": <Eye className="h-4 w-4 text-orange-600" />,
      "Technical inspection": <Shield className="h-4 w-4 text-red-600" />,
    };
    return (
      icons[method as keyof typeof icons] || <CheckCircle className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Heart className="h-8 w-8 text-pink-600" />
            Ritual Yield Optimization
          </h2>
          <p className="text-gray-600 mt-2">
            Yield generation through verified care practices
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="24h">24 Hours</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Start Ritual
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Yield Generated
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {yieldMetrics.totalGenerated} ETH
                </p>
                <p className="text-xs text-green-600">
                  +{yieldMetrics.monthlyGrowth}% this month
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Ritual Yield
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {yieldMetrics.averageRitual} ETH
                </p>
                <p className="text-xs text-blue-600">
                  Top: {yieldMetrics.topPerformer} ETH
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Verification Rate
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {yieldMetrics.verificationRate}%
                </p>
                <p className="text-xs text-purple-600">
                  {yieldMetrics.participationRate}% participation
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-4 w-full lg:w-auto">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Active Rituals
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Ritual Types
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Optimization
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Ritual Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeRituals.map((ritual) => {
                    const type = ritualTypes.find(
                      (t) => t.id === ritual.typeId,
                    );
                    return (
                      <div
                        key={ritual.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(type?.category || "")}
                          <div>
                            <p className="font-medium">{type?.name}</p>
                            <p className="text-sm text-gray-600">
                              {ritual.location.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {ritual.actualYield > 0
                              ? `${ritual.actualYield} ETH`
                              : `~${ritual.yieldPotential} ETH`}
                          </p>
                          {getStatusBadge(ritual.status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yield Optimization Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        High Performance
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      Cultural rituals showing 21% higher yield than baseline
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Optimization Opportunity
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Environmental rituals could benefit from better
                      verification
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-800">
                        Peak Performance
                      </span>
                    </div>
                    <p className="text-sm text-purple-700">
                      Best yield times: 6-9 AM and 4-7 PM local time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Active Rituals Tab */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Ritual Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeRituals.map((ritual) => {
                  const type = ritualTypes.find((t) => t.id === ritual.typeId);
                  return (
                    <Card
                      key={ritual.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {getCategoryIcon(type?.category || "")}
                            <div>
                              <h3 className="font-semibold">{type?.name}</h3>
                              <p className="text-sm text-gray-600">
                                {ritual.participant}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(ritual.status)}
                            <Badge variant="outline">
                              {ritual.verificationScore}/100
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Location
                            </p>
                            <p className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {ritual.location.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Yield Potential
                            </p>
                            <p className="font-bold text-green-600">
                              {ritual.yieldPotential} ETH
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Progress
                            </p>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={ritual.progress}
                                className="flex-1"
                              />
                              <span className="text-sm">
                                {ritual.progress}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <Camera className="h-4 w-4 mx-auto mb-1 text-green-600" />
                            <p className="text-sm font-medium">
                              {ritual.evidence.photos}
                            </p>
                            <p className="text-xs text-gray-600">Photos</p>
                          </div>
                          <div className="text-center">
                            <Activity className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                            <p className="text-sm font-medium">
                              {ritual.evidence.videos}
                            </p>
                            <p className="text-xs text-gray-600">Videos</p>
                          </div>
                          <div className="text-center">
                            <Users className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                            <p className="text-sm font-medium">
                              {ritual.evidence.witnesses}
                            </p>
                            <p className="text-xs text-gray-600">Witnesses</p>
                          </div>
                          <div className="text-center">
                            <Satellite className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                            <p className="text-sm font-medium">
                              {ritual.evidence.sensors}
                            </p>
                            <p className="text-xs text-gray-600">Sensors</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            Track Location
                          </Button>
                          {ritual.status === "pending" && (
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ritual Types Tab */}
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Available Ritual Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {ritualTypes.map((type) => (
                  <Card
                    key={type.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(type.category)}
                          <div>
                            <h3 className="font-semibold">{type.name}</h3>
                            <p className="text-sm text-gray-600">
                              {type.category}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {type.participants} participants
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-4">
                        {type.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Base Yield
                          </p>
                          <p className="font-bold text-green-600">
                            {type.baseYield} ETH
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Multiplier
                          </p>
                          <p className="font-bold text-blue-600">
                            {type.multiplier}x
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Requirements
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {type.requirements.map((req, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Verification Methods
                        </p>
                        <div className="space-y-1">
                          {type.verification.map((method, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {getVerificationIcon(method)}
                              <span className="text-sm">{method}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Duration: {type.duration}h
                        </span>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Start Ritual
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Yield Optimization Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">
                      Time-based Optimization
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Schedule rituals during peak verification hours for higher
                      yield multipliers
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        Peak hours: 6-9 AM, 4-7 PM
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Evidence Quality</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Higher quality evidence leads to better verification
                      scores and yield
                    </p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        Target: 95+ verification score
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">
                      Community Participation
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Rituals with more community witnesses receive higher
                      multipliers
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Optimal: 3+ witnesses</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Category Performance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cultural</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="w-20" />
                          <span className="text-sm font-medium">85%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Environmental</span>
                        <div className="flex items-center gap-2">
                          <Progress value={78} className="w-20" />
                          <span className="text-sm font-medium">78%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Spiritual</span>
                        <div className="flex items-center gap-2">
                          <Progress value={92} className="w-20" />
                          <span className="text-sm font-medium">92%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Social</span>
                        <div className="flex items-center gap-2">
                          <Progress value={71} className="w-20" />
                          <span className="text-sm font-medium">71%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Regional Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Asia-Pacific</span>
                        <span className="text-sm font-medium text-green-600">
                          0.31 ETH avg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Americas</span>
                        <span className="text-sm font-medium text-blue-600">
                          0.28 ETH avg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Africa</span>
                        <span className="text-sm font-medium text-purple-600">
                          0.25 ETH avg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Europe</span>
                        <span className="text-sm font-medium text-orange-600">
                          0.22 ETH avg
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RitualYieldOptimization;
