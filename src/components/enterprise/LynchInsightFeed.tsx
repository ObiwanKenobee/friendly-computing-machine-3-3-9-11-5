import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Users,
  TrendingUp,
  Star,
  MessageSquare,
  Search,
  Filter,
  Building2,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Eye,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Network,
  PlusCircle,
  Share2,
} from "lucide-react";
import { lynchLocalInsightService } from "@/services/lynchLocalInsightService";

interface LocalInsight {
  id: string;
  title: string;
  description: string;
  contributor: {
    name: string;
    avatar: string;
    expertise: string;
    reputation: number;
    verified: boolean;
  };
  location: {
    region: string;
    city: string;
    coordinates: [number, number];
  };
  category:
    | "retail"
    | "manufacturing"
    | "services"
    | "technology"
    | "real-estate"
    | "agriculture";
  confidence: number;
  upvotes: number;
  downvotes: number;
  views: number;
  comments: number;
  investmentPotential: {
    riskLevel: "low" | "medium" | "high";
    timeHorizon: string;
    minInvestment: number;
    maxInvestment: number;
    expectedReturn: number;
  };
  validationStatus: "pending" | "verified" | "disputed" | "archived";
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  attachments: string[];
}

interface MicroVault {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  investors: number;
  apy: number;
  riskScore: number;
  region: string;
  category: string;
  status: "active" | "funding" | "closed" | "matured";
  daysLeft: number;
  minContribution: number;
  maxContribution: number;
  insights: string[];
}

interface KnowledgeNode {
  id: string;
  name: string;
  type: "expert" | "business" | "opportunity" | "risk";
  connections: string[];
  strength: number;
  lastActivity: Date;
}

export const LynchInsightFeed: React.FC = () => {
  const [insights, setInsights] = useState<LocalInsight[]>([]);
  const [microVaults, setMicroVaults] = useState<MicroVault[]>([]);
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("insights");
  const [newInsightModal, setNewInsightModal] = useState(false);

  useEffect(() => {
    loadInsights();
    loadMicroVaults();
    loadKnowledgeGraph();
  }, []);

  const loadInsights = async () => {
    try {
      const data = await lynchLocalInsightService.getLocalInsights();
      setInsights(data);
    } catch (error) {
      console.error("Failed to load insights:", error);
    }
  };

  const loadMicroVaults = async () => {
    try {
      const data = await lynchLocalInsightService.getMicroVaults();
      setMicroVaults(data);
    } catch (error) {
      console.error("Failed to load micro vaults:", error);
    }
  };

  const loadKnowledgeGraph = async () => {
    try {
      const data = await lynchLocalInsightService.getKnowledgeGraph();
      setKnowledgeGraph(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load knowledge graph:", error);
      setLoading(false);
    }
  };

  const handleVoteInsight = async (insightId: string, vote: "up" | "down") => {
    try {
      await lynchLocalInsightService.voteOnInsight(insightId, vote);
      await loadInsights();
    } catch (error) {
      console.error("Failed to vote on insight:", error);
    }
  };

  const handleCreateMicroVault = async (vaultData: Partial<MicroVault>) => {
    try {
      await lynchLocalInsightService.createMicroVault(vaultData);
      await loadMicroVaults();
    } catch (error) {
      console.error("Failed to create micro vault:", error);
    }
  };

  const filteredInsights = insights.filter((insight) => {
    const matchesSearch =
      insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion =
      selectedRegion === "all" || insight.location.region === selectedRegion;
    const matchesCategory =
      selectedCategory === "all" || insight.category === selectedCategory;
    return matchesSearch && matchesRegion && matchesCategory;
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getValidationStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "disputed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Lynch Local Insights
          </h2>
          <p className="text-muted-foreground">
            Invest in what you know - Local knowledge drives exceptional returns
          </p>
        </div>
        <Button
          onClick={() => setNewInsightModal(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Share Insight
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search insights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="north-america">North America</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia">Asia</SelectItem>
            <SelectItem value="africa">Africa</SelectItem>
            <SelectItem value="south-america">South America</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="real-estate">Real Estate</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Local Insights</TabsTrigger>
          <TabsTrigger value="micro-vaults">Micro Vaults</TabsTrigger>
          <TabsTrigger value="knowledge-graph">Knowledge Graph</TabsTrigger>
          <TabsTrigger value="contributors">Contributors</TabsTrigger>
        </TabsList>

        {/* Local Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {filteredInsights.map((insight) => (
              <Card
                key={insight.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={insight.contributor.avatar} />
                        <AvatarFallback>
                          {insight.contributor.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {insight.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{insight.contributor.name}</span>
                          {insight.contributor.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <span>•</span>
                          <MapPin className="w-4 h-4" />
                          <span>
                            {insight.location.city}, {insight.location.region}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={getValidationStatusColor(
                        insight.validationStatus,
                      )}
                    >
                      {insight.validationStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{insight.description}</p>

                  {/* Investment Potential */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">
                        Risk Level
                      </div>
                      <Badge
                        variant={
                          insight.investmentPotential.riskLevel === "low"
                            ? "default"
                            : insight.investmentPotential.riskLevel === "medium"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {insight.investmentPotential.riskLevel}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">
                        Expected Return
                      </div>
                      <div className="font-semibold text-green-600">
                        {insight.investmentPotential.expectedReturn}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">
                        Min Investment
                      </div>
                      <div className="font-semibold">
                        $
                        {insight.investmentPotential.minInvestment.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">
                        Time Horizon
                      </div>
                      <div className="font-semibold">
                        {insight.investmentPotential.timeHorizon}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {insight.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Confidence Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Community Confidence</span>
                      <span>{insight.confidence}%</span>
                    </div>
                    <Progress value={insight.confidence} className="h-2" />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVoteInsight(insight.id, "up")}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {insight.upvotes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVoteInsight(insight.id, "down")}
                        className="flex items-center gap-1"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        {insight.downvotes}
                      </Button>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="w-4 h-4" />
                        {insight.comments}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        {insight.views}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button size="sm">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Invest
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Micro Vaults Tab */}
        <TabsContent value="micro-vaults" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {microVaults.map((vault) => (
              <Card
                key={vault.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{vault.name}</CardTitle>
                      <CardDescription>{vault.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        vault.status === "active"
                          ? "default"
                          : vault.status === "funding"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {vault.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Funding Progress</span>
                      <span>
                        {Math.round(
                          (vault.currentAmount / vault.targetAmount) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={(vault.currentAmount / vault.targetAmount) * 100}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${vault.currentAmount.toLocaleString()}</span>
                      <span>${vault.targetAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {vault.apy}%
                      </div>
                      <div className="text-xs text-muted-foreground">APY</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {vault.investors}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Investors
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Region:</span>
                      <span>{vault.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{vault.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Score:</span>
                      <span>{vault.riskScore}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Days Left:</span>
                      <span>{vault.daysLeft} days</span>
                    </div>
                  </div>

                  {/* Investment Range */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-1">
                      Investment Range
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${vault.minContribution.toLocaleString()} - $
                      {vault.maxContribution.toLocaleString()}
                    </div>
                  </div>

                  {/* Related Insights */}
                  {vault.insights.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Related Insights
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {vault.insights.slice(0, 3).map((insightId, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            Insight #{insightId.slice(-4)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    disabled={vault.status === "closed"}
                  >
                    {vault.status === "funding"
                      ? "Invest Now"
                      : vault.status === "active"
                        ? "View Details"
                        : "Closed"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Knowledge Graph Tab */}
        <TabsContent value="knowledge-graph" className="space-y-4">
          <Alert>
            <Network className="h-4 w-4" />
            <AlertTitle>Knowledge Network</AlertTitle>
            <AlertDescription>
              Explore connections between local experts, businesses, and
              opportunities based on Lynch's principles.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {knowledgeGraph.map((node) => (
              <Card key={node.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        node.type === "expert"
                          ? "bg-blue-100 text-blue-600"
                          : node.type === "business"
                            ? "bg-green-100 text-green-600"
                            : node.type === "opportunity"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                      }`}
                    >
                      {node.type === "expert" ? (
                        <Users className="w-5 h-5" />
                      ) : node.type === "business" ? (
                        <Building2 className="w-5 h-5" />
                      ) : node.type === "opportunity" ? (
                        <Lightbulb className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{node.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {node.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Network Strength</span>
                      <span>{node.strength}%</span>
                    </div>
                    <Progress value={node.strength} className="h-2" />
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Connections: </span>
                    <span className="font-medium">
                      {node.connections.length}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      Last Activity:{" "}
                    </span>
                    <span>
                      {new Date(node.lastActivity).toLocaleDateString()}
                    </span>
                  </div>

                  <Button variant="outline" className="w-full">
                    Explore Connections
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contributors Tab */}
        <TabsContent value="contributors" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.slice(0, 9).map((insight) => (
              <Card
                key={insight.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={insight.contributor.avatar} />
                      <AvatarFallback>
                        {insight.contributor.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {insight.contributor.name}
                      </CardTitle>
                      <CardDescription>
                        {insight.contributor.expertise}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">
                      {insight.contributor.reputation}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      reputation
                    </span>
                    {insight.contributor.verified && (
                      <Badge variant="secondary" className="text-xs ml-auto">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Location: </span>
                    <span>
                      {insight.location.city}, {insight.location.region}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Category: </span>
                    <Badge variant="outline" className="text-xs">
                      {insight.category}
                    </Badge>
                  </div>

                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
