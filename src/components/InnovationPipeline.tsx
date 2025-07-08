
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInnovationPipeline } from '@/hooks/useAdvancedSupabaseData';
import { Lightbulb, Search, Wrench, TestTube, TrendingUp, Rocket, Zap } from 'lucide-react';

const stageConfig = {
  ideation: { icon: Lightbulb, color: 'bg-yellow-500', label: 'Ideation' },
  research: { icon: Search, color: 'bg-blue-500', label: 'Research' },
  prototype: { icon: Wrench, color: 'bg-orange-500', label: 'Prototype' },
  testing: { icon: TestTube, color: 'bg-green-500', label: 'Testing' },
  scaling: { icon: TrendingUp, color: 'bg-purple-500', label: 'Scaling' },
  deployment: { icon: Rocket, color: 'bg-red-500', label: 'Deployment' },
  optimization: { icon: Zap, color: 'bg-indigo-500', label: 'Optimization' }
} as const;

const InnovationPipeline: React.FC = () => {
  const { data: innovations, isLoading, error } = useInnovationPipeline();

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
          <p className="text-red-400">Error loading innovation pipeline</p>
        </CardContent>
      </Card>
    );
  }

  const groupedInnovations = innovations?.reduce((acc, innovation) => {
    const stage = innovation.stage || 'ideation';
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(innovation);
    return acc;
  }, {} as Record<string, typeof innovations>) || {};

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Lightbulb className="mr-2 h-5 w-5" />
          Innovation Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {Object.entries(stageConfig).map(([stage, config]) => {
            const Icon = config.icon;
            const stageInnovations = groupedInnovations[stage] || [];
            
            return (
              <div key={stage} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{config.label}</h3>
                    <p className="text-gray-400 text-xs">{stageInnovations.length} items</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {stageInnovations.map((innovation) => (
                    <div
                      key={innovation.id}
                      className="p-3 bg-slate-700 rounded-lg border border-slate-600"
                    >
                      <h4 className="text-white text-sm font-medium mb-1">
                        {innovation.innovation_title}
                      </h4>
                      <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                        {innovation.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          <Badge className="bg-green-600 text-xs">
                            Tech: {innovation.technical_feasibility || 0}%
                          </Badge>
                          <Badge className="bg-blue-600 text-xs">
                            Biz: {innovation.business_viability || 0}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
          >
            Add New Innovation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InnovationPipeline;
