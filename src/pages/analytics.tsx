
import React from 'react';
import Navigation from '@/components/Navigation';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      <div className="pt-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
