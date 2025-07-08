/**
 * Geographical Configuration for QuantumVest
 * Google Maps API and spatial intelligence settings
 */

export const GEOGRAPHICAL_CONFIG = {
  // Google Maps API Configuration
  MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  MAPS_LIBRARIES: ["visualization", "geometry"],

  // Default map settings
  DEFAULT_LOCATION: {
    latitude: 37.7749, // San Francisco
    longitude: -122.4194,
  },

  // Spatial consciousness settings
  PROXIMITY_RADIUS: 100, // km
  RISK_UPDATE_INTERVAL: 300000, // 5 minutes
  OPPORTUNITY_REFRESH_INTERVAL: 600000, // 10 minutes

  // Age-based geographical preferences
  AGE_GEOGRAPHICAL_DEFAULTS: {
    "18-25": {
      maxDistance: 500, // km
      riskTolerance: "moderate",
      preferredRegions: ["local", "national"],
    },
    "26-35": {
      maxDistance: 1000,
      riskTolerance: "moderate",
      preferredRegions: ["national", "regional"],
    },
    "36-50": {
      maxDistance: 5000,
      riskTolerance: "balanced",
      preferredRegions: ["regional", "international"],
    },
    "51-65": {
      maxDistance: 10000,
      riskTolerance: "conservative",
      preferredRegions: ["international", "global"],
    },
    "65+": {
      maxDistance: 15000,
      riskTolerance: "conservative",
      preferredRegions: ["global", "stable_markets"],
    },
  },

  // Methuselah era spatial evolution
  METHUSELAH_TERRITORIAL_EVOLUTION: {
    "18-50": {
      scale: "terrestrial",
      maxRadius: 1000, // km
      focusAreas: ["local_markets", "regional_hubs"],
    },
    "51-100": {
      scale: "continental",
      maxRadius: 10000,
      focusAreas: ["continental_markets", "international_hubs"],
    },
    "101-200": {
      scale: "planetary",
      maxRadius: 20000,
      focusAreas: ["global_markets", "planetary_infrastructure"],
    },
    "201-400": {
      scale: "solar_system",
      maxRadius: 149597870, // 1 AU
      focusAreas: ["interplanetary_assets", "space_resources"],
    },
    "401-600": {
      scale: "interstellar",
      maxRadius: 946073047258080000, // 100,000 light years
      focusAreas: ["star_systems", "galactic_infrastructure"],
    },
    "601-800": {
      scale: "galactic",
      maxRadius: Number.MAX_SAFE_INTEGER,
      focusAreas: ["galactic_governance", "universal_resources"],
    },
    "801-969": {
      scale: "universal",
      maxRadius: Number.MAX_SAFE_INTEGER,
      focusAreas: ["dimensional_assets", "cosmic_stewardship"],
    },
  },
};

export const validateMapsApiKey = (): boolean => {
  const apiKey = GEOGRAPHICAL_CONFIG.MAPS_API_KEY;
  return !!(
    apiKey &&
    apiKey.length > 0 &&
    apiKey !== "your_google_maps_api_key_here"
  );
};

export const getDefaultLocationForAge = (age: string) => {
  return (
    GEOGRAPHICAL_CONFIG.AGE_GEOGRAPHICAL_DEFAULTS[age] ||
    GEOGRAPHICAL_CONFIG.AGE_GEOGRAPHICAL_DEFAULTS["36-50"]
  );
};

export const getTerritorialEvolutionForEra = (era: string) => {
  return (
    GEOGRAPHICAL_CONFIG.METHUSELAH_TERRITORIAL_EVOLUTION[era] ||
    GEOGRAPHICAL_CONFIG.METHUSELAH_TERRITORIAL_EVOLUTION["18-50"]
  );
};
