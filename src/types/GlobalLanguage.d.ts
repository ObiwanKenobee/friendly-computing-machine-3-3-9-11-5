/**
 * Global Language Sovereignty Type Definitions
 * Supporting 7,000+ living languages with cultural and regional context
 */

export interface LanguageSovereignty {
  code: string;
  name: string;
  nativeName: string;
  family: string;
  subfamily: string;
  speakers: number;
  sovereignTerritories: string[];
  culturalContext: string;
  writingSystem: string;
  direction: "ltr" | "rtl" | "ttb";
  innovationCycle: string;
  economicModel: string;
  isRightToLeft: boolean;
  isSovereignTerritory: boolean;
  supportLevel: "native" | "community" | "basic" | "machine";
  lastUpdated: Date;
}

export interface RegionalConfig {
  regionId: string;
  name: string;
  sovereignLanguages: string[];
  innovationCycle: InnovationCycleConfig;
  economicModel: string;
  governanceStyle: string;
  timeZones: string[];
  currencies: string[];
  culturalPriorities: string[];
}

export interface InnovationCycleConfig {
  name: string;
  duration: string;
  phases: string[];
  culturalValues: string[];
}

export interface InnovationCycle {
  name: string;
  currentPhase: string;
  phases: string[];
  culturalValues: string[];
  duration: string;
  startDate: Date;
  regionId: string;
}

export interface CulturalContext {
  languageCode: string;
  writingDirection: "ltr" | "rtl" | "ttb";
  numberFormat: string;
  dateFormat: string;
  currencyFormat: string;
  colorPreferences: Record<string, string>;
  iconPreferences: Record<string, string>;
  interactionPatterns: Record<string, any>;
  decisionMakingStyle: string;
  timeOrientation: string;
}

export interface SovereignTerritory {
  code: string;
  name: string;
  continent: string;
  primaryLanguages: string[];
  officialLanguages: string[];
  indigenousLanguages: string[];
  governanceSystem: string;
  economicSystem: string;
  culturalValues: string[];
  innovationApproach: string;
}

export interface LanguageSupportMetrics {
  totalLanguages: number;
  nativeSupport: number;
  communitySupport: number;
  machineSupport: number;
  activeUsers: Record<string, number>;
  translationQuality: Record<string, number>;
  culturalAdaptation: Record<string, number>;
}

export interface RegionalInnovationMetrics {
  regionId: string;
  participatingTerritories: number;
  activeProjects: number;
  communityEngagement: number;
  culturalAlignment: number;
  sovereigntyRespect: number;
  languageDiversity: number;
}

export interface GlobalLanguageStats {
  totalSupportedLanguages: number;
  activeSpeakers: number;
  sovereignTerritories: number;
  innovationCycles: number;
  translationPairs: number;
  culturalContexts: number;
  lastUpdated: Date;
}

export interface LanguagePreference {
  primaryLanguage: string;
  fallbackLanguages: string[];
  region: string;
  culturalContext: string;
  interactionStyle: string;
  learningLanguages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TranslationRequest {
  sourceLanguage: string;
  targetLanguage: string;
  text: string;
  context: "business" | "cultural" | "technical" | "legal" | "spiritual";
  culturalAdaptation: boolean;
  urgency: "low" | "medium" | "high" | "critical";
}

export interface TranslationResult {
  translatedText: string;
  confidence: number;
  culturalNotes?: string[];
  alternativeTranslations?: string[];
  sourceDetected?: string;
  reviewRequired: boolean;
}

export interface CulturalAdaptationRule {
  languageCode: string;
  rule: string;
  description: string;
  examples: string[];
  priority: number;
  isActive: boolean;
}

export interface SovereigntyValidation {
  territoryCode: string;
  languageCode: string;
  isOfficialLanguage: boolean;
  isIndigenousLanguage: boolean;
  speakerPercentage: number;
  constitutionalStatus: string;
  educationStatus: string;
  governmentUsage: string;
  lastValidated: Date;
}

export interface LanguageEvolutionTracker {
  languageCode: string;
  changes: LanguageChange[];
  trends: LanguageTrend[];
  predictions: LanguagePrediction[];
  communityContributions: number;
  lastAnalyzed: Date;
}

export interface LanguageChange {
  type: "vocabulary" | "grammar" | "pronunciation" | "writing" | "cultural";
  description: string;
  source: "community" | "academic" | "government" | "technology";
  confidence: number;
  dateDetected: Date;
}

export interface LanguageTrend {
  category: string;
  direction: "growing" | "stable" | "declining";
  strength: number;
  factors: string[];
  timeframe: string;
}

export interface LanguagePrediction {
  scenario: string;
  probability: number;
  timeframe: string;
  factors: string[];
  recommendations: string[];
}

export interface CommunityContribution {
  contributorId: string;
  languageCode: string;
  type: "translation" | "cultural-context" | "pronunciation" | "validation";
  content: string;
  status: "pending" | "approved" | "rejected";
  votes: number;
  submittedAt: Date;
}

export interface LanguageAccessibilityFeature {
  languageCode: string;
  feature: string;
  description: string;
  supportedDevices: string[];
  usageInstructions: string;
  isActive: boolean;
}

export interface MultilingualUser {
  userId: string;
  primaryLanguage: string;
  fluentLanguages: string[];
  learningLanguages: string[];
  preferredRegion: string;
  culturalBackground: string[];
  accessibilityNeeds: string[];
  innovationPreferences: string[];
}

export interface LanguageLearningProgress {
  userId: string;
  languageCode: string;
  proficiencyLevel:
    | "beginner"
    | "intermediate"
    | "advanced"
    | "fluent"
    | "native";
  skillAreas: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
    cultural: number;
  };
  lastAssessment: Date;
  learningGoals: string[];
}

export interface GlobalLanguageEvent {
  type:
    | "language-change"
    | "region-change"
    | "innovation-cycle-update"
    | "cultural-adaptation";
  timestamp: Date;
  data: any;
  source: string;
  impact: "low" | "medium" | "high" | "critical";
}
