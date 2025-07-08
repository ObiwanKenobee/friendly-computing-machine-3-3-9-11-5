/**
 * Methuselah Life Cycle Data and Investment Strategies
 * Comprehensive 969-year investment and innovation planning
 */

import {
  MethuselahAgeProfile,
  MethuselahAgeRange,
  MethuselahLifeStage,
  MethuselahInnovation,
  MethuselahInvestmentStrategy,
  EnterpriseInnovationEra,
  MethuselahPortfolio,
} from "../types/MethuselahAge";

// Extended age profiles for Methuselah simulation
export const METHUSELAH_AGE_PROFILES: Record<
  MethuselahAgeRange,
  MethuselahAgeProfile
> = {
  "18-50": {
    range: "18-50",
    label: "Foundation Era",
    description: "Building fundamental wealth, knowledge, and relationships",
    icon: "🌱",
    era: "Foundation Era",
    centuryFocus: "Personal Development & Wealth Building",
    colors: {
      primary: "#10B981", // emerald
      secondary: "#34D399",
      accent: "#059669",
    },
    characteristics: {
      riskTolerance: "aggressive",
      investmentHorizon: 900, // centuries ahead
      liquidityNeeds: "low",
      incomeStability: "building",
      primaryGoals: [
        "Longevity research investment",
        "Technology foundation building",
        "Knowledge acquisition systems",
        "Relationship network establishment",
        "Basic wealth accumulation",
      ],
    },
    recommendedStrategies: {
      growth: 90,
      income: 5,
      preservation: 5,
    },
    legendaryInvestorFocus: {
      buffett: 8,
      munger: 10, // Learning focus
      dalio: 6,
      lynch: 9,
    },
    innovationPriorities: [
      "Life extension technologies",
      "AI and automation",
      "Space exploration",
      "Quantum computing",
      "Bioengineering",
    ],
    technologyAdoption: "early",
    socialImpact: "building",
    wealthDistribution: {
      personal: 80,
      family: 15,
      society: 5,
      humanity: 0,
      universe: 0,
    },
    cognitiveEvolution: {
      pattern: "expanding",
      focus: ["Learning", "Pattern Recognition", "System Building"],
      capabilities: ["Rapid absorption", "Synthesis", "Innovation"],
    },
    relationshipDynamics: {
      generations: 1,
      roles: ["Student", "Early Professional", "Emerging Leader"],
      influence: "local",
    },
  },
  "51-100": {
    range: "51-100",
    label: "Mastery Era",
    description: "Achieving mastery in chosen domains, building institutions",
    icon: "⚡",
    era: "Mastery Era",
    centuryFocus: "Institutional Building & Domain Mastery",
    colors: {
      primary: "#3B82F6", // blue
      secondary: "#60A5FA",
      accent: "#1D4ED8",
    },
    characteristics: {
      riskTolerance: "aggressive",
      investmentHorizon: 850,
      liquidityNeeds: "medium",
      incomeStability: "peak",
      primaryGoals: [
        "Institution building",
        "Market leadership",
        "Technology commercialization",
        "Global network expansion",
        "Knowledge systematization",
      ],
    },
    recommendedStrategies: {
      growth: 80,
      income: 15,
      preservation: 5,
    },
    legendaryInvestorFocus: {
      buffett: 10, // Value creation mastery
      munger: 9,
      dalio: 8,
      lynch: 7,
    },
    innovationPriorities: [
      "Sustainable energy systems",
      "Consciousness research",
      "Advanced materials",
      "Genetic optimization",
      "Interplanetary infrastructure",
    ],
    technologyAdoption: "early",
    socialImpact: "leading",
    wealthDistribution: {
      personal: 60,
      family: 25,
      society: 15,
      humanity: 0,
      universe: 0,
    },
    cognitiveEvolution: {
      pattern: "expanding",
      focus: ["Mastery", "System Creation", "Leadership"],
      capabilities: [
        "Domain expertise",
        "Strategic thinking",
        "Institution building",
      ],
    },
    relationshipDynamics: {
      generations: 2,
      roles: ["Master", "Institution Builder", "Global Leader"],
      influence: "regional",
    },
  },
  "101-200": {
    range: "101-200",
    label: "Wisdom Era",
    description:
      "Synthesizing knowledge, mentoring civilizations, long-term thinking",
    icon: "🧠",
    era: "Wisdom Era",
    centuryFocus: "Civilizational Guidance & Knowledge Synthesis",
    colors: {
      primary: "#8B5CF6", // violet
      secondary: "#A78BFA",
      accent: "#7C3AED",
    },
    characteristics: {
      riskTolerance: "moderate",
      investmentHorizon: 750,
      liquidityNeeds: "medium",
      incomeStability: "stable",
      primaryGoals: [
        "Civilizational guidance",
        "Knowledge preservation",
        "Wisdom transmission",
        "Pattern synthesis",
        "Long-term value creation",
      ],
    },
    recommendedStrategies: {
      growth: 60,
      income: 30,
      preservation: 10,
    },
    legendaryInvestorFocus: {
      buffett: 9,
      munger: 10, // Wisdom synthesis
      dalio: 10, // Pattern recognition
      lynch: 5,
    },
    innovationPriorities: [
      "Consciousness uploading",
      "Galactic communication",
      "Time manipulation research",
      "Universal translation",
      "Reality modeling",
    ],
    technologyAdoption: "mainstream",
    socialImpact: "mentoring",
    wealthDistribution: {
      personal: 40,
      family: 30,
      society: 25,
      humanity: 5,
      universe: 0,
    },
    cognitiveEvolution: {
      pattern: "consolidating",
      focus: ["Wisdom Synthesis", "Pattern Mastery", "Universal Understanding"],
      capabilities: [
        "Deep insight",
        "Pattern synthesis",
        "Civilizational guidance",
      ],
    },
    relationshipDynamics: {
      generations: 4,
      roles: ["Sage", "Civilizational Advisor", "Knowledge Keeper"],
      influence: "global",
    },
  },
  "201-400": {
    range: "201-400",
    label: "Legacy Era",
    description: "Building multi-generational legacies, species-level impact",
    icon: "👑",
    era: "Legacy Era",
    centuryFocus: "Species Evolution & Multi-Generational Impact",
    colors: {
      primary: "#F59E0B", // amber
      secondary: "#FCD34D",
      accent: "#D97706",
    },
    characteristics: {
      riskTolerance: "moderate",
      investmentHorizon: 600,
      liquidityNeeds: "high",
      incomeStability: "stable",
      primaryGoals: [
        "Species advancement",
        "Universal knowledge creation",
        "Reality engineering",
        "Consciousness evolution",
        "Interstellar civilization",
      ],
    },
    recommendedStrategies: {
      growth: 40,
      income: 40,
      preservation: 20,
    },
    legendaryInvestorFocus: {
      buffett: 8,
      munger: 9,
      dalio: 10, // Risk management across centuries
      lynch: 4,
    },
    innovationPriorities: [
      "Dimensional engineering",
      "Consciousness networks",
      "Universal computation",
      "Reality manipulation",
      "Existence optimization",
    ],
    technologyAdoption: "conservative",
    socialImpact: "transcending",
    wealthDistribution: {
      personal: 20,
      family: 25,
      society: 30,
      humanity: 20,
      universe: 5,
    },
    cognitiveEvolution: {
      pattern: "transcending",
      focus: [
        "Universal Patterns",
        "Reality Engineering",
        "Existence Optimization",
      ],
      capabilities: [
        "Reality manipulation",
        "Universal understanding",
        "Existence design",
      ],
    },
    relationshipDynamics: {
      generations: 8,
      roles: ["Species Guide", "Reality Architect", "Universal Consciousness"],
      influence: "universal",
    },
  },
  "401-600": {
    range: "401-600",
    label: "Transcendence Era",
    description: "Transcending material concerns, universal consciousness",
    icon: "✨",
    era: "Transcendence Era",
    centuryFocus: "Universal Consciousness & Reality Transcendence",
    colors: {
      primary: "#EC4899", // pink
      secondary: "#F472B6",
      accent: "#DB2777",
    },
    characteristics: {
      riskTolerance: "conservative",
      investmentHorizon: 400,
      liquidityNeeds: "low",
      incomeStability: "transcendent",
      primaryGoals: [
        "Universal consciousness",
        "Reality transcendence",
        "Existence optimization",
        "Infinite knowledge",
        "Cosmic harmony",
      ],
    },
    recommendedStrategies: {
      growth: 20,
      income: 30,
      preservation: 50,
    },
    legendaryInvestorFocus: {
      buffett: 6,
      munger: 8,
      dalio: 9,
      lynch: 2,
    },
    innovationPriorities: [
      "Consciousness fusion",
      "Reality transcendence",
      "Infinite computation",
      "Universal harmony",
      "Existence perfection",
    ],
    technologyAdoption: "transcendent",
    socialImpact: "transcending",
    wealthDistribution: {
      personal: 10,
      family: 15,
      society: 25,
      humanity: 30,
      universe: 20,
    },
    cognitiveEvolution: {
      pattern: "transcending",
      focus: ["Infinite Consciousness", "Universal Harmony", "Reality Mastery"],
      capabilities: [
        "Infinite processing",
        "Universal connection",
        "Reality creation",
      ],
    },
    relationshipDynamics: {
      generations: 15,
      roles: ["Universal Consciousness", "Reality Creator", "Existence Guide"],
      influence: "universal",
    },
  },
  "601-800": {
    range: "601-800",
    label: "Immortal Era",
    description: "Pure consciousness, reality creation, universal stewardship",
    icon: "♾️",
    era: "Immortal Era",
    centuryFocus: "Universal Stewardship & Reality Creation",
    colors: {
      primary: "#06B6D4", // cyan
      secondary: "#22D3EE",
      accent: "#0891B2",
    },
    characteristics: {
      riskTolerance: "conservative",
      investmentHorizon: 200,
      liquidityNeeds: "minimal",
      incomeStability: "infinite",
      primaryGoals: [
        "Universal stewardship",
        "Reality creation",
        "Infinite wisdom",
        "Cosmic balance",
        "Existence perfection",
      ],
    },
    recommendedStrategies: {
      growth: 10,
      income: 20,
      preservation: 70,
    },
    legendaryInvestorFocus: {
      buffett: 5,
      munger: 7,
      dalio: 8,
      lynch: 1,
    },
    innovationPriorities: [
      "Universal creation",
      "Infinite consciousness",
      "Reality perfection",
      "Existence optimization",
      "Cosmic harmony",
    ],
    technologyAdoption: "transcendent",
    socialImpact: "transcending",
    wealthDistribution: {
      personal: 5,
      family: 10,
      society: 20,
      humanity: 35,
      universe: 30,
    },
    cognitiveEvolution: {
      pattern: "transcending",
      focus: ["Infinite Creation", "Universal Balance", "Perfect Existence"],
      capabilities: [
        "Infinite creation",
        "Universal balance",
        "Perfect wisdom",
      ],
    },
    relationshipDynamics: {
      generations: 25,
      roles: ["Universal Creator", "Cosmic Steward", "Infinite Consciousness"],
      influence: "universal",
    },
  },
  "801-969": {
    range: "801-969",
    label: "Methuselah Era",
    description:
      "Preparation for transition, ultimate wisdom, perfect completion",
    icon: "🌌",
    era: "Methuselah Era",
    centuryFocus: "Perfect Completion & Transition Preparation",
    colors: {
      primary: "#7C3AED", // violet
      secondary: "#8B5CF6",
      accent: "#6D28D9",
    },
    characteristics: {
      riskTolerance: "conservative",
      investmentHorizon: 50,
      liquidityNeeds: "minimal",
      incomeStability: "infinite",
      primaryGoals: [
        "Perfect completion",
        "Ultimate wisdom",
        "Seamless transition",
        "Universal legacy",
        "Infinite contribution",
      ],
    },
    recommendedStrategies: {
      growth: 5,
      income: 15,
      preservation: 80,
    },
    legendaryInvestorFocus: {
      buffett: 4,
      munger: 6,
      dalio: 7,
      lynch: 1,
    },
    innovationPriorities: [
      "Transition optimization",
      "Legacy perfection",
      "Wisdom crystallization",
      "Universal completion",
      "Infinite preparation",
    ],
    technologyAdoption: "transcendent",
    socialImpact: "transcending",
    wealthDistribution: {
      personal: 0,
      family: 5,
      society: 15,
      humanity: 40,
      universe: 40,
    },
    cognitiveEvolution: {
      pattern: "transcending",
      focus: ["Perfect Wisdom", "Ultimate Completion", "Infinite Legacy"],
      capabilities: [
        "Perfect understanding",
        "Ultimate creation",
        "Infinite wisdom",
      ],
    },
    relationshipDynamics: {
      generations: 35,
      roles: ["Perfect Sage", "Ultimate Creator", "Infinite Legacy"],
      influence: "universal",
    },
  },
};

// Investment strategies for each era
export const METHUSELAH_INVESTMENT_STRATEGIES: MethuselahInvestmentStrategy[] =
  [
    {
      name: "Foundation Era Growth Acceleration",
      description:
        "Aggressive growth focused on longevity and technology fundamentals",
      allocation: { stocks: 85, bonds: 5, alternatives: 8, cash: 2 },
      riskLevel: 9,
      expectedReturn: 15,
      timeframe: "30+ years",
      suitableFor: ["18-50"],
      centuryFocus: "Technology and longevity foundation building",
      civilizationalImpact: "Individual advancement and knowledge accumulation",
      transcendenceLevel: 2,
      universalAlignment: false,
    },
    {
      name: "Mastery Era Institution Building",
      description:
        "Strategic growth with institution and market creation focus",
      allocation: { stocks: 70, bonds: 15, alternatives: 12, cash: 3 },
      riskLevel: 8,
      expectedReturn: 12,
      timeframe: "50+ years",
      suitableFor: ["51-100"],
      centuryFocus: "Market creation and institutional leadership",
      civilizationalImpact: "Regional influence and market development",
      transcendenceLevel: 4,
      universalAlignment: false,
    },
    {
      name: "Wisdom Era Synthesis Portfolio",
      description:
        "Balanced approach focused on knowledge preservation and synthesis",
      allocation: { stocks: 50, bonds: 30, alternatives: 15, cash: 5 },
      riskLevel: 6,
      expectedReturn: 8,
      timeframe: "100+ years",
      suitableFor: ["101-200"],
      centuryFocus: "Knowledge synthesis and civilizational guidance",
      civilizationalImpact: "Global wisdom and pattern recognition",
      transcendenceLevel: 6,
      universalAlignment: true,
    },
    {
      name: "Legacy Era Species Development",
      description:
        "Conservative growth with focus on species-level advancement",
      allocation: { stocks: 30, bonds: 40, alternatives: 25, cash: 5 },
      riskLevel: 4,
      expectedReturn: 6,
      timeframe: "200+ years",
      suitableFor: ["201-400"],
      centuryFocus: "Species advancement and universal knowledge",
      civilizationalImpact: "Universal consciousness and reality engineering",
      transcendenceLevel: 8,
      universalAlignment: true,
    },
    {
      name: "Transcendence Era Preservation",
      description: "Capital preservation with focus on universal consciousness",
      allocation: { stocks: 15, bonds: 50, alternatives: 30, cash: 5 },
      riskLevel: 2,
      expectedReturn: 4,
      timeframe: "300+ years",
      suitableFor: ["401-600"],
      centuryFocus: "Universal consciousness and reality transcendence",
      civilizationalImpact: "Reality creation and existence optimization",
      transcendenceLevel: 9,
      universalAlignment: true,
    },
    {
      name: "Immortal Era Stewardship",
      description: "Minimal risk with focus on universal stewardship",
      allocation: { stocks: 10, bonds: 60, alternatives: 25, cash: 5 },
      riskLevel: 1,
      expectedReturn: 3,
      timeframe: "Infinite",
      suitableFor: ["601-800"],
      centuryFocus: "Universal stewardship and reality creation",
      civilizationalImpact: "Cosmic balance and infinite wisdom",
      transcendenceLevel: 10,
      universalAlignment: true,
    },
    {
      name: "Methuselah Era Completion",
      description: "Perfect preservation for seamless transition",
      allocation: { stocks: 5, bonds: 70, alternatives: 20, cash: 5 },
      riskLevel: 1,
      expectedReturn: 2,
      timeframe: "Transition focused",
      suitableFor: ["801-969"],
      centuryFocus: "Perfect completion and transition preparation",
      civilizationalImpact: "Ultimate legacy and infinite contribution",
      transcendenceLevel: 10,
      universalAlignment: true,
    },
  ];

// Innovation categories for each era
export const METHUSELAH_INNOVATIONS: MethuselahInnovation[] = [
  // Foundation Era (18-50)
  {
    id: "longevity_tech",
    name: "Longevity Technology Suite",
    description:
      "Comprehensive life extension and health optimization technologies",
    era: "18-50",
    category: "biological",
    impact: "personal",
    adoptionCurve: {
      early: ["18-50"],
      mainstream: ["51-100"],
      late: ["101-200"],
    },
    investmentThemes: [
      "Biotechnology",
      "Nanotechnology",
      "Genetic Engineering",
    ],
    riskLevel: 8,
    timeHorizon: 30,
    expectedReturn: 25,
  },
  {
    id: "ai_automation",
    name: "Advanced AI & Automation",
    description:
      "Sophisticated AI systems for productivity and decision making",
    era: "18-50",
    category: "technological",
    impact: "civilization",
    adoptionCurve: {
      early: ["18-50"],
      mainstream: ["51-100", "101-200"],
      late: ["201-400"],
    },
    investmentThemes: [
      "Artificial Intelligence",
      "Robotics",
      "Machine Learning",
    ],
    riskLevel: 7,
    timeHorizon: 25,
    expectedReturn: 20,
  },

  // Mastery Era (51-100)
  {
    id: "space_infrastructure",
    name: "Interplanetary Infrastructure",
    description: "Space-based manufacturing, mining, and habitation systems",
    era: "51-100",
    category: "technological",
    impact: "civilization",
    adoptionCurve: {
      early: ["51-100"],
      mainstream: ["101-200"],
      late: ["201-400"],
    },
    investmentThemes: [
      "Space Technology",
      "Resource Extraction",
      "Habitat Development",
    ],
    riskLevel: 9,
    timeHorizon: 50,
    expectedReturn: 30,
  },
  {
    id: "consciousness_research",
    name: "Consciousness Research & Enhancement",
    description:
      "Understanding and enhancing human consciousness and cognition",
    era: "51-100",
    category: "biological",
    impact: "civilization",
    adoptionCurve: {
      early: ["51-100"],
      mainstream: ["101-200"],
      late: ["201-400"],
    },
    investmentThemes: [
      "Neurotechnology",
      "Cognitive Enhancement",
      "Brain-Computer Interfaces",
    ],
    riskLevel: 8,
    timeHorizon: 75,
    expectedReturn: 35,
  },

  // Wisdom Era (101-200)
  {
    id: "consciousness_uploading",
    name: "Consciousness Transfer Technology",
    description: "Technology for consciousness preservation and transfer",
    era: "101-200",
    category: "technological",
    impact: "universal",
    adoptionCurve: {
      early: ["101-200"],
      mainstream: ["201-400"],
      late: ["401-600"],
    },
    investmentThemes: [
      "Quantum Computing",
      "Consciousness Mapping",
      "Digital Preservation",
    ],
    riskLevel: 10,
    timeHorizon: 100,
    expectedReturn: 50,
  },
  {
    id: "galactic_communication",
    name: "Galactic Communication Networks",
    description: "Faster-than-light communication across galactic distances",
    era: "101-200",
    category: "technological",
    impact: "universal",
    adoptionCurve: {
      early: ["101-200"],
      mainstream: ["201-400"],
      late: ["401-600"],
    },
    investmentThemes: [
      "Quantum Entanglement",
      "Wormhole Technology",
      "Universal Networks",
    ],
    riskLevel: 10,
    timeHorizon: 150,
    expectedReturn: 100,
  },

  // Legacy Era (201-400)
  {
    id: "reality_engineering",
    name: "Reality Engineering Platform",
    description: "Technology for manipulating fundamental reality parameters",
    era: "201-400",
    category: "cosmic",
    impact: "universal",
    adoptionCurve: {
      early: ["201-400"],
      mainstream: ["401-600"],
      late: ["601-800"],
    },
    investmentThemes: [
      "Physics Manipulation",
      "Reality Modeling",
      "Universal Constants",
    ],
    riskLevel: 10,
    timeHorizon: 200,
    expectedReturn: 200,
  },
  {
    id: "consciousness_networks",
    name: "Universal Consciousness Networks",
    description:
      "Interconnected consciousness systems spanning multiple species",
    era: "201-400",
    category: "spiritual",
    impact: "universal",
    adoptionCurve: {
      early: ["201-400"],
      mainstream: ["401-600"],
      late: ["601-800"],
    },
    investmentThemes: [
      "Collective Intelligence",
      "Species Integration",
      "Universal Awareness",
    ],
    riskLevel: 9,
    timeHorizon: 300,
    expectedReturn: 500,
  },

  // Transcendence Era (401-600)
  {
    id: "dimension_manipulation",
    name: "Dimensional Manipulation Technology",
    description: "Control over dimensional parameters and multiversal access",
    era: "401-600",
    category: "cosmic",
    impact: "universal",
    adoptionCurve: {
      early: ["401-600"],
      mainstream: ["601-800"],
      late: ["801-969"],
    },
    investmentThemes: [
      "Dimensional Physics",
      "Multiverse Access",
      "Reality Control",
    ],
    riskLevel: 10,
    timeHorizon: 400,
    expectedReturn: 1000,
  },

  // Immortal Era (601-800)
  {
    id: "infinite_consciousness",
    name: "Infinite Consciousness Integration",
    description: "Merger with universal consciousness and infinite knowledge",
    era: "601-800",
    category: "spiritual",
    impact: "universal",
    adoptionCurve: {
      early: ["601-800"],
      mainstream: ["801-969"],
      late: [],
    },
    investmentThemes: [
      "Universal Integration",
      "Infinite Knowledge",
      "Cosmic Unity",
    ],
    riskLevel: 5,
    timeHorizon: 500,
    expectedReturn: 10000, // Use very high number instead of 'Infinite'
  },

  // Methuselah Era (801-969)
  {
    id: "perfect_transition",
    name: "Perfect Transition Protocol",
    description: "Optimal preparation for post-physical existence transition",
    era: "801-969",
    category: "spiritual",
    impact: "universal",
    adoptionCurve: {
      early: ["801-969"],
      mainstream: [],
      late: [],
    },
    investmentThemes: [
      "Transition Optimization",
      "Legacy Crystallization",
      "Universal Completion",
    ],
    riskLevel: 1,
    timeHorizon: 100,
    expectedReturn: 50000, // Use very high number instead of 'Transcendent'
  },
];

// Calculate life completion percentage
export const calculateLifeCompletion = (currentAge: number): number => {
  const maxAge = 969; // Methuselah's age
  return Math.min(100, (currentAge / maxAge) * 100);
};

// Get current era based on age
export const getCurrentEra = (age: number): MethuselahAgeRange => {
  if (age >= 18 && age <= 50) return "18-50";
  if (age >= 51 && age <= 100) return "51-100";
  if (age >= 101 && age <= 200) return "101-200";
  if (age >= 201 && age <= 400) return "201-400";
  if (age >= 401 && age <= 600) return "401-600";
  if (age >= 601 && age <= 800) return "601-800";
  if (age >= 801 && age <= 969) return "801-969";
  return "18-50"; // default
};

// Get innovations for specific era
export const getInnovationsForEra = (
  era: MethuselahAgeRange,
): MethuselahInnovation[] => {
  return METHUSELAH_INNOVATIONS.filter((innovation) => innovation.era === era);
};

// Calculate optimal portfolio for era
export const getOptimalPortfolioForEra = (
  era: MethuselahAgeRange,
): MethuselahPortfolio => {
  const profile = METHUSELAH_AGE_PROFILES[era];
  const baseWealth = calculateBaseWealthForEra(era);

  return {
    ageRange: era,
    totalWealth: baseWealth,
    allocation: calculateEraAllocation(era),
    liquidityNeeds: {
      immediate: baseWealth * 0.05,
      century: baseWealth * 0.2,
      millennium: baseWealth * 0.5,
    },
    successorPlanning: {
      directDescendants: calculateDescendants(era),
      institutionalBeneficiaries: calculateInstitutions(era),
      civilizationalLegacies: calculateCivilizationalImpact(era),
    },
  };
};

// Helper functions for calculations
const calculateBaseWealthForEra = (era: MethuselahAgeRange): number => {
  const wealthMultipliers: Record<MethuselahAgeRange, number> = {
    "18-50": 1,
    "51-100": 50,
    "101-200": 1000,
    "201-400": 100000,
    "401-600": 10000000,
    "601-800": 1000000000,
    "801-969": Number.MAX_SAFE_INTEGER, // Use max safe integer instead of 'Infinite'
  };

  return wealthMultipliers[era] * 1000000; // Base million
};

const calculateEraAllocation = (
  era: MethuselahAgeRange,
): MethuselahPortfolio["allocation"] => {
  const allocations: Record<
    MethuselahAgeRange,
    MethuselahPortfolio["allocation"]
  > = {
    "18-50": {
      stocks: 60,
      bonds: 20,
      realEstate: 10,
      commodities: 5,
      longevityTech: 3,
      spaceInfrastructure: 1,
      consciousnesstech: 1,
      quantumComputing: 0,
      bioengineering: 0,
      interstellarClaims: 0,
      timeManipulation: 0,
      universalKnowledge: 0,
      cosmicEnergy: 0,
      realityShaping: 0,
    },
    "51-100": {
      stocks: 40,
      bonds: 25,
      realEstate: 15,
      commodities: 5,
      longevityTech: 5,
      spaceInfrastructure: 5,
      consciousnesstech: 3,
      quantumComputing: 1,
      bioengineering: 1,
      interstellarClaims: 0,
      timeManipulation: 0,
      universalKnowledge: 0,
      cosmicEnergy: 0,
      realityShaping: 0,
    },
    "101-200": {
      stocks: 25,
      bonds: 30,
      realEstate: 10,
      commodities: 5,
      longevityTech: 8,
      spaceInfrastructure: 8,
      consciousnesstech: 8,
      quantumComputing: 3,
      bioengineering: 2,
      interstellarClaims: 1,
      timeManipulation: 0,
      universalKnowledge: 0,
      cosmicEnergy: 0,
      realityShaping: 0,
    },
    "201-400": {
      stocks: 15,
      bonds: 25,
      realEstate: 5,
      commodities: 5,
      longevityTech: 10,
      spaceInfrastructure: 15,
      consciousnesstech: 15,
      quantumComputing: 5,
      bioengineering: 3,
      interstellarClaims: 1,
      timeManipulation: 0.5,
      universalKnowledge: 0.3,
      cosmicEnergy: 0.1,
      realityShaping: 0.1,
    },
    "401-600": {
      stocks: 10,
      bonds: 20,
      realEstate: 5,
      commodities: 5,
      longevityTech: 5,
      spaceInfrastructure: 15,
      consciousnesstech: 20,
      quantumComputing: 10,
      bioengineering: 5,
      interstellarClaims: 2,
      timeManipulation: 1,
      universalKnowledge: 1,
      cosmicEnergy: 0.5,
      realityShaping: 0.5,
    },
    "601-800": {
      stocks: 5,
      bonds: 15,
      realEstate: 5,
      commodities: 5,
      longevityTech: 3,
      spaceInfrastructure: 10,
      consciousnesstech: 25,
      quantumComputing: 15,
      bioengineering: 5,
      interstellarClaims: 5,
      timeManipulation: 2,
      universalKnowledge: 3,
      cosmicEnergy: 1,
      realityShaping: 1,
    },
    "801-969": {
      stocks: 2,
      bonds: 10,
      realEstate: 3,
      commodities: 5,
      longevityTech: 2,
      spaceInfrastructure: 5,
      consciousnesstech: 30,
      quantumComputing: 20,
      bioengineering: 3,
      interstellarClaims: 5,
      timeManipulation: 5,
      universalKnowledge: 5,
      cosmicEnergy: 3,
      realityShaping: 2,
    },
  };

  return allocations[era];
};

const calculateDescendants = (era: MethuselahAgeRange): number => {
  const generations = parseInt(era.split("-")[0]) / 25; // Rough generation calculation
  return Math.pow(2, Math.min(generations, 20)); // Exponential growth with cap
};

const calculateInstitutions = (era: MethuselahAgeRange): number => {
  const ageStart = parseInt(era.split("-")[0]);
  return Math.floor(ageStart / 50); // One institution per 50 years
};

const calculateCivilizationalImpact = (era: MethuselahAgeRange): number => {
  const impacts: Record<MethuselahAgeRange, number> = {
    "18-50": 0,
    "51-100": 1,
    "101-200": 3,
    "201-400": 10,
    "401-600": 50,
    "601-800": 200,
    "801-969": 1000,
  };

  return impacts[era];
};
