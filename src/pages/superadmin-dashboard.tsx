/**
 * QuantumVest SuperAdmin Dashboard
 * Comprehensive admin interface for managing the entire platform
 */

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import {
  Shield,
  Users,
  Vault,
  Brain,
  Search,
  Plus,
  Settings,
  Activity,
  TrendingUp,
  DollarSign,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Filter,
  MoreHorizontal,
  Leaf,
  Heart,
  Star,
  Navigation,
} from "lucide-react";

interface VaultData {
  id: string;
  name: string;
  type: string;
  yield: string;
  status: string;
  tvl: string;
  participants: number;
  lastRitual: string;
  region: string;
}

interface UserData {
  id: string;
  username: string;
  wallet: string;
  role: string;
  status: string;
  trustScore: number;
  joinDate: string;
  lastActivity: string;
  vaultsCount: number;
}

interface RitualData {
  id: string;
  vault: string;
  ritual: string;
  participant: string;
  verification: string;
  timestamp: string;
  yieldGenerated: string;
  location: string;
}

interface AIAgentData {
  id: string;
  name: string;
  domain: string;
  status: string;
  lastUpdate: string;
  tasksCompleted: number;
  accuracy: string;
  version: string;
}

const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data - in production this would come from APIs
  const [vaults] = useState<VaultData[]>([
    {
      id: "1",
      name: "ReWild Amazon",
      type: "EcoDAO",
      yield: "6.4%",
      status: "active",
      tvl: "$2.4M",
      participants: 247,
      lastRitual: "2h ago",
      region: "Amazon Basin",
    },
    {
      id: "2",
      name: "Sankofa Memory Vault",
      type: "Legacy",
      yield: "4.9%",
      status: "pending",
      tvl: "$890K",
      participants: 89,
      lastRitual: "12h ago",
      region: "West Africa",
    },
    {
      id: "3",
      name: "Arctic Preservation DAO",
      type: "Climate",
      yield: "7.2%",
      status: "active",
      tvl: "$1.8M",
      participants: 156,
      lastRitual: "45m ago",
      region: "Arctic Circle",
    },
    {
      id: "4",
      name: "Pacific Wisdom Vault",
      type: "Cultural",
      yield: "5.1%",
      status: "maintenance",
      tvl: "$1.2M",
      participants: 203,
      lastRitual: "6h ago",
      region: "Pacific Islands",
    },
  ]);

  const [users] = useState<UserData[]>([
    {
      id: "1",
      username: "AncestralOne",
      wallet: "0x123...789",
      role: "Guardian",
      status: "verified",
      trustScore: 98,
      joinDate: "2023-03-15",
      lastActivity: "5m ago",
      vaultsCount: 3,
    },
    {
      id: "2",
      username: "EarthKeeper",
      wallet: "0x456...abc",
      role: "Steward",
      status: "verified",
      trustScore: 94,
      joinDate: "2023-05-22",
      lastActivity: "1h ago",
      vaultsCount: 5,
    },
    {
      id: "3",
      username: "WisdomSeeker",
      wallet: "0x789...def",
      role: "Participant",
      status: "pending",
      trustScore: 76,
      joinDate: "2024-01-08",
      lastActivity: "3h ago",
      vaultsCount: 1,
    },
    {
      id: "4",
      username: "OceanGuardian",
      wallet: "0xabc...123",
      role: "Regional Lead",
      status: "verified",
      trustScore: 99,
      joinDate: "2023-01-10",
      lastActivity: "30m ago",
      vaultsCount: 7,
    },
  ]);

  const [rituals] = useState<RitualData[]>([
    {
      id: "1",
      vault: "Tree of Life",
      ritual: "Solstice Offering",
      participant: "0x9af...1dc",
      verification: "sensor_confirmed",
      timestamp: "2024-01-05 14:30",
      yieldGenerated: "0.23 ETH",
      location: "Sacred Grove, Brazil",
    },
    {
      id: "2",
      vault: "Coral Sanctuary",
      ritual: "Ocean Blessing",
      participant: "0x2bd...8ef",
      verification: "community_validated",
      timestamp: "2024-01-05 11:15",
      yieldGenerated: "0.18 ETH",
      location: "Great Barrier Reef",
    },
    {
      id: "3",
      vault: "Desert Wisdom",
      ritual: "Sand Ceremony",
      participant: "0x7fg...9hi",
      verification: "ai_verified",
      timestamp: "2024-01-05 09:45",
      yieldGenerated: "0.31 ETH",
      location: "Sahara Desert",
    },
  ]);

  const [aiAgents] = useState<AIAgentData[]>([
    {
      id: "1",
      name: "MythicGuide GPT",
      domain: "Cultural Investing",
      status: "active",
      lastUpdate: "2h ago",
      tasksCompleted: 1247,
      accuracy: "94.2%",
      version: "v2.1.3",
    },
    {
      id: "2",
      name: "EcoWisdom AI",
      domain: "Environmental Analysis",
      status: "active",
      lastUpdate: "15m ago",
      tasksCompleted: 892,
      accuracy: "97.8%",
      version: "v1.8.2",
    },
    {
      id: "3",
      name: "RitualValidator",
      domain: "Verification Systems",
      status: "maintenance",
      lastUpdate: "4h ago",
      tasksCompleted: 2156,
      accuracy: "99.1%",
      version: "v3.0.1",
    },
    {
      id: "4",
      name: "YieldOptimizer",
      domain: "Financial Optimization",
      status: "active",
      lastUpdate: "1h ago",
      tasksCompleted: 3421,
      accuracy: "96.7%",
      version: "v2.5.0",
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Pending Ritual
          </Badge>
        );
      case "maintenance":
        return <Badge className="bg-blue-100 text-blue-800">Maintenance</Badge>;
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "sensor_confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-800">Sensor Confirmed</Badge>
        );
      case "community_validated":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            Community Validated
          </Badge>
        );
      case "ai_verified":
        return <Badge className="bg-cyan-100 text-cyan-800">AI Verified</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <SEOHead
        title="SuperAdmin Dashboard | QuantumVest"
        description="Comprehensive admin interface for managing vaults, users, rituals, and AI agents"
        keywords={["admin", "dashboard", "management", "quantumvest"]}
        canonicalUrl="/superadmin-dashboard"
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Shield className="h-8 w-8 text-blue-600" />
                    QuantumVest SuperAdmin
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Comprehensive platform management and oversight dashboard
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Vaults
                    </p>
                    <p className="text-2xl font-bold">247</p>
                    <p className="text-xs text-green-600">+12 this month</p>
                  </div>
                  <Vault className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Users
                    </p>
                    <p className="text-2xl font-bold">8,429</p>
                    <p className="text-xs text-green-600">+234 this week</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total TVL
                    </p>
                    <p className="text-2xl font-bold">$47.2M</p>
                    <p className="text-xs text-green-600">+8.4% this month</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-600" />
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
                    <p className="text-2xl font-bold">89</p>
                    <p className="text-xs text-blue-600">34 verified</p>
                  </div>
                  <Leaf className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-5 w-full lg:w-auto">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="vaults" className="flex items-center gap-2">
                <Vault className="h-4 w-4" />
                Vaults
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="rituals" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Rituals
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Agents
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold">Recent Activity</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">
                            New vault created: "Ocean Guardians"
                          </p>
                          <p className="text-sm text-gray-600">5 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">
                            Ritual verified in Amazon Vault
                          </p>
                          <p className="text-sm text-gray-600">
                            12 minutes ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium">
                            AI Agent requiring attention
                          </p>
                          <p className="text-sm text-gray-600">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold">System Health</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Platform Uptime</span>
                        <Badge className="bg-green-100 text-green-800">
                          99.97%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>API Response Time</span>
                        <Badge className="bg-green-100 text-green-800">
                          45ms
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Active Nodes</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          127/128
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Pending Verifications</span>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          23
                        </Badge>
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
                    <h3 className="text-xl font-bold">Vault Management</h3>
                    <div className="flex items-center gap-3">
                      <Input
                        placeholder="Search vaults..."
                        className="w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Vault
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell>Vault Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Yield</TableCell>
                          <TableCell>TVL</TableCell>
                          <TableCell>Participants</TableCell>
                          <TableCell>Last Ritual</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vaults.map((vault) => (
                          <TableRow key={vault.id}>
                            <TableCell className="font-medium">
                              {vault.name}
                            </TableCell>
                            <TableCell>{vault.type}</TableCell>
                            <TableCell className="text-green-600 font-medium">
                              {vault.yield}
                            </TableCell>
                            <TableCell className="font-medium">
                              {vault.tvl}
                            </TableCell>
                            <TableCell>{vault.participants}</TableCell>
                            <TableCell>{vault.lastRitual}</TableCell>
                            <TableCell>
                              {getStatusBadge(vault.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">User Management</h3>
                    <div className="flex items-center gap-3">
                      <Input
                        placeholder="Search by wallet or username..."
                        className="w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell>Username</TableCell>
                          <TableCell>Wallet</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Trust Score</TableCell>
                          <TableCell>Vaults</TableCell>
                          <TableCell>Last Activity</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.username}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {user.wallet}
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                              <span
                                className={`font-medium ${getTrustScoreColor(user.trustScore)}`}
                              >
                                {user.trustScore}/100
                              </span>
                            </TableCell>
                            <TableCell>{user.vaultsCount}</TableCell>
                            <TableCell>{user.lastActivity}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rituals Tab */}
            <TabsContent value="rituals">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">
                      Ritual Verification Logs
                    </h3>
                    <div className="flex items-center gap-3">
                      <Input
                        placeholder="Search rituals..."
                        className="w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell>Vault</TableCell>
                          <TableCell>Ritual</TableCell>
                          <TableCell>Participant</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Yield Generated</TableCell>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>Verification</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rituals.map((ritual) => (
                          <TableRow key={ritual.id}>
                            <TableCell className="font-medium">
                              {ritual.vault}
                            </TableCell>
                            <TableCell>{ritual.ritual}</TableCell>
                            <TableCell className="font-mono text-sm">
                              {ritual.participant}
                            </TableCell>
                            <TableCell>{ritual.location}</TableCell>
                            <TableCell className="text-green-600 font-medium">
                              {ritual.yieldGenerated}
                            </TableCell>
                            <TableCell>{ritual.timestamp}</TableCell>
                            <TableCell>
                              {getStatusBadge(ritual.verification)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Navigation className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Agents Tab */}
            <TabsContent value="ai">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">AI Agent Console</h3>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync All
                      </Button>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Deploy Agent
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell>Agent Name</TableCell>
                          <TableCell>Domain</TableCell>
                          <TableCell>Version</TableCell>
                          <TableCell>Tasks Completed</TableCell>
                          <TableCell>Accuracy</TableCell>
                          <TableCell>Last Update</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aiAgents.map((agent) => (
                          <TableRow key={agent.id}>
                            <TableCell className="font-medium">
                              {agent.name}
                            </TableCell>
                            <TableCell>{agent.domain}</TableCell>
                            <TableCell className="font-mono text-sm">
                              {agent.version}
                            </TableCell>
                            <TableCell>
                              {agent.tasksCompleted.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-green-600 font-medium">
                              {agent.accuracy}
                            </TableCell>
                            <TableCell>{agent.lastUpdate}</TableCell>
                            <TableCell>
                              {getStatusBadge(agent.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Activity className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
