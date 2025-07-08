/**
 * Serverless Optimization Analytics API
 * Provides detailed analytics and insights for infrastructure optimization
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

interface OptimizationEvent {
  id: string;
  timestamp: number;
  engineId: string;
  engineType: "routing" | "processing" | "storage" | "analytics";
  action: string;
  targetRegion: string;
  beforeMetrics: {
    latency: number;
    load: number;
    efficiency: number;
  };
  afterMetrics: {
    latency: number;
    load: number;
    efficiency: number;
  };
  improvement: {
    latencyReduction: number;
    loadReduction: number;
    efficiencyGain: number;
  };
  duration: number;
  success: boolean;
}

interface PerformanceMetrics {
  timeRange: {
    start: number;
    end: number;
    duration: string;
  };
  summary: {
    totalOptimizations: number;
    successRate: number;
    averageImprovement: number;
    totalTimesSaved: number;
    regionsOptimized: number;
  };
  enginePerformance: Array<{
    engineId: string;
    engineType: string;
    optimizations: number;
    averageImprovement: number;
    efficiency: number;
    activeTime: number;
  }>;
  regionPerformance: Array<{
    regionId: string;
    regionName: string;
    optimizations: number;
    currentLatency: number;
    currentLoad: number;
    improvementTrend: number;
    healthScore: number;
  }>;
  trends: {
    hourly: Array<{
      hour: number;
      optimizations: number;
      averageImprovement: number;
    }>;
    daily: Array<{
      date: string;
      optimizations: number;
      efficiency: number;
    }>;
  };
}

// Generate mock optimization events
function generateOptimizationEvents(timeRange: string): OptimizationEvent[] {
  const now = Date.now();
  const events: OptimizationEvent[] = [];

  const timeRanges = {
    "1h": 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };

  const duration =
    timeRanges[timeRange as keyof typeof timeRanges] || timeRanges["24h"];
  const eventCount = Math.floor(duration / (5 * 60 * 1000)); // Event every 5 minutes on average

  const engines = [
    "routing-engine",
    "processing-engine",
    "storage-engine",
    "analytics-engine",
  ];
  const engineTypes: Array<"routing" | "processing" | "storage" | "analytics"> =
    ["routing", "processing", "storage", "analytics"];
  const regions = ["us-east-1", "us-west-1", "eu-west-1", "ap-southeast-1"];
  const actions = [
    "optimize_latency",
    "balance_load",
    "improve_throughput",
    "cache_optimization",
    "route_optimization",
  ];

  for (let i = 0; i < eventCount; i++) {
    const timestamp = now - Math.random() * duration;
    const engineIndex = Math.floor(Math.random() * engines.length);
    const beforeLatency = 50 + Math.random() * 100;
    const beforeLoad = 30 + Math.random() * 50;
    const beforeEfficiency = 70 + Math.random() * 20;

    const latencyImprovement = Math.random() * 30; // 0-30% improvement
    const loadImprovement = Math.random() * 25; // 0-25% improvement
    const efficiencyImprovement = Math.random() * 15; // 0-15% improvement

    events.push({
      id: `opt_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      engineId: engines[engineIndex],
      engineType: engineTypes[engineIndex],
      action: actions[Math.floor(Math.random() * actions.length)],
      targetRegion: regions[Math.floor(Math.random() * regions.length)],
      beforeMetrics: {
        latency: beforeLatency,
        load: beforeLoad,
        efficiency: beforeEfficiency,
      },
      afterMetrics: {
        latency: beforeLatency * (1 - latencyImprovement / 100),
        load: beforeLoad * (1 - loadImprovement / 100),
        efficiency: Math.min(
          100,
          beforeEfficiency * (1 + efficiencyImprovement / 100),
        ),
      },
      improvement: {
        latencyReduction: latencyImprovement,
        loadReduction: loadImprovement,
        efficiencyGain: efficiencyImprovement,
      },
      duration: Math.floor(30 + Math.random() * 120), // 30-150 seconds
      success: Math.random() > 0.05, // 95% success rate
    });
  }

  return events.sort((a, b) => b.timestamp - a.timestamp);
}

function generatePerformanceMetrics(timeRange: string): PerformanceMetrics {
  const events = generateOptimizationEvents(timeRange);
  const now = Date.now();

  const timeRanges = {
    "1h": { duration: 60 * 60 * 1000, label: "1 hour" },
    "24h": { duration: 24 * 60 * 60 * 1000, label: "24 hours" },
    "7d": { duration: 7 * 24 * 60 * 60 * 1000, label: "7 days" },
    "30d": { duration: 30 * 24 * 60 * 60 * 1000, label: "30 days" },
  };

  const range =
    timeRanges[timeRange as keyof typeof timeRanges] || timeRanges["24h"];
  const startTime = now - range.duration;

  const successfulEvents = events.filter((e) => e.success);
  const totalImprovement = successfulEvents.reduce(
    (sum, e) =>
      sum +
      e.improvement.latencyReduction +
      e.improvement.loadReduction +
      e.improvement.efficiencyGain,
    0,
  );

  // Engine performance analysis
  const engineStats = new Map();
  events.forEach((event) => {
    if (!engineStats.has(event.engineId)) {
      engineStats.set(event.engineId, {
        engineId: event.engineId,
        engineType: event.engineType,
        optimizations: 0,
        totalImprovement: 0,
        efficiency: 0,
        activeTime: 0,
      });
    }

    const stats = engineStats.get(event.engineId);
    stats.optimizations++;
    stats.totalImprovement +=
      event.improvement.latencyReduction +
      event.improvement.loadReduction +
      event.improvement.efficiencyGain;
    stats.activeTime += event.duration;
  });

  const enginePerformance = Array.from(engineStats.values()).map((stats) => ({
    ...stats,
    averageImprovement: stats.totalImprovement / stats.optimizations,
    efficiency: 80 + Math.random() * 20,
    activeTime: stats.activeTime / 1000, // Convert to seconds
  }));

  // Region performance analysis
  const regionStats = new Map();
  const regions = [
    { id: "us-east-1", name: "US East (Virginia)" },
    { id: "us-west-1", name: "US West (California)" },
    { id: "eu-west-1", name: "Europe (Ireland)" },
    { id: "ap-southeast-1", name: "Asia Pacific (Singapore)" },
  ];

  regions.forEach((region) => {
    const regionEvents = events.filter((e) => e.targetRegion === region.id);
    regionStats.set(region.id, {
      regionId: region.id,
      regionName: region.name,
      optimizations: regionEvents.length,
      currentLatency: 50 + Math.random() * 100,
      currentLoad: 30 + Math.random() * 40,
      improvementTrend:
        regionEvents.length > 0
          ? regionEvents.reduce(
              (sum, e) => sum + e.improvement.latencyReduction,
              0,
            ) / regionEvents.length
          : 0,
      healthScore: 85 + Math.random() * 15,
    });
  });

  // Generate hourly trends
  const hourlyTrends = [];
  for (let i = 23; i >= 0; i--) {
    const hourStart = now - i * 60 * 60 * 1000;
    const hourEnd = hourStart + 60 * 60 * 1000;
    const hourEvents = events.filter(
      (e) => e.timestamp >= hourStart && e.timestamp < hourEnd,
    );

    hourlyTrends.push({
      hour: new Date(hourStart).getHours(),
      optimizations: hourEvents.length,
      averageImprovement:
        hourEvents.length > 0
          ? hourEvents.reduce(
              (sum, e) => sum + e.improvement.latencyReduction,
              0,
            ) / hourEvents.length
          : 0,
    });
  }

  // Generate daily trends
  const dailyTrends = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = now - i * 24 * 60 * 60 * 1000;
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const dayEvents = events.filter(
      (e) => e.timestamp >= dayStart && e.timestamp < dayEnd,
    );

    dailyTrends.push({
      date: new Date(dayStart).toISOString().split("T")[0],
      optimizations: dayEvents.length,
      efficiency:
        dayEvents.length > 0
          ? dayEvents.reduce((sum, e) => sum + e.afterMetrics.efficiency, 0) /
            dayEvents.length
          : 85,
    });
  }

  return {
    timeRange: {
      start: startTime,
      end: now,
      duration: range.label,
    },
    summary: {
      totalOptimizations: events.length,
      successRate: (successfulEvents.length / events.length) * 100,
      averageImprovement: totalImprovement / events.length,
      totalTimesSaved: successfulEvents.reduce(
        (sum, e) => sum + e.improvement.latencyReduction,
        0,
      ),
      regionsOptimized: new Set(events.map((e) => e.targetRegion)).size,
    },
    enginePerformance,
    regionPerformance: Array.from(regionStats.values()),
    trends: {
      hourly: hourlyTrends,
      daily: dailyTrends,
    },
  };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { timeRange = "24h", detailed = "false" } = req.query;

    if (
      typeof timeRange !== "string" ||
      !["1h", "24h", "7d", "30d"].includes(timeRange)
    ) {
      res.status(400).json({
        success: false,
        error: "Invalid time range. Use: 1h, 24h, 7d, or 30d",
      });
      return;
    }

    const metrics = generatePerformanceMetrics(timeRange);

    let responseData: any = {
      success: true,
      data: metrics,
      timestamp: Date.now(),
      version: "2.1.0",
    };

    // Include detailed events if requested
    if (detailed === "true") {
      responseData.data.events = generateOptimizationEvents(timeRange).slice(
        0,
        50,
      ); // Limit to 50 recent events
    }

    // Cache based on time range
    const cacheTime = timeRange === "1h" ? 60 : timeRange === "24h" ? 300 : 900; // 1min, 5min, 15min
    res.setHeader(
      "Cache-Control",
      `public, max-age=${cacheTime}, s-maxage=${cacheTime}`,
    );

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve analytics data",
      timestamp: Date.now(),
    });
  }
}
