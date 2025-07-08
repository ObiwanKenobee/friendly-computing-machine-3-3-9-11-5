/**
 * Quantum Infrastructure Manager - Phase 0 & 1 Implementation
 * Quantum-safe infrastructure with cloud failure prevention
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Cloud,
  Cpu,
  Database,
  Globe,
  Lock,
  Monitor,
  RefreshCw,
  Server,
  Shield,
  Thermometer,
  Zap,
  AlertCircle,
  TrendingUp,
  Eye,
  Layers,
} from "lucide-react";

interface QuantumNode {
  id: string;
  type: "IBM_Q" | "IonQ" | "Rigetti" | "Photonic" | "Simulator";
  region: string;
  status: "online" | "offline" | "maintenance" | "degraded";
  qubits: number;
  fidelity: number;
  temperature: number;
  coherenceTime: number;
}

interface SystemHealth {
  overallStatus: "healthy" | "warning" | "critical";
  quantumNodes: number;
  activeCryostats: number;
  systemUptime: string;
  errorRate: number;
  throughput: number;
}

interface SecurityMetrics {
  postQuantumEncryption: boolean;
  zkProofVerification: boolean;
  quantumKeyDistribution: boolean;
  identityVerification: number;
  threatLevel: "low" | "medium" | "high";
}

const QuantumInfrastructureManager: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overallStatus: "healthy",
    quantumNodes: 12,
    activeCryostats: 8,
    systemUptime: "99.97%",
    errorRate: 0.02,
    throughput: 1247,
  });

  const [quantumNodes] = useState<QuantumNode[]>([
    {
      id: "qv-ibm-na-01",
      type: "IBM_Q",
      region: "North America",
      status: "online",
      qubits: 127,
      fidelity: 99.2,
      temperature: 0.015,
      coherenceTime: 150,
    },
    {
      id: "qv-ionq-eu-01",
      type: "IonQ",
      region: "Europe",
      status: "online",
      qubits: 64,
      fidelity: 99.8,
      temperature: 0.001,
      coherenceTime: 10000,
    },
    {
      id: "qv-photonic-as-01",
      type: "Photonic",
      region: "Asia Pacific",
      status: "online",
      qubits: 256,
      fidelity: 98.9,
      temperature: 293,
      coherenceTime: 1000000,
    },
    {
      id: "qv-sim-global-01",
      type: "Simulator",
      region: "Global",
      status: "online",
      qubits: 1024,
      fidelity: 100,
      temperature: 298,
      coherenceTime: 999999,
    },
  ]);

  const [securityMetrics] = useState<SecurityMetrics>({
    postQuantumEncryption: true,
    zkProofVerification: true,
    quantumKeyDistribution: true,
    identityVerification: 99.8,
    threatLevel: "low",
  });

  const [cloudRegions] = useState([
    { name: "US-East-1", status: "healthy", load: 78, quantum_nodes: 3 },
    { name: "EU-West-1", status: "healthy", load: 82, quantum_nodes: 2 },
    { name: "Asia-Pacific-1", status: "warning", load: 94, quantum_nodes: 4 },
    {
      name: "Multi-Cloud-Failover",
      status: "standby",
      load: 15,
      quantum_nodes: 3,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "healthy":
        return "text-green-600 bg-green-50";
      case "warning":
      case "degraded":
        return "text-yellow-600 bg-yellow-50";
      case "offline":
      case "critical":
        return "text-red-600 bg-red-50";
      case "maintenance":
      case "standby":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case "IBM_Q":
        return <Cpu className="h-4 w-4" />;
      case "IonQ":
        return <Zap className="h-4 w-4" />;
      case "Photonic":
        return <Eye className="h-4 w-4" />;
      case "Simulator":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  const runDiagnostics = () => {
    console.log("Running quantum infrastructure diagnostics...");
    // Simulate diagnostics
    setTimeout(() => {
      setSystemHealth((prev) => ({
        ...prev,
        throughput: Math.floor(Math.random() * 500) + 1000,
        errorRate: Math.random() * 0.05,
      }));
    }, 2000);
  };

  const initiateFailover = () => {
    console.log("Initiating quantum-safe cloud failover...");
    // Simulate failover procedure
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quantum Infrastructure Manager
            </h1>
            <p className="text-gray-600">
              Production-grade quantum computing infrastructure with cloud
              resilience
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(systemHealth.overallStatus)}>
              System Status: {systemHealth.overallStatus.toUpperCase()}
            </Badge>
            <Button size="sm" onClick={runDiagnostics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Diagnostics
            </Button>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Server className="h-4 w-4 mr-2" />
                Quantum Nodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {systemHealth.quantumNodes}
              </div>
              <div className="text-sm text-green-600">All operational</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Thermometer className="h-4 w-4 mr-2" />
                Cryostats Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {systemHealth.activeCryostats}
              </div>
              <div className="text-sm text-blue-600">Optimal temperature</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                System Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {systemHealth.systemUptime}
              </div>
              <div className="text-sm text-gray-500">Last 30 days</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Throughput
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {systemHealth.throughput}
              </div>
              <div className="text-sm text-gray-500">Circuits/hour</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="nodes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="nodes">Quantum Nodes</TabsTrigger>
            <TabsTrigger value="security">Security Layer</TabsTrigger>
            <TabsTrigger value="cloud">Cloud Regions</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="failover">Failover Systems</TabsTrigger>
          </TabsList>

          <TabsContent value="nodes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {quantumNodes.map((node) => (
                <Card
                  key={node.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          {getNodeTypeIcon(node.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{node.id}</CardTitle>
                          <p className="text-sm text-gray-600">
                            {node.type} • {node.region}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(node.status)}>
                        {node.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Qubits</div>
                          <div className="text-lg font-semibold">
                            {node.qubits}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Fidelity</div>
                          <div className="text-lg font-semibold text-green-600">
                            {node.fidelity}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            Temperature (K)
                          </div>
                          <div className="text-lg font-semibold text-blue-600">
                            {node.temperature}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            Coherence (μs)
                          </div>
                          <div className="text-lg font-semibold text-purple-600">
                            {node.coherenceTime}
                          </div>
                        </div>
                      </div>
                      <div className="pt-2">
                        <Progress value={node.fidelity} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">
                          Performance: {node.fidelity}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>Post-Quantum Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Post-Quantum Encryption</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Active</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ZK-Proof Verification</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Active</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Quantum Key Distribution</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Active</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Identity Verification Rate
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {securityMetrics.identityVerification}%
                        </span>
                      </div>
                      <Progress
                        value={securityMetrics.identityVerification}
                        className="h-2 mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <span>Threat Monitoring</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {securityMetrics.threatLevel.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Current Threat Level
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Intrusion Attempts</span>
                        <Badge className="bg-green-50 text-green-700">
                          0 detected
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Quantum Attacks</span>
                        <Badge className="bg-green-50 text-green-700">
                          0 detected
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Protocol Violations</span>
                        <Badge className="bg-green-50 text-green-700">
                          0 detected
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cloud">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cloudRegions.map((region, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center space-x-2">
                        <Cloud className="h-5 w-5" />
                        <span>{region.name}</span>
                      </CardTitle>
                      <Badge className={getStatusColor(region.status)}>
                        {region.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Load</span>
                        <span className="font-semibold">{region.load}%</span>
                      </div>
                      <Progress value={region.load} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Quantum Nodes</span>
                        <span className="font-semibold">
                          {region.quantum_nodes}
                        </span>
                      </div>
                      <div className="pt-2">
                        <Button size="sm" variant="outline" className="w-full">
                          <Monitor className="h-4 w-4 mr-2" />
                          Monitor Region
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span>Real-time System Monitoring</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Circuit Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Success Rate</span>
                        <span className="font-semibold text-green-600">
                          98.9%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average Execution Time</span>
                        <span className="font-semibold">2.3ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Queue Length</span>
                        <span className="font-semibold">47 circuits</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Resource Utilization</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">CPU Usage</span>
                        <span className="font-semibold">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Memory Usage</span>
                        <span className="font-semibold">74%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Network I/O</span>
                        <span className="font-semibold">1.2GB/s</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Error Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Gate Error Rate</span>
                        <span className="font-semibold text-green-600">
                          0.02%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Readout Error</span>
                        <span className="font-semibold text-green-600">
                          0.05%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Decoherence Rate</span>
                        <span className="font-semibold text-yellow-600">
                          0.08%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="failover">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5 text-orange-600" />
                    <span>Failover Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-900">
                          Primary Systems Online
                        </span>
                      </div>
                      <p className="text-green-800 text-sm">
                        All primary quantum nodes operational. Failover systems
                        on standby.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Backup Nodes</span>
                        <Badge className="bg-blue-50 text-blue-700">
                          3 ready
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Recovery Time</span>
                        <span className="font-semibold text-green-600">
                          &lt; 30s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Data Replication</span>
                        <Badge className="bg-green-50 text-green-700">
                          100% synced
                        </Badge>
                      </div>
                    </div>

                    <Button
                      onClick={initiateFailover}
                      className="w-full"
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Initiate Planned Failover Test
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Layers className="h-5 w-5 text-purple-600" />
                    <span>Redundancy Layers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">
                            Hardware Layer
                          </span>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">
                            Network Layer
                          </span>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">
                            Application Layer
                          </span>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium">
                            Quantum Layer
                          </span>
                        </div>
                        <Badge variant="outline">Standby</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Critical Alerts */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span>System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-orange-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  Asia-Pacific-1 region experiencing high load (94%). Consider
                  load balancing.
                </span>
              </div>
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">
                  Quantum error correction operating within normal parameters.
                </span>
              </div>
              <div className="flex items-center space-x-2 text-blue-700">
                <Database className="h-4 w-4" />
                <span className="text-sm">
                  Daily quantum state backup completed successfully.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuantumInfrastructureManager;
