
import React, { useState } from 'react';
import { BarChart3, Code, Users, TrendingUp, Settings, Brain, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DashboardSelector = () => {
  const [selectedRole, setSelectedRole] = useState('executive');

  const roles = [
    {
      id: 'executive',
      name: 'Executive',
      icon: BarChart3,
      description: 'Strategic oversight and business intelligence',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'developer',
      name: 'Developer',
      icon: Code,
      description: 'Development tools and AI coding assistance',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'analyst',
      name: 'Data Analyst',
      icon: Brain,
      description: 'Advanced analytics and ML workflows',
      color: 'from-cyan-600 to-blue-600'
    },
    {
      id: 'investor',
      name: 'Investor',
      icon: TrendingUp,
      description: 'Portfolio management and investment insights',
      color: 'from-green-600 to-emerald-600'
    },
    {
      id: 'operations',
      name: 'Operations',
      icon: Settings,
      description: 'System monitoring and infrastructure management',
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Cybersecurity and risk management',
      color: 'from-red-600 to-pink-600'
    }
  ];

  const dashboardFeatures = {
    executive: [
      'Real-time KPI monitoring',
      'Strategic planning tools',
      'Revenue analytics',
      'Team performance metrics',
      'Market intelligence',
      'Risk assessment'
    ],
    developer: [
      'AI code completion',
      'Integrated IDE',
      'CI/CD pipelines',
      'API management',
      'Performance monitoring',
      'Code quality analysis'
    ],
    analyst: [
      'Data visualization',
      'ML model training',
      'Statistical analysis',
      'Predictive modeling',
      'Data pipelines',
      'Business intelligence'
    ],
    investor: [
      'Portfolio tracking',
      'Risk analysis',
      'Market trends',
      'Asset allocation',
      'ROI calculations',
      'Investment recommendations'
    ],
    operations: [
      'System monitoring',
      'Infrastructure metrics',
      'Automated scaling',
      'Resource optimization',
      'Incident management',
      'Performance tuning'
    ],
    security: [
      'Threat detection',
      'Vulnerability scanning',
      'Compliance monitoring',
      'Access management',
      'Security analytics',
      'Incident response'
    ]
  };

  return (
    <div className="space-y-8">
      {/* Role Selection Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          
          return (
            <Card 
              key={role.id}
              className={`cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'bg-white/20 border-white/40 scale-105' 
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              } backdrop-blur-lg`}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 p-4 rounded-full bg-gradient-to-r ${role.color} w-16 h-16 flex items-center justify-center`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">{role.name}</CardTitle>
                <CardDescription className="text-slate-300">
                  {role.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Selected Dashboard Preview */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-2xl flex items-center">
            <Zap className="h-6 w-6 mr-2 text-yellow-400" />
            {roles.find(r => r.id === selectedRole)?.name} Dashboard
          </CardTitle>
          <CardDescription className="text-slate-300">
            Specialized workspace with role-specific tools and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {dashboardFeatures[selectedRole as keyof typeof dashboardFeatures]?.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                <span className="text-white text-sm">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex-1">
              Launch {roles.find(r => r.id === selectedRole)?.name} Workspace
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Preview Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSelector;
