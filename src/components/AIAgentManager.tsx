import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import {
  Brain,
  Bot,
  Users,
  Zap,
  Shield,
  Activity,
  Target,
  Network,
  Settings,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { AIAgent } from "../types/QuantumEnterprise";

interface AIAgentManagerProps {
  agents: AIAgent[];
  onAgentAction?: (
    agentId: string,
    action: "start" | "pause" | "restart" | "configure",
  ) => void;
}

const AIAgentManager: React.FC<AIAgentManagerProps> = ({
  agents,
  onAgentAction,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const getAgentIcon = (type: AIAgent["type"]) => {
    switch (type) {
      case "AGI":
        return Brain;
      case "ASI":
        return Zap;
      case "specialized":
        return Target;
      case "collaborative":
        return Users;
      case "autonomous":
        return Bot;
      default:
        return Activity;
    }
  };

  const getAgentTypeColor = (type: AIAgent["type"]) => {
    switch (type) {
      case "AGI":
        return "from-purple-500 to-pink-500";
      case "ASI":
        return "from-red-500 to-orange-500";
      case "specialized":
        return "from-blue-500 to-cyan-500";
      case "collaborative":
        return "from-green-500 to-emerald-500";
      case "autonomous":
        return "from-yellow-500 to-amber-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getAutonomyLevel = (level: number) => {
    if (level >= 9) return { label: "Fully Autonomous", color: "text-red-500" };
    if (level >= 7) return { label: "High Autonomy", color: "text-orange-500" };
    if (level >= 5)
      return { label: "Moderate Autonomy", color: "text-yellow-500" };
    if (level >= 3) return { label: "Supervised", color: "text-blue-500" };
    return { label: "Manual Control", color: "text-green-500" };
  };

  const getTrustScore = (score: number) => {
    if (score >= 95) return { label: "Exceptional", color: "text-green-500" };
    if (score >= 85) return { label: "High Trust", color: "text-blue-500" };
    if (score >= 70)
      return { label: "Moderate Trust", color: "text-yellow-500" };
    if (score >= 50)
      return { label: "Developing Trust", color: "text-orange-500" };
    return { label: "Low Trust", color: "text-red-500" };
  };

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.currentTasks.length > 0).length;
  const avgTrustScore =
    agents.reduce((sum, a) => sum + a.trustScore, 0) / totalAgents;
  const avgAutonomy =
    agents.reduce((sum, a) => sum + a.autonomyLevel, 0) / totalAgents;
  const avgEthics =
    agents.reduce((sum, a) => sum + a.ethicsCompliance, 0) / totalAgents;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Bot className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgents}</div>
            <p className="text-xs text-muted-foreground">
              {activeAgents} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Trust Score
            </CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTrustScore.toFixed(1)}</div>
            <Progress value={avgTrustScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Autonomy</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgAutonomy.toFixed(1)}/10
            </div>
            <Progress value={avgAutonomy * 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ethics Compliance
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEthics.toFixed(1)}%</div>
            <Progress value={avgEthics} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Activity className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agents.reduce((sum, a) => sum + a.currentTasks.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total running tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const Icon = getAgentIcon(agent.type);
          const autonomy = getAutonomyLevel(agent.autonomyLevel);
          const trust = getTrustScore(agent.trustScore);
          const isSelected = selectedAgent === agent.id;

          return (
            <Card
              key={agent.id}
              className={`cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "ring-2 ring-blue-500 shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${getAgentTypeColor(agent.type)}`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">
                        {agent.type.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {formatLastUpdate(agent.lastUpdate)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-muted-foreground">Autonomy</div>
                    <div className={`font-medium ${autonomy.color}`}>
                      {agent.autonomyLevel}/10
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Trust</div>
                    <div className={`font-medium ${trust.color}`}>
                      {agent.trustScore}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Ethics</div>
                    <div className="font-medium text-green-500">
                      {agent.ethicsCompliance}%
                    </div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Learning Rate</span>
                      <span>{agent.learningRate.toFixed(1)}</span>
                    </div>
                    <Progress
                      value={Math.min(100, agent.learningRate / 10)}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Trust Score</span>
                      <span>{agent.trustScore}%</span>
                    </div>
                    <Progress value={agent.trustScore} className="h-2" />
                  </div>
                </div>

                {/* Current Tasks */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      Active Tasks ({agent.currentTasks.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {agent.currentTasks.slice(0, 2).map((task, index) => (
                      <div key={index} className="text-xs bg-muted rounded p-2">
                        {task}
                      </div>
                    ))}
                    {agent.currentTasks.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{agent.currentTasks.length - 2} more tasks
                      </div>
                    )}
                  </div>
                </div>

                {/* Partnerships */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Network className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Partnerships</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {agent.partnerships.slice(0, 3).map((partner, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {partner}
                      </Badge>
                    ))}
                    {agent.partnerships.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{agent.partnerships.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      {/* Capabilities */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Capabilities
                        </h4>
                        <div className="grid grid-cols-2 gap-1">
                          {agent.capabilities.map((capability, index) => (
                            <div
                              key={index}
                              className="text-xs bg-muted rounded px-2 py-1"
                            >
                              {capability}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Control Actions */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Controls</h4>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAgentAction?.(agent.id, "start");
                            }}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAgentAction?.(agent.id, "pause");
                            }}
                          >
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAgentAction?.(agent.id, "restart");
                            }}
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Restart
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAgentAction?.(agent.id, "configure");
                            }}
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Config
                          </Button>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Performance
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <div className="text-muted-foreground">
                              Autonomy Level
                            </div>
                            <div className={`font-medium ${autonomy.color}`}>
                              {autonomy.label}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Trust Rating
                            </div>
                            <div className={`font-medium ${trust.color}`}>
                              {trust.label}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Learning Rate
                            </div>
                            <div className="font-medium">
                              {agent.learningRate.toFixed(1)}x
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Ethics Score
                            </div>
                            <div className="font-medium text-green-500">
                              {agent.ethicsCompliance}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Indicators */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center space-x-2">
                          {agent.ethicsCompliance >= 95 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : agent.ethicsCompliance >= 80 ? (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-xs">Ethics Compliant</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last update: {formatLastUpdate(agent.lastUpdate)}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Quick Actions */}
                {!isSelected && (
                  <div className="flex space-x-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAgentAction?.(agent.id, "start");
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAgentAction?.(agent.id, "configure");
                      }}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Config
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AIAgentManager;
