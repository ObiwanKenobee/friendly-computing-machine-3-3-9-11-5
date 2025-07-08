import { singletonPattern } from "../utils/singletonPattern";
import { mlModelService } from "./mlModelService";
import { featureStoreService } from "./featureStoreService";

export interface InferenceRequest {
  id: string;
  modelId: string;
  input: any;
  features?: string[]; // feature IDs to fetch
  entityId?: string; // for feature store lookup
  options?: {
    explainability?: boolean;
    confidence?: boolean;
    timeout?: number;
    cache?: boolean;
  };
  timestamp: Date;
}

export interface InferenceResponse {
  requestId: string;
  modelId: string;
  prediction: any;
  confidence?: number;
  latency: number;
  features?: Record<string, any>;
  explanation?: any;
  metadata: {
    modelVersion: string;
    engineVersion: string;
    timestamp: Date;
    cached: boolean;
  };
}

export interface BatchInferenceJob {
  id: string;
  modelId: string;
  inputs: any[];
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  results: InferenceResponse[];
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletionTime?: Date;
  errorMessage?: string;
}

export interface InferenceMetrics {
  modelId: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  p95Latency: number;
  p99Latency: number;
  throughput: number; // requests per second
  errorRate: number;
  lastHour: {
    requests: number;
    errors: number;
    avgLatency: number;
  };
  lastDay: {
    requests: number;
    errors: number;
    avgLatency: number;
  };
}

export interface InferenceEndpoint {
  id: string;
  modelId: string;
  url: string;
  status: "healthy" | "unhealthy" | "deploying" | "scaling";
  instances: number;
  cpuUtilization: number;
  memoryUtilization: number;
  requestQueue: number;
  lastHealthCheck: Date;
  autoScaling: {
    enabled: boolean;
    minInstances: number;
    maxInstances: number;
    targetCpuUtilization: number;
    scaleUpCooldown: number;
    scaleDownCooldown: number;
  };
}

export interface CacheEntry {
  key: string;
  response: InferenceResponse;
  expiresAt: Date;
  hitCount: number;
  lastAccessed: Date;
}

class InferenceEngineService {
  private endpoints: Map<string, InferenceEndpoint> = new Map();
  private metrics: Map<string, InferenceMetrics> = new Map();
  private cache: Map<string, CacheEntry> = new Map();
  private batchJobs: Map<string, BatchInferenceJob> = new Map();
  private requestQueue: Map<string, InferenceRequest[]> = new Map();
  private isInitialized = false;
  private readonly ENGINE_VERSION = "1.0.0";

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize endpoints for deployed models
    await this.initializeEndpoints();

    // Start background processes
    this.startRequestProcessor();
    this.startMetricsCollection();
    this.startCacheCleanup();
    this.startAutoScaling();

    this.isInitialized = true;
    console.log(
      "Inference Engine Service initialized with real-time serving capabilities",
    );
  }

  private async initializeEndpoints(): Promise<void> {
    // Get deployed models and create endpoints
    const models = await mlModelService.getModels({ status: "deployed" });

    for (const model of models) {
      const endpoint: InferenceEndpoint = {
        id: `endpoint-${model.id}`,
        modelId: model.id,
        url: `https://inference.quantumvest.io/models/${model.id}/predict`,
        status: "healthy",
        instances: 2,
        cpuUtilization: 30 + Math.random() * 40,
        memoryUtilization: 25 + Math.random() * 35,
        requestQueue: 0,
        lastHealthCheck: new Date(),
        autoScaling: {
          enabled: true,
          minInstances: 1,
          maxInstances: 10,
          targetCpuUtilization: 70,
          scaleUpCooldown: 300, // 5 minutes
          scaleDownCooldown: 600, // 10 minutes
        },
      };

      this.endpoints.set(model.id, endpoint);

      // Initialize metrics
      this.metrics.set(model.id, {
        modelId: model.id,
        totalRequests: Math.floor(Math.random() * 10000),
        successfulRequests: Math.floor(Math.random() * 9500),
        failedRequests: Math.floor(Math.random() * 500),
        averageLatency: model.latency,
        p95Latency: model.latency * 1.5,
        p99Latency: model.latency * 2.2,
        throughput: model.throughput,
        errorRate: Math.random() * 0.05,
        lastHour: {
          requests: Math.floor(Math.random() * 1000),
          errors: Math.floor(Math.random() * 50),
          avgLatency: model.latency * (0.9 + Math.random() * 0.2),
        },
        lastDay: {
          requests: Math.floor(Math.random() * 20000),
          errors: Math.floor(Math.random() * 1000),
          avgLatency: model.latency * (0.95 + Math.random() * 0.1),
        },
      });

      // Initialize request queue
      this.requestQueue.set(model.id, []);
    }
  }

  async predict(
    request: Omit<InferenceRequest, "id" | "timestamp">,
  ): Promise<InferenceResponse> {
    const inferenceRequest: InferenceRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...request,
    };

    const startTime = Date.now();

    try {
      // Check cache first
      if (request.options?.cache !== false) {
        const cached = await this.getCachedResponse(inferenceRequest);
        if (cached) {
          cached.metadata.cached = true;
          cached.latency = Date.now() - startTime;
          await this.updateMetrics(request.modelId, true, cached.latency);
          return cached;
        }
      }

      // Get features if needed
      let features: Record<string, any> = {};
      if (request.features && request.entityId) {
        for (const featureId of request.features) {
          const featureValue = await featureStoreService.getLatestFeatureValue(
            featureId,
            request.entityId,
          );
          features[featureId] = featureValue?.value || null;
        }
      }

      // Check endpoint health
      const endpoint = this.endpoints.get(request.modelId);
      if (!endpoint || endpoint.status !== "healthy") {
        throw new Error(
          `Endpoint for model ${request.modelId} is not available`,
        );
      }

      // Add to queue if endpoint is busy
      if (endpoint.requestQueue > 100) {
        return this.queueRequest(inferenceRequest);
      }

      // Make prediction
      const prediction = await mlModelService.predict(request.modelId, {
        ...request.input,
        ...features,
      });

      // Get explanation if requested
      let explanation;
      if (request.options?.explainability) {
        explanation = await mlModelService.explainPrediction(
          request.modelId,
          inferenceRequest.id,
          { ...request.input, ...features },
        );
      }

      const response: InferenceResponse = {
        requestId: inferenceRequest.id,
        modelId: request.modelId,
        prediction: prediction.prediction,
        confidence: request.options?.confidence
          ? prediction.confidence
          : undefined,
        latency: Date.now() - startTime,
        features: Object.keys(features).length > 0 ? features : undefined,
        explanation,
        metadata: {
          modelVersion: "1.0.0", // Would come from model metadata
          engineVersion: this.ENGINE_VERSION,
          timestamp: new Date(),
          cached: false,
        },
      };

      // Cache response if enabled
      if (request.options?.cache !== false) {
        await this.cacheResponse(inferenceRequest, response);
      }

      // Update metrics
      await this.updateMetrics(request.modelId, true, response.latency);

      return response;
    } catch (error) {
      const latency = Date.now() - startTime;
      await this.updateMetrics(request.modelId, false, latency);

      throw new Error(
        `Inference failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async queueRequest(
    request: InferenceRequest,
  ): Promise<InferenceResponse> {
    const queue = this.requestQueue.get(request.modelId) || [];
    queue.push(request);
    this.requestQueue.set(request.modelId, queue);

    // Return a promise that resolves when the request is processed
    return new Promise((resolve, reject) => {
      const checkQueue = () => {
        const currentQueue = this.requestQueue.get(request.modelId) || [];
        const requestIndex = currentQueue.findIndex((r) => r.id === request.id);

        if (requestIndex === -1) {
          // Request was processed
          resolve({
            requestId: request.id,
            modelId: request.modelId,
            prediction: null,
            latency: Date.now() - request.timestamp.getTime(),
            metadata: {
              modelVersion: "1.0.0",
              engineVersion: this.ENGINE_VERSION,
              timestamp: new Date(),
              cached: false,
            },
          });
        } else {
          // Still in queue, check again
          setTimeout(checkQueue, 1000);
        }
      };

      setTimeout(checkQueue, 1000);

      // Timeout after 30 seconds
      setTimeout(() => {
        reject(new Error("Request timeout"));
      }, 30000);
    });
  }

  async batchPredict(
    modelId: string,
    inputs: any[],
    options?: { batchSize?: number },
  ): Promise<BatchInferenceJob> {
    const job: BatchInferenceJob = {
      id: `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      modelId,
      inputs,
      status: "queued",
      progress: 0,
      results: [],
      createdAt: new Date(),
    };

    this.batchJobs.set(job.id, job);

    // Process batch asynchronously
    this.processBatchJob(job, options?.batchSize || 10);

    return job;
  }

  private async processBatchJob(
    job: BatchInferenceJob,
    batchSize: number,
  ): Promise<void> {
    try {
      job.status = "processing";
      job.startedAt = new Date();

      const totalBatches = Math.ceil(job.inputs.length / batchSize);
      const estimatedTimePerBatch = 30000; // 30 seconds per batch
      job.estimatedCompletionTime = new Date(
        Date.now() + totalBatches * estimatedTimePerBatch,
      );

      for (let i = 0; i < job.inputs.length; i += batchSize) {
        const batch = job.inputs.slice(i, i + batchSize);

        const batchPromises = batch.map(async (input, index) => {
          try {
            const response = await this.predict({
              modelId: job.modelId,
              input,
              options: { cache: false },
            });
            return response;
          } catch (error) {
            console.error(
              `Batch prediction failed for input ${i + index}:`,
              error,
            );
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        job.results.push(
          ...(batchResults.filter((r) => r !== null) as InferenceResponse[]),
        );

        job.progress = Math.min(
          100,
          ((i + batchSize) / job.inputs.length) * 100,
        );

        // Small delay between batches to prevent overwhelming
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      job.status = "completed";
      job.completedAt = new Date();
      job.progress = 100;
    } catch (error) {
      job.status = "failed";
      job.errorMessage =
        error instanceof Error ? error.message : "Unknown error";
    }
  }

  async getBatchJob(jobId: string): Promise<BatchInferenceJob | null> {
    return this.batchJobs.get(jobId) || null;
  }

  async getBatchJobs(modelId?: string): Promise<BatchInferenceJob[]> {
    let jobs = Array.from(this.batchJobs.values());

    if (modelId) {
      jobs = jobs.filter((job) => job.modelId === modelId);
    }

    return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private generateCacheKey(request: InferenceRequest): string {
    const key = {
      modelId: request.modelId,
      input: request.input,
      features: request.features,
      entityId: request.entityId,
    };
    return Buffer.from(JSON.stringify(key)).toString("base64");
  }

  private async getCachedResponse(
    request: InferenceRequest,
  ): Promise<InferenceResponse | null> {
    const key = this.generateCacheKey(request);
    const entry = this.cache.get(key);

    if (!entry || entry.expiresAt < new Date()) {
      return null;
    }

    entry.hitCount++;
    entry.lastAccessed = new Date();

    return {
      ...entry.response,
      requestId: request.id, // Update request ID
    };
  }

  private async cacheResponse(
    request: InferenceRequest,
    response: InferenceResponse,
  ): Promise<void> {
    const key = this.generateCacheKey(request);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Cache for 15 minutes

    this.cache.set(key, {
      key,
      response,
      expiresAt,
      hitCount: 0,
      lastAccessed: new Date(),
    });
  }

  private startRequestProcessor(): void {
    setInterval(() => {
      // Process queued requests
      for (const [modelId, queue] of this.requestQueue.entries()) {
        const endpoint = this.endpoints.get(modelId);
        if (!endpoint || queue.length === 0) continue;

        // Process up to 10 requests per interval
        const toProcess = queue.splice(0, Math.min(10, queue.length));

        for (const request of toProcess) {
          // Process request asynchronously
          this.predict({
            modelId: request.modelId,
            input: request.input,
            features: request.features,
            entityId: request.entityId,
            options: request.options,
          }).catch((error) => {
            console.error(
              `Failed to process queued request ${request.id}:`,
              error,
            );
          });
        }
      }
    }, 1000);
  }

  private startMetricsCollection(): void {
    setInterval(() => {
      // Update endpoint metrics
      for (const [modelId, endpoint] of this.endpoints.entries()) {
        const metrics = this.metrics.get(modelId);
        if (!metrics) continue;

        // Simulate real-time metrics
        endpoint.cpuUtilization = Math.max(
          10,
          Math.min(95, endpoint.cpuUtilization + (Math.random() - 0.5) * 10),
        );

        endpoint.memoryUtilization = Math.max(
          10,
          Math.min(90, endpoint.memoryUtilization + (Math.random() - 0.5) * 5),
        );

        endpoint.requestQueue = Math.max(
          0,
          endpoint.requestQueue + Math.floor((Math.random() - 0.5) * 20),
        );

        // Update health status based on metrics
        if (endpoint.cpuUtilization > 90 || endpoint.memoryUtilization > 85) {
          endpoint.status = "unhealthy";
        } else {
          endpoint.status = "healthy";
        }

        endpoint.lastHealthCheck = new Date();
      }
    }, 5000); // Every 5 seconds
  }

  private startCacheCleanup(): void {
    setInterval(() => {
      const now = new Date();
      const keysToDelete: string[] = [];

      for (const [key, entry] of this.cache.entries()) {
        if (entry.expiresAt < now) {
          keysToDelete.push(key);
        }
      }

      for (const key of keysToDelete) {
        this.cache.delete(key);
      }

      console.log(
        `Cache cleanup: removed ${keysToDelete.length} expired entries`,
      );
    }, 300000); // Every 5 minutes
  }

  private startAutoScaling(): void {
    setInterval(() => {
      for (const [modelId, endpoint] of this.endpoints.entries()) {
        if (!endpoint.autoScaling.enabled) continue;

        const shouldScaleUp =
          endpoint.cpuUtilization >
            endpoint.autoScaling.targetCpuUtilization + 10 ||
          endpoint.requestQueue > 50;

        const shouldScaleDown =
          endpoint.cpuUtilization <
            endpoint.autoScaling.targetCpuUtilization - 20 &&
          endpoint.requestQueue < 5;

        if (
          shouldScaleUp &&
          endpoint.instances < endpoint.autoScaling.maxInstances
        ) {
          endpoint.instances++;
          endpoint.status = "scaling";
          console.log(
            `Scaling up model ${modelId} to ${endpoint.instances} instances`,
          );

          // Simulate scaling completion
          setTimeout(() => {
            endpoint.status = "healthy";
          }, 30000);
        }

        if (
          shouldScaleDown &&
          endpoint.instances > endpoint.autoScaling.minInstances
        ) {
          endpoint.instances--;
          endpoint.status = "scaling";
          console.log(
            `Scaling down model ${modelId} to ${endpoint.instances} instances`,
          );

          // Simulate scaling completion
          setTimeout(() => {
            endpoint.status = "healthy";
          }, 15000);
        }
      }
    }, 60000); // Every minute
  }

  private async updateMetrics(
    modelId: string,
    success: boolean,
    latency: number,
  ): Promise<void> {
    const metrics = this.metrics.get(modelId);
    if (!metrics) return;

    metrics.totalRequests++;

    if (success) {
      metrics.successfulRequests++;
    } else {
      metrics.failedRequests++;
    }

    // Update latency metrics (simplified)
    metrics.averageLatency = (metrics.averageLatency + latency) / 2;
    metrics.errorRate = metrics.failedRequests / metrics.totalRequests;

    // Update hourly metrics
    metrics.lastHour.requests++;
    if (!success) {
      metrics.lastHour.errors++;
    }
    metrics.lastHour.avgLatency = (metrics.lastHour.avgLatency + latency) / 2;
  }

  async getMetrics(modelId?: string): Promise<InferenceMetrics[]> {
    if (modelId) {
      const metrics = this.metrics.get(modelId);
      return metrics ? [metrics] : [];
    }

    return Array.from(this.metrics.values());
  }

  async getEndpoints(): Promise<InferenceEndpoint[]> {
    return Array.from(this.endpoints.values());
  }

  async getEndpoint(modelId: string): Promise<InferenceEndpoint | null> {
    return this.endpoints.get(modelId) || null;
  }

  async getCacheStats(): Promise<{
    totalEntries: number;
    hitRate: number;
    memoryUsage: number;
    topEntries: Array<{ key: string; hitCount: number; lastAccessed: Date }>;
  }> {
    const totalEntries = this.cache.size;
    const totalHits = Array.from(this.cache.values()).reduce(
      (sum, entry) => sum + entry.hitCount,
      0,
    );
    const totalRequests = Array.from(this.metrics.values()).reduce(
      (sum, metrics) => sum + metrics.totalRequests,
      0,
    );

    const topEntries = Array.from(this.cache.values())
      .sort((a, b) => b.hitCount - a.hitCount)
      .slice(0, 10)
      .map((entry) => ({
        key: entry.key.substring(0, 20) + "...",
        hitCount: entry.hitCount,
        lastAccessed: entry.lastAccessed,
      }));

    return {
      totalEntries,
      hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
      memoryUsage: totalEntries * 1024, // Rough estimate in bytes
      topEntries,
    };
  }
}

export const inferenceEngineService = singletonPattern(
  () => new InferenceEngineService(),
);
