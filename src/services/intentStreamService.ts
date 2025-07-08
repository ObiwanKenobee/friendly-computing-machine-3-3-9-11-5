/**
 * Intent Stream Service
 * Real-time intent streaming and reactive value flows
 * Replaces traditional CRUD operations with intent-driven state mutations
 */

import { agentSwarmService, Intent, ParsedIntent } from "./agentSwarmService";
import {
  sharedMemoryGraphService,
  NodeType,
  RelationshipType,
} from "./sharedMemoryGraphService";

export interface IntentStream {
  id: string;
  name: string;
  description: string;
  filters: IntentFilter[];
  processors: IntentProcessor[];
  subscribers: StreamSubscriber[];
  status: StreamStatus;
  metrics: StreamMetrics;
}

export interface IntentFilter {
  type: FilterType;
  condition: FilterCondition;
  priority: number;
}

export enum FilterType {
  AMOUNT_RANGE = "amount_range",
  TARGET_TYPE = "target_type",
  GEOGRAPHIC = "geographic",
  IMPACT_CATEGORY = "impact_category",
  USER_PROFILE = "user_profile",
  RISK_LEVEL = "risk_level",
  TEMPORAL = "temporal",
}

export interface FilterCondition {
  field: string;
  operator:
    | "equals"
    | "contains"
    | "greater_than"
    | "less_than"
    | "in_range"
    | "matches_pattern";
  value: any;
  weight: number;
}

export interface IntentProcessor {
  id: string;
  name: string;
  type: ProcessorType;
  configuration: ProcessorConfig;
  performance: ProcessorPerformance;
}

export enum ProcessorType {
  ENRICHMENT = "enrichment",
  VALIDATION = "validation",
  TRANSFORMATION = "transformation",
  ROUTING = "routing",
  AGGREGATION = "aggregation",
  NOTIFICATION = "notification",
}

export interface ProcessorConfig {
  batchSize?: number;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  parallelism?: number;
  dependencies?: string[];
  outputStreams?: string[];
}

export interface RetryPolicy {
  maxRetries: number;
  backoffStrategy: "linear" | "exponential" | "fixed";
  baseDelay: number;
  maxDelay: number;
}

export interface ProcessorPerformance {
  throughput: number; // intents per second
  latency: number; // average processing time
  errorRate: number;
  successfulProcessing: number;
  totalProcessed: number;
}

export interface StreamSubscriber {
  id: string;
  name: string;
  endpoint: string;
  authToken?: string;
  filterCriteria?: any;
  deliveryGuarantee: DeliveryGuarantee;
  backpressureStrategy: BackpressureStrategy;
}

export enum DeliveryGuarantee {
  AT_MOST_ONCE = "at_most_once",
  AT_LEAST_ONCE = "at_least_once",
  EXACTLY_ONCE = "exactly_once",
}

export enum BackpressureStrategy {
  DROP = "drop",
  BUFFER = "buffer",
  THROTTLE = "throttle",
  BLOCK = "block",
}

export enum StreamStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  ERROR = "error",
  STOPPED = "stopped",
}

export interface StreamMetrics {
  totalIntents: number;
  processedIntents: number;
  failedIntents: number;
  averageLatency: number;
  throughput: number;
  backpressureEvents: number;
  lastProcessed: Date;
}

export interface ReactiveValueFlow {
  id: string;
  sourceIntent: string;
  targetSystem: string;
  valueType: ValueType;
  transformations: ValueTransformation[];
  currentValue: any;
  history: ValueHistory[];
  triggers: FlowTrigger[];
}

export enum ValueType {
  FUNDING = "funding",
  IMPACT_METRICS = "impact_metrics",
  GOVERNANCE_VOTE = "governance_vote",
  REPUTATION = "reputation",
  COMPLIANCE_STATUS = "compliance_status",
  MARKET_SIGNAL = "market_signal",
}

export interface ValueTransformation {
  id: string;
  type: TransformationType;
  configuration: any;
  condition?: TransformationCondition;
}

export enum TransformationType {
  AGGREGATION = "aggregation",
  FILTERING = "filtering",
  ENRICHMENT = "enrichment",
  VALIDATION = "validation",
  FORMATTING = "formatting",
  ROUTING = "routing",
}

export interface TransformationCondition {
  field: string;
  operator: string;
  value: any;
  logic?: "AND" | "OR" | "NOT";
}

export interface ValueHistory {
  timestamp: Date;
  value: any;
  source: string;
  transformation?: string;
}

export interface FlowTrigger {
  type: TriggerType;
  condition: any;
  action: TriggerAction;
  enabled: boolean;
}

export enum TriggerType {
  VALUE_CHANGE = "value_change",
  THRESHOLD_REACHED = "threshold_reached",
  TIME_ELAPSED = "time_elapsed",
  EXTERNAL_EVENT = "external_event",
  PATTERN_MATCH = "pattern_match",
}

export interface TriggerAction {
  type: "notify" | "execute" | "route" | "aggregate" | "validate";
  configuration: any;
  priority: number;
}

export interface IntentFlowResult {
  intentId: string;
  streamId: string;
  processedBy: string[];
  transformations: string[];
  finalValue: any;
  executionTime: number;
  success: boolean;
  errors?: string[];
  valueFlows: ReactiveValueFlow[];
}

export class IntentStreamService {
  private static instance: IntentStreamService;
  private streams: Map<string, IntentStream> = new Map();
  private processors: Map<string, IntentProcessor> = new Map();
  private valueFlows: Map<string, ReactiveValueFlow> = new Map();
  private intentQueue: Intent[] = [];
  private processingInterval?: NodeJS.Timeout;
  private subscribers: Map<string, (result: IntentFlowResult) => void> =
    new Map();

  private constructor() {
    this.initializeStreams();
    this.initializeProcessors();
    this.startStreamProcessing();
  }

  public static getInstance(): IntentStreamService {
    if (!IntentStreamService.instance) {
      IntentStreamService.instance = new IntentStreamService();
    }
    return IntentStreamService.instance;
  }

  private initializeStreams(): void {
    // Neonatal Care Intent Stream
    this.createStream({
      id: "neonatal_care_stream",
      name: "Neonatal Care Investment Stream",
      description:
        "Processes intents related to neonatal healthcare investments",
      filters: [
        {
          type: FilterType.TARGET_TYPE,
          condition: {
            field: "target",
            operator: "contains",
            value: "neonatal",
            weight: 1.0,
          },
          priority: 1,
        },
        {
          type: FilterType.IMPACT_CATEGORY,
          condition: {
            field: "impactGoals",
            operator: "contains",
            value: "neonatal_care",
            weight: 0.9,
          },
          priority: 1,
        },
      ],
      processors: ["intent_enricher", "impact_validator", "fund_router"],
      deliveryGuarantee: DeliveryGuarantee.AT_LEAST_ONCE,
    });

    // General Investment Stream
    this.createStream({
      id: "general_investment_stream",
      name: "General Investment Stream",
      description: "Processes all investment intents",
      filters: [
        {
          type: FilterType.AMOUNT_RANGE,
          condition: {
            field: "amount",
            operator: "greater_than",
            value: 0,
            weight: 1.0,
          },
          priority: 2,
        },
      ],
      processors: ["intent_enricher", "risk_assessor", "yield_optimizer"],
      deliveryGuarantee: DeliveryGuarantee.EXACTLY_ONCE,
    });

    // High Impact Stream
    this.createStream({
      id: "high_impact_stream",
      name: "High Impact Investment Stream",
      description: "Processes high-impact investment intents",
      filters: [
        {
          type: FilterType.AMOUNT_RANGE,
          condition: {
            field: "amount",
            operator: "greater_than",
            value: 10000,
            weight: 0.8,
          },
          priority: 1,
        },
      ],
      processors: ["impact_validator", "dao_proposer", "contract_deployer"],
      deliveryGuarantee: DeliveryGuarantee.EXACTLY_ONCE,
    });

    console.log("🌊 Intent streams initialized:", this.streams.size);
  }

  private initializeProcessors(): void {
    // Intent Enricher
    this.processors.set("intent_enricher", {
      id: "intent_enricher",
      name: "Intent Enrichment Processor",
      type: ProcessorType.ENRICHMENT,
      configuration: {
        batchSize: 10,
        timeout: 5000,
        parallelism: 3,
      },
      performance: {
        throughput: 50,
        latency: 200,
        errorRate: 0.02,
        successfulProcessing: 0,
        totalProcessed: 0,
      },
    });

    // Impact Validator
    this.processors.set("impact_validator", {
      id: "impact_validator",
      name: "Impact Validation Processor",
      type: ProcessorType.VALIDATION,
      configuration: {
        batchSize: 5,
        timeout: 3000,
        parallelism: 2,
      },
      performance: {
        throughput: 30,
        latency: 150,
        errorRate: 0.01,
        successfulProcessing: 0,
        totalProcessed: 0,
      },
    });

    // Fund Router
    this.processors.set("fund_router", {
      id: "fund_router",
      name: "Fund Routing Processor",
      type: ProcessorType.ROUTING,
      configuration: {
        batchSize: 1,
        timeout: 10000,
        parallelism: 1,
        outputStreams: ["blockchain_stream", "payment_stream"],
      },
      performance: {
        throughput: 10,
        latency: 800,
        errorRate: 0.05,
        successfulProcessing: 0,
        totalProcessed: 0,
      },
    });

    // Risk Assessor
    this.processors.set("risk_assessor", {
      id: "risk_assessor",
      name: "Risk Assessment Processor",
      type: ProcessorType.VALIDATION,
      configuration: {
        batchSize: 20,
        timeout: 2000,
        parallelism: 4,
      },
      performance: {
        throughput: 80,
        latency: 100,
        errorRate: 0.01,
        successfulProcessing: 0,
        totalProcessed: 0,
      },
    });

    // Yield Optimizer
    this.processors.set("yield_optimizer", {
      id: "yield_optimizer",
      name: "Yield Optimization Processor",
      type: ProcessorType.TRANSFORMATION,
      configuration: {
        batchSize: 15,
        timeout: 4000,
        parallelism: 2,
      },
      performance: {
        throughput: 40,
        latency: 300,
        errorRate: 0.03,
        successfulProcessing: 0,
        totalProcessed: 0,
      },
    });

    // DAO Proposer
    this.processors.set("dao_proposer", {
      id: "dao_proposer",
      name: "DAO Proposal Processor",
      type: ProcessorType.TRANSFORMATION,
      configuration: {
        batchSize: 1,
        timeout: 15000,
        parallelism: 1,
      },
      performance: {
        throughput: 5,
        latency: 2000,
        errorRate: 0.08,
        successfulProcessing: 0,
        totalProcessed: 0,
      },
    });

    // Contract Deployer
    this.processors.set("contract_deployer", {
      id: "contract_deployer",
      name: "Smart Contract Deployment Processor",
      type: ProcessorType.TRANSFORMATION,
      configuration: {
        batchSize: 1,
        timeout: 30000,
        parallelism: 1,
      },
      performance: {
        throughput: 2,
        latency: 5000,
        errorRate: 0.1,
        successfulProcessing: 0,
        totalProcessed: 0,
      },
    });

    console.log("⚙️ Intent processors initialized:", this.processors.size);
  }

  private createStream(config: {
    id: string;
    name: string;
    description: string;
    filters: IntentFilter[];
    processors: string[];
    deliveryGuarantee: DeliveryGuarantee;
  }): void {
    const stream: IntentStream = {
      ...config,
      processors: config.processors.map((processorId) => {
        const processor = this.processors.get(processorId);
        if (!processor) {
          throw new Error(`Processor not found: ${processorId}`);
        }
        return processor;
      }),
      subscribers: [],
      status: StreamStatus.ACTIVE,
      metrics: {
        totalIntents: 0,
        processedIntents: 0,
        failedIntents: 0,
        averageLatency: 0,
        throughput: 0,
        backpressureEvents: 0,
        lastProcessed: new Date(),
      },
    };

    this.streams.set(config.id, stream);
  }

  private startStreamProcessing(): void {
    this.processingInterval = setInterval(() => {
      this.processIntentQueue();
      this.updateMetrics();
      this.handleBackpressure();
    }, 1000); // Process every second

    console.log("🔄 Intent stream processing started");
  }

  private processIntentQueue(): void {
    if (this.intentQueue.length === 0) return;

    const intentsToProcess = this.intentQueue.splice(0, 50); // Process up to 50 at a time

    intentsToProcess.forEach((intent) => {
      const matchingStreams = this.findMatchingStreams(intent);

      matchingStreams.forEach((stream) => {
        this.processIntentInStream(intent, stream);
      });
    });
  }

  private findMatchingStreams(intent: Intent): IntentStream[] {
    return Array.from(this.streams.values()).filter((stream) => {
      if (stream.status !== StreamStatus.ACTIVE) return false;

      return stream.filters.every((filter) =>
        this.evaluateFilter(intent, filter),
      );
    });
  }

  private evaluateFilter(intent: Intent, filter: IntentFilter): boolean {
    const value = this.extractValue(intent, filter.condition.field);

    switch (filter.condition.operator) {
      case "equals":
        return value === filter.condition.value;
      case "contains":
        return String(value)
          .toLowerCase()
          .includes(String(filter.condition.value).toLowerCase());
      case "greater_than":
        return Number(value) > Number(filter.condition.value);
      case "less_than":
        return Number(value) < Number(filter.condition.value);
      case "in_range":
        const [min, max] = filter.condition.value;
        return Number(value) >= min && Number(value) <= max;
      case "matches_pattern":
        return new RegExp(filter.condition.value).test(String(value));
      default:
        return false;
    }
  }

  private extractValue(intent: Intent, field: string): any {
    const paths = field.split(".");
    let value: any = intent;

    for (const path of paths) {
      value = value?.[path];
    }

    return value;
  }

  private async processIntentInStream(
    intent: Intent,
    stream: IntentStream,
  ): Promise<void> {
    const startTime = Date.now();
    const result: IntentFlowResult = {
      intentId: intent.id,
      streamId: stream.id,
      processedBy: [],
      transformations: [],
      finalValue: null,
      executionTime: 0,
      success: false,
      valueFlows: [],
    };

    try {
      let currentValue = intent;

      // Process through each processor in sequence
      for (const processor of stream.processors) {
        const processedValue = await this.executeProcessor(
          processor,
          currentValue,
        );
        currentValue = processedValue;
        result.processedBy.push(processor.id);
        result.transformations.push(`${processor.type}:${processor.id}`);

        // Update processor performance
        processor.performance.totalProcessed++;
        processor.performance.successfulProcessing++;
      }

      result.finalValue = currentValue;
      result.success = true;

      // Create reactive value flows
      const valueFlows = await this.createValueFlows(intent, currentValue);
      result.valueFlows = valueFlows;

      // Update stream metrics
      stream.metrics.processedIntents++;
      stream.metrics.lastProcessed = new Date();

      // Store in shared memory graph
      await this.storeProcessedIntent(intent, result);

      console.log(
        "✅ Intent processed successfully:",
        intent.id,
        "in stream:",
        stream.id,
      );
    } catch (error) {
      result.success = false;
      result.errors = [
        error instanceof Error ? error.message : "Unknown error",
      ];

      stream.metrics.failedIntents++;
      console.error("❌ Intent processing failed:", intent.id, error);
    } finally {
      result.executionTime = Date.now() - startTime;
      stream.metrics.totalIntents++;

      // Notify subscribers
      this.notifySubscribers(result);
    }
  }

  private async executeProcessor(
    processor: IntentProcessor,
    value: any,
  ): Promise<any> {
    const startTime = Date.now();

    try {
      let processedValue = value;

      switch (processor.type) {
        case ProcessorType.ENRICHMENT:
          processedValue = await this.enrichIntent(value);
          break;
        case ProcessorType.VALIDATION:
          processedValue = await this.validateIntent(value);
          break;
        case ProcessorType.TRANSFORMATION:
          processedValue = await this.transformIntent(value, processor);
          break;
        case ProcessorType.ROUTING:
          processedValue = await this.routeIntent(value, processor);
          break;
        case ProcessorType.AGGREGATION:
          processedValue = await this.aggregateIntent(value);
          break;
        case ProcessorType.NOTIFICATION:
          processedValue = await this.notifyIntent(value);
          break;
      }

      // Update processor performance
      const latency = Date.now() - startTime;
      processor.performance.latency =
        processor.performance.latency * 0.9 + latency * 0.1; // Exponential moving average

      return processedValue;
    } catch (error) {
      processor.performance.errorRate =
        processor.performance.errorRate * 0.9 + 0.1; // Increase error rate
      throw error;
    }
  }

  private async enrichIntent(intent: Intent): Promise<Intent> {
    // Add contextual information
    const enrichedIntent = { ...intent };

    // Add market context
    enrichedIntent.contextual.marketConditions.opportunities.push(
      "Current neonatal care investment window open",
      "Healthcare infrastructure grants available",
    );

    // Add geographic insights
    if (intent.parsedStructure.target.includes("africa")) {
      enrichedIntent.contextual.geographic.relevantCommunities.push(
        "East African healthcare providers",
        "Rural medical facilities",
      );
    }

    return enrichedIntent;
  }

  private async validateIntent(intent: Intent): Promise<Intent> {
    // Validate intent against business rules
    if (intent.parsedStructure.amount < 0) {
      throw new Error("Investment amount cannot be negative");
    }

    if (intent.ethicalEvaluation.score < 0.7) {
      throw new Error("Intent does not meet ethical standards");
    }

    if (!intent.parsedStructure.impactGoals.length) {
      intent.parsedStructure.impactGoals.push("general_impact");
    }

    return intent;
  }

  private async transformIntent(
    intent: Intent,
    processor: IntentProcessor,
  ): Promise<any> {
    switch (processor.id) {
      case "yield_optimizer":
        return {
          ...intent,
          optimizedYield: {
            expectedReturn: 0.12,
            riskScore: 0.3,
            timeFrame: "6-12 months",
            strategy: "impact_weighted_portfolio",
          },
        };

      case "dao_proposer":
        return {
          ...intent,
          daoProposal: {
            title: `Neonatal Care Investment: ${intent.parsedStructure.amount} ${intent.parsedStructure.currency}`,
            description: `Community investment proposal for ${intent.parsedStructure.target}`,
            votingPeriod: 7, // days
            quorum: 0.3,
            threshold: 0.66,
          },
        };

      case "contract_deployer":
        return {
          ...intent,
          smartContract: {
            type: "CareTokenFactory",
            address: `0x${Math.random().toString(16).substring(2, 42)}`,
            deploymentCost: 0.05, // ETH
            features: ["streaming_payments", "impact_tracking", "governance"],
          },
        };

      default:
        return intent;
    }
  }

  private async routeIntent(
    intent: Intent,
    processor: IntentProcessor,
  ): Promise<any> {
    // Route to appropriate downstream systems
    const routes = [];

    if (intent.parsedStructure.amount > 1000) {
      routes.push("blockchain_deployment");
    }

    if (intent.parsedStructure.target.includes("neonatal")) {
      routes.push("healthcare_providers");
      routes.push("impact_tracking_system");
    }

    routes.push("payment_processing");

    return {
      ...intent,
      routing: {
        destinations: routes,
        priority: intent.priority,
        timestamp: new Date(),
      },
    };
  }

  private async aggregateIntent(intent: Intent): Promise<any> {
    // Aggregate with similar intents
    const similarIntents = await this.findSimilarIntents(intent);

    return {
      ...intent,
      aggregation: {
        similarCount: similarIntents.length,
        totalAmount: similarIntents.reduce(
          (sum, i) => sum + i.parsedStructure.amount,
          0,
        ),
        averageAmount:
          similarIntents.length > 0
            ? similarIntents.reduce(
                (sum, i) => sum + i.parsedStructure.amount,
                0,
              ) / similarIntents.length
            : 0,
        trends: this.extractTrends(similarIntents),
      },
    };
  }

  private async notifyIntent(intent: Intent): Promise<any> {
    // Send notifications to relevant parties
    const notifications = [];

    if (intent.parsedStructure.amount > 10000) {
      notifications.push({
        type: "high_value_alert",
        recipients: ["compliance_team", "impact_team"],
        message: `High-value intent received: ${intent.parsedStructure.amount} ${intent.parsedStructure.currency}`,
      });
    }

    if (intent.parsedStructure.target.includes("neonatal")) {
      notifications.push({
        type: "healthcare_alert",
        recipients: ["healthcare_partners", "community_liaisons"],
        message: "New neonatal care investment intent received",
      });
    }

    return {
      ...intent,
      notifications,
    };
  }

  private async findSimilarIntents(intent: Intent): Promise<Intent[]> {
    // Find similar intents from memory graph
    const memoryService = sharedMemoryGraphService;

    const result = memoryService.query({
      nodeTypes: [NodeType.INTENT],
      filters: [
        {
          field: "target",
          operator: "contains",
          value: intent.parsedStructure.target,
        },
      ],
      limit: 10,
    });

    return result.nodes.map((node) => node.data as Intent);
  }

  private extractTrends(intents: Intent[]): string[] {
    const trends = [];

    if (intents.length > 5) {
      trends.push("increasing_interest");
    }

    const amounts = intents.map((i) => i.parsedStructure.amount);
    const avgAmount = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;

    if (avgAmount > 5000) {
      trends.push("high_value_investments");
    }

    return trends;
  }

  private async createValueFlows(
    originalIntent: Intent,
    processedValue: any,
  ): Promise<ReactiveValueFlow[]> {
    const flows: ReactiveValueFlow[] = [];

    // Create funding flow
    if (originalIntent.parsedStructure.amount > 0) {
      const fundingFlow: ReactiveValueFlow = {
        id: `flow_funding_${Date.now()}`,
        sourceIntent: originalIntent.id,
        targetSystem: "blockchain_payment",
        valueType: ValueType.FUNDING,
        transformations: [
          {
            id: "currency_conversion",
            type: TransformationType.FORMATTING,
            configuration: { targetCurrency: "USDT" },
          },
          {
            id: "fee_calculation",
            type: TransformationType.ENRICHMENT,
            configuration: { feeRate: 0.025 },
          },
        ],
        currentValue: {
          amount: originalIntent.parsedStructure.amount,
          currency: originalIntent.parsedStructure.currency,
          fees: originalIntent.parsedStructure.amount * 0.025,
          netAmount: originalIntent.parsedStructure.amount * 0.975,
        },
        history: [
          {
            timestamp: new Date(),
            value: originalIntent.parsedStructure.amount,
            source: "user_intent",
          },
        ],
        triggers: [
          {
            type: TriggerType.THRESHOLD_REACHED,
            condition: {
              field: "amount",
              operator: "greater_than",
              value: 10000,
            },
            action: {
              type: "notify",
              configuration: { recipients: ["compliance"] },
              priority: 1,
            },
            enabled: true,
          },
        ],
      };

      flows.push(fundingFlow);
      this.valueFlows.set(fundingFlow.id, fundingFlow);
    }

    // Create impact metrics flow
    if (originalIntent.parsedStructure.impactGoals.length > 0) {
      const impactFlow: ReactiveValueFlow = {
        id: `flow_impact_${Date.now()}`,
        sourceIntent: originalIntent.id,
        targetSystem: "impact_tracking",
        valueType: ValueType.IMPACT_METRICS,
        transformations: [
          {
            id: "impact_calculation",
            type: TransformationType.AGGREGATION,
            configuration: { method: "weighted_average" },
          },
        ],
        currentValue: {
          estimatedBeneficiaries: this.estimateImpact(originalIntent),
          categories: originalIntent.parsedStructure.impactGoals,
          confidence: 0.85,
        },
        history: [
          {
            timestamp: new Date(),
            value: originalIntent.parsedStructure.impactGoals,
            source: "intent_analysis",
          },
        ],
        triggers: [],
      };

      flows.push(impactFlow);
      this.valueFlows.set(impactFlow.id, impactFlow);
    }

    return flows;
  }

  private estimateImpact(intent: Intent): number {
    const baseImpact = intent.parsedStructure.amount / 100; // $100 per beneficiary

    if (intent.parsedStructure.target.includes("neonatal")) {
      return Math.floor(baseImpact * 2); // Higher impact for critical care
    }

    return Math.floor(baseImpact);
  }

  private async storeProcessedIntent(
    intent: Intent,
    result: IntentFlowResult,
  ): Promise<void> {
    const memoryService = sharedMemoryGraphService;

    // Store intent node
    const intentNode = memoryService.createNode({
      type: NodeType.INTENT,
      data: {
        ...intent,
        processingResult: result,
      },
      accessLevel: "community" as any,
      geographic: {
        region: intent.contextual.geographic.region,
        country: intent.contextual.geographic.country,
      },
    });

    // Create relationships to relevant entities
    if (intent.parsedStructure.target.includes("neonatal")) {
      const opportunities = memoryService.findOpportunities({
        impactType: "neonatal_care",
        region: intent.contextual.geographic.region,
      });

      opportunities.forEach((opportunity) => {
        memoryService.createRelationship(intentNode.id, opportunity.id, {
          type: RelationshipType.IMPACTS,
          strength: 0.8,
          direction: "outgoing",
          metadata: { category: "investment_intent" },
        });
      });
    }
  }

  private updateMetrics(): void {
    this.streams.forEach((stream) => {
      const now = Date.now();
      const timeDiff = now - stream.metrics.lastProcessed.getTime();

      if (timeDiff > 0) {
        stream.metrics.throughput =
          stream.metrics.processedIntents / (timeDiff / 1000) || 0;
      }
    });

    this.processors.forEach((processor) => {
      if (processor.performance.totalProcessed > 0) {
        processor.performance.throughput =
          processor.performance.successfulProcessing /
          (processor.performance.totalProcessed /
            processor.performance.throughput || 1);
      }
    });
  }

  private handleBackpressure(): void {
    this.streams.forEach((stream) => {
      if (this.intentQueue.length > 1000) {
        // Backpressure threshold
        stream.metrics.backpressureEvents++;

        stream.subscribers.forEach((subscriber) => {
          switch (subscriber.backpressureStrategy) {
            case BackpressureStrategy.DROP:
              // Drop oldest intents
              this.intentQueue.splice(0, 100);
              break;
            case BackpressureStrategy.THROTTLE:
              // Slow down processing
              if (this.processingInterval) {
                clearInterval(this.processingInterval);
                this.processingInterval = setInterval(
                  () => this.processIntentQueue(),
                  2000,
                );
              }
              break;
          }
        });
      }
    });
  }

  private notifySubscribers(result: IntentFlowResult): void {
    this.subscribers.forEach((callback) => {
      try {
        callback(result);
      } catch (error) {
        console.error("Error notifying subscriber:", error);
      }
    });
  }

  // Public API Methods

  public async streamIntent(
    naturalLanguage: string,
    userId: string,
    context?: any,
  ): Promise<IntentFlowResult[]> {
    // Process intent through agent swarm first
    const intent = await agentSwarmService.processIntent(
      naturalLanguage,
      userId,
      context,
    );

    // Add to intent queue for stream processing
    this.intentQueue.push(intent);

    // Return promise that resolves when processing is complete
    return new Promise((resolve) => {
      const results: IntentFlowResult[] = [];

      const subscriberId = `temp_${Date.now()}`;
      this.subscribers.set(subscriberId, (result) => {
        if (result.intentId === intent.id) {
          results.push(result);

          // Check if all matching streams have processed
          const matchingStreams = this.findMatchingStreams(intent);
          if (results.length >= matchingStreams.length) {
            this.subscribers.delete(subscriberId);
            resolve(results);
          }
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        this.subscribers.delete(subscriberId);
        resolve(results);
      }, 30000);
    });
  }

  public getStreamMetrics(): Record<string, StreamMetrics> {
    const metrics: Record<string, StreamMetrics> = {};
    this.streams.forEach((stream, id) => {
      metrics[id] = stream.metrics;
    });
    return metrics;
  }

  public getProcessorPerformance(): Record<string, ProcessorPerformance> {
    const performance: Record<string, ProcessorPerformance> = {};
    this.processors.forEach((processor, id) => {
      performance[id] = processor.performance;
    });
    return performance;
  }

  public getValueFlows(): ReactiveValueFlow[] {
    return Array.from(this.valueFlows.values());
  }

  public getActiveValueFlows(intentId?: string): ReactiveValueFlow[] {
    const flows = Array.from(this.valueFlows.values());

    if (intentId) {
      return flows.filter((flow) => flow.sourceIntent === intentId);
    }

    return flows;
  }

  public subscribeToResults(
    subscriberId: string,
    callback: (result: IntentFlowResult) => void,
  ): void {
    this.subscribers.set(subscriberId, callback);
  }

  public unsubscribeFromResults(subscriberId: string): void {
    this.subscribers.delete(subscriberId);
  }

  public pauseStream(streamId: string): boolean {
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.status = StreamStatus.PAUSED;
      return true;
    }
    return false;
  }

  public resumeStream(streamId: string): boolean {
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.status = StreamStatus.ACTIVE;
      return true;
    }
    return false;
  }

  public getSystemHealth(): any {
    const totalStreams = this.streams.size;
    const activeStreams = Array.from(this.streams.values()).filter(
      (s) => s.status === StreamStatus.ACTIVE,
    ).length;
    const totalProcessors = this.processors.size;
    const healthyProcessors = Array.from(this.processors.values()).filter(
      (p) => p.performance.errorRate < 0.1,
    ).length;

    return {
      streams: {
        total: totalStreams,
        active: activeStreams,
        health: activeStreams / totalStreams,
      },
      processors: {
        total: totalProcessors,
        healthy: healthyProcessors,
        health: healthyProcessors / totalProcessors,
      },
      queue: {
        size: this.intentQueue.length,
        backpressure: this.intentQueue.length > 1000,
      },
      valueFlows: {
        active: this.valueFlows.size,
        totalVolume: Array.from(this.valueFlows.values()).reduce(
          (sum, flow) => {
            return sum + (flow.currentValue?.amount || 0);
          },
          0,
        ),
      },
    };
  }
}

// Export singleton instance
export const intentStreamService = IntentStreamService.getInstance();
