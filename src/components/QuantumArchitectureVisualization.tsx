/**
 * Quantum Tech Architecture Visualization Dashboard
 * Interactive system diagram with service mapping, user journeys, and workflow visualization
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Network,
  Users,
  Brain,
  Shield,
  Database,
  Zap,
  Globe,
  Activity,
  TrendingUp,
  Target,
  Settings,
  GitBranch,
  Layers,
  Flow,
  Eye,
  MapPin,
  Clock,
  ArrowRight,
  Circle,
  Square,
  Diamond,
  Triangle,
  Download,
  Share,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

import {
  quantumTechArchitecture,
  ServiceNode,
  WorkflowEdge,
  UserJourney,
} from "../services/quantumTechArchitecture";

interface DiagramNode {
  id: string;
  name: string;
  x: number;
  y: number;
  type: "service" | "component" | "agent" | "protocol" | "gateway";
  status: "active" | "degraded" | "offline" | "initializing";
  vertical: string;
  role: string;
  metadata: any;
  connections: string[];
}

interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  type: "data_flow" | "value_flow" | "control_flow" | "conditional_logic";
  weight: number;
  animated: boolean;
  color: string;
}

interface ViewMode {
  executive: boolean;
  developer: boolean;
  swimlanes: boolean;
  journeys: boolean;
  realtime: boolean;
}

const QuantumArchitectureVisualization: React.FC = () => {
  const [serviceNodes, setServiceNodes] = useState<ServiceNode[]>([]);
  const [userJourneys, setUserJourneys] = useState<UserJourney[]>([]);
  const [diagramNodes, setDiagramNodes] = useState<DiagramNode[]>([]);
  const [diagramEdges, setDiagramEdges] = useState<DiagramEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<ServiceNode | null>(null);
  const [selectedJourney, setSelectedJourney] = useState<UserJourney | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>({
    executive: false,
    developer: true,
    swimlanes: false,
    journeys: false,
    realtime: true,
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    loadArchitectureData();
    if (viewMode.realtime) {
      const interval = setInterval(loadArchitectureData, 5000);
      return () => clearInterval(interval);
    }
  }, [viewMode.realtime]);

  const loadArchitectureData = () => {
    const systemDiagram = quantumTechArchitecture.getSystemDiagram();
    setServiceNodes(systemDiagram.nodes);

    const journeys = quantumTechArchitecture.getUserJourneyMap();
    setUserJourneys(journeys);

    // Generate positioned diagram nodes
    const positioned = generateNodePositions(systemDiagram.nodes);
    setDiagramNodes(positioned);

    // Generate edges with visual properties
    const edges = generateDiagramEdges(systemDiagram.edges);
    setDiagramEdges(edges);
  };

  const generateNodePositions = (nodes: ServiceNode[]): DiagramNode[] => {
    const layers = {
      presentation: { y: 100, nodes: [] as DiagramNode[] },
      application: { y: 250, nodes: [] as DiagramNode[] },
      service: { y: 400, nodes: [] as DiagramNode[] },
      data: { y: 550, nodes: [] as DiagramNode[] },
      infrastructure: { y: 700, nodes: [] as DiagramNode[] },
    };

    const swimlanes = {
      retail_user: { x: 150 },
      enterprise_client: { x: 350 },
      ai_agent: { x: 550 },
      governance_layer: { x: 750 },
    };

    return nodes.map((node, index) => {
      // Determine layer based on node type
      let layer = "service";
      if (node.type === "component") layer = "presentation";
      if (node.type === "gateway") layer = "application";
      if (node.type === "protocol") layer = "infrastructure";
      if (node.id.includes("database") || node.id.includes("storage"))
        layer = "data";

      // Determine swimlane position
      const swimlane = swimlanes[node.role] || { x: 450 };
      const layerY = layers[layer].y;
      const nodeX = swimlane.x + layers[layer].nodes.length * 120;

      const diagramNode: DiagramNode = {
        id: node.id,
        name: node.name,
        x: nodeX,
        y: layerY,
        type: node.type,
        status: node.status,
        vertical: node.vertical,
        role: node.role,
        metadata: node.metadata,
        connections: node.connections,
      };

      layers[layer].nodes.push(diagramNode);
      return diagramNode;
    });
  };

  const generateDiagramEdges = (edges: WorkflowEdge[]): DiagramEdge[] => {
    return edges.map((edge) => ({
      id: `${edge.from}-${edge.to}`,
      from: edge.from,
      to: edge.to,
      type: edge.type,
      weight: edge.weight,
      animated: edge.type === "value_flow" || edge.weight > 0.8,
      color: getEdgeColor(edge.type),
    }));
  };

  const getEdgeColor = (type: string): string => {
    switch (type) {
      case "value_flow":
        return "#10B981"; // Green
      case "data_flow":
        return "#3B82F6"; // Blue
      case "control_flow":
        return "#8B5CF6"; // Purple
      case "conditional_logic":
        return "#F59E0B"; // Orange
      default:
        return "#6B7280"; // Gray
    }
  };

  const getNodeColor = (node: DiagramNode): string => {
    // Color based on vertical
    const verticalColors = {
      real_estate: "#2E7D32",
      healthcare: "#1976D2",
      forex: "#F57C00",
      commodities: "#795548",
      equities: "#9C27B0",
      bonds: "#607D8B",
      crypto: "#FF9800",
      private_equity: "#424242",
      venture_capital: "#E91E63",
      infrastructure: "#00695C",
      renewable_energy: "#4CAF50",
      art_collectibles: "#9E9E9E",
      intellectual_property: "#3F51B5",
    };

    return verticalColors[node.vertical] || "#6B7280";
  };

  const getNodeIcon = (type: string): React.ReactNode => {
    switch (type) {
      case "service":
        return <Circle className="h-4 w-4" />;
      case "component":
        return <Square className="h-4 w-4" />;
      case "agent":
        return <Brain className="h-4 w-4" />;
      case "protocol":
        return <Shield className="h-4 w-4" />;
      case "gateway":
        return <Network className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "#10B981";
      case "degraded":
        return "#F59E0B";
      case "offline":
        return "#EF4444";
      case "initializing":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const handleNodeClick = (nodeId: string) => {
    const node = serviceNodes.find((n) => n.id === nodeId);
    setSelectedNode(node || null);
  };

  const handleJourneySelect = (journey: UserJourney) => {
    setSelectedJourney(journey);
    // Highlight journey path
    const journeyNodes = journey.steps.map((step) => step.serviceNode);
    // Could implement path highlighting here
  };

  const exportDiagram = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "quantum-architecture-diagram.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Network className="h-8 w-8 text-blue-500 mr-3" />
              Quantum Architecture Visualization
            </h1>
            <p className="text-gray-600 mt-1">
              Interactive system diagram with service mapping and user journey
              visualization
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button onClick={exportDiagram} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export SVG
            </Button>
            <Button onClick={resetView} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset View
            </Button>
          </div>
        </div>

        {/* View Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">View Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewMode.executive}
                  onChange={(e) =>
                    setViewMode((prev) => ({
                      ...prev,
                      executive: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Executive View</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewMode.developer}
                  onChange={(e) =>
                    setViewMode((prev) => ({
                      ...prev,
                      developer: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Developer View</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewMode.swimlanes}
                  onChange={(e) =>
                    setViewMode((prev) => ({
                      ...prev,
                      swimlanes: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Swimlanes</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewMode.journeys}
                  onChange={(e) =>
                    setViewMode((prev) => ({
                      ...prev,
                      journeys: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm">User Journeys</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={viewMode.realtime}
                  onChange={(e) =>
                    setViewMode((prev) => ({
                      ...prev,
                      realtime: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Real-time Updates</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Diagram */}
          <div className="lg:col-span-3">
            <Card className="h-[800px]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    System Architecture Diagram
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setZoomLevel((prev) => Math.min(prev + 0.2, 3))
                      }
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
                      }
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Badge variant="outline">
                      {Math.round(zoomLevel * 100)}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <div className="relative w-full h-full overflow-auto border rounded-lg bg-white">
                  <svg
                    ref={svgRef}
                    width="1200"
                    height="800"
                    viewBox="0 0 1200 800"
                    className="w-full h-full"
                    style={{
                      transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                    }}
                  >
                    {/* Background Grid */}
                    <defs>
                      <pattern
                        id="grid"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 20 0 L 0 0 0 20"
                          fill="none"
                          stroke="#f0f0f0"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Swimlanes */}
                    {viewMode.swimlanes && (
                      <>
                        <rect
                          x="50"
                          y="50"
                          width="200"
                          height="700"
                          fill="#f8fafc"
                          stroke="#e2e8f0"
                          strokeWidth="1"
                          opacity="0.7"
                        />
                        <text
                          x="150"
                          y="40"
                          textAnchor="middle"
                          className="text-sm font-medium fill-gray-700"
                        >
                          Retail User
                        </text>

                        <rect
                          x="250"
                          y="50"
                          width="200"
                          height="700"
                          fill="#fef7ff"
                          stroke="#e879f9"
                          strokeWidth="1"
                          opacity="0.7"
                        />
                        <text
                          x="350"
                          y="40"
                          textAnchor="middle"
                          className="text-sm font-medium fill-gray-700"
                        >
                          Enterprise Client
                        </text>

                        <rect
                          x="450"
                          y="50"
                          width="200"
                          height="700"
                          fill="#f0fdf4"
                          stroke="#22c55e"
                          strokeWidth="1"
                          opacity="0.7"
                        />
                        <text
                          x="550"
                          y="40"
                          textAnchor="middle"
                          className="text-sm font-medium fill-gray-700"
                        >
                          AI Agent
                        </text>

                        <rect
                          x="650"
                          y="50"
                          width="200"
                          height="700"
                          fill="#fffbeb"
                          stroke="#f59e0b"
                          strokeWidth="1"
                          opacity="0.7"
                        />
                        <text
                          x="750"
                          y="40"
                          textAnchor="middle"
                          className="text-sm font-medium fill-gray-700"
                        >
                          Governance Layer
                        </text>
                      </>
                    )}

                    {/* Edges */}
                    {diagramEdges.map((edge) => {
                      const fromNode = diagramNodes.find(
                        (n) => n.id === edge.from,
                      );
                      const toNode = diagramNodes.find((n) => n.id === edge.to);

                      if (!fromNode || !toNode) return null;

                      return (
                        <g key={edge.id}>
                          <line
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke={edge.color}
                            strokeWidth={edge.weight * 3}
                            strokeDasharray={edge.animated ? "5,5" : "none"}
                            opacity="0.7"
                          >
                            {edge.animated && (
                              <animate
                                attributeName="stroke-dashoffset"
                                values="0;10"
                                dur="1s"
                                repeatCount="indefinite"
                              />
                            )}
                          </line>

                          {/* Arrow head */}
                          <polygon
                            points={`${toNode.x - 5},${toNode.y - 5} ${toNode.x + 5},${toNode.y} ${toNode.x - 5},${toNode.y + 5}`}
                            fill={edge.color}
                          />
                        </g>
                      );
                    })}

                    {/* Nodes */}
                    {diagramNodes.map((node) => (
                      <g
                        key={node.id}
                        onClick={() => handleNodeClick(node.id)}
                        className="cursor-pointer"
                      >
                        {/* Node Background */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="25"
                          fill={getNodeColor(node)}
                          stroke={getStatusColor(node.status)}
                          strokeWidth="3"
                          opacity="0.9"
                        />

                        {/* Node Icon */}
                        <circle cx={node.x} cy={node.y} r="12" fill="white" />

                        {/* Status Indicator */}
                        <circle
                          cx={node.x + 15}
                          cy={node.y - 15}
                          r="4"
                          fill={getStatusColor(node.status)}
                        />

                        {/* Node Label */}
                        <text
                          x={node.x}
                          y={node.y + 40}
                          textAnchor="middle"
                          className="text-xs font-medium fill-gray-700"
                        >
                          {node.name.length > 15
                            ? node.name.substring(0, 15) + "..."
                            : node.name}
                        </text>
                      </g>
                    ))}

                    {/* User Journey Paths */}
                    {viewMode.journeys && selectedJourney && (
                      <g>
                        {selectedJourney.steps.map((step, index) => {
                          const currentNode = diagramNodes.find(
                            (n) => n.id === step.serviceNode,
                          );
                          const nextStep = selectedJourney.steps[index + 1];
                          const nextNode = nextStep
                            ? diagramNodes.find(
                                (n) => n.id === nextStep.serviceNode,
                              )
                            : null;

                          if (!currentNode || !nextNode) return null;

                          return (
                            <line
                              key={`journey-${index}`}
                              x1={currentNode.x}
                              y1={currentNode.y}
                              x2={nextNode.x}
                              y2={nextNode.y}
                              stroke="#e11d48"
                              strokeWidth="4"
                              strokeDasharray="10,5"
                              opacity="0.8"
                            />
                          );
                        })}
                      </g>
                    )}
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Node Types</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Circle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Service</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Square className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Component</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">AI Agent</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Protocol</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Flow Types</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-green-500"></div>
                      <span className="text-sm">Value Flow</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-blue-500"></div>
                      <span className="text-sm">Data Flow</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-purple-500"></div>
                      <span className="text-sm">Control Flow</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-orange-500"></div>
                      <span className="text-sm">Conditional</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Degraded</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Offline</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Journeys */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Journeys</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userJourneys.slice(0, 3).map((journey) => (
                    <div
                      key={journey.id}
                      onClick={() => handleJourneySelect(journey)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedJourney?.id === journey.id
                          ? "bg-blue-50 border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{journey.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {journey.role.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {journey.steps.length} steps,{" "}
                        {Math.round(journey.metrics.conversion_rate * 100)}%
                        conversion
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          ~
                          {Math.round(journey.metrics.average_duration / 60000)}
                          min
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Node Details */}
            {selectedNode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Node Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">{selectedNode.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{selectedNode.type}</Badge>
                        <Badge
                          className={`${getStatusColor(selectedNode.status)} text-white`}
                        >
                          {selectedNode.status}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium">Description</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedNode.metadata.description}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium">Capabilities</h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedNode.metadata.capabilities
                          .slice(0, 3)
                          .map((capability, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {capability.replace("_", " ")}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium">Connections</h5>
                      <p className="text-sm text-gray-600">
                        {selectedNode.connections.length} connected services
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* System Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Services</span>
                    <span className="text-sm font-medium">
                      {serviceNodes.filter((n) => n.status === "active").length}
                      /{serviceNodes.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">User Journeys</span>
                    <span className="text-sm font-medium">
                      {userJourneys.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Success Rate</span>
                    <span className="text-sm font-medium">
                      {Math.round(
                        (userJourneys.reduce(
                          (sum, j) => sum + j.metrics.conversion_rate,
                          0,
                        ) /
                          userJourneys.length) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Updated</span>
                    <span className="text-sm font-medium">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Architecture Status */}
        <Alert>
          <Network className="h-4 w-4" />
          <AlertDescription>
            <strong>Architecture Status:</strong> All core services operational.
            Real-time monitoring active.{" "}
            {serviceNodes.filter((n) => n.status === "active").length} services
            online.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default QuantumArchitectureVisualization;
