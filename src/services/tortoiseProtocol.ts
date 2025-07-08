/**
 * 🐢 QuantumVest: The Tortoise-Led Innovation Protocol
 * "Wealth is not made in haste—it is cultivated with memory, ethics, rhythm, and myth."
 *
 * Core architecture for contemplative, ethical, and rhythmic wealth creation
 */

// EventEmitter functionality for browser compatibility
class SimpleEventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return this;
  }

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(...args));
    }
    return true;
  }

  removeAllListeners(event?: string) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    return this;
  }
}

// Core Protocol Types
export interface TortoisePhase {
  id: string;
  name: string;
  description: string;
  minimumDuration: number; // in milliseconds
  requiresRitual: boolean;
  ethicalCheckpoints: string[];
}

export interface MythicInsight {
  id: string;
  vaultId: string;
  prompt: string;
  response: string;
  culturalContext: string[];
  ethicalScore: number;
  timestamp: number;
  community: string;
}

export interface PhilosophicalVault {
  id: string;
  name: string;
  purposeHash: string;
  ethicalIntent: string;
  culturalStewards: string[];
  createdAt: number;
  phase: "contemplation" | "rooting" | "deploying" | "restoring";
  ritualHistory: RitualValidation[];
  wisdomLogs: WisdomEntry[];
}

export interface RitualValidation {
  id: string;
  type: "seasonal" | "community" | "elder" | "ecological";
  validator: string;
  timestamp: number;
  approved: boolean;
  wisdom: string;
  witnesses: string[];
}

export interface WisdomEntry {
  id: string;
  vaultId: string;
  epoch: number;
  learnings: string[];
  harmsPrevented: string[];
  futureChanges: string[];
  contributor: string;
  timestamp: number;
  reflectionScore: number;
}

export interface YieldRhythm {
  vaultId: string;
  seasonalMarkers: string[];
  ritualRequirements: string[];
  communityApprovals: number;
  elderValidations: number;
  ecologicalSignals: string[];
  activated: boolean;
  nextActivation: number;
}

/**
 * Core Tortoise Protocol Service
 * Orchestrates the four phases of ethical wealth creation
 */
class TortoiseProtocolService extends SimpleEventEmitter {
  private static instance: TortoiseProtocolService;
  private vaults: Map<string, PhilosophicalVault> = new Map();
  private insights: Map<string, MythicInsight[]> = new Map();
  private rhythms: Map<string, YieldRhythm> = new Map();
  private silenceGates: Map<string, number> = new Map(); // Gates with end timestamps

  private readonly PHASES: TortoisePhase[] = [
    {
      id: "contemplation",
      name: "Mythic Insight Design",
      description: "Deep reflection on purpose beyond ROI",
      minimumDuration: 24 * 60 * 60 * 1000, // 24 hours
      requiresRitual: true,
      ethicalCheckpoints: [
        "cultural_impact",
        "ecological_effect",
        "generational_wisdom",
      ],
    },
    {
      id: "rooting",
      name: "Philosophical Vault Architecting",
      description: "Embedding ethical intent into smart contracts",
      minimumDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
      requiresRitual: true,
      ethicalCheckpoints: [
        "purpose_clarity",
        "steward_alignment",
        "community_consent",
      ],
    },
    {
      id: "deploying",
      name: "Rhythmic Yield Activation",
      description: "Slow release based on seasonal and ritual markers",
      minimumDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
      requiresRitual: true,
      ethicalCheckpoints: [
        "rhythm_alignment",
        "community_readiness",
        "ecological_harmony",
      ],
    },
    {
      id: "restoring",
      name: "Wisdom Feedback Loop",
      description: "Continuous learning and protocol evolution",
      minimumDuration: 0, // Ongoing
      requiresRitual: false,
      ethicalCheckpoints: [
        "learning_capture",
        "harm_prevention",
        "wisdom_sharing",
      ],
    },
  ];

  private constructor() {
    super();
    this.initializeProtocol();
  }

  public static getInstance(): TortoiseProtocolService {
    if (!TortoiseProtocolService.instance) {
      TortoiseProtocolService.instance = new TortoiseProtocolService();
    }
    return TortoiseProtocolService.instance;
  }

  private initializeProtocol(): void {
    console.log("🐢 Initializing Tortoise-Led Innovation Protocol...");
    this.startWisdomCycles();
  }

  /**
   * Phase 1: Contemplation → Mythic Insight Design
   */
  public async initiateContemplation(
    vaultName: string,
    initialPurpose: string,
    culturalContext: string[],
  ): Promise<PhilosophicalVault> {
    const vaultId = this.generateVaultId(vaultName);

    // Create vault in contemplation phase
    const vault: PhilosophicalVault = {
      id: vaultId,
      name: vaultName,
      purposeHash: "", // Will be set after contemplation
      ethicalIntent: initialPurpose,
      culturalStewards: [],
      createdAt: Date.now(),
      phase: "contemplation",
      ritualHistory: [],
      wisdomLogs: [],
    };

    this.vaults.set(vaultId, vault);
    this.insights.set(vaultId, []);

    // Activate silence gate
    this.activateSilenceGate(vaultId, 24 * 60 * 60 * 1000); // 24 hour contemplation

    this.emit("contemplation_initiated", { vault, culturalContext });
    console.log(`🧠 Contemplation phase initiated for vault: ${vaultName}`);

    return vault;
  }

  /**
   * Mythic Insight Prompts for Contemplation
   */
  public getMythicPrompts(
    vaultId: string,
    culturalContext: string[],
  ): string[] {
    const basePrompts = [
      "What is this vault for beyond ROI?",
      "Whose story does this preserve or overwrite?",
      "How does this honor our ancestors and protect our descendants?",
      "What would the children seven generations from now think of this decision?",
      "How does this serve the web of life, not just human profit?",
    ];

    const contextualPrompts: Record<string, string[]> = {
      african: [
        "How does this align with Ubuntu - 'I am because we are'?",
        "What wisdom from our griots and elders guides this path?",
        "How does this strengthen the village, not just the individual?",
      ],
      indigenous: [
        "How do we honor the original caretakers of this land?",
        "What does the seventh generation principle teach us here?",
        "How does this decision affect all our relations?",
      ],
      mena: [
        "How does this reflect the principles of mutual prosperity (Takaful)?",
        "What would the wise poets and philosophers of our heritage say?",
        "How does this serve both Dunya (worldly) and Akhirah (eternal) well-being?",
      ],
    };

    const relevantContextual = culturalContext.flatMap(
      (context) => contextualPrompts[context] || [],
    );

    return [...basePrompts, ...relevantContextual];
  }

  /**
   * Silence Gate - 24h pause before high-impact decisions
   */
  public activateSilenceGate(vaultId: string, duration: number): void {
    const endTime = Date.now() + duration;
    this.silenceGates.set(vaultId, endTime);

    setTimeout(() => {
      this.silenceGates.delete(vaultId);
      this.emit("silence_gate_lifted", { vaultId });
      console.log(`🔕 Silence gate lifted for vault: ${vaultId}`);
    }, duration);

    console.log(
      `🤫 Silence gate activated for vault: ${vaultId} (${duration / 1000 / 60 / 60}h)`,
    );
  }

  public isSilenceGateActive(vaultId: string): boolean {
    const endTime = this.silenceGates.get(vaultId);
    return endTime ? Date.now() < endTime : false;
  }

  public getSilenceGateRemaining(vaultId: string): number {
    const endTime = this.silenceGates.get(vaultId);
    return endTime ? Math.max(0, endTime - Date.now()) : 0;
  }

  /**
   * Phase 2: Root Design → Philosophical Vault Architecting
   */
  public async transitionToRooting(
    vaultId: string,
    finalPurpose: string,
    culturalStewards: string[],
  ): Promise<void> {
    const vault = this.vaults.get(vaultId);
    if (!vault || vault.phase !== "contemplation") {
      throw new Error("Vault must complete contemplation phase first");
    }

    if (this.isSilenceGateActive(vaultId)) {
      throw new Error("Cannot transition while silence gate is active");
    }

    // Generate purpose hash
    const purposeHash = await this.generatePurposeHash(finalPurpose);

    vault.phase = "rooting";
    vault.purposeHash = purposeHash;
    vault.ethicalIntent = finalPurpose;
    vault.culturalStewards = culturalStewards;

    this.emit("rooting_initiated", { vault });
    console.log(`🌱 Rooting phase initiated for vault: ${vault.name}`);
  }

  /**
   * Generate cryptographic hash of ethical purpose
   */
  private async generatePurposeHash(purpose: string): Promise<string> {
    try {
      // Try to use Web Crypto API if available
      if (typeof crypto !== "undefined" && crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(purpose);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      }
    } catch (error) {
      console.warn("Web Crypto API not available, using fallback hash");
    }

    // Fallback: Simple hash function for development/compatibility
    let hash = 0;
    for (let i = 0; i < purpose.length; i++) {
      const char = purpose.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, "0");
  }

  /**
   * Phase 3: Regenerative Deployment → Rhythmic Yield Activation
   */
  public async transitionToDeploying(vaultId: string): Promise<void> {
    const vault = this.vaults.get(vaultId);
    if (!vault || vault.phase !== "rooting") {
      throw new Error("Vault must complete rooting phase first");
    }

    vault.phase = "deploying";

    // Initialize yield rhythm
    const rhythm: YieldRhythm = {
      vaultId,
      seasonalMarkers: [],
      ritualRequirements: [],
      communityApprovals: 0,
      elderValidations: 0,
      ecologicalSignals: [],
      activated: false,
      nextActivation: 0,
    };

    this.rhythms.set(vaultId, rhythm);
    this.emit("deploying_initiated", { vault });
    console.log(`🔄 Deploying phase initiated for vault: ${vault.name}`);
  }

  /**
   * Phase 4: Restoration → Wisdom Feedback Loop
   */
  public async transitionToRestoring(vaultId: string): Promise<void> {
    const vault = this.vaults.get(vaultId);
    if (!vault || vault.phase !== "deploying") {
      throw new Error("Vault must complete deploying phase first");
    }

    vault.phase = "restoring";
    this.emit("restoring_initiated", { vault });
    console.log(`🧬 Restoration phase initiated for vault: ${vault.name}`);
  }

  /**
   * Ritual Validation System
   */
  public async validateRitual(
    vaultId: string,
    type: RitualValidation["type"],
    validator: string,
    wisdom: string,
    witnesses: string[] = [],
  ): Promise<boolean> {
    const vault = this.vaults.get(vaultId);
    if (!vault) {
      throw new Error("Vault not found");
    }

    const validation: RitualValidation = {
      id: this.generateId(),
      type,
      validator,
      timestamp: Date.now(),
      approved: true, // Could add validation logic here
      wisdom,
      witnesses,
    };

    vault.ritualHistory.push(validation);
    this.emit("ritual_validated", { vaultId, validation });

    return validation.approved;
  }

  /**
   * Wisdom Logging System
   */
  public addWisdomEntry(
    vaultId: string,
    learnings: string[],
    harmsPrevented: string[],
    futureChanges: string[],
    contributor: string,
  ): WisdomEntry {
    const vault = this.vaults.get(vaultId);
    if (!vault) {
      throw new Error("Vault not found");
    }

    const entry: WisdomEntry = {
      id: this.generateId(),
      vaultId,
      epoch: this.getCurrentEpoch(),
      learnings,
      harmsPrevented,
      futureChanges,
      contributor,
      timestamp: Date.now(),
      reflectionScore: this.calculateReflectionScore(
        learnings,
        harmsPrevented,
        futureChanges,
      ),
    };

    vault.wisdomLogs.push(entry);
    this.emit("wisdom_logged", { vaultId, entry });

    return entry;
  }

  /**
   * Start wisdom cycles - quarterly reflection epochs
   */
  private startWisdomCycles(): void {
    const EPOCH_DURATION = 90 * 24 * 60 * 60 * 1000; // 90 days

    setInterval(() => {
      this.emit("wisdom_epoch_start", {
        epoch: this.getCurrentEpoch(),
        vaults: Array.from(this.vaults.values()),
      });
      console.log("🔄 Starting new wisdom epoch for reflection and evolution");
    }, EPOCH_DURATION);
  }

  /**
   * Utility Methods
   */
  private generateVaultId(name: string): string {
    return `vault_${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentEpoch(): number {
    const EPOCH_START = new Date("2024-01-01").getTime();
    const EPOCH_DURATION = 90 * 24 * 60 * 60 * 1000; // 90 days
    return Math.floor((Date.now() - EPOCH_START) / EPOCH_DURATION);
  }

  private calculateReflectionScore(
    learnings: string[],
    harmsPrevented: string[],
    futureChanges: string[],
  ): number {
    // Simple scoring - could be made more sophisticated
    return (
      learnings.length * 10 +
      harmsPrevented.length * 15 +
      futureChanges.length * 5
    );
  }

  /**
   * Public API for retrieving protocol state
   */
  public getVault(vaultId: string): PhilosophicalVault | undefined {
    return this.vaults.get(vaultId);
  }

  public getAllVaults(): PhilosophicalVault[] {
    return Array.from(this.vaults.values());
  }

  public getVaultsByPhase(
    phase: PhilosophicalVault["phase"],
  ): PhilosophicalVault[] {
    return Array.from(this.vaults.values()).filter(
      (vault) => vault.phase === phase,
    );
  }

  public getInsights(vaultId: string): MythicInsight[] {
    return this.insights.get(vaultId) || [];
  }

  public getPhases(): TortoisePhase[] {
    return [...this.PHASES];
  }
}

export default TortoiseProtocolService;
export { TortoiseProtocolService };
