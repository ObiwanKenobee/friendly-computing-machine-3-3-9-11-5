/**
 * 🔄 YieldRhythmEngine
 * Rhythmic Yield Activation based on seasonal markers, ritual validation, and ecosystem signals
 * Part of the Tortoise Protocol's Regenerative Deployment Phase
 */

import TortoiseProtocolService, {
  YieldRhythm,
  RitualValidation,
} from "./tortoiseProtocol";

export interface SeasonalMarker {
  id: string;
  name: string;
  type: "astronomical" | "ecological" | "cultural" | "agricultural";
  description: string;
  datePattern: string; // Cron-like pattern or specific dates
  regions: string[];
  significance: string;
}

export interface EcosystemSignal {
  id: string;
  type:
    | "biodiversity"
    | "climate"
    | "soil_health"
    | "water_quality"
    | "air_quality";
  source: string;
  value: number;
  threshold: number;
  trend: "improving" | "stable" | "declining";
  lastUpdated: number;
  verificationMethod: string;
}

export interface CommunityApproval {
  id: string;
  vaultId: string;
  approver: string;
  role: "elder" | "steward" | "guardian" | "community_member";
  culturalContext: string;
  approvalType:
    | "seasonal_readiness"
    | "ritual_completion"
    | "community_consensus";
  timestamp: number;
  wisdom: string;
  conditions?: string[];
}

export interface YieldActivationCriteria {
  seasonalRequirements: string[];
  ritualRequirements: string[];
  communityApprovals: {
    elders: number;
    stewards: number;
    community: number;
  };
  ecosystemSignals: {
    biodiversity: number;
    climate: number;
    soil: number;
    water: number;
  };
  minimumDelayAfterTrigger: number; // milliseconds
}

/**
 * YieldRhythmEngine - Orchestrates slow, rhythmic yield release
 */
class YieldRhythmEngine {
  private static instance: YieldRhythmEngine;
  private tortoiseProtocol: TortoiseProtocolService;
  private seasonalMarkers: Map<string, SeasonalMarker> = new Map();
  private ecosystemSignals: Map<string, EcosystemSignal> = new Map();
  private communityApprovals: Map<string, CommunityApproval[]> = new Map();
  private activationCriteria: Map<string, YieldActivationCriteria> = new Map();
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.tortoiseProtocol = TortoiseProtocolService.getInstance();
    this.initializeSeasonalMarkers();
    this.initializeEcosystemMonitoring();
    this.startRhythmicMonitoring();
  }

  public static getInstance(): YieldRhythmEngine {
    if (!YieldRhythmEngine.instance) {
      YieldRhythmEngine.instance = new YieldRhythmEngine();
    }
    return YieldRhythmEngine.instance;
  }

  private initializeSeasonalMarkers(): void {
    // Astronomical markers
    this.seasonalMarkers.set("spring_equinox", {
      id: "spring_equinox",
      name: "Spring Equinox",
      type: "astronomical",
      description: "Balance point of light and dark, time of new beginnings",
      datePattern: "March 19-21", // Approximate
      regions: ["global"],
      significance: "Renewal, growth initiation, balance restoration",
    });

    this.seasonalMarkers.set("summer_solstice", {
      id: "summer_solstice",
      name: "Summer Solstice",
      type: "astronomical",
      description: "Longest day, peak solar energy, full manifestation",
      datePattern: "June 20-22",
      regions: ["northern_hemisphere"],
      significance: "Peak abundance, full expression, completion",
    });

    this.seasonalMarkers.set("autumn_equinox", {
      id: "autumn_equinox",
      name: "Autumn Equinox",
      type: "astronomical",
      description: "Harvest time, preparation for rest, gratitude",
      datePattern: "September 21-23",
      regions: ["global"],
      significance: "Harvest wisdom, give thanks, prepare for transformation",
    });

    this.seasonalMarkers.set("winter_solstice", {
      id: "winter_solstice",
      name: "Winter Solstice",
      type: "astronomical",
      description: "Longest night, deepest rest, inner reflection",
      datePattern: "December 20-22",
      regions: ["northern_hemisphere"],
      significance: "Deep reflection, rest, preparation for rebirth",
    });

    // Cultural/Agricultural markers
    this.seasonalMarkers.set("planting_moon", {
      id: "planting_moon",
      name: "Planting Moon",
      type: "cultural",
      description: "Traditional time for planting based on lunar cycles",
      datePattern: "New moon in spring",
      regions: ["agricultural_communities"],
      significance: "Optimal time for new initiatives and investments",
    });

    this.seasonalMarkers.set("harvest_moon", {
      id: "harvest_moon",
      name: "Harvest Moon",
      type: "cultural",
      description: "Full moon nearest autumn equinox, harvest completion",
      datePattern: "Full moon near autumn equinox",
      regions: ["agricultural_communities"],
      significance: "Time to receive yields and distribute abundance",
    });

    // Regional markers
    this.addRegionalMarkers();
  }

  private addRegionalMarkers(): void {
    // African seasonal markers
    this.seasonalMarkers.set("ubuntu_renewal", {
      id: "ubuntu_renewal",
      name: "Ubuntu Renewal Season",
      type: "cultural",
      description: "Community strengthening and mutual aid practices",
      datePattern: "After harvest season",
      regions: ["southern_africa"],
      significance: "Collective healing, resource sharing, community bonds",
    });

    // Indigenous markers
    this.seasonalMarkers.set("seven_generations_council", {
      id: "seven_generations_council",
      name: "Seven Generations Council",
      type: "cultural",
      description: "Time for long-term decision making and future planning",
      datePattern: "Winter solstice period",
      regions: ["indigenous_communities"],
      significance: "Long-term vision, ancestral wisdom, future responsibility",
    });

    // MENA markers
    this.seasonalMarkers.set("ramadan_reflection", {
      id: "ramadan_reflection",
      name: "Ramadan Reflection Period",
      type: "cultural",
      description:
        "Month of reflection, community support, and spiritual renewal",
      datePattern: "Islamic lunar calendar Ramadan",
      regions: ["mena", "islamic_communities"],
      significance: "Purification, community support, charitable giving",
    });
  }

  private initializeEcosystemMonitoring(): void {
    // Initialize ecosystem signal monitoring
    this.startEcosystemMonitoring();
  }

  /**
   * Configure yield activation criteria for a vault
   */
  public setActivationCriteria(
    vaultId: string,
    criteria: YieldActivationCriteria,
  ): void {
    this.activationCriteria.set(vaultId, criteria);
    this.communityApprovals.set(vaultId, []);

    // Start monitoring for this vault
    this.startVaultMonitoring(vaultId);

    console.log(`🔄 Yield rhythm criteria set for vault: ${vaultId}`);
  }

  /**
   * Check if seasonal requirements are met
   */
  public checkSeasonalAlignment(vaultId: string): boolean {
    const criteria = this.activationCriteria.get(vaultId);
    if (!criteria) return false;

    const now = new Date();

    for (const markerName of criteria.seasonalRequirements) {
      const marker = this.seasonalMarkers.get(markerName);
      if (marker && !this.isSeasonalMarkerActive(marker, now)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if ritual requirements are met
   */
  public checkRitualCompletion(vaultId: string): boolean {
    const vault = this.tortoiseProtocol.getVault(vaultId);
    const criteria = this.activationCriteria.get(vaultId);

    if (!vault || !criteria) return false;

    // Check if all required ritual types have been completed
    const completedRituals = vault.ritualHistory.map((r) => r.type);

    return criteria.ritualRequirements.every((requirement) => {
      // Convert requirement to ritual type
      const ritualType = this.mapRequirementToRitualType(requirement);
      return completedRituals.includes(ritualType);
    });
  }

  /**
   * Check if community approval requirements are met
   */
  public checkCommunityApproval(vaultId: string): boolean {
    const approvals = this.communityApprovals.get(vaultId) || [];
    const criteria = this.activationCriteria.get(vaultId);

    if (!criteria) return false;

    const approvalCounts = {
      elders: approvals.filter((a) => a.role === "elder").length,
      stewards: approvals.filter((a) => a.role === "steward").length,
      community: approvals.filter((a) => a.role === "community_member").length,
    };

    return (
      approvalCounts.elders >= criteria.communityApprovals.elders &&
      approvalCounts.stewards >= criteria.communityApprovals.stewards &&
      approvalCounts.community >= criteria.communityApprovals.community
    );
  }

  /**
   * Check if ecosystem signals meet requirements
   */
  public checkEcosystemHealth(vaultId: string): boolean {
    const criteria = this.activationCriteria.get(vaultId);
    if (!criteria) return false;

    const signals = Array.from(this.ecosystemSignals.values());

    // Calculate average scores for each signal type
    const scores = {
      biodiversity: this.getAverageSignalScore("biodiversity", signals),
      climate: this.getAverageSignalScore("climate", signals),
      soil: this.getAverageSignalScore("soil_health", signals),
      water: this.getAverageSignalScore("water_quality", signals),
    };

    return (
      scores.biodiversity >= criteria.ecosystemSignals.biodiversity &&
      scores.climate >= criteria.ecosystemSignals.climate &&
      scores.soil >= criteria.ecosystemSignals.soil &&
      scores.water >= criteria.ecosystemSignals.water
    );
  }

  /**
   * Submit community approval
   */
  public submitCommunityApproval(
    vaultId: string,
    approver: string,
    role: CommunityApproval["role"],
    culturalContext: string,
    approvalType: CommunityApproval["approvalType"],
    wisdom: string,
    conditions?: string[],
  ): void {
    const approval: CommunityApproval = {
      id: this.generateId(),
      vaultId,
      approver,
      role,
      culturalContext,
      approvalType,
      timestamp: Date.now(),
      wisdom,
      conditions,
    };

    const approvals = this.communityApprovals.get(vaultId) || [];
    approvals.push(approval);
    this.communityApprovals.set(vaultId, approvals);

    console.log(
      `👥 Community approval submitted for vault ${vaultId} by ${role}: ${approver}`,
    );

    // Check if this approval triggers yield activation
    this.checkYieldActivation(vaultId);
  }

  /**
   * Check if yield should be activated for a vault
   */
  public checkYieldActivation(vaultId: string): boolean {
    const vault = this.tortoiseProtocol.getVault(vaultId);
    if (!vault || vault.phase !== "deploying") {
      return false;
    }

    const allCriteriaMet =
      this.checkSeasonalAlignment(vaultId) &&
      this.checkRitualCompletion(vaultId) &&
      this.checkCommunityApproval(vaultId) &&
      this.checkEcosystemHealth(vaultId);

    if (allCriteriaMet) {
      this.activateYield(vaultId);
      return true;
    }

    return false;
  }

  /**
   * Activate yield for a vault
   */
  private activateYield(vaultId: string): void {
    const vault = this.tortoiseProtocol.getVault(vaultId);
    const criteria = this.activationCriteria.get(vaultId);

    if (!vault || !criteria) return;

    // Apply minimum delay if specified
    const activationTime = Date.now() + criteria.minimumDelayAfterTrigger;

    setTimeout(() => {
      console.log(`🎉 Yield activated for vault: ${vault.name}`);

      // Transition to restoration phase
      this.tortoiseProtocol.transitionToRestoring(vaultId);

      // Log the activation wisdom
      const approvals = this.communityApprovals.get(vaultId) || [];
      const activationWisdom = approvals.map((a) => a.wisdom).join(" | ");

      this.tortoiseProtocol.addWisdomEntry(
        vaultId,
        ["Yield activated through rhythmic process"],
        ["Prevented hasty activation without proper validation"],
        ["Continue monitoring ecosystem and community health"],
        "YieldRhythmEngine",
      );
    }, criteria.minimumDelayAfterTrigger);
  }

  /**
   * Start monitoring ecosystem signals
   */
  private startEcosystemMonitoring(): void {
    // Simulate ecosystem monitoring - in production, this would connect to real APIs
    const monitoringInterval = setInterval(
      () => {
        this.updateEcosystemSignals();
      },
      60 * 60 * 1000,
    ); // Check every hour

    // Initialize some sample signals
    this.initializeSampleSignals();
  }

  private initializeSampleSignals(): void {
    // Sample biodiversity signal
    this.ecosystemSignals.set("global_biodiversity", {
      id: "global_biodiversity",
      type: "biodiversity",
      source: "Global Biodiversity Index",
      value: 7.2,
      threshold: 6.0,
      trend: "stable",
      lastUpdated: Date.now(),
      verificationMethod: "Satellite imagery + field studies",
    });

    // Sample climate signal
    this.ecosystemSignals.set("climate_stability", {
      id: "climate_stability",
      type: "climate",
      source: "Climate Stability Index",
      value: 6.8,
      threshold: 6.0,
      trend: "improving",
      lastUpdated: Date.now(),
      verificationMethod: "Weather station network + AI analysis",
    });

    // Sample soil health
    this.ecosystemSignals.set("soil_health_global", {
      id: "soil_health_global",
      type: "soil_health",
      source: "Global Soil Health Monitoring",
      value: 7.5,
      threshold: 6.5,
      trend: "improving",
      lastUpdated: Date.now(),
      verificationMethod: "Soil sensor network + lab analysis",
    });
  }

  private updateEcosystemSignals(): void {
    // Simulate signal updates - in production, fetch from real APIs
    for (const [id, signal] of this.ecosystemSignals.entries()) {
      // Small random fluctuation
      const fluctuation = (Math.random() - 0.5) * 0.2;
      signal.value = Math.max(0, Math.min(10, signal.value + fluctuation));
      signal.lastUpdated = Date.now();

      // Update trend
      if (signal.value > signal.threshold + 0.5) {
        signal.trend = "improving";
      } else if (signal.value < signal.threshold - 0.5) {
        signal.trend = "declining";
      } else {
        signal.trend = "stable";
      }
    }
  }

  /**
   * Start rhythmic monitoring for the entire system
   */
  private startRhythmicMonitoring(): void {
    // Daily rhythm check
    const dailyCheck = setInterval(
      () => {
        this.performDailyRhythmCheck();
      },
      24 * 60 * 60 * 1000,
    );

    // Lunar cycle check (monthly)
    const lunarCheck = setInterval(
      () => {
        this.performLunarRhythmCheck();
      },
      29.5 * 24 * 60 * 60 * 1000,
    );

    // Seasonal check (quarterly)
    const seasonalCheck = setInterval(
      () => {
        this.performSeasonalRhythmCheck();
      },
      90 * 24 * 60 * 60 * 1000,
    );

    console.log("🔄 Rhythmic monitoring initiated for yield activation");
  }

  private startVaultMonitoring(vaultId: string): void {
    const monitoringInterval = setInterval(
      () => {
        this.checkYieldActivation(vaultId);
      },
      60 * 60 * 1000,
    ); // Check every hour

    this.monitoringIntervals.set(vaultId, monitoringInterval);
  }

  /**
   * Rhythm check methods
   */
  private performDailyRhythmCheck(): void {
    console.log("🌅 Performing daily rhythm check...");
    // Check all vaults for daily activation opportunities
    const vaults = this.tortoiseProtocol.getVaultsByPhase("deploying");
    for (const vault of vaults) {
      this.checkYieldActivation(vault.id);
    }
  }

  private performLunarRhythmCheck(): void {
    console.log("🌙 Performing lunar rhythm check...");
    // Special lunar-based activations
  }

  private performSeasonalRhythmCheck(): void {
    console.log("🍂 Performing seasonal rhythm check...");
    // Major seasonal transitions
  }

  /**
   * Utility methods
   */
  private isSeasonalMarkerActive(marker: SeasonalMarker, date: Date): boolean {
    // Simplified seasonal checking - would be more sophisticated in production
    const month = date.getMonth() + 1;
    const day = date.getDate();

    switch (marker.id) {
      case "spring_equinox":
        return month === 3 && day >= 19 && day <= 21;
      case "summer_solstice":
        return month === 6 && day >= 20 && day <= 22;
      case "autumn_equinox":
        return month === 9 && day >= 21 && day <= 23;
      case "winter_solstice":
        return month === 12 && day >= 20 && day <= 22;
      default:
        return true; // Default to active for cultural markers
    }
  }

  private mapRequirementToRitualType(
    requirement: string,
  ): RitualValidation["type"] {
    const mapping: Record<string, RitualValidation["type"]> = {
      seasonal_alignment: "seasonal",
      community_consensus: "community",
      elder_blessing: "elder",
      ecological_validation: "ecological",
    };

    return mapping[requirement] || "community";
  }

  private getAverageSignalScore(
    type: string,
    signals: EcosystemSignal[],
  ): number {
    const relevantSignals = signals.filter((s) => s.type === type);
    if (relevantSignals.length === 0) return 0;

    const total = relevantSignals.reduce(
      (sum, signal) => sum + signal.value,
      0,
    );
    return total / relevantSignals.length;
  }

  private generateId(): string {
    return `yield_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Public API
   */
  public getSeasonalMarkers(): SeasonalMarker[] {
    return Array.from(this.seasonalMarkers.values());
  }

  public getEcosystemSignals(): EcosystemSignal[] {
    return Array.from(this.ecosystemSignals.values());
  }

  public getCommunityApprovals(vaultId: string): CommunityApproval[] {
    return this.communityApprovals.get(vaultId) || [];
  }

  public getActivationStatus(vaultId: string): {
    seasonal: boolean;
    ritual: boolean;
    community: boolean;
    ecosystem: boolean;
    overall: boolean;
  } {
    return {
      seasonal: this.checkSeasonalAlignment(vaultId),
      ritual: this.checkRitualCompletion(vaultId),
      community: this.checkCommunityApproval(vaultId),
      ecosystem: this.checkEcosystemHealth(vaultId),
      overall: this.checkYieldActivation(vaultId),
    };
  }
}

export default YieldRhythmEngine;
export { YieldRhythmEngine };
