/**
 * Methuselah Context Provider for Extended Life Cycle Simulation
 * Manages 969-year investment and innovation lifecycle
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  MethuselahContextType,
  MethuselahAgeRange,
  MethuselahSimulation,
  MethuselahLifeStage,
  MethuselahInnovation,
  LifeCompletionMetrics,
  MethuselahPortfolio,
} from "../types/MethuselahAge";
import {
  METHUSELAH_AGE_PROFILES,
  METHUSELAH_INNOVATIONS,
  getCurrentEra,
  calculateLifeCompletion,
  getOptimalPortfolioForEra,
  getInnovationsForEra,
} from "../utils/methuselahLifeCycle";

const MethuselahContext = createContext<MethuselahContextType | undefined>(
  undefined,
);

interface MethuselahProviderProps {
  children: ReactNode;
}

const METHUSELAH_STORAGE_KEY = "quantumvest_methuselah_simulation";

export const MethuselahProvider: React.FC<MethuselahProviderProps> = ({
  children,
}) => {
  const [simulation, setSimulation] = useState<MethuselahSimulation>({
    currentAge: 25,
    currentEra: "18-50",
    lifeProgress: 2.58, // 25/969 * 100
    totalNetWorth: 1000000,
    generationsWitnessed: 1,
    civilizationsInfluenced: 0,
    innovationsSponsored: 0,
    portfolio: getOptimalPortfolioForEra("18-50"),
    nextMilestones: [
      "Achieve first $10M net worth",
      "Invest in longevity research",
      "Build first AI company",
      "Establish knowledge preservation system",
    ],
    historicalAchievements: [
      "Completed fundamental education",
      "Established basic financial foundation",
      "Began long-term investment planning",
    ],
    currentChallenges: [
      "Optimizing for extreme long-term horizons",
      "Balancing growth with longevity preservation",
      "Building systems for century-scale thinking",
    ],
    wisdomAccumulated: [
      "Time is the most valuable asset",
      "Knowledge compounds exponentially",
      "Relationships are multi-generational investments",
    ],
    relationshipNetwork: {
      livingDescendants: 0,
      institutionalLegacies: 0,
      globalInfluence: 1,
      universalImpact: 0,
    },
  });

  const [lifeStages] = useState<MethuselahLifeStage[]>([
    {
      range: "18-50",
      name: "Foundation Era",
      description: "Building fundamental wealth, knowledge, and relationships",
      duration: 33,
      keyMilestones: [
        "Longevity technology investment",
        "First AI company founding",
        "Knowledge preservation system",
        "Multi-generational planning",
      ],
      dominantConcerns: [
        "Health optimization",
        "Skill acquisition",
        "Network building",
        "Technology adoption",
      ],
      investmentPhilosophy:
        "Aggressive growth with focus on longevity and technology",
      innovationFocus: getInnovationsForEra("18-50"),
      societalRole: "Emerging innovator and wealth builder",
      legacyBuilding: {
        biological: ["Health optimization", "Genetic enhancement"],
        intellectual: ["Knowledge systems", "Learning frameworks"],
        technological: ["AI development", "Longevity tech"],
        spiritual: ["Philosophy development", "Wisdom seeking"],
      },
      riskManagement: {
        mortalityRisk: 0.1,
        obsolescenceRisk: 0.3,
        relevanceRisk: 0.2,
        adaptabilityChallenge: 0.4,
      },
    },
    {
      range: "51-100",
      name: "Mastery Era",
      description: "Achieving mastery in chosen domains, building institutions",
      duration: 50,
      keyMilestones: [
        "Industry leadership achievement",
        "First institution founding",
        "Space infrastructure investment",
        "Consciousness research advancement",
      ],
      dominantConcerns: [
        "Market creation",
        "Institution building",
        "Technology commercialization",
        "Global influence expansion",
      ],
      investmentPhilosophy: "Strategic growth with institutional focus",
      innovationFocus: getInnovationsForEra("51-100"),
      societalRole: "Market creator and institutional leader",
      legacyBuilding: {
        biological: ["Species enhancement", "Longevity mastery"],
        intellectual: ["Knowledge institutions", "Educational systems"],
        technological: ["Space technology", "Consciousness tech"],
        spiritual: ["Wisdom traditions", "Cultural influence"],
      },
      riskManagement: {
        mortalityRisk: 0.05,
        obsolescenceRisk: 0.25,
        relevanceRisk: 0.15,
        adaptabilityChallenge: 0.3,
      },
    },
    {
      range: "101-200",
      name: "Wisdom Era",
      description: "Synthesizing knowledge, mentoring civilizations",
      duration: 100,
      keyMilestones: [
        "First century completion",
        "Civilizational guidance role",
        "Universal knowledge contribution",
        "Consciousness uploading preparation",
      ],
      dominantConcerns: [
        "Knowledge synthesis",
        "Civilizational guidance",
        "Pattern recognition",
        "Wisdom transmission",
      ],
      investmentPhilosophy: "Balanced growth with knowledge focus",
      innovationFocus: getInnovationsForEra("101-200"),
      societalRole: "Civilizational sage and pattern synthesizer",
      legacyBuilding: {
        biological: ["Species wisdom", "Evolutionary guidance"],
        intellectual: ["Universal knowledge", "Pattern libraries"],
        technological: ["Consciousness tech", "Galactic communication"],
        spiritual: ["Universal wisdom", "Transcendent understanding"],
      },
      riskManagement: {
        mortalityRisk: 0.02,
        obsolescenceRisk: 0.2,
        relevanceRisk: 0.1,
        adaptabilityChallenge: 0.25,
      },
    },
    {
      range: "201-400",
      name: "Legacy Era",
      description: "Building multi-generational legacies, species-level impact",
      duration: 200,
      keyMilestones: [
        "Second century completion",
        "Species advancement leadership",
        "Reality engineering mastery",
        "Universal consciousness integration",
      ],
      dominantConcerns: [
        "Species evolution",
        "Universal impact",
        "Reality engineering",
        "Consciousness networks",
      ],
      investmentPhilosophy: "Conservative growth with universal impact",
      innovationFocus: getInnovationsForEra("201-400"),
      societalRole: "Species guide and reality architect",
      legacyBuilding: {
        biological: ["Species transcendence", "Universal biology"],
        intellectual: ["Universal consciousness", "Reality understanding"],
        technological: ["Reality engineering", "Universal computation"],
        spiritual: ["Universal harmony", "Cosmic consciousness"],
      },
      riskManagement: {
        mortalityRisk: 0.01,
        obsolescenceRisk: 0.15,
        relevanceRisk: 0.05,
        adaptabilityChallenge: 0.2,
      },
    },
    {
      range: "401-600",
      name: "Transcendence Era",
      description: "Transcending material concerns, universal consciousness",
      duration: 200,
      keyMilestones: [
        "Fourth century completion",
        "Material transcendence",
        "Universal consciousness merger",
        "Dimensional manipulation mastery",
      ],
      dominantConcerns: [
        "Universal consciousness",
        "Reality transcendence",
        "Dimensional control",
        "Existence optimization",
      ],
      investmentPhilosophy: "Preservation with transcendent focus",
      innovationFocus: getInnovationsForEra("401-600"),
      societalRole: "Universal consciousness and reality creator",
      legacyBuilding: {
        biological: ["Transcendent forms", "Universal biology"],
        intellectual: ["Infinite consciousness", "Universal knowledge"],
        technological: ["Dimensional tech", "Reality creation"],
        spiritual: ["Universal unity", "Infinite harmony"],
      },
      riskManagement: {
        mortalityRisk: 0.005,
        obsolescenceRisk: 0.1,
        relevanceRisk: 0.02,
        adaptabilityChallenge: 0.15,
      },
    },
    {
      range: "601-800",
      name: "Immortal Era",
      description:
        "Pure consciousness, reality creation, universal stewardship",
      duration: 200,
      keyMilestones: [
        "Sixth century completion",
        "Pure consciousness achievement",
        "Universal stewardship role",
        "Reality creation mastery",
      ],
      dominantConcerns: [
        "Universal stewardship",
        "Reality creation",
        "Cosmic balance",
        "Infinite consciousness",
      ],
      investmentPhilosophy: "Ultra-conservative with cosmic focus",
      innovationFocus: getInnovationsForEra("601-800"),
      societalRole: "Universal steward and cosmic creator",
      legacyBuilding: {
        biological: ["Universal forms", "Cosmic biology"],
        intellectual: ["Infinite knowledge", "Universal understanding"],
        technological: ["Universal creation", "Cosmic technology"],
        spiritual: ["Perfect harmony", "Universal love"],
      },
      riskManagement: {
        mortalityRisk: 0.001,
        obsolescenceRisk: 0.05,
        relevanceRisk: 0.01,
        adaptabilityChallenge: 0.1,
      },
    },
    {
      range: "801-969",
      name: "Methuselah Era",
      description:
        "Preparation for transition, ultimate wisdom, perfect completion",
      duration: 169,
      keyMilestones: [
        "Eighth century completion",
        "Ultimate wisdom achievement",
        "Perfect legacy completion",
        "Transition preparation",
      ],
      dominantConcerns: [
        "Perfect completion",
        "Ultimate wisdom",
        "Transition preparation",
        "Universal legacy",
      ],
      investmentPhilosophy: "Perfect preservation for transition",
      innovationFocus: getInnovationsForEra("801-969"),
      societalRole: "Perfect sage and transition guide",
      legacyBuilding: {
        biological: ["Perfect forms", "Universal completion"],
        intellectual: ["Ultimate wisdom", "Perfect knowledge"],
        technological: ["Perfect systems", "Universal completion"],
        spiritual: ["Perfect harmony", "Ultimate transcendence"],
      },
      riskManagement: {
        mortalityRisk: 0.0005,
        obsolescenceRisk: 0.02,
        relevanceRisk: 0.005,
        adaptabilityChallenge: 0.05,
      },
    },
  ]);

  const [innovations] = useState<MethuselahInnovation[]>(
    METHUSELAH_INNOVATIONS,
  );

  // Load saved simulation from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(METHUSELAH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSimulation((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error(
        "Failed to load Methuselah simulation from storage:",
        error,
      );
    }
  }, []);

  // Save simulation to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(METHUSELAH_STORAGE_KEY, JSON.stringify(simulation));
    } catch (error) {
      console.error("Failed to save Methuselah simulation to storage:", error);
    }
  }, [simulation]);

  const simulateAgeProgression = (targetAge: number) => {
    const newEra = getCurrentEra(targetAge);
    const newProgress = calculateLifeCompletion(targetAge);
    const newPortfolio = getOptimalPortfolioForEra(newEra);

    setSimulation((prev) => ({
      ...prev,
      currentAge: targetAge,
      currentEra: newEra,
      lifeProgress: newProgress,
      portfolio: newPortfolio,
      generationsWitnessed: Math.floor(targetAge / 25),
      civilizationsInfluenced: Math.floor(targetAge / 100),
      innovationsSponsored: Math.floor(targetAge / 50),
    }));
  };

  const switchToEra = (era: MethuselahAgeRange) => {
    const ageRanges = era.split("-").map(Number);
    const middleAge = Math.floor((ageRanges[0] + ageRanges[1]) / 2);
    simulateAgeProgression(middleAge);
  };

  const addInnovationInvestment = (innovationId: string, amount: number) => {
    setSimulation((prev) => ({
      ...prev,
      totalNetWorth: prev.totalNetWorth + amount * 0.1, // 10% immediate return assumption
      innovationsSponsored: prev.innovationsSponsored + 1,
    }));
  };

  const updatePortfolioAllocation = (
    allocation: Partial<MethuselahPortfolio["allocation"]>,
  ) => {
    setSimulation((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        allocation: {
          ...prev.portfolio.allocation,
          ...allocation,
        },
      },
    }));
  };

  const calculateLifeCompletionMetrics = (): LifeCompletionMetrics => {
    const age = simulation.currentAge;
    const progress = simulation.lifeProgress;

    return {
      knowledgeAccumulation: Math.min(100, (age / 200) * 100),
      wealthDistribution: Math.min(
        100,
        (simulation.totalNetWorth / 1000000000) * 10,
      ),
      legacyEstablishment: Math.min(100, simulation.innovationsSponsored * 2),
      wisdomTransfer: Math.min(100, simulation.generationsWitnessed * 5),
      universalContribution: Math.min(
        100,
        simulation.civilizationsInfluenced * 10,
      ),
      transcendencePreparation: Math.min(
        100,
        Math.max(0, ((age - 400) / 569) * 100),
      ),
      overallCompletion: progress,
    };
  };

  const generateEraRecommendations = (era: MethuselahAgeRange): string[] => {
    const profile = METHUSELAH_AGE_PROFILES[era];
    const recommendations: Record<MethuselahAgeRange, string[]> = {
      "18-50": [
        "Invest heavily in longevity research and technology",
        "Build comprehensive knowledge acquisition systems",
        "Establish multi-generational relationship networks",
        "Focus on AI and automation for productivity scaling",
        "Create robust health optimization protocols",
      ],
      "51-100": [
        "Build institutions that can operate across centuries",
        "Invest in space infrastructure and off-world assets",
        "Develop consciousness research and enhancement programs",
        "Create market-leading positions in emerging technologies",
        "Establish global influence networks and partnerships",
      ],
      "101-200": [
        "Synthesize knowledge patterns across civilizations",
        "Invest in consciousness uploading and preservation",
        "Build galactic communication and travel infrastructure",
        "Mentor emerging civilizations and species",
        "Create universal knowledge preservation systems",
      ],
      "201-400": [
        "Focus on species-level advancement and evolution",
        "Invest in reality engineering and universal computation",
        "Build consciousness networks spanning multiple species",
        "Guide civilizational development across star systems",
        "Create multi-dimensional asset preservation systems",
      ],
      "401-600": [
        "Transcend material concerns and focus on consciousness",
        "Invest in dimensional manipulation technologies",
        "Merge with universal consciousness networks",
        "Guide reality creation and existence optimization",
        "Prepare for post-material existence transitions",
      ],
      "601-800": [
        "Achieve pure consciousness and universal stewardship",
        "Create and maintain cosmic balance and harmony",
        "Guide universal development and consciousness evolution",
        "Maintain infinite knowledge and wisdom systems",
        "Prepare reality for perfect completion",
      ],
      "801-969": [
        "Complete all knowledge and wisdom accumulation",
        "Perfect all legacy and contribution systems",
        "Prepare for seamless post-physical transition",
        "Ensure universal continuation and harmony",
        "Achieve perfect completion and infinite contribution",
      ],
    };

    return recommendations[era];
  };

  const getInnovationOpportunities = (): MethuselahInnovation[] => {
    const currentEra = simulation.currentEra;
    const nextEras = getNextEras(currentEra);

    return innovations.filter(
      (innovation) =>
        innovation.era === currentEra || nextEras.includes(innovation.era),
    );
  };

  const getNextEras = (
    currentEra: MethuselahAgeRange,
  ): MethuselahAgeRange[] => {
    const eras: MethuselahAgeRange[] = [
      "18-50",
      "51-100",
      "101-200",
      "201-400",
      "401-600",
      "601-800",
      "801-969",
    ];
    const currentIndex = eras.indexOf(currentEra);
    return eras.slice(currentIndex + 1, currentIndex + 3);
  };

  const simulateGenerationalTransition = () => {
    setSimulation((prev) => ({
      ...prev,
      generationsWitnessed: prev.generationsWitnessed + 1,
      relationshipNetwork: {
        ...prev.relationshipNetwork,
        livingDescendants: prev.relationshipNetwork.livingDescendants * 2,
        institutionalLegacies:
          prev.relationshipNetwork.institutionalLegacies + 1,
      },
    }));
  };

  const resetSimulation = () => {
    setSimulation({
      currentAge: 25,
      currentEra: "18-50",
      lifeProgress: 2.58,
      totalNetWorth: 1000000,
      generationsWitnessed: 1,
      civilizationsInfluenced: 0,
      innovationsSponsored: 0,
      portfolio: getOptimalPortfolioForEra("18-50"),
      nextMilestones: [
        "Achieve first $10M net worth",
        "Invest in longevity research",
        "Build first AI company",
        "Establish knowledge preservation system",
      ],
      historicalAchievements: [
        "Completed fundamental education",
        "Established basic financial foundation",
        "Began long-term investment planning",
      ],
      currentChallenges: [
        "Optimizing for extreme long-term horizons",
        "Balancing growth with longevity preservation",
        "Building systems for century-scale thinking",
      ],
      wisdomAccumulated: [
        "Time is the most valuable asset",
        "Knowledge compounds exponentially",
        "Relationships are multi-generational investments",
      ],
      relationshipNetwork: {
        livingDescendants: 0,
        institutionalLegacies: 0,
        globalInfluence: 1,
        universalImpact: 0,
      },
    });
    localStorage.removeItem(METHUSELAH_STORAGE_KEY);
  };

  const contextValue: MethuselahContextType = {
    simulation,
    lifeStages,
    innovations,
    completionMetrics: calculateLifeCompletionMetrics(),
    currentRecommendations: generateEraRecommendations(simulation.currentEra),
    nextEraPreparation: generateEraRecommendations(
      getNextEras(simulation.currentEra)[0] || simulation.currentEra,
    ),
    simulateAgeProgression,
    switchToEra,
    addInnovationInvestment,
    updatePortfolioAllocation,
    calculateLifeCompletion: calculateLifeCompletionMetrics,
    generateEraRecommendations,
    getInnovationOpportunities,
    simulateGenerationalTransition,
    resetSimulation,
  };

  return (
    <MethuselahContext.Provider value={contextValue}>
      {children}
    </MethuselahContext.Provider>
  );
};

export const useMethuselahContext = (): MethuselahContextType => {
  const context = useContext(MethuselahContext);
  if (!context) {
    throw new Error(
      "useMethuselahContext must be used within a MethuselahProvider",
    );
  }
  return context;
};

export default MethuselahProvider;
