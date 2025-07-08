/**
 * Spatial Consciousness Map Component
 * Interactive Google Maps integration with investment consciousness overlay
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
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
import { Separator } from "./ui/separator";
import {
  MapPin,
  Target,
  TrendingUp,
  AlertTriangle,
  Navigation,
  Layers,
  Filter,
  Zap,
  Globe,
  BarChart3,
  Eye,
  RefreshCw,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGeographicalConsciousness } from "../contexts/GeographicalConsciousnessContext";
import GeographicalConsciousnessService from "../services/geographicalConsciousnessService";
import { SpatialInvestmentOpportunity } from "../types/GeographicalConsciousness";

interface SpatialConsciousnessMapProps {
  className?: string;
  height?: string;
  showControls?: boolean;
  showOpportunities?: boolean;
  showRiskHeatmap?: boolean;
}

const SpatialConsciousnessMap: React.FC<SpatialConsciousnessMapProps> = ({
  className,
  height = "600px",
  showControls = true,
  showOpportunities = true,
  showRiskHeatmap = false,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [selectedTab, setSelectedTab] = useState("opportunities");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<
    "hybrid" | "satellite" | "terrain" | "roadmap"
  >("hybrid");

  const {
    consciousness,
    awareness,
    spatialRisk,
    territorialEvolution,
    updateLocation,
    findNearbyOpportunities,
    generateSpatialInsights,
    optimizeSpatialPortfolio,
  } = useGeographicalConsciousness();

  const consciousnessService = GeographicalConsciousnessService.getInstance();

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current || !consciousness.currentLocation) return;

      try {
        const map = consciousnessService.createConsciousnessMap(
          mapRef.current,
          consciousness.currentLocation,
        );
        setMapInstance(map);

        // Add click listener for location updates
        map.addListener("click", (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const newLocation = {
              latitude: event.latLng.lat(),
              longitude: event.latLng.lng(),
            };
            updateLocation(newLocation);
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize map:", error);
        setIsLoading(false);
      }
    };

    if (consciousness.currentLocation) {
      initializeMap();
    }
  }, [consciousness.currentLocation, consciousnessService, updateLocation]);

  // Update map view mode
  useEffect(() => {
    if (mapInstance) {
      const mapTypes: Record<typeof viewMode, google.maps.MapTypeId> = {
        hybrid: google.maps.MapTypeId.HYBRID,
        satellite: google.maps.MapTypeId.SATELLITE,
        terrain: google.maps.MapTypeId.TERRAIN,
        roadmap: google.maps.MapTypeId.ROADMAP,
      };
      mapInstance.setMapTypeId(mapTypes[viewMode]);
    }
  }, [mapInstance, viewMode]);

  // Add opportunity markers
  useEffect(() => {
    if (
      mapInstance &&
      showOpportunities &&
      consciousness.spatialOpportunities.length > 0
    ) {
      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null));

      // Add new markers
      const newMarkers = consciousnessService.addOpportunityMarkers(
        consciousness.spatialOpportunities,
      );
      setMarkers(newMarkers);
    }
  }, [
    mapInstance,
    showOpportunities,
    consciousness.spatialOpportunities,
    consciousnessService,
  ]);

  // Add risk heatmap
  useEffect(() => {
    if (mapInstance && showRiskHeatmap && spatialRisk.length > 0) {
      const riskData = spatialRisk.map((risk) => ({
        location: risk.location,
        intensity: risk.overallRisk / 10, // Normalize to 0-1
      }));

      consciousnessService.createRiskHeatmap(riskData);
    }
  }, [mapInstance, showRiskHeatmap, spatialRisk, consciousnessService]);

  const handleLocationRefresh = useCallback(async () => {
    try {
      const newLocation = await consciousnessService.getCurrentLocation();
      updateLocation(newLocation);

      if (mapInstance) {
        mapInstance.panTo({
          lat: newLocation.latitude,
          lng: newLocation.longitude,
        });
      }
    } catch (error) {
      console.error("Failed to get current location:", error);
    }
  }, [consciousnessService, updateLocation, mapInstance]);

  const handleOptimizePortfolio = useCallback(() => {
    optimizeSpatialPortfolio();
    // Refresh insights
    generateSpatialInsights();
  }, [optimizeSpatialPortfolio, generateSpatialInsights]);

  const formatCurrency = (amount: number): string => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-2">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="text-muted-foreground">
              Initializing spatial consciousness...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Controls Panel */}
      {showControls && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Spatial Consciousness Control
            </CardTitle>
            <CardDescription>
              Navigate and analyze geographical investment opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLocationRefresh}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Current Location
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOptimizePortfolio}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Optimize Portfolio
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">View:</span>
                {(["hybrid", "satellite", "terrain", "roadmap"] as const).map(
                  (mode) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode(mode)}
                      className="capitalize"
                    >
                      {mode}
                    </Button>
                  ),
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  <MapPin className="h-3 w-3 mr-1" />
                  {consciousness.currentLocation
                    ? `${consciousness.currentLocation.latitude.toFixed(4)}, ${consciousness.currentLocation.longitude.toFixed(4)}`
                    : "No location"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div
                ref={mapRef}
                style={{ height, width: "100%" }}
                className="rounded-lg overflow-hidden"
              />
            </CardContent>
          </Card>
        </div>

        {/* Information Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spatial Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="opportunities" className="space-y-3">
                  <div className="space-y-3">
                    <h4 className="font-medium">Nearby Opportunities</h4>
                    {consciousness.spatialOpportunities
                      .slice(0, 3)
                      .map((opportunity) => (
                        <div
                          key={opportunity.id}
                          className="border rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">
                              {opportunity.name}
                            </h5>
                            <Badge variant="outline" className="text-xs">
                              {opportunity.sector}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {opportunity.description.slice(0, 80)}...
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-green-600" />
                              {opportunity.opportunity.expectedReturn}%
                            </span>
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-orange-600" />
                              Risk: {opportunity.opportunity.riskLevel}/10
                            </span>
                          </div>
                          <div className="mt-2 text-xs font-medium">
                            Min:{" "}
                            {formatCurrency(
                              opportunity.opportunity.minimumInvestment,
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-3">
                  <div className="space-y-3">
                    <h4 className="font-medium">
                      Spatial Portfolio Distribution
                    </h4>
                    {Object.entries(consciousness.spatialPortfolio).map(
                      ([region, percentage]) => (
                        <div key={region} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">
                              {region.replace("_", " ")}
                            </span>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      ),
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">
                      Territorial Evolution
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Era:</span>
                        <div className="font-medium">
                          {territorialEvolution.era}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Influence:
                        </span>
                        <div className="font-medium">
                          {territorialEvolution.territorialInfluence.radius.toLocaleString()}{" "}
                          km
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="space-y-3">
                  <div className="space-y-3">
                    <h4 className="font-medium">Regional Trends</h4>
                    {awareness.regionalTrends
                      .slice(0, 2)
                      .map((trend, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium text-sm">
                              {trend.region}
                            </h5>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                trend.trend === "emerging" &&
                                  "border-green-500 text-green-700",
                                trend.trend === "growing" &&
                                  "border-blue-500 text-blue-700",
                              )}
                            >
                              {trend.trend}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {trend.factors.slice(0, 2).join(", ")}
                          </div>
                          <div className="text-xs mt-1 font-medium">
                            Timeframe: {trend.timeframe}
                          </div>
                        </div>
                      ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Risk Assessment</h5>
                    {spatialRisk.slice(0, 1).map((risk, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Risk</span>
                          <span className="font-medium">
                            {risk.overallRisk.toFixed(1)}/10
                          </span>
                        </div>
                        <Progress
                          value={risk.overallRisk * 10}
                          className="h-2"
                        />
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            Geopolitical:{" "}
                            {risk.riskFactors.geopolitical.level.toFixed(1)}
                          </div>
                          <div>
                            Environmental:{" "}
                            {risk.riskFactors.environmental.level.toFixed(1)}
                          </div>
                          <div>
                            Economic:{" "}
                            {risk.riskFactors.economic.level.toFixed(1)}
                          </div>
                          <div>
                            Technology:{" "}
                            {risk.riskFactors.technological.level.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SpatialConsciousnessMap;
