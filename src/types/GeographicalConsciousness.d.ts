/**
 * Geographical Consciousness Types for QuantumVest Enterprise
 * Spatial intelligence for investment awareness across territories and eras
 */

export interface GeographicalCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface GeographicalRegion {
  id: string;
  name: string;
  type:
    | "country"
    | "continent"
    | "economic_zone"
    | "resource_region"
    | "tech_hub"
    | "emerging_market";
  coordinates: GeographicalCoordinates;
  boundingBox: {
    northeast: GeographicalCoordinates;
    southwest: GeographicalCoordinates;
  };
  metadata: {
    population: number;
    gdp: number;
    growthRate: number;
    stabilityIndex: number;
    innovationIndex: number;
    resourceRichness: number;
  };
}

export interface SpatialInvestmentOpportunity {
  id: string;
  name: string;
  description: string;
  location: GeographicalCoordinates;
  region: GeographicalRegion;
  sector: string;
  opportunity: {
    type:
      | "infrastructure"
      | "technology"
      | "resources"
      | "markets"
      | "demographics";
    timeframe: string;
    riskLevel: number;
    expectedReturn: number;
    minimumInvestment: number;
  };
  suitableForEras: string[];
  geopoliticalFactors: {
    stability: number;
    regulatoryEnvironment: number;
    currencyRisk: number;
    tradingRelations: number;
  };
  environmentalFactors: {
    climateRisk: number;
    sustainability: number;
    resourceAvailability: number;
  };
}

export interface GeographicalConsciousness {
  currentLocation: GeographicalCoordinates | null;
  trackedRegions: GeographicalRegion[];
  spatialOpportunities: SpatialInvestmentOpportunity[];
  geographicalPreferences: {
    riskTolerance: "local" | "regional" | "global" | "interplanetary";
    diversificationLevel: "concentrated" | "regional" | "global" | "cosmic";
    preferredRegions: string[];
    avoidedRegions: string[];
  };
  spatialPortfolio: {
    domestic: number;
    regional: number;
    international: number;
    emerging: number;
    frontier: number;
    space: number;
  };
  movementHistory: {
    timestamp: number;
    location: GeographicalCoordinates;
    purpose: "residence" | "business" | "investment" | "exploration";
    duration: number;
  }[];
}

export interface GeographicalAwareness {
  proximityOpportunities: SpatialInvestmentOpportunity[];
  regionalTrends: {
    region: string;
    trend: "emerging" | "growing" | "mature" | "declining";
    factors: string[];
    timeframe: string;
  }[];
  globalShifts: {
    shift: string;
    description: string;
    impact: "positive" | "negative" | "neutral";
    affectedRegions: string[];
    timeframe: string;
  }[];
  spatialRecommendations: {
    action: "invest" | "divest" | "monitor" | "explore";
    location: GeographicalCoordinates;
    reasoning: string;
    urgency: "low" | "medium" | "high";
  }[];
}

export interface MethuselahGeographicalEvolution {
  era: string;
  spatialFocus: {
    "18-50": "local_national";
    "51-100": "regional_international";
    "101-200": "global_planetary";
    "201-400": "interplanetary_solar";
    "401-600": "interstellar_galactic";
    "601-800": "universal_dimensional";
    "801-969": "cosmic_transcendent";
  };
  territorialInfluence: {
    radius: number; // in kilometers (or light-years for later eras)
    populations: number;
    economicImpact: number;
    politicalInfluence: number;
  };
  infrastructureOwnership: {
    terrestrial: string[];
    orbital: string[];
    lunar: string[];
    planetary: string[];
    interstellar: string[];
  };
}

export interface SpatialRiskAssessment {
  location: GeographicalCoordinates;
  riskFactors: {
    geopolitical: {
      level: number;
      factors: string[];
      mitigation: string[];
    };
    environmental: {
      level: number;
      factors: string[];
      adaptation: string[];
    };
    economic: {
      level: number;
      factors: string[];
      hedging: string[];
    };
    technological: {
      level: number;
      factors: string[];
      innovation: string[];
    };
  };
  overallRisk: number;
  recommendedActions: string[];
}

export interface GeographicalIntelligence {
  consciousness: GeographicalConsciousness;
  awareness: GeographicalAwareness;
  spatialRisk: SpatialRiskAssessment[];
  territorialEvolution: MethuselahGeographicalEvolution;
  recommendations: string[];
}

export interface GoogleMapsIntegration {
  apiKey: string;
  mapInstance: google.maps.Map | null;
  markers: google.maps.Marker[];
  infoWindows: google.maps.InfoWindow[];
  heatmapLayers: google.maps.visualization.HeatmapLayer[];
  customOverlays: google.maps.OverlayView[];
}

export interface GeographicalContextActions {
  updateLocation: (coordinates: GeographicalCoordinates) => void;
  addTrackedRegion: (region: GeographicalRegion) => void;
  removeTrackedRegion: (regionId: string) => void;
  findNearbyOpportunities: (radius: number) => SpatialInvestmentOpportunity[];
  calculateSpatialRisk: (
    location: GeographicalCoordinates,
  ) => SpatialRiskAssessment;
  optimizeSpatialPortfolio: () => void;
  trackMovement: (location: GeographicalCoordinates, purpose: string) => void;
  generateSpatialInsights: () => GeographicalAwareness;
  evolveTerritorialInfluence: (era: string) => void;
}

export type GeographicalConsciousnessType = GeographicalIntelligence &
  GeographicalContextActions;
