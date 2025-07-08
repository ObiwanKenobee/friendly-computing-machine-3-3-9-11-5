import { singletonPattern } from "../utils/singletonPattern";

export interface LocalizationProject {
  id: string;
  name: string;
  description: string;
  sourceLanguage: string;
  targetLanguages: string[];
  status: "planning" | "in_progress" | "review" | "completed" | "paused";
  progress: number; // 0-100
  totalStrings: number;
  translatedStrings: number;
  reviewedStrings: number;
  approvedStrings: number;
  createdAt: Date;
  dueDate: Date;
  assignedTranslators: string[];
  regions: string[];
  priority: "low" | "medium" | "high" | "critical";
}

export interface TranslationString {
  id: string;
  key: string;
  sourceText: string;
  context: string;
  category: "ui" | "content" | "legal" | "marketing" | "error" | "help";
  characterCount: number;
  translations: Map<string, Translation>;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    frequency: number; // how often this string is used
    complexity: "simple" | "medium" | "complex";
    tags: string[];
  };
}

export interface Translation {
  text: string;
  status: "pending" | "translated" | "reviewed" | "approved" | "rejected";
  translator: string;
  reviewer?: string;
  translatedAt: Date;
  reviewedAt?: Date;
  approvedAt?: Date;
  feedback?: string;
  quality: number; // 0-100 AI quality score
  cultural: {
    appropriateness: number; // 0-100
    localization: number; // 0-100 how well localized vs literal
    formality: "formal" | "informal" | "neutral";
  };
}

export interface Translator {
  id: string;
  name: string;
  email: string;
  languages: string[];
  specializations: string[];
  experience: number; // years
  rating: number; // 0-5
  completedProjects: number;
  avgDeliveryTime: number; // hours
  isNative: Record<string, boolean>;
  certifications: string[];
  timezone: string;
  status: "available" | "busy" | "unavailable";
}

export interface LocalizationMemory {
  sourceText: string;
  targetText: string;
  language: string;
  context: string;
  usage: number;
  lastUsed: Date;
  quality: number;
  approved: boolean;
}

export interface CulturalAdaptation {
  language: string;
  region: string;
  adaptations: {
    colors: Record<string, string>;
    dateFormats: string;
    numberFormats: string;
    currencyFormats: string;
    nameFormats: string;
    addressFormats: string;
    phoneFormats: string;
    culturalConsiderations: string[];
    businessHours: string;
    holidays: Array<{ name: string; date: string; significance: string }>;
  };
}

export interface QualityMetrics {
  projectId: string;
  language: string;
  metrics: {
    accuracy: number; // 0-100
    fluency: number; // 0-100
    consistency: number; // 0-100
    culturalAppropriate: number; // 0-100
    terminology: number; // 0-100
    overall: number; // 0-100
  };
  issues: Array<{
    type: "terminology" | "grammar" | "cultural" | "consistency" | "accuracy";
    description: string;
    severity: "low" | "medium" | "high";
    suggestion: string;
  }>;
  reviewedBy: string;
  reviewDate: Date;
}

class LocalizationService {
  private projects: Map<string, LocalizationProject> = new Map();
  private strings: Map<string, TranslationString> = new Map();
  private translators: Map<string, Translator> = new Map();
  private translationMemory: LocalizationMemory[] = [];
  private culturalAdaptations: Map<string, CulturalAdaptation> = new Map();
  private qualityMetrics: Map<string, QualityMetrics> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize with sample data
    await this.createSampleProjects();
    await this.createSampleStrings();
    await this.createSampleTranslators();
    await this.createSampleCulturalAdaptations();

    // Start background processes
    this.startQualityMonitoring();
    this.startProgressTracking();

    this.isInitialized = true;
    console.log(
      "Localization Service initialized with translation and content management",
    );
  }

  private async createSampleProjects(): Promise<void> {
    const sampleProjects: LocalizationProject[] = [
      {
        id: "proj-african-markets",
        name: "African Markets Localization",
        description: "Complete localization for West and East African markets",
        sourceLanguage: "en-US",
        targetLanguages: ["fr-FR", "pt-BR", "ar-SA", "sw-KE", "ha-NG", "yo-NG"],
        status: "in_progress",
        progress: 78,
        totalStrings: 2850,
        translatedStrings: 2223,
        reviewedStrings: 1890,
        approvedStrings: 1750,
        createdAt: new Date("2024-02-01"),
        dueDate: new Date("2024-06-01"),
        assignedTranslators: ["trans-001", "trans-002", "trans-003"],
        regions: ["africa-west", "africa-east", "middle-east"],
        priority: "high",
      },
      {
        id: "proj-eu-expansion",
        name: "European Union Expansion",
        description: "Localization for major EU markets",
        sourceLanguage: "en-US",
        targetLanguages: ["de-DE", "fr-FR", "es-ES", "it-IT", "nl-NL"],
        status: "completed",
        progress: 100,
        totalStrings: 3200,
        translatedStrings: 3200,
        reviewedStrings: 3200,
        approvedStrings: 3180,
        createdAt: new Date("2023-11-01"),
        dueDate: new Date("2024-02-01"),
        assignedTranslators: ["trans-004", "trans-005", "trans-006"],
        regions: ["eu-west", "eu-central"],
        priority: "critical",
      },
      {
        id: "proj-latam",
        name: "Latin America Localization",
        description:
          "Spanish and Portuguese localization for Latin American markets",
        sourceLanguage: "en-US",
        targetLanguages: ["es-MX", "es-AR", "pt-BR"],
        status: "review",
        progress: 92,
        totalStrings: 2100,
        translatedStrings: 2100,
        reviewedStrings: 1932,
        approvedStrings: 1800,
        createdAt: new Date("2024-01-15"),
        dueDate: new Date("2024-04-15"),
        assignedTranslators: ["trans-007", "trans-008"],
        regions: ["latam"],
        priority: "medium",
      },
    ];

    for (const project of sampleProjects) {
      this.projects.set(project.id, project);
    }
  }

  private async createSampleStrings(): Promise<void> {
    const sampleStrings: TranslationString[] = [
      {
        id: "str-001",
        key: "dashboard.portfolio.value",
        sourceText: "Portfolio Value",
        context: "Main dashboard showing user's total investment value",
        category: "ui",
        characterCount: 15,
        translations: new Map([
          [
            "fr-FR",
            {
              text: "Valeur du Portefeuille",
              status: "approved",
              translator: "trans-001",
              reviewer: "rev-001",
              translatedAt: new Date("2024-03-10"),
              reviewedAt: new Date("2024-03-12"),
              approvedAt: new Date("2024-03-13"),
              quality: 95,
              cultural: {
                appropriateness: 98,
                localization: 92,
                formality: "formal",
              },
            },
          ],
          [
            "de-DE",
            {
              text: "Portfoliowert",
              status: "approved",
              translator: "trans-004",
              reviewer: "rev-002",
              translatedAt: new Date("2024-03-08"),
              reviewedAt: new Date("2024-03-10"),
              approvedAt: new Date("2024-03-11"),
              quality: 97,
              cultural: {
                appropriateness: 99,
                localization: 95,
                formality: "formal",
              },
            },
          ],
        ]),
        metadata: {
          createdAt: new Date("2024-02-15"),
          updatedAt: new Date("2024-03-13"),
          frequency: 1000, // viewed 1000 times per day
          complexity: "simple",
          tags: ["dashboard", "finance", "portfolio"],
        },
      },
      {
        id: "str-002",
        key: "investment.risk.warning",
        sourceText:
          "Investments carry risk and may lose value. Past performance does not guarantee future results.",
        context: "Legal disclaimer shown before investment actions",
        category: "legal",
        characterCount: 95,
        translations: new Map([
          [
            "fr-FR",
            {
              text: "Les investissements comportent des risques et peuvent perdre de la valeur. Les performances passées ne garantissent pas les résultats futurs.",
              status: "approved",
              translator: "trans-001",
              reviewer: "rev-001",
              translatedAt: new Date("2024-03-12"),
              reviewedAt: new Date("2024-03-14"),
              approvedAt: new Date("2024-03-15"),
              quality: 99,
              cultural: {
                appropriateness: 100,
                localization: 98,
                formality: "formal",
              },
            },
          ],
        ]),
        metadata: {
          createdAt: new Date("2024-02-20"),
          updatedAt: new Date("2024-03-15"),
          frequency: 500,
          complexity: "complex",
          tags: ["legal", "disclaimer", "risk"],
        },
      },
    ];

    for (const string of sampleStrings) {
      this.strings.set(string.id, string);
    }
  }

  private async createSampleTranslators(): Promise<void> {
    const sampleTranslators: Translator[] = [
      {
        id: "trans-001",
        name: "Marie Dubois",
        email: "marie.dubois@quantumvest.io",
        languages: ["fr-FR", "en-US"],
        specializations: ["Financial Translation", "Legal Documents", "UI/UX"],
        experience: 8,
        rating: 4.9,
        completedProjects: 245,
        avgDeliveryTime: 24,
        isNative: { "fr-FR": true, "en-US": false },
        certifications: ["ATA Certified", "Financial Translation Certificate"],
        timezone: "Europe/Paris",
        status: "available",
      },
      {
        id: "trans-002",
        name: "Ahmad Hassan",
        email: "ahmad.hassan@quantumvest.io",
        languages: ["ar-SA", "en-US", "fr-FR"],
        specializations: [
          "Islamic Finance",
          "Cultural Adaptation",
          "Marketing",
        ],
        experience: 6,
        rating: 4.7,
        completedProjects: 189,
        avgDeliveryTime: 36,
        isNative: { "ar-SA": true, "en-US": false, "fr-FR": false },
        certifications: [
          "Islamic Finance Specialist",
          "MENA Localization Expert",
        ],
        timezone: "Asia/Riyadh",
        status: "busy",
      },
      {
        id: "trans-003",
        name: "Amara Okafor",
        email: "amara.okafor@quantumvest.io",
        languages: ["ha-NG", "yo-NG", "en-US"],
        specializations: [
          "Nigerian Markets",
          "Mobile Banking",
          "Cultural Finance",
        ],
        experience: 4,
        rating: 4.8,
        completedProjects: 134,
        avgDeliveryTime: 48,
        isNative: { "ha-NG": true, "yo-NG": true, "en-US": false },
        certifications: ["West African Finance Specialist"],
        timezone: "Africa/Lagos",
        status: "available",
      },
    ];

    for (const translator of sampleTranslators) {
      this.translators.set(translator.id, translator);
    }
  }

  private async createSampleCulturalAdaptations(): Promise<void> {
    const adaptations: CulturalAdaptation[] = [
      {
        language: "ar-SA",
        region: "middle-east",
        adaptations: {
          colors: {
            primary: "#1B4332", // Green for Islamic finance
            secondary: "#D4AF37", // Gold
            warning: "#8B4513", // Brown instead of red
            success: "#228B22",
          },
          dateFormats: "DD/MM/YYYY (Hijri calendar support)",
          numberFormats: "٠١٢٣٤٥٦٧٨٩ (Arabic-Indic digits)",
          currencyFormats: "SAR ١٢٣٬٤٥٦٫٧٨",
          nameFormats: "Full name with patronymic",
          addressFormats: "Building, Street, District, City, Province",
          phoneFormats: "+966-XX-XXX-XXXX",
          culturalConsiderations: [
            "Sharia-compliant investment options",
            "Prayer time considerations",
            "Halal certification indicators",
            "Gender-sensitive UI elements",
          ],
          businessHours: "Sunday to Thursday, 9 AM - 6 PM",
          holidays: [
            {
              name: "Eid al-Fitr",
              date: "Variable (Lunar)",
              significance: "End of Ramadan",
            },
            {
              name: "Eid al-Adha",
              date: "Variable (Lunar)",
              significance: "Feast of Sacrifice",
            },
            {
              name: "National Day",
              date: "September 23",
              significance: "Saudi National Day",
            },
          ],
        },
      },
      {
        language: "ha-NG",
        region: "africa-west",
        adaptations: {
          colors: {
            primary: "#008751", // Nigerian green
            secondary: "#FFFFFF", // Nigerian white
            accent: "#FFD700", // Gold for prosperity
            success: "#32CD32",
          },
          dateFormats: "DD/MM/YYYY",
          numberFormats: "123,456.78 (Western format)",
          currencyFormats: "₦123,456.78",
          nameFormats: "Given name + Family name + Tribal name",
          addressFormats: "House number, Street, Area, LGA, State",
          phoneFormats: "+234-XXX-XXX-XXXX",
          culturalConsiderations: [
            "Community-based investment options",
            "Islamic banking for Muslim populations",
            "Extended family financial planning",
            "Local proverbs and expressions",
            "Respect for elders in financial decisions",
          ],
          businessHours: "Monday to Friday, 8 AM - 5 PM",
          holidays: [
            {
              name: "Independence Day",
              date: "October 1",
              significance: "Nigerian Independence",
            },
            {
              name: "Eid al-Fitr",
              date: "Variable",
              significance: "Islamic holiday",
            },
            {
              name: "Christmas",
              date: "December 25",
              significance: "Christian holiday",
            },
            {
              name: "Democracy Day",
              date: "June 12",
              significance: "Return to democracy",
            },
          ],
        },
      },
    ];

    for (const adaptation of adaptations) {
      const key = `${adaptation.language}-${adaptation.region}`;
      this.culturalAdaptations.set(key, adaptation);
    }
  }

  async getLocalizationProgress(): Promise<
    Array<{
      language: string;
      region: string;
      progress: number;
      totalStrings: number;
      translatedStrings: number;
      reviewedStrings: number;
      status: string;
    }>
  > {
    const progressData = [
      {
        language: "French",
        region: "West Africa",
        progress: 89,
        totalStrings: 2850,
        translatedStrings: 2537,
        reviewedStrings: 2280,
        status: "in_progress",
      },
      {
        language: "Arabic",
        region: "North Africa",
        progress: 72,
        totalStrings: 2850,
        translatedStrings: 2052,
        reviewedStrings: 1540,
        status: "in_progress",
      },
      {
        language: "Hausa",
        region: "Nigeria",
        progress: 65,
        totalStrings: 1200,
        translatedStrings: 780,
        reviewedStrings: 650,
        status: "in_progress",
      },
      {
        language: "Yoruba",
        region: "Nigeria",
        progress: 58,
        totalStrings: 1200,
        translatedStrings: 696,
        reviewedStrings: 580,
        status: "in_progress",
      },
      {
        language: "Swahili",
        region: "East Africa",
        progress: 45,
        totalStrings: 2200,
        translatedStrings: 990,
        reviewedStrings: 770,
        status: "pending",
      },
      {
        language: "Portuguese",
        region: "Brazil",
        progress: 95,
        totalStrings: 3200,
        translatedStrings: 3040,
        reviewedStrings: 2980,
        status: "review",
      },
    ];

    return progressData;
  }

  async getProjects(filters?: {
    status?: string;
    priority?: string;
    region?: string;
  }): Promise<LocalizationProject[]> {
    let projects = Array.from(this.projects.values());

    if (filters?.status) {
      projects = projects.filter((p) => p.status === filters.status);
    }

    if (filters?.priority) {
      projects = projects.filter((p) => p.priority === filters.priority);
    }

    if (filters?.region) {
      projects = projects.filter((p) => p.regions.includes(filters.region!));
    }

    return projects.sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff =
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      if (priorityDiff !== 0) return priorityDiff;

      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }

  async createProject(
    projectData: Omit<
      LocalizationProject,
      | "id"
      | "createdAt"
      | "progress"
      | "translatedStrings"
      | "reviewedStrings"
      | "approvedStrings"
    >,
  ): Promise<LocalizationProject> {
    const project: LocalizationProject = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      progress: 0,
      translatedStrings: 0,
      reviewedStrings: 0,
      approvedStrings: 0,
      ...projectData,
    };

    this.projects.set(project.id, project);
    return project;
  }

  async updateProject(
    projectId: string,
    updates: Partial<LocalizationProject>,
  ): Promise<LocalizationProject | null> {
    const project = this.projects.get(projectId);
    if (!project) return null;

    Object.assign(project, updates);
    return project;
  }

  async getStrings(filters?: {
    category?: string;
    status?: string;
    language?: string;
  }): Promise<TranslationString[]> {
    let strings = Array.from(this.strings.values());

    if (filters?.category) {
      strings = strings.filter((s) => s.category === filters.category);
    }

    if (filters?.language && filters?.status) {
      strings = strings.filter((s) => {
        const translation = s.translations.get(filters.language!);
        return translation && translation.status === filters.status;
      });
    }

    return strings.sort((a, b) => b.metadata.frequency - a.metadata.frequency);
  }

  async translateString(
    stringId: string,
    language: string,
    translatorId: string,
    translatedText: string,
  ): Promise<Translation | null> {
    const string = this.strings.get(stringId);
    const translator = this.translators.get(translatorId);

    if (!string || !translator) return null;

    const translation: Translation = {
      text: translatedText,
      status: "translated",
      translator: translatorId,
      translatedAt: new Date(),
      quality: this.calculateQualityScore(
        string.sourceText,
        translatedText,
        language,
      ),
      cultural: {
        appropriateness: 85 + Math.random() * 15,
        localization: 80 + Math.random() * 20,
        formality: this.determineFormalityLevel(string.category),
      },
    };

    string.translations.set(language, translation);
    string.metadata.updatedAt = new Date();

    // Add to translation memory
    this.translationMemory.push({
      sourceText: string.sourceText,
      targetText: translatedText,
      language,
      context: string.context,
      usage: 1,
      lastUsed: new Date(),
      quality: translation.quality,
      approved: false,
    });

    return translation;
  }

  private calculateQualityScore(
    sourceText: string,
    translatedText: string,
    language: string,
  ): number {
    // Simplified quality scoring algorithm
    let score = 85; // Base score

    // Length ratio check
    const lengthRatio = translatedText.length / sourceText.length;
    if (lengthRatio < 0.5 || lengthRatio > 3) {
      score -= 10; // Suspicious length difference
    }

    // Check for untranslated terms (same as source)
    if (translatedText === sourceText) {
      score -= 30; // Likely untranslated
    }

    // Check for common translation patterns
    if (language.startsWith("ar") && /[a-zA-Z]/.test(translatedText)) {
      score += 5; // Good mixed script handling
    }

    // Add randomness for simulation
    score += Math.random() * 10 - 5;

    return Math.max(0, Math.min(100, score));
  }

  private determineFormalityLevel(
    category: string,
  ): "formal" | "informal" | "neutral" {
    switch (category) {
      case "legal":
        return "formal";
      case "marketing":
        return "informal";
      case "ui":
        return "neutral";
      case "help":
        return "neutral";
      case "error":
        return "neutral";
      default:
        return "neutral";
    }
  }

  async reviewTranslation(
    stringId: string,
    language: string,
    reviewerId: string,
    approved: boolean,
    feedback?: string,
  ): Promise<Translation | null> {
    const string = this.strings.get(stringId);
    if (!string) return null;

    const translation = string.translations.get(language);
    if (!translation) return null;

    translation.reviewer = reviewerId;
    translation.reviewedAt = new Date();
    translation.status = approved ? "approved" : "rejected";
    translation.feedback = feedback;

    if (approved) {
      translation.approvedAt = new Date();

      // Update translation memory
      const memoryEntry = this.translationMemory.find(
        (tm) => tm.sourceText === string.sourceText && tm.language === language,
      );
      if (memoryEntry) {
        memoryEntry.approved = true;
        memoryEntry.usage++;
        memoryEntry.lastUsed = new Date();
      }
    }

    string.metadata.updatedAt = new Date();
    return translation;
  }

  async getTranslators(filters?: {
    language?: string;
    specialization?: string;
    availability?: string;
  }): Promise<Translator[]> {
    let translators = Array.from(this.translators.values());

    if (filters?.language) {
      translators = translators.filter((t) =>
        t.languages.includes(filters.language!),
      );
    }

    if (filters?.specialization) {
      translators = translators.filter((t) =>
        t.specializations.some((s) =>
          s.toLowerCase().includes(filters.specialization!.toLowerCase()),
        ),
      );
    }

    if (filters?.availability) {
      translators = translators.filter(
        (t) => t.status === filters.availability,
      );
    }

    return translators.sort((a, b) => b.rating - a.rating);
  }

  async assignTranslator(
    projectId: string,
    translatorId: string,
  ): Promise<boolean> {
    const project = this.projects.get(projectId);
    const translator = this.translators.get(translatorId);

    if (!project || !translator) return false;

    if (!project.assignedTranslators.includes(translatorId)) {
      project.assignedTranslators.push(translatorId);
      translator.status = "busy";
    }

    return true;
  }

  async getCulturalAdaptation(
    language: string,
    region: string,
  ): Promise<CulturalAdaptation | null> {
    const key = `${language}-${region}`;
    return this.culturalAdaptations.get(key) || null;
  }

  async getTranslationMemory(
    sourceText: string,
    targetLanguage: string,
  ): Promise<LocalizationMemory[]> {
    return this.translationMemory
      .filter(
        (tm) =>
          tm.language === targetLanguage &&
          (tm.sourceText.includes(sourceText) ||
            sourceText.includes(tm.sourceText)),
      )
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5); // Return top 5 matches
  }

  async generateQualityReport(projectId: string): Promise<QualityMetrics[]> {
    const project = this.projects.get(projectId);
    if (!project) return [];

    return project.targetLanguages.map((language) => {
      const metrics: QualityMetrics = {
        projectId,
        language,
        metrics: {
          accuracy: 85 + Math.random() * 10,
          fluency: 88 + Math.random() * 8,
          consistency: 82 + Math.random() * 12,
          culturalAppropriate: 90 + Math.random() * 10,
          terminology: 87 + Math.random() * 10,
          overall: 0,
        },
        issues: [],
        reviewedBy: "quality-ai-system",
        reviewDate: new Date(),
      };

      // Calculate overall score
      const values = Object.values(metrics.metrics).slice(0, -1); // Exclude 'overall'
      metrics.metrics.overall =
        values.reduce((sum, val) => sum + val, 0) / values.length;

      // Generate sample issues
      if (metrics.metrics.consistency < 85) {
        metrics.issues.push({
          type: "consistency",
          description: 'Inconsistent translation of "portfolio" term',
          severity: "medium",
          suggestion: "Use standardized terminology glossary",
        });
      }

      if (metrics.metrics.culturalAppropriate < 90) {
        metrics.issues.push({
          type: "cultural",
          description: "Some terms may not be culturally appropriate",
          severity: "high",
          suggestion: "Review with native cultural consultant",
        });
      }

      this.qualityMetrics.set(`${projectId}-${language}`, metrics);
      return metrics;
    });
  }

  private startQualityMonitoring(): void {
    setInterval(() => {
      // Update quality scores for ongoing translations
      for (const string of this.strings.values()) {
        for (const [language, translation] of string.translations.entries()) {
          if (
            translation.status === "translated" ||
            translation.status === "reviewed"
          ) {
            // Simulate quality score adjustments based on usage
            const usage = string.metadata.frequency;
            if (usage > 100) {
              // High-frequency strings get more scrutiny
              translation.quality = Math.max(
                70,
                translation.quality - Math.random() * 2,
              );
            }
          }
        }
      }
    }, 300000); // Every 5 minutes
  }

  private startProgressTracking(): void {
    setInterval(() => {
      // Update project progress
      for (const project of this.projects.values()) {
        if (project.status === "in_progress") {
          // Simulate progress updates
          const increment = Math.random() * 2; // Up to 2% progress
          project.progress = Math.min(100, project.progress + increment);

          // Update string counts based on progress
          project.translatedStrings = Math.floor(
            project.totalStrings * (project.progress / 100),
          );
          project.reviewedStrings = Math.floor(project.translatedStrings * 0.8);
          project.approvedStrings = Math.floor(project.reviewedStrings * 0.9);

          // Check if project should move to review stage
          if (project.progress >= 100 && project.status === "in_progress") {
            project.status = "review";
          }
        }
      }
    }, 60000); // Every minute
  }

  async getProjectStats(): Promise<{
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalStrings: number;
    translatedStrings: number;
    averageProgress: number;
    activeLanguages: number;
  }> {
    const projects = Array.from(this.projects.values());

    return {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === "in_progress").length,
      completedProjects: projects.filter((p) => p.status === "completed")
        .length,
      totalStrings: projects.reduce((sum, p) => sum + p.totalStrings, 0),
      translatedStrings: projects.reduce(
        (sum, p) => sum + p.translatedStrings,
        0,
      ),
      averageProgress:
        projects.reduce((sum, p) => sum + p.progress, 0) / projects.length,
      activeLanguages: new Set(projects.flatMap((p) => p.targetLanguages)).size,
    };
  }

  async exportTranslations(
    projectId: string,
    format: "json" | "csv" | "xliff" = "json",
  ): Promise<{
    downloadUrl: string;
    filename: string;
    size: number;
  }> {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    // Simulate export generation
    const filename = `${project.name.replace(/\s+/g, "_")}_translations.${format}`;
    const size = Math.floor(Math.random() * 5000000) + 500000; // 0.5-5MB

    return {
      downloadUrl: `https://api.quantumvest.io/localization/projects/${projectId}/export`,
      filename,
      size,
    };
  }
}

export const localizationService = singletonPattern(
  () => new LocalizationService(),
);
