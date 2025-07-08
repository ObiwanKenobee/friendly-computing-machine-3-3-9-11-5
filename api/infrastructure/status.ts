/**
 * Serverless Infrastructure Status API
 * Provides real-time infrastructure health and performance data
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

interface InfrastructureStatus {
  timestamp: number;
  regions: Array<{
    id: string;
    name: string;
    status: "healthy" | "degraded" | "offline";
    latency: number;
    load: number;
    connections: number;
    lastOptimized: number;
  }>;
  engines: Array<{
    id: string;
    type: "routing" | "processing" | "storage" | "analytics";
    status: "active" | "idle" | "optimizing";
    score: number;
    position: { x: number; y: number };
    target: string | null;
    efficiency: number;
  }>;
  metrics: {
    totalOptimizations: number;
    averageLatency: number;
    averageLoad: number;
    uptime: number;
    performanceScore: number;
  };
  alerts: Array<{
    id: string;
    type: "warning" | "error" | "info";
    message: string;
    timestamp: number;
    resolved: boolean;
  }>;
}

// Simulated infrastructure data (in production, this would come from monitoring systems)
function generateInfrastructureStatus(): InfrastructureStatus {
  const now = Date.now();

  return {
    timestamp: now,
    regions: [
      {
        id: "us-east-1",
        name: "US East (Virginia)",
        status: "healthy",
        latency: 45 + Math.random() * 20,
        load: 30 + Math.random() * 40,
        connections: Math.floor(150 + Math.random() * 100),
        lastOptimized: now - Math.random() * 3600000, // Last hour
      },
      {
        id: "us-west-1",
        name: "US West (California)",
        status: "healthy",
        latency: 60 + Math.random() * 25,
        load: 25 + Math.random() * 35,
        connections: Math.floor(120 + Math.random() * 80),
        lastOptimized: now - Math.random() * 3600000,
      },
      {
        id: "eu-west-1",
        name: "Europe (Ireland)",
        status: Math.random() > 0.9 ? "degraded" : "healthy",
        latency: 90 + Math.random() * 30,
        load: 40 + Math.random() * 30,
        connections: Math.floor(100 + Math.random() * 70),
        lastOptimized: now - Math.random() * 3600000,
      },
      {
        id: "ap-southeast-1",
        name: "Asia Pacific (Singapore)",
        status: "healthy",
        latency: 120 + Math.random() * 40,
        load: 35 + Math.random() * 45,
        connections: Math.floor(80 + Math.random() * 60),
        lastOptimized: now - Math.random() * 3600000,
      },
    ],
    engines: [
      {
        id: "routing-engine",
        type: "routing",
        status: "optimizing",
        score: Math.floor(800 + Math.random() * 200),
        position: {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
        },
        target: Math.random() > 0.5 ? "us-east-1" : null,
        efficiency: 85 + Math.random() * 15,
      },
      {
        id: "processing-engine",
        type: "processing",
        status: "active",
        score: Math.floor(600 + Math.random() * 300),
        position: {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
        },
        target: Math.random() > 0.7 ? "eu-west-1" : null,
        efficiency: 75 + Math.random() * 20,
      },
      {
        id: "storage-engine",
        type: "storage",
        status: "active",
        score: Math.floor(400 + Math.random() * 400),
        position: {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
        },
        target: null,
        efficiency: 80 + Math.random() * 15,
      },
      {
        id: "analytics-engine",
        type: "analytics",
        status: "idle",
        score: Math.floor(1000 + Math.random() * 500),
        position: {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
        },
        target: Math.random() > 0.6 ? "ap-southeast-1" : null,
        efficiency: 90 + Math.random() * 10,
      },
    ],
    metrics: {
      totalOptimizations: Math.floor(15000 + Math.random() * 5000),
      averageLatency: 65 + Math.random() * 20,
      averageLoad: 35 + Math.random() * 15,
      uptime: 99.7 + Math.random() * 0.3,
      performanceScore: 85 + Math.random() * 10,
    },
    alerts: generateAlerts(),
  };
}

function generateAlerts() {
  const alerts = [];
  const now = Date.now();

  if (Math.random() > 0.7) {
    alerts.push({
      id: `alert-${now}`,
      type: "warning" as const,
      message:
        "High latency detected in EU region - routing engine investigating",
      timestamp: now - Math.random() * 300000, // Last 5 minutes
      resolved: false,
    });
  }

  if (Math.random() > 0.8) {
    alerts.push({
      id: `alert-${now + 1}`,
      type: "info" as const,
      message:
        "Storage engine completed optimization cycle - 15% performance improvement",
      timestamp: now - Math.random() * 600000, // Last 10 minutes
      resolved: true,
    });
  }

  if (Math.random() > 0.95) {
    alerts.push({
      id: `alert-${now + 2}`,
      type: "error" as const,
      message: "Connection timeout in Asia Pacific region - failover activated",
      timestamp: now - Math.random() * 180000, // Last 3 minutes
      resolved: false,
    });
  }

  return alerts;
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

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const status = generateInfrastructureStatus();

    // Cache for 30 seconds
    res.setHeader("Cache-Control", "public, max-age=30, s-maxage=30");

    res.status(200).json({
      success: true,
      data: status,
      timestamp: Date.now(),
      version: "2.1.0",
      source: "snake-xenzia-infrastructure",
    });
  } catch (error) {
    console.error("Infrastructure status error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve infrastructure status",
      timestamp: Date.now(),
    });
  }
}
