/**
 * Serverless Engine Control API
 * Controls Snake infrastructure engines and optimization operations
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

interface EngineControlRequest {
  action: "start" | "stop" | "restart" | "optimize" | "target" | "configure";
  engineId?: string;
  targetRegion?: string;
  configuration?: {
    speed?: number;
    aggressiveness?: number;
    strategy?: "balanced" | "performance" | "efficiency";
  };
}

interface EngineControlResponse {
  success: boolean;
  message: string;
  engineId?: string;
  newState?: {
    status: string;
    target: string | null;
    score: number;
    efficiency: number;
  };
  optimizationResult?: {
    improvement: number;
    metric: string;
    duration: number;
  };
}

// In-memory engine state (in production, this would be in a database)
let engineStates = new Map([
  [
    "routing-engine",
    {
      status: "active",
      target: null,
      score: 856,
      efficiency: 92,
      configuration: { speed: 5, aggressiveness: 7, strategy: "balanced" },
    },
  ],
  [
    "processing-engine",
    {
      status: "active",
      target: null,
      score: 734,
      efficiency: 88,
      configuration: { speed: 4, aggressiveness: 6, strategy: "efficiency" },
    },
  ],
  [
    "storage-engine",
    {
      status: "idle",
      target: null,
      score: 612,
      efficiency: 85,
      configuration: { speed: 3, aggressiveness: 5, strategy: "balanced" },
    },
  ],
  [
    "analytics-engine",
    {
      status: "optimizing",
      target: "us-east-1",
      score: 1247,
      efficiency: 95,
      configuration: { speed: 6, aggressiveness: 8, strategy: "performance" },
    },
  ],
]);

function executeEngineAction(
  action: string,
  engineId: string,
  params: any = {},
): EngineControlResponse {
  const engine = engineStates.get(engineId);

  if (!engine) {
    return {
      success: false,
      message: `Engine ${engineId} not found`,
    };
  }

  switch (action) {
    case "start":
      engine.status = "active";
      engineStates.set(engineId, engine);
      return {
        success: true,
        message: `Engine ${engineId} started successfully`,
        engineId,
        newState: engine,
      };

    case "stop":
      engine.status = "idle";
      engine.target = null;
      engineStates.set(engineId, engine);
      return {
        success: true,
        message: `Engine ${engineId} stopped successfully`,
        engineId,
        newState: engine,
      };

    case "restart":
      engine.status = "active";
      engine.target = null;
      engine.score += Math.floor(Math.random() * 50); // Restart bonus
      engineStates.set(engineId, engine);
      return {
        success: true,
        message: `Engine ${engineId} restarted successfully`,
        engineId,
        newState: engine,
      };

    case "optimize":
      const improvementAmount = Math.floor(10 + Math.random() * 30);
      const metrics = ["latency", "load", "throughput", "efficiency"];
      const improvedMetric =
        metrics[Math.floor(Math.random() * metrics.length)];

      engine.status = "optimizing";
      engine.efficiency = Math.min(100, engine.efficiency + Math.random() * 5);
      engine.score += improvementAmount;
      engineStates.set(engineId, engine);

      return {
        success: true,
        message: `Optimization started for engine ${engineId}`,
        engineId,
        newState: engine,
        optimizationResult: {
          improvement: improvementAmount,
          metric: improvedMetric,
          duration: Math.floor(30 + Math.random() * 120), // 30-150 seconds
        },
      };

    case "target":
      if (!params.targetRegion) {
        return {
          success: false,
          message: "Target region is required for targeting action",
        };
      }

      engine.target = params.targetRegion;
      engine.status = "optimizing";
      engineStates.set(engineId, engine);

      return {
        success: true,
        message: `Engine ${engineId} now targeting region ${params.targetRegion}`,
        engineId,
        newState: engine,
      };

    case "configure":
      if (params.configuration) {
        engine.configuration = {
          ...engine.configuration,
          ...params.configuration,
        };
        engineStates.set(engineId, engine);

        return {
          success: true,
          message: `Engine ${engineId} configuration updated`,
          engineId,
          newState: engine,
        };
      }

      return {
        success: false,
        message: "Configuration parameters are required",
      };

    default:
      return {
        success: false,
        message: `Unknown action: ${action}`,
      };
  }
}

function executeGlobalAction(
  action: string,
  params: any = {},
): EngineControlResponse {
  switch (action) {
    case "start":
      engineStates.forEach((engine, engineId) => {
        engine.status = "active";
        engineStates.set(engineId, engine);
      });
      return {
        success: true,
        message: "All engines started successfully",
      };

    case "stop":
      engineStates.forEach((engine, engineId) => {
        engine.status = "idle";
        engine.target = null;
        engineStates.set(engineId, engine);
      });
      return {
        success: true,
        message: "All engines stopped successfully",
      };

    case "optimize":
      let totalImprovement = 0;
      engineStates.forEach((engine, engineId) => {
        const improvement = Math.floor(5 + Math.random() * 15);
        engine.status = "optimizing";
        engine.efficiency = Math.min(
          100,
          engine.efficiency + Math.random() * 3,
        );
        engine.score += improvement;
        totalImprovement += improvement;
        engineStates.set(engineId, engine);
      });

      return {
        success: true,
        message: "Global optimization started for all engines",
        optimizationResult: {
          improvement: totalImprovement,
          metric: "overall_performance",
          duration: Math.floor(60 + Math.random() * 180),
        },
      };

    default:
      return {
        success: false,
        message: `Unknown global action: ${action}`,
      };
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    // Return current engine states
    const states = Object.fromEntries(engineStates);
    res.status(200).json({
      success: true,
      data: states,
      timestamp: Date.now(),
    });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const {
      action,
      engineId,
      targetRegion,
      configuration,
    }: EngineControlRequest = req.body;

    if (!action) {
      res.status(400).json({
        success: false,
        message: "Action is required",
      });
      return;
    }

    let result: EngineControlResponse;

    if (engineId) {
      // Engine-specific action
      result = executeEngineAction(action, engineId, {
        targetRegion,
        configuration,
      });
    } else {
      // Global action
      result = executeGlobalAction(action, { targetRegion, configuration });
    }

    // Log the action for monitoring
    console.log(`Engine action executed: ${action}`, {
      engineId,
      targetRegion,
      success: result.success,
      timestamp: new Date().toISOString(),
    });

    res.status(result.success ? 200 : 400).json({
      ...result,
      timestamp: Date.now(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });
  } catch (error) {
    console.error("Engine control error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: Date.now(),
    });
  }
}
