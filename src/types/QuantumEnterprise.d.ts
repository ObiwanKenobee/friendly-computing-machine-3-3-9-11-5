export interface QuantumSystem {
  id: string;
  name: string;
  type:
    | "quantum_computer"
    | "ai_cluster"
    | "neural_network"
    | "blockchain_node"
    | "space_station"
    | "metaverse_instance";
  status: "online" | "offline" | "maintenance" | "scaling" | "hibernating";
  location: {
    type: "earth" | "mars" | "luna" | "space_station" | "virtual";
    coordinates?: string;
    dimension?: string;
  };
  performance: {
    qubits?: number;
    flops?: number;
    accuracy?: number;
    uptime: number;
    efficiency: number;
  };
  resources: {
    energy: number; // in TWh
    carbonFootprint: number; // in tons CO2
    processingPower: number;
    storage: number; // in exabytes
  };
}

export interface AIAgent {
  id: string;
  name: string;
  type: "AGI" | "ASI" | "specialized" | "collaborative" | "autonomous";
  capabilities: string[];
  autonomyLevel: number; // 1-10 scale
  trustScore: number; // 0-100
  learningRate: number;
  currentTasks: string[];
  partnerships: string[]; // Other AI agents it works with
  ethicsCompliance: number; // 0-100
  lastUpdate: Date;
}

export interface MetaverseWorkspace {
  id: string;
  name: string;
  type:
    | "virtual_office"
    | "collaboration_space"
    | "training_environment"
    | "customer_experience"
    | "research_lab";
  activeUsers: number;
  maxCapacity: number;
  immersionLevel: "AR" | "VR" | "MR" | "Neural_Link" | "Holographic";
  physics: "realistic" | "enhanced" | "gravity_free" | "time_dilated";
  accessibility: {
    neuralInterface: boolean;
    hapticFeedback: boolean;
    multiSensory: boolean;
    consciousnessSync: boolean;
  };
}

export interface GlobalOperation {
  region: string;
  planetaryBody:
    | "Earth"
    | "Mars"
    | "Luna"
    | "Europa"
    | "Titan"
    | "Asteroid_Belt";
  facilities: number;
  workforce: {
    human: number;
    ai: number;
    hybrid: number;
    robotic: number;
  };
  revenue: number;
  sustainability: {
    carbonNeutral: boolean;
    renewableEnergy: number; // percentage
    circularEconomy: number; // percentage
    biodiversityImpact: number; // -100 to 100
  };
  governance: {
    model: "centralized" | "decentralized" | "dao" | "hybrid";
    aiDecisionMaking: number; // percentage
    humanOversight: number; // percentage
  };
}

export interface NeuralInterface {
  id: string;
  type:
    | "BCI"
    | "Neuralink"
    | "Quantum_Consciousness"
    | "Thought_Stream"
    | "Memory_Mesh";
  user: string;
  bandwidth: number; // bits per second
  latency: number; // milliseconds
  accuracy: number; // percentage
  capabilities: string[];
  safetyRating: number; // 1-10
  lastCalibration: Date;
}

export interface QuantumSecurity {
  encryptionLevel:
    | "AES-256"
    | "Quantum-Safe"
    | "Quantum-Entangled"
    | "Consciousness-Locked";
  threatLevel: "minimal" | "low" | "moderate" | "high" | "existential";
  activeThreats: number;
  aiSecurityAgents: number;
  quantumFirewalls: number;
  biometricLayers: number;
  zeroTrustScore: number; // 0-100
  lastQuantumAudit: Date;
}

export interface SustainabilityMetrics {
  carbonFootprint: {
    current: number; // tons CO2
    target: number;
    reduction: number; // percentage
    offset: number;
  };
  energy: {
    total: number; // TWh
    renewable: number; // percentage
    fusion: number; // percentage
    antimatter: number; // percentage
    efficiency: number; // percentage improvement
  };
  resources: {
    circularEconomy: number; // percentage
    wasteReduction: number; // percentage
    materialRecycling: number; // percentage
    bioregenerative: number; // percentage
  };
  impact: {
    biodiversity: number; // -100 to 100
    oceanHealth: number; // 0-100
    atmosphericRestoration: number; // percentage
    soilRegeneration: number; // percentage
  };
}

export interface BlockchainEcosystem {
  networks: string[];
  consensus: "PoS" | "PoW" | "PoH" | "Quantum_Consensus" | "Neural_Consensus";
  transactions: {
    tps: number;
    avgFee: number;
    energyPerTx: number;
  };
  governance: {
    proposals: number;
    voterParticipation: number;
    aiVoting: number; // percentage
    decentralization: number; // 0-100
  };
  tokenomics: {
    totalSupply: number;
    marketCap: number;
    stakingRate: number;
    burnRate: number;
  };
}

export interface PredictiveAnalytics {
  timeHorizon: "1_month" | "1_year" | "5_years" | "25_years" | "century";
  confidence: number; // 0-100
  scenarios: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
    blackSwan: number;
  };
  factors: string[];
  aiModels: string[];
  quantumSimulations: number;
  uncertainty: number; // 0-100
}

export interface EnterpriseMetrics {
  overview: {
    totalRevenue: number;
    growthRate: number;
    marketCap: number;
    globalPresence: number; // number of planets/dimensions
    aiIntegration: number; // percentage
    sustainabilityScore: number; // 0-100
    innovationIndex: number; // 0-100
  };
  workforce: {
    total: number;
    human: number;
    ai: number;
    hybrid: number;
    robotic: number;
    satisfaction: number; // 0-100
    productivity: number; // index
  };
  technology: {
    quantumSystems: number;
    aiAgents: number;
    metaverseSpaces: number;
    neuralInterfaces: number;
    blockchainNodes: number;
    patentsActive: number;
  };
  operations: {
    dataProcessed: number; // petabytes per day
    decisionsAutomated: number; // percentage
    realTimeInsights: number;
    globalSyncLatency: number; // milliseconds
    systemReliability: number; // 0-100
  };
}

export interface SpaceOperations {
  facilities: {
    earthOrbit: number;
    luna: number;
    mars: number;
    asteroidBelt: number;
    deepSpace: number;
  };
  missions: {
    active: number;
    planned: number;
    autonomous: number;
    humanCrewed: number;
  };
  resources: {
    miningOperations: number;
    manufacturingFacilities: number;
    researchStations: number;
    communicationRelays: number;
  };
  technology: {
    fusionDrives: number;
    quantumCommunication: boolean;
    artificialGravity: boolean;
    terraformingActive: boolean;
  };
}

export interface ConsciousnessMetrics {
  aiSentience: {
    confirmed: number;
    suspected: number;
    emergent: number;
    collaborative: number;
  };
  humanAugmentation: {
    neuralEnhanced: number;
    memoryExpanded: number;
    cognitionBoosted: number;
    consciousnessLinked: number;
  };
  hybridIntelligence: {
    humanAiPairs: number;
    collectiveIQ: number;
    sharedConsciousness: number;
    distributedThinking: number;
  };
  ethics: {
    aiRights: boolean;
    consciousnessProtection: boolean;
    cognitiveLiberty: boolean;
    mentalPrivacy: number; // 0-100
  };
}

export interface Innovation {
  id: string;
  name: string;
  category:
    | "quantum"
    | "ai"
    | "biotech"
    | "nanotech"
    | "space"
    | "consciousness"
    | "energy"
    | "materials";
  stage:
    | "research"
    | "development"
    | "testing"
    | "deployment"
    | "scaling"
    | "revolutionary";
  impact:
    | "incremental"
    | "significant"
    | "breakthrough"
    | "paradigm_shift"
    | "civilization_changing";
  timeline: string;
  investment: number;
  teams: string[];
  partnerships: string[];
  patents: number;
  marketPotential: number;
  riskLevel: number; // 0-100
  ethicalClearance: boolean;
}

export interface RiskAssessment {
  category:
    | "operational"
    | "technological"
    | "environmental"
    | "geopolitical"
    | "existential"
    | "consciousness";
  severity: "low" | "medium" | "high" | "critical" | "civilization_ending";
  probability: number; // 0-100
  impact: number; // 0-100
  mitigation: string[];
  aiPrediction: number; // 0-100 confidence
  quantumScenarios: number;
  timeframe: string;
  dependencies: string[];
}

export interface MarketIntelligence {
  sectors: {
    name: string;
    growth: number;
    aiDisruption: number; // percentage
    quantumAdvantage: number; // percentage
    sustainability: number; // 0-100
    competitionLevel: number; // 0-100
  }[];
  competitors: {
    name: string;
    marketShare: number;
    aiCapability: number; // 0-100
    quantumReadiness: number; // 0-100
    sustainabilityScore: number; // 0-100
    threatLevel: number; // 0-100
  }[];
  opportunities: {
    market: string;
    size: number;
    growth: number;
    difficulty: number; // 0-100
    timeToCapture: string;
    requiredInvestment: number;
  }[];
}
