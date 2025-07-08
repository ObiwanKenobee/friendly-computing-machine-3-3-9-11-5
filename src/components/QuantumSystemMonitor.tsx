import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Activity,
  Zap,
  Globe,
  Brain,
  Satellite,
  Cpu,
  Database,
  Gauge,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import type { QuantumSystem } from "../types/QuantumEnterprise";

interface QuantumSystemMonitorProps {
  systems: QuantumSystem[];
  onSystemSelect?: (system: QuantumSystem) => void;
}

const QuantumSystemMonitor: React.FC<QuantumSystemMonitorProps> = ({
  systems,
  onSystemSelect,
}) => {
  const getSystemIcon = (type: QuantumSystem["type"]) => {
    switch (type) {
      case "quantum_computer":
        return Cpu;
      case "ai_cluster":
        return Brain;
      case "neural_network":
        return Activity;
      case "blockchain_node":
        return Database;
      case "space_station":
        return Satellite;
      case "metaverse_instance":
        return Globe;
      default:
        return Zap;
    }
  };

  const getStatusColor = (status: QuantumSystem["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "scaling":
        return "bg-blue-500";
      case "maintenance":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
      case "hibernating":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadgeVariant = (status: QuantumSystem["status"]) => {
    switch (status) {
      case "online":
        return "default" as const;
      case "scaling":
        return "secondary" as const;
      case "maintenance":
        return "outline" as const;
      case "offline":
        return "destructive" as const;
      case "hibernating":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "earth":
        return "🌍";
      case "mars":
        return "🔴";
      case "luna":
        return "🌙";
      case "space_station":
        return "🛰️";
      case "virtual":
        return "🌐";
      default:
        return "📍";
    }
  };

  const formatPowerMetric = (value: number) => {
    if (value >= 1e18) {
      return `${(value / 1e18).toFixed(1)} EF`;
    } else if (value >= 1e15) {
      return `${(value / 1e15).toFixed(1)} PF`;
    } else if (value >= 1e12) {
      return `${(value / 1e12).toFixed(1)} TF`;
    }
    return `${value.toFixed(0)} F`;
  };

  const formatStorage = (value: number) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)} ZB`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)} EB`;
    }
    return `${value.toFixed(0)} PB`;
  };

  const totalSystems = systems.length;
  const onlineSystems = systems.filter((s) => s.status === "online").length;
  const avgEfficiency =
    systems.reduce((sum, s) => sum + s.performance.efficiency, 0) /
    totalSystems;
  const totalEnergy = systems.reduce((sum, s) => sum + s.resources.energy, 0);
  const totalCarbon = systems.reduce(
    (sum, s) => sum + s.resources.carbonFootprint,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Systems
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {onlineSystems}/{totalSystems}
            </div>
            <p className="text-xs text-muted-foreground">
              {((onlineSystems / totalSystems) * 100).toFixed(1)}% operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Efficiency
            </CardTitle>
            <Gauge className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgEfficiency.toFixed(1)}%
            </div>
            <Progress value={avgEfficiency} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Energy Consumption
            </CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEnergy.toFixed(1)} TWh
            </div>
            <p className="text-xs text-muted-foreground">Total power usage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Impact</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalCarbon < 0 ? "-" : "+"}
              {Math.abs(totalCarbon).toFixed(0)}t
            </div>
            <p className="text-xs text-muted-foreground">
              {totalCarbon < 0 ? "Carbon negative" : "Carbon positive"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-muted-foreground">
              Overall health score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map((system) => {
          const Icon = getSystemIcon(system.type);

          return (
            <Card
              key={system.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSystemSelect?.(system)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(system.status)} animate-pulse`}
                    />
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <Badge variant={getStatusBadgeVariant(system.status)}>
                    {system.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{system.name}</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{getLocationIcon(system.location.type)}</span>
                  <span>
                    {system.location.coordinates || system.location.dimension}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Performance Metrics */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Efficiency</span>
                    <span className="text-sm font-medium">
                      {system.performance.efficiency.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={system.performance.efficiency}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium">
                      {system.performance.uptime.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={system.performance.uptime} className="h-2" />
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {system.performance.qubits && (
                    <div>
                      <div className="text-muted-foreground">Qubits</div>
                      <div className="font-medium">
                        {system.performance.qubits.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {system.performance.flops && (
                    <div>
                      <div className="text-muted-foreground">Performance</div>
                      <div className="font-medium">
                        {formatPowerMetric(system.performance.flops)}
                      </div>
                    </div>
                  )}
                  {system.resources.processingPower && (
                    <div>
                      <div className="text-muted-foreground">Processing</div>
                      <div className="font-medium">
                        {formatPowerMetric(system.resources.processingPower)}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-muted-foreground">Storage</div>
                    <div className="font-medium">
                      {formatStorage(system.resources.storage)}
                    </div>
                  </div>
                </div>

                {/* Energy & Sustainability */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs">
                      {system.resources.energy.toFixed(1)} TWh
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {system.resources.carbonFootprint <= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                    <span className="text-xs">
                      {system.resources.carbonFootprint < 0 ? "-" : "+"}
                      {Math.abs(system.resources.carbonFootprint).toFixed(0)}t
                      CO₂
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuantumSystemMonitor;
