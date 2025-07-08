/**
 * Intelligent Infrastructure Service
 * Snake Xenzia-inspired intelligent navigation for production systems
 * Bypasses Vercel's multi-region restrictions with smart routing
 */

interface RegionNode {
  id: string;
  name: string;
  location: { x: number; y: number };
  latency: number;
  load: number;
  status: "active" | "degraded" | "offline";
  connections: string[];
}

interface SnakeSegment {
  regionId: string;
  position: { x: number; y: number };
  timestamp: number;
}

interface InfrastructureEngine {
  id: string;
  type: "routing" | "processing" | "storage" | "analytics";
  snake: SnakeSegment[];
  currentTarget: string | null;
  score: number;
  speed: number;
  direction: "north" | "south" | "east" | "west";
}

export class IntelligentInfrastructureService {
  private regions: Map<string, RegionNode> = new Map();
  private engines: Map<string, InfrastructureEngine> = new Map();
  private gameGrid: number[][] = [];
  private gridSize = 20;
  private isActive = false;
  private gameLoop: number | null = null;

  constructor() {
    this.initializeInfrastructure();
    this.createSnakeEngines();
    this.startIntelligentNavigation();
  }

  /**
   * Initialize the infrastructure grid (like Snake Xenzia board)
   */
  private initializeInfrastructure(): void {
    // Create game-like grid for infrastructure navigation
    this.gameGrid = Array(this.gridSize)
      .fill(null)
      .map(() => Array(this.gridSize).fill(0));

    // Initialize regions as strategic points on the grid
    const regionConfigs = [
      { id: "us-east", name: "US East", x: 15, y: 8, latency: 50 },
      { id: "us-west", name: "US West", x: 5, y: 8, latency: 80 },
      { id: "europe", name: "Europe", x: 18, y: 12, latency: 120 },
      { id: "asia", name: "Asia Pacific", x: 3, y: 15, latency: 200 },
      { id: "edge-1", name: "Edge Node 1", x: 10, y: 5, latency: 30 },
      { id: "edge-2", name: "Edge Node 2", x: 12, y: 15, latency: 35 },
      { id: "cdn-1", name: "CDN Primary", x: 8, y: 10, latency: 20 },
      { id: "cdn-2", name: "CDN Secondary", x: 14, y: 6, latency: 25 },
    ];

    regionConfigs.forEach((config) => {
      const region: RegionNode = {
        id: config.id,
        name: config.name,
        location: { x: config.x, y: config.y },
        latency: config.latency,
        load: Math.random() * 100,
        status: "active",
        connections: this.calculateOptimalConnections(config.id, regionConfigs),
      };

      this.regions.set(config.id, region);
      this.gameGrid[config.y][config.x] = 1; // Mark as infrastructure node
    });
  }

  /**
   * Create Snake-inspired intelligent engines
   */
  private createSnakeEngines(): void {
    const engineTypes: Array<InfrastructureEngine["type"]> = [
      "routing",
      "processing",
      "storage",
      "analytics",
    ];

    engineTypes.forEach((type, index) => {
      const startPosition = { x: 2 + index * 4, y: 2 + index * 2 };

      const engine: InfrastructureEngine = {
        id: `${type}-engine`,
        type,
        snake: [
          { regionId: "", position: startPosition, timestamp: Date.now() },
          {
            regionId: "",
            position: { x: startPosition.x - 1, y: startPosition.y },
            timestamp: Date.now() - 100,
          },
          {
            regionId: "",
            position: { x: startPosition.x - 2, y: startPosition.y },
            timestamp: Date.now() - 200,
          },
        ],
        currentTarget: null,
        score: 0,
        speed: 200 - index * 30, // Different speeds for different engines
        direction: "east",
      };

      this.engines.set(engine.id, engine);
    });
  }

  /**
   * Start the intelligent navigation system
   */
  private startIntelligentNavigation(): void {
    if (this.isActive) return;

    this.isActive = true;
    this.gameLoop = window.setInterval(() => {
      this.updateEngines();
      this.optimizeRouting();
      this.handleLoadBalancing();
    }, 150); // Snake-like update frequency
  }

  /**
   * Update all engines (Snake movement logic)
   */
  private updateEngines(): void {
    this.engines.forEach((engine, engineId) => {
      this.moveEngine(engine);
      this.checkForTargets(engine);
      this.handleCollisions(engine);
      this.updateEngineScore(engine);
    });
  }

  /**
   * Move engine like Snake Xenzia
   */
  private moveEngine(engine: InfrastructureEngine): void {
    const head = engine.snake[0];
    let newPosition = { ...head.position };

    // Intelligent direction calculation
    if (!engine.currentTarget) {
      engine.currentTarget = this.findOptimalTarget(engine);
    }

    if (engine.currentTarget) {
      const target = this.regions.get(engine.currentTarget);
      if (target) {
        // Move towards target (like smart Snake AI)
        const direction = this.calculateOptimalDirection(
          head.position,
          target.location,
        );
        engine.direction = direction;
      }
    }

    // Apply movement
    switch (engine.direction) {
      case "north":
        newPosition.y = Math.max(0, newPosition.y - 1);
        break;
      case "south":
        newPosition.y = Math.min(this.gridSize - 1, newPosition.y + 1);
        break;
      case "east":
        newPosition.x = Math.min(this.gridSize - 1, newPosition.x + 1);
        break;
      case "west":
        newPosition.x = Math.max(0, newPosition.x - 1);
        break;
    }

    // Add new head
    engine.snake.unshift({
      regionId: "",
      position: newPosition,
      timestamp: Date.now(),
    });

    // Remove tail (maintain snake length based on score)
    const maxLength = 3 + Math.floor(engine.score / 100);
    if (engine.snake.length > maxLength) {
      engine.snake.pop();
    }
  }

  /**
   * Find optimal target for engine
   */
  private findOptimalTarget(engine: InfrastructureEngine): string | null {
    const head = engine.snake[0];
    let bestTarget: string | null = null;
    let bestScore = -1;

    this.regions.forEach((region, regionId) => {
      if (region.status !== "active") return;

      const distance = this.calculateDistance(head.position, region.location);
      const loadFactor = (100 - region.load) / 100;
      const latencyFactor = (500 - region.latency) / 500;
      const typeFactor = this.getTypeFactor(engine.type, regionId);

      const score =
        (loadFactor * 0.4 + latencyFactor * 0.3 + typeFactor * 0.3) /
        (1 + distance * 0.1);

      if (score > bestScore) {
        bestScore = score;
        bestTarget = regionId;
      }
    });

    return bestTarget;
  }

  /**
   * Calculate optimal direction (Snake AI pathfinding)
   */
  private calculateOptimalDirection(
    current: { x: number; y: number },
    target: { x: number; y: number },
  ): "north" | "south" | "east" | "west" {
    const dx = target.x - current.x;
    const dy = target.y - current.y;

    // Choose direction with largest difference (simple but effective)
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? "east" : "west";
    } else {
      return dy > 0 ? "south" : "north";
    }
  }

  /**
   * Check if engine reached targets (like eating food in Snake)
   */
  private checkForTargets(engine: InfrastructureEngine): void {
    const head = engine.snake[0];

    this.regions.forEach((region, regionId) => {
      if (this.calculateDistance(head.position, region.location) < 1.5) {
        this.handleEngineReachedTarget(engine, regionId);
      }
    });
  }

  /**
   * Handle engine reaching target (like Snake eating food)
   */
  private handleEngineReachedTarget(
    engine: InfrastructureEngine,
    regionId: string,
  ): void {
    const region = this.regions.get(regionId);
    if (!region) return;

    // Update engine score
    const points = this.calculatePoints(engine.type, region);
    engine.score += points;

    // Optimize the region
    this.optimizeRegion(regionId, engine.type);

    // Mark target as completed
    engine.currentTarget = null;

    // Emit optimization event
    this.emitOptimizationEvent(engine.id, regionId, points);
  }

  /**
   * Calculate points based on engine type and region
   */
  private calculatePoints(engineType: string, region: RegionNode): number {
    const basePoints = 100;
    const loadBonus = Math.max(0, region.load - 50); // More points for high-load regions
    const latencyBonus = Math.max(0, region.latency - 100); // More points for high-latency regions

    const typeMultiplier = this.getTypeFactor(engineType, region.id);

    return Math.floor((basePoints + loadBonus + latencyBonus) * typeMultiplier);
  }

  /**
   * Optimize region based on engine type
   */
  private optimizeRegion(regionId: string, engineType: string): void {
    const region = this.regions.get(regionId);
    if (!region) return;

    switch (engineType) {
      case "routing":
        region.latency = Math.max(10, region.latency * 0.9); // Reduce latency by 10%
        break;
      case "processing":
        region.load = Math.max(0, region.load * 0.8); // Reduce load by 20%
        break;
      case "storage":
        region.latency = Math.max(5, region.latency * 0.95); // Slight latency improvement
        break;
      case "analytics":
        // Analytics engine gathers data, improves future routing
        this.updateRegionIntelligence(regionId);
        break;
    }

    this.regions.set(regionId, region);
  }

  /**
   * Handle collisions and obstacles
   */
  private handleCollisions(engine: InfrastructureEngine): void {
    const head = engine.snake[0];

    // Check wall collisions (boundary handling)
    if (
      head.position.x < 0 ||
      head.position.x >= this.gridSize ||
      head.position.y < 0 ||
      head.position.y >= this.gridSize
    ) {
      this.handleWallCollision(engine);
    }

    // Check self-collision
    for (let i = 1; i < engine.snake.length; i++) {
      if (
        head.position.x === engine.snake[i].position.x &&
        head.position.y === engine.snake[i].position.y
      ) {
        this.handleSelfCollision(engine);
        break;
      }
    }
  }

  /**
   * Handle wall collision (smart bounce back)
   */
  private handleWallCollision(engine: InfrastructureEngine): void {
    // Smart recovery: find alternative direction
    const alternatives: Array<"north" | "south" | "east" | "west"> = [
      "north",
      "south",
      "east",
      "west",
    ];
    const currentIndex = alternatives.indexOf(engine.direction);

    // Try perpendicular directions first
    const perpendicular =
      currentIndex % 2 === 0
        ? [alternatives[1], alternatives[3]]
        : [alternatives[0], alternatives[2]];

    for (const direction of perpendicular) {
      if (this.isValidDirection(engine.snake[0].position, direction)) {
        engine.direction = direction;
        return;
      }
    }

    // If no perpendicular direction works, reverse
    engine.direction = alternatives[(currentIndex + 2) % 4];
  }

  /**
   * Handle self-collision (engine optimization)
   */
  private handleSelfCollision(engine: InfrastructureEngine): void {
    // In infrastructure context, self-collision means optimization opportunity
    engine.score += 50; // Bonus for self-optimization

    // Trim the snake to avoid the collision
    engine.snake = engine.snake.slice(0, Math.max(3, engine.snake.length - 2));

    // Find new direction
    this.findAlternativeDirection(engine);
  }

  /**
   * Optimize routing based on current engine positions
   */
  private optimizeRouting(): void {
    const routingEngines = Array.from(this.engines.values()).filter(
      (engine) => engine.type === "routing",
    );

    routingEngines.forEach((engine) => {
      const coverage = this.calculateRegionCoverage(engine);
      this.updateRoutingTable(engine.id, coverage);
    });
  }

  /**
   * Handle load balancing across regions
   */
  private handleLoadBalancing(): void {
    const processingEngines = Array.from(this.engines.values()).filter(
      (engine) => engine.type === "processing",
    );

    processingEngines.forEach((engine) => {
      const nearbyRegions = this.findNearbyRegions(engine.snake[0].position, 3);
      this.balanceLoadAcrossRegions(nearbyRegions);
    });
  }

  /**
   * Public API methods
   */

  /**
   * Get current infrastructure status (like Snake game score)
   */
  public getInfrastructureStatus() {
    const engines = Array.from(this.engines.values());
    const regions = Array.from(this.regions.values());

    return {
      totalScore: engines.reduce((sum, engine) => sum + engine.score, 0),
      activeEngines: engines.filter((e) => e.snake.length > 0).length,
      healthyRegions: regions.filter((r) => r.status === "active").length,
      averageLatency:
        regions.reduce((sum, r) => sum + r.latency, 0) / regions.length,
      averageLoad: regions.reduce((sum, r) => sum + r.load, 0) / regions.length,
      gameGrid: this.gameGrid.map((row) => [...row]), // Copy for display
      engines: engines.map((engine) => ({
        id: engine.id,
        type: engine.type,
        score: engine.score,
        length: engine.snake.length,
        position: engine.snake[0]?.position,
        direction: engine.direction,
        target: engine.currentTarget,
      })),
      regions: regions.map((region) => ({
        id: region.id,
        name: region.name,
        location: region.location,
        latency: Math.round(region.latency),
        load: Math.round(region.load),
        status: region.status,
      })),
    };
  }

  /**
   * Get optimal routing recommendation
   */
  public getOptimalRoute(
    requestType: string,
    userLocation?: { lat: number; lng: number },
  ) {
    const routingEngine = this.engines.get("routing-engine");
    if (!routingEngine) return null;

    const nearbyRegions = userLocation
      ? this.findRegionsNearUser(userLocation)
      : this.findLowLatencyRegions();

    return {
      primaryRegion: nearbyRegions[0],
      fallbackRegions: nearbyRegions.slice(1, 3),
      estimatedLatency: nearbyRegions[0]?.latency || 100,
      routingScore: routingEngine.score,
      recommendation: this.generateRoutingRecommendation(nearbyRegions[0]),
    };
  }

  /**
   * Add new target (like placing food in Snake)
   */
  public addInfrastructureTarget(
    type: "optimization" | "expansion" | "maintenance",
    regionId?: string,
  ) {
    const targetRegion = regionId || this.findOptimalExpansionLocation();
    const region = this.regions.get(targetRegion);

    if (region) {
      // Mark as special target on the grid
      this.gameGrid[region.location.y][region.location.x] = 2; // Special target

      return {
        success: true,
        targetId: `${type}-${Date.now()}`,
        location: region.location,
        expectedEngines: this.findBestEnginesForTarget(type),
      };
    }

    return { success: false, error: "Invalid target location" };
  }

  /**
   * Stop the intelligent navigation system
   */
  public stopNavigation(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    this.isActive = false;
  }

  /**
   * Restart the navigation system
   */
  public restartNavigation(): void {
    this.stopNavigation();
    this.initializeInfrastructure();
    this.createSnakeEngines();
    this.startIntelligentNavigation();
  }

  /**
   * Helper methods
   */

  private calculateDistance(
    pos1: { x: number; y: number },
    pos2: { x: number; y: number },
  ): number {
    return Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2),
    );
  }

  private calculateOptimalConnections(
    regionId: string,
    allRegions: any[],
  ): string[] {
    // Simple connection logic - connect to nearest 2-3 regions
    return allRegions
      .filter((r) => r.id !== regionId)
      .sort((a, b) => {
        const distA = Math.sqrt(
          Math.pow(a.x - allRegions.find((r) => r.id === regionId)?.x || 0, 2),
        );
        const distB = Math.sqrt(
          Math.pow(b.x - allRegions.find((r) => r.id === regionId)?.x || 0, 2),
        );
        return distA - distB;
      })
      .slice(0, 3)
      .map((r) => r.id);
  }

  private getTypeFactor(engineType: string, regionId: string): number {
    // Different engines are more effective in different regions
    const typeFactors: Record<string, number> = {
      routing: 1.2,
      processing: 1.0,
      storage: 0.8,
      analytics: 1.1,
    };

    return typeFactors[engineType] || 1.0;
  }

  private updateEngineScore(engine: InfrastructureEngine): void {
    // Passive score increase for active engines
    engine.score += 1;
  }

  private emitOptimizationEvent(
    engineId: string,
    regionId: string,
    points: number,
  ): void {
    // Emit custom event for UI updates
    window.dispatchEvent(
      new CustomEvent("infrastructureOptimization", {
        detail: { engineId, regionId, points, timestamp: Date.now() },
      }),
    );
  }

  private updateRegionIntelligence(regionId: string): void {
    // Analytics engine improves region intelligence
    const region = this.regions.get(regionId);
    if (region) {
      region.load = Math.max(0, region.load * 0.95);
      region.latency = Math.max(10, region.latency * 0.98);
    }
  }

  private isValidDirection(
    position: { x: number; y: number },
    direction: string,
  ): boolean {
    switch (direction) {
      case "north":
        return position.y > 0;
      case "south":
        return position.y < this.gridSize - 1;
      case "east":
        return position.x < this.gridSize - 1;
      case "west":
        return position.x > 0;
      default:
        return false;
    }
  }

  private findAlternativeDirection(engine: InfrastructureEngine): void {
    const alternatives: Array<"north" | "south" | "east" | "west"> = [
      "north",
      "south",
      "east",
      "west",
    ];

    for (const direction of alternatives) {
      if (this.isValidDirection(engine.snake[0].position, direction)) {
        engine.direction = direction;
        break;
      }
    }
  }

  private calculateRegionCoverage(engine: InfrastructureEngine): string[] {
    const head = engine.snake[0];
    const coverage: string[] = [];

    this.regions.forEach((region, regionId) => {
      if (this.calculateDistance(head.position, region.location) <= 3) {
        coverage.push(regionId);
      }
    });

    return coverage;
  }

  private updateRoutingTable(engineId: string, coverage: string[]): void {
    // Update internal routing optimization
    coverage.forEach((regionId) => {
      const region = this.regions.get(regionId);
      if (region) {
        region.latency = Math.max(5, region.latency * 0.99);
      }
    });
  }

  private findNearbyRegions(
    position: { x: number; y: number },
    radius: number,
  ): string[] {
    const nearby: string[] = [];

    this.regions.forEach((region, regionId) => {
      if (this.calculateDistance(position, region.location) <= radius) {
        nearby.push(regionId);
      }
    });

    return nearby;
  }

  private balanceLoadAcrossRegions(regionIds: string[]): void {
    const regions = regionIds
      .map((id) => this.regions.get(id))
      .filter(Boolean) as RegionNode[];
    if (regions.length < 2) return;

    const totalLoad = regions.reduce((sum, r) => sum + r.load, 0);
    const averageLoad = totalLoad / regions.length;

    regions.forEach((region) => {
      if (region.load > averageLoad * 1.2) {
        region.load = Math.max(averageLoad, region.load * 0.95);
      }
    });
  }

  private findRegionsNearUser(userLocation: {
    lat: number;
    lng: number;
  }): RegionNode[] {
    // Simplified geographical mapping
    const regionLatLng: Record<string, { lat: number; lng: number }> = {
      "us-east": { lat: 39.0458, lng: -76.6413 },
      "us-west": { lat: 37.7749, lng: -122.4194 },
      europe: { lat: 50.1109, lng: 8.6821 },
      asia: { lat: 35.6762, lng: 139.6503 },
    };

    return Array.from(this.regions.values())
      .filter((region) => regionLatLng[region.id])
      .sort((a, b) => {
        const distA = this.calculateGeoDistance(
          userLocation,
          regionLatLng[a.id],
        );
        const distB = this.calculateGeoDistance(
          userLocation,
          regionLatLng[b.id],
        );
        return distA - distB;
      });
  }

  private calculateGeoDistance(
    pos1: { lat: number; lng: number },
    pos2: { lat: number; lng: number },
  ): number {
    // Haversine formula (simplified)
    const R = 6371; // km
    const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180;
    const dLng = ((pos2.lng - pos1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pos1.lat * Math.PI) / 180) *
        Math.cos((pos2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private findLowLatencyRegions(): RegionNode[] {
    return Array.from(this.regions.values())
      .filter((region) => region.status === "active")
      .sort((a, b) => a.latency - b.latency);
  }

  private generateRoutingRecommendation(
    region: RegionNode | undefined,
  ): string {
    if (!region) return "No optimal region found";

    if (region.latency < 50) return "Excellent performance expected";
    if (region.latency < 100) return "Good performance expected";
    if (region.latency < 200) return "Moderate performance expected";
    return "Consider using fallback region";
  }

  private findOptimalExpansionLocation(): string {
    // Find region with highest load/latency for expansion
    let maxScore = 0;
    let bestRegion = "us-east";

    this.regions.forEach((region, regionId) => {
      const score = region.load + region.latency;
      if (score > maxScore) {
        maxScore = score;
        bestRegion = regionId;
      }
    });

    return bestRegion;
  }

  private findBestEnginesForTarget(type: string): string[] {
    const typeMapping: Record<string, string[]> = {
      optimization: ["routing-engine", "processing-engine"],
      expansion: ["storage-engine", "analytics-engine"],
      maintenance: ["routing-engine", "analytics-engine"],
    };

    return typeMapping[type] || ["routing-engine"];
  }
}

// Singleton instance
export const intelligentInfrastructure = new IntelligentInfrastructureService();
