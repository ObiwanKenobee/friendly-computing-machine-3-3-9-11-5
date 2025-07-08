/**
 * Geographical Consciousness Service
 * Intelligent spatial awareness system for investment consciousness
 */

import {
  GeographicalCoordinates,
  GeographicalRegion,
  SpatialInvestmentOpportunity,
  GeographicalAwareness,
  SpatialRiskAssessment,
  MethuselahGeographicalEvolution,
} from "../types/GeographicalConsciousness";

class GeographicalConsciousnessService {
  private static instance: GeographicalConsciousnessService;
  private googleMapsLoaded: boolean = false;
  private mapInstance: google.maps.Map | null = null;

  static getInstance(): GeographicalConsciousnessService {
    if (!GeographicalConsciousnessService.instance) {
      GeographicalConsciousnessService.instance =
        new GeographicalConsciousnessService();
    }
    return GeographicalConsciousnessService.instance;
  }

  // Initialize Google Maps API
  async initializeGoogleMaps(apiKey: string): Promise<void> {
    if (this.googleMapsLoaded) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization,geometry`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.googleMapsLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google Maps API"));
      };

      document.head.appendChild(script);
    });
  }

  // Create map instance with investment consciousness overlay
  createConsciousnessMap(
    container: HTMLElement,
    center: GeographicalCoordinates,
  ): google.maps.Map {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: center.latitude, lng: center.longitude },
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.HYBRID,
      styles: this.getConsciousnessMapStyles(),
      gestureHandling: "greedy",
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    };

    this.mapInstance = new google.maps.Map(container, mapOptions);
    return this.mapInstance;
  }

  // Custom map styles for consciousness visualization
  private getConsciousnessMapStyles(): google.maps.MapTypeStyle[] {
    return [
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#1e3a8a" }, { lightness: 17 }],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [{ color: "#7c3aed" }, { lightness: 17 }],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#f59e0b" }, { lightness: 21 }],
      },
    ];
  }

  // Get current user location
  async getCurrentLocation(): Promise<GeographicalCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        },
      );
    });
  }

  // Generate spatial investment opportunities based on location
  generateSpatialOpportunities(
    location: GeographicalCoordinates,
  ): SpatialInvestmentOpportunity[] {
    // This would typically integrate with real market data APIs
    const opportunities: SpatialInvestmentOpportunity[] = [
      {
        id: "renewable_energy_solar_farm",
        name: "Solar Farm Development",
        description: "Large-scale solar energy infrastructure development",
        location: {
          latitude: location.latitude + 0.1,
          longitude: location.longitude + 0.1,
        },
        region: {
          id: "local_region",
          name: "Local Energy Corridor",
          type: "economic_zone",
          coordinates: location,
          boundingBox: {
            northeast: {
              latitude: location.latitude + 0.2,
              longitude: location.longitude + 0.2,
            },
            southwest: {
              latitude: location.latitude - 0.2,
              longitude: location.longitude - 0.2,
            },
          },
          metadata: {
            population: 500000,
            gdp: 25000000000,
            growthRate: 3.2,
            stabilityIndex: 8.5,
            innovationIndex: 7.8,
            resourceRichness: 9.2,
          },
        },
        sector: "Renewable Energy",
        opportunity: {
          type: "infrastructure",
          timeframe: "5-10 years",
          riskLevel: 4,
          expectedReturn: 12.5,
          minimumInvestment: 10000000,
        },
        suitableForEras: ["18-50", "51-100"],
        geopoliticalFactors: {
          stability: 8.5,
          regulatoryEnvironment: 7.2,
          currencyRisk: 3.1,
          tradingRelations: 8.8,
        },
        environmentalFactors: {
          climateRisk: 2.3,
          sustainability: 9.5,
          resourceAvailability: 8.9,
        },
      },
      {
        id: "tech_hub_development",
        name: "Technology Innovation Hub",
        description: "AI and quantum computing research facility",
        location: {
          latitude: location.latitude - 0.05,
          longitude: location.longitude + 0.15,
        },
        region: {
          id: "tech_corridor",
          name: "Innovation Corridor",
          type: "tech_hub",
          coordinates: {
            latitude: location.latitude - 0.05,
            longitude: location.longitude + 0.15,
          },
          boundingBox: {
            northeast: {
              latitude: location.latitude + 0.1,
              longitude: location.longitude + 0.3,
            },
            southwest: {
              latitude: location.latitude - 0.2,
              longitude: location.longitude,
            },
          },
          metadata: {
            population: 2000000,
            gdp: 85000000000,
            growthRate: 5.8,
            stabilityIndex: 9.2,
            innovationIndex: 9.8,
            resourceRichness: 6.5,
          },
        },
        sector: "Technology",
        opportunity: {
          type: "technology",
          timeframe: "3-7 years",
          riskLevel: 6,
          expectedReturn: 18.7,
          minimumInvestment: 25000000,
        },
        suitableForEras: ["18-50", "51-100", "101-200"],
        geopoliticalFactors: {
          stability: 9.1,
          regulatoryEnvironment: 8.5,
          currencyRisk: 2.8,
          tradingRelations: 9.3,
        },
        environmentalFactors: {
          climateRisk: 3.2,
          sustainability: 7.8,
          resourceAvailability: 8.1,
        },
      },
    ];

    return opportunities;
  }

  // Calculate spatial risk for a given location
  calculateSpatialRisk(
    location: GeographicalCoordinates,
  ): SpatialRiskAssessment {
    // This would integrate with real geopolitical and environmental risk APIs
    return {
      location,
      riskFactors: {
        geopolitical: {
          level: 3.2,
          factors: ["Regional tensions", "Election uncertainty"],
          mitigation: ["Diversification", "Political risk insurance"],
        },
        environmental: {
          level: 4.1,
          factors: ["Climate change", "Natural disasters"],
          adaptation: ["Resilient infrastructure", "Climate hedging"],
        },
        economic: {
          level: 2.8,
          factors: ["Currency volatility", "Inflation risk"],
          hedging: ["Currency forwards", "Commodity exposure"],
        },
        technological: {
          level: 1.9,
          factors: ["Cyber security", "Technology disruption"],
          innovation: ["Security protocols", "Technology partnerships"],
        },
      },
      overallRisk: 3.0,
      recommendedActions: [
        "Implement geographical diversification",
        "Monitor political developments",
        "Establish local partnerships",
        "Consider climate adaptation measures",
      ],
    };
  }

  // Generate geographical awareness insights
  generateGeographicalAwareness(
    currentLocation: GeographicalCoordinates,
  ): GeographicalAwareness {
    const proximityOpportunities =
      this.generateSpatialOpportunities(currentLocation);

    return {
      proximityOpportunities,
      regionalTrends: [
        {
          region: "Southeast Asia",
          trend: "emerging",
          factors: [
            "Digital transformation",
            "Young demographics",
            "Infrastructure development",
          ],
          timeframe: "2024-2030",
        },
        {
          region: "Sub-Saharan Africa",
          trend: "growing",
          factors: [
            "Resource discovery",
            "Mobile technology adoption",
            "Urbanization",
          ],
          timeframe: "2024-2035",
        },
        {
          region: "Arctic Region",
          trend: "emerging",
          factors: [
            "Climate change access",
            "Resource exploration",
            "Geopolitical interest",
          ],
          timeframe: "2030-2050",
        },
      ],
      globalShifts: [
        {
          shift: "Space Economy Expansion",
          description: "Rapid growth in space-based economic activities",
          impact: "positive",
          affectedRegions: ["North America", "Europe", "Asia-Pacific"],
          timeframe: "2024-2040",
        },
        {
          shift: "Climate Migration",
          description: "Large-scale population movements due to climate change",
          impact: "negative",
          affectedRegions: [
            "Pacific Islands",
            "Sub-Saharan Africa",
            "South Asia",
          ],
          timeframe: "2025-2050",
        },
      ],
      spatialRecommendations: [
        {
          action: "invest",
          location: {
            latitude: currentLocation.latitude + 1.0,
            longitude: currentLocation.longitude + 1.0,
          },
          reasoning: "Emerging technology hub with favorable demographics",
          urgency: "high",
        },
        {
          action: "monitor",
          location: {
            latitude: currentLocation.latitude - 2.0,
            longitude: currentLocation.longitude + 3.0,
          },
          reasoning: "Political instability but resource potential",
          urgency: "medium",
        },
      ],
    };
  }

  // Create Methuselah geographical evolution for different eras
  generateTerritorialEvolution(era: string): MethuselahGeographicalEvolution {
    const evolutionMap: Record<string, MethuselahGeographicalEvolution> = {
      "18-50": {
        era: "18-50",
        spatialFocus: {
          "18-50": "local_national",
          "51-100": "regional_international",
          "101-200": "global_planetary",
          "201-400": "interplanetary_solar",
          "401-600": "interstellar_galactic",
          "601-800": "universal_dimensional",
          "801-969": "cosmic_transcendent",
        },
        territorialInfluence: {
          radius: 500, // 500 km
          populations: 1000000,
          economicImpact: 10000000,
          politicalInfluence: 1,
        },
        infrastructureOwnership: {
          terrestrial: ["Local properties", "Regional businesses"],
          orbital: [],
          lunar: [],
          planetary: [],
          interstellar: [],
        },
      },
      "51-100": {
        era: "51-100",
        spatialFocus: {
          "18-50": "local_national",
          "51-100": "regional_international",
          "101-200": "global_planetary",
          "201-400": "interplanetary_solar",
          "401-600": "interstellar_galactic",
          "601-800": "universal_dimensional",
          "801-969": "cosmic_transcendent",
        },
        territorialInfluence: {
          radius: 5000, // 5,000 km
          populations: 50000000,
          economicImpact: 1000000000,
          politicalInfluence: 5,
        },
        infrastructureOwnership: {
          terrestrial: [
            "Multiple cities",
            "Industrial complexes",
            "Transportation networks",
          ],
          orbital: ["Satellite constellation"],
          lunar: [],
          planetary: [],
          interstellar: [],
        },
      },
      "201-400": {
        era: "201-400",
        spatialFocus: {
          "18-50": "local_national",
          "51-100": "regional_international",
          "101-200": "global_planetary",
          "201-400": "interplanetary_solar",
          "401-600": "interstellar_galactic",
          "601-800": "universal_dimensional",
          "801-969": "cosmic_transcendent",
        },
        territorialInfluence: {
          radius: 149597870, // 1 AU (Earth-Sun distance)
          populations: 10000000000,
          economicImpact: 1000000000000000,
          politicalInfluence: 100,
        },
        infrastructureOwnership: {
          terrestrial: ["Continental regions", "Ocean cities"],
          orbital: ["Space elevators", "Orbital cities"],
          lunar: ["Moon bases", "Mining operations"],
          planetary: ["Mars colonies", "Asteroid mining"],
          interstellar: [],
        },
      },
      "601-800": {
        era: "601-800",
        spatialFocus: {
          "18-50": "local_national",
          "51-100": "regional_international",
          "101-200": "global_planetary",
          "201-400": "interplanetary_solar",
          "401-600": "interstellar_galactic",
          "601-800": "universal_dimensional",
          "801-969": "cosmic_transcendent",
        },
        territorialInfluence: {
          radius: 946073047258080000, // 100,000 light years (galaxy diameter)
          populations: 1000000000000000,
          economicImpact: Number.MAX_SAFE_INTEGER,
          politicalInfluence: 10000,
        },
        infrastructureOwnership: {
          terrestrial: ["Planetary management"],
          orbital: ["Dyson spheres"],
          lunar: ["Terraformed moons"],
          planetary: ["Star system control"],
          interstellar: ["Galactic infrastructure", "Wormhole networks"],
        },
      },
    };

    return evolutionMap[era] || evolutionMap["18-50"];
  }

  // Add investment opportunity markers to map
  addOpportunityMarkers(
    opportunities: SpatialInvestmentOpportunity[],
  ): google.maps.Marker[] {
    if (!this.mapInstance) return [];

    const markers = opportunities.map((opportunity) => {
      const marker = new google.maps.Marker({
        position: {
          lat: opportunity.location.latitude,
          lng: opportunity.location.longitude,
        },
        map: this.mapInstance,
        title: opportunity.name,
        icon: this.getOpportunityIcon(opportunity.opportunity.type),
      });

      const infoWindow = new google.maps.InfoWindow({
        content: this.createOpportunityInfoWindow(opportunity),
      });

      marker.addListener("click", () => {
        infoWindow.open(this.mapInstance, marker);
      });

      return marker;
    });

    return markers;
  }

  // Get custom icons for different opportunity types
  private getOpportunityIcon(type: string): google.maps.Icon {
    const iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
    const icons: Record<string, string> = {
      infrastructure: iconBase + "cabs.png",
      technology: iconBase + "electronics.png",
      resources: iconBase + "mining.png",
      markets: iconBase + "shopping.png",
      demographics: iconBase + "schools.png",
    };

    return {
      url: icons[type] || iconBase + "placemark_circle.png",
      scaledSize: new google.maps.Size(32, 32),
    };
  }

  // Create info window content for opportunities
  private createOpportunityInfoWindow(
    opportunity: SpatialInvestmentOpportunity,
  ): string {
    return `
      <div style="max-width: 300px; padding: 10px;">
        <h3 style="margin: 0 0 10px 0; color: #1e40af;">${opportunity.name}</h3>
        <p style="margin: 0 0 10px 0; font-size: 14px;">${opportunity.description}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
          <div><strong>Sector:</strong> ${opportunity.sector}</div>
          <div><strong>Risk:</strong> ${opportunity.opportunity.riskLevel}/10</div>
          <div><strong>Return:</strong> ${opportunity.opportunity.expectedReturn}%</div>
          <div><strong>Timeframe:</strong> ${opportunity.opportunity.timeframe}</div>
        </div>
        <div style="margin-top: 10px; padding: 8px; background: #f3f4f6; border-radius: 4px;">
          <strong>Investment Required:</strong> $${(opportunity.opportunity.minimumInvestment / 1000000).toFixed(1)}M
        </div>
      </div>
    `;
  }

  // Create heatmap for risk distribution
  createRiskHeatmap(
    riskData: { location: GeographicalCoordinates; intensity: number }[],
  ): google.maps.visualization.HeatmapLayer {
    if (!this.mapInstance) throw new Error("Map not initialized");

    const heatmapData = riskData.map((point) => ({
      location: new google.maps.LatLng(
        point.location.latitude,
        point.location.longitude,
      ),
      weight: point.intensity,
    }));

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: this.mapInstance,
    });

    heatmap.set("gradient", [
      "rgba(0, 255, 255, 0)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 63, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 0, 223, 1)",
      "rgba(0, 0, 191, 1)",
      "rgba(0, 0, 159, 1)",
      "rgba(0, 0, 127, 1)",
      "rgba(63, 0, 91, 1)",
      "rgba(127, 0, 63, 1)",
      "rgba(191, 0, 31, 1)",
      "rgba(255, 0, 0, 1)",
    ]);

    return heatmap;
  }
}

export default GeographicalConsciousnessService;
