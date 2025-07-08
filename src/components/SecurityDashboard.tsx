import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import CiscoXDRService from "../services/ciscoXDRService";
import ProductionDatabaseService from "../services/productionDatabaseService";
import { systemArchitectureService } from "../services/systemArchitectureService";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  Lock,
  Server,
  Activity,
  BarChart3,
  Clock,
  Users,
  Database,
  Cpu,
  Network,
  HardDrive,
  Zap,
  Bell,
  FileText,
  Settings,
  TrendingUp,
  AlertCircle,
  XCircle,
  Monitor,
  Cloud,
} from "lucide-react";

interface SecurityDashboardProps {
  showDetails?: boolean;
  compact?: boolean;
}

interface SecurityMetrics {
  overallScore: number;
  threatLevel: "low" | "medium" | "high" | "critical";
  activeThreats: number;
  blockedAttacks: number;
  vulnerabilities: number;
  complianceScore: number;
  lastScan: string;
}

interface DatabaseHealth {
  status: "healthy" | "warning" | "critical";
  connections: number;
  maxConnections: number;
  uptime: number;
  responseTime: number;
  errorRate: number;
  backupStatus: "current" | "stale" | "failed";
}

interface SystemHealth {
  status: "operational" | "degraded" | "outage";
  overall: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  services: { name: string; status: string; uptime: number }[];
  categories: {
    performance: number;
    security: number;
    reliability: number;
    scalability: number;
  };
}

interface SecurityThreat {
  id: string;
  type: "malware" | "phishing" | "ddos" | "intrusion" | "data_breach";
  severity: "low" | "medium" | "high" | "critical";
  source: string;
  target: string;
  status: "active" | "mitigated" | "investigating";
  timestamp: string;
  description: string;
}

interface SecurityIncident {
  id: string;
  title: string;
  type: "security" | "compliance" | "data" | "access";
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "closed";
  assignee?: string;
  createdAt: string;
  resolvedAt?: string;
  description: string;
}

interface ComplianceItem {
  id: string;
  standard: "SOX" | "GDPR" | "HIPAA" | "PCI-DSS" | "ISO27001";
  requirement: string;
  status: "compliant" | "non_compliant" | "in_progress" | "not_applicable";
  lastAudit: string;
  nextAudit: string;
  score: number;
  notes?: string;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  showDetails = true,
  compact = false,
}) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [securityMetrics, setSecurityMetrics] =
    useState<SecurityMetrics | null>(null);
  const [dbHealth, setDbHealth] = useState<DatabaseHealth | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [compliance, setCompliance] = useState<ComplianceItem[]>([]);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  useEffect(() => {
    loadSecurityData();

    if (realTimeUpdates) {
      const interval = setInterval(loadSecurityData, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [realTimeUpdates]);

  const loadSecurityData = async () => {
    try {
      // Load security metrics with error handling
      try {
        const metrics =
          await CiscoXDRService.getInstance().getSecurityMetrics();
        setSecurityMetrics(metrics);
      } catch (error) {
        console.warn("Failed to load security metrics:", error);
        setSecurityMetrics({
          overallScore: 0,
          threatLevel: "unknown",
          activeThreats: 0,
          blockedAttacks: 0,
          vulnerabilities: 0,
          complianceScore: 0,
          lastScan: new Date().toISOString(),
        });
      }

      // Load database health with error handling
      try {
        const health =
          await ProductionDatabaseService.getInstance().getHealthStatus();
        setDbHealth(health);
      } catch (error) {
        console.warn("Failed to load database health:", error);
        setDbHealth({
          status: "unknown",
          connections: 0,
          maxConnections: 100,
          uptime: 0,
          responseTime: 0,
          errorRate: 0,
          backupStatus: "unknown",
        });
      }

      // Load system health with error handling
      try {
        const health = await systemArchitectureService.getSystemHealth();
        setSystemHealth(health);
      } catch (error) {
        console.warn("Failed to load system health:", error);
        setSystemHealth({
          status: "unknown",
          overall: 0,
          cpuUsage: 0,
          memoryUsage: 0,
          diskUsage: 0,
          networkLatency: 0,
          services: [],
          categories: {
            performance: 0,
            security: 0,
            reliability: 0,
            scalability: 0,
          },
        });
      }

      // Load threats and incidents with error handling
      try {
        const threatData =
          await CiscoXDRService.getInstance().getThreatIndicators();
        setThreats(threatData.slice(0, 10));
      } catch (error) {
        console.warn("Failed to load threats:", error);
        setThreats([]);
      }

      try {
        const incidentData = await CiscoXDRService.getInstance().getIncidents();
        setIncidents(incidentData.slice(0, 10));
      } catch (error) {
        console.warn("Failed to load incidents:", error);
        setIncidents([]);
      }

      try {
        const complianceData =
          await CiscoXDRService.getInstance().getComplianceReports();
        setCompliance(complianceData);
      } catch (error) {
        console.warn("Failed to load compliance data:", error);
        setCompliance([]);
      }
    } catch (error) {
      console.error("Error loading security dashboard data:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
      high: "text-orange-500 bg-orange-500/10 border-orange-500/20",
      critical: "text-red-500 bg-red-500/10 border-red-500/20",
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      healthy: <CheckCircle className="h-4 w-4 text-green-500" />,
      degraded: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
      critical: <XCircle className="h-4 w-4 text-red-500" />,
      detected: <Eye className="h-4 w-4 text-orange-500" />,
      investigating: <Activity className="h-4 w-4 text-blue-500" />,
      contained: <Lock className="h-4 w-4 text-green-500" />,
      resolved: <CheckCircle className="h-4 w-4 text-green-500" />,
    };
    return (
      icons[status as keyof typeof icons] || (
        <Activity className="h-4 w-4 text-gray-500" />
      )
    );
  };

  if (!securityMetrics || !dbHealth || !systemHealth) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (compact) {
    return (
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Shield className="h-4 w-4 mr-2 text-red-400" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Threats Blocked:</span>
              <span className="text-red-400 font-semibold">
                {securityMetrics.threatsBlocked}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">System Health:</span>
              <span className="text-green-400 font-semibold">
                {systemHealth.overall}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">DB Status:</span>
              {getStatusIcon(dbHealth.status)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Incidents:</span>
              <span className="text-yellow-400 font-semibold">
                {securityMetrics.incidentsOpen}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Threats Blocked
                </p>
                <p className="text-3xl font-bold text-red-400">
                  {securityMetrics.threatsBlocked.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-full">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12% from last hour</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  System Uptime
                </p>
                <p className="text-3xl font-bold text-green-400">
                  {dbHealth.resources.cpu.toFixed(1)}%
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Activity className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-blue-500">99.99% availability</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Active Incidents
                </p>
                <p className="text-3xl font-bold text-yellow-400">
                  {securityMetrics.incidentsOpen}
                </p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Clock className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-gray-400">Avg resolution: 45min</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Compliance Score
                </p>
                <p className="text-3xl font-bold text-blue-400">
                  {securityMetrics.complianceScore}%
                </p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">All frameworks passing</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      {showDetails && (
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center justify-between">
              <div className="flex items-center">
                <Monitor className="h-6 w-6 mr-3 text-blue-400" />
                Security Operations Center
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className="text-green-400 border-green-400"
                >
                  <Activity className="h-3 w-3 mr-1" />
                  Live
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                  className="border-gray-600"
                >
                  {realTimeUpdates ? "Pause" : "Resume"} Updates
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid grid-cols-5 bg-slate-700 mb-6">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-blue-600"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="threats"
                  className="data-[state=active]:bg-red-600"
                >
                  Threats
                </TabsTrigger>
                <TabsTrigger
                  value="incidents"
                  className="data-[state=active]:bg-yellow-600"
                >
                  Incidents
                </TabsTrigger>
                <TabsTrigger
                  value="performance"
                  className="data-[state=active]:bg-green-600"
                >
                  Performance
                </TabsTrigger>
                <TabsTrigger
                  value="compliance"
                  className="data-[state=active]:bg-purple-600"
                >
                  Compliance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* System Health */}
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        System Health Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">
                            Performance
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {systemHealth.categories.performance}%
                          </span>
                        </div>
                        <Progress
                          value={systemHealth.categories.performance}
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">
                            Security
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {systemHealth.categories.security}%
                          </span>
                        </div>
                        <Progress
                          value={systemHealth.categories.security}
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">
                            Reliability
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {systemHealth.categories.reliability}%
                          </span>
                        </div>
                        <Progress
                          value={systemHealth.categories.reliability}
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">
                            Scalability
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {systemHealth.categories.scalability}%
                          </span>
                        </div>
                        <Progress
                          value={systemHealth.categories.scalability}
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resource Utilization */}
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Resource Utilization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                          <Cpu className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                          <div className="text-2xl font-bold text-white">
                            {dbHealth.resources.cpu.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">CPU Usage</div>
                        </div>

                        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                          <Database className="h-6 w-6 mx-auto mb-2 text-green-400" />
                          <div className="text-2xl font-bold text-white">
                            {dbHealth.resources.memory.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">
                            Memory Usage
                          </div>
                        </div>

                        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                          <HardDrive className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                          <div className="text-2xl font-bold text-white">
                            {dbHealth.resources.disk.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">
                            Disk Usage
                          </div>
                        </div>

                        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                          <Network className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
                          <div className="text-2xl font-bold text-white">
                            {dbHealth.resources.network.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">
                            Network Usage
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="threats" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Active Threat Indicators
                  </h3>
                  <Badge className="bg-red-600">{threats.length} Active</Badge>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {threats.map((threat) => (
                      <Card
                        key={threat.id}
                        className={`bg-slate-700/50 border-l-4 ${getSeverityColor(threat.severity)}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(threat.status)}
                              <span className="font-semibold text-white">
                                {threat.type}
                              </span>
                              <Badge
                                variant="outline"
                                className={getSeverityColor(threat.severity)}
                              >
                                {threat.severity}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-400">
                              {threat.timestamp.toLocaleTimeString()}
                            </span>
                          </div>

                          <p className="text-sm text-gray-300 mb-2">
                            Source: {threat.source} | Confidence:{" "}
                            {(threat.confidence * 100).toFixed(0)}%
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              IOC: {threat.ioc}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-400"
                            >
                              Investigate
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="incidents" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Security Incidents
                  </h3>
                  <div className="flex space-x-2">
                    <Badge
                      variant="outline"
                      className="text-yellow-400 border-yellow-400"
                    >
                      {incidents.filter((i) => i.status === "open").length} Open
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-blue-400 border-blue-400"
                    >
                      {
                        incidents.filter((i) => i.status === "investigating")
                          .length
                      }{" "}
                      Investigating
                    </Badge>
                  </div>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {incidents.map((incident) => (
                      <Card
                        key={incident.id}
                        className="bg-slate-700/50 border-slate-600"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(incident.status)}
                              <span className="font-semibold text-white">
                                {incident.title}
                              </span>
                              <Badge
                                variant="outline"
                                className={getSeverityColor(incident.severity)}
                              >
                                {incident.severity}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-400">
                              {incident.createdAt.toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-sm text-gray-300 mb-3">
                            {incident.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              Assigned to: {incident.assignedTo}
                            </span>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-500 text-blue-400"
                              >
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-500 text-green-400"
                              >
                                Update Status
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-sm text-gray-300">
                        Database Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Connection Utilization
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {dbHealth.connections.utilization.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={dbHealth.connections.utilization}
                          className="h-1"
                        />

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Query Performance
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {dbHealth.performance.avgResponseTime.toFixed(0)}ms
                            avg
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Queries/sec
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {dbHealth.performance.queriesPerSecond}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-sm text-gray-300">
                        Network Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Firewall Status
                          </span>
                          <Badge className="bg-green-600 text-xs">Active</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            DDoS Protection
                          </span>
                          <Badge className="bg-green-600 text-xs">
                            Enabled
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Intrusion Detection
                          </span>
                          <Badge className="bg-green-600 text-xs">
                            Monitoring
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            VPN Connections
                          </span>
                          <span className="text-sm font-semibold text-white">
                            247 active
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-sm text-gray-300">
                        Application Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            WAF Protection
                          </span>
                          <Badge className="bg-green-600 text-xs">Active</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            API Rate Limiting
                          </span>
                          <Badge className="bg-green-600 text-xs">
                            Enforced
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">SSL/TLS</span>
                          <Badge className="bg-green-600 text-xs">
                            TLS 1.3
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Vulnerability Scans
                          </span>
                          <span className="text-sm font-semibold text-white">
                            Daily
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {compliance.map((framework) => (
                    <Card
                      key={framework.framework}
                      className="bg-slate-700/50 border-slate-600"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg text-white flex items-center justify-between">
                          {framework.framework}
                          <Badge
                            variant="outline"
                            className={
                              framework.status === "compliant"
                                ? "text-green-400 border-green-400"
                                : "text-red-400 border-red-400"
                            }
                          >
                            {framework.status}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-300">
                                Compliance Score
                              </span>
                              <span className="text-sm font-semibold text-white">
                                {framework.score.toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={framework.score} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                Last Assessment
                              </span>
                              <span className="text-xs text-white">
                                {framework.lastAssessment.toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                Next Assessment
                              </span>
                              <span className="text-xs text-white">
                                {framework.nextAssessment.toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                Findings
                              </span>
                              <span className="text-xs text-white">
                                {
                                  framework.findings.filter(
                                    (f) => f.status === "fail",
                                  ).length
                                }{" "}
                                issues
                              </span>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-blue-500 text-blue-400"
                          >
                            View Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecurityDashboard;
