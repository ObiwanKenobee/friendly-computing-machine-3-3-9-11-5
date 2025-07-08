/**
 * Serverless Route Optimization API
 * Provides intelligent routing recommendations and real-time optimization
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

interface OptimizationRequest {
  userLocation?: {
    lat: number;
    lng: number;
  };
  contentType?: "api" | "static" | "dynamic" | "enterprise";
  currentPerformance?: {
    latency: number;
    load: number;
  };
  preferences?: {
    prioritizeCost: boolean;
    prioritizeSpeed: boolean;
    prioritizeReliability: boolean;
  };
}

interface OptimizationResponse {
  success: boolean;
  recommendations: {
    primary: {
      endpoint: string;
      region: string;
      estimatedLatency: number;
      confidence: number;
      reason: string;
    };
    fallbacks: Array<{
      endpoint: string;
      region: string;
      estimatedLatency: number;
      priority: number;
    }>;
  };
  optimization: {
    cacheStrategy: string;
    headers: Record<string, string>;
    routing: {
      method: string;
      priority: number;
    };
  };
  analytics: {
    expectedImprovement: number;
    costImpact: number;
    reliabilityScore: number;
  };
}

// Mock infrastructure data
const infrastructureNodes = [
  {
    id: "us-east-1",
    name: "US East (Virginia)",
    endpoint: "https://quantumvest.vercel.app",
    location: { lat: 39.0458, lng: -76.6413 },
    currentLatency: 45,
    currentLoad: 35,
    capacity: 1000,
    cost: 1.0,
    reliability: 99.9,
  },
  {
    id: "us-west-1",
    name: "US West (California)",
    endpoint: "https://quantumvest-west.vercel.app",
    location: { lat: 37.7749, lng: -122.4194 },
    currentLatency: 65,
    currentLoad: 28,
    capacity: 800,
    cost: 1.2,
    reliability: 99.8,
  },
  {
    id: "eu-west-1",
    name: "Europe (Ireland)",
    endpoint: "https://quantumvest-eu.vercel.app",
    location: { lat: 53.3498, lng: -6.2603 },
    currentLatency: 85,
    currentLoad: 42,
    capacity: 600,
    cost: 1.1,
    reliability: 99.7,
  },
  {
    id: "ap-southeast-1",
    name: "Asia Pacific (Singapore)",
    endpoint: "https://quantumvest-ap.vercel.app",
    location: { lat: 1.3521, lng: 103.8198 },
    currentLatency: 120,
    currentLoad: 38,
    capacity: 500,
    cost: 1.3,
    reliability: 99.6,
  },
];

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateOptimizedRoute(
  request: OptimizationRequest,
): OptimizationResponse {
  const { userLocation, contentType = "dynamic", preferences = {} } = request;

  // Score each infrastructure node
  const scoredNodes = infrastructureNodes.map((node) => {
    let score = 0;
    let estimatedLatency = node.currentLatency;

    // Geographic proximity (if user location provided)
    if (userLocation) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        node.location.lat,
        node.location.lng,
      );
      // Closer is better, max score of 30
      score += Math.max(0, 30 - distance / 1000);
      // Adjust latency based on distance
      estimatedLatency += distance / 100; // Rough approximation
    } else {
      // Default bonus for US East (primary region)
      if (node.id === "us-east-1") score += 20;
    }

    // Current performance (40% weight)
    const loadFactor = (100 - node.currentLoad) / 100;
    const latencyFactor = Math.max(0, (300 - node.currentLatency) / 300);
    score += loadFactor * 20 + latencyFactor * 20;

    // Capacity and reliability (20% weight)
    score += (node.capacity / 1000) * 10;
    score += (node.reliability / 100) * 10;

    // Content type optimization (10% weight)
    if (contentType === "static" && node.id === "us-east-1") score += 10;
    if (contentType === "api" && node.currentLoad < 30) score += 5;
    if (contentType === "enterprise" && node.reliability > 99.8) score += 8;

    // User preferences (10% weight)
    if (preferences.prioritizeSpeed && node.currentLatency < 60) score += 5;
    if (preferences.prioritizeCost && node.cost < 1.1) score += 5;
    if (preferences.prioritizeReliability && node.reliability > 99.8)
      score += 5;

    return {
      ...node,
      score,
      estimatedLatency: Math.round(estimatedLatency),
    };
  });

  // Sort by score (highest first)
  scoredNodes.sort((a, b) => b.score - a.score);

  const primary = scoredNodes[0];
  const fallbacks = scoredNodes.slice(1, 4).map((node, index) => ({
    endpoint: node.endpoint,
    region: node.name,
    estimatedLatency: node.estimatedLatency,
    priority: index + 1,
  }));

  // Determine cache strategy
  let cacheStrategy = "standard";
  let cacheTTL = 3600;

  switch (contentType) {
    case "static":
      cacheStrategy = "immutable";
      cacheTTL = 31536000; // 1 year
      break;
    case "api":
      cacheStrategy = "no-cache";
      cacheTTL = 0;
      break;
    case "enterprise":
      cacheStrategy = "private";
      cacheTTL = 1800; // 30 minutes
      break;
    default:
      cacheStrategy = "public";
      cacheTTL = 3600; // 1 hour
  }

  // Generate optimization headers
  const optimizationHeaders: Record<string, string> = {
    "X-Optimized-Route": primary.id,
    "X-Estimated-Latency": primary.estimatedLatency.toString(),
    "X-Optimization-Score": primary.score.toFixed(2),
    "Cache-Control": `${cacheStrategy}, max-age=${cacheTTL}`,
    "X-Content-Type-Optimization": contentType,
  };

  if (userLocation) {
    optimizationHeaders["X-User-Location-Optimized"] = "true";
  }

  // Calculate expected improvements
  const baselineLatency = request.currentPerformance?.latency || 100;
  const expectedImprovement = Math.max(
    0,
    ((baselineLatency - primary.estimatedLatency) / baselineLatency) * 100,
  );

  // Determine optimization reason
  let reason = "Optimal performance based on current metrics";
  if (userLocation) {
    reason = `Geographically optimized for your location (${Math.round(
      calculateDistance(
        userLocation.lat,
        userLocation.lng,
        primary.location.lat,
        primary.location.lng,
      ),
    )}km away)`;
  } else if (primary.currentLoad < 20) {
    reason = "Selected for low current load and high availability";
  } else if (primary.reliability > 99.8) {
    reason = "Selected for high reliability and consistent performance";
  }

  return {
    success: true,
    recommendations: {
      primary: {
        endpoint: primary.endpoint,
        region: primary.name,
        estimatedLatency: primary.estimatedLatency,
        confidence: Math.min(100, primary.score),
        reason,
      },
      fallbacks,
    },
    optimization: {
      cacheStrategy,
      headers: optimizationHeaders,
      routing: {
        method: userLocation ? "geographic" : "performance",
        priority: 1,
      },
    },
    analytics: {
      expectedImprovement: Math.round(expectedImprovement),
      costImpact: primary.cost,
      reliabilityScore: primary.reliability,
    },
  };
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
    // Simple optimization without user data
    const result = calculateOptimizedRoute({});
    res.status(200).json({
      ...result,
      timestamp: Date.now(),
      method: "GET",
    });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const optimizationRequest: OptimizationRequest = req.body;

    // Validate user location if provided
    if (optimizationRequest.userLocation) {
      const { lat, lng } = optimizationRequest.userLocation;
      if (
        typeof lat !== "number" ||
        typeof lng !== "number" ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        res.status(400).json({
          success: false,
          error: "Invalid user location coordinates",
        });
        return;
      }
    }

    const result = calculateOptimizedRoute(optimizationRequest);

    // Cache optimization results for 5 minutes
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");

    res.status(200).json({
      ...result,
      timestamp: Date.now(),
      requestId: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });
  } catch (error) {
    console.error("Route optimization error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to calculate route optimization",
      timestamp: Date.now(),
    });
  }
}
