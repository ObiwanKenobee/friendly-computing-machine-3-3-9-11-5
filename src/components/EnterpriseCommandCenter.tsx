import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Radar,
  Shield,
  Zap,
  Brain,
  Globe,
  Users,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Network,
  Cpu,
  HardDrive,
  Wifi,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  Terminal,
  Code,
  Layers,
  Workflow,
  GitBranch,
  Share2,
  Download,
  Upload,
  Maximize,
  Minimize,
  X,
  Plus,
  Minus,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  max: number;
}

interface Alert {
  id: string;
  level: "info" | "warning" | "error";
  message: string;
  timestamp: Date;
  system: string;
}

const EnterpriseCommandCenter: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState("overview");
  const [commandOpen, setCommandOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      id: "cpu",
      name: "CPU Usage",
      value: 23.4,
      unit: "%",
      status: "healthy",
      trend: "stable",
      max: 100,
    },
    {
      id: "memory",
      name: "Memory",
      value: 67.8,
      unit: "%",
      status: "healthy",
      trend: "up",
      max: 100,
    },
    {
      id: "network",
      name: "Network I/O",
      value: 1247.3,
      unit: "MB/s",
      status: "healthy",
      trend: "up",
      max: 10000,
    },
    {
      id: "storage",
      name: "Storage",
      value: 45.2,
      unit: "%",
      status: "healthy",
      trend: "stable",
      max: 100,
    },
    {
      id: "database",
      name: "DB Connections",
      value: 847,
      unit: "",
      status: "warning",
      trend: "up",
      max: 1000,
    },
    {
      id: "api",
      name: "API Calls/sec",
      value: 23847,
      unit: "",
      status: "healthy",
      trend: "up",
      max: 50000,
    },
    {
      id: "users",
      name: "Active Users",
      value: 2847123,
      unit: "",
      status: "healthy",
      trend: "up",
      max: 5000000,
    },
    {
      id: "latency",
      name: "Avg Latency",
      value: 23,
      unit: "ms",
      status: "healthy",
      trend: "down",
      max: 1000,
    },
  ]);

  // Simulated real-time data updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setSystemMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Math.max(
            0,
            metric.value + (Math.random() - 0.5) * (metric.max * 0.1),
          ),
          status:
            metric.value > metric.max * 0.8
              ? "warning"
              : metric.value > metric.max * 0.95
                ? "critical"
                : "healthy",
          trend:
            Math.random() > 0.5
              ? "up"
              : Math.random() > 0.5
                ? "down"
                : "stable",
        })),
      );

      // Generate random alerts
      if (Math.random() > 0.9) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          level:
            Math.random() > 0.7
              ? "warning"
              : Math.random() > 0.5
                ? "error"
                : "info",
          message: `System event detected in ${["AI Engine", "Quantum Processor", "Network Layer", "Security Module"][Math.floor(Math.random() * 4)]}`,
          timestamp: new Date(),
          system: ["quantum", "ai", "network", "security"][
            Math.floor(Math.random() * 4)
          ],
        };
        setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const systems = [
    {
      id: "overview",
      name: "System Overview",
      icon: <Radar className="w-5 h-5" />,
    },
    {
      id: "quantum",
      name: "Quantum Computing",
      icon: <Zap className="w-5 h-5" />,
    },
    { id: "ai", name: "AI Engine", icon: <Brain className="w-5 h-5" /> },
    {
      id: "security",
      name: "Security Fortress",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: "network",
      name: "Global Network",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      id: "users",
      name: "User Management",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const commands = [
    "restart ai-engine",
    "scale quantum-processors +50%",
    "enable security-lockdown",
    "backup global-database",
    "deploy legendary-strategies",
    "optimize portfolio-algorithms",
    "refresh market-data",
    "generate compliance-report",
    "activate emergency-protocols",
    "export system-logs",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "warning":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "critical":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ChevronUp className="w-4 h-4 text-green-400" />;
      case "down":
        return <ChevronDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div
      className={`${isFullscreen ? "fixed inset-0 z-50" : ""} min-h-screen bg-black text-white overflow-hidden`}
    >
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-blue-600">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Enterprise Command Center</h1>
              <p className="text-gray-400 text-sm">
                Real-time system monitoring & control
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              All Systems Operational
            </Badge>

            <Popover open={commandOpen} onOpenChange={setCommandOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-700 bg-gray-800 hover:bg-gray-700"
                >
                  <Terminal className="w-4 h-4 mr-2" />
                  Command
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-gray-900 border-gray-700">
                <Command>
                  <CommandInput
                    placeholder="Type a command..."
                    className="border-0 bg-gray-900"
                  />
                  <CommandList>
                    <CommandEmpty>No commands found.</CommandEmpty>
                    <CommandGroup heading="Available Commands">
                      {commands.map((command) => (
                        <CommandItem
                          key={command}
                          onSelect={() => {
                            console.log(`Executing: ${command}`);
                            setCommandOpen(false);
                          }}
                          className="hover:bg-gray-800"
                        >
                          <Terminal className="mr-2 h-4 w-4" />
                          <span>{command}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="border-gray-700 bg-gray-800 hover:bg-gray-700"
            >
              {autoRefresh ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="border-gray-700 bg-gray-800 hover:bg-gray-700"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800 bg-gray-900/30">
          <div className="p-4">
            <div className="space-y-2">
              {systems.map((system) => (
                <Button
                  key={system.id}
                  variant={selectedSystem === system.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    selectedSystem === system.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                  onClick={() => setSelectedSystem(system.id)}
                >
                  {system.icon}
                  <span className="ml-2">{system.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-800" />

          {/* Alerts Panel */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              Recent Alerts
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-2 rounded text-xs ${
                    alert.level === "error"
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : alert.level === "warning"
                        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}
                >
                  <p>{alert.message}</p>
                  <p className="text-gray-400 mt-1">
                    {alert.timestamp.toLocaleTimeString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedSystem === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* System Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {systemMetrics.map((metric) => (
                    <Card
                      key={metric.id}
                      className="bg-gray-900/50 border-gray-800"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-gray-300">
                            {metric.name}
                          </CardTitle>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(metric.trend)}
                            <Badge className={getStatusColor(metric.status)}>
                              {metric.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold text-white">
                              {metric.value.toLocaleString(undefined, {
                                maximumFractionDigits: 1,
                              })}
                            </span>
                            <span className="text-sm text-gray-400">
                              {metric.unit}
                            </span>
                          </div>
                          <Progress
                            value={(metric.value / metric.max) * 100}
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>0</span>
                            <span>{metric.max.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* System Health Matrix */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      System Health Matrix
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-16 gap-1">
                      {Array.from({ length: 256 }).map((_, index) => {
                        const health = Math.random();
                        return (
                          <div
                            key={index}
                            className={`h-4 w-4 rounded-sm ${
                              health > 0.8
                                ? "bg-green-500"
                                : health > 0.6
                                  ? "bg-yellow-500"
                                  : health > 0.3
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                            }`}
                            title={`Node ${index + 1}: ${(health * 100).toFixed(1)}%`}
                          />
                        );
                      })}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                      <span>
                        Real-time health monitoring across 256 system nodes
                      </span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span>Healthy</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                          <span>Warning</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span>Critical</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Live Network Traffic */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Network className="w-5 h-5" />
                      Live Network Traffic
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 relative bg-black/20 rounded">
                      {/* Simulated network visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid grid-cols-8 gap-2">
                          {Array.from({ length: 32 }).map((_, index) => (
                            <motion.div
                              key={index}
                              className="w-2 bg-blue-500 rounded-t"
                              style={{ height: `${Math.random() * 100}%` }}
                              animate={{ height: `${Math.random() * 100}%` }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-400">Incoming</p>
                        <p className="text-white font-bold">2.4 GB/s</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Outgoing</p>
                        <p className="text-white font-bold">1.8 GB/s</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Packets/sec</p>
                        <p className="text-white font-bold">847K</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Connections</p>
                        <p className="text-white font-bold">23.4K</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Additional system views would go here */}
            {selectedSystem !== "overview" && (
              <motion.div
                key={selectedSystem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      {systems.find((s) => s.id === selectedSystem)?.icon}
                      {systems.find((s) => s.id === selectedSystem)?.name}{" "}
                      System
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <p className="text-gray-400 text-lg">
                        Detailed{" "}
                        {systems
                          .find((s) => s.id === selectedSystem)
                          ?.name.toLowerCase()}{" "}
                        monitoring interface coming soon...
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        This will show comprehensive metrics, controls, and
                        diagnostics for the{" "}
                        {systems
                          .find((s) => s.id === selectedSystem)
                          ?.name.toLowerCase()}{" "}
                        subsystem.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseCommandCenter;
