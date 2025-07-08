
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAnalyticsEngines } from '@/hooks/useAdvancedSupabaseData';
import { BarChart3, Brain, Zap, Settings, TrendingUp } from 'lucide-react';

const automationLevelConfig = {
  manual: { color: 'bg-gray-500', label: 'Manual' },
  semi_automated: { color: 'bg-yellow-500', label: 'Semi-Automated' },
  fully_automated: { color: 'bg-green-500', label: 'Fully Automated' },
  ai_driven: { color: 'bg-purple-500', label: 'AI-Driven' }
} as const;

const AdvancedAnalytics: React.FC = () => {
  const { data: engines, isLoading, error } = useAnalyticsEngines();

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <p className="text-red-400">Error loading analytics engines</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Advanced Analytics Engines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {engines?.map((engine) => {
            const automationConfig = automationLevelConfig[engine.automation_level as keyof typeof automationLevelConfig];
            
            return (
              <div
                key={engine.id}
                className="p-4 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">{engine.engine_name}</h3>
                      <Badge className={`${automationConfig.color} text-xs mt-1`}>
                        {automationConfig.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {engine.real_time_capabilities && (
                      <Badge className="bg-green-600 text-xs">Real-time</Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Data Sources:</span>
                    <span className="text-white">
                      {Object.keys(engine.data_sources || {}).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Algorithms:</span>
                    <span className="text-white">
                      {Object.keys(engine.processing_algorithms || {}).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Models:</span>
                    <span className="text-white">
                      {Object.keys(engine.predictive_models || {}).length}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-600 flex-1">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-600">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        {(!engines || engines.length === 0) && (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No analytics engines configured</p>
            <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
              <Zap className="mr-2 h-4 w-4" />
              Create Engine
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalytics;
