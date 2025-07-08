
import React, { useState } from 'react';
import { Brain, Database, TrendingUp, Zap, BarChart3, PieChart, Activity, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AnalyticsDashboard = () => {
  const [selectedModel, setSelectedModel] = useState('quantum-predictor');

  const mlModels = [
    { 
      id: 'quantum-predictor', 
      name: 'Quantum Predictor', 
      accuracy: 94.2, 
      status: 'active',
      predictions: '2.4M',
      latency: '1.2ms'
    },
    { 
      id: 'risk-analyzer', 
      name: 'Risk Analyzer', 
      accuracy: 89.7, 
      status: 'training',
      predictions: '890K',
      latency: '2.1ms'
    },
    { 
      id: 'market-sentiment', 
      name: 'Market Sentiment', 
      accuracy: 91.8, 
      status: 'active',
      predictions: '1.2M',
      latency: '0.8ms'
    }
  ];

  const dataMetrics = [
    { label: 'Data Points Processed', value: '15.2B', change: '+12.4%', icon: Database },
    { label: 'Model Predictions', value: '4.6M', change: '+18.7%', icon: Brain },
    { label: 'Accuracy Score', value: '92.8%', change: '+2.1%', icon: Target },
    { label: 'Processing Speed', value: '1.1ms', change: '-15.3%', icon: Zap }
  ];

  const analyticsInsights = [
    { 
      category: 'User Behavior', 
      insight: 'Mobile usage increased 45% this quarter',
      confidence: 92,
      impact: 'High'
    },
    { 
      category: 'Market Trends', 
      insight: 'AI-driven investments showing 23% higher returns',
      confidence: 88,
      impact: 'High'
    },
    { 
      category: 'Risk Patterns', 
      insight: 'Correlation detected between market volatility and user engagement',
      confidence: 76,
      impact: 'Medium'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-slate-400">Advanced data analysis and machine learning insights</p>
        </div>
        <div className="flex space-x-2">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            <Brain className="h-4 w-4 mr-2" />
            Train Model
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Data Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dataMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change.startsWith('+');
          return (
            <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{metric.label}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                    <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.change}
                    </p>
                  </div>
                  <Icon className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ML Models Overview */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Machine Learning Models</CardTitle>
          <CardDescription className="text-slate-300">
            Performance metrics for deployed AI models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {mlModels.map((model) => (
              <div 
                key={model.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedModel === model.id 
                    ? 'bg-white/20 border-white/40' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setSelectedModel(model.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{model.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    model.status === 'active' ? 'bg-green-500 text-white' :
                    model.status === 'training' ? 'bg-yellow-500 text-black' :
                    'bg-gray-500 text-white'
                  }`}>
                    {model.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Accuracy</span>
                    <span className="text-white">{model.accuracy}%</span>
                  </div>
                  <Progress value={model.accuracy} className="h-2" />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-400">Predictions</span>
                      <p className="text-white">{model.predictions}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Latency</span>
                      <p className="text-white">{model.latency}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-white/20">
          <TabsTrigger value="insights" className="data-[state=active]:bg-white/20 text-white">AI Insights</TabsTrigger>
          <TabsTrigger value="visualization" className="data-[state=active]:bg-white/20 text-white">Data Viz</TabsTrigger>
          <TabsTrigger value="pipeline" className="data-[state=active]:bg-white/20 text-white">Data Pipeline</TabsTrigger>
          <TabsTrigger value="experiments" className="data-[state=active]:bg-white/20 text-white">Experiments</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-400" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsInsights.map((insight, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 rounded text-xs bg-purple-500 text-white">
                          {insight.category}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          insight.impact === 'High' ? 'bg-red-500 text-white' :
                          insight.impact === 'Medium' ? 'bg-yellow-500 text-black' :
                          'bg-green-500 text-white'
                        }`}>
                          {insight.impact} Impact
                        </span>
                      </div>
                      <p className="text-white text-sm">{insight.insight}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 text-sm">Confidence:</span>
                      <Progress value={insight.confidence} className="h-2 w-24" />
                      <span className="text-white text-sm">{insight.confidence}%</span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Investigate
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Data Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between space-x-2">
                  {[40, 65, 78, 82, 90, 95, 88, 92, 87, 94, 89, 96].map((height, index) => (
                    <div 
                      key={index} 
                      className="flex-1 bg-gradient-to-t from-purple-600 to-pink-600 rounded-t transition-all hover:from-purple-500 hover:to-pink-500" 
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Data Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center h-48">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-8 border-purple-600"></div>
                    <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-cyan-600 border-r-cyan-600 rotate-45"></div>
                    <div className="absolute inset-0 rounded-full border-8 border-transparent border-b-pink-600 border-l-pink-600 -rotate-45"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold">92.8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Data Processing Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-4">
                {['Ingestion', 'Processing', 'Analysis', 'Storage', 'Visualization'].map((stage, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <span className="text-white text-sm mt-2">{stage}</span>
                    <div className="text-green-400 text-xs mt-1">✓ Active</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiments" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">ML Experiments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">Quantum Neural Network</h4>
                      <p className="text-slate-400 text-sm">Testing quantum-enhanced deep learning</p>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400">96.2% accuracy</span>
                      <p className="text-slate-400 text-sm">Running</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">Federated Learning</h4>
                      <p className="text-slate-400 text-sm">Distributed model training</p>
                    </div>
                    <div className="text-right">
                      <span className="text-yellow-400">Training</span>
                      <p className="text-slate-400 text-sm">Phase 2/3</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
