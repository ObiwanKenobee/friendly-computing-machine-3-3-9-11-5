
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Database, 
  Server, 
  Shield, 
  Zap, 
  Globe,
  Brain,
  Cpu,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

const PlatformStatus: React.FC = () => {
  const { flags, isEnabled } = useFeatureFlags();
  const { getMetrics } = usePerformanceMonitoring();
  
  const metrics = getMetrics();
  
  const systemComponents = [
    { name: 'Authentication Service', status: 'operational', icon: Shield },
    { name: 'Database Cluster', status: 'operational', icon: Database },
    { name: 'API Gateway', status: 'operational', icon: Server },
    { name: 'Analytics Engine', status: 'operational', icon: Activity },
    { name: 'AI/ML Pipeline', status: 'operational', icon: Brain },
    { name: 'Blockchain Network', status: 'operational', icon: Cpu },
    { name: 'Real-time Services', status: 'operational', icon: Zap },
    { name: 'Global CDN', status: 'operational', icon: Globe },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'outage': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'outage': return XCircle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Platform Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemComponents.map((component) => {
              const StatusIcon = getStatusIcon(component.status);
              const IconComponent = component.icon;
              
              return (
                <div 
                  key={component.name}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                >
                  <IconComponent className="h-5 w-5 text-blue-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {component.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`h-3 w-3 ${getStatusColor(component.status)}`} />
                      <span className={`text-xs capitalize ${getStatusColor(component.status)}`}>
                        {component.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Page Load Time</p>
                <p className="text-lg font-semibold text-white">
                  {Math.round(metrics.loadTime)}ms
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg API Response</p>
                <p className="text-lg font-semibold text-white">
                  {metrics.apiResponseTimes.length > 0 
                    ? Math.round(metrics.apiResponseTimes.reduce((a, b) => a + b, 0) / metrics.apiResponseTimes.length)
                    : 0}ms
                </p>
              </div>
              {metrics.memoryUsage && (
                <div>
                  <p className="text-sm text-gray-400">Memory Usage</p>
                  <p className="text-lg font-semibold text-white">
                    {Math.round(metrics.memoryUsage / 1024 / 1024)}MB
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Feature Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(flags).map(([feature, enabled]) => (
                <div key={feature} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 capitalize">
                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <Badge 
                    variant={enabled ? "default" : "secondary"}
                    className={enabled ? "bg-green-600" : "bg-gray-600"}
                  >
                    {enabled ? 'Available' : 'Disabled'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Run Health Check
            </Button>
            <Button variant="outline" size="sm">
              View Logs
            </Button>
            <Button variant="outline" size="sm">
              Performance Report
            </Button>
            <Button variant="outline" size="sm">
              System Diagnostics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformStatus;
