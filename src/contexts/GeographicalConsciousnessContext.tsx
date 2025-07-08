/**
 * Geographical Consciousness Context Provider
 * Spatial intelligence integration with age-based investment consciousness
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  GeographicalConsciousnessType,
  GeographicalCoordinates,
  GeographicalRegion,
  SpatialInvestmentOpportunity,
  GeographicalAwareness,
  SpatialRiskAssessment,
  GeographicalIntelligence,
} from "../types/GeographicalConsciousness";
import GeographicalConsciousnessService from "../services/geographicalConsciousnessService";

const GeographicalConsciousnessContext = createContext<
  GeographicalConsciousnessType | undefined
>(undefined);

interface GeographicalConsciousnessProviderProps {
  children: ReactNode;
  googleMapsApiKey?: string;
}

const GEOSPATIAL_STORAGE_KEY = "quantumvest_geographical_consciousness";

export const GeographicalConsciousnessProvider: React.FC<
  GeographicalConsciousnessProviderProps
> = ({
  children,
  googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
}) => {
  const [intelligence, setIntelligence] = useState<GeographicalIntelligence>({
    consciousness: {
      currentLocation: null,
      trackedRegions: [],
      spatialOpportunities: [],
      geographicalPreferences: {
        riskTolerance: "regional",
        diversificationLevel: "global",
        preferredRegions: [],
        avoidedRegions: [],
      },
      spatialPortfolio: {
        domestic: 40,
        regional: 25,
        international: 20,
        emerging: 10,
        frontier: 3,
        space: 2,
      },
      movementHistory: [],
    },
    awareness: {
      proximityOpportunities: [],
      regionalTrends: [],
      globalShifts: [],
      spatialRecommendations: [],
    },
    spatialRisk: [],
    territorialEvolution: {
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
        radius: 500,
        populations: 1000000,
        economicImpact: 10000000,
        politicalInfluence: 1,
      },
      infrastructureOwnership: {
        terrestrial: ["Local properties"],
        orbital: [],
        lunar: [],
        planetary: [],
        interstellar: [],
      },
    },
    recommendations: [],
  });

  const [consciousnessService] = useState(() =>
    GeographicalConsciousnessService.getInstance(),
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize geographical consciousness
  useEffect(() => {
    const initializeConsciousness = async () => {
      try {
        // Load saved consciousness data
        const saved = localStorage.getItem(GEOSPATIAL_STORAGE_KEY);
        if (saved) {
          const parsedData = JSON.parse(saved);
          setIntelligence((prev) => ({ ...prev, ...parsedData }));
        }

        // Initialize Google Maps if API key provided
        if (googleMapsApiKey) {
          await consciousnessService.initializeGoogleMaps(googleMapsApiKey);
        }

        // Get current location and generate initial consciousness
        try {
          const currentLocation =
            await consciousnessService.getCurrentLocation();
          updateLocation(currentLocation);
        } catch (locationError) {
          console.warn("Could not get current location:", locationError);
          // Use default location (e.g., San Francisco)
          updateLocation({ latitude: 37.7749, longitude: -122.4194 });
        }

        setIsInitialized(true);
      } catch (error) {
        console.error(
          "Failed to initialize geographical consciousness:",
          error,
        );
        setIsInitialized(true); // Still mark as initialized to prevent infinite loops
      }
    };

    initializeConsciousness();
  }, [googleMapsApiKey, consciousnessService]);

  // Save consciousness data when it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        const dataToSave = {
          consciousness: intelligence.consciousness,
          timestamp: Date.now(),
        };
        localStorage.setItem(
          GEOSPATIAL_STORAGE_KEY,
          JSON.stringify(dataToSave),
        );
      } catch (error) {
        console.error("Failed to save geographical consciousness:", error);
      }
    }
  }, [intelligence.consciousness, isInitialized]);

  const updateLocation = (coordinates: GeographicalCoordinates) => {
    setIntelligence((prev) => {
      const newConsciousness = {
        ...prev.consciousness,
        currentLocation: coordinates,
        movementHistory: [
          ...prev.consciousness.movementHistory,
          {
            timestamp: Date.now(),
            location: coordinates,
            purpose: "business" as const,
            duration: 0,
          },
        ].slice(-50), // Keep last 50 movements
      };

      // Generate new spatial opportunities and awareness
      const proximityOpportunities =
        consciousnessService.generateSpatialOpportunities(coordinates);
      const awareness =
        consciousnessService.generateGeographicalAwareness(coordinates);
      const spatialRisk = [
        consciousnessService.calculateSpatialRisk(coordinates),
      ];

      return {
        ...prev,
        consciousness: {
          ...newConsciousness,
          spatialOpportunities: proximityOpportunities,
        },
        awareness,
        spatialRisk,
        recommendations: awareness.spatialRecommendations.map(
          (rec) => rec.reasoning,
        ),
      };
    });
  };

  const addTrackedRegion = (region: GeographicalRegion) => {
    setIntelligence((prev) => ({
      ...prev,
      consciousness: {
        ...prev.consciousness,
        trackedRegions: [...prev.consciousness.trackedRegions, region],
      },
    }));
  };

  const removeTrackedRegion = (regionId: string) => {
    setIntelligence((prev) => ({
      ...prev,
      consciousness: {
        ...prev.consciousness,
        trackedRegions: prev.consciousness.trackedRegions.filter(
          (r) => r.id !== regionId,
        ),
      },
    }));
  };

  const findNearbyOpportunities = (
    radius: number,
  ): SpatialInvestmentOpportunity[] => {
    if (!intelligence.consciousness.currentLocation) return [];

    return intelligence.consciousness.spatialOpportunities.filter(
      (opportunity) => {
        const distance = calculateDistance(
          intelligence.consciousness.currentLocation!,
          opportunity.location,
        );
        return distance <= radius;
      },
    );
  };

  const calculateSpatialRisk = (
    location: GeographicalCoordinates,
  ): SpatialRiskAssessment => {
    return consciousnessService.calculateSpatialRisk(location);
  };

  const optimizeSpatialPortfolio = () => {
    setIntelligence((prev) => {
      // Simple optimization based on current awareness
      const awareness = prev.awareness;
      const newPortfolio = { ...prev.consciousness.spatialPortfolio };

      // Adjust based on global shifts and trends
      const positiveShifts = awareness.globalShifts.filter(
        (shift) => shift.impact === "positive",
      );
      const emergingTrends = awareness.regionalTrends.filter(
        (trend) => trend.trend === "emerging",
      );

      if (positiveShifts.length > 0) {
        // Increase international exposure
        newPortfolio.international = Math.min(
          35,
          newPortfolio.international + 5,
        );
        newPortfolio.domestic = Math.max(20, newPortfolio.domestic - 5);
      }

      if (emergingTrends.length > 0) {
        // Increase emerging market exposure
        newPortfolio.emerging = Math.min(20, newPortfolio.emerging + 3);
        newPortfolio.regional = Math.max(15, newPortfolio.regional - 3);
      }

      return {
        ...prev,
        consciousness: {
          ...prev.consciousness,
          spatialPortfolio: newPortfolio,
        },
      };
    });
  };

  const trackMovement = (
    location: GeographicalCoordinates,
    purpose: string,
  ) => {
    setIntelligence((prev) => ({
      ...prev,
      consciousness: {
        ...prev.consciousness,
        movementHistory: [
          ...prev.consciousness.movementHistory,
          {
            timestamp: Date.now(),
            location,
            purpose: purpose as any,
            duration: 0,
          },
        ].slice(-100), // Keep last 100 movements
      },
    }));
  };

  const generateSpatialInsights = (): GeographicalAwareness => {
    if (!intelligence.consciousness.currentLocation) {
      return intelligence.awareness;
    }

    return consciousnessService.generateGeographicalAwareness(
      intelligence.consciousness.currentLocation,
    );
  };

  const evolveTerritorialInfluence = (era: string) => {
    const newEvolution = consciousnessService.generateTerritorialEvolution(era);
    setIntelligence((prev) => ({
      ...prev,
      territorialEvolution: newEvolution,
    }));
  };

  // Helper function to calculate distance between two coordinates
  const calculateDistance = (
    coord1: GeographicalCoordinates,
    coord2: GeographicalCoordinates,
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.latitude * Math.PI) / 180) *
        Math.cos((coord2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const contextValue: GeographicalConsciousnessType = {
    ...intelligence,
    updateLocation,
    addTrackedRegion,
    removeTrackedRegion,
    findNearbyOpportunities,
    calculateSpatialRisk,
    optimizeSpatialPortfolio,
    trackMovement,
    generateSpatialInsights,
    evolveTerritorialInfluence,
  };

  return (
    <GeographicalConsciousnessContext.Provider value={contextValue}>
      {children}
    </GeographicalConsciousnessContext.Provider>
  );
};

export const useGeographicalConsciousness =
  (): GeographicalConsciousnessType => {
    const context = useContext(GeographicalConsciousnessContext);
    if (!context) {
      throw new Error(
        "useGeographicalConsciousness must be used within a GeographicalConsciousnessProvider",
      );
    }
    return context;
  };

export default GeographicalConsciousnessProvider;
