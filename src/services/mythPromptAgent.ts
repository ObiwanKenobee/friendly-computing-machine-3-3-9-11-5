/**
 * 🧠 MythPromptAgent
 * Reflects indigenous, cultural, ecological impact through guided ethical AI prompts
 * Part of the Tortoise Protocol's Contemplation Phase
 */

import TortoiseProtocolService, { MythicInsight } from "./tortoiseProtocol";

export interface CulturalWisdomSource {
  culture: string;
  principles: string[];
  questionTemplates: string[];
  eldersVoices: string[];
  mythicFrameworks: string[];
}

export interface EthicalReflection {
  prompt: string;
  response: string;
  culturalLens: string[];
  ecologicalImpact: number; // 1-10 scale
  generationalWisdom: number; // 1-10 scale
  communityAlignment: number; // 1-10 scale
  shadowAnalysis: string[]; // Potential negative outcomes
  ancestralGuidance: string;
}

export interface MythicFramework {
  name: string;
  origin: string;
  coreTeaching: string;
  applicationPrompts: string[];
  warningSignals: string[];
}

/**
 * MythPromptAgent - Guides users through deep ethical reflection
 */
class MythPromptAgent {
  private static instance: MythPromptAgent;
  private tortoiseProtocol: TortoiseProtocolService;
  private culturalWisdom: Map<string, CulturalWisdomSource> = new Map();
  private mythicFrameworks: Map<string, MythicFramework> = new Map();

  private constructor() {
    this.tortoiseProtocol = TortoiseProtocolService.getInstance();
    this.initializeWisdomSources();
    this.initializeMythicFrameworks();
  }

  public static getInstance(): MythPromptAgent {
    if (!MythPromptAgent.instance) {
      MythPromptAgent.instance = new MythPromptAgent();
    }
    return MythPromptAgent.instance;
  }

  private initializeWisdomSources(): void {
    // African Ubuntu Philosophy
    this.culturalWisdom.set("ubuntu", {
      culture: "Ubuntu (Southern African)",
      principles: [
        "I am because we are",
        "A person is a person through other persons",
        "Collective responsibility and interconnectedness",
        "Restorative rather than punitive justice",
      ],
      questionTemplates: [
        "How does this decision strengthen the bonds between us?",
        "What would happen if everyone in our community made this choice?",
        "How does this serve the collective healing and growth?",
        "Does this decision honor our shared humanity?",
      ],
      eldersVoices: [
        "Speak softly and carry wisdom, for words shape worlds",
        "The tree that grows alone falls first in the storm",
        "When the spider webs unite, they can tie up a lion",
      ],
      mythicFrameworks: ["web_of_life", "ancestral_council", "village_circle"],
    });

    // Indigenous Seventh Generation Principle
    this.culturalWisdom.set("seven_generations", {
      culture: "Indigenous/Native American",
      principles: [
        "Consider the impact seven generations into the future",
        "All decisions must serve the children not yet born",
        "We are caretakers, not owners of the earth",
        "Every action creates ripples through time",
      ],
      questionTemplates: [
        "What will the children seven generations from now inherit from this?",
        "How does this honor our role as temporary caretakers?",
        "What would the ancestors who walked this path advise?",
        "Does this decision serve the web of all relations?",
      ],
      eldersVoices: [
        "We do not inherit the earth from our ancestors; we borrow it from our children",
        "The earth does not belong to us; we belong to the earth",
        "When the last tree is cut, the last river poisoned, you will find you cannot eat money",
      ],
      mythicFrameworks: ["sacred_circle", "medicine_wheel", "tree_of_life"],
    });

    // Islamic/MENA Takaful & Stewardship
    this.culturalWisdom.set("takaful", {
      culture: "Islamic/MENA",
      principles: [
        "Mutual protection and shared responsibility (Takaful)",
        "Stewardship (Khalifa) over resources",
        "Justice (Adl) in all transactions",
        "Prohibition of exploitation (Gharar & Riba)",
      ],
      questionTemplates: [
        "How does this serve both worldly (Dunya) and eternal (Akhirah) well-being?",
        "Does this decision uphold justice for all parties?",
        "How does this strengthen the bonds of mutual support?",
        "What would the righteous ancestors and scholars counsel?",
      ],
      eldersVoices: [
        "The best of people are those who benefit others",
        "Wealth is not in having many possessions, but wealth is being content",
        "Help your brother whether he is an oppressor or oppressed",
      ],
      mythicFrameworks: [
        "garden_of_wisdom",
        "scales_of_justice",
        "brotherhood_bond",
      ],
    });

    // Add more cultural wisdom sources...
    this.addMoreWisdomSources();
  }

  private addMoreWisdomSources(): void {
    // East Asian Harmony & Balance
    this.culturalWisdom.set("harmony", {
      culture: "East Asian (Confucian/Taoist)",
      principles: [
        "Harmony between heaven, earth, and humanity",
        "Balance of opposing forces (Yin/Yang)",
        "Cultivation of virtue over profit",
        "Long-term thinking and patience",
      ],
      questionTemplates: [
        "How does this maintain harmony between all stakeholders?",
        "What is the long-term virtue this decision cultivates?",
        "Does this create balance or tip scales toward imbalance?",
        "How does this align with the natural flow of life?",
      ],
      eldersVoices: [
        "The journey of a thousand miles begins with a single step",
        "When we plant a tree, we know we may never sit in its shade",
        "The wise find pleasure in water; the virtuous find pleasure in hills",
      ],
      mythicFrameworks: [
        "yin_yang_balance",
        "five_elements",
        "mountain_wisdom",
      ],
    });

    // Nordic/European Solidarity & Stewardship
    this.culturalWisdom.set("solidarity", {
      culture: "Nordic/European",
      principles: [
        "Collective responsibility and solidarity",
        "Stewardship of natural resources",
        "Transparency and trust in institutions",
        "Long-term sustainable thinking",
      ],
      questionTemplates: [
        "How does this strengthen our social fabric?",
        "What transparency measures ensure trust?",
        "How does this serve environmental stewardship?",
        "Does this decision support collective flourishing?",
      ],
      eldersVoices: [
        "We are all in the same boat in a stormy sea",
        "The forest teaches us that growth happens slowly and together",
        "Trust is built drop by drop but lost in a flood",
      ],
      mythicFrameworks: [
        "forest_council",
        "circle_of_trust",
        "northern_lights",
      ],
    });
  }

  private initializeMythicFrameworks(): void {
    this.mythicFrameworks.set("web_of_life", {
      name: "Web of Life",
      origin: "Universal Indigenous Wisdom",
      coreTeaching: "All life is interconnected; what affects one affects all",
      applicationPrompts: [
        "What threads in the web of life does this decision touch?",
        "How does this strengthen or weaken the connections between beings?",
        "What ripple effects will flow through the web?",
      ],
      warningSignals: [
        "Decisions that prioritize individual gain over collective health",
        "Actions that sever connections rather than strengthen them",
        "Short-term thinking that ignores long-term consequences",
      ],
    });

    this.mythicFrameworks.set("ancestral_council", {
      name: "Ancestral Council",
      origin: "African/Indigenous Traditions",
      coreTeaching:
        "Seek wisdom from those who walked before and those yet to come",
      applicationPrompts: [
        "What would our wisest ancestors counsel about this path?",
        "How does this honor the struggles and sacrifices of those before us?",
        "What legacy does this create for future generations?",
      ],
      warningSignals: [
        "Decisions that ignore historical wisdom and lessons",
        "Actions that dishonor ancestral sacrifices",
        "Choices that burden future generations",
      ],
    });

    this.mythicFrameworks.set("sacred_circle", {
      name: "Sacred Circle",
      origin: "Indigenous/Native Traditions",
      coreTeaching:
        "All beings have a place in the circle; decisions must honor all relations",
      applicationPrompts: [
        "Who sits in the circle of this decision?",
        "How does this serve all our relations - human and more-than-human?",
        "What voices are missing from this circle?",
      ],
      warningSignals: [
        "Excluding important voices from decision-making",
        "Prioritizing some beings over others unfairly",
        "Breaking the circle of reciprocity and respect",
      ],
    });
  }

  /**
   * Generate culturally-informed prompts for a vault
   */
  public async generateMythicPrompts(
    vaultId: string,
    vaultPurpose: string,
    culturalContexts: string[],
  ): Promise<string[]> {
    const prompts: string[] = [];

    // Universal prompts first
    prompts.push(
      "What is this vault for beyond ROI?",
      "Whose story does this preserve or overwrite?",
      "How does this serve the web of life, not just human profit?",
      "What shadows or unintended consequences might this create?",
    );

    // Add cultural-specific prompts
    for (const context of culturalContexts) {
      const wisdom = this.culturalWisdom.get(context);
      if (wisdom) {
        prompts.push(...wisdom.questionTemplates);
      }
    }

    // Add mythic framework prompts
    const relevantFrameworks = this.selectRelevantFrameworks(
      vaultPurpose,
      culturalContexts,
    );
    for (const framework of relevantFrameworks) {
      prompts.push(...framework.applicationPrompts);
    }

    return prompts;
  }

  /**
   * Process ethical reflection with cultural wisdom
   */
  public async processEthicalReflection(
    vaultId: string,
    prompt: string,
    response: string,
    culturalContexts: string[],
  ): Promise<EthicalReflection> {
    const reflection: EthicalReflection = {
      prompt,
      response,
      culturalLens: culturalContexts,
      ecologicalImpact: this.assessEcologicalImpact(response),
      generationalWisdom: this.assessGenerationalWisdom(response),
      communityAlignment: this.assessCommunityAlignment(
        response,
        culturalContexts,
      ),
      shadowAnalysis: this.analyzeShadows(response),
      ancestralGuidance: this.channelAncestralGuidance(
        response,
        culturalContexts,
      ),
    };

    // Create mythic insight for the vault
    const insight: MythicInsight = {
      id: this.generateId(),
      vaultId,
      prompt,
      response,
      culturalContext: culturalContexts,
      ethicalScore: this.calculateEthicalScore(reflection),
      timestamp: Date.now(),
      community: culturalContexts.join(", "),
    };

    // Store the insight
    this.storeInsight(vaultId, insight);

    return reflection;
  }

  /**
   * Shadow analysis - identify potential negative outcomes
   */
  private analyzeShadows(response: string): string[] {
    const shadows: string[] = [];
    const text = response.toLowerCase();

    // Pattern matching for potential issues
    const shadowPatterns = {
      extraction:
        "Risk of extractive practices that deplete rather than regenerate",
      exclusion: "Risk of excluding marginalized communities from benefits",
      concentration:
        "Risk of concentrating wealth/power rather than distributing it",
      "short-term": "Risk of short-term gains creating long-term problems",
      disconnection: "Risk of severing community bonds and relationships",
      commodification:
        "Risk of turning sacred or communal resources into commodities",
    };

    for (const [pattern, warning] of Object.entries(shadowPatterns)) {
      if (text.includes(pattern) || this.detectSemanticPattern(text, pattern)) {
        shadows.push(warning);
      }
    }

    return shadows;
  }

  /**
   * Channel ancestral guidance based on cultural wisdom
   */
  private channelAncestralGuidance(
    response: string,
    culturalContexts: string[],
  ): string {
    const guidance: string[] = [];

    for (const context of culturalContexts) {
      const wisdom = this.culturalWisdom.get(context);
      if (wisdom) {
        // Select relevant elder voice
        const relevantVoice =
          wisdom.eldersVoices[
            Math.floor(Math.random() * wisdom.eldersVoices.length)
          ];
        guidance.push(`${wisdom.culture}: "${relevantVoice}"`);
      }
    }

    return guidance.join(" | ");
  }

  /**
   * Assessment methods
   */
  private assessEcologicalImpact(response: string): number {
    const ecoWords = [
      "regenerative",
      "sustainable",
      "natural",
      "ecological",
      "environmental",
    ];
    const harmWords = [
      "extraction",
      "pollution",
      "waste",
      "destruction",
      "depletion",
    ];

    let score = 5; // neutral
    ecoWords.forEach((word) => {
      if (response.toLowerCase().includes(word)) score += 1;
    });
    harmWords.forEach((word) => {
      if (response.toLowerCase().includes(word)) score -= 2;
    });

    return Math.max(1, Math.min(10, score));
  }

  private assessGenerationalWisdom(response: string): number {
    const wisdomWords = [
      "future",
      "children",
      "generations",
      "legacy",
      "long-term",
      "ancestors",
    ];
    const score = wisdomWords.reduce((acc, word) => {
      return response.toLowerCase().includes(word) ? acc + 1 : acc;
    }, 3);

    return Math.max(1, Math.min(10, score));
  }

  private assessCommunityAlignment(
    response: string,
    culturalContexts: string[],
  ): number {
    let score = 5;

    // Check for community-oriented language
    const communityWords = [
      "together",
      "collective",
      "shared",
      "community",
      "mutual",
      "cooperation",
    ];
    communityWords.forEach((word) => {
      if (response.toLowerCase().includes(word)) score += 1;
    });

    // Check for cultural principle alignment
    for (const context of culturalContexts) {
      const wisdom = this.culturalWisdom.get(context);
      if (wisdom) {
        wisdom.principles.forEach((principle) => {
          const principleWords = principle.toLowerCase().split(" ");
          const hasAlignment = principleWords.some((word) =>
            response.toLowerCase().includes(word),
          );
          if (hasAlignment) score += 0.5;
        });
      }
    }

    return Math.max(1, Math.min(10, score));
  }

  private calculateEthicalScore(reflection: EthicalReflection): number {
    const weights = {
      ecological: 0.3,
      generational: 0.3,
      community: 0.3,
      shadowPenalty: 0.1,
    };

    const shadowPenalty = reflection.shadowAnalysis.length * 0.5;

    return Math.max(
      1,
      Math.min(
        10,
        reflection.ecologicalImpact * weights.ecological +
          reflection.generationalWisdom * weights.generational +
          reflection.communityAlignment * weights.community -
          shadowPenalty * weights.shadowPenalty,
      ),
    );
  }

  /**
   * Select relevant mythic frameworks based on purpose and culture
   */
  private selectRelevantFrameworks(
    purpose: string,
    culturalContexts: string[],
  ): MythicFramework[] {
    const frameworks: MythicFramework[] = [];

    // Always include web of life for interconnectedness
    const webOfLife = this.mythicFrameworks.get("web_of_life");
    if (webOfLife) frameworks.push(webOfLife);

    // Add culture-specific frameworks
    if (
      culturalContexts.includes("ubuntu") ||
      culturalContexts.includes("seven_generations")
    ) {
      const ancestralCouncil = this.mythicFrameworks.get("ancestral_council");
      if (ancestralCouncil) frameworks.push(ancestralCouncil);
    }

    if (
      culturalContexts.some((c) =>
        ["seven_generations", "indigenous"].includes(c),
      )
    ) {
      const sacredCircle = this.mythicFrameworks.get("sacred_circle");
      if (sacredCircle) frameworks.push(sacredCircle);
    }

    return frameworks;
  }

  /**
   * Utility methods
   */
  private detectSemanticPattern(text: string, pattern: string): boolean {
    // Simple semantic detection - could be enhanced with AI/ML
    const semanticMaps: Record<string, string[]> = {
      extraction: ["take", "harvest", "mine", "exploit", "drain"],
      exclusion: ["only", "exclusive", "limited", "restricted", "select"],
      concentration: ["centralize", "consolidate", "monopoly", "control"],
      "short-term": ["quick", "fast", "immediate", "now", "urgent"],
      disconnection: ["individual", "separate", "isolated", "independent"],
      commodification: ["sell", "market", "commodity", "product", "monetize"],
    };

    const relatedWords = semanticMaps[pattern] || [];
    return relatedWords.some((word) => text.includes(word));
  }

  private storeInsight(vaultId: string, insight: MythicInsight): void {
    // This would integrate with the tortoise protocol service
    console.log(`🧠 Storing mythic insight for vault ${vaultId}:`, insight);
  }

  private generateId(): string {
    return `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Public API
   */
  public getCulturalWisdom(culture: string): CulturalWisdomSource | undefined {
    return this.culturalWisdom.get(culture);
  }

  public getAllCulturalWisdom(): CulturalWisdomSource[] {
    return Array.from(this.culturalWisdom.values());
  }

  public getMythicFramework(name: string): MythicFramework | undefined {
    return this.mythicFrameworks.get(name);
  }

  public getAllMythicFrameworks(): MythicFramework[] {
    return Array.from(this.mythicFrameworks.values());
  }
}

export default MythPromptAgent;
export { MythPromptAgent };
