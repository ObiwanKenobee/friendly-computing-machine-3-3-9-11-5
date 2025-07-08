import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Lock,
  Eye,
  Database,
  Network,
  Server,
  Users,
  Bell,
  Download,
  RefreshCw,
  Settings,
  AlertCircle,
  Info,
  Zap,
  Globe,
  Key,
  Fingerprint,
  Camera,
  Smartphone,
  Wifi,
  Bug,
  Search,
  Activity,
  Clock,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface SecurityMetric {
  name: string;
  value: number;
  status: "good" | "warning" | "critical";
  threshold: number;
  description: string;
}

interface VulnerabilityData {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  cve?: string;
  affectedComponents: string[];
  firstDetected: string;
  lastSeen: string;
  status: "open" | "in-progress" | "resolved" | "accepted-risk";
  exploitabilityScore: number;
  impactScore: number;
  remediation: string;
  estimatedFixTime: string;
}

interface ComplianceFramework {
  name: string;
  version: string;
  status: "compliant" | "partial" | "non-compliant";
  score: number;
  requirements: {
    id: string;
    title: string;
    status: "passed" | "failed" | "needs-review";
    lastAudit: string;
    evidence: string[];
  }[];
}

interface SecurityIncident {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type:
    | "data-breach"
    | "unauthorized-access"
    | "malware"
    | "ddos"
    | "social-engineering"
    | "insider-threat";
  title: string;
  description: string;
  timestamp: string;
  status: "open" | "investigating" | "contained" | "resolved";
  assignedTo: string;
  affectedSystems: string[];
  impactAssessment: {
    confidentiality: "none" | "low" | "medium" | "high";
    integrity: "none" | "low" | "medium" | "high";
    availability: "none" | "low" | "medium" | "high";
  };
  timeToDetection: number; // minutes
  timeToContainment?: number; // minutes
  estimatedDataAffected?: number;
}

const SecurityAuditDashboard: React.FC = () => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityData[]>(
    [],
  );
  const [complianceFrameworks, setComplianceFrameworks] = useState<
    ComplianceFramework[]
  >([]);
  const [securityIncidents, setSecurityIncidents] = useState<
    SecurityIncident[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");

  // Initialize data
  useEffect(() => {
    const initializeSecurityData = () => {
      // Security metrics
      setSecurityMetrics([
        {
          name: "Overall Security Score",
          value: 87,
          status: "good",
          threshold: 85,
          description: "Comprehensive security posture assessment",
        },
        {
          name: "Vulnerability Score",
          value: 92,
          status: "good",
          threshold: 90,
          description: "Current vulnerability management effectiveness",
        },
        {
          name: "Compliance Score",
          value: 94,
          status: "good",
          threshold: 95,
          description: "Overall compliance with security frameworks",
        },
        {
          name: "Incident Response Time",
          value: 15,
          status: "good",
          threshold: 30,
          description:
            "Average time to detect and respond to incidents (minutes)",
        },
        {
          name: "Access Control Score",
          value: 89,
          status: "good",
          threshold: 85,
          description: "Effectiveness of access controls and authentication",
        },
        {
          name: "Data Protection Score",
          value: 96,
          status: "good",
          threshold: 90,
          description: "Encryption and data protection measures",
        },
      ]);

      // Sample vulnerabilities
      setVulnerabilities([
        {
          id: "CVE-2024-0001",
          severity: "high",
          title: "SQL Injection in User Authentication",
          description:
            "Potential SQL injection vulnerability in legacy authentication module",
          cve: "CVE-2024-0001",
          affectedComponents: ["Authentication Service", "User Management API"],
          firstDetected: "2024-01-15T10:30:00Z",
          lastSeen: "2024-01-15T10:30:00Z",
          status: "in-progress",
          exploitabilityScore: 7.5,
          impactScore: 8.2,
          remediation: "Update authentication module to version 2.1.3",
          estimatedFixTime: "4 hours",
        },
        {
          id: "CVE-2024-0002",
          severity: "medium",
          title: "Cross-Site Scripting (XSS) in Dashboard",
          description:
            "Reflected XSS vulnerability in dashboard search functionality",
          cve: "CVE-2024-0002",
          affectedComponents: ["Dashboard UI", "Search Service"],
          firstDetected: "2024-01-14T08:15:00Z",
          lastSeen: "2024-01-14T08:15:00Z",
          status: "open",
          exploitabilityScore: 6.1,
          impactScore: 5.8,
          remediation: "Implement input sanitization and output encoding",
          estimatedFixTime: "2 hours",
        },
        {
          id: "SEC-2024-003",
          severity: "low",
          title: "Outdated SSL/TLS Configuration",
          description: "SSL/TLS configuration allows deprecated cipher suites",
          affectedComponents: ["Load Balancer", "API Gateway"],
          firstDetected: "2024-01-13T14:20:00Z",
          lastSeen: "2024-01-13T14:20:00Z",
          status: "resolved",
          exploitabilityScore: 3.2,
          impactScore: 4.1,
          remediation: "Update SSL/TLS configuration to disable weak ciphers",
          estimatedFixTime: "1 hour",
        },
      ]);

      // Compliance frameworks
      setComplianceFrameworks([
        {
          name: "SOC 2 Type II",
          version: "2017",
          status: "compliant",
          score: 94,
          requirements: [
            {
              id: "CC6.1",
              title: "Logical and Physical Access Controls",
              status: "passed",
              lastAudit: "2024-01-10",
              evidence: [
                "Access control matrix",
                "Audit logs",
                "Policy documentation",
              ],
            },
            {
              id: "CC6.2",
              title: "System Access Control",
              status: "passed",
              lastAudit: "2024-01-10",
              evidence: ["MFA implementation", "Session management logs"],
            },
            {
              id: "CC6.3",
              title: "Data Access Controls",
              status: "needs-review",
              lastAudit: "2024-01-10",
              evidence: ["Database access logs", "Encryption certificates"],
            },
          ],
        },
        {
          name: "GDPR",
          version: "2018",
          status: "compliant",
          score: 96,
          requirements: [
            {
              id: "ART-32",
              title: "Security of Processing",
              status: "passed",
              lastAudit: "2024-01-08",
              evidence: ["Encryption implementation", "Security assessments"],
            },
            {
              id: "ART-33",
              title: "Data Breach Notification",
              status: "passed",
              lastAudit: "2024-01-08",
              evidence: [
                "Incident response procedures",
                "Notification templates",
              ],
            },
          ],
        },
        {
          name: "ISO 27001",
          version: "2022",
          status: "partial",
          score: 78,
          requirements: [
            {
              id: "A.9.1",
              title: "Access Control Policy",
              status: "passed",
              lastAudit: "2024-01-05",
              evidence: ["Policy documents", "Implementation guides"],
            },
            {
              id: "A.12.1",
              title: "Operational Procedures",
              status: "failed",
              lastAudit: "2024-01-05",
              evidence: ["Incomplete documentation"],
            },
          ],
        },
      ]);

      // Security incidents
      setSecurityIncidents([
        {
          id: "INC-2024-001",
          severity: "medium",
          type: "unauthorized-access",
          title: "Suspicious Login Activity Detected",
          description:
            "Multiple failed login attempts from unusual geographic locations",
          timestamp: "2024-01-15T09:45:00Z",
          status: "investigating",
          assignedTo: "Security Team",
          affectedSystems: ["Authentication Service", "User Database"],
          impactAssessment: {
            confidentiality: "low",
            integrity: "none",
            availability: "none",
          },
          timeToDetection: 5,
          estimatedDataAffected: 0,
        },
        {
          id: "INC-2024-002",
          severity: "low",
          type: "malware",
          title: "Malware Scan Alert",
          description: "Suspicious file detected in upload directory",
          timestamp: "2024-01-14T16:20:00Z",
          status: "resolved",
          assignedTo: "DevOps Team",
          affectedSystems: ["File Upload Service"],
          impactAssessment: {
            confidentiality: "none",
            integrity: "low",
            availability: "none",
          },
          timeToDetection: 2,
          timeToContainment: 15,
          estimatedDataAffected: 0,
        },
      ]);
    };

    initializeSecurityData();

    // Auto-refresh data
    if (autoRefresh) {
      const interval = setInterval(initializeSecurityData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const overallSecurityScore = useMemo(() => {
    if (securityMetrics.length === 0) return 0;
    return Math.round(
      securityMetrics.reduce((sum, metric) => sum + metric.value, 0) /
        securityMetrics.length,
    );
  }, [securityMetrics]);

  const vulnerabilityStats = useMemo(() => {
    const stats = vulnerabilities.reduce(
      (acc, vuln) => {
        acc[vuln.severity]++;
        return acc;
      },
      { critical: 0, high: 0, medium: 0, low: 0 },
    );
    return stats;
  }, [vulnerabilities]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
      case "compliant":
      case "passed":
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
      case "partial":
      case "needs-review":
      case "investigating":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "critical":
      case "non-compliant":
      case "failed":
      case "open":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-800 bg-red-100 border-red-300";
      case "high":
        return "text-orange-800 bg-orange-100 border-orange-300";
      case "medium":
        return "text-yellow-800 bg-yellow-100 border-yellow-300";
      case "low":
        return "text-blue-800 bg-blue-100 border-blue-300";
      default:
        return "text-gray-800 bg-gray-100 border-gray-300";
    }
  };

  const radarData = securityMetrics.map((metric) => ({
    subject: metric.name.replace(" Score", ""),
    value: metric.value,
    fullMark: 100,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              Security Audit Dashboard
            </h1>
            <p className="text-gray-600">
              Comprehensive security monitoring and compliance management
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Badge className={getStatusColor("good")}>
              <CheckCircle className="h-3 w-3 mr-1" />
              Security Score: {overallSecurityScore}/100
            </Badge>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`}
                />
                {autoRefresh ? "Auto" : "Manual"}
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>

              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Vulnerabilities
              </CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {vulnerabilities.filter((v) => v.status !== "resolved").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {vulnerabilityStats.critical} critical,{" "}
                {vulnerabilityStats.high} high
              </p>
              <div className="flex items-center mt-2 gap-1">
                {vulnerabilityStats.critical > 0 && (
                  <Badge className={getSeverityColor("critical")}>
                    {vulnerabilityStats.critical} Critical
                  </Badge>
                )}
                {vulnerabilityStats.high > 0 && (
                  <Badge className={getSeverityColor("high")}>
                    {vulnerabilityStats.high} High
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Security Incidents
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {
                  securityIncidents.filter((i) => i.status !== "resolved")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Active incidents requiring attention
              </p>
              <div className="flex items-center mt-2">
                <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">
                  -2 from yesterday
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Compliance Status
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  complianceFrameworks.reduce((sum, f) => sum + f.score, 0) /
                    complianceFrameworks.length,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Average compliance score across frameworks
              </p>
              <Progress
                value={Math.round(
                  complianceFrameworks.reduce((sum, f) => sum + f.score, 0) /
                    complianceFrameworks.length,
                )}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Response Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {securityMetrics.find((m) => m.name.includes("Response Time"))
                  ?.value || 0}
                m
              </div>
              <p className="text-xs text-muted-foreground">
                Average incident response time
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-xs text-green-600">15% improvement</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Score Radar */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Posture Assessment</CardTitle>
                  <CardDescription>
                    Multi-dimensional security metrics analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Security Score"
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Vulnerability Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Vulnerability Trend</CardTitle>
                  <CardDescription>
                    Security vulnerability detection and resolution over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={[
                        { month: "Jan", detected: 12, resolved: 8, open: 4 },
                        { month: "Feb", detected: 8, resolved: 10, open: 2 },
                        { month: "Mar", detected: 15, resolved: 12, open: 5 },
                        { month: "Apr", detected: 6, resolved: 8, open: 3 },
                        { month: "May", detected: 9, resolved: 7, open: 5 },
                        { month: "Jun", detected: 4, resolved: 6, open: 3 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="detected"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                      />
                      <Area
                        type="monotone"
                        dataKey="resolved"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                      />
                      <Area
                        type="monotone"
                        dataKey="open"
                        stackId="1"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Security Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                    <Progress value={metric.value} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Vulnerabilities Tab */}
          <TabsContent value="vulnerabilities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Vulnerability Management
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Scan Now
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Vulnerability Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(vulnerabilityStats).map(([severity, count]) => (
                <Card key={severity}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {severity}
                        </div>
                      </div>
                      <Badge className={getSeverityColor(severity)}>
                        {severity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Vulnerability List */}
            <Card>
              <CardHeader>
                <CardTitle>Active Vulnerabilities</CardTitle>
                <CardDescription>
                  Detailed vulnerability assessment and remediation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vulnerabilities.map((vulnerability) => (
                    <div
                      key={vulnerability.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">
                              {vulnerability.title}
                            </h4>
                            <Badge
                              className={getSeverityColor(
                                vulnerability.severity,
                              )}
                            >
                              {vulnerability.severity}
                            </Badge>
                            <Badge
                              className={getStatusColor(vulnerability.status)}
                            >
                              {vulnerability.status}
                            </Badge>
                            {vulnerability.cve && (
                              <Badge variant="outline">
                                {vulnerability.cve}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {vulnerability.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              Detected:{" "}
                              {new Date(
                                vulnerability.firstDetected,
                              ).toLocaleDateString()}
                            </span>
                            <span>
                              Components:{" "}
                              {vulnerability.affectedComponents.join(", ")}
                            </span>
                            <span>
                              Fix Time: {vulnerability.estimatedFixTime}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Risk Score</div>
                          <div className="text-lg font-bold text-red-600">
                            {(vulnerability.exploitabilityScore +
                              vulnerability.impactScore) /
                              2}
                          </div>
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <div className="text-sm">
                          <strong>Remediation:</strong>{" "}
                          {vulnerability.remediation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Compliance Management</h2>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>

            {/* Compliance Frameworks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {complianceFrameworks.map((framework, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {framework.name}
                      </CardTitle>
                      <Badge className={getStatusColor(framework.status)}>
                        {framework.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Version {framework.version}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Compliance Score
                        </span>
                        <span className="text-sm font-bold">
                          {framework.score}%
                        </span>
                      </div>
                      <Progress value={framework.score} />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Requirements Status
                      </h4>
                      {framework.requirements.map((req, reqIndex) => (
                        <div
                          key={reqIndex}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="truncate">
                            {req.id} - {req.title}
                          </span>
                          <Badge
                            className={getStatusColor(req.status)}
                            size="sm"
                          >
                            {req.status === "passed" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : req.status === "failed" ? (
                              <AlertCircle className="h-3 w-3" />
                            ) : (
                              <Info className="h-3 w-3" />
                            )}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Incidents Tab */}
          <TabsContent value="incidents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Security Incident Management
              </h2>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Create Incident
              </Button>
            </div>

            {/* Incident List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Incidents</CardTitle>
                <CardDescription>
                  Security incidents and response tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityIncidents.map((incident) => (
                    <div key={incident.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{incident.title}</h4>
                            <Badge
                              className={getSeverityColor(incident.severity)}
                            >
                              {incident.severity}
                            </Badge>
                            <Badge className={getStatusColor(incident.status)}>
                              {incident.status}
                            </Badge>
                            <Badge variant="outline">{incident.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {incident.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              Detected:{" "}
                              {new Date(incident.timestamp).toLocaleString()}
                            </span>
                            <span>Assigned: {incident.assignedTo}</span>
                            <span>
                              Detection Time: {incident.timeToDetection}m
                            </span>
                            {incident.timeToContainment && (
                              <span>
                                Containment Time: {incident.timeToContainment}m
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t">
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">
                            Confidentiality
                          </div>
                          <Badge
                            className={getStatusColor(
                              incident.impactAssessment.confidentiality ===
                                "none"
                                ? "good"
                                : "warning",
                            )}
                          >
                            {incident.impactAssessment.confidentiality}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">
                            Integrity
                          </div>
                          <Badge
                            className={getStatusColor(
                              incident.impactAssessment.integrity === "none"
                                ? "good"
                                : "warning",
                            )}
                          >
                            {incident.impactAssessment.integrity}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">
                            Availability
                          </div>
                          <Badge
                            className={getStatusColor(
                              incident.impactAssessment.availability === "none"
                                ? "good"
                                : "warning",
                            )}
                          >
                            {incident.impactAssessment.availability}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Network Security
                  </CardTitle>
                  <Network className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    Secure
                  </div>
                  <div className="text-xs text-muted-foreground">
                    All firewalls active
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Access Control
                  </CardTitle>
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-xs text-muted-foreground">
                    MFA compliance
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Data Encryption
                  </CardTitle>
                  <Key className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-xs text-muted-foreground">
                    Data encrypted
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Threat Detection
                  </CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">2</div>
                  <div className="text-xs text-muted-foreground">
                    Active monitors
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Security Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle>Real-time Security Monitoring</CardTitle>
                <CardDescription>
                  Live security event stream and threat detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      time: "10:45:23",
                      event: "Successful MFA authentication",
                      level: "info",
                      user: "john.doe@company.com",
                    },
                    {
                      time: "10:44:56",
                      event: "Failed login attempt blocked",
                      level: "warning",
                      user: "unknown",
                    },
                    {
                      time: "10:43:12",
                      event: "SSL certificate validation",
                      level: "info",
                      user: "system",
                    },
                    {
                      time: "10:42:38",
                      event: "Firewall rule update applied",
                      level: "info",
                      user: "admin",
                    },
                    {
                      time: "10:41:45",
                      event: "Suspicious API request detected",
                      level: "warning",
                      user: "192.168.1.100",
                    },
                  ].map((log, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            log.level === "info"
                              ? "bg-blue-500"
                              : log.level === "warning"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm font-mono text-muted-foreground">
                          {log.time}
                        </span>
                        <span className="text-sm">{log.event}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {log.user}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Security Assessment Report
                  </CardTitle>
                  <CardDescription>
                    Comprehensive security posture analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Compliance Audit Report
                  </CardTitle>
                  <CardDescription>
                    Regulatory compliance status and gaps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Incident Response Report
                  </CardTitle>
                  <CardDescription>
                    Security incident analysis and metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SecurityAuditDashboard;
