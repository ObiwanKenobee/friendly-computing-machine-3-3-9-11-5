
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useKnowledgeNodes } from '@/hooks/useAdvancedSupabaseData';
import { Network, BookOpen, Cpu, Workflow, Lightbulb, Zap } from 'lucide-react';

const entityTypeConfig = {
  concept: { icon: BookOpen, color: 'bg-blue-500', label: 'Concept' },
  technology: { icon: Cpu, color: 'bg-green-500', label: 'Technology' },
  process: { icon: Workflow, color: 'bg-orange-500', label: 'Process' },
  insight: { icon: Lightbulb, color: 'bg-yellow-500', label: 'Insight' },
  innovation: { icon: Zap, color: 'bg-purple-500', label: 'Innovation' }
} as const;

const KnowledgeGraph: React.FC = () => {
  const { data: nodes, isLoading, error } = useKnowledgeNodes();

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
          <p className="text-red-400">Error loading knowledge graph</p>
        </CardContent>
      </Card>
    );
  }

  const groupedNodes = nodes?.reduce((acc, node) => {
    const type = node.entity_type || 'concept';
    if (!acc[type]) acc[type] = [];
    acc[type].push(node);
    return acc;
  }, {} as Record<string, typeof nodes>) || {};

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Network className="mr-2 h-5 w-5" />
          Knowledge Graph
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(entityTypeConfig).map(([type, config]) => {
            const Icon = config.icon;
            const typeNodes = groupedNodes[type] || [];
            
            return (
              <div key={type} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{config.label}</h3>
                    <p className="text-gray-400 text-xs">{typeNodes.length} nodes</p>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {typeNodes.slice(0, 5).map((node) => (
                    <div
                      key={node.id}
                      className="p-3 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors cursor-pointer"
                    >
                      <h4 className="text-white text-sm font-medium mb-1">
                        {node.title}
                      </h4>
                      <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                        {node.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-slate-600 text-xs">
                          {node.category}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {Math.round((node.confidence_score || 0) * 100)}% confidence
                        </span>
                      </div>
                    </div>
                  ))}
                  {typeNodes.length > 5 && (
                    <div className="text-center text-gray-400 text-xs">
                      +{typeNodes.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeGraph;
