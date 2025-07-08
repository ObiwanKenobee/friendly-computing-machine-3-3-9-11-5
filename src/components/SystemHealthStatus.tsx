import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Activity,
  Database,
  Globe,
  Zap,
  Shield,
  Brain,
} from "lucide-react";
import { enterpriseServiceWrapper } from "@/services/enterpriseServiceWrapper";

interface SystemHealthStatusProps {
  className?: string;
}

export const SystemHealthStatus: React.FC<SystemHealthStatusProps> = ({
  className,
}) => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkSystemHealth = async () => {
    setLoading(true);
    try {
      const health = await enterpriseServiceWrapper.performHealthCheck();
      setHealthStatus(health);
      setLastCheck(new Date());
    } catch (error) {
      console.error("Failed to check system health:", error);
      setHealthStatus({
        status: "critical",
        services: {},
        errors: ["Health check failed"],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "critical":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "degraded":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceIcon = (service: string) => {
    if (service.includes("munger")) return <Brain className="w-4 h-4" />;
    if (service.includes("buffett")) return <Shield className="w-4 h-4" />;
    if (service.includes("dalio")) return <Activity className="w-4 h-4" />;
    if (service.includes("lynch")) return <Globe className="w-4 h-4" />;
    if (service.includes("adaptive")) return <Zap className="w-4 h-4" />;
    if (service.includes("legendary")) return <Database className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getServiceName = (service: string) => {
    const names: Record<string, string> = {
      legendaryInvestorIntegrationService: "Legendary Integration",
      mungerMentalModelsService: "Munger Models",
      buffettMoatService: "Buffett Moats",
      dalioSystemsService: "Dalio Systems",
      lynchLocalInsightService: "Lynch Insights",
      adaptiveYieldOptimizationService: "Yield Optimization",
    };
    return names[service] || service;
  };

  if (!healthStatus) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Checking system health...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(healthStatus.status)}
            System Health Status
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(healthStatus.status)}>
              {healthStatus.status.toUpperCase()}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={checkSystemHealth}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
        {lastCheck && (
          <p className="text-sm text-muted-foreground">
            Last checked: {lastCheck.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <span className="font-medium">Overall System Status</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(healthStatus.status)}
            <span
              className={`text-sm font-medium ${
                healthStatus.status === "healthy"
                  ? "text-green-600"
                  : healthStatus.status === "degraded"
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {healthStatus.status === "healthy"
                ? "All Systems Operational"
                : healthStatus.status === "degraded"
                  ? "Some Issues Detected"
                  : "Critical Issues Present"}
            </span>
          </div>
        </div>

        {/* Service Status */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Enterprise Services</h4>
          <div className="grid gap-2">
            {Object.entries(healthStatus.services).map(
              ([service, isHealthy]) => (
                <div
                  key={service}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    {getServiceIcon(service)}
                    <span className="text-sm">{getServiceName(service)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isHealthy ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <Badge
                      variant={isHealthy ? "outline" : "destructive"}
                      className="text-xs"
                    >
                      {isHealthy ? "Healthy" : "Error"}
                    </Badge>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Error Details */}
        {healthStatus.errors && healthStatus.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-red-600">Recent Errors</h4>
            <div className="space-y-1">
              {healthStatus.errors.map((error: string, index: number) => (
                <div
                  key={index}
                  className="text-xs text-red-600 p-2 bg-red-50 rounded"
                >
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>System Health</span>
            <span>
              {Math.round(
                (Object.values(healthStatus.services).filter(Boolean).length /
                  Object.values(healthStatus.services).length) *
                  100,
              )}
              %
            </span>
          </div>
          <Progress
            value={
              (Object.values(healthStatus.services).filter(Boolean).length /
                Object.values(healthStatus.services).length) *
              100
            }
            className="h-2"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/test-enterprise")}
            className="flex-1"
          >
            Test Enterprise
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="flex-1"
          >
            Reload App
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthStatus;
