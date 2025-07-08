
import React, { useState } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const AIAdvisor = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const recommendations = [
    {
      type: 'buy',
      asset: 'Real Estate Token Pool A',
      confidence: 92,
      reason: 'Strong market fundamentals and AI-predicted 15% growth',
      impact: 'High',
      timeframe: '6-12 months'
    },
    {
      type: 'hold',
      asset: 'Tech Startup Portfolio',
      confidence: 78,
      reason: 'Volatile market conditions, AI suggests holding position',
      impact: 'Medium',
      timeframe: '3-6 months'
    },
    {
      type: 'rebalance',
      asset: 'Energy Sector Allocation',
      confidence: 85,
      reason: 'Portfolio overweighted, diversification recommended',
      impact: 'Medium',
      timeframe: '1-3 months'
    }
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-lg border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-400" />
              <div>
                <CardTitle className="text-white text-2xl">AI Financial Advisor</CardTitle>
                <CardDescription className="text-slate-300">
                  Powered by Aladdin AI - Real-time portfolio analysis and recommendations
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Portfolio'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Market Sentiment */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
              Market Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400 mb-2">Bullish</div>
            <Progress value={75} className="mb-2" />
            <p className="text-sm text-slate-300">AI confidence: 75%</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400 mb-2">Medium</div>
            <Progress value={45} className="mb-2" />
            <p className="text-sm text-slate-300">Portfolio volatility: 12.3%</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-400 mr-2" />
              AI Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400 mb-2">8.7/10</div>
            <Progress value={87} className="mb-2" />
            <p className="text-sm text-slate-300">Optimization level</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-xl">AI Recommendations</CardTitle>
          <CardDescription className="text-slate-300">
            Personalized insights based on your portfolio and market analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {rec.type === 'buy' && <TrendingUp className="h-5 w-5 text-green-400" />}
                    {rec.type === 'hold' && <CheckCircle className="h-5 w-5 text-blue-400" />}
                    {rec.type === 'rebalance' && <AlertTriangle className="h-5 w-5 text-yellow-400" />}
                    <div>
                      <h4 className="font-semibold text-white capitalize">{rec.type} - {rec.asset}</h4>
                      <p className="text-sm text-slate-300">{rec.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">Confidence: {rec.confidence}%</div>
                    <div className="text-xs text-slate-400">{rec.timeframe}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rec.impact === 'High' ? 'bg-red-900/50 text-red-300' :
                    rec.impact === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' :
                    'bg-green-900/50 text-green-300'
                  }`}>
                    {rec.impact} Impact
                  </span>
                  <Button size="sm" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAdvisor;
