export interface EcosystemData {
  totalArea: number; // hectares
  protectedArea: number;
  restoredArea: number;
  healthScore: number; // 0-100
  carbonSequestration: number; // tons CO2/year
  keySpecies: string[];
  threatLevel: "Low" | "Moderate" | "High" | "Critical";
}

export interface WildlifeConservationMetrics {
  overview: {
    totalProtectedSpecies: number;
    activeConservationProjects: number;
    protectedLandArea: number; // hectares
    wildlifePopulationTrend: number; // % change
    habitatRestoration: number; // hectares
    threatReduction: number; // % reduction
    communityEngagement: number; // people involved
    sustainabilityScore: number; // 0-100
  };
  ecosystems: {
    forests: EcosystemData;
    oceans: EcosystemData;
    grasslands: EcosystemData;
    wetlands: EcosystemData;
    mountains: EcosystemData;
  };
  technologyImpact: {
    aiMonitoringSystems: number;
    dronesDeployed: number;
    sensorNetworks: number;
    satelliteTracking: number;
    geneticAnalysisLabs: number;
    dataPointsDaily: number;
    realTimeAlerts: number;
    predictiveAccuracy: number; // %
  };
}

export interface SpeciesGroup {
  total: number;
  protected: number;
  threatened: number;
  recovering: number;
}

export interface BiodiversityData {
  globalSpeciesCount: {
    mammals: SpeciesGroup;
    birds: SpeciesGroup;
    reptiles: SpeciesGroup;
    amphibians: SpeciesGroup;
    fish: SpeciesGroup;
    invertebrates: SpeciesGroup;
  };
  conservationStatus: {
    extinct: number;
    criticallyEndangered: number;
    endangered: number;
    vulnerable: number;
    nearThreatened: number;
    leastConcern: number;
    dataDeficient: number;
  };
  habitatTrends: Array<{
    habitat: string;
    trend: number; // % change per year
    area: number; // hectares
  }>;
  keyIndicators: {
    livingPlanetIndex: number; // 0-100
    forestCoverChange: number; // % per year
    oceanHealthIndex: number; // 0-100
    speciesRecoveryRate: number; // %
    habitatConnectivity: number; // 0-100
    geneticDiversity: number; // 0-100
  };
}

export interface ConservationProject {
  id: string;
  name: string;
  ecosystem: string;
  location: string;
  startDate: Date;
  status: "Planning" | "Active" | "Completed" | "On Hold";
  budget: number;
  funding: {
    raised: number;
    sources: string[];
    crowdfunding: number;
  };
  objectives: string[];
  progress: {
    populationGrowth?: number;
    conflictReduction?: number;
    corridorsEstablished?: number;
    conservationistsTrained?: number;
    reefRestored?: number;
    pollutionReduction?: number;
    nurseriesEstablished?: number;
    coralStrainsResearched?: number;
    forestProtected?: number;
    deforestationReduction?: number;
    communitiesSupported?: number;
    alternativesImplemented?: number;
    conservanciesEstablished?: number;
    tourismDeveloped?: number;
    wetlandsRestored?: number;
    waterQualityImprovement?: number;
    speciesProtected?: number;
    citiesProtected?: number;
    predationReduction?: number;
  };
  technology: string[];
  partnerships: string[];
  impact: {
    speciesProtected: string[];
    habitatRestored: number; // hectares
    communitiesEngaged: number;
    jobsCreated: number;
  };
  sustainabilityScore: number; // 0-100
}

export interface WildlifeMonitoring {
  realTimeTracking: {
    activeAnimals: number;
    gpsCollars: number;
    cameraTraps: number;
    acousticSensors: number;
    satelliteImages: number;
    droneFlights: number;
  };
  aiAnalytics: {
    speciesIdentificationAccuracy: number; // %
    behaviorPredictionAccuracy: number; // %
    threatDetectionSpeed: number; // seconds
    populationEstimateAccuracy: number; // %
    migrationPatternAccuracy: number; // %
    healthAssessmentAccuracy: number; // %
  };
  dataCollection: {
    dailyDataPoints: number;
    imagesCaptured: number;
    audioRecordings: number;
    geneticSamples: number;
    habitatMeasurements: number;
    communityReports: number;
  };
  alertSystems: {
    poachingAlerts: number;
    diseaseOutbreaks: number;
    habitatThreats: number;
    migrationChanges: number;
    climateImpacts: number;
    humanWildlifeConflicts: number;
  };
  predictiveModels: {
    populationForecasts: number; // % accuracy
    extinctionRiskModels: number; // % accuracy
    climateImpactPredictions: number; // % accuracy
    diseaseSpreadModels: number; // % accuracy
    habitatLossProjections: number; // % accuracy
    conservationEffectiveness: number; // % accuracy
  };
}

export interface EcosystemHealth {
  ecosystem: string;
  overallHealth: number; // 0-100
  indicators: {
    biodiversityIndex: number;
    habitatQuality: number;
    speciesRichness: number;
    ecosystemServices: number;
    resilience: number;
    connectivity: number;
  };
  threats: {
    climateChange: number; // impact score 0-100
    pollution: number;
    habitatLoss: number;
    invasiveSpecies: number;
    overexploitation: number;
    disease: number;
  };
  restoration: {
    ongoing: boolean;
    progress: number; // % complete
    techniques: string[];
    timeline: string;
    budget: number;
  };
  monitoring: {
    sensors: number;
    frequency: string;
    dataQuality: number; // 0-100
    coverage: number; // % area covered
  };
}

export interface ConservationTechnology {
  category:
    | "Monitoring"
    | "Protection"
    | "Research"
    | "Restoration"
    | "Education";
  name: string;
  description: string;
  maturityLevel: "Research" | "Development" | "Pilot" | "Deployment" | "Mature";
  applications: string[];
  effectiveness: number; // 0-100
  costEfficiency: number; // 0-100
  scalability: number; // 0-100
  adoption: {
    currentProjects: number;
    totalDeployments: number;
    geographicCoverage: string[];
    userFeedback: number; // 0-100
  };
  impact: {
    speciesHelped: number;
    habitatProtected: number; // hectares
    threatsReduced: number;
    dataGenerated: number; // daily data points
  };
  requirements: {
    technical: string[];
    financial: number;
    training: string;
    maintenance: string;
  };
}

export interface SustainableFinancing {
  overview: {
    totalFunding: number;
    carbonCredits: number;
    biodiversityCredits: number;
    impactBonds: number;
    crowdfunding: number;
    governmentFunding: number;
    privateDonations: number;
  };
  carbonMarkets: {
    creditsGenerated: number; // tons CO2
    averagePrice: number; // per ton
    buyers: string[];
    verification: string;
    additionality: number; // %
    permanence: number; // %
  };
  biodiversityCredits: {
    creditsIssued: number;
    averagePrice: number;
    ecosystemsProtected: string[];
    speciesBenefited: number;
    habitatRestored: number; // hectares
    verificationStandard: string;
  };
  impactInvestment: {
    totalInvestment: number;
    returnOnInvestment: number; // %
    socialImpactReturn: number; // %
    environmentalImpactReturn: number; // %
    jobsCreated: number;
    communitiesBenefited: number;
  };
  paymentForEcosystemServices: {
    watershedProtection: number;
    carbonSequestration: number;
    biodiversityConservation: number;
    pollination: number;
    soilConservation: number;
    floodProtection: number;
  };
}

export interface CommunityEngagement {
  program: string;
  communities: {
    total: number;
    indigenous: number;
    rural: number;
    urban: number;
    active: number;
  };
  participation: {
    volunteers: number;
    localGuides: number;
    dataCollectors: number;
    decisionMakers: number;
    beneficiaries: number;
  };
  capacity: {
    trainingSessions: number;
    skillsDeveloped: string[];
    certificationsIssued: number;
    leadershipDeveloped: number;
  };
  economic: {
    jobsCreated: number;
    incomeGenerated: number;
    sustainableLivelihoods: number;
    ecotourismRevenue: number;
    alternativeIncome: number;
  };
  cultural: {
    traditionalKnowledge: boolean;
    culturalPreservation: number; // 0-100
    languagePreservation: number;
    customaryPractices: boolean;
  };
  governance: {
    participatoryPlanning: boolean;
    communityOwnership: number; // %
    decisionMakingPower: number; // %
    conflictResolution: number; // effectiveness 0-100
  };
}

export interface ThreatAssessment {
  id: string;
  name: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  probability: number; // 0-100
  impact: "Low" | "Medium" | "High" | "Very High";
  ecosystemsAffected: string[];
  speciesAtRisk: number;
  primaryCauses: string[];
  geographicScope: "Local" | "Regional" | "National" | "Global";
  timeframe: "Immediate" | "Short-term" | "Medium-term" | "Long-term";
  mitigation: {
    strategies: string[];
    effectiveness: number; // 0-100
    investment: number;
    timeline: string;
  };
  trend: "Worsening" | "Stable" | "Improving";
  monitoring: string;
  urgency: "Low" | "Medium" | "High" | "Critical";
}

export interface SpeciesProtection {
  species: string;
  scientificName: string;
  conservationStatus: "LC" | "NT" | "VU" | "EN" | "CR" | "EW" | "EX";
  population: {
    current: number;
    trend: "Increasing" | "Stable" | "Decreasing" | "Unknown";
    change: number; // % change over time period
    historicalBaseline: number;
  };
  habitat: {
    type: string;
    range: number; // km²
    protected: number; // % of range protected
    quality: number; // 0-100
    fragmentation: number; // 0-100 (100 = highly fragmented)
  };
  threats: {
    primary: string[];
    secondary: string[];
    severity: { [threat: string]: number }; // 0-100
  };
  conservation: {
    actions: string[];
    programs: string[];
    funding: number;
    effectiveness: number; // 0-100
    timeline: string;
  };
  monitoring: {
    method: string[];
    frequency: string;
    coverage: number; // % of range monitored
    dataQuality: number; // 0-100
    lastAssessment: Date;
  };
  genetics: {
    diversity: number; // 0-100
    inbreeding: number; // 0-100
    samples: number;
    analysis: string[];
  };
}

export interface WildlifeAlert {
  id: string;
  type:
    | "Poaching"
    | "Disease"
    | "Habitat Loss"
    | "Climate Event"
    | "Human Conflict"
    | "Population Change";
  severity: "Low" | "Medium" | "High" | "Critical";
  location: {
    latitude: number;
    longitude: number;
    ecosystem: string;
    protectedArea?: string;
  };
  species: string[];
  description: string;
  timestamp: Date;
  source:
    | "AI System"
    | "Community Report"
    | "Ranger Patrol"
    | "Satellite"
    | "Sensor Network";
  status: "New" | "Investigating" | "Responding" | "Resolved";
  response: {
    team: string;
    actions: string[];
    resources: string[];
    timeline: string;
  };
  impact: {
    speciesAffected: number;
    areaAffected: number; // hectares
    severity: number; // 0-100
    duration: string;
  };
  verification: {
    verified: boolean;
    method: string;
    confidence: number; // 0-100
  };
}

export interface ConservationROI {
  project: string;
  investment: number;
  returns: {
    ecological: {
      speciesSaved: number;
      habitatRestored: number;
      carbonSequestered: number;
      ecosystemServicesValue: number;
    };
    economic: {
      jobsCreated: number;
      tourismRevenue: number;
      sustainableLivelihoods: number;
      costOfInaction: number; // avoided costs
    };
    social: {
      communitiesBenefited: number;
      educationProvided: number;
      healthImprovements: number;
      culturalPreservation: number;
    };
  };
  ratios: {
    costPerSpeciesSaved: number;
    costPerHectareProtected: number;
    socialReturnOnInvestment: number;
    environmentalReturnOnInvestment: number;
  };
  timeframe: {
    shortTerm: number; // 1-3 years
    mediumTerm: number; // 3-10 years
    longTerm: number; // 10+ years
  };
}
