/**
 * Vault Management System
 * Dynamic DAO-based investment vault operations
 */

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Vault,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Clock,
  Globe,
  Shield,
  Activity,
  Plus,
  Edit,
  Eye,
  Settings,
  BarChart3,
  PieChart,
  Zap,
  Heart,
  Leaf,
  Star,
  Award,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  Filter,
  Search,
} from "lucide-react";

interface VaultData {
  id: string;
  name: string;
  type: "EcoDAO" | "Legacy" | "Climate" | "Cultural" | "Innovation";
  status: "active" | "pending" | "paused" | "closed";
  tvl: number;
  yield: number;
  participants: number;
  created: string;
  region: string;
  riskScore: number;
  performance: number[];
  governance: {
    proposalsActive: number;
    votingPower: number;
    quorum: number;
  };
  sustainability: {
    carbonOffset: number;
    impactScore: number;
    certifications: string[];
  };
}

interface RitualData {
  id: string;
  vaultId: string;
  type: string;
  participant: string;
  status: "verified" | "pending" | "rejected";
  yieldGenerated: number;
  timestamp: string;
  location: string;
  verificationMethod: string;
}

const VaultManagementSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVault, setSelectedVault] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [vaults] = useState<VaultData[]>([
    {
      id: "vault-001",
      name: "Amazon ReWild Sanctuary",
      type: "EcoDAO",
      status: "active",
      tvl: 12400000,
      yield: 8.4,
      participants: 247,
      created: "2023-08-15",
      region: "Amazon Basin",
      riskScore: 3.2,
      performance: [6.2, 7.1, 8.4, 7.8, 8.2, 8.4],
      governance: {
        proposalsActive: 3,
        votingPower: 85.2,
        quorum: 67,
      },
      sustainability: {
        carbonOffset: 45000,
        impactScore: 94,
        certifications: ["Forest Stewardship Council", "Carbon Verified"],
      },
    },
    {
      id: "vault-002",
      name: "Sankofa Memory Preservation",
      type: "Cultural",
      status: "active",
      tvl: 8900000,
      yield: 6.7,
      participants: 189,
      created: "2023-09-22",
      region: "West Africa",
      riskScore: 2.8,
      performance: [5.4, 6.1, 6.7, 6.3, 6.5, 6.7],
      governance: {
        proposalsActive: 2,
        votingPower: 78.5,
        quorum: 72,
      },
      sustainability: {
        carbonOffset: 28000,
        impactScore: 88,
        certifications: ["Cultural Heritage Verified", "Impact Certified"],
      },
    },
    {
      id: "vault-003",
      name: "Arctic Preservation Coalition",
      type: "Climate",
      status: "active",
      tvl: 15600000,
      yield: 9.1,
      participants: 156,
      created: "2023-07-10",
      region: "Arctic Circle",
      riskScore: 4.1,
      performance: [7.8, 8.5, 9.1, 8.7, 8.9, 9.1],
      governance: {
        proposalsActive: 5,
        votingPower: 92.1,
        quorum: 58,
      },
      sustainability: {
        carbonOffset: 67000,
        impactScore: 96,
        certifications: ["Climate Action Verified", "Arctic Council Endorsed"],
      },
    },
    {
      id: "vault-004",
      name: "Pacific Wisdom Circle",
      type: "Cultural",
      status: "pending",
      tvl: 3200000,
      yield: 5.2,
      participants: 98,
      created: "2023-11-05",
      region: "Pacific Islands",
      riskScore: 2.1,
      performance: [4.8, 5.0, 5.2, 5.1, 5.2],
      governance: {
        proposalsActive: 1,
        votingPower: 65.3,
        quorum: 80,
      },
      sustainability: {
        carbonOffset: 15000,
        impactScore: 82,
        certifications: ["Ocean Protection Verified"],
      },
    },
  ]);

  const [rituals] = useState<RitualData[]>([
    {
      id: "ritual-001",
      vaultId: "vault-001",
      type: "Tree Planting Ceremony",
      participant: "0x123...789",
      status: "verified",
      yieldGenerated: 0.23,
      timestamp: "2024-01-05 14:30:00",
      location: "Amazon Rainforest, Brazil",
      verificationMethod: "Satellite + Local Witness",
    },
    {
      id: "ritual-002",
      vaultId: "vault-002",
      type: "Ancestral Story Recording",
      participant: "0x456...abc",
      status: "verified",
      yieldGenerated: 0.18,
      timestamp: "2024-01-05 11:15:00",
      location: "Ghana, West Africa",
      verificationMethod: "Community Validation",
    },
    {
      id: "ritual-003",
      vaultId: "vault-003",
      type: "Ice Core Analysis",
      participant: "0x789...def",
      status: "pending",
      yieldGenerated: 0.31,
      timestamp: "2024-01-05 09:45:00",
      location: "Greenland Ice Sheet",
      verificationMethod: "Scientific Verification",
    },
  ]);

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      paused: "bg-blue-100 text-blue-800",
      closed: "bg-red-100 text-red-800",
      verified: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      EcoDAO: <Leaf className="h-4 w-4 text-green-600" />,
      Cultural: <Heart className="h-4 w-4 text-purple-600" />,
      Climate: <Globe className="h-4 w-4 text-blue-600" />,
      Legacy: <Star className="h-4 w-4 text-yellow-600" />,
      Innovation: <Zap className="h-4 w-4 text-orange-600" />,
    };
    return icons[type as keyof typeof icons] || <Vault className="h-4 w-4" />;
  };

  const getRiskColor = (risk: number) => {
    if (risk < 3) return "text-green-600";
    if (risk < 4) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredVaults = vaults.filter((vault) => {
    const matchesSearch =
      vault.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vault.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || vault.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalTVL = vaults.reduce((sum, vault) => sum + vault.tvl, 0);
  const averageYield =
    vaults.reduce((sum, vault) => sum + vault.yield, 0) / vaults.length;
  const totalParticipants = vaults.reduce(
    (sum, vault) => sum + vault.participants,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Vault className="h-8 w-8 text-blue-600" />
            Vault Management System
          </h2>
          <p className="text-gray-600 mt-2">
            Dynamic DAO-based investment vault operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Vault
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total TVL</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(totalTVL / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-green-600">+12.4% this month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Yield
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {averageYield.toFixed(1)}%
                </p>
                <p className="text-xs text-blue-600">Annualized APY</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Participants
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalParticipants}
                </p>
                <p className="text-xs text-purple-600">
                  {vaults.length} active vaults
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Rituals Today
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {rituals.filter((r) => r.status === "verified").length}
                </p>
                <p className="text-xs text-orange-600">
                  {rituals.filter((r) => r.status === "pending").length} pending
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
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
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="vaults" className="flex items-center gap-2">
            <Vault className="h-4 w-4" />
            Vaults
          </TabsTrigger>
          <TabsTrigger value="rituals" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Rituals
          </TabsTrigger>
          <TabsTrigger value="governance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Governance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vaults.slice(0, 3).map((vault) => (
                    <div
                      key={vault.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getTypeIcon(vault.type)}
                        <div>
                          <p className="font-medium">{vault.name}</p>
                          <p className="text-sm text-gray-600">
                            {vault.region}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {vault.yield}% APY
                        </p>
                        <p className="text-sm text-gray-600">
                          ${(vault.tvl / 1000000).toFixed(1)}M TVL
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sustainability Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Carbon Offset</span>
                    <span className="font-bold text-green-600">
                      {vaults
                        .reduce(
                          (sum, v) => sum + v.sustainability.carbonOffset,
                          0,
                        )
                        .toLocaleString()}{" "}
                      tons
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Impact Score</span>
                    <span className="font-bold text-blue-600">
                      {Math.round(
                        vaults.reduce(
                          (sum, v) => sum + v.sustainability.impactScore,
                          0,
                        ) / vaults.length,
                      )}
                      /100
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Certifications</span>
                    <span className="font-bold text-purple-600">
                      {
                        new Set(
                          vaults.flatMap(
                            (v) => v.sustainability.certifications,
                          ),
                        ).size
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vaults Tab */}
        <TabsContent value="vaults">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Vaults</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search vaults..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Types</option>
                    <option value="EcoDAO">EcoDAO</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Climate">Climate</option>
                    <option value="Legacy">Legacy</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredVaults.map((vault) => (
                  <Card
                    key={vault.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(vault.type)}
                          <div>
                            <h3 className="font-semibold">{vault.name}</h3>
                            <p className="text-sm text-gray-600">
                              {vault.region}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(vault.status)}
                          <Badge variant="outline">{vault.type}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">TVL</p>
                            <p className="font-bold text-lg">
                              ${(vault.tvl / 1000000).toFixed(1)}M
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Yield</p>
                            <p className="font-bold text-lg text-green-600">
                              {vault.yield}%
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              Participants
                            </p>
                            <p className="font-medium">{vault.participants}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Risk Score</p>
                            <p
                              className={`font-medium ${getRiskColor(vault.riskScore)}`}
                            >
                              {vault.riskScore}/10
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Performance (6mo)
                          </p>
                          <div className="flex items-end gap-1 h-12">
                            {vault.performance.map((perf, idx) => (
                              <div
                                key={idx}
                                className="bg-blue-200 rounded-t"
                                style={{
                                  height: `${(perf / Math.max(...vault.performance)) * 100}%`,
                                  width: "16.66%",
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Settings
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rituals Tab */}
        <TabsContent value="rituals">
          <Card>
            <CardHeader>
              <CardTitle>Recent Ritual Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rituals.map((ritual) => (
                  <div
                    key={ritual.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Activity className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="font-medium">{ritual.type}</p>
                        <p className="text-sm text-gray-600">
                          {ritual.location}
                        </p>
                        <p className="text-xs text-gray-500">
                          {ritual.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          +{ritual.yieldGenerated} ETH
                        </p>
                        <p className="text-sm text-gray-600">
                          {ritual.verificationMethod}
                        </p>
                      </div>
                      {getStatusBadge(ritual.status)}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Governance Tab */}
        <TabsContent value="governance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vaults.map((vault) => (
                    <div key={vault.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{vault.name}</span>
                        <Badge>
                          {vault.governance.proposalsActive} proposals
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Voting Power:</span>
                          <span className="font-medium ml-2">
                            {vault.governance.votingPower}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Quorum:</span>
                          <span className="font-medium ml-2">
                            {vault.governance.quorum}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Governance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Active Proposals</span>
                    <span className="font-bold">
                      {vaults.reduce(
                        (sum, v) => sum + v.governance.proposalsActive,
                        0,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Voting Power</span>
                    <span className="font-bold">
                      {Math.round(
                        vaults.reduce(
                          (sum, v) => sum + v.governance.votingPower,
                          0,
                        ) / vaults.length,
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Quorum</span>
                    <span className="font-bold">
                      {Math.round(
                        vaults.reduce(
                          (sum, v) => sum + v.governance.quorum,
                          0,
                        ) / vaults.length,
                      )}
                      %
                    </span>
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

export default VaultManagementSystem;
