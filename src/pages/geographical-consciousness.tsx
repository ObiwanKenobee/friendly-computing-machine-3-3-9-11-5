/**
 * Geographical Consciousness Integration Page
 * Spatial intelligence merged with age-based investment consciousness
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Globe,
  MapPin,
  Brain,
  Target,
  TrendingUp,
  Zap,
  Eye,
  Navigation,
  Layers,
  BarChart3,
  Users,
  Calendar,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import AgeSwitcher from "@/components/AgeSwitcher";
import SpatialConsciousnessMap from "@/components/SpatialConsciousnessMap";
import {
  GeographicalConsciousnessProvider,
  useGeographicalConsciousness,
} from "@/contexts/GeographicalConsciousnessContext";
import { useAgeContext } from "@/hooks/useAgeContext";
import { useMethuselahContext } from "@/contexts/MethuselahContext";

// Integration component that combines age and geographical consciousness
const GeographicalConsciousnessContent: React.FC = () => {
  const { currentAge, profile } = useAgeContext();
  const { simulation } = useMethuselahContext();
  const {
    consciousness,
    awareness,
    spatialRisk,
    territorialEvolution,
    updateLocation,
    findNearbyOpportunities,
    optimizeSpatialPortfolio,
    evolveTerritorialInfluence,
  } = useGeographicalConsciousness();

  const [selectedTab, setSelectedTab] = useState("spatial-map");
  const [integrationLevel, setIntegrationLevel] = useState<
    "basic" | "advanced" | "methuselah"
  >("basic");

  // Sync territorial evolution with Methuselah era
  useEffect(() => {
    if (simulation?.currentEra) {
      evolveTerritorialInfluence(simulation.currentEra);
    }
  }, [simulation?.currentEra, evolveTerritorialInfluence]);

  const getIntegrationInsights = () => {
    if (!currentAge || !consciousness.currentLocation) return [];

    const insights = [];

    // Age-based geographical insights
    if (currentAge === "18-25" || currentAge === "26-35") {
      insights.push({
        type: "age_insight",
        title: "Local Growth Focus",
        description: `At your age (${currentAge}), focus on understanding local markets before expanding globally.`,
        action: "Explore nearby tech hubs and emerging markets within 500km.",
      });
    } else if (currentAge === "36-50") {
      insights.push({
        type: "age_insight",
        title: "Regional Expansion",
        description:
          "Your experience allows for strategic regional investments.",
        action:
          "Consider cross-border opportunities in stable neighboring regions.",
      });
    } else if (currentAge === "51-65" || currentAge === "65+") {
      insights.push({
        type: "age_insight",
        title: "Global Diversification",
        description:
          "Leverage your network for worldwide investment opportunities.",
        action:
          "Focus on established markets with stable returns and currency hedging.",
      });
    }

    // Methuselah era insights
    if (simulation) {
      const era = simulation.currentEra;
      if (era === "18-50") {
        insights.push({
          type: "methuselah_insight",
          title: "Foundation Building",
          description:
            "Establish geographical footprint for centuries-long growth.",
          action:
            "Invest in locations with long-term stability and growth potential.",
        });
      } else if (era === "51-100") {
        insights.push({
          type: "methuselah_insight",
          title: "Territorial Expansion",
          description: "Build influence across multiple regions and markets.",
          action: "Acquire strategic assets in key global financial centers.",
        });
      } else if (era === "101-200") {
        insights.push({
          type: "methuselah_insight",
          title: "Planetary Consciousness",
          description: "Think beyond Earth for investment opportunities.",
          action:
            "Consider space-based assets and interplanetary resource claims.",
        });
      }
    }

    // Spatial risk insights
    const highRiskAreas = spatialRisk.filter((risk) => risk.overallRisk > 7);
    if (highRiskAreas.length > 0) {
      insights.push({
        type: "risk_insight",
        title: "Risk Mitigation Required",
        description: `${highRiskAreas.length} high-risk areas detected in your region.`,
        action: "Consider diversification or risk hedging strategies.",
      });
    }

    return insights;
  };

  const getAgeGeographicalAllocation = () => {
    if (!currentAge) return consciousness.spatialPortfolio;

    // Adjust geographical allocation based on age
    const ageAllocations: Record<
      string,
      typeof consciousness.spatialPortfolio
    > = {
      "18-25": {
        domestic: 60,
        regional: 25,
        international: 10,
        emerging: 3,
        frontier: 1,
        space: 1,
      },
      "26-35": {
        domestic: 50,
        regional: 30,
        international: 15,
        emerging: 3,
        frontier: 1,
        space: 1,
      },
      "36-50": {
        domestic: 40,
        regional: 25,
        international: 25,
        emerging: 7,
        frontier: 2,
        space: 1,
      },
      "51-65": {
        domestic: 35,
        regional: 20,
        international: 30,
        emerging: 10,
        frontier: 3,
        space: 2,
      },
      "65+": {
        domestic: 45,
        regional: 25,
        international: 20,
        emerging: 6,
        frontier: 2,
        space: 2,
      },
    };

    return ageAllocations[currentAge] || consciousness.spatialPortfolio;
  };

  const getMethuselahTerritorialScope = () => {
    if (!simulation) return "Local";

    const scopes: Record<string, string> = {
      "18-50": "Local to National",
      "51-100": "Regional to International",
      "101-200": "Global to Planetary",
      "201-400": "Interplanetary to Solar System",
      "401-600": "Interstellar to Galactic",
      "601-800": "Universal to Dimensional",
      "801-969": "Cosmic to Transcendent",
    };

    return scopes[simulation.currentEra] || "Local";
  };

  const integrationInsights = getIntegrationInsights();
  const ageBasedAllocation = getAgeGeographicalAllocation();
  const territorialScope = getMethuselahTerritorialScope();

  return (
    <div className="space-y-8">
      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Consciousness Integration Status
          </CardTitle>
          <CardDescription>
            Age-based and geographical intelligence working together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Age Consciousness</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {currentAge || "Not Set"}
              </div>
              <div className="text-sm text-muted-foreground">
                {profile?.label || "No age profile selected"}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <span className="font-medium">Spatial Awareness</span>
              </div>
              <div className="text-2xl font-bold text-green-700">
                {consciousness.currentLocation ? "Active" : "Inactive"}
              </div>
              <div className="text-sm text-muted-foreground">
                {consciousness.currentLocation
                  ? `${consciousness.spatialOpportunities.length} opportunities tracked`
                  : "Location access required"}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Territorial Scope</span>
              </div>
              <div className="text-lg font-bold text-purple-700">
                {territorialScope}
              </div>
              <div className="text-sm text-muted-foreground">
                Current era influence range
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spatial-map">Spatial Map</TabsTrigger>
          <TabsTrigger value="age-geography">Age + Geography</TabsTrigger>
          <TabsTrigger value="methuselah-territory">
            Methuselah Territory
          </TabsTrigger>
          <TabsTrigger value="insights">Integration Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="spatial-map" className="space-y-6">
          <SpatialConsciousnessMap
            height="500px"
            showControls={true}
            showOpportunities={true}
            showRiskHeatmap={false}
          />
        </TabsContent>

        <TabsContent value="age-geography" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age-Based Geographical Allocation</CardTitle>
                <CardDescription>
                  Optimal geographical distribution based on your age profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(ageBasedAllocation).map(
                  ([region, percentage]) => (
                    <div key={region} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="capitalize text-sm">
                          {region.replace("_", " ")}
                        </span>
                        <span className="font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ),
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Age-Appropriate Opportunities</CardTitle>
                <CardDescription>
                  Investment opportunities filtered by age suitability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {consciousness.spatialOpportunities
                  .filter((opp) =>
                    currentAge
                      ? opp.suitableForEras.includes(currentAge)
                      : true,
                  )
                  .slice(0, 3)
                  .map((opportunity) => (
                    <div key={opportunity.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">
                          {opportunity.name}
                        </h5>
                        <Badge variant="outline" className="text-xs">
                          {opportunity.sector}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          {opportunity.opportunity.expectedReturn}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3 text-blue-600" />
                          Risk: {opportunity.opportunity.riskLevel}/10
                        </span>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="methuselah-territory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Territorial Evolution Timeline</CardTitle>
                <CardDescription>
                  How your geographical influence expands across eras
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(territorialEvolution.spatialFocus).map(
                    ([era, focus]) => (
                      <div
                        key={era}
                        className="flex items-center justify-between p-2 rounded border"
                      >
                        <span className="text-sm font-medium">{era}</span>
                        <Badge
                          variant={
                            simulation?.currentEra === era
                              ? "default"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {focus.replace("_", " ")}
                        </Badge>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Era Territory</CardTitle>
                <CardDescription>
                  Your territorial influence in the{" "}
                  {simulation?.currentEra || "current"} era
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Influence Radius
                    </span>
                    <div className="font-bold">
                      {territorialEvolution.territorialInfluence.radius.toLocaleString()}{" "}
                      km
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Population Impact
                    </span>
                    <div className="font-bold">
                      {territorialEvolution.territorialInfluence.populations.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Economic Impact
                    </span>
                    <div className="font-bold">
                      $
                      {(
                        territorialEvolution.territorialInfluence
                          .economicImpact / 1e6
                      ).toFixed(1)}
                      M
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Political Influence
                    </span>
                    <div className="font-bold">
                      Level{" "}
                      {
                        territorialEvolution.territorialInfluence
                          .politicalInfluence
                      }
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h5 className="font-medium mb-2">Infrastructure Ownership</h5>
                  <div className="space-y-2 text-sm">
                    {Object.entries(
                      territorialEvolution.infrastructureOwnership,
                    ).map(([type, assets]) => (
                      <div key={type} className="flex justify-between">
                        <span className="capitalize">{type}:</span>
                        <span className="text-muted-foreground">
                          {assets.length}{" "}
                          {assets.length === 1 ? "asset" : "assets"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Integration Insights</h3>
            {integrationInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-full",
                          insight.type === "age_insight" && "bg-blue-100",
                          insight.type === "methuselah_insight" &&
                            "bg-purple-100",
                          insight.type === "risk_insight" && "bg-orange-100",
                        )}
                      >
                        {insight.type === "age_insight" && (
                          <Calendar className="h-4 w-4 text-blue-600" />
                        )}
                        {insight.type === "methuselah_insight" && (
                          <Rocket className="h-4 w-4 text-purple-600" />
                        )}
                        {insight.type === "risk_insight" && (
                          <Target className="h-4 w-4 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {insight.description}
                        </p>
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <strong>Recommended Action:</strong> {insight.action}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Integration Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span>Age-appropriate geographical strategies</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4 text-green-600" />
                  <span>Real-time spatial opportunity detection</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span>Risk-adjusted geographical allocation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-orange-600" />
                  <span>Multi-era territorial planning</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const GeographicalConsciousnessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Platform
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">
                  Geographical Consciousness
                </h1>
                <p className="text-muted-foreground">
                  Spatial intelligence integrated with age-based investment
                  consciousness
                </p>
              </div>
            </div>

            {/* Age Switcher */}
            <AgeSwitcher variant="header" className="w-64" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <GeographicalConsciousnessProvider>
          <GeographicalConsciousnessContent />
        </GeographicalConsciousnessProvider>
      </div>
    </div>
  );
};

export default GeographicalConsciousnessPage;
