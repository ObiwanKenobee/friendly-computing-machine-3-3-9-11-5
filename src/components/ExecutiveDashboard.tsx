
import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Target, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ExecutiveDashboard = () => {
  const [timeframe, setTimeframe] = useState('month');

  const kpis = [
    { label: 'Revenue', value: '$12.5M', change: '+18.2%', icon: DollarSign, color: 'text-green-400' },
    { label: 'Active Users', value: '2.8M', change: '+24.1%', icon: Users, color: 'text-blue-400' },
    { label: 'Market Cap', value: '$450M', change: '+15.7%', icon: TrendingUp, color: 'text-purple-400' },
    { label: 'AI Efficiency', value: '94.2%', change: '+3.1%', icon: Target, color: 'text-cyan-400' }
  ];

  const businessUnits = [
    { name: 'AI/ML Division', performance: 92, revenue: '$4.2M', growth: '+28%' },
    { name: 'Blockchain Solutions', performance: 88, revenue: '$3.8M', growth: '+22%' },
    { name: 'Fintech Platform', performance: 95, revenue: '$2.9M', growth: '+31%' },
    { name: 'Data Analytics', performance: 90, revenue: '$1.6M', growth: '+19%' }
  ];

  const riskAlerts = [
    { type: 'Market', level: 'Medium', message: 'Crypto market volatility increasing' },
    { type: 'Operational', level: 'Low', message: 'Server capacity at 78%' },
    { type: 'Compliance', level: 'High', message: 'New financial regulations pending' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Executive Dashboard</h1>
          <p className="text-slate-400">Strategic overview and business intelligence</p>
        </div>
        <div className="flex space-x-2">
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(period)}
              className={timeframe === period ? 'bg-blue-600' : 'border-white/20 text-white hover:bg-white/10'}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{kpi.label}</p>
                    <p className="text-2xl font-bold text-white">{kpi.value}</p>
                    <p className={`text-sm ${kpi.color}`}>{kpi.change}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-white/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-white">Overview</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-white/20 text-white">Performance</TabsTrigger>
          <TabsTrigger value="risks" className="data-[state=active]:bg-white/20 text-white">Risk Alerts</TabsTrigger>
          <TabsTrigger value="strategy" className="data-[state=active]:bg-white/20 text-white">Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Business Units Performance */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Business Unit Performance</CardTitle>
              <CardDescription className="text-slate-300">Division-wise revenue and efficiency metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {businessUnits.map((unit, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{unit.name}</span>
                    <div className="text-right">
                      <span className="text-white">{unit.revenue}</span>
                      <span className="text-green-400 text-sm ml-2">{unit.growth}</span>
                    </div>
                  </div>
                  <Progress value={unit.performance} className="h-2" />
                  <p className="text-slate-400 text-sm">Performance: {unit.performance}%</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-end justify-between space-x-2">
                  {[65, 78, 82, 90, 95, 88, 92].map((height, index) => (
                    <div key={index} className="flex-1 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">AI Model Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Prediction Accuracy</span>
                    <span className="text-white">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-slate-300">Processing Speed</span>
                    <span className="text-white">1.2ms</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                Risk Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {riskAlerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  alert.level === 'High' ? 'bg-red-500/20 border-red-500/50' :
                  alert.level === 'Medium' ? 'bg-yellow-500/20 border-yellow-500/50' :
                  'bg-green-500/20 border-green-500/50'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white font-medium">{alert.type} Risk</span>
                      <p className="text-slate-300 text-sm">{alert.message}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      alert.level === 'High' ? 'bg-red-500 text-white' :
                      alert.level === 'Medium' ? 'bg-yellow-500 text-black' :
                      'bg-green-500 text-white'
                    }`}>
                      {alert.level}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Strategic Initiatives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-white font-medium mb-2">AI Expansion</h4>
                  <p className="text-slate-300 text-sm">Deploy next-gen AI models across all business units</p>
                  <Progress value={75} className="h-2 mt-2" />
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-white font-medium mb-2">Global Market Entry</h4>
                  <p className="text-slate-300 text-sm">Launch in 12 new international markets</p>
                  <Progress value={45} className="h-2 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveDashboard;
