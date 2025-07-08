
import React from 'react';
import { useAuth } from './auth/AuthProvider';
import ArchetypeSelector from './ArchetypeSelector';
import InteractionInterface from './InteractionInterface';
import InnovationPipeline from './InnovationPipeline';
import KnowledgeGraph from './KnowledgeGraph';
import AdvancedAnalytics from './AdvancedAnalytics';

const AdvancedDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Access Restricted</h2>
        <p className="text-gray-400">Please sign in to access the advanced dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ArchetypeSelector />
        <InteractionInterface />
      </div>
      
      <InnovationPipeline />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <KnowledgeGraph />
        <AdvancedAnalytics />
      </div>
    </div>
  );
};

export default AdvancedDashboard;
